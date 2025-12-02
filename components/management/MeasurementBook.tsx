

import React from 'react';
import { BookOpen, CheckCircle2, Clock, Filter, Plus } from 'lucide-react';
// FIX: Corrected import path from ../../types to ../../types/index to be explicit
import { MeasurementEntry } from '../../types/index';

interface MeasurementBookProps {
  entries: MeasurementEntry[];
}

const MeasurementBook: React.FC<MeasurementBookProps> = ({ entries }) => {
  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden animate-in fade-in duration-500">
      <div className="p-4 border-b border-slate-200 bg-slate-50 flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
           <h3 className="font-semibold text-slate-800 flex items-center gap-2">
             <BookOpen size={18} className="text-slate-500" /> Measurement Book (MB)
           </h3>
           <p className="text-xs text-slate-500 mt-1">Record of actual site measurements for billing</p>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 bg-white border border-slate-300 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-600 hover:bg-slate-50">
             <Filter size={14} /> Filter
          </button>
          <button className="flex items-center gap-2 bg-blue-600 text-white px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-blue-700">
             <Plus size={14} /> Add Entry
          </button>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-slate-600">
          <thead className="bg-slate-50 border-b border-slate-200 text-xs uppercase text-slate-500 font-semibold">
            <tr>
              <th className="px-4 py-3">MB Ref</th>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Description / Location</th>
              <th className="px-4 py-3 text-right">Nos</th>
              <th className="px-4 py-3 text-right">L</th>
              <th className="px-4 py-3 text-right">B</th>
              <th className="px-4 py-3 text-right">D</th>
              <th className="px-4 py-3 text-right">Qty</th>
              <th className="px-4 py-3 text-center">Unit</th>
              <th className="px-4 py-3 text-center">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {entries.map((entry) => (
              <tr key={entry.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-4 py-3 font-mono text-xs text-slate-500">{entry.id}</td>
                <td className="px-4 py-3 text-slate-500 whitespace-nowrap">{entry.date}</td>
                <td className="px-4 py-3">
                  <p className="font-medium text-slate-800">{entry.description}</p>
                  <p className="text-xs text-slate-500">{entry.location} • Ref: {entry.boqRef}</p>
                </td>
                <td className="px-4 py-3 text-right font-mono">{entry.nos}</td>
                <td className="px-4 py-3 text-right font-mono">{entry.length.toFixed(2)}</td>
                <td className="px-4 py-3 text-right font-mono">{entry.breadth.toFixed(2)}</td>
                <td className="px-4 py-3 text-right font-mono">{entry.depth.toFixed(2)}</td>
                <td className="px-4 py-3 text-right font-bold text-slate-800 bg-slate-50">{entry.quantity.toFixed(2)}</td>
                <td className="px-4 py-3 text-center text-xs uppercase">{entry.unit}</td>
                <td className="px-4 py-3 flex justify-center">
                    <span className={`flex items-center gap-1 px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wide ${
                        entry.status === 'Billed' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                    }`}>
                        {entry.status === 'Billed' ? <CheckCircle2 size={10} /> : <Clock size={10} />}
                        {entry.status}
                    </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MeasurementBook;