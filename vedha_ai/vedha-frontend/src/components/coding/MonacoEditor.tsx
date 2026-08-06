import { useEffect, useState } from "react";
import MonacoEditorComponent from "@monaco-editor/react";

interface MonacoEditorProps {
  code: string;
  onChange: (value: string) => void;
  language: string;
}

export default function MonacoEditor({ code, onChange, language }: MonacoEditorProps) {
  const [editorReady, setEditorReady] = useState(false);

  // Map editor language identifiers
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
    setEditorReady(true);
  }, []);

  if (!editorReady) {
    return (
      <textarea
        value={code}
        onChange={(e) => onChange(e.target.value)}
        className="w-full h-full bg-slate-950 font-mono text-[11px] leading-relaxed text-slate-200 p-4 outline-none border-none resize-none focus:ring-0"
      />
    );
  }

  return (
    <div className="w-full h-full min-h-[300px]">
      <MonacoEditorComponent
        height="100%"
        language={mapLanguage(language)}
        theme="vs-dark"
        value={code}
        onChange={(value) => onChange(value ?? "")}
        options={{
          fontSize: 12,
          minimap: { enabled: false },
          automaticLayout: true,
          scrollBeyondLastLine: false,
          padding: { top: 12, bottom: 12 },
          fontFamily: "'Courier New', Courier, monospace",
          lineNumbersMinChars: 3,
        }}
      />
    </div>
  );
}
