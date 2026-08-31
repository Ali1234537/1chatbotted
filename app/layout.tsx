import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "My Chatbot",
  description: "AI chatbot powered by Groq",
};

const themeScript = `
(function () {
  try {
    const theme = localStorage.getItem("theme");

    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  } catch (error) {}
})();
`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: themeScript,
          }}
        />
      </head>

      <body>{children}</body>
    </html>
  );
}