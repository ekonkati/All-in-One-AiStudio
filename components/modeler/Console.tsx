import React, { useEffect, useRef } from 'react';
import { Terminal } from 'lucide-react';

interface ConsoleProps { messages: string[]; }

const Console: React.FC<ConsoleProps> = ({ messages }) => {
    const endOfMessagesRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        endOfMessagesRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    return (
        <div className="h-full flex flex-col bg-slate-800 text-white">
            <div className="p-2 border-b border-slate-700 bg-slate-900 text-xs font-semibold flex items-center gap-2">
                <Terminal size={14} className="text-green-400"/>
                Console
            </div>
            <div className="flex-1 p-3 font-mono text-xs overflow-y-auto">
                {messages.map((msg, index) => <div key={index} className="whitespace-pre-wrap">{'>'} {msg}</div>)}
                <div ref={endOfMessagesRef} />
            </div>
        </div>
    );
};
export default Console;