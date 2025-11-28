import { Router, Request, Response } from 'express';
import { getSentinelHubClient, type SatelliteImage } from '../utils/sentinelHub';

const router = Router();

/**
 * GET /api/satellite
 * Fetch satellite imagery and vegetation indices for a given location
 * Query params:
 *   - lat: latitude (required)
 *   - lng: longitude (required)
 *   - months: number of months of historical data (default: 3)
 *   - maxCloudCover: maximum cloud cover percentage (default: 20)
 */
router.get('/satellite', async (req: Request, res: Response) => {
  try {
    const { lat, lng, months = 3, maxCloudCover = 20 } = req.query;

    // Validate parameters
    if (!lat || !lng) {
      return res.status(400).json({
        error: 'Missing required parameters: lat and lng',
      });
    }

    const latitude = parseFloat(lat as string);
    const longitude = parseFloat(lng as string);
    const monthsNum = parseInt(months as string) || 3;
    const cloudCoverNum = parseInt(maxCloudCover as string) || 20;

    // Validate coordinate ranges
    if (isNaN(latitude) || isNaN(longitude)) {
      return res.status(400).json({
        error: 'Invalid latitude or longitude values',
      });
    }

    if (latitude < -90 || latitude > 90) {
      return res.status(400).json({
        error: 'Latitude must be between -90 and 90',
      });
    }

    if (longitude < -180 || longitude > 180) {
      return res.status(400).json({
        error: 'Longitude must be between -180 and 180',
      });
    }

    // Get Sentinel Hub client
    const sentinelHub = getSentinelHubClient();

    // Fetch historical satellite data
    const images = await sentinelHub.getHistoricalData(
      latitude,
      longitude,
      monthsNum
    );

    // Filter by cloud cover
    const filteredImages = images.filter(img => img.cloudCover <= cloudCoverNum);

    // Sort by date (most recent first)
    const sortedImages = filteredImages.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );

    return res.json({
      success: true,
      location: {
        latitude,
        longitude,
      },
      parameters: {
        months: monthsNum,
        maxCloudCover: cloudCoverNum,
      },
      images: sortedImages,
      metadata: {
        totalImages: sortedImages.length,
        dateRange: {
          start: sortedImages.length > 0 ? sortedImages[sortedImages.length - 1].date : null,
          end: sortedImages.length > 0 ? sortedImages[0].date : null,
        },
        averageCloudCover:
          sortedImages.length > 0
            ? (
                sortedImages.reduce((sum, img) => sum + img.cloudCover, 0) /
                sortedImages.length
              ).toFixed(2)
            : 0,
        averageNDVI:
          sortedImages.length > 0
            ? (
                sortedImages.reduce((sum, img) => sum + img.ndvi, 0) /
                sortedImages.length
              ).toFixed(2)
            : 0,
      },
    });
  } catch (error) {
    console.error('Error fetching satellite data:', error);
    return res.status(500).json({
      error: 'Failed to fetch satellite data',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

/**
 * GET /api/satellite/latest
 * Get the latest satellite image for a location with lowest cloud cover
 * Query params:
 *   - lat: latitude (required)
 *   - lng: longitude (required)
 *   - maxCloudCover: maximum cloud cover percentage (default: 20)
 */
router.get('/satellite/latest', async (req: Request, res: Response) => {
  try {
    const { lat, lng, maxCloudCover = 20 } = req.query;

    if (!lat || !lng) {
      return res.status(400).json({
        error: 'Missing required parameters: lat and lng',
      });
    }

    const latitude = parseFloat(lat as string);
    const longitude = parseFloat(lng as string);
    const cloudCoverNum = parseInt(maxCloudCover as string) || 20;

    if (isNaN(latitude) || isNaN(longitude)) {
      return res.status(400).json({
        error: 'Invalid latitude or longitude values',
      });
    }

    const sentinelHub = getSentinelHubClient();
    const image = await sentinelHub.getLatestImage(latitude, longitude, cloudCoverNum);

    if (!image) {
      return res.status(404).json({
        error: 'No satellite images found for the given location',
      });
    }

    return res.json({
      success: true,
      location: {
        latitude,
        longitude,
      },
      image,
    });
  } catch (error) {
    console.error('Error fetching latest satellite image:', error);
    return res.status(500).json({
      error: 'Failed to fetch satellite data',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

/**
 * GET /api/satellite/health
 * Get farm health assessment based on satellite data
 * Query params:
 *   - lat: latitude (required)
 *   - lng: longitude (required)
 */
router.get('/satellite/health', async (req: Request, res: Response) => {
  try {
    const { lat, lng } = req.query;

    if (!lat || !lng) {
      return res.status(400).json({
        error: 'Missing required parameters: lat and lng',
      });
    }

    const latitude = parseFloat(lat as string);
    const longitude = parseFloat(lng as string);

    if (isNaN(latitude) || isNaN(longitude)) {
      return res.status(400).json({
        error: 'Invalid latitude or longitude values',
      });
    }

    const sentinelHub = getSentinelHubClient();
    const latestImage = await sentinelHub.getLatestImage(latitude, longitude);

    if (!latestImage) {
      return res.status(404).json({
        error: 'No satellite images found',
      });
    }

    // Calculate health score
    const ndviScore = (latestImage.ndvi + 1) * 50; // Convert -1 to 1 range to 0 to 100
    const cloudScore = 100 - latestImage.cloudCover;
    const overallHealth = (ndviScore + cloudScore) / 2;

    // Determine health status
    let status = 'Poor';
    if (overallHealth > 80) status = 'Excellent';
    else if (overallHealth > 60) status = 'Good';
    else if (overallHealth > 40) status = 'Fair';

    return res.json({
      success: true,
      location: {
        latitude,
        longitude,
      },
      health: {
        overallScore: overallHealth.toFixed(2),
        status,
        ndvi: latestImage.ndvi,
        ndviScore: ndviScore.toFixed(2),
        evi: latestImage.evi,
        ndbi: latestImage.ndbi,
        ndmi: latestImage.ndmi,
        cloudCover: latestImage.cloudCover,
        cloudScore: cloudScore.toFixed(2),
        lastUpdate: latestImage.date,
      },
      recommendations: generateRecommendations(latestImage),
    });
  } catch (error) {
    console.error('Error calculating farm health:', error);
    return res.status(500).json({
      error: 'Failed to calculate farm health',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

/**
 * Generate recommendations based on satellite data
 */
function generateRecommendations(image: SatelliteImage): string[] {
  const recommendations: string[] = [];

  // NDVI recommendations
  if (image.ndvi < 0.5) {
    recommendations.push(
      'Low vegetation index detected. Consider irrigation or nutrient supplementation.'
    );
  } else if (image.ndvi > 0.8) {
    recommendations.push('Excellent vegetation health. Continue current management practices.');
  }

  // Moisture recommendations
  if (image.ndmi < 0.2) {
    recommendations.push('Low soil moisture detected. Increase irrigation frequency.');
  } else if (image.ndmi > 0.5) {
    recommendations.push('High soil moisture. Monitor for potential waterlogging.');
  }

  // Cloud cover recommendations
  if (image.cloudCover > 50) {
    recommendations.push(
      'High cloud cover. Next satellite image may be available in 2-3 days.'
    );
  }

  // Built-up index recommendations
  if (image.ndbi > 0) {
    recommendations.push('Built-up or bare soil detected. Verify farm boundary mapping.');
  }

  if (recommendations.length === 0) {
    recommendations.push('Farm conditions are optimal. Continue monitoring.');
  }

  return recommendations;
}

export default router;
