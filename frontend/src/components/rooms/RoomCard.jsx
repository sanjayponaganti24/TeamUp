import React from 'react';
import { Link } from 'react-router-dom';
import { Users, Calendar, ArrowRight, Sparkles } from 'lucide-react';

const RoomCard = ({ room, matchScore = null, reasons = [], onJoinClick }) => {
  const memberCount = room.members?.length || 1;
  const isFull = memberCount >= room.capacity;
  const deadlineDate = new Date(room.deadline);
  const isExpired = new Date() > deadlineDate;

  const getTypeBadgeColor = (type) => {
    switch (type) {
      case 'HACKATHON':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'RESEARCH':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'CLUB':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'PERSONAL_PROJECT':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'COMPETITION':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  const getStatusBadge = () => {
    if (isExpired) return { label: 'Expired', bg: 'bg-rose-50 text-rose-600 border-rose-100' };
    if (isFull) return { label: 'Full', bg: 'bg-amber-50 text-amber-600 border-amber-100' };
    return { label: 'Active', bg: 'bg-emerald-50 text-emerald-600 border-emerald-100' };
  };

  const status = getStatusBadge();

  return (
    <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between group">
      <div>
        {/* Header: Type and Status */}
        <div className="flex items-center justify-between mb-3">
          <span
            className={`text-[11px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-lg border ${getTypeBadgeColor(
              room.type
            )}`}
          >
            {room.type?.replace('_', ' ')}
          </span>
          <div className="flex items-center space-x-2">
            {matchScore !== null && (
              <span className="flex items-center space-x-1 text-xs font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full border border-blue-100">
                <Sparkles className="w-3 h-3 text-blue-500" />
                <span>{matchScore}% Match</span>
              </span>
            )}
            <span
              className={`text-[11px] font-medium px-2.5 py-0.5 rounded-full border ${status.bg}`}
            >
              {status.label}
            </span>
          </div>
        </div>

        {/* Room Title & Description */}
        <h3 className="text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-1">
          {room.name}
        </h3>
        <p className="text-xs text-slate-500 mt-1.5 line-clamp-2 leading-relaxed">
          {room.description}
        </p>

        {/* Reasons (if provided by matching engine) */}
        {reasons && reasons.length > 0 && (
          <div className="mt-3 p-2 bg-slate-50 rounded-xl space-y-1">
            {reasons.slice(0, 2).map((reason, idx) => (
              <p key={idx} className="text-[11px] font-medium text-emerald-700 flex items-center">
                {reason}
              </p>
            ))}
          </div>
        )}

        {/* Required Skills Chips */}
        {room.requiredSkills && room.requiredSkills.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-3.5">
            {room.requiredSkills.slice(0, 4).map((skill, i) => (
              <span
                key={i}
                className="text-[11px] bg-slate-50 text-slate-600 font-medium px-2 py-0.5 rounded-md border border-slate-100"
              >
                {skill}
              </span>
            ))}
            {room.requiredSkills.length > 4 && (
              <span className="text-[11px] text-slate-400 self-center">
                +{room.requiredSkills.length - 4}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Footer Info & Actions */}
      <div className="pt-4 mt-4 border-t border-slate-50 flex items-center justify-between text-xs text-slate-500">
        <div className="flex items-center space-x-3.5">
          <div className="flex items-center space-x-1.5 text-slate-600 font-medium">
            <Users className="w-3.5 h-3.5 text-slate-400" />
            <span>
              {memberCount} / {room.capacity}
            </span>
          </div>
          <div className="flex items-center space-x-1 text-slate-400">
            <Calendar className="w-3.5 h-3.5" />
            <span>{deadlineDate.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {onJoinClick && !isFull && !isExpired && (
            <button
              onClick={() => onJoinClick(room)}
              className="px-3 py-1.5 bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white font-medium rounded-lg text-xs transition-colors"
            >
              Join
            </button>
          )}
          <Link
            to={`/rooms/${room._id}`}
            className="flex items-center space-x-1 text-xs font-semibold text-slate-700 hover:text-blue-600 py-1.5 px-2 rounded-lg hover:bg-slate-50 transition-colors"
          >
            <span>View</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RoomCard;
