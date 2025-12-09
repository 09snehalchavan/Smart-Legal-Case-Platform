import React from 'react';
import { NAV_ITEMS } from '../constants';
import type { NavItem } from '../types';

interface SidebarProps {
  activeItem: string;
  onNavigate: (itemName: string) => void;
}

const ScalesIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-3.5 15.5L4 13l1.41-1.41L8.5 15.68 18.09 6.09 19.5 7.5l-11 11z" opacity="0" />
    <path d="M3 8l7.58 2.37-2.73 8.19L3 16.22V8zm18 0v8.22l-5.85 2.34-2.73-8.19L21 8zM12 3l-4 1.33V17h8V4.33L12 3zm0 2.69L13.93 7H10.07L12 5.69z" />
  </svg>
);


const Sidebar: React.FC<SidebarProps> = ({ activeItem, onNavigate }) => {
  return (
    <div className="w-64 bg-slate-800 text-white flex flex-col">
      <div className="flex items-center justify-center h-20 border-b border-slate-700 px-4">
        <ScalesIcon className="w-10 h-10 text-cyan-400 flex-shrink-0" />
        <div className="ml-3">
          <h1 className="text-lg font-semibold">Smart Legal Case Platform</h1>
        </div>
      </div>
      <nav className="flex-1 px-4 py-6 space-y-2">
        {NAV_ITEMS.map((item: NavItem) => (
          <a
            key={item.name}
            href="#"
            onClick={(e) => {
              e.preventDefault();
              onNavigate(item.name);
            }}
            className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors duration-200 ${
              activeItem === item.name
                ? 'bg-blue-600 text-white'
                : 'text-slate-300 hover:bg-slate-700 hover:text-white'
            }`}
          >
            <item.icon className="w-5 h-5 mr-3" />
            <span>{item.name}</span>
          </a>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;