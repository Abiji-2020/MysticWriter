import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Chrome } from "lucide-react";

export function RegisterPage() {
  const [nickname, setNickname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);
  const { register, signInWithGoogle, error: authError } = useAuth();

  const displayError = localError || authError;

  const validateForm = (): boolean => {
    if (!nickname.trim()) {
      setLocalError("Name is required");
      return false;
    }
    if (!email) {
      setLocalError("Email is required");
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setLocalError("Please enter a valid email address");
      return false;
    }
    if (password.length < 6) {
      setLocalError("Password must be at least 6 characters");
      return false;
    }
    if (password !== confirmPassword) {
      setLocalError("Passwords do not match");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);

    if (!validateForm()) return;

    try {
      setIsLoading(true);
      await register(email, password, nickname);
    } catch (err) {
      setLocalError(err instanceof Error ? err.message : "Registration failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
    try {
      setLocalError(null);
      setGoogleLoading(true);
      await signInWithGoogle();
    } catch (err) {
      setLocalError(
        err instanceof Error ? err.message : "Google sign-up failed",
      );
      setGoogleLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-purple-600 bg-clip-text text-transparent mb-2">
            Create Account
          </h1>
          <p className="text-muted-foreground">
            Start writing your stories today
          </p>
        </div>

        {/* Error Message */}
        {displayError && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
            <p className="text-red-400 text-sm">{displayError}</p>
          </div>
        )}

        {/* Register Form */}
        <form onSubmit={handleSubmit} className="space-y-4 mb-6">
          <div className="space-y-2">
            <Label htmlFor="nickname" className="text-foreground">
              Full Name
            </Label>
            <Input
              id="nickname"
              type="text"
              placeholder="John Doe"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              disabled={isLoading}
              className="bg-background/50 border-border/50 focus:border-purple-500/50"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="text-foreground">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
              className="bg-background/50 border-border/50 focus:border-purple-500/50"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-foreground">
              Password
            </Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
              className="bg-background/50 border-border/50 focus:border-purple-500/50"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword" className="text-foreground">
              Confirm Password
            </Label>
            <Input
              id="confirmPassword"
              type="password"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              disabled={isLoading}
              className="bg-background/50 border-border/50 focus:border-purple-500/50"
            />
          </div>

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full gradient-purple text-white font-medium hover:opacity-90 transition-opacity"
          >
            {isLoading ? "Creating account..." : "Create Account"}
          </Button>
        </form>

        {/* Divider */}
        <div className="relative mb-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-border/30" />
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="px-2 bg-background text-muted-foreground">
              Or sign up with
            </span>
          </div>
        </div>

        {/* Google Sign Up */}
        <Button
          type="button"
          variant="outline"
          disabled={googleLoading}
          onClick={handleGoogleSignUp}
          className="w-full border-border/50 hover:bg-background/50 transition-colors gap-2"
        >
          <Chrome className="w-4 h-4" />
          {googleLoading ? "Signing up..." : "Sign up with Google"}
        </Button>

        {/* Sign In Link */}
        <div className="mt-6 text-center text-sm">
          <span className="text-muted-foreground">
            Already have an account?{" "}
          </span>
          <Link
            to="/login"
            className="text-purple-400 hover:text-purple-300 font-medium transition-colors"
          >
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;
