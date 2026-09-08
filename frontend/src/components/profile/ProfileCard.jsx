import React from 'react';
import { User, Briefcase, GraduationCap, CheckCircle } from 'lucide-react';

const ProfileCard = ({ student, onInvite, matchScore = null, reasons = [] }) => {
  const getAvailabilityBadge = (status) => {
    switch (status) {
      case 'AVAILABLE':
        return { label: 'Available', bg: 'bg-emerald-50 text-emerald-700 border-emerald-200' };
      case 'WAITING':
        return { label: 'Waiting', bg: 'bg-amber-50 text-amber-700 border-amber-200' };
      default:
        return { label: 'Hold', bg: 'bg-slate-100 text-slate-700 border-slate-200' };
    }
  };

  const avail = getAvailabilityBadge(student.availability);

  return (
    <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between">
      <div>
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-full bg-linear-to-tr from-blue-500 to-indigo-500 text-white font-bold text-lg flex items-center justify-center shadow-xs">
              {student.name ? student.name.charAt(0).toUpperCase() : 'S'}
            </div>
            <div>
              <h4 className="font-bold text-slate-900 text-sm">{student.name}</h4>
              <p className="text-xs text-slate-500 flex items-center space-x-1 mt-0.5">
                <GraduationCap className="w-3.5 h-3.5 text-slate-400" />
                <span>
                  {student.branch || 'Engineering'} • Year {student.year || 2}
                </span>
              </p>
            </div>
          </div>

          <span
            className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${avail.bg}`}
          >
            {avail.label}
          </span>
        </div>

        {matchScore !== null && (
          <div className="mt-3.5 p-2 bg-blue-50/60 rounded-xl border border-blue-100/60 flex items-center justify-between">
            <span className="text-xs font-bold text-blue-700">{matchScore}% Match</span>
            {reasons && reasons.length > 0 && (
              <span className="text-[11px] text-blue-600 truncate ml-2 font-medium">
                {reasons[0]}
              </span>
            )}
          </div>
        )}

        {/* Roles */}
        {student.preferredRoles && student.preferredRoles.length > 0 && (
          <div className="flex items-center space-x-1 text-xs text-slate-600 mt-3 font-medium">
            <Briefcase className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="truncate">{student.preferredRoles.join(', ')}</span>
          </div>
        )}

        {/* Skills Chips */}
        {student.skills && student.skills.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-3">
            {student.skills.slice(0, 4).map((skill, i) => (
              <span
                key={i}
                className="text-[11px] bg-slate-50 text-slate-600 font-medium px-2 py-0.5 rounded-md border border-slate-100"
              >
                {skill}
              </span>
            ))}
            {student.skills.length > 4 && (
              <span className="text-[11px] text-slate-400 self-center">
                +{student.skills.length - 4}
              </span>
            )}
          </div>
        )}
      </div>

      <div className="mt-5 pt-3.5 border-t border-slate-50 flex items-center justify-end">
        {onInvite && (
          <button
            onClick={() => onInvite(student)}
            className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors"
          >
            Invite to Team
          </button>
        )}
      </div>
    </div>
  );
};

export default ProfileCard;
