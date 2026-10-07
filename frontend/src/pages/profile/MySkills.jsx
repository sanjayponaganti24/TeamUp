import React, { useState } from 'react';
import { Plus, X, Sparkles } from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';
import * as studentApi from '../../services/api/student-api.js';

const MySkills = () => {
  const { student, setStudent } = useAuth();
  const [newSkill, setNewSkill] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const skills = student?.skills || [];

  const handleAddSkill = async (e) => {
    e.preventDefault();
    const trimmed = newSkill.trim();
    if (!trimmed || skills.includes(trimmed)) return;

    setIsSaving(true);
    const updated = [...skills, trimmed];

    try {
      const res = await studentApi.updateProfile({ skills: updated });
      if (res.success && res.data) {
        setStudent(res.data);
        setNewSkill('');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleRemoveSkill = async (skillToRemove) => {
    const updated = skills.filter((s) => s !== skillToRemove);
    try {
      const res = await studentApi.updateProfile({ skills: updated });
      if (res.success && res.data) {
        setStudent(res.data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const suggestedSkills = [
    'React',
    'Node.js',
    'Python',
    'JavaScript',
    'TypeScript',
    'MongoDB',
    'Express',
    'Tailwind CSS',
    'PostgreSQL',
    'Next.js',
    'Machine Learning',
    'Docker',
    'Figma',
    'UI/UX Design',
    'Git',
    'Data Structures',
  ];

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">My Skills</h1>
          <p className="text-xs text-slate-500 mt-1">
            Skills are used by our matching engine to connect you with top-fit project rooms
          </p>
        </div>
      </div>

      {/* Add Skill Input Form */}
      <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-xs space-y-4">
        <form onSubmit={handleAddSkill} className="flex gap-2">
          <input
            type="text"
            value={newSkill}
            onChange={(e) => setNewSkill(e.target.value)}
            placeholder="Type a skill (e.g. React, Python, UI Design)..."
            className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 outline-none focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
          />
          <button
            type="submit"
            disabled={isSaving || !newSkill.trim()}
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl text-xs shadow-xs transition-colors flex items-center space-x-1.5 disabled:opacity-50 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Skill</span>
          </button>
        </form>

        {/* Current Active Skills */}
        <div>
          <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
            Active Skills ({skills.length})
          </h3>
          {skills.length === 0 ? (
            <p className="text-xs text-slate-400">No skills added yet. Add one above or select from suggestions!</p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {skills.map((skill, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-blue-50 text-blue-700 text-xs font-semibold rounded-xl border border-blue-100 shadow-2xs"
                >
                  <span>{skill}</span>
                  <button
                    onClick={() => handleRemoveSkill(skill)}
                    className="hover:text-rose-600 hover:bg-blue-100 rounded-full p-0.5 transition-colors cursor-pointer"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Suggested Skills */}
      <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-xs space-y-3">
        <div className="flex items-center space-x-2 text-xs font-bold text-slate-700">
          <Sparkles className="w-4 h-4 text-blue-600" />
          <span>Popular Skills Suggestions</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {suggestedSkills
            .filter((s) => !skills.includes(s))
            .map((suggestion, i) => (
              <button
                key={i}
                onClick={async () => {
                  const updated = [...skills, suggestion];
                  const res = await studentApi.updateProfile({ skills: updated });
                  if (res.success && res.data) setStudent(res.data);
                }}
                className="px-3 py-1.5 bg-slate-50 hover:bg-blue-50 hover:text-blue-600 text-slate-600 text-xs font-medium rounded-xl border border-slate-100 transition-colors flex items-center space-x-1 cursor-pointer"
              >
                <Plus className="w-3 h-3 text-slate-400" />
                <span>{suggestion}</span>
              </button>
            ))}
        </div>
      </div>
    </div>
  );
};

export default MySkills;
