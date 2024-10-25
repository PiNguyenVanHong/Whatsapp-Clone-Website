import { Phone, PhoneCall } from "lucide-react";
import { useStateProvider } from "@/context/state-context";

import { Button } from "@/components/ui/button";
import { reducerCases } from "@/context/constants";

function IncomingVoiceCall() {
    const [{ incomingVoiceCall, socket }, dispatch] = useStateProvider();

  const handleAcceptCall = () => {
    if(!socket?.current) return;
    dispatch({
      type: reducerCases.SET_VOICE_CALL,
      voiceCall: {
        ...incomingVoiceCall!,
        type: "in-coming",
      },
    });

    socket?.current.emit("accept:incoming-call", {
      id: incomingVoiceCall?.id,
    });

    dispatch({
      type: reducerCases.SET_INCOMING_VOICE_CALL,
      incomingVoiceCall: undefined,
    });

  };

  const handleRejectCall = () => {
    if(!socket?.current) return;
    socket.current.emit("reject:voice-call", { from: incomingVoiceCall?.id })
    dispatch({
      type: reducerCases.END_CALL,
    });
  };

    return (
        <div className="w-[350px] h-24 p-4 fixed right-6 bottom-8 mb-0 z-50 rounded-sm flex gap-5 items-center justify-start bg-accent text-accent-foreground drop-shadow-2xl shadow-emerald-500">
      <div className="w-full flex gap-3 items-center">
        <div className="h-14 w-14 overflow-hidden rounded-md">
          <img alt="Avatar" src={incomingVoiceCall?.avatar} />
        </div>
        <div>
          <h4 className="line-clamp-1 text-base font-medium">
            {incomingVoiceCall?.name}
          </h4>
            <p className="text-xs text-accent-foreground/70">Incoming Voice Call</p>
        </div>
        <div className="flex gap-1 items-center ml-auto">
          <Button variant={"destructive"} onClick={handleRejectCall}>
            <Phone className="rotate-[135deg] animate-ring-calling" size={20} />
          </Button>
            <Button variant={"success"} onClick={handleAcceptCall}>
              <PhoneCall className="animate-ring-calling" size={20} />
            </Button>
        </div>
      </div>
    </div>
    )
};

export default IncomingVoiceCall;