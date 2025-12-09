import React, { useState, useEffect } from 'react';
import type { Client } from '../types';

interface ClientModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (clientData: Omit<Client, 'id' | 'notes' | 'createdDate'>, id?: number) => void;
  clientData: Client | null;
}

const ClientModal: React.FC<ClientModalProps> = ({ isOpen, onClose, onSave, clientData }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
  });

  useEffect(() => {
    if (clientData) {
      setFormData({
        name: clientData.name,
        email: clientData.email,
        phone: clientData.phone,
        address: clientData.address,
      });
    } else {
      // Reset for new client
      setFormData({
        name: '',
        email: '',
        phone: '',
        address: '',
      });
    }
  }, [clientData, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData, clientData?.id);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-lg">
        <div className="flex justify-between items-center border-b pb-3 mb-4">
          <h2 className="text-xl font-bold text-slate-800">{clientData ? 'Edit Client' : 'Add New Client'}</h2>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-800 text-3xl leading-none">&times;</button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-slate-700">Full Name</label>
            <input type="text" name="name" id="name" value={formData.name} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"/>
          </div>
           <div>
            <label htmlFor="email" className="block text-sm font-medium text-slate-700">Email Address</label>
            <input type="email" name="email" id="email" value={formData.email} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"/>
          </div>
           <div>
            <label htmlFor="phone" className="block text-sm font-medium text-slate-700">Phone Number</label>
            <input type="tel" name="phone" id="phone" value={formData.phone} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"/>
          </div>
           <div>
            <label htmlFor="address" className="block text-sm font-medium text-slate-700">Address</label>
            <input type="text" name="address" id="address" value={formData.address} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"/>
          </div>
          <div className="flex justify-end pt-4 gap-3">
            <button type="button" onClick={onClose} className="bg-slate-200 text-slate-700 font-semibold py-2 px-4 rounded-lg hover:bg-slate-300 transition-colors">Cancel</button>
            <button type="submit" className="bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors">Save Client</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ClientModal;