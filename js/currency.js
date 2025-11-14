// Currency Conversion Rates (approximate, update with real-time rates)
const currencyRates = {
    USD: 1.0,
    EUR: 0.92,
    GBP: 0.79,
    JPY: 149.50,
    CAD: 1.36,
    AUD: 1.52,
    CHF: 0.88,
    CNY: 7.24,
    INR: 83.12,
    BRL: 4.95,
    MXN: 17.05,
    KRW: 1320.50,
    SGD: 1.34,
    HKD: 7.82,
    NZD: 1.66,
    SEK: 10.68,
    NOK: 10.85,
    DKK: 6.87,
    PLN: 4.02,
    ZAR: 18.75
};

let currentCurrency = localStorage.getItem('selectedCurrency') || 'USD';

// Initialize currency selector
function initCurrencySelector() {
    const currencyBtn = document.getElementById('currency-btn');
    const currencyDropdown = document.getElementById('currency-dropdown');
    const currencyFlag = document.getElementById('currency-flag');
    const currencyCode = document.getElementById('currency-code');
    const currencyOptions = document.querySelectorAll('.currency-option');

    if (!currencyBtn || !currencyDropdown) return;

    // Set initial currency
    updateCurrencyDisplay(currentCurrency);

    // Toggle dropdown
    currencyBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        currencyDropdown.classList.toggle('active');
    });

    // Close dropdown when clicking outside
    document.addEventListener('click', (e) => {
        if (!currencyBtn.contains(e.target) && !currencyDropdown.contains(e.target)) {
            currencyDropdown.classList.remove('active');
        }
    });

    // Handle currency selection
    currencyOptions.forEach(option => {
        option.addEventListener('click', () => {
            const currency = option.dataset.currency;
            const flag = option.dataset.flag;
            
            currentCurrency = currency;
            localStorage.setItem('selectedCurrency', currency);
            
            updateCurrencyDisplay(currency);
            updateAllPrices();
            
            // Force cart to re-render with new currency if it exists
            if (typeof renderCart === 'function') {
                renderCart();
            }
            
            currencyDropdown.classList.remove('active');
        });
    });
}

// Update currency display
function updateCurrencyDisplay(currency) {
    const currencyFlag = document.getElementById('currency-flag');
    const currencyCode = document.getElementById('currency-code');
    const flagMap = {
        'USD': '🇺🇸', 'EUR': '🇪🇺', 'GBP': '🇬🇧', 'JPY': '🇯🇵',
        'CAD': '🇨🇦', 'AUD': '🇦🇺', 'CHF': '🇨🇭', 'CNY': '🇨🇳',
        'INR': '🇮🇳', 'BRL': '🇧🇷', 'MXN': '🇲🇽', 'KRW': '🇰🇷',
        'SGD': '🇸🇬', 'HKD': '🇭🇰', 'NZD': '🇳🇿', 'SEK': '🇸🇪',
        'NOK': '🇳🇴', 'DKK': '🇩🇰', 'PLN': '🇵🇱', 'ZAR': '🇿🇦'
    };

    if (currencyFlag) currencyFlag.textContent = flagMap[currency] || '🇺🇸';
    if (currencyCode) currencyCode.textContent = currency;
}

// Convert price to selected currency
function convertPrice(priceString) {
    // Extract numeric value from price string (e.g., "$79.00" -> 79.00)
    const numericPrice = parseFloat(priceString.replace(/[^0-9.]/g, ''));
    if (isNaN(numericPrice)) return priceString;

    // Convert to selected currency
    const rate = currencyRates[currentCurrency] || 1;
    const convertedPrice = numericPrice * rate;

    // Format based on currency
    return formatPrice(convertedPrice, currentCurrency);
}

// Format price based on currency
function formatPrice(amount, currency) {
    const formatters = {
        'JPY': new Intl.NumberFormat('ja-JP', { style: 'currency', currency: 'JPY', minimumFractionDigits: 0 }),
        'KRW': new Intl.NumberFormat('ko-KR', { style: 'currency', currency: 'KRW', minimumFractionDigits: 0 }),
        'INR': new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 0 }),
        'CNY': new Intl.NumberFormat('zh-CN', { style: 'currency', currency: 'CNY', minimumFractionDigits: 0 }),
    };

    if (formatters[currency]) {
        return formatters[currency].format(amount);
    }

    // Default formatting
    try {
        return new Intl.NumberFormat('en-US', { 
            style: 'currency', 
            currency: currency,
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(amount);
    } catch (e) {
        // Fallback formatting
        return `${currency} ${amount.toFixed(2)}`;
    }
}

// Update all prices on the page
function updateAllPrices() {
    // Update product prices on shop page
    const productPrices = document.querySelectorAll('.product-price');
    productPrices.forEach(priceEl => {
        const originalPrice = priceEl.dataset.originalPrice || priceEl.textContent;
        if (!priceEl.dataset.originalPrice) {
            priceEl.dataset.originalPrice = originalPrice;
        }
        priceEl.textContent = convertPrice(originalPrice);
    });

    // Update product detail page price
    const detailPrice = document.querySelector('.product-info-content .product-price');
    if (detailPrice) {
        const originalPrice = detailPrice.dataset.originalPrice || detailPrice.textContent;
        if (!detailPrice.dataset.originalPrice) {
            detailPrice.dataset.originalPrice = originalPrice;
        }
        detailPrice.textContent = convertPrice(originalPrice);
    }
    
    // Update cart prices if cart is open
    if (typeof renderCart === 'function') {
        renderCart();
    }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        initCurrencySelector();
        updateAllPrices();
    });
} else {
    initCurrencySelector();
    updateAllPrices();
}

