import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-draw/dist/leaflet.draw.css";
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
    if (!mapContainer.current) return;

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

    // Add drawing controls
    const drawControl = new (L.Control as any).Draw({
      position: "topright",
      draw: {
        polygon: {
          allowIntersection: false,
          drawError: {
            color: "#e1e100",
            message: "<strong>Oh snap!</strong> you can't draw that!",
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

    const calculateArea = () => {
      const data = drawnItems.current?.toGeoJSON();
      if (data && 'features' in data && data.features.length > 0) {
        const feature = data.features[0];
        if (feature.geometry.type === "Polygon") {
          const coords = feature.geometry.coordinates[0];
          const area = calculatePolygonArea(coords);
          const hectares = area / 10000; // 1 hectare = 10,000 m²
          const acres = hectares * 2.471; // 1 hectare = 2.471 acres
          setAreaInfo({
            hectares: Math.round(hectares * 100) / 100,
            acres: Math.round(acres * 100) / 100,
          });
        }
      }
    };

    return () => {
      if (map.current) {
        map.current.remove();
      }
    };
  }, [initialLat, initialLng, initialZoom, onBoundaryChange]);

  const calculatePolygonArea = (coords: any[]): number => {
    let area = 0;
    for (let i = 0; i < coords.length - 1; i++) {
      const [lng1, lat1] = coords[i];
      const [lng2, lat2] = coords[i + 1];
      area += (lng2 - lng1) * (lat2 + lat1);
    }
    return Math.abs(area) * 6371000 * 6371000 * 0.5 * (Math.PI / 180);
  };

  return (
    <div className="w-full space-y-4">
      <Card className="p-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold text-slate-900">
            {language === "en" ? "Farm Boundary" : "حدود المزرعة"}
          </h3>
          {areaInfo && (
            <div className="text-sm text-slate-600">
              {language === "en"
                ? `Area: ${areaInfo.hectares} ha (${areaInfo.acres} ac)`
                : `المساحة: ${areaInfo.hectares} هكتار (${areaInfo.acres} فدان)`}
            </div>
          )}
        </div>
        <div
          ref={mapContainer}
          className="w-full h-96 rounded-lg border border-slate-300"
        />
        <p className="text-xs text-slate-500 mt-2">
          {language === "en"
            ? "Draw a polygon or rectangle to define your farm boundaries"
            : "ارسم مضلع أو مستطيل لتحديد حدود مزرعتك"}
        </p>
      </Card>

      {areaInfo && (
        <Card className="p-4 bg-cyan-50 border-cyan-200">
          <h4 className="font-bold text-slate-900 mb-2">
            {language === "en" ? "Farm Area Details" : "تفاصيل مساحة المزرعة"}
          </h4>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-slate-600">
                {language === "en" ? "Hectares" : "الهكتارات"}
              </p>
              <p className="text-2xl font-bold text-cyan-600">
                {areaInfo.hectares}
              </p>
            </div>
            <div>
              <p className="text-sm text-slate-600">
                {language === "en" ? "Acres" : "الأفدنة"}
              </p>
              <p className="text-2xl font-bold text-cyan-600">
                {areaInfo.acres}
              </p>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
