import { useLanguage } from "@/contexts/LanguageContext";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ActivityFeed } from "@/components/ActivityFeed";
import { FarmManager } from "@/components/FarmManager";
import { EarningsTracker } from "@/components/EarningsTracker";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const mockData = [
  { month: "Jan", carbon: 120 },
  { month: "Feb", carbon: 150 },
  { month: "Mar", carbon: 180 },
  { month: "Apr", carbon: 220 },
  { month: "May", carbon: 250 },
  { month: "Jun", carbon: 280 },
];

export default function Dashboard() {
  const { language } = useLanguage();

  const translations = {
    en: {
      title: "Dashboard",
      welcome: "Welcome to Your Dashboard",
      farms: "Your Farms",
      carbonBalance: "Carbon Balance",
      totalCredits: "Total Credits",
      monthlyTrend: "Monthly Trend",
      addFarm: "Add New Farm",
      viewDetails: "View Details",
      noFarms: "No farms yet. Create your first farm to get started.",
      credits: "Credits",
      tons: "Tons of CO₂",
    },
    ar: {
      title: "لوحة التحكم",
      welcome: "مرحبا بك في لوحة التحكم",
      farms: "مزارعك",
      carbonBalance: "رصيد الكربون",
      totalCredits: "إجمالي الأرصدة",
      monthlyTrend: "الاتجاه الشهري",
      addFarm: "إضافة مزرعة جديدة",
      viewDetails: "عرض التفاصيل",
      noFarms: "لا توجد مزارع بعد. أنشئ مزرعتك الأولى للبدء.",
      credits: "أرصدة",
      tons: "أطنان من CO₂",
    },
  };

  const t = translations[language as keyof typeof translations];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">{t.welcome}</h1>
          <p className="text-slate-600">
            {language === "en"
              ? "Monitor your farm's carbon sequestration and earnings"
              : "راقب عزل الكربون والأرباح من مزرعتك"}
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="p-6 bg-white border-l-4 border-cyan-500">
            <p className="text-slate-600 text-sm font-medium mb-2">{t.totalCredits}</p>
            <p className="text-3xl font-bold text-slate-900">1,250</p>
            <p className="text-cyan-600 text-sm mt-2">+120 this month</p>
          </Card>

          <Card className="p-6 bg-white border-l-4 border-green-500">
            <p className="text-slate-600 text-sm font-medium mb-2">{t.carbonBalance}</p>
            <p className="text-3xl font-bold text-slate-900">2,840 {t.tons}</p>
            <p className="text-green-600 text-sm mt-2">+280 this month</p>
          </Card>

          <Card className="p-6 bg-white border-l-4 border-purple-500">
            <p className="text-slate-600 text-sm font-medium mb-2">
              {language === "en" ? "Estimated Earnings" : "الأرباح المتوقعة"}
            </p>
            <p className="text-3xl font-bold text-slate-900">$5,625</p>
            <p className="text-purple-600 text-sm mt-2">
              {language === "en" ? "Pending verification" : "في انتظار التحقق"}
            </p>
          </Card>
        </div>

        {/* Monthly Trend Chart */}
        <Card className="p-6 bg-white mb-8">
          <h2 className="text-xl font-bold text-slate-900 mb-6">{t.monthlyTrend}</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={mockData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="carbon" fill="#06b6d4" />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* Farms Section */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-slate-900">{t.farms}</h2>
            <Button className="bg-cyan-500 hover:bg-cyan-600 text-white">
              {t.addFarm}
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Sample Farm Card */}
            <Card className="p-6 bg-white hover:shadow-lg transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">
                    {language === "en" ? "Date Palm Farm #1" : "مزرعة نخيل التمر #1"}
                  </h3>
                  <p className="text-slate-600 text-sm">
                    {language === "en" ? "Riyadh, Saudi Arabia" : "الرياض، المملكة العربية السعودية"}
                  </p>
                </div>
                <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                  {language === "en" ? "Active" : "نشط"}
                </span>
              </div>

              <div className="space-y-3 mb-4">
                <div className="flex justify-between">
                  <span className="text-slate-600">
                    {language === "en" ? "Size" : "الحجم"}
                  </span>
                  <span className="font-semibold text-slate-900">50 ha</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">
                    {language === "en" ? "Carbon Credits" : "أرصدة الكربون"}
                  </span>
                  <span className="font-semibold text-slate-900">450</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">
                    {language === "en" ? "Verified" : "مُتحقق"}
                  </span>
                  <span className="font-semibold text-slate-900">85%</span>
                </div>
              </div>

              <Button className="w-full border border-cyan-500 text-cyan-500 hover:bg-cyan-50">
                {t.viewDetails}
              </Button>
            </Card>

            {/* Add Farm Placeholder */}
            <Card className="p-6 bg-slate-50 border-2 border-dashed border-slate-300 flex items-center justify-center cursor-pointer hover:border-cyan-500 transition-colors">
              <div className="text-center">
                <p className="text-3xl mb-2">+</p>
                <p className="text-slate-600 font-medium">{t.addFarm}</p>
              </div>
            </Card>
          </div>
        </div>

        {/* Quick Actions */}
        <Card className="p-6 bg-white">
          <h2 className="text-xl font-bold text-slate-900 mb-4">
            {language === "en" ? "Quick Actions" : "الإجراءات السريعة"}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button className="bg-blue-500 hover:bg-blue-600 text-white">
              {language === "en" ? "Update Farm Data" : "تحديث بيانات المزرعة"}
            </Button>
            <Button className="bg-purple-500 hover:bg-purple-600 text-white">
              {language === "en" ? "View Reports" : "عرض التقارير"}
            </Button>
            <Button className="bg-orange-500 hover:bg-orange-600 text-white">
              {language === "en" ? "Contact Support" : "الاتصال بالدعم"}
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
