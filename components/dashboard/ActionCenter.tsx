
import React from 'react';
import { MousePointerClick, Building, AlertCircle, Calendar, MapPin, Share2 } from 'lucide-react';
import { ViewState } from '../../types';

interface ActionCenterProps {
  onChangeView: (view: ViewState) => void;
}

const ActionCenter: React.FC<ActionCenterProps> = ({ onChangeView }) => {
  return (
    <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
      <h3 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
        <MousePointerClick size={18} className="text-blue-500" />
        Workflow Actions
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <button onClick={() => onChangeView('layout')} className="p-4 rounded-lg border border-slate-100 hover:border-blue-500 hover:bg-blue-50 transition-all text-left group relative overflow-hidden">
          <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-20 transition-opacity">
            <Building size={64} className="text-blue-600" />
          </div>
          <span className="block text-sm font-semibold text-slate-700 group-hover:text-blue-700">Review Layouts</span>
          <span className="text-xs text-slate-400 mt-1 block">Check architectural grids, setbacks, and column positioning.</span>
        </button>
        <button onClick={() => onChangeView('structure')} className="p-4 rounded-lg border border-slate-100 hover:border-blue-500 hover:bg-blue-50 transition-all text-left group relative overflow-hidden">
          <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-20 transition-opacity">
            <AlertCircle size={64} className="text-blue-600" />
          </div>
          <span className="block text-sm font-semibold text-slate-700 group-hover:text-blue-700">Structural Analysis</span>
          <span className="text-xs text-slate-400 mt-1 block">Run FE solver, check deflection, and verify code compliance.</span>
        </button>
        <button onClick={() => onChangeView('estimation')} className="p-4 rounded-lg border border-slate-100 hover:border-blue-500 hover:bg-blue-50 transition-all text-left group relative overflow-hidden">
          <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-20 transition-opacity">
            <Calendar size={64} className="text-blue-600" />
          </div>
          <span className="block text-sm font-semibold text-slate-700 group-hover:text-blue-700">Cost Estimation</span>
          <span className="text-xs text-slate-400 mt-1 block">Generate BOQ, check material quantities and labor costs.</span>
        </button>
        <button onClick={() => onChangeView('management')} className="p-4 rounded-lg border border-slate-100 hover:border-blue-500 hover:bg-blue-50 transition-all text-left group relative overflow-hidden">
          <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-20 transition-opacity">
            <MapPin size={64} className="text-blue-600" />
          </div>
          <span className="block text-sm font-semibold text-slate-700 group-hover:text-blue-700">Site Management</span>
          <span className="text-xs text-slate-400 mt-1 block">Track daily progress, material log, and inspection reports.</span>
        </button>
         <button onClick={() => {}} className="p-4 rounded-lg border border-slate-100 hover:border-emerald-500 hover:bg-emerald-50 transition-all text-left group relative overflow-hidden col-span-1 sm:col-span-2 lg:col-span-2">
          <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-20 transition-opacity">
            <Share2 size={64} className="text-emerald-600" />
          </div>
          <span className="block text-sm font-semibold text-slate-700 group-hover:text-emerald-700">Import / Export (Interoperability)</span>
          <span className="text-xs text-slate-400 mt-1 block">STAAD.Pro, ETABS, DXF, or Excel data exchange.</span>
        </button>
      </div>
    </div>
  );
};

export default ActionCenter;
