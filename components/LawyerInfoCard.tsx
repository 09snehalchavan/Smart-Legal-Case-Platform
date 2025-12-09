import React, { useState } from 'react';
import type { LawyerProfile } from '../types';
import UserCircleIcon from './icons/UserCircleIcon';
import EmailIcon from './icons/EmailIcon';
import PhoneIcon from './icons/PhoneIcon';
import LocationIcon from './icons/LocationIcon';
import ChevronDownIcon from './icons/ChevronDownIcon';
import ChevronUpIcon from './icons/ChevronUpIcon';

interface LawyerInfoCardProps {
  profile: LawyerProfile;
}

const LawyerInfoCard: React.FC<LawyerInfoCardProps> = ({ profile }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="bg-white rounded-lg shadow-md p-6 flex flex-col">
      <h3 className="text-lg font-bold text-slate-800 mb-4 border-b pb-2">Your Legal Counsel</h3>
      
      {/* Profile Header */}
      <div className="flex flex-col items-center text-center mb-4 flex-shrink-0">
          <UserCircleIcon className="w-20 h-20 text-slate-300 mb-3" />
          <h2 className="text-lg font-bold text-slate-800">{profile.name}</h2>
          <p className="text-sm text-slate-500">{profile.title}</p>
      </div>
      
      {/* Main content area, handles scrolling if needed */}
      <div className="flex-grow overflow-y-auto pr-2 -mr-2 text-sm">
        {/* Contact Info (Always Visible) */}
        <div>
            <h4 className="font-bold text-slate-700 mb-2">Contact Information</h4>
            <div className="space-y-3">
                <div className="flex items-start gap-3">
                    <EmailIcon className="w-5 h-5 text-slate-400 flex-shrink-0 mt-0.5" />
                    <a href={`mailto:${profile.email}`} className="text-blue-600 hover:underline break-all">{profile.email}</a>
                </div>
                <div className="flex items-start gap-3">
                    <PhoneIcon className="w-5 h-5 text-slate-400 flex-shrink-0 mt-0.5" />
                    <span className="text-slate-700">{profile.phone}</span>
                </div>
                 <div className="flex items-start gap-3">
                    <LocationIcon className="w-5 h-5 text-slate-400 flex-shrink-0 mt-0.5" />
                    <span className="text-slate-700">{profile.address}</span>
                </div>
            </div>
        </div>

        {/* Collapsible Section */}
        {isExpanded && (
            <div className="space-y-6 pt-4 mt-4 border-t">
                {/* About Me */}
                <div>
                    <h4 className="font-bold text-slate-700 mb-2">About Me</h4>
                    <p className="text-slate-600 leading-relaxed">{profile.bio}</p>
                </div>

                {/* Specialties */}
                <div>
                    <h4 className="font-bold text-slate-700 mb-2">Professional Specialties</h4>
                    <div className="flex flex-wrap gap-2">
                        {profile.specialties.map(spec => (
                            <span key={spec} className="bg-slate-100 text-slate-700 text-xs font-semibold px-2.5 py-1 rounded-full">{spec}</span>
                        ))}
                    </div>
                </div>

                {/* Education */}
                <div>
                    <h4 className="font-bold text-slate-700 mb-2">Education</h4>
                    <div className="space-y-3">
                        {profile.education.map((edu, index) => (
                            <div key={index}>
                                <p className="font-semibold text-slate-700">{edu.degree}</p>
                                <p className="text-slate-500">{edu.school} - {edu.year}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        )}
      </div>

      {/* Toggle Button */}
      <div className="mt-4 pt-4 border-t border-slate-200 flex-shrink-0">
          <button 
            onClick={() => setIsExpanded(!isExpanded)}
            className="w-full flex items-center justify-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-800 transition-colors"
            aria-expanded={isExpanded}
          >
              <span>{isExpanded ? 'Hide Full Profile' : 'View Full Profile'}</span>
              {isExpanded ? <ChevronUpIcon className="w-4 h-4" /> : <ChevronDownIcon className="w-4 h-4" />}
          </button>
      </div>

    </div>
  );
};

export default LawyerInfoCard;