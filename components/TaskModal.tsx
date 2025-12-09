import React, { useState, useEffect } from 'react';
import type { Task } from '../types';

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (taskData: Omit<Task, 'id' | 'completed'>) => void;
  taskData: Task | null;
  isViewOnly: boolean;
}

const TaskModal: React.FC<TaskModalProps> = ({ isOpen, onClose, onSave, taskData, isViewOnly }) => {
  const [formData, setFormData] = useState({
    title: '',
    details: '',
  });

  useEffect(() => {
    if (taskData) {
      setFormData({
        title: taskData.title,
        details: taskData.details,
      });
    } else {
      // Reset for new task
      setFormData({ title: '', details: '' });
    }
  }, [taskData, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isViewOnly) {
      onSave(formData);
    }
  };

  if (!isOpen) return null;

  const modalTitle = isViewOnly ? 'View Task' : (taskData ? 'Update Task' : 'Add New Task');

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-lg">
        <div className="flex justify-between items-center border-b pb-3 mb-4">
          <h2 className="text-xl font-bold text-slate-800">{modalTitle}</h2>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-800 text-3xl leading-none">&times;</button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-slate-700">Task Title</label>
            <input 
              type="text" 
              name="title" 
              id="title" 
              value={formData.title} 
              onChange={handleChange} 
              required 
              disabled={isViewOnly}
              className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 disabled:bg-slate-100"
            />
          </div>
          <div>
            <label htmlFor="details" className="block text-sm font-medium text-slate-700">Details / Associated Case</label>
            <textarea 
              name="details" 
              id="details" 
              value={formData.details} 
              onChange={handleChange} 
              required 
              disabled={isViewOnly}
              rows={4}
              className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 disabled:bg-slate-100"
            />
          </div>
          <div className="flex justify-end pt-4 gap-3">
            <button type="button" onClick={onClose} className="bg-slate-200 text-slate-700 font-semibold py-2 px-4 rounded-lg hover:bg-slate-300 transition-colors">
              {isViewOnly ? 'Close' : 'Cancel'}
            </button>
            {!isViewOnly && (
              <button type="submit" className="bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors">Save Task</button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskModal;