import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, CheckCircle2, UserPlus, FileEdit, Bell, Layers } from 'lucide-react';
import * as roomApi from '../../services/api/room-api.js';
import Loading from '../../components/common/Loading.jsx';

const TeamActivity = () => {
  const { id } = useParams();
  const [room, setRoom] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchRoom = async () => {
      try {
        const res = await roomApi.getRoomById(id);
        if (res.success) setRoom(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchRoom();
  }, [id]);

  if (isLoading) return <Loading message="Loading team activity..." />;

  // Generate activities based on real room history and members
  const activities = [
    ...(room?.members?.map((m) => ({
      id: `member-${m._id}`,
      type: 'JOINED',
      text: `${m.student?.name} joined the team as ${m.role || 'Member'}.`,
      date: new Date(m.joinedAt || room.createdAt),
      icon: UserPlus,
      color: 'text-emerald-600 bg-emerald-50',
    })) || []),
    {
      id: 'creation',
      type: 'CREATED',
      text: `Room "${room?.name}" was created by ${room?.hostStudent?.name}.`,
      date: new Date(room?.createdAt),
      icon: Layers,
      color: 'text-blue-600 bg-blue-50',
    },
  ].sort((a, b) => b.date - a.date);

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
      <div className="flex items-center justify-between pb-4 border-b border-slate-100">
        <div>
          <Link
            to={`/team/${id}`}
            className="inline-flex items-center space-x-1 text-xs font-semibold text-slate-500 hover:text-slate-800 mb-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Workspace</span>
          </Link>
          <h1 className="text-xl font-bold text-slate-900">Team Activity Log</h1>
          <p className="text-xs text-slate-500 mt-0.5">Automated history of collaboration events for {room?.name}</p>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-100 p-6 sm:p-8 shadow-xs">
        <div className="relative border-l-2 border-slate-100 ml-4 space-y-6">
          {activities.map((act) => {
            const Icon = act.icon;
            return (
              <div key={act.id} className="relative pl-6">
                <div
                  className={`absolute -left-[17px] top-0 w-8 h-8 rounded-full border-2 border-white flex items-center justify-center shadow-xs ${act.color}`}
                >
                  <Icon className="w-4 h-4" />
                </div>
                <div className="pt-0.5">
                  <p className="text-xs font-semibold text-slate-900">{act.text}</p>
                  <span className="text-[10px] text-slate-400 mt-0.5 block">
                    {act.date.toLocaleDateString()} at {act.date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default TeamActivity;
