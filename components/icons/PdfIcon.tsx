import React from 'react';

const PdfIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M14 2H6C4.9 2 4 2.9 4 4V20C4 21.1 4.9 22 6 22H18C19.1 22 20 21.1 20 20V8L14 2Z" fill="#F44336"/>
        <path d="M14 2V8H20L14 2Z" fill="#D32F2F"/>
        <path d="M11 18H13V15H15.5C16.3 15 17 14.3 17 13.5V12.5C17 11.7 16.3 11 15.5 11H11V18Z" fill="white"/>
        <path d="M8 11H10V12H8V11Z" fill="white"/>
        <path d="M8 14H10V15H8V14Z" fill="white"/>
        <path d="M8 17H10V18H8V17Z" fill="white"/>
    </svg>
);

export default PdfIcon;
