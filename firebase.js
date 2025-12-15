import { initializeApp, getApps, getApp } from "firebase/app";
import { initializeAuth, getAuth, getReactNativePersistence } from "firebase/auth";
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyA-g_w9B4Nin7TqAtb487dfX3bI1mBmOpo",
  authDomain: "pet-care-adoption.firebaseapp.com",
  projectId: "pet-care-adoption",
  storageBucket: "pet-care-adoption.firebasestorage.app",
  messagingSenderId: "206997293389",
  appId: "1:206997293389:web:c49a074876195a46618f04",
  measurementId: "G-GRV1DKDJP2",
};

// ✅ ensure single app instance
const app = getApps().length === 0
  ? initializeApp(firebaseConfig)
  : getApp();

// ✅ ensure single auth instance
let auth;
try {
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(ReactNativeAsyncStorage),
  });
} catch (e) {
  auth = getAuth(app);
}

export { auth };
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;
