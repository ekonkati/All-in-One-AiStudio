import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Loader2, FileUp, Sparkles } from 'lucide-react';
import { ChatMessage, ProjectDetails } from '../../types/index';
import { streamChatResponse, extractProjectFromChat } from '../../services/geminiService';

interface ChatInterfaceProps {
  onProjectUpdate: (details: Partial<ProjectDetails>) => void;
  project: Partial<ProjectDetails> | null;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ onProjectUpdate, project }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      role: 'ai',
      content: "Welcome to StructurAI. Describe your project to get started (e.g., 'G+2 building in Hyderabad').",
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isStreaming) return;
    const userMsg: ChatMessage = { id: Date.now().toString(), role: 'user', content: input, timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsStreaming(true);

    try {
      let fullResponse = "";
      const aiMsgId = (Date.now() + 1).toString();
      setMessages(prev => [...prev, { id: aiMsgId, role: 'ai', content: '', timestamp: new Date(), isThinking: true }]);
      const stream = streamChatResponse(userMsg.content, project);
      for await (const chunk of stream) {
        fullResponse += chunk;
        setMessages(prev => prev.map(msg => msg.id === aiMsgId ? { ...msg, content: fullResponse, isThinking: false } : msg));
      }
      const historyText = [...messages, userMsg].map(m => `${m.role}: ${m.content}`).join('\n') + `\nAI: ${fullResponse}`;
      const extractedDetails = await extractProjectFromChat(historyText);
      if (Object.keys(extractedDetails).length > 0) onProjectUpdate(extractedDetails);
    } catch (error) {
      console.error("Chat error", error);
    } finally {
      setIsStreaming(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-50">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex w-full ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`flex max-w-[80%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'} items-start gap-3`}>
              <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${msg.role === 'user' ? 'bg-blue-600' : 'bg-emerald-600'}`}>
                {msg.role === 'user' ? <User size={16} className="text-white" /> : <Bot size={16} className="text-white" />}
              </div>
              <div className={`p-4 rounded-2xl shadow-sm text-sm ${msg.role === 'user' ? 'bg-blue-600 text-white rounded-tr-none' : 'bg-white text-slate-700 border rounded-tl-none'}`}>
                {msg.isThinking ? <Loader2 size={16} className="animate-spin text-slate-400" /> : <div className="whitespace-pre-wrap">{msg.content}</div>}
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <div className="p-4 bg-white border-t border-slate-200">
        <div className="flex gap-2 max-w-4xl mx-auto">
          <input type="text" value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSend()} placeholder="Describe project requirements..." className="flex-1 border border-slate-300 rounded-full px-6 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500" />
          <button onClick={handleSend} disabled={!input.trim() || isStreaming} className={`p-3 rounded-full text-white transition-all shadow-md ${!input.trim() || isStreaming ? 'bg-slate-300' : 'bg-blue-600 hover:bg-blue-700'}`}>
            {isStreaming ? <Loader2 size={20} className="animate-spin" /> : <Send size={20} />}
          </button>
        </div>
      </div>
    </div>
  );
};
export default ChatInterface;
