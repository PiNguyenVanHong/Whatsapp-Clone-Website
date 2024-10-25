import { useEffect, useState } from "react";
import { useStateProvider } from "@/context/state-context";

import SidebarHeader from "@/components/chat-sidebar/sidebar-header";
import SearchBar from "@/components/chat-sidebar/search-bar";
import List from "@/components/chat-sidebar/list";
import ContactList from "@/components/contact/contact-list";

function ChatSidebar() {
  const [{ contactsPage }] = useStateProvider();
  const [pageType, setPageType] = useState("default");

  useEffect(() => {
    if (contactsPage) {
      setPageType("all-contacts");
    } else {
      setPageType("default");
    }
  }, [contactsPage]);

  return (
    <div className="basis-1/3 flex flex-col z-20">
      {pageType === "default" && (
        <>
          <SidebarHeader />
          <div className="w-full h-full flex flex-col border-r border-r-gray-700">
            <SearchBar />
            <List />
          </div>
        </>
      )}
      {pageType === "all-contacts" && <ContactList />}
    </div>
  );
}

export default ChatSidebar;
