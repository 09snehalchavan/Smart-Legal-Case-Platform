import React, { useState, useRef } from 'react';
import type { Document } from '../types';
import PdfIcon from './icons/PdfIcon';
import WordIcon from './icons/WordIcon';
import TrashIcon from './icons/TrashIcon';
import LockIcon from './icons/LockIcon';
import UnlockIcon from './icons/UnlockIcon';
import ShieldCheckIcon from './icons/ShieldCheckIcon';
import CryptoModal from './CryptoModal';
import ExcelIcon from './icons/ExcelIcon';
import TxtIcon from './icons/TxtIcon';
import ImageIcon from './icons/ImageIcon';
import VideoIcon from './icons/VideoIcon';


const UploadIcon: React.FC<{ className?: string }> = ({ className = "w-5 h-5" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
    </svg>
);

// FIX: Define missing FileIcon component.
const FileIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
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

const getFileType = (fileName: string): Document['type'] => {
    const extension = fileName.split('.').pop()?.toLowerCase();
    if (extension === 'pdf') return 'pdf';
    if (['doc', 'docx'].includes(extension || '')) return 'word';
    if (['mp4', 'mov', 'avi', 'wmv'].includes(extension || '')) return 'video';
    if (['png', 'jpg', 'jpeg', 'gif'].includes(extension || '')) return 'image';
    if (['xls', 'xlsx'].includes(extension || '')) return 'excel';
    if (extension === 'txt') return 'txt';
    return 'pdf'; // Default
};

interface DocumentManagementProps {
    documents: Document[];
    onSave: (docData: Omit<Document, 'id'>, id?: number) => void;
    onDelete: (docId: number) => void;
    onUpdate: (updatedDoc: Document) => void;
}

const DocumentManagement: React.FC<DocumentManagementProps> = ({ documents, onSave, onDelete, onUpdate }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isCryptoModalOpen, setIsCryptoModalOpen] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [cryptoMode, setCryptoMode] = useState<'encrypt' | 'decrypt'>('encrypt');
  const [cryptoError, setCryptoError] = useState('');

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as ArrayBuffer;
        if (content) {
          const newDocument: Omit<Document, 'id'> = {
            name: file.name,
            caseId: 'C.XXX.XXX', // Placeholder
            uploadDate: new Date().toISOString().split('T')[0],
            type: getFileType(file.name),
            content,
            isEncrypted: false,
          };
          onSave(newDocument);
        }
      };
      reader.readAsArrayBuffer(file);
    }
    if(event.target) event.target.value = '';
  };

  const handleDelete = (id: number) => {
    if (window.confirm('Are you sure you want to permanently delete this document?')) {
        onDelete(id);
    }
  };

  const openFileInNewTab = (content: ArrayBuffer, type: Document['type']) => {
    let mimeType = 'application/octet-stream';
    if (type === 'pdf') mimeType = 'application/pdf';
    if (type === 'word') mimeType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
    if (type === 'video') mimeType = 'video/mp4';
    if (type === 'excel') mimeType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
    if (type === 'txt') mimeType = 'text/plain';
    if (type === 'image') {
        const uint8 = new Uint8Array(content);
        if (uint8[0] === 0x89 && uint8[1] === 0x50 && uint8[2] === 0x4E && uint8[3] === 0x47) mimeType = 'image/png';
        else if (uint8[0] === 0xFF && uint8[1] === 0xD8) mimeType = 'image/jpeg';
        else if (uint8[0] === 0x47 && uint8[1] === 0x49 && uint8[2] === 0x46) mimeType = 'image/gif';
    }

    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    window.open(url, '_blank', 'noopener,noreferrer');
    URL.revokeObjectURL(url);
  };

  const handleView = (doc: Document) => {
    if (doc.isEncrypted) {
      setSelectedDocument(doc);
      setCryptoMode('decrypt');
      setIsCryptoModalOpen(true);
    } else {
      openFileInNewTab(doc.content, doc.type);
    }
  };
  
  const handleEncryptClick = (doc: Document) => {
    setSelectedDocument(doc);
    setCryptoMode('encrypt');
    setIsCryptoModalOpen(true);
  };

  const handleCryptoSubmit = async (password: string) => {
    if (!selectedDocument) return;
    setCryptoError('');

    if (cryptoMode === 'encrypt') {
        try {
            const { encryptedContent, salt, iv } = await encryptContent(selectedDocument.content, password);
            onUpdate({ ...selectedDocument, content: encryptedContent, isEncrypted: true, salt, iv });
            setIsCryptoModalOpen(false);
        } catch (e) {
            setCryptoError('Encryption failed. Please try again.');
        }
    } else { // Decrypt
        if (selectedDocument.salt && selectedDocument.iv) {
            try {
                const decryptedContent = await decryptContent(selectedDocument.content, selectedDocument.salt, selectedDocument.iv, password);
                openFileInNewTab(decryptedContent, selectedDocument.type);
                setIsCryptoModalOpen(false);
            } catch (e) {
                setCryptoError('Incorrect password. Please try again.');
            }
        }
    }
  };

  const getFileIcon = (type: Document['type']) => {
    if (type === 'pdf') return <PdfIcon className="w-8 h-8 flex-shrink-0" />;
    if (type === 'word') return <WordIcon className="w-8 h-8 flex-shrink-0" />;
    if (type === 'excel') return <ExcelIcon className="w-8 h-8 flex-shrink-0" />;
    if (type === 'txt') return <TxtIcon className="w-8 h-8 flex-shrink-0" />;
    if (type === 'image') return <ImageIcon className="w-8 h-8 flex-shrink-0" />;
    if (type === 'video') return <VideoIcon className="w-8 h-8 flex-shrink-0" />;
    return <FileIcon className="w-8 h-8 flex-shrink-0 text-slate-500" />;
  };

  return (
    <>
      <div className="w-full">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-slate-800">Document Management</h1>
          <button onClick={handleUploadClick} className="bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
            <UploadIcon /> Upload Document
          </button>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-slate-500">
              <thead className="text-xs text-slate-700 uppercase bg-slate-50">
                <tr>
                  <th scope="col" className="px-6 py-3 font-medium">Document Name</th>
                  <th scope="col" className="px-6 py-3 font-medium">Case ID</th>
                  <th scope="col" className="px-6 py-3 font-medium">Upload Date</th>
                  <th scope="col" className="px-6 py-3 font-medium flex items-center gap-2"><ShieldCheckIcon className="w-4 h-4" /> Security</th>
                  <th scope="col" className="px-6 py-3 font-medium text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {documents.length > 0 ? (
                  documents.map((doc: Document) => (
                    <tr key={doc.id} className="bg-white border-b hover:bg-slate-50">
                      <td className="px-6 py-4 font-medium text-slate-900 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          {getFileIcon(doc.type)} <span>{doc.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">{doc.caseId}</td>
                      <td className="px-6 py-4">{doc.uploadDate}</td>
                      <td className="px-6 py-4">
                        {doc.isEncrypted ? (
                          <span className="flex items-center gap-2 text-sm text-yellow-700 font-semibold"><LockIcon className="w-4 h-4"/> Encrypted</span>
                        ) : (
                          <span className="text-sm text-slate-500">Standard</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <div className="flex justify-center items-center gap-2">
                            <button onClick={() => handleView(doc)} className="text-blue-600 hover:text-blue-800 font-medium p-2 rounded-full hover:bg-blue-50" title="View Document">View</button>
                            {!doc.isEncrypted && (
                                <button onClick={() => handleEncryptClick(doc)} className="p-2 rounded-full text-yellow-600 hover:bg-yellow-50" title="Encrypt Document">
                                    <UnlockIcon className="w-5 h-5"/>
                                </button>
                            )}
                            <button onClick={() => handleDelete(doc.id)} className="p-2 rounded-full text-red-500 hover:bg-red-50" title="Delete Document">
                                <TrashIcon />
                            </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="text-center py-10 text-slate-500">
                      No documents uploaded yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
        <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept=".pdf,.doc,.docx,.xls,.xlsx,.txt,.png,.jpg,.jpeg,.gif,.mp4,.mov" />
      </div>
      {isCryptoModalOpen && selectedDocument && (
        <CryptoModal
          isOpen={isCryptoModalOpen}
          mode={cryptoMode}
          fileName={selectedDocument.name}
          onClose={() => setIsCryptoModalOpen(false)}
          onSubmit={handleCryptoSubmit}
          error={cryptoError}
        />
      )}
    </>
  );
};

export default DocumentManagement;