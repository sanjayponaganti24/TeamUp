import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Users,
  Calendar,
  CheckCircle2,
  Clock,
  MessageSquare,
  Sparkles,
  ArrowRight,
  Send,
  Plus,
  Compass,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';
import * as roomApi from '../../services/api/room-api.js';
import * as roomUpdateApi from '../../services/api/room-update-api.js';
import Loading from '../../components/common/Loading.jsx';

const TeamDashboard = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [myTeams, setMyTeams] = useState([]);
  const [currentRoom, setCurrentRoom] = useState(null);
  const [updates, setUpdates] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTeamData = async () => {
      setIsLoading(true);
      try {
        const res = await roomApi.getMyRooms();
        const allTeams = [...(res.data?.hosted || []), ...(res.data?.joined || [])];
        setMyTeams(allTeams);

        if (allTeams.length > 0) {
          const selectedId = id || allTeams[0]._id;
          const roomRes = await roomApi.getRoomById(selectedId);
          if (roomRes.success) {
            setCurrentRoom(roomRes.data);
            const updatesRes = await roomUpdateApi.getRoomUpdates(selectedId);
            if (updatesRes.success) {
              setUpdates(updatesRes.data || []);
            }
          }
        }
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchTeamData();
  }, [id]);

  if (isLoading) return <Loading message="Opening team workspace..." />;

  if (myTeams.length === 0) {
    return (
      <div className="bg-white rounded-3xl border border-slate-100 p-12 text-center space-y-4 max-w-lg mx-auto mt-10">
        <Users className="w-12 h-12 text-slate-300 mx-auto" />
        <h2 className="text-lg font-bold text-slate-900">No Active Teams Yet</h2>
        <p className="text-xs text-slate-500">
          Join an existing room or create your own project team to unlock the Team Workspace!
        </p>
        <div className="flex justify-center gap-3 pt-2">
          <Link
            to="/rooms/create"
            className="px-4 py-2.5 bg-blue-600 text-white rounded-xl text-xs font-semibold hover:bg-blue-700 transition-colors"
          >
            Create Room
          </Link>
          <Link
            to="/rooms"
            className="px-4 py-2.5 bg-slate-100 text-slate-700 rounded-xl text-xs font-semibold hover:bg-slate-200 transition-colors"
          >
            Explore Rooms
          </Link>
        </div>
      </div>
    );
  }

  const roomId = currentRoom?._id;
  const deadlineDate = currentRoom?.deadline ? new Date(currentRoom.deadline) : null;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Team Selection Bar if user is in multiple teams */}
      {myTeams.length > 1 && (
        <div className="flex items-center space-x-2 overflow-x-auto pb-1 scrollbar-none">
          {myTeams.map((t) => (
            <button
              key={t._id}
              onClick={() => navigate(`/team/${t._id}`)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                currentRoom?._id === t._id
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-100'
              }`}
            >
              {t.name}
            </button>
          ))}
        </div>
      )}

      {/* Main Team Header Banner (Screen 20 from Reference) */}
      <div className="bg-white rounded-3xl border border-slate-100 p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 mb-2">
              <span className="px-2.5 py-0.5 bg-blue-50 text-blue-700 rounded-md text-[10px] font-bold uppercase">
                {currentRoom?.type?.replace('_', ' ')}
              </span>
              <span className="px-2.5 py-0.5 bg-emerald-50 text-emerald-700 rounded-md text-[10px] font-bold">
                {currentRoom?.status}
              </span>
            </div>
            <h1 className="text-2xl font-bold text-slate-900">{currentRoom?.name}</h1>
            <p className="text-xs text-slate-500 mt-1 max-w-2xl">{currentRoom?.description}</p>
          </div>

          <Link
            to={`/rooms/${roomId}`}
            className="px-4 py-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition-colors self-start sm:self-auto"
          >
            Room Details
          </Link>
        </div>

        {/* Team Tabs */}
        <div className="flex items-center space-x-4 border-b border-slate-100 mt-8 pt-2 overflow-x-auto text-xs font-semibold">
          <Link
            to={`/team/${roomId}`}
            className="pb-3 px-2 border-b-2 border-blue-600 text-blue-600 font-bold"
          >
            Dashboard
          </Link>
          <Link
            to={`/team/${roomId}/members`}
            className="pb-3 px-2 border-b-2 border-transparent text-slate-500 hover:text-slate-800"
          >
            Members ({currentRoom?.members?.length || 1})
          </Link>
          <Link
            to={`/team/${roomId}/agenda`}
            className="pb-3 px-2 border-b-2 border-transparent text-slate-500 hover:text-slate-800"
          >
            Agenda
          </Link>
          <Link
            to={`/team/${roomId}/updates`}
            className="pb-3 px-2 border-b-2 border-transparent text-slate-500 hover:text-slate-800"
          >
            Updates ({updates.length})
          </Link>
          <Link
            to={`/team/${roomId}/activity`}
            className="pb-3 px-2 border-b-2 border-transparent text-slate-500 hover:text-slate-800"
          >
            Activity
          </Link>
        </div>
      </div>

      {/* Grid: Members Preview + Recent Updates */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Recent Announcements & Agenda Overview */}
        <div className="lg:col-span-2 space-y-6">
          {/* Quick Announcement Preview */}
          <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900">Recent Team Updates</h3>
              <Link
                to={`/team/${roomId}/updates`}
                className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center space-x-1"
              >
                <span>Post Update</span>
                <Plus className="w-3.5 h-3.5" />
              </Link>
            </div>

            {updates.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-400 bg-slate-50 rounded-2xl">
                No team updates posted yet. Keep your squad aligned by posting progress reports!
              </div>
            ) : (
              <div className="space-y-3">
                {updates.slice(0, 3).map((u) => (
                  <div key={u._id} className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="text-xs font-bold text-slate-900">{u.title}</h4>
                      <span className="text-[10px] text-slate-400">
                        {new Date(u.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">{u.content}</p>
                    <div className="mt-2 text-[10px] text-slate-400 font-medium">
                      By {u.author?.name || 'Teammate'}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Quick Agenda & Deadlines */}
          <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900">Milestones & Deadlines</h3>
              <Link
                to={`/team/${roomId}/agenda`}
                className="text-xs font-semibold text-blue-600 hover:text-blue-700"
              >
                View Agenda →
              </Link>
            </div>

            <div className="p-4 bg-blue-50/50 rounded-2xl border border-blue-100/60 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Calendar className="w-5 h-5 text-blue-600 shrink-0" />
                <div>
                  <h5 className="text-xs font-bold text-slate-900">Project Milestone Deadline</h5>
                  <p className="text-[11px] text-slate-500">
                    {deadlineDate ? deadlineDate.toDateString() : 'No hard deadline set'}
                  </p>
                </div>
              </div>
              <span className="text-xs font-bold text-blue-600">Upcoming</span>
            </div>
          </div>
        </div>

        {/* Right Col: Team Members Roster */}
        <div className="space-y-6">
          <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900">Teammates</h3>
              <Link
                to={`/team/${roomId}/members`}
                className="text-xs font-semibold text-blue-600 hover:text-blue-700"
              >
                All ({currentRoom?.members?.length || 1})
              </Link>
            </div>

            <div className="divide-y divide-slate-100">
              {currentRoom?.members?.map((m, idx) => (
                <div key={idx} className="py-3 flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-9 h-9 rounded-full bg-linear-to-tr from-blue-500 to-indigo-500 text-white font-bold text-xs flex items-center justify-center">
                      {m.student?.name ? m.student.name.charAt(0).toUpperCase() : 'M'}
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">{m.student?.name}</h4>
                      <p className="text-[10px] text-slate-500">{m.role || 'Member'}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeamDashboard;
