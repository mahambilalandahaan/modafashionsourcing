// ============================================
// GALLERY DATA MANAGER
// ============================================

const GALLERY_SLOTS = ['gm1', 'gm2', 'gm3', 'gm4', 'gm5', 'gm6'];

// ---- STORAGE METHODS ----

function getGalleryImages() {
    try {
        const data = localStorage.getItem('modaGallery');
        return data ? JSON.parse(data) : {};
    } catch(e) {
        return {};
    }
}

function saveGalleryImages(images) {
    localStorage.setItem('modaGallery', JSON.stringify(images));
}

function getImageForSlot(slot) {
    const images = getGalleryImages();
    return images[slot] || null;
}

// ---- PUBLIC API ----

const GalleryData = {
    getImages: getGalleryImages,
    saveImages: saveGalleryImages,
    getImage: getImageForSlot,
    getSlots: () => [...GALLERY_SLOTS],
    
    uploadImage: function(slot, file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = function(e) {
                const images = getGalleryImages();
                images[slot] = e.target.result;
                saveGalleryImages(images);
                resolve(images[slot]);
            };
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    },
    
    deleteImage: function(slot) {
        const images = getGalleryImages();
        delete images[slot];
        saveGalleryImages(images);
        return true;
    },
    
    // For Firebase Option (uncomment and configure)
    // uploadToFirebase: async function(slot, file) {
    //     // Firebase upload logic here
    // },
    // deleteFromFirebase: async function(slot) {
    //     // Firebase delete logic here
    // }
};