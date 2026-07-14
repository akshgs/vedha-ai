import { useState } from "react";
import { UploadCloud } from "lucide-react";

import Button from "@/components/ui/button/Button";
import { uploadResume } from "@/services/resume";

type Props = {
  onAnalysis: (data: any) => void;
};

export default function ResumeUploader({
  onAnalysis,
}: Props) {
  const [file, setFile] = useState<File | null>(null);

  const [targetRole, setTargetRole] =
    useState("Machine Learning Engineer");

  const [loading, setLoading] = useState(false);

  async function handleUpload() {
    if (!file) return;

    try {
      setLoading(true);

      const result = await uploadResume(
        file,
        targetRole
      );

      onAnalysis(result);
    } catch (err) {
      console.error(err);

      alert("Resume upload failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6 rounded-2xl border border-slate-800 bg-slate-900 p-8">
      <div>
        <label className="mb-2 block text-sm text-slate-400">
          Target Role
        </label>

        <input
          value={targetRole}
          onChange={(e) =>
            setTargetRole(e.target.value)
          }
          className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 outline-none"
        />
      </div>

      <div>
        <input
          type="file"
          accept=".pdf"
          onChange={(e) => {
            if (e.target.files?.length) {
              setFile(e.target.files[0]);
            }
          }}
        />

        {file && (
          <p className="mt-3 text-cyan-400">
            {file.name}
          </p>
        )}
      </div>

      <Button
        onClick={handleUpload}
        disabled={!file || loading}
      >
        <UploadCloud className="mr-2 h-5 w-5" />

        {loading
          ? "Analyzing Resume..."
          : "Analyze Resume"}
      </Button>
    </div>
  );
}