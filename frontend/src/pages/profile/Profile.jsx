import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  GraduationCap,
  Mail,
  MapPin,
  Calendar,
  ExternalLink,
  Edit3,
  Briefcase,
  Code2,
  Sparkles,
  Plus,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';

const Profile = () => {
  const { user, student } = useAuth();
  const [activeTab, setActiveTab] = useState('about');

  const getAvailabilityBadge = (status) => {
    switch (status) {
      case 'AVAILABLE':
        return { label: 'Available', bg: 'bg-emerald-50 text-emerald-700 border-emerald-200' };
      case 'WAITING':
        return { label: 'Waiting', bg: 'bg-amber-50 text-amber-700 border-amber-200' };
      default:
        return { label: 'Hold', bg: 'bg-slate-100 text-slate-700 border-slate-200' };
    }
  };

  const avail = getAvailabilityBadge(student?.availability);

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-fade-in">
      {/* Profile Header Card */}
      <div className="bg-white rounded-3xl border border-slate-100 p-6 sm:p-8 shadow-xs relative">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-4 sm:space-x-6">
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-linear-to-tr from-blue-600 to-indigo-500 text-white font-black text-3xl flex items-center justify-center shadow-md shadow-blue-500/20 ring-4 ring-slate-50">
              {user?.name ? user.name.charAt(0).toUpperCase() : 'S'}
            </div>
            <div>
              <div className="flex items-center space-x-3">
                <h1 className="text-xl sm:text-2xl font-bold text-slate-900">{user?.name}</h1>
                <span
                  className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border ${avail.bg}`}
                >
                  {avail.label}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-500 flex items-center space-x-1.5 mt-1 font-medium">
                <GraduationCap className="w-4 h-4 text-slate-400" />
                <span>
                  {student?.branch} • Year {student?.year || 2}
                </span>
              </p>
              <p className="text-xs text-slate-400 flex items-center space-x-1.5 mt-1">
                <Mail className="w-3.5 h-3.5" />
                <span>{user?.email}</span>
              </p>
            </div>
          </div>

          <Link
            to="/profile/edit"
            className="inline-flex items-center space-x-1.5 px-4 py-2.5 bg-blue-50 hover:bg-blue-100 text-blue-600 font-semibold rounded-xl text-xs transition-colors"
          >
            <Edit3 className="w-4 h-4" />
            <span>Edit Profile</span>
          </Link>
        </div>

        {/* Navigation Tabs (Screen 7 from Reference) */}
        <div className="flex items-center space-x-2 border-b border-slate-100 mt-8 pt-2 overflow-x-auto text-xs font-semibold">
          {[
            { id: 'about', label: 'About Me' },
            { id: 'projects', label: `Projects (${student?.projects?.length || 0})` },
            { id: 'skills', label: `Skills (${student?.skills?.length || 0})` },
            { id: 'interests', label: `Interests (${student?.interests?.length || 0})` },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`pb-3 px-4 border-b-2 transition-colors whitespace-nowrap cursor-pointer ${
                activeTab === tab.id
                  ? 'border-blue-600 text-blue-600 font-bold'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content Panels */}
      {activeTab === 'about' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 bg-white rounded-3xl border border-slate-100 p-6 shadow-xs space-y-6">
            <div>
              <h3 className="text-sm font-bold text-slate-900 mb-2">Bio</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {student?.bio ||
                  'Passionate about building innovative solutions and working in collaborative teams. Eager to learn new technologies and solve real-world problems.'}
              </p>
            </div>

            <div>
              <h3 className="text-sm font-bold text-slate-900 mb-2">Target Preferred Roles</h3>
              {student?.preferredRoles && student.preferredRoles.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {student.preferredRoles.map((role, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 bg-blue-50 text-blue-700 rounded-lg text-xs font-semibold border border-blue-100"
                    >
                      {role}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-400">No preferred roles set yet.</p>
              )}
            </div>

            {/* Experience timeline */}
            <div>
              <h3 className="text-sm font-bold text-slate-900 mb-3">Experience</h3>
              {student?.experience && student.experience.length > 0 ? (
                <div className="space-y-3">
                  {student.experience.map((exp, i) => (
                    <div key={i} className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100">
                      <h4 className="text-xs font-bold text-slate-900">{exp.title}</h4>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        {exp.organization} • {exp.duration}
                      </p>
                      {exp.description && (
                        <p className="text-xs text-slate-600 mt-1.5">{exp.description}</p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-400">No experience items added yet.</p>
              )}
            </div>
          </div>

          {/* Quick info column */}
          <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900">Student Info</h3>
            <div className="space-y-3 text-xs">
              <div className="flex items-center space-x-2 text-slate-600">
                <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
                <span>Bangalore, India</span>
              </div>
              <div className="flex items-center space-x-2 text-slate-600">
                <Calendar className="w-4 h-4 text-slate-400 shrink-0" />
                <span>Joined TeamUp in 2026</span>
              </div>
              {student?.githubUrl && (
                <a
                  href={student.githubUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center space-x-2 text-blue-600 hover:underline"
                >
                  <ExternalLink className="w-4 h-4 shrink-0" />
                  <span>GitHub Profile</span>
                </a>
              )}
              {student?.linkedinUrl && (
                <a
                  href={student.linkedinUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center space-x-2 text-blue-600 hover:underline"
                >
                  <ExternalLink className="w-4 h-4 shrink-0" />
                  <span>LinkedIn Profile</span>
                </a>
              )}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'projects' && (
        <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900">Portfolio Projects</h3>
            <Link
              to="/profile/projects"
              className="inline-flex items-center space-x-1 text-xs font-semibold text-blue-600 hover:text-blue-700"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Manage Projects</span>
            </Link>
          </div>
          {student?.projects && student.projects.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {student.projects.map((proj, idx) => (
                <div key={idx} className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <h4 className="text-sm font-bold text-slate-900">{proj.title}</h4>
                  <p className="text-xs text-slate-500 mt-1">{proj.description}</p>
                  {proj.link && (
                    <a
                      href={proj.link}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-2 inline-flex items-center space-x-1 text-xs text-blue-600 font-medium hover:underline"
                    >
                      <span>View Repository</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-xs text-slate-400">
              No projects added yet.{' '}
              <Link to="/profile/projects" className="text-blue-600 font-semibold underline">
                Add your first project
              </Link>
            </div>
          )}
        </div>
      )}

      {activeTab === 'skills' && (
        <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900">My Skills</h3>
            <Link
              to="/profile/skills"
              className="inline-flex items-center space-x-1 text-xs font-semibold text-blue-600 hover:text-blue-700"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add / Edit Skills</span>
            </Link>
          </div>
          {student?.skills && student.skills.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {student.skills.map((skill, i) => (
                <span
                  key={i}
                  className="px-3 py-1.5 bg-blue-50 text-blue-700 text-xs font-semibold rounded-xl border border-blue-100"
                >
                  {skill}
                </span>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-xs text-slate-400">
              No skills added yet.{' '}
              <Link to="/profile/skills" className="text-blue-600 font-semibold underline">
                Add skills now
              </Link>
            </div>
          )}
        </div>
      )}

      {activeTab === 'interests' && (
        <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900">My Interests</h3>
            <Link
              to="/profile/interests"
              className="inline-flex items-center space-x-1 text-xs font-semibold text-blue-600 hover:text-blue-700"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add / Edit Interests</span>
            </Link>
          </div>
          {student?.interests && student.interests.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {student.interests.map((interest, i) => (
                <span
                  key={i}
                  className="px-3 py-1.5 bg-purple-50 text-purple-700 text-xs font-semibold rounded-xl border border-purple-100"
                >
                  {interest}
                </span>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-xs text-slate-400">
              No interests added yet.{' '}
              <Link to="/profile/interests" className="text-blue-600 font-semibold underline">
                Add interests now
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Profile;
