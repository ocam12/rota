import { initializeApp } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-analytics.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-firestore.js";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyAHrYGXs_6oFNFmfsKEkjBbn5cy640IzqU",
    authDomain: "rota-generator-a964a.firebaseapp.com",
    projectId: "rota-generator-a964a",
    storageBucket: "rota-generator-a964a.firebasestorage.app",
    messagingSenderId: "678559602496",
    appId: "1:678559602496:web:38224cd1030013c643cca5",
    measurementId: "G-510NFBH1L0"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const analytics = getAnalytics(app);
export const db = getFirestore(app);