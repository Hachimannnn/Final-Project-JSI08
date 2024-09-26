import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getFirestore, setDoc, doc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

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
initializeApp(firebaseConfig);
const auth = getAuth();
const db = getFirestore();

// Handle form submission
document.getElementById('signup-form').addEventListener('submit', async (event) => {
    event.preventDefault();

    // Get form values
    const name = document.getElementById('signup-name').value;
    const email = document.getElementById('signup-email').value;
    const username = document.getElementById('signup-username').value;
    const password = document.getElementById('signup-password').value;
    const confirmPassword = document.getElementById('confirm-password').value;

    // Validate passwords
    if (password !== confirmPassword) {
        alert('Passwords do not match.');
        return;
    }

    try {
        // Create new user
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Save additional user information to Firestore
        await setDoc(doc(db, 'users', user.uid), {
            Name: name,
            Email: email,
            username: username,
            profilePictureUrl: "https://www.shutterstock.com/image-vector/blank-avatar-photo-place-holder-600nw-1095249842.jpg", // Default profile picture URL
            Bio: "Example", // Default Bio
            Role: "user", // Default role
        });

        // Redirect to main.html
        window.location.href = '/Web/Main/Home/main.html';

    } catch (error) {
        console.error('Error signing up:', error.message);
        alert('Failed to create account: ' + error.message);
    }
});
