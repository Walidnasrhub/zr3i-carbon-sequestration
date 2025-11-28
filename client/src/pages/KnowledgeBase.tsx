import { useState, useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  BookOpen,
  Download,
  Clock,
  User,
  Search,
  FileText,
  Video,
  Zap,
} from "lucide-react";

interface Article {
  id: string;
  title: string;
  titleAr: string;
  description: string;
  descriptionAr: string;
  category: string;
  categoryAr: string;
  type: "article" | "guide" | "video" | "template";
  author: string;
  date: Date;
  readTime?: number;
  content: string;
  contentAr: string;
  downloadUrl?: string;
}

const translations = {
  en: {
    title: "Knowledge Base",
    subtitle: "Learn how to maximize your carbon sequestration potential",
    searchPlaceholder: "Search articles...",
    noResults: "No articles found",
    readMore: "Read More",
    download: "Download",
    readTime: "min read",
    publishedBy: "By",
    allCategories: "All Categories",
    article: "Article",
    guide: "Guide",
    video: "Video",
    template: "Template",
  },
  ar: {
    title: "قاعدة المعرفة",
    subtitle: "تعلم كيفية تعظيم إمكانية امتصاص الكربون لديك",
    searchPlaceholder: "البحث في المقالات...",
    noResults: "لم يتم العثور على مقالات",
    readMore: "اقرأ المزيد",
    download: "تحميل",
    readTime: "دقيقة قراءة",
    publishedBy: "بواسطة",
    allCategories: "جميع الفئات",
    article: "مقالة",
    guide: "دليل",
    video: "فيديو",
    template: "قالب",
  },
};

const articlesData: Article[] = [
  {
    id: "1",
    title: "Getting Started with Zr3i: A Complete Guide",
    titleAr: "البدء مع Zr3i: دليل شامل",
    description:
      "Learn the basics of registering, setting up your farm, and understanding carbon credits.",
    descriptionAr:
      "تعلم أساسيات التسجيل وإعداد مزرعتك وفهم رصيد الكربون.",
    category: "Getting Started",
    categoryAr: "البدء",
    type: "guide",
    author: "Zr3i Team",
    date: new Date("2024-01-15"),
    readTime: 8,
    content: "Complete guide content here...",
    contentAr: "محتوى الدليل الكامل هنا...",
    downloadUrl: "/guides/getting-started.pdf",
  },
  {
    id: "2",
    title: "Understanding Carbon Sequestration in Date Palms",
    titleAr: "فهم امتصاص الكربون في نخيل التمر",
    description:
      "Deep dive into how date palms sequester carbon and the science behind our calculations.",
    descriptionAr:
      "غوص عميق في كيفية امتصاص نخيل التمر للكربون والعلم وراء حساباتنا.",
    category: "Carbon Science",
    categoryAr: "علم الكربون",
    type: "article",
    author: "Dr. Ahmed Hassan",
    date: new Date("2024-01-10"),
    readTime: 12,
    content: "Article content about carbon sequestration...",
    contentAr: "محتوى المقالة حول امتصاص الكربون...",
  },
  {
    id: "3",
    title: "Optimizing Your Farm for Maximum Carbon Sequestration",
    titleAr: "تحسين مزرعتك لأقصى امتصاص للكربون",
    description:
      "Practical tips and strategies to increase your farm's carbon sequestration potential.",
    descriptionAr:
      "نصائح وإستراتيجيات عملية لزيادة إمكانية امتصاص الكربون في مزرعتك.",
    category: "Farm Management",
    categoryAr: "إدارة المزرعة",
    type: "guide",
    author: "Zr3i Experts",
    date: new Date("2024-01-08"),
    readTime: 10,
    content: "Farm optimization guide content...",
    contentAr: "محتوى دليل تحسين المزرعة...",
    downloadUrl: "/guides/farm-optimization.pdf",
  },
  {
    id: "4",
    title: "Using the Farm Mapping Tool Effectively",
    titleAr: "استخدام أداة رسم خريطة المزرعة بفعالية",
    description:
      "Step-by-step tutorial on how to map your farm boundaries and track changes over time.",
    descriptionAr:
      "برنامج تعليمي خطوة بخطوة حول كيفية رسم خريطة حدود مزرعتك وتتبع التغييرات بمرور الوقت.",
    category: "Tools & Features",
    categoryAr: "الأدوات والميزات",
    type: "video",
    author: "Zr3i Team",
    date: new Date("2024-01-05"),
    content: "Video tutorial content...",
    contentAr: "محتوى البرنامج التعليمي بالفيديو...",
  },
  {
    id: "5",
    title: "Monthly Report Template for Farmers",
    titleAr: "نموذج التقرير الشهري للمزارعين",
    description:
      "Downloadable template for tracking your farm's monthly carbon and earnings data.",
    descriptionAr:
      "نموذج قابل للتحميل لتتبع بيانات الكربون والأرباح الشهرية لمزرعتك.",
    category: "Templates",
    categoryAr: "القوالب",
    type: "template",
    author: "Zr3i Team",
    date: new Date("2024-01-01"),
    content: "Template content...",
    contentAr: "محتوى القالب...",
    downloadUrl: "/templates/monthly-report.xlsx",
  },
  {
    id: "6",
    title: "Understanding Your Carbon Dashboard",
    titleAr: "فهم لوحة تحكم الكربون الخاصة بك",
    description:
      "Comprehensive guide to interpreting carbon metrics and making data-driven decisions.",
    descriptionAr:
      "دليل شامل لتفسير مقاييس الكربون واتخاذ قرارات قائمة على البيانات.",
    category: "Carbon Science",
    categoryAr: "علم الكربون",
    type: "article",
    author: "Dr. Fatima Al-Rashid",
    date: new Date("2023-12-28"),
    readTime: 9,
    content: "Carbon dashboard guide content...",
    contentAr: "محتوى دليل لوحة تحكم الكربون...",
  },
  {
    id: "7",
    title: "Best Practices for Satellite Data Interpretation",
    titleAr: "أفضل الممارسات لتفسير بيانات الأقمار الصناعية",
    description:
      "Learn how to use NDVI data to monitor your farm's health and productivity.",
    descriptionAr:
      "تعلم كيفية استخدام بيانات NDVI لمراقبة صحة مزرعتك وإنتاجيتها.",
    category: "Advanced Topics",
    categoryAr: "مواضيع متقدمة",
    type: "guide",
    author: "Zr3i Experts",
    date: new Date("2023-12-20"),
    readTime: 11,
    content: "Satellite data interpretation guide...",
    contentAr: "دليل تفسير بيانات الأقمار الصناعية...",
    downloadUrl: "/guides/satellite-data.pdf",
  },
  {
    id: "8",
    title: "Compliance and Certification Guide",
    titleAr: "دليل الامتثال والشهادة",
    description:
      "Everything you need to know about carbon credit certification and compliance requirements.",
    descriptionAr:
      "كل ما تحتاج إلى معرفته حول شهادة رصيد الكربون ومتطلبات الامتثال.",
    category: "Compliance",
    categoryAr: "الامتثال",
    type: "guide",
    author: "Zr3i Legal Team",
    date: new Date("2023-12-15"),
    readTime: 15,
    content: "Compliance guide content...",
    contentAr: "محتوى دليل الامتثال...",
    downloadUrl: "/guides/compliance.pdf",
  },
];

function ArticleCard({ article }: { article: Article }) {
  const { language } = useLanguage();
  const t = translations[language as keyof typeof translations];

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "video":
        return <Video className="w-4 h-4" />;
      case "template":
        return <Download className="w-4 h-4" />;
      case "guide":
        return <BookOpen className="w-4 h-4" />;
      default:
        return <FileText className="w-4 h-4" />;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "video":
        return t.video;
      case "template":
        return t.template;
      case "guide":
        return t.guide;
      default:
        return t.article;
    }
  };

  return (
    <Card className="p-6 hover:shadow-lg transition-shadow h-full flex flex-col">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1 px-3 py-1 bg-cyan-100 text-cyan-700 text-xs font-semibold rounded-full">
            {getTypeIcon(article.type)}
            {getTypeLabel(article.type)}
          </span>
        </div>
        <span className="text-xs text-slate-500 font-medium">
          {language === "en" ? article.category : article.categoryAr}
        </span>
      </div>

      <h3 className="text-lg font-bold text-slate-900 mb-2 flex-1">
        {language === "en" ? article.title : article.titleAr}
      </h3>

      <p className="text-slate-600 text-sm mb-4 flex-1">
        {language === "en" ? article.description : article.descriptionAr}
      </p>

      <div className="flex items-center gap-4 text-xs text-slate-500 mb-4 pt-4 border-t border-slate-200">
        <div className="flex items-center gap-1">
          <User className="w-4 h-4" />
          <span>{article.author}</span>
        </div>
        {article.readTime && (
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            <span>
              {article.readTime} {t.readTime}
            </span>
          </div>
        )}
      </div>

      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          className="flex-1 border-cyan-600 text-cyan-600 hover:bg-cyan-50"
        >
          {t.readMore}
        </Button>
        {article.downloadUrl && (
          <Button
            size="sm"
            className="bg-green-600 hover:bg-green-700 text-white flex items-center gap-1"
          >
            <Download className="w-4 h-4" />
            {t.download}
          </Button>
        )}
      </div>
    </Card>
  );
}

export default function KnowledgeBase() {
  const { language } = useLanguage();
  const t = translations[language as keyof typeof translations];
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const categories = [
    "All",
    ...Array.from(
      new Set(articlesData.map((a) => (language === "en" ? a.category : a.categoryAr)))
    ),
  ];

  const filteredArticles = useMemo(() => {
    return articlesData.filter((article) => {
      const categoryMatch =
        selectedCategory === "All" ||
        (language === "en"
          ? article.category === selectedCategory
          : article.categoryAr === selectedCategory);

      const searchMatch =
        searchQuery === "" ||
        (language === "en"
          ? article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            article.description.toLowerCase().includes(searchQuery.toLowerCase())
          : article.titleAr.includes(searchQuery) ||
            article.descriptionAr.includes(searchQuery));

      return categoryMatch && searchMatch;
    });
  }, [searchQuery, selectedCategory, language]);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <section className="bg-gradient-to-r from-cyan-600 to-blue-600 text-white py-12">
        <div className="container">
          <div className="flex items-center gap-3 mb-2">
            <BookOpen className="w-8 h-8" />
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

        {/* Articles Grid */}
        {filteredArticles.length === 0 ? (
          <Card className="p-12 text-center">
            <BookOpen className="w-12 h-12 mx-auto mb-4 text-slate-300" />
            <p className="text-slate-600 text-lg">{t.noResults}</p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredArticles.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        )}

        {/* Featured Section */}
        <div className="mt-16 pt-12 border-t border-slate-200">
          <h2 className="text-3xl font-bold text-slate-900 mb-8">
            {language === "en" ? "Featured Resources" : "الموارد المميزة"}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Quick Start */}
            <Card className="p-8 bg-gradient-to-br from-cyan-50 to-blue-50 border-cyan-200">
              <div className="flex items-center gap-3 mb-4">
                <Zap className="w-6 h-6 text-cyan-600" />
                <h3 className="text-xl font-bold text-slate-900">
                  {language === "en" ? "Quick Start" : "البدء السريع"}
                </h3>
              </div>
              <p className="text-slate-700 mb-4">
                {language === "en"
                  ? "Get up and running in 5 minutes with our quick start guide."
                  : "ابدأ في 5 دقائق مع دليلنا السريع."}
              </p>
              <Button className="bg-cyan-600 hover:bg-cyan-700 text-white">
                {language === "en" ? "Start Now" : "ابدأ الآن"}
              </Button>
            </Card>

            {/* Video Tutorials */}
            <Card className="p-8 bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
              <div className="flex items-center gap-3 mb-4">
                <Video className="w-6 h-6 text-purple-600" />
                <h3 className="text-xl font-bold text-slate-900">
                  {language === "en" ? "Video Tutorials" : "البرامج التعليمية بالفيديو"}
                </h3>
              </div>
              <p className="text-slate-700 mb-4">
                {language === "en"
                  ? "Watch step-by-step videos to learn all features."
                  : "شاهد مقاطع فيديو خطوة بخطوة لتعلم جميع الميزات."}
              </p>
              <Button className="bg-purple-600 hover:bg-purple-700 text-white">
                {language === "en" ? "Watch Videos" : "شاهد الفيديوهات"}
              </Button>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
