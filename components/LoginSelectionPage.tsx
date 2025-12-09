
import React from 'react';

interface LoginSelectionPageProps {
  onSelectLawyer: () => void;
  onSelectClient: () => void;
  onBack: () => void;
}

const ScalesIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-3.5 15.5L4 13l1.41-1.41L8.5 15.68 18.09 6.09 19.5 7.5l-11 11z" opacity="0" />
      <path d="M3 8l7.58 2.37-2.73 8.19L3 16.22V8zm18 0v8.22l-5.85 2.34-2.73-8.19L21 8zM12 3l-4 1.33V17h8V4.33L12 3zm0 2.69L13.93 7H10.07L12 5.69z" />
    </svg>
);

const LoginSelectionPage: React.FC<LoginSelectionPageProps> = ({ onSelectLawyer, onSelectClient, onBack }) => {
  return (
    <div className="relative flex items-center justify-center min-h-screen bg-cover bg-center bg-fixed auth-bg">
      <div className="absolute inset-0 bg-slate-100/70"></div>
      <div className="relative w-full max-w-sm p-8 space-y-8 bg-white/90 rounded-lg shadow-2xl backdrop-blur-sm text-center z-10">
        <div className="flex flex-col items-center">
            <ScalesIcon className="w-12 h-12 text-slate-800" />
            <h1 className="mt-2 text-2xl font-bold text-slate-900">Smart Legal Case Platform</h1>
        </div>
        
        <h2 className="text-xl font-semibold text-slate-700">Select Your Portal</h2>
        
        <div className="space-y-4">
            <button
              onClick={onSelectLawyer}
              className="w-full flex justify-center py-3 px-4 border border-slate-300 rounded-md shadow-sm text-lg font-medium text-slate-800 bg-slate-200 hover:bg-slate-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-400"
            >
              Lawyer Portal
            </button>
            <button
              onClick={onSelectClient}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-lg font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Client Portal
            </button>
            <div className="pt-2 border-t border-slate-200">
                <button
                onClick={onBack}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md text-sm font-medium text-slate-600 hover:text-slate-800 hover:bg-slate-100 focus:outline-none transition-colors"
                >
                &larr; Back to Home
                </button>
            </div>
        </div>
      </div>
    </div>
  );
};

export default LoginSelectionPage;
