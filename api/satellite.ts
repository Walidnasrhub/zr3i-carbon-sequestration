import { VercelRequest, VercelResponse } from "@vercel/node";
import axios from "axios";

interface SatelliteImage {
  id: string;
  date: string;
  source: string;
  ndvi: number;
  evi: number;
  ndbi: number;
  ndmi: number;
  cloudCover: number;
  url: string;
  metadata: {
    tileId: string;
    datastrip: string;
    processingLevel: string;
  };
}

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  const { lat, lng, months = 3 } = req.query;

  if (!lat || !lng) {
    return res.status(400).json({
      error: "Missing latitude and longitude parameters",
    });
  }

  try {
    const latitude = parseFloat(lat as string);
    const longitude = parseFloat(lng as string);

    // Generate mock satellite data for demo
    const images: SatelliteImage[] = [];
    const now = new Date();

    for (let i = 0; i < parseInt(months as string); i++) {
      const date = new Date(now);
      date.setMonth(date.getMonth() - i);

      images.push({
        id: `S2_${date.toISOString().split("T")[0]}_${Math.random().toString(36).substr(2, 9)}`,
        date: date.toISOString().split("T")[0],
        source: "Sentinel-2",
        ndvi: 0.4 + Math.random() * 0.4, // 0.4 to 0.8
        evi: 0.3 + Math.random() * 0.35, // 0.3 to 0.65
        ndbi: 0.1 + Math.random() * 0.2, // 0.1 to 0.3
        ndmi: 0.2 + Math.random() * 0.3, // 0.2 to 0.5
        cloudCover: Math.random() * 30, // 0 to 30%
        url: `https://tiles.sentinel-hub.com/v1/wms?REQUEST=GetMap&SERVICE=WMS&VERSION=1.1.1&LAYERS=TRUE_COLOR&BBOX=${longitude - 0.1},${latitude - 0.1},${longitude + 0.1},${latitude + 0.1}&WIDTH=512&HEIGHT=512&CRS=EPSG:4326&FORMAT=image/jpeg`,
        metadata: {
          tileId: `T${Math.floor(latitude / 10) + 50}${String.fromCharCode(65 + Math.floor((longitude + 180) / 8))}`,
          datastrip: `S2A_MSIL2A_${date.toISOString().split("T")[0].replace(/-/g, "")}`,
          processingLevel: "L2A",
        },
      });
    }

    // Calculate health score
    const avgNDVI = images.reduce((sum, img) => sum + img.ndvi, 0) / images.length;
    const avgCloudCover = images.reduce((sum, img) => sum + img.cloudCover, 0) / images.length;

    let healthStatus = "Excellent";
    if (avgNDVI < 0.5) healthStatus = "Needs Attention";
    else if (avgNDVI < 0.65) healthStatus = "Good";

    return res.status(200).json({
      success: true,
      data: {
        images,
        statistics: {
          averageNDVI: Math.round(avgNDVI * 1000) / 1000,
          averageEVI: Math.round((images.reduce((sum, img) => sum + img.evi, 0) / images.length) * 1000) / 1000,
          averageCloudCover: Math.round(avgCloudCover * 10) / 10,
          healthStatus,
          recommendation: healthStatus === "Excellent" ? "Farm is in excellent condition" : "Consider irrigation or pest management",
        },
        location: {
          latitude,
          longitude,
          timestamp: new Date().toISOString(),
        },
      },
    });
  } catch (error) {
    console.error("Satellite API error:", error);
    return res.status(500).json({
      error: "Failed to fetch satellite data",
      message: error instanceof Error ? error.message : "Unknown error",
    });
  }
}
