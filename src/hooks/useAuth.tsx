
import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface AuthUser {
  email: string;
  role: "admin" | "superadmin";
}

interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in from localStorage
    const checkAuth = () => {
      const storedUser = localStorage.getItem("skawshAdmin");
      if (storedUser) {
        try {
          const parsedUser = JSON.parse(storedUser);
          setUser({
            email: parsedUser.email,
            role: "admin", // Default role, would come from your backend in real app
          });
        } catch (error) {
          console.error("Error parsing stored user:", error);
          localStorage.removeItem("skawshAdmin");
        }
      }
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      // In a real app, this would be an API call to verify credentials
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate API call

      // Updated credentials
      if (email === "saitejasamala@skawsh.com" && password === "Skawsh@123") {
        const userData = {
          email,
          role: "admin" as const,
        };
        setUser(userData);
        localStorage.setItem("skawshAdmin", JSON.stringify({ email }));
        return true;
      }
      return false;
    } catch (error) {
      console.error("Login error:", error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("skawshAdmin");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
