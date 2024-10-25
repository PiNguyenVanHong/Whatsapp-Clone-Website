import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyC7M9xkPI2wYvUWvW7Ka5UruY-0DJQO5IM",
    authDomain: "whatsapp-clone-b5469.firebaseapp.com",
    projectId: "whatsapp-clone-b5469",
    storageBucket: "whatsapp-clone-b5469.appspot.com",
    messagingSenderId: "1048526634035",
    appId: "1:1048526634035:web:dcb4979362520e0a4a7746",
    measurementId: "G-9SML45X4RQ"   
};

const app = initializeApp(firebaseConfig);
export const firebaseAuth = getAuth(app);  