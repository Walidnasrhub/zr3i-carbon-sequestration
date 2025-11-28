import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FarmMap } from "@/components/FarmMap";
import { SatelliteViewer } from "@/components/SatelliteViewer";
import { useLanguage } from "@/contexts/LanguageContext";
import { MapPin, Satellite, Save } from "lucide-react";

const translations = {
  en: {
    title: "Farm Mapping & Monitoring",
    subtitle: "Define your farm boundaries and monitor satellite imagery",
    farmBoundary: "Farm Boundary Definition",
    satelliteMonitoring: "Satellite Monitoring",
    saveBoundary: "Save Farm Boundary",
    boundaryInfo: "Use the map tools to draw your farm boundaries",
    mapInstructions:
      "Draw a polygon or rectangle to define your farm area. The system will automatically calculate the area in hectares and acres.",
    satelliteInfo: "Monitor your farm with real-time satellite imagery",
    satelliteInstructions:
      "View vegetation health (NDVI), cloud cover, and historical satellite images of your farm.",
  },
  ar: {
    title: "رسم الخرائط ومراقبة المزرعة",
    subtitle: "حدد حدود مزرعتك ومراقبة صور الأقمار الصناعية",
    farmBoundary: "تحديد حدود المزرعة",
    satelliteMonitoring: "المراقبة بالأقمار الصناعية",
    saveBoundary: "حفظ حدود المزرعة",
    boundaryInfo: "استخدم أدوات الخريطة لرسم حدود مزرعتك",
    mapInstructions:
      "ارسم مضلع أو مستطيل لتحديد منطقة مزرعتك. سيقوم النظام تلقائياً بحساب المساحة بالهكتار والفدان.",
    satelliteInfo: "راقب مزرعتك باستخدام صور الأقمار الصناعية في الوقت الفعلي",
    satelliteInstructions:
      "عرض صحة الغطاء النباتي وتغطية السحب والصور التاريخية للأقمار الصناعية لمزرعتك.",
  },
};

export default function FarmMapping() {
  const { language } = useLanguage();
  const t = translations[language as keyof typeof translations];
  const [farmBoundary, setFarmBoundary] = useState<any>(null);

  const handleBoundaryChange = (geojson: any) => {
    setFarmBoundary(geojson);
  };

  const handleSaveBoundary = () => {
    if (farmBoundary) {
      console.log("Saving farm boundary:", farmBoundary);
      // TODO: Send to API to save the boundary
      alert(language === "en" ? "Boundary saved!" : "تم حفظ الحدود!");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <section className="bg-gradient-to-r from-cyan-600 to-blue-600 text-white py-12">
        <div className="container">
          <h1 className="text-4xl font-bold mb-2">{t.title}</h1>
          <p className="text-lg text-cyan-100">{t.subtitle}</p>
        </div>
      </section>

      {/* Main Content */}
      <section className="container py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Farm Mapping Section */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <MapPin className="w-6 h-6 text-cyan-600" />
              <h2 className="text-2xl font-bold text-slate-900">
                {t.farmBoundary}
              </h2>
            </div>
            <p className="text-slate-600 mb-4">{t.mapInstructions}</p>
            <FarmMap
              initialLat={24.7136}
              initialLng={46.6753}
              initialZoom={13}
              onBoundaryChange={handleBoundaryChange}
            />
            <Button
              onClick={handleSaveBoundary}
              disabled={!farmBoundary}
              className="w-full mt-4 bg-cyan-600 hover:bg-cyan-700 text-white"
            >
              <Save className="w-4 h-4 mr-2" />
              {t.saveBoundary}
            </Button>
          </div>

          {/* Satellite Monitoring Section */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Satellite className="w-6 h-6 text-cyan-600" />
              <h2 className="text-2xl font-bold text-slate-900">
                {t.satelliteMonitoring}
              </h2>
            </div>
            <p className="text-slate-600 mb-4">{t.satelliteInstructions}</p>
            <SatelliteViewer />
          </div>
        </div>
      </section>

      {/* Info Cards */}
      <section className="bg-white py-12">
        <div className="container">
          <h2 className="text-2xl font-bold text-slate-900 mb-8">
            {language === "en"
              ? "How Farm Mapping Works"
              : "كيفية عمل رسم خرائط المزرعة"}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="p-6">
              <div className="text-3xl font-bold text-cyan-600 mb-2">1</div>
              <h3 className="font-bold text-slate-900 mb-2">
                {language === "en"
                  ? "Draw Your Boundaries"
                  : "ارسم حدود مزرعتك"}
              </h3>
              <p className="text-sm text-slate-600">
                {language === "en"
                  ? "Use the mapping tools to define your farm area with precision"
                  : "استخدم أدوات الخريطة لتحديد منطقة مزرعتك بدقة"}
              </p>
            </Card>

            <Card className="p-6">
              <div className="text-3xl font-bold text-cyan-600 mb-2">2</div>
              <h3 className="font-bold text-slate-900 mb-2">
                {language === "en"
                  ? "Monitor Vegetation"
                  : "راقب الغطاء النباتي"}
              </h3>
              <p className="text-sm text-slate-600">
                {language === "en"
                  ? "Track vegetation health with real-time satellite imagery"
                  : "تتبع صحة الغطاء النباتي باستخدام صور الأقمار الصناعية الحية"}
              </p>
            </Card>

            <Card className="p-6">
              <div className="text-3xl font-bold text-cyan-600 mb-2">3</div>
              <h3 className="font-bold text-slate-900 mb-2">
                {language === "en"
                  ? "Calculate Carbon"
                  : "حساب الكربون"}
              </h3>
              <p className="text-sm text-slate-600">
                {language === "en"
                  ? "Automatic CO₂ sequestration calculation based on farm data"
                  : "حساب امتصاص CO₂ تلقائياً بناءً على بيانات المزرعة"}
              </p>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
