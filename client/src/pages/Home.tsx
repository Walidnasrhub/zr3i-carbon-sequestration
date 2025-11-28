import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowRight, Leaf, TrendingUp, Users, Globe, Zap, Phone, Mail } from "lucide-react";
import { useState, useEffect } from "react";

/**
 * Design Philosophy: Data-Driven Futurism with Gradient Accents
 * - Color Palette: Deep Navy (#263B5E), Electric Cyan (#A6E3FF), Lime Green (#C0FF00)
 * - Typography: Syne (bold, geometric) for headlines, Inter for body
 * - Layout: Strict 12-column grid with overlapping cards and layered sections
 * - Interactions: Smooth transitions, hover effects, animated counters
 */

interface StatCounterProps {
  value: number;
  label: string;
  suffix?: string;
}

function StatCounter({ value, label, suffix = "" }: StatCounterProps) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const duration = 2000;
    const steps = 60;
    const increment = value / steps;
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= value) {
        setCount(value);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [value]);

  return (
    <div className="text-center p-6 rounded-lg bg-gradient-to-br from-cyan-50 to-blue-50 border border-cyan-200 hover:shadow-lg transition-shadow duration-300">
      <div className="text-4xl font-bold text-cyan-600 mb-2">
        {count.toLocaleString()}{suffix}
      </div>
      <p className="text-sm font-medium text-navy-700">{label}</p>
    </div>
  );
}

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

function FeatureCard({ icon, title, description }: FeatureCardProps) {
  return (
    <Card className="p-6 hover:shadow-xl transition-all duration-300 hover:scale-105 border-cyan-200 hover:border-cyan-400 group">
      <div className="mb-4 text-cyan-600 group-hover:text-lime-500 transition-colors duration-300">
        {icon}
      </div>
      <h3 className="font-bold text-lg mb-2 text-navy-900">{title}</h3>
      <p className="text-sm text-navy-700">{description}</p>
    </Card>
  );
}

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-blue-50">
      {/* Navigation Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-cyan-200">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-500 to-lime-500 flex items-center justify-center">
              <Leaf className="w-6 h-6 text-navy-900" />
            </div>
            <span className="font-bold text-xl text-navy-900">Zr3i</span>
          </div>
          <nav className="hidden md:flex gap-8 text-sm font-medium">
            <a href="#features" className="text-navy-700 hover:text-cyan-600 transition-colors">Features</a>
            <a href="#impact" className="text-navy-700 hover:text-cyan-600 transition-colors">Impact</a>
            <a href="#contact" className="text-navy-700 hover:text-cyan-600 transition-colors">Contact</a>
          </nav>
        </div>
      </header>

      {/* Hero Section with Gradient Overlay */}
      <section className="relative overflow-hidden pt-20 pb-32">
        {/* Gradient background shapes */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-cyan-400/20 to-transparent rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-lime-400/20 to-transparent rounded-full blur-3xl"></div>
        </div>

        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Hero Content */}
            <div className="space-y-6">
              <div className="inline-block">
                <span className="px-4 py-2 rounded-full bg-cyan-100 text-cyan-700 text-xs font-bold tracking-wide">
                  CARBON SEQUESTRATION INNOVATION
                </span>
              </div>
              <h1 className="text-5xl lg:text-6xl font-bold text-navy-900 leading-tight">
                Transform Date Palms Into <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 to-lime-500">Carbon Credits</span>
              </h1>
              <p className="text-lg text-navy-700 leading-relaxed max-w-lg">
                Zr3i harnesses cutting-edge agritech to measure, verify, and monetize carbon sequestration from date palm cultivation. Empower smallholder farmers while combating climate change.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Button className="bg-gradient-to-r from-cyan-600 to-cyan-500 hover:from-cyan-700 hover:to-cyan-600 text-white px-8 py-6 text-base font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2">
                  Get Started <ArrowRight className="w-5 h-5" />
                </Button>
                <Button variant="outline" className="border-cyan-400 text-cyan-600 hover:bg-cyan-50 px-8 py-6 text-base font-semibold rounded-lg">
                  Learn More
                </Button>
              </div>
            </div>

            {/* Hero Image */}
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/30 to-lime-400/30 rounded-2xl blur-2xl"></div>
              <img
                src="/hero-carbon-flow.png"
                alt="Carbon Sequestration Process"
                className="relative rounded-2xl shadow-2xl w-full h-auto"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white relative">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full max-w-4xl bg-gradient-to-r from-cyan-500/5 via-transparent to-lime-500/5 rounded-full blur-3xl"></div>
        </div>

        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-navy-900 mb-4">
              How Zr3i Works
            </h2>
            <p className="text-lg text-navy-700 max-w-2xl mx-auto">
              Our platform combines satellite imagery, AI analytics, and blockchain verification to create transparent, tradeable carbon credits.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <FeatureCard
              icon={<Leaf className="w-8 h-8" />}
              title="Satellite Monitoring"
              description="Real-time NDVI analysis tracks date palm health and growth patterns with precision agriculture technology."
            />
            <FeatureCard
              icon={<TrendingUp className="w-8 h-8" />}
              title="Carbon Quantification"
              description="Advanced algorithms calculate CO₂ sequestration rates based on tree age, biomass, and soil carbon content."
            />
            <FeatureCard
              icon={<Zap className="w-8 h-8" />}
              title="Instant Monetization"
              description="Convert verified carbon offsets into tradeable credits on our blockchain-verified marketplace."
            />
            <FeatureCard
              icon={<Users className="w-8 h-8" />}
              title="Farmer Empowerment"
              description="Direct payments to smallholder farmers for carbon sequestration, creating sustainable income streams."
            />
            <FeatureCard
              icon={<Globe className="w-8 h-8" />}
              title="Global Market Access"
              description="Connect with international carbon credit buyers and environmental organizations worldwide."
            />
            <FeatureCard
              icon={<Leaf className="w-8 h-8" />}
              title="Sustainability Verified"
              description="Third-party audits and blockchain transparency ensure all credits meet international standards."
            />
          </div>
        </div>
      </section>

      {/* Impact Metrics Section */}
      <section id="impact" className="py-20 bg-gradient-to-br from-navy-900 via-navy-800 to-navy-900 relative overflow-hidden">
        {/* Decorative gradient shapes */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-lime-500/10 rounded-full blur-3xl"></div>
        </div>

        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">
              Our Impact
            </h2>
            <p className="text-lg text-cyan-200 max-w-2xl mx-auto">
              Zr3i is making measurable progress in carbon sequestration and farmer empowerment across the MENA region.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <StatCounter value={50000} label="Date Palms Monitored" />
            <StatCounter value={12500} label="Tons CO₂ Sequestered" suffix="+" />
            <StatCounter value={2500} label="Farmers Empowered" />
            <StatCounter value={450000} label="Carbon Credits Generated" suffix="+" />
          </div>

          {/* Impact Image */}
          <div className="relative mt-12">
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/20 to-lime-500/20 rounded-2xl blur-2xl"></div>
            <img
              src="/date-palm-impact.png"
              alt="Date Palm Impact Metrics"
              className="relative rounded-2xl shadow-2xl w-full h-auto max-h-96 object-cover"
            />
          </div>
        </div>
      </section>

      {/* Technology Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Image */}
            <div className="relative order-2 lg:order-1">
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/30 to-lime-400/30 rounded-2xl blur-2xl"></div>
              <img
                src="/farmers-technology.png"
                alt="Farmer with Technology"
                className="relative rounded-2xl shadow-2xl w-full h-auto"
              />
            </div>

            {/* Content */}
            <div className="space-y-6 order-1 lg:order-2">
              <h2 className="text-4xl font-bold text-navy-900">
                Bridging Agriculture & Technology
              </h2>
              <p className="text-lg text-navy-700 leading-relaxed">
                Zr3i combines traditional agricultural knowledge with cutting-edge technology to create a sustainable future. Our platform empowers farmers with real-time data insights while connecting them to global carbon markets.
              </p>
              <ul className="space-y-4">
                {[
                  "Precision agriculture with satellite monitoring",
                  "AI-powered carbon sequestration modeling",
                  "Blockchain-verified carbon credits",
                  "Direct farmer payments and transparency",
                  "Support for sustainable livelihoods"
                ].map((item, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-cyan-500 to-lime-500 flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="text-white text-sm font-bold">✓</span>
                    </div>
                    <span className="text-navy-700 font-medium">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Abstract Data Visualization Section */}
      <section className="py-20 bg-gradient-to-b from-blue-50 to-white">
        <div className="container mx-auto px-4">
          <div className="relative rounded-2xl overflow-hidden shadow-2xl">
            <img
              src="/carbon-metrics-abstract.png"
              alt="Carbon Metrics Visualization"
              className="w-full h-auto"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-navy-900/50 to-transparent flex items-end">
              <div className="p-8 text-white">
                <h3 className="text-3xl font-bold mb-2">Real-Time Carbon Tracking</h3>
                <p className="text-cyan-200 max-w-md">Monitor carbon sequestration metrics in real-time with our advanced data visualization dashboard.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="bg-gradient-to-r from-cyan-600 to-lime-500 rounded-2xl p-12 text-center text-white shadow-2xl">
            <h2 className="text-4xl font-bold mb-4">Ready to Make an Impact?</h2>
            <p className="text-lg mb-8 max-w-2xl mx-auto opacity-95">
              Join thousands of farmers and organizations transforming date palm cultivation into measurable climate action.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button className="bg-white text-cyan-600 hover:bg-gray-100 px-8 py-6 text-base font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300">
                Start Your Journey
              </Button>
              <Button variant="outline" className="border-white text-white hover:bg-white/10 px-8 py-6 text-base font-semibold rounded-lg">
                Schedule Demo
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-gradient-to-b from-blue-50 to-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-navy-900 mb-4">Get In Touch</h2>
            <p className="text-lg text-navy-700 max-w-2xl mx-auto">
              Have questions? Our team is ready to help you get started with carbon sequestration.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-2xl mx-auto">
            {/* Email Card */}
            <Card className="p-8 text-center hover:shadow-lg transition-shadow duration-300 border-cyan-200">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center mx-auto mb-4">
                <Mail className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-bold text-lg text-navy-900 mb-2">Email</h3>
              <a href="mailto:info@zr3i.com" className="text-cyan-600 hover:text-cyan-700 font-medium">
                info@zr3i.com
              </a>
            </Card>

            {/* Phone Card */}
            <Card className="p-8 text-center hover:shadow-lg transition-shadow duration-300 border-cyan-200">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-lime-500 to-cyan-500 flex items-center justify-center mx-auto mb-4">
                <Phone className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-bold text-lg text-navy-900 mb-2">Phone</h3>
              <a href="tel:+201006055320" className="text-cyan-600 hover:text-cyan-700 font-medium">
                +20 100 605 5320
              </a>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-navy-900 text-white py-12 border-t border-navy-800">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-lime-500 flex items-center justify-center">
                  <Leaf className="w-5 h-5 text-navy-900" />
                </div>
                <span className="font-bold text-lg">Zr3i</span>
              </div>
              <p className="text-cyan-200 text-sm">Carbon sequestration through date palm agriculture.</p>
            </div>
            <div>
              <h4 className="font-bold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-sm text-cyan-200">
                <li><a href="#features" className="hover:text-cyan-400 transition-colors">Features</a></li>
                <li><a href="#impact" className="hover:text-cyan-400 transition-colors">Impact</a></li>
                <li><a href="#contact" className="hover:text-cyan-400 transition-colors">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Contact</h4>
              <ul className="space-y-2 text-sm text-cyan-200">
                <li><a href="mailto:info@zr3i.com" className="hover:text-cyan-400 transition-colors">info@zr3i.com</a></li>
                <li><a href="tel:+201006055320" className="hover:text-cyan-400 transition-colors">+20 100 605 5320</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-navy-800 pt-8 text-center text-sm text-cyan-300">
            <p>&copy; 2024 Zr3i. All rights reserved. Carbon sequestration through innovation.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
