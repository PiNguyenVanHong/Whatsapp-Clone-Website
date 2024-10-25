import { io, Socket } from "socket.io-client";
import { useEffect, useRef, useState } from "react";
import { useStateProvider } from "@/context/state-context";
import { reducerCases } from "@/context/constants";
import { getMessages } from "@/actions/message.api";
import { cn } from "@/lib/utils";
import { HOST } from "@/actions/api.route";

import Chat from "@/components/chat";
import ChatSidebar from "@/components/chat-sidebar";
import EmptyPage from "@/components/empty";
import SearchMessage from "@/components/search-message";
import VideoCall from "@/components/call/video-call";
import VoiceCall from "@/components/call/voice-call";
import IncomingVideoCall from "@/components/call/incoming-video-call";
import IncomingVoiceCall from "@/components/call/incoming-voice-call";
import { useNavigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { firebaseAuth } from "@/utils/firebase.config";
import { checkUser } from "@/actions/user.api";
import { toast } from "sonner";
import { useChatQuery } from "@/hooks/use-chat-query";

function MainPage() {
  const [socketEvent, setSocketEvent] = useState(false);
  const [
    {
      userInfo,
      newUser,
      tokenData,
      currentChatUser,
      messageSearch,
      videoCall,
      voiceCall,
      incomingVideoCall,
      incomingVoiceCall,
    },
    dispatch,
  ] = useStateProvider();
  const [redirectLogin, setRedirectLogin] = useState(false);
  const socket = useRef<Socket>();
  const navigate = useNavigate();

  onAuthStateChanged(firebaseAuth, async (currentUser) => {
    if (!currentUser && !tokenData) setRedirectLogin(true);
    if (!userInfo && currentUser?.email) {
      try {
        const { status, user } = await checkUser(currentUser.email);

        if (!status) {
          navigate("/login");
          return;
        }

        const { id, first_name, last_name, email, avatar, bio } = user;
        dispatch({
          type: reducerCases.SET_USER_INFO,
          userInfo: {
            id,
            first_name,
            last_name,
            email,
            avatar,
            bio,
            status: "Done",
          },
        });
      } catch (error: any) {
        console.log(error);
        toast.error(error.response.data.message);
      }
    }
  });

  useEffect(() => {
    if (redirectLogin) navigate("/login");
  }, [redirectLogin]);

  useEffect(() => {
    if (!userInfo) {
      navigate("/login");
    }
  }, [userInfo, newUser]);

  useEffect(() => {
    if (userInfo) {
      socket.current = io(HOST);
      socket.current.emit("add:user", userInfo.id);
      dispatch({
        type: reducerCases.SET_SOCKET,
        socket,
      });
    }
  }, [userInfo]);

  useEffect(() => {
    if (socket.current && !socketEvent) {
      socket.current.on("update:message", (data) => {
        dispatch({
          type: reducerCases.ADD_MESSAGES,
          newMessage: {
            ...data.message,
          },
        });
      });

      socket.current.on("incoming:voice-call", ({ from, roomId, callType }) => {
        dispatch({
          type: reducerCases.SET_INCOMING_VOICE_CALL,
          incomingVoiceCall: { ...from, roomId, callType },
        });
      });

      socket.current.on("incoming:video-call", ({ from, roomId, callType }) => {
        dispatch({
          type: reducerCases.SET_INCOMING_VIDEO_CALL,
          incomingVideoCall: { ...from, roomId, callType },
        });
      });

      socket.current.on("rejected:voice-call", () => {
        dispatch({
          type: reducerCases.END_CALL,
        });
      });

      socket.current.on("rejected:video-call", () => {
        dispatch({
          type: reducerCases.END_CALL,
        });
      });

      socket.current.on("online-users", ({ onlineUsers }) => {
        dispatch({
          type: reducerCases.SET_ONLINE_USERS,
          onlineUsers,
        });
      });

      setSocketEvent(true);
    }
  }, [socket.current]);

  

  

  return (
    <>
      {incomingVideoCall && <IncomingVideoCall />}
      {incomingVoiceCall && <IncomingVoiceCall />}
      {videoCall && (
        <div className="w-screen h-screen max-h-full overflow-hidden">
          <VideoCall />
        </div>
      )}
      {voiceCall && (
        <div className="w-screen h-screen max-h-full overflow-hidden">
          <VoiceCall />
        </div>
      )}
      {!videoCall && !voiceCall && (
        <div
          id="code"
          className="w-screen h-screen max-w-full max-h-screen flex overflow-hidden transition-all duration-300"
        >
          <ChatSidebar />
          {currentChatUser ? (
            <div
              className={cn(
                "border-l-2 border-accent-foreground/50",
                messageSearch ? "basis-2/3 flex" : "basis-2/3 grid-cols-2"
              )}
            >
              <Chat />
              {messageSearch && <SearchMessage />}
            </div>
          ) : (
            <EmptyPage />
          )}
        </div>
      )}
    </>
  );
}

export default MainPage;
