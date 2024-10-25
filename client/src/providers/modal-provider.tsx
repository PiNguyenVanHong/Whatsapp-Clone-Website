import PhotoLibrary from "@/components/modals/photo-library";
import UpdatePasswordModal from "@/components/modals/update-password-modal";
import UpdateProfileModal from "@/components/modals/update-profile-modal";
import { useEffect, useState } from "react";

function ModalProvider() {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    if(!isMounted) {
        return null;
    }

    return (
        <>
          <PhotoLibrary /> 
          <UpdateProfileModal /> 
          <UpdatePasswordModal />
        </>
    );
};

export default ModalProvider;