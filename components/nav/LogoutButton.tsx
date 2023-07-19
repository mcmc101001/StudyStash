"use client";

import { useState } from "react";
import { signOut } from "next-auth/react";
import Button from "@/components/ui/Button";
import { toast } from "react-hot-toast";
import { Loader2, LogOut } from "lucide-react";

export default function LogoutButton() {
  const [isSigningOut, setIsSigningOut] = useState(false);
  return (
    <Button
      id="logoutButton"
      variant="ghost"
      onClick={async () => {
        setIsSigningOut(true);
        try {
          await signOut();
        } catch (error) {
          toast.error("There was an error signing out");
        } finally {
          setIsSigningOut(false);
        }
      }}
      className="w-20 px-0"
    >
      Logout
      {isSigningOut ? (
        <Loader2 className="ml-1 h-4 w-4 animate-spin" />
      ) : (
        <LogOut className="ml-1 h-5 w-5" />
      )}
    </Button>
  );
}
