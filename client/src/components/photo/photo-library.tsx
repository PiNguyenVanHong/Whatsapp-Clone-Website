import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { useEffect } from "react";

const images = [
  "/avatars/1.svg",
  "/avatars/2.svg",
  "/avatars/3.svg",
  "/avatars/4.svg",
  "/avatars/5.svg",
  "/avatars/6.svg",
  "/avatars/7.svg",
  "/avatars/8.svg",
];

interface PhotoLibraryProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  setPhoto: (value: string) => void;
}

function PhotoLibrary({ open, setOpen, setPhoto }: PhotoLibraryProps) {
  
  useEffect(() => {
    if (open) {
      document.getElementById("code")!.style.scale = ".9";
    } else {
      document.getElementById("code")!.style.scale = "1";
    }
  }, [open]);

  const handleClick = (index: number) => {
    setPhoto(images[index]);
    setOpen(false);
  };

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerContent>
        <div className="mx-auto w-full md:max-w-md lg:max-w-lg xl:max-w-xl">
          <div className="">
            <DrawerHeader>
              <DrawerTitle className="text-center">
                Library Available Photo
              </DrawerTitle>
              <DrawerDescription className="text-center">
                Choose a photo you want to set your avatar.
              </DrawerDescription>
            </DrawerHeader>
            <DrawerClose className="" asChild>
              <Button variant="destructive">
                <X />
              </Button>
            </DrawerClose>
          </div>
          <div className="p-4 pb-4">
            <div className="mt-3 grid grid-cols-4 gap-3">
              {images.map((image, index) => (
                <div key={index} onClick={() => handleClick(index)}>
                  <div className="w-32 h-32 shadow-emerald-700 shadow-lg rounded-full cursor-pointer group overflow-hidden">
                    <img
                      className="transition-all scale-100 group-hover:scale-110"
                      src={image}
                      alt="Avatar"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}

export default PhotoLibrary;
