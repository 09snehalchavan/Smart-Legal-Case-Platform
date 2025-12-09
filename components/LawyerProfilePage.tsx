
import React, { useState } from 'react';
import type { LawyerProfile, Education } from '../types';
import UserCircleIcon from './icons/UserCircleIcon';
import EmailIcon from './icons/EmailIcon';
import PhoneIcon from './icons/PhoneIcon';
import LocationIcon from './icons/LocationIcon';
import EditIcon from './icons/EditIcon';
import TrashIcon from './icons/TrashIcon';
import LogoutIcon from './icons/LogoutIcon';

interface LawyerProfilePageProps {
  profileData: LawyerProfile;
  onSave: (newProfileData: LawyerProfile) => void;
  onLogout: () => void;
}

const LawyerProfilePage: React.FC<LawyerProfilePageProps> = ({ profileData, onSave, onLogout }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<LawyerProfile>(profileData);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: name === 'age' ? parseInt(value) || 0 : value }));
  };
  
  const handleEducationChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const updatedEducation = [...formData.education];
    updatedEducation[index] = { ...updatedEducation[index], [name]: value };
    setFormData(prev => ({...prev, education: updatedEducation}));
  };
  
  const addEducationField = () => {
    setFormData(prev => ({...prev, education: [...prev.education, { degree: '', school: '', year: '' }]}));
  };
  
  const removeEducationField = (index: number) => {
    setFormData(prev => ({...prev, education: prev.education.filter((_, i) => i !== index)}));
  };

  const handleSave = () => {
    onSave(formData);
    setIsEditing(false);
  };
  
  const handleCancel = () => {
    setFormData(profileData);
    setIsEditing(false);
  };

  const InfoItem: React.FC<{ icon: React.ReactNode; value: React.ReactNode }> = ({ icon, value }) => (
    <div className="flex items-start gap-4 text-sm">
        <div className="flex-shrink-0 text-slate-400 mt-0.5">{icon}</div>
        <div className="text-slate-700">{value}</div>
    </div>
  );

  return (
    <div className="w-full space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-slate-800">My Profile</h1>
        <div className="flex items-center gap-4">
            {!isEditing && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 text-sm"
                >
                  <EditIcon className="w-4 h-4" />
                  Edit Profile
                </button>
            )}
             <button
                onClick={onLogout}
                className="bg-white text-slate-700 font-semibold py-2 px-4 rounded-lg border border-slate-300 hover:bg-slate-50 transition-colors flex items-center gap-2 text-sm"
              >
                <LogoutIcon className="w-4 h-4" />
                Logout
            </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex flex-col items-center">
                    <UserCircleIcon className="w-24 h-24 text-slate-300 mb-4" />
                    {isEditing ? (
                        <input type="text" name="name" value={formData.name} onChange={handleInputChange} className="text-xl font-bold text-slate-800 text-center border-b-2 w-full" />
                    ) : (
                        <h2 className="text-xl font-bold text-slate-800">{formData.name}</h2>
                    )}
                    {isEditing ? (
                         <input type="text" name="title" value={formData.title} onChange={handleInputChange} className="text-sm text-slate-500 text-center border-b-2 w-full mt-1" />
                    ) : (
                        <p className="text-sm text-slate-500">{formData.title}</p>
                    )}
                </div>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-bold text-slate-800 mb-4 border-b pb-2">Contact & Personal Info</h3>
                <div className="space-y-4">
                    <InfoItem icon={<EmailIcon className="w-5 h-5"/>} value={isEditing ? <input type="email" name="email" value={formData.email} onChange={handleInputChange} className="w-full border-b"/> : formData.email} />
                    <InfoItem icon={<PhoneIcon className="w-5 h-5"/>} value={isEditing ? <input type="tel" name="phone" value={formData.phone} onChange={handleInputChange} className="w-full border-b"/> : formData.phone} />
                    <InfoItem icon={<LocationIcon className="w-5 h-5"/>} value={isEditing ? <input type="text" name="address" value={formData.address} onChange={handleInputChange} className="w-full border-b"/> : formData.address} />
                    <InfoItem icon={<UserCircleIcon className="w-5 h-5"/>} value={`Age: ${isEditing ? <input type="number" name="age" value={formData.age} onChange={handleInputChange} className="w-20 border-b"/> : formData.age}`} />
                </div>
            </div>
        </div>

        {/* Right Column */}
        <div className="lg:col-span-2 space-y-6">
             <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-bold text-slate-800 mb-4">About Me</h3>
                {isEditing ? (
                    <textarea name="bio" value={formData.bio} onChange={handleInputChange} rows={6} className="w-full text-sm text-slate-600 border rounded-md p-2"/>
                ) : (
                    <p className="text-sm text-slate-600 leading-relaxed">{formData.bio}</p>
                )}
            </div>
             <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-bold text-slate-800 mb-4">Professional Specialties</h3>
                 {isEditing ? (
                    <input type="text" name="specialties" value={formData.specialties.join(', ')} onChange={(e) => setFormData(prev => ({...prev, specialties: e.target.value.split(',').map(s => s.trim())}))} className="w-full text-sm text-slate-600 border rounded-md p-2" placeholder="Corporate Law, Litigation, ..."/>
                 ) : (
                    <div className="flex flex-wrap gap-2">
                        {formData.specialties.map(spec => <span key={spec} className="bg-slate-100 text-slate-700 text-xs font-semibold px-2.5 py-1 rounded-full">{spec}</span>)}
                    </div>
                 )}
            </div>
             <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-bold text-slate-800 mb-4">Education</h3>
                <div className="space-y-4">
                    {formData.education.map((edu, index) => (
                        <div key={index} className="flex items-center gap-4">
                           <div className="flex-grow">
                                {isEditing ? (
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                                        <input type="text" name="degree" value={edu.degree} onChange={(e) => handleEducationChange(index, e)} placeholder="Degree" className="text-sm font-bold border-b"/>
                                        <input type="text" name="school" value={edu.school} onChange={(e) => handleEducationChange(index, e)} placeholder="School" className="text-sm border-b"/>
                                        <input type="text" name="year" value={edu.year} onChange={(e) => handleEducationChange(index, e)} placeholder="Year" className="text-sm border-b"/>
                                    </div>
                                ) : (
                                    <>
                                        <p className="font-bold text-sm text-slate-700">{edu.degree}</p>
                                        <p className="text-sm text-slate-500">{edu.school} - {edu.year}</p>
                                    </>
                                )}
                           </div>
                           {isEditing && (
                               <button onClick={() => removeEducationField(index)} className="text-red-500 hover:text-red-700"><TrashIcon/></button>
                           )}
                        </div>
                    ))}
                    {isEditing && (
                        <button onClick={addEducationField} className="text-sm text-blue-600 hover:underline">+ Add Education</button>
                    )}
                </div>
            </div>
        </div>
      </div>
      {isEditing && (
        <div className="flex justify-end gap-4 mt-6">
            <button onClick={handleCancel} className="bg-slate-200 text-slate-700 font-semibold py-2 px-6 rounded-lg hover:bg-slate-300">Cancel</button>
            <button onClick={handleSave} className="bg-blue-600 text-white font-semibold py-2 px-6 rounded-lg hover:bg-blue-700">Save Changes</button>
        </div>
      )}
    </div>
  );
};

export default LawyerProfilePage;
