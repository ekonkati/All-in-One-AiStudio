import React, { useState, useMemo } from 'react';
import { ProjectDetails, ViewState } from '../../types/index';
import AnalysisConfig from './AnalysisConfig';
import AnalysisResults from './AnalysisResults';
import { Loader2, Settings, BarChart3, BookOpen, Layers, ShieldCheck, Link, FileText } from 'lucide-react';
import LoadGenerator from './LoadGenerator';
import DesignReport from '../structure/DesignReport';
import MemberSchedule from '../structure/MemberSchedule';
import SafetyCheck from '../structure/SafetyCheck';
import ConnectionDesign from '../structure/ConnectionDesign';
import ValidationCenter from './ValidationCenter';
import { generateStructuralMembers } from '../../services/calculationService';

interface StructuralAnalysisProps {
  project: Partial<ProjectDetails>;
  onChangeView?: (view: ViewState) => void;
  initialTab?: string;
}

type AnalysisTab = 'config' | 'loads' | 'validation' | 'results' | 'schedule' | 'safety' | 'report' | 'connections';

const StructuralAnalysis: React.FC<StructuralAnalysisProps> = ({ project, onChangeView, initialTab }) => {
  const [step, setStep] = useState<'config' | 'simulating' | 'results'>('config');
  const [activeTab, setActiveTab] = useState<AnalysisTab>(initialTab === 'connections' ? 'connections' : 'config');
  
  const [materials, setMaterials] = useState({ concrete: 'M25', steel: 'Fe500', grade: 'E250' });
  const [loads, setLoads] = useState({ wind: true, seismic: true });

  const { members } = useMemo(() => generateStructuralMembers(project), [project]);

  const runAnalysis = () => {
    setStep('simulating');
    setTimeout(() => {
      setStep('results');
      setActiveTab('results');
    }, 3500);
  };
  
  const renderContent = () => {
    if (step === 'simulating') {
        return (
             <div className="flex flex-col items-center justify-center h-96 text-slate-500">
                <Loader2 size={48} className="animate-spin mb-4 text-blue-600" />
                <h3 className="text-xl font-semibold">Running Kratos Solver...</h3>
                <p>Please wait while the structural model is being analyzed.</p>
             </div>
        )
    }
    
    switch(activeTab) {
        case 'config': return <AnalysisConfig projectType={project.type} materials={materials} setMaterials={setMaterials} loads={loads} setLoads={setLoads} runAnalysis={runAnalysis} />;
        case 'loads': return <LoadGenerator location={project.location || 'Hyderabad'} height={(project.stories || 1) * 3} activeLoads={{dead: true, live: true, ...loads}} />;
        case 'validation': return <ValidationCenter />;
        case 'results': return step === 'results' ? <AnalysisResults project={project} loadData={[]} momentData={[]} /> : <div className="text-center p-8 text-slate-500">Run analysis to view results.</div>;
        case 'schedule': return <MemberSchedule members={[]} />;
        case 'safety': return <SafetyCheck members={[]} />;
        case 'report': return <DesignReport />;
        case 'connections': return <ConnectionDesign />;
        default: return null;
    }
  };

  const TabButton: React.FC<any> = ({ id, label, icon }) => (
      <button onClick={() => setActiveTab(id)} className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium ${activeTab === id ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-50'}`}>{React.createElement(icon, {size: 16})} {label}</button>
  );

  return (
    <div className="p-6 h-full overflow-y-auto bg-slate-50">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-slate-800">Analysis & Design Workspace</h2>
      </div>

      <div className="flex bg-white p-1 rounded-lg border border-slate-200 shadow-sm overflow-x-auto mb-6">
        <TabButton id="config" label="Configure" icon={Settings} />
        <TabButton id="loads" label="Loads" icon={Layers} />
        <TabButton id="validation" label="Validation" icon={ShieldCheck} />
        <TabButton id="results" label="Results" icon={BarChart3} />
        <TabButton id="schedule" label="Schedule" icon={FileText} />
        <TabButton id="safety" label="Safety Check" icon={ShieldCheck} />
        <TabButton id="report" label="Design Report" icon={BookOpen} />
        <TabButton id="connections" label="Connections" icon={Link} />
      </div>

      {renderContent()}
    </div>
  );
};

export default StructuralAnalysis;