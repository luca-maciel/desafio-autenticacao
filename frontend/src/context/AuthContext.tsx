import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

import api from "../services/api";

import { getToken, removeToken, saveToken } from "../services/storage";

type User = {
  id: string;
  name: string;
  email: string;
  createdAt: string;
};

type AuthContextData = {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSession();
  }, []);

  async function loadSession() {
  try {
    const token = await getToken();

    if (!token) {
      setUser(null);
      return;
    }

    const response = await api.get<User>("/auth/me");

    setUser(response.data);
  } catch (error) {
    console.error("AUTH: error loading session:", error);

    await removeToken();
    setUser(null);
  } finally {
    setLoading(false);
  }
}

  async function login(
  email: string,
  password: string
) {
  const response = await api.post("/auth/login", {
    email,
    password,
  });

  const token = response.data.token;

  await saveToken(token);

  const userResponse = await api.get<User>("/auth/me");

  setUser(userResponse.data);
}

  async function logout() {
    await removeToken();
    setUser(null);
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
