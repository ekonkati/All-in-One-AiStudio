
import React from 'react';
import { BOQItem } from '../../types';

interface BoqTableProps {
  boq: BOQItem[];
  totalCost: number;
}

const BoqTable: React.FC<BoqTableProps> = ({ boq, totalCost }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="p-4 border-b border-slate-200 bg-slate-50 flex justify-between items-center">
        <h3 className="font-semibold text-slate-700">Detailed Bill of Quantities</h3>
        <span className="text-xs text-slate-500 italic">Generated {new Date().toLocaleDateString()}</span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-slate-600">
          <thead className="bg-slate-50 text-slate-900 font-semibold border-b border-slate-200">
            <tr>
              <th className="px-6 py-4 w-16">Ref</th>
              <th className="px-6 py-4 w-32">Category</th>
              <th className="px-6 py-4">Description</th>
              <th className="px-6 py-4 text-right w-24">Qty</th>
              <th className="px-6 py-4 text-center w-20">Unit</th>
              <th className="px-6 py-4 text-right w-32">Rate (₹)</th>
              <th className="px-6 py-4 text-right w-32">Amount (₹)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {boq.map((item) => (
              <tr key={item.id} className="hover:bg-slate-50 transition-colors group">
                <td className="px-6 py-4 font-mono text-xs text-slate-400 group-hover:text-slate-600">{item.id}</td>
                <td className="px-6 py-4 font-medium text-slate-800">{item.category}</td>
                <td className="px-6 py-4">{item.description}</td>
                <td className="px-6 py-4 text-right font-mono">{item.quantity.toFixed(2)}</td>
                <td className="px-6 py-4 text-center text-xs uppercase bg-slate-100 rounded mx-auto px-2 py-1">{item.unit}</td>
                <td className="px-6 py-4 text-right text-slate-500">{item.rate.toLocaleString()}</td>
                <td className="px-6 py-4 text-right font-semibold text-slate-900">{item.amount.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
          <tfoot className="bg-slate-50 font-bold text-slate-900 border-t border-slate-200">
            <tr>
              <td colSpan={6} className="px-6 py-4 text-right text-base">Grand Total Estimate</td>
              <td className="px-6 py-4 text-right text-base text-blue-700">₹ {totalCost.toLocaleString()}</td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
};

export default BoqTable;
