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
  login: (data: LoginRequest) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

type Props = {
  children: ReactNode;
};

export function AuthProvider({ children }: Props) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshUser = async () => {
    try {
      const currentUser = await getCurrentUser();

      localStorage.setItem("student_id", String(currentUser.id));
      localStorage.setItem("user_id", String(currentUser.id));
      localStorage.setItem("user_name", currentUser.name);
      localStorage.setItem("user_email", currentUser.email);
      localStorage.setItem("user_role", currentUser.role);

      setUser(currentUser);
    } catch {
      setUser(null);
    }
  };

  const login = async (data: LoginRequest) => {
    const response = await loginService(data);

    localStorage.setItem(
      "access_token",
      response.access_token
    );

    const currentUser = await getCurrentUser();

    localStorage.setItem("student_id", String(currentUser.id));
    localStorage.setItem("user_id", String(currentUser.id));
    localStorage.setItem("user_name", currentUser.name);
    localStorage.setItem("user_email", currentUser.email);
    localStorage.setItem("user_role", currentUser.role);

    setUser(currentUser);
  };

  const logout = () => {
    logoutService();

    localStorage.removeItem("access_token");
    localStorage.removeItem("student_id");
    localStorage.removeItem("user_id");
    localStorage.removeItem("user_name");
    localStorage.removeItem("user_email");
    localStorage.removeItem("user_role");

    setUser(null);
  };

  useEffect(() => {
    const initialize = async () => {
      const token = localStorage.getItem("access_token");

      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const currentUser = await getCurrentUser();

        localStorage.setItem("student_id", String(currentUser.id));
        localStorage.setItem("user_id", String(currentUser.id));
        localStorage.setItem("user_name", currentUser.name);
        localStorage.setItem("user_email", currentUser.email);
        localStorage.setItem("user_role", currentUser.role);

        setUser(currentUser);
      } catch {
        localStorage.removeItem("access_token");
        localStorage.removeItem("student_id");
        localStorage.removeItem("user_id");
        localStorage.removeItem("user_name");
        localStorage.removeItem("user_email");
        localStorage.removeItem("user_role");

        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    initialize();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated: user !== null,
        login,
        logout,
        refreshUser,
      }}
    >
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