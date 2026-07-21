import { useState } from "react";
import { UploadCloud } from "lucide-react";

import Button from "@/components/ui/button/Button";
import {
  uploadResume,
  type ResumeAnalysisResponse,
} from "@/services/resume";

type Props = {
  onAnalysis: (data: ResumeAnalysisResponse) => void;
};

export default function ResumeUploader({
  onAnalysis,
}: Props) {
  const [file, setFile] = useState<File | null>(null);
  const [targetRole, setTargetRole] = useState(
    "Machine Learning Engineer"
  );
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
    } catch (error) {
      console.error(error);
      alert("Resume upload failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-8 space-y-6">
      <div>
        <label className="mb-2 block text-sm font-medium text-slate-300">
          Target Role
        </label>

        <input
          value={targetRole}
          onChange={(e) => setTargetRole(e.target.value)}
          className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-cyan-500"
          placeholder="Machine Learning Engineer"
        />
      </div>

      <div className="rounded-xl border-2 border-dashed border-slate-700 p-8 text-center">
        <UploadCloud className="mx-auto mb-4 h-12 w-12 text-cyan-400" />

        <input
          type="file"
          accept=".pdf"
          onChange={(e) => {
            if (e.target.files?.length) {
              setFile(e.target.files[0]);
            }
          }}
          className="mx-auto"
        />

        <p className="mt-4 text-slate-400">
          Upload your resume (PDF only)
        </p>

        {file && (
          <p className="mt-3 font-medium text-cyan-400">
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