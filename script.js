// Performance-optimized DOM element caching
const DOMCache = {
    hamburger: null,
    navMenu: null,
    navbar: null,
    heroSection: null,
    modal: null,
    
    init() {
        this.hamburger = document.getElementById('hamburger');
        this.navMenu = document.getElementById('nav-menu');
        this.navbar = document.querySelector('.navbar');
        this.heroSection = document.querySelector('.hero');
        this.modal = document.getElementById('quote-modal');
    }
};

// Initialize DOM cache when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    DOMCache.init();
    
    // Mobile menu toggle with cached elements
    if (DOMCache.hamburger && DOMCache.navMenu) {
        DOMCache.hamburger.addEventListener('click', () => {
            const isActive = DOMCache.navMenu.classList.toggle('active');
            DOMCache.hamburger.setAttribute('aria-expanded', isActive);
        }, { passive: true });
    }

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (DOMCache.navMenu && DOMCache.hamburger) {
            if (DOMCache.navMenu.classList.contains('active') && !DOMCache.navMenu.contains(e.target) && !DOMCache.hamburger.contains(e.target)) {
                DOMCache.navMenu.classList.remove('active');
                DOMCache.hamburger.setAttribute('aria-expanded', 'false');
            }
        }
    }, { passive: true });

    // Close mobile menu when clicking on a link
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            if (DOMCache.navMenu) {
                DOMCache.navMenu.classList.remove('active');
            }
        }, { passive: true });
    });
});

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Scroll to section function
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}

// Quote form modal functions
function showQuoteForm(service = '') {
    const modal = document.getElementById('quote-modal');
    const serviceSelect = document.getElementById('service-select');

    if (service && serviceSelect) {
        serviceSelect.value = service;
    }

    if (modal) {
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden'; // Prevent background scrolling
    }
}

function closeQuoteForm() {
    const modal = document.getElementById('quote-modal');
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto'; // Restore scrolling
    }
}

// Optimized modal event handlers
let modalEventListenersAdded = false;

function addModalEventListeners() {
    if (modalEventListenersAdded) return;
    
    // Close modal when clicking outside of it
    window.addEventListener('click', function (event) {
        const modal = document.getElementById('quote-modal');
        if (event.target === modal) {
            closeQuoteForm();
        }
    }, { passive: true });

    // Close modal with Escape key
    document.addEventListener('keydown', function (event) {
        if (event.key === 'Escape') {
            closeQuoteForm();
        }
    }, { passive: true });
    
    modalEventListenersAdded = true;
}



// Debounce utility for performance
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

// Throttle utility for scroll events
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
    }
}

// Optimized scroll handler with cached elements
const handleScroll = throttle(() => {
    if (!DOMCache.navbar || !DOMCache.heroSection) return;
    
    const heroHeight = DOMCache.heroSection.offsetHeight;
    
    if (window.scrollY < heroHeight - 100) {
        DOMCache.navbar.classList.remove('scrolled');
    } else {
        DOMCache.navbar.classList.add('scrolled');
    }
}, 16); // ~60fps

// Add scroll effect to navbar with passive listener
window.addEventListener('scroll', handleScroll, { passive: true });

// Optimized form handling utilities
const FormHandler = {
    createEmailBody(data, type) {
        if (type === 'quote') {
            return `
Quote Request from ${data.name}

Name: ${data.name}
Business: ${data.business || 'Not provided'}
Email: ${data.email}
Phone: ${data.phone}
Service: ${data.service}
Message: ${data.message}
            `.trim();
        } else {
            return `
Contact Form Submission

Name: ${data.name}
Email: ${data.email}
Phone: ${data.phone || 'Not provided'}
Message: ${data.message}
            `.trim();
        }
    },

    sendEmail(data, type) {
        const emailBody = this.createEmailBody(data, type);
        const subject = type === 'quote' ? `Quote Request from ${data.name}` : `Contact Form from ${data.name}`;
        const mailtoLink = `mailto:info@lbmfinancialgroup.com?subject=${subject}&body=${encodeURIComponent(emailBody)}`;
        
        window.location.href = mailtoLink;
        
        if (type === 'quote') {
            closeQuoteForm();
        }
        
        alert(`Thank you for your ${type === 'quote' ? 'quote request' : 'message'}! Your email client should open with the pre-filled message.`);
    }
};

// Event delegation for form handling
document.addEventListener('submit', function(e) {
    const form = e.target;
    
    if (form.id === 'quote-form') {
        e.preventDefault();
        const formData = new FormData(form);
        const data = Object.fromEntries(formData);
        FormHandler.sendEmail(data, 'quote');
    } else if (form.classList.contains('contact-form')) {
        e.preventDefault();
        const formData = new FormData(form);
        const data = Object.fromEntries(formData);
        FormHandler.sendEmail(data, 'contact');
    }
}, { passive: false });

// Handle inline quote button with event delegation
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('quote-submit-btn')) {
        e.preventDefault();
        
        const formInputs = document.querySelectorAll('.quote-form-inline .form-input');
        const data = {};

        formInputs.forEach(input => {
            if (input.type === 'text' && input.placeholder === 'Name') {
                data.name = input.value;
            } else if (input.type === 'email') {
                data.email = input.value;
            } else if (input.type === 'tel') {
                data.phone = input.value;
            } else if (input.tagName === 'SELECT') {
                data.service = input.value;
            }
        });

        if (!data.name || !data.email || !data.service) {
            alert('Please fill in all required fields.');
            return;
        }

        FormHandler.sendEmail(data, 'quote');
    }
}, { passive: false });

// Service card flip functionality
function flipCard(cardContainer) {
    cardContainer.classList.toggle('flipped');
}

// Lazy loading implementation
const lazyImageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const img = entry.target;
            img.classList.add('loading');
            
            // Create a new image to preload
            const imageLoader = new Image();
            imageLoader.onload = () => {
                img.src = img.dataset.src;
                img.classList.remove('loading');
                img.classList.add('loaded');
                img.removeAttribute('data-src');
            };
            imageLoader.onerror = () => {
                img.classList.remove('loading');
                console.warn('Failed to load image:', img.dataset.src);
            };
            imageLoader.src = img.dataset.src;
            
            observer.unobserve(img);
        }
    });
}, {
    rootMargin: '200px 0px',
    threshold: 0.01
});

// Intersection Observer for animations (optional enhancement)
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const animationObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// CSS loading optimization
function loadCSS(href, before, media) {
    var doc = window.document;
    var ss = doc.createElement("link");
    var ref;
    if (before) {
        ref = before;
    } else {
        var refs = (doc.body || doc.getElementsByTagName("head")[0]).childNodes;
        ref = refs[refs.length - 1];
    }
    var sheets = doc.styleSheets;
    ss.rel = "stylesheet";
    ss.href = href;
    ss.media = "only x";
    function ready(cb) {
        if (doc.body) {
            return cb();
        }
        setTimeout(function () {
            ready(cb);
        });
    }
    ready(function () {
        ref.parentNode.insertBefore(ss, (before ? ref : ref.nextSibling));
    });
    var onloadcssdefined = function (cb) {
        var resolvedHref = ss.href;
        var i = sheets.length;
        while (i--) {
            if (sheets[i].href === resolvedHref) {
                return cb();
            }
        }
        setTimeout(function () {
            onloadcssdefined(cb);
        });
    };
    function loadCB() {
        if (ss.addEventListener) {
            ss.removeEventListener("load", loadCB);
        }
        ss.media = media || "all";
    }
    if (ss.addEventListener) {
        ss.addEventListener("load", loadCB);
    }
    ss.onloadcssdefined = onloadcssdefined;
    onloadcssdefined(loadCB);
    return ss;
}

// Font loading optimization with performance monitoring
if ('fonts' in document) {
    const fontLoadStart = performance.now();
    document.fonts.ready.then(() => {
        document.body.classList.add('fonts-loaded');
        const fontLoadTime = performance.now() - fontLoadStart;
        console.log(`Fonts loaded in ${fontLoadTime.toFixed(2)}ms`);
    });
}

// Network optimization utilities
const NetworkOptimizer = {
    // Prefetch resources on hover
    prefetchOnHover() {
        const links = document.querySelectorAll('a[href^="#"]');
        links.forEach(link => {
            link.addEventListener('mouseenter', () => {
                const href = link.getAttribute('href');
                if (href && href.startsWith('#')) {
                    // Prefetch section-specific resources
                    this.prefetchSectionResources(href.substring(1));
                }
            }, { passive: true, once: true });
        });
    },

    prefetchSectionResources(sectionId) {
        const resourceMap = {
            'services': [
                'images/Financial Operations-image.jpg',
                'images/Business Consulting-image.jpg',
                'images/Treasury management-image.jpg'
            ],
            'nonprofit': [
                'images/community support-image.jpg',
                'images/Financial Literacy.jpg'
            ],
            'about': [
                'images/Team Lead-image.jpg'
            ]
        };

        const resources = resourceMap[sectionId];
        if (resources) {
            resources.forEach(resource => {
                const link = document.createElement('link');
                link.rel = 'prefetch';
                link.href = resource;
                document.head.appendChild(link);
            });
        }
    },

    // Optimize image loading based on connection
    optimizeForConnection() {
        if ('connection' in navigator) {
            const connection = navigator.connection;
            const slowConnection = connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g';
            
            if (slowConnection) {
                // Disable non-critical animations for slow connections
                document.body.classList.add('slow-connection');
                console.log('Slow connection detected, optimizing experience');
            }
        }
    }
};

// Performance monitoring utilities
const PerformanceMonitor = {
    measureFunction(fn, name) {
        return function(...args) {
            const start = performance.now();
            const result = fn.apply(this, args);
            const end = performance.now();
            console.log(`${name} took ${(end - start).toFixed(2)}ms`);
            return result;
        };
    },

    logPageLoadMetrics() {
        window.addEventListener('load', () => {
            setTimeout(() => {
                const navigation = performance.getEntriesByType('navigation')[0];
                const paint = performance.getEntriesByType('paint');
                
                console.log('Page Load Metrics:', {
                    'DOM Content Loaded': `${navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart}ms`,
                    'Load Complete': `${navigation.loadEventEnd - navigation.loadEventStart}ms`,
                    'Total Load Time': `${navigation.loadEventEnd - navigation.fetchStart}ms`,
                    'First Paint': paint.find(p => p.name === 'first-paint')?.startTime.toFixed(2) + 'ms',
                    'First Contentful Paint': paint.find(p => p.name === 'first-contentful-paint')?.startTime.toFixed(2) + 'ms'
                });

                // Log resource loading times
                const resources = performance.getEntriesByType('resource');
                const slowResources = resources.filter(r => r.duration > 100);
                if (slowResources.length > 0) {
                    console.log('Slow loading resources:', slowResources.map(r => ({
                        name: r.name,
                        duration: r.duration.toFixed(2) + 'ms'
                    })));
                }
            }, 0);
        });
    },

    // Monitor Core Web Vitals
    monitorWebVitals() {
        // Largest Contentful Paint
        new PerformanceObserver((entryList) => {
            const entries = entryList.getEntries();
            const lastEntry = entries[entries.length - 1];
            console.log('LCP:', lastEntry.startTime.toFixed(2) + 'ms');
        }).observe({ entryTypes: ['largest-contentful-paint'] });

        // First Input Delay
        new PerformanceObserver((entryList) => {
            const entries = entryList.getEntries();
            entries.forEach(entry => {
                console.log('FID:', entry.processingStart - entry.startTime + 'ms');
            });
        }).observe({ entryTypes: ['first-input'] });

        // Cumulative Layout Shift
        let clsValue = 0;
        new PerformanceObserver((entryList) => {
            const entries = entryList.getEntries();
            entries.forEach(entry => {
                if (!entry.hadRecentInput) {
                    clsValue += entry.value;
                    console.log('Layout shift detected:', {
                        value: entry.value.toFixed(4),
                        sources: entry.sources?.map(s => s.node?.tagName || 'unknown')
                    });
                }
            });
            console.log('Total CLS:', clsValue.toFixed(4));
        }).observe({ entryTypes: ['layout-shift'] });

        // Long Task monitoring
        new PerformanceObserver((entryList) => {
            const entries = entryList.getEntries();
            entries.forEach(entry => {
                console.log('Long task detected:', {
                    duration: entry.duration.toFixed(2) + 'ms',
                    startTime: entry.startTime.toFixed(2) + 'ms'
                });
            });
        }).observe({ entryTypes: ['longtask'] });
    }
};

// Initialize network optimizations
NetworkOptimizer.prefetchOnHover();
NetworkOptimizer.optimizeForConnection();

// Initialize performance monitoring in development
    PerformanceMonitor.logPageLoadMetrics();
    PerformanceMonitor.monitorWebVitals();

// Performance-optimized initialization
function initializePerformanceFeatures() {
    // Initialize lazy loading for images
    const lazyImages = document.querySelectorAll('.lazy-load');
    if (lazyImages.length > 0) {
        lazyImages.forEach(img => {
            lazyImageObserver.observe(img);
        });
    }

    // Initialize animations with requestAnimationFrame for better performance
    const animateElements = document.querySelectorAll('.service-main, .service-card-container, .credential-item');
    if (animateElements.length > 0) {
        requestAnimationFrame(() => {
            animateElements.forEach(el => {
                // Add GPU acceleration classes
                el.classList.add('gpu-accelerated');
                el.style.opacity = '0';
                el.style.transform = 'translateY(20px)';
                el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
                animationObserver.observe(el);
            });
        });
    }

    // Optimize service cards for better performance
    const serviceCards = document.querySelectorAll('.service-card-container');
    serviceCards.forEach(card => {
        card.classList.add('gpu-accelerated');
        
        // Add passive event listeners for better scroll performance
        card.addEventListener('mouseenter', () => {
            card.style.willChange = 'transform';
        }, { passive: true });
        
        card.addEventListener('mouseleave', () => {
            card.style.willChange = 'auto';
        }, { passive: true });
    });
}

// Use more efficient event listener
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializePerformanceFeatures);
} else {
    // DOM is already loaded
    initializePerformanceFeatures();
}