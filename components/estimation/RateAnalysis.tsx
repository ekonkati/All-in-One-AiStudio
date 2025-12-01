
import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { Calculator, Hammer, Truck, Package } from 'lucide-react';
import { RateAnalysisItem } from '../../types';

interface RateAnalysisProps {
  analysis: RateAnalysisItem[];
}

const RateAnalysis: React.FC<RateAnalysisProps> = ({ analysis }) => {
  return (
    <div className="space-y-8 animate-in fade-in duration-500 mt-8 pt-8 border-t border-slate-200">
      <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
        <Calculator size={24} className="text-blue-600" />
        Rate Analysis
      </h3>
      <p className="text-slate-500 -mt-6">Breakdown of unit rates into Material, Labor, and Machinery components.</p>

      {analysis.map((item) => {
          const materialCost = item.components.material.reduce((acc, i) => acc + i.amount, 0);
          const laborCost = item.components.labor.reduce((acc, i) => acc + i.amount, 0);
          const machineryCost = item.components.machinery.reduce((acc, i) => acc + i.amount, 0);

          const pieData = [
              { name: 'Material', value: materialCost, color: '#3b82f6' },
              { name: 'Labor', value: laborCost, color: '#f59e0b' },
              { name: 'Machinery', value: machineryCost, color: '#10b981' }
          ];

          return (
            <div key={item.itemId} className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-4 bg-slate-50 border-b border-slate-200 flex justify-between items-center">
                    <div>
                        <h4 className="font-bold text-slate-800">{item.description}</h4>
                        <p className="text-xs text-slate-500">Item ID: {item.itemId}</p>
                    </div>
                    <div className="text-right">
                        <p className="text-sm text-slate-500">Unit Rate</p>
                        <p className="text-xl font-bold text-blue-700">₹ {item.totalRate.toLocaleString()} <span className="text-sm font-normal text-slate-500">/ {item.unit}</span></p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3">
                    {/* Chart Section */}
                    <div className="p-6 border-b lg:border-b-0 lg:border-r border-slate-200 flex flex-col items-center justify-center">
                        <div className="h-40 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie data={pieData} innerRadius={40} outerRadius={60} paddingAngle={5} dataKey="value" stroke="none">
                                        {pieData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="flex gap-4 text-xs mt-2">
                            <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-blue-500"></div> Material</span>
                            <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-amber-500"></div> Labor</span>
                            <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-emerald-500"></div> Machine</span>
                        </div>
                    </div>

                    {/* Breakdown Section */}
                    <div className="lg:col-span-2 p-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {/* Material Column */}
                            <div>
                                <h5 className="text-sm font-semibold text-blue-600 mb-3 flex items-center gap-2"><Package size={14} /> Material</h5>
                                <ul className="space-y-2 text-sm text-slate-600">
                                    {item.components.material.map((comp, i) => (
                                        <li key={i} className="flex justify-between border-b border-slate-100 pb-1 last:border-0">
                                            <span>{comp.name}</span>
                                            <span className="font-medium">₹{comp.amount}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                             {/* Labor Column */}
                             <div>
                                <h5 className="text-sm font-semibold text-amber-600 mb-3 flex items-center gap-2"><Hammer size={14} /> Labor</h5>
                                <ul className="space-y-2 text-sm text-slate-600">
                                    {item.components.labor.map((comp, i) => (
                                        <li key={i} className="flex justify-between border-b border-slate-100 pb-1 last:border-0">
                                            <span>{comp.name}</span>
                                            <span className="font-medium">₹{comp.amount}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                             {/* Machinery Column */}
                             <div>
                                <h5 className="text-sm font-semibold text-emerald-600 mb-3 flex items-center gap-2"><Truck size={14} /> Machinery</h5>
                                <ul className="space-y-2 text-sm text-slate-600">
                                    {item.components.machinery.map((comp, i) => (
                                        <li key={i} className="flex justify-between border-b border-slate-100 pb-1 last:border-0">
                                            <span>{comp.name}</span>
                                            <span className="font-medium">₹{comp.amount}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
          );
      })}
    </div>
  );
};

export default RateAnalysis;
