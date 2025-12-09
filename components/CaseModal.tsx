import React, { useState, useEffect } from 'react';
import type { Case } from '../types';

interface CaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (caseData: Omit<Case, 'id' | 'progress'>) => void;
  caseData: Case | null;
}

const CaseModal: React.FC<CaseModalProps> = ({ isOpen, onClose, onSave, caseData }) => {
  const [formData, setFormData] = useState({
    caseId: '',
    name: '',
    matterType: '',
    status: 'Pending' as Case['status'],
    nextDeadline: '',
  });

  useEffect(() => {
    if (caseData) {
      setFormData({
        caseId: caseData.caseId,
        name: caseData.name,
        matterType: caseData.matterType,
        status: caseData.status,
        nextDeadline: caseData.nextDeadline,
      });
    } else {
      // Reset for new case
      setFormData({
        caseId: '',
        name: '',
        matterType: '',
        status: 'Pending',
        nextDeadline: '',
      });
    }
  }, [caseData, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // FIX: Construct the full object expected by `onSave` to resolve the type error.
    // The form only covers a subset of case properties, so we merge form data
    // with existing data (for edits) or default values (for new cases).
    // FIX: Add missing 'clientId' property required by the 'Case' type.
    const completeCaseData: Omit<Case, 'id' | 'progress'> = {
      ...(caseData
        ? {
            description: caseData.description,
            clientPhone: caseData.clientPhone,
            clientLocation: caseData.clientLocation,
            lawyer: caseData.lawyer,
            createdDate: caseData.createdDate,
            updates: caseData.updates,
            clientId: caseData.clientId,
          }
        : {
            description: '',
            clientPhone: '',
            clientLocation: '',
            lawyer: 'Priti Patwa',
            createdDate: new Date().toISOString().split('T')[0],
            updates: [],
            // A placeholder is used for new cases as there is no client selector in the form.
            clientId: 0,
          }),
      ...formData,
    };
    onSave(completeCaseData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-lg">
        <div className="flex justify-between items-center border-b pb-3 mb-4">
          <h2 className="text-xl font-bold text-slate-800">{caseData ? 'Update Case' : 'Add New Case'}</h2>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-800 text-3xl leading-none">&times;</button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="caseId" className="block text-sm font-medium text-slate-700">Case ID</label>
            <input type="text" name="caseId" id="caseId" value={formData.caseId} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"/>
          </div>
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-slate-700">Case Name</label>
            <input type="text" name="name" id="name" value={formData.name} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"/>
          </div>
          <div>
            <label htmlFor="matterType" className="block text-sm font-medium text-slate-700">Matter Type</label>
            <input type="text" name="matterType" id="matterType" value={formData.matterType} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"/>
          </div>
          <div>
            <label htmlFor="status" className="block text-sm font-medium text-slate-700">Status</label>
            <select name="status" id="status" value={formData.status} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500">
              <option value="Active">Active</option>
              <option value="Pending">Pending</option>
              <option value="Closed">Closed</option>
            </select>
          </div>
          <div>
            <label htmlFor="nextDeadline" className="block text-sm font-medium text-slate-700">Next Deadline</label>
            <input type="date" name="nextDeadline" id="nextDeadline" value={formData.nextDeadline} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"/>
          </div>
          <div className="flex justify-end pt-4 gap-3">
            <button type="button" onClick={onClose} className="bg-slate-200 text-slate-700 font-semibold py-2 px-4 rounded-lg hover:bg-slate-300 transition-colors">Cancel</button>
            <button type="submit" className="bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors">Save Case</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CaseModal;
