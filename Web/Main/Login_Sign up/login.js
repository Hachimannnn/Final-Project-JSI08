// Import necessary Firebase functions
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAQ0VkyiUKmuBq_x9h9WyPYBgLPJl7m7uI",
    authDomain: "project-bf551.firebaseapp.com",
    projectId: "project-bf551",
    storageBucket: "project-bf551.appspot.com",
    messagingSenderId: "432442360479",
    appId: "1:432442360479:web:f6fb13bb253a4c0eb798aa",
    measurementId: "G-9368MHKZM9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Handle form submission
document.getElementById('login-form').addEventListener('submit', async (event) => {
    event.preventDefault();

    // Get form values
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    try {
        // Sign in user
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Redirect to main.html
        window.location.href = '/Web/Main/Home/main.html';

    } catch (error) {
        console.error('Error logging in:', error.message);
        alert('Failed to log in: ' + error.message);
    }
});
