"use client";

import Button from "@/components/ui/Button";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

export default function DarkModeToggler() {
  const { theme, setTheme } = useTheme();

  const handleDarkModeChange = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <div className="flex items-center justify-center">
      <Button
        aria-label="dark mode toggler"
        onClick={() => handleDarkModeChange()}
      >
        {theme === "dark" ? (
          <Sun className="h-6 w-6" />
        ) : (
          <Moon className="h-6 w-6" />
        )}
      </Button>
    </div>
  );
}
