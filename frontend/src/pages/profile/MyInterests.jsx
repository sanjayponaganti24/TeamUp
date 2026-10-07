import React, { useState } from 'react';
import { Plus, X, Heart } from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';
import * as studentApi from '../../services/api/student-api.js';

const MyInterests = () => {
  const { student, setStudent } = useAuth();
  const [newInterest, setNewInterest] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const interests = student?.interests || [];

  const handleAddInterest = async (e) => {
    e.preventDefault();
    const trimmed = newInterest.trim();
    if (!trimmed || interests.includes(trimmed)) return;

    setIsSaving(true);
    const updated = [...interests, trimmed];

    try {
      const res = await studentApi.updateProfile({ interests: updated });
      if (res.success && res.data) {
        setStudent(res.data);
        setNewInterest('');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleRemoveInterest = async (interestToRemove) => {
    const updated = interests.filter((i) => i !== interestToRemove);
    try {
      const res = await studentApi.updateProfile({ interests: updated });
      if (res.success && res.data) {
        setStudent(res.data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const suggestedCategories = [
    'Web Development',
    'Artificial Intelligence',
    'Mobile Apps',
    'Robotics & IoT',
    'Competitive Programming',
    'Cybersecurity',
    'Game Development',
    'UI/UX Design',
    'Cloud Computing',
    'Blockchain / Web3',
    'Open Source',
    'Hackathons',
  ];

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">My Interests</h1>
        <p className="text-xs text-slate-500 mt-1">
          Share your passions to find teams working on topics you genuinely enjoy
        </p>
      </div>

      <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-xs space-y-4">
        <form onSubmit={handleAddInterest} className="flex gap-2">
          <input
            type="text"
            value={newInterest}
            onChange={(e) => setNewInterest(e.target.value)}
            placeholder="Add an interest (e.g. AI, Competitive Coding, Web3)..."
            className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 outline-none focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
          />
          <button
            type="submit"
            disabled={isSaving || !newInterest.trim()}
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl text-xs shadow-xs transition-colors flex items-center space-x-1.5 disabled:opacity-50 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add</span>
          </button>
        </form>

        <div>
          <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
            Selected Interests ({interests.length})
          </h3>
          {interests.length === 0 ? (
            <p className="text-xs text-slate-400">No interests selected yet.</p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {interests.map((interest, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-purple-50 text-purple-700 text-xs font-semibold rounded-xl border border-purple-100 shadow-2xs"
                >
                  <span>{interest}</span>
                  <button
                    onClick={() => handleRemoveInterest(interest)}
                    className="hover:text-rose-600 hover:bg-purple-100 rounded-full p-0.5 transition-colors cursor-pointer"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Suggested Categories */}
      <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-xs space-y-3">
        <div className="flex items-center space-x-2 text-xs font-bold text-slate-700">
          <Heart className="w-4 h-4 text-purple-500" />
          <span>Popular Collaboration Topics</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {suggestedCategories
            .filter((cat) => !interests.includes(cat))
            .map((category, i) => (
              <button
                key={i}
                onClick={async () => {
                  const updated = [...interests, category];
                  const res = await studentApi.updateProfile({ interests: updated });
                  if (res.success && res.data) setStudent(res.data);
                }}
                className="px-3 py-1.5 bg-slate-50 hover:bg-purple-50 hover:text-purple-700 text-slate-600 text-xs font-medium rounded-xl border border-slate-100 transition-colors flex items-center space-x-1 cursor-pointer"
              >
                <Plus className="w-3 h-3 text-slate-400" />
                <span>{category}</span>
              </button>
            ))}
        </div>
      </div>
    </div>
  );
};

export default MyInterests;
