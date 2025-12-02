
import React, { useState } from 'react';
import { FileCheck, CheckCircle, XCircle, Clock, UserCheck } from 'lucide-react';
import { generateApprovalRequests } from '../../services/calculationService';

const ApprovalCenter: React.FC = () => {
  const [requests, setRequests] = useState(generateApprovalRequests());

  const handleAction = (id: string, action: 'Approved' | 'Rejected') => {
      setRequests(prev => prev.map(req => 
          req.id === id ? { ...req, status: action } : req
      ));
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden animate-in fade-in duration-500">
      <div className="p-4 border-b border-slate-200 bg-slate-50">
         <h3 className="font-semibold text-slate-800 flex items-center gap-2">
            <UserCheck size={18} className="text-indigo-600" /> Approvals & Workflows (Part 29)
         </h3>
         <p className="text-xs text-slate-500 mt-1">Digital Stamping & Change Request Management</p>
      </div>
      <div className="divide-y divide-slate-100">
         {requests.map(req => (
             <div key={req.id} className="p-4 hover:bg-slate-50 flex items-center justify-between">
                 <div>
                     <div className="flex items-center gap-2">
                         <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                             req.type === 'Drawing' ? 'bg-blue-100 text-blue-700' : 
                             req.type === 'Variation' ? 'bg-purple-100 text-purple-700' : 'bg-orange-100 text-orange-700'
                         }`}>{req.type}</span>
                         <h4 className="font-medium text-slate-800">{req.subject}</h4>
                     </div>
                     <p className="text-xs text-slate-500 mt-1">
                         Req by: {req.requestedBy} • Date: {req.date} • Ver: {req.version}
                     </p>
                     {req.comments && <p className="text-xs text-slate-600 italic mt-1">"{req.comments}"</p>}
                 </div>
                 
                 <div className="flex items-center gap-3">
                     {req.status === 'Pending' ? (
                         <>
                            <button 
                                onClick={() => handleAction(req.id, 'Rejected')}
                                className="p-2 rounded-full text-red-500 hover:bg-red-50 transition-colors" title="Reject"
                            >
                                <XCircle size={20} />
                            </button>
                            <button 
                                onClick={() => handleAction(req.id, 'Approved')}
                                className="p-2 rounded-full text-emerald-500 hover:bg-emerald-50 transition-colors" title="Approve"
                            >
                                <CheckCircle size={20} />
                            </button>
                         </>
                     ) : (
                         <span className={`flex items-center gap-1 text-xs font-bold px-3 py-1 rounded-full ${
                             req.status === 'Approved' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
                         }`}>
                             {req.status === 'Approved' ? <FileCheck size={14}/> : <XCircle size={14}/>}
                             {req.status}
                         </span>
                     )}
                 </div>
             </div>
         ))}
      </div>
    </div>
  );
};

export default ApprovalCenter;
