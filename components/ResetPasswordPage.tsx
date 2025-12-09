import React, { useState, useEffect } from 'react';
import CheckIcon from './icons/CheckIcon';
import CrossIcon from './icons/CrossIcon';
import ShieldIcon from './icons/ShieldIcon';
import ViewIcon from './icons/ViewIcon';
import EyeOffIcon from './icons/EyeOffIcon';

const ScalesIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-3.5 15.5L4 13l1.41-1.41L8.5 15.68 18.09 6.09 19.5 7.5l-11 11z" opacity="0" />
      <path d="M3 8l7.58 2.37-2.73 8.19L3 16.22V8zm18 0v8.22l-5.85 2.34-2.73-8.19L21 8zM12 3l-4 1.33V17h8V4.33L12 3zm0 2.69L13.93 7H10.07L12 5.69z" />
    </svg>
);

interface ResetPasswordPageProps {
  onReset: (password: string) => void;
  onBackToLogin: () => void;
  userEmail: string;
  originPortal: 'lawyer' | 'client' | null;
}

const PasswordRequirement: React.FC<{ isValid: boolean; text: string }> = ({ isValid, text }) => (
    <li className={`flex items-center text-sm ${isValid ? 'text-green-600' : 'text-slate-500'}`}>
        <CheckIcon className={`w-4 h-4 mr-2 ${isValid ? 'text-green-600' : 'text-slate-400'}`} />
        {text}
    </li>
);

const ResetPasswordPage: React.FC<ResetPasswordPageProps> = ({ onReset, onBackToLogin, userEmail, originPortal }) => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [passwordValidation, setPasswordValidation] = useState({
    minLength: false,
    uppercase: false,
    lowercase: false,
    number: false,
    specialChar: false,
  });
  const [passwordsMatch, setPasswordsMatch] = useState(true);

  useEffect(() => {
    setPasswordValidation({
      minLength: password.length >= 12,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /[0-9]/.test(password),
      specialChar: /[^A-Za-z0-9]/.test(password),
    });
  }, [password]);

  useEffect(() => {
    if (confirmPassword) {
      setPasswordsMatch(password === confirmPassword);
    } else {
      setPasswordsMatch(true);
    }
  }, [password, confirmPassword]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const isPasswordStrong = Object.values(passwordValidation).every(Boolean);
    if (!isPasswordStrong) {
      setError('Please ensure your new password meets all requirements.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    
    onReset(password);
  };
  
  const isClientPortal = originPortal === 'client';
  const portalName = isClientPortal ? "Client Access Portal" : "Smart Legal Case Platform";
  const icon = isClientPortal ? <ShieldIcon className="w-12 h-12 text-slate-800" /> : <ScalesIcon className="w-12 h-12 text-slate-800" />;

  return (
    <div className="relative flex items-center justify-center min-h-screen bg-cover bg-center bg-fixed auth-bg">
      <div className="absolute inset-0 bg-slate-100/70"></div>
      <div className="relative w-full max-w-md p-8 space-y-4 bg-white/90 rounded-lg shadow-2xl backdrop-blur-sm">
        <div className="flex flex-col items-center">
          {icon}
          <h1 className="mt-2 text-2xl font-bold text-center text-slate-900">{portalName}</h1>
        </div>
        <h2 className="text-xl font-semibold text-center text-slate-700">Reset Your Password</h2>
        <p className="text-sm text-center text-slate-500">
            Create a new, strong password for your account: <strong>{userEmail}</strong>
        </p>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-slate-600">
              New Password
            </label>
            <div className="relative mt-1">
                <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="new-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="block w-full px-3 py-2 border border-slate-300 bg-slate-50 text-slate-900 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
                <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                >
                    {showPassword ? <EyeOffIcon className="h-5 w-5 text-slate-500" /> : <ViewIcon className="h-5 w-5 text-slate-500" />}
                </button>
            </div>
          </div>
          <div className="bg-slate-100 p-3 rounded-md border border-slate-200">
            <ul className="space-y-1">
              <PasswordRequirement isValid={passwordValidation.minLength} text="At least 12 characters" />
              <PasswordRequirement isValid={passwordValidation.lowercase} text="A lowercase letter (a-z)" />
              <PasswordRequirement isValid={passwordValidation.uppercase} text="An uppercase letter (A-Z)" />
              <PasswordRequirement isValid={passwordValidation.number} text="A number (0-9)" />
              <PasswordRequirement isValid={passwordValidation.specialChar} text="A special character (!, $, #, etc.)" />
            </ul>
          </div>
          <div>
            <label htmlFor="confirm-password" className="block text-sm font-medium text-slate-600">
              Confirm New Password
            </label>
            <input
              id="confirm-password"
              name="confirm-password"
              type="password"
              autoComplete="new-password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••••••"
              className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm placeholder-slate-400 bg-slate-50 text-slate-900 focus:outline-none sm:text-sm ${!passwordsMatch ? 'border-red-500 ring-red-500 focus:border-red-500 focus:ring-red-500' : 'border-slate-300 focus:ring-blue-500 focus:border-blue-500'}`}
            />
            {!passwordsMatch && confirmPassword && (
              <p className="mt-2 text-sm text-red-600">Passwords do not match.</p>
            )}
          </div>

          {error && <p className="text-sm text-red-600 text-center">{error}</p>}

          <div>
            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Set New Password
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

export default ResetPasswordPage;