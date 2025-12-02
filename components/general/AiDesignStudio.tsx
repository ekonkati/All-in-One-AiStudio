import React, { useState, useEffect } from 'react';
import { Bot, User, Send, Loader2, Sparkles } from 'lucide-react';
import { AiDesignStep, ViewState, ProjectDetails } from '../../types/index';
import { generateAiDesignFlow, generateStructuralModel } from '../../services/calculationService';

interface AiDesignStudioProps {
    onProjectCreated: (details: Partial<ProjectDetails>) => void;
    setView: (view: ViewState) => void;
}

const AiDesignStudio: React.FC<AiDesignStudioProps> = ({ onProjectCreated, setView }) => {
    const [flow, setFlow] = useState<AiDesignStep[]>(generateAiDesignFlow());
    const [userInput, setUserInput] = useState('');
    const [isThinking, setIsThinking] = useState(false);

    const activeStep = flow.find(s => s.status === 'active');

    const processFlow = async (index: number, response?: string) => {
        if (index >= flow.length) return;
        setIsThinking(true);
        await new Promise(res => setTimeout(res, 800));
        setFlow(prev => prev.map((s, i) => i < index ? { ...s, status: 'completed', response: i === index-1 ? response : s.response } : i === index ? { ...s, status: 'active' } : s));
        const current = flow[index];
        if (current.action === 'GENERATE' || current.action === 'CONFIRM') {
            if (current.payload?.type === 'finalize') {
                 onProjectCreated({ name: 'AI Generated G+2', type: 'RCC', location: 'Hyderabad', stories: 3, dimensions: { length: 20, width: 15 } });
                 // No need to setView here, App.tsx will handle it on project update
            } else {
                 processFlow(index + 1);
            }
        }
        setIsThinking(false);
    };

    useEffect(() => { processFlow(0); }, []);

    const handleSend = () => {
        if (!userInput.trim() || !activeStep || activeStep.action !== 'INPUT') return;
        const currentIndex = flow.findIndex(s => s.status === 'active');
        processFlow(currentIndex + 1, userInput);
        setUserInput('');
    };

    return (
        <div className="flex h-full bg-slate-100">
            <div className="w-1/3 h-full flex flex-col bg-white border-r">
                <div className="p-4 border-b"><h2 className="font-bold text-slate-800 flex items-center gap-2"><Sparkles size={20} className="text-blue-500" /> AI Design Studio</h2></div>
                <div className="flex-1 p-4 space-y-4 overflow-y-auto">
                    {flow.map(step => (
                        <div key={step.id}>
                            {step.status !== 'pending' && <div className="flex items-start gap-3"><div className="w-8 h-8 rounded-full flex items-center justify-center bg-blue-500"><Bot size={16} className="text-white"/></div><div className="p-3 rounded-lg bg-slate-100 text-sm">{step.question}</div></div>}
                            {step.status === 'completed' && step.response && <div className="flex items-start gap-3 mt-4 justify-end"><div className="p-3 rounded-lg bg-blue-600 text-sm text-white">{step.response}</div><div className="w-8 h-8 rounded-full flex items-center justify-center bg-slate-700"><User size={16} className="text-white"/></div></div>}
                        </div>
                    ))}
                    {isThinking && <Loader2 className="animate-spin text-slate-400 mx-auto" />}
                </div>
                <div className="p-4 border-t">
                    <div className="flex gap-2">
                        <input type="text" value={userInput} onChange={e => setUserInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSend()} disabled={!activeStep || activeStep.action !== 'INPUT'} placeholder="Type your answer..." className="flex-1 border rounded-full px-4 py-2" />
                        <button onClick={handleSend} disabled={!activeStep || activeStep.action !== 'INPUT'} className="p-2 bg-blue-600 text-white rounded-full disabled:bg-slate-300"><Send size={20}/></button>
                    </div>
                </div>
            </div>
            <div className="w-2/3 h-full flex items-center justify-center bg-slate-50 p-6">
                <div className="text-center text-slate-400">
                    <p>Live 3D Preview will appear here as you provide details.</p>
                </div>
            </div>
        </div>
    );
};
export default AiDesignStudio;