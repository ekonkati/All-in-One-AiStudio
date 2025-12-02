
import React, { useState, useMemo } from 'react';
import { Users, Truck, CheckSquare, Clock, AlertCircle, Package, ArrowRight, Zap, RefreshCw, TrendingDown, BarChart2, ShoppingCart } from 'lucide-react';
import { ProjectDetails, ViewState } from '../../types';
import { generateInventory } from '../../services/calculationService';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';

interface SiteResourcesProps {
  project: Partial<ProjectDetails>;
  onChangeView?: (view: ViewState) => void;
}

const SiteResources: React.FC<SiteResourcesProps> = ({ project, onChangeView }) => {
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [showOptimizationGraph, setShowOptimizationGraph] = useState(false);
  const inventory = useMemo(() => generateInventory(project.type), [project.type]);

  // Mock data for labor optimization
  const laborData = [
      { day: 'M', actual: 45, optimized: 30 },
      { day: 'T', actual: 48, optimized: 32 },
      { day: 'W', actual: 52, optimized: 35 },
      { day: 'T', actual: 40, optimized: 35 },
      { day: 'F', actual: 38, optimized: 34 },
      { day: 'S', actual: 25, optimized: 28 },
      { day: 'S', actual: 10, optimized: 15 },
  ];

  const handleOptimize = () => {
      setIsOptimizing(true);
      setTimeout(() => {
          setIsOptimizing(false);
          setShowOptimizationGraph(true);
      }, 2000);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold text-slate-800 flex items-center">
            <Users className="mr-2 text-orange-600" size={20} />
            Site Labor Resources
            </h3>
            <button 
                onClick={handleOptimize}
                disabled={showOptimizationGraph}
                className={`text-xs flex items-center gap-1 px-3 py-1.5 rounded transition-colors ${
                    showOptimizationGraph ? 'bg-green-100 text-green-700 cursor-default' : 'bg-purple-600 text-white hover:bg-purple-700'
                }`}
            >
                {isOptimizing ? <RefreshCw size={12} className="animate-spin"/> : showOptimizationGraph ? <CheckSquare size={12}/> : <Zap size={12}/>}
                {showOptimizationGraph ? 'Optimized' : 'AI Optimize'}
            </button>
        </div>
        
        {!showOptimizationGraph ? (
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
            {isOptimizing && <p className="text-xs text-purple-600 text-center animate-pulse">AI is smoothing labor peaks...</p>}
            </div>
        ) : (
            <div className="animate-in fade-in duration-500">
                <div className="h-32 w-full mb-2">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={laborData}>
                            <defs>
                                <linearGradient id="colorOpt" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                                </linearGradient>
                            </defs>
                            <Tooltip contentStyle={{fontSize: '12px'}} />
                            <Area type="monotone" dataKey="actual" stroke="#cbd5e1" fill="transparent" strokeDasharray="4 4" name="Original" />
                            <Area type="monotone" dataKey="optimized" stroke="#8b5cf6" fill="url(#colorOpt)" strokeWidth={2} name="Optimized" />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
                <div className="flex items-center justify-between text-xs text-slate-500 bg-purple-50 p-2 rounded">
                    <span className="flex items-center gap-1"><TrendingDown size={14} className="text-purple-600"/> Peak Labor Reduced</span>
                    <span className="font-bold text-purple-700">-15% Cost</span>
                </div>
            </div>
        )}
      </div>

      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <h3 className="font-semibold text-slate-800 mb-4 flex items-center justify-between">
          <div className="flex items-center">
             <Package className="mr-2 text-indigo-600" size={20} />
             Material Inventory
          </div>
          <span className="text-xs font-normal text-slate-500 bg-slate-100 px-2 py-1 rounded">Live Stock</span>
        </h3>
        
        <div className="overflow-hidden rounded-lg border border-slate-100">
            <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-500">
                    <tr>
                        <th className="p-2">Material</th>
                        <th className="p-2 text-right">Stock</th>
                        <th className="p-2 text-center">Action</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                    {inventory.map(item => (
                        <tr key={item.id}>
                            <td className="p-2 font-medium text-slate-700">
                                {item.material}
                                {item.status === 'Critical' && <span className="ml-2 text-[8px] bg-red-100 text-red-600 px-1 py-0.5 rounded">LOW</span>}
                            </td>
                            <td className="p-2 text-right text-slate-600">{item.stock} {item.unit}</td>
                            <td className="p-2 text-center">
                                {item.status === 'Critical' || item.status === 'Low' ? (
                                    <button 
                                      onClick={() => onChangeView && onChangeView('procurement')}
                                      className="bg-blue-50 text-blue-600 px-2 py-1 rounded hover:bg-blue-100 text-[10px] font-medium flex items-center gap-1 mx-auto"
                                    >
                                        <ShoppingCart size={10} /> Reorder
                                    </button>
                                ) : (
                                    <span className="text-emerald-500"><CheckSquare size={14} className="mx-auto"/></span>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
        <div className="mt-4 text-center">
            <button className="text-xs text-blue-600 hover:underline flex items-center justify-center gap-1">
                View Full Inventory <ArrowRight size={12} />
            </button>
        </div>
      </div>
    </div>
  );
};

export default SiteResources;
