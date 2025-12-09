import React, { useState } from 'react';

interface MfaPageProps {
  onVerifySuccess: () => void;
  onBackToLogin: () => void;
  userEmail: string;
}

const ScalesIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-3.5 15.5L4 13l1.41-1.41L8.5 15.68 18.09 6.09 19.5 7.5l-11 11z" opacity="0" />
      <path d="M3 8l7.58 2.37-2.73 8.19L3 16.22V8zm18 0v8.22l-5.85 2.34-2.73-8.19L21 8zM12 3l-4 1.33V17h8V4.33L12 3zm0 2.69L13.93 7H10.07L12 5.69z" />
    </svg>
);

const MfaPage: React.FC<MfaPageProps> = ({ onVerifySuccess, onBackToLogin, userEmail }) => {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const CORRECT_CODE = '123456'; // Hardcoded for simulation

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (code === CORRECT_CODE) {
      onVerifySuccess();
    } else {
      setError('Invalid authentication code. Please try again.');
    }
  };

  return (
    <div className="relative flex items-center justify-center min-h-screen bg-cover bg-center bg-fixed auth-bg">
      <div className="absolute inset-0 bg-slate-100/70"></div>
      <div className="relative w-full max-w-md p-8 space-y-6 bg-white/90 rounded-lg shadow-2xl backdrop-blur-sm">
        <div className="flex flex-col items-center">
            <ScalesIcon className="w-12 h-12 text-slate-800" />
            <h1 className="mt-2 text-2xl font-bold text-center text-slate-900">Smart Legal Case Platform</h1>
        </div>
        <h2 className="text-xl font-semibold text-center text-slate-700">Two-Factor Authentication</h2>
        <p className="text-sm text-center text-slate-500">
            Enter the 6-digit code from your authenticator app for <strong>{userEmail}</strong>.
        </p>
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label
              htmlFor="mfa-code"
              className="block text-sm font-medium text-slate-600"
            >
              Authentication Code
            </label>
            <input
              id="mfa-code"
              name="mfa-code"
              type="text"
              inputMode="numeric"
              autoComplete="one-time-code"
              required
              value={code}
              onChange={(e) => setCode(e.target.value)}
              maxLength={6}
              className="mt-1 block w-full px-3 py-2 border border-slate-300 bg-slate-50 text-slate-900 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-center tracking-[0.5em]"
            />
          </div>

          {error && <p className="text-sm text-red-600 text-center">{error}</p>}

          <div>
            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Verify
            </button>
          </div>
        </form>
         <div className="text-sm text-center">
            <a href="#" onClick={(e) => { e.preventDefault(); onBackToLogin(); }} className="font-medium text-blue-600 hover:text-blue-800">
                &larr; Back to Login
            </a>
        </div>
      </div>
    </div>
  );
};

export default MfaPage;