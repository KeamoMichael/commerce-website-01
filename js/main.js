// Products Data - Exact match from the website
// Set XX_01 = clothing items (static), Set XX_02 = models wearing items (hover)
const products = [
    {
        id: 1,
        name: 'Cream Hoodie',
        price: '$79.00',
        image: 'reference/Images/Set 01/Set 01_02.jpg', // Model wearing it
        imageHover: 'reference/Images/Set 01/Set 01_01.jpg', // Clothing item
        category: 'tops',
        itemType: 'hoodie',
        tags: ['tops', 'new'],
        isNew: true
    },
    {
        id: 2,
        name: 'Beige Sweatpants', // Row 1, 2nd image - renamed only
        price: '$89.00',
        image: 'reference/Images/Set 02/Set 02_01.jpg', // Clothing item
        imageHover: 'reference/Images/Set 02/Set 02_02.jpg', // Model wearing it
        category: 'bottoms',
        itemType: 'sweatpants',
        tags: ['bottoms']
    },
    {
        id: 3,
        name: 'Black Tee',
        price: '$79.00',
        image: 'reference/Images/Set 03/Set 03_01.jpg', // Clothing item
        imageHover: 'reference/Images/Set 03/Set 03_02.jpg', // Model wearing it
        category: 'tops',
        itemType: 'tee',
        tags: ['tops']
    },
    {
        id: 4,
        name: 'Pink Tee', // Row 2, 1st image - renamed only
        price: '$59.00',
        image: 'reference/Images/Set 04/Set 04_01.jpg', // Clothing item
        imageHover: 'reference/Images/Set 04/Set 04_02.jpg', // Model wearing it
        category: 'bottoms',
        itemType: 'tee',
        tags: ['bottoms', 'new'],
        isNew: true
    },
    {
        id: 5,
        name: 'Black Hoodie', // Row 2, 2nd image - renamed only
        price: '$89.00',
        image: 'reference/black hoodie.jpg', // Main image
        imageHover: 'reference/Images/Set 05/Set 05_01.jpg', // Clothing item
        category: 'tops',
        itemType: 'hoodie',
        tags: ['tops']
    },
    {
        id: 6,
        name: 'Heather Grey Hoodie', // Row 2, 3rd image - renamed only
        price: '$79.00',
        image: 'reference/Images/Set 06/Set 06_01.jpg', // Clothing item
        imageHover: 'reference/Images/Set 06/Set 06_02.jpg', // Model wearing it
        category: 'bottoms',
        itemType: 'hoodie',
        tags: ['bottoms']
    },
    {
        id: 7,
        name: 'Navy Sweatpants', // Row 3, 1st image - renamed only
        price: '$129.00',
        image: 'reference/Images/Set 07/Set 07_02.jpg', // Model wearing it
        imageHover: 'reference/Images/Set 07/Set 07_01.jpg', // Clothing item
        category: 'tops',
        itemType: 'sweatpants',
        tags: ['tops']
    },
    {
        id: 8,
        name: 'Black Sweatpants', // Row 3, 2nd image - renamed only
        price: '$39.00',
        image: 'reference/Images/Set 08/Set 08_02.jpg', // Model wearing it
        imageHover: 'reference/Images/Set 08/Set 08_01.jpg', // Clothing item
        category: 'tops',
        itemType: 'sweatpants',
        tags: ['tops']
    },
    {
        id: 9,
        name: 'Beige Shorts', // Row 3, 3rd image - renamed only
        price: '$59.00',
        image: 'reference/Images/Set 09/Set 09_02.jpg', // Model wearing it
        imageHover: 'reference/Images/Set 09/Set 09_01.jpg', // Clothing item
        category: 'bottoms',
        itemType: 'shorts',
        tags: ['bottoms']
    }
];

let currentCategory = 'all';

// Mobile Menu Toggle
function initMobileMenu() {
    const menuToggle = document.getElementById('nav-menu-toggle');
    const mobileMenu = document.getElementById('mobile-menu');
    const closeBtn = document.getElementById('mobile-menu-close');
    const body = document.body;

    function openMenu() {
        if (menuToggle && mobileMenu) {
            menuToggle.classList.add('active');
            mobileMenu.classList.add('active');
            body.style.overflow = 'hidden';
        }
    }

    function closeMenu() {
        if (menuToggle && mobileMenu) {
            menuToggle.classList.remove('active');
            mobileMenu.classList.remove('active');
            body.style.overflow = '';
        }
    }

    if (menuToggle && mobileMenu) {
        menuToggle.addEventListener('click', openMenu);

        if (closeBtn) {
            closeBtn.addEventListener('click', closeMenu);
        }

        // Shop dropdown toggle - use event delegation for reliability
        // Use event delegation on the mobile menu to handle dynamically loaded content
        mobileMenu.addEventListener('click', (e) => {
            const shopLink = e.target.closest('.mobile-menu-shop-link');
            const shopWrapper = e.target.closest('.mobile-menu-link-wrapper');
            
            if (shopLink && shopWrapper) {
                e.preventDefault();
                e.stopPropagation();
                shopWrapper.classList.toggle('active');
                return;
            }
            
            // Close menu when clicking on dropdown links
            const dropdownLink = e.target.closest('.mobile-menu-dropdown-link');
            if (dropdownLink) {
                closeMenu();
                return;
            }
            
            // Close menu when clicking on other menu links (not Shop)
            const menuLink = e.target.closest('.mobile-menu-link:not(.mobile-menu-shop-link)');
            if (menuLink) {
                closeMenu();
            }
        });

        // Close menu when clicking on other links (not Shop) - handled in event delegation above

        // Sync currency display between navbar and mobile menu
        const currencyBtn = document.getElementById('currency-btn');
        const mobileCurrencyBtn = document.getElementById('mobile-currency-btn');
        const currencyFlag = document.getElementById('currency-flag');
        const mobileCurrencyFlag = document.getElementById('mobile-currency-flag');
        const currencyCode = document.getElementById('currency-code');
        const mobileCurrencyCode = document.getElementById('mobile-currency-code');

        if (currencyBtn && mobileCurrencyBtn) {
            // Update mobile currency when main currency changes
            const updateMobileCurrency = () => {
                if (currencyFlag && mobileCurrencyFlag) {
                    mobileCurrencyFlag.textContent = currencyFlag.textContent;
                }
                if (currencyCode && mobileCurrencyCode) {
                    mobileCurrencyCode.textContent = currencyCode.textContent;
                }
            };

            // Listen for currency changes
            const currencyOptions = document.querySelectorAll('.currency-option');
            currencyOptions.forEach(option => {
                option.addEventListener('click', updateMobileCurrency);
            });

            // Sync on menu open
            menuToggle.addEventListener('click', updateMobileCurrency);
        }
    }
}

// Initialize page
function init() {
    // Check URL for category parameter
    const urlParams = new URLSearchParams(window.location.search);
    const categoryParam = urlParams.get('category');
    if (categoryParam) {
        currentCategory = categoryParam;
        const filterBtn = document.querySelector(`[data-category="${categoryParam}"]`);
        if (filterBtn) {
            document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
            filterBtn.classList.add('active');
        }
    }

    renderProducts();
    setupFilters();
    initMobileMenu();
}

// Comprehensive clothing type library
const clothingTypes = {
    tops: [
        // Tops - Upper body garments
        'hoodie', 'hoodies',
        'tee', 'tees', 't-shirt', 't-shirts', 'tshirt', 'tshirts',
        'shirt', 'shirts',
        'sweatshirt', 'sweatshirts',
        'jacket', 'jackets',
        'coat', 'coats',
        'blazer', 'blazers',
        'sweater', 'sweaters',
        'cardigan', 'cardigans',
        'polo', 'polos',
        'tank', 'tanks', 'tank top', 'tank tops',
        'vest', 'vests',
        'blouse', 'blouses',
        'top', 'tops',
        'long sleeve', 'long sleeves', 'longsleeve', 'longsleeves',
        'short sleeve', 'short sleeves', 'shortsleeve', 'shortsleeves',
        'crewneck', 'crewnecks',
        'turtleneck', 'turtlenecks',
        'henley', 'henleys',
        'flannel', 'flannels',
        'denim jacket', 'denim jackets',
        'bomber', 'bombers', 'bomber jacket', 'bomber jackets',
        'windbreaker', 'windbreakers',
        'parka', 'parkas',
        'pullover', 'pullovers',
        'zip-up', 'zip-ups', 'zipup', 'zipups',
        'quarter zip', 'quarter zips',
        'full zip', 'full zips',
        'crop top', 'crop tops', 'croptop', 'croptops',
        'tube top', 'tube tops', 'tubetop', 'tubetops',
        'halter top', 'halter tops', 'haltertop', 'haltertops',
        'tunic', 'tunics',
        'poncho', 'ponchos',
        'kimono', 'kimonos',
        'wrap', 'wraps'
    ],
    bottoms: [
        // Bottoms - Lower body garments
        'pants', 'pant',
        'sweatpants', 'sweatpant',
        'shorts', 'short',
        'joggers', 'jogger',
        'trousers', 'trouser',
        'jeans', 'jean',
        'leggings', 'legging',
        'chinos', 'chino',
        'cargo pants', 'cargo pant', 'cargopants', 'cargopant',
        'track pants', 'track pant', 'trackpants', 'trackpant',
        'yoga pants', 'yoga pant', 'yogapants', 'yogapant',
        'capris', 'capri',
        'bermuda shorts', 'bermuda short', 'bermudashorts', 'bermudashort',
        'board shorts', 'board short', 'boardshorts', 'boardshort',
        'athletic shorts', 'athletic short', 'athleticshorts', 'athleticshort',
        'sweat shorts', 'sweat short', 'sweatshorts', 'sweatshort',
        'bike shorts', 'bike short', 'bikeshorts', 'bikeshort',
        'running shorts', 'running short', 'runningshorts', 'runningshort',
        'gym shorts', 'gym short', 'gymshorts', 'gymshort',
        'cargo shorts', 'cargo short', 'cargoshorts', 'cargoshort',
        'denim shorts', 'denim short', 'denimshorts', 'denimshort',
        'chino shorts', 'chino short', 'chinoshorts', 'chinoshort',
        'jogger shorts', 'jogger short', 'joggershorts', 'joggershort',
        'sweatpant', 'sweatpants',
        'tights', 'tight',
        'culottes', 'culotte',
        'palazzo pants', 'palazzo pant', 'palazzopants', 'palazzopant',
        'wide leg pants', 'wide leg pant', 'widelegpants', 'widelegpant',
        'straight leg pants', 'straight leg pant', 'straightlegpants', 'straightlegpant',
        'skinny pants', 'skinny pant', 'skinnypants', 'skinnypant',
        'bootcut pants', 'bootcut pant', 'bootcutpants', 'bootcutpant',
        'flare pants', 'flare pant', 'flarepants', 'flarepant',
        'cropped pants', 'cropped pant', 'croppedpants', 'croppedpant',
        'ankle pants', 'ankle pant', 'anklepants', 'anklepant'
    ]
};

// Category mapping function - determines category based on product name
// Uses comprehensive clothing type library to identify tops vs bottoms
function getProductCategory(product) {
    const name = product.name.toLowerCase().trim();
    
    // Check against comprehensive tops list
    for (const topType of clothingTypes.tops) {
        if (name.includes(topType)) {
            return 'tops';
        }
    }
    
    // Check against comprehensive bottoms list
    for (const bottomType of clothingTypes.bottoms) {
        if (name.includes(bottomType)) {
            return 'bottoms';
        }
    }
    
    // Fallback to existing category if no match found
    return product.category;
}

function renderProducts() {
    const productsGrid = document.getElementById('products-grid');
    if (!productsGrid) return;

    let filteredProducts = products;
    
    if (currentCategory !== 'all') {
        filteredProducts = products.filter(product => {
            const productCategory = getProductCategory(product);
            return productCategory === currentCategory;
        });
    }

    if (filteredProducts.length === 0) {
        productsGrid.innerHTML = '<p style="text-align: center; grid-column: 1/-1; padding: 60px 0; color: #666;">No products found in this category.</p>';
        return;
    }

    productsGrid.innerHTML = filteredProducts.map(product => `
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

function setupFilters() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentCategory = btn.dataset.category;
            renderProducts();
            
            // Update URL without reload
            const url = new URL(window.location);
            if (currentCategory === 'all') {
                url.searchParams.delete('category');
            } else {
                url.searchParams.set('category', currentCategory);
            }
            window.history.pushState({}, '', url);
        });
    });
}

// Newsletter form
const newsletterForm = document.getElementById('newsletter-form');
if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = e.target.querySelector('input[type="email"]').value;
        alert(`Thank you for subscribing with ${email}!`);
        e.target.reset();
    });
}

// Newsletter Modal
function initNewsletterModal() {
    const modal = document.getElementById('newsletter-modal');
    const closeBtn = document.getElementById('newsletter-modal-close');
    const modalForm = document.getElementById('newsletter-modal-form');
    const overlay = modal?.querySelector('.newsletter-modal-overlay');
    
    if (!modal) return;
    
    // Check if user has already seen the modal (using sessionStorage instead of localStorage)
    // This allows the modal to show on each new session
    const hasSeenModal = sessionStorage.getItem('newsletter-modal-seen');
    
    // Show modal on page load if not seen in this session
    if (!hasSeenModal) {
        setTimeout(() => {
            if (modal) {
                modal.classList.add('active');
                document.body.style.overflow = 'hidden';
            }
        }, 500); // Small delay for better UX
    }
    
    // Close modal function
    function closeModal() {
        if (modal) {
            modal.classList.remove('active');
            document.body.style.overflow = '';
            sessionStorage.setItem('newsletter-modal-seen', 'true');
        }
    }
    
    // Close button
    if (closeBtn) {
        closeBtn.addEventListener('click', closeModal);
    }
    
    // Close on overlay click
    if (overlay) {
        overlay.addEventListener('click', closeModal);
    }
    
    // Form submission
    if (modalForm) {
        modalForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = e.target.querySelector('input[type="email"]').value;
            // Handle form submission here
            console.log('Newsletter signup:', email);
            alert(`Thank you for joining! You'll receive 10% off your first purchase.`);
            closeModal();
        });
    }
    
    // Close on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeModal();
        }
    });
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        init();
        initNewsletterModal();
    });
} else {
    init();
    initNewsletterModal();
}

