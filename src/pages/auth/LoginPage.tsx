import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FcGoogle } from "react-icons/fc";

export function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);
  const { login, signInWithGoogle, error: authError } = useAuth();

  const displayError = localError || authError;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);

    if (!email || !password) {
      setLocalError("Please fill in all fields");
      return;
    }

    try {
      setIsLoading(true);
      await login(email, password);
    } catch (err) {
      setLocalError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setLocalError(null);
      setGoogleLoading(true);
      await signInWithGoogle();
    } catch (err) {
      setLocalError(err instanceof Error ? err.message : "Google login failed");
      setGoogleLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-purple-600 bg-clip-text text-transparent mb-2">
            MysticWriter
          </h1>
          <p className="text-muted-foreground">Welcome back to your stories</p>
        </div>

        {/* Error Message */}
        {displayError && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
            <p className="text-red-400 text-sm">{displayError}</p>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4 mb-6">
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

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full gradient-purple text-white font-medium hover:opacity-90 transition-opacity"
          >
            {isLoading ? "Signing in..." : "Sign In"}
          </Button>
        </form>

        {/* Divider */}
        <div className="relative mb-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-border/30" />
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="px-2 bg-background text-muted-foreground">
              Or continue with
            </span>
          </div>
        </div>

        {/* Google Login */}
        <Button
          type="button"
          variant="outline"
          disabled={googleLoading}
          onClick={handleGoogleLogin}
          className="w-full border-border/50 hover:bg-background/50 transition-colors gap-2"
        >
          <FcGoogle />
          {googleLoading ? "Signing in..." : "Sign in with Google"}
        </Button>

        {/* Sign Up Link */}
        <div className="mt-6 text-center text-sm">
          <span className="text-muted-foreground">Don't have an account? </span>
          <Link
            to="/register"
            className="text-purple-400 hover:text-purple-300 font-medium transition-colors"
          >
            Sign up
          </Link>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
