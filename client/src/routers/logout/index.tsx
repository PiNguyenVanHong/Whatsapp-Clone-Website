import { reducerCases } from "@/context/constants";
import { useStateProvider } from "@/context/state-context";
import { firebaseAuth } from "@/utils/firebase.config";
import { signOut } from "firebase/auth";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function LogoutPage() {
    const navigate = useNavigate();
    const [{ socket, userInfo }, dispatch] = useStateProvider();

    useEffect(() => {
        if(!socket?.current) return;
        socket?.current.emit("remove:user", userInfo?.id);
        dispatch({
            type: reducerCases.SET_USER_INFO,
            userInfo: undefined,
        });
        signOut(firebaseAuth);
        navigate("/login");
    }, [socket]);

    return (
        <div>
        </div>
    )
}

export default LogoutPage;