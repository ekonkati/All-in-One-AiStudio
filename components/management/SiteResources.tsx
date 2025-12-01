
import React from 'react';
import { Users, Truck, CheckSquare, Clock, AlertCircle } from 'lucide-react';
import { ProjectDetails } from '../../types';

interface SiteResourcesProps {
  project: Partial<ProjectDetails>;
}

const SiteResources: React.FC<SiteResourcesProps> = ({ project }) => {
  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <h3 className="font-semibold text-slate-800 mb-4 flex items-center">
          <Users className="mr-2 text-orange-600" size={20} />
          Site Resources
        </h3>
        <div className="space-y-4">
          <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg border border-slate-100">
            <span className="text-sm text-slate-600">Site Engineers</span>
            <span className="font-bold text-slate-800">{project.type === 'PEB' ? '1' : '2'}</span>
          </div>
          <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg border border-slate-100">
            <span className="text-sm text-slate-600">{project.type === 'PEB' ? 'Erection Crew' : 'Skilled Masons'}</span>
            <span className="font-bold text-slate-800">{project.type === 'PEB' ? '8' : '15'}</span>
          </div>
          <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg border border-slate-100">
            <span className="text-sm text-slate-600">Helpers</span>
            <span className="font-bold text-slate-800">12</span>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <h3 className="font-semibold text-slate-800 mb-4 flex items-center">
          <Truck className="mr-2 text-indigo-600" size={20} />
          Material Logistics
        </h3>
        <div className="space-y-3 text-sm">
          {project.type === 'PEB' ? (
            <>
              <div className="flex items-center gap-2 text-emerald-600 bg-emerald-50 p-2 rounded">
                <CheckSquare size={16} /> <span>Anchor Bolts - Delivered</span>
              </div>
              <div className="flex items-center gap-2 text-amber-600 bg-amber-50 p-2 rounded">
                <Clock size={16} /> <span>Main Frames - Dispatching</span>
              </div>
            </>
          ) : (
            <>
              <div className="flex items-center gap-2 text-emerald-600 bg-emerald-50 p-2 rounded">
                <CheckSquare size={16} /> <span>Cement (200 bags) - Stocked</span>
              </div>
              <div className="flex items-center gap-2 text-red-500 bg-red-50 p-2 rounded">
                <AlertCircle size={16} /> <span>Sand - Critical Low</span>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default SiteResources;
