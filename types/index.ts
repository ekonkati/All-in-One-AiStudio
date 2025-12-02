

export interface ProjectDetails {
  id: string;
  name: string;
  type: 'RCC' | 'Steel' | 'PEB' | 'Composite' | 'Retaining Wall' | 'Water Tank' | 'Landfill' | 'Other';
  location: string;
  dimensions: {
    length: number; // in feet
    width: number; // in feet (or height for walls/tanks)
  };
  stories: number;
  soilType: string;
  status: 'Concept' | 'Modeling' | 'Analysis' | 'Design' | 'Estimation' | 'Construction' | 'Closure';
  budget?: number;
  startDate?: string;
  createdAt: string;
}

export type UserRole = 'Engineer' | 'Client' | 'Admin';

export interface ChatMessage {
  id: string;
  role: 'user' | 'ai' | 'system';
  content: string;
  timestamp: Date;
  isThinking?: boolean;
}

export interface BOQItem {
  id: string;
  category: string;
  description: string;
  unit: string;
  quantity: number;
  rate: number;
  amount: number;
}

export interface StructuralMember {
  id: string;
  type: 'Column' | 'Beam' | 'Slab' | 'Footing' | 'Wall Stem' | 'Base Slab' | 'Tank Wall' | 'Top Dome' | 'Liner';
  mark: string; // e.g., C1, B1
  count: number;
  dimensions: string; // e.g., "300x450"
  reinforcement: string; // e.g., "4-16Φ + 2-12Φ"
  concreteVol: number; // Cum
  steelWeight: number; // Kg
  level: string;
  dcr?: number; // Demand Capacity Ratio
  status?: 'Safe' | 'Critical' | 'Failed';
  failureMode?: 'Shear' | 'Moment' | 'Deflection' | 'Buckling' | 'None';
}

export interface TaskItem {
  id: number;
  title: string;
  due: string;
  priority: 'High' | 'Medium' | 'Low';
  status: 'Done' | 'In Progress' | 'Pending';
}

export interface PhaseItem {
  name: string;
  start: string;
  end: string;
  status: 'completed' | 'in-progress' | 'pending';
  progress: number;
}

export interface DocumentItem {
  id: string;
  name: string;
  type: 'PDF' | 'DWG' | 'XLSX' | 'JPG';
  category: 'Architectural' | 'Structural' | 'Reports' | 'Site';
  date: string;
  size: string;
  status: 'Approved' | 'Draft' | 'Pending';
}

export interface ReportItem {
  id: string;
  title: string;
  description: string;
  type: 'PDF' | 'XLSX' | 'ZIP';
  date: string;
  size: string;
  category: 'Engineering' | 'Commercial' | 'Execution' | 'General';
  status: 'Ready' | 'Generating';
}

export interface RABill {
  id: string;
  billNo: string;
  date: string;
  description: string;
  claimedAmount: number;
  approvedAmount: number;
  status: 'Paid' | 'Processing' | 'Draft';
}

export interface FinancialStats {
  contractValue: number;
  billedValue: number;
  receivedValue: number;
  outstandingValue: number;
}

export interface MeasurementEntry {
  id: string;
  date: string;
  boqRef: string;
  description: string;
  location: string; // Grid/Level
  nos: number;
  length: number;
  breadth: number;
  depth: number;
  quantity: number;
  unit: string;
  status: 'Recorded' | 'Billed';
}

export interface QualityChecklist {
  id: string;
  title: string;
  location: string;
  date: string;
  inspector: string;
  status: 'Passed' | 'Failed' | 'Pending';
  type: 'QA' | 'HSE';
}

export interface SafetyStat {
  safeManHours: number;
  incidents: number;
  nearMisses: number;
  lastIncidentDate: string;
}

export interface SitePhoto {
  id: string;
  url: string;
  caption: string;
  date: string;
  uploadedBy: string;
  tags: string[];
}

export interface RateComponent {
  name: string;
  unit: string;
  quantity: number;
  unitRate: number;
  amount: number;
  orderDate?: string;
}

export interface RateAnalysisItem {
  itemId: string;
  description: string;
  totalRate: number;
  unit: string;
  components: {
    material: RateComponent[];
    labor: RateComponent[];
    machinery: RateComponent[];
  };
}

export interface Vendor {
  id: string;
  name: string;
  category: string;
  rating: number;
  contact: string;
  status: 'Active' | 'Blacklisted';
}

export interface Bid {
  vendorId: string;
  vendorName: string;
  amount: number;
  rank: 'L1' | 'L2' | 'L3';
  submissionDate: string;
}

export interface RFQ {
  id: string;
  rfqNo: string;
  title: string;
  items: string;
  floatDate: string;
  dueDate: string;
  status: 'Open' | 'Closed' | 'Evaluated';
  bids: Bid[];
}

export interface PurchaseOrder {
  id: string;
  poNumber: string;
  vendorId: string;
  vendorName: string;
  material: string;
  quantity: number;
  unit: string;
  rate: number;
  amount: number;
  orderDate: string;
  deliveryDate: string;
  status: 'Draft' | 'Sent' | 'Delivered' | 'Partial';
}

export interface PricingPlan {
  id: string;
  name: string;
  price: number;
  period: 'month' | 'project';
  features: string[];
  isPopular?: boolean;
}

export interface BBSItem {
  barMark: string;
  memberId: string;
  description: string;
  diameter: number;
  shapeCode: '00' | '21' | '41' | '51'; // 00=Straight, 21=Stirrup, 41=L-Bend, 51=Crank
  noOfBars: number;
  cutLength: number; // meters
  totalLength: number; // meters
  unitWeight: number; // kg/m
  totalWeight: number; // kg
  shapeParams: { a: number; b: number; c?: number; d?: number }; // dimensions in mm
}

export interface ComplianceCheck {
  id: string;
  parameter: string;
  allowed: string;
  actual: string;
  status: 'Pass' | 'Fail' | 'Warning';
  description: string;
}

export interface ImportJob {
  id: string;
  fileName: string;
  type: 'STAAD' | 'ETABS' | 'DXF' | 'Sketch';
  date: string;
  status: 'Completed' | 'Processing' | 'Failed';
  details: string;
}

// Engineering Types for Load Engine (Part 7)
export interface WindParams {
  basicWindSpeed: number; // Vb in m/s
  k1: number; // Probability Factor
  k2: number; // Terrain Roughness Factor
  k3: number; // Topography Factor
  k4: number; // Cyclonic Factor
  designWindSpeed: number; // Vz
  windPressure: number; // Pz
}

export interface SeismicParams {
  zone: 'II' | 'III' | 'IV' | 'V';
  zoneFactor: number; // Z
  importanceFactor: number; // I
  responseReduction: number; // R
  soilType: 'Soft' | 'Medium' | 'Hard'; // Sa/g dependency
  baseShearCoeff: number; // Ah
}

// Load Combinations (Part 7)
export interface LoadCombination {
  id: string;
  name: string;
  type: 'ULS' | 'SLS'; // Ultimate vs Serviceability
  factors: { [key: string]: number }; // e.g. { DL: 1.5, LL: 1.5 }
}

// Detailed Design Calculation (Part 9)
export interface DesignCalcStep {
  id: string;
  stepName: string;
  reference: string; // e.g., "IS 456 Cl 26.5"
  description: string;
  formula: string;
  substitution: string;
  result: string;
  status: 'Pass' | 'Fail' | 'Info';
}

// Digital Twin & Monitoring (Part 40)
export interface SensorData {
  id: string;
  type: 'Strain' | 'Tilt' | 'Vibration' | 'Temperature';
  location: string;
  value: number;
  unit: string;
  status: 'Normal' | 'Warning' | 'Critical';
  timestamp: string;
  history: { time: string; value: number }[];
}

// Construction Risks (Part 44)
export interface ConstructionRisk {
  id: string;
  category: 'Weather' | 'Supply' | 'Labor' | 'Design';
  description: string;
  probability: 'High' | 'Medium' | 'Low';
  impact: 'Critical' | 'Moderate' | 'Low';
  mitigation: string;
}

// Plugin Architecture (Part 17)
export interface Plugin {
  id: string;
  name: string;
  version: string;
  description: string;
  author: string;
  status: 'Installed' | 'Available' | 'Update';
  category: 'Solver' | 'Code' | 'AI';
}

// Model Validation & Clashes (Part 38 & 41)
export interface ValidationIssue {
  id: string;
  type: 'Geometry' | 'Code' | 'Constructability' | 'Clash';
  severity: 'Critical' | 'Major' | 'Minor';
  elementId?: string;
  description: string;
  location: string;
  recommendation: string;
}

// Inventory Management (Part 18/28)
export interface InventoryItem {
  id: string;
  material: string;
  unit: string;
  stock: number;
  required: number;
  reorderLevel: number;
  status: 'Adequate' | 'Low' | 'Critical';
}

// MEP Coordination (Part 41)
export interface MEPItem {
  id: string;
  type: 'Duct' | 'Pipe' | 'Tray';
  description: string;
  start: { x: number, y: number };
  end: { x: number, y: number };
  width: number;
  color: string;
  clash: boolean;
}

// Portfolio Management (Part 35)
export interface ProjectSummary {
  id: string;
  name: string;
  type: string;
  location: string;
  progress: number;
  budget: number;
  spent: number;
  status: 'On Track' | 'Delayed' | 'Critical';
  riskLevel: 'Low' | 'Medium' | 'High';
}

// Approval Workflow (Part 29)
export interface ApprovalRequest {
  id: string;
  subject: string;
  type: 'Drawing' | 'BOQ' | 'Design' | 'Variation';
  requestedBy: string;
  date: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  version: string;
  comments?: string;
}

// Billing (Part 25)
export interface BillLineItem {
  id: string;
  description: string;
  qty: number;
  unit: string;
  rate: number;
  prevQty: number;
  amount: number;
}

// Connection Design (Part 9.7)
export interface ConnectionResult {
  id: string;
  type: 'Moment End Plate' | 'Shear Fin' | 'Base Plate';
  members: string;
  status: 'Pass' | 'Fail';
  utilization: number; // Ratio < 1.0 is pass
  checks: { check: string; val: number; limit: number; status: string }[];
}

// Project Closure (Part 27)
export interface ClosureDocument {
  id: string;
  name: string;
  status: 'Pending' | 'Submitted' | 'Approved';
  type: 'As-Built' | 'Warranty' | 'NOC' | 'Handover';
}

// Audit & Security (Part 19)
export interface AuditLog {
    id: string;
    timestamp: string;
    user: string;
    action: string;
    module: string;
    details: string;
    status: 'Success' | 'Failed' | 'Warning';
}

// Deployment Status (Part 42)
export interface SystemStatus {
    component: string;
    status: 'Healthy' | 'Degraded' | 'Down';
    latency: number; // ms
    uptime: string;
}

// AI Optimization & Value Engineering
export interface OptimizationSuggestion {
    id: string;
    category: 'Material' | 'Structural' | 'Cost';
    title: string;
    description: string;
    impact: string; // e.g., "-5% Cost"
    status: 'pending' | 'applied';
}

// Token/Credit System
export interface ActionCost {
    analysisRun: number;
    drawingSheet: number;
    handoverDossier: number;
}

// MIS Dashboards (Part 14)
export interface EngineeringStatusKPI {
  designsCompleted: number;
  designsPending: number;
  drawingsIssued: number;
  revisions: number;
  designProgress: { name: string, completed: number, total: number }[];
}
export interface ProcurementKPI {
  totalPOs: number;
  totalValue: number;
  activeVendors: number;
  delayedDeliveries: number;
  vendorPerformance: { name: string, rating: number }[];
}
export interface SafetyKPI {
  totalInspections: number;
  passed: number;
  failed: number;
  ncrOpen: number;
  complianceScore: number;
}

// Global Search
export interface SearchResult {
  id: string;
  title: string;
  description: string;
  category: 'Navigation' | 'Member' | 'Document' | 'Task' | 'Vendor';
  view: ViewState;
  icon: React.ElementType;
}

// AI Design Studio
export interface AiDesignStep {
    id: number;
    question: string;
    action: 'INPUT' | 'GENERATE' | 'CONFIRM';
    payload?: any; // For GENERATE, what to draw
    response?: string;
    status: 'pending' | 'active' | 'completed';
}


export type ViewState = 
  'dashboard' | 
  'portfolio' | 
  'chat' | 
  'layout' | 
  'structure' | 
  'connections' | 
  'estimation' | 
  'procurement' | 
  'management' | 
  'digital-twin' | 
  'closure' | 
  'reports' | 
  'settings' | 
  'subscription' | 
  'data-exchange' |
  'optimization-center' |
  'ai-studio';
