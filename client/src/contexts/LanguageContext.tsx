import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'en' | 'ar';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  isRTL: boolean;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Translation dictionary
const translations: Record<Language, Record<string, string>> = {
  en: {
    'nav.features': 'Features',
    'nav.impact': 'Impact',
    'nav.contact': 'Contact',
    'hero.badge': 'CARBON SEQUESTRATION INNOVATION',
    'hero.title': 'Transform Date Palms Into',
    'hero.title.highlight': 'Carbon Credits',
    'hero.description': 'Zr3i harnesses cutting-edge agritech to measure, verify, and monetize carbon sequestration from date palm cultivation. Empower smallholder farmers while combating climate change.',
    'hero.cta.primary': 'Get Started',
    'hero.cta.secondary': 'Learn More',
    'features.title': 'How Zr3i Works',
    'features.description': 'Our platform combines satellite imagery, AI analytics, and blockchain verification to create transparent, tradeable carbon credits.',
    'feature.monitoring': 'Satellite Monitoring',
    'feature.monitoring.desc': 'Real-time NDVI analysis tracks date palm health and growth patterns with precision agriculture technology.',
    'feature.quantification': 'Carbon Quantification',
    'feature.quantification.desc': 'Advanced algorithms calculate CO₂ sequestration rates based on tree age, biomass, and soil carbon content.',
    'feature.monetization': 'Instant Monetization',
    'feature.monetization.desc': 'Convert verified carbon offsets into tradeable credits on our blockchain-verified marketplace.',
    'feature.empowerment': 'Farmer Empowerment',
    'feature.empowerment.desc': 'Direct payments to smallholder farmers for carbon sequestration, creating sustainable income streams.',
    'feature.access': 'Global Market Access',
    'feature.access.desc': 'Connect with international carbon credit buyers and environmental organizations worldwide.',
    'feature.verified': 'Sustainability Verified',
    'feature.verified.desc': 'Third-party audits and blockchain transparency ensure all credits meet international standards.',
    'impact.title': 'Our Impact',
    'impact.description': 'Zr3i is making measurable progress in carbon sequestration and farmer empowerment across the MENA region.',
    'impact.palms': 'Date Palms Monitored',
    'impact.co2': 'Tons CO₂ Sequestered',
    'impact.farmers': 'Farmers Empowered',
    'impact.credits': 'Carbon Credits Generated',
    'tech.title': 'Bridging Agriculture & Technology',
    'tech.description': 'Zr3i combines traditional agricultural knowledge with cutting-edge technology to create a sustainable future. Our platform empowers farmers with real-time data insights while connecting them to global carbon markets.',
    'tech.feature1': 'Precision agriculture with satellite monitoring',
    'tech.feature2': 'AI-powered carbon sequestration modeling',
    'tech.feature3': 'Blockchain-verified carbon credits',
    'tech.feature4': 'Direct farmer payments and transparency',
    'tech.feature5': 'Support for sustainable livelihoods',
    'tracking.title': 'Real-Time Carbon Tracking',
    'tracking.description': 'Monitor carbon sequestration metrics in real-time with our advanced data visualization dashboard.',
    'cta.title': 'Ready to Make an Impact?',
    'cta.description': 'Join thousands of farmers and organizations transforming date palm cultivation into measurable climate action.',
    'cta.primary': 'Start Your Journey',
    'cta.secondary': 'Schedule Demo',
    'contact.title': 'Get In Touch',
    'contact.description': 'Have questions? Our team is ready to help you get started with carbon sequestration.',
    'contact.email': 'Email',
    'contact.phone': 'Phone',
    'contact.email.value': 'info@zr3i.com',
    'contact.phone.value': '+20 100 605 5320',
    'footer.tagline': 'Carbon sequestration through date palm agriculture.',
    'footer.links': 'Quick Links',
    'footer.contact': 'Contact',
    'footer.copyright': '© 2024 Zr3i. All rights reserved. Carbon sequestration through innovation.',
  },
  ar: {
    'nav.features': 'المميزات',
    'nav.impact': 'التأثير',
    'nav.contact': 'اتصل بنا',
    'hero.badge': 'ابتكار في عزل الكربون',
    'hero.title': 'حول نخيل التمر إلى',
    'hero.title.highlight': 'أرصدة كربونية',
    'hero.description': 'تستخدم زرعي تكنولوجيا زراعية متقدمة لقياس والتحقق من وتحقيق الدخل من عزل الكربون من زراعة نخيل التمر. تمكين المزارعين من أصحاب الحيازات الصغيرة مع مكافحة تغير المناخ.',
    'hero.cta.primary': 'ابدأ الآن',
    'hero.cta.secondary': 'تعرف على المزيد',
    'features.title': 'كيف تعمل زرعي',
    'features.description': 'تجمع منصتنا بين صور الأقمار الصناعية وتحليلات الذكاء الاصطناعي والتحقق من البلوكتشين لإنشاء أرصدة كربونية شفافة وقابلة للتداول.',
    'feature.monitoring': 'المراقبة عبر الأقمار الصناعية',
    'feature.monitoring.desc': 'تحليل NDVI في الوقت الفعلي يتتبع صحة نخيل التمر وأنماط النمو باستخدام تكنولوجيا الزراعة الدقيقة.',
    'feature.quantification': 'قياس الكربون',
    'feature.quantification.desc': 'تحسب الخوارزميات المتقدمة معدلات عزل CO₂ بناءً على عمر الشجرة والكتلة الحيوية ومحتوى الكربون في التربة.',
    'feature.monetization': 'تحقيق الدخل الفوري',
    'feature.monetization.desc': 'تحويل تعويضات الكربون المتحقق منها إلى أرصدة قابلة للتداول في سوقنا المتحقق منها عبر البلوكتشين.',
    'feature.empowerment': 'تمكين المزارعين',
    'feature.empowerment.desc': 'دفعات مباشرة للمزارعين من أصحاب الحيازات الصغيرة لعزل الكربون، مما يخلق تدفقات دخل مستدامة.',
    'feature.access': 'الوصول إلى السوق العالمية',
    'feature.access.desc': 'التواصل مع مشترين أرصدة الكربون الدوليين والمنظمات البيئية في جميع أنحاء العالم.',
    'feature.verified': 'التحقق من الاستدامة',
    'feature.verified.desc': 'تدقيق الطرف الثالث وشفافية البلوكتشين تضمن استيفاء جميع الأرصدة للمعايير الدولية.',
    'impact.title': 'تأثيرنا',
    'impact.description': 'تحقق زرعي تقدماً قابلاً للقياس في عزل الكربون وتمكين المزارعين عبر منطقة الشرق الأوسط وشمال أفريقيا.',
    'impact.palms': 'نخيل التمر المراقب',
    'impact.co2': 'أطنان CO₂ المعزول',
    'impact.farmers': 'المزارعون المُمكنون',
    'impact.credits': 'أرصدة الكربون المُنتجة',
    'tech.title': 'ربط الزراعة بالتكنولوجيا',
    'tech.description': 'تجمع زرعي بين المعرفة الزراعية التقليدية والتكنولوجيا المتقدمة لإنشاء مستقبل مستدام. تمكن منصتنا المزارعين برؤى بيانات في الوقت الفعلي مع ربطهم بأسواق الكربون العالمية.',
    'tech.feature1': 'الزراعة الدقيقة مع المراقبة عبر الأقمار الصناعية',
    'tech.feature2': 'نمذجة عزل الكربون المدعومة بالذكاء الاصطناعي',
    'tech.feature3': 'أرصدة كربونية موثوقة عبر البلوكتشين',
    'tech.feature4': 'دفعات مباشرة للمزارعين والشفافية',
    'tech.feature5': 'دعم سبل العيش المستدامة',
    'tracking.title': 'تتبع الكربون في الوقت الفعلي',
    'tracking.description': 'راقب مقاييس عزل الكربون في الوقت الفعلي باستخدام لوحة معلومات تصور البيانات المتقدمة لدينا.',
    'cta.title': 'هل أنت مستعد لإحداث تأثير؟',
    'cta.description': 'انضم إلى آلاف المزارعين والمنظمات التي تحول زراعة نخيل التمر إلى عمل مناخي قابل للقياس.',
    'cta.primary': 'ابدأ رحلتك',
    'cta.secondary': 'جدول عرض توضيحي',
    'contact.title': 'تواصل معنا',
    'contact.description': 'هل لديك أسئلة؟ فريقنا جاهز لمساعدتك في البدء مع عزل الكربون.',
    'contact.email': 'البريد الإلكتروني',
    'contact.phone': 'الهاتف',
    'contact.email.value': 'info@zr3i.com',
    'contact.phone.value': '+20 100 605 5320',
    'footer.tagline': 'عزل الكربون من خلال زراعة نخيل التمر.',
    'footer.links': 'روابط سريعة',
    'footer.contact': 'اتصل بنا',
    'footer.copyright': '© 2024 زرعي. جميع الحقوق محفوظة. عزل الكربون من خلال الابتكار.',
  },
};

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>('en');

  useEffect(() => {
    // Load language preference from localStorage
    const savedLanguage = localStorage.getItem('language') as Language | null;
    if (savedLanguage && (savedLanguage === 'en' || savedLanguage === 'ar')) {
      setLanguageState(savedLanguage);
      document.documentElement.lang = savedLanguage;
      document.documentElement.dir = savedLanguage === 'ar' ? 'rtl' : 'ltr';
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('language', lang);
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
  };

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  const value: LanguageContextType = {
    language,
    setLanguage,
    isRTL: language === 'ar',
    t,
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
}
