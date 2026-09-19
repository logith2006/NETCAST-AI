import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDoGK9iszFZEQce1r3T6-jFt05Ty3bVBZo",
  authDomain: "netcastai.firebaseapp.com",
  projectId: "netcastai",
  storageBucket: "netcastai.firebasestorage.app",
  messagingSenderId: "588599239805",
  appId: "1:588599239805:web:1110fbef7e28cd67933d14",
  measurementId: "G-VLLMCGFY9M"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });
