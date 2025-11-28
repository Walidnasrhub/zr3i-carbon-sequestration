import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useLanguage } from "@/contexts/LanguageContext";
import { Loader2, Upload, Save } from "lucide-react";

const profileSchema = z.object({
  firstName: z.string().min(2, "First name required"),
  lastName: z.string().min(2, "Last name required"),
  email: z.string().email("Invalid email"),
  phone: z.string().optional(),
  country: z.string().optional(),
  region: z.string().optional(),
  bio: z.string().optional(),
  language: z.enum(["en", "ar"]),
  notificationsEmail: z.boolean().optional(),
  notificationsSMS: z.boolean().optional(),
});

type ProfileFormData = z.infer<typeof profileSchema>;

export default function ProfileSettings() {
  const { language, setLanguage } = useLanguage();
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [profilePicture, setProfilePicture] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: "John",
      lastName: "Farmer",
      email: "farmer@example.com",
      phone: "+966501234567",
      country: "Saudi Arabia",
      region: "Riyadh",
      bio: "Date palm farmer with 15 years of experience",
      language: language as "en" | "ar",
      notificationsEmail: true,
      notificationsSMS: false,
    },
  });

  const selectedLanguage = watch("language");

  const translations = {
    en: {
      title: "Profile Settings",
      personalInfo: "Personal Information",
      firstName: "First Name",
      lastName: "Last Name",
      email: "Email Address",
      phone: "Phone Number",
      country: "Country",
      region: "Region/State",
      bio: "Bio",
      profilePicture: "Profile Picture",
      uploadPhoto: "Upload Photo",
      preferences: "Preferences",
      language: "Language",
      notifications: "Notifications",
      emailNotifications: "Email Notifications",
      smsNotifications: "SMS Notifications",
      saveChanges: "Save Changes",
      saving: "Saving...",
      successMessage: "Profile updated successfully!",
      security: "Security Settings",
      changePassword: "Change Password",
      twoFactor: "Two-Factor Authentication",
      enable: "Enable",
      disable: "Disable",
    },
    ar: {
      title: "إعدادات الملف الشخصي",
      personalInfo: "المعلومات الشخصية",
      firstName: "الاسم الأول",
      lastName: "اسم العائلة",
      email: "عنوان البريد الإلكتروني",
      phone: "رقم الهاتف",
      country: "الدولة",
      region: "المنطقة/الولاية",
      bio: "السيرة الذاتية",
      profilePicture: "صورة الملف الشخصي",
      uploadPhoto: "تحميل صورة",
      preferences: "التفضيلات",
      language: "اللغة",
      notifications: "الإخطارات",
      emailNotifications: "إخطارات البريد الإلكتروني",
      smsNotifications: "إخطارات الرسائل النصية",
      saveChanges: "حفظ التغييرات",
      saving: "جاري الحفظ...",
      successMessage: "تم تحديث الملف الشخصي بنجاح!",
      security: "إعدادات الأمان",
      changePassword: "تغيير كلمة المرور",
      twoFactor: "المصادقة الثنائية",
      enable: "تفعيل",
      disable: "تعطيل",
    },
  };

  const t = translations[language as keyof typeof translations];

  const handleProfilePictureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setProfilePicture(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (data: any) => {
    setIsLoading(true);
    setSuccess(false);

    try {
      // Update language context if changed
      if (data.language !== language) {
        setLanguage(data.language);
      }

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (error) {
      console.error("Error updating profile:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900">{t.title}</h1>
          <p className="text-slate-600 mt-2">
            {language === "en"
              ? "Manage your account settings and preferences"
              : "إدارة إعدادات حسابك والتفضيلات"}
          </p>
        </div>

        {success && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700">
            {t.successMessage}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Profile Picture Section */}
          <Card className="p-6">
            <h2 className="text-xl font-bold text-slate-900 mb-4">{t.profilePicture}</h2>
            <div className="flex items-center space-x-6">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center text-white text-3xl overflow-hidden">
                {profilePicture ? (
                  <img src={profilePicture} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  "JF"
                )}
              </div>
              <div>
                <label className="cursor-pointer">
                  <Button type="button" className="bg-cyan-500 hover:bg-cyan-600 text-white">
                    <Upload className="w-4 h-4 mr-2" />
                    {t.uploadPhoto}
                  </Button>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleProfilePictureChange}
                    className="hidden"
                  />
                </label>
                <p className="text-sm text-slate-500 mt-2">
                  {language === "en"
                    ? "JPG, PNG or GIF (max 5MB)"
                    : "JPG أو PNG أو GIF (الحد الأقصى 5 ميجابايت)"}
                </p>
              </div>
            </div>
          </Card>

          {/* Personal Information */}
          <Card className="p-6">
            <h2 className="text-xl font-bold text-slate-900 mb-4">{t.personalInfo}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">{t.firstName}</label>
                <Input {...register("firstName")} />
                {errors.firstName && (
                  <p className="text-red-500 text-sm mt-1">{errors.firstName.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">{t.lastName}</label>
                <Input {...register("lastName")} />
                {errors.lastName && (
                  <p className="text-red-500 text-sm mt-1">{errors.lastName.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">{t.email}</label>
                <Input type="email" {...register("email")} />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">{t.phone}</label>
                <Input {...register("phone")} />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">{t.country}</label>
                <Input {...register("country")} />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">{t.region}</label>
                <Input {...register("region")} />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-2">{t.bio}</label>
                <textarea
                  {...register("bio")}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </div>
            </div>
          </Card>

          {/* Preferences */}
          <Card className="p-6">
            <h2 className="text-xl font-bold text-slate-900 mb-4">{t.preferences}</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">{t.language}</label>
                <select
                  {...register("language")}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                >
                  <option value="en">English</option>
                  <option value="ar">العربية</option>
                </select>
              </div>
            </div>
          </Card>

          {/* Notifications */}
          <Card className="p-6">
            <h2 className="text-xl font-bold text-slate-900 mb-4">{t.notifications}</h2>
            <div className="space-y-4">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="emailNotifications"
                  {...register("notificationsEmail")}
                  className="rounded border-gray-300"
                />
                <label htmlFor="emailNotifications" className="ml-3 text-sm font-medium">
                  {t.emailNotifications}
                </label>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="smsNotifications"
                  {...register("notificationsSMS")}
                  className="rounded border-gray-300"
                />
                <label htmlFor="smsNotifications" className="ml-3 text-sm font-medium">
                  {t.smsNotifications}
                </label>
              </div>
            </div>
          </Card>

          {/* Security Settings */}
          <Card className="p-6">
            <h2 className="text-xl font-bold text-slate-900 mb-4">{t.security}</h2>
            <div className="space-y-3">
              <Button className="w-full border border-slate-300 text-slate-700 hover:bg-slate-50">
                {t.changePassword}
              </Button>
              <Button className="w-full border border-slate-300 text-slate-700 hover:bg-slate-50">
                {t.twoFactor}
              </Button>
            </div>
          </Card>

          {/* Save Button */}
          <Button
            type="submit"
            disabled={isLoading}
            className="w-full bg-cyan-500 hover:bg-cyan-600 text-white py-3 rounded-lg font-semibold"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {t.saving}
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                {t.saveChanges}
              </>
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}
