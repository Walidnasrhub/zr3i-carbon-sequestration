import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CarbonMetricsDashboard } from "@/components/CarbonMetricsDashboard";
import { useLanguage } from "@/contexts/LanguageContext";
import { FarmData } from "@/lib/carbonCalculations";
import { Calculator, Save } from "lucide-react";

const translations = {
  en: {
    title: "Carbon Footprint Calculator",
    subtitle: "Calculate your farm's CO2 sequestration and earnings potential",
    farmDetails: "Farm Details",
    areaLabel: "Farm Area (hectares)",
    treeCountLabel: "Number of Trees",
    avgAgeLabel: "Average Tree Age (years)",
    speciesLabel: "Tree Species",
    soilTypeLabel: "Soil Type",
    irrigationLabel: "Irrigation Type",
    datePalm: "Date Palm",
    other: "Other",
    sandy: "Sandy",
    loamy: "Loamy",
    clay: "Clay",
    drip: "Drip Irrigation",
    flood: "Flood Irrigation",
    rainFed: "Rain-fed",
    calculate: "Calculate Metrics",
    save: "Save Configuration",
    results: "Carbon Metrics Results",
    instructions: "Enter your farm details below to calculate your CO2 sequestration potential and estimated earnings.",
  },
  ar: {
    title: "حاسبة البصمة الكربونية",
    subtitle: "احسب إمكانية امتصاص ثاني أكسيد الكربون والأرباح المتوقعة لمزرعتك",
    farmDetails: "تفاصيل المزرعة",
    areaLabel: "مساحة المزرعة (هكتار)",
    treeCountLabel: "عدد الأشجار",
    avgAgeLabel: "متوسط عمر الشجرة (سنة)",
    speciesLabel: "نوع الشجرة",
    soilTypeLabel: "نوع التربة",
    irrigationLabel: "نوع الري",
    datePalm: "نخيل التمر",
    other: "أخرى",
    sandy: "رملية",
    loamy: "طينية",
    clay: "طين",
    drip: "الري بالتنقيط",
    flood: "الري بالفيضان",
    rainFed: "الري المطري",
    calculate: "احسب المقاييس",
    save: "احفظ الإعدادات",
    results: "نتائج مقاييس الكربون",
    instructions: "أدخل تفاصيل مزرعتك أدناه لحساب إمكانية امتصاص ثاني أكسيد الكربون والأرباح المتوقعة.",
  },
};

export default function CarbonCalculator() {
  const { language } = useLanguage();
  const t = translations[language as keyof typeof translations];

  const [farmData, setFarmData] = useState<FarmData>({
    areaHectares: 10,
    treeCount: 500,
    averageTreeAge: 8,
    treeSpecies: "date_palm",
    soilType: "loamy",
    irrigationType: "drip",
  });

  const [showResults, setShowResults] = useState(false);

  const handleInputChange = (field: keyof FarmData, value: any) => {
    setFarmData((prev) => ({
      ...prev,
      [field]: typeof value === "string" ? value : parseFloat(value),
    }));
  };

  const handleCalculate = () => {
    setShowResults(true);
  };

  const handleSave = () => {
    console.log("Saving farm configuration:", farmData);
    alert(language === "en" ? "Configuration saved!" : "تم حفظ الإعدادات!");
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <section className="bg-gradient-to-r from-cyan-600 to-blue-600 text-white py-12">
        <div className="container">
          <div className="flex items-center gap-3 mb-2">
            <Calculator className="w-8 h-8" />
            <h1 className="text-4xl font-bold">{t.title}</h1>
          </div>
          <p className="text-lg text-cyan-100">{t.subtitle}</p>
        </div>
      </section>

      {/* Main Content */}
      <section className="container py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Input Form */}
          <div className="lg:col-span-1">
            <Card className="p-6 sticky top-4">
              <h2 className="text-xl font-bold text-slate-900 mb-4">
                {t.farmDetails}
              </h2>
              <p className="text-sm text-slate-600 mb-6">{t.instructions}</p>

              <div className="space-y-4">
                {/* Area */}
                <div>
                  <label className="block text-sm font-medium text-slate-900 mb-2">
                    {t.areaLabel}
                  </label>
                  <input
                    type="number"
                    value={farmData.areaHectares}
                    onChange={(e) =>
                      handleInputChange("areaHectares", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    min="0.1"
                    step="0.1"
                  />
                </div>

                {/* Tree Count */}
                <div>
                  <label className="block text-sm font-medium text-slate-900 mb-2">
                    {t.treeCountLabel}
                  </label>
                  <input
                    type="number"
                    value={farmData.treeCount}
                    onChange={(e) =>
                      handleInputChange("treeCount", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    min="1"
                    step="1"
                  />
                </div>

                {/* Average Tree Age */}
                <div>
                  <label className="block text-sm font-medium text-slate-900 mb-2">
                    {t.avgAgeLabel}
                  </label>
                  <input
                    type="number"
                    value={farmData.averageTreeAge}
                    onChange={(e) =>
                      handleInputChange("averageTreeAge", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    min="0"
                    step="1"
                  />
                </div>

                {/* Tree Species */}
                <div>
                  <label className="block text-sm font-medium text-slate-900 mb-2">
                    {t.speciesLabel}
                  </label>
                  <select
                    value={farmData.treeSpecies}
                    onChange={(e) =>
                      handleInputChange(
                        "treeSpecies",
                        e.target.value as "date_palm" | "other"
                      )
                    }
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  >
                    <option value="date_palm">{t.datePalm}</option>
                    <option value="other">{t.other}</option>
                  </select>
                </div>

                {/* Soil Type */}
                <div>
                  <label className="block text-sm font-medium text-slate-900 mb-2">
                    {t.soilTypeLabel}
                  </label>
                  <select
                    value={farmData.soilType}
                    onChange={(e) =>
                      handleInputChange(
                        "soilType",
                        e.target.value as "sandy" | "loamy" | "clay"
                      )
                    }
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  >
                    <option value="sandy">{t.sandy}</option>
                    <option value="loamy">{t.loamy}</option>
                    <option value="clay">{t.clay}</option>
                  </select>
                </div>

                {/* Irrigation Type */}
                <div>
                  <label className="block text-sm font-medium text-slate-900 mb-2">
                    {t.irrigationLabel}
                  </label>
                  <select
                    value={farmData.irrigationType}
                    onChange={(e) =>
                      handleInputChange(
                        "irrigationType",
                        e.target.value as "drip" | "flood" | "rain_fed"
                      )
                    }
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  >
                    <option value="drip">{t.drip}</option>
                    <option value="flood">{t.flood}</option>
                    <option value="rain_fed">{t.rainFed}</option>
                  </select>
                </div>

                {/* Buttons */}
                <div className="space-y-2 pt-4">
                  <Button
                    onClick={handleCalculate}
                    className="w-full bg-cyan-600 hover:bg-cyan-700 text-white"
                  >
                    {t.calculate}
                  </Button>
                  <Button
                    onClick={handleSave}
                    variant="outline"
                    className="w-full"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    {t.save}
                  </Button>
                </div>
              </div>
            </Card>
          </div>

          {/* Results */}
          <div className="lg:col-span-2">
            {showResults ? (
              <div>
                <h2 className="text-2xl font-bold text-slate-900 mb-6">
                  {t.results}
                </h2>
                <CarbonMetricsDashboard farmData={farmData} />
              </div>
            ) : (
              <Card className="p-12 text-center bg-gradient-to-br from-slate-50 to-slate-100">
                <Calculator className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                <p className="text-slate-600 text-lg">
                  {language === "en"
                    ? "Enter your farm details and click Calculate to see your carbon metrics"
                    : "أدخل تفاصيل مزرعتك وانقر على احسب لرؤية مقاييس الكربون الخاصة بك"}
                </p>
              </Card>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
