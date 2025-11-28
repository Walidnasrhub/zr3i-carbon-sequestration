import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, TrendingUp, Leaf, DollarSign } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Navigation } from "@/components/Navigation";
import { TestimonialCarousel } from "@/components/TestimonialCarousel";
import { TrustBadges } from "@/components/TrustBadges";
import { CommunityHighlights } from "@/components/CommunityHighlights";

const translations = {
  en: {
    title: "For Farmers",
    subtitle: "Transform Your Date Palms Into Carbon Credits",
    description: "Join thousands of farmers earning sustainable income while fighting climate change.",
    benefits: "Why Farmers Choose Zr3i",
    howItWorks: "How It Works",
    cta: "Get Started Today",
    steps: [
      { title: "Register Your Farm", description: "Sign up and provide details about your date palm cultivation" },
      { title: "Satellite Monitoring", description: "We monitor your trees using advanced satellite imagery and AI" },
      { title: "Carbon Calculation", description: "Our algorithms calculate CO2 sequestration from your trees" },
      { title: "Earn Credits", description: "Receive carbon credits and get paid monthly for your contribution" },
    ],
    benefitsList: [
      "Direct payments for carbon sequestration",
      "Real-time monitoring of your farm",
      "No additional effort required",
      "Transparent and verified payments",
      "Support for sustainable farming",
      "Access to global carbon market",
    ],
    successStories: "Farmer Success Stories",
    story1Title: "Ahmed's Success",
    story1Desc: "Earned $5,000 in carbon credits in first year",
    story2Title: "Fatima's Growth",
    story2Desc: "Increased farm income by 30% with Zr3i",
    story3Title: "Hassan's Impact",
    story3Desc: "Sequestered 50 tons of CO2 annually",
  },
  ar: {
    title: "للمزارعين",
    subtitle: "حول نخيلك التمر إلى أرصدة كربون",
    description: "انضم إلى آلاف المزارعين الذين يكسبون دخلاً مستدام",
    benefits: "لماذا يختار المزارعون زرعي",
    howItWorks: "كيفية العمل",
    cta: "ابدأ اليوم",
    steps: [
      { title: "تسجيل المزرعة", description: "قم بالتسجيل وقدم تفاصيل عن زراعة نخيل التمر الخاصة بك" },
      { title: "المراقبة بالأقمار الصناعية", description: "نراقب أشجارك باستخدام تصوير الأقمار الصناعية المتقدم والذكاء الاصطناعي" },
      { title: "حساب الكربون", description: "تحسب خوارزمياتنا امتصاص ثاني أكسيد الكربون من أشجارك" },
      { title: "اكسب الأرصدة", description: "احصل على أرصدة الكربون واحصل على راتب شهري لمساهمتك" },
    ],
    benefitsList: [
      "دفعات مباشرة لامتصاص الكربون",
      "مراقبة فورية لمزرعتك",
      "لا يتطلب جهداً إضافياً",
      "دفعات شفافة ومتحققة",
      "دعم الزراعة المستدامة",
      "الوصول إلى سوق الكربون العالمي",
    ],
    successStories: "قصص نجاح المزارعين",
    story1Title: "نجاح أحمد",
    story1Desc: "كسب 5000 دولار من أرصدة الكربون في السنة الأولى",
    story2Title: "نمو فاطمة",
    story2Desc: "زيادة دخل المزرعة بنسبة 30% مع زرعي",
    story3Title: "تأثير حسن",
    story3Desc: "امتص 50 طن من ثاني أكسيد الكربون سنوياً",
  },
};

export default function Farmers() {
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

      {/* Benefits Section */}
      <section className="py-20 bg-white">
        <div className="container">
          <h2 className="text-4xl font-bold text-center mb-12">{t.benefits}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {t.benefitsList.map((benefit, idx) => (
              <Card key={idx} className="hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex gap-4">
                    <CheckCircle2 className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                    <p className="text-foreground font-medium">{benefit}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-gradient-to-b from-blue-50 to-white">
        <div className="container">
          <h2 className="text-4xl font-bold text-center mb-12">{t.howItWorks}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {t.steps.map((step, idx) => (
              <Card key={idx} className="text-center hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="w-12 h-12 bg-cyan-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 font-bold">
                    {idx + 1}
                  </div>
                  <CardTitle className="text-lg">{step.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{step.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-slate-50">
        <div className="container">
          <h2 className="text-4xl font-bold text-center mb-12">
            {language === "en" ? "What Farmers Say" : "ماذا يقول المزارعون"}
          </h2>
          <TestimonialCarousel />
        </div>
      </section>

      {/* Trust Badges Section */}
      <TrustBadges />

      {/* Community Highlights */}
      <section className="py-20 bg-white">
        <CommunityHighlights />
      </section>

      {/* Success Stories Section */}
      <section className="py-20 bg-white">
        <div className="container">
          <h2 className="text-4xl font-bold text-center mb-12">{t.successStories}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="border-l-4 border-l-green-600">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-green-600" />
                  {t.story1Title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{t.story1Desc}</p>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-cyan-600">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-cyan-600" />
                  {t.story2Title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{t.story2Desc}</p>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-lime-600">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Leaf className="w-5 h-5 text-lime-600" />
                  {t.story3Title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{t.story3Desc}</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-cyan-600 to-lime-500">
        <div className="container text-center text-white">
          <h2 className="text-4xl font-bold mb-4">Ready to Start Earning?</h2>
          <p className="text-lg mb-8 max-w-2xl mx-auto">
            Join thousands of farmers transforming their date palms into sustainable income
          </p>
          <Button size="lg" className="bg-white text-cyan-600 hover:bg-gray-100">
            {t.cta}
          </Button>
        </div>
      </section>
    </div>
  );
}
