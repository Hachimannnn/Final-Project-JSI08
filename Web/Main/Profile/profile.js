// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getFirestore, collection, getDocs, setDoc, deleteDoc, doc, updateDoc, getDoc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

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

// Get elements
const navbarToggler = document.getElementById('navbarToggler');
const navLinks = document.querySelector('.nav-links');

// Add event listener for toggler button
navbarToggler.addEventListener('click', () => {
    navLinks.classList.toggle('active'); // Toggle the active class
});

// Function to fetch only the necessary link data from Firestore
async function fetchLinks() {
    try {
        const docRef = doc(db, 'links', 'link'); 
        const docSnap = await getDoc(docRef);

        const links = {};
        if (docSnap.exists()) {
            const data = docSnap.data();
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

    // List of navigation link IDs
    const navIDs = ['navBreeds', 'navDryFood', 'navWetFood', 'navOrganicFood', 'navClayLitter', 'navSilicaGelLitter', 
        'navNaturalLitter', 'navContact', 'navHome', 'navLogout', 'navProfile'];

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

// Function to fetch user data from Firestore
async function fetchUserData(userId) {
    try {
        const userDocRef = doc(db, "users", userId);
        const userDocSnap = await getDoc(userDocRef);

        if (userDocSnap.exists()) {
            const userData = userDocSnap.data();
            console.log("User data fetched:", userData);

            // Update the UI with the fetched data, adding checks for null or undefined values
            document.getElementById("profileBio").textContent = userData.Bio || "No bio available";
            document.getElementById("profileRole").textContent = userData.Role || "No role specified";
            document.getElementById("profileEmail").textContent = userData.Email || "No email provided";
            document.getElementById("profileName1").textContent = userData.Name || "No name available";
            document.getElementById("profileName2").textContent = userData.Name || "No name available";
            document.getElementById("profileImage").src = userData.profilePictureUrl || "defaultProfilePicture.png";
            document.getElementById("profileUsername").textContent = userData.username || "No username provided";
            document.getElementById("profilePicture").src = userData.profilePictureUrl || "defaultProfilePicture.png";
        } else {
            console.log("No such document!");
        }
    } catch (error) {
        console.error("Error fetching user data:", error);
    }
}

// Function to add a new role
async function addRole(roleData) {
    try {
        const roleCollectionRef = collection(db, 'roles');
        await setDoc(doc(roleCollectionRef, roleData.name), {
            permissions: roleData.permissions
        });
        console.log("Role added successfully:", roleData);
        fetchRoles(); // Refresh the roles list
        $("#addRoleModal").modal("hide"); // Hide the modal
        window.alert("Role added successfully!"); 
    } catch (error) {
        console.error("Error adding role:", error);
    }
}

// Event listener for add role form submission
document.getElementById("addRoleForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    const roleName = document.getElementById("addRoleName").value.trim();
    const rolePermissions = document.getElementById("addRolePermissions").value.split(',').map(perm => perm.trim());

    if (roleName) {
        await addRole({ name: roleName, permissions: rolePermissions });
    } else {
        window.alert("Please enter a role name.");
    }
});

// Function to update profile in Firestore
async function updateProfile(data) {
    try {
        const user = auth.currentUser;
        if (user) {
            const userId = user.uid;
            const userDocRef = doc(db, "users", userId);
            
            const updateData = {};
            if (data.bio) {
                updateData.Bio = data.bio;
            }
            if (data.username) {
                updateData.username = data.username;
            }
            
            await updateDoc(userDocRef, updateData);
            console.log("Profile updated successfully:", data);
        } else {
            console.log("No user is currently signed in.");
        }
    } catch (error) {
        console.error("Error updating profile:", error);
    }
}

// Event listeners for profile editing
document.addEventListener("DOMContentLoaded", () => {
    const profileBio = document.getElementById("profileBio");
    const profileUsername = document.getElementById("profileUsername");
    const editBioButton = document.querySelector(".button-55[role='button']:nth-of-type(1)");
    const editUsernameButton = document.querySelector(".button-55[role='button']:nth-of-type(2)");
  
    function editBio() {
        const newBio = prompt("Enter your new bio:", profileBio.textContent);
        if (newBio !== null && newBio.trim() !== "") {
            window.alert("Updated successfully!");
            profileBio.textContent = newBio;
            updateProfile({ bio: newBio });
        }
    }
  
    function editUsername() {
        const newUsername = prompt("Enter your new username:", profileUsername.textContent);
        if (newUsername !== null && newUsername.trim() !== "") {
            window.alert("Updated successfully!");
            profileUsername.textContent = newUsername;
            updateProfile({ username: newUsername });
        }
    }
    
    editBioButton.addEventListener("click", editBio);
    editUsernameButton.addEventListener("click", editUsername);
});


// Listen to authentication state changes
onAuthStateChanged(auth, async (user) => {
    if (user) {
        const userId = user.uid;
        await fetchUserData(userId); // Fetch user data and update profile UI

        // Fetch user role
        try {
            const userDocRef = doc(db, "users", userId);
            const userDocSnap = await getDoc(userDocRef);

            if (userDocSnap.exists()) {
                const userData = userDocSnap.data();
                const userRole = userData.Role.toLowerCase();

                // Toggle visibility based on user role
                const adminModeratorContainer = document.getElementById("admin-moderator-container");

                if (userRole === "admin" || userRole === "moderator") {
                    // Show the container if user is admin or moderator
                    adminModeratorContainer.style.display = "block";
                } else {
                    // Hide the container for other roles
                    adminModeratorContainer.style.display = "none";
                }
            } else {
                console.log("No such document!");
            }
        } catch (error) {
            console.error("Error fetching user role:", error);
        }
    } else {
        console.log("No user is signed in.");

        // Optionally, hide the admin/moderator sections if no user is signed in
        const adminModeratorContainer = document.getElementById("admin-moderator-container");
        adminModeratorContainer.style.display = "none";
    }
});

// Fetch and display roles
const fetchRoles = async () => {
    try {
        const rolesCollection = collection(db, "roles");
        const querySnapshot = await getDocs(rolesCollection);

        const rolesData = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));

        const rolesTableBody = document.getElementById("role-table").querySelector("tbody");
        if (!rolesTableBody) {
            console.error("Error: rolesTableBody element not found.");
            return;
        }

        rolesTableBody.innerHTML = "";

        rolesData.forEach(role => {
            const roleName = role.id;
            // Check if role.permissions is an array before using join
            const rolePermissions = Array.isArray(role.permissions) ? role.permissions.join(", ") : "No Permissions";

            const row = document.createElement("tr");
            const isDefaultRole = ["admin", "moderator", "user"].includes(roleName);

            row.innerHTML = `
                <td>${roleName}</td>
                <td>${rolePermissions}</td>
                <td>
                    <button class="btn btn-primary btn-edit-permissions" data-role-id="${roleName}" ${isDefaultRole ? 'disabled' : ''}>Edit Role</button>
                    <button class="btn btn-danger btn-delete-role" data-role-id="${roleName}" ${isDefaultRole ? 'disabled' : ''}>Delete Role</button>
                </td>
            `;

            rolesTableBody.appendChild(row);
        });

        addRoleEditListeners();
        addRoleDeleteListeners();

    } catch (error) {
        console.error("Error fetching roles: ", error);
    }
};

// Add listeners for editing role permissions
const addRoleEditListeners = () => {
    const editButtons = document.querySelectorAll(".btn-edit-permissions");

    editButtons.forEach(button => {
        button.addEventListener("click", async (event) => {
            const roleId = event.target.getAttribute("data-role-id");

            const roleDocRef = doc(db, "roles", roleId);
            const roleDocSnap = await getDoc(roleDocRef);

            let currentPermissions = [];
            if (roleDocSnap.exists()) {
                // Document exists, get current permissions
                currentPermissions = roleDocSnap.data().permissions || [];
            }

            document.getElementById("editRoleName").value = roleId;
            document.getElementById("editRolePermissions").value = currentPermissions.join(", ");

            $("#editRoleModal").modal("show");

            document.getElementById("editRoleForm").addEventListener("submit", async (e) => {
                e.preventDefault();

                const updatedPermissions = document.getElementById("editRolePermissions").value.split(",").map(perm => perm.trim());

                try {
                    // Update existing document
                    await updateDoc(roleDocRef, { permissions: updatedPermissions });
                    $("#editRoleModal").modal("hide");
                    fetchRoles();
                    window.alert("Updated successfully!"); 
                } catch (error) {
                    console.error("Error updating permissions:", error.message, error.code);
                }
            });
        });
    });
};

// Add listeners for editing user details
const addUserEditListeners = () => {
    const editButtons = document.querySelectorAll(".btn-edit-user");

    editButtons.forEach(button => {
        button.addEventListener("click", async (event) => {
            const userId = event.target.getAttribute("data-user-id");

            const userDocRef = doc(db, "users", userId);
            const userDoc = await getDoc(userDocRef);
            const userData = userDoc.data();

            // Pre-fill the form with user data
            document.getElementById("editUserName").value = userData.username;
            document.getElementById("editUserEmail").value = userData.Email;
            document.getElementById("editUserRole").value = userData.Role || "";

            // Show the modal
            $("#editUserModal").modal("show");

            const editForm = document.getElementById("editUserForm");
            editForm.removeEventListener("submit", handleEditFormSubmit);

            editForm.addEventListener("submit", async (e) => handleEditFormSubmit(e, userDocRef));
        });
    });
};
async function handleEditFormSubmit(e, userDocRef) {
    e.preventDefault();

    const updatedUser = {
        username: document.getElementById("editUserName").value,
        Email: document.getElementById("editUserEmail").value,
        Role: document.getElementById("editUserRole").value
    };

    try {
        await updateDoc(userDocRef, updatedUser);
        window.alert("User updated successfully!");
        $("#editUserModal").modal("hide");
        fetchUsers(); // Refresh the user list after updating
    } catch (error) {
        console.error("Error updating user: ", error);
    }
}

// Add listeners for deleting roles
const addRoleDeleteListeners = () => {
    const deleteButtons = document.querySelectorAll(".btn-delete-role");

    deleteButtons.forEach(button => {
        button.addEventListener("click", async (event) => {
            const roleId = event.target.getAttribute("data-role-id");

            if (confirm(`Are you sure you want to delete the role ${roleId}?`)) {
                try {
                    await deleteDoc(doc(db, "roles", roleId));
                    fetchRoles();
                    window.alert("Role deleted successfully!");  
                } catch (error) {
                    console.error("Error deleting role: ", error);
                }
            }
        });
    });
};

// Fetch and display users
const fetchUsers = async () => {
    try {
        const usersCollection = collection(db, "users");
        const querySnapshot = await getDocs(usersCollection);

        const usersData = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));

        // Sort users by role priority
        const rolePriority = {
            "admin": 1, 
            "moderator": 2,
            "vip": 3,
            "user": 4,
            "default": 5
        };

        usersData.sort((a, b) => {
            const rolesA = (a.Role || "default").toLowerCase().split(',').map(role => role.trim());
            const rolesB = (b.Role || "default").toLowerCase().split(',').map(role => role.trim());
            const highestPriorityA = Math.min(...rolesA.map(role => rolePriority[role] || 999));
            const highestPriorityB = Math.min(...rolesB.map(role => rolePriority[role] || 999));
            return highestPriorityA - highestPriorityB;
        });

        const usersTableBody = document.getElementById("user-table").querySelector("tbody");
        if (!usersTableBody) {
            console.error("Error: usersTableBody element not found.");
            return;
        }

        usersTableBody.innerHTML = "";

        // Fetch the current user's role
        const currentUser = auth.currentUser;
        const currentUserDocRef = doc(db, "users", currentUser.uid);
        const currentUserDocSnap = await getDoc(currentUserDocRef);
        const currentUserData = currentUserDocSnap.data();
        const currentUserRole = currentUserData.Role.toLowerCase();

        usersData.forEach(user => {
            const isAdmin = user.Role.toLowerCase() === 'admin';
            const isModerator = currentUserRole === 'moderator';

            // Create a new row element
            const row = document.createElement("tr");

            row.innerHTML = `
                <td>${user.Name || 'No Name'}</td>
                <td>${user.username || 'No Username'}</td>
                <td>${user.Email || 'No Email'}</td>
                <td>${user.Role || "No Role"}</td>
                <td>
                    <button class="btn btn-primary btn-edit-user" data-user-id="${user.id}" ${isAdmin || (isModerator && user.Role.toLowerCase() === 'admin') ? 'disabled' : ''}>Edit</button>
                    <button class="btn btn-danger btn-delete-user" data-user-id="${user.id}" ${isAdmin || (isModerator && user.Role.toLowerCase() === 'admin') ? 'style="display:none;"' : ''} ${isModerator ? 'style="display:none;"' : ''}>Delete</button>
                </td>
            `;
            usersTableBody.appendChild(row);
        });

        addUserEditListeners(); 
        addUserDeleteListeners();

    } catch (error) {
        console.error("Error fetching users: ", error);
    }
};


// Add listeners for deleting users
const addUserDeleteListeners = () => {
    const deleteButtons = document.querySelectorAll(".btn-delete-user");

    deleteButtons.forEach(button => {
        button.addEventListener("click", async (event) => {
            const userId = event.target.getAttribute("data-user-id");

            if (confirm(`Are you sure you want to delete the user with ID ${userId}?`)) {
                try {
                    await deleteDoc(doc(db, "users", userId));
                    fetchUsers();
                } catch (error) {
                    console.error("Error deleting user: ", error);
                }
            }
        });
    });
};

// Search functionality for users
const addSearchFunctionality = () => {
    const searchInput = document.getElementById("search-user-input");
    if (searchInput) {
        searchInput.addEventListener("input", () => {
            const filter = searchInput.value.toLowerCase();
            const rows = document.querySelectorAll("#user-table tbody tr");

            rows.forEach(row => {
                const username = row.cells[0].textContent.toLowerCase();
                const email = row.cells[1].textContent.toLowerCase();
                const name = row.cells[2].textContent.toLowerCase();
                const role = row.cells[3].textContent.toLowerCase();

                if (username.includes(filter) || email.includes(filter) || name.includes(filter) || role.includes(filter)) {
                    row.style.display = "";
                } else {
                    row.style.display = "none";
                }
            });
        });
    } else {
        console.error("Search input element not found.");
    }
};

// Initialize fetch and setup
document.addEventListener("DOMContentLoaded", () => {
    fetchRoles();
    fetchUsers();
    addSearchFunctionality();
});


