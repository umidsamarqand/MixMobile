// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDn5tCx6YPdG7WPw-tB_jqjeKoqA_n8oJU",
  authDomain: "mix-mobile-7540d.firebaseapp.com",
  projectId: "mix-mobile-7540d",
  storageBucket: "mix-mobile-7540d.firebasestorage.app",
  messagingSenderId: "818368657139",
  appId: "1:818368657139:web:13aed1fb3017f1fc492986",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
