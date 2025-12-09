
import React, { useState, useEffect } from 'react';
import type { Client, Case, ClientNote } from '../types';
import EmailIcon from './icons/EmailIcon';
import PhoneIcon from './icons/PhoneIcon';
import LocationIcon from './icons/LocationIcon';
import UserCircleIcon from './icons/UserCircleIcon';
import EditIcon from './icons/EditIcon';
import TrashIcon from './icons/TrashIcon';


interface ClientProfilePageProps {
  client: Client;
  cases: Case[];
  onBack: () => void;
  onAddNote: (clientId: number, noteText: string) => void;
  onUpdateNote: (clientId: number, noteId: number, newText: string) => void;
  onDeleteNote: (clientId: number, noteId: number) => void;
  onUpdateClient: (client: Client) => void;
}

const ClientProfilePage: React.FC<ClientProfilePageProps> = ({ client, cases, onBack, onAddNote, onUpdateNote, onDeleteNote, onUpdateClient }) => {
    const [newNote, setNewNote] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState<Client>(client);
    const [editingNoteId, setEditingNoteId] = useState<number | null>(null);
    const [editedNoteText, setEditedNoteText] = useState('');

    useEffect(() => {
        setFormData(client);
    }, [client]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSave = () => {
        onUpdateClient(formData);
        setIsEditing(false);
    };

    const handleCancel = () => {
        setFormData(client);
        setIsEditing(false);
    };

    const handleAddNote = () => {
        if (newNote.trim()) {
            onAddNote(client.id, newNote.trim());
            setNewNote('');
        }
    };

    const startEditingNote = (note: ClientNote) => {
        setEditingNoteId(note.id);
        setEditedNoteText(note.text);
    };

    const cancelEditingNote = () => {
        setEditingNoteId(null);
        setEditedNoteText('');
    };

    const saveEditedNote = (noteId: number) => {
        if (editedNoteText.trim()) {
            onUpdateNote(client.id, noteId, editedNoteText.trim());
            setEditingNoteId(null);
            setEditedNoteText('');
        }
    };

    const deleteNote = (noteId: number) => {
        if (window.confirm('Are you sure you want to delete this note?')) {
            onDeleteNote(client.id, noteId);
        }
    };
    
  return (
    <div className="w-full space-y-6">
       <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-slate-800">Client Profile</h1>
        <div className="flex items-center gap-4">
            {!isEditing && (
                <button
                    onClick={() => setIsEditing(true)}
                    className="bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 text-sm"
                >
                    <EditIcon className="w-4 h-4" />
                    Edit Profile
                </button>
            )}
            <button
              onClick={onBack}
              className="bg-white text-slate-700 font-semibold py-2 px-4 rounded-lg border border-slate-300 hover:bg-slate-50 transition-colors text-sm"
            >
              &larr; Back to Client List
            </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Client Info */}
        <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
                <UserCircleIcon className="w-24 h-24 text-slate-300 mx-auto mb-4" />
                {isEditing ? (
                  <input type="text" name="name" value={formData.name} onChange={handleInputChange} className="text-xl font-bold text-slate-800 text-center border-b-2 w-full p-1"/>
                ) : (
                  <h2 className="text-xl font-bold text-slate-800">{client.name}</h2>
                )}
                <p className="text-sm text-slate-500">Client since {client.createdDate}</p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-bold text-slate-800 mb-4 border-b pb-2">Contact Information</h3>
                <ul className="space-y-3 text-sm">
                    <li className="flex items-center gap-3">
                        <EmailIcon className="w-5 h-5 text-slate-400 flex-shrink-0" />
                        {isEditing ? (
                          <input type="email" name="email" value={formData.email} onChange={handleInputChange} className="w-full text-slate-700 border-b"/>
                        ) : (
                          <span className="text-slate-700 break-all">{client.email}</span>
                        )}
                    </li>
                    <li className="flex items-center gap-3">
                        <PhoneIcon className="w-5 h-5 text-slate-400 flex-shrink-0" />
                         {isEditing ? (
                          <input type="tel" name="phone" value={formData.phone} onChange={handleInputChange} className="w-full text-slate-700 border-b"/>
                        ) : (
                          <span className="text-slate-700">{client.phone}</span>
                        )}
                    </li>
                    <li className="flex items-center gap-3">
                        <LocationIcon className="w-5 h-5 text-slate-400 flex-shrink-0" />
                        {isEditing ? (
                          <input type="text" name="address" value={formData.address} onChange={handleInputChange} className="w-full text-slate-700 border-b"/>
                        ) : (
                          <span className="text-slate-700">{client.address}</span>
                        )}
                    </li>
                </ul>
            </div>
        </div>

        {/* Right Column: Cases & Notes */}
        <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-lg shadow-md">
                <h3 className="text-lg font-bold text-slate-800 p-6 border-b">Associated Cases ({cases.length})</h3>
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
                            {cases.map(caseItem => (
                                <tr key={caseItem.id} className="bg-white border-b last:border-b-0 hover:bg-slate-50">
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
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-bold text-slate-800 mb-4">Client Notes</h3>
                <div className="space-y-4 max-h-60 overflow-y-auto pr-2">
                    {client.notes.length > 0 ? [...client.notes].sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map(note => (
                        <div key={note.id} className="text-sm border-b border-slate-100 pb-3 last:border-b-0 group">
                            {editingNoteId === note.id ? (
                                <div className="space-y-2">
                                    <textarea 
                                        className="w-full p-2 border border-blue-300 rounded text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm"
                                        rows={3}
                                        value={editedNoteText}
                                        onChange={(e) => setEditedNoteText(e.target.value)}
                                    />
                                    <div className="flex gap-2 justify-end">
                                        <button onClick={cancelEditingNote} className="px-3 py-1 text-xs bg-slate-200 text-slate-700 rounded hover:bg-slate-300 transition-colors">Cancel</button>
                                        <button onClick={() => saveEditedNote(note.id)} className="px-3 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors">Save</button>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <div className="flex justify-between items-start">
                                        <p className="text-slate-700 whitespace-pre-wrap flex-1 mr-2">{note.text}</p>
                                        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button 
                                                onClick={() => startEditingNote(note)} 
                                                className="text-slate-400 hover:text-blue-600 transition-colors"
                                                title="Edit Note"
                                            >
                                                <EditIcon className="w-4 h-4" />
                                            </button>
                                            <button 
                                                onClick={() => deleteNote(note.id)} 
                                                className="text-slate-400 hover:text-red-500 transition-colors"
                                                title="Delete Note"
                                            >
                                                <TrashIcon className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 text-xs text-slate-400 mt-1">
                                        <UserCircleIcon className="w-4 h-4" />
                                        <span>{note.author} - {new Date(note.date).toLocaleDateString()} {new Date(note.date).toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'})}</span>
                                    </div>
                                </>
                            )}
                        </div>
                    )) : <p className="text-sm text-slate-500 text-center py-4">No notes for this client.</p>}
                </div>
                 <div className="mt-4 pt-4 border-t">
                     <textarea
                        value={newNote}
                        onChange={(e) => setNewNote(e.target.value)}
                        placeholder="Add a new note..."
                        className="w-full h-20 p-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <div className="flex justify-end mt-2">
                        <button onClick={handleAddNote} className="bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-700 text-sm">Add Note</button>
                    </div>
                </div>
            </div>
        </div>
      </div>
      {isEditing && (
        <div className="flex justify-end gap-4 mt-6">
            <button onClick={handleCancel} className="bg-slate-200 text-slate-700 font-semibold py-2 px-6 rounded-lg hover:bg-slate-300">Cancel</button>
            <button onClick={handleSave} className="bg-blue-600 text-white font-semibold py-2 px-6 rounded-lg hover:bg-blue-700">Save Changes</button>
        </div>
      )}
    </div>
  );
};

export default ClientProfilePage;
