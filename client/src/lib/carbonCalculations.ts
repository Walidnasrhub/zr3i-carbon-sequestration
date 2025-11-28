/**
 * Carbon Sequestration Calculation Library
 * Calculates CO2 sequestration from date palm farms
 */

export interface FarmData {
  areaHectares: number;
  treeCount: number;
  averageTreeAge: number; // in years
  treeSpecies: "date_palm" | "other";
  soilType: "sandy" | "loamy" | "clay";
  irrigationType: "drip" | "flood" | "rain_fed";
}

export interface CarbonMetrics {
  annualCO2Sequestration: number; // tons per year
  monthlySequestration: number; // tons per month
  totalBiomass: number; // tons
  soilCarbonStorage: number; // tons
  estimatedValue: number; // USD
  carbonCredits: number; // number of credits
}

/**
 * Calculate annual CO2 sequestration for date palm farm
 * Based on IPCC guidelines and FAO data
 */
export function calculateAnnualCO2Sequestration(
  farmData: FarmData
): CarbonMetrics {
  // Base sequestration rates (tons CO2/hectare/year)
  const baseSequestrationRates: Record<string, number> = {
    date_palm: 2.5, // Date palms sequester ~2.5 tons CO2/ha/year
    other: 1.5,
  };

  const baseRate = baseSequestrationRates[farmData.treeSpecies];

  // Age factor (younger trees sequester more)
  const ageFactor = Math.max(0.5, 1 - farmData.averageTreeAge * 0.02);

  // Soil carbon factor based on soil type
  const soilFactors: Record<string, number> = {
    sandy: 0.8,
    loamy: 1.0,
    clay: 1.2,
  };
  const soilFactor = soilFactors[farmData.soilType];

  // Irrigation factor (better irrigation = more growth)
  const irrigationFactors: Record<string, number> = {
    drip: 1.3,
    flood: 1.0,
    rain_fed: 0.7,
  };
  const irrigationFactor = irrigationFactors[farmData.irrigationType];

  // Calculate annual sequestration
  const annualSequestration =
    farmData.areaHectares *
    baseRate *
    ageFactor *
    soilFactor *
    irrigationFactor;

  // Calculate biomass (rough estimate: 1 ton CO2 = 0.27 tons carbon = 0.5 tons biomass)
  const totalBiomass = annualSequestration * 0.5 * farmData.averageTreeAge;

  // Soil carbon storage (typically 30-50% of above-ground carbon)
  const soilCarbonStorage = totalBiomass * 0.4;

  // Carbon credit value (typically $10-20 per ton CO2)
  const pricePerTon = 15;
  const estimatedValue = annualSequestration * pricePerTon;

  // Carbon credits (1 credit = 1 ton CO2)
  const carbonCredits = Math.floor(annualSequestration);

  return {
    annualCO2Sequestration: Math.round(annualSequestration * 100) / 100,
    monthlySequestration: Math.round((annualSequestration / 12) * 100) / 100,
    totalBiomass: Math.round(totalBiomass * 100) / 100,
    soilCarbonStorage: Math.round(soilCarbonStorage * 100) / 100,
    estimatedValue: Math.round(estimatedValue),
    carbonCredits,
  };
}

/**
 * Calculate monthly earnings based on carbon credits
 */
export function calculateMonthlyEarnings(
  monthlySequestration: number,
  pricePerTon: number = 15
): number {
  return Math.round(monthlySequestration * pricePerTon);
}

/**
 * Calculate annual earnings projection
 */
export function calculateAnnualEarnings(
  annualSequestration: number,
  pricePerTon: number = 15
): number {
  return Math.round(annualSequestration * pricePerTon);
}

/**
 * Calculate carbon sequestration growth projection
 */
export function calculateGrowthProjection(
  currentSequestration: number,
  years: number,
  growthRate: number = 0.05 // 5% annual growth
): number[] {
  const projection: number[] = [];
  let value = currentSequestration;

  for (let i = 0; i < years; i++) {
    projection.push(Math.round(value * 100) / 100);
    value *= 1 + growthRate;
  }

  return projection;
}

/**
 * Calculate equivalent environmental impact
 */
export function calculateEnvironmentalImpact(co2Tons: number) {
  return {
    treesEquivalent: Math.round(co2Tons * 16), // 1 tree absorbs ~60kg CO2/year
    carsOffRoad: Math.round(co2Tons / 4.6), // Average car emits 4.6 tons CO2/year
    housesOffGrid: Math.round(co2Tons / 4.5), // Average house emits 4.5 tons CO2/year
    flightsMitigated: Math.round(co2Tons / 2), // Round trip flight = 2 tons CO2
  };
}

/**
 * Calculate cumulative carbon sequestration over time
 */
export function calculateCumulativeSequestration(
  annualRate: number,
  years: number
): number {
  let cumulative = 0;
  let currentRate = annualRate;

  for (let i = 0; i < years; i++) {
    cumulative += currentRate;
    // Slight increase in sequestration as tree biomass grows
    currentRate *= 1.02;
  }

  return Math.round(cumulative * 100) / 100;
}

/**
 * Validate farm data
 */
export function validateFarmData(farmData: FarmData): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (farmData.areaHectares <= 0) {
    errors.push("Farm area must be greater than 0");
  }

  if (farmData.treeCount <= 0) {
    errors.push("Tree count must be greater than 0");
  }

  if (farmData.averageTreeAge < 0) {
    errors.push("Tree age cannot be negative");
  }

  if (farmData.averageTreeAge > 100) {
    errors.push("Tree age seems unrealistic (>100 years)");
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}
