import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AnalyticsDashboard } from "@/components/AnalyticsDashboard";
import { useLanguage } from "@/contexts/LanguageContext";
import { generatePDFReport, generateCSVReport, downloadCSV } from "@/lib/reportGenerator";
import { FileText, Download, BarChart3 } from "lucide-react";

const translations = {
  en: {
    title: "Reports & Analytics",
    subtitle: "View detailed reports and analytics for your farms",
    generateReport: "Generate PDF Report",
    exportData: "Export CSV Data",
    viewAnalytics: "View Analytics",
    reportGenerated: "Report generated successfully!",
    dataExported: "Data exported successfully!",
    selectFarm: "Select a farm to generate reports",
  },
  ar: {
    title: "التقارير والتحليلات",
    subtitle: "عرض التقارير والتحليلات التفصيلية لمزارعك",
    generateReport: "إنشاء تقرير PDF",
    exportData: "تصدير بيانات CSV",
    viewAnalytics: "عرض التحليلات",
    reportGenerated: "تم إنشاء التقرير بنجاح!",
    dataExported: "تم تصدير البيانات بنجاح!",
    selectFarm: "اختر مزرعة لإنشاء التقارير",
  },
};

export default function Reports() {
  const { language } = useLanguage();
  const t = translations[language as keyof typeof translations];

  const [selectedFarm, setSelectedFarm] = useState("farm1");

  const farms = [
    {
      id: "farm1",
      name: "Date Palm Farm #1",
      location: "Riyadh, Saudi Arabia",
    },
    {
      id: "farm2",
      name: "Mixed Trees Farm",
      location: "Dammam, Saudi Arabia",
    },
  ];

  const handleGeneratePDF = () => {
    const reportData = {
      farmName: "Date Palm Farm #1",
      farmerName: "Ahmed Al-Rashid",
      area: 50,
      treeCount: 2500,
      averageAge: 8,
      reportDate: new Date(),
      annualCO2: 1920,
      monthlyEarnings: 300,
      totalCredits: 128,
      verificationStatus: "Verified",
      soilType: "Loamy",
      irrigationType: "Drip",
    };

    generatePDFReport(reportData);
    alert(t.reportGenerated);
  };

  const handleExportCSV = () => {
    const reportData = [
      {
        farmName: "Date Palm Farm #1",
        farmerName: "Ahmed Al-Rashid",
        area: 50,
        treeCount: 2500,
        averageAge: 8,
        reportDate: new Date(),
        annualCO2: 1920,
        monthlyEarnings: 300,
        totalCredits: 128,
        verificationStatus: "Verified",
        soilType: "Loamy",
        irrigationType: "Drip",
      },
      {
        farmName: "Mixed Trees Farm",
        farmerName: "Ahmed Al-Rashid",
        area: 30,
        treeCount: 1200,
        averageAge: 6,
        reportDate: new Date(),
        annualCO2: 960,
        monthlyEarnings: 180,
        totalCredits: 64,
        verificationStatus: "Pending",
        soilType: "Sandy",
        irrigationType: "Flood",
      },
    ];

    const csv = generateCSVReport(reportData);
    downloadCSV(csv, `Farm_Reports_${new Date().getFullYear()}.csv`);
    alert(t.dataExported);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <section className="bg-gradient-to-r from-cyan-600 to-blue-600 text-white py-12">
        <div className="container">
          <div className="flex items-center gap-3 mb-2">
            <BarChart3 className="w-8 h-8" />
            <h1 className="text-4xl font-bold">{t.title}</h1>
          </div>
          <p className="text-lg text-cyan-100">{t.subtitle}</p>
        </div>
      </section>

      {/* Main Content */}
      <section className="container py-12">
        {/* Farm Selection & Actions */}
        <Card className="p-6 mb-8">
          <h2 className="text-xl font-bold text-slate-900 mb-4">
            {language === "en" ? "Select Farm" : "اختر المزرعة"}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {farms.map((farm) => (
              <div
                key={farm.id}
                onClick={() => setSelectedFarm(farm.id)}
                className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                  selectedFarm === farm.id
                    ? "border-cyan-500 bg-cyan-50"
                    : "border-slate-200 bg-white hover:border-cyan-300"
                }`}
              >
                <h3 className="font-semibold text-slate-900">{farm.name}</h3>
                <p className="text-sm text-slate-600">{farm.location}</p>
              </div>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button
              onClick={handleGeneratePDF}
              className="bg-cyan-600 hover:bg-cyan-700 text-white flex items-center gap-2"
            >
              <FileText className="w-4 h-4" />
              {t.generateReport}
            </Button>
            <Button
              onClick={handleExportCSV}
              className="bg-green-600 hover:bg-green-700 text-white flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              {t.exportData}
            </Button>
            <Button
              variant="outline"
              className="border-cyan-600 text-cyan-600 hover:bg-cyan-50 flex items-center gap-2"
            >
              <BarChart3 className="w-4 h-4" />
              {t.viewAnalytics}
            </Button>
          </div>
        </Card>

        {/* Analytics Dashboard */}
        <div>
          <h2 className="text-2xl font-bold text-slate-900 mb-6">
            {language === "en" ? "Performance Analytics" : "تحليلات الأداء"}
          </h2>
          <AnalyticsDashboard />
        </div>

        {/* Report Types */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">
            {language === "en" ? "Available Reports" : "التقارير المتاحة"}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Carbon Report */}
            <Card className="p-6 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-cyan-100 rounded-lg flex items-center justify-center mb-4">
                <FileText className="w-6 h-6 text-cyan-600" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">
                {language === "en"
                  ? "Carbon Report"
                  : "تقرير الكربون"}
              </h3>
              <p className="text-sm text-slate-600 mb-4">
                {language === "en"
                  ? "Detailed carbon sequestration metrics and environmental impact"
                  : "مقاييس امتصاص الكربون التفصيلية والتأثير البيئي"}
              </p>
              <Button
                variant="outline"
                className="w-full border-cyan-600 text-cyan-600 hover:bg-cyan-50"
              >
                {language === "en" ? "Generate" : "إنشاء"}
              </Button>
            </Card>

            {/* Earnings Report */}
            <Card className="p-6 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <FileText className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">
                {language === "en"
                  ? "Earnings Report"
                  : "تقرير الأرباح"}
              </h3>
              <p className="text-sm text-slate-600 mb-4">
                {language === "en"
                  ? "Monthly and annual earnings, payment history, and projections"
                  : "الأرباح الشهرية والسنوية وسجل الدفع والتوقعات"}
              </p>
              <Button
                variant="outline"
                className="w-full border-green-600 text-green-600 hover:bg-green-50"
              >
                {language === "en" ? "Generate" : "إنشاء"}
              </Button>
            </Card>

            {/* Compliance Report */}
            <Card className="p-6 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <FileText className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">
                {language === "en"
                  ? "Compliance Report"
                  : "تقرير الامتثال"}
              </h3>
              <p className="text-sm text-slate-600 mb-4">
                {language === "en"
                  ? "Certification-ready documentation and verification status"
                  : "الوثائق الجاهزة للشهادة وحالة التحقق"}
              </p>
              <Button
                variant="outline"
                className="w-full border-purple-600 text-purple-600 hover:bg-purple-50"
              >
                {language === "en" ? "Generate" : "إنشاء"}
              </Button>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
