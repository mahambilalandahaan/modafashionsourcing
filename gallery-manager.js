// ============================================
// GALLERY MANAGER
// ============================================

const ADMIN_PASSWORD = "ayaan123";

// ---- AUTH ----

function isAdmin() {
    return localStorage.getItem('modaAdmin') === 'true';
}

function loginAdmin(password) {
    if (password === ADMIN_PASSWORD) {
        localStorage.setItem('modaAdmin', 'true');
        return true;
    }
    return false;
}

function logoutAdmin() {
    localStorage.removeItem('modaAdmin');
    location.reload();
}

// ---- RENDER GALLERY ON MAIN PAGE ----

function renderGallery() {
    const images = GalleryData.getImages();
    GALLERY_SLOTS.forEach(slot => {
        const img = document.querySelector(`.${slot} .gimg`);
        if (img) {
            if (images[slot]) {
                img.src = images[slot];
            } else {
                // Set a placeholder or keep default
                img.src = ''; // or a default placeholder image
                img.alt = `Gallery ${slot} - Empty`;
            }
        }
    });
}

// ---- ADMIN PANEL RENDERING ----

function renderAdminGallery() {
    const container = document.getElementById('galleryAdminGrid');
    if (!container) return;
    
    const images = GalleryData.getImages();
    container.innerHTML = '';
    
    GALLERY_SLOTS.forEach(slot => {
        const div = document.createElement('div');
        div.className = 'gallery-item-admin';
        
        if (images[slot]) {
            const img = document.createElement('img');
            img.src = images[slot];
            img.alt = `Gallery ${slot}`;
            div.appendChild(img);
            
            const delBtn = document.createElement('button');
            delBtn.className = 'delete-btn';
            delBtn.innerHTML = '×';
            delBtn.title = 'Delete image';
            delBtn.onclick = () => handleDelete(slot);
            div.appendChild(delBtn);
        } else {
            const empty = document.createElement('div');
            empty.className = 'empty-slot';
            empty.textContent = `Slot ${slot.toUpperCase()} - Empty`;
            div.appendChild(empty);
        }
        
        const label = document.createElement('div');
        label.className = 'slot-label';
        label.textContent = slot.toUpperCase();
        div.appendChild(label);
        
        container.appendChild(div);
    });
}

// ---- HANDLERS ----

function handleUpload() {
    const slot = document.getElementById('uploadSlot').value;
    const fileInput = document.getElementById('imageUpload');
    const file = fileInput.files[0];
    
    if (!file) {
        alert('Please select an image file.');
        return;
    }
    
    if (!file.type.startsWith('image/')) {
        alert('Please select a valid image file.');
        return;
    }
    
    if (file.size > 2 * 1024 * 1024) {
        alert('File too large! Please use images under 2MB.');
        return;
    }
    
    GalleryData.uploadImage(slot, file)
        .then(() => {
            fileInput.value = '';
            renderAdminGallery();
            // Notify main page to refresh if it's open
            if (window.opener) {
                window.opener.renderGallery();
            }
            alert('Image uploaded successfully!');
        })
        .catch(err => {
            alert('Error uploading image: ' + err.message);
        });
}

function handleDelete(slot) {
    if (confirm(`Delete image from ${slot.toUpperCase()}?`)) {
        GalleryData.deleteImage(slot);
        renderAdminGallery();
        if (window.opener) {
            window.opener.renderGallery();
        }
    }
}

function handleLogin() {
    const password = document.getElementById('adminPassword').value;
    if (loginAdmin(password)) {
        document.getElementById('adminPassword').value = '';
        document.getElementById('adminLoginSection').style.display = 'none';
        document.getElementById('adminControls').style.display = 'block';
        renderAdminGallery();
        alert('Login successful!');
    } else {
        alert('Incorrect password!');
    }
}

function checkAdminStatus() {
    if (isAdmin()) {
        document.getElementById('adminLoginSection').style.display = 'none';
        document.getElementById('adminControls').style.display = 'block';
        renderAdminGallery();
    }
}

// ---- TOGGLE ADMIN PANEL ----

function toggleAdmin() {
    const panel = document.getElementById('adminPanel');
    panel.classList.toggle('open');
    if (panel.classList.contains('open')) {
        checkAdminStatus();
    }
}

// ---- INIT ----

document.addEventListener('DOMContentLoaded', function() {
    // If we're on the main page, render gallery
    if (document.querySelector('.gallery-mosaic')) {
        renderGallery();
    }
    
    // If we're on admin page, check login status
    if (document.getElementById('adminPanel')) {
        checkAdminStatus();
    }
});

// Make functions globally accessible for inline onclick
window.toggleAdmin = toggleAdmin;
window.handleLogin = handleLogin;
window.handleUpload = handleUpload;
window.handleDelete = handleDelete;
window.logoutAdmin = logoutAdmin;
window.renderGallery = renderGallery;