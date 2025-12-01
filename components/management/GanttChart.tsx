
import React from 'react';
import { Clock } from 'lucide-react';
import { PhaseItem } from '../../types';

interface GanttChartProps {
  phases: PhaseItem[];
}

const GanttChart: React.FC<GanttChartProps> = ({ phases }) => {
  return (
    <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
      <h3 className="font-semibold text-slate-800 mb-6 flex items-center justify-between">
        <div className="flex items-center">
          <Clock className="mr-2 text-blue-600" size={20} />
          Master Schedule
        </div>
        <span className="text-xs font-normal text-slate-500 bg-slate-100 px-2 py-1 rounded">Weekly View</span>
      </h3>
      <div className="space-y-6">
        {phases.map((phase, idx) => (
          <div key={idx} className="relative group">
            <div className="flex justify-between text-sm mb-1.5">
              <span className="font-medium text-slate-700">{phase.name}</span>
              <span className="text-xs text-slate-500 font-mono bg-slate-50 px-2 py-0.5 rounded">{phase.start} - {phase.end}</span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
              <div
                className={`h-2.5 rounded-full transition-all duration-500 ${
                  phase.status === 'completed' ? 'bg-emerald-500' :
                    phase.status === 'in-progress' ? 'bg-blue-500 relative overflow-hidden' : 'bg-slate-300'
                  }`}
                style={{ width: `${phase.progress}%` }}
              >
                {phase.status === 'in-progress' && (
                  <div className="absolute inset-0 bg-white/30 animate-[shimmer_2s_infinite] w-full" style={{ transform: 'skewX(-20deg)' }}></div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-6 pt-4 border-t border-slate-100 flex justify-between text-sm text-slate-500">
        <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-emerald-500"></div> Completed</span>
        <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-blue-500"></div> In Progress</span>
        <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-slate-300"></div> Pending</span>
      </div>
    </div>
  );
};

export default GanttChart;
