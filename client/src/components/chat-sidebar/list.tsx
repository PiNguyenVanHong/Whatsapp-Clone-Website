import { useEffect } from "react";
import { useStateProvider } from "@/context/state-context";
import { getContactMessage } from "@/actions/message.api";
import { reducerCases } from "@/context/constants";
import SidebarItem from "./sidebar-item";

function List() {
  const [{ userInfo, userContacts, filteredContacts }, dispatch] =
    useStateProvider();

  useEffect(() => {
    if (!userInfo || userInfo == undefined) return;
    const getContacts = async () => {
      try {
        const { users, onlineUsers } = await getContactMessage({
          from: userInfo.id,
        });

        dispatch({
          type: reducerCases.SET_ONLINE_USERS,
          onlineUsers,
        });
        dispatch({
          type: reducerCases.SET_USER_CONTACTS,
          userContacts: users,
        });
      } catch (error) {
        console.log(error);
      }
    };

    getContacts();
  }, [userInfo]);

  if (!userContacts) return null;

  return (
    <div className="flex-auto overflow-auto max-h-full custom-scrollbar">
      {filteredContacts && filteredContacts.length > 0
        ? filteredContacts.map((contact) => (
            <SidebarItem
              key={contact.id}
              data={contact}
              isContactPage={false}
            />
          ))
        : userContacts.map((contact) => (
            <SidebarItem
              key={contact.id}
              data={contact}
              isContactPage={false}
            />
          ))}
    </div>
  );
}

export default List;
