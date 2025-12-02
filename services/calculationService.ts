import { ProjectDetails, Node, Member, Support, Material, Section, LoadCase, StructuralLoad, LoadCombination, Plate, AnalysisResults, DesignResult, SearchResult, AiDesignStep, BOQItem, PhaseItem, TaskItem, EngineeringStatusKPI, ProcurementKPI, SafetyKPI, ReportItem } from '../types/index';
import { generateLoadCombinations as generateCombinations } from './loadService';
import { LayoutDashboard, HardHat, FileText, Target, Minus, Square } from 'lucide-react';

export const generateStructuralModel = (project: Partial<ProjectDetails>): { 
    nodes: Node[], members: Member[], plates: Plate[], supports: Support[], materials: Material[], sections: Section[], 
    loadCases: LoadCase[], loads: StructuralLoad[], loadCombinations: LoadCombination[] 
} => {
    const nodes: Node[] = [];
    const members: Member[] = [];
    const plates: Plate[] = [];
    const supports: Support[] = [];
    const materials: Material[] = [
        { id: 'M25', name: 'M25 Concrete', type: 'Concrete', E: 25000, density: 2500, fck: 25 },
        { id: 'Fe500', name: 'Fe500 Steel', type: 'Steel', E: 200000, density: 7850, fy: 500 }
    ];
    const sections: Section[] = [
        { id: 'C300x450', name: 'C 300x450', type: 'Rectangular', properties: { d: 450, b: 300 } },
        { id: 'B230x450', name: 'B 230x450', type: 'Rectangular', properties: { d: 450, b: 230 } }
    ];

    if (!project || !project.dimensions) return { nodes, members, plates, supports, materials, sections, loadCases:[], loads:[], loadCombinations:[] };

    const L = project.dimensions.length;
    const W = project.dimensions.width;
    const stories = project.stories || 1;
    const bayX = Math.max(1, Math.ceil(L / 5)); // 5m bays
    const bayZ = Math.max(1, Math.ceil(W / 5));
    const h = 3; // 3m story height
    const spacingX = L / bayX;
    const spacingZ = W / bayZ;

    let nodeId = 1;
    const nodeGrid: { [key: string]: number } = {};
    for (let s = 0; s <= stories; s++) {
        const y = s * h;
        for (let i = 0; i <= bayX; i++) {
            for (let j = 0; j <= bayZ; j++) {
                nodes.push({ id: nodeId, x: i * spacingX, y, z: j * spacingZ });
                nodeGrid[`${s}-${i}-${j}`] = nodeId;
                if (s === 0) {
                    supports.push({ id: `S${nodeId}`, nodeId: nodeId, type: 'Fixed' });
                }
                nodeId++;
            }
        }
    }

    let memberId = 1;
    // Columns
    for (let s = 0; s < stories; s++) {
        for (let i = 0; i <= bayX; i++) {
            for (let j = 0; j <= bayZ; j++) {
                members.push({ id: memberId++, startNode: nodeGrid[`${s}-${i}-${j}`], endNode: nodeGrid[`${s+1}-${i}-${j}`], sectionId: 'C300x450', materialId: 'M25', type: 'Column' });
            }
        }
    }
    // Beams
    for (let s = 1; s <= stories; s++) {
        for (let i = 0; i < bayX; i++) {
            for (let j = 0; j <= bayZ; j++) {
                members.push({ id: memberId++, startNode: nodeGrid[`${s}-${i}-${j}`], endNode: nodeGrid[`${s}-${i+1}-${j}`], sectionId: 'B230x450', materialId: 'M25', type: 'Beam' });
            }
        }
        for (let i = 0; i <= bayX; i++) {
            for (let j = 0; j < bayZ; j++) {
                 members.push({ id: memberId++, startNode: nodeGrid[`${s}-${i}-${j}`], endNode: nodeGrid[`${s}-${i}-${j+1}`], sectionId: 'B230x450', materialId: 'M25', type: 'Beam' });
            }
        }
    }
    
    // Plates (Slabs)
    let plateId = 1;
    for (let s = 1; s <= stories; s++) {
        for (let i = 0; i < bayX; i++) {
            for (let j = 0; j < bayZ; j++) {
                plates.push({ id: plateId++, nodes: [nodeGrid[`${s}-${i}-${j}`], nodeGrid[`${s}-${i+1}-${j}`], nodeGrid[`${s}-${i+1}-${j+1}`], nodeGrid[`${s}-${i}-${j+1}`]], thickness: 150, materialId: 'M25' });
            }
        }
    }
    
    const loadCases: LoadCase[] = [{id: 'DL', name: 'Dead Load', type: 'Dead'}, {id: 'LL', name: 'Live Load', type: 'Live'}];
    const loads: StructuralLoad[] = [];
    const loadCombinations = generateCombinations({dead: true, live: true, wind: false, seismic: false});

    return { nodes, members, plates, supports, materials, sections, loadCases, loads, loadCombinations };
};

export const runAnalysisAndDesign = (model: { members: Member[], sections: Section[], materials: Material[] }): { analysisResults: AnalysisResults, updatedMembers: Member[] } => {
    const analysisResults: AnalysisResults = { memberForces: {} };
    const updatedMembers = model.members.map(member => {
        // Simulate some realistic forces based on member type
        let forces = { P: -800, Vy: 50, Vz: 150, T: 10, My: 20, Mz: 120 }; // Column-like
        if (member.type === 'Beam') {
            forces = { P: -50, Vy: 80, Vz: 10, T: 5, My: 5, Mz: 150 }; // Beam-like
        }
        analysisResults.memberForces[member.id] = forces;

        let designResult: DesignResult = { status: 'Pass', utilization: 0, check: 'N/A', governingCombo: '1.5(DL+LL)' };
        
        // Simple IS 456 Flexure Check for Beams
        if (member.type === 'Beam') {
            const section = model.sections.find(s => s.id === member.sectionId);
            const material = model.materials.find(m => m.id === member.materialId);
            if (section?.properties && material?.fck) {
                const { b, d } = section.properties;
                const { fck } = material;
                const Mu_lim = 0.138 * fck * b * Math.pow(d - 40, 2) / 1e6; // in kNm
                const Mu_demand = forces.Mz;
                const utilization = Math.abs(Mu_demand / Mu_lim);
                designResult = {
                    status: utilization > 1.0 ? 'Fail' : utilization > 0.9 ? 'Warning' : 'Pass',
                    utilization: parseFloat(utilization.toFixed(2)),
                    check: 'Flexure (IS 456)',
                    governingCombo: '1.5(DL+LL)'
                };
            }
        }
        
        return { ...member, designResult };
    });

    return { analysisResults, updatedMembers };
};

export const handleModelAction = (
    state: { nodes: Node[], members: Member[], supports: Support[], loads: StructuralLoad[], plates: Plate[] }, 
    action: string, 
    payload: any
) => {
    let newNodes = [...state.nodes];
    let newMembers = [...state.members];
    let newSupports = [...state.supports];
    let newLoads = [...state.loads];
    let newPlates = [...state.plates];

    switch (action) {
        case 'add-node':
            newNodes.push({ ...payload, id: (Math.max(0, ...newNodes.map(n => n.id)) + 1) });
            break;
        case 'add-member':
             newMembers.push({ ...payload, id: (Math.max(0, ...newMembers.map(m => m.id)) + 1) });
            break;
        case 'add-plate':
             newPlates.push({ ...payload, id: (Math.max(0, ...newPlates.map(p => p.id)) + 1) });
             break;
        case 'add-support':
             newSupports = newSupports.filter(s => s.nodeId !== payload.nodeId);
             newSupports.push({ ...payload, id: `S-${newSupports.length + 1}` });
             break;
        case 'update-entity':
             if (payload.type === 'node') {
                newNodes = newNodes.map(n => n.id === payload.id ? {...n, ...payload.newProps} : n);
             } else if (payload.type === 'member') {
                newMembers = newMembers.map(m => m.id === payload.id ? {...m, ...payload.newProps} : m);
             }
             break;
    }
    return { nodes: newNodes, members: newMembers, supports: newSupports, loads: newLoads, plates: newPlates };
};

export const globalSearch = (query: string, project: Partial<ProjectDetails> | null): SearchResult[] => {
    if (!project || !query) return [];
    const results: SearchResult[] = [
        { id: 'nav-dash', title: 'Dashboard', description: 'Navigate to project overview', category: 'Navigation', view: 'dashboard', icon: LayoutDashboard },
        { id: 'nav-modeler', title: '3D Modeler', description: 'Open the interactive modeler', category: 'Navigation', view: 'layout', icon: HardHat },
        { id: 'nav-analysis', title: 'Analysis & Design', description: 'Run solvers and check results', category: 'Navigation', view: 'structure', icon: HardHat },
        { id: 'mem-1', title: 'Member 1', description: 'Beam, 230x450', category: 'Member', view: 'layout', icon: Minus },
        { id: 'node-1', title: 'Node 1', description: 'Coordinates (0,0,0)', category: 'Node', view: 'layout', icon: Target },
        { id: 'plate-1', title: 'Plate 1', description: '150mm Slab', category: 'Plate', view: 'layout', icon: Square },
        { id: 'doc-1', title: 'Foundation Layout', description: 'Structural Drawing', category: 'Document', view: 'management', icon: FileText },
    ];
    return results.filter(r => r.title.toLowerCase().includes(query.toLowerCase()) || r.description.toLowerCase().includes(query.toLowerCase()));
};

export const generateAiDesignFlow = (): AiDesignStep[] => ([
    { id: 1, question: "Let's start your new design! What are the plot dimensions (e.g., '40x60 ft' or '12x18 m')?", action: 'INPUT', status: 'pending' },
    { id: 2, question: "Got it. I'm generating the site boundary.", action: 'GENERATE', payload: { type: 'boundary', w: 40, h: 60 }, status: 'pending' },
    { id: 3, question: "How many floors do you need above ground (e.g., '3' for G+2)?", action: 'INPUT', status: 'pending' },
    { id: 4, question: "Okay, I'm generating a standard 5x5 meter column grid. This includes plates for slabs.", action: 'GENERATE', payload: { type: 'grid', cols: 3, rows: 4 }, status: 'pending' },
    { id: 5, question: "This is the basic layout. Ready to finalize and create the 3D model in the editor?", action: 'CONFIRM', payload: { type: 'finalize' }, status: 'pending' },
]);

export const calculateProjectStats = (project: Partial<ProjectDetails> | null) => {
    if(!project || !project.dimensions || !project.stories) return { estimatedCost: 0, ratePerSqFt: 0, duration: 0 };
    const area = project.dimensions.length * project.dimensions.width * project.stories;
    const rate = project.type === 'PEB' ? 4500 : 2200;
    const cost = area * rate * 9; // Simplified
    return { estimatedCost: cost, ratePerSqFt: rate, duration: 12 };
};

// FIX: Added explicit PhaseItem[] and TaskItem[] types to fix type inference errors.
export const generateSchedule = (project: Partial<ProjectDetails> | null): { phases: PhaseItem[], tasks: TaskItem[], totalProgress: number } => {
    if (!project || !project.startDate) return { phases: [], tasks: [], totalProgress: 0 };
    
    const formatDate = (date: Date) => date.toISOString().split('T')[0];
    const startDate = new Date(project.startDate);
  
    const addWeeks = (date: Date, weeks: number): Date => {
      const newDate = new Date(date);
      newDate.setDate(newDate.getDate() + weeks * 7);
      return newDate;
    };
  
    const phases: PhaseItem[] = [
      { name: 'Foundation Works', start: formatDate(startDate), end: formatDate(addWeeks(startDate, 4)), status: 'completed', progress: 100 },
      { name: 'Superstructure (L1-L2)', start: formatDate(addWeeks(startDate, 4)), end: formatDate(addWeeks(startDate, 12)), status: 'in-progress', progress: 50 },
      { name: 'Finishing & MEP', start: formatDate(addWeeks(startDate, 12)), end: formatDate(addWeeks(startDate, 20)), status: 'pending', progress: 0 },
      { name: 'Handover & Closure', start: formatDate(addWeeks(startDate, 20)), end: formatDate(addWeeks(startDate, 22)), status: 'pending', progress: 0 },
    ];
    
    const tasks: TaskItem[] = [
        { id: 1, title: 'Submit Foundation Drawings for Approval', due: formatDate(addWeeks(startDate, 1)), priority: 'High', status: 'Done' },
        { id: 2, title: 'Complete Slab Shuttering for Level 2', due: formatDate(addWeeks(startDate, 8)), priority: 'High', status: 'In Progress' },
        { id: 3, title: 'Procure all Plumbing Fixtures', due: formatDate(addWeeks(startDate, 14)), priority: 'Medium', status: 'Pending' },
    ];
  
    const totalProgress = Math.round(phases.reduce((acc, p) => acc + p.progress, 0) / phases.length);
  
    return { phases, tasks, totalProgress };
};

export const generateBOQ = (project: Partial<ProjectDetails> | null): BOQItem[] => {
    if (!project || !project.type) return [];
    if (project.type === 'RCC') {
        return [
            { id: 'RCC-01', category: 'Civil', description: 'M25 Grade Concrete', unit: 'Cum', quantity: 145.5, rate: 7200, amount: 1047600 },
            { id: 'RCC-02', category: 'Civil', description: 'Fe500 Reinforcement Steel', unit: 'MT', quantity: 18.2, rate: 65000, amount: 1183000 },
        ];
    }
    return [];
};
export const generateKratosInput = (model: any) => "KRATOS_INPUT_FILE_CONTENT";
export const autoGenerateLoads = (model: any) => ({ loads: [], loadCases: [] });

// All other generator functions (stubs)
export const generateRateAnalysis = (projectType: string | undefined): any[] => { return []; };
export const generateDocuments = (project: Partial<ProjectDetails> | null): any[] => [];
export const generateFinancials = (project: Partial<ProjectDetails> | null) => ({ stats: { contractValue: 0, billedValue: 0, receivedValue: 0, outstandingValue: 0 }, bills: [] });
export const generateQualityData = (project: Partial<ProjectDetails> | null) => ({ checklists: [], stats: { safeManHours: 0, nearMisses: 0 } });
export const generateSitePhotos = (project: Partial<ProjectDetails> | null): any[] => [];
export const generateProcurementData = (project: Partial<ProjectDetails> | null) => ({ vendors: [], orders: [], rfqs: [] });
export const generateReports = (project: Partial<ProjectDetails> | null): ReportItem[] => [];
// FIX: Completed the MIS data objects to match their respective KPI types, resolving multiple errors in Reports.tsx.
export const generateMISData = (project: Partial<ProjectDetails> | null): { eng: EngineeringStatusKPI, proc: ProcurementKPI, safe: SafetyKPI } => ({
    eng: {
        designsCompleted: 85,
        designsPending: 45,
        drawingsIssued: 15,
        revisions: 4,
        designProgress: [
            { name: 'Foundations', completed: 10, total: 10 },
            { name: 'Beams', completed: 45, total: 60 },
            { name: 'Slabs', completed: 30, total: 60 },
        ]
    },
    proc: {
        totalPOs: 12,
        totalValue: 5400000,
        activeVendors: 5,
        delayedDeliveries: 1,
        vendorPerformance: [
            { name: 'UltraTech', rating: 4.5 },
            { name: 'Tata Steel', rating: 4.8 },
        ]
    },
    safe: {
        totalInspections: 25,
        ncrOpen: 2,
        complianceScore: 94,
        passed: 23,
        failed: 2,
    }
});
export const getPlugins = (): any[] => [];
export const generateAuditLogs = (): any[] => [];
export const getSystemStatus = (): any[] => [];
export const getImportJobs = (): any[] => [];
export const generateConstructionRisks = (): any[] => [];
export const generateDesignCalculation = (type: 'Beam' | 'Column'): any[] => [];
export const generateSensorData = (type: 'all'): any[] => [];
export const runModelValidation = (): any[] => [];
export const generatePortfolioData = (): any[] => [];
export const generateApprovalRequests = (): any[] => [];
export const generateConnectionDesign = (): any => ({ id: '', type: '', members: '', status: 'Pass', utilization: 0, checks: [] });
export const generateClosureData = (): any[] => [];
export const generateOptimizations = (project: Partial<ProjectDetails> | null): any[] => [];
export const generateStructuralMembers = (project: Partial<ProjectDetails> | null): { members: any[], grid: any } => ({ members: [], grid: {} });
export const generateBBS = (members: any[]): any[] => [];
export const generateInventory = (type: string | undefined): any[] => [];
export const generateMeasurementBook = (params: any): any[] => [];
export const updateMemberProperty = (members: Member[], id: number, props: any): Member[] => {
    return members.map(m => m.id === id ? { ...m, ...props } : m);
};