import { CropInfo, FarmProfile, SeasonName } from '../types/agricultural';

export interface ConstraintCheckResult {
  isFeasible: boolean;
  violations: string[];
  warnings: string[];
  waterCapacityRatio: number;
  budgetRatio: number;
  labourRatio: number;
}

/**
 * Validates hard and soft constraints for allocating a crop to a specific season in the rotation.
 */
export function validateCropSeasonConstraints(
  crop: CropInfo,
  farm: FarmProfile,
  seasonName: SeasonName,
  previousCrop: CropInfo | null,
  consecutiveFamilyCount: number,
  currentBudgetBalance: number,
  waterMultiplier: number = 1.0,
  yieldMultiplier: number = 1.0
): ConstraintCheckResult {
  const violations: string[] = [];
  const warnings: string[] = [];

  // 1. Season Suitability Constraint
  if (!crop.suitableSeasons.includes(seasonName)) {
    violations.push(
      `Agronomic Incompatibility: ${crop.name} is not suitable for ${seasonName}. Best planted in: ${crop.suitableSeasons.join(', ')}.`
    );
  }

  // 2. Water Capacity Constraint
  const adjustedWaterNeed = crop.waterRequirementM3PerHa * farm.areaHa;
  const availableWater = farm.availableWaterM3PerHa * farm.areaHa * waterMultiplier;
  const waterCapacityRatio = availableWater > 0 ? adjustedWaterNeed / availableWater : 999;

  if (adjustedWaterNeed > availableWater) {
    violations.push(
      `Water Deficit Infeasible: ${crop.name} requires ${(adjustedWaterNeed).toLocaleString()} m³ total water, but only ${(availableWater).toLocaleString()} m³ is available (${(waterCapacityRatio * 100).toFixed(0)}% of limit).`
    );
  } else if (waterCapacityRatio > 0.85) {
    warnings.push(
      `High Water Stress: Consumes ${(waterCapacityRatio * 100).toFixed(0)}% of seasonal irrigation quota.`
    );
  }

  // 3. Budget Constraint
  const seasonalCost = crop.costPerHa * farm.areaHa;
  const budgetRatio = currentBudgetBalance > 0 ? seasonalCost / currentBudgetBalance : 999;

  if (seasonalCost > currentBudgetBalance * 1.05) { // allow 5% contingency margin
    violations.push(
      `Budget Overrun: Estimated input cost (₹${seasonalCost.toLocaleString()}) exceeds available seasonal budget (₹${Math.round(currentBudgetBalance).toLocaleString()}).`
    );
  }

  // 4. Labour Availability Constraint
  // High-intensity crops (Tomato, Cotton, Onion) need 120-150 days/ha; Cereals need 45-60; Millets need 30
  let estimatedLabourDays = 50 * farm.areaHa;
  if (crop.category === 'Vegetable' || crop.id === 'cotton') {
    estimatedLabourDays = 110 * farm.areaHa;
  } else if (crop.category === 'Millet' || crop.id === 'chickpea') {
    estimatedLabourDays = 35 * farm.areaHa;
  }

  const labourRatio = farm.labourAvailabilityDays > 0 ? estimatedLabourDays / farm.labourAvailabilityDays : 1;
  if (estimatedLabourDays > farm.labourAvailabilityDays * 1.25) {
    violations.push(
      `Labour Deficit: Requires ~${Math.round(estimatedLabourDays)} labour days vs ${farm.labourAvailabilityDays} available.`
    );
  }

  // 5. Machinery Compatibility
  if (farm.machineryAvailability === 'Manual / Draft Animal' && (crop.id === 'potato' || crop.id === 'rice')) {
    warnings.push(`Heavy mechanization dependency: Puddling/digging efficiency may be constrained under manual tillage.`);
  }

  // 6. Disease Family Monoculture Constraint
  if (previousCrop) {
    if (previousCrop.diseaseFamily === crop.diseaseFamily && crop.diseaseFamily === 'Solanaceae') {
      violations.push(
        `Critical Pathogen Cycle: Successive Solanaceae crops (${previousCrop.name} → ${crop.name}) triggers fatal bacterial wilt & late blight recurrence.`
      );
    } else if (previousCrop.id === crop.id && consecutiveFamilyCount >= 2) {
      violations.push(
        `Monoculture Exhaustion: Continuous planting of ${crop.name} for ${consecutiveFamilyCount + 1} consecutive seasons violates rotational biosecurity.`
      );
    } else if (previousCrop.id === crop.id) {
      warnings.push(`Same-crop repetition: Pest vulnerability increases by ~25%. Consider rotating with a legume break.`);
    }
  }

  // 7. Soil pH Tolerances
  if (farm.soilPh < 5.5 && (crop.id === 'cotton' || crop.id === 'onion')) {
    violations.push(`Soil Acidity: ${crop.name} fails in acidic soil (pH ${farm.soilPh.toFixed(1)} < 6.0).`);
  }
  if (farm.soilPh > 8.5 && crop.id === 'potato') {
    violations.push(`Soil Alkalinity: Potato scab pathogen proliferates at alkaline pH ${farm.soilPh.toFixed(1)} (> 8.0).`);
  }

  return {
    isFeasible: violations.length === 0,
    violations,
    warnings,
    waterCapacityRatio,
    budgetRatio,
    labourRatio
  };
}
