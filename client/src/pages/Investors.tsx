import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, BarChart3, PieChart, DollarSign } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Navigation } from "@/components/Navigation";

const translations = {
  en: {
    title: "For Investors",
    subtitle: "High-Impact Carbon Credit Investment Opportunities",
    description: "Invest in sustainable agriculture and generate returns through carbon credits",
    opportunities: "Investment Opportunities",
    roiSection: "Expected Returns",
    caseStudies: "Case Studies",
    cta: "Explore Investment Options",
    opportunities_list: [
      { title: "Carbon Credit Portfolio", desc: "Diversified portfolio of verified carbon credits" },
      { title: "Farm Partnerships", desc: "Direct investment in high-yield date palm farms" },
      { title: "Impact Bonds", desc: "Fixed-return bonds backed by carbon sequestration" },
      { title: "Fund Participation", desc: "Join our managed carbon credit fund" },
    ],
    roi_info: "Average annual returns of 12-18% with verified carbon credits",
    case1: { title: "Portfolio A", desc: "Initial: $50,000 | Year 1 Return: $7,500 | ROI: 15%" },
    case2: { title: "Portfolio B", desc: "Initial: $100,000 | Year 1 Return: $16,000 | ROI: 16%" },
    case3: { title: "Portfolio C", desc: "Initial: $250,000 | Year 1 Return: $45,000 | ROI: 18%" },
  },
  ar: {
    title: "للمستثمرين",
    subtitle: "فرص استثمار أرصدة الكربون عالية التأثير",
    description: "استثمر في الزراعة المستدامة وحقق عوائد من خلال أرصدة الكربون",
    opportunities: "فرص الاستثمار",
    roiSection: "العوائد المتوقعة",
    caseStudies: "دراسات الحالة",
    cta: "استكشف خيارات الاستثمار",
    opportunities_list: [
      { title: "محفظة أرصدة الكربون", desc: "محفظة متنوعة من أرصدة الكربون المتحققة" },
      { title: "شراكات المزارع", desc: "استثمار مباشر في مزارع نخيل التمر عالية الإنتاجية" },
      { title: "سندات التأثير", desc: "سندات عائد ثابت مدعومة بامتصاص الكربون" },
      { title: "مشاركة الصندوق", desc: "انضم إلى صندوق أرصدة الكربون المدار" },
    ],
    roi_info: "متوسط عوائد سنوية بنسبة 12-18% مع أرصدة كربون متحققة",
    case1: { title: "المحفظة أ", desc: "الأولي: 50,000 دولار | عائد السنة الأولى: 7,500 دولار | العائد: 15%" },
    case2: { title: "المحفظة ب", desc: "الأولي: 100,000 دولار | عائد السنة الأولى: 16,000 دولار | العائد: 16%" },
    case3: { title: "المحفظة ج", desc: "الأولي: 250,000 دولار | عائد السنة الأولى: 45,000 دولار | العائد: 18%" },
  },
};

export default function Investors() {
  const { language } = useLanguage();
  const t = translations[language as keyof typeof translations];

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <Navigation />
      
      {/* Hero Section */}
      <section className="container py-20">
        <div className="max-w-3xl">
          <h1 className="text-5xl font-bold text-foreground mb-4">{t.title}</h1>
          <p className="text-2xl text-cyan-600 font-semibold mb-4">{t.subtitle}</p>
          <p className="text-lg text-muted-foreground mb-8">{t.description}</p>
          <Button size="lg" className="bg-cyan-600 hover:bg-cyan-700">
            {t.cta}
          </Button>
        </div>
      </section>

      {/* Investment Opportunities */}
      <section className="py-20 bg-white">
        <div className="container">
          <h2 className="text-4xl font-bold text-center mb-12">{t.opportunities}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {t.opportunities_list.map((opp, idx) => (
              <Card key={idx} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <DollarSign className="w-5 h-5 text-cyan-600" />
                    {opp.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{opp.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ROI Section */}
      <section className="py-20 bg-gradient-to-b from-blue-50 to-white">
        <div className="container">
          <h2 className="text-4xl font-bold text-center mb-12">{t.roiSection}</h2>
          <div className="bg-white rounded-lg p-8 mb-12 border border-cyan-200">
            <div className="flex items-center gap-4 mb-6">
              <TrendingUp className="w-8 h-8 text-green-600" />
              <p className="text-xl font-semibold text-foreground">{t.roi_info}</p>
            </div>
            <p className="text-muted-foreground">
              Our investment model combines verified carbon credit generation with sustainable agriculture practices, 
              providing consistent returns while contributing to climate change mitigation.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="border-l-4 border-l-green-600">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-green-600" />
                  {t.case1.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{t.case1.desc}</p>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-cyan-600">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-cyan-600" />
                  {t.case2.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{t.case2.desc}</p>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-lime-600">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-lime-600" />
                  {t.case3.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{t.case3.desc}</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-cyan-600 to-lime-500">
        <div className="container text-center text-white">
          <h2 className="text-4xl font-bold mb-4">Ready to Invest?</h2>
          <p className="text-lg mb-8 max-w-2xl mx-auto">
            Join institutional and individual investors generating sustainable returns
          </p>
          <Button size="lg" className="bg-white text-cyan-600 hover:bg-gray-100">
            {t.cta}
          </Button>
        </div>
      </section>
    </div>
  );
}
