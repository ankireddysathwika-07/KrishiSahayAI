import { CropInfo, FarmProfile } from '../types/agricultural';

export interface MarketPriceForecast {
  cropId: string;
  cropName: string;
  currentMspInrPerTon: number;
  modalMandiPriceInrPerTon: number;
  projectedPriceInrPerTon: number;
  priceTrend: 'Bullish (+12%)' | 'Stable (±3%)' | 'Volatile Bearish (-25%)' | 'Surging Demand (+20%)';
  demandOutlook: 'High Demand' | 'Balanced' | 'Oversupply Warning';
  volatilityIndex: number; // 0 to 100
}

export const CURRENT_MARKET_INTELLIGENCE: Record<string, MarketPriceForecast> = {
  rice: {
    cropId: 'rice',
    cropName: 'Rice (Paddy)',
    currentMspInrPerTon: 23200,
    modalMandiPriceInrPerTon: 23500,
    projectedPriceInrPerTon: 24000,
    priceTrend: 'Stable (±3%)',
    demandOutlook: 'High Demand',
    volatilityIndex: 18,
  },
  wheat: {
    cropId: 'wheat',
    cropName: 'Wheat',
    currentMspInrPerTon: 22750,
    modalMandiPriceInrPerTon: 23100,
    projectedPriceInrPerTon: 23500,
    priceTrend: 'Bullish (+12%)',
    demandOutlook: 'High Demand',
    volatilityIndex: 22,
  },
  maize: {
    cropId: 'maize',
    cropName: 'Maize (Corn)',
    currentMspInrPerTon: 20900,
    modalMandiPriceInrPerTon: 21500,
    projectedPriceInrPerTon: 22200,
    priceTrend: 'Surging Demand (+20%)',
    demandOutlook: 'High Demand',
    volatilityIndex: 34,
  },
  cotton: {
    cropId: 'cotton',
    cropName: 'Cotton',
    currentMspInrPerTon: 70200,
    modalMandiPriceInrPerTon: 71000,
    projectedPriceInrPerTon: 73500,
    priceTrend: 'Bullish (+12%)',
    demandOutlook: 'Balanced',
    volatilityIndex: 48,
  },
  soybean: {
    cropId: 'soybean',
    cropName: 'Soybean',
    currentMspInrPerTon: 46000,
    modalMandiPriceInrPerTon: 47200,
    projectedPriceInrPerTon: 48500,
    priceTrend: 'Bullish (+12%)',
    demandOutlook: 'High Demand',
    volatilityIndex: 31,
  },
  groundnut: {
    cropId: 'groundnut',
    cropName: 'Groundnut',
    currentMspInrPerTon: 63770,
    modalMandiPriceInrPerTon: 64500,
    projectedPriceInrPerTon: 66000,
    priceTrend: 'Surging Demand (+20%)',
    demandOutlook: 'High Demand',
    volatilityIndex: 35,
  },
  chickpea: {
    cropId: 'chickpea',
    cropName: 'Chickpea (Gram)',
    currentMspInrPerTon: 54400,
    modalMandiPriceInrPerTon: 55800,
    projectedPriceInrPerTon: 57500,
    priceTrend: 'Surging Demand (+20%)',
    demandOutlook: 'High Demand',
    volatilityIndex: 28,
  },
  tomato: {
    cropId: 'tomato',
    cropName: 'Tomato',
    currentMspInrPerTon: 0, // No MSP for perishables
    modalMandiPriceInrPerTon: 14000,
    projectedPriceInrPerTon: 15500,
    priceTrend: 'Volatile Bearish (-25%)',
    demandOutlook: 'Oversupply Warning',
    volatilityIndex: 78,
  },
  potato: {
    cropId: 'potato',
    cropName: 'Potato',
    currentMspInrPerTon: 0,
    modalMandiPriceInrPerTon: 12500,
    projectedPriceInrPerTon: 13200,
    priceTrend: 'Stable (±3%)',
    demandOutlook: 'Balanced',
    volatilityIndex: 52,
  },
  onion: {
    cropId: 'onion',
    cropName: 'Onion',
    currentMspInrPerTon: 0,
    modalMandiPriceInrPerTon: 19000,
    projectedPriceInrPerTon: 21000,
    priceTrend: 'Bullish (+12%)',
    demandOutlook: 'High Demand',
    volatilityIndex: 65,
  },
  millets: {
    cropId: 'millets',
    cropName: 'Millets',
    currentMspInrPerTon: 33000,
    modalMandiPriceInrPerTon: 34500,
    projectedPriceInrPerTon: 36000,
    priceTrend: 'Surging Demand (+20%)',
    demandOutlook: 'High Demand',
    volatilityIndex: 15,
  },
};

export interface EconomicCalculation {
  yieldTons: number;
  marketPricePerTon: number;
  grossRevenueInr: number;
  totalCostInr: number;
  netProfitInr: number;
  roiPercent: number;
  profitPerHa: number;
}

export function calculateCropEconomics(
  crop: CropInfo,
  farmAreaHa: number,
  yieldMultiplier: number = 1.0,
  priceMultiplier: number = 1.0
): EconomicCalculation {
  const yieldTons = Math.round(crop.expectedYieldTonPerHa * farmAreaHa * yieldMultiplier * 10) / 10;
  const basePrice = CURRENT_MARKET_INTELLIGENCE[crop.id]?.projectedPriceInrPerTon || crop.marketPricePerTon;
  const marketPricePerTon = Math.round(basePrice * priceMultiplier);
  const grossRevenueInr = Math.round(yieldTons * marketPricePerTon);
  const totalCostInr = Math.round(crop.costPerHa * farmAreaHa);
  const netProfitInr = grossRevenueInr - totalCostInr;
  const roiPercent = totalCostInr > 0 ? Math.round((netProfitInr / totalCostInr) * 100) : 0;
  const profitPerHa = farmAreaHa > 0 ? Math.round(netProfitInr / farmAreaHa) : 0;

  return {
    yieldTons,
    marketPricePerTon,
    grossRevenueInr,
    totalCostInr,
    netProfitInr,
    roiPercent,
    profitPerHa,
  };
}
