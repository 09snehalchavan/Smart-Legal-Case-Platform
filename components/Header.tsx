import React, { useState, useEffect, useRef } from 'react';
import NotificationIcon from './icons/NotificationIcon';
import UpcomingHearings from './UpcomingHearings';
import { UPCOMING_HEARINGS } from '../constants';

const SearchIcon: React.FC<{ className?: string }> = ({ className = "w-5 h-5" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
);

interface HeaderProps {
  lawyerName: string;
  lawyerTitle: string;
  searchQuery: string;
  onSearch: (query: string) => void;
}

const Header: React.FC<HeaderProps> = ({ 
  lawyerName,
  lawyerTitle,
  searchQuery, 
  onSearch, 
}) => {
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [hasNotification, setHasNotification] = useState(false);
  const notificationsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Show notification dot if there are any hearings at all
    setHasNotification(UPCOMING_HEARINGS.length > 0);
  }, []);

  // Effect to handle clicks outside the notification dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationsRef.current && !notificationsRef.current.contains(event.target as Node)) {
        setIsNotificationsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [notificationsRef]);

  return (
    <header className="bg-slate-800 text-white h-20 flex-shrink-0">
        <div className="h-full flex items-center justify-end px-6">
            <div className="flex items-center gap-6">
                <div className="relative">
                    <input
                        type="text"
                        placeholder="Search..."
                        className="bg-slate-700 text-white placeholder-slate-400 rounded-full py-2 pl-10 pr-4 w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={searchQuery}
                        onChange={(e) => onSearch(e.target.value)}
                    />
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <SearchIcon className="text-slate-400" />
                    </div>
                </div>
                 <div className="relative" ref={notificationsRef}>
                    <button 
                        onClick={() => setIsNotificationsOpen(prev => !prev)}
                        className="text-slate-400 hover:text-white focus:outline-none"
                    >
                        <NotificationIcon hasNotification={hasNotification} className="w-6 h-6" />
                    </button>
                    {isNotificationsOpen && (
                        <div className="absolute right-0 mt-2 w-96 rounded-lg shadow-xl z-20 text-slate-800 overflow-hidden">
                            <UpcomingHearings />
                        </div>
                    )}
                 </div>
                <div className="w-px h-8 bg-slate-700" />
                <div className="text-right">
                    <div className="font-bold">{lawyerName}</div>
                    <div className="text-xs text-slate-400 uppercase tracking-wider">{lawyerTitle}</div>
                </div>
            </div>
        </div>
    </header>
  );
};

export default Header;