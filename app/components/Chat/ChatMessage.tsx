"use client";

import {
  Check,
  Copy,
} from "lucide-react";

import {
  useState,
} from "react";

import ReactMarkdown from "react-markdown";

import remarkGfm from "remark-gfm";

import {
  Prism as SyntaxHighlighter,
} from "react-syntax-highlighter";

import {
  oneDark,
} from "react-syntax-highlighter/dist/esm/styles/prism";

type ChatMessageProps = {
  role: "user" | "assistant";
  content: string;
};

export default function ChatMessage({
  role,
  content,
}: ChatMessageProps) {
  const isUser =
    role === "user";

  return (
    <div
      className={`flex w-full ${
        isUser
          ? "justify-end"
          : "justify-start"
      }`}
    >
      <div
        className={`
          max-w-[90%]
          rounded-2xl
          px-4
          py-3
          text-sm
          leading-7
          sm:max-w-[80%]
          sm:text-base
          ${
            isUser
              ? `
                rounded-br-md
                bg-black
                text-white
                dark:bg-white
                dark:text-black
              `
              : `
                rounded-bl-md
                bg-gray-100
                text-black
                dark:bg-gray-900
                dark:text-white
              `
          }
        `}
      >
        {isUser ? (
          <p className="whitespace-pre-wrap break-words">
            {content}
          </p>
        ) : (
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              h1({ children }) {
                return (
                  <h1 className="mb-4 text-2xl font-bold">
                    {children}
                  </h1>
                );
              },

              h2({ children }) {
                return (
                  <h2 className="mb-3 mt-5 text-xl font-bold">
                    {children}
                  </h2>
                );
              },

              h3({ children }) {
                return (
                  <h3 className="mb-2 mt-4 text-lg font-bold">
                    {children}
                  </h3>
                );
              },

              p({ children }) {
                return (
                  <p className="mb-3 last:mb-0">
                    {children}
                  </p>
                );
              },

              ul({ children }) {
                return (
                  <ul className="mb-3 list-disc space-y-1 pl-6">
                    {children}
                  </ul>
                );
              },

              ol({ children }) {
                return (
                  <ol className="mb-3 list-decimal space-y-1 pl-6">
                    {children}
                  </ol>
                );
              },

              li({ children }) {
                return (
                  <li>{children}</li>
                );
              },

              blockquote({ children }) {
                return (
                  <blockquote className="my-3 border-l-4 border-gray-400 pl-4 italic">
                    {children}
                  </blockquote>
                );
              },

              table({ children }) {
                return (
                  <div className="my-4 overflow-x-auto">
                    <table className="w-full min-w-[500px] border-collapse text-sm">
                      {children}
                    </table>
                  </div>
                );
              },

              thead({ children }) {
                return (
                  <thead>
                    {children}
                  </thead>
                );
              },

              tbody({ children }) {
                return (
                  <tbody>
                    {children}
                  </tbody>
                );
              },

              tr({ children }) {
                return (
                  <tr>
                    {children}
                  </tr>
                );
              },

              th({ children }) {
                return (
                  <th
                    className="
                      border
                      border-gray-300
                      bg-gray-200
                      px-3
                      py-2
                      text-left
                      font-semibold
                      dark:border-gray-700
                      dark:bg-gray-800
                    "
                  >
                    {children}
                  </th>
                );
              },

              td({ children }) {
                return (
                  <td
                    className="
                      border
                      border-gray-300
                      px-3
                      py-2
                      dark:border-gray-700
                    "
                  >
                    {children}
                  </td>
                );
              },

              code({
                className,
                children,
              }) {
                const match =
                  /language-(\w+)/.exec(
                    className || ""
                  );

                const code = String(
                  children
                ).replace(/\n$/, "");

                if (match) {
                  return (
                    <CodeBlock
                      language={match[1]}
                      code={code}
                    />
                  );
                }

                return (
                  <code
                    className="
                      rounded
                      bg-gray-200
                      px-1.5
                      py-0.5
                      font-mono
                      text-sm
                      dark:bg-gray-800
                    "
                  >
                    {children}
                  </code>
                );
              },
            }}
          >
            {content}
          </ReactMarkdown>
        )}
      </div>
    </div>
  );
}

function CodeBlock({
  language,
  code,
}: {
  language: string;
  code: string;
}) {
  const [copied, setCopied] =
    useState(false);

  async function copyCode() {
    try {
      await navigator.clipboard.writeText(
        code
      );

      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 1500);
    } catch (error) {
      console.error(
        "Copy failed:",
        error
      );
    }
  }

  return (
    <div className="my-4 overflow-hidden rounded-xl">
      <div
        className="
          flex
          items-center
          justify-between
          bg-gray-800
          px-3
          py-2
          text-xs
          text-white
        "
      >
        <span>{language}</span>

        <button
          type="button"
          onClick={copyCode}
          className="
            flex
            items-center
            gap-1
            rounded
            px-2
            py-1
            hover:bg-gray-700
          "
        >
          {copied ? (
            <>
              <Check size={15} />
              Copied
            </>
          ) : (
            <>
              <Copy size={15} />
              Copy
            </>
          )}
        </button>
      </div>

      <SyntaxHighlighter
        language={language}
        style={oneDark}
        customStyle={{
          margin: 0,
          borderRadius: 0,
          fontSize: "13px",
        }}
      >
        {code}
      </SyntaxHighlighter>
    </div>
  );
}