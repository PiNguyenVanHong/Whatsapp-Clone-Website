import AvatarEmpty from "@/assets/avatar-empty.svg";

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { EllipsisVertical, MessageSquareText } from "lucide-react";
import { useStateProvider } from "@/context/state-context";
import { reducerCases } from "@/context/constants";
import { useModal } from "@/hooks/use-modal-store";

import ActionTooltip from "@/components/action-tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { HOST } from "@/actions/api.route";

function SidebarHeader() {
  const navigate = useNavigate();
  const [{ userInfo }, dispatch] = useStateProvider();
  const [isContextMenuVisible, setIsContextMenuVisible] = useState(false);
  const { onOpen } = useModal();

  const contextMenuOptions = [
    {
      name: "Update Profile",
      callBack: async () => {
        onOpen("updateProfile", userInfo, () => {
          navigate("/logout");
        });
      },
    },
    {
      name: "Change Password",
      callBack: async () => {
        onOpen("updatePassword", userInfo, () => {
          navigate("/logout");
        });
      },
    },
    {
      name: "Logout",
      callBack: async () => {
        setIsContextMenuVisible(false);
        navigate("/logout");
      },
    },
  ];

  const handleAllContactsPage = () => {
    dispatch({
      type: reducerCases.SET_ALL_CONTACTS_PAGE,
    });
  };

  return (
    <div className="h-16 px-4 py-3 flex justify-between items-center bg-accent">
      <div className="cursor-pointer flex items-center gap-2">
        <div className="relative w-12 h-12 flex items-center justify-center overflow-hidden rounded-full">
          <img
            className="w-10 h-10 rounded-full shadow-lg shadow-emerald-600"
            src={
              userInfo?.avatar?.toString().includes("uploads")
                ? `${HOST}/${userInfo?.avatar}`
                : userInfo?.avatar || AvatarEmpty
            }
            alt="Avatar"
          />
        </div>
        <span className="text-sm">{userInfo?.first_name} {userInfo?.last_name}</span>
      </div>
      <div className="flex gap-6">
        <ActionTooltip label="New Chat" side="bottom" align="center">
          <MessageSquareText
            className="cursor-pointer text-white/60 hover:text-white transition duration-300"
            onClick={handleAllContactsPage}
          />
        </ActionTooltip>
        <ActionTooltip label="More" side="bottom" align="center">
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
        </ActionTooltip>
      </div>
    </div>
  );
}

export default SidebarHeader;
