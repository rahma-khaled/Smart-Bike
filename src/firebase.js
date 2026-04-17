// src/firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyChXdz-OGWYZQZBco2KaTzdVbbIeCrfoY0",
  authDomain: "smartbike-iot-e3e31.firebaseapp.com",
  projectId: "smartbike-iot-e3e31",
  storageBucket: "smartbike-iot-e3e31.firebasestorage.app",
  messagingSenderId: "1070261965567",
  appId: "1:1070261965567:web:758a0f0464ba3b1c7232ca"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export for use in other files
export const db = getFirestore(app);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
