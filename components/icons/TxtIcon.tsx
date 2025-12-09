import React from 'react';

const TxtIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M14 2H6C4.9 2 4 2.9 4 4V20C4 21.1 4.9 22 6 22H18C19.1 22 20 21.1 20 20V8L14 2Z" fill="#9E9E9E"/>
        <path d="M14 2V8H20L14 2Z" fill="#757575"/>
        <path d="M9 12H15" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M9 15H15" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M9 18H12" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
);

export default TxtIcon;
