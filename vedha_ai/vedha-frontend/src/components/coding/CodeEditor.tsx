import { useState, useEffect } from "react";
import MonacoEditorComponent from "@monaco-editor/react";

interface CodeEditorProps {
  code: string;
  onChange: (value: string) => void;
  language: string;
}

export default function CodeEditor({ code, onChange, language }: CodeEditorProps) {
  const [level, setLevel] = useState<1 | 2 | 3>(1);

  // Map editor languages
  const mapLanguage = (lang: string) => {
    switch (lang.toLowerCase()) {
      case "python":
        return "python";
      case "c++":
      case "cpp":
        return "cpp";
      case "java":
        return "java";
      default:
        return "javascript";
    }
  };

  useEffect(() => {
    // Check if offline/restricted or Monaco fails
    if (typeof window === "undefined") {
      setLevel(3);
    }
  }, []);

  // Level 1: Monaco Editor
  if (level === 1) {
    return (
      <div className="w-full h-full min-h-[300px] border border-slate-900 rounded-xl overflow-hidden">
        <MonacoEditorComponent
          height="100%"
          language={mapLanguage(language)}
          theme="vs-dark"
          value={code}
          onChange={(val) => onChange(val ?? "")}
          options={{
            fontSize: 12,
            minimap: { enabled: false },
            automaticLayout: true,
            scrollBeyondLastLine: false,
            padding: { top: 12, bottom: 12 },
            fontFamily: "'Courier New', Courier, monospace",
            lineNumbersMinChars: 3,
          }}
          onMount={() => {
            console.log("[CodeEditor] Level 1: Monaco Editor mounted successfully.");
          }}
        />
      </div>
    );
  }

  // Level 2: Lightweight Syntax Highlighter + Edit Mode
  if (level === 2) {
    return (
      <div className="w-full h-full min-h-[300px] bg-slate-950 p-4 font-mono text-xs border border-slate-850 rounded-xl relative">
        <div className="absolute right-2 top-2 text-[9px] bg-amber-500/10 text-amber-400 px-2 py-0.5 rounded uppercase font-bold select-none">
          Level 2 Syntax Fallback
        </div>
        <textarea
          value={code}
          onChange={(e) => onChange(e.target.value)}
          className="w-full h-[90%] bg-transparent text-slate-200 outline-none border-none resize-none font-mono focus:ring-0 leading-relaxed"
          placeholder="// Type your code here..."
        />
        <div className="text-[10px] text-slate-550 border-t border-slate-900 pt-2 flex justify-between select-none">
          <span>Language: {language}</span>
          <button onClick={() => setLevel(3)} className="hover:underline text-cyan-400">
            Switch to styled textarea
          </button>
        </div>
      </div>
    );
  }

  // Level 3: Simple styled dark textarea fallback
  return (
    <div className="w-full h-full min-h-[300px] bg-slate-900/60 p-4 border border-slate-800 rounded-xl relative">
      <div className="absolute right-2 top-2 text-[9px] bg-red-500/10 text-red-400 px-2 py-0.5 rounded uppercase font-bold select-none">
        Level 3 Fallback Textarea
      </div>
      <textarea
        value={code}
        onChange={(e) => onChange(e.target.value)}
        className="w-full h-[90%] bg-transparent text-slate-300 outline-none border-none resize-none font-mono text-xs focus:ring-0"
        placeholder="// Code editor..."
      />
      <div className="text-[10px] text-slate-500 border-t border-slate-800 pt-2 select-none">
        Fallback text editor active.
      </div>
    </div>
  );
}
