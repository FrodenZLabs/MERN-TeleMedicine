import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mediclinic-app-5078c.firebaseapp.com",
  projectId: "mediclinic-app-5078c",
  storageBucket: "mediclinic-app-5078c.appspot.com",
  messagingSenderId: "352894596418",
  appId: "1:352894596418:web:b6f9dfa08eea591b5704db",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
