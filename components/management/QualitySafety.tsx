

import React from 'react';
import { ShieldCheck, HardHat, AlertTriangle, CheckSquare, Clock, Search } from 'lucide-react';
// FIX: Corrected import path from ../../types to ../../types/index to be explicit
import { QualityChecklist, SafetyStat } from '../../types/index';

interface QualitySafetyProps {
  checklists: QualityChecklist[];
  stats: SafetyStat;
}

const QualitySafety: React.FC<QualitySafetyProps> = ({ checklists, stats }) => {
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      
      {/* HSE Stats Header */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-emerald-600 to-emerald-800 p-5 rounded-xl text-white shadow-lg relative overflow-hidden">
          <div className="relative z-10">
            <p className="text-emerald-100 text-sm font-medium">Safe Man-Hours</p>
            <h3 className="text-3xl font-bold mt-1">{stats.safeManHours.toLocaleString()}</h3>
            <p className="text-xs text-emerald-200 mt-2">Without Lost Time Injury</p>
          </div>
          <ShieldCheck className="absolute right-[-10px] bottom-[-10px] text-white/10" size={80} />
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
            <div className="flex justify-between">
                <p className="text-sm text-slate-500">Active Permits</p>
                <div className="p-2 bg-blue-50 text-blue-600 rounded-lg"><HardHat size={18} /></div>
            </div>
            <h3 className="text-2xl font-bold text-slate-800">4</h3>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
            <div className="flex justify-between">
                <p className="text-sm text-slate-500">Near Misses</p>
                <div className="p-2 bg-amber-50 text-amber-600 rounded-lg"><AlertTriangle size={18} /></div>
            </div>
            <h3 className="text-2xl font-bold text-slate-800">{stats.nearMisses}</h3>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
            <div className="flex justify-between">
                <p className="text-sm text-slate-500">Compliance Score</p>
                <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg"><CheckSquare size={18} /></div>
            </div>
            <h3 className="text-2xl font-bold text-slate-800">94%</h3>
        </div>
      </div>

      {/* Inspections Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-200 bg-slate-50 flex flex-col sm:flex-row justify-between items-center gap-4">
          <h3 className="font-semibold text-slate-800 flex items-center gap-2">
            <Search size={18} className="text-slate-500" /> Inspection & Test Plans (ITP)
          </h3>
          <div className="flex gap-2">
             <button className="text-xs font-medium bg-white border border-slate-300 px-3 py-1.5 rounded-full text-slate-600 hover:bg-slate-50">Filter by Status</button>
             <button className="text-xs font-medium bg-blue-600 text-white px-3 py-1.5 rounded-full hover:bg-blue-700">+ New Inspection</button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 border-b border-slate-200 text-xs uppercase text-slate-500 font-semibold">
              <tr>
                <th className="px-6 py-3">ID</th>
                <th className="px-6 py-3">Inspection Title</th>
                <th className="px-6 py-3">Type</th>
                <th className="px-6 py-3">Location</th>
                <th className="px-6 py-3">Date</th>
                <th className="px-6 py-3">Inspector</th>
                <th className="px-6 py-3 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {checklists.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 font-mono text-slate-500">{item.id}</td>
                  <td className="px-6 py-4 font-medium text-slate-800">{item.title}</td>
                  <td className="px-6 py-4">
                     <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                         item.type === 'HSE' ? 'bg-orange-100 text-orange-700' : 'bg-blue-100 text-blue-700'
                     }`}>
                         {item.type}
                     </span>
                  </td>
                  <td className="px-6 py-4">{item.location}</td>
                  <td className="px-6 py-4 text-slate-500">{item.date}</td>
                  <td className="px-6 py-4">{item.inspector}</td>
                  <td className="px-6 py-4 flex justify-center">
                    <span className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${
                      item.status === 'Passed' ? 'bg-emerald-100 text-emerald-700' :
                      item.status === 'Failed' ? 'bg-red-100 text-red-700' :
                      'bg-slate-100 text-slate-600'
                    }`}>
                      {item.status === 'Passed' && <CheckSquare size={12} />}
                      {item.status === 'Pending' && <Clock size={12} />}
                      {item.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default QualitySafety;