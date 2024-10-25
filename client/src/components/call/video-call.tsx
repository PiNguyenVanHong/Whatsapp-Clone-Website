import { useEffect } from "react";
import { useStateProvider } from "@/context/state-context";

import ContainerCall from "@/components/call/container-call";

function VideoCall() {
    const [{ videoCall, socket, userInfo }] = useStateProvider();

    useEffect(() => {
        if(videoCall?.type === "out-going" && socket?.current) {   
            socket?.current.emit("outgoing:video-call", {
                to: videoCall.id,
                from: {
                    id: userInfo?.id,
                    avatar: userInfo?.avatar,
                    name: userInfo?.name,
                },
                callType: videoCall.callType,
                roomId: videoCall.roomId,
            });
        }
    }, [videoCall]);

    if(!videoCall) return null;

    return (
        <ContainerCall data={videoCall} />
    )
};

export default VideoCall;