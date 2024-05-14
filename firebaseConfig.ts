// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { GoogleAuthProvider } from "firebase/auth";
import { FacebookAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA48rrz2pMt3t8URjqc8BkPPi_Ggo6Pv30",
  authDomain: "rapidnotify-c9c0a.firebaseapp.com",
  projectId: "rapidnotify-c9c0a",
  storageBucket: "rapidnotify-c9c0a.appspot.com",
  messagingSenderId: "1044222374285",
  appId: "1:1044222374285:web:c40ab2d5d5ef02b5fbcdc4",
  measurementId: "G-FCM0V6BGVR",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);

export const gooogleProvider = new GoogleAuthProvider();
export const facebookProvider = new FacebookAuthProvider();
