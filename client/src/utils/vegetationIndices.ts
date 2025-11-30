/**
 * Vegetation Indices Calculation Utilities
 * These functions calculate real vegetation indices from Sentinel-2 satellite bands
 */

export interface SentinelBands {
  B2?: number; // Blue (490nm)
  B3?: number; // Green (560nm)
  B4?: number; // Red (665nm)
  B5?: number; // Vegetation Red Edge (705nm)
  B6?: number; // Vegetation Red Edge (740nm)
  B7?: number; // Vegetation Red Edge (783nm)
  B8?: number; // Near Infrared (842nm)
  B8A?: number; // Vegetation Red Edge (865nm)
  B11?: number; // Short Wave Infrared (1610nm)
  B12?: number; // Short Wave Infrared (2190nm)
}

export interface VegetationIndices {
  ndvi: number; // Normalized Difference Vegetation Index
  evi: number; // Enhanced Vegetation Index
  ndbi: number; // Normalized Difference Built-up Index
  ndmi: number; // Normalized Difference Moisture Index
  ndii: number; // Normalized Difference Infrared Index
  ndsi: number; // Normalized Difference Snow Index
  gndvi: number; // Green Normalized Difference Vegetation Index
  osavi: number; // Optimized Soil-Adjusted Vegetation Index
}

/**
 * Calculate NDVI (Normalized Difference Vegetation Index)
 * NDVI = (NIR - Red) / (NIR + Red)
 * Range: -1 to 1 (higher = more vegetation)
 */
export function calculateNDVI(bands: SentinelBands): number {
  if (!bands.B8 || !bands.B4) return 0;
  const nir = bands.B8;
  const red = bands.B4;
  const ndvi = (nir - red) / (nir + red);
  return isNaN(ndvi) ? 0 : Math.max(-1, Math.min(1, ndvi));
}

/**
 * Calculate EVI (Enhanced Vegetation Index)
 * EVI = 2.5 * ((NIR - Red) / (NIR + 6*Red - 7.5*Blue + 1))
 * More sensitive to canopy variations than NDVI
 */
export function calculateEVI(bands: SentinelBands): number {
  if (!bands.B8 || !bands.B4 || !bands.B2) return 0;
  const nir = bands.B8;
  const red = bands.B4;
  const blue = bands.B2;
  const numerator = nir - red;
  const denominator = nir + 6 * red - 7.5 * blue + 1;
  if (denominator === 0) return 0;
  const evi = 2.5 * (numerator / denominator);
  return isNaN(evi) ? 0 : Math.max(-1, Math.min(1, evi));
}

/**
 * Calculate NDBI (Normalized Difference Built-up Index)
 * NDBI = (SWIR - NIR) / (SWIR + NIR)
 * Detects urban areas and built-up surfaces
 */
export function calculateNDBI(bands: SentinelBands): number {
  if (!bands.B11 || !bands.B8) return 0;
  const swir = bands.B11;
  const nir = bands.B8;
  const ndbi = (swir - nir) / (swir + nir);
  return isNaN(ndbi) ? 0 : Math.max(-1, Math.min(1, ndbi));
}

/**
 * Calculate NDMI (Normalized Difference Moisture Index)
 * NDMI = (NIR - SWIR) / (NIR + SWIR)
 * Indicates vegetation moisture content
 */
export function calculateNDMI(bands: SentinelBands): number {
  if (!bands.B8 || !bands.B11) return 0;
  const nir = bands.B8;
  const swir = bands.B11;
  const ndmi = (nir - swir) / (nir + swir);
  return isNaN(ndmi) ? 0 : Math.max(-1, Math.min(1, ndmi));
}

/**
 * Calculate NDII (Normalized Difference Infrared Index)
 * NDII = (NIR - SWIR) / (NIR + SWIR)
 * Similar to NDMI, measures water content
 */
export function calculateNDII(bands: SentinelBands): number {
  return calculateNDMI(bands); // Same formula as NDMI
}

/**
 * Calculate NDSI (Normalized Difference Snow Index)
 * NDSI = (Green - SWIR) / (Green + SWIR)
 * Detects snow and ice
 */
export function calculateNDSI(bands: SentinelBands): number {
  if (!bands.B3 || !bands.B11) return 0;
  const green = bands.B3;
  const swir = bands.B11;
  const ndsi = (green - swir) / (green + swir);
  return isNaN(ndsi) ? 0 : Math.max(-1, Math.min(1, ndsi));
}

/**
 * Calculate GNDVI (Green Normalized Difference Vegetation Index)
 * GNDVI = (NIR - Green) / (NIR + Green)
 * More sensitive to chlorophyll content
 */
export function calculateGNDVI(bands: SentinelBands): number {
  if (!bands.B8 || !bands.B3) return 0;
  const nir = bands.B8;
  const green = bands.B3;
  const gndvi = (nir - green) / (nir + green);
  return isNaN(gndvi) ? 0 : Math.max(-1, Math.min(1, gndvi));
}

/**
 * Calculate OSAVI (Optimized Soil-Adjusted Vegetation Index)
 * OSAVI = (NIR - Red) / (NIR + Red + 0.16)
 * Reduces soil background effects
 */
export function calculateOSAVI(bands: SentinelBands): number {
  if (!bands.B8 || !bands.B4) return 0;
  const nir = bands.B8;
  const red = bands.B4;
  const osavi = (nir - red) / (nir + red + 0.16);
  return isNaN(osavi) ? 0 : Math.max(-1, Math.min(1, osavi));
}

/**
 * Calculate all vegetation indices at once
 */
export function calculateAllIndices(bands: SentinelBands): VegetationIndices {
  return {
    ndvi: calculateNDVI(bands),
    evi: calculateEVI(bands),
    ndbi: calculateNDBI(bands),
    ndmi: calculateNDMI(bands),
    ndii: calculateNDII(bands),
    ndsi: calculateNDSI(bands),
    gndvi: calculateGNDVI(bands),
    osavi: calculateOSAVI(bands),
  };
}

/**
 * Interpret NDVI value for vegetation health
 */
export function interpretNDVI(ndvi: number): {
  status: string;
  color: string;
  description: string;
} {
  if (ndvi < -0.1) {
    return {
      status: "Water",
      color: "#0066cc",
      description: "Water bodies",
    };
  } else if (ndvi < 0.1) {
    return {
      status: "Bare Soil",
      color: "#8B7355",
      description: "No vegetation",
    };
  } else if (ndvi < 0.3) {
    return {
      status: "Sparse",
      color: "#FFFF00",
      description: "Sparse vegetation",
    };
  } else if (ndvi < 0.5) {
    return {
      status: "Moderate",
      color: "#90EE90",
      description: "Moderate vegetation",
    };
  } else if (ndvi < 0.7) {
    return {
      status: "Good",
      color: "#228B22",
      description: "Good vegetation",
    };
  } else {
    return {
      status: "Excellent",
      color: "#006400",
      description: "Excellent vegetation health",
    };
  }
}

/**
 * Get NDVI color for visualization
 */
export function getNDVIColor(ndvi: number): string {
  const interpretation = interpretNDVI(ndvi);
  return interpretation.color;
}

/**
 * Scale NDVI to 0-100 percentage
 */
export function ndviToPercentage(ndvi: number): number {
  // Scale from [-1, 1] to [0, 100]
  return Math.round(((ndvi + 1) / 2) * 100);
}

/**
 * Normalize indices for display (scale from [-1, 1] to [0, 1])
 */
export function normalizeIndex(index: number): number {
  return (index + 1) / 2;
}
