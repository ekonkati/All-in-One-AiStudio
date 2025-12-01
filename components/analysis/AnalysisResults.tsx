
import React from 'react';
import { CheckCircle2, AlertTriangle, Database, Anchor } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { ProjectDetails } from '../../types';

interface AnalysisResultsProps {
  project: Partial<ProjectDetails>;
  loadData: any[];
  momentData: any[];
}

const AnalysisResults: React.FC<AnalysisResultsProps> = ({ project, loadData, momentData }) => {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center space-x-4">
          <div className="p-3 bg-green-100 text-green-600 rounded-lg">
            <CheckCircle2 size={24} />
          </div>
          <div>
            <p className="text-sm text-slate-500">Design Status</p>
            <p className="font-bold text-slate-800">Safe / Compliant</p>
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center space-x-4">
          <div className="p-3 bg-blue-100 text-blue-600 rounded-lg">
            <Database size={24} />
          </div>
          <div>
            <p className="text-sm text-slate-500">{project.type === 'PEB' ? 'Steel Weight' : 'Concrete Vol'}</p>
            <p className="font-bold text-slate-800">{project.type === 'PEB' ? '18.5 MT' : '145 m³'}</p>
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center space-x-4">
          <div className="p-3 bg-orange-100 text-orange-600 rounded-lg">
            <Anchor size={24} />
          </div>
          <div>
            <p className="text-sm text-slate-500">Base Reaction</p>
            <p className="font-bold text-slate-800">{project.type === 'PEB' ? '120 kN' : '450 kN'}</p>
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center space-x-4">
          <div className="p-3 bg-red-100 text-red-600 rounded-lg">
            <AlertTriangle size={24} />
          </div>
          <div>
            <p className="text-sm text-slate-500">Max Deflection</p>
            <p className="font-bold text-slate-800">{project.type === 'PEB' ? '45mm' : '12mm'} <span className="text-xs text-green-600 font-normal">(Limit: {project.type === 'PEB' ? '60mm' : '20mm'})</span></p>
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h3 className="font-semibold text-slate-700 mb-4">Load Distribution (kN)</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={loadData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip cursor={{ fill: '#f1f5f9' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h3 className="font-semibold text-slate-700 mb-4">Moment Envelope ({project.type === 'PEB' ? 'Rafter R1' : 'Beam B-204'})</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={momentData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="x" hide />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                <Line name="Bending Moment (kNm)" type="monotone" dataKey="moment" stroke="#ef4444" strokeWidth={2} dot={false} />
                <Line name="Shear Force (kN)" type="monotone" dataKey="shear" stroke="#10b981" strokeWidth={2} dot={false} strokeDasharray="5 5" />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-4 text-xs mt-2 text-slate-500">
            <span className="flex items-center gap-1"><div className="w-2 h-2 bg-red-500 rounded-full"></div> Bending Moment</span>
            <span className="flex items-center gap-1"><div className="w-2 h-2 bg-emerald-500 rounded-full"></div> Shear Force</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalysisResults;
