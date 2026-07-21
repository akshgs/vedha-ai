import ChatWindow from "@/components/chatbot/ChatWindow";

export default function ChatAssistant() {
  return (
    <div className="min-h-screen bg-slate-950 p-8">
      <div className="mx-auto max-w-5xl">
        <h1 className="mb-2 text-4xl font-bold text-white">
          🤖 Vedha AI Career Assistant
        </h1>

        <p className="mb-8 text-slate-400">
          Ask anything about your resume, roadmap, jobs or interviews.
        </p>

        <ChatWindow />
      </div>
    </div>
  );
}