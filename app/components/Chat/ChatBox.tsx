
"use client";

import {
  useEffect,
  useRef,
  useState,
} from "react";

import ChatInput from "./ChatInput";
import ChatMessage from "./ChatMessage";
import TypingIndicator from "./TypingIndicator";

type Message = {
  role: "user" | "assistant";
  content: string;
};

type ChatBoxProps = {
  username: string;
};

export default function ChatBox({
  username,
}: ChatBoxProps) {
  const [messages, setMessages] =
    useState<Message[]>([]);

  const [isGenerating, setIsGenerating] =
    useState(false);

  const abortControllerRef =
    useRef<AbortController | null>(null);

  const bottomRef =
    useRef<HTMLDivElement>(null);

  const chatContainerRef =
    useRef<HTMLDivElement>(null);

  const userScrolledUpRef =
    useRef(false);

  useEffect(() => {
    const container =
      chatContainerRef.current;

    if (container === null) {
      return;
    }

    function handleScroll() {
      const distanceFromBottom =
        container.scrollHeight -
        container.scrollTop -
        container.clientHeight;

      userScrolledUpRef.current =
        distanceFromBottom > 100;
    }

    container.addEventListener(
      "scroll",
      handleScroll
    );

    return () => {
      container.removeEventListener(
        "scroll",
        handleScroll
      );
    };
  }, []);

  useEffect(() => {
    if (
      !userScrolledUpRef.current
    ) {
      bottomRef.current?.scrollIntoView({
        behavior: "smooth",
      });
    }
  }, [messages]);

  async function sendMessage(
    text: string
  ) {
    if (isGenerating) {
      return;
    }

    const userMessage: Message = {
      role: "user",
      content: text,
    };

    const conversation = [
      ...messages,
      userMessage,
    ];

    setMessages([
      ...conversation,
      {
        role: "assistant",
        content: "",
      },
    ]);

    setIsGenerating(true);

    const controller =
      new AbortController();

    abortControllerRef.current =
      controller;

    try {
      const response = await fetch(
        "/api/chat",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            messages: conversation,
          }),

          signal: controller.signal,
        }
      );

      if (!response.ok) {
        let errorMessage =
          "Failed to get a response.";

        try {
          const errorData =
            await response.json();

          if (errorData?.error) {
            errorMessage =
              errorData.error;
          }
        } catch {
          // Ignore JSON parsing error
        }

        throw new Error(
          errorMessage
        );
      }

      if (!response.body) {
        throw new Error(
          "No response was received."
        );
      }

      const reader =
        response.body.getReader();

      const decoder =
        new TextDecoder();

      let fullResponse = "";

      while (true) {
        const {
          value,
          done,
        } = await reader.read();

        if (done) {
          break;
        }

        const chunk =
          decoder.decode(value, {
            stream: true,
          });

        fullResponse += chunk;
      }

      await typeResponse(
        fullResponse,
        controller.signal
      );
    } catch (error) {
      if (
        error instanceof DOMException &&
        error.name === "AbortError"
      ) {
        return;
      }

      console.error(
        "Chat error:",
        error
      );

      const errorMessage =
        error instanceof Error
          ? error.message
          : "Something went wrong.";

      setMessages(
        (currentMessages) => {
          const updated = [
            ...currentMessages,
          ];

          if (updated.length > 0) {
            updated[
              updated.length - 1
            ] = {
              role: "assistant",
              content: `**Error:** ${errorMessage}`,
            };
          }

          return updated;
        }
      );
    } finally {
      setIsGenerating(false);

      abortControllerRef.current =
        null;
    }
  }

  async function typeResponse(
    response: string,
    signal: AbortSignal
  ) {
    let displayedText = "";

    for (
      const character of response
    ) {
      if (signal.aborted) {
        return;
      }

      displayedText += character;

      setMessages(
        (currentMessages) => {
          const updated = [
            ...currentMessages,
          ];

          if (updated.length > 0) {
            updated[
              updated.length - 1
            ] = {
              role: "assistant",
              content: displayedText,
            };
          }

          return updated;
        }
      );

      await new Promise(
        (resolve) =>
          setTimeout(resolve, 35)
      );
    }
  }

  function stopGenerating() {
    abortControllerRef.current?.abort();

    abortControllerRef.current =
      null;

    setIsGenerating(false);
  }

  return (
    <div
      className="
        flex
        h-[calc(100dvh-64px)]
        flex-col
        bg-white
        text-black
        dark:bg-black
        dark:text-white
      "
    >
      {/* Chat area */}

      <div
        ref={chatContainerRef}
        className="
          flex-1
          overflow-y-auto
          px-3
          py-6
          sm:px-6
        "
      >
        <div
          className="
            mx-auto
            flex
            max-w-4xl
            flex-col
            gap-4
          "
        >
          {/* Empty chat */}

          {messages.length === 0 && (
            <div
              className="
                flex
                min-h-[50vh]
                items-center
                justify-center
              "
            >
              <div className="text-center">
                <h2 className="text-2xl font-bold sm:text-3xl">
                  Welcome {username}
                </h2>

                <p className="mt-2 text-gray-500 dark:text-gray-400">
                  How can I help you today?
                </p>
              </div>
            </div>
          )}

          {/* Messages */}

          {messages.map(
            (message, index) => (
              <ChatMessage
                key={index}
                role={message.role}
                content={message.content}
              />
            )
          )}

          {/* Typing indicator */}

          {isGenerating &&
            messages[
              messages.length - 1
            ]?.content === "" && (
              <div className="flex justify-start">
                <TypingIndicator />
              </div>
            )}

          <div ref={bottomRef} />
        </div>
      </div>

      {/* Input */}

      <ChatInput
        onSend={sendMessage}
        onStop={stopGenerating}
        isGenerating={isGenerating}
      />
    </div>
  );
}

