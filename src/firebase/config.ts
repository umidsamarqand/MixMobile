import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getAnalytics, isSupported } from 'firebase/analytics';

// All values come from Vite environment variables (must be prefixed VITE_ to be
// exposed to client-side code). Set these in a local .env file for development
// and in Vercel Project Settings -> Environment Variables for production.
// See .env.example for the full list of required keys.
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

// Fail loudly and early in dev if config is missing, instead of a confusing
// runtime error deep inside the Firebase SDK.
if (!firebaseConfig.apiKey || !firebaseConfig.projectId) {
  // eslint-disable-next-line no-console
  console.error(
    '[Firebase] Missing configuration. Make sure VITE_FIREBASE_* environment variables ' +
    'are set (see .env.example). The app will not be able to reach Firebase until this is fixed.'
  );
}

// Reuse the existing app instance on hot-reload instead of re-initializing.
export const firebaseApp = getApps().length ? getApp() : initializeApp(firebaseConfig);

export const auth = getAuth(firebaseApp);
export const db = getFirestore(firebaseApp);

// Analytics only works in a real browser (not SSR, not every environment
// supports it), so it's initialized asynchronously and safely no-ops if
// unsupported or if measurementId isn't configured.
export let analytics: ReturnType<typeof getAnalytics> | undefined;
if (firebaseConfig.measurementId) {
  isSupported().then((supported) => {
    if (supported) {
      analytics = getAnalytics(firebaseApp);
    }
  });
}
