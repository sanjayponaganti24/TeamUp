import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Send, Clock, CheckCircle2, XCircle, ArrowRight } from 'lucide-react';
import * as applicationApi from '../../services/api/application-api.js';
import Loading from '../../components/common/Loading.jsx';

const Applications = () => {
  const [applications, setApplications] = useState([]);
  const [activeTab, setActiveTab] = useState('ALL');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchApps = async () => {
      setIsLoading(true);
      try {
        const res = await applicationApi.getMyApplications();
        if (res.success) {
          setApplications(res.data || []);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchApps();
  }, []);

  if (isLoading) return <Loading message="Loading your applications..." />;

  const filtered =
    activeTab === 'ALL'
      ? applications
      : applications.filter((a) => a.status === activeTab);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'ACCEPTED':
        return { label: 'Accepted', bg: 'bg-emerald-50 text-emerald-700 border-emerald-200' };
      case 'REJECTED':
        return { label: 'Declined', bg: 'bg-rose-50 text-rose-700 border-rose-200' };
      default:
        return { label: 'Pending', bg: 'bg-amber-50 text-amber-700 border-amber-200' };
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
      <div className="flex items-center justify-between pb-4 border-b border-slate-100">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">My Applications</h1>
          <p className="text-xs text-slate-500 mt-1">
            Track outgoing join requests submitted to project rooms
          </p>
        </div>
      </div>

      {/* Tabs (Screen 28 from Reference) */}
      <div className="flex items-center space-x-2 border-b border-slate-100 pb-2">
        {[
          { id: 'ALL', label: `All (${applications.length})` },
          { id: 'PENDING', label: `Pending (${applications.filter((a) => a.status === 'PENDING').length})` },
          { id: 'ACCEPTED', label: `Accepted (${applications.filter((a) => a.status === 'ACCEPTED').length})` },
          { id: 'REJECTED', label: `Declined (${applications.filter((a) => a.status === 'REJECTED').length})` },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              activeTab === tab.id
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-100'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-100 p-12 text-center space-y-3">
          <Send className="w-10 h-10 text-slate-300 mx-auto" />
          <h3 className="text-base font-bold text-slate-800">No Applications in this category</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            You haven't applied to any rooms here yet. Explore open teams and find exciting opportunities!
          </p>
          <Link
            to="/rooms"
            className="inline-block px-4 py-2 bg-blue-50 text-blue-600 font-semibold rounded-xl text-xs hover:bg-blue-100 transition-colors"
          >
            Explore Rooms
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((app) => {
            const status = getStatusBadge(app.status);
            return (
              <div
                key={app._id}
                className="bg-white rounded-2xl border border-slate-100 p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="space-y-1.5">
                  <div className="flex items-center space-x-2">
                    <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md uppercase">
                      {app.room?.type?.replace('_', ' ')}
                    </span>
                    <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${status.bg}`}>
                      {status.label}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900">{app.room?.name}</h3>
                  <p className="text-xs text-slate-600">
                    <span className="font-semibold text-slate-700">Applied Role:</span> {app.requestedRole || 'Member'}
                  </p>
                  {app.message && (
                    <p className="text-xs text-slate-500 italic">"{app.message}"</p>
                  )}
                  <span className="text-[10px] text-slate-400 block pt-1">
                    Submitted on {new Date(app.createdAt).toLocaleDateString()}
                  </span>
                </div>

                <div className="shrink-0 self-end sm:self-center">
                  <Link
                    to={app.status === 'ACCEPTED' ? `/team/${app.room?._id}` : `/rooms/${app.room?._id}`}
                    className="inline-flex items-center space-x-1 px-4 py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-semibold rounded-xl border border-slate-200 transition-colors"
                  >
                    <span>{app.status === 'ACCEPTED' ? 'Open Workspace' : 'View Room'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Applications;
