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
  Crown
} from 'lucide-react';
import { ViewState } from '../types';

interface SidebarProps {
  currentView: ViewState;
  setView: (view: ViewState) => void;
  projectCreated: boolean;
  onReset: () => void;
}

interface MenuItem {
  id: string;
  label: string;
  icon?: React.ElementType;
  view?: ViewState;
  children?: MenuItem[];
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, setView, projectCreated, onReset }) => {
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
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, view: 'dashboard' },
        { id: 'chat', label: 'AI Consultant', icon: MessageSquare, view: 'chat' },
        { id: 'reports', label: 'Reports', icon: FileText, view: 'reports' }
      ]
    },
    { 
      id: 'engineering', 
      label: 'Engineering', 
      children: [
        { id: 'layout', label: 'Layouts', icon: Ruler, view: 'layout' },
        { id: 'structure', label: 'Structural Design', icon: HardHat, view: 'structure' },
      ]
    },
    { 
      id: 'commercial', 
      label: 'Commercial', 
      children: [
        { id: 'estimation', label: 'Estimation & BOQ', icon: Calculator, view: 'estimation' },
        { id: 'procurement', label: 'Procurement', icon: ShoppingCart, view: 'procurement' },
      ]
    },
    { 
      id: 'execution', 
      label: 'Construction', 
      children: [
        { id: 'management', label: 'Site Management', icon: CalendarClock, view: 'management' },
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
          onClick={onReset}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-lg flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-900/20 active:scale-95"
        >
          <PlusCircle size={18} />
          <span className="font-semibold">New Project</span>
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto py-2">
        <div className="space-y-4 px-3">
          {menuStructure.map((group) => (
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
                  {group.children?.map((item) => (
                    <li key={item.id}>
                      <button
                        onClick={() => handleItemClick(item)}
                        disabled={!projectCreated && item.id !== 'chat'}
                        className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-all duration-200 group
                          ${currentView === item.view 
                            ? 'bg-slate-800 text-white shadow-md border-l-2 border-blue-500' 
                            : !projectCreated && item.id !== 'chat'
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
          className="flex items-center space-x-3 text-red-400 hover:text-red-300 transition-colors w-full px-4 py-2 mt-1 hover:bg-slate-800 rounded-lg">
          <LogOut size={20} />
          <span>Reset App</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;