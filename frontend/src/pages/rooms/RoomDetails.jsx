import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Users,
  Calendar,
  Clock,
  GraduationCap,
  Sparkles,
  CheckCircle2,
  Edit3,
  LogOut,
  Send,
  UserCheck,
  Layers,
  ArrowRight,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';
import * as roomApi from '../../services/api/room-api.js';
import * as applicationApi from '../../services/api/application-api.js';
import Loading from '../../components/common/Loading.jsx';
import Modal from '../../components/common/Modal.jsx';

const RoomDetails = () => {
  const { id } = useParams();
  const { user, student } = useAuth();
  const navigate = useNavigate();

  const [room, setRoom] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  // Join Modal
  const [isJoinOpen, setIsJoinOpen] = useState(false);
  const [joinRole, setJoinRole] = useState('Member');
  const [joinMessage, setJoinMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [joinFeedback, setJoinFeedback] = useState(null);

  const fetchRoom = async () => {
    setIsLoading(true);
    try {
      const res = await roomApi.getRoomById(id);
      if (res.success && res.data) {
        setRoom(res.data);
      }
    } catch (err) {
      setError(err.message || 'Room not found');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRoom();
  }, [id]);

  const handleJoin = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setJoinFeedback(null);

    try {
      const res = await applicationApi.applyToRoom({
        roomId: room._id,
        requestedRole: joinRole,
        message: joinMessage,
      });
      setJoinFeedback({
        type: 'success',
        message: res.message || 'Application submitted successfully!',
      });
      setTimeout(() => {
        setIsJoinOpen(false);
        setJoinFeedback(null);
        fetchRoom();
      }, 1500);
    } catch (err) {
      setJoinFeedback({
        type: 'error',
        message: err.message || 'Failed to submit application',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLeaveRoom = async () => {
    if (!window.confirm('Are you sure you want to leave this team?')) return;
    try {
      await roomApi.leaveRoom(room._id);
      navigate('/rooms');
    } catch (err) {
      alert(err.message || 'Failed to leave room');
    }
  };

  if (isLoading) return <Loading message="Loading room details..." />;
  if (error || !room) {
    return (
      <div className="bg-white rounded-3xl border border-slate-100 p-12 text-center space-y-4 max-w-lg mx-auto mt-12">
        <h3 className="text-base font-bold text-slate-800">Room Not Found</h3>
        <p className="text-xs text-slate-500">{error || 'This room does not exist or has been removed.'}</p>
        <Link
          to="/rooms"
          className="inline-block px-5 py-2.5 bg-blue-600 text-white font-semibold rounded-xl text-xs hover:bg-blue-700"
        >
          Back to Explore
        </Link>
      </div>
    );
  }

  const isHost = user && room.host?._id === user._id;
  const isMember = user && room.members?.some((m) => m.user?._id === user._id);
  const memberCount = room.members?.length || 1;
  const isFull = memberCount >= room.capacity;
  const deadlineDate = new Date(room.deadline);
  const isExpired = new Date() > deadlineDate;

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-fade-in">
      {/* Visual Header Banner (Screen 14 from Reference) */}
      <div className="bg-linear-to-r from-blue-600 via-indigo-600 to-sky-500 rounded-3xl p-6 sm:p-10 text-white shadow-lg relative overflow-hidden">
        <div className="relative z-10 space-y-3">
          <div className="flex items-center space-x-2">
            <span className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-lg text-xs font-bold uppercase tracking-wider">
              {room.type?.replace('_', ' ')}
            </span>
            <span className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-lg text-xs font-medium">
              Status: {room.status}
            </span>
            {room.autoAccept && (
              <span className="px-2.5 py-1 bg-emerald-400/30 border border-emerald-300/40 rounded-lg text-xs font-semibold text-emerald-100">
                ⚡ Auto-Accept On
              </span>
            )}
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">{room.name}</h1>
          <p className="text-xs sm:text-sm text-blue-100 max-w-2xl leading-relaxed">
            {room.description}
          </p>

          <div className="flex flex-wrap items-center gap-6 pt-2 text-xs font-medium text-white/90">
            <div className="flex items-center space-x-1.5">
              <Users className="w-4 h-4 text-blue-200" />
              <span>
                {memberCount} / {room.capacity} Team Members
              </span>
            </div>
            <div className="flex items-center space-x-1.5">
              <Calendar className="w-4 h-4 text-blue-200" />
              <span>Deadline: {deadlineDate.toLocaleDateString()}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Details & Host */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Requirements & Members */}
        <div className="lg:col-span-2 space-y-6">
          {/* Requirements Card */}
          <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-xs space-y-5">
            <h3 className="text-sm font-bold text-slate-900">Room Criteria & Requirements</h3>

            <div>
              <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                Required Skills
              </h4>
              <div className="flex flex-wrap gap-2">
                {room.requiredSkills && room.requiredSkills.length > 0 ? (
                  room.requiredSkills.map((s, i) => (
                    <span
                      key={i}
                      className="px-3 py-1 bg-blue-50 text-blue-700 text-xs font-semibold rounded-xl border border-blue-100"
                    >
                      {s}
                    </span>
                  ))
                ) : (
                  <span className="text-xs text-slate-400">Open to all skill sets</span>
                )}
              </div>
            </div>

            <div>
              <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                Target Branches
              </h4>
              <div className="flex flex-wrap gap-2">
                {room.requiredBranches && room.requiredBranches.length > 0 ? (
                  room.requiredBranches.map((b, i) => (
                    <span
                      key={i}
                      className="px-3 py-1 bg-slate-50 text-slate-700 text-xs font-semibold rounded-xl border border-slate-100"
                    >
                      {b}
                    </span>
                  ))
                ) : (
                  <span className="text-xs text-slate-400">All departments eligible</span>
                )}
              </div>
            </div>

            <div>
              <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                Roles Needed
              </h4>
              <div className="flex flex-wrap gap-2">
                {room.requiredRoles && room.requiredRoles.length > 0 ? (
                  room.requiredRoles.map((r, i) => (
                    <span
                      key={i}
                      className="px-3 py-1 bg-purple-50 text-purple-700 text-xs font-semibold rounded-xl border border-purple-100"
                    >
                      {r}
                    </span>
                  ))
                ) : (
                  <span className="text-xs text-slate-400">Flexible team roles</span>
                )}
              </div>
            </div>
          </div>

          {/* Members Roster Card */}
          <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900">
                Team Members ({memberCount}/{room.capacity})
              </h3>
              {isMember && (
                <Link
                  to={`/team/${room._id}`}
                  className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center space-x-1"
                >
                  <span>Go to Workspace</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              )}
            </div>

            <div className="divide-y divide-slate-100">
              {room.members?.map((m, idx) => (
                <div key={idx} className="py-3 flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-linear-to-tr from-blue-500 to-indigo-500 text-white font-bold text-sm flex items-center justify-center">
                      {m.student?.name ? m.student.name.charAt(0).toUpperCase() : 'M'}
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">{m.student?.name}</h4>
                      <p className="text-[11px] text-slate-500">
                        {m.student?.branch} • Year {m.student?.year}
                      </p>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 bg-slate-50 text-slate-700 rounded-lg text-xs font-semibold border border-slate-100">
                    {m.role || 'Member'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Col: Host & Action Panel */}
        <div className="space-y-6">
          {/* Host Card */}
          <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-xs space-y-4">
            <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-md uppercase">
              Room Host
            </span>
            <div className="flex items-center space-x-3.5 pt-1">
              <div className="w-12 h-12 rounded-2xl bg-linear-to-tr from-indigo-500 to-purple-500 text-white font-black text-lg flex items-center justify-center">
                {room.hostStudent?.name ? room.hostStudent.name.charAt(0).toUpperCase() : 'H'}
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900">{room.hostStudent?.name}</h4>
                <p className="text-xs text-slate-500">{room.hostStudent?.branch}</p>
              </div>
            </div>

            {room.hostStudent?.bio && (
              <p className="text-xs text-slate-600 italic">"{room.hostStudent.bio}"</p>
            )}
          </div>

          {/* Contextual Action Buttons */}
          <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-xs space-y-3">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Actions</h3>

            {isHost ? (
              <div className="space-y-2">
                <Link
                  to={`/team/${room._id}`}
                  className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl text-xs flex items-center justify-center space-x-2 shadow-xs transition-colors"
                >
                  <Layers className="w-4 h-4" />
                  <span>Open Team Workspace</span>
                </Link>
                <Link
                  to={`/rooms/${room._id}/requests`}
                  className="w-full py-2.5 bg-blue-50 hover:bg-blue-100 text-blue-700 font-semibold rounded-xl text-xs flex items-center justify-center space-x-2 transition-colors"
                >
                  <Users className="w-4 h-4" />
                  <span>Review Applications</span>
                </Link>
                <Link
                  to={`/rooms/${room._id}/candidates`}
                  className="w-full py-2.5 bg-purple-50 hover:bg-purple-100 text-purple-700 font-semibold rounded-xl text-xs flex items-center justify-center space-x-2 transition-colors"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Recommended Students</span>
                </Link>
                <Link
                  to={`/rooms/${room._id}/edit`}
                  className="w-full py-2.5 bg-slate-50 hover:bg-slate-100 text-slate-700 font-semibold rounded-xl text-xs flex items-center justify-center space-x-2 border border-slate-200 transition-colors"
                >
                  <Edit3 className="w-4 h-4" />
                  <span>Edit Room Details</span>
                </Link>
              </div>
            ) : isMember ? (
              <div className="space-y-2">
                <div className="p-3 bg-emerald-50 text-emerald-700 rounded-2xl text-xs font-semibold flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>You are a member of this team</span>
                </div>
                <Link
                  to={`/team/${room._id}`}
                  className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl text-xs flex items-center justify-center space-x-2 shadow-xs transition-colors"
                >
                  <span>Go to Workspace</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <button
                  onClick={handleLeaveRoom}
                  className="w-full py-2 bg-rose-50 hover:bg-rose-100 text-rose-600 font-semibold rounded-xl text-xs flex items-center justify-center space-x-1.5 transition-colors cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Leave Team</span>
                </button>
              </div>
            ) : isExpired ? (
              <div className="p-3 bg-rose-50 text-rose-600 rounded-2xl text-xs font-semibold text-center">
                Application deadline has expired
              </div>
            ) : isFull ? (
              <div className="p-3 bg-amber-50 text-amber-700 rounded-2xl text-xs font-semibold text-center">
                Room has reached maximum capacity
              </div>
            ) : (
              <button
                onClick={() => setIsJoinOpen(true)}
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl text-xs shadow-xs flex items-center justify-center space-x-2 cursor-pointer transition-colors"
              >
                <Send className="w-4 h-4" />
                <span>Request to Join Team</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Join Request Modal */}
      <Modal
        isOpen={isJoinOpen}
        onClose={() => {
          setIsJoinOpen(false);
          setJoinFeedback(null);
        }}
        title={`Request to Join "${room.name}"`}
      >
        {joinFeedback ? (
          <div
            className={`p-4 rounded-xl text-xs flex items-center space-x-2 ${
              joinFeedback.type === 'success'
                ? 'bg-emerald-50 text-emerald-700'
                : 'bg-rose-50 text-rose-700'
            }`}
          >
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{joinFeedback.message}</span>
          </div>
        ) : (
          <form onSubmit={handleJoin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Your Preferred Role
              </label>
              <select
                value={joinRole}
                onChange={(e) => setJoinRole(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 outline-none focus:bg-white focus:border-blue-500"
              >
                <option value="Frontend Developer">Frontend Developer</option>
                <option value="Backend Developer">Backend Developer</option>
                <option value="Full Stack Developer">Full Stack Developer</option>
                <option value="UI/UX Designer">UI/UX Designer</option>
                <option value="ML / AI Engineer">ML / AI Engineer</option>
                <option value="Researcher">Researcher</option>
                <option value="Member">General Member</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Note for the Host (Optional)
              </label>
              <textarea
                rows={3}
                value={joinMessage}
                onChange={(e) => setJoinMessage(e.target.value)}
                placeholder="Explain why you'd be a great addition to this team..."
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 outline-none focus:bg-white focus:border-blue-500"
              />
            </div>

            <div className="flex justify-end space-x-2 pt-2">
              <button
                type="button"
                onClick={() => setIsJoinOpen(false)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-medium cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-xs disabled:opacity-60 cursor-pointer"
              >
                {isSubmitting ? 'Sending...' : 'Send Request'}
              </button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
};

export default RoomDetails;
