import React from 'react';
import { Sparkles, CheckCircle2 } from 'lucide-react';

const MatchScore = ({ score = 85, reasons = [] }) => {
  const getScoreColor = (val) => {
    if (val >= 80) return 'text-blue-600 bg-blue-50 border-blue-200';
    if (val >= 60) return 'text-emerald-600 bg-emerald-50 border-emerald-200';
    return 'text-amber-600 bg-amber-50 border-amber-200';
  };

  return (
    <div className="p-4 rounded-2xl bg-white border border-slate-100 shadow-xs">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-2">
          <Sparkles className="w-4 h-4 text-blue-500" />
          <span className="text-sm font-bold text-slate-800">Match Compatibility</span>
        </div>
        <span
          className={`px-3 py-1 rounded-full text-xs font-extrabold border ${getScoreColor(
            score
          )}`}
        >
          {score}% Match
        </span>
      </div>

      {reasons && reasons.length > 0 && (
        <div className="mt-3 space-y-1.5">
          {reasons.map((reason, idx) => (
            <div key={idx} className="flex items-center space-x-2 text-xs text-slate-600">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
              <span>{reason.replace(/^✓\s*/, '')}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MatchScore;
