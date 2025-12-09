
import React, { useState } from 'react';
import type { Case } from '../types';
import CaseModal from './CaseModal';
import EditIcon from './icons/EditIcon';
import TrashIcon from './icons/TrashIcon';

const AddIcon: React.FC<{ className?: string }> = ({ className = "w-5 h-5" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
    </svg>
);


interface CasesPageProps {
  searchQuery: string;
  cases: Case[];
  onSaveCase: (caseData: Omit<Case, 'id' | 'progress'>, id?: number) => void;
  onDeleteCase: (caseId: number) => void;
}

const CasesPage: React.FC<CasesPageProps> = ({ searchQuery, cases, onSaveCase, onDeleteCase }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCase, setSelectedCase] = useState<Case | null>(null);

  const filteredCases = cases.filter(caseItem =>
    caseItem.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    caseItem.caseId.toLowerCase().includes(searchQuery.toLowerCase()) ||
    caseItem.matterType.toLowerCase().includes(searchQuery.toLowerCase()) ||
    caseItem.status.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddNewCase = () => {
    setSelectedCase(null);
    setIsModalOpen(true);
  };

  const handleUpdateCase = (caseItem: Case) => {
    setSelectedCase(caseItem);
    setIsModalOpen(true);
  };

  const handleDeleteCase = (caseId: number) => {
    if (window.confirm('Are you sure you want to delete this case?')) {
      onDeleteCase(caseId);
    }
  };
  
  const handleSaveCase = (caseData: Omit<Case, 'id' | 'progress'>) => {
    onSaveCase(caseData, selectedCase?.id);
    setIsModalOpen(false);
  };

  return (
    <>
      <div className="w-full">
        <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-slate-800">All Cases</h1>
            <button
              onClick={handleAddNewCase}
              className="bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <AddIcon />
              Add New Case
            </button>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-slate-500">
              <thead className="text-xs text-slate-700 uppercase bg-slate-50">
                <tr>
                  <th scope="col" className="px-6 py-3 font-medium">Case ID</th>
                  <th scope="col" className="px-6 py-3 font-medium">Case Name</th>
                  <th scope="col" className="px-6 py-3 font-medium">Matter Type</th>
                  <th scope="col" className="px-6 py-3 font-medium">Status</th>
                  <th scope="col" className="px-6 py-3 font-medium">Next Deadline</th>
                  <th scope="col" className="px-6 py-3 font-medium text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredCases.length > 0 ? (
                  filteredCases.map((caseItem: Case) => (
                    <tr key={caseItem.id} className="bg-white border-b hover:bg-slate-50">
                      <td className="px-6 py-4 font-medium text-slate-900 whitespace-nowrap">{caseItem.caseId}</td>
                      <td className="px-6 py-4">{caseItem.name}</td>
                      <td className="px-6 py-4">{caseItem.matterType}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                          caseItem.status === 'Active' ? 'bg-green-100 text-green-800' :
                          caseItem.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-slate-100 text-slate-800'
                        }`}>
                          {caseItem.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">{caseItem.nextDeadline}</td>
                      <td className="px-6 py-4 text-center">
                        <div className="flex justify-center items-center gap-4">
                            <button onClick={() => handleUpdateCase(caseItem)} className="text-blue-600 hover:text-blue-800">
                                <EditIcon />
                            </button>
                            <button onClick={() => handleDeleteCase(caseItem.id)} className="text-red-500 hover:text-red-700">
                                <TrashIcon />
                            </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="text-center py-10 text-slate-500">
                      No cases found for "{searchQuery}".
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      {isModalOpen && (
          <CaseModal 
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onSave={handleSaveCase}
            caseData={selectedCase}
          />
      )}
    </>
  );
};

export default CasesPage;
