// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getFirestore, collection, getDocs, doc, getDoc, setDoc, deleteDoc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

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

// Function to fetch only the necessary link data from Firestore
async function fetchLinks() {
    try {
        const docRef = doc(db, 'links', 'link'); 
        const docSnap = await getDoc(docRef);

        const links = {};
        if (docSnap.exists()) {
            const data = docSnap.data();

            // Add each key-value pair from the document to the links object
            for (const key in data) {
                if (data.hasOwnProperty(key)) {
                    links[key] = data[key];
                }
            }
        } else {
            console.log('No such document!');
        }
        return links;
    } catch (error) {
        console.error("Error fetching links from Firestore:", error);
        return {};
    }
}

// Function to set up navigation
async function setupNavigation() {
    const links = await fetchLinks(); 

    const navIDs = ['navBreeds', 'navDryFood', 'navWetFood', 'navOrganicFood', 'navClayLitter', 'navSilicaGelLitter', 
        'navNaturalLitter', 'navContact', 'navLogin', 'navSignUp', 'navHome', 'navProfile', 'navLogout', 'catFoodArticle1', 'catFoodArticle2', 
        'catFoodArticle3', 'catHealthArticle1', 'catHealthArticle2', 'catHealthArticle3', 'howToArticle1', 'howToArticle2', 'howToArticle3'];

    navIDs.forEach((id) => {
        const element = document.getElementById(id);
        if (element) {  // Check if the element exists
            if (links[id]) {
                element.addEventListener('click', () => {
                    console.log(`Navigating to ${links[id]}`); // Log the navigation
                    window.location.href = links[id];
                });
            } else {
                console.log(`No URL found for ${id}`); // Log if no URL found
            }
        } else {
            console.log(`Element with ID ${id} not found`); // Log if element not found
        }
    });
}

// Initialize navigation
document.addEventListener('DOMContentLoaded', async () => {
    await setupNavigation(); 
});

onAuthStateChanged(auth, async (user) => {
    const navLogout = document.getElementById('navLogout');
    const navProfile = document.getElementById('navProfile');
    const navLogin = document.getElementById('navLogin');
    const navSignUp = document.getElementById('navSignUp');
    const profilePicture = document.getElementById('profilePicture');

    if (user) {
        console.log("User is signed in:", user.email);

        // Fetch user-specific data from Firestore
        const userDocRef = doc(db, "users", user.uid); // Assuming 'user.uid' is the document ID in Firestore
        const userDocSnap = await getDoc(userDocRef);

        if (userDocSnap.exists()) {
            const userData = userDocSnap.data();
            console.log("User data:", userData);

            // Display user information
            document.getElementById('Name').textContent = userData.Name || "User";
            profilePicture.src = userData.profilePictureUrl || "default-profile-pic-url";

            // Show profile and logout, hide login and signup
            navProfile.style.display = 'flex'; 
            navLogout.style.display = 'block';
            navLogin.style.display = 'none';
            navSignUp.style.display = 'none';

            // Add logout functionality
            navLogout.addEventListener('click', async () => {
                try {
                    await signOut(auth);
                    console.log('User signed out successfully');
                    navProfile.style.display = 'none';
                    navLogout.style.display = 'none';
                    navLogin.style.display = 'block';
                    navSignUp.style.display = 'block';
                } catch (error) {
                    console.error('Error during sign out:', error);
                }
            });

        } else {
            console.log("No such user document in Firestore!");
            
            // Handle case where document does not exist
            navProfile.style.display = 'none';
            navLogout.style.display = 'none';
            navLogin.style.display = 'block';
            navSignUp.style.display = 'block';
        }
    } else {
        console.log("No user is signed in.");
        
        // Handle case where no user is signed in
        navProfile.style.display = 'none';
        navLogout.style.display = 'none';
        navLogin.style.display = 'block';
        navSignUp.style.display = 'block';
    }
});
