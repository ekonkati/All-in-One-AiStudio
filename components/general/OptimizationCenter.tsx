
import React, { useState, useMemo } from 'react';
import { BrainCircuit, CheckCircle2, DollarSign, Layers, Zap, Loader2 } from 'lucide-react';
import { ProjectDetails, OptimizationSuggestion } from '../../types';
import { calculateProjectStats, generateOptimizations } from '../../services/calculationService';

interface OptimizationCenterProps {
    project: Partial<ProjectDetails>;
}

const OptimizationCenter: React.FC<OptimizationCenterProps> = ({ project }) => {
  const [suggestions, setSuggestions] = useState<OptimizationSuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [optimizedStats, setOptimizedStats] = useState<any>(null);

  const initialStats = useMemo(() => calculateProjectStats(project), [project]);

  const runOptimization = () => {
      setIsLoading(true);
      setTimeout(() => {
          const newSuggestions = generateOptimizations(project);
          setSuggestions(newSuggestions);
          setIsLoading(false);
      }, 2000);
  };

  const applySuggestion = (id: string) => {
    setSuggestions(prev => prev.map(s => s.id === id ? { ...s, status: 'applied' } : s));
    // Simulate cost update
    setOptimizedStats({
        ...initialStats,
        estimatedCost: initialStats.estimatedCost * 0.92, // Apply ~8% reduction
    });
  };

  const statsToDisplay = optimizedStats || initialStats;

  return (
    <div className="p-6 h-full overflow-y-auto bg-slate-50 animate-in fade-in duration-500">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <BrainCircuit size={28} className="text-purple-600"/> AI Optimization Center
        </h2>
        <p className="text-slate-500">Value Engineering & Cost Optimization Engine</p>
      </div>

      {/* Stats Comparison */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
              <p className="text-sm text-slate-500 mb-1 flex items-center gap-2"><DollarSign size={14}/> Total Cost</p>
              <h3 className="text-3xl font-bold text-slate-800">₹ {(statsToDisplay.estimatedCost / 100000).toFixed(2)} L</h3>
              {optimizedStats && <span className="text-xs font-bold text-emerald-600 bg-emerald-100 px-2 py-0.5 rounded-full mt-1 inline-block">Saved: ₹ {((initialStats.estimatedCost - optimizedStats.estimatedCost) / 100000).toFixed(2)} L</span>}
          </div>
           <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
              <p className="text-sm text-slate-500 mb-1 flex items-center gap-2"><Layers size={14}/> Concrete Volume</p>
              <h3 className="text-3xl font-bold text-slate-800">{ (project.type === 'RCC' ? 145 * (optimizedStats ? 0.95 : 1) : 0).toFixed(1)} m³</h3>
              {optimizedStats && <span className="text-xs text-emerald-600 font-medium">-5%</span>}
          </div>
           <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
              <p className="text-sm text-slate-500 mb-1 flex items-center gap-2"><Zap size={14}/> Steel Tonnage</p>
              <h3 className="text-3xl font-bold text-slate-800">{ (project.type === 'RCC' ? 18.5 * (optimizedStats ? 0.88 : 1) : 18.5).toFixed(2)} MT</h3>
              {optimizedStats && <span className="text-xs text-emerald-600 font-medium">-12%</span>}
          </div>
      </div>
      
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-slate-200 bg-slate-50 flex justify-between items-center">
             <h3 className="font-semibold text-slate-800">AI-Generated Suggestions</h3>
             {!isLoading && suggestions.length === 0 && (
                <button 
                    onClick={runOptimization}
                    className="bg-purple-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-purple-700 flex items-center gap-2 transition-colors"
                >
                    <BrainCircuit size={16}/> Run AI Optimization
                </button>
             )}
             {isLoading && (
                 <div className="flex items-center gap-2 text-sm text-purple-600">
                     <Loader2 size={16} className="animate-spin" />
                     Analyzing model for cost-saving opportunities...
                 </div>
             )}
          </div>
          
          {suggestions.length > 0 ? (
            <div className="divide-y divide-slate-100">
                {suggestions.map(sugg => (
                    <div key={sugg.id} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                        <div>
                            <div className="flex items-center gap-3">
                               <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                                   sugg.category === 'Material' ? 'bg-blue-100 text-blue-700' : 
                                   sugg.category === 'Structural' ? 'bg-orange-100 text-orange-700' : 'bg-emerald-100 text-emerald-700'
                               }`}>{sugg.category}</span>
                               <h4 className="font-semibold text-slate-800">{sugg.title}</h4>
                            </div>
                            <p className="text-sm text-slate-500 mt-1 max-w-xl">{sugg.description}</p>
                        </div>
                        <div className="flex items-center gap-4">
                            <span className="font-bold text-emerald-600 text-sm">{sugg.impact}</span>
                            {sugg.status === 'pending' ? (
                                <button 
                                    onClick={() => applySuggestion(sugg.id)}
                                    className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700"
                                >
                                    Apply
                                </button>
                            ) : (
                                <div className="flex items-center gap-1 text-emerald-600 font-medium text-sm">
                                    <CheckCircle2 size={16}/> Applied
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
          ) : !isLoading && (
            <div className="p-16 text-center">
                <BrainCircuit size={48} className="mx-auto text-slate-300 mb-4" />
                <h3 className="font-bold text-slate-700">Ready to Optimize</h3>
                <p className="text-slate-500 text-sm mt-2">Click "Run AI Optimization" to discover potential savings and design improvements for your project.</p>
            </div>
          )}
      </div>
    </div>
  );
};

export default OptimizationCenter;
