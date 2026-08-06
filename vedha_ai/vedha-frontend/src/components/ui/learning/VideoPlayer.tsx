import { useState, useRef } from "react";
import { Play } from "lucide-react";
import Card from "@/components/ui/card/Card";

interface VideoPlayerProps {
  url: string;
  onEnded?: () => void;
}

export default function VideoPlayer({ url, onEnded }: VideoPlayerProps) {
  const [playing, setPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  function togglePlay() {
    if (!videoRef.current) return;
    if (playing) {
      videoRef.current.pause();
    } else {
      void videoRef.current.play();
    }
    setPlaying(!playing);
  }

  return (
    <Card variant="glass" className="relative aspect-video overflow-hidden bg-slate-950 flex flex-col group border-slate-800">
      <video
        ref={videoRef}
        src={url}
        className="w-full h-full object-cover"
        onEnded={() => {
          setPlaying(false);
          if (onEnded) onEnded();
        }}
        onClick={togglePlay}
      />
      {/* Overlay Play State */}
      {!playing && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/40 cursor-pointer" onClick={togglePlay}>
          <div className="h-14 w-14 rounded-full bg-cyan-500 hover:bg-cyan-400 text-white flex items-center justify-center shadow-lg transition duration-300 transform group-hover:scale-105">
            <Play size={24} className="fill-current ml-1" />
          </div>
        </div>
      )}
    </Card>
  );
}
