import AvatarEmpty from "@/assets/avatar-empty.svg";

import React, { MouseEvent, useEffect, useState } from "react";
import { Camera } from "lucide-react";
import { cn } from "@/lib/utils";

import ContextMenu from "@/context/context-menu";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import PhotoPicker from "@/components/photo/photo-picker";
import PhotoLibrary from "@/components/photo/photo-library";
import PhotoCapture from "@/components/photo/photo-capture";
import { HOST } from "@/actions/api.route";

interface AvatarWidgetProps {
  type: "sm" | "lg" | "xl";
  image: string | undefined;
  setImage?: React.Dispatch<React.SetStateAction<string>>;
  setFile?: React.Dispatch<React.SetStateAction<File | undefined>>;
}

function AvatarWidget({ type, image, setImage, setFile }: AvatarWidgetProps) {
  const [hover, setHover] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [grabPhoto, setGrabPhoto] = useState(false);
  const [showPhotoLibrary, setShowPhotoLibrary] = useState(false);
  const [showPhotoCapture, setShowPhotoCapture] = useState(false);
  const [contextMenuCordinates, setContextMenuCordinates] = useState({
    x: 0,
    y: 0,
  });

  useEffect(() => {
    if (grabPhoto && setImage) {
      const data = document.getElementById("photo-picker");
      data?.click();
      document.body.onfocus = () => {
        setTimeout(() => {
          setGrabPhoto(false);
        }, 1000);
      };
    }
  }, [grabPhoto]);

  const onOpenMenu = (e: MouseEvent<HTMLButtonElement>) => {
    if (!setImage) return;
    e.preventDefault();

    setContextMenuCordinates({ x: e.pageX - 560, y: e.pageY });

    setIsOpen(true);
  };

  const photoPickerChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    if (!setImage) return;
    const file = e.target.files[0];
    const reader = new FileReader();
    const data = document.createElement("img");
    reader.onload = (event: any) => {
      data.src = event.target.result;
      data.setAttribute("data-src", event.target.result);
    };
    reader.readAsDataURL(file);
    setTimeout(() => {
      setImage(data.src);
      if (setFile) setFile(file);
    }, 100);
  };

  const contextMenuOptions = [
    {
      name: "Take a photo",
      callback: () => {
        setShowPhotoCapture(true);
        if (setFile) setFile(undefined);
      },
    },
    {
      name: "Choose from libary",
      callback: () => {
        setShowPhotoLibrary(true);
        if (setFile) setFile(undefined);
      },
    },
    {
      name: "Upload a photo",
      callback: () => {
        setGrabPhoto(true);
        if (setFile) setFile(undefined);
      },
    },
    {
      name: "Remove a photo",
      callback: () => {
        if (setImage) setImage("");
        if (setFile) setFile(undefined);
      },
    },
  ];
  
  return (
    <>
      <div className="flex items-center justify-center w-full">
        <Avatar
          className={cn(
            "bg-white",
            type === "sm" && "w-10 h-10",
            type === "lg" && "w-36 h-36",
            type === "xl" && "w-60 h-60"
          )}
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
        >
          {setImage && (
            <div
            className={cn(
              "bg-black/30 absolute inset-0 flex items-center justify-center flex-col text-center text-accent-foreground gap-2 cursor-pointer",
              hover ? "visible" : "hidden",
              type === "sm" && "w-10 h-10",
              type === "lg" && "w-36 h-36",
              type === "xl" && "w-60 h-60"
            )}
          >
            <button
              className={cn(
                "flex flex-col items-center",
                type === "sm" && "",
                type === "lg" && "text-sm",
                type === "xl" && "text-lg"
              )}
              onClick={(e) => onOpenMenu(e)}
            >
              <Camera
                id="context-opener"
                size={
                  type === "sm"
                    ? 20
                    : type === "lg"
                    ? 25
                    : type === "xl"
                    ? 30
                    : 50
                }
              />
              Change your avatar
            </button>
          </div>
          )}
          <AvatarImage src={image?.toString().includes("uploads") ? `${HOST}/${image}` : image || AvatarEmpty} alt="Avatar" />
        </Avatar>
      </div>
      {isOpen && setImage && (
        <ContextMenu
          options={contextMenuOptions}
          cordinates={contextMenuCordinates}
          contextMenu={isOpen}
          setContextMenu={setIsOpen}
        />
      )}
      {grabPhoto && <PhotoPicker onChange={photoPickerChange} />}
      {setImage && showPhotoCapture && (
        <PhotoCapture setPhoto={setImage} setOpen={setShowPhotoCapture} />
      )}
      {setImage && (
        <PhotoLibrary
          open={showPhotoLibrary}
          setOpen={setShowPhotoLibrary}
          setPhoto={setImage}
        />
      )}
    </>
  );
}

export default AvatarWidget;
