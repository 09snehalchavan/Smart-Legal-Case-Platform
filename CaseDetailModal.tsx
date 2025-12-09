import React, { useState } from 'react';
import type { Case } from '../types';

interface CaseDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  caseData: Case;
  onAddUpdate: (caseId: number, updateText: string) => void;
}

const CaseDetailModal: React.FC<CaseDetailModalProps> = ({ isOpen, onClose, caseData, onAddUpdate }) => {
  const [newUpdate, setNewUpdate] = useState('');

  if (!isOpen) return null;

  const handlePostUpdate = () => {
    if (newUpdate.trim()) {
      onAddUpdate(caseData.id, newUpdate);
      setNewUpdate('');
    }
  };

  const InfoItem: React.FC<{ label: string; value: string }> = ({ label, value }) => (
    <div className="flex justify-between text-sm py-1.5">
      <span className="text-slate-500">{label}:</span>
      <span className="font-semibold text-slate-800 text-right">{value}</span>
    </div>
  );
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4">
      <div className="bg-slate-50 rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] flex flex-col">
        <div className="flex justify-between items-center p-4 border-b border-slate-200 flex-shrink-0">
          <div>
            <h2 className="text-xl font-bold text-slate-800">{caseData.name}</h2>
            <p className="text-sm text-slate-500">Case #: {caseData.caseId}</p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700 text-3xl leading-none">&times;</button>
        </div>
        
        <div className="p-6 overflow-y-auto space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-4 rounded-lg border border-slate-200">
              <h3 className="font-bold text-slate-800 mb-2">Case Description</h3>
              <p className="text-sm text-slate-600">{caseData.description}</p>
            </div>
            <div className="bg-white p-4 rounded-lg border border-slate-200">
              <h3 className="font-bold text-slate-800 mb-2">Key Info</h3>
              <div className="space-y-1">
                <InfoItem label="Status" value={caseData.status} />
                <InfoItem label="Client" value={caseData.name} />
                <InfoItem label="Client Phone" value={caseData.clientPhone} />
                <InfoItem label="Client Location" value={caseData.clientLocation} />
                <InfoItem label="Lawyer" value={caseData.lawyer} />
                <InfoItem label="Created" value={caseData.createdDate} />
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-bold text-slate-800 mb-2">Case Timeline & Updates</h3>
            <div className="bg-white p-4 rounded-lg border border-slate-200 space-y-4">
              {caseData.updates.length > 0 ? (
                caseData.updates.map(update => (
                  <div key={update.id} className="text-sm border-b border-slate-100 pb-3 last:border-b-0">
                    <p className="text-slate-700">{update.text}</p>
                    <p className="text-xs text-slate-400 mt-1">
                      {new Date(update.date).toLocaleString()} - {update.author}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-sm text-slate-500 text-center py-4">No updates have been posted for this case.</p>
              )}
            </div>
          </div>
          
          <div>
             <h3 className="text-lg font-bold text-slate-800 mb-2">Add New Update</h3>
             <div className="bg-white p-4 rounded-lg border border-slate-200">
                <textarea 
                    value={newUpdate}
                    onChange={(e) => setNewUpdate(e.target.value)}
                    placeholder="Type your case update here..."
                    className="w-full h-24 p-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <div className="flex justify-end mt-2">
                    <button 
                        onClick={handlePostUpdate}
                        className="bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors text-sm"
                    >
                        Post Update
                    </button>
                </div>
             </div>
          </div>

        </div>

        <div className="p-4 bg-slate-100 border-t border-slate-200 flex justify-end flex-shrink-0">
          <button onClick={onClose} className="bg-slate-200 text-slate-700 font-semibold py-2 px-4 rounded-lg hover:bg-slate-300 transition-colors">Close</button>
        </div>
      </div>
    </div>
  );
};

export default CaseDetailModal;
