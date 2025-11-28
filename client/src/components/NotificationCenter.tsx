import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  Bell,
  CheckCircle,
  AlertCircle,
  Info,
  Trash2,
  X,
} from "lucide-react";

export interface Notification {
  id: string;
  type: "success" | "warning" | "info" | "error";
  title: string;
  titleAr: string;
  message: string;
  messageAr: string;
  timestamp: Date;
  read: boolean;
}

interface NotificationCenterProps {
  onClose?: () => void;
  maxItems?: number;
}

const translations = {
  en: {
    notifications: "Notifications",
    noNotifications: "No notifications yet",
    markAllAsRead: "Mark all as read",
    clearAll: "Clear all",
    justNow: "Just now",
    minutesAgo: "minutes ago",
    hoursAgo: "hours ago",
    daysAgo: "days ago",
  },
  ar: {
    notifications: "الإشعارات",
    noNotifications: "لا توجد إشعارات حتى الآن",
    markAllAsRead: "وضع علامة على الكل كمقروء",
    clearAll: "مسح الكل",
    justNow: "للتو",
    minutesAgo: "دقائق مضت",
    hoursAgo: "ساعات مضت",
    daysAgo: "أيام مضت",
  },
};

// Mock notifications for demo
const mockNotifications: Notification[] = [
  {
    id: "1",
    type: "success",
    title: "Farm Boundary Saved",
    titleAr: "تم حفظ حدود المزرعة",
    message: "Your farm boundary has been successfully saved and verified.",
    messageAr: "تم حفظ حدود مزرعتك بنجاح والتحقق منها.",
    timestamp: new Date(Date.now() - 5 * 60000), // 5 minutes ago
    read: false,
  },
  {
    id: "2",
    type: "info",
    title: "Carbon Report Ready",
    titleAr: "تقرير الكربون جاهز",
    message: "Your monthly carbon report is now available for download.",
    messageAr: "تقرير الكربون الشهري الخاص بك متاح الآن للتحميل.",
    timestamp: new Date(Date.now() - 2 * 60 * 60000), // 2 hours ago
    read: false,
  },
  {
    id: "3",
    type: "warning",
    title: "Satellite Data Pending",
    titleAr: "بيانات الأقمار الصناعية قيد الانتظار",
    message: "New satellite imagery is being processed for your farm.",
    messageAr: "يتم معالجة صور الأقمار الصناعية الجديدة لمزرعتك.",
    timestamp: new Date(Date.now() - 24 * 60 * 60000), // 1 day ago
    read: true,
  },
  {
    id: "4",
    type: "success",
    title: "Payment Received",
    titleAr: "تم استلام الدفع",
    message: "Your carbon credit payment of $450 has been processed.",
    messageAr: "تم معالجة دفعة رصيد الكربون الخاصة بك بقيمة 450 دولار.",
    timestamp: new Date(Date.now() - 3 * 24 * 60 * 60000), // 3 days ago
    read: true,
  },
];

export function NotificationCenter({
  onClose,
  maxItems = 5,
}: NotificationCenterProps) {
  const { language } = useLanguage();
  const t = translations[language as keyof typeof translations];
  const [notifications, setNotifications] = useState<Notification[]>(
    mockNotifications
  );

  const unreadCount = notifications.filter((n) => !n.read).length;
  const displayedNotifications = notifications.slice(0, maxItems);

  const handleMarkAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const handleDelete = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const handleMarkAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const handleClearAll = () => {
    setNotifications([]);
  };

  const getIcon = (type: string) => {
    switch (type) {
      case "success":
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case "warning":
        return <AlertCircle className="w-5 h-5 text-yellow-600" />;
      case "error":
        return <AlertCircle className="w-5 h-5 text-red-600" />;
      case "info":
      default:
        return <Info className="w-5 h-5 text-blue-600" />;
    }
  };

  const getTimeAgo = (date: Date): string => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return t.justNow;
    if (diffMins < 60) return `${diffMins} ${t.minutesAgo}`;
    if (diffHours < 24) return `${diffHours} ${t.hoursAgo}`;
    return `${diffDays} ${t.daysAgo}`;
  };

  return (
    <div className="w-full max-w-md">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 px-4 py-3 bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-t-lg">
        <div className="flex items-center gap-2">
          <Bell className="w-5 h-5" />
          <h2 className="text-lg font-bold">{t.notifications}</h2>
          {unreadCount > 0 && (
            <span className="ml-2 px-2 py-1 bg-red-500 text-white text-xs rounded-full font-semibold">
              {unreadCount}
            </span>
          )}
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="hover:bg-white/20 p-1 rounded transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Notifications List */}
      <div className="max-h-96 overflow-y-auto">
        {notifications.length === 0 ? (
          <div className="p-8 text-center text-slate-500">
            <Bell className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p>{t.noNotifications}</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-200">
            {displayedNotifications.map((notification) => (
              <div
                key={notification.id}
                className={`p-4 hover:bg-slate-50 transition-colors ${
                  !notification.read ? "bg-blue-50" : ""
                }`}
              >
                <div className="flex gap-3">
                  {/* Icon */}
                  <div className="flex-shrink-0 mt-1">
                    {getIcon(notification.type)}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="font-semibold text-slate-900">
                          {language === "en"
                            ? notification.title
                            : notification.titleAr}
                        </h3>
                        <p className="text-sm text-slate-600 mt-1">
                          {language === "en"
                            ? notification.message
                            : notification.messageAr}
                        </p>
                      </div>
                      {!notification.read && (
                        <div className="flex-shrink-0 w-2 h-2 bg-blue-600 rounded-full mt-2" />
                      )}
                    </div>

                    <div className="flex items-center justify-between mt-2">
                      <span className="text-xs text-slate-500">
                        {getTimeAgo(notification.timestamp)}
                      </span>
                      <div className="flex gap-2">
                        {!notification.read && (
                          <button
                            onClick={() => handleMarkAsRead(notification.id)}
                            className="text-xs text-blue-600 hover:text-blue-700 font-medium"
                          >
                            {language === "en" ? "Mark as read" : "وضع علامة كمقروء"}
                          </button>
                        )}
                        <button
                          onClick={() => handleDelete(notification.id)}
                          className="text-slate-400 hover:text-red-600 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer Actions */}
      {notifications.length > 0 && (
        <div className="flex gap-2 p-3 bg-slate-50 border-t border-slate-200 rounded-b-lg">
          <Button
            variant="outline"
            size="sm"
            onClick={handleMarkAllAsRead}
            className="flex-1 text-xs"
            disabled={unreadCount === 0}
          >
            {t.markAllAsRead}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleClearAll}
            className="flex-1 text-xs text-red-600 hover:text-red-700"
          >
            {t.clearAll}
          </Button>
        </div>
      )}
    </div>
  );
}

export function NotificationBadge() {
  const [notifications, setNotifications] = useState<Notification[]>(
    mockNotifications
  );
  const [isOpen, setIsOpen] = useState(false);

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-slate-600 hover:text-slate-900 transition-colors"
      >
        <Bell className="w-6 h-6" />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 z-50 shadow-lg rounded-lg">
          <NotificationCenter
            onClose={() => setIsOpen(false)}
            maxItems={5}
          />
        </div>
      )}
    </div>
  );
}
