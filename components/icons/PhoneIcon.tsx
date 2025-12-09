import React from 'react';

const PhoneIcon: React.FC<{ className?: string }> = ({ className = "w-5 h-5" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.211-.998-.552-1.348l-2.46-2.46a2.25 2.25 0 00-3.182 0l-1.368 1.368c-.19.19-.462.285-.718.285-.256 0-.528-.095-.718-.285l-4.243-4.243c-.38-.38-.38-1.006 0-1.386l1.368-1.368a2.25 2.25 0 000-3.182l-2.46-2.46A2.25 2.25 0 006.128 2.25H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
    </svg>
);

export default PhoneIcon;
