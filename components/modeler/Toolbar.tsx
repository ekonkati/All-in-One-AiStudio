import React from 'react';
import { MousePointer, Target, Minus, Play, Anchor, Zap, Scissors, Eye, Square, BarChart2, TrendingUp } from 'lucide-react';
import { ModelerTool } from '../../types/index';

interface ToolbarProps {
    activeTool: ModelerTool;
    setActiveTool: (tool: ModelerTool) => void;
    onRunAnalysis: () => void;
    showDiagram: 'none' | 'moment' | 'shear';
    setShowDiagram: (type: 'none' | 'moment' | 'shear') => void;
    isAnalysisDone: boolean;
}

const Toolbar: React.FC<ToolbarProps> = ({ activeTool, setActiveTool, onRunAnalysis, showDiagram, setShowDiagram, isAnalysisDone }) => {
    const ToolButton = ({ tool, label, icon: Icon }: { tool: ModelerTool, label: string, icon: React.ElementType }) => (
        <button 
            onClick={() => setActiveTool(tool)}
            className={`flex flex-col items-center p-2 rounded-md transition-colors min-w-[60px] ${ activeTool === tool ? 'bg-blue-100 text-blue-700' : 'text-slate-500 hover:bg-slate-100' }`}
            title={label}
        >
            <Icon size={20} />
            <span className="text-[10px] mt-1 font-medium">{label}</span>
        </button>
    );
    const Divider = () => <div className="w-px h-10 bg-slate-200 mx-1"></div>;

    return (
        <div className="bg-white border-b border-slate-200 p-1 flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-2">
                 <div className="p-1 border-r border-slate-200 mr-1">
                     <p className="text-[10px] font-bold text-center text-slate-400 mb-1">Geometry</p>
                     <div className="flex items-center gap-1">
                        <ToolButton tool="select" label="Select" icon={MousePointer} />
                        <ToolButton tool="add-node" label="Node" icon={Target} />
                        <ToolButton tool="add-member" label="Member" icon={Minus} />
                        <ToolButton tool="add-plate" label="Plate" icon={Square} />
                     </div>
                 </div>
                 <div className="p-1 border-r border-slate-200 mr-1">
                    <p className="text-[10px] font-bold text-center text-slate-400 mb-1">Assign</p>
                     <div className="flex items-center gap-1">
                        <ToolButton tool="add-support" label="Support" icon={Anchor} />
                        <ToolButton tool="add-load" label="Load" icon={Zap} />
                        <ToolButton tool="release-member" label="Release" icon={Scissors} />
                     </div>
                 </div>
                 <div className="p-1">
                    <p className="text-[10px] font-bold text-center text-slate-400 mb-1">View</p>
                     <div className="flex items-center gap-1">
                        <button disabled={!isAnalysisDone} onClick={() => setShowDiagram('moment')} className={`flex flex-col items-center p-2 rounded-md transition-colors min-w-[60px] ${ showDiagram === 'moment' ? 'bg-blue-100 text-blue-700' : 'text-slate-500 hover:bg-slate-100' } disabled:opacity-50`}>
                            <BarChart2 size={20} />
                            <span className="text-[10px] mt-1 font-medium">BMD</span>
                        </button>
                         <button disabled={!isAnalysisDone} onClick={() => setShowDiagram('shear')} className={`flex flex-col items-center p-2 rounded-md transition-colors min-w-[60px] ${ showDiagram === 'shear' ? 'bg-blue-100 text-blue-700' : 'text-slate-500 hover:bg-slate-100' } disabled:opacity-50`}>
                            <TrendingUp size={20} />
                            <span className="text-[10px] mt-1 font-medium">SFD</span>
                        </button>
                     </div>
                 </div>
            </div>
            <button onClick={onRunAnalysis} className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 flex items-center gap-2">
                <Play size={16} /> Analyze & Design
            </button>
        </div>
    );
};

export default Toolbar;