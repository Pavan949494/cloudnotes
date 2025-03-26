// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBByk3DWIrYCAl8SyX8PX2CgirF5c4z__U",
  authDomain: "cloudnotes-e4e3f.firebaseapp.com",
  projectId: "cloudnotes-e4e3f",
  storageBucket: "cloudnotes-e4e3f.appspot.com",
  messagingSenderId: "586996108952",
  appId: "1:586996108952:web:a404ae0fe3d650e6494aed"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
