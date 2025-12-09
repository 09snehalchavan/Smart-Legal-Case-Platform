
import React from 'react';

const ClientQuickview: React.FC = () => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-bold text-slate-800 mb-4">Client Quickview</h3>
      <div>
        <p className="text-sm text-slate-600"><span className="font-semibold">Contact:</span> Candice J. Etterall</p>
        <p className="text-sm text-slate-600"><span className="font-semibold">Email:</span> c.jetterall@example.com</p>
        <p className="text-sm text-slate-600"><span className="font-semibold">Phone:</span> 555-712-467</p>
      </div>
      <button className="mt-4 w-full bg-slate-200 text-slate-700 font-semibold py-2 px-4 rounded-lg hover:bg-slate-300 transition-colors">
        View Profile
      </button>
    </div>
  );
};

export default ClientQuickview;
