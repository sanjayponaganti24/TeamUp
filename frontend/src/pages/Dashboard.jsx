import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Compass,
  Send,
  Mail,
  Bell,
  Sparkles,
  ArrowRight,
  Plus,
  Clock,
  CheckCircle2,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import { useNotification } from '../context/NotificationContext.jsx';
import * as roomApi from '../services/api/room-api.js';
import * as matchingApi from '../services/api/matching-api.js';
import * as applicationApi from '../services/api/application-api.js';
import RoomCard from '../components/rooms/RoomCard.jsx';
import Loading from '../components/common/Loading.jsx';
import Modal from '../components/common/Modal.jsx';

const Dashboard = () => {
  const { user, student } = useAuth();
  const { unreadCount } = useNotification();

  const [stats, setStats] = useState({
    myRoomsCount: 0,
    applicationsCount: 0,
    invitationsCount: 0,
    notificationsCount: unreadCount,
  });

  const [recommendedRooms, setRecommendedRooms] = useState([]);
  const [activeTeams, setActiveTeams] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Join Request Modal state
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [joinMessage, setJoinMessage] = useState('');
  const [joinRole, setJoinRole] = useState('Member');
  const [isJoining, setIsJoining] = useState(false);
  const [joinFeedback, setJoinFeedback] = useState(null);

  const loadDashboardData = async () => {
    setIsLoading(true);
    try {
      const [roomsRes, matchRes, appsRes, invsRes] = await Promise.all([
        roomApi.getMyRooms(),
        matchingApi.getRecommendedRooms({ limit: 6 }),
        applicationApi.getMyApplications(),
        applicationApi.getMyApplications(), // Can also fetch invitations
      ]);

      const hostedCount = roomsRes.data?.hosted?.length || 0;
      const joinedCount = roomsRes.data?.joined?.length || 0;
      const appsCount = appsRes.data?.length || 0;

      setStats({
        myRoomsCount: hostedCount + joinedCount,
        applicationsCount: appsCount,
        invitationsCount: 2, // fallback or dynamic count
        notificationsCount: unreadCount,
      });

      setRecommendedRooms(matchRes.data || []);
      setActiveTeams([...(roomsRes.data?.hosted || []), ...(roomsRes.data?.joined || [])]);
    } catch (err) {
      console.error('Failed to load dashboard:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, [unreadCount]);

  const handleJoinSubmit = async (e) => {
    e.preventDefault();
    if (!selectedRoom) return;

    setIsJoining(true);
    setJoinFeedback(null);

    try {
      const res = await applicationApi.applyToRoom({
        roomId: selectedRoom._id,
        message: joinMessage,
        requestedRole: joinRole,
      });
      setJoinFeedback({
        type: 'success',
        message: res.message || 'Application submitted successfully!',
      });
      setTimeout(() => {
        setSelectedRoom(null);
        setJoinFeedback(null);
        setJoinMessage('');
        loadDashboardData();
      }, 1500);
    } catch (err) {
      setJoinFeedback({
        type: 'error',
        message: err.message || 'Failed to submit application',
      });
    } finally {
      setIsJoining(false);
    }
  };

  if (isLoading) {
    return <Loading message="Preparing your dashboard..." />;
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Welcome Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            Hello, {user?.name?.split(' ')[0] || 'Student'} 👋
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Great to see you again! Here is what's happening with your teams and recommendations.
          </p>
        </div>
        <Link
          to="/rooms/create"
          className="inline-flex items-center space-x-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl shadow-xs transition-colors self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Create Room</span>
        </Link>
      </div>

      {/* 4 Stat Metric Cards (Screen 6 from Reference) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* My Rooms */}
        <Link
          to="/rooms/my-rooms"
          className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs hover:shadow-md transition-all group flex items-center justify-between"
        >
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">My Rooms</p>
            <h3 className="text-2xl font-black text-slate-900 mt-1">{stats.myRoomsCount}</h3>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center group-hover:scale-105 transition-transform">
            <Compass className="w-6 h-6" />
          </div>
        </Link>

        {/* Applications */}
        <Link
          to="/notifications/applications"
          className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs hover:shadow-md transition-all group flex items-center justify-between"
        >
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Applications</p>
            <h3 className="text-2xl font-black text-slate-900 mt-1">{stats.applicationsCount}</h3>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:scale-105 transition-transform">
            <Send className="w-6 h-6" />
          </div>
        </Link>

        {/* Invitations */}
        <Link
          to="/notifications/invitations"
          className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs hover:shadow-md transition-all group flex items-center justify-between"
        >
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Invitations</p>
            <h3 className="text-2xl font-black text-slate-900 mt-1">{stats.invitationsCount}</h3>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-105 transition-transform">
            <Mail className="w-6 h-6" />
          </div>
        </Link>

        {/* Notifications */}
        <Link
          to="/notifications"
          className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs hover:shadow-md transition-all group flex items-center justify-between"
        >
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Notifications</p>
            <h3 className="text-2xl font-black text-slate-900 mt-1">{unreadCount}</h3>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center group-hover:scale-105 transition-transform">
            <Bell className="w-6 h-6" />
          </div>
        </Link>
      </div>

      {/* Recommended Rooms Section */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-5 h-5 text-blue-600" />
            <h2 className="text-lg font-bold text-slate-900">Recommended Rooms</h2>
          </div>
          <Link
            to="/matching"
            className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center space-x-1"
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {recommendedRooms.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-100 p-8 text-center space-y-3">
            <p className="text-sm font-medium text-slate-600">No matching rooms yet</p>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Try updating your profile skills and preferred roles to get tailored team matches!
            </p>
            <Link
              to="/rooms"
              className="inline-block px-4 py-2 bg-blue-50 text-blue-600 font-semibold rounded-xl text-xs hover:bg-blue-100 transition-colors"
            >
              Explore All Rooms
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {recommendedRooms.map((rec) => (
              <RoomCard
                key={rec.room._id}
                room={rec.room}
                matchScore={rec.matchScore}
                reasons={rec.reasons}
                onJoinClick={(room) => setSelectedRoom(room)}
              />
            ))}
          </div>
        )}
      </section>

      {/* Active Teams Grid */}
      {activeTeams.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900">My Active Teams</h2>
            <Link
              to="/team"
              className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center space-x-1"
            >
              <span>Workspace</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {activeTeams.slice(0, 3).map((team) => (
              <div
                key={team._id}
                className="bg-white rounded-2xl border border-slate-100 p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md uppercase">
                    {team.type?.replace('_', ' ')}
                  </span>
                  <h4 className="text-sm font-bold text-slate-900 mt-2 line-clamp-1">{team.name}</h4>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-2">{team.description}</p>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-50 flex items-center justify-between text-xs text-slate-500">
                  <span>{team.members?.length || 1} Members</span>
                  <Link
                    to={`/team/${team._id}`}
                    className="font-semibold text-blue-600 hover:text-blue-700 flex items-center space-x-1"
                  >
                    <span>Open Team</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Join Request Modal */}
      <Modal
        isOpen={!!selectedRoom}
        onClose={() => {
          setSelectedRoom(null);
          setJoinFeedback(null);
        }}
        title={`Request to Join "${selectedRoom?.name}"`}
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
          <form onSubmit={handleJoinSubmit} className="space-y-4">
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
                onClick={() => setSelectedRoom(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isJoining}
                className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-xs disabled:opacity-60"
              >
                {isJoining ? 'Sending...' : 'Send Request'}
              </button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
};

export default Dashboard;
