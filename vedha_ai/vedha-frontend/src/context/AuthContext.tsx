import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

import {
  getCurrentUser,
  login as loginService,
  logout as logoutService,
  type LoginRequest,
  type User,
} from "@/services/auth";

type AuthContextType = {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;

  isStudent: boolean;
  isCompany: boolean;
  isEmployee: boolean;
  isRecruiter: boolean;
  isMentor: boolean;
  isAdmin: boolean;

  login: (data: LoginRequest) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

type Props = {
  children: ReactNode;
};

const saveUserToStorage = (user: User) => {
  localStorage.setItem("user_id", String(user.id));
  localStorage.setItem("student_id", String(user.id)); // Backward compatibility
  localStorage.setItem("user_name", user.name);
  localStorage.setItem("user_email", user.email);
  localStorage.setItem("user_role", user.role);
  localStorage.setItem("onboarding_complete", String(user.onboarding_complete ?? false));
};

const clearUserStorage = () => {
  localStorage.removeItem("access_token");
  localStorage.removeItem("user_id");
  localStorage.removeItem("student_id");
  localStorage.removeItem("user_name");
  localStorage.removeItem("user_email");
  localStorage.removeItem("user_role");
  localStorage.removeItem("onboarding_complete");
};

export function AuthProvider({ children }: Props) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshUser = async () => {
    try {
      const currentUser = await getCurrentUser();

      saveUserToStorage(currentUser);
      setUser(currentUser);
    } catch {
      clearUserStorage();
      setUser(null);
    }
  };

  const login = async (data: LoginRequest) => {
    const response = await loginService(data);

    localStorage.setItem("access_token", response.access_token);

    await refreshUser();
  };

  const logout = () => {
    try {
      logoutService();
    } finally {
      clearUserStorage();
      setUser(null);
    }
  };

  useEffect(() => {
    const initialize = async () => {
      const token = localStorage.getItem("access_token");

      if (!token) {
        setLoading(false);
        return;
      }

      try {
        await refreshUser();
      } finally {
        setLoading(false);
      }
    };

    initialize();
  }, []);

  const value: AuthContextType = {
    user,
    loading,

    isAuthenticated: !!user,

    isStudent: user?.role === "student",
    isCompany: user?.role === "company",
    isEmployee: user?.role === "employee",
    isRecruiter: user?.role === "recruiter",
    isMentor: user?.role === "mentor",
    isAdmin: user?.role === "admin",

    login,
    logout,
    refreshUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuthContext must be used inside AuthProvider"
    );
  }

  return context;
}