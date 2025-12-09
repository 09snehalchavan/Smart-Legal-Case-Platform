import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB0sibHzxWiODL5jQ4lVBROyhgaZCtwr-c",
  authDomain: "smartlegalcase.firebaseapp.com",
  projectId: "smartlegalcase",
  storageBucket: "smartlegalcase.firebasestorage.app",
  messagingSenderId: "747605651071",
  appId: "1:747605651071:web:3697a7679b3bb02a21594a",
  measurementId: "G-EEHB2HTLMG"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Firebase **Auth** (required)
export const auth = getAuth(app);

// Firebase **Firestore Database** (required)
export const db = getFirestore(app);
