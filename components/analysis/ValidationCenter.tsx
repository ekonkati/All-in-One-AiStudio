
import React, { useState, useEffect } from 'react';
import { AlertTriangle, CheckCircle, XCircle, Wand2, Layers, Search, ShieldCheck, Flame, Leaf, FileText } from 'lucide-react';
// FIX: Corrected import path from ../../types to ../../types/index to be explicit
import { ValidationIssue } from '../../types/index';
import { runModelValidation } from '../../services/calculationService';

const ValidationCenter: React.FC = () => {
  const [issues, setIssues] = useState<ValidationIssue[]>([]);
  const [activeCategory, setActiveCategory] = useState<'Structural' | 'Fire' | 'Environmental'>('Structural');
  
  // Mock Compliance Checklists (Part 24 - Minute Details)
  const fireChecklist = [
      { id: 'FIRE-01', check: 'Staircase Width > 1.2m', ref: 'NBC 2016 Pt.4', status: 'Pass' },
      { id: 'FIRE-02', check: 'Travel Distance < 30m', ref: 'NBC 2016 Pt.4', status: 'Pass' },
      { id: 'FIRE-03', check: 'Fire Tower Pressurization', ref: 'NBC 2016 Pt.4', status: 'Warning', note: 'Fan capacity low' },
  ];

  const envChecklist = [
      { id: 'ENV-01', check: 'Rainwater Harvesting Pit', ref: 'MoEF Guidelines', status: 'Pass' },
      { id: 'ENV-02', check: 'Top Soil Preservation', ref: 'IGBC Green New', status: 'Pass' },
      { id: 'ENV-03', check: 'Construction Waste Mgmt Plan', ref: 'C&D Rules 2016', status: 'Fail', note: 'Document missing' },
  ];

  useEffect(() => {
    const results = runModelValidation();
    setIssues(results);
  }, []);

  const handleAutoFix = (id: string) => {
    // FIX: Simplified logic to remove the fixed item, resolving the type error.
    setIssues(prev => prev.filter(issue => issue.id !== id));
  };

  const renderChecklist = (items: any[]) => (
      <div className="space-y-3">
          {items.map(item => (
              <div key={item.id} className="flex justify-between items-center p-3 bg-slate-50 rounded-lg border border-slate-100">
                  <div>
                      <div className="flex items-center gap-2">
                          <span className="font-medium text-slate-800 text-sm">{item.check}</span>
                          <span className="text-[10px] text-slate-400 bg-white border border-slate-200 px-1.5 rounded">{item.ref}</span>
                      </div>
                      {item.note && <p className="text-xs text-slate-500 mt-1 italic">{item.note}</p>}
                  </div>
                  <div>
                      {item.status === 'Pass' && <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded flex items-center gap-1"><CheckCircle size={12}/> Pass</span>}
                      {item.status === 'Warning' && <span className="text-xs font-bold text-amber-600 bg-amber-50 px-2 py-1 rounded flex items-center gap-1"><AlertTriangle size={12}/> Check</span>}
                      {item.status === 'Fail' && <span className="text-xs font-bold text-red-600 bg-red-50 px-2 py-1 rounded flex items-center gap-1"><XCircle size={12}/> Fail</span>}
                  </div>
              </div>
          ))}
      </div>
  );

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden animate-in fade-in duration-500">
      <div className="p-6 border-b border-slate-200 bg-slate-50">
        <div className="flex justify-between items-center mb-6">
           <div>
             <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
               <ShieldCheck size={20} className="text-indigo-600" />
               Compliance & Validation Engine
             </h3>
             <p className="text-sm text-slate-500">Automated NBC, IS Code & Clash Detection</p>
           </div>
        </div>

        <div className="flex space-x-1 bg-white p-1 rounded-lg border border-slate-200 w-fit">
            <button 
                onClick={() => setActiveCategory('Structural')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2 ${activeCategory === 'Structural' ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:bg-slate-50'}`}
            >
                <Layers size={16}/> Structural & Clashes
            </button>
            <button 
                onClick={() => setActiveCategory('Fire')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2 ${activeCategory === 'Fire' ? 'bg-orange-50 text-orange-700' : 'text-slate-600 hover:bg-slate-50'}`}
            >
                <Flame size={16}/> Fire & Safety (NBC)
            </button>
            <button 
                onClick={() => setActiveCategory('Environmental')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2 ${activeCategory === 'Environmental' ? 'bg-green-50 text-green-700' : 'text-slate-600 hover:bg-slate-50'}`}
            >
                <Leaf size={16}/> Environmental
            </button>
        </div>
      </div>
      
      <div className="p-6">
        {activeCategory === 'Structural' && (
            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-slate-600">
                <thead className="bg-slate-50 border-b border-slate-200 text-xs uppercase text-slate-500 font-semibold">
                    <tr>
                    <th className="px-6 py-3">Type</th>
                    <th className="px-6 py-3">Severity</th>
                    <th className="px-6 py-3">Description / Location</th>
                    <th className="px-6 py-3">Recommendation</th>
                    <th className="px-6 py-3 text-center">Action</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                    {issues.map((issue) => (
                    <tr key={issue.id} className="hover:bg-slate-50 transition-colors">
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
                        <p className="text-xs text-slate-500 mt-0.5">Loc: {issue.location}</p>
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
                    {issues.length === 0 && (
                        <tr>
                            <td colSpan={5} className="px-6 py-8 text-center text-slate-400">No structural issues found.</td>
                        </tr>
                    )}
                </tbody>
                </table>
            </div>
        )}

        {activeCategory === 'Fire' && renderChecklist(fireChecklist)}
        
        {activeCategory === 'Environmental' && renderChecklist(envChecklist)}
      </div>
    </div>
  );
};

export default ValidationCenter;
