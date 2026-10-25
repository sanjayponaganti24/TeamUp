import bcrypt from 'bcryptjs';
import { mkdir, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const scriptDir = dirname(fileURLToPath(import.meta.url));
const outputDir = resolve(scriptDir, '../data/fixtures');
const sharedPassword = process.env.TEAMUP_FIXTURE_PASSWORD;

if (!sharedPassword || sharedPassword.length < 6) {
  throw new Error('Set TEAMUP_FIXTURE_PASSWORD to the shared local fixture password (minimum 6 characters).');
}

const people = [
  ['Sanjay Ponaganti', 'sanju@mail.com'],
  ['Arya Stark'], ['Jon Snow'], ['Daenerys Targaryen'], ['Tyrion Lannister'], ['Sansa Stark'],
  ['Cersei Lannister'], ['Jaime Lannister'], ['Rhaenyra Targaryen'], ['Daemon Targaryen'], ['Alicent Hightower'],
  ['Aemond Targaryen'], ['Eleven'], ['Mike Wheeler'], ['Dustin Henderson'], ['Max Mayfield'],
  ['Steve Harrington'], ['Jonas Kahnwald'], ['Martha Nielsen'], ['Boruto Uzumaki'], ['Sarada Uchiha'],
  ['Mitsuki'], ['Naruto Uzumaki'], ['Monkey D. Luffy'], ['Roronoa Zoro'], ['Nami'],
  ['Nico Robin'], ['Mikasa Ackerman'], ['Levi Ackerman'], ['Peter Parker'],
].map(([name, email]) => ({
  name,
  email: email || `${name.split(' ')[0].toLowerCase()}@mail.com`,
}));

const branches = [
  'Computer Science and Engineering',
  'Information Technology',
  'Electronics & Communication (ECE)',
  'Artificial Intelligence & Data Science',
  'Mechanical Engineering',
];
const skills = [
  ['React', 'UI Design', 'Figma'],
  ['Node.js', 'MongoDB', 'REST APIs'],
  ['Python', 'Machine Learning', 'Data Analysis'],
  ['Java', 'Algorithms', 'Problem Solving'],
  ['TypeScript', 'Cloud', 'Testing'],
  ['Research', 'Writing', 'Statistics'],
];
const roles = ['Frontend Developer', 'Backend Developer', 'Product Designer', 'Data Scientist', 'Researcher', 'Team Lead'];
const types = ['HACKATHON', 'PERSONAL_PROJECT', 'CLUB', 'RESEARCH', 'COMPETITION', 'OTHER'];
const statuses = [
  ...Array(16).fill('OPEN'),
  ...Array(3).fill('FULL'),
  ...Array(4).fill('IN_PROGRESS'),
  ...Array(3).fill('COMPLETED'),
  ...Array(2).fill('EXPIRED'),
  'DRAFT', 'CANCELLED',
];
const roomNames = [
  'Campus AI Sprint', 'Smart India Hackathon Builders', 'Accessible Campus Navigator', 'Green Campus Research Lab',
  'Open Source Study Planner', 'Student Founder Circle', 'Climate Data Challenge', 'Community Health Dashboard',
  'Robotics Research Collective', 'Design Systems Club', 'FinTech Weekend Build', 'Women in Computing Network',
  'Assistive Reading Companion', 'Campus Event Discovery', 'Applied ML Reading Group', 'Local Language Learning App',
  'Sustainable Mobility Study', 'Cybersecurity Capture the Flag', 'Digital Heritage Archive', 'Peer Tutoring Platform',
  'Clean Energy Innovation Team', 'Open Data Visualization', 'Student Wellness Research', 'Creative Coding Club',
  'Placement Prep Toolkit', 'Smart Irrigation Prototype', 'Research Paper Companion', 'Campus Makers Collective',
  'Inclusive Learning Workspace', 'Intercollege Project Showcase',
];

const idFor = (key) => createHash('sha256').update(`teamup-fixture:${key}`).digest('hex').slice(0, 24);
const now = new Date();
const fixtureBaseDate = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate());
const day = (offset) => new Date(fixtureBaseDate + offset * 24 * 60 * 60 * 1000).toISOString();
const passwordHash = await bcrypt.hash(sharedPassword, 12);

const users = people.map((person, index) => ({
  id: idFor(`user:${person.email}`),
  name: person.name,
  email: person.email,
  role: 'student',
  passwordHash,
}));

const students = people.map((person, index) => ({
  id: idFor(`student:${person.email}`),
  userEmail: person.email,
  name: person.name,
  email: person.email,
  branch: branches[index % branches.length],
  year: (index % 5) + 1,
  skills: skills[index % skills.length],
  interests: ['building useful products', 'collaborative projects', 'student communities'],
  preferredRoles: [roles[index % roles.length]],
  availability: index % 7 === 0 ? 'WAITING' : 'AVAILABLE',
  bio: `${person.name.split(' ')[0]} enjoys learning by building with a team.`,
  projects: [],
  experience: [],
}));

const rooms = roomNames.map((name, index) => {
  const hostIndex = index % 24;
  const host = people[hostIndex];
  const memberIndexes = [...new Set([hostIndex, (hostIndex + 1) % 24, (hostIndex + 2) % 24])];
  if (index === 0) memberIndexes.push(3);
  const capacity = Math.max(4, memberIndexes.length + 1);
  const status = statuses[index];
  const deadlineOffset = ['IN_PROGRESS', 'COMPLETED', 'EXPIRED'].includes(status) ? -3 : index === 0 ? 3 : 30 + index;
  const startOffset = status === 'IN_PROGRESS' ? -10 + index - 19
    : status === 'COMPLETED' ? -30 + index - 23
      : status === 'EXPIRED' ? -60 + index - 26
        : 5 + index;
  const endOffset = status === 'COMPLETED' ? -5 + index - 23
    : status === 'EXPIRED' ? -20 + index - 26
      : 45 + index;
  return {
    key: `room-${String(index + 1).padStart(2, '0')}`,
    id: idFor(`room:${index}`),
    name,
    description: `A student-led ${types[index % types.length].replaceAll('_', ' ').toLowerCase()} team building and learning together.`,
    type: types[index % types.length],
    hostEmail: host.email,
    hostStudentEmail: host.email,
    capacity,
    members: memberIndexes.map((memberIndex, memberPosition) => ({
      userEmail: people[memberIndex].email,
      studentEmail: people[memberIndex].email,
      role: memberPosition === 0 ? 'Host / Team Lead' : roles[(index + memberPosition) % roles.length],
      joinedAt: day(-20 + index + memberPosition),
    })),
    requiredBranches: [branches[index % branches.length]],
    requiredSkills: skills[index % skills.length].slice(0, 2),
    requiredRoles: [roles[(index + 1) % roles.length]],
    deadline: day(deadlineOffset),
    startDate: day(startOffset),
    endDate: day(endOffset),
    status,
    autoAccept: false,
    typeDetails: {},
  };
});

const roomUpdates = rooms.map((room, index) => ({
  id: idFor(`room-update:${index}`),
  roomKey: room.key,
  authorEmail: room.hostEmail,
  title: ['Kickoff and goals', 'Weekly progress update', 'Next steps for the team'][index % 3],
  content: `The team reviewed progress, shared feedback, and agreed on the next milestone for ${room.name}.`,
  type: ['UPDATE', 'MILESTONE', 'ANNOUNCEMENT', 'ACTIVITY'][index % 4],
  pinned: index % 10 === 0,
}));

const applicationStatuses = ['PENDING', 'ACCEPTED', 'REJECTED', 'CANCELLED'];
const applications = Array.from({ length: 30 }, (_, index) => {
  const room = index === 4 ? rooms[0] : rooms[(index % 16) + 1];
  const currentMemberEmails = new Set(room.members.map((member) => member.userEmail));
  let applicantIndex = index === 0 ? 0 : (index + 4) % 24;
  while (currentMemberEmails.has(people[applicantIndex].email)) applicantIndex = (applicantIndex + 1) % 24;
  const applicant = people[applicantIndex];
  const status = index === 0 ? 'PENDING' : applicationStatuses[index % applicationStatuses.length];
  if (status === 'ACCEPTED') {
    room.members.push({ userEmail: applicant.email, studentEmail: applicant.email, role: roles[index % roles.length], joinedAt: day(-index) });
    room.capacity = Math.max(room.capacity, room.members.length);
    if (room.members.length >= room.capacity && room.status === 'OPEN') room.status = 'FULL';
  }
  return {
    id: idFor(`application:${index}`),
    roomKey: room.key,
    userEmail: index === 0 ? people[0].email : applicant.email,
    studentEmail: index === 0 ? people[0].email : applicant.email,
    message: index === 0 ? 'I would like to contribute my skills and collaborate with the team.' : 'I am interested in contributing to this project.',
    requestedRole: roles[index % roles.length],
    status,
    createdAt: day(-index),
  };
});

const invitationStatuses = ['PENDING', 'ACCEPTED', 'DECLINED', 'CANCELLED'];
const invitations = Array.from({ length: 30 }, (_, index) => {
  const room = rooms[((index + 1) % 16) + 1];
  const hostIndex = people.findIndex((person) => person.email === room.hostEmail);
  const currentMemberEmails = new Set(room.members.map((member) => member.userEmail));
  let candidateIndex = index === 0 ? 0 : (hostIndex + 5 + index) % 24;
  while (currentMemberEmails.has(people[candidateIndex].email)) candidateIndex = (candidateIndex + 1) % 24;
  const invited = people[candidateIndex];
  const status = index === 0 ? 'PENDING' : invitationStatuses[index % invitationStatuses.length];
  if (status === 'ACCEPTED') {
    room.members.push({ userEmail: invited.email, studentEmail: invited.email, role: roles[index % roles.length], joinedAt: day(-index) });
    room.capacity = Math.max(room.capacity, room.members.length);
    if (room.members.length >= room.capacity && room.status === 'OPEN') room.status = 'FULL';
  }
  return {
    id: idFor(`invitation:${index}`),
    roomKey: room.key,
    studentEmail: invited.email,
    invitedByEmail: room.hostEmail,
    role: roles[index % roles.length],
    message: 'Your interests and skills look like a strong fit for this team.',
    status,
    createdAt: day(-index),
  };
});

for (const room of rooms) {
  if (room.status === 'FULL') room.capacity = room.members.length;
}
rooms[0].deadline = day(3);

const pendingApplications = applications.filter((application) => application.status === 'PENDING');
const acceptedApplications = applications.filter((application) => application.status === 'ACCEPTED');
const pendingInvitations = invitations.filter((invitation) => invitation.status === 'PENDING');
const acceptedInvitations = invitations.filter((invitation) => invitation.status === 'ACCEPTED');
const notificationEvents = {
  JOIN_REQUEST: pendingApplications.map((application) => ({ type: 'JOIN_REQUEST', roomKey: application.roomKey, senderEmail: application.userEmail, recipientEmail: rooms.find((room) => room.key === application.roomKey).hostEmail })),
  REQUEST_ACCEPTED: acceptedApplications.map((application) => ({ type: 'REQUEST_ACCEPTED', roomKey: application.roomKey, senderEmail: rooms.find((room) => room.key === application.roomKey).hostEmail, recipientEmail: application.userEmail })),
  INVITATION: pendingInvitations.map((invitation) => ({ type: 'INVITATION', roomKey: invitation.roomKey, senderEmail: invitation.invitedByEmail, recipientEmail: invitation.studentEmail })),
  MEMBER_JOINED: acceptedInvitations.map((invitation) => ({ type: 'MEMBER_JOINED', roomKey: invitation.roomKey, senderEmail: invitation.studentEmail, recipientEmail: invitation.invitedByEmail })),
  ROOM_UPDATE: roomUpdates.map((update) => {
    const room = rooms.find((item) => item.key === update.roomKey);
    const recipient = room.members.find((member) => member.userEmail !== update.authorEmail)?.userEmail || room.hostEmail;
    return { type: 'ROOM_UPDATE', roomKey: room.key, senderEmail: update.authorEmail, recipientEmail: recipient };
  }),
  DEADLINE_WARNING: [{ type: 'DEADLINE_WARNING', roomKey: rooms[0].key, senderEmail: rooms[0].hostEmail, recipientEmail: rooms[0].members.find((member) => member.userEmail !== rooms[0].hostEmail).userEmail }],
};
const eventCopy = {
  JOIN_REQUEST: ['New join request', (room, sender) => `${sender.name} asked to join ${room.name}.`],
  REQUEST_ACCEPTED: ['Application accepted', (room) => `Your application to ${room.name} was accepted.`],
  INVITATION: ['Team invitation', (room, sender) => `${sender.name} invited you to join ${room.name}.`],
  MEMBER_JOINED: ['New teammate', (room, sender) => `${sender.name} joined ${room.name}.`],
  ROOM_UPDATE: ['Room update', (room, sender) => `${sender.name} posted an update in ${room.name}.`],
  DEADLINE_WARNING: ['Deadline approaching', (room) => `${room.name} is accepting applications until ${new Date(room.deadline).toLocaleDateString('en-US', { timeZone: 'UTC' })}.`],
};
const userByEmail = new Map(people.map((person) => [person.email, person]));
const notificationTypes = Object.keys(notificationEvents);
const notifications = Array.from({ length: 30 }, (_, index) => {
  const type = notificationTypes[index % notificationTypes.length];
  const events = notificationEvents[type];
  const event = events[Math.floor(index / notificationTypes.length) % events.length];
  const room = rooms.find((item) => item.key === event.roomKey);
  const [title, messageFor] = eventCopy[event.type];
  return {
    id: idFor(`notification:${index}`),
    recipientEmail: event.recipientEmail,
    senderEmail: event.senderEmail,
    type: event.type,
    title,
    message: messageFor(room, userByEmail.get(event.senderEmail)),
    link: `/rooms/${room.id}`,
    read: index % 3 === 0,
    roomKey: room.key,
  };
});

const modules = { users, students, rooms, roomUpdates, applications, invitations, notifications };
await mkdir(outputDir, { recursive: true });
for (const [moduleName, records] of Object.entries(modules)) {
  if (records.length > 30) throw new Error(`${moduleName} exceeds the 30-record fixture limit.`);
  await writeFile(resolve(outputDir, `${moduleName}.json`), `${JSON.stringify(records, null, 2)}\n`, 'utf8');
}

console.log(`Generated ${Object.entries(modules).map(([name, records]) => `${name}: ${records.length}`).join(', ')} in backend/data/fixtures.`);
