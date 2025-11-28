import { Card } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";
import { TrendingUp, BarChart3, PieChart, Calendar } from "lucide-react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart as PieChartComponent,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const yearlyData = [
  { year: "2020", co2: 120, credits: 8, earnings: 1200 },
  { year: "2021", co2: 240, credits: 16, earnings: 2400 },
  { year: "2022", co2: 480, credits: 32, earnings: 4800 },
  { year: "2023", co2: 960, credits: 64, earnings: 9600 },
  { year: "2024", co2: 1920, credits: 128, earnings: 19200 },
];

const farmTypeData = [
  { name: "Date Palms", value: 65, color: "#06b6d4" },
  { name: "Mixed Trees", value: 25, color: "#10b981" },
  { name: "Agroforestry", value: 10, color: "#8b5cf6" },
];

const monthlyComparison = [
  { month: "Jan", target: 250, actual: 240 },
  { month: "Feb", target: 250, actual: 265 },
  { month: "Mar", target: 250, actual: 255 },
  { month: "Apr", target: 250, actual: 270 },
  { month: "May", target: 250, actual: 285 },
  { month: "Jun", target: 250, actual: 300 },
  { month: "Jul", target: 250, actual: 315 },
  { month: "Aug", target: 250, actual: 330 },
  { month: "Sep", target: 250, actual: 315 },
  { month: "Oct", target: 250, actual: 300 },
  { month: "Nov", target: 250, actual: 285 },
  { month: "Dec", target: 250, actual: 300 },
];

export function AnalyticsDashboard() {
  const { language } = useLanguage();

  const translations = {
    en: {
      title: "Analytics & Performance",
      yearlyGrowth: "Yearly Growth Trend",
      farmComposition: "Farm Composition",
      monthlyTarget: "Monthly Target vs Actual",
      performance: "Performance Metrics",
      totalCO2: "Total CO₂ Sequestered",
      avgMonthly: "Average Monthly",
      growthRate: "Growth Rate",
      topMonth: "Best Performing Month",
      target: "Target",
      actual: "Actual",
    },
    ar: {
      title: "التحليلات والأداء",
      yearlyGrowth: "اتجاه النمو السنوي",
      farmComposition: "تكوين المزرعة",
      monthlyTarget: "الهدف الشهري مقابل الفعلي",
      performance: "مقاييس الأداء",
      totalCO2: "إجمالي CO₂ المحتجز",
      avgMonthly: "المتوسط الشهري",
      growthRate: "معدل النمو",
      topMonth: "أفضل شهر أداء",
      target: "الهدف",
      actual: "الفعلي",
    },
  };

  const t = translations[language as keyof typeof translations];

  const totalCO2 = yearlyData.reduce((sum, d) => sum + d.co2, 0);
  const avgMonthly = Math.round(totalCO2 / 60);
  const growthRate = (
    ((yearlyData[4].co2 - yearlyData[0].co2) / yearlyData[0].co2) *
    100
  ).toFixed(1);
  const topMonth = monthlyComparison.reduce((max, m) =>
    m.actual > max.actual ? m : max
  );

  return (
    <div className="w-full space-y-6">
      {/* Performance Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-6 bg-gradient-to-br from-cyan-50 to-blue-50 border-cyan-200">
          <div className="flex items-center justify-between mb-4">
            <BarChart3 className="w-8 h-8 text-cyan-600" />
            <span className="text-xs font-semibold text-cyan-600 bg-cyan-100 px-2 py-1 rounded">
              {language === "en" ? "Total" : "الإجمالي"}
            </span>
          </div>
          <p className="text-sm text-slate-600 mb-2">{t.totalCO2}</p>
          <p className="text-3xl font-bold text-cyan-700">{totalCO2}</p>
          <p className="text-xs text-slate-500 mt-2">
            {language === "en" ? "tons" : "أطنان"}
          </p>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
          <div className="flex items-center justify-between mb-4">
            <TrendingUp className="w-8 h-8 text-green-600" />
            <span className="text-xs font-semibold text-green-600 bg-green-100 px-2 py-1 rounded">
              {language === "en" ? "Average" : "متوسط"}
            </span>
          </div>
          <p className="text-sm text-slate-600 mb-2">{t.avgMonthly}</p>
          <p className="text-3xl font-bold text-green-700">{avgMonthly}</p>
          <p className="text-xs text-slate-500 mt-2">
            {language === "en" ? "per month" : "في الشهر"}
          </p>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
          <div className="flex items-center justify-between mb-4">
            <TrendingUp className="w-8 h-8 text-purple-600" />
            <span className="text-xs font-semibold text-purple-600 bg-purple-100 px-2 py-1 rounded">
              {language === "en" ? "Growth" : "النمو"}
            </span>
          </div>
          <p className="text-sm text-slate-600 mb-2">{t.growthRate}</p>
          <p className="text-3xl font-bold text-purple-700">{growthRate}%</p>
          <p className="text-xs text-slate-500 mt-2">
            {language === "en" ? "5-year growth" : "نمو 5 سنوات"}
          </p>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-orange-50 to-amber-50 border-orange-200">
          <div className="flex items-center justify-between mb-4">
            <Calendar className="w-8 h-8 text-orange-600" />
            <span className="text-xs font-semibold text-orange-600 bg-orange-100 px-2 py-1 rounded">
              {language === "en" ? "Best" : "الأفضل"}
            </span>
          </div>
          <p className="text-sm text-slate-600 mb-2">{t.topMonth}</p>
          <p className="text-3xl font-bold text-orange-700">
            {topMonth.month}
          </p>
          <p className="text-xs text-slate-500 mt-2">
            {topMonth.actual} {language === "en" ? "tons" : "أطنان"}
          </p>
        </Card>
      </div>

      {/* Yearly Growth Chart */}
      <Card className="p-6">
        <h3 className="text-lg font-bold text-slate-900 mb-4">
          {t.yearlyGrowth}
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={yearlyData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="year" />
            <YAxis yAxisId="left" />
            <YAxis yAxisId="right" orientation="right" />
            <Tooltip />
            <Legend />
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="co2"
              stroke="#06b6d4"
              strokeWidth={2}
              dot={{ fill: "#06b6d4", r: 4 }}
              name={language === "en" ? "CO₂ (tons)" : "CO₂ (أطنان)"}
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="earnings"
              stroke="#10b981"
              strokeWidth={2}
              dot={{ fill: "#10b981", r: 4 }}
              name={language === "en" ? "Earnings ($)" : "الأرباح ($)"}
            />
          </LineChart>
        </ResponsiveContainer>
      </Card>

      {/* Farm Composition & Monthly Target */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Farm Composition Pie Chart */}
        <Card className="p-6">
          <h3 className="text-lg font-bold text-slate-900 mb-4">
            {t.farmComposition}
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChartComponent>
              <Pie
                data={farmTypeData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) =>
                  `${name} ${value}%`
                }
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {farmTypeData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => `${value}%`} />
            </PieChartComponent>
          </ResponsiveContainer>
        </Card>

        {/* Monthly Target vs Actual */}
        <Card className="p-6">
          <h3 className="text-lg font-bold text-slate-900 mb-4">
            {t.monthlyTarget}
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={monthlyComparison}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="target" fill="#cbd5e1" name={t.target} />
              <Bar dataKey="actual" fill="#06b6d4" name={t.actual} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Performance Insights */}
      <Card className="p-6 bg-gradient-to-r from-slate-50 to-slate-100">
        <h3 className="text-lg font-bold text-slate-900 mb-4">
          {t.performance}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-white rounded-lg border border-slate-200">
            <p className="text-sm text-slate-600 mb-2">
              {language === "en" ? "Consistency" : "الاتساق"}
            </p>
            <p className="text-2xl font-bold text-slate-900">92%</p>
            <p className="text-xs text-slate-500 mt-2">
              {language === "en"
                ? "Meeting monthly targets"
                : "تحقيق الأهداف الشهرية"}
            </p>
          </div>

          <div className="p-4 bg-white rounded-lg border border-slate-200">
            <p className="text-sm text-slate-600 mb-2">
              {language === "en" ? "Peak Season" : "موسم الذروة"}
            </p>
            <p className="text-2xl font-bold text-slate-900">
              {language === "en" ? "Aug-Sep" : "أغسطس-سبتمبر"}
            </p>
            <p className="text-xs text-slate-500 mt-2">
              {language === "en"
                ? "Highest sequestration"
                : "أعلى امتصاص"}
            </p>
          </div>

          <div className="p-4 bg-white rounded-lg border border-slate-200">
            <p className="text-sm text-slate-600 mb-2">
              {language === "en" ? "Projection" : "التوقع"}
            </p>
            <p className="text-2xl font-bold text-slate-900">2,560</p>
            <p className="text-xs text-slate-500 mt-2">
              {language === "en"
                ? "tons by end of year"
                : "أطنان بنهاية السنة"}
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
