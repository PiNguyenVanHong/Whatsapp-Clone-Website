import { Button } from "@/components/ui/button";
import ActionTooltip from "../action-tooltip";
import { Camera, X } from "lucide-react";
import { ElementRef, useEffect, useRef } from "react";

interface PhotoCaptureProps {
  setPhoto: (value: string) => void;
  setOpen: (value: boolean) => void;
}

function PhotoCapture({ setPhoto, setOpen }: PhotoCaptureProps) {
  const videoRef = useRef<ElementRef<"video">>(null);

  useEffect(() => {
    let stream: MediaStream | undefined;

    const startCamera = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: false,
        });
        if (videoRef.current && stream) {
          videoRef.current.srcObject = stream;
        }
      } catch (error) {
        console.error("Error accessing the camera: ", error);
      }
    };

    startCamera();

    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  const handleCapture = () => {
    const video = videoRef?.current!;
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    context?.drawImage(video, 0, 0, canvas.width, canvas.height);
    setPhoto(canvas.toDataURL("image/jpeg"));
    setOpen(false);
  };
  // w-1/3 h-2/3 top-1/4 left-1/3

  return (
    <div className="absolute w-full h-full inset-0 z-[999] rounded-lg overflow-hidden shadow-sm shadow-emerald-300 flex flex-col items-center justify-rounded">
      <div className="w-full  p-3 flex items-center justify-between bg-gray-50 border border-gray-200 dark:bg-gray-700 dark:border-gray-600">
        <div></div>
        <ActionTooltip side="top" align="center" label={"Camera"}>
          <Button variant={"alternative"} size={"lg"} onClick={handleCapture}>
            <Camera />
          </Button>
        </ActionTooltip>
        <ActionTooltip side="top" align="center" label={"Close"}>
          <Button
            variant={"alternative"}
            size={"icon"}
            onClick={() => setOpen(false)}
          >
            <X className="text-red-500" />
          </Button>
        </ActionTooltip>
      </div>
      <div className="flex-auto bg-background/95 flex items-center justify-center">
        <video id="video" className="w-full" ref={videoRef} autoPlay />
      </div>
    </div>
  );
}

export default PhotoCapture;
