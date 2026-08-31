export default function TypingIndicator() {
  return (
    <div
      className="
        flex
        items-center
        gap-1
        rounded-2xl
        rounded-bl-md
        bg-gray-100
        px-4
        py-3
        dark:bg-gray-900
      "
    >
      <span className="h-2 w-2 animate-bounce rounded-full [animation-delay:-0.3s]" />

      <span className="h-2 w-2 animate-bounce rounded-full [animation-delay:-0.15s]" />

      <span className="h-2 w-2 animate-bounce rounded-full" />
    </div>
  );
}