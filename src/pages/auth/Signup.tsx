import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  BookOpen,
  Eye,
  EyeOff,
  Mail,
  Lock,
  User,
  GraduationCap,
} from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import LanguageSelector from "@/components/LanguageSelector";

const Signup = () => {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "",
  });
  const { t } = useLanguage();

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    if (formData.role === "teacher") {
      localStorage.setItem("isLoggedIn", "teacher");
      navigate("/teacher-dashboard");
    } else {
      localStorage.setItem("isLoggedIn", "student");
      navigate("/dashboard");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-muted/30 to-accent/20 px-4 py-8">
      {/* Language Selector - Top Right */}
      <div className="absolute top-4 right-4 z-10">
        <LanguageSelector />
      </div>

      <div className="w-full max-w-md animate-scale-in">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 hero-gradient rounded-xl flex items-center justify-center shadow-lg">
              <BookOpen className="w-7 h-7 text-white" />
            </div>
            <span className="text-3xl font-bold bg-gradient-to-r from-primary via-secondary-accent to-primary bg-clip-text text-transparent drop-shadow-sm">
              {t("hero.brand")}
            </span>
          </Link>
          <h1 className="text-2xl font-bold text-foreground mb-2">
            {t("auth.join_brand")}
          </h1>
          <p className="text-muted-foreground">
            {t("auth.create_account_description")}
          </p>
        </div>

        <Card className="card-gradient">
          <CardHeader className="text-center">
            <CardTitle className="text-xl">{t("auth.create_account")}</CardTitle>
            <CardDescription>{t("auth.create_account_cta")}</CardDescription>
          </CardHeader>

          <form onSubmit={handleSignup}>
            <CardContent className="space-y-4">
              {/* Full name */}
              <div className="space-y-2">
                <Label htmlFor="fullName">{t("auth.full_name")}</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="fullName"
                    type="text"
                    placeholder="Enter your full name"
                    value={formData.fullName}
                    onChange={(e) => handleInputChange("fullName", e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email">{t("auth.email")}</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="student@example.com"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              {/* Role */}
              <div className="space-y-2">
                <Label htmlFor="role">{t("auth.role")}</Label>
                <div className="relative">
                  <GraduationCap className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground z-10" />
                  <Select
                    onValueChange={(value) => handleInputChange("role", value)}
                    required
                  >
                    <SelectTrigger className="pl-10">
                      <SelectValue placeholder={t("auth.role_placeholder")} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="student">{t("auth.student")}</SelectItem>
                      <SelectItem value="teacher">{t("auth.teacher")}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Password */}
              <div className="space-y-2">
                <Label htmlFor="password">{t("auth.password")}</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Create a strong password"
                    value={formData.password}
                    onChange={(e) => handleInputChange("password", e.target.value)}
                    className="pl-10 pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Confirm password */}
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">{t("auth.confirm_password")}</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="Confirm your password"
                    value={formData.confirmPassword}
                    onChange={(e) =>
                      handleInputChange("confirmPassword", e.target.value)
                    }
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              {/* Terms checkbox */}
              <div className="flex items-start space-x-2 text-sm">
                <input type="checkbox" className="mt-0.5 rounded border-border" required />
                <span className="text-muted-foreground">
                  {t("auth.agree_terms")}{" "}
                  <Link to="/terms" className="text-primary hover:text-primary/80 font-medium">
                    {t("auth.terms_service")}
                  </Link>{" "}
                  and{" "}
                  <Link to="/privacy" className="text-primary hover:text-primary/80 font-medium">
                    {t("auth.privacy_policy")}
                  </Link>
                </span>
              </div>
            </CardContent>

            <CardFooter className="flex flex-col space-y-4">
              <Button type="submit" className="w-full" variant="student" size="lg">
                {t("auth.create_account")}
              </Button>

              <div className="text-center text-sm text-muted-foreground">
                {t("auth.have_account")}{" "}
                <Link to="/login" className="text-primary hover:text-primary/80 font-medium">
                  {t("auth.sign_in_here")}
                </Link>
              </div>

              <div className="text-center">
                <Link to="/" className="text-sm text-muted-foreground hover:text-foreground">
                  {t("auth.back_to_home")}
                </Link>
              </div>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default Signup;
