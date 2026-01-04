// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBRswH9Wc5lBZc3hgoC96-a2YN9HtsVXy4",
    authDomain: "dbsegmento.firebaseapp.com",
    databaseURL: "https://dbsegmento-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "dbsegmento",
    storageBucket: "dbsegmento.firebasestorage.app",
    messagingSenderId: "727351600050",
    appId: "1:727351600050:web:6ffebd7a38d137cc4dbaab"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);
