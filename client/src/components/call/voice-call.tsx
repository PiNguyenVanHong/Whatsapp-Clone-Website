import { useEffect } from "react";
import { useStateProvider } from "@/context/state-context";

import ContainerCall from "@/components/call/container-call";

function VoiceCall() {
    const [{ voiceCall, socket, userInfo }] = useStateProvider();

    useEffect(() => {
        if(voiceCall?.type === "out-going" && socket?.current) {
            socket?.current.emit("outgoing:voice-call", {
                to: voiceCall.id,
                from: {
                    id: userInfo?.id,
                    avatar: userInfo?.avatar,
                    name: userInfo?.name,
                },
                callType: voiceCall.callType,
                roomId: voiceCall.roomId,
            });
        }
    }, [voiceCall]);

    if(!voiceCall) return null;

    return (
        <ContainerCall data={voiceCall} />
    )
};

export default VoiceCall;