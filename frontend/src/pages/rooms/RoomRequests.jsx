import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Check, X, Users, Mail, Briefcase, GraduationCap, Sparkles } from 'lucide-react';
import * as applicationApi from '../../services/api/application-api.js';
import * as roomApi from '../../services/api/room-api.js';
import Loading from '../../components/common/Loading.jsx';

const RoomRequests = () => {
  const { id } = useParams();
  const [room, setRoom] = useState(null);
  const [applications, setApplications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [processingId, setProcessingId] = useState(null);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [roomRes, appsRes] = await Promise.all([
        roomApi.getRoomById(id),
        applicationApi.getRoomApplications(id),
      ]);
      if (roomRes.success) setRoom(roomRes.data);
      if (appsRes.success) setApplications(appsRes.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  const handleDecision = async (applicationId, status) => {
    setProcessingId(applicationId);
    try {
      await applicationApi.reviewApplication(applicationId, { status });
      await fetchData();
    } catch (err) {
      alert(err.message || 'Failed to process request');
    } finally {
      setProcessingId(null);
    }
  };

  if (isLoading) return <Loading message="Loading room applications..." />;

  const pendingApps = applications.filter((a) => a.status === 'PENDING');
  const pastApps = applications.filter((a) => a.status !== 'PENDING');

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-100">
        <div>
          <Link
            to={`/rooms/${id}`}
            className="inline-flex items-center space-x-1 text-xs font-semibold text-slate-500 hover:text-slate-800 mb-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Room</span>
          </Link>
          <h1 className="text-xl font-bold text-slate-900">
            Join Requests for "{room?.name}"
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Review candidate students and select the best additions to your team
          </p>
        </div>

        <div className="text-right">
          <span className="text-xs font-semibold text-slate-600 bg-slate-100 px-3 py-1.5 rounded-xl">
            {room?.members?.length || 1} / {room?.capacity} Members
          </span>
        </div>
      </div>

      {/* Pending Requests */}
      <div className="space-y-4">
        <h2 className="text-sm font-bold text-slate-800">
          Pending Requests ({pendingApps.length})
        </h2>

        {pendingApps.length === 0 ? (
          <div className="bg-white rounded-3xl border border-slate-100 p-8 text-center text-xs text-slate-400">
            No pending join requests right now.
          </div>
        ) : (
          <div className="space-y-3">
            {pendingApps.map((app) => (
              <div
                key={app._id}
                className="bg-white rounded-2xl border border-slate-100 p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="space-y-2">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-linear-to-tr from-blue-600 to-indigo-500 text-white font-bold text-sm flex items-center justify-center">
                      {app.student?.name ? app.student.name.charAt(0).toUpperCase() : 'S'}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">{app.student?.name}</h4>
                      <p className="text-xs text-slate-500">
                        {app.student?.branch} • Year {app.student?.year}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 text-xs">
                    <span className="font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">
                      Role: {app.requestedRole || 'Member'}
                    </span>
                    {app.message && (
                      <span className="text-slate-600 italic">"{app.message}"</span>
                    )}
                  </div>

                  {app.student?.skills && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {app.student.skills.slice(0, 5).map((s, idx) => (
                        <span
                          key={idx}
                          className="text-[10px] bg-slate-50 text-slate-600 px-2 py-0.5 rounded border border-slate-100"
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex items-center space-x-2 shrink-0 self-end sm:self-center">
                  <button
                    disabled={processingId === app._id}
                    onClick={() => handleDecision(app._id, 'REJECTED')}
                    className="px-4 py-2 bg-slate-100 hover:bg-rose-50 hover:text-rose-600 text-slate-700 font-semibold rounded-xl text-xs transition-colors flex items-center space-x-1 cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                    <span>Decline</span>
                  </button>
                  <button
                    disabled={processingId === app._id}
                    onClick={() => handleDecision(app._id, 'ACCEPTED')}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl text-xs shadow-xs transition-colors flex items-center space-x-1 cursor-pointer"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Accept</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Past Decision History */}
      {pastApps.length > 0 && (
        <div className="space-y-3 pt-6 border-t border-slate-100">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Past Applications ({pastApps.length})
          </h3>
          <div className="divide-y divide-slate-100 bg-white rounded-2xl border border-slate-100 p-4">
            {pastApps.map((a) => (
              <div key={a._id} className="py-2.5 flex items-center justify-between text-xs">
                <div>
                  <span className="font-semibold text-slate-800">{a.student?.name}</span>
                  <span className="text-slate-400 ml-2">({a.requestedRole || 'Member'})</span>
                </div>
                <span
                  className={`px-2 py-0.5 rounded-md font-semibold text-[11px] ${
                    a.status === 'ACCEPTED'
                      ? 'bg-emerald-50 text-emerald-700'
                      : 'bg-rose-50 text-rose-700'
                  }`}
                >
                  {a.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default RoomRequests;
