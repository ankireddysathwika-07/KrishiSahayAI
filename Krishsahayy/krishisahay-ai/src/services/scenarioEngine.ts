import { FarmProfile, SensorValidationReport, StressScenario } from '../types/agricultural';

export const SCENARIO_DEFINITIONS: Record<string, StressScenario> = {
  normal: {
    id: 'normal',
    name: 'Normal Season Baseline',
    badge: 'Baseline Climate',
    description: 'Standard historical climatic patterns, normal monsoon distribution, and stable commodity prices.',
    waterModifier: 1.0,
    priceModifier: {},
    diseaseModifier: 1.0,
    yieldModifier: 1.0,
  },
  drought: {
    id: 'drought',
    name: 'Severe Drought Stress',
    badge: '45% Water Deficit',
    description: 'Monsoon failure drops groundwater table and canal supply by 45%. Evaporative transpiration increases.',
    waterModifier: 0.55,
    priceModifier: {
      rice: 1.15, // scarcity inflation
      millets: 1.25,
      tomato: 1.20,
    },
    diseaseModifier: 0.85, // dry conditions reduce some foliar fungal blights
    yieldModifier: 0.82,
  },
  market_crash: {
    id: 'market_crash',
    name: 'Sudden Market Crash',
    badge: 'Horticultural Price Collapse',
    description: 'Sudden glut & export restrictions collapse perishable cash crops: Tomato (-60%), Cotton (-30%), Onion (-40%).',
    waterModifier: 1.0,
    priceModifier: {
      tomato: 0.40,
      cotton: 0.70,
      onion: 0.60,
      potato: 0.75,
    },
    diseaseModifier: 1.0,
    yieldModifier: 1.0,
  },
  heavy_rain: {
    id: 'heavy_rain',
    name: 'Heavy Rain & Flooding',
    badge: 'Excess Moisture & Blight',
    description: 'Incessant precipitation induces waterlogging, soil compaction, and severe fungal spore amplification (+65%).',
    waterModifier: 1.4,
    priceModifier: {
      tomato: 1.35, // damaged supply drives up retail price
    },
    diseaseModifier: 1.65,
    yieldModifier: 0.88,
  },
  extreme_weather: {
    id: 'extreme_weather',
    name: 'Extreme Heatwave / Thermal Shock',
    badge: 'Terminal Heat Stress',
    description: 'Abnormal +4°C heat spike during flowering & grain filling slashes cereal yields across regional agro-climatic zones.',
    waterModifier: 0.80,
    priceModifier: {},
    diseaseModifier: 1.1,
    yieldModifier: 0.72,
  },
  missing_data: {
    id: 'missing_data',
    name: 'Incomplete Historical Data',
    badge: 'Uncertain Field History',
    description: 'Farmer has no verified multi-year soil health records or previous disease incidence history. Data uncertainty penalty applied.',
    waterModifier: 1.0,
    priceModifier: {},
    diseaseModifier: 1.15,
    yieldModifier: 0.95,
  },
  corrupt_sensor: {
    id: 'corrupt_sensor',
    name: 'Corrupted IoT Sensor Anomaly',
    badge: 'Adversarial Telemetry Fault',
    description: 'Faulty soil probe transmits physiologically impossible values (pH 13.8, Nitrogen 9,999 kg/ha). Evaluates auto-sanitization defense.',
    waterModifier: 1.0,
    priceModifier: {},
    diseaseModifier: 1.0,
    yieldModifier: 1.0,
    sensorCorrupted: {
      field: 'soilPh',
      corruptValue: 13.8,
      fallbackValue: 6.8,
      warning: 'CRITICAL ANOMALY: Soil probe reported pH 13.8 (alkaline caustic). Filtered by Adversarial Resilience Layer. Calibrated to safe regional loam default (pH 6.8).',
    },
  },
};

/**
 * Validates and sanitizes farmer input / IoT sensor data.
 * Protects the optimizer against poisoned, corrupted, or missing inputs.
 */
export function validateAndSanitizeSensors(
  rawProfile: FarmProfile,
  activeScenarioId: string = 'normal'
): SensorValidationReport {
  const warnings: string[] = [];
  const sanitized = { ...rawProfile };
  let qualityDeduction = 0;

  // Check if scenario injects corrupted sensor
  if (activeScenarioId === 'corrupt_sensor') {
    sanitized.soilPh = 13.8;
    sanitized.nitrogenKgPerHa = 9999;
  }

  // 1. pH Range Check (agronomic bounds: 3.5 - 9.8)
  if (sanitized.soilPh < 3.5 || sanitized.soilPh > 9.8) {
    warnings.push(
      `SUSPICIOUS SENSOR DATA: Detected extreme soil pH (${sanitized.soilPh.toFixed(1)}). Living plant roots disintegrate outside 3.5–9.8. Sanitized fallback applied: pH 6.8 (regional loamy average).`
    );
    sanitized.soilPh = 6.8;
    qualityDeduction += 30;
  }

  // 2. Nitrogen Check (normal agricultural soil rarely exceeds 600 kg/ha N)
  if (sanitized.nitrogenKgPerHa < 10 || sanitized.nitrogenKgPerHa > 600) {
    warnings.push(
      `SUSPICIOUS SENSOR DATA: Nitrogen probe reading ${sanitized.nitrogenKgPerHa} kg/ha is physiologically impossible or defective. Replaced with calibrated baseline: 240 kg/ha.`
    );
    sanitized.nitrogenKgPerHa = 240;
    qualityDeduction += 25;
  }

  // 3. Phosphorus Check (normal: 5 - 120 kg/ha)
  if (sanitized.phosphorusKgPerHa < 2 || sanitized.phosphorusKgPerHa > 150) {
    warnings.push(
      `SUSPICIOUS SENSOR DATA: Available Phosphorus (${sanitized.phosphorusKgPerHa} kg/ha) flagged out-of-range. Auto-corrected to 28 kg/ha.`
    );
    sanitized.phosphorusKgPerHa = 28;
    qualityDeduction += 15;
  }

  // 4. Potassium Check
  if (sanitized.potassiumKgPerHa < 20 || sanitized.potassiumKgPerHa > 700) {
    warnings.push(
      `SUSPICIOUS SENSOR DATA: Potassium reading (${sanitized.potassiumKgPerHa} kg/ha) out of agronomic spectrum. Sanitized to 195 kg/ha.`
    );
    sanitized.potassiumKgPerHa = 195;
    qualityDeduction += 15;
  }

  // 5. Water Quota Sanity Check
  if (sanitized.availableWaterM3PerHa <= 0) {
    warnings.push(`ZERO WATER ALERT: Available irrigation set to zero. Optimizer will strictly prioritize rainfed drought-tolerant millets or pulse breaks.`);
    qualityDeduction += 10;
  }

  // Missing data scenario deduction
  if (activeScenarioId === 'missing_data') {
    qualityDeduction += 25;
    warnings.push('HISTORICAL GAP: Missing multi-year prior crop records. Confidence interval widened.');
  }

  const confidenceScore = Math.max(25, 100 - qualityDeduction);
  let dataQualityRating: SensorValidationReport['dataQualityRating'] = 'Optimal';
  if (qualityDeduction >= 40) {
    dataQualityRating = 'Critical Anomaly Detected';
  } else if (qualityDeduction > 0) {
    dataQualityRating = 'Degraded (Sanitized)';
  }

  return {
    isClean: warnings.length === 0,
    warnings,
    sanitizedProfile: sanitized,
    confidenceScore,
    dataQualityRating,
  };
}
