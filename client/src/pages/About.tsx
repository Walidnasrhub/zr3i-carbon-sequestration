import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Leaf, Globe, Zap, Users } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Navigation } from "@/components/Navigation";

const translations = {
  en: {
    title: "About Zr3i",
    subtitle: "Transforming Agriculture, Fighting Climate Change",
    mission: "Our Mission",
    missionDesc: "To empower smallholder farmers through technology-enabled carbon sequestration, creating sustainable income streams while combating climate change.",
    vision: "Our Vision",
    visionDesc: "A world where agriculture is a force for climate action, where farmers are valued for their environmental stewardship, and where carbon credits create prosperity for rural communities.",
    values: "Our Values",
    value1: { title: "Sustainability", desc: "Environmental responsibility at the core of everything we do" },
    value2: { title: "Transparency", desc: "Verified, blockchain-backed carbon credits with full traceability" },
    value3: { title: "Empowerment", desc: "Direct payments and tools for farmers to maximize their impact" },
    value4: { title: "Innovation", desc: "Cutting-edge technology for accurate carbon measurement" },
  },
  ar: {
    title: "عن زرعي",
    subtitle: "تحويل الزراعة، محاربة تغير المناخ",
    mission: "مهمتنا",
    missionDesc: "تمكين المزارعين الصغار من خلال تكنولوجيا امتصاص الكربون، وإنشاء تدفقات دخل مستدامة مع محاربة تغير المناخ.",
    vision: "رؤيتنا",
    visionDesc: "عالم تكون فيه الزراعة قوة للعمل المناخي، حيث يتم تقدير المزارعين لحماية البيئة، وحيث تخلق أرصدة الكربون الازدهار للمجتمعات الريفية.",
    values: "قيمنا",
    value1: { title: "الاستدامة", desc: "المسؤولية البيئية في قلب كل ما نفعله" },
    value2: { title: "الشفافية", desc: "أرصدة كربون موثقة ومدعومة بالبلوكتشين مع تتبع كامل" },
    value3: { title: "التمكين", desc: "دفعات مباشرة وأدوات للمزارعين لتعظيم تأثيرهم" },
    value4: { title: "الابتكار", desc: "تكنولوجيا متطورة لقياس الكربون بدقة" },
  },
};

export default function About() {
  const { language } = useLanguage();
  const t = translations[language as keyof typeof translations];

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <Navigation />
      
      {/* Hero Section */}
      <section className="container py-20">
        <div className="max-w-3xl">
          <h1 className="text-5xl font-bold text-foreground mb-4">{t.title}</h1>
          <p className="text-2xl text-cyan-600 font-semibold">{t.subtitle}</p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 bg-white">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-foreground mb-6">{t.mission}</h2>
              <p className="text-lg text-muted-foreground leading-relaxed">{t.missionDesc}</p>
            </div>
            <div className="bg-gradient-to-br from-cyan-100 to-blue-100 rounded-lg p-8 flex items-center justify-center min-h-64">
              <Leaf className="w-32 h-32 text-cyan-600 opacity-50" />
            </div>
          </div>
        </div>
      </section>

      {/* Vision Section */}
      <section className="py-20 bg-gradient-to-b from-blue-50 to-white">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="bg-gradient-to-br from-lime-100 to-green-100 rounded-lg p-8 flex items-center justify-center min-h-64 order-2 md:order-1">
              <Globe className="w-32 h-32 text-lime-600 opacity-50" />
            </div>
            <div className="order-1 md:order-2">
              <h2 className="text-4xl font-bold text-foreground mb-6">{t.vision}</h2>
              <p className="text-lg text-muted-foreground leading-relaxed">{t.visionDesc}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-white">
        <div className="container">
          <h2 className="text-4xl font-bold text-center mb-12">{t.values}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-center mb-4">
                  <Leaf className="w-8 h-8 text-green-600" />
                </div>
                <CardTitle>{t.value1.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{t.value1.desc}</p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-center mb-4">
                  <Zap className="w-8 h-8 text-cyan-600" />
                </div>
                <CardTitle>{t.value2.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{t.value2.desc}</p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-center mb-4">
                  <Users className="w-8 h-8 text-lime-600" />
                </div>
                <CardTitle>{t.value3.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{t.value3.desc}</p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-center mb-4">
                  <Globe className="w-8 h-8 text-orange-600" />
                </div>
                <CardTitle>{t.value4.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{t.value4.desc}</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-cyan-600 to-lime-500">
        <div className="container text-center text-white">
          <h2 className="text-4xl font-bold mb-4">Join Our Mission</h2>
          <p className="text-lg mb-8 max-w-2xl mx-auto">
            Be part of the solution to climate change through sustainable agriculture
          </p>
          <Button size="lg" className="bg-white text-cyan-600 hover:bg-gray-100">
            Get Started
          </Button>
        </div>
      </section>
    </div>
  );
}
