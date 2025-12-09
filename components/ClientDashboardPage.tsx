import React, { useState, useEffect } from 'react';
import type { Client, Case, StudyMaterial, LawyerProfile } from '../types';
import LogoutIcon from './icons/LogoutIcon';
import ShieldCheckIcon from './icons/ShieldCheckIcon';
import PdfIcon from './icons/PdfIcon';
import WordIcon from './icons/WordIcon';
import ImageIcon from './icons/ImageIcon';
import VideoIcon from './icons/VideoIcon';
import LockIcon from './icons/LockIcon';
import { decryptAndVerify } from './cryptoUtils';
import LawyerInfoCard from './LawyerInfoCard';

// --- START: PreviewModal Component ---
interface PreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  isLoading: boolean;
  error: string;
  content: {
    url: string;
    mime: string;
    text?: string;
  } | null;
}

const PreviewModal: React.FC<PreviewModalProps> = ({ isOpen, onClose, title, isLoading, error, content }) => {
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => {
      window.removeEventListener('keydown', handleEsc);
    };
  }, [onClose]);

  if (!isOpen) return null;

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex flex-col items-center justify-center h-64">
          <svg className="animate-spin h-10 w-10 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className="mt-4 text-slate-600">Decrypting and verifying...</p>
        </div>
      );
    }

    if (error) {
      return (
        <div className="flex flex-col items-center justify-center h-64 text-center">
          <p className="font-bold text-red-600">Could not display file</p>
          <p className="mt-2 text-sm text-slate-700 max-w-md">{error}</p>
        </div>
      );
    }

    if (content) {
      if (content.mime.startsWith('image/')) {
        return <img src={content.url} alt={title} className="max-w-full max-h-[70vh] object-contain" />;
      }
      if (content.mime === 'application/pdf') {
        return <iframe src={content.url} title={title} className="w-full h-[75vh]" />;
      }
      if (content.mime.startsWith('video/')) {
        return <video src={content.url} controls className="max-w-full max-h-[70vh]" />;
      }
      if (content.text !== undefined) {
        return <pre className="w-full h-[70vh] overflow-auto whitespace-pre-wrap bg-slate-100 p-4 rounded-md text-sm">{content.text}</pre>;
      }
    }
    return <p>Unsupported file type or content could not be loaded.</p>;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4" onClick={onClose}>
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl flex flex-col" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-center p-4 border-b border-slate-200 flex-shrink-0">
          <h2 className="text-lg font-bold text-slate-800 truncate" title={title}>{title}</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700 text-3xl leading-none">&times;</button>
        </div>
        <div className="p-4 flex-grow overflow-auto flex justify-center items-center bg-slate-50 min-h-[200px]">
          {renderContent()}
        </div>
         <div className="p-4 bg-slate-100 border-t border-slate-200 flex justify-end flex-shrink-0">
          <button onClick={onClose} className="bg-slate-200 text-slate-700 font-semibold py-2 px-4 rounded-lg hover:bg-slate-300 transition-colors">Close</button>
        </div>
      </div>
    </div>
  );
};
// --- END: PreviewModal Component ---

const getMimeType = (type: StudyMaterial['type'], content: ArrayBuffer): string => {
    if (type === 'pdf') return 'application/pdf';
    if (type === 'word') return 'text/plain'; // Treat as plain text for preview
    if (type === 'video') return 'video/mp4'; // Assume mp4 for simplicity
    if (type === 'image') {
        const uint8 = new Uint8Array(content);
        if (uint8[0] === 0x89 && uint8[1] === 0x50 && uint8[2] === 0x4E && uint8[3] === 0x47) return 'image/png';
        if (uint8[0] === 0xFF && uint8[1] === 0xD8) return 'image/jpeg';
        if (uint8[0] === 0x47 && uint8[1] === 0x49 && uint8[2] === 0x46) return 'image/gif';
        return 'image/png'; // Default
    }
    return 'application/octet-stream';
};

interface ClientDashboardPageProps {
  client: Client;
  cases: Case[];
  studyMaterials: StudyMaterial[];
  onLogout: () => void;
  lawyerProfile: LawyerProfile;
}

const ClientDashboardPage: React.FC<ClientDashboardPageProps> = ({ client, cases, studyMaterials, onLogout, lawyerProfile }) => {
  const [decryptionError, setDecryptionError] = useState('');
  const [preview, setPreview] = useState<PreviewModalProps>({
    isOpen: false,
    onClose: () => {},
    title: '',
    isLoading: false,
    error: '',
    content: null,
  });

  const getFileIcon = (type: StudyMaterial['type']) => {
    switch(type) {
        case 'pdf': return <PdfIcon className="w-8 h-8 flex-shrink-0" />;
        case 'word': return <WordIcon className="w-8 h-8 flex-shrink-0" />;
        case 'image': return <ImageIcon className="w-8 h-8 flex-shrink-0" />;
        case 'video': return <VideoIcon className="w-8 h-8 flex-shrink-0" />;
    }
  };

  const handleClosePreview = () => {
    if (preview.content?.url) {
        URL.revokeObjectURL(preview.content.url);
    }
    setPreview({ isOpen: false, onClose: () => {}, title: '', isLoading: false, error: '', content: null });
  };
  
  const handleViewClick = async (material: StudyMaterial) => {
    setDecryptionError('');
    setPreview({
      isOpen: true,
      onClose: handleClosePreview,
      title: material.name,
      isLoading: true,
      error: '',
      content: null
    });

    try {
        const decryptedContent = await decryptAndVerify(
            material.content,
            material.iv,
            material.ephemeralPubKey,
            material.signature
        );
        const mimeType = getMimeType(material.type, decryptedContent);

        if (mimeType.startsWith('text/')) {
            const text = new TextDecoder().decode(decryptedContent);
            setPreview(prev => ({ ...prev, isLoading: false, content: { url: '', mime: mimeType, text } }));
        } else {
            const blob = new Blob([decryptedContent], { type: mimeType });
            const url = URL.createObjectURL(blob);
            setPreview(prev => ({ ...prev, isLoading: false, content: { url, mime: mimeType } }));
        }
    } catch (e: any) {
        const errorMessage = e.message || "Could not decrypt or verify the file. It may be corrupted.";
        console.error("Decryption/Verification failed:", e);
        setDecryptionError(errorMessage);
        setPreview(prev => ({ ...prev, isLoading: false, error: errorMessage }));
    }
  };


  return (
    <>
      <div className="min-h-screen bg-slate-100 font-sans">
        {/* Client Header */}
        <header className="bg-slate-800 text-white h-20 flex-shrink-0">
          <div className="h-full flex items-center justify-between px-6">
            <div className="flex items-center gap-3">
              <ShieldCheckIcon className="w-8 h-8 text-cyan-400" />
              <h1 className="text-xl font-semibold">Client Access Portal</h1>
            </div>
            <button
              onClick={onLogout}
              className="flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-colors duration-200 text-slate-300 hover:bg-slate-700 hover:text-white"
            >
              <LogoutIcon className="w-5 h-5 mr-2" />
              <span>Logout</span>
            </button>
          </div>
        </header>

        {/* Client Content */}
        <main className="p-6">
           <div className="max-w-7xl mx-auto">
             <div className="mb-6">
              <h2 className="text-3xl font-bold text-slate-800">Welcome, {client.name}</h2>
              <p className="text-slate-500">Here's an overview of your associated cases and shared study materials.</p>
            </div>

            {decryptionError && !preview.isOpen && (
                <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-md mb-6" role="alert">
                    <p className="font-bold">Security Alert</p>
                    <p>{decryptionError}</p>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white rounded-lg shadow-md">
                      <h3 className="text-lg font-bold text-slate-800 p-6 border-b">Your Cases ({cases.length})</h3>
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left text-slate-500">
                          <thead className="text-xs text-slate-700 uppercase bg-slate-50">
                            <tr>
                              <th scope="col" className="px-6 py-3 font-medium">Case ID</th>
                              <th scope="col" className="px-6 py-3 font-medium">Case Name</th>
                              <th scope="col" className="px-6 py-3 font-medium">Status</th>
                            </tr>
                          </thead>
                          <tbody>
                            {cases.length > 0 ? (
                              cases.map(caseItem => (
                                <tr key={caseItem.id} className="bg-white border-b last:border-b-0">
                                  <td className="px-6 py-4 font-medium text-slate-900">{caseItem.caseId}</td>
                                  <td className="px-6 py-4">{caseItem.name}</td>
                                  <td className="px-6 py-4">
                                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                                      caseItem.status === 'Active' ? 'bg-green-100 text-green-800' :
                                      caseItem.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                                      'bg-slate-100 text-slate-800'
                                    }`}>{caseItem.status}</span>
                                  </td>
                                </tr>
                              ))
                            ) : (
                              <tr>
                                  <td colSpan={3} className="text-center py-10 text-slate-500">
                                      You do not have any cases associated with your profile yet.
                                  </td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                    
                    <div className="bg-white rounded-lg shadow-md">
                      <h3 className="text-lg font-bold text-slate-800 p-6 border-b">Own Study Material Library</h3>
                       <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left text-slate-500">
                          <thead className="text-xs text-slate-700 uppercase bg-slate-50">
                            <tr>
                              <th scope="col" className="px-6 py-3 font-medium">Resource</th>
                              <th scope="col" className="px-6 py-3 font-medium">Description</th>
                              <th scope="col" className="px-6 py-3 font-medium text-center">Action</th>
                            </tr>
                          </thead>
                          <tbody>
                            {studyMaterials.length > 0 ? (
                              studyMaterials.map((material) => (
                                <tr key={material.id} className="bg-white border-b last:border-b-0 hover:bg-slate-50">
                                  <td className="px-6 py-4 font-medium text-slate-900 whitespace-nowrap">
                                    <div className="flex items-center gap-3">
                                      {getFileIcon(material.type)}
                                      <span>{material.name}</span>
                                      <span title="Secure & Verified"><LockIcon className="w-4 h-4 text-green-600"/></span>
                                    </div>
                                  </td>
                                  <td className="px-6 py-4 max-w-sm"><p className="truncate text-slate-600">{material.description}</p></td>
                                  <td className="px-6 py-4 text-center">
                                    <button 
                                      onClick={() => handleViewClick(material)} 
                                      disabled={preview.isLoading && preview.title === material.name}
                                      className="bg-slate-100 text-slate-700 font-semibold py-1 px-3 rounded-md hover:bg-slate-200 transition-colors text-xs disabled:opacity-50 disabled:cursor-wait"
                                    >
                                      {(preview.isLoading && preview.title === material.name) ? 'Verifying...' : 'View'}
                                    </button>
                                  </td>
                                </tr>
                              ))
                            ) : (
                              <tr>
                                <td colSpan={3} className="text-center py-10 text-slate-500">
                                  No study materials have been shared at this time.
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                </div>
                <div className="lg:col-span-1">
                    <LawyerInfoCard profile={lawyerProfile} />
                </div>
            </div>
          </div>
        </main>
      </div>
      <PreviewModal {...preview} />
    </>
  );
};

export default ClientDashboardPage;
