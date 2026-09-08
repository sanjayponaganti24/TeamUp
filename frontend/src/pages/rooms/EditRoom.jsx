import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';
import * as roomApi from '../../services/api/room-api.js';
import Loading from '../../components/common/Loading.jsx';

const EditRoom = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    capacity: 4,
    requiredSkills: '',
    requiredRoles: '',
    deadline: '',
    autoAccept: false,
    status: 'OPEN',
  });

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const fetchRoom = async () => {
      try {
        const res = await roomApi.getRoomById(id);
        if (res.success && res.data) {
          const r = res.data;
          setFormData({
            name: r.name,
            description: r.description,
            capacity: r.capacity,
            requiredSkills: (r.requiredSkills || []).join(', '),
            requiredRoles: (r.requiredRoles || []).join(', '),
            deadline: r.deadline ? new Date(r.deadline).toISOString().split('T')[0] : '',
            autoAccept: r.autoAccept || false,
            status: r.status || 'OPEN',
          });
        }
      } catch (err) {
        setError(err.message || 'Failed to load room');
      } finally {
        setIsLoading(false);
      }
    };
    fetchRoom();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    const skillsArray = formData.requiredSkills
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    const rolesArray = formData.requiredRoles
      .split(',')
      .map((r) => r.trim())
      .filter(Boolean);

    try {
      const res = await roomApi.updateRoom(id, {
        name: formData.name,
        description: formData.description,
        capacity: Number(formData.capacity),
        requiredSkills: skillsArray,
        requiredRoles: rolesArray,
        deadline: new Date(formData.deadline).toISOString(),
        autoAccept: formData.autoAccept,
      });

      if (formData.status) {
        await roomApi.updateRoomStatus(id, formData.status);
      }

      setSuccess(true);
      setTimeout(() => navigate(`/rooms/${id}`), 1200);
    } catch (err) {
      setError(err.message || 'Failed to update room');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) return <Loading message="Loading room data..." />;

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-3xl border border-slate-100 p-6 sm:p-10 shadow-xs animate-fade-in">
      <div className="flex items-center justify-between pb-6 mb-6 border-b border-slate-100">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Edit Room</h1>
          <p className="text-xs text-slate-500 mt-1">Update your team room criteria and status</p>
        </div>
        <Link
          to={`/rooms/${id}`}
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

      {success && (
        <div className="mb-6 p-3.5 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center space-x-2 text-xs text-emerald-700">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>Room updated successfully! Redirecting...</span>
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
            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200/80 rounded-xl text-sm text-slate-800 focus:bg-white focus:border-blue-500 outline-none transition-all"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">Description</label>
          <textarea
            rows={3}
            required
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200/80 rounded-xl text-sm text-slate-800 focus:bg-white focus:border-blue-500 outline-none transition-all"
          />
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">Capacity</label>
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
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">Deadline</label>
            <input
              type="date"
              required
              value={formData.deadline}
              onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200/80 rounded-xl text-sm text-slate-800 focus:bg-white focus:border-blue-500 outline-none transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">Status</label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200/80 rounded-xl text-xs text-slate-800 focus:bg-white focus:border-blue-500 outline-none transition-all font-medium"
            >
              <option value="OPEN">Open</option>
              <option value="FULL">Full</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="COMPLETED">Completed</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
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
            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200/80 rounded-xl text-sm text-slate-800 focus:bg-white focus:border-blue-500 outline-none transition-all"
          />
        </div>

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
            </div>
          </label>
        </div>

        <div className="pt-4 flex items-center justify-end space-x-3">
          <Link
            to={`/rooms/${id}`}
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

export default EditRoom;
