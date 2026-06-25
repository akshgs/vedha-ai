// app/interview/page.tsx — Standalone High-Tech AI Interview Simulator
"use client";
import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/auth-store";
import { interviewAPI } from "@/lib/api";
import {
  Card,
  Button,
  Select,
  Progress,
  Tag,
  Upload,
  App,
  Skeleton,
  List,
  Alert,
  ConfigProvider,
  theme
} from "antd";
import { motion, AnimatePresence } from "framer-motion";
import {
  Video,
  Play,
  Square,
  UploadCloud,
  ChevronLeft,
  Cpu,
  Clock,
  CheckCircle,
  AlertCircle,
  Sparkles,
  Terminal,
  Activity,
  FileText,
  Bookmark
} from "lucide-react";

export default function StandaloneInterviewPage() {
  const { message } = App.useApp();
  const router = useRouter();
  const { user, loadFromStorage } = useAuthStore();

  // Roles list matching backend database
  const ROLES_LIST = [
    "Machine Learning Engineer",
    "Data Scientist",
    "Python Developer",
    "Full Stack Developer",
    "DevOps Engineer",
    "Cloud Engineer"
  ];

  const [selectedRole, setSelectedRole] = useState("Machine Learning Engineer");
  const [questions, setQuestions] = useState<string[]>([]);
  const [activeQuestion, setActiveQuestion] = useState<string | null>(null);
  const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);
  const [loadingQuestions, setLoadingQuestions] = useState(false);

  // Recorder states
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [mediaStream, setMediaStream] = useState<MediaStream | null>(null);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [recordedChunks, setRecordedChunks] = useState<Blob[]>([]);
  const [recordedFile, setRecordedFile] = useState<File | null>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  // Results & submission state
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<any>(null);

  const videoPreviewRef = useRef<HTMLVideoElement>(null);
  const recordIntervalRef = useRef<any>(null);

  const uploadedFileList = uploadedFile
    ? [
        {
          uid: "-1",
          name: uploadedFile.name,
          status: "done" as const,
          originFileObj: uploadedFile as any,
        },
      ]
    : [];

  useEffect(() => {
    loadFromStorage();
    document.body.classList.add("light-theme");
    return () => {
      document.body.classList.remove("light-theme");
    };
  }, []);

  useEffect(() => {
    if (user) {
      if (user.role !== "student") {
        router.push(`/${user.role}`);
      } else {
        fetchQuestions(selectedRole);
      }
    }
  }, [user, selectedRole]);

  const fetchQuestions = async (role: string) => {
    setLoadingQuestions(true);
    setResult(null);
    setActiveQuestion(null);
    setQuestions([]);
    try {
      const res = await interviewAPI.questions(role);
      const fetched = res.data.questions || [];
      setQuestions(fetched);
      if (fetched.length > 0) {
        setActiveQuestion(fetched[0]);
        setActiveQuestionIndex(0);
      }
    } catch {
      message.error("Failed to load interview questions.");
    } finally {
      setLoadingQuestions(false);
    }
  };

  // Camera handling
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 1280, height: 720 },
        audio: true
      });
      setMediaStream(stream);
      if (videoPreviewRef.current) {
        videoPreviewRef.current.srcObject = stream;
      }
      return stream;
    } catch (e) {
      message.error("Permission denied. Ensure camera & mic access are allowed.");
      return null;
    }
  };

  const stopCamera = () => {
    if (mediaStream) {
      mediaStream.getTracks().forEach((track) => track.stop());
      setMediaStream(null);
    }
  };

  const startRecording = async () => {
    const stream = await startCamera();
    if (!stream) return;

    const recorder = new MediaRecorder(stream, { mimeType: "video/webm" });
    const chunks: Blob[] = [];

    recorder.ondataavailable = (e) => {
      if (e.data && e.data.size > 0) {
        chunks.push(e.data);
      }
    };

    recorder.onstop = () => {
      const blob = new Blob(chunks, { type: "video/webm" });
      const file = new File([blob], "interview_response.webm", { type: "video/webm" });
      setRecordedFile(file);
    };

    setRecordedChunks([]);
    setRecordedFile(null);
    setMediaRecorder(recorder);
    recorder.start(1000);

    setIsRecording(true);
    setRecordingSeconds(0);

    recordIntervalRef.current = setInterval(() => {
      setRecordingSeconds((prev) => prev + 1);
    }, 1000);
  };

  const stopRecording = () => {
    if (mediaRecorder && mediaRecorder.state !== "inactive") {
      mediaRecorder.stop();
    }
    setIsRecording(false);
    clearInterval(recordIntervalRef.current);
    stopCamera();
    message.success("Recording finalized! Ready to upload.");
  };

  const submitInterviewResponse = async () => {
    if (!user || !activeQuestion) return;
    
    let fileToUpload = uploadedFile || recordedFile;

    if (!fileToUpload) {
      message.warning("Please record a response or select an interview file first.");
      return;
    }

    setSubmitting(true);
    setResult(null);

    const formData = new FormData();
    formData.append("video", fileToUpload);
    formData.append("question", activeQuestion);
    formData.append("role", selectedRole);
    formData.append("student_id", user.id.toString());

    try {
      const res = await interviewAPI.analyze(formData);
      setResult(res.data);
      message.success("Mock feedback scorecard generated!");
    } catch (err: any) {
      message.error(err.response?.data?.detail || "Error evaluating mock video response.");
    } finally {
      setSubmitting(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center text-slate-800">
        <Skeleton active paragraph={{ rows: 6 }} className="max-w-md bg-white p-8 rounded-3xl shadow-sm border border-slate-200" />
      </div>
    );
  }

  return (
    <ConfigProvider
      theme={{
        algorithm: theme.defaultAlgorithm,
        token: {
          colorPrimary: "#6366f1",
          borderRadius: 20,
        },
      }}
    >
      <div className="min-h-screen bg-[#F4F5F7] text-[#0F172A] font-sans flex flex-col relative light-theme">
        {/* Background decorations */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl -z-10" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl -z-10" />

        {/* Header */}
        <header className="bg-white/60 backdrop-blur-md border-b border-slate-200/80 px-6 py-4 flex items-center justify-between h-16 relative z-10">
          <div className="flex items-center gap-4">
            <Button
              onClick={() => router.push("/student")}
              icon={<ChevronLeft size={16} />}
              className="bg-[#F1F5F9] border-slate-200/60 text-slate-700 hover:text-indigo-600 rounded-xl font-bold text-xs h-9 cursor-pointer"
            >
              Back to Dashboard
            </Button>
            <h1 className="text-lg font-black bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent flex items-center gap-2">
              ⚡ Standalone AI Interview Simulation
            </h1>
          </div>
          <div className="text-right">
            <span className="text-[10px] text-slate-400 block font-semibold uppercase tracking-wider">CANDIDATE</span>
            <p className="text-xs text-slate-800 font-extrabold">{user.name}</p>
          </div>
        </header>

        <main className="flex-1 max-w-6xl w-full mx-auto p-6 md:p-8 grid grid-cols-1 lg:grid-cols-3 gap-8 relative z-10">
          
          {/* Left Column: Loop configurations and Questions list */}
          <div className="space-y-6">
            <Card
              className="light-panel border-[#e2e8f0]/60"
              title={<span className="text-slate-800 font-extrabold text-sm flex items-center gap-2"><Cpu size={16} className="text-indigo-500" /> Choose target benchmark</span>}
            >
              <div className="space-y-4">
                <div>
                  <span className="text-xs text-[#64748B] font-semibold block mb-2">Hiring Role Category</span>
                  <Select
                    value={selectedRole}
                    onChange={(val) => setSelectedRole(val)}
                    className="w-full"
                    size="large"
                    options={ROLES_LIST.map((r) => ({ value: r, label: r }))}
                  />
                </div>
              </div>
            </Card>

            <Card
              className="light-panel border-[#e2e8f0]/60"
              title={<span className="text-slate-800 font-extrabold text-sm">Role Question Bank</span>}
            >
              {loadingQuestions ? (
                <Skeleton active paragraph={{ rows: 4 }} />
              ) : (
                <List
                  dataSource={questions}
                  renderItem={(q, idx) => {
                    const isActive = activeQuestion === q;
                    return (
                      <List.Item
                        onClick={() => {
                          setActiveQuestion(q);
                          setActiveQuestionIndex(idx);
                          setResult(null);
                        }}
                        className={`cursor-pointer px-4 py-3 rounded-2xl transition-all border-none my-1 select-none ${
                          isActive
                            ? "bg-indigo-50 text-indigo-600 font-bold border-l-4 border-indigo-500"
                            : "text-[#64748B] hover:text-[#0F172A] hover:bg-[#F1F5F9]"
                        }`}
                      >
                        <div className="flex gap-2 text-xs items-center">
                          <span className={`${isActive ? "text-indigo-600" : "text-[#64748B]"} font-mono font-bold`}>Q{idx + 1}.</span>
                          <span className="truncate max-w-[200px] font-semibold">{q}</span>
                        </div>
                      </List.Item>
                    );
                  }}
                />
              )}
            </Card>
          </div>

          {/* Middle Column: Interactive loop camera & actions */}
          <div className="lg:col-span-2 space-y-6">
            {activeQuestion ? (
              <>
                {/* Question preview bar */}
                <Card className="light-panel border-indigo-100 bg-gradient-to-r from-violet-950 via-slate-900 to-indigo-950 text-white rounded-[24px] overflow-hidden relative border-none light-glow-indigo">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl -z-10" />
                  <div className="flex justify-between items-start gap-4">
                    <div>
                      <Tag color="indigo" className="mb-2 uppercase text-[10px] font-extrabold bg-indigo-500/20 text-indigo-200 border-none">
                        Question {activeQuestionIndex + 1} of {questions.length}
                      </Tag>
                      <h3 className="text-base font-bold text-white leading-relaxed">{activeQuestion}</h3>
                    </div>
                    <Tag color="purple" className="uppercase text-[10px] font-extrabold bg-purple-500/20 text-purple-200 border-none shrink-0">
                      AI Active Loop
                    </Tag>
                  </div>
                </Card>

                {/* Camera view screen */}
                <Card className="light-panel border-[#e2e8f0]/60 overflow-hidden relative">
                  <div className="w-full aspect-video bg-slate-950 border border-slate-800 rounded-2xl relative overflow-hidden flex items-center justify-center">
                    {mediaStream ? (
                      <video ref={videoPreviewRef} autoPlay playsInline muted className="w-full h-full object-cover" />
                    ) : (
                      <div className="text-center space-y-2 text-slate-400">
                        <Video size={40} className="mx-auto text-slate-600 animate-pulse" />
                        <span className="text-xs block font-semibold">Camera feed offline. Ready to start response loop.</span>
                      </div>
                    )}
                    {isRecording && (
                      <div className="absolute top-4 left-4 bg-red-600/90 border border-red-500 text-white font-bold text-xs px-3 py-1.5 rounded-xl flex items-center gap-2 animate-pulse">
                        <span className="w-2 h-2 bg-white rounded-full" /> REC {recordingSeconds}s
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col sm:flex-row justify-between items-center mt-6 gap-4">
                    <div className="flex gap-3">
                      {!isRecording ? (
                        <Button
                          type="primary"
                          danger
                          icon={<Play size={14} />}
                          onClick={startRecording}
                          className="bg-red-600 hover:bg-red-500 border-none rounded-xl text-xs font-bold cursor-pointer h-10 px-5 shadow-lg shadow-red-650/30"
                        >
                          Start Loop Recording
                        </Button>
                      ) : (
                        <Button
                          type="primary"
                          icon={<Square size={14} />}
                          onClick={stopRecording}
                          className="bg-slate-900 text-white hover:bg-slate-800 border-none rounded-xl text-xs font-bold cursor-pointer h-10 px-5"
                        >
                          Stop Recording
                        </Button>
                      )}
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-xs text-[#64748B] font-bold">Or drag video file:</span>
                      <Upload
                        beforeUpload={(file) => {
                          setUploadedFile(file);
                          setRecordedFile(null);
                          message.success(`File ${file.name} selected!`);
                          return false;
                        }}
                        maxCount={1}
                        onRemove={() => setUploadedFile(null)}
                        fileList={uploadedFileList}
                      >
                        <Button size="small" icon={<UploadCloud size={12} />} className="text-xs bg-slate-50 border-slate-200 text-slate-700 hover:text-indigo-600 hover:bg-slate-100 rounded-xl h-9">
                          Select Video (.mp4, .webm)
                        </Button>
                      </Upload>
                    </div>
                  </div>

                  {(recordedFile || uploadedFile) && (
                    <Alert
                      type="info"
                      showIcon
                      className="bg-indigo-50 border-indigo-150 text-indigo-900 rounded-2xl mt-4 p-3.5 text-xs font-semibold"
                      message={
                        <div className="flex justify-between items-center">
                          <span>
                            Response payload loaded: <strong>{recordedFile ? "Recorded WebM Stream" : uploadedFile?.name}</strong>
                          </span>
                          <Button
                            type="primary"
                            loading={submitting}
                            onClick={submitInterviewResponse}
                            className="bg-emerald-600 hover:bg-emerald-500 text-white border-none rounded-xl text-xs font-extrabold shadow-md shadow-emerald-600/20 h-9 px-4 cursor-pointer"
                          >
                            Submit Response
                          </Button>
                        </div>
                      }
                    />
                  )}
                </Card>

                {/* Simulation Result scorecard */}
                <AnimatePresence mode="wait">
                  {result && (
                    <motion.div
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -15 }}
                      className="grid grid-cols-1 md:grid-cols-3 gap-6"
                    >
                      <Card
                        title={<span className="text-slate-800 font-extrabold text-sm">Recruiter Scorecard</span>}
                        className="light-panel border-[#e2e8f0]/60 text-center flex flex-col justify-between"
                      >
                        <div className="py-2">
                          <span className="text-[10px] text-slate-400 font-semibold uppercase block mb-1">Feedback Score</span>
                          <span className="text-5xl font-black text-emerald-600 my-4 block">{result.overall_score}/100</span>
                        </div>
                        <div className="border-t border-slate-100 pt-4 text-left space-y-3 text-xs text-slate-600 font-semibold">
                          <div className="flex justify-between">
                            <span>Eye Contact:</span>
                            <span className="text-slate-800 font-extrabold">{result.video_analysis?.eye_contact_percent}%</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Posture Score:</span>
                            <span className="text-slate-800 font-extrabold">{result.video_analysis?.posture_score}%</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Filler Rate:</span>
                            <span className="text-slate-800 font-extrabold">{result.filler_analysis?.filler_rate}%</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Filler Count:</span>
                            <span className="text-slate-800 font-extrabold">{result.filler_analysis?.total_fillers}</span>
                          </div>
                        </div>
                      </Card>

                      <Card
                        title={<span className="text-slate-800 font-extrabold text-sm">Speech Transcript</span>}
                        className="light-panel border-[#e2e8f0]/60 md:col-span-2 text-xs flex flex-col"
                      >
                        <div className="flex-1 overflow-y-auto max-h-[160px] pr-1 leading-relaxed text-slate-600 italic font-medium">
                          "{result.transcript || "No audible candidate speech transcribed."}"
                        </div>
                      </Card>

                      <Card
                        title={<span className="text-slate-800 font-extrabold text-sm">AI Critiques & Ideal Response Blueprint</span>}
                        className="light-panel border-[#e2e8f0]/60 md:col-span-3 text-xs"
                      >
                        <div className="leading-relaxed text-slate-700 whitespace-pre-line overflow-y-auto max-h-[250px] pr-1 font-medium">
                          {result.answer_feedback}
                        </div>
                      </Card>
                    </motion.div>
                  )}
                </AnimatePresence>
              </>
            ) : (
              <Card className="light-panel border-[#e2e8f0]/60 text-center py-16">
                <Sparkles size={48} className="mx-auto text-indigo-500 mb-4 animate-bounce" />
                <h3 className="text-lg font-extrabold text-slate-800">Select a mock question to start the simulation</h3>
                <p className="text-xs text-[#64748B] font-semibold mt-2 max-w-sm mx-auto">
                  Generate questions using the role target and click a question on the left to activate your camera.
                </p>
              </Card>
            )}
          </div>

        </main>
      </div>
    </ConfigProvider>
  );
}