/**
 * Pure Organic Honey - JavaScript
 * High-Conversion Website Script
 * 
 * Features:
 * - Mobile menu toggle
 * - Smooth scrolling
 * - Sticky header effects
 * - Scroll animations (Intersection Observer)
 * - Quantity selectors
 * - WhatsApp order integration
 * - Floating particles
 */

// Configuration
const CONFIG = {
    // Replace with your actual WhatsApp number (with country code, no + or spaces)
    whatsappNumber: '916369136392',
    
    // Company name for messages
    companyName: '2t honey',
    
    // Animation settings
    animationThreshold: 0.1,
    animationRootMargin: '0px 0px -50px 0px'
};

// DOM Elements
const header = document.getElementById('header');
const hamburger = document.getElementById('hamburger');
const nav = document.getElementById('nav');
const navLinks = document.querySelectorAll('.nav-link');
const productCards = document.querySelectorAll('.product-card');
const animatedElements = document.querySelectorAll('.animate-on-scroll');

// ============================================
// MOBILE MENU
// ============================================
function initMobileMenu() {
    hamburger.addEventListener('click', toggleMobileMenu);
    
    // Close menu when clicking nav links
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            closeMobileMenu();
        });
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!nav.contains(e.target) && !hamburger.contains(e.target)) {
            closeMobileMenu();
        }
    });
}

function toggleMobileMenu() {
    hamburger.classList.toggle('active');
    nav.classList.toggle('mobile-open');
    document.body.style.overflow = nav.classList.contains('mobile-open') ? 'hidden' : '';
}

function closeMobileMenu() {
    hamburger.classList.remove('active');
    nav.classList.remove('mobile-open');
    document.body.style.overflow = '';
}

// ============================================
// SMOOTH SCROLLING
// ============================================
function initSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const headerHeight = header.offsetHeight;
                const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// ============================================
// STICKY HEADER EFFECTS
// ============================================
function initStickyHeader() {
    let lastScrollY = window.scrollY;
    
    window.addEventListener('scroll', () => {
        const currentScrollY = window.scrollY;
        
        // Add scrolled class when not at top
        if (currentScrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        lastScrollY = currentScrollY;
    }, { passive: true });
}

// ============================================
// SCROLL ANIMATIONS (Intersection Observer)
// ============================================
function initScrollAnimations() {
    const observerOptions = {
        threshold: CONFIG.animationThreshold,
        rootMargin: CONFIG.animationRootMargin
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                // Add staggered delay for items in same section
                setTimeout(() => {
                    entry.target.classList.add('animated');
                }, index * 100);
                
                // Optionally unobserve after animation
                // observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    animatedElements.forEach(el => {
        observer.observe(el);
    });
}

// ============================================
// QUANTITY SELECTORS
// ============================================
function initQuantitySelectors() {
    productCards.forEach(card => {
        const minusBtn = card.querySelector('.qty-minus');
        const plusBtn = card.querySelector('.qty-plus');
        const input = card.querySelector('.qty-input');
        
        if (minusBtn && plusBtn && input) {
            minusBtn.addEventListener('click', () => {
                const currentValue = parseInt(input.value);
                if (currentValue > 1) {
                    input.value = currentValue - 1;
                    updateButtonState(card);
                }
            });
            
            plusBtn.addEventListener('click', () => {
                const currentValue = parseInt(input.value);
                if (currentValue < 10) {
                    input.value = currentValue + 1;
                    updateButtonState(card);
                }
            });
        }
    });
}

function updateButtonState(card) {
    const input = card.querySelector('.qty-input');
    const minusBtn = card.querySelector('.qty-minus');
    const plusBtn = card.querySelector('.qty-plus');
    const quantity = parseInt(input.value);
    
    // Visual feedback for min/max
    minusBtn.style.opacity = quantity <= 1 ? '0.5' : '1';
    plusBtn.style.opacity = quantity >= 10 ? '0.5' : '1';
}

// ============================================
// WHATSAPP ORDER INTEGRATION (CRITICAL)
// ============================================
function initWhatsAppOrders() {
    productCards.forEach(card => {
        const orderBtn = card.querySelector('.btn-order');
        
        if (orderBtn) {
            orderBtn.addEventListener('click', () => {
                placeWhatsAppOrder(card);
            });
        }
    });
}

function placeWhatsAppOrder(card) {
    // Get product details from the card
    const productName = card.dataset.product;
    const unitPrice = parseInt(card.dataset.price);
    const quantityInput = card.querySelector('.qty-input');
    const quantity = parseInt(quantityInput.value);
    const totalPrice = unitPrice * quantity;
    
    // Format the message
    const message = formatOrderMessage(productName, quantity, unitPrice, totalPrice);
    
    // Generate WhatsApp URL
    const whatsappUrl = generateWhatsAppUrl(message);
    
    // Add click animation
    const orderBtn = card.querySelector('.btn-order');
    orderBtn.style.transform = 'scale(0.95)';
    setTimeout(() => {
        orderBtn.style.transform = '';
    }, 150);
    
    // Open WhatsApp
    window.open(whatsappUrl, '_blank');
    
    // Track conversion (for analytics)
    trackOrder(productName, quantity, totalPrice);
}

function formatOrderMessage(productName, quantity, unitPrice, totalPrice) {
    // Create a well-formatted order message
    const message = `🍯 *New Order from ${CONFIG.companyName} Website*

━━━━━━━━━━━━━━━━━━━━

📦 *Product:* ${productName}
📊 *Quantity:* ${quantity}
💰 *Unit Price:* ₹${unitPrice}
━━━━━━━━━━━━━━━━━━━━
💵 *Total Amount:* ₹${totalPrice.toLocaleString('en-IN')}

━━━━━━━━━━━━━━━━━━━━

Please confirm my order and share the delivery details.

Thank you! 🙏`;

    return message;
}

function generateWhatsAppUrl(message) {
    const encodedMessage = encodeURIComponent(message);
    return `https://wa.me/${CONFIG.whatsappNumber}?text=${encodedMessage}`;
}

function trackOrder(productName, quantity, totalPrice) {
    // Log order for debugging
    console.log('Order placed:', {
        product: productName,
        quantity: quantity,
        total: totalPrice,
        timestamp: new Date().toISOString()
    });
    
    // You can add analytics tracking here
    // Example: Google Analytics event
    if (typeof gtag === 'function') {
        gtag('event', 'purchase', {
            'event_category': 'WhatsApp Order',
            'event_label': productName,
            'value': totalPrice
        });
    }
    
    // Example: Facebook Pixel
    if (typeof fbq === 'function') {
        fbq('track', 'InitiateCheckout', {
            content_name: productName,
            content_category: 'Honey',
            value: totalPrice,
            currency: 'INR'
        });
    }
}

// ============================================
// FLOATING PARTICLES (Hero Section)
// ============================================
function initHeroParticles() {
    const particlesContainer = document.getElementById('particles');
    if (!particlesContainer) return;
    
    const particles = ['🐝', '🍯', '✨', '🌸', '🌺'];
    const numParticles = 8;
    
    for (let i = 0; i < numParticles; i++) {
        createParticle(particlesContainer, particles);
    }
}

function createParticle(container, particles) {
    const particle = document.createElement('span');
    particle.className = 'particle';
    particle.textContent = particles[Math.floor(Math.random() * particles.length)];
    
    // Random position
    particle.style.left = Math.random() * 100 + '%';
    particle.style.top = Math.random() * 100 + '%';
    
    // Random animation delay and duration
    particle.style.animationDelay = Math.random() * 5 + 's';
    particle.style.animationDuration = (3 + Math.random() * 4) + 's';
    
    container.appendChild(particle);
}

// ============================================
// PRODUCT CARD HOVER EFFECTS
// ============================================
function initProductHoverEffects() {
    productCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            // Add subtle scale to honey jar on hover
            const jar = card.querySelector('.honey-jar');
            if (jar) {
                jar.style.transform = 'scale(1.08) rotate(-3deg)';
            }
        });
        
        card.addEventListener('mouseleave', () => {
            const jar = card.querySelector('.honey-jar');
            if (jar) {
                jar.style.transform = '';
            }
        });
    });
}

// ============================================
// ACTIVE NAV LINK ON SCROLL
// ============================================
function initActiveNavOnScroll() {
    const sections = document.querySelectorAll('section[id]');
    
    window.addEventListener('scroll', () => {
        let current = '';
        const headerHeight = header.offsetHeight;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop - headerHeight - 100;
            const sectionHeight = section.offsetHeight;
            
            if (window.pageYOffset >= sectionTop && window.pageYOffset < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    }, { passive: true });
}

// ============================================
// TRUST CARD COUNTER ANIMATION
// ============================================
function initCounterAnimation() {
    const stats = document.querySelectorAll('.stat-number');
    
    const observerOptions = {
        threshold: 0.5
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    stats.forEach(stat => observer.observe(stat));
}

function animateCounter(element) {
    const text = element.textContent;
    const match = text.match(/(\d+)/);
    
    if (match) {
        const finalNumber = parseInt(match[0]);
        const duration = 2000;
        const steps = 60;
        const stepDuration = duration / steps;
        let currentStep = 0;
        
        const timer = setInterval(() => {
            currentStep++;
            const progress = currentStep / steps;
            const easeOutQuad = 1 - (1 - progress) * (1 - progress);
            const currentNumber = Math.floor(finalNumber * easeOutQuad);
            
            element.textContent = text.replace(/\d+/, currentNumber);
            
            if (currentStep >= steps) {
                element.textContent = text;
                clearInterval(timer);
            }
        }, stepDuration);
    }
}

// ============================================
// TESTIMONIAL AUTO-SLIDE (Optional)
// ============================================
function initTestimonialSlider() {
    const testimonials = document.querySelectorAll('.testimonial-card');
    
    if (testimonials.length === 0 || window.innerWidth > 768) return;
    
    let currentIndex = 0;
    
    setInterval(() => {
        testimonials.forEach((card, index) => {
            card.style.opacity = index === currentIndex ? '1' : '0.3';
            card.style.transform = index === currentIndex ? 'scale(1)' : 'scale(0.95)';
        });
        
        currentIndex = (currentIndex + 1) % testimonials.length;
    }, 4000);
}

// ============================================
// FORM VALIDATION HELPERS (If needed later)
// ============================================
function validatePhone(phone) {
    const phoneRegex = /^[6-9]\d{9}$/;
    return phoneRegex.test(phone.replace(/\s/g, ''));
}

function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// ============================================
// UTILITY FUNCTIONS
// ============================================
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// ============================================
// LOADING STATE
// ============================================
function initLoadingState() {
    // Add loaded class to body when everything is ready
    window.addEventListener('load', () => {
        document.body.classList.add('loaded');
        
        // Trigger initial animations for hero section
        setTimeout(() => {
            document.querySelectorAll('.hero .animate-on-scroll').forEach((el, index) => {
                setTimeout(() => {
                    el.classList.add('animated');
                }, index * 150);
            });
        }, 200);
    });
}

// ============================================
// ERROR HANDLING
// ============================================
function handleError(error, context) {
    console.error(`Error in ${context}:`, error);
}

// ============================================
// INITIALIZE ALL FEATURES
// ============================================
function init() {
    try {
        initLoadingState();
        initMobileMenu();
        initSmoothScrolling();
        initStickyHeader();
        initScrollAnimations();
        initQuantitySelectors();
        initWhatsAppOrders();
        initHeroParticles();
        initProductHoverEffects();
        initActiveNavOnScroll();
        initCounterAnimation();
        
        console.log('🍯 Pure Organic Honey website initialized successfully!');
    } catch (error) {
        handleError(error, 'initialization');
    }
}

// Run initialization when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}

// ============================================
// EXPOSE FUNCTIONS FOR EXTERNAL USE
// ============================================
window.PureHoney = {
    placeOrder: placeWhatsAppOrder,
    config: CONFIG
};
