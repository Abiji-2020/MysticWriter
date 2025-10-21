import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { authService } from "@/services/authService";

export function OAuthCallback() {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const { user, accessToken } = await authService.handleOAuthCallback();

        localStorage.setItem("auth_token", accessToken);
        localStorage.setItem("user", JSON.stringify(user));

        // Redirect to home with full page reload to sync auth state
        window.location.href = "/";
      } catch (err) {
        console.error("OAuth callback error:", err);
        setError(err instanceof Error ? err.message : "Authentication failed");

        setTimeout(() => {
          navigate("/login", { replace: true });
        }, 3000);
      }
    };

    handleCallback();
  }, [navigate]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background px-4">
        <div className="w-full max-w-md text-center">
          <div className="mb-4 p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
            <p className="text-red-400 font-medium">Authentication Failed</p>
            <p className="text-red-300 text-sm mt-2">{error}</p>
          </div>
          <p className="text-muted-foreground text-sm">
            Redirecting to login...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mb-4" />
        <p className="text-foreground font-medium">Completing sign in...</p>
        <p className="text-muted-foreground text-sm mt-2">
          Please wait while we authenticate you
        </p>
      </div>
    </div>
  );
}

export default OAuthCallback;
