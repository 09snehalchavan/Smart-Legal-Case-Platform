import React from 'react';
import { UPCOMING_TASKS } from '../constants';
import type { Task } from '../types';

const UpcomingDeadlines: React.FC = () => {
  // Filter for incomplete tasks
  const pendingTasks = UPCOMING_TASKS.filter(task => !task.completed).slice(0, 5);

  return (
    <div className="bg-white rounded-lg p-4 shadow-sm border border-slate-100">
      <h3 className="text-lg font-bold text-slate-800 mb-3 border-b border-slate-200 pb-2">Priority Tasks</h3>
      <div className="space-y-3">
        {pendingTasks.length > 0 ? (
          pendingTasks.map((task: Task) => (
            <div key={task.id} className="flex items-start gap-3 pb-3 border-b border-slate-50 last:border-0">
              <div className="w-2 h-2 mt-1.5 rounded-full bg-red-500 flex-shrink-0" />
              <div>
                <p className="text-sm font-semibold text-slate-700">{task.title}</p>
                <p className="text-xs text-slate-500 mt-0.5">{task.details}</p>
              </div>
            </div>
          ))
        ) : (
          <p className="text-sm text-slate-500 text-center py-2">No pending tasks.</p>
        )}
      </div>
    </div>
  );
};

export default UpcomingDeadlines;
