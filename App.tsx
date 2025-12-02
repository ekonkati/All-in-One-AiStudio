
import React, { useState, useEffect } from 'react';
import Sidebar from './components/sidebar/Sidebar';
import ChatInterface from './components/chat/ChatInterface';
import ProjectDashboard from './components/dashboard/ProjectDashboard';
import ModelEditor from './components/modeler/ModelEditor';
import StructuralAnalysis from './components/analysis/StructuralAnalysis';
import EstimationView from './components/estimation/EstimationView';
import ProjectManagement from './components/management/ProjectManagement';
import Procurement from './components/commercial/Procurement';
import Reports from './components/general/Reports';
import Settings from './components/general/Settings';
import Subscription from './components/general/Subscription';
import DataExchange from './components/general/DataExchange';
import Portfolio from './components/dashboard/Portfolio';
import Auth from './components/auth/Auth';
import OptimizationCenter from './components/general/OptimizationCenter';
import GlobalSearch from './components/general/GlobalSearch';
import AiDesignStudio from './components/general/AiDesignStudio';
import { ViewState, ProjectDetails, UserRole, StructuralMember, ActionCost } from './types/index';
import Header from './components/common/Header';
import { generateStructuralMembers, updateMemberProperty, getActionCosts } from './services/calculationService';
import ConfirmationModal from './components/common/ConfirmationModal';


const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentView, setCurrentView] = useState<ViewState>('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [currentUserRole, setCurrentUserRole] = useState<UserRole>('Engineer');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [tokenBalance, setTokenBalance] = useState(5000);
  const [actionToConfirm, setActionToConfirm] = useState<{ action: () => void; costKey: keyof ActionCost } | null>(null);
  
  const actionCosts = getActionCosts();
  
  const initialStartDate = new Date();
  initialStartDate.setDate(initialStartDate.getDate() - 42); 

  const demoProject: Partial<ProjectDetails> = {
    id: 'PRJ-2024-884',
    name: 'G+3 Commercial Complex',
    type: 'RCC',
    location: 'Hyderabad, Hitech City',
    dimensions: { length: 60, width: 40 },
    stories: 4,
    soilType: 'Medium Stiff Clay',
    status: 'Construction',
    startDate: initialStartDate.toISOString(),
    createdAt: initialStartDate.toISOString()
  };

  const [project, setProject] = useState<Partial<ProjectDetails> | null>(demoProject);
  
  const [structuralMembers, setStructuralMembers] = useState<StructuralMember[]>([]);
  const [selectedMemberId, setSelectedMemberId] = useState<string | null>(null);

  useEffect(() => {
    if (project) {
        setStructuralMembers(generateStructuralMembers(project));
        setSelectedMemberId(null);
    } else {
        setStructuralMembers([]);
    }
  }, [project]);

  const handleUpdateMember = (id: string, newProps: Partial<StructuralMember>) => {
      const updatedMember = updateMemberProperty(structuralMembers.find(m => m.id === id)!, newProps);
      setStructuralMembers(prevMembers => 
        prevMembers.map(m => m.id === id ? updatedMember : m)
      );
  };

  const handleActionRequest = (action: () => void, costKey: keyof ActionCost) => {
    const cost = actionCosts[costKey];
    if (tokenBalance >= cost) {
      setActionToConfirm({ action, costKey });
    } else {
      alert("Insufficient credits. Please upgrade your plan.");
      setCurrentView('subscription');
    }
  };

  const confirmAction = () => {
    if (actionToConfirm) {
      const cost = actionCosts[actionToConfirm.costKey];
      setTokenBalance(prev => prev - cost);
      actionToConfirm.action();
    }
    cancelAction();
  };

  const cancelAction = () => {
    setActionToConfirm(null);
  };

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

  (window as any).toggleSidebar = () => setIsSidebarOpen(true);

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
        return project ? (
            <ModelEditor 
                project={project} 
                members={structuralMembers}
                selectedMemberId={selectedMemberId}
                onSelectMember={setSelectedMemberId}
                onUpdateMember={handleUpdateMember}
                onRunAnalysis={() => handleActionRequest(() => setCurrentView('structure'), 'analysisRun')}
            />
        ) : null;
      case 'structure':
        return project ? <StructuralAnalysis project={project} onChangeView={setCurrentView} onActionRequest={handleActionRequest} /> : null;
      case 'connections':
        return project ? <StructuralAnalysis project={project} onChangeView={setCurrentView} initialTab="connections" onActionRequest={handleActionRequest} /> : null;
      case 'estimation':
        return project ? <EstimationView project={project} onChangeView={setCurrentView} /> : null;
      case 'procurement':
        return project ? <Procurement project={project} /> : null;
      case 'management':
        return project ? <ProjectManagement project={project} onChangeView={setCurrentView} initialTab="execution" onActionRequest={handleActionRequest} /> : null;
      case 'digital-twin':
        return project ? <ProjectManagement project={project} onChangeView={setCurrentView} initialTab="monitoring" onActionRequest={handleActionRequest} /> : null;
      case 'closure':
        return project ? <ProjectManagement project={project} onChangeView={setCurrentView} initialTab="closure" onActionRequest={handleActionRequest} /> : null;
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
      {actionToConfirm && <ConfirmationModal cost={actionCosts[actionToConfirm.costKey]} onConfirm={confirmAction} onCancel={cancelAction} />}
      <GlobalSearch 
        isOpen={isSearchOpen} 
        onClose={() => setIsSearchOpen(false)} 
        project={project}
        onNavigate={(view) => {
            setCurrentView(view);
            setIsSearchOpen(false);
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
            tokenBalance={tokenBalance}
            onUpgradeClick={() => setCurrentView('subscription')}
        />

        <main className="flex-1 overflow-hidden relative">
            {renderView()}
        </main>
      </div>
    </div>
  );
};

export default App;
