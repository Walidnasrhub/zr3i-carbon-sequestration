import { useState } from "react";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";

interface Testimonial {
  id: number;
  name: string;
  role: string;
  image: string;
  content: string;
  rating: number;
  location: string;
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    name: "Ahmed Al-Rashid",
    role: "Date Palm Farmer",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop",
    content: "Zr3i transformed my farm into a profitable venture. I earned $5,000 in the first year alone!",
    rating: 5,
    location: "Riyadh, Saudi Arabia",
  },
  {
    id: 2,
    name: "Fatima Al-Dosari",
    role: "Agricultural Entrepreneur",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop",
    content: "The real-time monitoring system gives me complete visibility into my farm's performance.",
    rating: 5,
    location: "Dammam, Saudi Arabia",
  },
  {
    id: 3,
    name: "Hassan Al-Otaibi",
    role: "Sustainable Farmer",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop",
    content: "Supporting climate action while earning income - this is the future of farming.",
    rating: 5,
    location: "Al Kharj, Saudi Arabia",
  },
  {
    id: 4,
    name: "Layla Al-Mansouri",
    role: "Farm Manager",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop",
    content: "The transparency and blockchain verification give me confidence in every transaction.",
    rating: 5,
    location: "Dubai, UAE",
  },
];

export function TestimonialCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const { language } = useLanguage();

  const next = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prev = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const current = testimonials[currentIndex];

  return (
    <div className="w-full py-12">
      <div className="max-w-4xl mx-auto px-4">
        <Card className="p-8 bg-gradient-to-br from-slate-50 to-slate-100">
          <div className="flex flex-col md:flex-row gap-8 items-center">
            {/* Image */}
            <div className="flex-shrink-0">
              <img
                src={current.image}
                alt={current.name}
                className="w-32 h-32 rounded-full object-cover border-4 border-cyan-500 shadow-lg"
              />
            </div>

            {/* Content */}
            <div className="flex-1">
              {/* Stars */}
              <div className="flex gap-1 mb-4">
                {Array.from({ length: current.rating }).map((_, i) => (
                  <Star
                    key={i}
                    size={20}
                    className="fill-yellow-400 text-yellow-400"
                  />
                ))}
              </div>

              {/* Quote */}
              <p className="text-lg font-medium text-slate-900 mb-6 italic">
                "{current.content}"
              </p>

              {/* Author Info */}
              <div className="mb-4">
                <p className="font-bold text-slate-900">{current.name}</p>
                <p className="text-sm text-slate-600">{current.role}</p>
                <p className="text-sm text-slate-500">{current.location}</p>
              </div>

              {/* Indicators */}
              <div className="flex gap-2">
                {testimonials.map((_, index) => (
                  <div
                    key={index}
                    className={`h-2 rounded-full transition-all ${
                      index === currentIndex
                        ? "bg-cyan-500 w-8"
                        : "bg-slate-300 w-2"
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Navigation Buttons */}
          <div className="flex gap-4 justify-center mt-8">
            <Button
              onClick={prev}
              variant="outline"
              size="icon"
              className="rounded-full"
            >
              <ChevronLeft size={20} />
            </Button>
            <Button
              onClick={next}
              variant="outline"
              size="icon"
              className="rounded-full"
            >
              <ChevronRight size={20} />
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
