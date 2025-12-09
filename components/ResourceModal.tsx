import React, { useState, useEffect, useRef } from 'react';
import type { SharedResource } from '../types';

interface ResourceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (resourceData: Omit<SharedResource, 'id'>, id?: number) => void;
  resourceData: SharedResource | null;
}

const getFileType = (fileName: string): SharedResource['type'] => {
    const extension = fileName.split('.').pop()?.toLowerCase();
    if (extension === 'pdf') return 'pdf';
    if (['doc', 'docx'].includes(extension || '')) return 'word';
    if (['mp4', 'mov', 'avi', 'wmv'].includes(extension || '')) return 'video';
    if (['png', 'jpg', 'jpeg', 'gif'].includes(extension || '')) return 'image';
    return 'pdf'; // Default
};

const ResourceModal: React.FC<ResourceModalProps> = ({ isOpen, onClose, onSave, resourceData }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (resourceData) {
      setName(resourceData.name);
      setDescription(resourceData.description);
      setFile(null); // Don't pre-fill file, user must re-select if they want to change it
    } else {
      setName('');
      setDescription('');
      setFile(null);
    }
  }, [resourceData, isOpen]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
        setFile(selectedFile);
        if(!name) { // auto-fill name if empty
            setName(selectedFile.name);
        }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!resourceData && !file) {
        setError('Please select a file to upload.');
        return;
    }

    const reader = new FileReader();
    
    // If we are editing but not changing the file
    if (resourceData && !file) {
        // FIX: Add missing 'isEncrypted' property and related crypto fields to satisfy the 'SharedResource' type.
        const updatedData: Omit<SharedResource, 'id'> = {
            name,
            description,
            uploadDate: resourceData.uploadDate,
            type: resourceData.type,
            content: resourceData.content,
            isEncrypted: resourceData.isEncrypted,
            salt: resourceData.salt,
            iv: resourceData.iv
        };
        onSave(updatedData, resourceData.id);
        onClose();
        return;
    }

    reader.onload = (event) => {
        const content = event.target?.result as ArrayBuffer;
        if (content && file) {
            // FIX: Add missing 'isEncrypted' property to satisfy the 'SharedResource' type.
            const resource: Omit<SharedResource, 'id'> = {
                name,
                description,
                uploadDate: new Date().toISOString().split('T')[0],
                type: getFileType(file.name),
                content,
                isEncrypted: false
            };
            onSave(resource, resourceData?.id);
            onClose();
        }
    };
    
    reader.onerror = () => {
        setError("Failed to read the file.");
    };

    if(file) {
       reader.readAsArrayBuffer(file);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-lg">
        <div className="flex justify-between items-center border-b pb-3 mb-4">
          <h2 className="text-xl font-bold text-slate-800">{resourceData ? 'Edit Resource' : 'Add New Resource'}</h2>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-800 text-3xl leading-none">&times;</button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700">File</label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-slate-300 border-dashed rounded-md">
                <div className="space-y-1 text-center">
                    <svg className="mx-auto h-12 w-12 text-slate-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true"><path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" /></svg>
                    <div className="flex text-sm text-slate-600">
                        <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500">
                            <span>Upload a file</span>
                            <input id="file-upload" name="file-upload" type="file" className="sr-only" ref={fileInputRef} onChange={handleFileChange} accept=".pdf,.doc,.docx,.mp4,.mov,.avi,.wmv,.png,.jpg,.jpeg,.gif"/>
                        </label>
                        <p className="pl-1">or drag and drop</p>
                    </div>
                    {file ? <p className="text-sm text-slate-500">{file.name}</p> : <p className="text-xs text-slate-500">Video, PDF, DOCX, PNG, JPG</p> }
                    {resourceData && !file && <p className="text-xs text-slate-500 font-semibold">Current file: {resourceData.name}. Upload to replace.</p>}
                </div>
            </div>
          </div>
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-slate-700">Resource Name / Title</label>
            <input type="text" name="name" id="name" value={name} onChange={(e) => setName(e.target.value)} required className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"/>
          </div>
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-slate-700">Description</label>
            <textarea name="description" id="description" value={description} onChange={(e) => setDescription(e.target.value)} rows={3} className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"/>
          </div>

          {error && <p className="text-sm text-red-600 text-center">{error}</p>}

          <div className="flex justify-end pt-4 gap-3">
            <button type="button" onClick={onClose} className="bg-slate-200 text-slate-700 font-semibold py-2 px-4 rounded-lg hover:bg-slate-300 transition-colors">Cancel</button>
            <button type="submit" className="bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors">Save Resource</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ResourceModal;