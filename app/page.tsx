"use client";

import {
  useEffect,
  useState,
} from "react";

import ChatBox from "./components/Chat/ChatBox";

import Navbar from "./components/Navbar/Navbar";

import UsernameModal from "./components/Modal/UsernameModal";

export default function Home() {
  const [username, setUsername] =
    useState("");

  const [showModal, setShowModal] =
    useState(false);

  useEffect(() => {
    const savedUsername =
      localStorage.getItem(
        "username"
      );

    if (savedUsername) {
      setUsername(savedUsername);
    } else {
      setShowModal(true);
    }
  }, []);

  function handleUsernameSave(
    name: string
  ) {
    setUsername(name);
    setShowModal(false);
  }

  return (
    <main
      className="
        min-h-screen
        bg-white
        text-black
        dark:bg-black
        dark:text-white
      "
    >
      <Navbar />

      {username && (
        <ChatBox
          username={username}
        />
      )}

      {showModal && (
        <UsernameModal
          onSave={
            handleUsernameSave
          }
        />
      )}
    </main>
  );
}