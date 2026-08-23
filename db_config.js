import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyDhADP8Q07UBetPIYYXyd3jEWN-7MZnkR8",
  authDomain: "fwef-79209.firebaseapp.com",
  projectId: "fwef-79209",
  storageBucket: "fwef-79209.firebasestorage.app",
  messagingSenderId: "698086850775",
  appId: "1:698086850775:web:3b8243adc845a09e5bb092",
  measurementId: "G-SBVDNC6BKX"
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
console.log("authentication status: ", auth)
export const db = getFirestore(app);

console.log(db)
