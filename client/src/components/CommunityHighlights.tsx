import { TrendingUp, Users, Leaf, DollarSign } from "lucide-react";
import { Card } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";

interface Highlight {
  icon: React.ReactNode;
  value: string;
  label: string;
  labelAr: string;
  description: string;
  descriptionAr: string;
}

const highlights: Highlight[] = [
  {
    icon: <Users className="w-8 h-8 text-cyan-500" />,
    value: "2,450+",
    label: "Active Farmers",
    labelAr: "المزارعون النشطون",
    description: "Farmers earning sustainable income",
    descriptionAr: "المزارعون يحققون دخلاً مستدام",
  },
  {
    icon: <Leaf className="w-8 h-8 text-green-500" />,
    value: "125,000+",
    label: "Tons CO₂ Sequestered",
    labelAr: "طن CO₂ معزول",
    description: "Carbon removed from atmosphere",
    descriptionAr: "الكربون المزال من الغلاف الجوي",
  },
  {
    icon: <DollarSign className="w-8 h-8 text-yellow-500" />,
    value: "$8.5M+",
    label: "Paid to Farmers",
    labelAr: "مدفوع للمزارعين",
    description: "Direct payments for carbon credits",
    descriptionAr: "الدفع المباشر لأرصدة الكربون",
  },
  {
    icon: <TrendingUp className="w-8 h-8 text-purple-500" />,
    value: "34%",
    label: "Avg Income Increase",
    labelAr: "متوسط زيادة الدخل",
    description: "Year-over-year growth for farmers",
    descriptionAr: "النمو السنوي للمزارعين",
  },
];

export function CommunityHighlights() {
  const { language } = useLanguage();

  return (
    <div className="w-full py-12">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-center text-slate-900 mb-12">
          {language === "en"
            ? "Our Growing Community"
            : "مجتمعنا المتنامي"}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {highlights.map((highlight, index) => (
            <Card
              key={index}
              className="p-6 bg-gradient-to-br from-slate-50 to-slate-100 hover:shadow-lg transition-shadow"
            >
              <div className="flex justify-center mb-4">{highlight.icon}</div>
              <p className="text-3xl font-bold text-slate-900 text-center mb-2">
                {highlight.value}
              </p>
              <h3 className="font-bold text-slate-900 text-center mb-2">
                {language === "en" ? highlight.label : highlight.labelAr}
              </h3>
              <p className="text-sm text-slate-600 text-center">
                {language === "en"
                  ? highlight.description
                  : highlight.descriptionAr}
              </p>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
