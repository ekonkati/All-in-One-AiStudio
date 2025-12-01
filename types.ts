
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
  status: 'Concept' | 'Modeling' | 'Analysis' | 'Design' | 'Estimation' | 'Construction';
  budget?: number;
  startDate?: string;
  createdAt: string;
}

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

export type ViewState = 'dashboard' | 'chat' | 'layout' | 'structure' | 'estimation' | 'procurement' | 'management' | 'reports' | 'settings' | 'subscription';