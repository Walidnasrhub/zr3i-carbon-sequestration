import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, Handshake, Globe, Award } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Navigation } from "@/components/Navigation";

const translations = {
  en: {
    title: "For Partners",
    subtitle: "Strategic Partnership Opportunities",
    description: "Collaborate with Zr3i to expand your impact and reach new markets",
    benefits: "Partnership Benefits",
    cta: "Become a Partner",
    benefits_list: [
      "Co-marketing opportunities",
      "Revenue sharing model",
      "Technical integration support",
      "Dedicated partner manager",
      "Access to farmer network",
      "Brand visibility",
    ],
    types: "Partnership Types",
    type1: { title: "Technology Partners", desc: "Integrate our API into your platform" },
    type2: { title: "Distribution Partners", desc: "Sell carbon credits through your channels" },
    type3: { title: "Service Partners", desc: "Provide complementary services to farmers" },
    type4: { title: "Strategic Partners", desc: "Joint ventures and long-term collaborations" },
  },
  ar: {
    title: "للشركاء",
    subtitle: "فرص الشراكة الاستراتيجية",
    description: "تعاون مع زرعي لتوسيع تأثيرك والوصول إلى أسواق جديدة",
    benefits: "فوائد الشراكة",
    cta: "كن شريكاً",
    benefits_list: [
      "فرص التسويق المشترك",
      "نموذج مشاركة الإيرادات",
      "دعم التكامل التقني",
      "مدير شراكة مخصص",
      "الوصول إلى شبكة المزارعين",
      "ظهور العلامة التجارية",
    ],
    types: "أنواع الشراكة",
    type1: { title: "شركاء التكنولوجيا", desc: "دمج واجهة برمجة التطبيقات الخاصة بنا في منصتك" },
    type2: { title: "شركاء التوزيع", desc: "بيع أرصدة الكربون من خلال قنواتك" },
    type3: { title: "شركاء الخدمات", desc: "تقديم خدمات تكميلية للمزارعين" },
    type4: { title: "الشركاء الاستراتيجيين", desc: "المشاريع المشتركة والتعاونيات طويلة الأجل" },
  },
};

export default function Partners() {
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
            {t.benefits_list.map((benefit, idx) => (
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

      {/* Partnership Types */}
      <section className="py-20 bg-gradient-to-b from-blue-50 to-white">
        <div className="container">
          <h2 className="text-4xl font-bold text-center mb-12">{t.types}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="border-l-4 border-l-cyan-600">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="w-5 h-5 text-cyan-600" />
                  {t.type1.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{t.type1.desc}</p>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-green-600">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Handshake className="w-5 h-5 text-green-600" />
                  {t.type2.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{t.type2.desc}</p>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-lime-600">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-lime-600" />
                  {t.type3.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{t.type3.desc}</p>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-orange-600">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Handshake className="w-5 h-5 text-orange-600" />
                  {t.type4.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{t.type4.desc}</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-cyan-600 to-lime-500">
        <div className="container text-center text-white">
          <h2 className="text-4xl font-bold mb-4">Let's Grow Together</h2>
          <p className="text-lg mb-8 max-w-2xl mx-auto">
            Contact our partnerships team to discuss collaboration opportunities
          </p>
          <Button size="lg" className="bg-white text-cyan-600 hover:bg-gray-100">
            {t.cta}
          </Button>
        </div>
      </section>
    </div>
  );
}
