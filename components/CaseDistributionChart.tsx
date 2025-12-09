
import React from 'react';
import { CASE_ANALYTICS_DATA } from '../constants';
import type { CaseAnalyticsData } from '../types';

const CaseDistributionChart: React.FC = () => {
  const maxValue = 12;
  const yAxisLabels = [0, 3, 6, 9, 12];

  return (
    <div className="w-full">
      <div className="flex" style={{ height: '300px' }}>
        {/* Y-Axis Labels */}
        <div className="flex flex-col justify-between h-full text-right text-xs text-slate-500 pr-4 w-10">
          {yAxisLabels.slice().reverse().map(label => (
            <span key={label} className={label === 0 ? 'mb-[-6px]' : '-translate-y-1/2'}>{label}</span>
          ))}
        </div>

        {/* Chart Area */}
        <div className="flex-1 flex border-l border-b border-slate-200">
          <div className="w-full h-full flex justify-around items-end relative px-2 gap-2">
            {/* Grid Lines */}
            {yAxisLabels.slice(1).map(label => (
              <div
                key={`grid-${label}`}
                className="absolute w-full border-t border-dashed border-slate-200 left-0"
                style={{ bottom: `calc(${(label / maxValue) * 100}% - 1px)` }}
              ></div>
            ))}
            
            {/* Bars */}
            {CASE_ANALYTICS_DATA.map((data: CaseAnalyticsData) => (
              <div key={data.category} className="relative h-full w-full flex justify-center items-end group">
                 <div className="absolute top-0 left-0 w-full h-full bg-slate-100 opacity-0 group-hover:opacity-100 transition-opacity rounded-t-md"></div>
                 {/* Tooltip */}
                  <div className="absolute bottom-full mb-2 w-max bg-white p-2 rounded-md shadow-lg border border-slate-200 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                      <p className="font-bold text-sm text-slate-800">{data.category}</p>
                      <p className="text-xs text-blue-600 font-semibold">Case Count: {data.count}</p>
                  </div>
                <div className="relative w-1/2 bg-blue-500" style={{ height: `${(data.count / maxValue) * 100}%` }}></div>
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* X-Axis Labels */}
      <div className="flex pl-10 mt-2">
        <div className="flex-1 flex justify-around px-2 gap-2">
            {CASE_ANALYTICS_DATA.map((data) => (
                <div key={data.category} className="text-xs text-slate-500 text-center w-full">
                    {data.category}
                </div>
            ))}
        </div>
      </div>
      {/* Legend */}
      <div className="flex justify-center items-center mt-8">
        <div className="w-3 h-3 bg-blue-500 mr-2 rounded-sm"></div>
        <span className="text-sm text-slate-600">Case Count</span>
      </div>
    </div>
  );
};

export default CaseDistributionChart;
