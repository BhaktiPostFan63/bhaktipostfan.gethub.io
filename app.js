// ...previous code...

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
            <div class="photo-url" style="font-size:12px;word-break:break-all;padding:4px 0 8px 0;color:#444;background:#fafafa;">${post.image}</div>
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

// ...rest of your code...
