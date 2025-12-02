// This file contains the complete Unified Data Model (UDM) for the application.

import React from 'react';

// ===============================================
// Core Project & User Types
// ===============================================

export interface ProjectDetails {
  id: string;
  name: string;
  type: 'RCC' | 'Steel' | 'PEB' | 'Composite' | 'Retaining Wall' | 'Water Tank' | 'Landfill' | 'Other';
  location: string;
  dimensions: {
    length: number; // in meters
    width: number; // in meters 
  };
  stories: number;
  soilType: string;
  status: 'Concept' | 'Modeling' | 'Analysis' | 'Design' | 'Estimation' | 'Construction' | 'Closure';
  budget?: number;
  startDate?: string;
  createdAt: string;
}

export type UserRole = 'Engineer' | 'Client' | 'Admin';


// ===============================================
// STAAD-like UNIFIED DATA MODEL (UDM)
// ===============================================

export interface Node {
  id: number;
  x: number;
  y: number;
  z: number;
}

export interface Member {
  id: number;
  startNode: number;
  endNode: number;
  sectionId: string;
  materialId: string;
  type: 'Beam' | 'Column' | 'Brace';
  releaseStart?: Release;
  releaseEnd?: Release;
  betaAngle?: number;
  designResult?: DesignResult;
}

export interface Plate {
  id: number;
  nodes: [number, number, number, number];
  thickness: number;
  materialId: string;
}

export interface Support {
  id: string;
  nodeId: number;
  type: 'Fixed' | 'Pinned' | 'Roller' | 'Spring';
}

export interface Release {
  fx: boolean; fy: boolean; fz: boolean;
  mx: boolean; my: boolean; mz: boolean;
}

export interface LoadCase {
  id: string;
  name: string;
  type: 'Dead' | 'Live' | 'Wind' | 'Seismic' | 'Temperature';
}

export interface StructuralLoad {
  id: string;
  caseId: string;
  entityType: 'node' | 'member';
  entityId: number;
  type: 'Point' | 'UDL' | 'Temperature';
  magnitude: number;
  direction: 'X' | 'Y' | 'Z' | 'GX' | 'GY' | 'GZ';
}

export interface LoadCombination {
  id: string;
  name: string;
  type: 'ULS' | 'SLS';
  factors: { [caseId: string]: number };
}

export interface Material {
  id: string;
  name: string;
  type: 'Steel' | 'Concrete';
  E: number;
  density: number;
  fy?: number;
  fck?: number;
}

export interface Section {
  id: string;
  name: string;
  type: 'ISMB' | 'ISHB' | 'Rectangular' | 'Circular';
  properties: any;
}

export type SelectedEntity =
  | { type: 'node', id: number }
  | { type: 'member', id: number }
  | { type: 'support', id: string }
  | { type: 'plate', id: number };

export type ModelerTool = 'select' | 'add-node' | 'add-member' | 'add-plate' | 'add-support' | 'add-load' | 'assign-section' | 'release-member';

// ===============================================
// Analysis & Design Output Types
// ===============================================

export interface AnalysisResults {
  memberForces: {
    [memberId: number]: {
      P: number;
      Vy: number;
      Vz: number;
      T: number;
      My: number;
      Mz: number;
    };
  };
}

export interface DesignResult {
  status: 'Pass' | 'Fail' | 'Warning';
  utilization: number;
  governingCombo: string;
  check: string;
}

// ===============================================
// Other Application Module Types
// ===============================================

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

// FIX: Added missing ActionCost type to resolve module export errors.
export interface ActionCost {
  drawingSheet: number;
  handoverDossier: number;
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

export interface SearchResult {
  id: string;
  title: string;
  description: string;
  category: 'Navigation' | 'Member' | 'Document' | 'Task' | 'Vendor' | 'Node' | 'Plate';
  view: ViewState;
  icon: React.ElementType;
}

export interface AiDesignStep {
    id: number;
    question: string;
    action: 'INPUT' | 'GENERATE' | 'CONFIRM';
    payload?: any;
    response?: string;
    status: 'pending' | 'active' | 'completed';
}

export interface RateAnalysisComponent {
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
    material: RateAnalysisComponent[];
    labor: RateAnalysisComponent[];
    machinery: RateAnalysisComponent[];
  };
}
export interface RABill {
  id: string;
  billNo: string;
  date: string;
  description: string;
  claimedAmount: number;
  approvedAmount: number;
  status: 'Paid' | 'Processing' | 'Pending';
}
export interface FinancialStats {
  contractValue: number;
  billedValue: number;
  receivedValue: number;
  outstandingValue: number;
}
export interface QualityChecklist {
  id: string;
  title: string;
  type: 'HSE' | 'QA/QC';
  location: string;
  date: string;
  inspector: string;
  status: 'Passed' | 'Failed' | 'Pending';
}
export interface SafetyStat {
  safeManHours: number;
  nearMisses: number;
}
export interface ReportItem {
  id: string;
  title: string;
  description: string;
  category: string;
  type: 'PDF' | 'XLSX' | 'ZIP';
  size: string;
}
export interface EngineeringStatusKPI {
  designsCompleted: number;
  designsPending: number;
  drawingsIssued: number;
  revisions: number;
  designProgress: { name: string; completed: number; total: number }[];
}
export interface ProcurementKPI {
  totalPOs: number;
  totalValue: number;
  activeVendors: number;
  delayedDeliveries: number;
  vendorPerformance: { name: string; rating: number }[];
}
export interface SafetyKPI {
  totalInspections: number;
  ncrOpen: number;
  complianceScore: number;
  passed: number;
  failed: number;
}
export interface SitePhoto {
  id: string;
  url: string;
  caption: string;
  date: string;
  tags: string[];
}
export interface MeasurementEntry {
  id: string;
  date: string;
  description: string;
  location: string;
  boqRef: string;
  nos: number;
  length: number;
  breadth: number;
  depth: number;
  quantity: number;
  unit: string;
  status: 'Billed' | 'Pending';
}
export interface PricingPlan {
  id: string;
  name: string;
  price: number;
  period: string;
  features: string[];
  isPopular: boolean;
}
export interface BBSItem {
  barMark: string;
  memberId: string;
  description: string;
  shapeCode: string;
  shapeParams: { a: number; b: number; c?: number; d?: number };
  diameter: number;
  cutLength: number;
  noOfBars: number;
  totalLength: number;
  totalWeight: number;
}
export interface WindParams {
  basicWindSpeed: number;
  k1: number;
  k2: number;
  k3: number;
  k4: number;
  designWindSpeed: number;
  windPressure: number;
}
export interface SeismicParams {
  zone: 'II' | 'III' | 'IV' | 'V';
  zoneFactor: number;
  importanceFactor: number;
  responseReduction: number;
  soilType: string;
  baseShearCoeff: number;
}
export interface SensorData {
  id: string;
  type: 'Temperature' | 'Strain';
  location: string;
  status: 'Normal' | 'Warning';
  value: number;
  unit: string;
  history: { time: string; value: number }[];
}
export interface ValidationIssue {
  id: string;
  type: 'Geometry' | 'Clash' | 'Code';
  severity: 'Minor' | 'Major' | 'Critical';
  description: string;
  location: string;
  recommendation: string;
  status: 'Open' | 'Fixed';
}
export interface ProjectSummary {
  id: string;
  name: string;
  type: 'RCC' | 'PEB';
  location: string;
  progress: number;
  status: 'On Track' | 'Delayed' | 'Critical';
  riskLevel: 'Low' | 'Medium' | 'High';
  budget: number;
  spent: number;
}
export interface BillLineItem {
  id: string;
  description: string;
  qty: number;
  unit: string;
  rate: number;
  prevQty: number;
  amount: number;
}
export interface OptimizationSuggestion {
  id: string;
  category: 'Material' | 'Structural' | 'Constructability';
  title: string;
  description: string;
  impact: string; // e.g., "High Impact / ~8% Savings"
  status: 'pending' | 'applied';
}

export interface Plugin {
    id: string;
    name: string;
    description: string;
    author: string;
    version: string;
    status: 'Installed' | 'Install';
}

export interface AuditLog {
    id: number;
    timestamp: string;
    user: string;
    action: string;
    module: string;
    status: 'Success' | 'Fail';
}

export interface SystemStatus {
    component: string;
    status: 'Healthy' | 'Warning';
    uptime: string;
    latency: number;
}

export interface ImportJob {
    id: string;
    fileName: string;
    type: string;
    date: string;
    status: 'Completed' | 'Processing' | 'Failed';
    details: string;
}

export interface ConstructionRisk {
    id: number;
    category: string;
    description: string;
    probability: 'High' | 'Medium' | 'Low';
    mitigation: string;
}

export interface DesignStep {
    id: number;
    stepName: string;
    reference: string;
    formula: string;
    substitution: string;
    result: string;
    description: string;
    status: 'Pass' | 'Fail' | 'Info';
}

export interface ApprovalRequest {
    id: string;
    type: 'Drawing' | 'Variation' | 'RFI';
    subject: string;
    requestedBy: string;
    date: string;
    version: string;
    status: 'Pending' | 'Approved' | 'Rejected';
    comments?: string;
}

export interface ConnectionDesign {
    id: string;
    type: string;
    members: string;
    status: 'Pass' | 'Fail';
    utilization: number;
    checks: {
        check: string;
        val: number;
        limit: number;
        status: 'Pass' | 'Fail';
    }[];
}

export interface ClosureDocument {
    id: string;
    name: string;
    type: string;
    status: 'Approved' | 'Submitted' | 'Pending';
}

export interface Schedule {
    phases: PhaseItem[];
    tasks: TaskItem[];
    totalProgress: number;
}

export interface Financials {
    stats: FinancialStats;
    bills: RABill[];
}

export interface QualityData {
    checklists: QualityChecklist[];
    stats: SafetyStat;
}

export interface Vendor {
    id: string;
    name: string;
    category: string;
    contact: string;
    rating: number;
    status: 'Active' | 'Inactive';
}

export interface PurchaseOrder {
    id: string;
    poNumber: string;
    vendorName: string;
    material: string;
    quantity: number;
    unit: string;
    amount: number;
    status: 'Sent' | 'Partial' | 'Delivered';
}

export interface RFQ {
    id: string;
    rfqNo: string;
    title: string;
    floatDate: string;
    dueDate: string;
    status: 'Floated' | 'Evaluated';
    bids: {
        vendorName: string;
        submissionDate: string;
        amount: number;
        rank: 'L1' | 'L2' | 'L3';
    }[];
}