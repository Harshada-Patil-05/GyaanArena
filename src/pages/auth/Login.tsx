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
import { BookOpen, Eye, EyeOff, User, Lock } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import LanguageSelector from "@/components/LanguageSelector";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState(""); // changed from email → username
  const [password, setPassword] = useState("");
  const { t } = useLanguage();
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    if (username === "student" && password === "1234") {
      localStorage.setItem("isLoggedIn", "student");
      navigate("/dashboard");
    } else if (username === "teacher" && password === "5678") {
      localStorage.setItem("isLoggedIn", "teacher");
      navigate("/teacher-dashboard");
    } else {
      alert("Invalid credentials!");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-muted/30 to-accent/20 px-4">
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
            {t("auth.welcome_back")}
          </h1>
          <p className="text-muted-foreground">{t("auth.sign_in_description")}</p>
        </div>

        <Card className="card-gradient">
          <CardHeader className="text-center">
            <CardTitle className="text-xl">{t("auth.sign_in")}</CardTitle>
            <CardDescription>
              For default login use following:
              <br />
              <strong>Student:</strong> username = <code>student</code>, password ={" "}
              <code>1234</code>
              <br />
              <strong>Teacher:</strong> username = <code>teacher</code>, password ={" "}
              <code>5678</code>
            </CardDescription>
          </CardHeader>

          <form onSubmit={handleLogin}>
            <CardContent className="space-y-4">
              {/* Username Field */}
              <div className="space-y-2">
                <Label htmlFor="username">{t("auth.username")}</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="username"
                    type="text"
                    placeholder="Enter your username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <Label htmlFor="password">{t("auth.password")}</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </CardContent>

            <CardFooter className="flex flex-col space-y-4">
              <Button type="submit" className="w-full" size="lg">
                {t("auth.sign_in")}
              </Button>

              <div className="text-center">
                <Link
                  to="/"
                  className="text-sm text-muted-foreground hover:text-foreground"
                >
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

export default Login;
