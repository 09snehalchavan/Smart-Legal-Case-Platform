
import React from 'react';
import CaseDistributionChart from './CaseDistributionChart';

interface CaseAnalyticsProps {
  onBack: () => void;
}

const CaseAnalytics: React.FC<CaseAnalyticsProps> = ({ onBack }) => {
  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-slate-800">Case Analytics</h1>
        <button
          onClick={onBack}
          className="bg-white text-slate-700 font-semibold py-2 px-4 rounded-lg border border-slate-300 hover:bg-slate-50 transition-colors text-sm"
        >
          &larr; Back to Dashboard
        </button>
      </div>
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold text-slate-800 mb-4">Case Distribution</h2>
        <CaseDistributionChart />
      </div>
    </div>
  );
};

export default CaseAnalytics;
