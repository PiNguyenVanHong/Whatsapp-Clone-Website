import { format } from "date-fns";
import { Check, CheckCheck, Dot, Download } from "lucide-react";
import { HOST } from "@/actions/api.route";
import { cn, formatFileSize } from "@/lib/utils";
import { MessageType, UserType } from "@/utils/types";
import ChatItemAudio from "./chat-item-audio";

interface ChatItemProps {
  message: MessageType;
  currentUser: UserType;
  otherUser: UserType;
}

const FORMAT_DATE = "hh:mm a";

function ChatItem({ message, currentUser, otherUser }: ChatItemProps) {
  const isOwn = message.senderId === currentUser.id;

  const handleDownload = async (url: string) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);
  
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = Date.now() + url.substring(url.lastIndexOf("."));
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
  
      URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error('Download failed:', error);
    }
  };
  
  return (
    <div
      className={cn(
        "flex items-start gap-2.5",
        isOwn
          ? "flex-row-reverse col-start-6 col-end-13"
          : "col-start-1 col-end-8"
      )}
    >
      <img
        className="w-8 h-8 rounded-full"
        src={isOwn ? currentUser?.avatar.toString().includes("uploads") ? `${HOST}/${currentUser.avatar}` : currentUser?.avatar : otherUser.avatar}
        alt="Avatar"
      />
      <div className="flex flex-col gap-1 w-full max-w-[320px]">
        <div
          className={cn(
            "flex items-center space-x-2 rtl:space-x-reverse ",
            isOwn && "flex-row-reverse gap-3"
          )}
        >
          <span className="text-sm font-semibold text-gray-900 dark:text-white">
            {isOwn ? "You" : otherUser.first_name + " " + otherUser.last_name}
          </span>
          <span className="text-xs font-normal text-gray-500 dark:text-gray-400">
            {format(message.createdAt, FORMAT_DATE)}
          </span>
        </div>
        {message.type === "TEXT" ? (
          <div
            className={cn(
              "flex flex-col leading-1.5 p-4 py-3 border-gray-200 bg-gray-100",
              isOwn
                ? "rounded-s-xl rounded-br-xl dark:bg-emerald-900/60"
                : "rounded-e-xl rounded-es-xl dark:bg-gray-600"
            )}
          >
            <p className="text-sm font-normal text-gray-900 dark:text-white">
              {" "}
              {message.content}
            </p>
          </div>
        ) : message.type === "IMAGE" ? (
          <div className="leading-1.5 flex w-full max-w-[320px] flex-col">
            <p className="text-sm font-normal text-gray-900 dark:text-white">
              {/* This is the new office 3 */}
            </p>
            <div className="group relative mt-2">
              <div className="absolute w-full h-full bg-gray-900/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg flex items-center justify-center">
                <button
                  data-tooltip-target="download-image"
                  className="inline-flex items-center justify-center rounded-full h-10 w-10 bg-white/30 hover:bg-white/50 focus:ring-4 focus:outline-none dark:text-white focus:ring-gray-50"
                  onClick={() => handleDownload(`${HOST}/${message.content}`)}
                >
                  <Download
                    className="text-white"
                    size={20}
                  />
                </button>
                <div
                  id="download-image"
                  role="tooltip"
                  className="absolute z-10 invisible inline-block px-3 py-2 text-sm font-medium text-white transition-opacity duration-300 bg-gray-900 rounded-lg shadow-sm opacity-0 tooltip dark:bg-gray-700"
                >
                  Download image
                  <div className="tooltip-arrow" data-popper-arrow></div>
                </div>
              </div>
              <img src={`${HOST}/${message.content}`} className="rounded-lg" />
            </div>
          </div>
        ) : message.type === "AUDIO" ? (
          <ChatItemAudio message={message} isOwn={isOwn} />
        ) : message.type === "DOCUMENT" ? (
          <div className="leading-1.5 w-full max-w-[320px] flex flex-col items-end">
         <div className="w-fit flex items-start flex-row-reverse gap-4 bg-gray-50 dark:bg-gray-700 rounded-xl p-2">
            <div className="me-2">
               <span className="flex items-center gap-2 text-sm font-medium text-gray-900 dark:text-white pb-2">
                  <svg fill="none" aria-hidden="true" className="w-5 h-5 flex-shrink-0" viewBox="0 0 20 21">
                     <g clipPath="url(#clip0_3173_1381)">
                        <path fill="#E2E5E7" d="M5.024.5c-.688 0-1.25.563-1.25 1.25v17.5c0 .688.562 1.25 1.25 1.25h12.5c.687 0 1.25-.563 1.25-1.25V5.5l-5-5h-8.75z"/>
                        <path fill="#B0B7BD" d="M15.024 5.5h3.75l-5-5v3.75c0 .688.562 1.25 1.25 1.25z"/>
                        <path fill="#CAD1D8" d="M18.774 9.25l-3.75-3.75h3.75v3.75z"/>
                        <path fill="#F15642" d="M16.274 16.75a.627.627 0 01-.625.625H1.899a.627.627 0 01-.625-.625V10.5c0-.344.281-.625.625-.625h13.75c.344 0 .625.281.625.625v6.25z"/>
                        <path fill="#fff" d="M3.998 12.342c0-.165.13-.345.34-.345h1.154c.65 0 1.235.435 1.235 1.269 0 .79-.585 1.23-1.235 1.23h-.834v.66c0 .22-.14.344-.32.344a.337.337 0 01-.34-.344v-2.814zm.66.284v1.245h.834c.335 0 .6-.295.6-.605 0-.35-.265-.64-.6-.64h-.834zM7.706 15.5c-.165 0-.345-.09-.345-.31v-2.838c0-.18.18-.31.345-.31H8.85c2.284 0 2.234 3.458.045 3.458h-1.19zm.315-2.848v2.239h.83c1.349 0 1.409-2.24 0-2.24h-.83zM11.894 13.486h1.274c.18 0 .36.18.36.355 0 .165-.18.3-.36.3h-1.274v1.049c0 .175-.124.31-.3.31-.22 0-.354-.135-.354-.31v-2.839c0-.18.135-.31.355-.31h1.754c.22 0 .35.13.35.31 0 .16-.13.34-.35.34h-1.455v.795z"/>
                        <path fill="#CAD1D8" d="M15.649 17.375H3.774V18h11.875a.627.627 0 00.625-.625v-.625a.627.627 0 01-.625.625z"/>
                     </g>
                     <defs>
                        <clipPath id="clip0_3173_1381">
                           <path fill="#fff" d="M0 0h20v20H0z" transform="translate(0 .5)"/>
                        </clipPath>
                     </defs>
                  </svg>
                  <span className="w-full line-clamp-1">{message.fileName}</span>
               </span>
               <span className="flex text-xs font-normal text-gray-500 dark:text-gray-400 gap-2">
                  {message.numPages} Pages 
                  <Dot className="text-[#6B7280]" size={15} />
                  {formatFileSize(message.fileSize!)} 
                  <Dot className="text-[#6B7280]" size={15} />
                  {message.fileType}
               </span>
            </div>
            <div className="inline-flex self-center items-center">
               <button 
                className="inline-flex self-center items-center p-2 text-sm font-medium text-center text-gray-900 bg-gray-50 rounded-lg hover:bg-gray-100 focus:ring-4 focus:outline-none dark:text-white focus:ring-gray-50 dark:bg-gray-700 dark:hover:bg-gray-600 dark:focus:ring-gray-600" type="button"
                onClick={() => handleDownload(`${HOST}/${message.content}`)}
               >
                  <Download
                    className="w-5 h-5 text-gray-900 dark:text-white"
                  />
               </button>
            </div>
         </div>
      </div>
        ) : <></>}

        {isOwn && (
          <span className="text-sm font-normal text-gray-500 dark:text-gray-400">
            {message.messageStatus === "sent" ? (
              <Check className="text-emerald-500" size={15} />
            ) : message.messageStatus === "delivered" ? (
              <CheckCheck className="text-emerald-500" size={15} />
            ) : (
              <CheckCheck size={15} />
            )}
          </span>
        )}
        {!isOwn && (
          <div className="w-full h-4"></div>
        )}
      </div>
    </div>
  );
}

export default ChatItem;
