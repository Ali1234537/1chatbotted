"use client";

import {
  UserRound,
} from "lucide-react";

import {
  useState,
} from "react";

type UsernameModalProps = {
  onSave: (name: string) => void;
};

export default function UsernameModal({
  onSave,
}: UsernameModalProps) {
  const [name, setName] =
    useState("");

  function saveUsername() {
    const cleanName =
      name.trim();

    if (!cleanName) {
      return;
    }

    localStorage.setItem(
      "username",
      cleanName
    );

    onSave(cleanName);
  }

  return (
    <div
      className="
        fixed
        inset-0
        z-50
        flex
        items-center
        justify-center
        bg-black/60
        px-4
      "
    >
      <div
        className="
          w-full
          max-w-md
          rounded-2xl
          bg-white
          p-6
          text-black
          shadow-2xl
          dark:bg-gray-900
          dark:text-white
        "
      >
        <div className="flex justify-center">
          <div
            className="
              rounded-full
              bg-gray-100
              p-4
              dark:bg-gray-800
            "
          >
            <UserRound size={28} />
          </div>
        </div>

        <h2 className="mt-4 text-center text-2xl font-bold">
          Welcome!
        </h2>

        <p className="mt-2 text-center text-gray-500 dark:text-gray-400">
          Enter your username to get started.
        </p>

        <input
          type="text"
          value={name}
          onChange={(event) =>
            setName(event.target.value)
          }
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              saveUsername();
            }
          }}
          placeholder="Enter your username"
          className="
            mt-6
            w-full
            rounded-xl
            border
            border-gray-300
            bg-transparent
            px-4
            py-3
            outline-none
            focus:border-black
            dark:border-gray-700
            dark:focus:border-white
          "
        />

        <button
          type="button"
          onClick={saveUsername}
          disabled={!name.trim()}
          className="
            mt-4
            w-full
            rounded-xl
            bg-black
            px-4
            py-3
            font-medium
            text-white
            transition
            hover:opacity-80
            disabled:cursor-not-allowed
            disabled:opacity-40
            dark:bg-white
            dark:text-black
          "
        >
          Save
        </button>
      </div>
    </div>
  );
}