"use client";

import { useAuth } from "@/lib/auth-context";
import { LoginPage } from "./login-page";

export function ProtectedContent({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <LoginPage />;
  }

  return <>{children}</>;
}
