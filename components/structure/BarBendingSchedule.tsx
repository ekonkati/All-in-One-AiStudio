
import React, { useMemo } from 'react';
import { Ruler, Scissors, Layers, Download } from 'lucide-react';
import { BBSItem } from '../../types';

interface BarBendingScheduleProps {
  items: BBSItem[];
}

const BarBendingSchedule: React.FC<BarBendingScheduleProps> = ({ items }) => {
  
  const weightSummary = useMemo(() => {
    const summary: Record<number, number> = {};
    items.forEach(item => {
      summary[item.diameter] = (summary[item.diameter] || 0) + item.totalWeight;
    });
    return summary;
  }, [items]);

  const totalWeight = Object.values(weightSummary).reduce((a, b) => a + b, 0);

  const renderShape = (code: string, params: { a: number, b: number, c?: number, d?: number }) => {
    const strokeWidth = 3;
    const color = "#3b82f6";
    
    // Simple SVG visualizations for shapes
    if (code === '00') {
      // Straight Bar
      return (
        <svg width="100" height="20" viewBox="0 0 100 20">
          <line x1="5" y1="10" x2="95" y2="10" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round"/>
          <text x="50" y="18" fontSize="8" textAnchor="middle" fill="#64748b">{params.a/1000}m</text>
        </svg>
      );
    } else if (code === '21') {
      // Stirrup (Rectangular)
      return (
        <svg width="60" height="60" viewBox="0 0 60 60">
           <rect x="10" y="10" width="40" height="40" fill="none" stroke={color} strokeWidth={strokeWidth} rx="2" />
           <path d="M50 15 L40 10" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
           <path d="M10 45 L20 50" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
           <text x="30" y="58" fontSize="8" textAnchor="middle" fill="#64748b">{params.a}</text>
           <text x="5" y="30" fontSize="8" textAnchor="middle" fill="#64748b" transform="rotate(-90 5,30)">{params.b}</text>
        </svg>
      );
    } else if (code === '41') {
      // L-Bend
      return (
         <svg width="80" height="40" viewBox="0 0 80 40">
           <polyline points="10,5 10,30 70,30" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
           <text x="5" y="20" fontSize="8" textAnchor="middle" fill="#64748b" transform="rotate(-90 5,20)">{params.a}</text>
           <text x="40" y="38" fontSize="8" textAnchor="middle" fill="#64748b">{params.b/1000}m</text>
         </svg>
      );
    }
    return <span className="text-xs text-slate-400">Shape {code}</span>;
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
         <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
             <div className="p-3 bg-indigo-100 text-indigo-600 rounded-lg"><Layers size={24} /></div>
             <div>
                 <p className="text-sm text-slate-500">Total Steel Requirement</p>
                 <h3 className="text-2xl font-bold text-slate-800">{(totalWeight).toFixed(1)} kg</h3>
                 <p className="text-xs text-slate-400">Excluding 3% wastage</p>
             </div>
         </div>
         
         <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
             <h4 className="text-sm font-semibold text-slate-600 mb-3">Diameter-wise Breakup</h4>
             <div className="flex flex-wrap gap-2">
                 {Object.entries(weightSummary).map(([dia, wt]) => (
                     <div key={dia} className="bg-slate-50 px-3 py-2 rounded-lg border border-slate-100">
                         <span className="block text-xs text-slate-500">{dia}mm Φ</span>
                         <span className="block font-bold text-slate-800">{wt.toFixed(1)} kg</span>
                     </div>
                 ))}
             </div>
         </div>
      </div>

      {/* BBS Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-200 bg-slate-50 flex justify-between items-center">
          <h3 className="font-semibold text-slate-800 flex items-center gap-2">
            <Scissors size={18} className="text-slate-500" /> Bar Bending Schedule (BBS)
          </h3>
          <button className="flex items-center gap-2 bg-white border border-slate-300 text-slate-600 text-xs px-3 py-1.5 rounded hover:bg-slate-50">
             <Download size={14} /> Export Excel
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 border-b border-slate-200 text-xs uppercase text-slate-500 font-semibold">
              <tr>
                <th className="px-4 py-3">Mark</th>
                <th className="px-4 py-3">Member</th>
                <th className="px-4 py-3">Shape Code</th>
                <th className="px-4 py-3 text-center">Shape</th>
                <th className="px-4 py-3 text-center">Dia (mm)</th>
                <th className="px-4 py-3 text-right">Cut L (m)</th>
                <th className="px-4 py-3 text-right">Nos</th>
                <th className="px-4 py-3 text-right">Total L (m)</th>
                <th className="px-4 py-3 text-right">Weight (kg)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {items.map((item, idx) => (
                <tr key={idx} className="hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-4 font-mono text-xs">{item.barMark}</td>
                  <td className="px-4 py-4">
                      <div className="font-medium text-slate-800">{item.memberId}</div>
                      <div className="text-xs text-slate-400">{item.description}</div>
                  </td>
                  <td className="px-4 py-4 font-mono text-xs">{item.shapeCode}</td>
                  <td className="px-4 py-4 text-center">
                     <div className="flex justify-center">
                         {renderShape(item.shapeCode, item.shapeParams)}
                     </div>
                  </td>
                  <td className="px-4 py-4 text-center font-bold text-slate-700">{item.diameter}</td>
                  <td className="px-4 py-4 text-right font-mono">{item.cutLength.toFixed(2)}</td>
                  <td className="px-4 py-4 text-right font-medium">{item.noOfBars}</td>
                  <td className="px-4 py-4 text-right text-slate-500">{item.totalLength.toFixed(2)}</td>
                  <td className="px-4 py-4 text-right font-bold text-slate-800">{item.totalWeight.toFixed(1)}</td>
                </tr>
              ))}
              {items.length === 0 && (
                  <tr>
                      <td colSpan={9} className="px-6 py-8 text-center text-slate-400 italic">
                          BBS generation not applicable for this structure type (e.g. PEB/Landfill).
                      </td>
                  </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default BarBendingSchedule;
