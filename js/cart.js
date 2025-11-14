// ============================================
// SHOPPING CART FUNCTIONALITY
// Complete rebuild to match reference site
// ============================================

let cart = [];
let isCartOpen = false;

// ============================================
// CART DATA MANAGEMENT
// ============================================

// Load cart from localStorage
function loadCart() {
    try {
        const savedCart = localStorage.getItem('cart');
        if (savedCart) {
            const parsedCart = JSON.parse(savedCart);
            // Validate that it's an array
            if (Array.isArray(parsedCart)) {
                cart = parsedCart;
            } else {
                console.warn('Cart data is not an array, resetting cart');
                cart = [];
                localStorage.removeItem('cart');
            }
            updateCartCount();
            // Only render if sidebar is open or exists
            const cartSidebar = document.getElementById('cart-sidebar');
            if (cartSidebar) {
                renderCart();
            }
        } else {
            // No saved cart, ensure cart is empty
            cart = [];
            updateCartCount();
        }
    } catch (error) {
        console.error('Error loading cart:', error);
        cart = [];
        updateCartCount();
        // Clear corrupted data
        try {
            localStorage.removeItem('cart');
        } catch (e) {
            console.error('Error clearing corrupted cart:', e);
        }
    }
}

// Save cart to localStorage
function saveCart() {
    try {
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartCount();
        renderCart();
    } catch (error) {
        console.error('Error saving cart:', error);
    }
}

// Update cart count in header
function updateCartCount() {
    const cartCountElements = document.querySelectorAll('.cart-count');
    
    // Ensure cart is valid array
    if (!Array.isArray(cart)) {
        cart = [];
    }
    
    const totalItems = cart.reduce((sum, item) => {
        if (item && typeof item.quantity === 'number' && item.quantity > 0) {
            return sum + item.quantity;
        }
        return sum;
    }, 0);
    
    cartCountElements.forEach(el => {
        if (el) {
            el.textContent = `(${totalItems})`;
        }
    });
}

// ============================================
// CART ITEM OPERATIONS
// ============================================

// Add item to cart
function addToCart(productId, size = 'S', quantity = 1) {
    if (typeof products === 'undefined') {
        console.error('Products array not found');
        return;
    }

    const product = products.find(p => p.id === productId);
    if (!product) {
        console.error('Product not found:', productId);
        return;
    }

    const cartItem = {
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        size: size,
        quantity: parseInt(quantity) || 1
    };

    // Check if item with same ID and size already exists
    const existingItemIndex = cart.findIndex(
        item => item.id === productId && item.size === size
    );
    
    if (existingItemIndex > -1) {
        // Update quantity if item exists
        cart[existingItemIndex].quantity += cartItem.quantity;
    } else {
        // Add new item
        cart.push(cartItem);
    }

    saveCart();
    showCartNotification('Item added to cart!');
    
    // Open cart sidebar when item is added
    setTimeout(() => {
        openCart();
    }, 300);
}

// Remove item from cart
function removeFromCart(index) {
    if (index >= 0 && index < cart.length) {
        cart.splice(index, 1);
        saveCart();
    }
}

// Update item quantity in cart
function updateCartQuantity(index, quantity) {
    if (index < 0 || index >= cart.length) return;
    
    const newQuantity = parseInt(quantity);
    if (newQuantity <= 0) {
        removeFromCart(index);
    } else {
        cart[index].quantity = newQuantity;
        saveCart();
    }
}

// Get cart total (in USD base price)
function getCartTotal() {
    return cart.reduce((total, item) => {
        const price = parseFloat(item.price.replace('$', '').replace(',', ''));
        return total + (price * item.quantity);
    }, 0);
}

// Get cart total in current currency
function getCartTotalConverted() {
    const totalUSD = getCartTotal();
    if (typeof convertPrice === 'function') {
        return convertPrice(`$${totalUSD.toFixed(2)}`);
    }
    // Fallback if currency functions not available
    return `$${totalUSD.toFixed(2)}`;
}

// Convert price string using currency conversion
function convertCartPrice(priceString) {
    if (typeof convertPrice === 'function') {
        return convertPrice(priceString);
    }
    // Fallback if currency functions not available
    return priceString;
}

// ============================================
// CART UI - SIDEBAR
// ============================================

// Render cart sidebar
function renderCart() {
    const cartSidebar = document.getElementById('cart-sidebar');
    const cartItemsContainer = document.getElementById('cart-sidebar-items');
    const cartTitle = document.getElementById('cart-sidebar-title');
    const cartTotal = document.getElementById('cart-sidebar-total');
    
    if (!cartSidebar || !cartItemsContainer) {
        console.warn('Cart sidebar elements not found');
        return;
    }
    
    // Ensure cart is an array
    if (!Array.isArray(cart)) {
        console.warn('Cart is not an array, resetting');
        cart = [];
        saveCart();
    }
    
    const totalItems = cart.reduce((sum, item) => {
        if (item && typeof item.quantity === 'number') {
            return sum + item.quantity;
        }
        return sum;
    }, 0);
    
    // Update title
    if (cartTitle) {
        cartTitle.textContent = `${totalItems} ${totalItems === 1 ? 'ITEM' : 'ITEMS'} IN CART`;
    }
    
    // Render items
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<div class="cart-sidebar-empty">Your cart is empty</div>';
    } else {
        // Filter out invalid items and map to HTML
        const validItems = cart.filter((item, index) => {
            if (!item || !item.name || !item.price || !item.image || typeof item.quantity !== 'number') {
                console.warn('Invalid cart item at index', index, item);
                return false;
            }
            return true;
        });
        
        // Update cart array to only include valid items
        if (validItems.length !== cart.length) {
            cart = validItems;
            saveCart();
        }
        
        cartItemsContainer.innerHTML = cart.map((item, index) => {
            // Calculate item total in USD first
            const priceValue = parseFloat(item.price.replace('$', '').replace(',', '')) || 0;
            const itemTotalUSD = priceValue * (item.quantity || 1);
            
            // Convert to current currency
            const itemTotalFormatted = convertCartPrice(`$${itemTotalUSD.toFixed(2)}`);
            
            const size = item.size || 'S';
            return `
                <div class="cart-sidebar-item" data-index="${index}">
                    <img src="${item.image}" alt="${item.name || 'Product'}" class="cart-sidebar-item-image" loading="lazy">
                    <div class="cart-sidebar-item-details">
                        <h3 class="cart-sidebar-item-name">${item.name || 'Unknown Product'}</h3>
                        <div class="cart-sidebar-item-size">Size: ${size.toUpperCase()}</div>
                        <div class="cart-sidebar-item-price">${itemTotalFormatted}</div>
                        <div class="cart-sidebar-item-controls">
                            <div class="cart-sidebar-item-quantity">
                                <button class="cart-sidebar-quantity-btn" data-action="decrease" data-index="${index}" type="button">-</button>
                                <span class="cart-sidebar-quantity-value">${item.quantity || 1}</span>
                                <button class="cart-sidebar-quantity-btn" data-action="increase" data-index="${index}" type="button">+</button>
                            </div>
                            <button class="cart-sidebar-item-remove" data-index="${index}" aria-label="Remove item" type="button">×</button>
                        </div>
                    </div>
                </div>
            `;
        }).join('');
        
        // Attach event listeners to quantity buttons
        attachCartItemListeners();
    }
    
    // Update total (converted to current currency)
    if (cartTotal) {
        const totalFormatted = getCartTotalConverted();
        cartTotal.textContent = totalFormatted;
    }
}

// Attach event listeners to cart items
function attachCartItemListeners() {
    const cartItemsContainer = document.getElementById('cart-sidebar-items');
    if (!cartItemsContainer) return;
    
    // Quantity buttons
    cartItemsContainer.querySelectorAll('.cart-sidebar-quantity-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            const index = parseInt(btn.dataset.index);
            const action = btn.dataset.action;
            const currentItem = cart[index];
            
            if (currentItem) {
                if (action === 'increase') {
                    updateCartQuantity(index, currentItem.quantity + 1);
                } else if (action === 'decrease') {
                    updateCartQuantity(index, currentItem.quantity - 1);
                }
            }
        });
    });
    
    // Remove buttons
    cartItemsContainer.querySelectorAll('.cart-sidebar-item-remove').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            const index = parseInt(btn.dataset.index);
            removeFromCart(index);
        });
    });
}

// ============================================
// CART SIDEBAR OPEN/CLOSE
// ============================================

// Open cart sidebar
function openCart() {
    const cartSidebar = document.getElementById('cart-sidebar');
    if (!cartSidebar) {
        console.error('Cart sidebar element not found');
        return;
    }
    
    if (isCartOpen) return;
    
    // Ensure cart is loaded from localStorage before rendering
    loadCart();
    
    isCartOpen = true;
    renderCart();
    cartSidebar.style.display = 'block';
    
    // Force reflow
    cartSidebar.offsetHeight;
    
    cartSidebar.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    // Prevent body scroll on mobile
    document.body.style.position = 'fixed';
    document.body.style.width = '100%';
}

// Close cart sidebar
function closeCart() {
    const cartSidebar = document.getElementById('cart-sidebar');
    if (!cartSidebar) return;
    
    if (!isCartOpen) return;
    
    isCartOpen = false;
    cartSidebar.classList.remove('active');
    
    // Wait for animation to complete
    setTimeout(() => {
        if (!cartSidebar.classList.contains('active')) {
            cartSidebar.style.display = 'none';
        }
        document.body.style.overflow = '';
        document.body.style.position = '';
        document.body.style.width = '';
    }, 300);
}

// Toggle cart sidebar
function toggleCart() {
    if (isCartOpen) {
        closeCart();
    } else {
        openCart();
    }
}

// ============================================
// NOTIFICATIONS
// ============================================

// Show cart notification
function showCartNotification(message) {
    // Remove existing notification if any
    const existing = document.querySelector('.cart-notification');
    if (existing) {
        existing.remove();
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'cart-notification';
    notification.textContent = message;
    document.body.appendChild(notification);
    
    // Show notification
    requestAnimationFrame(() => {
        notification.classList.add('show');
    });
    
    // Hide and remove notification
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 2000);
}

// ============================================
// INITIALIZATION
// ============================================

// Initialize cart sidebar functionality
function initCartSidebar() {
    // Cart link click handler
    const handleCartLinkClick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        toggleCart();
    };
    
    // Use event delegation for cart links
    document.addEventListener('click', (e) => {
        const cartLink = e.target.closest('.cart-link');
        if (cartLink) {
            handleCartLinkClick(e);
        }
    });
    
    // Close button
    const closeBtn = document.getElementById('cart-sidebar-close');
    if (closeBtn) {
        closeBtn.addEventListener('click', (e) => {
            e.preventDefault();
            closeCart();
        });
    }
    
    // Overlay click to close
    const overlay = document.getElementById('cart-sidebar-overlay');
    if (overlay) {
        overlay.addEventListener('click', (e) => {
            e.preventDefault();
            closeCart();
        });
    }
    
    // Clear cart button
    const clearBtn = document.getElementById('cart-clear-btn');
    if (clearBtn) {
        clearBtn.addEventListener('click', (e) => {
            e.preventDefault();
            if (confirm('Are you sure you want to clear your cart?')) {
                cart = [];
                saveCart();
                renderCart();
            }
        });
    }
    
    // Checkout button
    const checkoutBtn = document.getElementById('cart-checkout-btn');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            if (cart.length === 0) {
                alert('Your cart is empty');
                return;
            }
            // For now, just show an alert. Replace with actual checkout logic
            alert('Checkout functionality will be implemented here');
        });
    }
    
    // Close on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && isCartOpen) {
            closeCart();
        }
    });
}

// Initialize cart on page load
function initCart() {
    // Check if cart sidebar exists
    const cartSidebar = document.getElementById('cart-sidebar');
    if (!cartSidebar) {
        console.error('Cart sidebar HTML not found. Make sure cart-sidebar element exists in HTML.');
        return;
    }
    
    // Load cart data
    loadCart();
    
    // Initialize sidebar functionality
    initCartSidebar();
}

// Wait for DOM to be ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCart);
} else {
    // DOM already loaded
    initCart();
}

// Make functions globally available
window.addToCart = addToCart;
window.removeFromCart = removeFromCart;
window.updateCartQuantity = updateCartQuantity;
window.openCart = openCart;
window.closeCart = closeCart;
window.toggleCart = toggleCart;
