import { useEffect, useRef } from "react";

import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

interface ContextMenuProps {
  options: any[];
  cordinates: {
    x: number;
    y: number;
  };
  contextMenu: boolean;
  setContextMenu: React.Dispatch<React.SetStateAction<boolean>>;
}

function ContextMenu({
  options,
  cordinates,
  contextMenu,
  setContextMenu,
}: ContextMenuProps) {
  const contextMenuRef = useRef(null);

  useEffect(() => {
    const handleOutsideClick = (e: any) => {
      if (e.target.id !== "context-opener") {
        if (contextMenuRef.current) {
          setContextMenu(false);
        }
      }
    };

    document.addEventListener("click", handleOutsideClick);

    return () => {
      document.removeEventListener("click", handleOutsideClick);
    };
  }, []);

  const handleClick = (e: React.MouseEvent<HTMLDivElement>, callback: any) => {
    e.stopPropagation();

    setContextMenu(false);
    callback();
  };
  
  return (
    <>
      <div
      className={cn(
        `min-w-48 fixed z-[999] border py-3 px-1 rounded-md shadow-md flex flex-col gap-1 items-center bg-accent text-accent-foreground`
      )}
      style={{
        top: `calc(${cordinates.y}px - 100px)`,
        left: `calc(${cordinates.x}px + 100px)`
      }}
      ref={contextMenuRef}
    >
      <Separator className="bg-accent-foreground text-accent-foreground" />
      {options.map(({ name, callback }, index) => {
        return (
            <div className="w-full px-2 py-2 text-sm capitalize rounded-sm hover:bg-white/20 cursor-pointer" key={index} onClick={(e) => handleClick(e, callback)}>
              {name}
            </div>
        );
      })}
      <Separator className="bg-accent-foreground text-accent-foreground" />
    </div>
      {/* <DropdownMenu onOpenChange={setContextMenu} open={contextMenu}>
        <DropdownMenuContent
          className="w-56 999999999"
          style={{
            // top: `calc(${cordinates.y}px - 100px)`,
            // left: `calc(${cordinates.x}px + 100px)`,
          }}
        >
          <DropdownMenuSeparator />
          {options.map(({ name, callback }, index) => (
            <DropdownMenuItem
              key={index}
              onClick={(e) => handleClick(e, callback)}
            >
              {name}
            </DropdownMenuItem>
          ))}
          <DropdownMenuSeparator />
        </DropdownMenuContent>
      </DropdownMenu> */}
    </>
  );
}

export default ContextMenu;
