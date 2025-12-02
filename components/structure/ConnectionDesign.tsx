
import React, { useMemo } from 'react';
import { CheckCircle2, AlertTriangle, XCircle, Zap, Info } from 'lucide-react';
import { generateConnectionDesign } from '../../services/calculationService';

const ConnectionDesign: React.FC = () => {
  const connection = useMemo(() => generateConnectionDesign(), []);

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h3 className="text-xl font-bold text-slate-800">{connection.type} Calculation</h3>
          <p className="text-slate-500 text-sm">{connection.members}</p>
        </div>
        <div className={`px-4 py-2 rounded-full flex items-center gap-2 font-bold ${connection.status === 'Pass' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
           {connection.status === 'Pass' ? <CheckCircle2 size={20} /> : <XCircle size={20} />}
           {connection.status === 'Pass' ? 'Design Safe' : 'Design Failed'}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Visualization (Schematic) */}
        <div className="border border-slate-200 rounded-xl p-8 bg-slate-50 flex flex-col items-center justify-center min-h-[300px]">
            <svg width="300" height="300" viewBox="0 0 300 300">
                {/* Column Flange */}
                <rect x="100" y="20" width="20" height="260" fill="#94a3b8" stroke="#475569" strokeWidth="2" />
                {/* Beam */}
                <rect x="120" y="130" width="160" height="40" fill="#cbd5e1" stroke="#475569" strokeWidth="2" />
                {/* End Plate */}
                <rect x="120" y="100" width="10" height="100" fill="#64748b" stroke="#334155" strokeWidth="2" />
                {/* Bolts Top */}
                <circle cx="125" cy="115" r="3" fill="#1e293b" />
                <circle cx="125" cy="125" r="3" fill="#1e293b" />
                {/* Bolts Bottom */}
                <circle cx="125" cy="175" r="3" fill="#1e293b" />
                <circle cx="125" cy="185" r="3" fill="#1e293b" />
                {/* Weld */}
                <path d="M130 130 L130 170" stroke="#ef4444" strokeWidth="3" strokeDasharray="2 2" />
            </svg>
            <p className="text-xs text-slate-400 mt-4">Conceptual Schematic (Not to Scale)</p>
        </div>

        {/* Calculations */}
        <div>
            <div className="bg-slate-50 p-4 rounded-lg mb-6 border border-slate-100">
                <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-slate-700">Demand / Capacity Ratio</span>
                    <span className="text-lg font-bold text-slate-800">{connection.utilization}</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-3">
                    <div 
                       className={`h-3 rounded-full ${connection.utilization < 0.9 ? 'bg-emerald-500' : 'bg-amber-500'}`} 
                       style={{ width: `${connection.utilization * 100}%` }}
                    ></div>
                </div>
                <p className="text-xs text-slate-500 mt-2 flex items-center gap-1"><Info size={12}/> IS 800:2007 Limit State Method</p>
            </div>

            <h4 className="font-semibold text-slate-800 mb-3 flex items-center gap-2">
                <Zap size={16} className="text-blue-600" /> Code Checks
            </h4>
            <div className="space-y-3">
                {connection.checks.map((check, i) => (
                    <div key={i} className="flex justify-between items-center p-3 border-b border-slate-100 last:border-0">
                        <div>
                            <p className="text-sm font-medium text-slate-700">{check.check}</p>
                            <p className="text-xs text-slate-400">Actual: {check.val} kN | Limit: {check.limit} kN</p>
                        </div>
                        {check.status === 'Pass' ? <CheckCircle2 size={16} className="text-emerald-500"/> : <AlertTriangle size={16} className="text-red-500"/>}
                    </div>
                ))}
            </div>
        </div>
      </div>
    </div>
  );
};

export default ConnectionDesign;
