import { Search, X } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { useEffect, useState } from "react";
import { reducerCases } from "@/context/constants";
import { useStateProvider } from "@/context/state-context";
import { MessageType } from "@/utils/types";

import { Button } from "@/components/ui/button";

function SearchMessage() {
  const [{ currentChatUser, messages }, dispatch] = useStateProvider();
  const [searchTerm, setSearchTerm] = useState("");
  const [searchedMessages, setSearchedMessages] = useState<MessageType[]>([]);

  useEffect(() => {
    if (searchTerm && messages) {
      setSearchedMessages(
        Object.values(messages)
          .flat()
          .filter(
            (message) =>
              message.type === "TEXT" && message.content.includes(searchTerm)
          )
      );
    } else {
      setSearchedMessages([]);
    }
  }, [searchTerm]);

  const handleClose = () => {
    dispatch({
      type: reducerCases.SET_MESSAGE_SEARCH,
    });
  };

  if (!currentChatUser) return null;

  return (
    <div className="basis-1/3 w-full h-full border-l-2">
      <div className="h-16 px-4 py-5 flex flex-row-reverse justify-between gap-10 items-center">
        <Button variant={"outline"} onClick={handleClose}>
          <X />
        </Button>
      </div>
      <div className="h-full overflow-y-auto custom-scrollbar">
        <div className="w-full flex items-center flex-col">
          <div className="w-full h-14 flex px-5 items-center gap-3">
            <div className="w-full relative bg-card rounded-md">
              <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                <Search className="w-4 h-4 text-gray-500 dark:text-gray-400" />
              </div>
              <div
                className="relative pl-3 flex ms-4"
                data-twe-input-wrapper-init
                data-twe-input-group-ref
              >
                <input
                  type="search"
                  className="peer block w-full rounded border-0 bg-transparent px-3 py-[0.32rem] leading-[1.6] outline-none transition-all duration-200 ease-linear focus:placeholder:opacity-100 peer-focus:text-primary peer-valid:placeholder:opacity-100 dark:text-white dark:placeholder:text-neutral-300 dark:peer-focus:text-primary [&:not(:placeholder-shown)]:placeholder:opacity-0"
                  aria-label="Search"
                  id="search-focus"
                  aria-describedby="basic-addon4"
                  required
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <label
                  htmlFor="search-focus"
                  className="pointer-events-none absolute left-5 -top-0.5 mb-0 max-w-[90%] origin-[0_0] truncate pt-[0.37rem] leading-[1.6] text-neutral-500 transition-all duration-200 ease-out peer-focus:-translate-y-[0.9rem] peer-focus:scale-[0.8] peer-focus:text-primary peer-valid:-translate-y-[0.9rem] peer-valid:scale-[0.8] dark:text-neutral-400 dark:peer-focus:text-primary"
                >
                  Search Message
                </label>
              </div>
            </div>
          </div>
          <span className="mt-10 text-primary">
            {!searchTerm.length &&
              `Search for messages with ${currentChatUser?.first_name} ${currentChatUser?.last_name}`}
          </span>
        </div>
        <div className="h-full flex justify-center flex-col">
          {searchTerm.length > 0 && !searchedMessages.length && (
            <span className="w-full flex items-center justify-center text-accent-foreground">
              No messages found
            </span>
          )}
          <div className="flex flex-col w-full h-full">
            {searchedMessages.map((message) => (
              <div className="w-full px-5 flex flex-col justify-center cursor-pointer hover:opacity-85">
                <div className="text-sm text-accent-foreground">
                  {formatDistanceToNow(message.createdAt)}
                </div>
                <div className="text-emerald-500">{message.content}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default SearchMessage;
