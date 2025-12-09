import React from 'react';

const Overview: React.FC = () => {
  const currentDate = new Date().toLocaleDateString('en-US', {
    month: 'numeric',
    day: 'numeric',
    year: 'numeric',
  });

  const DonutSegment: React.FC<{
    radius: number;
    strokeWidth: number;
    percentage: number;
    rotation: number;
    color: string;
  }> = ({ radius, strokeWidth, percentage, rotation, color }) => {
    const circumference = 2 * Math.PI * radius;
    const strokeDasharray = `${(percentage / 100) * circumference} ${circumference}`;
    const transform = `rotate(${rotation} 50 50)`;

    return (
      <circle
        cx="50"
        cy="50"
        r={radius}
        fill="transparent"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeDasharray={strokeDasharray}
        strokeLinecap="round"
        transform={transform}
      />
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-bold text-slate-800">Overview</h3>
          <p className="text-sm text-slate-500">Date: {currentDate}</p>
        </div>
      </div>
      <div className="flex flex-col items-center">
        {/* ENHANCEMENT: Increased chart size for better visibility and prominence */}
        <div className="relative w-96 h-96">
          <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
             {/* Adjusted radius and stroke width for a bolder look on the larger chart */}
            <DonutSegment radius={40} strokeWidth={16} percentage={45} rotation={0} color="#3b82f6" />
            <DonutSegment radius={40} strokeWidth={16} percentage={15} rotation={162} color="#f97316" />
            <DonutSegment radius={40} strokeWidth={16} percentage={20} rotation={216} color="#10b981" />
            <DonutSegment radius={40} strokeWidth={16} percentage={20} rotation={288} color="#9ca3af" />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            {/* ENHANCEMENT: Increased font sizes to match the larger chart */}
            <span className="text-7xl font-bold text-slate-800">30</span>
            <span className="text-2xl text-slate-500">Cases</span>
          </div>
        </div>
        <p className="text-sm text-slate-500 mt-8 text-center">
          This graph is generated based on the current case data.
        </p>
      </div>
    </div>
  );
};

export default Overview;