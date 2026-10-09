import { CropInfo, FarmProfile, SoilHealthTrendPoint } from '../types/agricultural';

export interface SoilSimulationStepResult {
  nitrogenAfter: number;
  phosphorusAfter: number;
  potassiumAfter: number;
  organicMatterAfter: number;
  soilHealthScore: number;
  nitrogenDelta: number;
  phosphorusDelta: number;
  potassiumDelta: number;
  organicMatterDelta: number;
}

/**
 * Calculates aggregate soil health index (0 to 100) based on balanced NPK, Organic Matter, and pH optimality.
 */
export function calculateSoilHealthScore(
  nitrogenKg: number,
  phosphorusKg: number,
  potassiumKg: number,
  organicMatter: number,
  soilPh: number
): number {
  // Ideal agronomic ranges for tropical/subtropical soils:
  // N: 220 - 350 kg/ha
  // P: 20 - 55 kg/ha
  // K: 150 - 280 kg/ha
  // OM: 1.5% - 3.5%
  // pH: 6.2 - 7.5

  let nScore = Math.max(0, Math.min(100, (nitrogenKg / 280) * 100));
  if (nitrogenKg > 400) nScore = Math.max(70, 100 - (nitrogenKg - 400) * 0.2); // avoid nitrogen burn

  let pScore = Math.max(0, Math.min(100, (phosphorusKg / 35) * 100));
  let kScore = Math.max(0, Math.min(100, (potassiumKg / 220) * 100));
  let omScore = Math.max(0, Math.min(100, (organicMatter / 2.5) * 100));

  // pH optimality curve (bell shape around 6.8)
  const phDev = Math.abs(soilPh - 6.8);
  const phScore = Math.max(20, 100 - phDev * 28);

  const weighted = nScore * 0.3 + pScore * 0.2 + kScore * 0.2 + omScore * 0.2 + phScore * 0.1;
  return Math.round(Math.max(10, Math.min(99, weighted)));
}

/**
 * Simulates soil health transition from one season to the next given a selected crop.
 */
export function simulateSoilStep(
  currentN: number,
  currentP: number,
  currentK: number,
  currentOM: number,
  soilPh: number,
  crop: CropInfo
): SoilSimulationStepResult {
  // Crop effect:
  // Legumes fix nitrogen (-demand means net positive addition)
  // For legumes, demand is negative in our DB (e.g. -40 kg/ha)
  const nDelta = -crop.nitrogenDemandKgPerHa; // negative demand = positive gain
  const pDelta = -crop.phosphorusDemandKgPerHa * 0.35; // typical soil drawdown after partial replenishment
  const kDelta = -crop.potassiumDemandKgPerHa * 0.4;
  const omDelta = crop.organicMatterImpact * 0.08;

  const nextN = Math.max(80, Math.min(450, currentN + nDelta));
  const nextP = Math.max(10, Math.min(80, currentP + pDelta));
  const nextK = Math.max(60, Math.min(380, currentK + kDelta));
  const nextOM = Math.max(0.4, Math.min(4.5, currentOM + omDelta));

  const soilHealthScore = calculateSoilHealthScore(nextN, nextP, nextK, nextOM, soilPh);

  return {
    nitrogenAfter: Math.round(nextN * 10) / 10,
    phosphorusAfter: Math.round(nextP * 10) / 10,
    potassiumAfter: Math.round(nextK * 10) / 10,
    organicMatterAfter: Math.round(nextOM * 100) / 100,
    soilHealthScore,
    nitrogenDelta: Math.round(nDelta * 10) / 10,
    phosphorusDelta: Math.round(pDelta * 10) / 10,
    potassiumDelta: Math.round(kDelta * 10) / 10,
    organicMatterDelta: Math.round(omDelta * 100) / 100,
  };
}
