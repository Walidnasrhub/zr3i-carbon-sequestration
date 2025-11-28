import { useState, useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { ChevronDown, Search, HelpCircle } from "lucide-react";

interface FAQItem {
  id: string;
  category: string;
  categoryAr: string;
  question: string;
  questionAr: string;
  answer: string;
  answerAr: string;
}

const translations = {
  en: {
    title: "Frequently Asked Questions",
    subtitle: "Find answers to common questions about Zr3i",
    searchPlaceholder: "Search FAQs...",
    noResults: "No FAQs found matching your search",
    allCategories: "All Categories",
    contactSupport: "Can't find what you're looking for?",
    contactEmail: "Contact our support team at info@zr3i.com",
  },
  ar: {
    title: "الأسئلة الشائعة",
    subtitle: "ابحث عن إجابات للأسئلة الشائعة حول Zr3i",
    searchPlaceholder: "البحث في الأسئلة الشائعة...",
    noResults: "لم يتم العثور على أسئلة شائعة تطابق البحث",
    allCategories: "جميع الفئات",
    contactSupport: "لم تجد ما تبحث عنه؟",
    contactEmail: "اتصل بفريق الدعم لدينا على info@zr3i.com",
  },
};

const faqData: FAQItem[] = [
  // Getting Started
  {
    id: "1",
    category: "Getting Started",
    categoryAr: "البدء",
    question: "How do I register for Zr3i?",
    questionAr: "كيف أسجل في Zr3i؟",
    answer:
      "Click the 'Get Started' button on the homepage and fill in your email, password, and basic farm information. You'll receive a confirmation email to verify your account.",
    answerAr:
      "انقر على زر 'ابدأ الآن' على الصفحة الرئيسية وملء بريدك الإلكتروني وكلمة المرور والمعلومات الأساسية عن المزرعة. ستتلقى بريد تأكيد لتحقق من حسابك.",
  },
  {
    id: "2",
    category: "Getting Started",
    categoryAr: "البدء",
    question: "What information do I need to provide during registration?",
    questionAr: "ما المعلومات التي أحتاج إلى تقديمها أثناء التسجيل؟",
    answer:
      "You'll need to provide your full name, email address, phone number, farm location, and farm size. You can add more details later in your profile settings.",
    answerAr:
      "ستحتاج إلى تقديم اسمك الكامل وعنوان بريدك الإلكتروني ورقم هاتفك وموقع المزرعة وحجم المزرعة. يمكنك إضافة المزيد من التفاصيل لاحقًا في إعدادات ملفك الشخصي.",
  },
  {
    id: "3",
    category: "Getting Started",
    categoryAr: "البدء",
    question: "Is there a cost to use Zr3i?",
    questionAr: "هل هناك تكلفة لاستخدام Zr3i؟",
    answer:
      "Zr3i offers a free tier for farmers to register and use basic features. Premium features and advanced analytics are available with a subscription.",
    answerAr:
      "يوفر Zr3i طبقة مجانية للمزارعين للتسجيل واستخدام الميزات الأساسية. الميزات المتقدمة والتحليلات المتقدمة متاحة بالاشتراك.",
  },

  // Farm Management
  {
    id: "4",
    category: "Farm Management",
    categoryAr: "إدارة المزرعة",
    question: "How do I add a new farm to my account?",
    questionAr: "كيف أضيف مزرعة جديدة إلى حسابي؟",
    answer:
      "Go to your Dashboard and click 'Add Farm'. Fill in the farm details including name, location, size, and crop type. You can manage multiple farms from a single account.",
    answerAr:
      "انتقل إلى لوحة التحكم الخاصة بك وانقر على 'إضافة مزرعة'. ملء تفاصيل المزرعة بما في ذلك الاسم والموقع والحجم ونوع المحصول. يمكنك إدارة عدة مزارع من حساب واحد.",
  },
  {
    id: "5",
    category: "Farm Management",
    categoryAr: "إدارة المزرعة",
    question: "Can I edit my farm information after registration?",
    questionAr: "هل يمكنني تعديل معلومات مزرعتي بعد التسجيل؟",
    answer:
      "Yes, you can edit farm information anytime from your Dashboard. Click on the farm card and select 'Edit' to update details like location, size, or crop type.",
    answerAr:
      "نعم، يمكنك تعديل معلومات المزرعة في أي وقت من لوحة التحكم الخاصة بك. انقر على بطاقة المزرعة واختر 'تعديل' لتحديث التفاصيل مثل الموقع أو الحجم أو نوع المحصول.",
  },
  {
    id: "6",
    category: "Farm Management",
    categoryAr: "إدارة المزرعة",
    question: "How do I define my farm boundaries on the map?",
    questionAr: "كيف أحدد حدود مزرعتي على الخريطة؟",
    answer:
      "Use the Farm Mapping tool to draw your farm boundaries. Click the polygon drawing tool and click on the map to create points around your farm. The system automatically calculates the area in hectares and acres.",
    answerAr:
      "استخدم أداة رسم خريطة المزرعة لرسم حدود مزرعتك. انقر على أداة رسم المضلع وانقر على الخريطة لإنشاء نقاط حول مزرعتك. يحسب النظام تلقائيًا المساحة بالهكتار والفدان.",
  },

  // Carbon Calculation
  {
    id: "7",
    category: "Carbon Calculation",
    categoryAr: "حساب الكربون",
    question: "How is carbon sequestration calculated?",
    questionAr: "كيف يتم حساب امتصاص الكربون؟",
    answer:
      "We use IPCC-compliant algorithms that consider your farm size, tree age, soil type, and irrigation method. The calculation is based on scientific data for date palm carbon sequestration rates.",
    answerAr:
      "نستخدم خوارزميات متوافقة مع IPCC التي تأخذ في الاعتبار حجم مزرعتك وعمر الأشجار ونوع التربة وطريقة الري. يعتمد الحساب على البيانات العلمية لمعدلات امتصاص الكربون في نخيل التمر.",
  },
  {
    id: "8",
    category: "Carbon Calculation",
    categoryAr: "حساب الكربون",
    question: "What factors affect my carbon sequestration rate?",
    questionAr: "ما العوامل التي تؤثر على معدل امتصاص الكربون لدي؟",
    answer:
      "Key factors include: farm size (hectares), number of trees, average tree age, soil type (sandy/loamy/clay), and irrigation method (drip/flood/rain-fed). Younger trees and better soil conditions increase sequestration rates.",
    answerAr:
      "العوامل الرئيسية تشمل: حجم المزرعة (هكتار)، عدد الأشجار، متوسط عمر الشجرة، نوع التربة (رملية/طينية/طينية)، وطريقة الري (تنقيط/فيضان/مطري). الأشجار الأصغر سنًا والظروف التربة الأفضل تزيد من معدلات الامتصاص.",
  },
  {
    id: "9",
    category: "Carbon Calculation",
    categoryAr: "حساب الكربون",
    question: "How often is my carbon data updated?",
    questionAr: "كم مرة يتم تحديث بيانات الكربون الخاصة بي؟",
    answer:
      "Your carbon metrics are updated monthly based on satellite data and farm parameters. You can view historical trends and projections in your Carbon Dashboard.",
    answerAr:
      "يتم تحديث مقاييس الكربون الخاصة بك شهريًا بناءً على بيانات الأقمار الصناعية ومعاملات المزرعة. يمكنك عرض الاتجاهات التاريخية والتوقعات في لوحة تحكم الكربون الخاصة بك.",
  },

  // Payments & Earnings
  {
    id: "10",
    category: "Payments & Earnings",
    categoryAr: "الدفع والأرباح",
    question: "How do I earn money from carbon credits?",
    questionAr: "كيف أكسب المال من رصيد الكربون؟",
    answer:
      "As your farm sequesters carbon, you earn carbon credits. These credits are valued at $15 per ton of CO₂. You can view your earnings in the Earnings Tracker and request payment monthly.",
    answerAr:
      "مع امتصاص مزرعتك للكربون، تكسب رصيد الكربون. يتم تقييم هذه الأرصدة بـ 15 دولار لكل طن من CO₂. يمكنك عرض أرباحك في متتبع الأرباح وطلب الدفع شهريًا.",
  },
  {
    id: "11",
    category: "Payments & Earnings",
    categoryAr: "الدفع والأرباح",
    question: "When do I receive my payments?",
    questionAr: "متى أتلقى مدفوعاتي؟",
    answer:
      "Payments are processed monthly on the 15th of each month. You can request payment through your Earnings Tracker. Payments are sent to your registered bank account or mobile wallet.",
    answerAr:
      "يتم معالجة الدفعات شهريًا في 15 من كل شهر. يمكنك طلب الدفع من خلال متتبع الأرباح الخاص بك. يتم إرسال الدفعات إلى حسابك المصرفي المسجل أو محفظتك المحمولة.",
  },
  {
    id: "12",
    category: "Payments & Earnings",
    categoryAr: "الدفع والأرباح",
    question: "What payment methods are available?",
    questionAr: "ما طرق الدفع المتاحة؟",
    answer:
      "We support bank transfers, mobile wallets (Apple Pay, Google Pay), and cryptocurrency payments. You can set your preferred payment method in your account settings.",
    answerAr:
      "ندعم التحويلات البنكية والمحافظ المحمولة (Apple Pay و Google Pay) ودفعات العملات المشفرة. يمكنك تعيين طريقة الدفع المفضلة لديك في إعدادات حسابك.",
  },

  // Technical Support
  {
    id: "13",
    category: "Technical Support",
    categoryAr: "الدعم الفني",
    question: "What should I do if I forget my password?",
    questionAr: "ماذا يجب أن أفعل إذا نسيت كلمة المرور الخاصة بي؟",
    answer:
      "Click 'Forgot Password' on the login page. Enter your email address and we'll send you a password reset link. Follow the instructions in the email to create a new password.",
    answerAr:
      "انقر على 'نسيت كلمة المرور' على صفحة تسجيل الدخول. أدخل عنوان بريدك الإلكتروني وسنرسل لك رابط إعادة تعيين كلمة المرور. اتبع التعليمات في البريد الإلكتروني لإنشاء كلمة مرور جديدة.",
  },
  {
    id: "14",
    category: "Technical Support",
    categoryAr: "الدعم الفني",
    question: "Is my farm data secure?",
    questionAr: "هل بيانات مزرعتي آمنة؟",
    answer:
      "Yes, we use industry-standard encryption (SSL/TLS) to protect your data. All communications are encrypted and your data is stored securely on our servers.",
    answerAr:
      "نعم، نستخدم التشفير القياسي في الصناعة (SSL/TLS) لحماية بيانات مزرعتك. جميع الاتصالات مشفرة وبيانات مزرعتك مخزنة بأمان على خوادمنا.",
  },
  {
    id: "15",
    category: "Technical Support",
    categoryAr: "الدعم الفني",
    question: "How can I contact customer support?",
    questionAr: "كيف يمكنني التواصل مع دعم العملاء؟",
    answer:
      "You can reach our support team via email at info@zr3i.com or call +20 100 605 5320. We're available Monday-Friday, 9 AM - 5 PM (Cairo Time).",
    answerAr:
      "يمكنك التواصل مع فريق الدعم لدينا عبر البريد الإلكتروني على info@zr3i.com أو اتصل على +20 100 605 5320. نحن متاحون من الاثنين إلى الجمعة، من 9 صباحًا إلى 5 مساءً (توقيت القاهرة).",
  },
];

function FAQAccordion({ item, isOpen, onToggle }: { item: FAQItem; isOpen: boolean; onToggle: () => void }) {
  const { language } = useLanguage();

  return (
    <div className="border border-slate-200 rounded-lg overflow-hidden hover:border-cyan-300 transition-colors">
      <button
        onClick={onToggle}
        className="w-full px-6 py-4 flex items-start justify-between gap-4 hover:bg-slate-50 transition-colors text-left"
      >
        <div className="flex-1">
          <h3 className="font-semibold text-slate-900">
            {language === "en" ? item.question : item.questionAr}
          </h3>
          <p className="text-xs text-cyan-600 font-medium mt-1">
            {language === "en" ? item.category : item.categoryAr}
          </p>
        </div>
        <ChevronDown
          className={`w-5 h-5 text-slate-400 flex-shrink-0 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isOpen && (
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200">
          <p className="text-slate-700 leading-relaxed">
            {language === "en" ? item.answer : item.answerAr}
          </p>
        </div>
      )}
    </div>
  );
}

export default function FAQ() {
  const { language } = useLanguage();
  const t = translations[language as keyof typeof translations];
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [openItems, setOpenItems] = useState<Set<string>>(new Set());

  const categories = [
    "All",
    ...Array.from(
      new Set(faqData.map((item) => (language === "en" ? item.category : item.categoryAr)))
    ),
  ];

  const filteredFAQ = useMemo(() => {
    return faqData.filter((item) => {
      const categoryMatch =
        selectedCategory === "All" ||
        (language === "en"
          ? item.category === selectedCategory
          : item.categoryAr === selectedCategory);

      const searchMatch =
        searchQuery === "" ||
        (language === "en"
          ? item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.answer.toLowerCase().includes(searchQuery.toLowerCase())
          : item.questionAr.includes(searchQuery) ||
            item.answerAr.includes(searchQuery));

      return categoryMatch && searchMatch;
    });
  }, [searchQuery, selectedCategory, language]);

  const toggleItem = (id: string) => {
    const newOpen = new Set(openItems);
    if (newOpen.has(id)) {
      newOpen.delete(id);
    } else {
      newOpen.add(id);
    }
    setOpenItems(newOpen);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <section className="bg-gradient-to-r from-cyan-600 to-blue-600 text-white py-12">
        <div className="container">
          <div className="flex items-center gap-3 mb-2">
            <HelpCircle className="w-8 h-8" />
            <h1 className="text-4xl font-bold">{t.title}</h1>
          </div>
          <p className="text-lg text-cyan-100">{t.subtitle}</p>
        </div>
      </section>

      {/* Main Content */}
      <section className="container py-12">
        {/* Search Bar */}
        <Card className="p-6 mb-8">
          <div className="relative">
            <Search className="absolute left-4 top-3.5 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder={t.searchPlaceholder}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
            />
          </div>
        </Card>

        {/* Category Filter */}
        <div className="mb-8 flex flex-wrap gap-2">
          {categories.map((category) => (
            <Button
              key={category}
              onClick={() => setSelectedCategory(category)}
              variant={selectedCategory === category ? "default" : "outline"}
              className={
                selectedCategory === category
                  ? "bg-cyan-600 hover:bg-cyan-700 text-white"
                  : "border-slate-300 text-slate-700 hover:border-cyan-300"
              }
            >
              {category === "All" ? t.allCategories : category}
            </Button>
          ))}
        </div>

        {/* FAQ Items */}
        {filteredFAQ.length === 0 ? (
          <Card className="p-12 text-center">
            <HelpCircle className="w-12 h-12 mx-auto mb-4 text-slate-300" />
            <p className="text-slate-600 text-lg">{t.noResults}</p>
          </Card>
        ) : (
          <div className="space-y-3 mb-12">
            {filteredFAQ.map((item) => (
              <FAQAccordion
                key={item.id}
                item={item}
                isOpen={openItems.has(item.id)}
                onToggle={() => toggleItem(item.id)}
              />
            ))}
          </div>
        )}

        {/* Support CTA */}
        <Card className="p-8 bg-gradient-to-r from-cyan-50 to-blue-50 border-cyan-200">
          <div className="text-center">
            <h3 className="text-xl font-bold text-slate-900 mb-2">
              {t.contactSupport}
            </h3>
            <p className="text-slate-600 mb-4">{t.contactEmail}</p>
            <Button className="bg-cyan-600 hover:bg-cyan-700 text-white">
              {language === "en" ? "Send Email" : "إرسال بريد إلكتروني"}
            </Button>
          </div>
        </Card>
      </section>
    </div>
  );
}
