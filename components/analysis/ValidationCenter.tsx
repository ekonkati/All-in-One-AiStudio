
import React, { useState, useEffect } from 'react';
import { AlertTriangle, CheckCircle, XCircle, Wand2, Layers, Search, ShieldCheck } from 'lucide-react';
import { ValidationIssue } from '../../types';
import { runModelValidation } from '../../services/calculationService';

const ValidationCenter: React.FC = () => {
  const [issues, setIssues] = useState<ValidationIssue[]>([]);
  const [activeFilter, setActiveFilter] = useState<'All' | 'Critical' | 'Major'>('All');

  useEffect(() => {
    // Simulate running validation engine
    const results = runModelValidation();
    setIssues(results);
  }, []);

  const handleAutoFix = (id: string) => {
    setIssues(prev => prev.map(issue => 
      issue.id === id ? { ...issue, status: 'Fixed' } : issue
    ).filter(i => (i as any).status !== 'Fixed'));
  };

  const filteredIssues = activeFilter === 'All' 
    ? issues 
    : issues.filter(i => i.severity === activeFilter);

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden animate-in fade-in duration-500">
      <div className="p-6 border-b border-slate-200 bg-slate-50">
        <div className="flex justify-between items-center mb-4">
           <div>
             <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
               <ShieldCheck size={20} className="text-indigo-600" />
               Model Validation & Compliance (Part 38)
             </h3>
             <p className="text-sm text-slate-500">Automated Clash Detection, Code Checks & Geometry Audit</p>
           </div>
           <div className="flex gap-2">
              <button 
                onClick={() => setActiveFilter('All')}
                className={`px-3 py-1.5 rounded-full text-xs font-medium border ${activeFilter === 'All' ? 'bg-slate-800 text-white border-slate-800' : 'bg-white border-slate-300 text-slate-600'}`}
              >
                All ({issues.length})
              </button>
              <button 
                onClick={() => setActiveFilter('Critical')}
                className={`px-3 py-1.5 rounded-full text-xs font-medium border ${activeFilter === 'Critical' ? 'bg-red-600 text-white border-red-600' : 'bg-white border-slate-300 text-slate-600'}`}
              >
                Critical ({issues.filter(i => i.severity === 'Critical').length})
              </button>
           </div>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-3 gap-4">
           <div className="bg-white p-3 rounded-lg border border-slate-200 flex items-center justify-between">
              <span className="text-xs text-slate-500 font-medium">Clashes</span>
              <span className="text-sm font-bold text-slate-800">{issues.filter(i => i.type === 'Clash').length}</span>
           </div>
           <div className="bg-white p-3 rounded-lg border border-slate-200 flex items-center justify-between">
              <span className="text-xs text-slate-500 font-medium">Code Violations</span>
              <span className="text-sm font-bold text-slate-800">{issues.filter(i => i.type === 'Code').length}</span>
           </div>
           <div className="bg-white p-3 rounded-lg border border-slate-200 flex items-center justify-between">
              <span className="text-xs text-slate-500 font-medium">Geometry Errors</span>
              <span className="text-sm font-bold text-slate-800">{issues.filter(i => i.type === 'Geometry').length}</span>
           </div>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-slate-600">
          <thead className="bg-slate-50 border-b border-slate-200 text-xs uppercase text-slate-500 font-semibold sticky top-0">
            <tr>
              <th className="px-6 py-3">ID</th>
              <th className="px-6 py-3">Type</th>
              <th className="px-6 py-3">Severity</th>
              <th className="px-6 py-3">Description / Location</th>
              <th className="px-6 py-3">AI Recommendation</th>
              <th className="px-6 py-3 text-center">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredIssues.map((issue) => (
              <tr key={issue.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4 font-mono text-xs">{issue.id}</td>
                <td className="px-6 py-4">
                   <div className="flex items-center gap-2">
                      {issue.type === 'Clash' && <Layers size={14} className="text-orange-500"/>}
                      {issue.type === 'Code' && <AlertTriangle size={14} className="text-red-500"/>}
                      {issue.type === 'Geometry' && <Search size={14} className="text-blue-500"/>}
                      {issue.type}
                   </div>
                </td>
                <td className="px-6 py-4">
                   <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                       issue.severity === 'Critical' ? 'bg-red-100 text-red-700' : 
                       issue.severity === 'Major' ? 'bg-orange-100 text-orange-700' : 'bg-yellow-100 text-yellow-700'
                   }`}>
                       {issue.severity}
                   </span>
                </td>
                <td className="px-6 py-4">
                   <p className="text-slate-800 font-medium">{issue.description}</p>
                   <p className="text-xs text-slate-500 mt-0.5">Loc: {issue.location} • El: {issue.elementId}</p>
                </td>
                <td className="px-6 py-4 text-slate-600 italic">
                   "{issue.recommendation}"
                </td>
                <td className="px-6 py-4 text-center">
                   <button 
                     onClick={() => handleAutoFix(issue.id)}
                     className="flex items-center gap-1 bg-indigo-600 text-white px-3 py-1.5 rounded text-xs hover:bg-indigo-700 transition-colors mx-auto shadow-sm"
                   >
                       <Wand2 size={12} /> Auto-Fix
                   </button>
                </td>
              </tr>
            ))}
            {filteredIssues.length === 0 && (
                <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-slate-400 bg-slate-50">
                        <div className="flex flex-col items-center gap-2">
                            <CheckCircle size={32} className="text-emerald-400" />
                            <p>No issues found. Model is compliant.</p>
                        </div>
                    </td>
                </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ValidationCenter;
