import { ElementRef, useEffect, useRef, useState } from "react";
import WaveSurfer from "wavesurfer.js";
import { MessageType } from "@/utils/types";
import { HOST } from "@/actions/api.route";
import { Pause, Play } from "lucide-react";
import { cn } from "@/lib/utils";

interface AudioMessageProps {
  message: MessageType;
  isOwn: boolean;
}

function AudioMessage({ message, isOwn }: AudioMessageProps) {
  const [audioMessage, setAudioMessage] = useState<HTMLAudioElement>();
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentPlaybackTime, setCurrentPlaybackTime] = useState(0);
  const [totalDuration, setTotalDuration] = useState(0);

  const waveFormRef = useRef<ElementRef<"div"> | HTMLDivElement>(null);
  const waveform = useRef<WaveSurfer>();

  useEffect(() => {
    waveform.current = WaveSurfer.create({
      container: waveFormRef.current!,
      waveColor: "#ccc",
      progressColor: "#10b981",
      cursorColor: "#7ae3c3",
      barWidth: 3,
      barGap: 2,
      barRadius: 3,
      height: 40,
    });

    waveform.current.on("finish", () => {
      setIsPlaying(false);
    });

    return () => {
      if(waveform.current)
        waveform?.current?.destroy();
    };
  }, []);

  useEffect(() => {
    const audioURL = `${HOST}/${message.content}`;
    const audio = new Audio(audioURL);
    setAudioMessage(audio);
    
    waveform.current?.load(audioURL);
    waveform.current?.on("ready", () => {
      setTotalDuration(waveform.current?.getDuration()!);
    });
    
  }, [message]);

  useEffect(() => {
    if (!audioMessage) return;

    const updatePlaybackTime = () => {
      setCurrentPlaybackTime(audioMessage.currentTime);
    };

    audioMessage.addEventListener("timeupdate", updatePlaybackTime);

    return () => {
      audioMessage.removeEventListener("timeupdate", updatePlaybackTime);
    };
  }, [audioMessage]);

  const formatTime = (time: number) => {
    if (isNaN(time)) return "00:00:00";

    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
  };

  const handlePlayAudio = () => {
    if (!audioMessage) return;
    waveform.current?.stop();
    waveform.current?.play();
    audioMessage.play();
    setIsPlaying(true);
  };

  const handlePauseAudio = () => {
    waveform.current?.stop();
    audioMessage?.pause();
    setIsPlaying(false);
  };

  return (
    <div className="flex flex-col w-full max-w-[320px] leading-1.5 py-2 rounded-e-xl rounded-es-xl">
      <div className={cn(
        "flex gap-4 items-center space-x-2 rtl:space-x-reverse",
        isOwn ? "flex-row-reverse" : "",
      )}>
        <button
          className="inline-flex self-center items-center p-2 text-sm font-medium text-center text-gray-900 rounded-lg hover:bg-gray-100 focus:ring-4 focus:outline-none dark:text-white focus:ring-gray-50 dark:hover:bg-gray-600 dark:focus:ring-gray-600"
          type="button"
          onClick={isPlaying ? handlePauseAudio : handlePlayAudio}
        >
          {isPlaying ? (
            <Pause className="text-gray-800 dark:text-white" size={22} />
          ) : (
            <Play className="text-gray-800 dark:text-white" size={22} />
          )}
        </button>
        <div className="w-full" ref={waveFormRef} />
        <span className="inline-flex self-center items-center p-2 text-sm font-medium text-gray-900 dark:text-white">
          {formatTime(isPlaying ? currentPlaybackTime : totalDuration)}
        </span>
      </div>
    </div>
  );
}

export default AudioMessage;
