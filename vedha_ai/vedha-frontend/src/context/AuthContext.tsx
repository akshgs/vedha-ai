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

  async function refreshUser() {
    try {
      const currentUser = await getCurrentUser();

      setUser(currentUser);
    } catch {
      setUser(null);
    }
  }

  async function login(data: LoginRequest) {
    const response = await loginService(data);

    localStorage.setItem(
      "access_token",
      response.access_token
    );

    await refreshUser();
  }

  function logout() {
    logoutService();

    setUser(null);
  }

  useEffect(() => {
    async function initialize() {
      const token = localStorage.getItem(
        "access_token"
      );

      if (!token) {
        setLoading(false);
        return;
      }

      await refreshUser();

      setLoading(false);
    }

    initialize();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated: !!user,
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