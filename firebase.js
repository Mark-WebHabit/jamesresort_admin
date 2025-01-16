// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCPVWl3dMKlyNs1qEu0a7nJSYoD1ZUwX9Y",
  authDomain: "jamesresort-5ea37.firebaseapp.com",
  databaseURL: "https://jamesresort-5ea37-default-rtdb.firebaseio.com",
  projectId: "jamesresort-5ea37",
  storageBucket: "jamesresort-5ea37.firebasestorage.app",
  messagingSenderId: "1072514165301",
  appId: "1:1072514165301:web:b69308f160be90f3c41f7c",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);
