import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Satellite, Calendar, Eye, Loader } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

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

interface SatelliteViewerProps {
  latitude?: number;
  longitude?: number;
  farmId?: number;
}

const translations = {
  en: {
    satelliteMonitoring: "Satellite Monitoring",
    vegetationIndex: "Vegetation Index (NDVI)",
    cloudCover: "Cloud Cover",
    dataSource: "Data Source",
    satellite: "Satellite",
    recentImages: "Recent Images",
    farmHealthAssessment: "Farm Health Assessment",
    vegetationHealth: "Vegetation Health",
    imageQuality: "Image Quality",
    excellent: "Excellent",
    good: "Good",
    needsAttention: "Needs Attention",
    clear: "Clear",
    cloudy: "Cloudy",
    loading: "Loading satellite data...",
    error: "Failed to load satellite data",
    noData: "No satellite data available",
    enhancedVegetation: "Enhanced Vegetation Index (EVI)",
    builtUpIndex: "Built-up Index (NDBI)",
    moistureIndex: "Moisture Index (NDMI)",
  },
  ar: {
    satelliteMonitoring: "المراقبة بالأقمار الصناعية",
    vegetationIndex: "مؤشر الغطاء النباتي (NDVI)",
    cloudCover: "تغطية السحب",
    dataSource: "مصدر البيانات",
    satellite: "قمر صناعي",
    recentImages: "الصور الأخيرة",
    farmHealthAssessment: "تقييم صحة المزرعة",
    vegetationHealth: "صحة الغطاء النباتي",
    imageQuality: "جودة الصورة",
    excellent: "ممتاز",
    good: "جيد",
    needsAttention: "يحتاج اهتمام",
    clear: "صافي",
    cloudy: "غائم",
    loading: "جاري تحميل بيانات الأقمار الصناعية...",
    error: "فشل تحميل بيانات الأقمار الصناعية",
    noData: "لا توجد بيانات أقمار صناعية متاحة",
    enhancedVegetation: "مؤشر الغطاء النباتي المحسّن (EVI)",
    builtUpIndex: "مؤشر المناطق المأهولة (NDBI)",
    moistureIndex: "مؤشر الرطوبة (NDMI)",
  },
};

export function SatelliteViewer({
  latitude = 30.0444,
  longitude = 31.2357,
  farmId,
}: SatelliteViewerProps) {
  const [images, setImages] = useState<SatelliteImage[]>([]);
  const [selectedImage, setSelectedImage] = useState<SatelliteImage | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { language } = useLanguage();
  const t = translations[language as keyof typeof translations];

  useEffect(() => {
    const fetchSatelliteData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch satellite data from backend API
        const response = await fetch(
          `/api/satellite?lat=${latitude}&lng=${longitude}&months=3`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch satellite data");
        }

        const data = await response.json();
        const satelliteImages = data.images || [];

        if (satelliteImages.length === 0) {
          setError(t.noData);
          setImages([]);
        } else {
          setImages(satelliteImages);
          setSelectedImage(satelliteImages[0]);
        }
      } catch (err) {
        console.error("Error fetching satellite data:", err);
        setError(t.error);
        setImages([]);
      } finally {
        setLoading(false);
      }
    };

    fetchSatelliteData();
  }, [latitude, longitude, farmId]);

  const getNDVIColor = (ndvi: number): string => {
    if (ndvi > 0.7) return "text-green-600";
    if (ndvi > 0.5) return "text-yellow-600";
    return "text-red-600";
  };

  const getNDVILabel = (ndvi: number): string => {
    if (ndvi > 0.7) return t.excellent;
    if (ndvi > 0.5) return t.good;
    return t.needsAttention;
  };

  const getEVIColor = (evi: number): string => {
    if (evi > 0.5) return "text-green-600";
    if (evi > 0.3) return "text-yellow-600";
    return "text-red-600";
  };

  const getCloudCoverStatus = (cc: number): string => {
    return cc < 20 ? t.clear : t.cloudy;
  };

  if (loading) {
    return (
      <Card className="p-6">
        <div className="flex items-center justify-center gap-3 py-12">
          <Loader className="w-6 h-6 text-cyan-500 animate-spin" />
          <p className="text-slate-600">{t.loading}</p>
        </div>
      </Card>
    );
  }

  if (error || images.length === 0) {
    return (
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-6">
          <Satellite className="w-6 h-6 text-cyan-500" />
          <h3 className="text-xl font-bold text-slate-900">
            {t.satelliteMonitoring}
          </h3>
        </div>
        <div className="text-center py-8">
          <Satellite className="w-12 h-12 mx-auto mb-3 text-slate-300" />
          <p className="text-slate-600">{error || t.noData}</p>
        </div>
      </Card>
    );
  }

  return (
    <div className="w-full space-y-4">
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-6">
          <Satellite className="w-6 h-6 text-cyan-500" />
          <h3 className="text-xl font-bold text-slate-900">
            {t.satelliteMonitoring}
          </h3>
        </div>

        {/* Main Image Display */}
        {selectedImage && (
          <>
            <div className="mb-6">
              <img
                src={selectedImage.url}
                alt={`Satellite image from ${selectedImage.date}`}
                className="w-full h-96 object-cover rounded-lg border-2 border-slate-200"
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    "https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=800&h=600&fit=crop";
                }}
              />
            </div>

            {/* Image Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              {/* NDVI Index */}
              <div className="bg-slate-50 p-4 rounded-lg">
                <p className="text-sm text-slate-600 mb-2">
                  {t.vegetationIndex}
                </p>
                <p
                  className={`text-3xl font-bold ${getNDVIColor(selectedImage.ndvi)}`}
                >
                  {selectedImage.ndvi.toFixed(2)}
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  {getNDVILabel(selectedImage.ndvi)}
                </p>
              </div>

              {/* EVI Index */}
              <div className="bg-slate-50 p-4 rounded-lg">
                <p className="text-sm text-slate-600 mb-2">
                  {t.enhancedVegetation}
                </p>
                <p
                  className={`text-3xl font-bold ${getEVIColor(selectedImage.evi)}`}
                >
                  {selectedImage.evi.toFixed(2)}
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  {selectedImage.evi > 0.5 ? t.excellent : t.good}
                </p>
              </div>

              {/* Cloud Cover */}
              <div className="bg-slate-50 p-4 rounded-lg">
                <p className="text-sm text-slate-600 mb-2">
                  {t.cloudCover}
                </p>
                <p className="text-3xl font-bold text-slate-900">
                  {selectedImage.cloudCover}%
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  {getCloudCoverStatus(selectedImage.cloudCover)}
                </p>
              </div>

              {/* Data Source */}
              <div className="bg-slate-50 p-4 rounded-lg">
                <p className="text-sm text-slate-600 mb-2">
                  {t.dataSource}
                </p>
                <p className="text-lg font-bold text-slate-900">
                  {selectedImage.source}
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  {t.satellite}
                </p>
              </div>
            </div>

            {/* Additional Indices */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 p-4 bg-slate-50 rounded-lg">
              <div>
                <p className="text-sm text-slate-600 mb-2">
                  {t.builtUpIndex}
                </p>
                <p className="text-2xl font-bold text-slate-900">
                  {selectedImage.ndbi.toFixed(2)}
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  {selectedImage.ndbi < 0 ? "Vegetation" : "Built-up"}
                </p>
              </div>
              <div>
                <p className="text-sm text-slate-600 mb-2">
                  {t.moistureIndex}
                </p>
                <p className="text-2xl font-bold text-slate-900">
                  {selectedImage.ndmi.toFixed(2)}
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  {selectedImage.ndmi > 0.3 ? "Moist" : "Dry"}
                </p>
              </div>
            </div>

            {/* Image Timeline */}
            <div className="space-y-2">
              <p className="text-sm font-semibold text-slate-900 mb-3">
                {t.recentImages}
              </p>
              <div className="grid grid-cols-3 gap-3 overflow-x-auto">
                {images.slice(0, 6).map((image) => (
                  <button
                    key={image.id}
                    onClick={() => setSelectedImage(image)}
                    className={`p-3 rounded-lg border-2 transition-all flex-shrink-0 ${
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
                    <div className="text-xs text-slate-500">
                      Cloud: {image.cloudCover}%
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </>
        )}
      </Card>

      {/* Health Assessment */}
      {selectedImage && (
        <Card className="p-6 bg-gradient-to-r from-green-50 to-cyan-50 border-green-200">
          <h4 className="font-bold text-slate-900 mb-4">
            {t.farmHealthAssessment}
          </h4>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-700">
                {t.vegetationHealth}
              </span>
              <div className="w-32 bg-slate-200 rounded-full h-2">
                <div
                  className="bg-green-500 h-2 rounded-full transition-all"
                  style={{ width: `${selectedImage.ndvi * 100}%` }}
                />
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-700">
                {t.imageQuality}
              </span>
              <div className="w-32 bg-slate-200 rounded-full h-2">
                <div
                  className="bg-blue-500 h-2 rounded-full transition-all"
                  style={{ width: `${100 - selectedImage.cloudCover}%` }}
                />
              </div>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
