import { Link } from "wouter";
import { LanguageToggle } from "./LanguageToggle";
import { useLanguage } from "@/contexts/LanguageContext";

const translations = {
  en: {
    home: "Home",
    farmers: "For Farmers",
    investors: "For Investors",
    partners: "For Partners",
    enterprise: "Enterprise",
    about: "About",
    contact: "Contact",
  },
  ar: {
    home: "الرئيسية",
    farmers: "للمزارعين",
    investors: "للمستثمرين",
    partners: "للشركاء",
    enterprise: "المؤسسات",
    about: "عننا",
    contact: "اتصل بنا",
  },
};

export function Navigation() {
  const { language } = useLanguage();
  const t = translations[language as keyof typeof translations];

  const navItems = [
    { label: t.home, href: "/" },
    { label: t.farmers, href: "/farmers" },
    { label: t.investors, href: "/investors" },
    { label: t.partners, href: "/partners" },
    { label: t.enterprise, href: "/enterprise" },
    { label: t.about, href: "/about" },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-border shadow-sm">
      <div className="container flex items-center justify-between h-16">
        <Link href="/" className="flex items-center gap-2 font-bold text-xl">
          <div className="w-8 h-8 bg-cyan-600 rounded-full flex items-center justify-center text-white">
            Z
          </div>
          <span>Zr3i</span>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm font-medium hover:text-cyan-600 transition-colors"
            >
              {item.label}
            </Link>
          ))}
        </div>

        <LanguageToggle />
      </div>
    </nav>
  );
}
