import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import logo from "/image.png";

import {
  Trophy,
  Brain,
  WifiOff,
  Gamepad2,
  Target,
  Zap,
  Star,
  ArrowRight,
  Play,
} from "lucide-react";
import heroImage from "@/assets/hero-learning.jpg";
import { useLanguage } from "@/contexts/LanguageContext";
import LanguageSelector from "@/components/LanguageSelector";

const Landing = () => {
  const { t } = useLanguage();

  const features = [
    {
      icon: Brain,
      title: t("features.ai_learning"),
      description: t("features.ai_description"),
      color: "text-purple-500",
    },
    {
      icon: WifiOff,
      title: t("features.offline"),
      description: t("features.offline_description"),
      color: "text-orange-500",
    },
    {
      icon: Gamepad2,
      title: t("features.gamified"),
      description: t("features.gamified_description"),
      color: "text-blue-500",
    },
    {
      icon: Target,
      title: t("features.adaptive"),
      description: t("features.adaptive_description"),
      color: "text-green-500",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Purple gradient background */}
        <div className="absolute inset-0 hero-gradient opacity-90" />

        {/* Logo - Top Left */}
        <img
          src={logo}
          alt="Gyaan Arena Logo"
          className="absolute top-6 left-6 h-20 w-20 rounded-full object-cover shadow-lg border-2 border-white z-50"
        />

        {/* Language Selector - Top Right */}
        <div className="absolute top-4 right-4 z-50">
          <LanguageSelector />
        </div>

        {/* Hero Content */}
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-center lg:text-left animate-slide-up">
              <h1 className="text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                {t("hero.title")}<br />
                <span className="bg-gradient-to-r from-white via-primary-glow to-white bg-clip-text text-transparent font-extrabold drop-shadow-2xl animate-pulse-soft">
                  {t("hero.brand")}
                </span>
              </h1>
              <p className="text-xl text-white/90 mb-8 leading-relaxed">
                {t("hero.description")}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Button size="xl" variant="hero" asChild>
                  <Link to="/auth/signup">
                    {t("hero.get_started")}
                    <ArrowRight className="w-5 h-5" />
                  </Link>
                </Button>
                <Button
                  size="xl"
                  variant="outline"
                  className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                  onClick={() => {
                    // SSR-safe check
                    if (typeof window !== "undefined") {
                      void window.open("https://youtu.be/1ElM_UQegeI?si=sBHUs-0h6pBxVzGY", "_blank");
                    }
                  }}
                >
                  <Play className="w-5 h-5 mr-2" />
                  {t("hero.watch_demo")}
                </Button>
              </div>
            </div>
            <div className="relative animate-float">
              <img
                src={heroImage}
                alt="Modern learning platform with students and digital interfaces"
                className="rounded-2xl shadow-2xl w-full max-w-lg mx-auto"
              />
              <div className="absolute -top-4 -right-4 w-20 h-20 bg-success rounded-full flex items-center justify-center animate-pulse-soft">
                <Trophy className="w-10 h-10 text-white" />
              </div>
              <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-warning rounded-full flex items-center justify-center animate-pulse-soft">
                <Star className="w-8 h-8 text-white" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-6">
              {t("features.title")}
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              {t("features.subtitle")}
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card
                  key={index}
                  className="card-gradient hover:scale-105 smooth-transition group"
                >
                  <CardContent className="p-6 text-center">
                    <div
                      className={`w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-secondary-accent/20 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 smooth-transition`}
                    >
                      <Icon className={`w-8 h-8 ${feature.color}`} />
                    </div>
                    <h3 className="text-xl font-semibold text-foreground mb-3">
                      {feature.title}
                    </h3>
                    <p className="text-muted-foreground">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 hero-gradient">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            {t("cta.title")}
          </h2>
          <p className="text-xl text-white/90 mb-8">
            {t("cta.description")}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="xl"
              variant="outline"
              className="border-2 border-white/40 text-white bg-white/10 hover:bg-white/20 hover:border-white hover:scale-105 smooth-transition backdrop-blur-sm shadow-lg hover:shadow-white/10 font-semibold"
              asChild
            >
              <Link to="/auth/signup">
                {t("cta.start_learning")}
                <Zap className="w-5 h-5" />
              </Link>
            </Button>
            <Button
              size="xl"
              variant="outline"
              className="border-2 border-white/40 text-white bg-white/10 hover:bg-white/20 hover:border-white hover:scale-105 smooth-transition backdrop-blur-sm shadow-lg hover:shadow-white/10 font-semibold"
              asChild
            >
              <Link to="/auth/login">{t("cta.have_account")}</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Landing;
