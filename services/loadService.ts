import { WindParams, SeismicParams, LoadCombination } from '../types/index';

// Database of Basic Wind Speeds (IS 875 Part 3 - 2015)
const cityWindSpeeds: Record<string, number> = {
  'Hyderabad': 39,
  'Mumbai': 44,
  'Delhi': 47,
  'Chennai': 50,
  'Bangalore': 33,
  'Kolkata': 50,
  'Pune': 39,
  'Ahmedabad': 39,
  'Bhubaneswar': 50, // Cyclone prone
  'Visakhapatnam': 50
};

// Database of Seismic Zones (IS 1893 Part 1 - 2016)
const citySeismicZones: Record<string, 'II' | 'III' | 'IV' | 'V'> = {
  'Hyderabad': 'II',
  'Mumbai': 'III',
  'Delhi': 'IV',
  'Chennai': 'III',
  'Bangalore': 'II',
  'Kolkata': 'III',
  'Guwahati': 'V',
  'Bhuj': 'V'
};

const zoneFactors = {
  'II': 0.10,
  'III': 0.16,
  'IV': 0.24,
  'V': 0.36
};

// Calculate Design Wind Speed Vz = Vb * k1 * k2 * k3 * k4
export const calculateWindLoad = (city: string, height: number, life: number = 50, terrainCat: 1 | 2 | 3 | 4 = 2): WindParams => {
  const Vb = cityWindSpeeds[city] || 39; // Default to 39 if unknown
  
  // k1: Risk Coefficient (IS 875 Pt 3 Table 1)
  let k1 = 1.0; 
  if (life === 100) k1 = 1.05; // Important buildings
  if (life === 25) k1 = 0.90;  // Temporary sheds

  // k2: Terrain, Height, Structure Size (Simplified Table 2 logic)
  // For Category 2 (Open terrain with scattered obstructions)
  let k2 = 1.0;
  if (height <= 10) k2 = 1.0;
  else if (height <= 15) k2 = 1.05;
  else if (height <= 20) k2 = 1.07;
  else if (height <= 30) k2 = 1.12;
  else if (height <= 50) k2 = 1.17;
  else k2 = 1.2; 

  // k3: Topography (1.0 for flat, >1 for hills)
  const k3 = 1.0; 

  // k4: Cyclonic Importance (1.15 for industrial in cyclone zone, else 1.0)
  const isCoastal = ['Chennai', 'Kolkata', 'Bhubaneswar', 'Visakhapatnam'].includes(city);
  const k4 = isCoastal ? 1.15 : 1.0;

  const Vz = Vb * k1 * k2 * k3 * k4;
  
  // Design Wind Pressure Pz = 0.6 * Vz^2
  const Pz = 0.6 * Math.pow(Vz, 2);

  return {
    basicWindSpeed: Vb,
    k1, k2, k3, k4,
    designWindSpeed: parseFloat(Vz.toFixed(2)),
    windPressure: parseFloat(Pz.toFixed(2)) // Pascals (N/m2)
  };
};

// Calculate Seismic Base Shear Coefficient Ah
export const calculateSeismicLoad = (city: string, importanceFactor: number = 1.2, responseReduction: number = 5, soilType: 'Soft' | 'Medium' | 'Hard' = 'Medium'): SeismicParams => {
  const zone = citySeismicZones[city] || 'II';
  const Z = zoneFactors[zone];
  const I = importanceFactor;
  const R = responseReduction; // 5 for SMRF, 3 for OMRF

  // Sa/g (Spectral Acceleration Coefficient) - Simplified for static check (Period T ~ 0.5s)
  // Hard: 2.5, Medium: 2.5, Soft: 2.5 (for low T). Let's assume T is in plateau for safety.
  let Sag = 2.5; 

  // Ah = (Z/2) * (I/R) * (Sa/g)
  const Ah = (Z / 2) * (I / R) * Sag;

  return {
    zone,
    zoneFactor: Z,
    importanceFactor: I,
    responseReduction: R,
    soilType,
    baseShearCoeff: parseFloat(Ah.toFixed(4))
  };
};

// Generate Load Combinations (IS 875 Part 5)
export const generateLoadCombinations = (loads: { dead: boolean; live: boolean; wind: boolean; seismic: boolean }): LoadCombination[] => {
  const combos: LoadCombination[] = [];
  
  // IS 875 Part 5 Standard Combinations
  
  // 1.5 (DL + LL) - ULS
  if (loads.dead && loads.live) {
    combos.push({ id: 'LC1', name: '1.5(DL + LL)', type: 'ULS', factors: { DL: 1.5, LL: 1.5 } });
  }
  
  // 1.2 (DL + LL + WL/EL) - ULS
  if (loads.dead && loads.live && (loads.wind || loads.seismic)) {
    if (loads.wind) combos.push({ id: 'LC2', name: '1.2(DL + LL + WL)', type: 'ULS', factors: { DL: 1.2, LL: 1.2, WL: 1.2 } });
    if (loads.seismic) combos.push({ id: 'LC3', name: '1.2(DL + LL + EL)', type: 'ULS', factors: { DL: 1.2, LL: 1.2, EL: 1.2 } });
  }

  // 1.5 (DL + WL/EL) - ULS
  if (loads.dead && (loads.wind || loads.seismic)) {
    if (loads.wind) combos.push({ id: 'LC4', name: '1.5(DL + WL)', type: 'ULS', factors: { DL: 1.5, WL: 1.5 } });
    if (loads.seismic) combos.push({ id: 'LC5', name: '1.5(DL + EL)', type: 'ULS', factors: { DL: 1.5, EL: 1.5 } });
  }

  // 0.9 DL + 1.5 WL/EL (Uplift/Overturning) - ULS
  if (loads.dead && (loads.wind || loads.seismic)) {
    if (loads.wind) combos.push({ id: 'LC6', name: '0.9DL + 1.5WL', type: 'ULS', factors: { DL: 0.9, WL: 1.5 } });
    if (loads.seismic) combos.push({ id: 'LC7', name: '0.9DL + 1.5EL', type: 'ULS', factors: { DL: 0.9, EL: 1.5 } });
  }

  // SLS Combinations (Unfactored)
  if (loads.dead && loads.live) {
      combos.push({ id: 'LC8', name: '1.0(DL + LL)', type: 'SLS', factors: { DL: 1.0, LL: 1.0 } });
  }

  return combos;
};
