// PWA Service Worker Registration
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/serviceworker.js')
            .then(registration => {
                console.log('Service Worker registered! Scope:', registration.scope);
            })
            .catch(err => {
                console.log('Service Worker registration failed:', err);
            });
    });
}

// --- PWA Functionality (Loading Screen and Dark Mode) ---
const loadingScreen = document.getElementById('loading-screen');
const mainContent = document.getElementById('main-content');
const darkModeToggle = document.getElementById('dark-mode-toggle');

document.addEventListener("DOMContentLoaded", () => {
    setTimeout(function() {
        if (loadingScreen) {
            loadingScreen.style.display = 'none';
        }
        if (mainContent) {
            mainContent.style.display = 'block';
        }
    }, 3000);
});

if (darkModeToggle) {
    darkModeToggle.addEventListener('change', () => {
        document.body.classList.toggle('dark-mode');
    });
}

// --- Main App Functionality ---
const photoGallery = document.getElementById('photo-gallery');
const favoritesGallery = document.getElementById('favorite-gallery');
const favoritesDot = document.getElementById('favorites-dot');
const notificationCount = document.getElementById('notification-count');
const notificationList = document.getElementById('notification-list');
const homeIcon = document.getElementById('home-icon');
const favoritesIcon = document.getElementById('favorites-icon');
const notificationIcon = document.getElementById('notification-icon');
const moreOptionsIcon = document.getElementById('more-options-icon');
const aboutUsLink = document.getElementById('about-us-link');
const privacyPolicyLink = document.getElementById('privacy-policy-link');
const contactUsLink = document.getElementById('contact-us-link');
const moreOptionsModal = document.getElementById('more-options-modal');
const moreOptionsCloseBtn = document.querySelector('.more-options-close');
const sections = document.querySelectorAll('.main-content > div');

const photoViewSection = document.getElementById('photo-view-section');
const photoViewImage = document.getElementById('photo-view-image');
const backButton = document.getElementById('back-button');

// Example data - You can replace this with your actual image data
let posts = [
    { id: 1, image: 'https://i.imgur.com/vHq9r8z.jpg', isFavorite: false },
    { id: 2, image: 'https://i.imgur.com/kS5x0Bq.jpg', isFavorite: false },
    { id: 3, image: 'https://i.imgur.com/c6F2N0o.jpg', isFavorite: false },
    { id: 4, image: 'https://i.imgur.com/F0vXoJ2.jpg', isFavorite: false },
    { id: 5, image: 'https://i.imgur.com/L1dF1V1.jpg', isFavorite: false },
    { id: 6, image: 'https://i.imgur.com/3Zf8yKj.jpg', isFavorite: false },
    { id: 7, image: 'https://i.imgur.com/N74N0P5.jpg', isFavorite: false },
    { id: 8, image: 'https://i.imgur.com/Qj4dG4O.jpg', isFavorite: false },
];

let notifications = [];
let isFavoritesViewed = true;
let unreadNotificationCount = 0;

// --- Functions to save/load data from Local Storage ---
function saveData() {
    localStorage.setItem('posts', JSON.stringify(posts));
    localStorage.setItem('notifications', JSON.stringify(notifications));
    localStorage.setItem('isFavoritesViewed', JSON.stringify(isFavoritesViewed));
    localStorage.setItem('unreadNotificationCount', JSON.stringify(unreadNotificationCount));
}

function loadData() {
    const savedPosts = localStorage.getItem('posts');
    const savedNotifications = localStorage.getItem('notifications');
    const savedIsFavoritesViewed = localStorage.getItem('isFavoritesViewed');
    const savedUnreadCount = localStorage.getItem('unreadNotificationCount');

    if (savedPosts) {
        posts = JSON.parse(savedPosts);
    }
    if (savedNotifications) {
        notifications = JSON.parse(savedNotifications);
    }
    if (savedIsFavoritesViewed !== null) {
        isFavoritesViewed = JSON.parse(savedIsFavoritesViewed);
    }
    if (savedUnreadCount !== null) {
        unreadNotificationCount = JSON.parse(savedUnreadCount);
    }
}

function updateFavoritesDot() {
    const favoriteCount = posts.filter(post => post.isFavorite).length;
    if (favoritesDot) {
        favoritesDot.style.display = (favoriteCount > 0 && !isFavoritesViewed) ? 'block' : 'none';
    }
}

function updateNotificationCount() {
    if (notificationCount) {
        notificationCount.textContent = unreadNotificationCount;
        notificationCount.style.display = unreadNotificationCount > 0 ? 'block' : 'none';
    }
}

function renderNotifications() {
    if (!notificationList) return;
    notificationList.innerHTML = '';

    if (notifications.length === 0) {
        const messageItem = document.createElement('li');
        messageItem.innerHTML = `<p>No downloads yet.</p>`;
        notificationList.appendChild(messageItem);
    } else {
        notifications.forEach(note => {
            const notificationItem = document.createElement('li');
            notificationItem.classList.add('notification-item');
            notificationItem.innerHTML = `
                <img src="${note.image}" alt="Downloaded Image">
                <div class="notification-item-text">
                    <p>${note.message}</p>
                    <p class="timestamp">${note.time}</p>
                </div>
            `;
            notificationList.appendChild(notificationItem);
        });
    }
}

function renderFavorites() {
    if (!favoritesGallery) return;
    favoritesGallery.innerHTML = '';

    const favoritePosts = posts.filter(post => post.isFavorite);

    if (favoritePosts.length === 0) {
        const messageItem = document.createElement('p');
        messageItem.classList.add('empty-message');
        messageItem.innerHTML = `No favorites saved yet.`;
        favoritesGallery.appendChild(messageItem);
    } else {
        renderPosts(favoritesGallery, favoritePosts, true);
    }
}

function renderPosts(targetElement, postsToRender, showRemoveBtn) {
    if (!targetElement) return;
    targetElement.innerHTML = '';
    postsToRender.forEach(post => {
        const card = document.createElement('div');
        card.classList.add('photo-card');
        card.innerHTML = `
            <img src="${post.image}" alt="Bhakti Post" class="photo-img">
            <div class="overlay-buttons">
                ${showRemoveBtn ? `<button class="remove-btn" data-id="${post.id}">Remove</button>` : `<button class="save-btn" data-id="${post.id}">Save</button>`}
                <button class="share-btn" data-image="${post.image}">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"></path><polyline points="16 6 12 2 8 6"></polyline><line x1="12" y1="2" x2="12" y2="15"></line></svg>
                </button>
                <button class="download-btn" data-image="${post.image}" data-id="${post.id}">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                </button>
            </div>
        `;
        targetElement.appendChild(card);
    });
}

function showSection(sectionId) {
    sections.forEach(section => {
        if (section.id === sectionId) {
            section.style.display = 'block';
        } else {
            section.style.display = 'none';
        }
    });
}

// Function to show the photo view
function showPhotoView(imageSrc) {
    mainContent.style.display = 'none'; // Hide main content
    photoViewSection.style.display = 'flex'; // Show photo view section
    photoViewImage.src = imageSrc;
}

// Function to hide the photo view and go back to home
function hidePhotoView() {
    photoViewSection.style.display = 'none';
    mainContent.style.display = 'block';
}

async function downloadImage(imageSrc) {
    const fileName = imageSrc.split('/').pop();
    try {
        const response = await fetch(imageSrc);
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        a.remove();

        unreadNotificationCount++;
        notifications.push({
            image: imageSrc,
            message: `You downloaded the photo "${fileName}".`,
            time: new Date().toLocaleTimeString()
        });
        updateNotificationCount();
        saveData();
        alert('Image downloaded successfully!');

    } catch (error) {
        console.error('Download failed:', error);
        alert('Image download failed!');
    }
}

// Event Listeners for Navigation
if (homeIcon) {
    homeIcon.addEventListener('click', (e) => {
        e.preventDefault();
        showSection('all-posts-section');
        renderPosts(photoGallery, posts, false);
    });
}

if (favoritesIcon) {
    favoritesIcon.addEventListener('click', (e) => {
        e.preventDefault();
        showSection('favorites-section');
        renderFavorites();
        isFavoritesViewed = true;
        updateFavoritesDot();
        saveData();
    });
}

if (notificationIcon) {
    notificationIcon.addEventListener('click', (e) => {
        e.preventDefault();
        showSection('notifications-section');
        renderNotifications();
        unreadNotificationCount = 0;
        updateNotificationCount();
        saveData();
    });
}

// Event Listeners for More Options Modal
if (moreOptionsIcon) {
    moreOptionsIcon.addEventListener('click', () => {
        if (moreOptionsModal) {
            moreOptionsModal.style.display = 'flex';
            setTimeout(() => moreOptionsModal.classList.add('active'), 10);
        }
    });
}

if (moreOptionsCloseBtn) {
    moreOptionsCloseBtn.addEventListener('click', () => {
        if (moreOptionsModal) {
            moreOptionsModal.classList.remove('active');
            setTimeout(() => moreOptionsModal.style.display = 'none', 300);
        }
    });
}

// Event Listeners for About, Privacy, Contact Links
if (aboutUsLink) {
    aboutUsLink.addEventListener('click', (e) => {
        e.preventDefault();
        showSection('about-us-section');
        if (moreOptionsModal) moreOptionsModal.style.display = 'none';
    });
}

if (privacyPolicyLink) {
    privacyPolicyLink.addEventListener('click', (e) => {
        e.preventDefault();
        showSection('privacy-policy-section');
        if (moreOptionsModal) moreOptionsModal.style.display = 'none';
    });
}

if (contactUsLink) {
    contactUsLink.addEventListener('click', (e) => {
        e.preventDefault();
        showSection('contact-us-section');
        if (moreOptionsModal) moreOptionsModal.style.display = 'none';
    });
}

// Event listener for Save/Remove button
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('save-btn')) {
        const postId = parseInt(e.target.dataset.id);
        const post = posts.find(p => p.id === postId);
        if (post) {
            post.isFavorite = true;
            isFavoritesViewed = false;
            updateFavoritesDot();
            saveData();
            alert('Post saved to favorites!');
        }
    }
    if (e.target.classList.contains('remove-btn')) {
        const postId = parseInt(e.target.dataset.id);
        const post = posts.find(p => p.id === postId);
        if (post) {
            post.isFavorite = false;
            renderFavorites();
            saveData();
            alert('Post removed from favorites!');
        }
    }
    if (e.target.classList.contains('download-btn')) {
        const imageSrc = e.target.dataset.image;
        if (imageSrc) {
            downloadImage(imageSrc);
        }
    }
    // Event listener for clicking on the image to view it
    if (e.target.classList.contains('photo-img')) {
        const imageSrc = e.target.src;
        showPhotoView(imageSrc);
    }
});

// Event listener for the back button in photo view
if (backButton) {
    backButton.addEventListener('click', hidePhotoView);
}

// Initial load
document.addEventListener('DOMContentLoaded', () => {
    loadData();
    showSection('all-posts-section');
    renderPosts(photoGallery, posts, false);
    updateFavoritesDot();
    updateNotificationCount();
});
