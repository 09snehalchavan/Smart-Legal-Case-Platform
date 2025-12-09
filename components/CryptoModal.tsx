import React, { useState } from 'react';
import LockIcon from './icons/LockIcon';

interface CryptoModalProps {
  isOpen: boolean;
  mode: 'encrypt' | 'decrypt';
  fileName: string;
  onClose: () => void;
  onSubmit: (password: string) => void;
  error: string;
}

const CryptoModal: React.FC<CryptoModalProps> = ({ isOpen, mode, fileName, onClose, onSubmit, error }) => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [formError, setFormError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (mode === 'encrypt') {
      if (password.length < 8) {
        setFormError('Password must be at least 8 characters long.');
        return;
      }
      if (password !== confirmPassword) {
        setFormError('Passwords do not match.');
        return;
      }
    }
    onSubmit(password);
  };
  
  const handleClose = () => {
    setPassword('');
    setConfirmPassword('');
    setFormError('');
    onClose();
  };

  const title = mode === 'encrypt' ? 'Encrypt Document' : 'Decrypt Document';
  const buttonText = mode === 'encrypt' ? 'Encrypt' : 'Decrypt';

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
        <div className="flex justify-between items-center border-b pb-3 mb-4">
          <div className="flex items-center gap-3">
            <LockIcon className="w-6 h-6 text-slate-700" />
            <h2 className="text-xl font-bold text-slate-800">{title}</h2>
          </div>
          <button onClick={handleClose} className="text-slate-500 hover:text-slate-800 text-3xl leading-none">&times;</button>
        </div>
        <p className="text-sm text-slate-600 mb-4">
          You are about to {mode} the file: <strong className="font-semibold text-slate-800">{fileName}</strong>
        </p>

        {mode === 'encrypt' && (
            <div className="bg-yellow-50 border-l-4 border-yellow-400 text-yellow-800 p-3 text-sm rounded-md mb-4">
                <strong>Important:</strong> If you forget this password, the file cannot be recovered. Store it securely.
            </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-slate-700">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          {mode === 'encrypt' && (
            <div>
              <label htmlFor="confirmPassword"className="block text-sm font-medium text-slate-700">Confirm Password</label>
              <input
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          )}

          {(error || formError) && <p className="text-sm text-red-600 text-center">{error || formError}</p>}
          
          <div className="flex justify-end pt-4 gap-3">
            <button type="button" onClick={handleClose} className="bg-slate-200 text-slate-700 font-semibold py-2 px-4 rounded-lg hover:bg-slate-300 transition-colors">Cancel</button>
            <button type="submit" className="bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors">{buttonText}</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CryptoModal;