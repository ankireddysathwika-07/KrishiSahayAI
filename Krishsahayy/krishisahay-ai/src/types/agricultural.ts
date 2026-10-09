export type SeasonName = 'Kharif (Monsoon)' | 'Rabi (Winter)' | 'Zaid (Summer)';

export type SoilType = 'Loamy' | 'Clay' | 'Sandy' | 'Black Cotton' | 'Alluvial' | 'Red Soil';
export type IrrigationType = 'Drip Irrigation' | 'Sprinkler' | 'Canal / Flood' | 'Rainfed' | 'Tube-well Bore';

export interface CropInfo {
  id: string;
  name: string;
  scientificName: string;
  category: 'Cereal' | 'Pulse / Legume' | 'Oilseed' | 'Cash / Commercial' | 'Vegetable' | 'Millet';
  suitableSeasons: SeasonName[];
  durationDays: number;
  waterRequirementMm: number; // mm per hectare
  waterRequirementM3PerHa: number;
  expectedYieldTonPerHa: number;
  costPerHa: number; // INR
  marketPricePerTon: number; // INR
  nitrogenDemandKgPerHa: number; // positive = consumes, negative = fixes
  phosphorusDemandKgPerHa: number;
  potassiumDemandKgPerHa: number;
  organicMatterImpact: number; // -5 to +5 %
  diseaseRiskBase: number; // 0 to 100
  diseaseFamily: string; // e.g. 'Solanaceae', 'Poaceae', 'Fabaceae', 'Malvaceae'
  droughtTolerance: 'Low' | 'Moderate' | 'High' | 'Very High';
  compatiblePreceding: string[]; // crop ids or 'any'
  compatibleFollowing: string[]; // crop ids or 'any'
  soilTypeCompatibility: SoilType[];
  carbonSequestrationKgPerHa: number;
  description: string;
  keyBenefits: string[];
}

export interface FarmProfile {
  farmName: string;
  farmerName: string;
  location: string;
  areaHa: number;
  soilType: SoilType;
  soilPh: number;
  nitrogenKgPerHa: number;
  phosphorusKgPerHa: number;
  potassiumKgPerHa: number;
  organicMatterPercent: number;
  availableWaterM3PerHa: number;
  irrigationType: IrrigationType;
  budgetInr: number;
  labourAvailabilityDays: number;
  machineryAvailability: 'Full Mechanization' | 'Partial Mechanization' | 'Manual / Draft Animal';
  currentCropId: string;
  previousCropHistory: string[];
  planningHorizonYears: 1 | 2 | 3 | 5;
  seasonsPerYear: 1 | 2 | 3;
  optimalMoistureThreshold?: number; // Target optimal soil moisture threshold % (e.g. 45%)
  farmerPhone?: string;
  farmerEmail?: string;
}

export interface OptimizationWeights {
  profitability: number; // 0-100
  yieldWeight: number;
  soilHealth: number;
  waterEfficiency: number;
  diseaseRiskAversion: number;
}

export interface SeasonCropAllocation {
  year: number;
  seasonIndex: number;
  seasonName: SeasonName;
  crop: CropInfo;
  projectedYieldTons: number;
  projectedRevenueInr: number;
  projectedCostInr: number;
  netProfitInr: number;
  waterRequiredM3: number;
  waterAvailableM3: number;
  waterBalanceM3: number;
  soilNitrogenDeltaKg: number;
  soilPhosphorusDeltaKg: number;
  soilPotassiumDeltaKg: number;
  soilHealthScoreAfter: number;
  diseaseRiskScore: number;
  feasibilityIssues: string[];
  agronomicRationale: string;
}

export interface RotationPlan {
  id: string;
  strategyName: 'Profit-First' | 'Sustainability-First' | 'Balanced AI Plan';
  description: string;
  seasons: SeasonCropAllocation[];
  metrics: {
    totalRevenueInr: number;
    totalCostInr: number;
    netProfitInr: number;
    totalYieldTons: number;
    totalWaterUsedM3: number;
    waterAvailableM3: number;
    waterDeficitM3: number;
    waterEfficiencyPercent: number;
    initialSoilHealth: number;
    finalSoilHealth: number;
    soilHealthDelta: number;
    averageDiseaseRisk: number;
    cropDiversityCount: number;
    sustainabilityScore: number; // 0 - 100
    overallScore: number; // 0 - 100
  };
  isFeasible: boolean;
  rejectionReasons: string[];
  highlights: string[];
}

export interface SoilHealthTrendPoint {
  period: string;
  cropName: string;
  nitrogen: number;
  phosphorus: number;
  potassium: number;
  organicMatter: number;
  soilHealthIndex: number;
}

export interface StressScenario {
  id: 'normal' | 'drought' | 'market_crash' | 'heavy_rain' | 'extreme_weather' | 'missing_data' | 'corrupt_sensor';
  name: string;
  badge: string;
  description: string;
  waterModifier: number; // e.g. 0.5 for 50% drought
  priceModifier: { [cropId: string]: number }; // e.g. { tomato: 0.45 }
  diseaseModifier: number; // multiplier
  yieldModifier: number; // multiplier
  sensorCorrupted?: {
    field: string;
    corruptValue: number;
    fallbackValue: number;
    warning: string;
  };
}

export interface SensorValidationReport {
  isClean: boolean;
  warnings: string[];
  sanitizedProfile: FarmProfile;
  confidenceScore: number; // 0 - 100
  dataQualityRating: 'Optimal' | 'Degraded (Sanitized)' | 'Critical Anomaly Detected';
}

export interface AIExplanationResult {
  title: string;
  executiveSummary: string;
  cropByCropReasoning: {
    period: string;
    crop: string;
    whySelected: string;
    precedingBenefit: string;
    soilWaterTradeoff: string;
    riskManaged: string;
  }[];
  soilDynamicsExplanation: string;
  waterConservationVerdict: string;
  marketAndProfitAssumptions: string;
  stressResilienceSummary: string;
  agronomicConfidenceScore: number;
  disclaimer: string;
}
