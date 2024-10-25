import AvatarEmpty from "@/assets/avatar-empty.svg";

import { EllipsisVertical, Phone, Search, Video } from "lucide-react";
import { useState } from "react";
import { reducerCases } from "@/context/constants";
import { useStateProvider } from "@/context/state-context";
import { HOST } from "@/actions/api.route";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

function ChatHeader() {
  const [{ currentChatUser, onlineUsers }, dispatch] = useStateProvider();
  const [isContextMenuVisible, setIsContextMenuVisible] = useState(false);

  const contextMenuOptions = [
    {
      name: "Exit",
      callBack: async () => {
        setIsContextMenuVisible(false);
        dispatch({
          type: reducerCases.SET_EXIT_CHAT,
        });
      },
    },
  ];

  const handleVoiceCall = () => {
    dispatch({
      type: reducerCases.SET_VOICE_CALL,
      voiceCall: {
        ...currentChatUser!,
        type: "out-going",
        callType: "voice",
        roomId: Date.now(),
      },
    });
  };

  const handleVideoCall = () => {
    dispatch({
      type: reducerCases.SET_VIDEO_CALL,
      videoCall: {
        ...currentChatUser!,
        type: "out-going",
        callType: "video",
        roomId: Date.now(),
      },
    });
  };

  return (
    <div className="h-16 w-full px-4 py-3 flex justify-between items-center z-10">
      <div className="flex items-center justify-center gap-6">
        <div className="w-full h-full">
          <div className="relative flex">
            <img
              className="w-10 h-10 rounded-full"
              src={
                currentChatUser?.avatar?.toString().includes("uploads")
                  ? `${HOST}/${currentChatUser.avatar}`
                  : currentChatUser?.avatar || AvatarEmpty
              }
              alt="Avatar"
            />
            {onlineUsers?.includes(currentChatUser?.id!) && (
              <span className="absolute w-2.5 h-2.5 bg-green-500 border-2 border-white rounded-full top-8 right-1 dark:border-zinc-600"></span>
            )}
          </div>
        </div>
        <div className="w-full flex flex-col">
          <span className="w-40 line-clamp-1 text-accent-foreground">
            {currentChatUser?.first_name + " " + currentChatUser?.last_name}
          </span>
          <span className="text-accent-foreground/60 text-sm">
            {onlineUsers?.includes(currentChatUser?.id!) ? "online" : "offline"}
          </span>
        </div>
      </div>
      <div className="flex gap-6">
        <Phone
          className="cursor-pointer text-white/70 hover:text-white"
          onClick={handleVoiceCall}
        />
        <Video
          className="cursor-pointer text-white/70 hover:text-white"
          onClick={handleVideoCall}
        />
        <Search
          className="cursor-pointer text-white/70 hover:text-white"
          onClick={() =>
            dispatch({
              type: reducerCases.SET_MESSAGE_SEARCH,
            })
          }
        />
        <DropdownMenu
          onOpenChange={setIsContextMenuVisible}
          open={isContextMenuVisible}
        >
          <DropdownMenuTrigger asChild>
            <EllipsisVertical className="cursor-pointer text-white/70 hover:text-white" />
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56">
            <DropdownMenuSeparator />
            {contextMenuOptions.map((item, index) => (
              <DropdownMenuItem key={index} onClick={item.callBack}>
                {item.name}
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}

export default ChatHeader;
