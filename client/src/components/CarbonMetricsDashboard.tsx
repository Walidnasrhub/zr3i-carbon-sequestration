import { Card } from "@/components/ui/card";
import { Leaf, TrendingUp, DollarSign, Zap, TreePine, Droplets } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  calculateAnnualCO2Sequestration,
  calculateEnvironmentalImpact,
  FarmData,
} from "@/lib/carbonCalculations";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface CarbonMetricsDashboardProps {
  farmData?: FarmData;
}

export function CarbonMetricsDashboard({
  farmData = {
    areaHectares: 10,
    treeCount: 500,
    averageTreeAge: 8,
    treeSpecies: "date_palm",
    soilType: "loamy",
    irrigationType: "drip",
  },
}: CarbonMetricsDashboardProps) {
  const { language } = useLanguage();
  const metrics = calculateAnnualCO2Sequestration(farmData);
  const impact = calculateEnvironmentalImpact(metrics.annualCO2Sequestration);

  // Generate projection data for chart
  const projectionData = Array.from({ length: 12 }, (_, i) => ({
    month: i + 1,
    sequestration: Math.round((metrics.monthlySequestration * (i + 1)) * 100) / 100,
  }));

  return (
    <div className="w-full space-y-6">
      {/* Main Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Annual CO2 Sequestration */}
        <Card className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
          <div className="flex items-center justify-between mb-4">
            <Leaf className="w-8 h-8 text-green-600" />
            <span className="text-xs font-semibold text-green-600 bg-green-100 px-2 py-1 rounded">
              {language === "en" ? "Annual" : "سنوي"}
            </span>
          </div>
          <p className="text-sm text-slate-600 mb-2">
            {language === "en"
              ? "CO₂ Sequestration"
              : "امتصاص ثاني أكسيد الكربون"}
          </p>
          <p className="text-3xl font-bold text-green-700">
            {metrics.annualCO2Sequestration}
          </p>
          <p className="text-xs text-slate-500 mt-2">
            {language === "en" ? "tons/year" : "طن/سنة"}
          </p>
        </Card>

        {/* Monthly Earnings */}
        <Card className="p-6 bg-gradient-to-br from-cyan-50 to-blue-50 border-cyan-200">
          <div className="flex items-center justify-between mb-4">
            <DollarSign className="w-8 h-8 text-cyan-600" />
            <span className="text-xs font-semibold text-cyan-600 bg-cyan-100 px-2 py-1 rounded">
              {language === "en" ? "Monthly" : "شهري"}
            </span>
          </div>
          <p className="text-sm text-slate-600 mb-2">
            {language === "en" ? "Earnings" : "الأرباح"}
          </p>
          <p className="text-3xl font-bold text-cyan-700">
            ${Math.round(metrics.monthlySequestration * 15)}
          </p>
          <p className="text-xs text-slate-500 mt-2">
            {language === "en" ? "per month" : "في الشهر"}
          </p>
        </Card>

        {/* Total Biomass */}
        <Card className="p-6 bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-200">
          <div className="flex items-center justify-between mb-4">
            <TreePine className="w-8 h-8 text-yellow-600" />
            <span className="text-xs font-semibold text-yellow-600 bg-yellow-100 px-2 py-1 rounded">
              {language === "en" ? "Stored" : "مخزن"}
            </span>
          </div>
          <p className="text-sm text-slate-600 mb-2">
            {language === "en" ? "Total Biomass" : "إجمالي الكتلة الحية"}
          </p>
          <p className="text-3xl font-bold text-yellow-700">
            {metrics.totalBiomass}
          </p>
          <p className="text-xs text-slate-500 mt-2">
            {language === "en" ? "tons" : "طن"}
          </p>
        </Card>

        {/* Carbon Credits */}
        <Card className="p-6 bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
          <div className="flex items-center justify-between mb-4">
            <Zap className="w-8 h-8 text-purple-600" />
            <span className="text-xs font-semibold text-purple-600 bg-purple-100 px-2 py-1 rounded">
              {language === "en" ? "Credits" : "أرصدة"}
            </span>
          </div>
          <p className="text-sm text-slate-600 mb-2">
            {language === "en" ? "Carbon Credits" : "أرصدة الكربون"}
          </p>
          <p className="text-3xl font-bold text-purple-700">
            {metrics.carbonCredits}
          </p>
          <p className="text-xs text-slate-500 mt-2">
            {language === "en" ? "credits/year" : "أرصدة/سنة"}
          </p>
        </Card>
      </div>

      {/* Projection Chart */}
      <Card className="p-6">
        <h3 className="text-lg font-bold text-slate-900 mb-4">
          {language === "en"
            ? "12-Month Sequestration Projection"
            : "توقعات الامتصاص لمدة 12 شهر"}
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={projectionData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis
              dataKey="month"
              label={{
                value: language === "en" ? "Month" : "الشهر",
                position: "insideBottomRight",
                offset: -5,
              }}
            />
            <YAxis
              label={{
                value: language === "en" ? "CO₂ Tons" : "طن CO₂",
                angle: -90,
                position: "insideLeft",
              }}
            />
            <Tooltip
              formatter={(value) => [
                `${value} ${language === "en" ? "tons" : "طن"}`,
              ]}
              labelFormatter={(label) =>
                `${language === "en" ? "Month" : "الشهر"} ${label}`
              }
            />
            <Line
              type="monotone"
              dataKey="sequestration"
              stroke="#0891b2"
              strokeWidth={2}
              dot={{ fill: "#0891b2", r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </Card>

      {/* Environmental Impact */}
      <Card className="p-6 bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
        <h3 className="text-lg font-bold text-slate-900 mb-4">
          {language === "en"
            ? "Environmental Impact"
            : "التأثير البيئي"}
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <TreePine className="w-8 h-8 text-green-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-green-700">
              {impact.treesEquivalent}
            </p>
            <p className="text-xs text-slate-600">
              {language === "en" ? "Trees Equivalent" : "ما يعادل الأشجار"}
            </p>
          </div>
          <div className="text-center">
            <Droplets className="w-8 h-8 text-blue-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-blue-700">
              {impact.carsOffRoad}
            </p>
            <p className="text-xs text-slate-600">
              {language === "en" ? "Cars Off Road" : "سيارات بدون انبعاثات"}
            </p>
          </div>
          <div className="text-center">
            <Zap className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-yellow-700">
              {impact.housesOffGrid}
            </p>
            <p className="text-xs text-slate-600">
              {language === "en" ? "Houses Off Grid" : "منازل بدون انبعاثات"}
            </p>
          </div>
          <div className="text-center">
            <TrendingUp className="w-8 h-8 text-purple-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-purple-700">
              {impact.flightsMitigated}
            </p>
            <p className="text-xs text-slate-600">
              {language === "en" ? "Flights Mitigated" : "رحلات جوية معادلة"}
            </p>
          </div>
        </div>
      </Card>

      {/* Farm Details Summary */}
      <Card className="p-6 bg-slate-50">
        <h3 className="text-lg font-bold text-slate-900 mb-4">
          {language === "en" ? "Farm Configuration" : "إعدادات المزرعة"}
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div>
            <p className="text-sm text-slate-600">
              {language === "en" ? "Area" : "المساحة"}
            </p>
            <p className="text-lg font-bold text-slate-900">
              {farmData.areaHectares} {language === "en" ? "ha" : "هكتار"}
            </p>
          </div>
          <div>
            <p className="text-sm text-slate-600">
              {language === "en" ? "Trees" : "الأشجار"}
            </p>
            <p className="text-lg font-bold text-slate-900">
              {farmData.treeCount}
            </p>
          </div>
          <div>
            <p className="text-sm text-slate-600">
              {language === "en" ? "Avg Age" : "متوسط العمر"}
            </p>
            <p className="text-lg font-bold text-slate-900">
              {farmData.averageTreeAge} {language === "en" ? "yrs" : "سنة"}
            </p>
          </div>
          <div>
            <p className="text-sm text-slate-600">
              {language === "en" ? "Species" : "النوع"}
            </p>
            <p className="text-lg font-bold text-slate-900">
              {language === "en"
                ? farmData.treeSpecies === "date_palm"
                  ? "Date Palm"
                  : "Other"
                : farmData.treeSpecies === "date_palm"
                ? "نخيل التمر"
                : "أخرى"}
            </p>
          </div>
          <div>
            <p className="text-sm text-slate-600">
              {language === "en" ? "Soil Type" : "نوع التربة"}
            </p>
            <p className="text-lg font-bold text-slate-900">
              {language === "en"
                ? farmData.soilType.charAt(0).toUpperCase() +
                  farmData.soilType.slice(1)
                : farmData.soilType === "sandy"
                ? "رملية"
                : farmData.soilType === "loamy"
                ? "طينية"
                : "طين"}
            </p>
          </div>
          <div>
            <p className="text-sm text-slate-600">
              {language === "en" ? "Irrigation" : "الري"}
            </p>
            <p className="text-lg font-bold text-slate-900">
              {language === "en"
                ? farmData.irrigationType
                  .split("_")
                  .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
                  .join(" ")
                : farmData.irrigationType === "drip"
                ? "بالتنقيط"
                : farmData.irrigationType === "flood"
                ? "بالفيضان"
                : "المطر"}
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
