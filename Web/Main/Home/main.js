const apiKey = 'live_gVaUir7Ptx7NT15y7VmtjShEHSjqrb1yFyiQJZFbYMIwtL7v7FsCAWgIxWv5ip6J'; 

async function fetchCatImages() {
    const response = await fetch('https://api.thecatapi.com/v1/images/search?limit=3&has_breeds=1', {
        headers: {
            'x-api-key': apiKey
        }
    });
    const data = await response.json();
    
    // Loop through the images and set the source for each image element
    for (let i = 0; i < data.length; i++) {
        const catImage = document.getElementById(`catImage${i + 1}`);
        const catBreed = document.getElementById(`catBreed${i + 1}`);
        
        // Set the image source
        catImage.src = data[i].url;

        // Check if breed information is available
        if (data[i].breeds && data[i].breeds.length > 0) {
            // Extract breed name
            catBreed.textContent = `Breed: ${data[i].breeds[0].name}`;
        } else {
            catBreed.textContent = 'Breed: Unknown';
        }
    }
}

// Call the function to display cat images
fetchCatImages();

// Get elements
const navbarToggler = document.getElementById('navbarToggler');
const navLinks = document.querySelector('.nav-links');

// Add event listener for toggler button
navbarToggler.addEventListener('click', () => {
    navLinks.classList.toggle('active'); // Toggle the active class
});