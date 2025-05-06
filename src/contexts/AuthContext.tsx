"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { useSession } from "next-auth/react";

type User = {
  id: number;
  email: string;
  userHandle: string;
  name: string;
} | null;

type AuthContextType = {
  user: User;
  isLoading: boolean;
  isAuthenticated: boolean;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  isAuthenticated: false,
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === "loading") {
      setIsLoading(true);
      return;
    }

    if (session?.user) {
      setUser({
        id: parseInt(session.user.id),
        email: session.user.email,
        userHandle: session.user.userHandle,
        name: session.user.name,
      });
    } else {
      setUser(null);
    }
    setIsLoading(false);
  }, [session, status]);

  const value = {
    user,
    isLoading,
    isAuthenticated: !!user,
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
