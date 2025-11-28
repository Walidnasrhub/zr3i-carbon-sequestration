import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";
import { Loader2 } from "lucide-react";

const registrationSchema = z.object({
  email: z.string().email("Invalid email address"),
  firstName: z.string().min(2, "First name required"),
  lastName: z.string().min(2, "Last name required"),
  phone: z.string().optional(),
  country: z.string().min(2, "Country required"),
  region: z.string().optional(),
  farmName: z.string().optional(),
  farmSize: z.coerce.number().optional(),
  primaryCrop: z.string().optional(),
  yearsOfFarming: z.coerce.number().optional(),
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type RegistrationFormData = z.infer<typeof registrationSchema>;

interface RegistrationFormProps {
  onSuccess?: () => void;
}

export function RegistrationForm({ onSuccess }: RegistrationFormProps) {
  const { language } = useLanguage();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(registrationSchema),
    defaultValues: {
      email: "",
      firstName: "",
      lastName: "",
      country: "",
      password: "",
      confirmPassword: "",
    },
  });

  const translations = {
    en: {
      title: "Create Your Farmer Account",
      subtitle: "Join Zr3i and start tracking your carbon sequestration",
      email: "Email Address",
      firstName: "First Name",
      lastName: "Last Name",
      phone: "Phone Number",
      country: "Country",
      region: "Region/State",
      farmName: "Farm Name",
      farmSize: "Farm Size (Hectares)",
      primaryCrop: "Primary Crop",
      yearsOfFarming: "Years of Farming Experience",
      password: "Password",
      confirmPassword: "Confirm Password",
      register: "Create Account",
      alreadyHaveAccount: "Already have an account?",
      login: "Log in here",
      successMessage: "Account created successfully! Redirecting...",
      errorMessage: "Failed to create account. Please try again.",
    },
    ar: {
      title: "إنشاء حسابك كمزارع",
      subtitle: "انضم إلى Zr3i وابدأ في تتبع عزل الكربون الخاص بك",
      email: "عنوان البريد الإلكتروني",
      firstName: "الاسم الأول",
      lastName: "اسم العائلة",
      phone: "رقم الهاتف",
      country: "الدولة",
      region: "المنطقة/الولاية",
      farmName: "اسم المزرعة",
      farmSize: "حجم المزرعة (هكتار)",
      primaryCrop: "المحصول الرئيسي",
      yearsOfFarming: "سنوات خبرة الزراعة",
      password: "كلمة المرور",
      confirmPassword: "تأكيد كلمة المرور",
      register: "إنشاء حساب",
      alreadyHaveAccount: "هل لديك حساب بالفعل؟",
      login: "سجل الدخول هنا",
      successMessage: "تم إنشاء الحساب بنجاح! جاري إعادة التوجيه...",
      errorMessage: "فشل إنشاء الحساب. يرجى المحاولة مرة أخرى.",
    },
  };

  const t = translations[language as keyof typeof translations];

  const onSubmit = async (data: any) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(t.errorMessage);
      }

      setSuccess(true);
      reset();
      setTimeout(() => {
        onSuccess?.();
        window.location.href = "/dashboard";
      }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : t.errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <Card className="w-full max-w-md mx-auto p-6 text-center">
        <p className="text-green-600 font-semibold">{t.successMessage}</p>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-2xl mx-auto p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">{t.title}</h1>
        <p className="text-muted-foreground">{t.subtitle}</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            {error}
          </div>
        )}

        {/* Contact Information Section */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-foreground">
            {language === "en" ? "Contact Information" : "معلومات الاتصال"}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">{t.email}</label>
              <Input
                type="email"
                placeholder="farmer@example.com"
                {...register("email")}
                className={errors.email ? "border-red-500" : ""}
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">{t.phone}</label>
              <Input
                type="tel"
                placeholder="+1 (555) 000-0000"
                {...register("phone")}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">{t.firstName}</label>
              <Input
                type="text"
                placeholder="John"
                {...register("firstName")}
                className={errors.firstName ? "border-red-500" : ""}
              />
              {errors.firstName && (
                <p className="text-red-500 text-sm mt-1">{errors.firstName.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">{t.lastName}</label>
              <Input
                type="text"
                placeholder="Doe"
                {...register("lastName")}
                className={errors.lastName ? "border-red-500" : ""}
              />
              {errors.lastName && (
                <p className="text-red-500 text-sm mt-1">{errors.lastName.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">{t.country}</label>
              <Input
                type="text"
                placeholder="Saudi Arabia"
                {...register("country")}
                className={errors.country ? "border-red-500" : ""}
              />
              {errors.country && (
                <p className="text-red-500 text-sm mt-1">{errors.country.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">{t.region}</label>
              <Input
                type="text"
                placeholder="Riyadh"
                {...register("region")}
              />
            </div>
          </div>
        </div>

        {/* Farm Information Section */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-foreground">
            {language === "en" ? "Farm Information" : "معلومات المزرعة"}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">{t.farmName}</label>
              <Input
                type="text"
                placeholder="My Date Palm Farm"
                {...register("farmName")}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">{t.farmSize}</label>
              <Input
                type="number"
                placeholder="50"
                {...register("farmSize")}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">{t.primaryCrop}</label>
              <Input
                type="text"
                placeholder="Date Palms"
                {...register("primaryCrop")}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">{t.yearsOfFarming}</label>
              <Input
                type="number"
                placeholder="10"
                {...register("yearsOfFarming")}
              />
            </div>
          </div>
        </div>

        {/* Security Section */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-foreground">
            {language === "en" ? "Security" : "الأمان"}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">{t.password}</label>
              <Input
                type="password"
                placeholder="••••••••"
                {...register("password")}
                className={errors.password ? "border-red-500" : ""}
              />
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">{t.confirmPassword}</label>
              <Input
                type="password"
                placeholder="••••••••"
                {...register("confirmPassword")}
                className={errors.confirmPassword ? "border-red-500" : ""}
              />
              {errors.confirmPassword && (
                <p className="text-red-500 text-sm mt-1">{errors.confirmPassword.message}</p>
              )}
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          disabled={isLoading}
          className="w-full bg-cyan-500 hover:bg-cyan-600 text-white py-3 rounded-lg font-semibold"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {language === "en" ? "Creating Account..." : "جاري إنشاء الحساب..."}
            </>
          ) : (
            t.register
          )}
        </Button>

        {/* Login Link */}
        <p className="text-center text-sm text-muted-foreground">
          {t.alreadyHaveAccount}{" "}
          <a href="/login" className="text-cyan-500 hover:underline font-semibold">
            {t.login}
          </a>
        </p>
      </form>
    </Card>
  );
}
