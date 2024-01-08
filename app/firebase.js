// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: "notes-88db1",
  storageBucket: "notes-88db1.appspot.com",
  messagingSenderId: "694528067257",
  appId: "1:694528067257:web:9eeca08367b54dd0ec7d68"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);