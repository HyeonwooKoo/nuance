import { useGoogleLogin } from "@react-oauth/google";
import { LogOut } from "lucide-react";

import api from "../lib/api";
import { useAuthStore } from "../store/auth";
import { Button } from "./ui/button";

export function UserNav() {
  const { user, setUser, logout } = useAuthStore();

  const login = useGoogleLogin({
    onSuccess: async (codeResponse) => {
      try {
        const { data } = await api.post("/auth/google", {
          code: codeResponse.code,
        });
        setUser(data.user, data.token);
      } catch (error) {
        console.error("Login failed:", error);
      }
    },
    flow: "auth-code",
  });

  if (user) {
    return (
      <Button variant="ghost" onClick={logout}>
        <LogOut className="h-6 w-6" />
      </Button>
    );
  }

  return (
    <Button variant="ghost" onClick={() => login()}>
      Sign in
    </Button>
  );
}
