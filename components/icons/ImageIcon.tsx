import React from 'react';

const ImageIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M14 2H6C4.9 2 4 2.9 4 4V20C4 21.1 4.9 22 6 22H18C19.1 22 20 21.1 20 20V8L14 2Z" fill="#4CAF50"/>
        <path d="M14 2V8H20L14 2Z" fill="#388E3C"/>
        <path d="M15 18L12.5 14.5L11 16.5L9 14L6 18H15Z" fill="white"/>
        <circle cx="8.5" cy="11.5" r="1.5" fill="white"/>
    </svg>
);

export default ImageIcon;
