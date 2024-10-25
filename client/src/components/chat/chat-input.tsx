import { Paperclip, Send } from "lucide-react";
import { ChangeEvent, useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { reducerCases } from "@/context/constants";
import { useStateProvider } from "@/context/state-context";
import { addFileMessage, addImageMessage, addMessage } from "@/actions/message.api";

import EmojiPicker from "@/components/emoji-picker";
import PhotoPicker from "@/components/photo/photo-picker";
import MicroPicker from "@/components/micro-picker";
import { toast } from "sonner";

function ChatInput() {
  const [content, setContent] = useState("");
  const [grabPhoto, setGrabPhoto] = useState(false);
  const [showAudioRecoder, setShowAudioRecoder] = useState(false);
  const [{ userInfo, currentChatUser, socket }, dispatch] = useStateProvider();

  useEffect(() => {
    if (grabPhoto) {
      const data = document.getElementById("photo-picker");
      data?.click();
      document.body.onfocus = () => {
        setTimeout(() => {
          setGrabPhoto(false);
        }, 1000);
      };
    }
  }, [grabPhoto]);

  const sendMessage = async () => {
    if (!currentChatUser || !socket || !socket.current || content.trim().length <= 0) return;
    try {
      const { message: sentMessage } = await addMessage({
        message: content,
        from: userInfo?.id,
        to: currentChatUser.id,
      });

      socket.current.emit("send:message", {
        to: currentChatUser?.id,
        from: userInfo?.id,
        message: sentMessage,
      });

      dispatch({
        type: reducerCases.ADD_MESSAGES,
        newMessage: {
          ...sentMessage,
        },
        fromSelf: true,
      });

      setContent("");
    } catch (error: any) {
      console.log(error);
      toast.error(error.response.data.message);
    }
  };

  const handleKeyPress = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      await sendMessage();
    }
  };

  const handleEmojiClick = (emoji: string) => {
    setContent(`${content}${emoji}`);
  };

  const photoPickerChange = async (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !currentChatUser || !socket || !socket.current) return;
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append("file", file);
    
    try {
      const { message } = await addFileMessage({
        message: formData,
        from: userInfo?.id,
        to: currentChatUser.id,
      });

      // const { message } = await addImageMessage({ 
      //   message: formData, 
      //   from: userInfo?.id,
      //   to: currentChatUser?.id, 
      // });

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

      setContent("");
    } catch (error: any) {
      console.log(error);
      toast.error(error.response.data.message);
    }
  };

  return (
    <div className="w-full pl-3 pr-1 py-1 rounded-3xl border border-gray-200 items-center gap-2 inline-flex justify-between">
      <div className="w-full flex items-center gap-2">
        <EmojiPicker onChange={handleEmojiClick} />
        <Paperclip
          className="cursor-pointer text-accent-foreground/80 hover:text-accent-foreground transition-colors"
          size={20}
          onClick={() => setGrabPhoto(true)}
        />
        <input
          className="grow shrink basis-0 border-0 bg-transparent text-accent-foreground text-sm font-medium leading-8 focus:outline-none"
          placeholder="Type here..."
          onChange={(e) => setContent(e.target.value)}
          onKeyDown={handleKeyPress}
          value={content}
        />
      </div>
      <div className="flex items-center gap-2">
        <MicroPicker open={showAudioRecoder} setOpen={setShowAudioRecoder} />
        <button
          className={cn(
            "items-center flex px-3 py-2 bg-emerald-700 rounded-full shadow-md",
            content.trim().length <= 0 ? "cursor-not-allowed" : "hover:bg-emerald-700/80"
          )}
          onClick={sendMessage}
          disabled={content.trim().length <= 0}
        >
          <Send size={18} />
          <h3 className="text-white text-sm font-semibold leading-4 px-2">
            Send
          </h3>
        </button>
      </div>
      {grabPhoto && <PhotoPicker onChange={photoPickerChange} />}
    </div>
  );
}

export default ChatInput;
