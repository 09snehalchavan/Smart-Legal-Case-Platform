import React, { useState } from 'react';
import ShieldIcon from './icons/ShieldIcon';

const ScalesIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-3.5 15.5L4 13l1.41-1.41L8.5 15.68 18.09 6.09 19.5 7.5l-11 11z" opacity="0" />
      <path d="M3 8l7.58 2.37-2.73 8.19L3 16.22V8zm18 0v8.22l-5.85 2.34-2.73-8.19L21 8zM12 3l-4 1.33V17h8V4.33L12 3zm0 2.69L13.93 7H10.07L12 5.69z" />
    </svg>
);
interface ForgotPasswordPageProps {
  onBackToLogin: () => void;
  onSubmit: (email: string) => Promise<void>;
  originPortal: 'lawyer' | 'client' | null;
}

const ForgotPasswordPage: React.FC<ForgotPasswordPageProps> = ({ onBackToLogin, onSubmit, originPortal }) => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (email) {
      setIsLoading(true);
      try {
        await onSubmit(email);
        setIsSubmitted(true);
      } catch (error) {
        setError("Failed to send password reset email. Please check the address and try again.");
      } finally {
        setIsLoading(false);
      }
    } else {
        setError("Please enter your email address.");
    }
  };
  
  const isClientPortal = originPortal === 'client';
  const headerText = isClientPortal ? "Client Password Reset" : "Lawyer Password Reset";
  const portalName = isClientPortal ? "Client Access Portal" : "Smart Legal Case Platform";
  const icon = isClientPortal ? <ShieldIcon className="w-12 h-12 text-slate-800" /> : <ScalesIcon className="w-12 h-12 text-slate-800" />;

  return (
    <div className="relative flex items-center justify-center min-h-screen bg-cover bg-center bg-fixed auth-bg">
      <div className="absolute inset-0 bg-slate-100/70"></div>
      <div className="relative w-full max-w-md p-8 space-y-6 bg-white/90 rounded-lg shadow-2xl backdrop-blur-sm">
        <div className="flex flex-col items-center">
          {icon}
          <h1 className="mt-2 text-2xl font-bold text-center text-slate-900">{portalName}</h1>
        </div>
        <h2 className="text-xl font-semibold text-center text-slate-700">{headerText}</h2>
        
        {isSubmitted ? (
            <div className="text-center">
                <p className="text-slate-700">
                    If an account exists for <strong>{email}</strong>, a password reset link has been sent. Please check your inbox.
                </p>
            </div>
        ) : (
            <>
                <p className="text-sm text-center text-slate-500">
                    Enter your email address to begin the password reset process.
                </p>
                <form className="space-y-6" onSubmit={handleSubmit}>
                    <div>
                    <label htmlFor="email" className="block text-sm font-medium text-slate-600">
                        Email address
                    </label>
                    <input
                        id="email"
                        name="email"
                        type="email"
                        autoComplete="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="mt-1 block w-full px-3 py-2 border border-slate-300 bg-slate-50 text-slate-900 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        placeholder="you@example.com"
                    />
                    </div>
                    
                    {error && <p className="text-sm text-red-600 text-center">{error}</p>}

                    <div>
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-slate-400"
                    >
                        {isLoading ? 'Submitting...' : 'Request Reset'}
                    </button>
                    </div>
                </form>
            </>
        )}
        
        <div className="text-sm text-center">
            <a href="#" onClick={(e) => { e.preventDefault(); onBackToLogin(); }} className="font-medium text-blue-600 hover:text-blue-800">
                &larr; Back to Login
            </a>
        </div>

      </div>
    </div>
  );
};

export default ForgotPasswordPage;