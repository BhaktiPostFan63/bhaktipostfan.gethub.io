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
let lastScrollY = 0;

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

// Admin-only delete button for each photo
function renderPosts(targetElement, postsToRender, showRemoveBtn) {
    if (!targetElement) return;
    targetElement.innerHTML = '';
    var isAdmin = localStorage.getItem('isAdmin') === 'true';
    postsToRender.forEach(post => {
        const card = document.createElement('div');
        card.classList.add('photo-card');
        card.style.position = 'relative';
        card.innerHTML = `
            <img src="${post.image}" alt="Bhakti Post" class="photo-img">
            <div class="overlay-buttons">
                ${showRemoveBtn ? `<button class="remove-btn" data-id="${post.id}">Remove</button>` : `<button class="save-btn" data-id="${post.id}">Save</button>`}
                <button class="share-btn" data-image="${post.image}" data-id="${post.id}">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"></path><polyline points="16 6 12 2 8 6"></polyline><line x1="12" y1="2" x2="12" y2="15"></line></svg>
                </button>
                <button class="download-btn" data-image="${post.image}" data-id="${post.id}">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                </button>
            </div>
            ${isAdmin ? `<button class="delete-btn stylish-delete" data-id="${post.id}" title="Delete Photo" style="position:absolute;top:10px;left:10px;background:#e60023;color:#fff;border:none;border-radius:50%;width:32px;height:32px;display:flex;align-items:center;justify-content:center;box-shadow:0 2px 8px rgba(0,0,0,0.15);z-index:2;cursor:pointer;"><span style='display:flex;align-items:center;justify-content:center;width:100%;height:100%;'><svg xmlns='http://www.w3.org/2000/svg' width='18' height='18' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><polyline points='3 6 5 6 21 6'></polyline><path d='M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m5 0V4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2'></path><line x1='10' y1='11' x2='10' y2='17'></line><line x1='14' y1='11' x2='14' y2='17'></line></svg></span></button>` : ''}
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
    // Show/hide admin upload section only on Home
    var isAdmin = localStorage.getItem('isAdmin') === 'true';
    if (isAdmin) {
        showAdminUploadSection();
    }
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

// Function to render search suggestions
function renderSuggestions() {
    var suggestionsGrid = document.getElementById('suggestions-grid-container');
    if (!suggestionsGrid) return;
    suggestionsGrid.innerHTML = '';
    // Collect unique tags from posts
    var tagSet = new Set();
    posts.forEach(function(post) {
        if (post.title) {
            tagSet.add(post.title);
        } else if (post.tags) {
            post.tags.split(',').forEach(function(tag) {
                tagSet.add(tag.trim());
            });
        }
    });
    Array.from(tagSet).forEach(function(tag) {
        var item = document.createElement('div');
        item.classList.add('suggestion-item');
        item.textContent = tag;
        item.addEventListener('click', function() {
            var searchBar = document.querySelector('.search-bar');
            if (searchBar) {
                searchBar.value = tag;
                searchBar.focus();
            }
            // Filter and show only matching photos
            var filteredPosts = posts.filter(function(post) {
                if (post.title) {
                    return post.title === tag;
                } else if (post.tags) {
                    return post.tags.split(',').map(function(t) { return t.trim(); }).includes(tag);
                }
                return false;
            });
            renderPosts(photoGallery, filteredPosts, false);
        });
        suggestionsGrid.appendChild(item);
    });
}

var searchBar = document.querySelector('.search-bar');
var searchSuggestions = document.getElementById('search-suggestions-box');
if (searchBar && searchSuggestions) {
    searchBar.addEventListener('focus', function() {
        searchSuggestions.classList.add('active');
    });
    searchBar.addEventListener('blur', function() {
        setTimeout(function() {
            searchSuggestions.classList.remove('active');
        }, 200);
    });
    searchBar.addEventListener('input', function(e) {
        var value = e.target.value.trim().toLowerCase();
        var suggestionsGrid = document.getElementById('suggestions-grid-container');
        suggestionsGrid.innerHTML = '';
        if (value.length === 0) {
            renderSuggestions(); // Show all suggestions if nothing typed
            return;
        }
        // Collect matching tags/titles
        var matches = new Set();
        posts.forEach(function(post) {
            if (post.title && post.title.toLowerCase().includes(value)) {
                matches.add(post.title);
            }
            if (post.tags) {
                post.tags.split(',').forEach(function(tag) {
                    if (tag.trim().toLowerCase().includes(value)) {
                        matches.add(tag.trim());
                    }
                });
            }
        });
        Array.from(matches).forEach(function(tag) {
            var item = document.createElement('div');
            item.classList.add('suggestion-item');
            item.textContent = tag;
            item.addEventListener('click', function() {
                searchBar.value = tag;
                searchBar.focus();
                var filteredPosts = posts.filter(function(post) {
                    if (post.title) {
                        return post.title === tag;
                    } else if (post.tags) {
                        return post.tags.split(',').map(function(t) { return t.trim(); }).includes(tag);
                    }
                    return false;
                });
                renderPosts(photoGallery, filteredPosts, false);
            });
            suggestionsGrid.appendChild(item);
        });
    });
}

// Event Listeners for Navigation
if (homeIcon) {
    homeIcon.addEventListener('click', (e) => {
        e.preventDefault();
        showSection('all-posts-section');
        renderPosts(photoGallery, posts, false);
        // Ensure search bar section is visible when navigating home
        var searchSection = document.getElementById('search-section');
        if (searchSection) {
            searchSection.style.display = 'flex';
        }
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

// Add photo by URL functionality
function addPhotoByUrl(url) {
    if (!url) return;
    // You can prompt for a title/tags if needed
    var title = prompt('Enter a title for this photo:');
    var tags = prompt('Enter tags for this photo (comma separated):');
    var newId = posts.length ? Math.max.apply(null, posts.map(p => p.id)) + 1 : 1;
    posts.push({ id: newId, image: url, title: title || '', tags: tags || '', isFavorite: false });
    saveData();
    renderPosts(photoGallery, posts, false);
    renderSuggestions();
}

// Create admin-only upload section
function showAdminUploadSection() {
    var isAdmin = localStorage.getItem('isAdmin') === 'true';
    var adminSection = document.getElementById('admin-upload-section');
    if (!adminSection) {
        adminSection = document.createElement('div');
        adminSection.id = 'admin-upload-section';
        adminSection.style.display = 'none';
        adminSection.style.margin = '20px 0';
        adminSection.innerHTML = '<h3>Admin Photo Upload</h3>';
        var urlInput = document.createElement('input');
        urlInput.type = 'text';
        urlInput.placeholder = 'Paste image URL here';
        urlInput.className = 'url-input';
        urlInput.style.marginRight = '10px';
        var addBtn = document.createElement('button');
        addBtn.textContent = 'Add Photo';
        addBtn.className = 'add-photo-btn';
        addBtn.onclick = function() {
            addPhotoByUrl(urlInput.value.trim());
            urlInput.value = '';
        };
        adminSection.appendChild(urlInput);
        adminSection.appendChild(addBtn);
        var mainContent = document.querySelector('.main-content');
        if (mainContent) {
            mainContent.insertBefore(adminSection, mainContent.firstChild);
        }
    }
    // Only show on Home (all-posts-section) and only for admin
    var allPostsSection = document.getElementById('all-posts-section');
    if (isAdmin && allPostsSection && allPostsSection.style.display !== 'none') {
        adminSection.style.display = 'block';
    } else {
        adminSection.style.display = 'none';
    }
}

function checkAdmin() {
    var isAdmin = localStorage.getItem('isAdmin');
    if (isAdmin === 'true') {
        showAdminUploadSection();
    }
}

// Call checkAdmin on load
document.addEventListener('DOMContentLoaded', () => {
    loadData();
    showSection('all-posts-section');
    renderPosts(photoGallery, posts, false);
    updateFavoritesDot();
    updateNotificationCount();
    var searchSection = document.getElementById('search-section');
    if (searchSection) {
        searchSection.style.display = 'flex';
    }
    renderSuggestions();
    checkAdmin(); // Only show admin upload section if admin flag is set
});

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
    // Download button
    if (e.target.classList.contains('download-btn')) {
        // Support clicking SVG/icon inside button
        var btn = e.target.closest('.download-btn');
        const imageSrc = btn ? btn.dataset.image : null;
        if (imageSrc) {
            downloadImage(imageSrc);
        }
    }
    // Delete button
    if (e.target.classList.contains('delete-btn')) {
        var isAdmin = localStorage.getItem('isAdmin') === 'true';
        var btn = e.target.closest('.delete-btn');
        const postId = btn ? parseInt(btn.dataset.id) : null;
        if (isAdmin && postId) {
            if (confirm('Are you sure you want to delete this photo?')) {
                posts = posts.filter(p => p.id !== postId);
                saveData();
                renderPosts(photoGallery, posts, false);
                renderFavorites();
                renderSuggestions();
                alert('Photo deleted!');
            }
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
    var searchSection = document.getElementById('search-section');
    if (searchSection) {
        searchSection.style.display = 'flex';
    }
    renderSuggestions();
    checkAdmin(); // Only show admin upload section if admin flag is set
});

// Handle share button click
if (!window._shareHandlerAdded) {
    document.addEventListener('click', function(e) {
        var btn = e.target.closest('.share-btn');
        if (btn) {
            var imageId = btn.dataset.id || btn.getAttribute('data-id');
            if (imageId) {
                var shareUrl = window.location.origin + window.location.pathname + '?photoId=' + imageId;
                if (navigator.share) {
                    navigator.share({
                        title: 'Check out this Bhakti Post!',
                        url: shareUrl
                    }).catch(function(error) { console.error('Error sharing:', error); });
                } else {
                    // Fallback: copy to clipboard
                    navigator.clipboard.writeText(shareUrl).then(function() {
                        alert('Share link copied to clipboard!');
                    });
                }
            }
        }
    });
    window._shareHandlerAdded = true;
}

// On load, check for photoId in URL and show only that photo
function showSharedPhotoIfNeeded() {
    var params = new URLSearchParams(window.location.search);
    var photoId = params.get('photoId');
    if (photoId) {
        var photo = posts.find(function(p) { return String(p.id) === String(photoId); });
        if (photo) {
            showSection('all-posts-section');
            renderPosts(photoGallery, [photo], false);
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    loadData();
    showSection('all-posts-section');
    renderPosts(photoGallery, posts, false);
    updateFavoritesDot();
    updateNotificationCount();
    var searchSection = document.getElementById('search-section');
    if (searchSection) {
        searchSection.style.display = 'flex';
    }
    renderSuggestions();
    checkAdmin();
    showSharedPhotoIfNeeded(); // Show shared photo if link contains photoId
});

// Add modal HTML to index.html via JS if not present
function ensurePhotoModal() {
    if (!document.getElementById('photo-modal')) {
        var modal = document.createElement('div');
        modal.id = 'photo-modal';
        modal.style = 'position:fixed;top:0;left:0;width:100vw;height:100vh;background:rgba(0,0,0,0.85);display:none;align-items:center;justify-content:center;z-index:9999;flex-direction:column;';
        modal.innerHTML = `
            <button id='photo-modal-back' style='position:absolute;top:24px;left:24px;background:none;border:none;color:#fff;font-size:2rem;z-index:10001;cursor:pointer;'>
                <svg width='32' height='32' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><polyline points='15 18 9 12 15 6'></polyline></svg>
            </button>
            <img id='photo-modal-img' src='' alt='Photo' style='max-width:90vw;max-height:80vh;border-radius:12px;box-shadow:0 4px 24px rgba(0,0,0,0.3);'>
        `;
        document.body.appendChild(modal);
        document.getElementById('photo-modal-back').onclick = function() {
            modal.style.display = 'none';
            if (mainContent) mainContent.style.display = 'block'; // Ensure main content is visible
            showSection('all-posts-section'); // Go to home page (gallery)
        };
    }
}

if (!window._photoModalHandlerAdded) {
    document.addEventListener('click', function(e) {
        var img = e.target.closest('.photo-img');
        if (img) {
            lastScrollY = window.scrollY;
            ensurePhotoModal();
            var modal = document.getElementById('photo-modal');
            var modalImg = document.getElementById('photo-modal-img');
            modalImg.src = img.src;
            modal.style.display = 'flex';
        }
    });
    window._photoModalHandlerAdded = true;
}
