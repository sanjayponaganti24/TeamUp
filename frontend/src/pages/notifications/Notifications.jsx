import React from 'react';
import { Link } from 'react-router-dom';
import { Bell, Check, CheckCircle2, Clock, Send, Mail, Users, ArrowRight } from 'lucide-react';
import { useNotification } from '../../context/NotificationContext.jsx';

const Notifications = () => {
  const { notifications, unreadCount, markRead, markAllRead } = useNotification();

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'JOIN_REQUEST':
      case 'REQUEST_ACCEPTED':
      case 'REQUEST_REJECTED':
        return { icon: Send, color: 'text-blue-600 bg-blue-50' };
      case 'INVITATION':
      case 'INVITATION_ACCEPTED':
      case 'INVITATION_DECLINED':
        return { icon: Mail, color: 'text-purple-600 bg-purple-50' };
      case 'MEMBER_JOINED':
      case 'MEMBER_LEFT':
        return { icon: Users, color: 'text-emerald-600 bg-emerald-50' };
      case 'DEADLINE_WARNING':
      case 'DEADLINE_REACHED':
        return { icon: Clock, color: 'text-amber-600 bg-amber-50' };
      default:
        return { icon: Bell, color: 'text-slate-600 bg-slate-50' };
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
      <div className="flex items-center justify-between pb-4 border-b border-slate-100">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Notifications</h1>
          <p className="text-xs text-slate-500 mt-1">
            Real-time updates regarding join requests, invitations, and team events
          </p>
        </div>

        {unreadCount > 0 && (
          <button
            onClick={markAllRead}
            className="inline-flex items-center space-x-1.5 px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
          >
            <Check className="w-3.5 h-3.5" />
            <span>Mark all read</span>
          </button>
        )}
      </div>

      {notifications.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-100 p-12 text-center space-y-3">
          <Bell className="w-10 h-10 text-slate-300 mx-auto" />
          <h3 className="text-base font-bold text-slate-800">No Notifications</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            You're all caught up! New invites and application updates will appear here in real time.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {notifications.map((n) => {
            const { icon: Icon, color } = getNotificationIcon(n.type);
            return (
              <div
                key={n._id}
                onClick={() => !n.read && markRead(n._id)}
                className={`bg-white rounded-2xl border p-4 sm:p-5 shadow-xs transition-all flex items-start justify-between gap-4 ${
                  !n.read ? 'border-blue-200 bg-blue-50/20' : 'border-slate-100'
                }`}
              >
                <div className="flex items-start space-x-3.5">
                  <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 ${color}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <h4 className="text-xs sm:text-sm font-bold text-slate-900">{n.title}</h4>
                      {!n.read && (
                        <span className="w-2 h-2 rounded-full bg-blue-600 shrink-0" />
                      )}
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">{n.message}</p>
                    <span className="text-[10px] text-slate-400 block pt-0.5">
                      {new Date(n.createdAt).toLocaleDateString()} at{' '}
                      {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>

                {n.link && (
                  <Link
                    to={n.link}
                    className="p-2 text-slate-400 hover:text-blue-600 hover:bg-slate-50 rounded-xl transition-colors shrink-0"
                  >
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Notifications;
