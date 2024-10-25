import ChatHeader from "@/components/chat/chat-header";
import ChatInput from "@/components/chat/chat-input";
import ChatMessages from "@/components/chat/chat-messages";

function Chat() {
  return (
    <div className="basis-2/3 bg-accent flex flex-col h-full w-full">
      <ChatHeader />
      <div className="w-full h-full bg-background pl-4">
        <div className="h-[calc(100vh-120px)] overflow-y-auto">
          <ChatMessages />
        </div>
        <div className="mb-4">
          <ChatInput />
        </div>
      </div>
    </div>
  );
}

export default Chat;
