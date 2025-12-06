import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyA-g_w9B4Nin7TqAtb487dfX3bI1mBmOpo",
  authDomain: "pet-care-adoption.firebaseapp.com",
  projectId: "pet-care-adoption",
  storageBucket: "pet-care-adoption.firebasestorage.app",
  messagingSenderId: "206997293389",
  appId: "1:206997293389:web:c49a074876195a46618f04",
  measurementId: "G-GRV1DKDJP2"
};


const app = initializeApp(firebaseConfig);


export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;
