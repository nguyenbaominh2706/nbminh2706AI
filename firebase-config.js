import { initializeApp } from "https://www.gstatic.com/firebasejs/12.5.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.5.0/firebase-analytics.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/12.5.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/12.5.0/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyCvcNY4x_0PcDLJ8NQxo27MKhkKhxtGC2Y",
    authDomain: "hotrotoanhoc-961ac.firebaseapp.com",
    projectId: "hotrotoanhoc-961ac",
    storageBucket: "hotrotoanhoc-961ac.firebasestorage.app",
    messagingSenderId: "211870571947",
    appId: "1:211870571947:web:3f2e75cf369c50f8e3c6ee",
    measurementId: "G-K9VGB04Y6J"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };