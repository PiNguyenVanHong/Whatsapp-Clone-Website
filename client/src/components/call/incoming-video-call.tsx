import { Phone, Video } from "lucide-react";
import { useStateProvider } from "@/context/state-context";

import { Button } from "@/components/ui/button";
import { reducerCases } from "@/context/constants";

function IncomingVideoCall() {
  const [{ incomingVideoCall, socket }, dispatch] = useStateProvider();

  const handleAcceptCall = () => {
    if(!socket?.current) return;
    dispatch({
      type: reducerCases.SET_VIDEO_CALL,
      videoCall: {
        ...incomingVideoCall!,
        type: "in-coming",
      },
    });

    socket?.current.emit("accept:incoming-call", {
      id: incomingVideoCall?.id,
    });

    dispatch({
      type: reducerCases.SET_INCOMING_VIDEO_CALL,
      incomingVideoCall: undefined,
    });

  };

  const handleRejectCall = () => {
    if(!socket?.current) return;
    socket.current.emit("reject:video-call", { from: incomingVideoCall?.id })
    dispatch({
      type: reducerCases.END_CALL,
    });
  };
  

  return (
    <div className="w-[350px] h-24 p-4 py-14 fixed right-6 bottom-8 mb-0 z-50 rounded-sm flex gap-5 items-center justify-start bg-accent text-accent-foreground drop-shadow-2xl">
      <div className="w-full flex gap-3 items-center">
        <div className="h-14 w-14 overflow-hidden rounded-md">
          <img alt="Avatar" src={incomingVideoCall?.avatar} />
        </div>
        <div>
          <h4 className="line-clamp-1 text-base font-medium">
            {incomingVideoCall?.first_name} {incomingVideoCall?.last_name}
          </h4>
            <p className="text-xs">Incoming Video Call</p>
        </div>
        <div className="flex gap-1 items-center ml-auto">
          <Button variant={"destructive"} onClick={handleRejectCall}>
            <Phone className="rotate-[135deg] animate-ring-calling" size={20} />
          </Button>
            <Button variant={"alternative"} onClick={handleAcceptCall}>
              <Video className="animeat-ring-calling" size={20} />
            </Button>
        </div>
      </div>
    </div>
  );
}

export default IncomingVideoCall;
