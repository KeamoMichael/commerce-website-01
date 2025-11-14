// Image Gallery with Dots Navigation
function initImageGallery() {
    const images = document.querySelectorAll('.gallery-image');
    const dots = document.querySelectorAll('.gallery-dot');
    let currentIndex = 0;
    
    if (images.length === 0 || dots.length === 0) return;
    
    function showImage(index) {
        // Remove active class from all images and dots
        images.forEach(img => img.classList.remove('active'));
        dots.forEach(dot => dot.classList.remove('active'));
        
        // Add active class to current image and dot
        if (images[index]) {
            images[index].classList.add('active');
        }
        if (dots[index]) {
            dots[index].classList.add('active');
        }
        
        currentIndex = index;
    }
    
    // Add click handlers to dots
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            showImage(index);
        });
    });
    
    // Initialize with first image
    showImage(0);
}

// Size Selection
function initSizeSelection() {
    const sizeBtns = document.querySelectorAll('.size-btn');
    
    sizeBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            sizeBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
        });
    });
}

// Quantity Selector
function initQuantitySelector() {
    const decreaseBtn = document.getElementById('quantity-decrease');
    const increaseBtn = document.getElementById('quantity-increase');
    const quantityInput = document.getElementById('quantity-input');
    
    if (!decreaseBtn || !increaseBtn || !quantityInput) return;
    
    decreaseBtn.addEventListener('click', () => {
        const currentValue = parseInt(quantityInput.value) || 1;
        if (currentValue > 1) {
            quantityInput.value = currentValue - 1;
        }
    });
    
    increaseBtn.addEventListener('click', () => {
        const currentValue = parseInt(quantityInput.value) || 1;
        const maxValue = parseInt(quantityInput.getAttribute('max')) || 10;
        if (currentValue < maxValue) {
            quantityInput.value = currentValue + 1;
        }
    });
}

// Load More Items
function loadMoreItems() {
    const moreItemsGrid = document.getElementById('more-items-grid');
    if (!moreItemsGrid) return;
    
    // Get product ID from URL
    const urlParams = new URLSearchParams(window.location.search);
    const currentProductId = parseInt(urlParams.get('id')) || 1;
    
    // Get products from main.js (assuming it's available)
    if (typeof products !== 'undefined') {
        // Filter out the current product
        const otherProducts = products.filter(p => p.id !== currentProductId).slice(0, 6);
        
        moreItemsGrid.innerHTML = otherProducts.map(product => `
            <div class="product-card" data-product="${product.id}">
                <a href="product.html?id=${product.id}" class="product-card-link">
                    <div class="product-image-wrapper">
                        ${product.isNew ? '<div class="new-badge">New</div>' : ''}
                        <img src="${product.image}" alt="${product.name}" class="product-image product-image-main">
                        <img src="${product.imageHover}" alt="${product.name}" class="product-image product-image-hover">
                    </div>
                    <div class="product-info">
                        <h3 class="product-name">${product.name}</h3>
                        <p class="product-price">${product.price}</p>
                    </div>
                </a>
            </div>
        `).join('');
    }
}

// Get product images from Item window folder
function getProductDetailImages(productName) {
    const name = productName.toLowerCase().trim();
    const basePath = 'reference/Item window/';
    
    // Tops - 2 images
    if (name.includes('black tee')) {
        return {
            isTop: true,
            images: [
                `${basePath}Black Tee/Black Tee_Flat02.jpg`,
                `${basePath}Black Tee/Black Tee_Model.jpg`
            ]
        };
    }
    if (name.includes('cream hoodie')) {
        return {
            isTop: true,
            images: [
                `${basePath}Cream Hoodie/Cream Hoodie_Flat.jpg`,
                `${basePath}Cream Hoodie/Cream Hoodie_Model.jpg`
            ]
        };
    }
    if (name.includes('heather grey hoodie') || name.includes('grey hoodie')) {
        return {
            isTop: true,
            images: [
                `${basePath}Grey Hoodie/Grey Hoodie_Flat.jpg`,
                `${basePath}Grey Hoodie/Grey Hoodie_Model.jpg`
            ]
        };
    }
    if (name.includes('black hoodie')) {
        return {
            isTop: true,
            images: [
                `${basePath}Black Hoodie/Black Hoodie_Flat.jpg`,
                `${basePath}Black Hoodie/Black Hoodie_Model.jpg`
            ]
        };
    }
    if (name.includes('pink tee')) {
        return {
            isTop: true,
            images: [
                `${basePath}Pink Tee/Pink Tee_Flat.jpg`,
                `${basePath}Pink Tee/Pink Tee_Model.jpg`
            ]
        };
    }
    
    // Bottoms - 3 images
    if (name.includes('black sweatpants')) {
        return {
            isTop: false,
            images: [
                `${basePath}Black Sweatpants/Black Sweatpants_Flat.jpg`,
                `${basePath}Black Sweatpants/Black Sweatpants_Model 01.jpg`,
                `${basePath}Black Sweatpants/Black Sweatpants_Model 02.jpg`
            ]
        };
    }
    if (name.includes('navy sweatpants')) {
        return {
            isTop: false,
            images: [
                `${basePath}Navy Sweatpants/Navy Sweatpants_Flat.jpg`,
                `${basePath}Navy Sweatpants/Navy Sweatpants_Model 01.jpg`,
                `${basePath}Navy Sweatpants/Navy Sweatpants_Model 02.jpg`
            ]
        };
    }
    if (name.includes('beige sweatpants')) {
        return {
            isTop: false,
            images: [
                `${basePath}Beige Sweatpants/Beige Sweatpants_Flat.jpg`,
                `${basePath}Beige Sweatpants/Beige Sweatpants_Model 01.jpg`,
                `${basePath}Beige Sweatpants/Beige Sweatpants_Model 02.jpg`
            ]
        };
    }
    if (name.includes('beige shorts')) {
        return {
            isTop: false,
            images: [
                `${basePath}Beige Shorts/Beige Shorts_Flat.jpg`,
                `${basePath}Beige Shorts/Beige Shorts_Model 01.jpg`,
                `${basePath}Beige Shorts/Beige Shorts_Model 02.jpg`
            ]
        };
    }
    
    // Fallback to product images
    return {
        isTop: true,
        images: []
    };
}

// Load Product Data
function loadProductData() {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = parseInt(urlParams.get('id')) || 1;
    
    // Get product from main.js
    if (typeof products !== 'undefined') {
        const product = products.find(p => p.id === productId);
        if (product) {
            // Update page title
            const titleElement = document.querySelector('.product-title');
            const priceElement = document.querySelector('.product-info-content .product-price');
            
            if (titleElement) titleElement.textContent = product.name;
            if (priceElement) {
                priceElement.textContent = product.price;
                priceElement.dataset.originalPrice = product.price;
                // Update with current currency if currency.js is loaded
                if (typeof convertPrice === 'function') {
                    priceElement.textContent = convertPrice(product.price);
                }
            }
            
            // Update gallery images
            const galleryFrame = document.querySelector('.product-gallery-frame');
            
            if (galleryFrame) {
                const productImages = getProductDetailImages(product.name);
                const images = productImages.images;
                
                // If no images found, use fallback
                if (images.length === 0) {
                    images.push(product.image, product.imageHover, product.image);
                }
                
                // Build gallery HTML
                let galleryHTML = images.map((imgSrc, index) => `
                    <div class="gallery-image ${index === 0 ? 'active' : ''}" data-index="${index}">
                        <img src="${imgSrc}" alt="${product.name}">
                    </div>
                `).join('');
                
                // Build dots HTML
                let dotsHTML = images.map((_, index) => `
                    <button class="gallery-dot ${index === 0 ? 'active' : ''}" data-index="${index}" aria-label="Image ${index + 1}"></button>
                `).join('');
                
                galleryHTML += `<div class="gallery-dots" id="gallery-dots">${dotsHTML}</div>`;
                
                galleryFrame.innerHTML = galleryHTML;
                
                // Add class to frame for styling (tops vs bottoms)
                if (productImages.isTop) {
                    galleryFrame.classList.add('gallery-tops');
                    galleryFrame.classList.remove('gallery-bottoms');
                } else {
                    galleryFrame.classList.add('gallery-bottoms');
                    galleryFrame.classList.remove('gallery-tops');
                }
                
                // Re-initialize gallery after images are loaded
                setTimeout(() => {
                    initImageGallery();
                }, 100);
            }
        }
    }
}

// Add to Cart functionality
function initAddToCart() {
    const addToCartBtn = document.querySelector('.add-to-cart-btn');
    if (!addToCartBtn) return;

    addToCartBtn.addEventListener('click', () => {
        const urlParams = new URLSearchParams(window.location.search);
        const productId = parseInt(urlParams.get('id')) || 1;
        const selectedSize = document.querySelector('.size-btn.active')?.dataset.size || 's';
        const quantity = parseInt(document.getElementById('quantity-input')?.value) || 1;

        if (typeof addToCart === 'function') {
            addToCart(productId, selectedSize, quantity);
        } else {
            console.error('Cart functionality not loaded');
        }
    });
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        loadProductData();
        initImageGallery();
        initSizeSelection();
        initQuantitySelector();
        initAddToCart();
        loadMoreItems();
    });
} else {
    loadProductData();
    initImageGallery();
    initSizeSelection();
    initQuantitySelector();
    initAddToCart();
    loadMoreItems();
}

