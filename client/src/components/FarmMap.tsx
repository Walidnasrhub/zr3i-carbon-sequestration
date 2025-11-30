import { useRef, useEffect, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-draw/dist/leaflet.draw.css";
import "leaflet-draw";
import "@/styles/farm-map.css";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";

interface FarmMapProps {
  farmId?: number;
  initialLat?: number;
  initialLng?: number;
  initialZoom?: number;
  onBoundaryChange?: (geojson: any) => void;
}

export function FarmMap({
  farmId,
  initialLat = 24.7136,
  initialLng = 46.6753,
  initialZoom = 13,
  onBoundaryChange,
}: FarmMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<L.Map | null>(null);
  const drawnItems = useRef<L.FeatureGroup | null>(null);
  const [areaInfo, setAreaInfo] = useState<{
    hectares: number;
    acres: number;
  } | null>(null);
  const { language } = useLanguage();

  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    try {
      // Initialize map
      map.current = L.map(mapContainer.current).setView(
        [initialLat, initialLng],
        initialZoom
      );

      // Add OpenStreetMap tiles
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19,
      }).addTo(map.current);

      // Create feature group for drawn items
      drawnItems.current = new L.FeatureGroup();
      map.current.addLayer(drawnItems.current);

      // Add drawing controls using proper Leaflet Draw API
      const DrawControl = (L.Control as any).Draw;
      if (DrawControl) {
        const drawControl = new DrawControl({
          position: "topright",
          draw: {
            polygon: {
              allowIntersection: false,
              drawError: {
                color: "#e1e100",
                message: "<strong>Error!</strong> Shape cannot intersect",
              },
              shapeOptions: {
                color: "#00bcd4",
                weight: 2,
                opacity: 0.8,
                fill: true,
                fillColor: "#00bcd4",
                fillOpacity: 0.2,
              },
            },
            polyline: {
              shapeOptions: {
                color: "#00bcd4",
                weight: 2,
                opacity: 0.8,
              },
            },
            rectangle: {
              shapeOptions: {
                color: "#00bcd4",
                weight: 2,
                opacity: 0.8,
                fill: true,
                fillColor: "#00bcd4",
                fillOpacity: 0.2,
              },
            },
            circle: false,
            marker: false,
            circlemarker: false,
          },
          edit: {
            featureGroup: drawnItems.current,
            remove: true,
          },
        });

        map.current.addControl(drawControl);

        // Handle drawing events
        map.current.on("draw:created", (e: any) => {
          const layer = e.layer;
          drawnItems.current?.addLayer(layer);
          calculateArea();
          if (onBoundaryChange) {
            onBoundaryChange(drawnItems.current?.toGeoJSON());
          }
        });

        map.current.on("draw:edited", () => {
          calculateArea();
          if (onBoundaryChange) {
            onBoundaryChange(drawnItems.current?.toGeoJSON());
          }
        });

        map.current.on("draw:deleted", () => {
          calculateArea();
          if (onBoundaryChange) {
            onBoundaryChange(drawnItems.current?.toGeoJSON());
          }
        });
      } else {
        console.warn("Leaflet Draw not available");
      }
    } catch (error) {
      console.error("Error initializing map:", error);
    }

    return () => {
      map.current?.remove();
      map.current = null;
    };
  }, []);

  const calculateArea = () => {
    if (!drawnItems.current) return;

    const layers = drawnItems.current.getLayers();
    if (layers.length === 0) {
      setAreaInfo(null);
      return;
    }

    let totalArea = 0;
    layers.forEach((layer: any) => {
      if (layer.getLatLngs) {
        const latlngs = layer.getLatLngs();
        const area = calculatePolygonArea(latlngs);
        totalArea += area;
      }
    });

    const hectares = totalArea / 10000;
    const acres = hectares * 2.47105;

    setAreaInfo({
      hectares: Math.round(hectares * 100) / 100,
      acres: Math.round(acres * 100) / 100,
    });
  };

  const calculatePolygonArea = (latlngs: any[]): number => {
    let area = 0;
    const R = 6371000; // Earth radius in meters

    for (let i = 0; i < latlngs.length; i++) {
      const p1 = latlngs[i];
      const p2 = latlngs[(i + 1) % latlngs.length];

      const lat1 = (p1.lat * Math.PI) / 180;
      const lat2 = (p2.lat * Math.PI) / 180;
      const dLng = ((p2.lng - p1.lng) * Math.PI) / 180;

      area += (dLng * (2 + Math.sin(lat1) + Math.sin(lat2))) / 2;
    }

    return Math.abs(area * R * R);
  };

  const exportGeoJSON = () => {
    if (!drawnItems.current) return;
    const geojson = drawnItems.current.toGeoJSON();
    const dataStr = JSON.stringify(geojson, null, 2);
    const dataBlob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `farm-boundary-${new Date().toISOString().split("T")[0]}.geojson`;
    link.click();
  };

  return (
    <div className="space-y-4">
      <div ref={mapContainer} className="w-full h-96 rounded-lg border border-cyan-200 shadow-lg" />

      {areaInfo && (
        <Card className="p-4 bg-gradient-to-br from-cyan-50 to-blue-50 border-cyan-200">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-navy-700 font-medium">
                {language === "ar" ? "المساحة (هكتار)" : "Area (Hectares)"}
              </p>
              <p className="text-2xl font-bold text-cyan-600">
                {areaInfo.hectares}
              </p>
            </div>
            <div>
              <p className="text-sm text-navy-700 font-medium">
                {language === "ar" ? "المساحة (فدان)" : "Area (Acres)"}
              </p>
              <p className="text-2xl font-bold text-cyan-600">
                {areaInfo.acres}
              </p>
            </div>
          </div>
        </Card>
      )}

      <div className="flex gap-2">
        <Button
          onClick={exportGeoJSON}
          className="bg-cyan-600 hover:bg-cyan-700 text-white"
        >
          {language === "ar" ? "تصدير GeoJSON" : "Export GeoJSON"}
        </Button>
      </div>
    </div>
  );
}
