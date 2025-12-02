

import React from 'react';
import { ProjectDetails, ViewState } from '../../types';
import { BrainCircuit } from 'lucide-react';

interface AiInsightsProps {
  project: Partial<ProjectDetails>;
  stats: any;
  onChangeView: (view: ViewState) => void;
}

const AiInsights: React.FC<AiInsightsProps> = ({ project, stats, onChangeView }) => {
  return (
    <div className="mt-6 bg-gradient-to-r from-blue-900 to-slate-900 rounded-xl p-6 text-white relative overflow-hidden shadow-lg">
      <div className="relative z-10 flex flex-col sm:flex-row justify-between items-center gap-4">
        <div>
          <h3 className="text-xl font-bold mb-1 flex items-center gap-2">
            <BrainCircuit size={24} />
            AI Optimization Opportunity
            <span className="bg-emerald-500 text-white text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wider font-bold animate-pulse">Live</span>
          </h3>
          <p className="text-blue-200 text-sm max-w-2xl">
            Based on the current <strong>{project.type}</strong> configuration, we detected a potential
            <strong> {(stats.estimatedCost * 0.08 / 100000).toFixed(2)} Lakh</strong> saving by optimizing
            {project.type === 'PEB' ? ' steel rafter sections to tapered profiles.' : ' reinforcement detailing in slab mid-spans.'}
          </p>
        </div>
        <button 
            onClick={() => onChangeView('optimization-center')}
            className="px-5 py-2.5 bg-white text-blue-900 font-semibold rounded-lg hover:bg-blue-50 transition-all shadow hover:shadow-lg active:scale-95 whitespace-nowrap"
        >
          Review & Apply
        </button>
      </div>

      {/* Abstract Background Shapes */}
      <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none">
        <svg width="300" height="150" viewBox="0 0 300 150">
          <path d="M0,150 Q150,50 300,150" fill="none" stroke="white" strokeWidth="2" />
          <path d="M0,150 Q150,0 300,150" fill="none" stroke="white" strokeWidth="2" />
          <circle cx="150" cy="150" r="100" stroke="white" strokeWidth="1" fill="none" />
        </svg>
      </div>
    </div>
  );
};

export default AiInsights;
