"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import Button from "@/components/ui/Button";
import toast from "react-hot-toast";
import { LogIn, Loader2, User } from "lucide-react";

export default function LoginButton() {
  const [isSigningIn, setIsSigningIn] = useState(false);

  const handleLogin = async () => {
    setIsSigningIn(true);
    try {
      await signIn("google");
    } catch (error) {
      toast.error("There was an error signing in");
    } finally {
      setIsSigningIn(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center gap-y-4">
      <User
        className="h-16 w-16 text-slate-800 hover:cursor-pointer dark:text-slate-200"
        onClick={handleLogin}
      />
      <Button id="loginButton" variant="ghost" onClick={handleLogin}>
        Login
        {isSigningIn ? (
          <Loader2 className="ml-1 h-4 w-4 animate-spin" />
        ) : (
          <LogIn className="ml-1 h-6 w-6" />
        )}
      </Button>
    </div>
  );
}
