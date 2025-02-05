// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "",
  authDomain: "todo-5df01.firebaseapp.com",
  projectId: "todo-5df01",
  storageBucket: "todo-5df01.firebasestorage.app",
  messagingSenderId: "411237339203",
  appId: "1:411237339203:web:9a7acce36e92c74dc604f6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
 export const db = getFirestore(app);