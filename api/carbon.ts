import { VercelRequest, VercelResponse } from "@vercel/node";

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { farmSize, treeAge, cropType, soilType } = req.body;

  if (!farmSize || !treeAge) {
    return res.status(400).json({
      error: "Missing required parameters: farmSize, treeAge",
    });
  }

  try {
    const treesPerHectare = 100;
    const totalTrees = farmSize * treesPerHectare;

    // CO2 sequestration rate increases with age
    let ratePerTree = 0.1; // tons CO2/year
    if (treeAge >= 3) ratePerTree = 0.3;
    if (treeAge >= 5) ratePerTree = 0.5;
    if (treeAge >= 10) ratePerTree = 0.6;

    const annualCO2 = totalTrees * ratePerTree;
    const creditValue = annualCO2 * 15; // $15 per ton CO2
    const monthlyIncome = creditValue / 12;

    // 5-year projection
    const projections = [];
    for (let year = 1; year <= 5; year++) {
      let yearRate = 0.1;
      const projectedAge = treeAge + year;
      if (projectedAge >= 3) yearRate = 0.3;
      if (projectedAge >= 5) yearRate = 0.5;
      if (projectedAge >= 10) yearRate = 0.6;

      const yearCO2 = totalTrees * yearRate;
      const yearValue = yearCO2 * 15;

      projections.push({
        year,
        co2Sequestered: Math.round(yearCO2 * 100) / 100,
        estimatedIncome: Math.round(yearValue * 100) / 100,
        cumulativeCO2: Math.round(projections.reduce((sum, p) => sum + p.co2Sequestered, 0) * 100) / 100 + Math.round(yearCO2 * 100) / 100,
      });
    }

    // Environmental impact equivalencies
    const treesEquivalent = Math.round(annualCO2 / 0.021); // Average tree absorbs 21kg CO2/year
    const carsEquivalent = Math.round(annualCO2 / 4.6); // Average car emits 4.6 tons CO2/year
    const homesEquivalent = Math.round(annualCO2 / 4.8); // Average home emits 4.8 tons CO2/year
    const flightsEquivalent = Math.round(annualCO2 / 0.9); // Average flight emits 0.9 tons CO2

    return res.status(200).json({
      success: true,
      data: {
        farmMetrics: {
          farmSize,
          totalTrees,
          treeAge,
          cropType: cropType || "Date Palms",
          soilType: soilType || "Sandy Loam",
        },
        carbonMetrics: {
          annualCO2Sequestered: Math.round(annualCO2 * 100) / 100,
          annualCreditValue: Math.round(creditValue * 100) / 100,
          monthlyIncome: Math.round(monthlyIncome * 100) / 100,
          ratePerTree,
        },
        projections,
        environmentalImpact: {
          equivalentTrees: treesEquivalent,
          equivalentCarsRemovedFromRoad: carsEquivalent,
          equivalentHomesElectricityOffset: homesEquivalent,
          equivalentFlightsOffset: flightsEquivalent,
        },
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error("Carbon calculation error:", error);
    return res.status(500).json({
      error: "Failed to calculate carbon metrics",
      message: error instanceof Error ? error.message : "Unknown error",
    });
  }
}
