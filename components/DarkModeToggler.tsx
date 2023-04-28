"use client";

import { useEffect, useState } from "react";
import Button from "@/components/ui/Button";
import { Moon, Sun } from "lucide-react";

export default function DarkModeToggler() {
  const [theme, setTheme] = useState<string>(() => {
    // Ensure code only runs on client
    // Dark mode by default
    if (typeof window !== "undefined") {
      try {
        const themeLocalStorage = window.localStorage.getItem("theme");
        return themeLocalStorage || "dark";
      } catch (error) {
        console.log(error);
        return "dark";
      }
    }
    return "dark";
  });

  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [theme]);

  const handleDarkModeChange = () => {
    try {
      if (typeof window !== "undefined") {
        if (theme === "dark") {
          window.localStorage.setItem("theme", "light");
          setTheme("light");
        } else {
          window.localStorage.setItem("theme", "dark");
          setTheme("dark");
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <li className="mb-2 mt-auto flex flex-col items-center justify-center gap-y-4">
      <Button onClick={() => handleDarkModeChange()}>
        {theme === "dark" ? (
          <Sun className="h-6 w-6" />
        ) : (
          <Moon className="h-6 w-6" />
        )}
      </Button>
    </li>
  );
}
