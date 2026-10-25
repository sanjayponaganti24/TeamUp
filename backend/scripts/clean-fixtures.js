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

if (ENV.NODE_ENV === 'production') throw new Error('Fixture cleanup is disabled in production.');
if (process.env.ALLOW_FIXTURE_CLEANUP !== 'true') {
  throw new Error('Set ALLOW_FIXTURE_CLEANUP=true to remove only records listed in the fixture JSON files.');
}

const loadJson = async (name) => JSON.parse(await readFile(new URL(`../data/fixtures/${name}.json`, import.meta.url), 'utf8'));
const toIds = (records) => records.map((record) => new mongoose.Types.ObjectId(record.id));

try {
  const [users, students, rooms, roomUpdates, applications, invitations, notifications] = await Promise.all([
    loadJson('users'), loadJson('students'), loadJson('rooms'), loadJson('roomUpdates'),
    loadJson('applications'), loadJson('invitations'), loadJson('notifications'),
  ]);
  await mongoose.connect(ENV.MONGO_URI);

  await RoomUpdate.deleteMany({ _id: { $in: toIds(roomUpdates) } });
  await Application.deleteMany({ _id: { $in: toIds(applications) } });
  await Invitation.deleteMany({ _id: { $in: toIds(invitations) } });
  await Notification.deleteMany({ _id: { $in: toIds(notifications) } });
  await Room.deleteMany({ _id: { $in: toIds(rooms) } });

  const syntheticUsers = users.filter((user) => user.email.endsWith('@teamup.test'));
  const syntheticUserIds = toIds(syntheticUsers);
  await Student.deleteMany({ _id: { $in: toIds(students.filter((student) => student.userEmail.endsWith('@teamup.test'))) } });
  await User.deleteMany({ _id: { $in: syntheticUserIds }, email: { $regex: /@teamup\.test$/ } });

  console.log('Removed only fixture IDs from the JSON files. sanju@mail.com and untagged records were preserved.');
} finally {
  await mongoose.disconnect();
}
