import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Users, Mail, Briefcase, GraduationCap, ArrowLeft, Plus, ExternalLink } from 'lucide-react';
import * as roomApi from '../../services/api/room-api.js';
import Loading from '../../components/common/Loading.jsx';

const TeamMembers = () => {
  const { id } = useParams();
  const [room, setRoom] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchRoom = async () => {
      setIsLoading(true);
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

  if (isLoading) return <Loading message="Loading teammates..." />;

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
          <h1 className="text-xl font-bold text-slate-900">
            Team Members ({room?.members?.length || 1} / {room?.capacity})
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">Roster of collaborators for {room?.name}</p>
        </div>

        <Link
          to={`/rooms/${id}/candidates`}
          className="inline-flex items-center space-x-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Invite Candidates</span>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {room?.members?.map((m, idx) => (
          <div
            key={idx}
            className="bg-white rounded-2xl border border-slate-100 p-5 shadow-xs flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 rounded-2xl bg-linear-to-tr from-blue-600 to-indigo-500 text-white font-bold text-base flex items-center justify-center shadow-xs">
                    {m.student?.name ? m.student.name.charAt(0).toUpperCase() : 'M'}
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">{m.student?.name}</h4>
                    <p className="text-xs text-slate-500 flex items-center space-x-1 mt-0.5">
                      <GraduationCap className="w-3.5 h-3.5 text-slate-400" />
                      <span>
                        {m.student?.branch} • Year {m.student?.year}
                      </span>
                    </p>
                  </div>
                </div>
                <span className="text-[11px] font-semibold bg-blue-50 text-blue-700 px-2.5 py-0.5 rounded-lg border border-blue-100">
                  {m.role || 'Member'}
                </span>
              </div>

              {m.student?.bio && (
                <p className="text-xs text-slate-600 mt-3 line-clamp-2">{m.student.bio}</p>
              )}

              {/* Skills */}
              {m.student?.skills && m.student.skills.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-3">
                  {m.student.skills.slice(0, 4).map((s, i) => (
                    <span
                      key={i}
                      className="text-[10px] bg-slate-50 text-slate-600 font-medium px-2 py-0.5 rounded border border-slate-100"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div className="mt-4 pt-3 border-t border-slate-50 flex items-center justify-between text-xs text-slate-400">
              <span className="flex items-center space-x-1">
                <Mail className="w-3.5 h-3.5 text-slate-400" />
                <span>{m.user?.email || m.student?.email}</span>
              </span>
              <span>Joined {new Date(m.joinedAt).toLocaleDateString()}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TeamMembers;
