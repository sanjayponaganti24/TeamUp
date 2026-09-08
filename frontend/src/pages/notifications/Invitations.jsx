import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Check, X, ArrowRight, UserCheck } from 'lucide-react';
import * as invitationApi from '../../services/api/invitation-api.js';
import Loading from '../../components/common/Loading.jsx';

const Invitations = () => {
  const [invitations, setInvitations] = useState([]);
  const [activeTab, setActiveTab] = useState('ALL');
  const [isLoading, setIsLoading] = useState(true);
  const [processingId, setProcessingId] = useState(null);

  const fetchInvitations = async () => {
    setIsLoading(true);
    try {
      const res = await invitationApi.getMyInvitations();
      if (res.success) {
        setInvitations(res.data || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchInvitations();
  }, []);

  const handleRespond = async (invitationId, status) => {
    setProcessingId(invitationId);
    try {
      await invitationApi.respondToInvitation(invitationId, status);
      await fetchInvitations();
    } catch (err) {
      alert(err.message || 'Failed to respond to invitation');
    } finally {
      setProcessingId(null);
    }
  };

  if (isLoading) return <Loading message="Loading invitations..." />;

  const filtered =
    activeTab === 'ALL'
      ? invitations
      : invitations.filter((inv) => inv.status === activeTab);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'ACCEPTED':
        return { label: 'Accepted', bg: 'bg-emerald-50 text-emerald-700 border-emerald-200' };
      case 'DECLINED':
        return { label: 'Declined', bg: 'bg-rose-50 text-rose-700 border-rose-200' };
      default:
        return { label: 'Pending', bg: 'bg-blue-50 text-blue-700 border-blue-200' };
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
      <div className="flex items-center justify-between pb-4 border-b border-slate-100">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Team Invitations</h1>
          <p className="text-xs text-slate-500 mt-1">
            Review invites from team leaders who want you in their squad
          </p>
        </div>
      </div>

      {/* Tabs (Screen 29 from Reference) */}
      <div className="flex items-center space-x-2 border-b border-slate-100 pb-2">
        {[
          { id: 'ALL', label: `All (${invitations.length})` },
          { id: 'PENDING', label: `Pending (${invitations.filter((i) => i.status === 'PENDING').length})` },
          { id: 'ACCEPTED', label: `Accepted (${invitations.filter((i) => i.status === 'ACCEPTED').length})` },
          { id: 'DECLINED', label: `Declined (${invitations.filter((i) => i.status === 'DECLINED').length})` },
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
          <Mail className="w-10 h-10 text-slate-300 mx-auto" />
          <h3 className="text-base font-bold text-slate-800">No Invitations Found</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            You don't have any invitations in this category. Complete your profile to attract team hosts!
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((inv) => {
            const status = getStatusBadge(inv.status);
            return (
              <div
                key={inv._id}
                className="bg-white rounded-2xl border border-slate-100 p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="space-y-1.5">
                  <div className="flex items-center space-x-2">
                    <span className="text-[10px] font-bold text-purple-600 bg-purple-50 px-2 py-0.5 rounded-md uppercase">
                      {inv.room?.type?.replace('_', ' ')}
                    </span>
                    <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${status.bg}`}>
                      {status.label}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900">{inv.room?.name}</h3>
                  <p className="text-xs text-slate-600">
                    <span className="font-semibold text-slate-700">Role Offered:</span> {inv.role || 'Member'} •{' '}
                    <span className="text-slate-500">From {inv.invitedBy?.name}</span>
                  </p>
                  {inv.message && (
                    <p className="text-xs text-slate-500 italic">"{inv.message}"</p>
                  )}
                  <span className="text-[10px] text-slate-400 block pt-1">
                    Invited on {new Date(inv.createdAt).toLocaleDateString()}
                  </span>
                </div>

                <div className="flex items-center space-x-2 shrink-0 self-end sm:self-center">
                  {inv.status === 'PENDING' ? (
                    <>
                      <button
                        disabled={processingId === inv._id}
                        onClick={() => handleRespond(inv._id, 'DECLINED')}
                        className="px-4 py-2 bg-slate-100 hover:bg-rose-50 hover:text-rose-600 text-slate-700 font-semibold rounded-xl text-xs transition-colors cursor-pointer"
                      >
                        Decline
                      </button>
                      <button
                        disabled={processingId === inv._id}
                        onClick={() => handleRespond(inv._id, 'ACCEPTED')}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl text-xs shadow-xs transition-colors cursor-pointer"
                      >
                        Accept & Join
                      </button>
                    </>
                  ) : (
                    <Link
                      to={inv.status === 'ACCEPTED' ? `/team/${inv.room?._id}` : `/rooms/${inv.room?._id}`}
                      className="inline-flex items-center space-x-1 px-4 py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-semibold rounded-xl border border-slate-200 transition-colors"
                    >
                      <span>{inv.status === 'ACCEPTED' ? 'Open Workspace' : 'View Room'}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Invitations;
