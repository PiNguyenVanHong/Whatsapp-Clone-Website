import { Fragment, useEffect, useRef } from "react";
import { MessageType } from "@/utils/types";
import { useStateProvider } from "@/context/state-context";
import { Loader2, ServerCrash } from "lucide-react";
import { useChatQuery } from "@/hooks/use-chat-query";
import { reducerCases } from "@/context/constants";
import { compareDateToNow } from "@/utils/format";
import ChatItem from "./chat-item";
// import { getMessages } from "@/actions/message.api";

function ChatMessages() {
  const messageEndRef = useRef<HTMLDivElement>(null);
  const [{ messages, currentChatUser, userInfo }, dispatch] =
    useStateProvider();
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } =
    useChatQuery({ from: userInfo?.id!, to: currentChatUser?.id! });

  useEffect(() => {
    if (currentChatUser) {
      if(!data?.pages) return;

      let list: MessageType[] = [];
      data.pages.map((group) => {
        list.push(...group.items);
      });

      list.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());

      dispatch({
        type: reducerCases.SET_MESSAGES,
        list: list,
      });
    } 
  }, [currentChatUser, data, fetchNextPage, hasNextPage, isFetchingNextPage, status]);

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (!messages || !currentChatUser) {
    return null;
  }

  if (status === "pending") {
    return (
      <div className="flex flex-col flex-1 justify-center items-center">
        <Loader2 className="ww-7 h-7 text-zinc-500 animate-spin my-4" />
        <p className="text-xs text-zinc-500 dark:text-zinc-400">
          Loading messages...
        </p>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="flex flex-col flex-1 justify-center items-center">
        <ServerCrash className="ww-7 h-7 text-zinc-500 my-4" />
        <p className="text-xs text-zinc-500 dark:text-zinc-400">
          Something went wrong!
        </p>
      </div>
    );
  }

  return (
    <div className="w-full h-full relative z-10">
      <div className="area">
        <ul className="circles">
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
        </ul>
      </div>
      <div className="absolute inset-0 z-10 w-full h-full pt-3 pb-3">
        <div className="flex flex-col h-full overflow-x-auto mb-4 pr-4">
          <div className="flex flex-col h-full">
            {hasNextPage && (
              <div className="flex justify-center">
                {isFetchingNextPage ? (
                  <Loader2 className="w-6 h-6 text-zinc-500 animate-spin my-4" />
                ) : (
                  <button
                    className="text-zinc-500 hover:text-zinc-600 dark:text-zinc-400 text-xs my-4 dark:hover:text-zinc-300 transition"
                    onClick={() => fetchNextPage()}
                  >
                    Load previous messages
                  </button>
                )}
              </div>
            )}
            <div className="grid grid-cols-12 gap-y-2">
              {Object.entries(messages).map(([date, messages], index) => (
                <Fragment key={index}>
                  <div className="col-span-12 py-4">
                    <div className="relative mt-3 mb-6 text-center">
                      <div className="before:content-['] before:absolute before:w-full before:h-[1px] before:left-0 before:right-0 before:bg-gray-50 before:top-[10px] dark:before:bg-zinc-600">
                      </div>
                    <span className="relative bg-gray-50 text-13 py-[6px] text-xs px-3 rounded dark:bg-zinc-600 dark:text-gray-50">{compareDateToNow(messages[0].createdAt)}</span>
                    </div>
                  </div>
                    {messages.map((message: MessageType, i: number) => (
                    <ChatItem
                      key={i}
                      message={message}
                      currentUser={userInfo!}
                      otherUser={currentChatUser}
                    />
                  ))}
                </Fragment>
              ))}
              {/* {messages.map((message: MessageType, index) => (
                  <ChatItem
                    key={index}
                    message={message}
                    currentUser={userInfo!}
                    otherUser={currentChatUser}
                  />
              ))} */}
            </div>
            <div ref={messageEndRef}></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChatMessages;
