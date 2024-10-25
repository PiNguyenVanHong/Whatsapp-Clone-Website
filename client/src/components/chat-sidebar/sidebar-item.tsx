import AvatarEmpty from "@/assets/avatar-empty.svg";

import { AudioLines, FileImage, Image } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatDateMessage2 } from "@/utils/format";
import { UserContacts, UserType } from "@/utils/types";
import { HOST } from "@/actions/api.route";
import { reducerCases } from "@/context/constants";
import { useStateProvider } from "@/context/state-context";

interface SidebarItemProps {
  data: UserType | UserContacts;
  isContactPage: boolean;
}

function SidebarItem({ data, isContactPage }: SidebarItemProps) {
  const [{ userInfo, onlineUsers, currentChatUser }, dispatch] = useStateProvider();

  const isOwn = userInfo?.id === data.id;

  const handleClick = () => {
    if(isOwn) return;
      dispatch({
        type: reducerCases.CHANGE_CURRENT_CHAT_USER,
        userInfo: {
          ...data,
          status: data.bio || "",
        },
      });
      if(isContactPage) {
        dispatch({
          type: reducerCases.SET_ALL_CONTACTS_PAGE,
        });
      }      
  };

  if (!data) return null;

  return (
    <div
      className={cn(
        "flex items-center cursor-pointer",
        isOwn ? "" : "hover:bg-accent",
        isContactPage && "rounded-md",
        data.id === currentChatUser?.id && "bg-accent",
      )}
      onClick={handleClick}
    >
      <div className="min-w-fit px-5 pt-3 pb-1">
        <div className="relative">
          <img
            className="w-10 h-10 rounded-full" 
            src={data.avatar?.toString().includes("uploads") ? `${HOST}/${data.avatar}` : data.avatar || AvatarEmpty} 
            alt="Avatar" 
            />
          {onlineUsers?.includes(data?.id!) && <span className="absolute w-2.5 h-2.5 bg-green-500 border-2 border-white rounded-full top-8 right-1 dark:border-zinc-600"></span>}
        </div>
      </div>
      <div className="min-h-full flex flex-col justify-center mt-3 mr-2 w-full">
        <div className="flex justify-between">
          <div>
            <span className="text-accent-foreground text-sm capitalize">{data.first_name} {data.last_name} {isOwn && "(You)"}</span>
            
          </div>
          {!isContactPage && (
            <div>
              <span
                className={cn(
                  "text-xs",
                  (data as UserContacts).totalUnreadMessage <= 0
                    ? "text-accent-foreground/80"
                    : "text-emerald-500"
                )}
              >
                {formatDateMessage2((data as UserContacts).createdAt)}
              </span>
            </div>
          )}
        </div>
        <div className="flex border-b pb-2 pt-1 ">
          <div className="flex justify-between items-center w-full">
            <span className="flex text-accent-foreground/70 line-clamp-1 text-xs">
              {isContactPage ? (
                data.bio || "\u00A0"
              ) : (
                <div
                  className={cn(
                    "flex items-center gap-1 max-w-[200px] sm:max-w-[250px] md:max-w-[300px] lg:max-w-[200px] xl:max-w-[300px] line-clamp-1",
                    (data as UserContacts).senderId !== userInfo?.id &&
                      (data as UserContacts).messageStatus !== "read" &&
                      "text-emerald-500"
                  )}
                  style={{
                    display: "flex",
                  }}
                >
                  {(data as UserContacts).senderId === userInfo?.id && (
                    <span className="items-center">You: </span>
                  )}
                  {(data as UserContacts).type === "TEXT" && (
                    <span className="truncate">
                      {(data as UserContacts).content}
                    </span>
                  )}
                  {(data as UserContacts).type === "IMAGE" && (
                    <span className="truncate flex items-center gap-1">
                      <Image size={15} />
                      <span>Images</span>
                    </span>
                  )}
                  {(data as UserContacts).type === "AUDIO" && (
                    <span className="truncate flex items-center gap-1">
                      <AudioLines size={15} />
                      <span>Voices</span>
                    </span>
                  )}
                  {(data as UserContacts).type === "DOCUMENT" && (
                    <span className="truncate flex items-center gap-1">
                      <FileImage className="-rotate-90" size={15} />
                      <span>Documents</span>
                    </span>
                  )}
                </div>
              )}
            </span>
            {(data as UserContacts).totalUnreadMessage > 0 && (
              <span className="px-2 py-1 text-red-400 rounded-full bg-red-400/20 text-xs">
                {(data as UserContacts).totalUnreadMessage < 10
                  ? "0" + (data as UserContacts).totalUnreadMessage
                  : (data as UserContacts).totalUnreadMessage}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default SidebarItem;
