import React from 'react';
import { STATS_DATA } from '../constants';
import type { StatCard } from '../types';

const DashboardStats: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
      {STATS_DATA.map((stat: StatCard, index: number) => (
        <div key={index} className="bg-white rounded-lg shadow-md p-6 flex justify-between items-center">
          <div>
            <p className="text-sm text-slate-500">{stat.title}</p>
            <p className="text-3xl font-bold text-slate-800 my-1">{stat.value}</p>
            <p className="text-xs text-slate-400">{stat.description}</p>
          </div>
          <div className="text-slate-300">
            <stat.icon className="w-8 h-8" />
          </div>
        </div>
      ))}
    </div>
  );
};

export default DashboardStats;
