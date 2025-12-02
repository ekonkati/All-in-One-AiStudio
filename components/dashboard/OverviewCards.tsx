

import React from 'react';
import { Building, MapPin, Calendar, AlertCircle } from 'lucide-react';
import { ProjectDetails } from '../../types/index';

interface OverviewCardsProps {
  project: Partial<ProjectDetails>;
  stats: any;
  schedule: any;
}

const OverviewCards: React.FC<OverviewCardsProps> = ({ project, stats, schedule }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200 flex items-start space-x-4 transition-transform hover:-translate-y-1 duration-200">
        <div className="p-3 bg-indigo-100 text-indigo-600 rounded-lg"><Building size={24} /></div>
        <div>
          <p className="text-xs text-slate-500 uppercase font-semibold">Structure Type</p>
          <h3 className="text-lg font-bold text-slate-800">{project.type}</h3>
          <p className="text-sm text-slate-400">{project.stories} Stories / {(project.stories || 1) * 12}ft</p>
        </div>
      </div>

      <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200 flex items-start space-x-4 transition-transform hover:-translate-y-1 duration-200">
        <div className="p-3 bg-rose-100 text-rose-600 rounded-lg"><MapPin size={24} /></div>
        <div>
          <p className="text-xs text-slate-500 uppercase font-semibold">Location</p>
          <h3 className="text-lg font-bold text-slate-800 truncate max-w-[140px]">{project.location || 'Unknown'}</h3>
          <p className="text-sm text-slate-400">Zone III • {project.soilType || 'N/A'}</p>
        </div>
      </div>

      <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200 flex items-start space-x-4 transition-transform hover:-translate-y-1 duration-200">
        <div className="p-3 bg-amber-100 text-amber-600 rounded-lg"><Calendar size={24} /></div>
        <div>
          <p className="text-xs text-slate-500 uppercase font-semibold">Timeline</p>
          <h3 className="text-lg font-bold text-slate-800">{stats.duration} Months</h3>
          <p className="text-sm text-slate-400">Est. Comp: {schedule.phases[schedule.phases.length - 1].end}</p>
        </div>
      </div>

      <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200 flex items-start space-x-4 transition-transform hover:-translate-y-1 duration-200">
        <div className="p-3 bg-cyan-100 text-cyan-600 rounded-lg"><AlertCircle size={24} /></div>
        <div>
          <p className="text-xs text-slate-500 uppercase font-semibold">Est. Budget</p>
          <h3 className="text-lg font-bold text-slate-800">₹ {(stats.estimatedCost / 100000).toFixed(1)} L</h3>
          <p className="text-sm text-slate-400">₹ {stats.ratePerSqFt}/sft</p>
        </div>
      </div>
    </div>
  );
};

export default OverviewCards;
