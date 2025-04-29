// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage"; 
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDnTeCO6M9zL-8C5lX7nvkrLkVqkRegZkw",
  authDomain: "nextstepcv-702de.firebaseapp.com",
  projectId: "nextstepcv-702de",
  storageBucket: "nextstepcv-702de.firebasestorage.app",
  messagingSenderId: "469880445932",
  appId: "1:469880445932:web:ad59c603a1b3145fb4bec9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app); 