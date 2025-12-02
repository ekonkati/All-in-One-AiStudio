

import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import ChatInterface from './components/ChatInterface';
import ProjectDashboard from './components/ProjectDashboard';
import LayoutViewer from './components/LayoutViewer';
import StructuralAnalysis from './components/StructuralAnalysis';
import EstimationView from './components/EstimationView';
import ProjectManagement from './components/ProjectManagement';
import Procurement from './components/commercial/Procurement';
import Reports from './components/general/Reports';
import Settings from './components/general/Settings';
import Subscription from './components/general/Subscription';
import DataExchange from './components/general/DataExchange';
import Portfolio from './components/dashboard/Portfolio';
import Auth from './components/Auth';
import OptimizationCenter from './components/general/OptimizationCenter';
import GlobalSearch from './components/general/GlobalSearch';
import AiDesignStudio from './components/general/AiDesignStudio';
import { ViewState, ProjectDetails, UserRole } from './types';
import { Menu, Search } from 'lucide-react';

// New Header Component for User Role Switching
const Header: React.FC<{ 
    userRole: UserRole, 
    setUserRole: (role: UserRole) => void,
    onSearchClick: () => void 
}> = ({ userRole, setUserRole, onSearchClick }) => {
    return (
        <div className="bg-white border-b border-slate-200 p-4 flex items-center justify-between flex-shrink-0">
            <div className="flex items-center">
                <button onClick={() => (window as any).toggleSidebar()} className="mr-4 text-slate-600 lg:hidden">
                    <Menu size={24} />
                </button>
                <span className="font-bold text-slate-800 lg:hidden">StructurAI</span>
            </div>

            <div className="flex-1 flex justify-center px-4">
                <button 
                    onClick={onSearchClick}
                    className="w-full max-w-lg bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 flex items-center justify-between text-slate-500 hover:bg-slate-100 hover:border-slate-300 transition-colors"
                >
                    <div className="flex items-center gap-2">
                        <Search size={16} />
                        <span className="text-sm">Search members, documents, actions...</span>
                    </div>
                    <span className="text-xs border border-slate-300 rounded px-1.5 py-0.5">Ctrl K</span>
                </button>
            </div>

            <div className="flex items-center gap-4">
                <span className="text-sm text-slate-500 hidden md:block">Viewing as:</span>
                 <select 
                    value={userRole} 
                    onChange={(e) => setUserRole(e.target.value as UserRole)}
                    className="bg-slate-100 border border-slate-200 rounded-md px-3 py-1 text-sm font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                     <option value="Engineer">Engineer</option>
                     <option value="Client">Client</option>
                     <option value="Admin">Admin</option>
                 </select>
            </div>
        </div>
    );
};

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentView, setCurrentView] = useState<ViewState>('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [currentUserRole, setCurrentUserRole] = useState<UserRole>('Engineer');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  
  // App State - Seeded with realistic data for preview
  const initialStartDate = new Date();
  initialStartDate.setDate(initialStartDate.getDate() - 42); 

  const demoProject: Partial<ProjectDetails> = {
    id: 'PRJ-2024-884',
    name: 'G+3 Commercial Complex',
    type: 'RCC',
    location: 'Hyderabad, Hitech City',
    dimensions: { length: 60, width: 40 }, // 2400 sft footprint
    stories: 4,
    soilType: 'Medium Stiff Clay',
    status: 'Construction',
    startDate: initialStartDate.toISOString(),
    createdAt: initialStartDate.toISOString()
  };

  const [project, setProject] = useState<Partial<ProjectDetails> | null>(demoProject);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);


  // Expose sidebar toggle to global scope for header button
  (window as any).toggleSidebar = () => setIsSidebarOpen(true);

  // Template System Logic (Part 12)
  const switchTemplate = (type: any) => {
      let newDetails: Partial<ProjectDetails> = {
          id: `PRJ-${new Date().getFullYear()}-${Math.floor(Math.random()*1000)}`,
          type: type,
          status: 'Concept',
          startDate: new Date().toISOString(),
          createdAt: new Date().toISOString()
      };

      if (type === 'PEB') {
          newDetails = { ...newDetails, name: 'Industrial Warehouse (PEB)', location: 'Industrial Area, Pune', dimensions: { length: 120, width: 60 }, stories: 1, soilType: 'Hard Rock' };
      } else if (type === 'Retaining Wall') {
          newDetails = { ...newDetails, name: 'Cantilever Retaining Wall', location: 'Hill Road, Shimla', dimensions: { length: 100, width: 15 }, stories: 1, soilType: 'Loose Soil' };
      } else if (type === 'Water Tank') {
          newDetails = { ...newDetails, name: 'Overhead Water Tank (200KL)', location: 'Municipal Park, Delhi', dimensions: { length: 30, width: 15 }, stories: 1, soilType: 'Sandy Soil' };
      } else if (type === 'Landfill') {
          newDetails = { ...newDetails, name: 'Municipal Solid Waste Cell 1', location: 'Dump Yard, outskirts', dimensions: { length: 200, width: 150 }, stories: 1, soilType: 'Compacted Clay' };
      } else {
          newDetails = { ...newDetails, name: 'G+3 Residential Apt', location: 'Hyderabad, Jubilee Hills', dimensions: { length: 60, width: 40 }, stories: 4, soilType: 'Medium Stiff Clay' };
      }
      setProject(newDetails);
      setCurrentView('dashboard');
  };

  const handleProjectUpdate = (details: Partial<ProjectDetails>) => {
    const newStatus = details.type && details.dimensions ? 'Concept' : 'Concept';
    setProject(prev => ({ 
      ...prev, 
      ...details,
      id: prev?.id || `PRJ-${new Date().getFullYear()}-${Math.floor(Math.random()*1000)}`,
      status: prev?.status || newStatus,
      startDate: prev?.startDate || new Date().toISOString()
    }));
  };

  const handleReset = () => {
    setProject(null);
    setCurrentView('ai-studio');
    if(window.innerWidth < 1024) setIsSidebarOpen(false);
  };

  const hasProject = !!(project && project.type);

  const renderView = () => {
    switch (currentView) {
      case 'dashboard':
        return project ? <ProjectDashboard project={project} onChangeView={setCurrentView} /> : <AiDesignStudio onProjectCreated={handleProjectUpdate} setView={setCurrentView} />;
      case 'portfolio':
        return <Portfolio />;
      case 'chat':
        return <ChatInterface onProjectUpdate={handleProjectUpdate} project={project} />;
      case 'layout':
        return project ? <LayoutViewer project={project} onChangeView={setCurrentView} /> : null;
      case 'structure':
        return project ? <StructuralAnalysis project={project} onChangeView={setCurrentView} /> : null;
      case 'connections':
        return project ? <StructuralAnalysis project={project} onChangeView={setCurrentView} initialTab="connections" /> : null;
      case 'estimation':
        return project ? <EstimationView project={project} onChangeView={setCurrentView} /> : null;
      case 'procurement':
        return project ? <Procurement project={project} /> : null;
      case 'management':
        return project ? <ProjectManagement project={project} onChangeView={setCurrentView} initialTab="execution" /> : null;
      case 'digital-twin':
        return project ? <ProjectManagement project={project} onChangeView={setCurrentView} initialTab="monitoring" /> : null;
      case 'closure':
        return project ? <ProjectManagement project={project} onChangeView={setCurrentView} initialTab="closure" /> : null;
      case 'reports':
        return project ? <Reports project={project} /> : null;
      case 'settings':
        return <Settings />;
      case 'subscription':
        return <Subscription />;
      case 'data-exchange':
        return <DataExchange />;
      case 'optimization-center':
        return project ? <OptimizationCenter project={project} /> : null;
      case 'ai-studio':
        return <AiDesignStudio onProjectCreated={handleProjectUpdate} setView={setCurrentView} />;
      default:
        return <ChatInterface onProjectUpdate={handleProjectUpdate} project={project} />;
    }
  };

  if (!isAuthenticated) {
    return <Auth onLogin={() => setIsAuthenticated(true)} />;
  }

  return (
    <div className="flex h-screen overflow-hidden bg-slate-100">
      <GlobalSearch 
        isOpen={isSearchOpen} 
        onClose={() => setIsSearchOpen(false)} 
        project={project}
        onNavigate={(view) => {
            setCurrentView(view);
        }}
      />

      <div className={`fixed inset-0 bg-black/50 z-20 lg:hidden ${isSidebarOpen ? 'block' : 'hidden'}`} onClick={() => setIsSidebarOpen(false)} />
      
      <div className={`fixed lg:static z-30 transition-transform duration-300 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <Sidebar 
            currentView={currentView} 
            setView={(view) => {
                setCurrentView(view);
                if(window.innerWidth < 1024) setIsSidebarOpen(false);
            }} 
            projectCreated={hasProject}
            onReset={handleReset}
            currentProjectType={project?.type}
            onSwitchTemplate={switchTemplate}
            userRole={currentUserRole}
        />
      </div>

      <div className="flex-1 flex flex-col min-w-0">
        <Header 
            userRole={currentUserRole} 
            setUserRole={setCurrentUserRole} 
            onSearchClick={() => setIsSearchOpen(true)}
        />

        <main className="flex-1 overflow-hidden relative">
            {renderView()}
        </main>
      </div>
    </div>
  );
};

export default App;