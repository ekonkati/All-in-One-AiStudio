import React from 'react';
import { Table, Cuboid, Box, Layers } from 'lucide-react';
import { StructuralMember } from '../../types';

interface MemberScheduleProps {
  members: StructuralMember[];
}

const MemberSchedule: React.FC<MemberScheduleProps> = ({ members }) => {
  const totalConcrete = members.reduce((sum, m) => sum + (m.concreteVol || 0), 0);
  const totalSteel = members.reduce((sum, m) => sum + (m.steelWeight || 0), 0);

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
            <div className="p-3 bg-blue-100 text-blue-600 rounded-lg"><Cuboid size={24} /></div>
            <div>
                <p className="text-sm text-slate-500">Total Concrete Volume</p>
                <h3 className="text-2xl font-bold text-slate-800">{totalConcrete.toFixed(1)} m³</h3>
            </div>
        </div>
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
            <div className="p-3 bg-indigo-100 text-indigo-600 rounded-lg"><Layers size={24} /></div>
            <div>
                <p className="text-sm text-slate-500">Total Reinforcement Steel</p>
                <h3 className="text-2xl font-bold text-slate-800">{(totalSteel/1000).toFixed(2)} MT</h3>
            </div>
        </div>
      </div>

      {/* Schedule Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-200 bg-slate-50 flex justify-between items-center">
          <h3 className="font-semibold text-slate-800 flex items-center gap-2">
            <Table size={18} className="text-slate-500" /> Structural Member Schedule
          </h3>
          <span className="text-xs text-slate-500 italic">Auto-generated from Architectural Layout</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 border-b border-slate-200 text-xs uppercase text-slate-500 font-semibold">
              <tr>
                <th className="px-6 py-3">Member ID</th>
                <th className="px-6 py-3">Type</th>
                <th className="px-6 py-3">Level</th>
                <th className="px-6 py-3">Size (mm)</th>
                <th className="px-6 py-3">Reinforcement / Spec</th>
                <th className="px-6 py-3 text-right">Count</th>
                <th className="px-6 py-3 text-right">Vol (Cum)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {members.map((member, idx) => (
                <tr key={idx} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 font-mono font-medium text-slate-800">{member.mark}</td>
                  <td className="px-6 py-4 flex items-center gap-2">
                    {member.type === 'Column' && <Box size={14} className="text-red-500" />}
                    {member.type === 'Beam' && <Layers size={14} className="text-blue-500" />}
                    {member.type}
                  </td>
                  <td className="px-6 py-4 text-slate-500">{member.level}</td>
                  <td className="px-6 py-4 font-mono text-slate-700 bg-slate-50 rounded w-fit px-2 py-1">{member.dimensions}</td>
                  <td className="px-6 py-4 font-medium text-indigo-600">{member.reinforcement}</td>
                  <td className="px-6 py-4 text-right font-bold">{member.count}</td>
                  <td className="px-6 py-4 text-right text-slate-500">{(member.concreteVol || 0).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default MemberSchedule;
