

import { ProjectDetails, BOQItem, PhaseItem, TaskItem, DocumentItem, RABill, FinancialStats, StructuralMember, QualityChecklist, SafetyStat, RateAnalysisItem, Vendor, PurchaseOrder, ReportItem, RFQ, SitePhoto, MeasurementEntry, BBSItem, ComplianceCheck, ImportJob, DesignCalcStep, SensorData, ConstructionRisk, Plugin, ValidationIssue, InventoryItem, MEPItem, ProjectSummary, ApprovalRequest, ConnectionResult, ClosureDocument, AuditLog, SystemStatus, OptimizationSuggestion, EngineeringStatusKPI, ProcurementKPI, SafetyKPI, SearchResult, AiDesignStep, ActionCost } from '../types/index';
import { LayoutDashboard, HardHat, FileText, CheckSquare, Users } from 'lucide-react';


// Helper: Calculate grid layout and member counts based on dimensions
const getStructuralModel = (project: Partial<ProjectDetails>) => {
  const L = project.dimensions?.length || 0;
  const W = project.dimensions?.width || 0;
  const stories = project.stories || 1;
  const bayX = Math.ceil(L / 15);
  const bayY = Math.ceil(W / 15);
  const colsX = bayX + 1;
  const colsY = bayY + 1;
  const totalCols = colsX * colsY;
  const totalBeamsX = colsY * bayX;
  const totalBeamsY = colsX * bayY;
  const totalBeamsPerFloor = totalBeamsX + totalBeamsY;
  return { colsX, colsY, totalCols, totalBeamsPerFloor, stories };
};

export const generateStructuralMembers = (project: Partial<ProjectDetails>): StructuralMember[] => {
  if (!project || !project.dimensions) return [];
  const { totalCols, totalBeamsPerFloor, stories } = getStructuralModel(project);
  const isPEB = project.type === 'PEB' || project.type === 'Steel';
  const isRetainingWall = project.type === 'Retaining Wall';
  const isWaterTank = project.type === 'Water Tank';
  const isLandfill = project.type === 'Landfill';
  
  const members: StructuralMember[] = [];

  if (isRetainingWall) {
    const length = project.dimensions?.length || 30;
    const height = project.dimensions?.width || 12;
    members.push({ id: 'M-01', type: 'Wall Stem', mark: 'RW-Stem', count: 1, dimensions: `Top 200mm / Bot 450mm`, reinforcement: '16Φ @ 150 c/c Main', concreteVol: (0.325 * height * 0.3 * length), steelWeight: length * height * 12, level: 'Stem' });
    members.push({ id: 'M-02', type: 'Base Slab', mark: 'RW-Base', count: 1, dimensions: `${(height*0.6).toFixed(1)}ft Wide x 500mm Thk`, reinforcement: '12Φ @ 150 c/c Mesh', concreteVol: (height * 0.6 * 0.3 * 0.5 * length), steelWeight: length * (height * 0.6) * 10, level: 'Foundation' });
  } else if (isWaterTank) {
      const diameter = project.dimensions?.length || 15;
      const height = project.dimensions?.width || 10;
      members.push({ id: 'M-01', type: 'Base Slab', mark: 'TB-1', count: 1, dimensions: '400mm Thk (Circular)', reinforcement: '12Φ @ 100 c/c Mesh', concreteVol: (Math.PI * Math.pow(diameter/2, 2) * 0.4 * 0.028), steelWeight: 1200, level: 'Base' });
      members.push({ id: 'M-02', type: 'Tank Wall', mark: 'TW-1', count: 1, dimensions: '300mm Thk', reinforcement: '16Φ hoop @ 120 c/c', concreteVol: (Math.PI * diameter * height * 0.3 * 0.028), steelWeight: 2500, level: 'Wall' });
      members.push({ id: 'M-03', type: 'Top Dome', mark: 'TD-1', count: 1, dimensions: '120mm Thk', reinforcement: '8Φ @ 150 c/c', concreteVol: (Math.PI * Math.pow(diameter/2, 2) * 0.12 * 0.028), steelWeight: 600, level: 'Roof' });
  } else if (isLandfill) {
       const area = (project.dimensions?.length || 100) * (project.dimensions?.width || 100);
       members.push({ id: 'M-01', type: 'Liner', mark: 'GCL-1', count: 1, dimensions: 'GCL + 1.5mm HDPE', reinforcement: 'N/A', concreteVol: 0, steelWeight: 0, level: 'Base' });
       members.push({ id: 'M-02', type: 'Beam', mark: 'Anchor Trench', count: 1, dimensions: '500x500mm', reinforcement: 'Nominal', concreteVol: (area * 0.01), steelWeight: 200, level: 'Perimeter' });
  } else if (isPEB) {
     members.push({ id: 'M-01', type: 'Column', mark: 'MC-1', count: totalCols, dimensions: 'ISMB 450 (Tapered)', reinforcement: 'N/A', concreteVol: 0, steelWeight: totalCols * stories * 180, level: 'All' });
     members.push({ id: 'M-02', type: 'Beam', mark: 'R-1', count: totalBeamsPerFloor, dimensions: 'ISMB 350 (Rafter)', reinforcement: 'N/A', concreteVol: 0, steelWeight: totalBeamsPerFloor * stories * 120, level: 'Roof' });
  } else {
    const colSize = stories > 3 ? '300x600' : '230x450';
    const colVol = (stories > 3 ? 0.3*0.6 : 0.23*0.45) * 3 * totalCols * stories;
    const beamSize = '230x450';
    const beamVol = (0.23*0.45) * 4.5 * totalBeamsPerFloor * stories;
    members.push({ id: 'M-01', type: 'Footing', mark: 'F1', count: totalCols, dimensions: '1800x1800x500', reinforcement: '12Φ @ 150 c/c', concreteVol: (1.8*1.8*0.5)*totalCols, steelWeight: totalCols * 85, level: 'Foundation' });
    members.push({ id: 'M-02', type: 'Column', mark: 'C1', count: totalCols, dimensions: colSize, reinforcement: stories > 3 ? '8-20Φ' : '6-16Φ', concreteVol: colVol, steelWeight: colVol * 180, level: 'All Floors' });
    members.push({ id: 'M-03', type: 'Beam', mark: 'B1', count: totalBeamsPerFloor, dimensions: beamSize, reinforcement: '3-16Φ Top + 3-20Φ Bot', concreteVol: beamVol, steelWeight: beamVol * 140, level: 'All Floors' });
    members.push({ id: 'M-04', type: 'Slab', mark: 'S1', count: stories, dimensions: '150mm Thk', reinforcement: '8Φ @ 150 c/c Main', concreteVol: (project.dimensions?.length||0)*(project.dimensions?.width||0)*0.15*0.092 * stories, steelWeight: 0, level: 'All Floors' });
  }
  return members;
};

// New function for 3D modeler interactivity
export const updateMemberProperty = (member: StructuralMember, newProps: Partial<StructuralMember>): StructuralMember => {
    // In a real app, this would perform engineering calculations (e.g., re-calculate volume)
    // For now, we just merge the properties.
    return { ...member, ...newProps };
};

export const generateDesignCalculation = (memberType: string): DesignCalcStep[] => {
  if (memberType === 'Beam') {
    return [
      { id: '1', stepName: 'Design Moments', reference: 'Analysis', description: 'Factored Bending Moment', formula: 'Mu', substitution: 'From Envelope', result: '145 kNm', status: 'Info' },
      { id: '2', stepName: 'Limiting Depth', reference: 'IS 456 Cl 38.1', description: 'Max depth for singly reinforced', formula: 'Xu_max/d = 0.48 (Fe500)', substitution: '0.48 * 450', result: '216 mm', status: 'Info' },
      { id: '3', stepName: 'Limiting Moment', reference: 'IS 456 Eq G-1.1', description: 'Capacity of section', formula: 'Mu_lim = 0.36 fck b Xu_max (d - 0.42 Xu_max)', substitution: '0.36 * 25 * 230 * 216 * (450 - 0.42*216)', result: '158 kNm', status: 'Info' },
      { id: '4', stepName: 'Check Capacity', reference: 'IS 456', description: 'Mu vs Mu_lim', formula: 'Mu < Mu_lim', substitution: '145 < 158', result: 'Safe (Singly Reinforced)', status: 'Pass' },
      { id: '5', stepName: 'Area of Steel', reference: 'IS 456 Eq G-1.1(b)', description: 'Required Tension Steel', formula: 'Ast = 0.5 fck/fy * [1 - sqrt(1 - 4.6 Mu / fck b d^2)] * b d', substitution: 'Calculated...', result: '980 mm²', status: 'Info' },
      { id: '6', stepName: 'Check Min Steel', reference: 'IS 456 Cl 26.5.1.1', description: 'Minimum Tension Steel', formula: 'Ast_min = 0.85 b d / fy', substitution: '0.85 * 230 * 450 / 500', result: '175 mm²', status: 'Pass' },
    ];
  }
  return [
      { id: '1', stepName: 'Factored Loads', reference: 'Analysis', description: 'Axial Load & Moments', formula: 'Pu, Mux, Muy', substitution: 'From Load Combo 1.5(DL+LL)', result: 'Pu=1200kN, Mu=45kNm', status: 'Info' },
      { id: '2', stepName: 'Slenderness Check', reference: 'IS 456 Cl 25.1.2', description: 'Effective Length Ratio', formula: 'Lex/D, Ley/b', substitution: '3000/450', result: '6.66 < 12 (Short Column)', status: 'Pass' },
      { id: '3', stepName: 'Min Eccentricity', reference: 'IS 456 Cl 25.4', description: 'Minimum Eccentricity', formula: 'emin = L/500 + D/30', substitution: '3000/500 + 450/30', result: '21 mm', status: 'Info' },
      { id: '4', stepName: 'Capacity Check', reference: 'IS 456 Cl 39.3', description: 'Pure Axial Capacity', formula: 'Pu = 0.4 fck Ac + 0.67 fy Asc', substitution: '0.4*25*132000 + 0.67*500*2200', result: '2057 kN > 1200 kN', status: 'Pass' },
  ];
};

export const generateBBS = (project: Partial<ProjectDetails>): BBSItem[] => {
    const isPEB = project.type === 'PEB' || project.type === 'Steel';
    if (isPEB || project.type === 'Landfill' || !project.dimensions) return [];
    const members = generateStructuralMembers(project);
    const bbs: BBSItem[] = [];
    const unitWeights: Record<number, number> = { 8: 0.395, 10: 0.617, 12: 0.888, 16: 1.58, 20: 2.47, 25: 3.85 };
    members.forEach(member => {
        if (member.type === 'Column') {
            const h = (project.stories || 1) * 3; 
            bbs.push({ barMark: '01', memberId: member.mark, description: 'Main Vertical Bars', diameter: 16, shapeCode: '00', noOfBars: member.count * 6, cutLength: h + 1, totalLength: (h + 1) * member.count * 6, unitWeight: unitWeights[16], totalWeight: (h + 1) * member.count * 6 * unitWeights[16], shapeParams: { a: (h + 1) * 1000, b: 0 } });
            const spacing = 0.15; 
            const stirrupCount = Math.ceil(h / spacing);
            const len = 2 * ((230-80) + (450-80)) + 0.1; 
            bbs.push({ barMark: '02', memberId: member.mark, description: 'Lateral Ties (Stirrups)', diameter: 8, shapeCode: '21', noOfBars: member.count * stirrupCount, cutLength: len / 1000, totalLength: (len / 1000) * member.count * stirrupCount, unitWeight: unitWeights[8], totalWeight: (len / 1000) * member.count * stirrupCount * unitWeights[8], shapeParams: { a: 150, b: 370 } });
        } else if (member.type === 'Beam') {
             const span = 4.5; 
             bbs.push({ barMark: '03', memberId: member.mark, description: 'Bottom Main Bars', diameter: 20, shapeCode: '41', noOfBars: member.count * 3, cutLength: span + 0.6, totalLength: (span + 0.6) * member.count * 3, unitWeight: unitWeights[20], totalWeight: (span + 0.6) * member.count * 3 * unitWeights[20], shapeParams: { a: 300, b: span * 1000, c: 300 } });
        } else if (member.type === 'Footing') {
            const L = 1.8; const B = 1.8;
            bbs.push({ barMark: '04', memberId: member.mark, description: 'Base Mat X-Dir', diameter: 12, shapeCode: '41', noOfBars: member.count * Math.ceil(L/0.15), cutLength: B + 0.4, totalLength: (B + 0.4) * member.count * Math.ceil(L/0.15), unitWeight: unitWeights[12], totalWeight: (B + 0.4) * member.count * Math.ceil(L/0.15) * unitWeights[12], shapeParams: { a: 200, b: B * 1000, c: 200 } });
        }
    });
    return bbs;
};

export const calculateProjectStats = (project: Partial<ProjectDetails>) => {
  if (!project.dimensions) return { area: 0, footprint: 0, ratePerSqFt: 0, estimatedCost: 0, duration: 0 };
  const length = project.dimensions?.length || 0;
  const width = project.dimensions?.width || 0;
  const stories = project.stories || 1;
  const footprint = length * width;
  let area = footprint * stories;
  if (project.type === 'Retaining Wall') area = length * width;
  if (project.type === 'Water Tank') area = Math.PI * (length/2) * (length/2);
  if (project.type === 'Landfill') area = length * width;
  const boq = generateBOQ(project);
  const totalCost = boq.reduce((sum, item) => sum + item.amount, 0);
  const ratePerSqFt = area > 0 ? Math.round(totalCost / area) : 0;
  let duration = 6;
  if (project.type === 'RCC') duration = 2 + (stories * 1.5); 
  if (project.type === 'PEB') duration = 3 + (stories * 0.5); 
  if (project.type === 'Retaining Wall') duration = 3;
  if (project.type === 'Water Tank') duration = 4;
  if (project.type === 'Landfill') duration = 5;
  return { area, footprint, ratePerSqFt, estimatedCost: totalCost, duration: Math.ceil(duration) };
};

export const generateBOQ = (project: Partial<ProjectDetails>): BOQItem[] => {
  if (!project.dimensions) return [];
  const stories = project.stories || 1;
  const area = (project.dimensions?.length || 0) * (project.dimensions?.width || 0) * stories;
  const members = generateStructuralMembers(project);
  const totalConcrete = members.reduce((acc, m) => acc + (m.concreteVol || 0), 0);
  const totalSteel = members.reduce((acc, m) => acc + (m.steelWeight || 0), 0);
  const items: BOQItem[] = [];
  
  if (project.type === 'Retaining Wall') {
    items.push(
      { id: 'CIV-001', category: 'Civil', description: 'Earthwork Excavation for Base', unit: 'Cum', quantity: Math.ceil(totalConcrete * 1.5), rate: 350, amount: Math.ceil(totalConcrete * 1.5) * 350 },
      { id: 'CON-101', category: 'Concrete', description: 'RCC M30 Grade (Wall & Base)', unit: 'Cum', quantity: Math.ceil(totalConcrete), rate: 7500, amount: Math.ceil(totalConcrete) * 7500 },
      { id: 'STL-101', category: 'Steel', description: 'Reinforcement Steel (Fe500D)', unit: 'Kg', quantity: Math.ceil(totalSteel), rate: 78, amount: Math.ceil(totalSteel) * 78 },
      { id: 'MIS-201', category: 'Misc', description: 'Weep Holes & Filter Media', unit: 'Ls', quantity: 1, rate: 45000, amount: 45000 }
    );
  } else if (project.type === 'Water Tank') {
      items.push(
      { id: 'CIV-001', category: 'Civil', description: 'Excavation for Tank Foundation', unit: 'Cum', quantity: Math.ceil(totalConcrete * 1.2), rate: 350, amount: Math.ceil(totalConcrete * 1.2) * 350 },
      { id: 'CON-101', category: 'Concrete', description: 'M30 Design Mix (Waterproof)', unit: 'Cum', quantity: Math.ceil(totalConcrete), rate: 7800, amount: Math.ceil(totalConcrete) * 7800 },
      { id: 'STL-101', category: 'Steel', description: 'Epoxy Coated Rebar', unit: 'Kg', quantity: Math.ceil(totalSteel), rate: 82, amount: Math.ceil(totalSteel) * 82 },
      { id: 'MIS-201', category: 'Waterproofing', description: 'PVC Water Stoppers & Chemical Coating', unit: 'Ls', quantity: 1, rate: 120000, amount: 120000 },
      { id: 'PLB-301', category: 'Plumbing', description: 'Inlet/Outlet/Scour Pipes', unit: 'Ls', quantity: 1, rate: 85000, amount: 85000 }
    );
  } else if (project.type === 'Landfill') {
      items.push(
      { id: 'CIV-001', category: 'Civil', description: 'Earthwork Excavation & Dressing', unit: 'Cum', quantity: Math.ceil(area * 0.5), rate: 250, amount: Math.ceil(area * 0.5) * 250 },
      { id: 'GEO-101', category: 'Geosynthetics', description: 'HDPE Liner (1.5mm)', unit: 'Sqm', quantity: Math.ceil(area * 1.1), rate: 450, amount: Math.ceil(area * 1.1) * 450 },
      { id: 'GEO-102', category: 'Geosynthetics', description: 'Geotextile Protection Layer', unit: 'Sqm', quantity: Math.ceil(area * 1.1), rate: 120, amount: Math.ceil(area * 1.1) * 120 },
      { id: 'CIV-002', category: 'Civil', description: 'Leachate Collection System', unit: 'Rm', quantity: Math.ceil(Math.sqrt(area) * 2), rate: 1500, amount: Math.ceil(Math.sqrt(area) * 2) * 1500 }
    );
  } else if (project.type === 'PEB' || project.type === 'Steel') {
    items.push(
      { id: 'CIV-001', category: 'Civil', description: 'Isolated Footings & Pedestals (M25)', unit: 'Cum', quantity: Math.ceil(area * 0.02), rate: 6500, amount: Math.ceil(area * 0.02) * 6500 },
      { id: 'STL-101', category: 'Steel', description: 'Structural Steel Members (IS 2062)', unit: 'MT', quantity: Math.ceil(totalSteel/1000), rate: 85000, amount: Math.ceil(totalSteel/1000) * 85000 },
      { id: 'SHT-201', category: 'Sheeting', description: 'Roof & Wall Cladding (0.5mm PPGI)', unit: 'Sqm', quantity: Math.ceil(area * 1.2), rate: 650, amount: Math.ceil(area * 1.2) * 650 },
      { id: 'ACC-301', category: 'Accessories', description: 'Bolts, Gutters, Turbo Vents', unit: 'Ls', quantity: 1, rate: 150000, amount: 150000 },
      { id: 'ERE-401', category: 'Erection', description: 'Installation Charges', unit: 'MT', quantity: Math.ceil(totalSteel/1000), rate: 12000, amount: Math.ceil(totalSteel/1000) * 12000 },
      { id: 'FLR-501', category: 'Flooring', description: 'VDF Flooring (M25)', unit: 'Sqm', quantity: Math.ceil(area/stories), rate: 850, amount: Math.ceil(area/stories) * 850 }
    );
  } else {
    items.push(
      { id: 'CIV-001', category: 'Civil', description: 'Earthwork Excavation', unit: 'Cum', quantity: Math.ceil(area * 0.15), rate: 350, amount: Math.ceil(area * 0.15) * 350 },
      { id: 'CON-101', category: 'Concrete', description: 'PCC 1:4:8 Foundation Base', unit: 'Cum', quantity: Math.ceil(area * 0.05), rate: 4500, amount: Math.ceil(area * 0.05) * 4500 },
      { id: 'CON-102', category: 'Concrete', description: 'RCC M25 (From Struct. Model)', unit: 'Cum', quantity: Math.ceil(totalConcrete), rate: 7200, amount: Math.ceil(totalConcrete) * 7200 },
      { id: 'STL-201', category: 'Steel', description: 'Reinforcement Steel (Fe550D)', unit: 'Kg', quantity: Math.ceil(totalSteel), rate: 78, amount: Math.ceil(totalSteel) * 78 },
      { id: 'MAS-301', category: 'Masonry', description: 'AAC Block Masonry', unit: 'Cum', quantity: Math.ceil(area * 0.08), rate: 5200, amount: Math.ceil(area * 0.08) * 5200 },
      { id: 'FIN-401', category: 'Finishing', description: 'Plastering & Painting', unit: 'Sqm', quantity: Math.ceil(area * 2.5), rate: 450, amount: Math.ceil(area * 2.5) * 450 },
      { id: 'FLR-501', category: 'Flooring', description: 'Tiles / Granite', unit: 'Sqm', quantity: Math.ceil(area * 0.85), rate: 1400, amount: Math.ceil(area * 0.85) * 1400 },
      { id: 'MEP-601', category: 'MEP', description: 'Electrical & Plumbing', unit: 'Ls', quantity: 1, rate: 250000, amount: 250000 }
    );
  }
  return items;
};

const addWeeks = (dateStr: string | undefined, weeks: number) => {
  const date = dateStr ? new Date(dateStr) : new Date();
  const result = new Date(date);
  result.setDate(result.getDate() + weeks * 7);
  return result.toISOString().split('T')[0];
};

export const generateSchedule = (project: Partial<ProjectDetails>): { phases: PhaseItem[], tasks: TaskItem[] } => {
  const isLandfill = project.type === 'Landfill';
  const isTank = project.type === 'Water Tank';
  const isWall = project.type === 'Retaining Wall';
  const isPEB = project.type === 'PEB' || project.type === 'Steel';
  const startDate = project.startDate;

  let phases: PhaseItem[] = [];
  let tasks: TaskItem[] = [];
  
  if (isLandfill) {
     phases = [{ name: 'Site Clearance', start: addWeeks(startDate, 0), end: addWeeks(startDate, 2), status: 'completed', progress: 100 }, { name: 'Earthwork Excavation', start: addWeeks(startDate, 2), end: addWeeks(startDate, 6), status: 'in-progress', progress: 60 }];
     tasks = [{ id: 1, title: 'Check Subgrade Compaction', due: addWeeks(startDate, 5), priority: 'High', status: 'Pending' }];
  } else if (isTank) {
      phases = [{ name: 'Excavation & PCC', start: addWeeks(startDate, 0), end: addWeeks(startDate, 2), status: 'completed', progress: 100 }, { name: 'Base Slab Casting', start: addWeeks(startDate, 2), end: addWeeks(startDate, 4), status: 'in-progress', progress: 90 }];
      tasks = [{ id: 1, title: 'Install Water Stoppers', due: addWeeks(startDate, 3), priority: 'High', status: 'Done' }];
  } else if (isWall) {
    phases = [{ name: 'Geotech Investigation', start: addWeeks(startDate, 0), end: addWeeks(startDate, 2), status: 'completed', progress: 100 }, { name: 'Excavation & PCC', start: addWeeks(startDate, 2), end: addWeeks(startDate, 4), status: 'in-progress', progress: 80 }];
    tasks = [{ id: 1, title: 'Check Soil Density', due: addWeeks(startDate, 1), priority: 'High', status: 'Done' }];
  } else if (isPEB) {
    phases = [{ name: 'Design & Engineering', start: addWeeks(startDate, 0), end: addWeeks(startDate, 3), status: 'completed', progress: 100 }, { name: 'Foundation Civil Works', start: addWeeks(startDate, 2), end: addWeeks(startDate, 6), status: 'in-progress', progress: 75 }];
    tasks = [{ id: 1, title: 'Approve Anchor Bolt Setting', due: addWeeks(startDate, 1), priority: 'High', status: 'Done' }];
  } else {
    phases = [{ name: 'Architectural & Struct. Design', start: addWeeks(startDate, -4), end: addWeeks(startDate, 0), status: 'completed', progress: 100 }, { name: 'Excavation & Footings', start: addWeeks(startDate, 0), end: addWeeks(startDate, 4), status: 'completed', progress: 100 }, { name: 'Plinth Beam & Backfilling', start: addWeeks(startDate, 4), end: addWeeks(startDate, 6), status: 'in-progress', progress: 60 }];
    tasks = [{ id: 1, title: 'Soil Bearing Capacity Report', due: addWeeks(startDate, -3), priority: 'High', status: 'Done' }];
  }
  return { phases, tasks };
};

export const generateDocuments = (project: Partial<ProjectDetails>): DocumentItem[] => {
  const startDate = project.startDate;
  return [
      { id: 'DOC-001', name: 'Architectural Floor Plans', type: 'DWG', category: 'Architectural', date: addWeeks(startDate, -2), size: '2.4 MB', status: 'Approved' },
      { id: 'DOC-002', name: 'Soil Investigation Report', type: 'PDF', category: 'Reports', date: addWeeks(startDate, -3), size: '4.1 MB', status: 'Approved' },
      { id: 'DOC-003', name: 'Structural Drawings GFC', type: 'DWG', category: 'Structural', date: addWeeks(startDate, 0), size: '3.5 MB', status: 'Approved' }
  ];
};

export const generateFinancials = (project: Partial<ProjectDetails>): { stats: FinancialStats, bills: RABill[] } => {
  const stats = calculateProjectStats(project);
  const totalCost = stats.estimatedCost;
  const startDate = project.startDate;
  const billedValue = totalCost * 0.35;
  const receivedValue = totalCost * 0.28;
  const financialStats: FinancialStats = { contractValue: totalCost, billedValue: billedValue, receivedValue: receivedValue, outstandingValue: billedValue - receivedValue };
  const bills: RABill[] = [
    { id: 'RA-01', billNo: 'RA/2024/001', date: addWeeks(startDate, 2), description: 'Mobilization Advance', claimedAmount: totalCost * 0.10, approvedAmount: totalCost * 0.10, status: 'Paid' },
    { id: 'RA-02', billNo: 'RA/2024/002', date: addWeeks(startDate, 5), description: 'Foundation Works', claimedAmount: totalCost * 0.15, approvedAmount: totalCost * 0.15, status: 'Paid' },
    { id: 'RA-03', billNo: 'RA/2024/003', date: addWeeks(startDate, 8), description: 'Plinth & GF Columns', claimedAmount: totalCost * 0.12, approvedAmount: 0, status: 'Processing' }
  ];
  return { stats: financialStats, bills };
};

export const generateQualityData = (project: Partial<ProjectDetails>): { checklists: QualityChecklist[], stats: SafetyStat } => {
    const startDate = project.startDate;
    return {
        checklists: [
            { id: 'QC-101', title: 'Pre-Pour Inspection', location: 'Grid A-1', date: addWeeks(startDate, 4), inspector: 'Eng. Rajesh', status: 'Passed', type: 'QA' },
            { id: 'HSE-001', title: 'Safety Induction', location: 'Gate', date: addWeeks(startDate, 1), inspector: 'Safety Officer', status: 'Passed', type: 'HSE' }
        ],
        stats: { safeManHours: 12450, incidents: 0, nearMisses: 2, lastIncidentDate: 'N/A' }
    };
};

export const generateSitePhotos = (project: Partial<ProjectDetails>): SitePhoto[] => {
    const startDate = project.startDate;
    return [
        { id: 'IMG-001', url: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&q=80&w=400', caption: 'Site Clearance', date: addWeeks(startDate, 0), uploadedBy: 'Site Eng', tags: ['Site'] },
        { id: 'IMG-002', url: 'https://images.unsplash.com/photo-1590486803833-1c5dc8ddd4c8?auto=format&fit=crop&q=80&w=400', caption: 'Excavation', date: addWeeks(startDate, 2), uploadedBy: 'Site Eng', tags: ['Civil'] }
    ];
};

export const generateRateAnalysis = (projectType: string | undefined): RateAnalysisItem[] => {
   return [{ itemId: 'CON-102', description: 'RCC M25 Concrete', totalRate: 7200, unit: 'Cum', components: { material: [{ name: 'Cement', unit: 'Bags', quantity: 8.2, unitRate: 380, amount: 3116 }], labor: [{ name: 'Mason', unit: 'Cum', quantity: 1, unitRate: 850, amount: 850 }], machinery: [{ name: 'Mixer', unit: 'Cum', quantity: 1, unitRate: 600, amount: 600 }] } }];
};

export const generateProcurementData = (project: Partial<ProjectDetails>): { vendors: Vendor[], orders: PurchaseOrder[], rfqs: RFQ[] } => {
    const startDate = project.startDate;
    return {
        vendors: [{ id: 'V-001', name: 'UltraTech Cement', category: 'Cement', rating: 4.8, contact: 'Sales', status: 'Active' }],
        orders: [{ id: 'PO-001', poNumber: 'PO/24/001', vendorId: 'V-001', vendorName: 'UltraTech', material: 'Cement', quantity: 500, unit: 'Bags', rate: 380, amount: 190000, orderDate: addWeeks(startDate, 2), deliveryDate: addWeeks(startDate, 3), status: 'Delivered' }],
        rfqs: [{ id: 'RFQ-001', rfqNo: 'RFQ/24/052', title: 'Cement Supply', items: 'OPC 53', floatDate: addWeeks(startDate, 1), dueDate: addWeeks(startDate, 2), status: 'Evaluated', bids: [] }]
    };
};

export const generateReports = (project: Partial<ProjectDetails>): ReportItem[] => {
  const startDate = project.startDate;
  return [{ id: 'RPT-001', title: 'DPR', description: 'Detailed Project Report', type: 'PDF', date: addWeeks(startDate, 0), size: '12.5 MB', category: 'General', status: 'Ready' }];
};

export const generateMeasurementBook = (project: Partial<ProjectDetails>): MeasurementEntry[] => {
    const startDate = project.startDate;
    return [{ id: 'MB-101', date: addWeeks(startDate, 3), boqRef: 'CIV-001', description: 'Earthwork Excavation', location: 'GL to -1.5m', nos: 1, length: 15, breadth: 12, depth: 1.5, quantity: 270, unit: 'Cum', status: 'Billed' }];
};

export const checkCompliance = (project: Partial<ProjectDetails>): ComplianceCheck[] => {
  return [{ id: 'CMP-01', parameter: 'FSI', allowed: 'Max 2.5', actual: '2.1', status: 'Pass', description: 'Floor Space Index check.' }];
};

export const getImportJobs = (): ImportJob[] => {
  return [{ id: 'IMP-01', fileName: 'Structure.std', type: 'STAAD', date: '2024-03-10', status: 'Completed', details: 'Imported successful.' }];
};

export const generatePortfolioData = (): ProjectSummary[] => {
    return [
        { id: 'PRJ-001', name: 'G+3 Residential', type: 'RCC', location: 'Hyderabad', progress: 65, budget: 4500000, spent: 2900000, status: 'On Track', riskLevel: 'Low' },
        { id: 'PRJ-002', name: 'Industrial Warehouse', type: 'PEB', location: 'Pune', progress: 30, budget: 12000000, spent: 4500000, status: 'Delayed', riskLevel: 'High' },
        { id: 'PRJ-003', name: 'Retaining Wall NH-65', type: 'Retaining Wall', location: 'Vijayawada', progress: 90, budget: 2500000, spent: 2400000, status: 'On Track', riskLevel: 'Low' },
        { id: 'PRJ-004', name: 'Landfill Cell 4', type: 'Landfill', location: 'Dump Yard', progress: 15, budget: 8500000, spent: 1200000, status: 'On Track', riskLevel: 'Medium' },
    ];
};

export const generateApprovalRequests = (): ApprovalRequest[] => {
    return [
        { id: 'REQ-101', subject: 'Structural Drawings GFC', type: 'Drawing', requestedBy: 'Struct. Eng', date: '2024-03-20', status: 'Pending', version: 'R0' },
        { id: 'REQ-102', subject: 'Extra Excavation Works', type: 'Variation', requestedBy: 'Site Eng', date: '2024-03-18', status: 'Approved', version: 'V1', comments: 'Approved as per site condition.' },
        { id: 'REQ-103', subject: 'Cement Vendor Change', type: 'Design', requestedBy: 'Procurement', date: '2024-03-15', status: 'Rejected', version: 'N/A', comments: 'Stick to approved AVL.' },
    ];
};

export const generateConnectionDesign = (): ConnectionResult => {
  return {
    id: 'CONN-01',
    type: 'Moment End Plate',
    members: 'Beam B1 (ISMB 400) to Column C1 (ISHB 350)',
    status: 'Pass',
    utilization: 0.78,
    checks: [
      { check: 'Bolt Shear Capacity', val: 45, limit: 92, status: 'Pass' },
      { check: 'Plate Bearing', val: 88, limit: 120, status: 'Pass' },
      { check: 'Weld Strength', val: 110, limit: 150, status: 'Pass' },
      { check: 'End Plate Bending', val: 15, limit: 18, status: 'Pass' }
    ]
  };
};

export const generateClosureData = (): ClosureDocument[] => {
  return [
    { id: 'CLO-01', name: 'As-Built Structural Drawings (R2)', type: 'As-Built', status: 'Approved' },
    { id: 'CLO-02', name: 'Final Bill Settlement', type: 'Handover', status: 'Pending' },
    { id: 'CLO-03', name: 'Fire NOC Certificate', type: 'NOC', status: 'Submitted' },
    { id: 'CLO-04', name: 'Defect Liability Warranty (12 Months)', type: 'Warranty', status: 'Approved' }
  ];
};

// --- New Part 19: Audit Logs ---
export const generateAuditLogs = (): AuditLog[] => {
    return [
        { id: 'AUD-998', timestamp: '2024-03-21 10:45:22', user: 'Admin', action: 'Model Update', module: 'Structural Analysis', details: 'Changed Beam Section B1 to 300x600', status: 'Success' },
        { id: 'AUD-997', timestamp: '2024-03-21 09:12:10', user: 'Site Eng', action: 'Approve Request', module: 'Procurement', details: 'Approved PO-001 for Cement', status: 'Success' },
        { id: 'AUD-996', timestamp: '2024-03-20 16:30:00', user: 'System', action: 'Auto-Backup', module: 'Database', details: 'Daily snapshot created', status: 'Success' },
        { id: 'AUD-995', timestamp: '2024-03-20 14:15:00', user: 'Designer', action: 'Compliance Check', module: 'Validation', details: 'Failed IS 456 deflection check', status: 'Warning' },
    ];
};

// --- New Part 42: Deployment Status ---
export const getSystemStatus = (): SystemStatus[] => {
    return [
        { component: 'Kratos Solver Engine', status: 'Healthy', latency: 45, uptime: '99.98%' },
        { component: 'AI Inference (Gemini)', status: 'Healthy', latency: 120, uptime: '99.95%' },
        { component: 'Database (PostgreSQL)', status: 'Healthy', latency: 12, uptime: '99.99%' },
        { component: 'Worker Queue (Celery)', status: 'Degraded', latency: 250, uptime: '98.50%' },
    ];
};

export const generateSensorData = (type: string): SensorData[] => [{ id: 'S-1', type: 'Strain', location: 'Col 1', value: 200, unit: 'µε', status: 'Normal', timestamp: '10:00', history: [] }];
export const generateConstructionRisks = (): ConstructionRisk[] => [{ id: 'R-1', category: 'Weather', description: 'Rain', probability: 'High', impact: 'Moderate', mitigation: 'Cover' }];
export const getPlugins = (): Plugin[] => [{ id: 'P-1', name: 'Kratos', version: '9.0', description: 'Solver', author: 'Kratos', status: 'Installed', category: 'Solver' }];
export const runModelValidation = (): ValidationIssue[] => [{ id: 'V-1', type: 'Clash', severity: 'Major', description: 'Beam clash', location: 'Lvl 1', recommendation: 'Move beam' }];
export const generateInventory = (t: string): InventoryItem[] => [{ id: 'I-1', material: 'Cement', unit: 'Bag', stock: 100, required: 200, reorderLevel: 50, status: 'Adequate' }];
export const generateMEP = (w: number, h: number): MEPItem[] => [{ id: 'M-1', type: 'Duct', description: 'AC', start: {x:0,y:0}, end: {x:10,y:10}, width: 5, color: 'blue', clash: false }];

// --- New Part 9/18/23: AI Optimization ---
export const generateOptimizations = (project: Partial<ProjectDetails>): OptimizationSuggestion[] => {
    const suggestions: OptimizationSuggestion[] = [];
    if (project.type === 'RCC') {
        suggestions.push(
            { id: 'OPT-01', category: 'Material', title: 'Upgrade Rebar to Fe550D', description: 'Using higher grade steel can reduce total steel tonnage by up to 12% without compromising strength.', impact: '~₹ 2.1L Savings', status: 'pending' },
            { id: 'OPT-02', category: 'Structural', title: 'Reduce Slab Thickness to 125mm', description: 'Current slab thickness is over-designed for a 15ft span. Reducing to 125mm is adequate as per IS 456.', impact: '~₹ 1.5L Savings', status: 'pending' },
            { id: 'OPT-03', category: 'Material', title: 'Switch to M30 Concrete Grade', description: 'Using M30 for columns can potentially reduce section sizes on lower floors, saving concrete volume.', impact: 'Requires Re-analysis', status: 'pending' }
        );
    } else if (project.type === 'PEB') {
        suggestions.push(
            { id: 'OPT-P1', category: 'Structural', title: 'Use Tapered Rafters', description: 'Using tapered built-up sections instead of standard ISMB profiles can reduce steel weight by 15-20%.', impact: '~₹ 8.5L Savings', status: 'pending' },
            { id: 'OPT-P2', category: 'Structural', title: 'Optimize Purlin Spacing', description: 'Increasing purlin spacing to 1.5m and using a higher gauge purlin can reduce the total number of secondary members.', impact: '~₹ 1.2L Savings', status: 'pending' }
        );
    } else {
        suggestions.push({ id: 'OPT-G1', category: 'Cost', title: 'Source Locally', description: 'Source bulk materials like aggregates from local vendors to reduce transportation costs.', impact: 'Variable Savings', status: 'pending' });
    }
    return suggestions;
};

// Part 14: MIS Data Generation
export const generateMISData = (project: Partial<ProjectDetails>): { eng: EngineeringStatusKPI, proc: ProcurementKPI, safe: SafetyKPI } => {
    return {
        eng: {
            designsCompleted: 8,
            designsPending: 3,
            drawingsIssued: 12,
            revisions: 2,
            designProgress: [
                { name: 'Foundation', completed: 1, total: 1 },
                { name: 'Columns', completed: 4, total: 4 },
                { name: 'Beams', completed: 2, total: 4 },
                { name: 'Slabs', completed: 1, total: 4 },
            ]
        },
        proc: {
            totalPOs: 15,
            totalValue: 1250000,
            activeVendors: 4,
            delayedDeliveries: 1,
            vendorPerformance: [
                { name: 'UltraTech', rating: 4.8 },
                { name: 'Tata Steel', rating: 4.5 },
                { name: 'Local Supply Co', rating: 3.2 },
            ]
        },
        safe: {
            totalInspections: 25,
            passed: 23,
            failed: 2,
            ncrOpen: 2,
            complianceScore: 92
        }
    }
};

export const getActionCosts = (): ActionCost => {
    return {
        analysisRun: 50,
        drawingSheet: 10,
        handoverDossier: 100
    };
};

export const globalSearch = (query: string, project: Partial<ProjectDetails> | null): SearchResult[] => {
    const results: SearchResult[] = [];
    const lowerQuery = query.toLowerCase();

    if (!query) return [];

    // Static Navigation
    const modules: { view: any, title: string, icon: React.ElementType }[] = [
        { view: 'dashboard', title: 'Go to Dashboard', icon: LayoutDashboard },
        { view: 'structure', title: 'Go to Structural Design', icon: HardHat },
        { view: 'reports', title: 'Go to Reports', icon: FileText },
        { view: 'management', title: 'Go to Site Management', icon: CheckSquare },
    ];

    modules.forEach(mod => {
        if (mod.title.toLowerCase().includes(lowerQuery)) {
            results.push({
                id: `nav-${mod.view}`,
                title: mod.title,
                description: `Navigate to the ${mod.title.replace('Go to ', '')} module`,
                category: 'Navigation',
                view: mod.view,
                icon: mod.icon
            });
        }
    });

    // Dynamic Search
    if (project) {
        // Search Members
        generateStructuralMembers(project).forEach(member => {
            if (member.mark.toLowerCase().includes(lowerQuery) || member.type.toLowerCase().includes(lowerQuery)) {
                results.push({
                    id: member.id,
                    title: `${member.mark} (${member.type})`,
                    description: `Level: ${member.level} | Size: ${member.dimensions}`,
                    category: 'Member',
                    view: 'layout', // navigate to modeler view
                    icon: HardHat
                });
            }
        });
        
        // Search Documents
        generateDocuments(project).forEach(doc => {
            if (doc.name.toLowerCase().includes(lowerQuery)) {
                results.push({
                    id: doc.id,
                    title: doc.name,
                    description: `${doc.category} | ${doc.date}`,
                    category: 'Document',
                    view: 'management', // navigate to management view where documents are
                    icon: FileText
                });
            }
        });

        // Search Vendors
        generateProcurementData(project).vendors.forEach(vendor => {
            if (vendor.name.toLowerCase().includes(lowerQuery)) {
                results.push({
                    id: vendor.id,
                    title: vendor.name,
                    description: `Category: ${vendor.category} | Rating: ${vendor.rating} ★`,
                    category: 'Vendor',
                    view: 'procurement',
                    icon: Users
                });
            }
        });
    }

    return results.slice(0, 10); // Limit results
};


// Part 39: AI Design Studio
export const getAiDesignFlow = (): AiDesignStep[] => {
    return [
        { id: 1, question: "What are the plot dimensions? (e.g., 40ft x 60ft)", action: 'INPUT', status: 'active' },
        { id: 2, question: "Okay, generating a 40x60ft plot boundary.", action: 'GENERATE', payload: { type: 'boundary', w: 40, h: 60 }, status: 'pending' },
        { id: 3, question: "How many floors do you need (e.g., G+2)?", action: 'INPUT', status: 'pending' },
        { id: 4, question: "Got it. Generating a 3x2 column grid suitable for G+2.", action: 'GENERATE', payload: { type: 'grid', cols: 3, rows: 2 }, status: 'pending' },
        { id: 5, question: "Confirm this basic structural layout?", action: 'CONFIRM', status: 'pending' },
        { id: 6, question: "Great! Your preliminary model is ready. You can now proceed to detailed analysis.", action: 'GENERATE', payload: { type: 'finalize' }, status: 'pending' },
    ];
};
