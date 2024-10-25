import { ElementRef, useEffect, useRef, useState } from "react";
import WaveSurfer from "wavesurfer.js";

import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import {
  Check,
  Mic,
  Mic2,
  PauseOctagon,
  Play,
  Squircle,
  Trash,
} from "lucide-react";
import { useStateProvider } from "@/context/state-context";
import { cn } from "@/lib/utils";
import { addAudioMessage } from "@/actions/message.api";
import { reducerCases } from "@/context/constants";
import { toast } from "sonner";

interface MicroPickerProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

function MicroPicker({ open, setOpen }: MicroPickerProps) {
  const [{ userInfo, currentChatUser, socket }, dispatch] = useStateProvider();

  const [isPlaying, setIsPlaying] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordedAudio, setRecordedAudio] = useState<HTMLAudioElement>();
  const [renderedAudio, setRenderedAudio] = useState<File>();
  const [waveform, setWaveform] = useState<WaveSurfer>();
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [currentPlaybackTime, setCurrentPlaybackTime] = useState(0);
  const [totalDuration, setTotalDuration] = useState(0);

  const audioRef = useRef<ElementRef<"audio"> | any>();
  const mediaRecorderRed = useRef<MediaRecorder>();
  const waveFormRef = useRef<ElementRef<"div"> | HTMLDivElement>(null);

  useEffect(() => {
    if (!waveFormRef.current) return;
    const wavesurfer = WaveSurfer.create({
      container: waveFormRef.current || "waveform",
      waveColor: "#ccc",
      progressColor: "#10b981",
      cursorColor: "#7ae3c3",
      barWidth: 3,
      barGap: 2,
      barRadius: 3,
      height: 120,
    });

    setWaveform(wavesurfer);

    wavesurfer.on("finish", () => {
      setIsPlaying(false);
    });

    return () => {
      wavesurfer.destroy();
    };
  }, [waveFormRef.current]);

  useEffect(() => {
    if (waveform) handleStartRecording();
  }, [waveform]);

  useEffect(() => {
    if (open) {
      document.getElementById("code")!.style.scale = ".95";
    } else {
      document.getElementById("code")!.style.scale = "1";
    }
  }, [open]);

  useEffect(() => {
    if (!recordedAudio) return;

    const updatePlaybackTime = () => {
      setCurrentPlaybackTime(recordedAudio.currentTime);
    };

    recordedAudio.addEventListener("timeupdate", updatePlaybackTime);

    return () => {
      recordedAudio.removeEventListener("timeupdate", updatePlaybackTime);
    };
  }, [recordedAudio]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRecording) {
      interval = setInterval(() => {
        setRecordingDuration((prev) => {
          setTotalDuration(prev + 1);
          return prev + 1;
        });
      }, 1000);
    }

    return () => {
      clearInterval(interval);
    };
  }, [isRecording]);

  const formatTime = (time: number) => {
    if (isNaN(time)) return "00:00:00";

    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `00:${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
  };

  const handlePlayRecording = () => {
    if (!recordedAudio) return;
    waveform?.stop();
    waveform?.play();
    recordedAudio.play();
    setIsPlaying(true);
  };

  const handlePauseRecording = () => {
    waveform?.stop();
    recordedAudio?.pause();
    setIsPlaying(false);
  };

  const handleStartRecording = () => {
    setRecordingDuration(0);
    setCurrentPlaybackTime(0);
    setTotalDuration(0);
    setIsRecording(true);
    setRecordedAudio(undefined);
    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then((stream) => {
        const mediaRecorder = new MediaRecorder(stream);
        mediaRecorderRed.current = mediaRecorder;
        if (!audioRef.current) return;
        audioRef.current.srcObject = stream;

        const chunks: BlobPart[] = [];
        mediaRecorder.ondataavailable = (e) => chunks.push(e.data);
        mediaRecorder.onstop = () => {
          const blob = new Blob(chunks, { type: "audio/ogg; codecs=opus" });
          const audioUrl = URL.createObjectURL(blob);
          const audio = new Audio(audioUrl);
          setRecordedAudio(audio);

          waveform?.load(audioUrl);
        };

        mediaRecorder.start();
      })
      .catch((error: any) => {
        console.log(error);
        toast.error(error.response.data.message);
      });
  };

  const handleStopRecording = () => {
    if (!mediaRecorderRed.current || !isRecording) return;
    mediaRecorderRed.current.stop();
    setIsRecording(false);
    waveform?.stop();

    const audioChunks: BlobPart[] = [];
    mediaRecorderRed.current.addEventListener("dataavailable", (event) => {
      audioChunks.push(event.data);
    });

    mediaRecorderRed.current.addEventListener("stop", () => {
      const audioBlob = new Blob(audioChunks, { type: "audio/mp3" });
      const audioFile = new File([audioBlob], "recording.mp3");
      setRenderedAudio(audioFile);
    });
  };

  const sendRecord = async () => {
    if (!recordedAudio || !socket || !socket.current) return;
    try {
      const formData = new FormData();
      formData.append("audio", renderedAudio!);

      const { message } = await addAudioMessage({
        message: formData,
        from: userInfo?.id,
        to: currentChatUser?.id,
      });

      socket.current.emit("send:message", {
        to: currentChatUser?.id,
        from: userInfo?.id,
        message,
      });

      dispatch({
        type: reducerCases.ADD_MESSAGES,
        newMessage: {
          ...message,
        },
        fromSelf: true,
      });

      handleClose();
    } catch (error: any) {
      console.log(error);
      toast.error(error.response.data.message);
    }
  };

  const handleClose = () => {
    handleStopRecording();
    setOpen(false);
  };

  return (
    <Drawer open={open} onOpenChange={setOpen} onClose={handleClose}>
      <DrawerTrigger asChild>
        <Mic
          className="cursor-pointer text-accent-foreground/80 hover:text-accent-foreground transition-colors"
          size={20}
        />
      </DrawerTrigger>
      <DrawerContent>
        <div className="mx-auto w-full md:max-w-md lg:max-w-lg xl:max-w-xl">
          <DrawerHeader>
            <DrawerTitle className="text-center">Voice Recorder</DrawerTitle>
            <DrawerDescription
              className={cn("text-center", isRecording && "text-red-500")}
            >
              {recordedAudio && isPlaying ? (
                <span>{formatTime(currentPlaybackTime)}</span>
              ) : (
                <span>{formatTime(recordingDuration)}</span>
              )}
            </DrawerDescription>
          </DrawerHeader>
          <div className="h-40 p-4 flex items-center justify-center gap-10">
            {!isRecording && recordedAudio && (
              <button
                className={cn(
                  "p-3 rounded-full bg-gray-800",
                  isPlaying
                    ? "cursor-not-allowed opacity-80"
                    : "hover:opacity-80"
                )}
                disabled={isPlaying}
              >
                <Play onClick={handlePlayRecording} />
              </button>
            )}
            <div
              id="waveform"
              className="w-80 bg-gray-800/30"
              ref={waveFormRef}
              //   hidden={!isPlaying}
            />
            {!isRecording && recordedAudio && (
              <button
                className={cn(
                  "p-3 rounded-full bg-gray-800",
                  !isPlaying
                    ? "cursor-not-allowed opacity-80"
                    : "hover:opacity-80"
                )}
                disabled={!isPlaying}
              >
                <PauseOctagon onClick={handlePauseRecording} />
              </button>
            )}
            <audio ref={audioRef} hidden />
          </div>
        </div>
        <DrawerFooter>
          <div className="flex justify-evenly items-center max-w-xs w-full mx-auto max-h-8 h-full my-4">
            <button
              className={cn(
                "h-full px-3 py-3 rounded-full bg-red-600",
                isPlaying || (isRecording && "cursor-not-allowed opacity-80")
              )}
              onClick={handleClose}
              disabled={isPlaying || isRecording}
            >
              <Trash size={20} />
            </button>

            {isRecording ? (
              <button
                className={cn(
                  "h-full p-6 rounded-full border-2 border-gray-600 transition-all",
                  isPlaying ? "cursor-not-allowed opacity-80" : "focus:border-4"
                )}
                onClick={handleStopRecording}
                disabled={isPlaying}
              >
                <Squircle className="bg-red-600 text-red-600" size={22} />
              </button>
            ) : (
              <button
                className={cn(
                  "h-full p-6 rounded-full border-2 border-gray-600 transition-all",
                  isPlaying ? "cursor-not-allowed opacity-80" : "focus:border-4"
                )}
                onClick={handleStartRecording}
                disabled={isPlaying}
              >
                <Mic2 className="rounded-full text-white" size={22} />
              </button>
            )}

            <button
              className={cn(
                "h-full px-3 py-3 rounded-full bg-emerald-500",
                isPlaying || (isRecording && "cursor-not-allowed opacity-80")
              )}
              onClick={sendRecord}
              disabled={isPlaying || isRecording}
            >
              <Check size={20} />
            </button>
          </div>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

export default MicroPicker;
