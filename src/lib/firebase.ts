import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBYCRQteOiJR7ghkC4g5FJc0K6P940F9mk",
  authDomain: "otpsession-79be4.firebaseapp.com",
  projectId: "otpsession-79be4",
  storageBucket: "otpsession-79be4.firebasestorage.app",
  messagingSenderId: "874812722758",
  appId: "1:874812722758:web:123538f8a7141d4c32c447",
  measurementId: "G-2RT46Y7CF0",
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const auth = getAuth(app);

export { app, auth };
