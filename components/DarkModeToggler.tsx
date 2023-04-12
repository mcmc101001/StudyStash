'use client'

import { useEffect, useState } from "react";
import Button from "./ui/Button";
import { Sun } from "lucide-react";

export default function DarkModeToggler() {
  const [darkMode, setDarkMode] = useState<string>(() => {
    // Ensure code only runs on client\
    // Dark mode by default
    if (typeof window !== "undefined"){
      try {
        const darkModeLocalStorage = window.localStorage.getItem("darkmode");
        return darkModeLocalStorage ? JSON.parse(darkModeLocalStorage) : "true";
      } catch (error) {
        console.log(error);
        return "true";
      }
    }
  });

  useEffect(() => {
    if (darkMode === "true") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode])

  const handleDarkModeChange = () => {
    if (typeof window !== "undefined"){
      try {
        if (darkMode == "true") {
          window.localStorage.setItem("darkmode", "false");
          setDarkMode("false");
        } else {
          window.localStorage.setItem("darkmode", "true");
          setDarkMode("true");
        }
      } catch (error) {
        console.log(error);
      }
    }
  }

  return (
    <li className='mt-auto mb-2 flex flex-col items-center justify-center gap-y-4'>
      <Button onClick={() => handleDarkModeChange()}> <Sun className='h-6 w-6' /> </Button>
    </li>
  );
}