interface Props {
  sender: string;
  text: string;
}

export default function ChatMessage({
  sender,
  text,
}: Props) {
  const isBot = sender === "bot";

  return (
    <div
      className={`flex ${
        isBot ? "justify-start" : "justify-end"
      }`}
    >
      <div
        className={`max-w-lg rounded-2xl px-4 py-3 ${
          isBot
            ? "bg-slate-800 text-white"
            : "bg-cyan-600 text-white"
        }`}
      >
        {text}
      </div>
    </div>
  );
}