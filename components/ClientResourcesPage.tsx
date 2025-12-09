import React, { useState } from 'react';
import type { SharedResource } from '../types';
import PdfIcon from './icons/PdfIcon';
import WordIcon from './icons/WordIcon';
import ImageIcon from './icons/ImageIcon';
import VideoIcon from './icons/VideoIcon';
import TrashIcon from './icons/TrashIcon';
import EditIcon from './icons/EditIcon';
import ResourceModal from './ResourceModal';
import LockIcon from './icons/LockIcon';
import UnlockIcon from './icons/UnlockIcon';
import ShieldCheckIcon from './icons/ShieldCheckIcon';
import CryptoModal from './CryptoModal';

const AddIcon: React.FC<{ className?: string }> = ({ className = "w-5 h-5" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
    </svg>
);

// --- Crypto Helper Functions (using Web Crypto API) ---
const getPasswordKey = (password: string) => {
    const enc = new TextEncoder();
    return window.crypto.subtle.importKey('raw', enc.encode(password), 'PBKDF2', false, ['deriveKey']);
};

const deriveEncryptionKey = (passwordKey: CryptoKey, salt: Uint8Array) => {
    return window.crypto.subtle.deriveKey(
      { name: 'PBKDF2', salt: salt, iterations: 100000, hash: 'SHA-256' },
      passwordKey,
      { name: 'AES-GCM', length: 256 },
      true,
      ['encrypt', 'decrypt']
    );
};

const encryptContent = async (content: ArrayBuffer, password: string): Promise<{ encryptedContent: ArrayBuffer; salt: Uint8Array; iv: Uint8Array }> => {
    const salt = window.crypto.getRandomValues(new Uint8Array(16));
    const iv = window.crypto.getRandomValues(new Uint8Array(12));
    const passwordKey = await getPasswordKey(password);
    const encryptionKey = await deriveEncryptionKey(passwordKey, salt);
    const encryptedContent = await window.crypto.subtle.encrypt({ name: 'AES-GCM', iv: iv }, encryptionKey, content);
    return { encryptedContent, salt, iv };
};

const decryptContent = async (encryptedContent: ArrayBuffer, salt: Uint8Array, iv: Uint8Array, password: string): Promise<ArrayBuffer> => {
    const passwordKey = await getPasswordKey(password);
    const encryptionKey = await deriveEncryptionKey(passwordKey, salt);
    try {
        return await window.crypto.subtle.decrypt({ name: 'AES-GCM', iv: iv }, encryptionKey, encryptedContent);
    } catch (e) {
        console.error("Decryption failed:", e);
        throw new Error("Decryption failed. Incorrect password or corrupted file.");
    }
};

interface ClientResourcesPageProps {
  resources: SharedResource[];
  onSave: (resourceData: Omit<SharedResource, 'id'>, id?: number) => void;
  onDelete: (resourceId: number) => void;
}

const ClientResourcesPage: React.FC<ClientResourcesPageProps> = ({ resources, onSave, onDelete }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedResource, setSelectedResource] = useState<SharedResource | null>(null);
  
  const [isCryptoModalOpen, setIsCryptoModalOpen] = useState(false);
  const [selectedResourceForCrypto, setSelectedResourceForCrypto] = useState<SharedResource | null>(null);
  const [cryptoMode, setCryptoMode] = useState<'encrypt' | 'decrypt'>('encrypt');
  const [cryptoError, setCryptoError] = useState('');

  const handleAddNew = () => {
    setSelectedResource(null);
    setIsModalOpen(true);
  };

  const handleEdit = (resource: SharedResource) => {
    setSelectedResource(resource);
    setIsModalOpen(true);
  };

  const handleDelete = (id: number) => {
    if (window.confirm('Are you sure you want to delete this resource? It will be removed for all clients.')) {
      onDelete(id);
    }
  };
  
  const getFileIcon = (type: SharedResource['type']) => {
    switch(type) {
        case 'pdf': return <PdfIcon className="w-8 h-8 flex-shrink-0" />;
        case 'word': return <WordIcon className="w-8 h-8 flex-shrink-0" />;
        case 'image': return <ImageIcon className="w-8 h-8 flex-shrink-0" />;
        case 'video': return <VideoIcon className="w-8 h-8 flex-shrink-0" />;
    }
  };
  
  const openFileInNewTab = (content: ArrayBuffer, type: SharedResource['type']) => {
    let mimeType = 'application/octet-stream';
    if (type === 'pdf') mimeType = 'application/pdf';
    if (type === 'word') mimeType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
    if (type === 'video') mimeType = 'video/mp4'; 
    if (type === 'image') {
        const uint8 = new Uint8Array(content);
        if (uint8[0] === 0x89 && uint8[1] === 0x50 && uint8[2] === 0x4E && uint8[3] === 0x47) mimeType = 'image/png';
        else if (uint8[0] === 0xFF && uint8[1] === 0xD8) mimeType = 'image/jpeg';
        else if (uint8[0] === 0x47 && uint8[1] === 0x49 && uint8[2] === 0x46) mimeType = 'image/gif';
    }

    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    window.open(url, '_blank', 'noopener,noreferrer');
    setTimeout(() => URL.revokeObjectURL(url), 100);
  };

  const handleEncryptClick = (resource: SharedResource) => {
    setSelectedResourceForCrypto(resource);
    setCryptoMode('encrypt');
    setIsCryptoModalOpen(true);
  };

  const handleViewClick = (resource: SharedResource) => {
    if (resource.isEncrypted) {
      setSelectedResourceForCrypto(resource);
      setCryptoMode('decrypt');
      setIsCryptoModalOpen(true);
    } else {
      openFileInNewTab(resource.content, resource.type);
    }
  };

  const handleCryptoSubmit = async (password: string) => {
    if (!selectedResourceForCrypto) return;
    setCryptoError('');

    if (cryptoMode === 'encrypt') {
        try {
            const { encryptedContent, salt, iv } = await encryptContent(selectedResourceForCrypto.content, password);
            const updatedResourceData = { 
                ...selectedResourceForCrypto, 
                content: encryptedContent, 
                isEncrypted: true, 
                salt, 
                iv 
            };
            const { id, ...dataToSave } = updatedResourceData;
            onSave(dataToSave, id);
            setIsCryptoModalOpen(false);
        } catch (e) {
            setCryptoError('Encryption failed. Please try again.');
        }
    } else { // Decrypt
        if (selectedResourceForCrypto.salt && selectedResourceForCrypto.iv) {
            try {
                const decryptedContent = await decryptContent(selectedResourceForCrypto.content, selectedResourceForCrypto.salt, selectedResourceForCrypto.iv, password);
                openFileInNewTab(decryptedContent, selectedResourceForCrypto.type);
                setIsCryptoModalOpen(false);
            } catch (e) {
                setCryptoError('Incorrect password. Please try again.');
            }
        }
    }
  };

  return (
    <>
      <div className="w-full">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-slate-800">Client Resources</h1>
          <button onClick={handleAddNew} className="bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
            <AddIcon /> Add Resource
          </button>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-slate-500">
              <thead className="text-xs text-slate-700 uppercase bg-slate-50">
                <tr>
                  <th scope="col" className="px-6 py-3 font-medium">Resource</th>
                  <th scope="col" className="px-6 py-3 font-medium">Description</th>
                  <th scope="col" className="px-6 py-3 font-medium">Upload Date</th>
                  <th scope="col" className="px-6 py-3 font-medium flex items-center gap-2"><ShieldCheckIcon className="w-4 h-4" /> Security</th>
                  <th scope="col" className="px-6 py-3 font-medium text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {resources.length > 0 ? (
                  resources.map((resource) => (
                    <tr key={resource.id} className="bg-white border-b hover:bg-slate-50">
                      <td className="px-6 py-4 font-medium text-slate-900 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          {getFileIcon(resource.type)} <span>{resource.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 max-w-sm"><p className="truncate text-slate-600">{resource.description}</p></td>
                      <td className="px-6 py-4">{resource.uploadDate}</td>
                      <td className="px-6 py-4">
                        {resource.isEncrypted ? (
                          <span className="flex items-center gap-2 text-sm text-yellow-700 font-semibold"><LockIcon className="w-4 h-4"/> Encrypted</span>
                        ) : (
                          <span className="text-sm text-slate-500">Standard</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <div className="flex justify-center items-center gap-2">
                            <button onClick={() => handleViewClick(resource)} className="text-blue-600 hover:text-blue-800 font-medium p-2 rounded-full hover:bg-blue-50" title="View Resource">View</button>
                            {!resource.isEncrypted && (
                                <button onClick={() => handleEncryptClick(resource)} className="p-2 rounded-full text-yellow-600 hover:bg-yellow-50" title="Encrypt Resource">
                                    <UnlockIcon className="w-5 h-5"/>
                                </button>
                            )}
                            <button onClick={() => handleEdit(resource)} className="p-2 rounded-full text-slate-500 hover:bg-slate-200" title="Edit Resource">
                                <EditIcon />
                            </button>
                            <button onClick={() => handleDelete(resource.id)} className="p-2 rounded-full text-red-500 hover:bg-red-50" title="Delete Resource">
                                <TrashIcon />
                            </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="text-center py-10 text-slate-500">
                      No client resources uploaded yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      {isModalOpen && (
        <ResourceModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSave={onSave}
          resourceData={selectedResource}
        />
      )}
      {isCryptoModalOpen && selectedResourceForCrypto && (
        <CryptoModal
          isOpen={isCryptoModalOpen}
          mode={cryptoMode}
          fileName={selectedResourceForCrypto.name}
          onClose={() => setIsCryptoModalOpen(false)}
          onSubmit={handleCryptoSubmit}
          error={cryptoError}
        />
      )}
    </>
  );
};

export default ClientResourcesPage;