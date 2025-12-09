import React from 'react';

const WordIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M14 2H6C4.9 2 4 2.9 4 4V20C4 21.1 4.9 22 6 22H18C19.1 22 20 21.1 20 20V8L14 2Z" fill="#2196F3"/>
        <path d="M14 2V8H20L14 2Z" fill="#1976D2"/>
        <path d="M15.5 11.5L13.5 18H11.5L9.5 11.5H11.2L12.5 15.5L13.8 11.5H15.5Z" fill="white"/>
    </svg>
);

export default WordIcon;
