
import React from 'react';
import EmailIcon from './icons/EmailIcon';

interface VerificationPendingPageProps {
  userEmail: string;
  onBackToLogin: () => void;
  // Fix: Add userType to props to match what is passed from App.tsx.
  userType: string;
}

// FIX: Added 'userType' to the destructured props to align with the interface.
const VerificationPendingPage: React.FC<VerificationPendingPageProps> = ({ userEmail, onBackToLogin, userType }) => {
  return (
    <div className="relative flex items-center justify-center min-h-screen bg-cover bg-center bg-fixed auth-bg">
      <div className="absolute inset-0 bg-slate-100/70"></div>
      <div className="relative w-full max-w-md p-8 space-y-6 bg-white/90 rounded-lg shadow-2xl backdrop-blur-sm text-center">
        <div className="flex flex-col items-center">
            <EmailIcon className="w-16 h-16 text-blue-600" />
            <h1 className="mt-4 text-2xl font-bold text-slate-900">Check Your Email</h1>
        </div>
        <p className="text-slate-700">
            A verification link has been sent to your email address:
        </p>
        <p className="font-semibold text-slate-800">{userEmail}</p>
        <p className="text-slate-500 text-sm">
            Please click the link in that email to activate your account. If you don't see it, be sure to check your spam folder.
        </p>
        <div>
            <button
              onClick={onBackToLogin}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Back to Login
            </button>
          </div>
      </div>
    </div>
  );
};

export default VerificationPendingPage;
