
import React, { useState } from 'react';
import { 
  LayoutDashboard, MessageSquare, HardHat, Calculator, CalendarClock, Settings, LogOut, ChevronDown, ChevronRight, ShoppingCart, FileText, PlusCircle, Crown, Database, Zap, Box, Activity, Briefcase, Link2, Lock, BrainCircuit, Sparkles, View
} from 'lucide-react';
import { ViewState, UserRole } from '../../types/index';

interface SidebarProps {
  currentView: ViewState;
  setView: (view: ViewState) => void;
  projectCreated: boolean;
  onReset: () => void;
  currentProjectType?: string;
  onSwitchTemplate?: (type: any) => void;
  userRole: UserRole;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, setView, projectCreated, onReset, currentProjectType, onSwitchTemplate, userRole }) => {
  const [expanded, setExpanded] = useState<Record<string, boolean>>({ 'engineering': true, 'execution': true, 'commercial': true, 'general': true });
  const toggleGroup = (id: string) => setExpanded(prev => ({ ...prev, [id]: !prev[id] }));

  const menuStructure = [
    { id: 'general', label: 'General', children: [
      { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, view: 'dashboard', roles: ['Admin', 'Engineer', 'Client'] as UserRole[] },
      { id: 'ai-studio', label: 'AI Design Studio', icon: Sparkles, view: 'ai-studio', roles: ['Admin', 'Engineer'] as UserRole[] },
    ]},
    { id: 'engineering', label: 'Engineering', roles: ['Admin', 'Engineer'] as UserRole[], children: [
      { id: 'layout', label: '3D Modeler', icon: View, view: 'layout' },
      { id: 'structure', label: 'Analysis & Design', icon: HardHat, view: 'structure' },
    ]},
    { id: 'commercial', label: 'Commercial', roles: ['Admin', 'Engineer'] as UserRole[], children: [
      { id: 'estimation', label: 'Estimation & BOQ', icon: Calculator, view: 'estimation' },
    ]},
    { id: 'execution', label: 'Construction', children: [
      { id: 'management', label: 'Site Management', icon: CalendarClock, view: 'management', roles: ['Admin', 'Engineer', 'Client'] as UserRole[] },
    ]}
  ];

  const isVisible = (roles: UserRole[] | undefined) => !roles || roles.includes(userRole);

  return (
    <div className="w-64 bg-slate-900 text-white h-screen flex flex-col shadow-xl">
      <div className="p-6 border-b border-slate-700">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">StructurAI</h1>
      </div>
      
      <nav className="flex-1 overflow-y-auto py-4">
        {menuStructure.filter(g => isVisible(g.roles) || g.children?.some(c => isVisible(c.roles))).map((group) => (
          <div key={group.id} className="px-3 mb-2">
            <button onClick={() => toggleGroup(group.id)} className="w-full flex items-center justify-between px-3 mb-2 text-xs font-semibold text-slate-500 uppercase">
              <span>{group.label}</span>
              {expanded[group.id] ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
            </button>
            {expanded[group.id] && (
              <ul className="space-y-1">
                {group.children?.filter(item => isVisible(item.roles)).map((item) => (
                  <li key={item.id}>
                    <button
                      // FIX: Cast item.view to ViewState to resolve type error
                      onClick={() => item.view && setView(item.view as ViewState)}
                      disabled={!projectCreated && !['ai-studio', 'chat', 'portfolio'].includes(item.id)}
                      className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-all group ${
                        currentView === item.view 
                          ? 'bg-slate-800 text-white' 
                          : !projectCreated && !['ai-studio'].includes(item.id)
                            ? 'text-slate-600 cursor-not-allowed'
                            : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                      }`}
                    >
                      {item.icon && <item.icon size={18} />}
                      <span className="font-medium text-sm">{item.label}</span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-700">
        <button onClick={() => setView('settings')} className="flex items-center space-x-3 text-slate-400 hover:text-white w-full px-4 py-2 hover:bg-slate-800 rounded-lg"><Settings size={20} /><span>Settings</span></button>
        <button onClick={onReset} className="flex items-center space-x-3 text-red-400 hover:text-red-300 w-full px-4 py-2 mt-1 hover:bg-slate-800 rounded-lg"><LogOut size={20} /><span>Reset App</span></button>
      </div>
    </div>
  );
};

export default Sidebar;
