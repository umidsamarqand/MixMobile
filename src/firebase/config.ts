import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDn5tCx6YPdG7WPw-tB_jqjeKoqA_n8oJU",
  authDomain: "mix-mobile-7540d.firebaseapp.com",
  projectId: "mix-mobile-7540d",
  storageBucket: "mix-mobile-7540d.firebasestorage.app",
  messagingSenderId: "818368657139",
  appId: "1:818368657139:web:13aed1fb3017f1fc492986"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;
