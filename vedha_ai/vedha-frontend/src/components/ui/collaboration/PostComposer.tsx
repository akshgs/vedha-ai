import { useState } from "react";
import { Send, Image, Link } from "lucide-react";
import Card from "@/components/ui/card/Card";
import Button from "@/components/ui/button/Button";

interface PostComposerProps {
  onPost: (text: string) => void;
  placeholder?: string;
}

export default function PostComposer({ onPost, placeholder = "Share an update, paper citation, or query..." }: PostComposerProps) {
  const [text, setText] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!text.trim()) return;
    onPost(text);
    setText("");
  }

  return (
    <Card variant="glass" className="p-4 space-y-3">
      <form onSubmit={handleSubmit} className="space-y-3">
        <textarea
          placeholder={placeholder}
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="w-full bg-slate-950/60 border border-slate-850 rounded-xl p-3 text-xs text-slate-350 outline-none focus:border-cyan-500 resize-none h-20 focus:ring-1 focus:ring-cyan-550/10"
        />

        <div className="flex justify-between items-center border-t border-slate-900 pt-2.5">
          <div className="flex gap-2 text-slate-500">
            <button type="button" className="p-1.5 hover:text-white transition" title="Add Image">
              <Image size={14} />
            </button>
            <button type="button" className="p-1.5 hover:text-white transition" title="Add Link">
              <Link size={14} />
            </button>
          </div>
          <Button type="submit" disabled={!text.trim()} className="text-xs py-1.5 px-5 flex items-center gap-1.5">
            <Send size={11} />
            Post Update
          </Button>
        </div>
      </form>
    </Card>
  );
}
