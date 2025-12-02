

import React, { useMemo, useState } from 'react';
import { CheckSquare, FileText, Lock, Download, UserCheck, Package, Loader2 } from 'lucide-react';
import { generateClosureData } from '../../services/calculationService';
import { ActionCost } from '../../types/index';

interface ProjectClosureProps {
  onActionRequest?: (action: () => void, costKey: keyof ActionCost) => void;
}

const ProjectClosure: React.FC<ProjectClosureProps> = ({ onActionRequest }) => {
  const documents = useMemo(() => generateClosureData(), []);
  const [isGenerating, setIsGenerating] = useState(false);

  const dossierAction = () => {
    setIsGenerating(true);
    setTimeout(() => {
        setIsGenerating(false);
        alert("Project Handover Dossier (ZIP) has been generated successfully!");
    }, 2500);
  };

  const handleGenerateDossier = () => {
    if (onActionRequest) {
      onActionRequest(dossierAction, 'handoverDossier');
    } else {
      dossierAction();
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="bg-gradient-to-r from-slate-800 to-slate-900 p-6 rounded-xl text-white shadow-lg">
          <div className="flex justify-between items-center">
             <div>
                 <h2 className="text-2xl font-bold flex items-center gap-2">
                     <Lock size={24} className="text-emerald-400" /> Project Closure & Handover
                 </h2>
                 <p className="text-slate-300 mt-1">Finalize documentation, settle accounts, and generate handover dossier.</p>
             </div>
             <div className="bg-emerald-500/20 border border-emerald-500/50 px-4 py-2 rounded-lg">
                 <span className="text-emerald-300 font-bold">Status: 85% Ready</span>
             </div>
          </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-slate-200 bg-slate-50">
              <h3 className="font-semibold text-slate-800 flex items-center gap-2">
                  <FileText size={18} className="text-slate-500" /> Handover Checklist
              </h3>
          </div>
          <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50 border-b border-slate-200 text-xs uppercase text-slate-500 font-semibold">
                  <tr>
                      <th className="px-6 py-3">Document Name</th>
                      <th className="px-6 py-3">Type</th>
                      <th className="px-6 py-3 text-center">Status</th>
                      <th className="px-6 py-3 text-center">Action</th>
                  </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                  {documents.map(doc => (
                      <tr key={doc.id} className="hover:bg-slate-50">
                          <td className="px-6 py-4 font-medium text-slate-800">{doc.name}</td>
                          <td className="px-6 py-4"><span className="bg-slate-100 text-slate-600 px-2 py-1 rounded text-xs">{doc.type}</span></td>
                          <td className="px-6 py-4 text-center">
                              <span className={`px-2 py-1 rounded-full text-[10px] uppercase font-bold ${
                                  doc.status === 'Approved' ? 'bg-emerald-100 text-emerald-700' : 
                                  doc.status === 'Submitted' ? 'bg-blue-100 text-blue-700' : 'bg-amber-100 text-amber-700'
                              }`}>
                                  {doc.status}
                              </span>
                          </td>
                          <td className="px-6 py-4 text-center">
                              <button className="text-blue-600 hover:bg-blue-50 p-2 rounded-full transition-colors">
                                  <Download size={16} />
                              </button>
                          </td>
                      </tr>
                  ))}
              </tbody>
          </table>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
              <h3 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
                  <UserCheck size={18} className="text-indigo-600" /> Client Sign-Off
              </h3>
              <p className="text-sm text-slate-500 mb-4">Pending digital signatures for final handover.</p>
              <button className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition-colors">
                  Send for Digital Signature
              </button>
          </div>
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
              <h3 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
                  <Package size={18} className="text-emerald-600" /> Final Handover
              </h3>
              <p className="text-sm text-slate-500 mb-4">Package all approved documents into a single dossier.</p>
              <button 
                onClick={handleGenerateDossier}
                disabled={isGenerating}
                className="w-full border bg-emerald-600 text-white py-2 rounded-lg hover:bg-emerald-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-70"
              >
                  {isGenerating ? <Loader2 size={16} className="animate-spin"/> : <Download size={16} />}
                  {isGenerating ? 'Packaging...' : 'Generate Dossier'}
              </button>
          </div>
      </div>
    </div>
  );
};

export default ProjectClosure;
