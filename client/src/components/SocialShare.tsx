import { Share2, Facebook, Linkedin, Twitter, Copy, Check } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";

interface SocialShareProps {
  title: string;
  description: string;
  url?: string;
  carbonCredits?: number;
  earnings?: number;
}

export function SocialShare({
  title,
  description,
  url = typeof window !== "undefined" ? window.location.href : "",
  carbonCredits = 0,
  earnings = 0,
}: SocialShareProps) {
  const [copied, setCopied] = useState(false);
  const { language } = useLanguage();

  const shareText = `${title} - ${description} 🌱 ${carbonCredits} tons of CO2 sequestered! Join Zr3i and earn sustainable income while fighting climate change.`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleFacebookShare = () => {
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
    window.open(facebookUrl, "_blank", "width=600,height=400");
  };

  const handleLinkedInShare = () => {
    const linkedInUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
    window.open(linkedInUrl, "_blank", "width=600,height=400");
  };

  const handleTwitterShare = () => {
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(url)}`;
    window.open(twitterUrl, "_blank", "width=600,height=400");
  };

  return (
    <div className="w-full bg-white rounded-lg border border-slate-200 p-6">
      <div className="flex items-center gap-2 mb-4">
        <Share2 size={20} className="text-cyan-500" />
        <h3 className="text-lg font-bold text-slate-900">
          {language === "en" ? "Share Your Achievement" : "شارك إنجازك"}
        </h3>
      </div>

      {earnings > 0 && (
        <p className="text-sm text-slate-600 mb-4">
          {language === "en"
            ? `You've earned $${earnings} and sequestered ${carbonCredits} tons of CO2. Share your success!`
            : `لقد حققت ${earnings} دولار وعزلت ${carbonCredits} طن من ثاني أكسيد الكربون. شارك نجاحك!`}
        </p>
      )}

      <div className="flex flex-wrap gap-3">
        <Button
          onClick={handleFacebookShare}
          className="bg-blue-600 hover:bg-blue-700 text-white flex gap-2"
        >
          <Facebook size={18} />
          {language === "en" ? "Facebook" : "فيسبوك"}
        </Button>

        <Button
          onClick={handleLinkedInShare}
          className="bg-blue-700 hover:bg-blue-800 text-white flex gap-2"
        >
          <Linkedin size={18} />
          {language === "en" ? "LinkedIn" : "لينكدإن"}
        </Button>

        <Button
          onClick={handleTwitterShare}
          className="bg-blue-400 hover:bg-blue-500 text-white flex gap-2"
        >
          <Twitter size={18} />
          {language === "en" ? "Twitter" : "تويتر"}
        </Button>

        <Button
          onClick={handleCopyLink}
          variant="outline"
          className="flex gap-2"
        >
          {copied ? (
            <>
              <Check size={18} className="text-green-500" />
              {language === "en" ? "Copied!" : "تم النسخ!"}
            </>
          ) : (
            <>
              <Copy size={18} />
              {language === "en" ? "Copy Link" : "نسخ الرابط"}
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
