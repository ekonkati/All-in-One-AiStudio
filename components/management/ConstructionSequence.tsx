

import React, { useState, useEffect, useMemo } from 'react';
import { Play, Pause, RotateCcw, Clock, TrendingUp, AlertTriangle, GitMerge } from 'lucide-react';
// FIX: Corrected import path from ../../types to ../../types/index to be explicit
import { PhaseItem } from '../../types/index';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { generateConstructionRisks } from '../../services/calculationService';

interface ConstructionSequenceProps {
  phases: PhaseItem[];
}

const ConstructionSequence: React.FC<ConstructionSequenceProps> = ({ phases }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentWeek, setCurrentWeek] = useState(0);
  const totalWeeks = 30; // Simulated timeline length
  const risks = useMemo(() => generateConstructionRisks(), []);

  useEffect(() => {
    let interval: any;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentWeek(prev => {
          if (prev >= totalWeeks) {
            setIsPlaying(false);
            return totalWeeks;
          }
          return prev + 1;
        });
      }, 500); // 0.5s per week
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  const getPhaseStatus = (phaseIndex: number) => {
    const startWeek = phaseIndex * 5;
    const endWeek = startWeek + 5;
    
    if (currentWeek < startWeek) return 'Pending';
    if (currentWeek >= startWeek && currentWeek < endWeek) return 'Active';
    return 'Completed';
  };

  const getProgress = (phaseIndex: number) => {
    const startWeek = phaseIndex * 5;
    const endWeek = startWeek + 5;
    if (currentWeek < startWeek) return 0;
    if (currentWeek >= endWeek) return 100;
    return Math.round(((currentWeek - startWeek) / 5) * 100);
  };

  // Mock Cashflow S-Curve Data
  const financialData = Array.from({ length: totalWeeks + 1 }, (_, i) => {
      const progress = i / totalWeeks;
      const sCurve = 1 / (1 + Math.exp(-10 * (progress - 0.5))); // Sigmoid function
      return {
          week: `W${i}`,
          cumulativeCost: Math.round(sCurve * 100)
      };
  });

  return (
    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm animate-in fade-in duration-500">
      <div className="flex justify-between items-center mb-6">
        <div>
           <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
             <Clock size={20} className="text-blue-600" />
             4D Construction Simulation (Part 44)
           </h3>
           <p className="text-sm text-slate-500">AI-Linked Sequencing, Critical Path & Risk Prediction</p>
        </div>
        <div className="flex items-center gap-3">
           <span className="font-mono font-bold text-slate-700 bg-slate-100 px-3 py-1 rounded">Week {currentWeek} / {totalWeeks}</span>
           <button 
             onClick={() => setIsPlaying(!isPlaying)}
             className={`p-2 rounded-full text-white transition-colors ${isPlaying ? 'bg-amber-500 hover:bg-amber-600' : 'bg-emerald-600 hover:bg-emerald-700'}`}
           >
             {isPlaying ? <Pause size={20} /> : <Play size={20} />}
           </button>
           <button 
             onClick={() => { setIsPlaying(false); setCurrentWeek(0); }}
             className="p-2 rounded-full bg-slate-200 text-slate-600 hover:bg-slate-300 transition-colors"
           >
             <RotateCcw size={20} />
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Phase List */}
          <div className="lg:col-span-2 space-y-4 max-h-[400px] overflow-y-auto pr-2">
            {phases.map((phase, idx) => {
                const status = getPhaseStatus(idx);
                const progress = getProgress(idx);
                const isCritical = idx % 2 === 0; // Mock logic for critical path
                
                return (
                <div key={idx} className={`p-4 rounded-lg border transition-all duration-300 relative ${
                    status === 'Active' ? 'border-blue-500 bg-blue-50 shadow-md scale-[1.02]' : 
                    status === 'Completed' ? 'border-emerald-200 bg-emerald-50/50 opacity-80' : 
                    'border-slate-100 bg-slate-50 opacity-50'
                }`}>
                    <div className="flex justify-between mb-2">
                        <h4 className={`font-semibold flex items-center gap-2 ${status === 'Active' ? 'text-blue-800' : 'text-slate-700'}`}>
                            {phase.name}
                            {isCritical && <span className="text-[10px] bg-rose-100 text-rose-700 px-1.5 py-0.5 rounded flex items-center gap-1"><GitMerge size={10}/> CP</span>}
                        </h4>
                        <span className={`text-xs px-2 py-0.5 rounded font-medium ${
                            status === 'Active' ? 'bg-blue-200 text-blue-800' : 
                            status === 'Completed' ? 'bg-emerald-200 text-emerald-800' : 'bg-slate-200 text-slate-600'
                        }`}>
                            {status}
                        </span>
                    </div>
                    <div className="w-full bg-white rounded-full h-2.5 overflow-hidden border border-slate-200">
                        <div 
                            className={`h-2.5 transition-all duration-300 ${status === 'Completed' ? 'bg-emerald-500' : 'bg-blue-500'}`} 
                            style={{ width: `${progress}%` }}
                        ></div>
                    </div>
                </div>
                );
            })}
          </div>

          {/* Right Column: S-Curve & Risks */}
          <div className="lg:col-span-2 space-y-6">
              {/* Financial S-Curve Overlay */}
              <div className="bg-slate-50 rounded-xl border border-slate-200 p-4 flex flex-col h-48">
                  <h4 className="font-semibold text-slate-700 mb-2 flex items-center gap-2 text-sm">
                      <TrendingUp size={16} className="text-emerald-600" /> Cashflow S-Curve
                  </h4>
                  <div className="flex-1">
                      <ResponsiveContainer width="100%" height="100%">
                          <AreaChart data={financialData}>
                              <defs>
                                  <linearGradient id="colorCost" x1="0" y1="0" x2="0" y2="1">
                                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                                  </linearGradient>
                              </defs>
                              <XAxis dataKey="week" hide />
                              <YAxis hide domain={[0, 100]} />
                              <Tooltip contentStyle={{ fontSize: '12px', borderRadius: '4px' }} />
                              <Area 
                                  type="monotone" 
                                  dataKey="cumulativeCost" 
                                  stroke="#10b981" 
                                  fillOpacity={1} 
                                  fill="url(#colorCost)" 
                                  strokeWidth={2}
                              />
                              <line x1={`${(currentWeek/totalWeeks)*100}%`} y1="0" x2={`${(currentWeek/totalWeeks)*100}%`} y2="100%" stroke="red" strokeDasharray="3 3" />
                          </AreaChart>
                      </ResponsiveContainer>
                  </div>
              </div>

              {/* AI Risk Analysis */}
              <div className="bg-white rounded-xl border border-slate-200 p-4">
                  <h4 className="font-semibold text-slate-700 mb-3 flex items-center gap-2 text-sm">
                      <AlertTriangle size={16} className="text-orange-600" /> AI Risk Prediction
                  </h4>
                  <div className="space-y-3">
                      {risks.map(risk => (
                          <div key={risk.id} className="p-2 border-l-4 border-orange-400 bg-orange-50 rounded-r text-sm">
                              <div className="flex justify-between font-medium text-orange-900">
                                  <span>{risk.category}: {risk.description}</span>
                                  <span className="text-xs bg-white px-1.5 rounded border border-orange-200">{risk.probability}</span>
                              </div>
                              <p className="text-xs text-orange-800 mt-1">Mitigation: {risk.mitigation}</p>
                          </div>
                      ))}
                  </div>
              </div>
          </div>
      </div>
    </div>
  );
};

export default ConstructionSequence;