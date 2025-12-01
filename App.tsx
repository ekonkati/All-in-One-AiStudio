
import React, { useState } from 'react';
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
import { ViewState, ProjectDetails } from './types';
import { Menu } from 'lucide-react';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewState>('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  
  // App State - Seeded with realistic data for preview
  // Seed start date to 6 weeks ago so the schedule has progress
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

  const handleProjectUpdate = (details: Partial<ProjectDetails>) => {
    // Determine status based on completeness
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
    setCurrentView('chat');
    if(window.innerWidth < 1024) setIsSidebarOpen(false);
  };

  const hasProject = !!(project && project.type);

  const renderView = () => {
    switch (currentView) {
      case 'dashboard':
        return project ? <ProjectDashboard project={project} onChangeView={setCurrentView} /> : null;
      case 'chat':
        return <ChatInterface onProjectUpdate={handleProjectUpdate} project={project} />;
      case 'layout':
        return project ? <LayoutViewer project={project} onChangeView={setCurrentView} /> : null;
      case 'structure':
        return project ? <StructuralAnalysis project={project} onChangeView={setCurrentView} /> : null;
      case 'estimation':
        return project ? <EstimationView project={project} onChangeView={setCurrentView} /> : null;
      case 'procurement':
        return project ? <Procurement project={project} /> : null;
      case 'management':
        return project ? <ProjectManagement project={project} /> : null;
      case 'reports':
        return project ? <Reports project={project} /> : null;
      case 'settings':
        return <Settings />;
      case 'subscription':
        return <Subscription />;
      default:
        return <ChatInterface onProjectUpdate={handleProjectUpdate} project={project} />;
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-slate-100">
      {/* Mobile Sidebar Toggle */}
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
        />
      </div>

      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile Header */}
        <div className="bg-white border-b border-slate-200 p-4 flex items-center lg:hidden">
            <button onClick={() => setIsSidebarOpen(true)} className="mr-4 text-slate-600">
                <Menu size={24} />
            </button>
            <span className="font-bold text-slate-800">StructuraAI</span>
        </div>

        {/* Main Content */}
        <main className="flex-1 overflow-hidden relative">
            {renderView()}
        </main>
      </div>
    </div>
  );
};

export default App;