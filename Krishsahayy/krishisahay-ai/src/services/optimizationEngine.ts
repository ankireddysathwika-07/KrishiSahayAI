import {
  CropInfo,
  FarmProfile,
  OptimizationWeights,
  RotationPlan,
  SeasonCropAllocation,
  SeasonName,
  StressScenario,
} from '../types/agricultural';
import { CROPS_DATABASE, getCropById, getCropsForSeason } from './cropData';
import { validateCropSeasonConstraints } from './constraintEngine';
import { calculateSoilHealthScore, simulateSoilStep } from './soilModel';
import { evaluateSeasonalWater } from './waterModel';
import { evaluateCropDiseaseRisk } from './diseaseModel';
import { calculateCropEconomics, CURRENT_MARKET_INTELLIGENCE } from './marketModel';
import { SCENARIO_DEFINITIONS, validateAndSanitizeSensors } from './scenarioEngine';

export interface OptimizationRunResult {
  profitPlan: RotationPlan;
  sustainabilityPlan: RotationPlan;
  balancedPlan: RotationPlan;
  bestFeasiblePlan: RotationPlan;
  allEvaluatedPlansCount: number;
  dataQualityConfidence: number;
  activeScenario: StressScenario;
  sensorSanitizationWarnings: string[];
}

/**
 * Normalizes user weights to sum to 1.0 (100%)
 */
export function normalizeWeights(weights: OptimizationWeights): {
  wProfit: number;
  wYield: number;
  wSoil: number;
  wWater: number;
  wDisease: number;
} {
  const sum =
    weights.profitability +
    weights.yieldWeight +
    weights.soilHealth +
    weights.waterEfficiency +
    weights.diseaseRiskAversion;

  if (sum <= 0) {
    return { wProfit: 0.3, wYield: 0.2, wSoil: 0.2, wWater: 0.15, wDisease: 0.15 };
  }

  return {
    wProfit: weights.profitability / sum,
    wYield: weights.yieldWeight / sum,
    wSoil: weights.soilHealth / sum,
    wWater: weights.waterEfficiency / sum,
    wDisease: weights.diseaseRiskAversion / sum,
  };
}

/**
 * Generates the sequence of season descriptors based on horizon and seasons per year.
 */
function getSeasonSequence(years: number, seasonsPerYear: number): { year: number; seasonIndex: number; seasonName: SeasonName }[] {
  const seasons: SeasonName[] =
    seasonsPerYear === 1
      ? ['Kharif (Monsoon)']
      : seasonsPerYear === 2
      ? ['Kharif (Monsoon)', 'Rabi (Winter)']
      : ['Kharif (Monsoon)', 'Rabi (Winter)', 'Zaid (Summer)'];

  const sequence: { year: number; seasonIndex: number; seasonName: SeasonName }[] = [];

  for (let y = 1; y <= years; y++) {
    for (let s = 0; s < seasons.length; s++) {
      sequence.push({
        year: y,
        seasonIndex: s + 1,
        seasonName: seasons[s],
      });
    }
  }

  return sequence;
}

/**
 * Evaluates a specific sequential candidate combination of crops through the multi-season simulation.
 */
function evaluateCandidateSequence(
  crops: CropInfo[],
  sequenceInfo: { year: number; seasonIndex: number; seasonName: SeasonName }[],
  farm: FarmProfile,
  scenario: StressScenario,
  weights: { wProfit: number; wYield: number; wSoil: number; wWater: number; wDisease: number },
  strategyName: 'Profit-First' | 'Sustainability-First' | 'Balanced AI Plan',
  strategyDescription: string
): RotationPlan {
  const allocations: SeasonCropAllocation[] = [];
  const rejectionReasons: string[] = [];

  let currentN = farm.nitrogenKgPerHa;
  let currentP = farm.phosphorusKgPerHa;
  let currentK = farm.potassiumKgPerHa;
  let currentOM = farm.organicMatterPercent;
  const initialSoilHealth = calculateSoilHealthScore(currentN, currentP, currentK, currentOM, farm.soilPh);

  let totalRevenueInr = 0;
  let totalCostInr = 0;
  let totalYieldTons = 0;
  let totalWaterUsedM3 = 0;
  let totalAvailableWaterM3 = 0;
  let totalDiseaseScoreSum = 0;

  const pastCrops: CropInfo[] = farm.previousCropHistory.map(id => getCropById(id));
  let runningBudget = farm.budgetInr;

  for (let i = 0; i < crops.length; i++) {
    const crop = crops[i];
    const seq = sequenceInfo[i];
    const prevCrop = i > 0 ? crops[i - 1] : pastCrops.length > 0 ? pastCrops[pastCrops.length - 1] : null;

    // Consecutive same crop count
    let consecutiveCount = 1;
    for (let j = i - 1; j >= 0; j--) {
      if (crops[j].id === crop.id) consecutiveCount++;
      else break;
    }

    // Constraint evaluation
    const constraintCheck = validateCropSeasonConstraints(
      crop,
      farm,
      seq.seasonName,
      prevCrop,
      consecutiveCount,
      runningBudget > 0 ? runningBudget : farm.budgetInr * 0.4,
      scenario.waterModifier,
      scenario.yieldModifier
    );

    if (!constraintCheck.isFeasible) {
      rejectionReasons.push(
        `Year ${seq.year} ${seq.seasonName}: ${crop.name} rejected. ${constraintCheck.violations.join('; ')}`
      );
    }

    // Economics
    const priceMod = scenario.priceModifier[crop.id] || 1.0;
    const economics = calculateCropEconomics(crop, farm.areaHa, scenario.yieldModifier, priceMod);

    // Water
    const water = evaluateSeasonalWater(crop, farm, scenario.waterModifier);

    // Soil dynamics
    const soilStep = simulateSoilStep(currentN, currentP, currentK, currentOM, farm.soilPh, crop);
    currentN = soilStep.nitrogenAfter;
    currentP = soilStep.phosphorusAfter;
    currentK = soilStep.potassiumAfter;
    currentOM = soilStep.organicMatterAfter;

    // Disease
    const disease = evaluateCropDiseaseRisk(crop, prevCrop, pastCrops.concat(crops.slice(0, i)), scenario.diseaseModifier);

    // Cumulative stats
    totalRevenueInr += economics.grossRevenueInr;
    totalCostInr += economics.totalCostInr;
    totalYieldTons += economics.yieldTons;
    totalWaterUsedM3 += water.waterRequiredM3;
    totalAvailableWaterM3 += water.waterAvailableM3;
    totalDiseaseScoreSum += disease.diseaseRiskScore;

    // Update seasonal budget rolling balance
    runningBudget = runningBudget - economics.totalCostInr + economics.netProfitInr * 0.5;

    // Rationale construction
    let rationale = '';
    if (crop.category === 'Pulse / Legume') {
      rationale = `Legume nitrogen-fixation restorative phase (+${Math.abs(soilStep.nitrogenDelta)} kg N/ha, disease break).`;
    } else if (crop.id === 'millets') {
      rationale = `Climate-resilient low-water buffer (consumes only ${water.waterRequiredM3} m³ water, minimal pest vulnerability).`;
    } else if (economics.profitPerHa > 50000) {
      rationale = `High-value commercial cash generation (projected ₹${economics.profitPerHa.toLocaleString()}/ha net margin).`;
    } else {
      rationale = `Stable food security cereal anchor with steady procurement market price.`;
    }

    allocations.push({
      year: seq.year,
      seasonIndex: seq.seasonIndex,
      seasonName: seq.seasonName,
      crop,
      projectedYieldTons: economics.yieldTons,
      projectedRevenueInr: economics.grossRevenueInr,
      projectedCostInr: economics.totalCostInr,
      netProfitInr: economics.netProfitInr,
      waterRequiredM3: water.waterRequiredM3,
      waterAvailableM3: water.waterAvailableM3,
      waterBalanceM3: water.waterBalanceM3,
      soilNitrogenDeltaKg: soilStep.nitrogenDelta,
      soilPhosphorusDeltaKg: soilStep.phosphorusDelta,
      soilPotassiumDeltaKg: soilStep.potassiumDelta,
      soilHealthScoreAfter: soilStep.soilHealthScore,
      diseaseRiskScore: disease.diseaseRiskScore,
      feasibilityIssues: constraintCheck.violations,
      agronomicRationale: rationale,
    });
  }

  const netProfitInr = totalRevenueInr - totalCostInr;
  const finalSoilHealth = calculateSoilHealthScore(currentN, currentP, currentK, currentOM, farm.soilPh);
  const soilHealthDelta = finalSoilHealth - initialSoilHealth;
  const avgDiseaseRisk = Math.round(totalDiseaseScoreSum / crops.length);
  const uniqueCrops = new Set(crops.map(c => c.id)).size;
  const waterDeficit = Math.max(0, totalWaterUsedM3 - totalAvailableWaterM3);
  const waterEfficiencyPercent =
    totalAvailableWaterM3 > 0
      ? Math.max(0, Math.min(100, Math.round((1 - totalWaterUsedM3 / totalAvailableWaterM3) * 100)))
      : 0;

  // Sustainability score formula: balances soil improvement, water safety, disease suppression, and diversity
  const soilComponent = Math.min(100, Math.max(10, finalSoilHealth + soilHealthDelta * 2));
  const waterComponent = waterDeficit > 0 ? 15 : Math.min(100, 50 + waterEfficiencyPercent * 0.5);
  const diseaseComponent = Math.max(10, 100 - avgDiseaseRisk);
  const diversityComponent = Math.min(100, (uniqueCrops / Math.min(4, crops.length)) * 100);

  const sustainabilityScore = Math.round(
    soilComponent * 0.35 + waterComponent * 0.30 + diseaseComponent * 0.20 + diversityComponent * 0.15
  );

  // Profit normalized score (e.g. 0 to 100 based on realistic baseline profit per ha)
  const profitPerHaPerSeason = netProfitInr / (farm.areaHa * crops.length);
  const profitScore = Math.max(10, Math.min(100, Math.round((profitPerHaPerSeason / 65000) * 100)));

  // Yield normalized score
  const avgYieldTon = totalYieldTons / (farm.areaHa * crops.length);
  const yieldScore = Math.max(10, Math.min(100, Math.round((avgYieldTon / 8.0) * 100)));

  // Multi-objective weighted score
  const rawWeightedScore =
    profitScore * weights.wProfit +
    yieldScore * weights.wYield +
    soilComponent * weights.wSoil +
    waterComponent * weights.wWater +
    diseaseComponent * weights.wDisease;

  // Infeasible penalty
  const isFeasible = rejectionReasons.length === 0;
  const finalScore = isFeasible ? Math.round(rawWeightedScore) : Math.round(rawWeightedScore * 0.45);

  const highlights: string[] = [];
  if (soilHealthDelta > 0) highlights.push(`Net soil health enhancement (+${soilHealthDelta} pts)`);
  if (waterDeficit === 0) highlights.push(`100% within irrigation quota (${totalWaterUsedM3.toLocaleString()} m³ consumed)`);
  if (netProfitInr > 0) highlights.push(`Net profit: ₹${Math.round(netProfitInr).toLocaleString()} across ${crops.length} seasons`);
  if (uniqueCrops >= 3) highlights.push(`High rotational biodiversity (${uniqueCrops} distinct species)`);

  return {
    id: `${strategyName.toLowerCase().replace(/[^a-z0-9]/g, '-')}-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    strategyName,
    description: strategyDescription,
    seasons: allocations,
    metrics: {
      totalRevenueInr,
      totalCostInr,
      netProfitInr,
      totalYieldTons: Math.round(totalYieldTons * 10) / 10,
      totalWaterUsedM3,
      waterAvailableM3: totalAvailableWaterM3,
      waterDeficitM3: waterDeficit,
      waterEfficiencyPercent,
      initialSoilHealth,
      finalSoilHealth,
      soilHealthDelta,
      averageDiseaseRisk: avgDiseaseRisk,
      cropDiversityCount: uniqueCrops,
      sustainabilityScore,
      overallScore: finalScore,
    },
    isFeasible,
    rejectionReasons,
    highlights,
  };
}

/**
 * Searches candidate rotation permutations and produces 3 distinct strategic rotation plans:
 * 1. Profit-First Plan
 * 2. Sustainability-First Plan
 * 3. Balanced AI Plan
 */
export function runOptimizationEngine(
  rawProfile: FarmProfile,
  weights: OptimizationWeights,
  scenarioId: string = 'normal'
): OptimizationRunResult {
  const scenario = SCENARIO_DEFINITIONS[scenarioId] || SCENARIO_DEFINITIONS.normal;
  const sanitization = validateAndSanitizeSensors(rawProfile, scenarioId);
  const farm = sanitization.sanitizedProfile;

  const sequence = getSeasonSequence(farm.planningHorizonYears, farm.seasonsPerYear);
  const normalizedUserWeights = normalizeWeights(weights);

  // Pre-filter crops by season suitability
  const seasonEligibleCrops: CropInfo[][] = sequence.map(s => {
    let eligible = getCropsForSeason(s.seasonName);
    // If soil type is incompatible, filter or de-prioritize
    eligible = eligible.filter(c => c.soilTypeCompatibility.includes(farm.soilType));
    if (eligible.length === 0) {
      eligible = getCropsForSeason(s.seasonName); // fallback to all seasonal crops
    }
    return eligible;
  });

  // Candidate generation heuristic:
  // We construct candidate rotation sequences reflecting:
  // - High profitability candidates (Tomato, Cotton, Onion, Wheat, Maize)
  // - Sustainability candidates (Soybean, Chickpea, Groundnut, Millets)
  // - Balanced diversified agro-ecological rotations (Cereal -> Legume -> Cash/Millet)

  const candidateSequences: CropInfo[][] = [];

  // Generate 18-36 diverse plausible sequences
  const numSteps = sequence.length;

  // Helper to build a sequence with a policy
  function buildPolicySequence(policy: 'profit' | 'sustainability' | 'balanced' | 'drought' | 'cereal_pulse'): CropInfo[] {
    const seqCrops: CropInfo[] = [];

    for (let step = 0; step < numSteps; step++) {
      const eligible = seasonEligibleCrops[step];
      const prevCrop = step > 0 ? seqCrops[step - 1] : null;

      // Filter out identical crop or identical solanaceae family to prevent monoculture failure
      let filtered = eligible.filter(c => {
        if (!prevCrop) return true;
        if (prevCrop.diseaseFamily === 'Solanaceae' && c.diseaseFamily === 'Solanaceae') return false;
        if (prevCrop.id === c.id) return false;
        return true;
      });

      if (filtered.length === 0) filtered = eligible;

      // If scenario is drought or water is tight, strongly favor low-water crops
      if (scenario.waterModifier < 0.75 || farm.availableWaterM3PerHa < 4000) {
        const droughtOrder = [...filtered].sort((a, b) => a.waterRequirementMm - b.waterRequirementMm);
        seqCrops.push(droughtOrder[step % droughtOrder.length]);
        continue;
      }

      if (policy === 'profit') {
        // Sort by expected net margin per ha
        const sorted = [...filtered].sort((a, b) => {
          const priceA = (CURRENT_MARKET_INTELLIGENCE[a.id]?.projectedPriceInrPerTon || a.marketPricePerTon) * (scenario.priceModifier[a.id] || 1);
          const priceB = (CURRENT_MARKET_INTELLIGENCE[b.id]?.projectedPriceInrPerTon || b.marketPricePerTon) * (scenario.priceModifier[b.id] || 1);
          const marginA = a.expectedYieldTonPerHa * priceA - a.costPerHa;
          const marginB = b.expectedYieldTonPerHa * priceB - b.costPerHa;
          return marginB - marginA;
        });
        seqCrops.push(sorted[0] || eligible[0]);
      } else if (policy === 'sustainability') {
        // Alternate legume and low water crops
        const isLegumeStep = step % 2 === 1;
        const legumes = filtered.filter(c => c.category === 'Pulse / Legume');
        if (isLegumeStep && legumes.length > 0) {
          seqCrops.push(legumes[0]);
        } else {
          // pick lowest water / highest OM crop
          const sorted = [...filtered].sort((a, b) => b.organicMatterImpact - a.organicMatterImpact);
          seqCrops.push(sorted[0] || eligible[0]);
        }
      } else if (policy === 'drought') {
        const sorted = [...filtered].sort((a, b) => a.waterRequirementMm - b.waterRequirementMm);
        seqCrops.push(sorted[0] || eligible[0]);
      } else {
        // Balanced: rotate cereal -> pulse -> cash/vegetable -> millet
        const preferredCategories = ['Cereal', 'Pulse / Legume', 'Cash / Commercial', 'Millet', 'Vegetable'];
        const targetCategory = preferredCategories[step % preferredCategories.length];
        const match = filtered.find(c => c.category === targetCategory);
        if (match) {
          seqCrops.push(match);
        } else {
          // Pick best trade-off
          seqCrops.push(filtered[step % filtered.length]);
        }
      }
    }
    return seqCrops;
  }

  // Build candidate pool
  candidateSequences.push(buildPolicySequence('profit'));
  candidateSequences.push(buildPolicySequence('sustainability'));
  candidateSequences.push(buildPolicySequence('balanced'));
  candidateSequences.push(buildPolicySequence('drought'));
  candidateSequences.push(buildPolicySequence('cereal_pulse'));

  // Add variations to candidate pool for thorough optimization search
  for (let variation = 0; variation < 12; variation++) {
    const varCrops: CropInfo[] = [];
    for (let step = 0; step < numSteps; step++) {
      const eligible = seasonEligibleCrops[step];
      const prevCrop = step > 0 ? varCrops[step - 1] : null;
      const nonMonoculture = eligible.filter(c => !prevCrop || (c.id !== prevCrop.id && !(c.diseaseFamily === 'Solanaceae' && prevCrop.diseaseFamily === 'Solanaceae')));
      const pool = nonMonoculture.length > 0 ? nonMonoculture : eligible;
      const pick = pool[(variation + step) % pool.length];
      varCrops.push(pick);
    }
    candidateSequences.push(varCrops);
  }

  // Weight configs for the three distinct strategies:
  const profitWeights = { wProfit: 0.60, wYield: 0.20, wSoil: 0.08, wWater: 0.06, wDisease: 0.06 };
  const sustainWeights = { wProfit: 0.10, wYield: 0.05, wSoil: 0.40, wWater: 0.30, wDisease: 0.15 };
  const balancedWeights = normalizedUserWeights;

  // Evaluate all candidates under the three strategies
  const evaluatedProfitCandidates = candidateSequences.map(seq =>
    evaluateCandidateSequence(
      seq,
      sequence,
      farm,
      scenario,
      profitWeights,
      'Profit-First',
      'Engineered to maximize gross margins and high-yield commercial monetization within operating limits.'
    )
  );

  const evaluatedSustainCandidates = candidateSequences.map(seq =>
    evaluateCandidateSequence(
      seq,
      sequence,
      farm,
      scenario,
      sustainWeights,
      'Sustainability-First',
      'Optimizes organic soil health, natural nitrogen fixation, and groundwater water table preservation.'
    )
  );

  const evaluatedBalancedCandidates = candidateSequences.map(seq =>
    evaluateCandidateSequence(
      seq,
      sequence,
      farm,
      scenario,
      balancedWeights,
      'Balanced AI Plan',
      'Multi-objective Pareto equilibrium harmonizing high profitability, soil enrichment, and biosecurity.'
    )
  );

  // Helper to pick best plan (prefer feasible, then highest score)
  function pickBestPlan(plans: RotationPlan[]): RotationPlan {
    const feasible = plans.filter(p => p.isFeasible);
    if (feasible.length > 0) {
      feasible.sort((a, b) => b.metrics.overallScore - a.metrics.overallScore);
      return feasible[0];
    }
    // If none feasible, sort by fewest violations and highest score
    plans.sort((a, b) => {
      if (a.rejectionReasons.length !== b.rejectionReasons.length) {
        return a.rejectionReasons.length - b.rejectionReasons.length;
      }
      return b.metrics.overallScore - a.metrics.overallScore;
    });
    return plans[0];
  }

  const profitPlan = pickBestPlan(evaluatedProfitCandidates);
  const sustainabilityPlan = pickBestPlan(evaluatedSustainCandidates);
  const balancedPlan = pickBestPlan(evaluatedBalancedCandidates);

  return {
    profitPlan,
    sustainabilityPlan,
    balancedPlan,
    bestFeasiblePlan: balancedPlan.isFeasible ? balancedPlan : (sustainabilityPlan.isFeasible ? sustainabilityPlan : profitPlan),
    allEvaluatedPlansCount: candidateSequences.length * 3,
    dataQualityConfidence: sanitization.confidenceScore,
    activeScenario: scenario,
    sensorSanitizationWarnings: sanitization.warnings,
  };
}
