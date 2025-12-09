
import React, { useState, useEffect } from 'react';
import CheckIcon from './icons/CheckIcon';
import ShieldIcon from './icons/ShieldIcon';
import KeyIcon from './icons/KeyIcon';
import CrossIcon from './icons/CrossIcon';
import ViewIcon from './icons/ViewIcon';
import EyeOffIcon from './icons/EyeOffIcon';

interface ClientRegistrationPageProps {
  onRegister: (email: string, pass: string) => Promise<void>;
  onBackToLogin: () => void;
}

const PasswordRequirement: React.FC<{ isValid: boolean; text: string }> = ({ isValid, text }) => (
    <li className={`flex items-center text-sm transition-colors ${isValid ? 'text-green-600' : 'text-red-500'}`}>
        {isValid ? <CheckIcon className="w-4 h-4 mr-2 text-green-600" /> : <CrossIcon className="w-4 h-4 mr-2 text-red-500" />}
        {text}
    </li>
);

const ClientRegistrationPage: React.FC<ClientRegistrationPageProps> = ({ onRegister, onBackToLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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
  
  const generateStrongPassword = () => {
    const lower = 'abcdefghijklmnopqrstuvwxyz';
    const upper = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const numbers = '0123456789';
    const special = '!@#$%^&*()_+-=[]{}|;:,.<>?';
    const all = lower + upper + numbers + special;
    const length = 16;

    let pass = '';
    pass += lower[Math.floor(Math.random() * lower.length)];
    pass += upper[Math.floor(Math.random() * upper.length)];
    pass += numbers[Math.floor(Math.random() * numbers.length)];
    pass += special[Math.floor(Math.random() * special.length)];

    for (let i = 4; i < length; i++) {
      pass += all[Math.floor(Math.random() * all.length)];
    }
    
    // Shuffle to avoid predictable pattern
    const shuffledPass = pass.split('').sort(() => 0.5 - Math.random()).join('');
    setPassword(shuffledPass);
    setConfirmPassword(shuffledPass);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const isPasswordStrong = Object.values(passwordValidation).every(Boolean);

    if (!isPasswordStrong) {
        setError('Please ensure all password requirements are met.');
        return;
    }

    if (password !== confirmPassword) {
        setError('Passwords do not match.');
        return;
    }
    
    setIsLoading(true);
    try {
      await onRegister(email, password);
    } catch (err: any) {
      setError(err.message || 'Failed to create account. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative flex items-center justify-center min-h-screen bg-cover bg-center bg-fixed auth-bg">
      <div className="absolute inset-0 bg-slate-100/70"></div>
      <div className="relative w-full max-w-md p-8 space-y-6 bg-white/90 rounded-lg shadow-2xl backdrop-blur-sm">
        <div className="flex flex-col items-center">
            <div className="bg-slate-200 p-3 rounded-full mb-3">
                 <ShieldIcon className="w-8 h-8 text-slate-700" />
            </div>
            <h1 className="text-2xl font-bold text-center text-slate-900">Client Access Portal</h1>
        </div>
        <h2 className="text-xl font-semibold text-center text-slate-700">Create Account</h2>
        <form className="space-y-4" onSubmit={handleSubmit}>
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
              placeholder="you@example.com"
              className="mt-1 block w-full px-3 py-2 border border-slate-300 bg-slate-50 text-slate-900 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <div className="flex items-center justify-between">
              <label htmlFor="password" className="block text-sm font-medium text-slate-600">
                Password
              </label>
              <button type="button" onClick={generateStrongPassword} className="flex items-center gap-1 text-xs font-medium text-blue-600 hover:text-blue-800">
                  <KeyIcon className="w-3 h-3"/>
                  Suggest
              </button>
            </div>
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
            <label htmlFor="confirm-password"className="block text-sm font-medium text-slate-600">
              Confirm Password
            </label>
            <div className="relative mt-1">
              <input
                id="confirm-password"
                name="confirm-password"
                type={showConfirmPassword ? 'text' : 'password'}
                autoComplete="new-password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••••••"
                className={`block w-full px-3 py-2 border rounded-md shadow-sm placeholder-slate-400 bg-slate-50 text-slate-900 focus:outline-none sm:text-sm ${!passwordsMatch ? 'border-red-500 ring-red-500 focus:border-red-500 focus:ring-red-500' : 'border-slate-300 focus:ring-blue-500 focus:border-blue-500'}`}
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                aria-label={showConfirmPassword ? "Hide password" : "Show password"}
              >
                {showConfirmPassword ? <EyeOffIcon className="h-5 w-5 text-slate-500" /> : <ViewIcon className="h-5 w-5 text-slate-500" />}
              </button>
            </div>
             {!passwordsMatch && confirmPassword && (
                <p className="mt-2 text-sm text-red-600">Passwords do not match.</p>
            )}
          </div>
         
          {error && <p className="text-sm text-red-600 text-center">{error}</p>}

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-slate-400"
            >
              {isLoading ? 'Creating Account...' : 'Create Account'}
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

export default ClientRegistrationPage;
