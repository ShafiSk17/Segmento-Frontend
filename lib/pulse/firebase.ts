// Pulse Firebase Configuration
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const pulseFirebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_PULSE_FIREBASE_API_KEY!,
    authDomain: process.env.NEXT_PUBLIC_PULSE_FIREBASE_AUTH_DOMAIN!,
    projectId: process.env.NEXT_PUBLIC_PULSE_FIREBASE_PROJECT_ID!,
    storageBucket: process.env.NEXT_PUBLIC_PULSE_FIREBASE_STORAGE_BUCKET!,
    messagingSenderId: process.env.NEXT_PUBLIC_PULSE_FIREBASE_MESSAGING_SENDER_ID!,
    appId: process.env.NEXT_PUBLIC_PULSE_FIREBASE_APP_ID!
};

// Initialize Pulse Firebase app with a unique name
const pulseApp = initializeApp(pulseFirebaseConfig, "pulse");

export const pulseAuth = getAuth(pulseApp);
export const db = getFirestore(pulseApp); // For analytics/view counting
