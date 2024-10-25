import googleLogo from "@/assets/google-logo.svg";

import { useEffect } from "react";
import { Github } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { reducerCases } from "@/context/constants";
import { useStateProvider } from "@/context/state-context";
import { firebaseAuth } from "@/utils/firebase.config";

import { Button } from "@/components/ui/button";
import { checkUser } from "@/actions/user.api";
import { toast } from "sonner";

function AuthActions() {
  const navigate = useNavigate();

  const [{ userInfo, newUser }, dispatch] = useStateProvider();

  useEffect(() => {
    if (userInfo?.id && !newUser) navigate("/");
  }, [userInfo, newUser]);

  const handleGoogle = async () => {
    const provider = new GoogleAuthProvider();
    const {
      user: { displayName, email, photoURL },
    } = await signInWithPopup(firebaseAuth, provider);

    try {
      if (email) {
        const { status, user } = await checkUser(email);
        if (!status) {
          dispatch({ type: reducerCases.SET_NEW_USER, newUser: true });
          dispatch({
            type: reducerCases.SET_USER_INFO,
            userInfo: {
              first_name: displayName!,
              last_name: "",
              email,
              avatar: photoURL!,
              status: "Avaialble",
            },
          });
          navigate("/on-boarding");
        } else {
          const {
             id, name, email, avatar, bio,
          } = user;
          dispatch({
            type: reducerCases.SET_USER_INFO,
            userInfo: {
              id,
              first_name: name,
              last_name: "",
              email,
              avatar,
              bio,
              status: "Done",
            },
          });
        }
      }
    } catch (error: any) {
      console.log(error);
      toast.error(error?.response?.data?.message);
    }
  };

  return (
    <div className="space-x-4 flex items-center justify-between text-base">
      <Button className="w-full py-5" variant={"alternative"}>
        <Github className="w-5 h-5 mr-2" />
        Log in with GitHub
      </Button>
      <Button
        className="w-full py-5"
        variant={"alternative"}
        onClick={handleGoogle}
      >
        <img className="w-5 h-5 mr-2" src={googleLogo} alt="" />
        Log in with Google
      </Button>
    </div>
  );
}

export default AuthActions;
