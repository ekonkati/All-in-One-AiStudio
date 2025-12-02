
import React, { useState, useEffect, useRef } from 'react';
import { Bot, User, Send, CheckCircle2, Loader2, Sparkles } from 'lucide-react';
import { AiDesignStep, ViewState, ProjectDetails } from '../../types';
import { getAiDesignFlow } from '../../services/calculationService';

interface AiDesignStudioProps {
    onProjectCreated: (details: Partial<ProjectDetails>) => void;
    setView: (view: ViewState) => void;
}

const AiDesignStudio: React.FC<AiDesignStudioProps> = ({ onProjectCreated, setView }) => {
    const [flow, setFlow] = useState<AiDesignStep[]>(getAiDesignFlow());
    const [userInput, setUserInput] = useState('');
    const [isThinking, setIsThinking] = useState(false);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [drawingState, setDrawingState] = useState<any>({});

    const activeStep = flow.find(s => s.status === 'active');

    const draw = (ctx: CanvasRenderingContext2D, state: any) => {
        const { width, height } = ctx.canvas;
        ctx.clearRect(0, 0, width, height);
        ctx.fillStyle = '#f8fafc';
        ctx.fillRect(0, 0, width, height);

        if (state.boundary) {
            ctx.strokeStyle = '#3b82f6';
            ctx.lineWidth = 2;
            const w = state.boundary.w * 5;
            const h = state.boundary.h * 5;
            ctx.strokeRect((width-w)/2, (height-h)/2, w, h);
        }
        if(state.grid) {
            ctx.strokeStyle = '#e2e8f0';
            ctx.lineWidth = 1;
            const w = state.boundary.w * 5;
            const h = state.boundary.h * 5;
            const startX = (width-w)/2;
            const startY = (height-h)/2;

            for(let i=0; i <= state.grid.cols; i++){
                ctx.beginPath();
                ctx.moveTo(startX + i * (w/state.grid.cols), startY);
                ctx.lineTo(startX + i * (w/state.grid.cols), startY + h);
                ctx.stroke();
            }
            for(let j=0; j <= state.grid.rows; j++){
                ctx.beginPath();
                ctx.moveTo(startX, startY + j * (h/state.grid.rows));
                ctx.lineTo(startX + w, startY + j * (h/state.grid.rows));
                ctx.stroke();
            }
        }
    };

    useEffect(() => {
        const canvas = canvasRef.current;
        if (canvas) {
            const ctx = canvas.getContext('2d');
            if (ctx) draw(ctx, drawingState);
        }
    }, [drawingState]);
    
    const processFlow = async (index: number, response?: string) => {
        if (index >= flow.length) return;

        setIsThinking(true);
        await new Promise(res => setTimeout(res, 800)); // Simulate AI thinking
        
        setFlow(prev => prev.map((s, i) => {
            if (i < index) return { ...s, status: 'completed', response: i === index-1 ? response : s.response };
            if (i === index) return { ...s, status: 'active' };
            return s;
        }));
        
        const current = flow[index];
        if (current.action === 'GENERATE') {
            if (current.payload.type === 'finalize') {
                 // Final step, create project and navigate
                 const projectDetails: Partial<ProjectDetails> = {
                    name: 'AI Generated G+2',
                    type: 'RCC',
                    location: 'Hyderabad',
                    stories: 3,
                    dimensions: { length: 60, width: 40 }
                 };
                 onProjectCreated(projectDetails);
                 setTimeout(() => setView('dashboard'), 1500);
            } else {
                 setDrawingState((prev: any) => ({ ...prev, [current.payload.type]: current.payload }));
                 processFlow(index + 1);
            }
        }
        setIsThinking(false);
    };

    useEffect(() => {
        processFlow(0); // Start the flow
    }, []);

    const handleSend = () => {
        if (!userInput.trim() || !activeStep || activeStep.action !== 'INPUT') return;
        const currentIndex = flow.findIndex(s => s.status === 'active');
        setUserInput('');
        processFlow(currentIndex + 1, userInput);
    };

    return (
        <div className="flex h-full bg-slate-100">
            {/* Left: Chat Panel */}
            <div className="w-1/3 h-full flex flex-col bg-white border-r border-slate-200">
                <div className="p-4 border-b border-slate-200">
                    <h2 className="font-bold text-slate-800 flex items-center gap-2"><Sparkles size={20} className="text-blue-500" /> AI Design Studio</h2>
                    <p className="text-xs text-slate-500">Conversational design generation (Part 39)</p>
                </div>
                <div className="flex-1 p-4 space-y-4 overflow-y-auto">
                    {flow.map(step => (
                        <div key={step.id}>
                            {step.status !== 'pending' && (
                                <div className="flex items-start gap-3 animate-in fade-in duration-500">
                                    <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${step.status === 'completed' ? 'bg-emerald-500' : 'bg-blue-500 animate-pulse'}`}>
                                        <Bot size={16} className="text-white"/>
                                    </div>
                                    <div className="p-3 rounded-lg bg-slate-100 text-sm text-slate-700 w-full">
                                        <p>{step.question}</p>
                                    </div>
                                </div>
                            )}
                            {step.status === 'completed' && step.response && (
                                <div className="flex items-start gap-3 mt-4 justify-end animate-in fade-in duration-500">
                                     <div className="p-3 rounded-lg bg-blue-600 text-sm text-white">
                                        <p>{step.response}</p>
                                    </div>
                                    <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center bg-slate-700">
                                        <User size={16} className="text-white"/>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                    {isThinking && <Loader2 className="animate-spin text-slate-400 mx-auto" />}
                </div>
                <div className="p-4 border-t border-slate-200">
                    <div className="flex gap-2">
                        <input 
                            type="text"
                            value={userInput}
                            onChange={e => setUserInput(e.target.value)}
                            onKeyDown={e => e.key === 'Enter' && handleSend()}
                            disabled={!activeStep || activeStep.action !== 'INPUT' || isThinking}
                            placeholder={activeStep?.action === 'INPUT' ? 'Type your answer...' : 'AI is generating...'}
                            className="flex-1 border border-slate-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm"
                        />
                        <button 
                            onClick={handleSend}
                            disabled={!activeStep || activeStep.action !== 'INPUT' || isThinking}
                            className="p-2 bg-blue-600 text-white rounded-lg disabled:bg-slate-300 transition-colors"
                        >
                            <Send size={20}/>
                        </button>
                    </div>
                </div>
            </div>
            {/* Right: Visualizer */}
            <div className="w-2/3 h-full flex flex-col items-center justify-center bg-slate-50 p-6">
                <canvas ref={canvasRef} width="800" height="600" className="bg-white rounded-lg border border-slate-200 shadow-sm"></canvas>
            </div>
        </div>
    );
};

export default AiDesignStudio;