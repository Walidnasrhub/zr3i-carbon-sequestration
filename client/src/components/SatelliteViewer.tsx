import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Satellite, Calendar, Eye } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface SatelliteImage {
  id: string;
  date: string;
  source: string;
  ndvi: number; // Normalized Difference Vegetation Index
  cloudCover: number;
  url: string;
}

const mockSatelliteData: SatelliteImage[] = [
  {
    id: "1",
    date: "2024-11-20",
    source: "Sentinel-2",
    ndvi: 0.78,
    cloudCover: 5,
    url: "https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=800&h=600&fit=crop",
  },
  {
    id: "2",
    date: "2024-11-10",
    source: "Sentinel-2",
    ndvi: 0.75,
    cloudCover: 12,
    url: "https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=800&h=600&fit=crop",
  },
  {
    id: "3",
    date: "2024-10-31",
    source: "Sentinel-2",
    ndvi: 0.72,
    cloudCover: 8,
    url: "https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=800&h=600&fit=crop",
  },
];

export function SatelliteViewer() {
  const [selectedImage, setSelectedImage] = useState<SatelliteImage>(
    mockSatelliteData[0]
  );
  const { language } = useLanguage();

  const getNDVIColor = (ndvi: number): string => {
    if (ndvi > 0.7) return "text-green-600";
    if (ndvi > 0.5) return "text-yellow-600";
    return "text-red-600";
  };

  const getNDVILabel = (ndvi: number): string => {
    if (ndvi > 0.7) return "Excellent";
    if (ndvi > 0.5) return "Good";
    return "Needs Attention";
  };

  return (
    <div className="w-full space-y-4">
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-6">
          <Satellite className="w-6 h-6 text-cyan-500" />
          <h3 className="text-xl font-bold text-slate-900">
            {language === "en"
              ? "Satellite Monitoring"
              : "المراقبة بالأقمار الصناعية"}
          </h3>
        </div>

        {/* Main Image Display */}
        <div className="mb-6">
          <img
            src={selectedImage.url}
            alt={`Satellite image from ${selectedImage.date}`}
            className="w-full h-96 object-cover rounded-lg border-2 border-slate-200"
          />
        </div>

        {/* Image Details */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {/* NDVI Index */}
          <div className="bg-slate-50 p-4 rounded-lg">
            <p className="text-sm text-slate-600 mb-2">
              {language === "en" ? "Vegetation Index (NDVI)" : "مؤشر الغطاء النباتي"}
            </p>
            <p className={`text-3xl font-bold ${getNDVIColor(selectedImage.ndvi)}`}>
              {selectedImage.ndvi.toFixed(2)}
            </p>
            <p className="text-xs text-slate-500 mt-1">
              {getNDVILabel(selectedImage.ndvi)}
            </p>
          </div>

          {/* Cloud Cover */}
          <div className="bg-slate-50 p-4 rounded-lg">
            <p className="text-sm text-slate-600 mb-2">
              {language === "en" ? "Cloud Cover" : "تغطية السحب"}
            </p>
            <p className="text-3xl font-bold text-slate-900">
              {selectedImage.cloudCover}%
            </p>
            <p className="text-xs text-slate-500 mt-1">
              {selectedImage.cloudCover < 20
                ? language === "en"
                  ? "Clear"
                  : "صافي"
                : language === "en"
                ? "Cloudy"
                : "غائم"}
            </p>
          </div>

          {/* Data Source */}
          <div className="bg-slate-50 p-4 rounded-lg">
            <p className="text-sm text-slate-600 mb-2">
              {language === "en" ? "Data Source" : "مصدر البيانات"}
            </p>
            <p className="text-lg font-bold text-slate-900">
              {selectedImage.source}
            </p>
            <p className="text-xs text-slate-500 mt-1">
              {language === "en" ? "Satellite" : "قمر صناعي"}
            </p>
          </div>
        </div>

        {/* Image Timeline */}
        <div className="space-y-2">
          <p className="text-sm font-semibold text-slate-900 mb-3">
            {language === "en" ? "Recent Images" : "الصور الأخيرة"}
          </p>
          <div className="grid grid-cols-3 gap-3">
            {mockSatelliteData.map((image) => (
              <button
                key={image.id}
                onClick={() => setSelectedImage(image)}
                className={`p-3 rounded-lg border-2 transition-all ${
                  selectedImage.id === image.id
                    ? "border-cyan-500 bg-cyan-50"
                    : "border-slate-200 bg-white hover:border-slate-300"
                }`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <Calendar size={14} className="text-slate-600" />
                  <span className="text-xs font-medium text-slate-700">
                    {new Date(image.date).toLocaleDateString()}
                  </span>
                </div>
                <div className="text-xs text-slate-600">
                  NDVI: {image.ndvi.toFixed(2)}
                </div>
              </button>
            ))}
          </div>
        </div>
      </Card>

      {/* Health Assessment */}
      <Card className="p-6 bg-gradient-to-r from-green-50 to-cyan-50 border-green-200">
        <h4 className="font-bold text-slate-900 mb-4">
          {language === "en" ? "Farm Health Assessment" : "تقييم صحة المزرعة"}
        </h4>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-700">
              {language === "en" ? "Vegetation Health" : "صحة الغطاء النباتي"}
            </span>
            <div className="w-32 bg-slate-200 rounded-full h-2">
              <div
                className="bg-green-500 h-2 rounded-full"
                style={{ width: `${selectedImage.ndvi * 100}%` }}
              />
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-700">
              {language === "en" ? "Image Quality" : "جودة الصورة"}
            </span>
            <div className="w-32 bg-slate-200 rounded-full h-2">
              <div
                className="bg-blue-500 h-2 rounded-full"
                style={{ width: `${100 - selectedImage.cloudCover}%` }}
              />
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
