import { Student } from '../models/Student.js';
import { User } from '../models/User.js';

export const getStudentProfile = async (userId) => {
  let student = await Student.findOne({ user: userId }).populate('user', 'name email role');
  if (!student) {
    const user = await User.findById(userId);
    if (!user) throw new Error('User not found');

    student = await Student.create({
      user: user._id,
      name: user.name,
      email: user.email,
    });
  }
  return student;
};

export const updateStudentProfile = async (userId, updateData) => {
  let student = await Student.findOne({ user: userId });
  if (!student) {
    const user = await User.findById(userId);
    student = new Student({
      user: userId,
      name: user?.name || 'Student',
      email: user?.email || '',
    });
  }

  // Update fields
  const allowedFields = [
    'name',
    'branch',
    'year',
    'skills',
    'interests',
    'preferredRoles',
    'availability',
    'bio',
    'projects',
    'experience',
    'githubUrl',
    'linkedinUrl',
    'portfolioUrl',
  ];

  allowedFields.forEach((field) => {
    if (updateData[field] !== undefined) {
      student[field] = updateData[field];
    }
  });

  if (updateData.name) {
    await User.findByIdAndUpdate(userId, { name: updateData.name });
  }

  await student.save();
  return student;
};

export const getStudentById = async (studentId) => {
  const student = await Student.findById(studentId).populate('user', 'name email role');
  if (!student) {
    const error = new Error('Student not found');
    error.statusCode = 404;
    throw error;
  }
  return student;
};

export const getAllStudents = async ({
  search = '',
  branch = '',
  skill = '',
  role = '',
  availability = '',
  page = 1,
  limit = 20,
}) => {
  const filter = {};

  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: 'i' } },
      { bio: { $regex: search, $options: 'i' } },
      { skills: { $regex: search, $options: 'i' } },
    ];
  }

  if (branch) {
    filter.branch = { $regex: branch, $options: 'i' };
  }

  if (skill) {
    filter.skills = { $in: [new RegExp(`^${skill}$`, 'i')] };
  }

  if (role) {
    filter.preferredRoles = { $in: [new RegExp(`^${role}$`, 'i')] };
  }

  if (availability) {
    filter.availability = availability;
  }

  const skip = (page - 1) * limit;

  const [students, total] = await Promise.all([
    Student.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('user', 'name email'),
    Student.countDocuments(filter),
  ]);

  return {
    students,
    total,
    page,
    pages: Math.ceil(total / limit),
  };
};
