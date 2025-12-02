

import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  MessageSquare, 
  Ruler, 
  HardHat, 
  Calculator, 
  CalendarClock,
  Settings,
  LogOut,
  ChevronDown,
  ChevronRight,
  ShoppingCart,
  FileText,
  PlusCircle,
  Crown,
  Database,
  Zap,
  Box,
  Activity,
  Briefcase,
  Link2,
  Lock,
  BrainCircuit,
  Sparkles,
  View
} from 'lucide-react';
import { ViewState, ProjectDetails, UserRole } from '../../types/index';

interface SidebarProps {
  currentView: ViewState;
  setView: (view: ViewState) => void;
  projectCreated: boolean;
  onReset: () => void;
  currentProjectType?: string;
  onSwitchTemplate?: (type: any) => void;
  userRole: UserRole;
}

interface MenuItem {
  id: string;
  label: string;
  icon?: React.ElementType;
  view?: ViewState;
  children?: MenuItem[];
  roles?: UserRole[]; // Which roles can see this
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, setView, projectCreated, onReset, currentProjectType, onSwitchTemplate, userRole }) => {
  const [expanded, setExpanded] = useState<Record<string, boolean>>({
    'engineering': true,
    'execution': true,
    'commercial': true,
    'general': true
  });

  const toggleGroup = (id: string) => {
    setExpanded(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const menuStructure: MenuItem[] = [
    { 
      id: 'general', 
      label: 'General', 
      children: [
        { id: 'portfolio', label: 'Portfolio', icon: Briefcase, view: 'portfolio', roles: ['Admin', 'Engineer'] },
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, view: 'dashboard', roles: ['Admin', 'Engineer', 'Client'] },
        { id: 'chat', label: 'AI Consultant', icon: MessageSquare, view: 'chat', roles: ['Admin', 'Engineer'] },
        { id: 'optimization', label: 'AI Optimization', icon: BrainCircuit, view: 'optimization-center', roles: ['Admin', 'Engineer'] },
        { id: 'reports', label: 'Reports', icon: FileText, view: 'reports', roles: ['Admin', 'Engineer', 'Client'] },
        { id: 'exchange', label: 'Data Exchange', icon: Database, view: 'data-exchange', roles: ['Admin', 'Engineer'] }
      ]
    },
    { 
      id: 'engineering', 
      label: 'Engineering', 
      roles: ['Admin', 'Engineer'],
      children: [
        { id: 'layout', label: '3D Modeler', icon: View, view: 'layout' },
        { id: 'structure', label: 'Structural Design', icon: HardHat, view: 'structure' },
        { id: 'connections', label: 'Connections', icon: Link2, view: 'connections' },
        { id: 'loads', label: 'Load Engine', icon: Zap, view: 'structure' },
      ]
    },
    { 
      id: 'commercial', 
      label: 'Commercial', 
      roles: ['Admin', 'Engineer'],
      children: [
        { id: 'estimation', label: 'Estimation & BOQ', icon: Calculator, view: 'estimation' },
        { id: 'procurement', label: 'Procurement', icon: ShoppingCart, view: 'procurement' },
      ]
    },
    { 
      id: 'execution', 
      label: 'Construction', 
      children: [
        { id: 'management', label: 'Site Management', icon: CalendarClock, view: 'management', roles: ['Admin', 'Engineer', 'Client'] },
        { id: 'monitor', label: 'Digital Twin', icon: Activity, view: 'digital-twin', roles: ['Admin', 'Engineer', 'Client'] },
        { id: 'closure', label: 'Project Closure', icon: Lock, view: 'closure', roles: ['Admin', 'Engineer'] },
      ]
    }
  ];

  const handleItemClick = (item: MenuItem) => {
    if (item.view) {
      setView(item.view);
    } else if (item.children) {
      toggleGroup(item.id);
    }
  };

  const isVisible = (roles: UserRole[] | undefined) => !roles || roles.includes(userRole);

  return (
    <div className="w-64 bg-slate-900 text-white h-screen flex flex-col shadow-xl flex-shrink-0 z-50">
      <div className="p-6 border-b border-slate-700">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent cursor-pointer" onClick={() => projectCreated && setView('dashboard')}>
          StructurAI
        </h1>
        <p className="text-xs text-slate-400 mt-1">End-to-End Engineering</p>
      </div>

      <div className="p-4 space-y-3">
        <button 
          onClick={() => setView('ai-studio')}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-lg flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-900/20 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={userRole === 'Client'}
        >
          <Sparkles size={18} />
          <span className="font-semibold">AI Design Studio</span>
        </button>
        
        {projectCreated && onSwitchTemplate && userRole !== 'Client' && (
           <div className="bg-slate-800 p-3 rounded-lg border border-slate-700">
              <label className="text-[10px] text-slate-400 uppercase font-bold mb-2 block flex items-center gap-1">
                 <Box size={10} /> Active Template
              </label>
              <select 
                value={currentProjectType} 
                onChange={(e) => onSwitchTemplate(e.target.value)}
                className="w-full bg-slate-900 text-white text-xs p-2 rounded border border-slate-600 focus:ring-1 focus:ring-blue-500 outline-none"
              >
                 <option value="RCC">RCC Building</option>
                 <option value="PEB">PEB Warehouse</option>
                 <option value="Retaining Wall">Retaining Wall</option>
                 <option value="Water Tank">Water Tank</option>
                 <option value="Landfill">Landfill Cell</option>
              </select>
           </div>
        )}
      </div>

      <nav className="flex-1 overflow-y-auto py-2">
        <div className="space-y-4 px-3">
          {menuStructure.filter(g => isVisible(g.roles) || g.children?.some(c => isVisible(c.roles))).map((group) => (
            <div key={group.id} className="mb-2">
              <button 
                onClick={() => toggleGroup(group.id)}
                className="w-full flex items-center justify-between px-3 mb-2 text-xs font-semibold text-slate-500 uppercase tracking-wider hover:text-slate-300 transition-colors"
              >
                <span>{group.label}</span>
                {expanded[group.id] ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
              </button>
              
              {expanded[group.id] && (
                <ul className="space-y-1 animate-in slide-in-from-left-2 duration-200">
                  {group.children?.filter(item => isVisible(item.roles)).map((item) => (
                    <li key={item.id}>
                      <button
                        onClick={() => handleItemClick(item)}
                        disabled={!projectCreated && !['chat', 'portfolio', 'ai-studio'].includes(item.id)}
                        className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-all duration-200 group
                          ${currentView === item.view 
                            ? 'bg-slate-800 text-white shadow-md border-l-2 border-blue-500' 
                            : !projectCreated && !['chat', 'portfolio', 'ai-studio'].includes(item.id)
                              ? 'text-slate-600 cursor-not-allowed'
                              : 'text-slate-400 hover:bg-slate-800 hover:text-white'}
                        `}
                      >
                        {item.icon && <item.icon size={18} className={`${currentView === item.view ? 'text-blue-400' : 'text-slate-500 group-hover:text-white'} transition-colors`} />}
                        <span className="font-medium text-sm">{item.label}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      </nav>

      {/* Subscription Banner */}
      <div className="px-4 pb-4">
        <button 
          onClick={() => setView('subscription')}
          className="w-full bg-gradient-to-r from-violet-600 to-indigo-600 p-3 rounded-xl shadow-lg flex items-center justify-between hover:scale-[1.02] transition-transform"
        >
          <div className="flex items-center gap-2">
            <Crown size={18} className="text-yellow-300" />
            <div className="text-left">
              <p className="text-xs font-bold text-white">Upgrade Plan</p>
              <p className="text-[10px] text-indigo-100">Unlock Enterprise</p>
            </div>
          </div>
          <ChevronRight size={14} className="text-white/70" />
        </button>
      </div>

      <div className="p-4 border-t border-slate-700">
        <button 
          onClick={() => setView('settings')}
          className={`flex items-center space-x-3 text-slate-400 hover:text-white transition-colors w-full px-4 py-2 hover:bg-slate-800 rounded-lg ${currentView === 'settings' ? 'bg-slate-800 text-white' : ''}`}>
          <Settings size={20} />
          <span>Settings</span>
        </button>
        <button 
          onClick={onReset}
          className="flex items-center space-x-3 text-red-400 hover:text-red-300 transition-colors w-full px-4 py-2 mt-1 hover:bg-slate-800 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={userRole === 'Client'}
        >
          <LogOut size={20} />
          <span>Reset App</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
