import { ZegoExpressEngine } from "zego-express-engine-webrtc";
import { Phone } from "lucide-react";
import { useEffect, useState } from "react";
import { UserType } from "@/utils/types";
import { generateToken } from "@/actions/user.api";
import { reducerCases } from "@/context/constants";
import { useStateProvider } from "@/context/state-context";
import { cn } from "@/lib/utils";

interface ContainerCallProps {
  data: UserType & {
    type?: "out-going" | "in-coming";
    callType?: "voice" | "video";
    roomId?: number;
  };
}

function ContainerCall({ data }: ContainerCallProps) {
  const [{ userInfo, socket }, dispatch] = useStateProvider();
  const [isAccepted, setIsAccepted] = useState(false);
  const [token, setToken] = useState();
  const [zgVar, setZgVar] = useState<ZegoExpressEngine | undefined>(undefined);
  const [localStream, setLocalStream] = useState<MediaStream | undefined>(
    undefined
  );
  const [publishStream, setPublishStream] = useState<string | undefined>(
    undefined
  );

  useEffect(() => {
    if (!socket?.current) return;
    if (data.type === "out-going") {
      socket?.current.on("accept:call", () => {
        setIsAccepted(true);
      });
    } else {
      setTimeout(() => {
        setIsAccepted(true);
      }, 1000);
    }
  }, [data]);

  useEffect(() => {
    const getToken = async () => {
      try {
        const { token } = await generateToken(userInfo?.id!);

        setToken(token);
      } catch (error) {
        console.log(error);
      }
    };

    getToken();
  }, [isAccepted]);

  useEffect(() => {
    const startCall = async () => {
      import("zego-express-engine-webrtc").then(
        async ({ ZegoExpressEngine }) => {
          const zg = new ZegoExpressEngine(
            parseInt(import.meta.env.VITE_PUBLIC_ZEGO_APP_ID),
            import.meta.env.VITE_PUBLIC_ZEGO_APP_SERVER_SECRET
          );

          setZgVar(zg);

          zg.on(
            "roomStreamUpdate",
            async (roomID, updateType, streamList, extendedData) => {
              if (updateType === "ADD") {
                const rmVideo = document.getElementById(
                  "remote-video"
                ) as HTMLDivElement;
                const vd = document.createElement(
                  data.callType === "video" ? "Video" : "Audio"
                ) as HTMLVideoElement;
                vd.id = streamList[0].streamID;
                vd.autoplay = true;
                vd.muted = false;

                if (rmVideo) {
                  rmVideo.appendChild(vd);
                }

                zg.startPlayingStream(streamList[0].streamID, {
                  audio: true,
                  video: true,
                }).then((stream) => {
                  vd.srcObject = stream;
                });
              } else if (
                updateType == "DELETE" &&
                zg &&
                localStream &&
                streamList[0].streamID
              ) {
                zg.destroyStream(localStream);
                zg.stopPublishingStream(streamList[0].streamID);
                zg.logoutRoom(data.roomId?.toString());
                dispatch({
                  type: reducerCases.END_CALL,
                });
              }
            }
          );

          await zg.loginRoom(
            data.roomId?.toString()!,
            token!,
            {
              userID: userInfo?.id?.toString()!,
              userName: userInfo?.name.toString(),
            },
            { userUpdate: true }
          );

          const localStream = await zg.createStream({
            camera: {
              audio: true,
              video: data.callType === "video" ? true : false,
            },
          });

          const localVideo = document.getElementById(
            "local-audio"
          ) as HTMLDivElement;
          const videoElement = document.createElement(
            data.callType === "video" ? "video" : "audio"
          ) as HTMLVideoElement;
          videoElement.id = "video-local-zego";
          videoElement.className = "w-32 h-28";
          videoElement.autoplay = true;
          videoElement.muted = false;

          localVideo?.appendChild(videoElement);
          const td = document.getElementById(
            "video-local-zego"
          ) as HTMLVideoElement;
          td.srcObject = localStream;
          const streamID = "123" + Date.now();
          setPublishStream(streamID);
          setLocalStream(localStream);
          zg.startPublishingStream(streamID, localStream);
        }
      );
    };

    if (token) {
      startCall();
    }
  }, [token]);

  const endCall = () => {
    if (!socket?.current) return;
    if (zgVar && localStream && publishStream) {
      zgVar.destroyStream(localStream);
      zgVar.stopPublishingStream(publishStream);
      zgVar.logoutRoom(data.roomId?.toString());
      const remoteVideoContainer = document.getElementById("remote-video") as HTMLDivElement;
      const localAudioContainer = document.getElementById("local-audio") as HTMLDivElement;
      
      remoteVideoContainer.removeChild(remoteVideoContainer?.firstChild!);
      localAudioContainer.removeChild(localAudioContainer?.firstChild!);
    }
    const id = data.id;
    if (data.callType === "voice") {
      socket?.current.emit("reject:voice-call", { from: id });
    } else {
      socket?.current.emit("reject:video-call", { from: id });
    }
    dispatch({
      type: reducerCases.END_CALL,
    });
  };

  return (
    <div className="w-full h-screen border-l bg-accent text-accent-foreground flex flex-col items-center justify-center overflow-hidden">
      <div className="flex flex-col gap-3 items-center mb-8">
        <span className="text-5xl">{data.first_name} {data.last_name}</span>
        <span className="text-lg">
          {isAccepted && data.callType !== "video"
            ? "On going call"
            : "Calling"}
        </span>
      </div>
      {(!isAccepted || data.callType === "voice") && (
        <div
          className={cn(
            "w-64 h-64 relative left-1 z-20 after:absolute after:inline-flex after:w-64 after:h-64 after:rounded-full after:scale-100 after:bg-red-200 after:opacity-0 after:z-10",
            !isAccepted && "after:animate-ping-call"
          )}
        >
          <img
            className={cn(
              "absolute inline-flex z-20 object-cover rounded-full overflow-hidden shadow-lg",
              !isAccepted && "animate-zoom-calling"
            )}
            src={data.avatar}
            alt="Avatar"
          />
        </div>
      )}

      <div id="remote-video" className="my-5 relative">
        <div id="local-audio" className="absolute bottom-5 right-5"></div>
      </div>
      <div
        className="w-16 h-16 bg-red-600 flex items-center justify-center rounded-full cursor-pointer"
        onClick={endCall}
      >
        <Phone className="rotate-[135deg]" />
      </div>
    </div>
  );
}

export default ContainerCall;
