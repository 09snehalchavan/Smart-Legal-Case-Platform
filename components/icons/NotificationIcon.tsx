import React from 'react';

interface NotificationIconProps {
  className?: string;
  hasNotification?: boolean;
}

const NotificationIcon: React.FC<NotificationIconProps> = ({ className = "w-6 h-6", hasNotification }) => (
  <div className="relative">
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
    </svg>
    {hasNotification && (
      <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-slate-800"></span>
    )}
  </div>
);

export default NotificationIcon;
