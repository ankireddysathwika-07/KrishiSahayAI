import { CropInfo, FarmProfile, IrrigationType } from '../types/agricultural';

export interface WaterEvaluationResult {
  waterRequiredM3: number;
  waterAvailableM3: number;
  waterBalanceM3: number; // positive = surplus, negative = deficit
  isDeficit: boolean;
  waterEfficiencyKgPerM3: number; // yield output per cubic meter
  revenuePerM3: number; // INR revenue per cubic meter
  irrigationEfficiencyFactor: number;
  conservationStatus: 'Optimal Surplus' | 'Sustainable Safe Margin' | 'Critical Stress' | 'Infeasible Deficit';
}

/**
 * Irrigation method efficiency multipliers:
 * Drip saves up to 40% water (efficiency 0.90)
 * Sprinkler efficiency 0.78
 * Tube-well / Furrow 0.65
 * Canal / Flood 0.50
 * Rainfed dependent on precipitation
 */
export function getIrrigationEfficiencyFactor(type: IrrigationType): number {
  switch (type) {
    case 'Drip Irrigation':
      return 0.70; // 30% reduction in gross water drawn needed
    case 'Sprinkler':
      return 0.85;
    case 'Tube-well Bore':
      return 1.0;
    case 'Canal / Flood':
      return 1.25; // requires more water due to evaporation/seepage
    case 'Rainfed':
      return 1.1;
    default:
      return 1.0;
  }
}

export function evaluateSeasonalWater(
  crop: CropInfo,
  farm: FarmProfile,
  waterMultiplier: number = 1.0
): WaterEvaluationResult {
  const methodEfficiency = getIrrigationEfficiencyFactor(farm.irrigationType);
  const baseWater = crop.waterRequirementM3PerHa * farm.areaHa;
  const waterRequiredM3 = Math.round(baseWater * methodEfficiency);
  const waterAvailableM3 = Math.round(farm.availableWaterM3PerHa * farm.areaHa * waterMultiplier);
  const waterBalanceM3 = waterAvailableM3 - waterRequiredM3;
  const isDeficit = waterBalanceM3 < 0;

  const totalYieldKg = crop.expectedYieldTonPerHa * 1000 * farm.areaHa;
  const waterEfficiencyKgPerM3 = waterRequiredM3 > 0 ? totalYieldKg / waterRequiredM3 : 0;
  const grossRev = crop.expectedYieldTonPerHa * crop.marketPricePerTon * farm.areaHa;
  const revenuePerM3 = waterRequiredM3 > 0 ? grossRev / waterRequiredM3 : 0;

  let conservationStatus: WaterEvaluationResult['conservationStatus'] = 'Sustainable Safe Margin';
  if (waterBalanceM3 < 0) {
    conservationStatus = 'Infeasible Deficit';
  } else if (waterBalanceM3 < waterAvailableM3 * 0.15) {
    conservationStatus = 'Critical Stress';
  } else if (waterBalanceM3 > waterAvailableM3 * 0.4) {
    conservationStatus = 'Optimal Surplus';
  }

  return {
    waterRequiredM3,
    waterAvailableM3,
    waterBalanceM3,
    isDeficit,
    waterEfficiencyKgPerM3: Math.round(waterEfficiencyKgPerM3 * 100) / 100,
    revenuePerM3: Math.round(revenuePerM3 * 10) / 10,
    irrigationEfficiencyFactor: methodEfficiency,
    conservationStatus
  };
}
