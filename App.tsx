
import React, { useState, useEffect } from 'react';
import Sidebar from './components/sidebar/Sidebar';
import Auth from './components/auth/Auth';
import Header from './components/common/Header';
import GlobalSearch from './components/general/GlobalSearch';
import { ViewState, ProjectDetails, UserRole, Node, Member, SelectedEntity, Support, Material, Section, LoadCase, StructuralLoad, LoadCombination, Plate, AnalysisResults } from './types/index';
import { generateStructuralModel, handleModelAction, globalSearch as performSearch } from './services/calculationService';

// Lazy load components for better performance
const AiDesignStudio = React.lazy(() => import('./components/general/AiDesignStudio'));
const ProjectDashboard = React.lazy(() => import('./components/dashboard/ProjectDashboard'));
const ModelerLayout = React.lazy(() => import('./components/modeler/ModelerLayout'));
const StructuralAnalysis = React.lazy(() => import('./components/analysis/StructuralAnalysis'));
const EstimationView = React.lazy(() => import('./components/estimation/EstimationView'));
const ProjectManagement = React.lazy(() => import('./components/management/ProjectManagement'));
const Procurement = React.lazy(() => import('./components/commercial/Procurement'));
const Reports = React.lazy(() => import('./components/general/Reports'));
const Settings = React.lazy(() => import('./components/general/Settings'));
const Subscription = React.lazy(() => import('./components/general/Subscription'));
const DataExchange = React.lazy(() => import('./components/general/DataExchange'));
const Portfolio = React.lazy(() => import('./components/dashboard/Portfolio'));
const OptimizationCenter = React.lazy(() => import('./components/general/OptimizationCenter'));


const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentView, setCurrentView] = useState<ViewState>('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [currentUserRole, setCurrentUserRole] = useState<UserRole>('Engineer');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  
  const initialStartDate = new Date();
  initialStartDate.setDate(initialStartDate.getDate() - 42); 

  const [project, setProject] = useState<Partial<ProjectDetails> | null>({
    id: 'PRJ-2024-884',
    name: 'G+3 Commercial Complex',
    type: 'RCC',
    location: 'Hyderabad, Hitech City',
    dimensions: { length: 20, width: 15 },
    stories: 4,
    soilType: 'Medium Stiff Clay',
    status: 'Modeling',
    startDate: initialStartDate.toISOString(),
    createdAt: initialStartDate.toISOString()
  });
  
  // STAAD-like UDM state
  const [nodes, setNodes] = useState<Node[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [plates, setPlates] = useState<Plate[]>([]);
  const [supports, setSupports] = useState<Support[]>([]);
  const [materials, setMaterials] = useState<Material[]>([]);
  const [sections, setSections] = useState<Section[]>([]);
  const [loadCases, setLoadCases] = useState<LoadCase[]>([]);
  const [loads, setLoads] = useState<StructuralLoad[]>([]);
  const [loadCombinations, setLoadCombinations] = useState<LoadCombination[]>([]);
  const [selectedEntity, setSelectedEntity] = useState<SelectedEntity | null>(null);
  const [analysisResults, setAnalysisResults] = useState<AnalysisResults | null>(null);

  useEffect(() => {
    if (project) {
        const model = generateStructuralModel(project);
        setNodes(model.nodes);
        setMembers(model.members);
        setPlates(model.plates);
        setSupports(model.supports);
        setMaterials(model.materials);
        setSections(model.sections);
        setLoadCases(model.loadCases);
        setLoads(model.loads);
        setLoadCombinations(model.loadCombinations);
        setSelectedEntity(null);
        setAnalysisResults(null); // Reset analysis on project change
    } else {
        // Clear all model data
        setNodes([]); setMembers([]); setPlates([]); setSupports([]);
        setMaterials([]); setSections([]); setLoadCases([]); setLoads([]);
        setLoadCombinations([]);
    }
  }, [project]);

  const onModelAction = (action: string, payload: any) => {
    const newState = handleModelAction({ nodes, members, supports, loads, plates }, action, payload);
    setNodes(newState.nodes);
    setMembers(newState.members);
    setSupports(newState.supports);
    setLoads(newState.loads);
    setPlates(newState.plates);
  };
  
  const onModelUpdate = (updates: any) => {
    if (updates.members) setMembers(updates.members);
    if (updates.nodes) setNodes(updates.nodes);
    if (updates.plates) setPlates(updates.plates);
    if (updates.supports) setSupports(updates.supports);
    if (updates.analysisResults) setAnalysisResults(updates.analysisResults);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') { e.preventDefault(); setIsSearchOpen(true); }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  (window as any).toggleSidebar = () => setIsSidebarOpen(prevState => !prevState);

  const switchTemplate = (type: any) => {
      let newDetails: Partial<ProjectDetails> = { id: `PRJ-${new Date().getFullYear()}-${Math.floor(Math.random()*1000)}`, type: type, status: 'Concept', startDate: new Date().toISOString(), createdAt: new Date().toISOString() };
      if (type === 'PEB') newDetails = { ...newDetails, name: 'Industrial Warehouse (PEB)', location: 'Industrial Area, Pune', dimensions: { length: 120, width: 60 }, stories: 1, soilType: 'Hard Rock' };
      else if (type === 'Retaining Wall') newDetails = { ...newDetails, name: 'Cantilever Retaining Wall', location: 'Hill Road, Shimla', dimensions: { length: 100, width: 15 }, stories: 1, soilType: 'Loose Soil' };
      else newDetails = { ...newDetails, name: 'G+3 Residential Apt', location: 'Hyderabad, Jubilee Hills', dimensions: { length: 20, width: 15 }, stories: 4, soilType: 'Medium Stiff Clay' };
      setProject(newDetails);
      setCurrentView('dashboard');
  };

  const handleProjectUpdate = (details: Partial<ProjectDetails>) => {
    setProject(prev => ({ 
      ...prev, ...details,
      id: prev?.id || `PRJ-${new Date().getFullYear()}-${Math.floor(Math.random()*1000)}`,
      status: 'Modeling', startDate: prev?.startDate || new Date().toISOString()
    }));
    setCurrentView('layout');
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
        return hasProject ? <ProjectDashboard project={project!} onChangeView={setCurrentView} /> : <AiDesignStudio onProjectCreated={handleProjectUpdate} setView={setCurrentView} />;
      case 'portfolio': return <Portfolio />;
      case 'layout':
        return hasProject ? (
            <ModelerLayout
                project={project!} nodes={nodes} members={members} plates={plates}
                supports={supports} materials={materials} sections={sections}
                loadCases={loadCases} loads={loads} loadCombinations={loadCombinations}
                selectedEntity={selectedEntity} onSelectEntity={setSelectedEntity}
                onModelAction={onModelAction} onModelUpdate={onModelUpdate}
                analysisResults={analysisResults}
            />
        ) : null;
      case 'structure':
        // FIX: Removed incorrect 'model' and 'onModelUpdate' props which are not defined in StructuralAnalysisProps
        return hasProject ? <StructuralAnalysis project={project!} /> : null;
      case 'estimation': return hasProject ? <EstimationView project={project!} /> : null;
      case 'management': return hasProject ? <ProjectManagement project={project!} onChangeView={setCurrentView} /> : null;
      case 'procurement': return hasProject ? <Procurement project={project!} /> : null;
      case 'reports': return hasProject ? <Reports project={project!} /> : null;
      case 'settings': return <Settings />;
      case 'subscription': return <Subscription />;
      case 'data-exchange': return <DataExchange />;
      case 'optimization-center': return hasProject ? <OptimizationCenter project={project!} /> : null;
      case 'ai-studio': return <AiDesignStudio onProjectCreated={handleProjectUpdate} setView={setCurrentView} />;
      default: return hasProject ? <ProjectDashboard project={project!} onChangeView={setCurrentView} /> : <AiDesignStudio onProjectCreated={handleProjectUpdate} setView={setCurrentView} />;
    }
  };

  if (!isAuthenticated) return <Auth onLogin={() => setIsAuthenticated(true)} />;

  return (
    <div className="flex h-screen overflow-hidden bg-slate-100">
      {/* FIX: Passed the required 'project' prop to GlobalSearch */}
      <GlobalSearch isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} project={project} onNavigate={(view) => { setCurrentView(view); setIsSearchOpen(false); }} />
      <div className={`fixed inset-0 bg-black/50 z-20 lg:hidden ${isSidebarOpen ? 'block' : 'hidden'}`} onClick={() => setIsSidebarOpen(false)} />
      <div className={`fixed lg:static z-30 transition-transform duration-300 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <Sidebar currentView={currentView} setView={(view) => { setCurrentView(view); if(window.innerWidth < 1024) setIsSidebarOpen(false); }} projectCreated={hasProject} onReset={handleReset} onSwitchTemplate={switchTemplate} userRole={currentUserRole} />
      </div>
      <div className="flex-1 flex flex-col min-w-0">
        <Header userRole={currentUserRole} setUserRole={setCurrentUserRole} onSearchClick={() => setIsSearchOpen(true)} />
        <main className="flex-1 overflow-hidden relative">
            <React.Suspense fallback={<div className="flex items-center justify-center h-full text-slate-500">Loading...</div>}>
                {renderView()}
            </React.Suspense>
        </main>
      </div>
    </div>
  );
};
export default App;