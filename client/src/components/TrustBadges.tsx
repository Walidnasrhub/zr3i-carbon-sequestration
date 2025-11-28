import { Shield, CheckCircle, Award, Zap } from "lucide-react";
import { Card } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";

interface Badge {
  icon: React.ReactNode;
  title: string;
  titleAr: string;
  description: string;
  descriptionAr: string;
}

const badges: Badge[] = [
  {
    icon: <Shield className="w-8 h-8 text-cyan-500" />,
    title: "Blockchain Verified",
    titleAr: "التحقق من البلوكتشين",
    description: "All carbon credits verified on blockchain",
    descriptionAr: "جميع أرصدة الكربون موثقة على البلوكتشين",
  },
  {
    icon: <CheckCircle className="w-8 h-8 text-green-500" />,
    title: "ISO Certified",
    titleAr: "معتمد من ISO",
    description: "Meets international carbon standards",
    descriptionAr: "يلبي معايير الكربون الدولية",
  },
  {
    icon: <Award className="w-8 h-8 text-yellow-500" />,
    title: "Third-Party Audited",
    titleAr: "مدقق من طرف ثالث",
    description: "Independent verification of all operations",
    descriptionAr: "التحقق المستقل من جميع العمليات",
  },
  {
    icon: <Zap className="w-8 h-8 text-purple-500" />,
    title: "Real-Time Monitoring",
    titleAr: "المراقبة في الوقت الفعلي",
    description: "Satellite-based farm monitoring 24/7",
    descriptionAr: "مراقبة المزرعة بالأقمار الصناعية 24/7",
  },
];

export function TrustBadges() {
  const { language } = useLanguage();

  return (
    <div className="w-full py-12 bg-slate-50">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-center text-slate-900 mb-12">
          {language === "en" ? "Why Trust Zr3i?" : "لماذا تثق بـ Zr3i؟"}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {badges.map((badge, index) => (
            <Card
              key={index}
              className="p-6 text-center hover:shadow-lg transition-shadow"
            >
              <div className="flex justify-center mb-4">{badge.icon}</div>
              <h3 className="font-bold text-slate-900 mb-2">
                {language === "en" ? badge.title : badge.titleAr}
              </h3>
              <p className="text-sm text-slate-600">
                {language === "en" ? badge.description : badge.descriptionAr}
              </p>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
