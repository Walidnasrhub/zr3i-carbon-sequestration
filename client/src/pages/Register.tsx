import { RegistrationForm } from "@/components/RegistrationForm";
import { useLanguage } from "@/contexts/LanguageContext";

export default function Register() {
  const { language } = useLanguage();

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            {language === "en" ? "Join Zr3i" : "انضم إلى Zr3i"}
          </h1>
          <p className="text-xl text-cyan-300 mb-2">
            {language === "en"
              ? "Start Your Carbon Sequestration Journey"
              : "ابدأ رحلتك في عزل الكربون"}
          </p>
          <p className="text-gray-400">
            {language === "en"
              ? "Create an account to manage your farms and track carbon credits"
              : "أنشئ حسابًا لإدارة مزارعك وتتبع أرصدة الكربون"}
          </p>
        </div>

        {/* Registration Form */}
        <RegistrationForm />

        {/* Benefits Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
          <div className="bg-slate-800 border border-cyan-500/20 rounded-lg p-6">
            <div className="text-3xl mb-4">📊</div>
            <h3 className="text-lg font-semibold text-white mb-2">
              {language === "en" ? "Track Progress" : "تتبع التقدم"}
            </h3>
            <p className="text-gray-400 text-sm">
              {language === "en"
                ? "Monitor your farm's carbon sequestration in real-time"
                : "راقب عزل الكربون في مزرعتك في الوقت الفعلي"}
            </p>
          </div>

          <div className="bg-slate-800 border border-cyan-500/20 rounded-lg p-6">
            <div className="text-3xl mb-4">💰</div>
            <h3 className="text-lg font-semibold text-white mb-2">
              {language === "en" ? "Earn Income" : "اكسب دخلاً"}
            </h3>
            <p className="text-gray-400 text-sm">
              {language === "en"
                ? "Get paid for verified carbon credits from your farm"
                : "احصل على أموال مقابل أرصدة الكربون المحققة من مزرعتك"}
            </p>
          </div>

          <div className="bg-slate-800 border border-cyan-500/20 rounded-lg p-6">
            <div className="text-3xl mb-4">🌍</div>
            <h3 className="text-lg font-semibold text-white mb-2">
              {language === "en" ? "Impact Climate" : "التأثير على المناخ"}
            </h3>
            <p className="text-gray-400 text-sm">
              {language === "en"
                ? "Contribute to global carbon reduction efforts"
                : "ساهم في جهود تقليل الكربون العالمية"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
