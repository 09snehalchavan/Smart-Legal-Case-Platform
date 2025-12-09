import React from 'react';
import { APPOINTMENTS } from '../constants';
import type { Appointment } from '../types';

interface AppointmentsPageProps {
  onBack: () => void;
}

const AppointmentsPage: React.FC<AppointmentsPageProps> = ({ onBack }) => {
  const today = new Date().toISOString().split('T')[0];
  const todaysAppointments = APPOINTMENTS.filter(app => app.date === today);

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-slate-800">Today's Appointments</h1>
        <button
          onClick={onBack}
          className="bg-white text-slate-700 font-semibold py-2 px-4 rounded-lg border border-slate-300 hover:bg-slate-50 transition-colors text-sm"
        >
          &larr; Back to Dashboard
        </button>
      </div>
      <div className="space-y-4">
        {todaysAppointments.length > 0 ? (
          todaysAppointments.map((appointment: Appointment) => (
            <div key={appointment.id} className="bg-white rounded-lg shadow-md p-6 border border-slate-200">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="font-bold text-lg text-slate-800">{appointment.title}</h2>
                  <p className="text-sm text-slate-500 mt-1">Client: {appointment.client}</p>
                </div>
                <p className="text-sm font-semibold text-slate-600 bg-slate-100 px-3 py-1 rounded-full">
                  Case #: {appointment.caseNumber}
                </p>
              </div>
            </div>
          ))
        ) : (
          <div className="bg-white rounded-lg shadow-md p-6 text-center text-slate-500">
            <p>No appointments scheduled for today.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AppointmentsPage;
