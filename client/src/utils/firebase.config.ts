import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: process.env.VITE_FIREBASE_KEY!,
    authDomain: process.env.VITE_FIREBASE_DOMAIN!,
    projectId: process.env.VITE_FIREBASE_PROJECT_ID!,
    storageBucket: process.env.VITE_FIREBASE_BUDGET!,
    messagingSenderId: process.env.VITE_FIREBASE_SENDER_ID!,
    appId: process.env.VITE_FIREBASE_APP_ID!,
    measurementId: process.env.VITE_FIREBASE_MEASUREMENT_ID!,
};

const app = initializeApp(firebaseConfig);
export const firebaseAuth = getAuth(app);  