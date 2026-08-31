"use client";

import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

type Theme = "light" | "dark";

export default function ThemeToggle() {
  const [theme, setTheme] =
    useState<Theme>("light");

  useEffect(() => {
    const savedTheme =
      localStorage.getItem("theme");

    if (savedTheme === "dark") {
      setTheme("dark");
      document.documentElement.classList.add(
        "dark"
      );
    } else {
      setTheme("light");
      document.documentElement.classList.remove(
        "dark"
      );
    }
  }, []);

  function toggleTheme() {
    const html = document.documentElement;

    const isDark =
      html.classList.contains("dark");

    if (isDark) {
      html.classList.remove("dark");
      localStorage.setItem("theme", "light");
      setTheme("light");
    } else {
      html.classList.add("dark");
      localStorage.setItem("theme", "dark");
      setTheme("dark");
    }
  }

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="
        flex h-10 w-10 items-center justify-center
        rounded-full
        border border-gray-300
        bg-white
        text-black
        transition
        hover:bg-gray-100
        dark:border-gray-700
        dark:bg-gray-900
        dark:text-white
        dark:hover:bg-gray-800
      "
      aria-label="Toggle theme"
    >
      {theme === "dark" ? (
        <Sun size={19} />
      ) : (
        <Moon size={19} />
      )}
    </button>
  );
}