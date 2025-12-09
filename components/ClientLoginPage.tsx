import React, { useState } from 'react';
import ShieldIcon from './icons/ShieldIcon';
import ViewIcon from './icons/ViewIcon';
import EyeOffIcon from './icons/EyeOffIcon';

interface ClientLoginPageProps {
  onLogin: (email: string, pass: string) => Promise<void>;
  onBack: () => void;
  onGoToRegister: () => void;
  onForgotPassword: () => void;
}

const ClientLoginPage: React.FC<ClientLoginPageProps> = ({
  onLogin,
  onBack,
  onGoToRegister,
  onForgotPassword
}) => {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // ⭐ NEW: Track attempts + lockout
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [isLockedOut, setIsLockedOut] = useState(false);

  const LOCKOUT_TIME = 30000; // 30 seconds

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isLockedOut) {
      setError("Too many attempts. Please try again after 30 seconds.");
      return;
    }

    if (!email || !password) {
      setError('Please enter both email and password.');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      await onLogin(email, password); // Firebase login
      setFailedAttempts(0); // reset attempts on success

    } catch (err: any) {
      const newAttempts = failedAttempts + 1;
      setFailedAttempts(newAttempts);

      if (newAttempts >= 3) {
        setIsLockedOut(true);
        setError("Too many wrong attempts. You are blocked for 30 seconds.");

        setTimeout(() => {
          setIsLockedOut(false);
          setFailedAttempts(0);
        }, LOCKOUT_TIME);

      } else {
        setError(`Invalid credentials. Attempts left: ${3 - newAttempts}`);
      }
    }

    setIsLoading(false);
  };

  return (
    <div className="relative flex items-center justify-center min-h-screen bg-cover bg-center bg-fixed auth-bg">
      <div className="absolute inset-0 bg-slate-100/70"></div>

      <div className="relative w-full max-w-sm p-8 space-y-6 bg-white/90 rounded-lg shadow-2xl backdrop-blur-sm">

        <div className="flex flex-col items-center">
          <div className="bg-slate-200 p-3 rounded-full mb-3">
            <ShieldIcon className="w-8 h-8 text-slate-700" />
          </div>
          <h1 className="text-2xl font-bold text-center text-slate-900">Client Access Portal</h1>
        </div>

        <form className="space-y-5" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium text-slate-600">
              Email address
            </label>
            <input
              type="email"
              value={email}
              disabled={isLockedOut}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="client@example.com"
              className="mt-1 block w-full px-3 py-2 border border-slate-300 bg-slate-50 text-slate-900 rounded-md shadow-sm"
            />
          </div>

          <div>
            <div className="flex items-center justify-between">
              <label className="block text-sm font-medium text-slate-600">
                Password
              </label>
              <a
                href="#"
                onClick={(e) => { e.preventDefault(); onForgotPassword(); }}
                className="text-blue-600 hover:text-blue-800 text-sm"
              >
                Forgot Password?
              </a>
            </div>

            <div className="relative mt-1">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                disabled={isLockedOut}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="block w-full px-3 py-2 border border-slate-300 bg-slate-50 rounded-md shadow-sm"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                {showPassword ?
                  <EyeOffIcon className="h-5 w-5 text-slate-500" /> :
                  <ViewIcon className="h-5 w-5 text-slate-500" />
                }
              </button>
            </div>
          </div>

          {error && (
            <p className="text-sm text-red-600 text-center">{error}</p>
          )}

          <button
            type="submit"
            disabled={isLockedOut || isLoading}
            className="w-full py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-md"
          >
            {isLockedOut ? "Locked" : isLoading ? "Logging in..." : "Secure Login"}
          </button>
        </form>

        <p className="text-center text-sm text-slate-500">
          Don't have an account?
          <a
            href="#"
            onClick={(e) => { e.preventDefault(); onGoToRegister(); }}
            className="text-blue-600 hover:text-blue-800 ml-1"
          >
            Sign up
          </a>
        </p>

        <div className="text-sm text-center border-t border-slate-200 pt-4">
          <a
            href="#"
            onClick={(e) => { e.preventDefault(); onBack(); }}
            className="text-slate-500 hover:text-slate-700 text-xs"
          >
            ← Back to Portal Selection
          </a>
        </div>

      </div>
    </div>
  );
};

export default ClientLoginPage;
