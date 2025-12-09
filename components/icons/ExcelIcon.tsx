import React from 'react';

const ExcelIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M14 2H6C4.9 2 4 2.9 4 4V20C4 21.1 4.9 22 6 22H18C19.1 22 20 21.1 20 20V8L14 2Z" fill="#4CAF50"/>
        <path d="M14 2V8H20L14 2Z" fill="#388E3C"/>
        <path d="M10.4 11.4L12 14L13.6 11.4H15L12.8 15L15 18.6H13.6L12 16L10.4 18.6H9L11.2 15L9 11.4H10.4Z" fill="white"/>
    </svg>
);

export default ExcelIcon;
