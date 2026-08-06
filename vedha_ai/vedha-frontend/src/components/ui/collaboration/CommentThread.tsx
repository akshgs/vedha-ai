import { useState } from "react";
import Button from "@/components/ui/button/Button";

interface Comment {
  id: string;
  author: string;
  text: string;
  timestamp: string;
}

interface CommentThreadProps {
  comments: Comment[];
  onAddComment: (text: string) => void;
}

export default function CommentThread({ comments, onAddComment }: CommentThreadProps) {
  const [text, setText] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!text.trim()) return;
    onAddComment(text);
    setText("");
  }

  return (
    <div className="space-y-4 pt-3 border-t border-slate-900 bg-slate-950/20 rounded-xl p-3.5 mt-2.5">
      {/* List */}
      <div className="space-y-3 max-h-[160px] overflow-y-auto pr-1">
        {comments.map((c) => (
          <div key={c.id} className="text-xs bg-slate-900/40 p-2.5 rounded-xl border border-slate-900">
            <div className="flex justify-between items-center text-[10px] text-slate-500 font-bold">
              <span>{c.author}</span>
              <span>{c.timestamp}</span>
            </div>
            <p className="text-slate-300 mt-1 leading-relaxed">{c.text}</p>
          </div>
        ))}
      </div>

      {/* Write Comment */}
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          placeholder="Write a comment..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="w-full bg-slate-900 border border-slate-850 rounded-xl px-3 py-1.5 text-xs text-white outline-none focus:border-cyan-500"
        />
        <Button type="submit" disabled={!text.trim()} className="text-[10px] py-1 px-4">
          Comment
        </Button>
      </form>
    </div>
  );
}
