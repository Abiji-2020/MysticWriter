import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
} from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { authService, type User } from "@/services/authService";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (
    email: string,
    password: string,
    nickname: string,
  ) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  logout: () => void;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Initialize auth on mount
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const storedUser = localStorage.getItem("user");
        const storedToken = localStorage.getItem("auth_token");

        if (storedUser && storedToken) {
          setUser(JSON.parse(storedUser));
        }
      } catch (err) {
        console.error("Auth initialization error:", err);
        localStorage.removeItem("auth_token");
        localStorage.removeItem("user");
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = useCallback(
    async (email: string, password: string) => {
      try {
        setLoading(true);
        setError(null);
        const { user: userData, accessToken } = await authService.login(
          email,
          password,
        );

        localStorage.setItem("auth_token", accessToken);
        localStorage.setItem("user", JSON.stringify(userData));
        setUser(userData);

        const redirectPath = location.state?.from?.pathname || "/";
        navigate(redirectPath, { replace: true });
      } catch (err) {
        const message = err instanceof Error ? err.message : "Login failed";
        setError(message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [navigate, location],
  );

  const register = useCallback(
    async (email: string, password: string, nickname: string) => {
      try {
        setLoading(true);
        setError(null);
        const { user: userData, accessToken } = await authService.register(
          email,
          password,
          nickname,
        );

        localStorage.setItem("auth_token", accessToken);
        localStorage.setItem("user", JSON.stringify(userData));
        setUser(userData);

        navigate("/", { replace: true });
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Registration failed";
        setError(message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [navigate],
  );

  const signInWithGoogle = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const { url } = await authService.signInWithGoogle();
      window.location.href = url;
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Google sign-in failed";
      setError(message);
      setLoading(false);
      throw err;
    }
  }, []);

  const logout = useCallback(() => {
    authService.logout();
    setUser(null);
    setError(null);
    navigate("/login", { replace: true });
  }, [navigate]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const value: AuthContextType = {
    user,
    loading,
    error,
    login,
    register,
    signInWithGoogle,
    logout,
    clearError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
