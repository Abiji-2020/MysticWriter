import { getInsforgeClient } from "@/lib/insforge/client";

export interface User {
  id: string;
  email: string;
  nickname?: string;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
}

export const authService = {
  /**
   * Check if backend is available
   */
  async checkBackendAvailability(): Promise<boolean> {
    try {
      const client = getInsforgeClient();
      await client.auth.getCurrentUser();
      return true;
    } catch (error) {
      console.error("Backend check failed:", error);
      return false;
    }
  },

  /**
   * Login with email and password
   */
  async login(email: string, password: string): Promise<AuthResponse> {
    try {
      const client = getInsforgeClient();
      const { data, error } = await client.auth.signInWithPassword({
        email,
        password,
      });

      if (error || !data?.user) {
        throw new Error(error?.message || "Login failed");
      }

      return {
        user: {
          id: data.user.id,
          email: data.user.email,
          nickname: data.user.name,
        },
        accessToken: data.accessToken || "",
      };
    } catch (error) {
      console.error("Login error:", error);
      throw error instanceof Error ? error : new Error("Login failed");
    }
  },

  /**
   * Register with email and password
   */
  async register(
    email: string,
    password: string,
    nickname: string,
  ): Promise<AuthResponse> {
    try {
      const client = getInsforgeClient();
      const { data, error } = await client.auth.signUp({
        email,
        password,
      });

      if (error || !data?.user) {
        throw new Error(error?.message || "Registration failed");
      }

      // Update profile with nickname
      if (nickname) {
        await client.auth.setProfile({ nickname });
      }

      return {
        user: {
          id: data.user.id,
          email: data.user.email,
          nickname,
        },
        accessToken: data.accessToken || "",
      };
    } catch (error) {
      console.error("Registration error:", error);
      throw error instanceof Error ? error : new Error("Registration failed");
    }
  },

  /**
   * Sign in with Google OAuth
   */
  async signInWithGoogle(): Promise<{ url: string }> {
    try {
      const client = getInsforgeClient();
      const { data, error } = await client.auth.signInWithOAuth({
        provider: "google",
        redirectTo: `${window.location.origin}/auth/callback`,
        skipBrowserRedirect: true,
      });

      if (error || !data?.url) {
        throw new Error(error?.message || "Google sign-in failed");
      }

      return { url: data.url };
    } catch (error) {
      console.error("Google sign-in error:", error);
      throw error instanceof Error ? error : new Error("Google sign-in failed");
    }
  },

  /**
   * Handle OAuth callback and get current user
   */
  async handleOAuthCallback(): Promise<AuthResponse> {
    try {
      const client = getInsforgeClient();
      const { data, error } = await client.auth.getCurrentUser();

      if (error || !data?.user) {
        throw new Error(error?.message || "OAuth callback failed");
      }

      const { data: sessionData } = await client.auth.getCurrentSession();
      const accessToken = sessionData?.session?.accessToken || "";

      return {
        user: {
          id: data.user.id,
          email: data.user.email,
          nickname: data.user.name,
        },
        accessToken,
      };
    } catch (error) {
      console.error("OAuth callback error:", error);
      throw error instanceof Error ? error : new Error("OAuth callback failed");
    }
  },

  /**
   * Logout the current user
   */
  logout(): void {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("user");
  },

  /**
   * Get current user from localStorage
   */
  getCurrentUser(): User | null {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
  },

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return !!localStorage.getItem("auth_token");
  },

  /**
   * Get authentication token
   */
  getToken(): string | null {
    return localStorage.getItem("auth_token");
  },

  /**
   * Set authentication data after successful login/register
   */
  setAuthData(user: User, token: string): void {
    localStorage.setItem("auth_token", token);
    localStorage.setItem("user", JSON.stringify(user));
  },
};
