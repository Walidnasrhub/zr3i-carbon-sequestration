import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";
import { Loader2 } from "lucide-react";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
  rememberMe: z.boolean().optional(),
});

type LoginFormData = z.infer<typeof loginSchema>;

interface LoginFormProps {
  onSuccess?: () => void;
}

export function LoginForm({ onSuccess }: LoginFormProps) {
  const { language } = useLanguage();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  const translations = {
    en: {
      title: "Welcome Back",
      subtitle: "Log in to your Zr3i account",
      email: "Email Address",
      password: "Password",
      rememberMe: "Remember me",
      login: "Sign In",
      forgotPassword: "Forgot password?",
      noAccount: "Don't have an account?",
      register: "Create one here",
      errorMessage: "Invalid email or password",
      loginSuccess: "Logging in...",
    },
    ar: {
      title: "أهلا بعودتك",
      subtitle: "قم بتسجيل الدخول إلى حسابك في Zr3i",
      email: "عنوان البريد الإلكتروني",
      password: "كلمة المرور",
      rememberMe: "تذكرني",
      login: "دخول",
      forgotPassword: "هل نسيت كلمة المرور؟",
      noAccount: "ليس لديك حساب؟",
      register: "أنشئ واحدًا هنا",
      errorMessage: "البريد الإلكتروني أو كلمة المرور غير صحيحة",
      loginSuccess: "جاري تسجيل الدخول...",
    },
  };

  const t = translations[language as keyof typeof translations];

  const onSubmit = async (data: any) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: data.email,
          password: data.password,
          rememberMe: data.rememberMe,
        }),
      });

      if (!response.ok) {
        throw new Error(t.errorMessage);
      }

      const result = await response.json();
      if (result.success) {
        setTimeout(() => {
          onSuccess?.();
          window.location.href = "/dashboard";
        }, 1000);
      } else {
        setError(result.message || t.errorMessage);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : t.errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto p-8">
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
          <div className="flex justify-between items-center mb-2">
            <label className="block text-sm font-medium">{t.password}</label>
            <a href="/forgot-password" className="text-cyan-500 hover:underline text-sm">
              {t.forgotPassword}
            </a>
          </div>
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

        <div className="flex items-center">
          <input
            type="checkbox"
            id="rememberMe"
            {...register("rememberMe")}
            className="rounded border-gray-300"
          />
          <label htmlFor="rememberMe" className="ml-2 text-sm text-muted-foreground">
            {t.rememberMe}
          </label>
        </div>

        <Button
          type="submit"
          disabled={isLoading}
          className="w-full bg-cyan-500 hover:bg-cyan-600 text-white py-3 rounded-lg font-semibold"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {t.loginSuccess}
            </>
          ) : (
            t.login
          )}
        </Button>

        <p className="text-center text-sm text-muted-foreground">
          {t.noAccount}{" "}
          <a href="/register" className="text-cyan-500 hover:underline font-semibold">
            {t.register}
          </a>
        </p>
      </form>
    </Card>
  );
}
