import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Plus, ArrowLeft, Loader2, AlertCircle, Sparkles } from 'lucide-react';
import * as roomApi from '../../services/api/room-api.js';

const CreateRoom = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    type: 'HACKATHON',
    capacity: 4,
    requiredSkills: '',
    requiredRoles: '',
    requiredBranches: [],
    deadline: '',
    autoAccept: false,
    typeDetails: {
      eventName: '',
      theme: '',
    },
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const branches = [
    'Computer Science and Engineering',
    'Information Technology',
    'Electronics & Communication (ECE)',
    'Electrical & Electronics (EEE)',
    'Mechanical Engineering',
    'Civil Engineering',
    'Artificial Intelligence & Data Science',
  ];

  const handleBranchToggle = (branch) => {
    setFormData((prev) => {
      const exists = prev.requiredBranches.includes(branch);
      return {
        ...prev,
        requiredBranches: exists
          ? prev.requiredBranches.filter((b) => b !== branch)
          : [...prev.requiredBranches, branch],
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.deadline) {
      return setError('Please set an application deadline.');
    }

    setIsSubmitting(true);

    const skillsArray = formData.requiredSkills
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    const rolesArray = formData.requiredRoles
      .split(',')
      .map((r) => r.trim())
      .filter(Boolean);

    try {
      const res = await roomApi.createRoom({
        name: formData.name,
        description: formData.description,
        type: formData.type,
        capacity: Number(formData.capacity),
        requiredSkills: skillsArray,
        requiredRoles: rolesArray,
        requiredBranches: formData.requiredBranches,
        deadline: new Date(formData.deadline).toISOString(),
        autoAccept: formData.autoAccept,
        typeDetails: formData.typeDetails,
      });

      if (res.success && res.data) {
        navigate(`/rooms/${res.data._id}`);
      }
    } catch (err) {
      setError(err.message || 'Failed to create room');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-3xl border border-slate-100 p-6 sm:p-10 shadow-xs animate-fade-in">
      <div className="flex items-center justify-between pb-6 mb-6 border-b border-slate-100">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Create Room</h1>
          <p className="text-xs text-slate-500 mt-1">
            Start a new team and find talented students across your college
          </p>
        </div>
        <Link
          to="/rooms"
          className="text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors"
        >
          Cancel
        </Link>
      </div>

      {error && (
        <div className="mb-6 p-3.5 rounded-xl bg-rose-50 border border-rose-100 flex items-start space-x-2.5 text-xs text-rose-600">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">Room Name</label>
          <input
            type="text"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="e.g. AI Autonomous Drone Hackathon Team"
            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200/80 rounded-xl text-sm text-slate-800 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">Room Type</label>
          <select
            value={formData.type}
            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
            className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200/80 rounded-xl text-xs text-slate-800 focus:bg-white focus:border-blue-500 font-medium outline-none transition-all"
          >
            <option value="HACKATHON">Hackathon</option>
            <option value="PERSONAL_PROJECT">Personal Project</option>
            <option value="CLUB">College Club</option>
            <option value="RESEARCH">Research Paper / Study</option>
            <option value="COMPETITION">Competition</option>
            <option value="OTHER">Other Collaboration</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">Description</label>
          <textarea
            rows={3}
            required
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Describe your project, goals, and who you are hoping to recruit..."
            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200/80 rounded-xl text-sm text-slate-800 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Total Team Capacity
            </label>
            <input
              type="number"
              min={2}
              max={20}
              required
              value={formData.capacity}
              onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200/80 rounded-xl text-sm text-slate-800 focus:bg-white focus:border-blue-500 outline-none transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Application Deadline
            </label>
            <input
              type="date"
              required
              value={formData.deadline}
              onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200/80 rounded-xl text-sm text-slate-800 focus:bg-white focus:border-blue-500 outline-none transition-all"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
            Required Skills (Comma-separated)
          </label>
          <input
            type="text"
            value={formData.requiredSkills}
            onChange={(e) => setFormData({ ...formData, requiredSkills: e.target.value })}
            placeholder="e.g. React, Node.js, Python, Figma"
            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200/80 rounded-xl text-sm text-slate-800 focus:bg-white focus:border-blue-500 outline-none transition-all"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
            Required Roles (Comma-separated)
          </label>
          <input
            type="text"
            value={formData.requiredRoles}
            onChange={(e) => setFormData({ ...formData, requiredRoles: e.target.value })}
            placeholder="e.g. Frontend Developer, ML Engineer, UI/UX Designer"
            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200/80 rounded-xl text-sm text-slate-800 focus:bg-white focus:border-blue-500 outline-none transition-all"
          />
        </div>

        {/* Required Branches Selection */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-2">
            Target Branches (Leave empty to allow all branches)
          </label>
          <div className="flex flex-wrap gap-2">
            {branches.map((b) => {
              const isSelected = formData.requiredBranches.includes(b);
              return (
                <button
                  type="button"
                  key={b}
                  onClick={() => handleBranchToggle(b)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-colors cursor-pointer ${
                    isSelected
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {b}
                </button>
              );
            })}
          </div>
        </div>

        {/* Auto-Accept Toggle */}
        <div className="pt-2">
          <label className="flex items-center space-x-3 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.autoAccept}
              onChange={(e) => setFormData({ ...formData, autoAccept: e.target.checked })}
              className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
            />
            <div>
              <span className="text-xs font-bold text-slate-800">
                Instant Auto-Accept (Public Join)
              </span>
              <p className="text-[11px] text-slate-500">
                Applicants automatically join the team if capacity is available without manual host review.
              </p>
            </div>
          </label>
        </div>

        <div className="pt-4 flex items-center justify-end space-x-3">
          <Link
            to="/rooms"
            className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl text-xs transition-colors"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl text-xs shadow-xs transition-colors flex items-center space-x-1.5 disabled:opacity-60 cursor-pointer"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Creating...</span>
              </>
            ) : (
              <span>Create Room</span>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateRoom;
