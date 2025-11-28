import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, Zap, Shield, BarChart3 } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Navigation } from "@/components/Navigation";

const translations = {
  en: {
    title: "Enterprise Solutions",
    subtitle: "Bulk Carbon Credit Purchasing for Organizations",
    description: "Scale your carbon offset programs with verified credits from date palm agriculture",
    features: "Enterprise Features",
    cta: "Request Demo",
    features_list: [
      "Bulk purchasing at competitive rates",
      "Dedicated account manager",
      "Custom reporting and analytics",
      "API integration available",
      "Flexible payment terms",
      "Sustainability certification",
    ],
    pricing: "Pricing Tiers",
    tier1: { name: "Starter", credits: "1,000-10,000", price: "Contact for pricing" },
    tier2: { name: "Professional", credits: "10,000-100,000", price: "Contact for pricing" },
    tier3: { name: "Enterprise", credits: "100,000+", price: "Custom pricing" },
  },
  ar: {
    title: "حلول المؤسسات",
    subtitle: "شراء أرصدة الكربون بكميات كبيرة للمنظمات",
    description: "قم بتوسيع برامج تعويض الكربون الخاصة بك باستخدام أرصدة موثقة من زراعة نخيل التمر",
    features: "ميزات المؤسسة",
    cta: "طلب عرض توضيحي",
    features_list: [
      "الشراء بكميات كبيرة بأسعار تنافسية",
      "مدير حساب مخصص",
      "التقارير والتحليلات المخصصة",
      "تكامل API متاح",
      "شروط دفع مرنة",
      "شهادة الاستدامة",
    ],
    pricing: "مستويات التسعير",
    tier1: { name: "البداية", credits: "1,000-10,000", price: "اتصل للحصول على السعر" },
    tier2: { name: "احترافي", credits: "10,000-100,000", price: "اتصل للحصول على السعر" },
    tier3: { name: "المؤسسة", credits: "100,000+", price: "تسعير مخصص" },
  },
};

export default function Enterprise() {
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

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container">
          <h2 className="text-4xl font-bold text-center mb-12">{t.features}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {t.features_list.map((feature, idx) => (
              <Card key={idx} className="hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex gap-4">
                    <CheckCircle2 className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                    <p className="text-foreground font-medium">{feature}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 bg-gradient-to-b from-blue-50 to-white">
        <div className="container">
          <h2 className="text-4xl font-bold text-center mb-12">{t.pricing}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="border-2 border-cyan-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="w-5 h-5 text-cyan-600" />
                  {t.tier1.name}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-2">Credits: {t.tier1.credits}</p>
                <p className="font-semibold text-foreground">{t.tier1.price}</p>
              </CardContent>
            </Card>

            <Card className="border-2 border-green-200 relative">
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-green-600 text-white px-4 py-1 rounded-full text-sm font-semibold">
                Popular
              </div>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-green-600" />
                  {t.tier2.name}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-2">Credits: {t.tier2.credits}</p>
                <p className="font-semibold text-foreground">{t.tier2.price}</p>
              </CardContent>
            </Card>

            <Card className="border-2 border-lime-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-lime-600" />
                  {t.tier3.name}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-2">Credits: {t.tier3.credits}</p>
                <p className="font-semibold text-foreground">{t.tier3.price}</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-cyan-600 to-lime-500">
        <div className="container text-center text-white">
          <h2 className="text-4xl font-bold mb-4">Scale Your Impact</h2>
          <p className="text-lg mb-8 max-w-2xl mx-auto">
            Achieve your sustainability goals with verified carbon credits from Zr3i
          </p>
          <Button size="lg" className="bg-white text-cyan-600 hover:bg-gray-100">
            {t.cta}
          </Button>
        </div>
      </section>
    </div>
  );
}
