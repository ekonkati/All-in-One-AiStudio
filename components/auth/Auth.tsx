import React, { useState } from 'react';
import { Mail, Lock, ArrowRight, Building, CheckCircle2 } from 'lucide-react';

interface AuthProps { onLogin: () => void; }

const Auth: React.FC<AuthProps> = ({ onLogin }) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => { setIsLoading(false); onLogin(); }, 1000);
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col md:flex-row">
      <div className="w-full md:w-1/2 p-8 md:p-16 flex flex-col justify-center text-white relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-blue-600 p-2 rounded-lg"><Building size={32} /></div>
            <h1 className="text-3xl font-bold tracking-tight">StructurAI</h1>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">The Future of <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">Intelligent Construction</span></h2>
          <p className="text-slate-400 text-lg mb-8 max-w-md leading-relaxed">From concept to commissioning. Analyze structures, estimate costs, and manage sites with a single AI-powered ecosystem.</p>
        </div>
      </div>
      <div className="w-full md:w-1/2 bg-white flex flex-col justify-center items-center p-6">
        <div className="w-full max-w-md">
           <div className="text-center mb-8"><h3 className="text-2xl font-bold text-slate-900">Sign in to your account</h3><p className="text-slate-500 mt-2">Enter your details to access your projects</p></div>
           <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                 <label className="block text-sm font-medium text-slate-700 mb-1">Work Email</label>
                 <div className="relative"><Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" /><input type="email" defaultValue="demo@structur.ai" className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all" required/></div>
              </div>
              <div>
                 <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
                 <div className="relative"><Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" /><input type="password" defaultValue="password" className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all" required/></div>
              </div>
              <button type="submit" disabled={isLoading} className="w-full bg-slate-900 text-white py-3 rounded-lg font-semibold hover:bg-slate-800 transition-all flex items-center justify-center gap-2 group disabled:opacity-70 disabled:cursor-not-allowed">
                {isLoading ? 'Authenticating...' : 'Sign In'}
                {!isLoading && <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />}
              </button>
           </form>
        </div>
      </div>
    </div>
  );
};
export default Auth;
