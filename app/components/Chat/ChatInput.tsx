"use client";

import {
  ArrowUp,
  Square,
} from "lucide-react";

import {
  KeyboardEvent,
  useEffect,
  useRef,
  useState,
} from "react";

type ChatInputProps = {
  onSend: (message: string) => void;
  onStop: () => void;
  isGenerating: boolean;
};

export default function ChatInput({
  onSend,
  onStop,
  isGenerating,
}: ChatInputProps) {
  const [message, setMessage] =
    useState("");

  const textareaRef =
    useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const textarea =
      textareaRef.current;

    if (!textarea) return;

    textarea.style.height = "auto";

    const maxHeight = 120;

    textarea.style.height = `${Math.min(
      textarea.scrollHeight,
      maxHeight
    )}px`;
  }, [message]);

  function sendMessage() {
    const cleanMessage =
      message.trim();

    if (
      !cleanMessage ||
      isGenerating
    ) {
      return;
    }

    onSend(cleanMessage);

    setMessage("");

    if (textareaRef.current) {
      textareaRef.current.style.height =
        "auto";
    }
  }

  function handleKeyDown(
    event: KeyboardEvent<HTMLTextAreaElement>
  ) {
    if (
      event.key === "Enter" &&
      !event.shiftKey
    ) {
      event.preventDefault();

      sendMessage();
    }
  }

  return (
    <div
      className="
        border-t
        border-gray-200
        bg-white
        p-3
        dark:border-gray-800
        dark:bg-black
        sm:p-4
      "
    >
      <div
        className="
          mx-auto
          flex
          max-w-4xl
          items-end
          gap-2
          rounded-2xl
          border
          border-gray-300
          bg-white
          p-2
          dark:border-gray-700
          dark:bg-gray-950
        "
      >
        <textarea
          ref={textareaRef}
          value={message}
          onChange={(event) =>
            setMessage(
              event.target.value
            )
          }
          onKeyDown={handleKeyDown}
          rows={1}
          placeholder="Message..."
          className="
            max-h-[120px]
            min-h-[40px]
            flex-1
            resize-none
            bg-transparent
            px-3
            py-2
            text-sm
            outline-none
            sm:text-base
          "
        />

        {isGenerating ? (
          <button
            type="button"
            onClick={onStop}
            className="
              flex
              h-10
              w-10
              shrink-0
              items-center
              justify-center
              rounded-full
              bg-black
              text-white
              dark:bg-white
              dark:text-black
            "
            aria-label="Stop generating"
          >
            <Square
              size={16}
              fill="currentColor"
            />
          </button>
        ) : (
          <button
            type="button"
            onClick={sendMessage}
            disabled={!message.trim()}
            className={`
              flex
              h-10
              w-10
              shrink-0
              items-center
              justify-center
              rounded-full
              transition
              ${
                message.trim()
                  ? `
                    bg-black
                    text-white
                    dark:bg-white
                    dark:text-black
                  `
                  : `
                    bg-gray-200
                    text-gray-400
                    dark:bg-gray-800
                  `
              }
            `}
            aria-label="Send message"
          >
            <ArrowUp size={19} />
          </button>
        )}
      </div>

      <p className="mt-2 text-center text-xs text-gray-400">
        AI can make mistakes. Check important
        information.
      </p>
    </div>
  );
}