import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "YOUR_REAL_API_KEY_HERE",
  authDomain: "mix-mobile-7540d.firebaseapp.com",
  projectId: "mix-mobile-7540d",
  storageBucket: "mix-mobile-7540d.firebasestorage.app",
  messagingSenderId: "818368657139",
  appId: "1:818368657139:web:13aed1fb3017f1fc492986"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;
