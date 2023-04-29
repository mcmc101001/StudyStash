"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import Button from "@/components/ui/Button";
import toast from "react-hot-toast";
import { LogIn, Loader2 } from "lucide-react";

export default function LoginButton() {
  const [isSigningIn, setIsSigningIn] = useState(false);
  return (
    <Button
      variant="ghost"
      onClick={async () => {
        setIsSigningIn(true);
        try {
          await signIn("google");
        } catch (error) {
          toast.error("There was an error signing in");
        } finally {
          setIsSigningIn(false);
        }
      }}
    >
      Login
      {isSigningIn ? (
        <Loader2 className="ml-1 h-4 w-4 animate-spin" />
      ) : (
        <LogIn className="ml-1 h-6 w-6" />
      )}
    </Button>
  );
}
