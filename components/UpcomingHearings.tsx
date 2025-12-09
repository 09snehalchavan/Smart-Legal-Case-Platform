import React from 'react';
import { UPCOMING_HEARINGS } from '../constants';
import type { Hearing } from '../types';

const UpcomingHearings: React.FC = () => {
  const getRelativeDateInfo = (dateString: string): { text: string; className: string } => {
    const today = new Date();
    const hearingDate = new Date(dateString);
    
    // Reset time part to compare dates only
    today.setHours(0, 0, 0, 0);
    hearingDate.setHours(0, 0, 0, 0);

    const diffTime = hearingDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      return { text: 'Today', className: 'text-red-500 font-bold' };
    }
    if (diffDays > 0) {
      return { text: `In ${diffDays} day${diffDays > 1 ? 's' : ''}`, className: 'text-yellow-600 font-bold' };
    }
    return { text: 'Date passed', className: 'text-slate-400' };
  };

  return (
    <div className="bg-white rounded-lg p-4">
      <h3 className="text-lg font-bold text-slate-800 mb-2 border-b border-slate-200 pb-2">Upcoming Hearings</h3>
      <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
        {UPCOMING_HEARINGS.length > 0 ? (
          UPCOMING_HEARINGS.map((hearing: Hearing, index: number) => {
            const { text, className } = getRelativeDateInfo(hearing.date);
            return (
              <div key={hearing.id} className="pt-2 first:pt-0">
                <p className="font-semibold text-slate-700 truncate">{hearing.title}</p>
                <p className="text-sm text-slate-500">Client: {hearing.client}</p>
                <p className={`text-sm ${className}`}>{text}</p>
              </div>
            );
          })
        ) : (
          <div className="text-center py-6 text-slate-500">
            <p>No upcoming hearings.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default UpcomingHearings;