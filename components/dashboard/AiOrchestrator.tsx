

import React from 'react';
import { ProjectDetails, ViewState } from '../../types';
import { ArrowRight, BrainCircuit, Sparkles } from 'lucide-react';

interface AiOrchestratorProps {
  project: Partial<ProjectDetails>;
  onChangeView: (view: ViewState) => void;
}

const AiOrchestrator: React.FC<AiOrchestratorProps> = ({ project, onChangeView }) => {
  const getNextStep = (): { text: string; action: () => void; view: ViewState } | null => {
    if (!project || !project.status) {
        return { text: 'Start a New Project with AI', action: () => onChangeView('ai-studio'), view: 'ai-studio' };
    }
    switch (project.status) {
      case 'Concept':
        return { text: 'Proceed to Structural Modeling', action: () => onChangeView('layout'), view: 'layout' };
      case 'Modeling':
        return { text: 'Configure Loads & Run Analysis', action: () => onChangeView('structure'), view: 'structure' };
      case 'Analysis':
        return { text: 'Perform Member Design & Checks', action: () => onChangeView('structure'), view: 'structure' };
      case 'Design':
        return { text: 'Generate BOQ & Estimate Costs', action: () => onChangeView('estimation'), view: 'estimation' };
      case 'Estimation':
        return { text: 'Start Project Planning & Execution', action: () => onChangeView('management'), view: 'management' };
      case 'Construction':
        return { text: 'Go to Site Management Dashboard', action: () => onChangeView('management'), view: 'management' };
      default:
        return null;
    }
  };

  const nextStep = getNextStep();
  if (!nextStep) return null;

  const Icon = project.status ? BrainCircuit : Sparkles;

  return (
    <div className="mb-8 p-6 bg-white rounded-xl border-2 border-dashed border-blue-300 shadow-sm animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-blue-100 text-blue-600 rounded-full">
            <Icon size={24} />
          </div>
          <div>
            <h3 className="font-bold text-slate-800">{project.status ? 'AI Project Guide' : 'Welcome to StructurAI'}</h3>
            <p className="text-sm text-slate-500">
              {project.status ? <>Current project status is <strong>{project.status}</strong>. The recommended next step is:</> : 'Begin by defining your project with our conversational AI.'}
            </p>
          </div>
        </div>
        <button
          onClick={nextStep.action}
          className="w-full sm:w-auto px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-all shadow-md active:scale-95 flex items-center justify-center gap-2"
        >
          {nextStep.text}
          <ArrowRight size={18} />
        </button>
      </div>
    </div>
  );
};

export default AiOrchestrator;