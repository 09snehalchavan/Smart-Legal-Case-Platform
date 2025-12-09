
import React, { useState } from 'react';
import ViewIcon from './icons/ViewIcon';
import EyeOffIcon from './icons/EyeOffIcon';

interface LoginPageProps {
  onLogin: (email: string, pass: string) => Promise<void>;
  onForgotPassword: () => void;
  onGoToRegister: () => void;
  onBack: () => void;
}

const ScalesIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
    <svg className={className} xmlns="http://www.w.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-3.5 15.5L4 13l1.41-1.41L8.5 15.68 18.09 6.09 19.5 7.5l-11 11z" opacity="0" />
      <path d="M3 8l7.58 2.37-2.73 8.19L3 16.22V8zm18 0v8.22l-5.85 2.34-2.73-8.19L21 8zM12 3l-4 1.33V17h8V4.33L12 3zm0 2.69L13.93 7H10.07L12 5.69z" />
    </svg>
);

const LoginPage: React.FC<LoginPageProps> = ({ onLogin, onForgotPassword, onGoToRegister, onBack }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!email || !password) {
      setError('Please enter both email and password.');
      return;
    }

    setIsLoading(true);
    try {
      await onLogin(email, password);
    } catch (err: any) {
      // Generic error handling since Firebase is removed
      setError(err.message || 'Invalid email or password.');
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
            <ScalesIcon className="w-12 h-12 text-slate-800" />
            <h1 className="mt-2 text-2xl font-bold text-center text-slate-900">Smart Legal Case Platform</h1>
        </div>
        <h2 className="text-xl font-semibold text-center text-slate-700">Lawyer Login</h2>
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-slate-600"
            >
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
              className="mt-1 block w-full px-3 py-2 border border-slate-300 bg-slate-50 rounded-md shadow-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <div className="flex items-center justify-between">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-slate-600"
              >
                Password
              </label>
              <div className="text-sm">
                <a href="#" onClick={(e) => { e.preventDefault(); onForgotPassword(); }} className="font-medium text-blue-600 hover:text-blue-800">
                  Forgot your password?
                </a>
              </div>
            </div>
            <div className="relative mt-1">
              <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="block w-full px-3 py-2 border border-slate-300 bg-slate-50 rounded-md shadow-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword 
                    ? <EyeOffIcon className="h-5 w-5 text-slate-500" /> 
                    : <ViewIcon className="h-5 w-5 text-slate-500" />
                }
              </button>
            </div>
          </div>

          {error && <p className="text-sm text-red-600 text-center">{error}</p>}

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-slate-400 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Signing in...' : 'Sign in'}
            </button>
          </div>
        </form>
        <div className="text-sm text-center">
            <p className="text-slate-500">
                Don't have an account?{' '}
                <a href="#" onClick={(e) => { e.preventDefault(); onGoToRegister(); }} className="font-medium text-blue-600 hover:text-blue-800">
                    Sign up
                </a>
            </p>
            <p className="mt-2">
                <a href="#" onClick={(e) => { e.preventDefault(); onBack(); }} className="font-medium text-slate-500 hover:text-slate-700">
                    &larr; Back to Portal Selection
                </a>
            </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
