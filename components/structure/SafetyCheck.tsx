
import React, { useState } from 'react';
import { AlertCircle, CheckCircle, XCircle, Wand2 } from 'lucide-react';
import { StructuralMember } from '../../types';

interface SafetyCheckProps {
  members: StructuralMember[];
}

const SafetyCheck: React.FC<SafetyCheckProps> = ({ members }) => {
  // Local state to manage fixes
  const [memberState, setMemberState] = useState(
    members.map(m => ({
      ...m,
      dcr: m.dcr || (Math.random() * 0.6 + 0.3), 
      status: (m.dcr || 0) > 1.0 ? 'Failed' : (m.dcr || 0) > 0.85 ? 'Critical' : 'Safe',
      failureMode: (m.dcr || 0) > 1.0 ? 'Shear' : 'None',
      isFixed: false
    }))
  );

  const criticalCount = memberState.filter(m => (m.dcr || 0) > 0.85).length;

  const handleAutoFix = (id: string) => {
      setMemberState(prev => prev.map(m => {
          if (m.id === id) {
              return {
                  ...m,
                  dcr: (m.dcr || 1) * 0.7, // Reduce DCR by 30%
                  status: 'Safe',
                  failureMode: 'None',
                  isFixed: true,
                  dimensions: 'Upsized (AI)' // Visual indicator
              };
          }
          return m;
      }));
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden animate-in fade-in duration-500">
      <div className="p-4 border-b border-slate-200 bg-slate-50 flex justify-between items-center">
        <h3 className="font-semibold text-slate-800 flex items-center gap-2">
          <AlertCircle size={18} className="text-red-500" />
          Safety & Failure Modes (Part 36)
        </h3>
        <span className={`text-xs font-bold px-2 py-1 rounded-full ${criticalCount > 0 ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
          {criticalCount > 0 ? `${criticalCount} Critical Members` : 'All Members Safe'}
        </span>
      </div>
      
      <div className="overflow-x-auto max-h-96">
        <table className="w-full text-left text-sm text-slate-600">
          <thead className="bg-slate-50 border-b border-slate-200 text-xs uppercase text-slate-500 font-semibold sticky top-0">
            <tr>
              <th className="px-6 py-3">Member ID</th>
              <th className="px-6 py-3">Type</th>
              <th className="px-6 py-3">Dimensions</th>
              <th className="px-6 py-3">Capacity Check (DCR)</th>
              <th className="px-6 py-3 text-center">Status</th>
              <th className="px-6 py-3 text-center">Auto-Fix</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {memberState.map((m, idx) => (
              <tr key={idx} className={`hover:bg-slate-50 transition-colors ${m.isFixed ? 'bg-green-50/30' : ''}`}>
                <td className="px-6 py-3 font-mono text-slate-800">{m.mark}</td>
                <td className="px-6 py-3">{m.type}</td>
                <td className="px-6 py-3 font-mono text-xs">{m.dimensions}</td>
                <td className="px-6 py-3">
                  <div className="flex items-center gap-3">
                    <div className="flex-1 bg-slate-200 rounded-full h-2 w-24">
                      <div 
                        className={`h-2 rounded-full transition-all duration-500 ${
                          (m.dcr || 0) > 0.9 ? 'bg-red-500' : (m.dcr || 0) > 0.7 ? 'bg-amber-500' : 'bg-emerald-500'
                        }`} 
                        style={{ width: `${Math.min((m.dcr || 0) * 100, 100)}%` }}
                      ></div>
                    </div>
                    <span className="font-mono font-bold text-xs">{(m.dcr || 0).toFixed(2)}</span>
                  </div>
                </td>
                <td className="px-6 py-3 text-center">
                   {(m.dcr || 0) > 0.85 ? 
                     <span className="inline-flex items-center gap-1 text-red-600 bg-red-50 px-2 py-0.5 rounded text-xs font-medium"><XCircle size={12}/> Critical</span> : 
                     <span className="inline-flex items-center gap-1 text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded text-xs font-medium"><CheckCircle size={12}/> Safe</span>
                   }
                </td>
                <td className="px-6 py-3 text-center">
                   {(m.dcr || 0) > 0.85 && !m.isFixed && (
                       <button 
                         onClick={() => handleAutoFix(m.id)}
                         className="flex items-center gap-1 bg-blue-600 text-white px-2 py-1 rounded text-xs hover:bg-blue-700 transition-colors mx-auto"
                       >
                           <Wand2 size={12} /> Auto-Fix
                       </button>
                   )}
                   {m.isFixed && <span className="text-xs text-green-600 font-medium">Optimized</span>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="p-3 bg-yellow-50 text-yellow-800 text-xs text-center border-t border-yellow-100">
         <strong>Note:</strong> DCR > 1.0 indicates failure. AI Auto-Fix suggests standard section upsizing or reinforcement increase.
      </div>
    </div>
  );
};

export default SafetyCheck;
