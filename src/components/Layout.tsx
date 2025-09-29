import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  BookOpen,
  Trophy,
  Users,
  Brain,
  Menu,
  X,
  User,
  LogOut,
  Settings,
} from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import LanguageSelector from "@/components/LanguageSelector";
import logoImage from "@/assets/logo-gyaan-arena.png";


interface LayoutProps {
  children: React.ReactNode;
  showNavigation?: boolean;
}

const Layout = ({ children, showNavigation = true }: LayoutProps) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { t } = useLanguage();

  const isActive = (path: string) => location.pathname === path;

  const navigation = [
    { name: t("nav.home"), href: "/", icon: BookOpen },
    { name: t("nav.dashboard"), href: {localStorage.getItem("isLoggedIn")=="student" ? "/dashboard" : "/teacher-dashboard"}, icon: Users },
    { name: t("nav.leaderboard"), href: "/leaderboard", icon: Trophy },
    { name: t("nav.ai_tutor"), href: "/ai-tutor", icon: Brain },
  ];

  return (
    <div className="min-h-screen bg-background">
      {showNavigation && (
        <nav className="bg-card/80 backdrop-blur-sm border-b border-border sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              {/* Logo */}
              <Link to="/" className="flex items-center space-x-3">
                {/* Logo Section */}
                <div className="flex justify-center">
                  <div className="w-12 h-12 rounded-full bg-white/95 border-2 border-white/50 flex items-center justify-center hover:scale-105 smooth-transition">
                    <img
                      src={logoImage}
                      alt="Gyaan Arena Logo"
                      className="w-12 h-12 object-contain drop-shadow-sm z-50 rounded-full"
                    />
                  </div>
                </div>
                <span className="text-3xl font-bold bg-gradient-to-r from-primary via-secondary-accent to-primary bg-clip-text text-transparent drop-shadow-sm">
                  {t("hero.brand")}
                </span>
              </Link>

              {/* Desktop Navigation */}
              <div className="hidden md:flex items-center space-x-8">
                {navigation.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      className={`flex items-center space-x-2 px-3 py-2 rounded-lg smooth-transition ${
                        isActive(item.href)
                          ? "bg-primary/10 text-primary"
                          : "text-muted-foreground hover:text-foreground hover:bg-accent"
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span className="font-medium">{item.name}</span>
                    </Link>
                  );
                })}
              </div>

              {/* User Menu */}
              <div className="hidden md:flex items-center space-x-4">
                <LanguageSelector />
                <Button variant="ghost" size="icon">
                  <Settings className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="icon">
                  <User className="w-4 h-4" />
                </Button>
                <Link to="/">
                  <Button variant="outline" size="sm">
                    <LogOut className="w-4 h-4 mr-2" />
                      { t("nav.logout")}
                </Button>
                </Link>
              </div>

              {/* Mobile menu button */}
              <div className="md:hidden">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                >
                  {mobileMenuOpen ? (
                    <X className="w-6 h-6" />
                  ) : (
                    <Menu className="w-6 h-6" />
                  )}
                </Button>
              </div>
            </div>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <div className="md:hidden bg-card border-t border-border animate-slide-up">
              <div className="px-2 pt-2 pb-3 space-y-1">
                {navigation.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      className={`flex items-center space-x-3 px-3 py-2 rounded-lg smooth-transition ${
                        isActive(item.href)
                          ? "bg-primary/10 text-primary"
                          : "text-muted-foreground hover:text-foreground hover:bg-accent"
                      }`}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="font-medium">{item.name}</span>
                    </Link>
                  );
                })}
                <div className="pt-4 mt-4 border-t border-border">
                  <div className="px-3 py-2">
                    <LanguageSelector />
                  </div>
                  <Link to="/">
                    <Button variant="outline" className="w-full justify-start">
                      <LogOut className="w-4 h-4 mr-2" />
                      {t("nav.logout")}
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          )}
        </nav>
      )}

      {/* Main Content */}
      <main className="flex-1">{children}</main>
    </div>
  );
};

export default Layout;
