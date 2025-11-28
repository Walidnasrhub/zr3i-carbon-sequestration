import { LoginForm } from "@/components/LoginForm";
import { useLanguage } from "@/contexts/LanguageContext";

export default function Login() {
  const { language } = useLanguage();

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 py-12 px-4 flex items-center">
      <div className="w-full max-w-md mx-auto">
        {/* Logo/Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-2">Zr3i</h1>
          <p className="text-gray-400">
            {language === "en"
              ? "Carbon Sequestration Platform"
              : "منصة عزل الكربون"}
          </p>
        </div>

        {/* Login Form */}
        <LoginForm />

        {/* Features Highlight */}
        <div className="mt-12 space-y-4">
          <div className="flex items-start space-x-3">
            <div className="text-cyan-400 mt-1">✓</div>
            <div>
              <p className="text-white font-semibold">
                {language === "en" ? "Secure Login" : "تسجيل دخول آمن"}
              </p>
              <p className="text-gray-400 text-sm">
                {language === "en"
                  ? "Your data is protected with industry-standard encryption"
                  : "بيانات محمية بتشفير من المستوى الصناعي"}
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <div className="text-cyan-400 mt-1">✓</div>
            <div>
              <p className="text-white font-semibold">
                {language === "en" ? "Quick Access" : "وصول سريع"}
              </p>
              <p className="text-gray-400 text-sm">
                {language === "en"
                  ? "Access your dashboard and farm data instantly"
                  : "الوصول الفوري إلى لوحة التحكم وبيانات المزرعة"}
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <div className="text-cyan-400 mt-1">✓</div>
            <div>
              <p className="text-white font-semibold">
                {language === "en" ? "Multi-Device" : "متعدد الأجهزة"}
              </p>
              <p className="text-gray-400 text-sm">
                {language === "en"
                  ? "Log in from any device, anytime"
                  : "قم بتسجيل الدخول من أي جهاز، في أي وقت"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
