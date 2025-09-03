// src/firebase.ts
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAmd-kk_qa4nzXzcvLq26D4pL2ahXz1R8U",
  authDomain: "whowillbethebestalcoholic.firebaseapp.com",
  projectId: "whowillbethebestalcoholic",
  storageBucket: "whowillbethebestalcoholic.firebasestorage.app",
  messagingSenderId: "799323460198",
  appId: "1:799323460198:web:b2893ebd89d5f6f2d9d3a7",
  measurementId: "G-HLZS6GPK2N"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);