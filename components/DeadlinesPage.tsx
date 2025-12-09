import React, { useState } from 'react';
import type { Task } from '../types';
import TaskModal from './TaskModal';
import EditIcon from './icons/EditIcon';
import TrashIcon from './icons/TrashIcon';
import ViewIcon from './icons/ViewIcon';
import CheckCircleIcon from './icons/CheckCircleIcon';
import UndoIcon from './icons/UndoIcon';

const AddIcon: React.FC<{ className?: string }> = ({ className = "w-5 h-5" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
    </svg>
);

const CalendarIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-slate-500" fill="none" viewBox="0 0 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
);

interface DeadlinesPageProps {
  tasks: Task[];
  onSaveTask: (taskData: Omit<Task, 'id' | 'completed'>, id?: number) => void;
  onDeleteTask: (taskId: number) => void;
  onToggleCompleteTask: (taskId: number) => void;
  onBack: () => void;
}

const DeadlinesPage: React.FC<DeadlinesPageProps> = ({ tasks, onSaveTask, onDeleteTask, onToggleCompleteTask, onBack }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isViewOnly, setIsViewOnly] = useState(false);
  const [showToast, setShowToast] = useState(false);

  const handleAddNewTask = () => {
    setSelectedTask(null);
    setIsViewOnly(false);
    setIsModalOpen(true);
  };

  const handleEditClick = (task: Task) => {
    setSelectedTask(task);
    setIsViewOnly(false);
    setIsModalOpen(true);
  };

  const handleViewClick = (task: Task) => {
    setSelectedTask(task);
    setIsViewOnly(true);
    setIsModalOpen(true);
  };

  const handleDelete = (taskId: number) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      onDeleteTask(taskId);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    }
  };

  const handleToggleComplete = (taskId: number) => {
    onToggleCompleteTask(taskId);
  };
  
  const handleSaveTask = (taskData: Omit<Task, 'id' | 'completed'>) => {
    onSaveTask(taskData, selectedTask?.id);
    setIsModalOpen(false);
  };

  return (
    <>
      {showToast && (
        <div className="fixed top-6 right-6 bg-green-500 text-white py-3 px-6 rounded-lg shadow-lg flex items-center gap-3 z-50 animate-fade-in-out">
          <CheckCircleIcon className="w-6 h-6" />
          <span>Task deleted successfully!</span>
        </div>
      )}
      <div className="w-full">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-slate-800">Upcoming Deadlines & Tasks</h1>
          <div className="flex items-center gap-4">
            <button
              onClick={handleAddNewTask}
              className="bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 text-sm"
            >
              <AddIcon />
              Add Task
            </button>
            <button
              onClick={onBack}
              className="bg-white text-slate-700 font-semibold py-2 px-4 rounded-lg border border-slate-300 hover:bg-slate-50 transition-colors text-sm"
            >
              &larr; Back to Dashboard
            </button>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          {tasks.length > 0 ? (
            <ul className="divide-y divide-slate-200">
              {tasks.map((task: Task) => (
                <li key={task.id} className="flex items-center justify-between gap-4 py-4">
                  <div className="flex items-start gap-4 flex-1">
                    <div className="flex-shrink-0 pt-1">
                      <CalendarIcon />
                    </div>
                    <div className={`transition-opacity ${task.completed ? 'opacity-50 line-through' : ''}`}>
                      <p className="font-semibold text-slate-800">{task.title}</p>
                      <p className="text-sm text-slate-600">{task.details}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <button
                      onClick={() => handleToggleComplete(task.id)}
                      title={task.completed ? 'Mark as Incomplete' : 'Mark as Complete'}
                      className={`p-2 rounded-full transition-colors ${task.completed ? 'text-orange-500 hover:bg-orange-100' : 'text-green-500 hover:bg-green-100'}`}
                    >
                      {task.completed ? <UndoIcon /> : <CheckCircleIcon />}
                    </button>
                    <button onClick={() => handleViewClick(task)} title="View Details" className="p-2 rounded-full text-slate-500 hover:bg-slate-200 transition-colors"><ViewIcon /></button>
                    <button onClick={() => handleEditClick(task)} title="Edit Task" className="p-2 rounded-full text-blue-600 hover:bg-blue-100 transition-colors"><EditIcon /></button>
                    <button onClick={() => handleDelete(task.id)} title="Delete Task" className="p-2 rounded-full text-red-500 hover:bg-red-100 transition-colors"><TrashIcon /></button>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="text-center py-10 text-slate-500">
              <p>No upcoming tasks. Add one to get started!</p>
            </div>
          )}
        </div>
      </div>
      {isModalOpen && (
        <TaskModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSaveTask}
          taskData={selectedTask}
          isViewOnly={isViewOnly}
        />
      )}
    </>
  );
};

export default DeadlinesPage;