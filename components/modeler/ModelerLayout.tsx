import React, { useState } from 'react';
import { ProjectDetails, Node, Member, SelectedEntity, ModelerTool, Support, StructuralLoad, Release, Material, Section, LoadCase, LoadCombination, Plate, AnalysisResults } from '../../types/index';
import Toolbar from './Toolbar';
import LeftSidebar from './LeftSidebar';
import ThreeCanvas from './ThreeCanvas';
import Console from './Console';
import { runAnalysisAndDesign } from '../../services/calculationService';

interface ModelerLayoutProps {
    project: Partial<ProjectDetails>;
    nodes: Node[];
    members: Member[];
    plates: Plate[];
    supports: Support[];
    materials: Material[];
    sections: Section[];
    loadCases: LoadCase[];
    loads: StructuralLoad[];
    loadCombinations: LoadCombination[];
    selectedEntity: SelectedEntity | null;
    onSelectEntity: (entity: SelectedEntity | null) => void;
    onModelAction: (action: string, payload: any) => void;
    onModelUpdate: (updates: any) => void;
    analysisResults: AnalysisResults | null;
}

const ModelerLayout: React.FC<ModelerLayoutProps> = (props) => {
    const [activeTool, setActiveTool] = useState<ModelerTool>('select');
    const [consoleMessages, setConsoleMessages] = useState<string[]>(['STAAD-like Workspace Initialized.']);
    const [showDiagram, setShowDiagram] = useState<'none' | 'moment' | 'shear'>('none');

    const logMessage = (message: string) => {
        setConsoleMessages(prev => [...prev.slice(-100), `[${new Date().toLocaleTimeString()}] ${message}`]);
    };

    const handleModelAction = (action: string, payload: any) => {
        props.onModelAction(action, payload);
        logMessage(`Action: ${action} with payload ${JSON.stringify(payload)}`);
    };

    const handleRunAnalysisAndDesign = () => {
      logMessage("Preparing model for Analysis & Design...");
      const { analysisResults: results, updatedMembers } = runAnalysisAndDesign({
        members: props.members, sections: props.sections, materials: props.materials
      });
      logMessage("Analysis & Design complete. Members updated with results.");
      props.onModelUpdate({ members: updatedMembers, analysisResults: results });
      setShowDiagram('moment'); // Default to showing moment diagram after analysis
    };
    
    return (
        <div className="flex flex-col h-full bg-slate-100">
            <Toolbar 
                activeTool={activeTool} 
                setActiveTool={tool => { setActiveTool(tool); logMessage(`Tool changed to: ${tool}`); }}
                onRunAnalysis={handleRunAnalysisAndDesign}
                showDiagram={showDiagram}
                setShowDiagram={setShowDiagram}
                isAnalysisDone={!!props.analysisResults}
            />
            <div className="flex flex-1 overflow-hidden">
                <LeftSidebar {...props} onUpdateEntity={(id, type, newProps) => handleModelAction('update-entity', { id, type, newProps })} />
                <main className="flex-1 flex flex-col relative">
                    <div className="flex-1 min-h-0">
                        <ThreeCanvas 
                           {...props} 
                           activeTool={activeTool} 
                           onModelAction={handleModelAction} 
                           logMessage={logMessage} 
                           analysisResults={props.analysisResults} 
                           showDiagram={showDiagram}
                        />
                    </div>
                    <div className="h-40 flex-shrink-0">
                         <Console messages={consoleMessages} />
                    </div>
                </main>
            </div>
        </div>
    );
};

export default ModelerLayout;
