
import { ProjectDetails, BOQItem, PhaseItem, TaskItem, DocumentItem, RABill, FinancialStats, StructuralMember, QualityChecklist, SafetyStat, RateAnalysisItem, Vendor, PurchaseOrder, ReportItem, RFQ, SitePhoto, MeasurementEntry, BBSItem, ComplianceCheck, ImportJob, DesignCalcStep, SensorData, ConstructionRisk, Plugin, ValidationIssue } from '../types';

// --- CORE ENGINEERING LOGIC ---

// Helper: Calculate grid layout and member counts based on dimensions
const getStructuralModel = (project: Partial<ProjectDetails>) => {
  const L = project.dimensions?.length || 0;
  const W = project.dimensions?.width || 0;
  const stories = project.stories || 1;
  
  // Grid Logic: Max span approx 15ft (4.5m)
  const bayX = Math.ceil(L / 15);
  const bayY = Math.ceil(W / 15);
  const colsX = bayX + 1;
  const colsY = bayY + 1;
  const totalCols = colsX * colsY;
  
  // Beam Logic: Plinth + Floor beams
  const totalBeamsX = colsY * bayX;
  const totalBeamsY = colsX * bayY;
  const totalBeamsPerFloor = totalBeamsX + totalBeamsY;

  return { colsX, colsY, totalCols, totalBeamsPerFloor, stories };
};

export const generateStructuralMembers = (project: Partial<ProjectDetails>): StructuralMember[] => {
  const { totalCols, totalBeamsPerFloor, stories } = getStructuralModel(project);
  const isPEB = project.type === 'PEB' || project.type === 'Steel';
  const isRetainingWall = project.type === 'Retaining Wall';
  const isWaterTank = project.type === 'Water Tank';
  const isLandfill = project.type === 'Landfill';
  
  const members: StructuralMember[] = [];

  if (isRetainingWall) {
    const length = project.dimensions?.length || 30; // Length of wall
    const height = project.dimensions?.width || 12; // Height stored in width
    
    members.push({
      id: 'M-01', type: 'Wall Stem', mark: 'RW-Stem', count: 1,
      dimensions: `Top 200mm / Bot 450mm`, reinforcement: '16Φ @ 150 c/c Main',
      concreteVol: (0.325 * height * 0.3 * length), 
      steelWeight: length * height * 12, 
      level: 'Stem'
    });
    members.push({
      id: 'M-02', type: 'Base Slab', mark: 'RW-Base', count: 1,
      dimensions: `${(height*0.6).toFixed(1)}ft Wide x 500mm Thk`, reinforcement: '12Φ @ 150 c/c Mesh',
      concreteVol: (height * 0.6 * 0.3 * 0.5 * length),
      steelWeight: length * (height * 0.6) * 10,
      level: 'Foundation'
    });

  } else if (isWaterTank) {
      const capacity = (project.dimensions?.length || 10) * (project.dimensions?.width || 10) * 1000; // Approx liters
      const diameter = project.dimensions?.length || 15;
      const height = project.dimensions?.width || 10;
      
      members.push({
        id: 'M-01', type: 'Base Slab', mark: 'TB-1', count: 1,
        dimensions: '400mm Thk (Circular)', reinforcement: '12Φ @ 100 c/c Mesh',
        concreteVol: (Math.PI * Math.pow(diameter/2, 2) * 0.4 * 0.028), // ft to m approx
        steelWeight: 1200,
        level: 'Base'
      });
      members.push({
        id: 'M-02', type: 'Tank Wall', mark: 'TW-1', count: 1,
        dimensions: '300mm Thk', reinforcement: '16Φ hoop @ 120 c/c',
        concreteVol: (Math.PI * diameter * height * 0.3 * 0.028),
        steelWeight: 2500,
        level: 'Wall'
      });
      members.push({
        id: 'M-03', type: 'Top Dome', mark: 'TD-1', count: 1,
        dimensions: '120mm Thk', reinforcement: '8Φ @ 150 c/c',
        concreteVol: (Math.PI * Math.pow(diameter/2, 2) * 0.12 * 0.028),
        steelWeight: 600,
        level: 'Roof'
      });

  } else if (isLandfill) {
       const area = (project.dimensions?.length || 100) * (project.dimensions?.width || 100);
       
       members.push({
         id: 'M-01', type: 'Liner', mark: 'GCL-1', count: 1,
         dimensions: 'GCL + 1.5mm HDPE', reinforcement: 'N/A',
         concreteVol: 0,
         steelWeight: 0,
         level: 'Base'
       });
        members.push({
         id: 'M-02', type: 'Beam', mark: 'Anchor Trench', count: 1,
         dimensions: '500x500mm', reinforcement: 'Nominal',
         concreteVol: (area * 0.01), // Small concrete work
         steelWeight: 200,
         level: 'Perimeter'
       });

  } else if (isPEB) {
     members.push({
       id: 'M-01', type: 'Column', mark: 'MC-1', count: totalCols, 
       dimensions: 'ISMB 450 (Tapered)', reinforcement: 'N/A', 
       concreteVol: 0, steelWeight: totalCols * stories * 180, level: 'All'
     });
     members.push({
       id: 'M-02', type: 'Beam', mark: 'R-1', count: totalBeamsPerFloor, 
       dimensions: 'ISMB 350 (Rafter)', reinforcement: 'N/A', 
       concreteVol: 0, steelWeight: totalBeamsPerFloor * stories * 120, level: 'Roof'
     });

  } else {
    // RCC
    const colSize = stories > 3 ? '300x600' : '230x450';
    const colVol = (stories > 3 ? 0.3*0.6 : 0.23*0.45) * 3 * totalCols * stories;
    const beamSize = '230x450';
    const beamVol = (0.23*0.45) * 4.5 * totalBeamsPerFloor * stories;

    members.push({
      id: 'M-01', type: 'Footing', mark: 'F1', count: totalCols, 
      dimensions: '1800x1800x500', reinforcement: '12Φ @ 150 c/c', 
      concreteVol: (1.8*1.8*0.5)*totalCols, steelWeight: totalCols * 85, level: 'Foundation'
    });
    members.push({
      id: 'M-02', type: 'Column', mark: 'C1', count: totalCols, 
      dimensions: colSize, reinforcement: stories > 3 ? '8-20Φ' : '6-16Φ', 
      concreteVol: colVol, steelWeight: colVol * 180, level: 'All Floors'
    });
    members.push({
      id: 'M-03', type: 'Beam', mark: 'B1', count: totalBeamsPerFloor, 
      dimensions: beamSize, reinforcement: '3-16Φ Top + 3-20Φ Bot', 
      concreteVol: beamVol, steelWeight: beamVol * 140, level: 'All Floors'
    });
    members.push({
       id: 'M-04', type: 'Slab', mark: 'S1', count: stories, 
       dimensions: '150mm Thk', reinforcement: '8Φ @ 150 c/c Main', 
       concreteVol: (project.dimensions?.length||0)*(project.dimensions?.width||0)*0.15*0.092 * stories,
       steelWeight: 0, level: 'All Floors'
    });
  }
  return members;
};

// --- Design Report Generator (Part 9) ---
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
  // Default to Column if not beam
  return [
      { id: '1', stepName: 'Factored Loads', reference: 'Analysis', description: 'Axial Load & Moments', formula: 'Pu, Mux, Muy', substitution: 'From Load Combo 1.5(DL+LL)', result: 'Pu=1200kN, Mu=45kNm', status: 'Info' },
      { id: '2', stepName: 'Slenderness Check', reference: 'IS 456 Cl 25.1.2', description: 'Effective Length Ratio', formula: 'Lex/D, Ley/b', substitution: '3000/450', result: '6.66 < 12 (Short Column)', status: 'Pass' },
      { id: '3', stepName: 'Min Eccentricity', reference: 'IS 456 Cl 25.4', description: 'Minimum Eccentricity', formula: 'emin = L/500 + D/30', substitution: '3000/500 + 450/30', result: '21 mm', status: 'Info' },
      { id: '4', stepName: 'Capacity Check', reference: 'IS 456 Cl 39.3', description: 'Pure Axial Capacity', formula: 'Pu = 0.4 fck Ac + 0.67 fy Asc', substitution: '0.4*25*132000 + 0.67*500*2200', result: '2057 kN > 1200 kN', status: 'Pass' },
  ];
};

// --- Bar Bending Schedule Logic ---
export const generateBBS = (project: Partial<ProjectDetails>): BBSItem[] => {
    const isPEB = project.type === 'PEB' || project.type === 'Steel';
    if (isPEB || project.type === 'Landfill') return [];

    const members = generateStructuralMembers(project);
    const bbs: BBSItem[] = [];
    
    // Weight constants (kg/m)
    const unitWeights: Record<number, number> = {
        8: 0.395,
        10: 0.617,
        12: 0.888,
        16: 1.58,
        20: 2.47,
        25: 3.85
    };

    members.forEach(member => {
        if (member.type === 'Column') {
            const h = (project.stories || 1) * 3; // 3m per floor
            // Main bars
            bbs.push({
                barMark: '01', memberId: member.mark, description: 'Main Vertical Bars',
                diameter: 16, shapeCode: '00', noOfBars: member.count * 6, // 6 bars per col
                cutLength: h + 1, // +1m lap/embedment
                totalLength: (h + 1) * member.count * 6,
                unitWeight: unitWeights[16],
                totalWeight: (h + 1) * member.count * 6 * unitWeights[16],
                shapeParams: { a: (h + 1) * 1000, b: 0 }
            });
            // Stirrups (Ties)
            const spacing = 0.15; // 150mm
            const stirrupCount = Math.ceil(h / spacing);
            const w = 230 - 80; // cover
            const d = 450 - 80;
            const len = 2 * (w + d) + 0.1; // hook
            bbs.push({
                barMark: '02', memberId: member.mark, description: 'Lateral Ties (Stirrups)',
                diameter: 8, shapeCode: '21', noOfBars: member.count * stirrupCount,
                cutLength: len / 1000, 
                totalLength: (len / 1000) * member.count * stirrupCount,
                unitWeight: unitWeights[8],
                totalWeight: (len / 1000) * member.count * stirrupCount * unitWeights[8],
                shapeParams: { a: w, b: d }
            });
        }
        else if (member.type === 'Beam') {
             // Main Bottom
             const span = 4.5; // Avg span
             bbs.push({
                barMark: '03', memberId: member.mark, description: 'Bottom Main Bars',
                diameter: 20, shapeCode: '41', noOfBars: member.count * 3,
                cutLength: span + 0.6, // L bends
                totalLength: (span + 0.6) * member.count * 3,
                unitWeight: unitWeights[20],
                totalWeight: (span + 0.6) * member.count * 3 * unitWeights[20],
                shapeParams: { a: 300, b: span * 1000, c: 300 }
            });
        }
        else if (member.type === 'Footing') {
            const L = 1.8;
            const B = 1.8;
            // Mat X
            bbs.push({
                barMark: '04', memberId: member.mark, description: 'Base Mat X-Dir',
                diameter: 12, shapeCode: '41', noOfBars: member.count * Math.ceil(L/0.15),
                cutLength: B + 0.4, // L bends up
                totalLength: (B + 0.4) * member.count * Math.ceil(L/0.15),
                unitWeight: unitWeights[12],
                totalWeight: (B + 0.4) * member.count * Math.ceil(L/0.15) * unitWeights[12],
                shapeParams: { a: 200, b: B * 1000, c: 200 }
            });
        }
    });

    return bbs;
};


export const calculateProjectStats = (project: Partial<ProjectDetails>) => {
  const length = project.dimensions?.length || 0;
  const width = project.dimensions?.width || 0;
  const stories = project.stories || 1;
  const footprint = length * width;
  let area = footprint * stories;
  
  if (project.type === 'Retaining Wall') area = length * width; // Wall face area roughly
  if (project.type === 'Water Tank') area = Math.PI * (length/2) * (length/2); // Plan area
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

  return {
    area,
    footprint,
    ratePerSqFt,
    estimatedCost: totalCost,
    duration: Math.ceil(duration)
  };
};

export const generateBOQ = (project: Partial<ProjectDetails>): BOQItem[] => {
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
      { id: 'CIV-002', category: 'Civil', description: 'Leachate Collection System', unit: 'Rm', quantity: Math.ceil(Math.sqrt(area) * 2), rate: 1500, amount: Math.ceil(Math.sqrt(area) * 2) * 1500 },
      { id: 'CIV-003', category: 'Civil', description: 'Anchor Trench Concrete', unit: 'Cum', quantity: 25, rate: 6500, amount: 25 * 6500 }
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

// Helper for date formatting
const addWeeks = (dateStr: string | undefined, weeks: number) => {
  const date = dateStr ? new Date(dateStr) : new Date();
  const result = new Date(date);
  result.setDate(result.getDate() + weeks * 7);
  return result.toISOString().split('T')[0];
};

export const generateSchedule = (project: Partial<ProjectDetails>): { phases: PhaseItem[], tasks: TaskItem[] } => {
  const isPEB = project.type === 'PEB' || project.type === 'Steel';
  const isWall = project.type === 'Retaining Wall';
  const isTank = project.type === 'Water Tank';
  const isLandfill = project.type === 'Landfill';
  const startDate = project.startDate; 

  let phases: PhaseItem[] = [];
  let tasks: TaskItem[] = [];

  if (isLandfill) {
     phases = [
      { name: 'Site Clearance', start: addWeeks(startDate, 0), end: addWeeks(startDate, 2), status: 'completed', progress: 100 },
      { name: 'Earthwork Excavation', start: addWeeks(startDate, 2), end: addWeeks(startDate, 6), status: 'in-progress', progress: 60 },
      { name: 'Base Liner (GCL) Installation', start: addWeeks(startDate, 6), end: addWeeks(startDate, 8), status: 'pending', progress: 0 },
      { name: 'HDPE Geomembrane Installation', start: addWeeks(startDate, 8), end: addWeeks(startDate, 10), status: 'pending', progress: 0 },
      { name: 'Leachate Collection Pipes', start: addWeeks(startDate, 10), end: addWeeks(startDate, 12), status: 'pending', progress: 0 },
    ];
    tasks = [
       { id: 1, title: 'Check Subgrade Compaction', due: addWeeks(startDate, 5), priority: 'High', status: 'Pending' },
       { id: 2, title: 'Procure HDPE Liner Rolls', due: addWeeks(startDate, 4), priority: 'High', status: 'Done' }
    ];
  } else if (isTank) {
      phases = [
      { name: 'Excavation & PCC', start: addWeeks(startDate, 0), end: addWeeks(startDate, 2), status: 'completed', progress: 100 },
      { name: 'Base Slab Casting', start: addWeeks(startDate, 2), end: addWeeks(startDate, 4), status: 'in-progress', progress: 90 },
      { name: 'Wall Shuttering & Casting', start: addWeeks(startDate, 4), end: addWeeks(startDate, 8), status: 'pending', progress: 0 },
      { name: 'Dome Shuttering & Casting', start: addWeeks(startDate, 8), end: addWeeks(startDate, 10), status: 'pending', progress: 0 },
      { name: 'Waterproofing & Testing', start: addWeeks(startDate, 10), end: addWeeks(startDate, 12), status: 'pending', progress: 0 },
    ];
    tasks = [
       { id: 1, title: 'Install Water Stoppers in Kicker', due: addWeeks(startDate, 3), priority: 'High', status: 'Done' },
       { id: 2, title: 'Hydrostatic Leak Test', due: addWeeks(startDate, 11), priority: 'High', status: 'Pending' }
    ];
  } else if (isWall) {
    phases = [
      { name: 'Geotech Investigation', start: addWeeks(startDate, 0), end: addWeeks(startDate, 2), status: 'completed', progress: 100 },
      { name: 'Excavation & PCC', start: addWeeks(startDate, 2), end: addWeeks(startDate, 4), status: 'in-progress', progress: 80 },
      { name: 'Base Slab Casting', start: addWeeks(startDate, 4), end: addWeeks(startDate, 6), status: 'pending', progress: 0 },
      { name: 'Stem Wall Shuttering', start: addWeeks(startDate, 6), end: addWeeks(startDate, 8), status: 'pending', progress: 0 },
      { name: 'Stem Wall Casting', start: addWeeks(startDate, 8), end: addWeeks(startDate, 10), status: 'pending', progress: 0 },
      { name: 'Backfilling & Compaction', start: addWeeks(startDate, 10), end: addWeeks(startDate, 12), status: 'pending', progress: 0 },
    ];
    tasks = [
       { id: 1, title: 'Check Soil Density', due: addWeeks(startDate, 1), priority: 'High', status: 'Done' },
       { id: 2, title: 'Approve Reinforcement Shop Drawing', due: addWeeks(startDate, 2), priority: 'High', status: 'Done' },
       { id: 3, title: 'Pour PCC for Base', due: addWeeks(startDate, 3), priority: 'Medium', status: 'In Progress' }
    ];
  } else if (isPEB) {
    phases = [
    { name: 'Design & Engineering', start: addWeeks(startDate, 0), end: addWeeks(startDate, 3), status: 'completed', progress: 100 },
    { name: 'Foundation Civil Works', start: addWeeks(startDate, 2), end: addWeeks(startDate, 6), status: 'in-progress', progress: 75 },
    { name: 'Steel Fabrication (Factory)', start: addWeeks(startDate, 3), end: addWeeks(startDate, 8), status: 'in-progress', progress: 45 },
    { name: 'Material Delivery', start: addWeeks(startDate, 8), end: addWeeks(startDate, 9), status: 'pending', progress: 0 },
    { name: 'Erection & Installation', start: addWeeks(startDate, 9), end: addWeeks(startDate, 14), status: 'pending', progress: 0 },
    { name: 'Sheeting & Finishing', start: addWeeks(startDate, 14), end: addWeeks(startDate, 16), status: 'pending', progress: 0 },
    ];
    tasks = [
    { id: 1, title: 'Approve Anchor Bolt Setting Plan', due: addWeeks(startDate, 1), priority: 'High', status: 'Done' },
    { id: 2, title: 'Release Fabrication Drawings', due: addWeeks(startDate, 2), priority: 'High', status: 'Done' },
    { id: 3, title: 'Inspect Foundation Reinforcement', due: addWeeks(startDate, 5), priority: 'High', status: 'Pending' },
    { id: 4, title: 'Finalize Roof Color Selection', due: addWeeks(startDate, 7), priority: 'Low', status: 'Pending' }
    ];
  } else {
    phases = [
    { name: 'Architectural & Struct. Design', start: addWeeks(startDate, -4), end: addWeeks(startDate, 0), status: 'completed', progress: 100 },
    { name: 'Excavation & Footings', start: addWeeks(startDate, 0), end: addWeeks(startDate, 4), status: 'completed', progress: 100 },
    { name: 'Plinth Beam & Backfilling', start: addWeeks(startDate, 4), end: addWeeks(startDate, 6), status: 'in-progress', progress: 60 },
    { name: 'Column & Slab Casting (G+)', start: addWeeks(startDate, 6), end: addWeeks(startDate, 16), status: 'pending', progress: 0 },
    { name: 'Brickwork & Plastering', start: addWeeks(startDate, 16), end: addWeeks(startDate, 24), status: 'pending', progress: 0 },
    { name: 'Flooring & Finishing', start: addWeeks(startDate, 24), end: addWeeks(startDate, 30), status: 'pending', progress: 0 },
    ];
    tasks = [
    { id: 1, title: 'Soil Bearing Capacity Report', due: addWeeks(startDate, -3), priority: 'High', status: 'Done' },
    { id: 2, title: 'Structural Drawing Release (GFC)', due: addWeeks(startDate, -1), priority: 'High', status: 'Done' },
    { id: 3, title: 'Procure Cement (Initial 200 Bags)', due: addWeeks(startDate, 5), priority: 'High', status: 'In Progress' },
    { id: 4, title: 'Mark Centerlines for Columns', due: addWeeks(startDate, 6), priority: 'Medium', status: 'Pending' }
    ];
  }

  return { phases, tasks };
};

export const generateDocuments = (project: Partial<ProjectDetails>): DocumentItem[] => {
  const type = project.type || 'RCC';
  const startDate = project.startDate;
  
  const docs: DocumentItem[] = [
      { id: 'DOC-001', name: 'Architectural Floor Plans', type: 'DWG', category: 'Architectural', date: addWeeks(startDate, -2), size: '2.4 MB', status: 'Approved' },
      { id: 'DOC-002', name: 'Soil Investigation Report', type: 'PDF', category: 'Reports', date: addWeeks(startDate, -3), size: '4.1 MB', status: 'Approved' },
  ];

  if (type === 'Retaining Wall') {
     docs.push(
          { id: 'DOC-003', name: 'Stability Analysis Report', type: 'PDF', category: 'Structural', date: addWeeks(startDate, 0), size: '1.2 MB', status: 'Approved' },
          { id: 'DOC-004', name: 'Wall Reinforcement Details', type: 'DWG', category: 'Structural', date: addWeeks(startDate, 1), size: '2.5 MB', status: 'Pending' }
     );
  } else if (type === 'Water Tank') {
      docs.push(
          { id: 'DOC-003', name: 'Tank Structural Design (IS 3370)', type: 'PDF', category: 'Structural', date: addWeeks(startDate, 0), size: '1.5 MB', status: 'Approved' },
          { id: 'DOC-004', name: 'Plumbing & Nozzle Layout', type: 'DWG', category: 'Architectural', date: addWeeks(startDate, 1), size: '1.8 MB', status: 'Approved' }
      );
  } else if (type === 'Landfill') {
      docs.push(
          { id: 'DOC-003', name: 'Liner System Details', type: 'DWG', category: 'Structural', date: addWeeks(startDate, 1), size: '4.2 MB', status: 'Approved' },
          { id: 'DOC-004', name: 'Environmental Impact Assessment', type: 'PDF', category: 'Reports', date: addWeeks(startDate, -1), size: '12.5 MB', status: 'Approved' }
      );
  } else if (type === 'PEB' || type === 'Steel') {
      docs.push(
          { id: 'DOC-003', name: 'Anchor Bolt Setting Plan', type: 'DWG', category: 'Structural', date: addWeeks(startDate, 1), size: '1.2 MB', status: 'Approved' },
          { id: 'DOC-004', name: 'Primary Frame Analysis', type: 'PDF', category: 'Reports', date: addWeeks(startDate, 0), size: '8.5 MB', status: 'Approved' },
          { id: 'DOC-005', name: 'Fabrication Drawings (Rafters)', type: 'DWG', category: 'Structural', date: addWeeks(startDate, 2), size: '12.4 MB', status: 'Pending' }
      );
  } else {
      docs.push(
          { id: 'DOC-003', name: 'Structural Framing Plan', type: 'DWG', category: 'Structural', date: addWeeks(startDate, 0), size: '3.5 MB', status: 'Approved' },
          { id: 'DOC-004', name: 'Column & Footing Details', type: 'DWG', category: 'Structural', date: addWeeks(startDate, 1), size: '2.8 MB', status: 'Approved' },
          { id: 'DOC-005', name: 'Concrete Mix Design (M25)', type: 'PDF', category: 'Reports', date: addWeeks(startDate, 2), size: '1.1 MB', status: 'Approved' }
      );
  }
  return docs;
}

export const generateFinancials = (project: Partial<ProjectDetails>): { stats: FinancialStats, bills: RABill[] } => {
  const stats = calculateProjectStats(project);
  const totalCost = stats.estimatedCost;
  const startDate = project.startDate;

  const billedValue = totalCost * 0.35;
  const receivedValue = totalCost * 0.28;

  const financialStats: FinancialStats = {
    contractValue: totalCost,
    billedValue: billedValue,
    receivedValue: receivedValue,
    outstandingValue: billedValue - receivedValue
  };

  const bills: RABill[] = [
    {
      id: 'RA-01',
      billNo: 'RA/2024/001',
      date: addWeeks(startDate, 2),
      description: 'Mobilization Advance & Initial Excavation',
      claimedAmount: totalCost * 0.10,
      approvedAmount: totalCost * 0.10,
      status: 'Paid'
    },
    {
      id: 'RA-02',
      billNo: 'RA/2024/002',
      date: addWeeks(startDate, 5),
      description: project.type === 'PEB' ? 'Foundation Bolt Casting & Anchor Setting' : 'Foundation PCC & Footing Casting',
      claimedAmount: totalCost * 0.15,
      approvedAmount: totalCost * 0.15,
      status: 'Paid'
    },
    {
      id: 'RA-03',
      billNo: 'RA/2024/003',
      date: addWeeks(startDate, 8),
      description: project.type === 'PEB' ? 'Supply of Primary Steel Members' : 'Plinth Beam & G.F. Column Starter',
      claimedAmount: totalCost * 0.12,
      approvedAmount: 0,
      status: 'Processing'
    }
  ];

  return { stats: financialStats, bills };
};

export const generateQualityData = (project: Partial<ProjectDetails>): { checklists: QualityChecklist[], stats: SafetyStat } => {
    const startDate = project.startDate;
    const isPEB = project.type === 'PEB' || project.type === 'Steel';

    const checklists: QualityChecklist[] = [
        { id: 'QC-101', title: 'Pre-Pour Inspection: Footings', location: 'Grid A-1 to A-5', date: addWeeks(startDate, 4), inspector: 'Eng. Rajesh', status: 'Passed', type: 'QA' },
        { id: 'QC-102', title: 'Material Inspection: Cement Batch 45', location: 'Store', date: addWeeks(startDate, 5), inspector: 'Eng. Rajesh', status: 'Passed', type: 'QA' },
        { id: 'HSE-001', title: 'Site Safety Induction', location: 'Gate 1', date: addWeeks(startDate, 1), inspector: 'Safety Officer', status: 'Passed', type: 'HSE' },
    ];

    if (isPEB) {
        checklists.push(
            { id: 'QC-201', title: 'Anchor Bolt Survey', location: 'All Grids', date: addWeeks(startDate, 6), inspector: 'Surveyor', status: 'Pending', type: 'QA' },
            { id: 'HSE-002', title: 'Crane Lifting Plan Approval', location: 'Yard', date: addWeeks(startDate, 8), inspector: 'Safety Officer', status: 'Pending', type: 'HSE' }
        );
    } else {
        checklists.push(
            { id: 'QC-201', title: 'Formwork Checking: Plinth Beam', location: 'Zone B', date: addWeeks(startDate, 6), inspector: 'Eng. Kumar', status: 'Pending', type: 'QA' },
            { id: 'HSE-002', title: 'Excavation Shoring Inspection', location: 'Boundary', date: addWeeks(startDate, 3), inspector: 'Safety Officer', status: 'Passed', type: 'HSE' }
        );
    }

    const stats: SafetyStat = {
        safeManHours: 12450,
        incidents: 0,
        nearMisses: 2,
        lastIncidentDate: 'N/A'
    };

    return { checklists, stats };
};

export const generateSitePhotos = (project: Partial<ProjectDetails>): SitePhoto[] => {
    const startDate = project.startDate;
    return [
        { id: 'IMG-001', url: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&q=80&w=400', caption: 'Initial Site Clearance', date: addWeeks(startDate, 0), uploadedBy: 'Site Eng. 1', tags: ['Site', 'Civil'] },
        { id: 'IMG-002', url: 'https://images.unsplash.com/photo-1590486803833-1c5dc8ddd4c8?auto=format&fit=crop&q=80&w=400', caption: 'Excavation in Progress', date: addWeeks(startDate, 2), uploadedBy: 'Site Eng. 1', tags: ['Civil', 'Excavation'] },
        { id: 'IMG-003', url: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&q=80&w=400', caption: 'Rebar Stockpile', date: addWeeks(startDate, 3), uploadedBy: 'Store Keeper', tags: ['Material', 'Steel'] },
        { id: 'IMG-004', url: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&q=80&w=400', caption: 'Footing Reinforcement', date: addWeeks(startDate, 4), uploadedBy: 'QA/QC', tags: ['QA', 'Structure'] },
    ];
};

export const generateRateAnalysis = (projectType: string | undefined): RateAnalysisItem[] => {
    const isPEB = projectType === 'PEB' || projectType === 'Steel';
    const isWall = projectType === 'Retaining Wall';
    const isTank = projectType === 'Water Tank';

    if (isTank) {
        return [{
            itemId: 'CON-105', description: 'M30 Waterproof Concrete', totalRate: 7800, unit: 'Cum',
            components: {
                material: [{ name: 'Cement (OPC)', unit: 'Bags', quantity: 8.5, unitRate: 380, amount: 3230 }, { name: 'Waterproofing Admixture', unit: 'Ltr', quantity: 2, unitRate: 250, amount: 500 }],
                labor: [{ name: 'Skilled Masons', unit: 'Day', quantity: 0.5, unitRate: 1200, amount: 600 }],
                machinery: [{ name: 'Pump', unit: 'Hr', quantity: 0.2, unitRate: 2500, amount: 500 }]
            }
        }];
    }

    if(isWall) {
       return [
        {
            itemId: 'CON-101', description: 'RCC M30 Wall Concrete', totalRate: 7500, unit: 'Cum',
            components: {
                material: [{ name: 'Cement (OPC 53)', unit: 'Bags', quantity: 8.5, unitRate: 380, amount: 3230 }, { name: 'Aggregates', unit: 'Cft', quantity: 30, unitRate: 45, amount: 1350 }],
                labor: [{ name: 'Shuttering Gang', unit: 'Sqm', quantity: 2, unitRate: 450, amount: 900 }, { name: 'Pouring Gang', unit: 'Cum', quantity: 1, unitRate: 850, amount: 850 }],
                machinery: [{ name: 'Boom Placer', unit: 'Cum', quantity: 1, unitRate: 800, amount: 800 }]
            }
        }
       ];
    }

    if (isPEB) {
        return [
            {
                itemId: 'STL-101', description: 'Structural Steel Supply & Fabrication (IS 2062)', totalRate: 85000, unit: 'MT',
                components: {
                    material: [{ name: 'Raw Steel Plates/Sections', unit: 'MT', quantity: 1.05, unitRate: 62000, amount: 65100 }, { name: 'Consumables (Welding, Paint)', unit: 'Ls', quantity: 1, unitRate: 2500, amount: 2500 }],
                    labor: [{ name: 'Fabrication Labour', unit: 'MT', quantity: 1, unitRate: 8000, amount: 8000 }],
                    machinery: [{ name: 'Factory Overheads & Power', unit: 'MT', quantity: 1, unitRate: 4000, amount: 4000 }, { name: 'Transport to Site', unit: 'MT', quantity: 1, unitRate: 1500, amount: 1500 }]
                }
            }
        ];
    }

    return [
        {
            itemId: 'CON-102', description: 'RCC M25 Concrete (Design Mix)', totalRate: 7200, unit: 'Cum',
            components: {
                material: [{ name: 'Cement (OPC 53)', unit: 'Bags', quantity: 8.2, unitRate: 380, amount: 3116 }, { name: 'River Sand / M-Sand', unit: 'Cft', quantity: 15, unitRate: 65, amount: 975 }, { name: 'Aggregate (20mm)', unit: 'Cft', quantity: 28, unitRate: 45, amount: 1260 }, { name: 'Admixture', unit: 'Ltr', quantity: 1.5, unitRate: 120, amount: 180 }],
                labor: [{ name: 'Mason & Helper Gang', unit: 'Cum', quantity: 1, unitRate: 850, amount: 850 }],
                machinery: [{ name: 'Concrete Mixer / Pump', unit: 'Cum', quantity: 1, unitRate: 600, amount: 600 }, { name: 'Vibrator', unit: 'Cum', quantity: 1, unitRate: 50, amount: 50 }]
            }
        }
    ];
};

export const generateProcurementData = (project: Partial<ProjectDetails>): { vendors: Vendor[], orders: PurchaseOrder[], rfqs: RFQ[] } => {
    const isPEB = project.type === 'PEB' || project.type === 'Steel';
    const startDate = project.startDate;
    const boq = generateBOQ(project);

    // Vendors
    const vendors: Vendor[] = [
        { id: 'V-001', name: 'UltraTech Cement Ltd.', category: 'Cement', rating: 4.8, contact: 'Sales Manager (+91 9876543210)', status: 'Active' },
        { id: 'V-002', name: 'Tata Steel (Tiscon)', category: 'Steel', rating: 4.9, contact: 'Distributor Hyd', status: 'Active' },
        { id: 'V-003', name: 'Local Sand & Aggregates', category: 'Aggregates', rating: 3.5, contact: 'Raju Supplier', status: 'Active' },
        { id: 'V-004', name: 'Kirby Building Systems', category: 'PEB Fabricator', rating: 4.7, contact: 'Projects Division', status: 'Active' },
        { id: 'V-005', name: 'Asian Paints', category: 'Finishing', rating: 4.6, contact: 'Local Dealer', status: 'Active' },
    ];

    // Orders Logic
    const orders: PurchaseOrder[] = [];

    if (isPEB) {
        // Find Steel Quantity
        const steelItem = boq.find(b => b.id === 'STL-101');
        if (steelItem) {
            orders.push({
                id: 'PO-24-101', poNumber: 'PO/24/005', vendorId: 'V-002', vendorName: 'Tata Steel (Plates div)',
                material: 'IS 2062 Plates (Various Thk)', quantity: Math.ceil(steelItem.quantity * 1.05), unit: 'MT', 
                rate: 62000, amount: Math.ceil(steelItem.quantity * 1.05) * 62000, 
                orderDate: addWeeks(startDate, 1), deliveryDate: addWeeks(startDate, 3), status: 'Delivered'
            });
        }
    } else {
        // RCC
        const concreteItem = boq.find(b => b.id === 'CON-102') || boq.find(b => b.id === 'CON-101');
        if (concreteItem) {
            // Cement
            const cementBags = Math.ceil(concreteItem.quantity * 8.2); // 8.2 bags per cum
            orders.push({
                id: 'PO-24-201', poNumber: 'PO/24/001', vendorId: 'V-001', vendorName: 'UltraTech Cement Ltd.',
                material: 'OPC 53 Grade Cement', quantity: cementBags, unit: 'Bags',
                rate: 380, amount: cementBags * 380,
                orderDate: addWeeks(startDate, 2), deliveryDate: addWeeks(startDate, 3), status: 'Partial'
            });
        }
    }

    const rfqs: RFQ[] = [
        {
            id: 'RFQ-001', rfqNo: 'RFQ/24/052', title: 'Supply of Cement (Bulk Order)', items: 'OPC 53 Grade Cement',
            floatDate: addWeeks(startDate, 1), dueDate: addWeeks(startDate, 2), status: 'Evaluated',
            bids: [
                { vendorId: 'V-001', vendorName: 'UltraTech Cement', amount: 380, rank: 'L1', submissionDate: addWeeks(startDate, 2) },
                { vendorId: 'V-006', vendorName: 'ACC Cement', amount: 395, rank: 'L3', submissionDate: addWeeks(startDate, 2) },
                { vendorId: 'V-007', vendorName: 'Bharathi Cement', amount: 385, rank: 'L2', submissionDate: addWeeks(startDate, 2) }
            ]
        }
    ];

    return { vendors, orders, rfqs };
};

export const generateReports = (project: Partial<ProjectDetails>): ReportItem[] => {
  const startDate = project.startDate;
  
  return [
    {
      id: 'RPT-001', title: 'Detailed Project Report (DPR)', description: 'Comprehensive project summary, technical specs, and financial projections.',
      type: 'PDF', date: addWeeks(startDate, 0), size: '12.5 MB', category: 'General', status: 'Ready'
    },
    {
      id: 'RPT-002', title: 'Structural Design Analysis', description: 'FEA results, member forces, deflection checks, and design basis.',
      type: 'PDF', date: addWeeks(startDate, 1), size: '8.2 MB', category: 'Engineering', status: 'Ready'
    },
    {
      id: 'RPT-003', title: 'Bill of Quantities (BOQ)', description: 'Itemized material and labor cost estimation with rate analysis.',
      type: 'XLSX', date: addWeeks(startDate, 1), size: '1.4 MB', category: 'Commercial', status: 'Ready'
    }
  ];
};

export const generateMeasurementBook = (project: Partial<ProjectDetails>): MeasurementEntry[] => {
    const startDate = project.startDate;
    const entries: MeasurementEntry[] = [];
    const isPEB = project.type === 'PEB' || project.type === 'Steel';
    
    // Sample MB Entries derived from basic BOQ logic
    if (isPEB) {
        entries.push(
            { id: 'MB-101', date: addWeeks(startDate, 5), boqRef: 'CIV-001', description: 'Excavation for Column Footing Grid A1', location: 'Grid A1', nos: 1, length: 2.5, breadth: 2.5, depth: 1.8, quantity: 11.25, unit: 'Cum', status: 'Billed' },
            { id: 'MB-102', date: addWeeks(startDate, 5), boqRef: 'CIV-001', description: 'Excavation for Column Footing Grid A2', location: 'Grid A2', nos: 1, length: 2.5, breadth: 2.5, depth: 1.8, quantity: 11.25, unit: 'Cum', status: 'Billed' },
            { id: 'MB-103', date: addWeeks(startDate, 6), boqRef: 'CIV-002', description: 'PCC Bed Concrete 1:4:8', location: 'Grid A1-A5', nos: 5, length: 2.5, breadth: 2.5, depth: 0.15, quantity: 4.68, unit: 'Cum', status: 'Recorded' }
        );
    } else {
        entries.push(
            { id: 'MB-101', date: addWeeks(startDate, 3), boqRef: 'CIV-001', description: 'Earthwork Excavation', location: 'GL to -1.5m', nos: 1, length: 15, breadth: 12, depth: 1.5, quantity: 270, unit: 'Cum', status: 'Billed' },
            { id: 'MB-102', date: addWeeks(startDate, 5), boqRef: 'CON-101', description: 'PCC Foundation Bed', location: 'Footing F1-F12', nos: 12, length: 1.8, breadth: 1.8, depth: 0.1, quantity: 3.88, unit: 'Cum', status: 'Billed' },
            { id: 'MB-103', date: addWeeks(startDate, 7), boqRef: 'CON-102', description: 'Plinth Beam Concrete M25', location: 'PB-1 Outer', nos: 2, length: 60, breadth: 0.23, depth: 0.45, quantity: 12.42, unit: 'Cum', status: 'Recorded' }
        );
    }

    return entries;
};

// Regulatory Compliance & Interoperability Logic

export const checkCompliance = (project: Partial<ProjectDetails>): ComplianceCheck[] => {
  const L = project.dimensions?.length || 0;
  const W = project.dimensions?.width || 0;
  const plotArea = L * W;
  const stories = project.stories || 1;
  const builtUp = plotArea * 0.75 * stories; // Assuming 75% ground coverage
  
  const checks: ComplianceCheck[] = [];

  // 1. FSI Check (Floor Space Index)
  const fsiLimit = 2.5;
  const currentFSI = builtUp / plotArea;
  checks.push({
    id: 'CMP-01', parameter: 'FSI (Floor Space Index)',
    allowed: `Max ${fsiLimit}`, actual: currentFSI.toFixed(2),
    status: currentFSI <= fsiLimit ? 'Pass' : 'Fail',
    description: 'Total built-up area divided by plot area.'
  });

  // 2. Setback Checks
  const minSetback = stories > 3 ? 3.0 : 1.5; // Meters
  checks.push({
    id: 'CMP-02', parameter: 'Front Setback',
    allowed: `Min ${minSetback}m`, actual: '3.5m',
    status: 'Pass',
    description: 'Distance from road boundary.'
  });
  
  // 3. Ground Coverage
  const maxCoverage = 65; // %
  const currentCoverage = 62; // %
  checks.push({
    id: 'CMP-03', parameter: 'Ground Coverage',
    allowed: `Max ${maxCoverage}%`, actual: `${currentCoverage}%`,
    status: 'Pass',
    description: 'Percentage of plot area covered by building footprint.'
  });

  // 4. Height Restriction
  const maxHeight = 15; // m (for this zone)
  const currentHeight = stories * 3; // 3m per floor
  checks.push({
    id: 'CMP-04', parameter: 'Building Height',
    allowed: `Max ${maxHeight}m`, actual: `${currentHeight}m`,
    status: currentHeight <= maxHeight ? 'Pass' : 'Warning',
    description: 'Total height from plinth level.'
  });

  return checks;
};

export const getImportJobs = (): ImportJob[] => {
  return [
    { id: 'IMP-01', fileName: 'Structural_Model_V1.std', type: 'STAAD', date: '2024-03-10', status: 'Completed', details: 'Imported 45 nodes, 62 members.' },
    { id: 'IMP-02', fileName: 'Site_Scan_Sketch.jpg', type: 'Sketch', date: '2024-03-12', status: 'Completed', details: 'Vectorized walls and columns.' },
    { id: 'IMP-03', fileName: 'Arch_Plan_Rev2.dxf', type: 'DXF', date: '2024-03-14', status: 'Processing', details: 'Parsing layers...' }
  ];
};

// --- NEW GENERATORS FOR ADVANCED FEATURES (Parts 17, 36, 40, 44, 38, 41) ---

// Part 40: Sensor Data Generator (Digital Twin)
export const generateSensorData = (type: string): SensorData[] => {
  const timestamp = new Date().toLocaleTimeString();
  const historyLength = 10;
  
  const generateHistory = (base: number) => 
    Array.from({length: historyLength}, (_, i) => ({
      time: `${10+i}:00`, 
      value: base + (Math.random() * 2 - 1)
    }));

  return [
    { id: 'S-01', type: 'Strain', location: 'Col C1-GF', value: 450, unit: 'µε', status: 'Normal', timestamp, history: generateHistory(450) },
    { id: 'S-02', type: 'Tilt', location: 'Roof Lvl', value: 0.05, unit: 'deg', status: 'Normal', timestamp, history: generateHistory(0.05) },
    { id: 'S-03', type: 'Vibration', location: 'Mid-Span Beam', value: 12, unit: 'Hz', status: 'Warning', timestamp, history: generateHistory(12) },
    { id: 'S-04', type: 'Temperature', location: 'Ext Wall', value: 38, unit: '°C', status: 'Normal', timestamp, history: generateHistory(35) },
  ];
};

// Part 44: Construction Risks
export const generateConstructionRisks = (): ConstructionRisk[] => {
  return [
    { id: 'RSK-01', category: 'Weather', description: 'Monsoon season approaching in 2 weeks', probability: 'High', impact: 'Critical', mitigation: 'Accelerate roof sheeting' },
    { id: 'RSK-02', category: 'Supply', description: 'Steel price volatility (predicted +5%)', probability: 'Medium', impact: 'Moderate', mitigation: 'Pre-order rebar stock' },
    { id: 'RSK-03', category: 'Labor', description: 'Shortage of skilled bar-benders', probability: 'Low', impact: 'Moderate', mitigation: 'Engage sub-contractor B' },
  ];
};

// Part 17: Plugins
export const getPlugins = (): Plugin[] => {
  return [
    { id: 'PLG-01', name: 'Kratos Multiphysics Core', version: '9.4.0', description: 'Standard Finite Element Solver', author: 'Kratos Team', status: 'Installed', category: 'Solver' },
    { id: 'PLG-02', name: 'FEniCSx Advanced', version: '0.7.0', description: 'Research-grade continuum mechanics solver', author: 'FEniCS Project', status: 'Available', category: 'Solver' },
    { id: 'PLG-03', name: 'IS 800:2007 Checker', version: '2.1.0', description: 'Steel Design Code Compliance Module', author: 'StructurAI', status: 'Installed', category: 'Code' },
    { id: 'PLG-04', name: 'Wind Tunnel Sim', version: '1.0.beta', description: 'CFD-based wind load generation', author: 'OpenFOAM Wrapper', status: 'Available', category: 'AI' },
  ];
};

// Part 38 & 41: Model Validation & Clashes
export const runModelValidation = (): ValidationIssue[] => {
  return [
    { id: 'VAL-01', type: 'Geometry', severity: 'Critical', elementId: 'N-405', description: 'Floating Node detected (Zero stiffness)', location: 'Grid 4-C', recommendation: 'Merge with nearest beam node' },
    { id: 'VAL-02', type: 'Clash', severity: 'Major', elementId: 'B-201', description: 'HVAC Duct clashes with Main Beam', location: 'Floor 1, Corridor', recommendation: 'Reduce duct height or provide sleeve' },
    { id: 'VAL-03', type: 'Code', severity: 'Major', elementId: 'C-102', description: 'Slenderness ratio > 12', location: 'Ground Floor', recommendation: 'Increase column dimension' },
    { id: 'VAL-04', type: 'Constructability', severity: 'Minor', elementId: 'B-303', description: 'Rebar congestion > 4%', location: 'Beam-Column Joint', recommendation: 'Use bundle bars or higher dia' },
  ];
};
