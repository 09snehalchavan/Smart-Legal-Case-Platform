import React, { useState, useEffect } from 'react';
import type { StudyMaterial } from '../types';
import PdfIcon from './icons/PdfIcon';
import WordIcon from './icons/WordIcon';
import ImageIcon from './icons/ImageIcon';
import VideoIcon from './icons/VideoIcon';
import TrashIcon from './icons/TrashIcon';
import EditIcon from './icons/EditIcon';
import ShieldCheckIcon from './icons/ShieldCheckIcon';
import StudyMaterialModal from './StudyMaterialModal';
import { decryptAndVerify } from './cryptoUtils';

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

const AddIcon: React.FC<{ className?: string }> = ({ className = "w-5 h-5" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
    </svg>
);

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


interface StudyMaterialPageProps {
  materials: StudyMaterial[];
  onSave: (material: StudyMaterial) => void;
  onDelete: (materialId: number) => void;
}

const StudyMaterialPage: React.FC<StudyMaterialPageProps> = ({ materials, onSave, onDelete }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMaterial, setSelectedMaterial] = useState<StudyMaterial | null>(null);
  const [preview, setPreview] = useState<PreviewModalProps>({
    isOpen: false,
    onClose: () => {},
    title: '',
    isLoading: false,
    error: '',
    content: null,
  });

  const handleAddNew = () => {
    setSelectedMaterial(null);
    setIsModalOpen(true);
  };

  const handleEdit = (material: StudyMaterial) => {
    setSelectedMaterial(material);
    setIsModalOpen(true);
  };

  const handleDelete = (id: number) => {
    if (window.confirm('Are you sure you want to delete this study material? It will be removed for all clients.')) {
      onDelete(id);
    }
  };
  
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
        const errorMessage = e.message || "Could not decrypt or verify the file. It may be corrupted or your keys may have changed.";
        console.error("Decryption/Verification failed:", e);
        setPreview(prev => ({ ...prev, isLoading: false, error: errorMessage }));
    }
  };

  return (
    <>
      <div className="w-full">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-slate-800">Own Study Material Library</h1>
           <button onClick={handleAddNew} className="bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
            <AddIcon /> Add New
          </button>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <p className="text-sm text-slate-500 mb-4">
            These are your own study materials. They are securely encrypted and can be viewed by you and your clients.
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-slate-500">
              <thead className="text-xs text-slate-700 uppercase bg-slate-50">
                <tr>
                  <th scope="col" className="px-6 py-3 font-medium">Material</th>
                  <th scope="col" className="px-6 py-3 font-medium">Description</th>
                  <th scope="col" className="px-6 py-3 font-medium">Upload Date</th>
                  <th scope="col" className="px-6 py-3 font-medium flex items-center gap-2"><ShieldCheckIcon className="w-4 h-4" /> Security</th>
                  <th scope="col" className="px-6 py-3 font-medium text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {materials.length > 0 ? (
                  materials.map((material) => (
                    <tr key={material.id} className="bg-white border-b hover:bg-slate-50">
                      <td className="px-6 py-4 font-medium text-slate-900 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          {getFileIcon(material.type)} <span>{material.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 max-w-sm"><p className="truncate text-slate-600">{material.description}</p></td>
                      <td className="px-6 py-4">{material.uploadDate}</td>
                      <td className="px-6 py-4">
                        <span className="flex items-center gap-2 text-sm text-green-700 font-semibold"><ShieldCheckIcon className="w-4 h-4"/> E2E Encrypted</span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <div className="flex justify-center items-center gap-2">
                            <button onClick={() => handleViewClick(material)} className="text-blue-600 hover:text-blue-800 font-medium p-2 rounded-full hover:bg-blue-50" title="View Material">View</button>
                            <button onClick={() => handleEdit(material)} className="p-2 rounded-full text-slate-500 hover:bg-slate-200" title="Edit Material">
                                <EditIcon />
                            </button>
                            <button onClick={() => handleDelete(material.id)} className="p-2 rounded-full text-red-500 hover:bg-red-50" title="Delete Material">
                                <TrashIcon />
                            </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="text-center py-10 text-slate-500">
                      No study materials uploaded yet. Add one to get started.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      {isModalOpen && (
        <StudyMaterialModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSave={onSave}
          materialData={selectedMaterial}
        />
      )}
      <PreviewModal {...preview} />
    </>
  );
};

export default StudyMaterialPage;
