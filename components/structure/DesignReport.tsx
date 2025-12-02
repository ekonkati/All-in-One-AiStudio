
import React, { useMemo } from 'react';
import { BookOpen, CheckCircle, Info, XCircle } from 'lucide-react';
import { generateDesignCalculation } from '../../services/calculationService';

const DesignReport: React.FC = () => {
  const beamSteps = useMemo(() => generateDesignCalculation('Beam'), []);
  const colSteps = useMemo(() => generateDesignCalculation('Column'), []);

  const renderSteps = (steps: any[]) => (
    <div className="space-y-4">
      {steps.map((step) => (
        <div key={step.id} className="border border-slate-200 rounded-lg p-4 bg-white hover:shadow-sm transition-shadow">
          <div className="flex justify-between items-start mb-2">
            <div>
              <h4 className="font-semibold text-slate-800">{step.stepName}</h4>
              <p className="text-xs text-slate-500 font-mono">{step.reference}</p>
            </div>
            <div className={`px-2 py-1 rounded text-xs font-bold flex items-center gap-1 ${
              step.status === 'Pass' ? 'bg-emerald-100 text-emerald-700' :
              step.status === 'Fail' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
            }`}>
              {step.status === 'Pass' && <CheckCircle size={12} />}
              {step.status === 'Fail' && <XCircle size={12} />}
              {step.status === 'Info' && <Info size={12} />}
              {step.status}
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
             <div className="bg-slate-50 p-3 rounded font-mono text-slate-700 border border-slate-100">
               <span className="block text-[10px] text-slate-400 mb-1">Formula</span>
               {step.formula}
             </div>
             <div className="bg-slate-50 p-3 rounded font-mono text-slate-700 border border-slate-100">
                <span className="block text-[10px] text-slate-400 mb-1">Calculation</span>
                {step.substitution}
                <div className="mt-2 pt-2 border-t border-slate-200 font-bold text-blue-800">
                   = {step.result}
                </div>
             </div>
          </div>
          <p className="text-xs text-slate-500 mt-2 italic">{step.description}</p>
        </div>
      ))}
    </div>
  );

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
          <BookOpen size={20} className="text-blue-600" />
          Detailed Design Report (IS 456)
        </h3>
        <p className="text-sm text-slate-600 mb-6">Transparent "Glass Box" calculations for verification.</p>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
           <div>
              <h4 className="font-semibold text-slate-700 mb-3 border-b border-slate-200 pb-2">Typical Beam Design (B1)</h4>
              {renderSteps(beamSteps)}
           </div>
           <div>
              <h4 className="font-semibold text-slate-700 mb-3 border-b border-slate-200 pb-2">Typical Column Design (C1)</h4>
              {renderSteps(colSteps)}
           </div>
        </div>
      </div>
    </div>
  );
};

export default DesignReport;
