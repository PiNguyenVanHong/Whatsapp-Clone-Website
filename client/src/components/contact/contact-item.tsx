import { UserType } from "@/utils/types";
import SidebarItem from "../chat-sidebar/sidebar-item";
import { useStateProvider } from "@/context/state-context";

interface ContactItemProps {
  letter: string;
  users: UserType[];
}

function ContactItem({ letter, users }: ContactItemProps) {
  return (
    <div>
      <div className="p-3 font-bold text-emerald-300/60">{letter}</div>
      <div>
        {users.map((user, index) => (
          <SidebarItem key={index} data={user} isContactPage={true} />
        ))}
      </div>
    </div>
  );
}

export default ContactItem;
