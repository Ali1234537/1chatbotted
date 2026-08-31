"use client";

import {
  Menu,
  X,
} from "lucide-react";

import { useState } from "react";

import ThemeToggle from "../Theme/ThemeToggle";

export default function Navbar() {
  const [menuOpen, setMenuOpen] =
    useState(false);

  return (
    <nav
      className="
        h-16
        border-b
        border-gray-200
        bg-white
        text-black
        dark:border-gray-800
        dark:bg-black
        dark:text-white
      "
    >
      <div
        className="
          mx-auto
          flex
          h-full
          max-w-6xl
          items-center
          justify-between
          px-4
        "
      >
        {/* Logo */}

        <div className="flex items-center gap-3">
          <img
            src="/chatbot.png"
            alt="Chatbot logo"
            className="h-9 w-9 object-contain"
          />

          <h1 className="font-bold">
            My Chatbot
          </h1>
        </div>

        {/* Desktop */}

        <div className="hidden items-center gap-6 md:flex">
          <a
            href="#"
            className="hover:opacity-60"
          >
            Home
          </a>

          <a
            href="#"
            className="hover:opacity-60"
          >
            About
          </a>

          <a
            href="#"
            className="hover:opacity-60"
          >
            Contact
          </a>

          <ThemeToggle />
        </div>

        {/* Mobile */}

        <div className="flex items-center gap-2 md:hidden">
          <ThemeToggle />

          <button
            type="button"
            onClick={() =>
              setMenuOpen(!menuOpen)
            }
            className="
              rounded-lg
              p-2
              hover:bg-gray-100
              dark:hover:bg-gray-900
            "
            aria-label="Open menu"
          >
            {menuOpen ? (
              <X size={22} />
            ) : (
              <Menu size={22} />
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu */}

      {menuOpen && (
        <div
          className="
            border-b
            border-gray-200
            bg-white
            px-4
            py-4
            dark:border-gray-800
            dark:bg-black
            md:hidden
          "
        >
          <div className="flex flex-col gap-4">
            <a href="#">Home</a>
            <a href="#">About</a>
            <a href="#">Contact</a>
          </div>
        </div>
      )}
    </nav>
  );
}