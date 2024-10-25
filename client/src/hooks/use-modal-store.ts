import { UserType } from "@/utils/types";
import { create } from "zustand";

export type ModalType = "photoLibrary" | "updatePassword" | "updateProfile";

interface ModalStore {
  type: ModalType | null;
  data: UserType;
  next: () => void;
  isOpen: boolean;
  onOpen: (type: ModalType, data?: UserType, next?: () => void) => void;
  onClose: () => void;
}

export const useModal = create<ModalStore>((set) => ({
  type: null,
  data: { first_name: "", last_name:"", email: "", avatar: "" },
  next: () => {},
  isOpen: false,
  onOpen: (type, data = { first_name: "", last_name:"", email: "", avatar: "" }, next) =>
    set({ isOpen: true, type, data, next }),
  onClose: () => set({ type: null, isOpen: false, next: () => {} }),
}));
