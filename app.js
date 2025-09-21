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
            <img 
                src="${post.image}" 
                alt="Bhakti Post" 
                class="photo-img"
                onerror="this.onerror=null;this.src='https://i.imgur.com/q8MDSbP.png';this.nextElementSibling.style.display='block';"
            >
            <span class="img-error-msg" style="display:none;color:red;font-size:12px;">Image failed to load or is not a valid image URL.</span>
            <div class="overlay-buttons">
                ${showRemoveBtn ? `<button class="remove-btn" data-id="${post.id}">Remove</button>` : `<button class="save-btn" data-id="${post.id}">Save</button>`}
                <button class="share-btn" data-image="${post.image}" data-id="${post.id}">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" ...></svg>
                </button>
                <button class="download-btn" data-image="${post.image}" data-id="${post.id}">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" ...></svg>
                </button>
            </div>
            ${isAdmin ? `<button class="delete-btn stylish-delete" data-id="${post.id}" title="Delete Photo" ...>Delete Photo</button>` : ''}
        `;
        targetElement.appendChild(card);
    });
}
