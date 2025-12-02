import { WindParams, SeismicParams, LoadCombination } from '../types/index';

const cityWindSpeeds: Record<string, number> = { 'Hyderabad': 39, 'Mumbai': 44, 'Delhi': 47, 'Chennai': 50, 'Kolkata': 50 };
const citySeismicZones: Record<string, 'II' | 'III' | 'IV' | 'V'> = { 'Hyderabad': 'II', 'Mumbai': 'III', 'Delhi': 'IV', 'Chennai': 'III', 'Kolkata': 'III' };
const zoneFactors = { 'II': 0.10, 'III': 0.16, 'IV': 0.24, 'V': 0.36 };

export const calculateWindLoad = (city: string, height: number): WindParams => {
  const Vb = cityWindSpeeds[city] || 39;
  const k1 = 1.0, k2 = 1.0, k3 = 1.0, k4 = 1.0; // Simplified factors
  const Vz = Vb * k1 * k2 * k3 * k4;
  const Pz = 0.6 * Math.pow(Vz, 2); // N/m^2
  return { basicWindSpeed: Vb, k1, k2, k3, k4, designWindSpeed: Vz, windPressure: parseFloat(Pz.toFixed(2)) };
};

export const calculateSeismicLoad = (city: string): SeismicParams => {
  const zone = citySeismicZones[city] || 'II';
  const Z = zoneFactors[zone];
  const I = 1.2, R = 5; // Assuming important building, SMRF
  const Sag = 2.5; // Assuming Type II soil
  const Ah = parseFloat(((Z / 2) * (I / R) * Sag).toFixed(4));
  return { zone, zoneFactor: Z, importanceFactor: I, responseReduction: R, soilType: 'Medium', baseShearCoeff: Ah };
};

export const generateLoadCombinations = (loads: { dead: boolean; live: boolean; wind: boolean; seismic: boolean }): LoadCombination[] => {
  const combos: LoadCombination[] = [];
  if (loads.dead && loads.live) {
    combos.push({ id: 'LC1', name: '1.5(DL + LL)', type: 'ULS', factors: { DL: 1.5, LL: 1.5 } });
  }
  if (loads.dead && loads.wind) {
      combos.push({ id: 'LC2', name: '1.5(DL + WL)', type: 'ULS', factors: { DL: 1.5, WL: 1.5 } });
  }
  if (loads.dead && loads.live && loads.wind) {
      combos.push({ id: 'LC3', name: '1.2(DL + LL + WL)', type: 'ULS', factors: { DL: 1.2, LL: 1.2, WL: 1.2 } });
  }
  if (loads.dead && loads.seismic) {
      combos.push({ id: 'LC4', name: '1.5(DL + EQL)', type: 'ULS', factors: { DL: 1.5, EQL: 1.5 } });
  }
  return combos;
};
