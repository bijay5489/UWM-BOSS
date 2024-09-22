// scripts.js
document.addEventListener('DOMContentLoaded', () => {
    const loginButton = document.getElementById('loginButton');

    loginButton.addEventListener('click', () => {
        alert('Logging in with Outlook...');
        // Here you would typically initiate the actual login process
    });

    // Add a subtle hover effect to the image
    const imageContainer = document.querySelector('.image-container');
    imageContainer.addEventListener('mouseover', () => {
        imageContainer.style.transform = 'scale(1.05)';
        imageContainer.style.transition = 'transform 0.3s ease-in-out';
    });
    imageContainer.addEventListener('mouseout', () => {
        imageContainer.style.transform = 'scale(1)';
    });
});
