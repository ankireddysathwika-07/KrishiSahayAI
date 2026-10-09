import { CropInfo } from '../types/agricultural';

export interface DiseaseEvaluationResult {
  diseaseRiskScore: number; // 0 to 100
  riskCategory: 'Low' | 'Moderate' | 'High';
  contributingFactors: string[];
  mitigationBenefits: string[];
  pathogenPressureDescription: string;
  disclaimer: string;
}

export function evaluateCropDiseaseRisk(
  crop: CropInfo,
  previousCrop: CropInfo | null,
  recentCropHistory: CropInfo[],
  diseaseMultiplier: number = 1.0
): DiseaseEvaluationResult {
  let score = crop.diseaseRiskBase;
  const factors: string[] = [];
  const benefits: string[] = [];

  if (previousCrop) {
    // 1. Exact same crop repetition
    if (previousCrop.id === crop.id) {
      score += 28;
      factors.push(`Continuous monoculture of ${crop.name} intensifies root and foliar spore concentration.`);
    }

    // 2. Botanical Family pathogen sharing (e.g. Solanaceae: Tomato, Potato)
    if (previousCrop.diseaseFamily === crop.diseaseFamily && crop.diseaseFamily === 'Solanaceae') {
      score += 35;
      factors.push(`Family recurrence (${previousCrop.name} → ${crop.name}): Shared susceptibility to Phytophthora infestans (Late Blight) and Ralstonia.`);
    } else if (previousCrop.diseaseFamily === crop.diseaseFamily && crop.diseaseFamily !== 'Poaceae') {
      score += 18;
      factors.push(`Botanical family alignment (${crop.diseaseFamily}) perpetuates specialized subterranean nematodes.`);
    }

    // 3. Legume / Millet break crop sanitization
    if (previousCrop.category === 'Pulse / Legume' && crop.category !== 'Pulse / Legume') {
      score -= 16;
      benefits.push(`Rotational legume break (${previousCrop.name}) disrupted soil-borne fungal hyphae.`);
    } else if (previousCrop.id === 'millets') {
      score -= 22;
      benefits.push(`Bio-fumigation and allelopathic exudates from Millets cleared cereal rust and root-rot inoculum.`);
    }

    // 4. Preceding compatibility match
    if (crop.compatiblePreceding.includes(previousCrop.id) || crop.compatiblePreceding.includes('any')) {
      score -= 8;
      benefits.push(`Documented agronomic synergy between ${previousCrop.name} and ${crop.name}.`);
    }
  }

  // Frequency penalty over last 3 seasons
  const familyRepetitionsInHistory = recentCropHistory.filter(c => c.diseaseFamily === crop.diseaseFamily).length;
  if (familyRepetitionsInHistory >= 2) {
    score += 14;
    factors.push(`Elevated cumulative frequency: Family ${crop.diseaseFamily} appears ${familyRepetitionsInHistory + 1} times in recent horizons.`);
  }

  // Apply environmental scenario multiplier (e.g. heavy rain / humidity increases blight risk)
  score = Math.round(score * diseaseMultiplier);
  const finalScore = Math.max(8, Math.min(96, score));

  let riskCategory: 'Low' | 'Moderate' | 'High' = 'Low';
  if (finalScore >= 60) riskCategory = 'High';
  else if (finalScore >= 32) riskCategory = 'Moderate';

  let pathogenPressureDescription = '';
  if (riskCategory === 'High') {
    pathogenPressureDescription = `Severe pathogen buildup warning for ${crop.name}. High likelihood of fungal/bacterial recurrence under current rotational sequence.`;
  } else if (riskCategory === 'Moderate') {
    pathogenPressureDescription = `Controlled baseline risk. Routine prophylactic bio-pesticide monitoring recommended.`;
  } else {
    pathogenPressureDescription = `Optimal sanitary break. Rotational diversity actively starves specialized pest hosts.`;
  }

  return {
    diseaseRiskScore: finalScore,
    riskCategory,
    contributingFactors: factors.length > 0 ? factors : ['Standard baseline regional virulence'],
    mitigationBenefits: benefits.length > 0 ? benefits : ['Standard rotational interval'],
    pathogenPressureDescription,
    disclaimer: 'Decision-support simulation model for hackathon planning; not an on-field laboratory diagnosis.'
  };
}
