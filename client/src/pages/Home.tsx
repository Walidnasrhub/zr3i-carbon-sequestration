import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowRight, Leaf, TrendingUp, Users, Globe, Zap, Phone, Mail } from "lucide-react";
import { useState, useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { LanguageToggle } from "@/components/LanguageToggle";
import { ContactForm } from "@/components/ContactForm";
import { CarbonCalculator } from "@/components/CarbonCalculator";
import { FarmMap } from "@/components/FarmMap";
import { SatelliteViewerWorking } from "@/components/SatelliteViewerWorking";

interface StatCounterProps {
  value: number;
  label: string;
  suffix?: string;
}

function StatCounter({ value, label, suffix = "" }: StatCounterProps) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const duration = 2000;
    const steps = 60;
    const increment = value / steps;
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= value) {
        setCount(value);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [value]);

  return (
    <div className="text-center p-6 rounded-lg bg-gradient-to-br from-cyan-50 to-blue-50 border border-cyan-200 hover:shadow-lg transition-shadow duration-300">
      <div className="text-4xl font-bold text-cyan-600 mb-2">
        {count.toLocaleString()}{suffix}
      </div>
      <p className="text-sm font-medium text-navy-700">{label}</p>
    </div>
  );
}

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

function FeatureCard({ icon, title, description }: FeatureCardProps) {
  return (
    <Card className="p-6 hover:shadow-xl transition-all duration-300 hover:scale-105 border-cyan-200 hover:border-cyan-400 group">
      <div className="mb-4 text-cyan-600 group-hover:text-lime-500 transition-colors duration-300">
        {icon}
      </div>
      <h3 className="font-bold text-lg mb-2 text-navy-900">{title}</h3>
      <p className="text-sm text-navy-700">{description}</p>
    </Card>
  );
}

export default function Home() {
  const { language, t } = useLanguage();

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-blue-50">
      {/* Navigation Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-cyan-200">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-500 to-lime-500 flex items-center justify-center">
              <Leaf className="w-6 h-6 text-navy-900" />
            </div>
            <span className="font-bold text-xl text-navy-900">Zr3i</span>
          </div>
          <nav className="hidden md:flex gap-8 text-sm font-medium">
            <a href="#features" className="text-navy-700 hover:text-cyan-600 transition-colors">{t('nav.features')}</a>
            <a href="#impact" className="text-navy-700 hover:text-cyan-600 transition-colors">{t('nav.impact')}</a>
            <a href="#contact" className="text-navy-700 hover:text-cyan-600 transition-colors">{t('nav.contact')}</a>
          </nav>
          <LanguageToggle />
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-32">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-cyan-400/20 to-transparent rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-lime-400/20 to-transparent rounded-full blur-3xl"></div>
        </div>

        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="inline-block">
                <span className="px-4 py-2 rounded-full bg-cyan-100 text-cyan-700 text-xs font-bold tracking-wide">
                  {t('hero.badge')}
                </span>
              </div>
              <h1 className="text-5xl lg:text-6xl font-bold text-navy-900 leading-tight">
                {t('hero.title')} <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 to-lime-500">{t('hero.title.highlight')}</span>
              </h1>
              <p className="text-lg text-navy-700 leading-relaxed max-w-lg">
                {t('hero.description')}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Button className="bg-gradient-to-r from-cyan-600 to-cyan-500 hover:from-cyan-700 hover:to-cyan-600 text-white px-8 py-6 text-base font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2">
                  {t('hero.cta.primary')} <ArrowRight className="w-5 h-5" />
                </Button>
                <Button variant="outline" className="border-cyan-400 text-cyan-600 hover:bg-cyan-50 px-8 py-6 text-base font-semibold rounded-lg">
                  {t('hero.cta.secondary')}
                </Button>
              </div>
            </div>

            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/30 to-lime-400/30 rounded-2xl blur-2xl"></div>
              <div className="relative rounded-2xl shadow-2xl w-full h-auto bg-gradient-to-br from-cyan-100 to-lime-100 p-8 flex items-center justify-center min-h-96">
                <div className="text-center">
                  <Leaf className="w-24 h-24 text-cyan-600 mx-auto mb-4" />
                  <p className="text-navy-900 font-bold text-lg">{language === 'ar' ? 'عملية عزل الكربون' : 'Carbon Sequestration Process'}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Live Satellite Viewer Demo */}
      <section className="py-20 bg-white relative">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-navy-900 mb-4">
              {language === 'ar' ? 'مراقبة الأقمار الصناعية الحية' : 'Live Satellite Monitoring'}
            </h2>
            <p className="text-lg text-navy-700 max-w-2xl mx-auto">
              {language === 'ar' ? 'شاهد بيانات Sentinel-2 الفعلية مع حسابات NDVI والمؤشرات الأخرى' : 'View real Sentinel-2 data with NDVI calculations and other indices'}
            </p>
          </div>
          <div className="rounded-2xl overflow-hidden shadow-2xl border border-cyan-200">
            <SatelliteViewerWorking farmName="Demo Farm - Egypt" latitude={30.0444} longitude={31.2357} />
          </div>
        </div>
      </section>

      {/* Live Farm Mapping Demo */}
      <section className="py-20 bg-gradient-to-b from-blue-50 to-white relative">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-navy-900 mb-4">
              {language === 'ar' ? 'رسم حدود المزرعة التفاعلي' : 'Interactive Farm Mapping'}
            </h2>
            <p className="text-lg text-navy-700 max-w-2xl mx-auto">
              {language === 'ar' ? 'ارسم حدود مزرعتك وحسب المساحة تلقائياً' : 'Draw your farm boundaries and calculate area automatically'}
            </p>
          </div>
          <div className="rounded-2xl overflow-hidden shadow-2xl border border-cyan-200 h-96">
            <FarmMap initialLat={30.0444} initialLng={31.2357} initialZoom={13} />
          </div>
        </div>
      </section>

      {/* Live Carbon Calculator Demo */}
      <section className="py-20 bg-white relative">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-navy-900 mb-4">
              {language === 'ar' ? 'حاسبة الكربون التفاعلية' : 'Interactive Carbon Calculator'}
            </h2>
            <p className="text-lg text-navy-700 max-w-2xl mx-auto">
              {language === 'ar' ? 'احسب عزل الكربون والدخل المتوقع لمزرعتك' : 'Calculate carbon sequestration and projected income for your farm'}
            </p>
          </div>
          <div className="rounded-2xl overflow-hidden shadow-2xl border border-cyan-200 p-8 bg-gradient-to-br from-blue-50 to-cyan-50">
            <CarbonCalculator />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-gradient-to-b from-white to-blue-50 relative">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full max-w-4xl bg-gradient-to-r from-cyan-500/5 via-transparent to-lime-500/5 rounded-full blur-3xl"></div>
        </div>

        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-navy-900 mb-4">
              {t('features.title')}
            </h2>
            <p className="text-lg text-navy-700 max-w-2xl mx-auto">
              {t('features.description')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <FeatureCard
              icon={<Leaf className="w-8 h-8" />}
              title={t('feature.monitoring')}
              description={t('feature.monitoring.desc')}
            />
            <FeatureCard
              icon={<TrendingUp className="w-8 h-8" />}
              title={t('feature.quantification')}
              description={t('feature.quantification.desc')}
            />
            <FeatureCard
              icon={<Zap className="w-8 h-8" />}
              title={t('feature.monetization')}
              description={t('feature.monetization.desc')}
            />
            <FeatureCard
              icon={<Users className="w-8 h-8" />}
              title={t('feature.empowerment')}
              description={t('feature.empowerment.desc')}
            />
            <FeatureCard
              icon={<Globe className="w-8 h-8" />}
              title={t('feature.access')}
              description={t('feature.access.desc')}
            />
            <FeatureCard
              icon={<Leaf className="w-8 h-8" />}
              title={t('feature.verified')}
              description={t('feature.verified.desc')}
            />
          </div>
        </div>
      </section>

      {/* Impact Section */}
      <section id="impact" className="py-20 bg-gradient-to-br from-navy-900 via-navy-800 to-navy-900 relative overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-lime-500/10 rounded-full blur-3xl"></div>
        </div>

        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">
              {t('impact.title')}
            </h2>
            <p className="text-lg text-cyan-200 max-w-2xl mx-auto">
              {t('impact.description')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <StatCounter value={50000} label={t('impact.palms')} />
            <StatCounter value={12500} label={t('impact.co2')} suffix="+" />
            <StatCounter value={2500} label={t('impact.farmers')} />
            <StatCounter value={450000} label={t('impact.credits')} suffix="+" />
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-navy-900 mb-4">
              {language === 'ar' ? 'تواصل معنا' : 'Get in Touch'}
            </h2>
            <p className="text-lg text-navy-700 max-w-2xl mx-auto">
              {language === 'ar' ? 'لديك أسئلة؟ نحن هنا للمساعدة' : 'Have questions? We are here to help'}
            </p>
          </div>
          <div className="max-w-2xl mx-auto">
            <ContactForm />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-navy-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Leaf className="w-6 h-6 text-cyan-400" />
                <span className="font-bold text-lg">Zr3i</span>
              </div>
              <p className="text-cyan-200 text-sm">{language === 'ar' ? 'منصة عزل الكربون للمزارعين' : 'Carbon Sequestration Platform for Farmers'}</p>
            </div>
            <div>
              <h4 className="font-bold mb-4">{language === 'ar' ? 'المنتج' : 'Product'}</h4>
              <ul className="space-y-2 text-cyan-200 text-sm">
                <li><a href="#features" className="hover:text-cyan-400 transition">{language === 'ar' ? 'الميزات' : 'Features'}</a></li>
                <li><a href="#impact" className="hover:text-cyan-400 transition">{language === 'ar' ? 'التأثير' : 'Impact'}</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">{language === 'ar' ? 'الشركة' : 'Company'}</h4>
              <ul className="space-y-2 text-cyan-200 text-sm">
                <li><a href="#" className="hover:text-cyan-400 transition">{language === 'ar' ? 'من نحن' : 'About'}</a></li>
                <li><a href="#" className="hover:text-cyan-400 transition">{language === 'ar' ? 'المدونة' : 'Blog'}</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">{language === 'ar' ? 'القانوني' : 'Legal'}</h4>
              <ul className="space-y-2 text-cyan-200 text-sm">
                <li><a href="#" className="hover:text-cyan-400 transition">{language === 'ar' ? 'الخصوصية' : 'Privacy'}</a></li>
                <li><a href="#" className="hover:text-cyan-400 transition">{language === 'ar' ? 'الشروط' : 'Terms'}</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-cyan-800 pt-8 text-center text-cyan-200 text-sm">
            <p>&copy; 2025 Zr3i. {language === 'ar' ? 'جميع الحقوق محفوظة' : 'All rights reserved'}.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
