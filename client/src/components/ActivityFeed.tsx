import { useLanguage } from "@/contexts/LanguageContext";
import { Card } from "@/components/ui/card";
import { CheckCircle, AlertCircle, Info, TrendingUp } from "lucide-react";

interface Activity {
  id: string;
  type: "success" | "warning" | "info" | "milestone";
  title: string;
  description: string;
  timestamp: Date;
  icon?: React.ReactNode;
}

interface ActivityFeedProps {
  activities?: Activity[];
  maxItems?: number;
}

export function ActivityFeed({ activities, maxItems = 5 }: ActivityFeedProps) {
  const { language } = useLanguage();

  const defaultActivities: Activity[] = [
    {
      id: "1",
      type: "success",
      title: language === "en" ? "Farm Data Updated" : "تم تحديث بيانات المزرعة",
      description:
        language === "en"
          ? "Your farm data has been successfully updated"
          : "تم تحديث بيانات مزرعتك بنجاح",
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
    },
    {
      id: "2",
      type: "milestone",
      title: language === "en" ? "Carbon Credits Verified" : "تم التحقق من أرصدة الكربون",
      description:
        language === "en"
          ? "500 carbon credits have been verified and added to your account"
          : "تم التحقق من 500 رصيد كربون وإضافتها إلى حسابك",
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
    },
    {
      id: "3",
      type: "info",
      title: language === "en" ? "Satellite Data Available" : "بيانات الأقمار الصناعية متاحة",
      description:
        language === "en"
          ? "New satellite imagery for your farm is now available"
          : "صور أقمار صناعية جديدة لمزرعتك متاحة الآن",
      timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    },
    {
      id: "4",
      type: "success",
      title: language === "en" ? "Payment Processed" : "تمت معالجة الدفع",
      description:
        language === "en"
          ? "$1,250 has been credited to your account"
          : "تم إيداع 1,250 دولار في حسابك",
      timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    },
    {
      id: "5",
      type: "warning",
      title: language === "en" ? "Soil Health Alert" : "تنبيه صحة التربة",
      description:
        language === "en"
          ? "Soil moisture levels are below optimal range"
          : "مستويات رطوبة التربة أقل من النطاق الأمثل",
      timestamp: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
    },
  ];

  const displayActivities = activities || defaultActivities;
  const limitedActivities = displayActivities.slice(0, maxItems);

  const getIcon = (type: Activity["type"]) => {
    switch (type) {
      case "success":
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case "warning":
        return <AlertCircle className="w-5 h-5 text-yellow-500" />;
      case "milestone":
        return <TrendingUp className="w-5 h-5 text-cyan-500" />;
      case "info":
      default:
        return <Info className="w-5 h-5 text-blue-500" />;
    }
  };

  const getBackgroundColor = (type: Activity["type"]) => {
    switch (type) {
      case "success":
        return "bg-green-50 border-l-4 border-green-500";
      case "warning":
        return "bg-yellow-50 border-l-4 border-yellow-500";
      case "milestone":
        return "bg-cyan-50 border-l-4 border-cyan-500";
      case "info":
      default:
        return "bg-blue-50 border-l-4 border-blue-500";
    }
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) {
      return language === "en" ? `${diffMins}m ago` : `منذ ${diffMins} دقيقة`;
    } else if (diffHours < 24) {
      return language === "en" ? `${diffHours}h ago` : `منذ ${diffHours} ساعة`;
    } else if (diffDays < 7) {
      return language === "en" ? `${diffDays}d ago` : `منذ ${diffDays} يوم`;
    } else {
      return date.toLocaleDateString(language === "en" ? "en-US" : "ar-SA");
    }
  };

  return (
    <Card className="p-6 bg-white">
      <h2 className="text-xl font-bold text-slate-900 mb-4">
        {language === "en" ? "Recent Activity" : "النشاط الأخير"}
      </h2>

      <div className="space-y-3">
        {limitedActivities.map((activity) => (
          <div key={activity.id} className={`p-4 rounded-lg ${getBackgroundColor(activity.type)}`}>
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 mt-0.5">{getIcon(activity.type)}</div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-slate-900">{activity.title}</p>
                <p className="text-sm text-slate-600 mt-1">{activity.description}</p>
                <p className="text-xs text-slate-500 mt-2">{formatTime(activity.timestamp)}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {displayActivities.length > maxItems && (
        <button className="w-full mt-4 text-cyan-600 hover:text-cyan-700 font-medium text-sm">
          {language === "en" ? "View All Activity" : "عرض جميع الأنشطة"}
        </button>
      )}
    </Card>
  );
}
