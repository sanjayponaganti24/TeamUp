import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import * as studentApi from '../../services/api/student-api.js';
import { CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';

const EditProfile = () => {
  const { user, student, setStudent, setUser } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: user?.name || '',
    branch: student?.branch || 'Computer Science and Engineering',
    year: student?.year || 2,
    bio: student?.bio || '',
    availability: student?.availability || 'AVAILABLE',
    preferredRoles: student?.preferredRoles ? student.preferredRoles.join(', ') : '',
    githubUrl: student?.githubUrl || '',
    linkedinUrl: student?.linkedinUrl || '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFeedback(null);

    const rolesArray = formData.preferredRoles
      .split(',')
      .map((r) => r.trim())
      .filter(Boolean);

    try {
      const res = await studentApi.updateProfile({
        name: formData.name,
        branch: formData.branch,
        year: Number(formData.year),
        bio: formData.bio,
        availability: formData.availability,
        preferredRoles: rolesArray,
        githubUrl: formData.githubUrl,
        linkedinUrl: formData.linkedinUrl,
      });

      if (res.success && res.data) {
        setStudent(res.data);
        setUser((prev) => ({ ...prev, name: formData.name }));
        setFeedback({ type: 'success', message: 'Profile updated successfully!' });
        setTimeout(() => navigate('/profile'), 1200);
      }
    } catch (err) {
      setFeedback({ type: 'error', message: err.message || 'Failed to update profile' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const branches = [
    'Computer Science and Engineering',
    'Information Technology',
    'Electronics & Communication (ECE)',
    'Electrical & Electronics (EEE)',
    'Mechanical Engineering',
    'Civil Engineering',
    'Artificial Intelligence & Data Science',
    'Other Engineering Branch',
  ];

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-3xl border border-slate-100 p-6 sm:p-10 shadow-xs animate-fade-in">
      <div className="flex items-center justify-between pb-6 mb-6 border-b border-slate-100">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Edit Profile</h1>
          <p className="text-xs text-slate-500 mt-1">Update your academic and personal information</p>
        </div>
        <Link
          to="/profile"
          className="text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors"
        >
          Cancel
        </Link>
      </div>

      {feedback && (
        <div
          className={`mb-6 p-3.5 rounded-xl text-xs flex items-center space-x-2 ${
            feedback.type === 'success'
              ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
              : 'bg-rose-50 text-rose-700 border border-rose-100'
          }`}
        >
          {feedback.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 shrink-0" />
          )}
          <span>{feedback.message}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">Full Name</label>
          <input
            type="text"
            name="name"
            required
            value={formData.name}
            onChange={handleChange}
            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200/80 rounded-xl text-sm text-slate-800 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
          />
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="col-span-2">
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">Branch</label>
            <select
              name="branch"
              value={formData.branch}
              onChange={handleChange}
              className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200/80 rounded-xl text-xs text-slate-800 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
            >
              {branches.map((b) => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">Year</label>
            <select
              name="year"
              value={formData.year}
              onChange={handleChange}
              className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200/80 rounded-xl text-xs text-slate-800 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
            >
              {[1, 2, 3, 4, 5].map((y) => (
                <option key={y} value={y}>
                  Year {y}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Availability Status Selector */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-2">
            Availability Status
          </label>
          <div className="grid grid-cols-3 gap-3">
            {[
              { id: 'AVAILABLE', label: 'Available', desc: 'Ready to join teams' },
              { id: 'WAITING', label: 'Waiting', desc: 'Exploring options' },
              { id: 'HOLD', label: 'Hold', desc: 'Currently busy' },
            ].map((opt) => (
              <label
                key={opt.id}
                className={`p-3 rounded-2xl border cursor-pointer transition-all ${
                  formData.availability === opt.id
                    ? 'border-blue-600 bg-blue-50/50 text-blue-900 shadow-xs'
                    : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                }`}
              >
                <input
                  type="radio"
                  name="availability"
                  value={opt.id}
                  checked={formData.availability === opt.id}
                  onChange={handleChange}
                  className="sr-only"
                />
                <div className="text-xs font-bold">{opt.label}</div>
                <div className="text-[10px] text-slate-500 mt-0.5">{opt.desc}</div>
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
            Preferred Roles (Comma-separated)
          </label>
          <input
            type="text"
            name="preferredRoles"
            value={formData.preferredRoles}
            onChange={handleChange}
            placeholder="e.g. Frontend Developer, UI Designer, Full Stack Developer"
            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200/80 rounded-xl text-sm text-slate-800 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">Bio</label>
          <textarea
            rows={3}
            name="bio"
            value={formData.bio}
            onChange={handleChange}
            placeholder="Tell potential team leaders what you love building..."
            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200/80 rounded-xl text-sm text-slate-800 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              GitHub Profile Link
            </label>
            <input
              type="url"
              name="githubUrl"
              value={formData.githubUrl}
              onChange={handleChange}
              placeholder="https://github.com/yourhandle"
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200/80 rounded-xl text-sm text-slate-800 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              LinkedIn Profile Link
            </label>
            <input
              type="url"
              name="linkedinUrl"
              value={formData.linkedinUrl}
              onChange={handleChange}
              placeholder="https://linkedin.com/in/yourhandle"
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200/80 rounded-xl text-sm text-slate-800 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
            />
          </div>
        </div>

        <div className="pt-4 flex items-center justify-end space-x-3">
          <Link
            to="/profile"
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
                <span>Saving...</span>
              </>
            ) : (
              <span>Save Changes</span>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditProfile;
