import React, { useState } from 'react';
import type { Client } from '../types';
import UserCircleIcon from './icons/UserCircleIcon';
import EditIcon from './icons/EditIcon';
import TrashIcon from './icons/TrashIcon';
import ClientModal from './ClientModal';

const AddIcon: React.FC<{ className?: string }> = ({ className = "w-5 h-5" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
    </svg>
);

interface ClientsPageProps {
  clients: Client[];
  searchQuery: string;
  onSelectClient: (clientId: number) => void;
  onSaveClient: (clientData: Omit<Client, 'id' | 'notes' | 'createdDate'>, id?: number) => void;
  onDeleteClient: (clientId: number) => void;
}

const ClientsPage: React.FC<ClientsPageProps> = ({ clients, searchQuery, onSelectClient, onSaveClient, onDeleteClient }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  
  const filteredClients = clients.filter(client =>
    client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    client.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddNew = () => {
    setSelectedClient(null);
    setIsModalOpen(true);
  };

  const handleEdit = (client: Client) => {
    setSelectedClient(client);
    setIsModalOpen(true);
  };

  const handleDelete = (clientId: number) => {
    if (window.confirm('Are you sure you want to delete this client? This will permanently remove their profile.')) {
      onDeleteClient(clientId);
    }
  };
  
  const handleSave = (clientData: Omit<Client, 'id' | 'notes' | 'createdDate'>, id?: number) => {
    onSaveClient(clientData, id);
    setIsModalOpen(false);
  };

  return (
    <>
      <div className="w-full">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-slate-800">Clients</h1>
          <button
            onClick={handleAddNew}
            className="bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <AddIcon /> Add New Client
          </button>
        </div>
        <div className="bg-white rounded-lg shadow-md">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-slate-500">
              <thead className="text-xs text-slate-700 uppercase bg-slate-50">
                <tr>
                  <th scope="col" className="px-6 py-4 font-medium">Client Name</th>
                  <th scope="col" className="px-6 py-4 font-medium">Email Address</th>
                  <th scope="col" className="px-6 py-4 font-medium">Phone Number</th>
                  <th scope="col" className="px-6 py-4 font-medium text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredClients.length > 0 ? (
                  filteredClients.map((client: Client) => (
                    <tr key={client.id} className="bg-white border-b last:border-b-0 hover:bg-slate-50">
                      <td className="px-6 py-4 font-medium text-slate-900 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-slate-200 flex items-center justify-center">
                              <UserCircleIcon className="w-7 h-7 text-slate-500" />
                          </div>
                          <span>{client.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">{client.email}</td>
                      <td className="px-6 py-4">{client.phone}</td>
                      <td className="px-6 py-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                           <button 
                              onClick={() => onSelectClient(client.id)}
                              className="bg-slate-100 text-slate-700 font-semibold py-1 px-3 rounded-md hover:bg-slate-200 transition-colors text-xs"
                            >
                              View
                            </button>
                            <button onClick={() => handleEdit(client)} className="p-2 rounded-full text-slate-500 hover:bg-slate-200" title="Edit Client">
                                <EditIcon />
                            </button>
                            <button onClick={() => handleDelete(client.id)} className="p-2 rounded-full text-red-500 hover:bg-red-50" title="Delete Client">
                                <TrashIcon />
                            </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="text-center py-10 text-slate-500">
                      {searchQuery ? `No clients found for "${searchQuery}".` : "No clients found. Add one to get started."}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      {isModalOpen && (
          <ClientModal 
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onSave={handleSave}
            clientData={selectedClient}
          />
      )}
    </>
  );
};

export default ClientsPage;