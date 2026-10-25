import { readFile } from 'node:fs/promises';
import mongoose from 'mongoose';
import { ENV } from '../src/config/env.js';
import { User } from '../src/models/User.js';
import { Student } from '../src/models/Student.js';
import { Room } from '../src/models/Room.js';
import { RoomUpdate } from '../src/models/RoomUpdate.js';
import { Application } from '../src/models/Application.js';
import { Invitation } from '../src/models/Invitation.js';
import { Notification } from '../src/models/Notification.js';

if (ENV.NODE_ENV === 'production') throw new Error('Fixture loading is disabled in production.');
if (process.env.ALLOW_FIXTURE_SEED !== 'true') {
  throw new Error('Set ALLOW_FIXTURE_SEED=true to load development fixture records.');
}

const fixturePath = (name) => new URL(`../data/fixtures/${name}.json`, import.meta.url);
const loadJson = async (name) => JSON.parse(await readFile(fixturePath(name), 'utf8'));
const userIds = new Map();
const studentIds = new Map();
const roomIds = new Map();
const objectId = (id) => new mongoose.Types.ObjectId(id);

try {
  const [users, students, rooms, roomUpdates, applications, invitations, notifications] = await Promise.all([
    loadJson('users'), loadJson('students'), loadJson('rooms'), loadJson('roomUpdates'),
    loadJson('applications'), loadJson('invitations'), loadJson('notifications'),
  ]);

  const modelsAndFixtures = [
    [User, users], [Student, students], [Room, rooms], [RoomUpdate, roomUpdates],
    [Application, applications], [Invitation, invitations], [Notification, notifications],
  ];
  for (const [Model, records] of modelsAndFixtures) {
    if (records.length > 30) throw new Error(`${Model.collection.collectionName} has more than 30 fixture records.`);
  }

  await mongoose.connect(ENV.MONGO_URI);

  const [fixtureUsersById, usersWithFixtureEmails] = await Promise.all([
    User.find({ _id: { $in: users.map((fixture) => objectId(fixture.id)) } }).select('_id email').lean(),
    User.find({ email: { $in: users.map((fixture) => fixture.email) } }).select('_id email').lean(),
  ]);
  const fixtureIds = new Set(users.map((fixture) => fixture.id));
  const existingFixtureUsersById = new Map(fixtureUsersById.map((user) => [user._id.toString(), user]));
  for (const user of usersWithFixtureEmails) {
    if (!fixtureIds.has(user._id.toString())) {
      throw new Error(`Refusing to claim an email already owned by another account: ${user.email}.`);
    }
  }
  for (const fixture of users) {
    const existing = existingFixtureUsersById.get(fixture.id);
    const isPrimaryAccount = fixture.email === 'sanju@mail.com';
    const isLegacyFixtureEmail = existing && /^member\d{2}@teamup\.test$/.test(existing.email);
    if (existing && !isPrimaryAccount && existing.email !== fixture.email && !isLegacyFixtureEmail) {
      throw new Error(`Refusing to rename an account with an unexpected email: ${existing.email}.`);
    }
  }

  for (const fixture of users) {
    const fixtureObjectId = objectId(fixture.id);
    const [existingByEmail, existingById] = await Promise.all([
      User.findOne({ email: fixture.email }),
      User.findById(fixtureObjectId),
    ]);
    if (existingByEmail && existingByEmail._id.toString() !== fixture.id) {
      throw new Error(`Refusing to claim an email already owned by another account: ${fixture.email}.`);
    }
    if (existingById) {
      const isPrimaryAccount = fixture.email === 'sanju@mail.com';
      const isLegacyFixtureEmail = /^member\d{2}@teamup\.test$/.test(existingById.email);
      if (!isPrimaryAccount && existingById.email !== fixture.email && !isLegacyFixtureEmail) {
        throw new Error(`Refusing to rename an account with an unexpected email: ${existingById.email}.`);
      }
      if (!isPrimaryAccount) {
        existingById.name = fixture.name;
        existingById.email = fixture.email;
        existingById.role = fixture.role;
      }
      existingById.passwordHash = fixture.passwordHash;
      await existingById.save();
      userIds.set(fixture.email, existingById._id);
    } else {
      const created = await User.create({
        _id: fixtureObjectId,
        name: fixture.name,
        email: fixture.email,
        role: fixture.role,
        passwordHash: fixture.passwordHash,
      });
      userIds.set(fixture.email, created._id);
    }
  }

  for (const fixture of students) {
    const user = userIds.get(fixture.userEmail);
    if (!user) throw new Error(`Unknown fixture user: ${fixture.userEmail}`);
    const studentData = {
      user,
      name: fixture.name,
      email: fixture.email,
      branch: fixture.branch,
      year: fixture.year,
      skills: fixture.skills,
      interests: fixture.interests,
      preferredRoles: fixture.preferredRoles,
      availability: fixture.availability,
      bio: fixture.bio,
      projects: fixture.projects,
      experience: fixture.experience,
    };
    let student = await Student.findOne({ user });
    if (!student) {
      student = await Student.create({ _id: objectId(fixture.id), ...studentData });
    } else if (student.name !== fixture.name || student.email !== fixture.email) {
      student.name = fixture.name;
      student.email = fixture.email;
      await student.save();
    }
    studentIds.set(fixture.userEmail, student._id);
    await User.updateOne({ _id: user }, { $set: { student: student._id } });
  }

  for (const fixture of rooms) {
    const host = userIds.get(fixture.hostEmail);
    const hostStudent = studentIds.get(fixture.hostStudentEmail);
    const members = fixture.members.map((member) => ({
      user: userIds.get(member.userEmail),
      student: studentIds.get(member.studentEmail),
      role: member.role,
      joinedAt: new Date(member.joinedAt),
    }));
    if (!host || !hostStudent || members.some((member) => !member.user || !member.student)) {
      throw new Error(`Room fixture has an unresolved user/student reference: ${fixture.key}`);
    }
    const roomData = {
      name: fixture.name,
      description: fixture.description,
      type: fixture.type,
      host,
      hostStudent,
      capacity: fixture.capacity,
      members,
      requiredBranches: fixture.requiredBranches,
      requiredSkills: fixture.requiredSkills,
      requiredRoles: fixture.requiredRoles,
      deadline: new Date(fixture.deadline),
      startDate: new Date(fixture.startDate),
      endDate: new Date(fixture.endDate),
      status: fixture.status,
      autoAccept: fixture.autoAccept,
      typeDetails: fixture.typeDetails,
    };
    const id = objectId(fixture.id);
    const existing = await Room.findById(id);
    const knownFixtureRoom = existing && (existing.name.startsWith('[Fixture] ') || existing.name === fixture.name);
    if (existing && (!knownFixtureRoom || existing.host.toString() !== host.toString())) {
      throw new Error(`Refusing to overwrite non-fixture room ${id}.`);
    }
    await Room.findOneAndUpdate({ _id: id }, { $set: roomData }, { upsert: true, returnDocument: 'after', runValidators: true });
    roomIds.set(fixture.key, id);
  }

  const upsertFixture = async (Model, fixture, data) => {
    const id = objectId(fixture.id);
    await Model.findOneAndUpdate({ _id: id }, { $set: data }, { upsert: true, returnDocument: 'after', runValidators: true });
  };

  for (const fixture of roomUpdates) {
    const room = roomIds.get(fixture.roomKey);
    const author = userIds.get(fixture.authorEmail);
    if (!room || !author) throw new Error(`Room update has an unresolved reference: ${fixture.id}`);
    await upsertFixture(RoomUpdate, fixture, { room, author, title: fixture.title, content: fixture.content, type: fixture.type, pinned: fixture.pinned });
  }
  for (const fixture of applications) {
    const room = roomIds.get(fixture.roomKey);
    const user = userIds.get(fixture.userEmail);
    const student = studentIds.get(fixture.studentEmail);
    if (!room || !user || !student) throw new Error(`Application has an unresolved reference: ${fixture.id}`);
    await upsertFixture(Application, fixture, { room, user, student, message: fixture.message, requestedRole: fixture.requestedRole, status: fixture.status, reviewedAt: null, reviewerFeedback: '' });
  }
  for (const fixture of invitations) {
    const room = roomIds.get(fixture.roomKey);
    const student = studentIds.get(fixture.studentEmail);
    const invitedBy = userIds.get(fixture.invitedByEmail);
    if (!room || !student || !invitedBy) throw new Error(`Invitation has an unresolved reference: ${fixture.id}`);
    await upsertFixture(Invitation, fixture, { room, student, invitedBy, role: fixture.role, message: fixture.message, status: fixture.status, respondedAt: null });
  }
  for (const fixture of notifications) {
    const recipient = userIds.get(fixture.recipientEmail);
    const sender = userIds.get(fixture.senderEmail);
    const room = roomIds.get(fixture.roomKey);
    if (!recipient || !sender || !room) throw new Error(`Notification has an unresolved reference: ${fixture.id}`);
    await upsertFixture(Notification, fixture, { recipient, sender, type: fixture.type, title: fixture.title, message: fixture.message, link: fixture.link.replace(rooms.find((item) => item.key === fixture.roomKey).id, room.toString()), read: fixture.read, room });
  }

  const currentUser = await User.findOne({ email: 'sanju@mail.com' }).select('_id');
  const currentStudent = await Student.findOne({ user: currentUser._id }).select('_id');
  const [totals, currentRooms, currentApplications, currentInvitations, currentNotifications] = await Promise.all([
    Promise.all([User, Student, Room, RoomUpdate, Application, Invitation, Notification].map((Model) => Model.countDocuments())),
    Room.countDocuments({ $or: [{ host: currentUser._id }, { 'members.user': currentUser._id }] }),
    Application.countDocuments({ user: currentUser._id }),
    Invitation.countDocuments({ student: currentStudent?._id }),
    Notification.countDocuments({ recipient: currentUser._id }),
  ]);
  console.log('Fixtures loaded (no existing untagged rooms or accounts were deleted).');
  console.log(`Collections (users, students, rooms, updates, applications, invitations, notifications): ${totals.join(', ')}`);
  console.log(`sanju@mail.com now has ${currentRooms} rooms/teams, ${currentApplications} applications, ${currentInvitations} invitations, and ${currentNotifications} notifications.`);
  console.log(`Login: sanju@mail.com / the shared local fixture password`);
  console.log('Fixture cleanup uses the deterministic IDs in the JSON files.');
} finally {
  await mongoose.disconnect();
}
