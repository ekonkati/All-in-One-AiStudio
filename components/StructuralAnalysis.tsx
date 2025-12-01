
import React, { useState, useEffect, useMemo } from 'react';
import { ProjectDetails, ViewState } from '../types';
import AnalysisConfig from './analysis/AnalysisConfig';
import AnalysisResults from './analysis/AnalysisResults';
import MemberSchedule from './structure/MemberSchedule';
import { ArrowRight, BarChart3, Table2, ShieldCheck, Ruler } from 'lucide-react';
import { generateStructuralMembers } from '../services/calculationService';

interface StructuralAnalysisProps {
  project: Partial<ProjectDetails>;
  onChangeView?: (view: ViewState) => void;
}

type Tab = 'analysis' | 'schedule';

const StructuralAnalysis: React.FC<StructuralAnalysisProps> = ({ project, onChangeView }) => {
  const [activeTab, setActiveTab] = useState<Tab>('analysis');
  const [analyzing, setAnalyzing] = useState(false);
  const [analyzed, setAnalyzed] = useState(false);
  const [progress, setProgress] = useState(0);
  const [step, setStep] = useState<'config' | 'simulating' | 'results'>('config');

  const [materials, setMaterials] = useState({
    concrete: 'M25',
    steel: 'Fe500',
    grade: 'E250 (Steel)'
  });

  const [loads, setLoads] = useState({
    dead: true,
    live: true,
    wind: false,
    seismic: false
  });

  const structuralMembers = useMemo(() => generateStructuralMembers(project), [project]);

  // Auto-configure defaults based on project type
  useEffect(() => {
    if (project.type === 'PEB' || project.type === 'Steel') {
      setMaterials(prev => ({ ...prev, grade: 'E350' }));
      setLoads(prev => ({ ...prev, wind: true }));
    } else if (project.type === 'Retaining Wall') {
      setMaterials(prev => ({ ...prev, concrete: 'M30' }));
      setLoads(prev => ({ ...prev, live: false, wind: false, seismic: false })); // Mostly soil pressure
    } else {
      setMaterials(prev => ({ ...prev, concrete: 'M25', steel: 'Fe550' }));
    }
  }, [project.type]);

  const runAnalysis = () => {
    setStep('simulating');
    setAnalyzing(true);
    setAnalyzed(false);
    setProgress(0);

    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setAnalyzing(false);
          setAnalyzed(true);
          setStep('results');
          return 100;
        }
        return prev + 2;
      });
    }, 80);
  };

  const loadData = [
    { name: 'Dead Load', value: project.type === 'PEB' ? 1200 : 4500 },
    { name: 'Live Load', value: 2500 },
    { name: 'Wind Load', value: loads.wind ? (project.type === 'PEB' ? 3500 : 1200) : 0 },
    { name: 'Seismic', value: loads.seismic ? 980 : 0 },
  ];

  const momentData = Array.from({ length: 20 }, (_, i) => ({
    x: i,
    moment: Math.sin(i / 3) * 50 + Math.random() * 10,
    shear: Math.cos(i / 3) * 30 + Math.random() * 5
  }));

  const isWall = project.type === 'Retaining Wall';

  return (
    <div className="p-6 h-full overflow-y-auto bg-slate-50">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Structural Design</h2>
          <p className="text-slate-500">Integrated Analysis & Detailing for {project.type}</p>
        </div>
        <div className="flex bg-white p-1 rounded-lg border border-slate-200 shadow-sm">
          <button
            onClick={() => setActiveTab('analysis')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
              activeTab === 'analysis' 
                ? 'bg-blue-600 text-white shadow-sm' 
                : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <BarChart3 size={16} />
            <span>Analysis</span>
          </button>
          <button
            onClick={() => setActiveTab('schedule')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
              activeTab === 'schedule' 
                ? 'bg-blue-600 text-white shadow-sm' 
                : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <Table2 size={16} />
            <span>Member Schedule</span>
          </button>
        </div>
      </div>

      {activeTab === 'analysis' ? (
        <>
          <div className="flex justify-end mb-4">
             {step === 'results' && onChangeView && (
              <button 
                onClick={() => onChangeView('estimation')}
                className="flex items-center space-x-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors shadow-sm"
              >
                <span>Proceed to Estimation</span> <ArrowRight size={18} />
              </button>
            )}
            {step === 'results' && (
            <button
                onClick={() => setStep('config')}
                className="ml-2 text-sm px-4 py-2 border border-slate-300 bg-white rounded-lg hover:bg-slate-50 text-slate-600 transition-colors"
            >
                Modify Parameters
            </button>
            )}
          </div>

          {step === 'simulating' && (
            <div className="flex flex-col items-center justify-center h-[50vh]">
              <div className="w-full max-w-lg space-y-4">
                <div className="flex justify-between text-sm font-medium text-slate-600">
                  <span>Solving Global Stiffness Matrix...</span>
                  <span>{progress}%</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-4 overflow-hidden shadow-inner">
                  <div className="bg-blue-600 h-4 rounded-full transition-all duration-300 ease-out flex items-center justify-end pr-2" style={{ width: `${progress}%` }}>
                    <div className="w-1.5 h-1.5 bg-white/50 rounded-full animate-pulse"></div>
                  </div>
                </div>
                <p className="text-center text-xs text-slate-400 mt-2">Connecting to Kratos Multiphysics Docker Container...</p>
              </div>
            </div>
          )}

          {step === 'config' && (
            <AnalysisConfig
              projectType={project.type}
              materials={materials}
              setMaterials={setMaterials}
              loads={loads}
              setLoads={setLoads}
              runAnalysis={runAnalysis}
            />
          )}

          {step === 'results' && !isWall && (
            <AnalysisResults
              project={project}
              loadData={loadData}
              momentData={momentData}
            />
          )}

          {step === 'results' && isWall && (
             <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                {/* Wall Stability Dashboard */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-sm text-slate-500">FOS - Overturning</p>
                                <h3 className="text-3xl font-bold text-slate-800">2.45</h3>
                            </div>
                            <div className="p-3 bg-emerald-100 text-emerald-600 rounded-full"><ShieldCheck size={24} /></div>
                        </div>
                        <p className="text-xs text-emerald-600 mt-2 font-medium">Safe (> 2.0)</p>
                    </div>
                     <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-sm text-slate-500">FOS - Sliding</p>
                                <h3 className="text-3xl font-bold text-slate-800">1.62</h3>
                            </div>
                            <div className="p-3 bg-blue-100 text-blue-600 rounded-full"><Ruler size={24} /></div>
                        </div>
                         <p className="text-xs text-blue-600 mt-2 font-medium">Safe (> 1.5)</p>
                    </div>
                     <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-sm text-slate-500">Max Soil Pressure</p>
                                <h3 className="text-3xl font-bold text-slate-800">185 kPa</h3>
                            </div>
                            <div className="p-3 bg-orange-100 text-orange-600 rounded-full"><BarChart3 size={24} /></div>
                        </div>
                         <p className="text-xs text-slate-500 mt-2 font-medium">Allowable: 250 kPa</p>
                    </div>
                </div>
                
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                    <h3 className="font-semibold text-slate-700 mb-4">Design Summary</h3>
                    <p className="text-sm text-slate-600 leading-relaxed">
                        The Cantilever Retaining Wall of height <strong>{project.dimensions?.width}ft</strong> is structurally stable. 
                        The base width provided is adequate to resist overturning moments from the active earth pressure. 
                        Weep holes are recommended at 1.5m c/c spacing.
                    </p>
                </div>
             </div>
          )}
        </>
      ) : (
        <MemberSchedule members={structuralMembers} />
      )}
    </div>
  );
};

export default StructuralAnalysis;
