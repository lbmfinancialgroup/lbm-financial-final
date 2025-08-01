// Mobile menu toggle
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('nav-menu');

hamburger.addEventListener('click', () => {
    navMenu.classList.toggle('active');
});

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
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

// Close modal when clicking outside of it
window.addEventListener('click', function (event) {
    const modal = document.getElementById('quote-modal');
    if (event.target === modal) {
        closeQuoteForm();
    }
});

// Close modal with Escape key
document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape') {
        closeQuoteForm();
    }
});

// Add scroll effect to navbar
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    const heroSection = document.querySelector('.hero');
    const heroHeight = heroSection ? heroSection.offsetHeight : 0;

    if (window.scrollY < heroHeight - 100) {
        // Over hero section - transparent navbar
        navbar.classList.remove('scrolled');
    } else {
        // Past hero section - solid navbar
        navbar.classList.add('scrolled');
    }
});

// Form submission handling
document.addEventListener('DOMContentLoaded', function () {
    // Handle quote form submission
    const quoteForm = document.getElementById('quote-form');
    if (quoteForm) {
        quoteForm.addEventListener('submit', function (e) {
            e.preventDefault();

            // Get form data
            const formData = new FormData(quoteForm);
            const data = Object.fromEntries(formData);

            // Create email body
            const emailBody = `
Quote Request from ${data.name}

Name: ${data.name}
Business: ${data.business || 'Not provided'}
Email: ${data.email}
Phone: ${data.phone}
Service: ${data.service}
Message: ${data.message}
            `.trim();

            // Create mailto link
            const mailtoLink = `mailto:info@lbmfinancialgroup.com?subject=Quote Request from ${data.name}&body=${encodeURIComponent(emailBody)}`;

            // Open email client
            window.location.href = mailtoLink;

            // Close modal and show confirmation
            closeQuoteForm();
            alert('Thank you for your quote request! Your email client should open with the pre-filled message.');
        });
    }

    // Handle contact form submission
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function (e) {
            e.preventDefault();

            // Get form data
            const formData = new FormData(contactForm);
            const data = Object.fromEntries(formData);

            // Create email body
            const emailBody = `
Contact Form Submission

Name: ${data.name}
Email: ${data.email}
Phone: ${data.phone || 'Not provided'}
Message: ${data.message}
            `.trim();

            // Create mailto link
            const mailtoLink = `mailto:info@lbmfinancialgroup.com?subject=Contact Form from ${data.name}&body=${encodeURIComponent(emailBody)}`;

            // Open email client
            window.location.href = mailtoLink;

            // Show confirmation
            alert('Thank you for your message! Your email client should open with the pre-filled message.');
        });
    }

    // Handle inline quote form
    const inlineQuoteBtn = document.querySelector('.quote-submit-btn');
    if (inlineQuoteBtn) {
        inlineQuoteBtn.addEventListener('click', function (e) {
            e.preventDefault();

            // Get inline form data
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

            // Validate required fields
            if (!data.name || !data.email || !data.service) {
                alert('Please fill in all required fields.');
                return;
            }

            // Create email body
            const emailBody = `
Quote Request from ${data.name}

Name: ${data.name}
Email: ${data.email}
Phone: ${data.phone || 'Not provided'}
Service: ${data.service}
            `.trim();

            // Create mailto link
            const mailtoLink = `mailto:info@lbmfinancialgroup.com?subject=Quote Request from ${data.name}&body=${encodeURIComponent(emailBody)}`;

            // Open email client
            window.location.href = mailtoLink;

            // Show confirmation
            alert('Thank you for your quote request! Your email client should open with the pre-filled message.');
        });
    }
});

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
    rootMargin: '50px 0px',
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

// Font loading optimization
if ('fonts' in document) {
    document.fonts.ready.then(() => {
        document.body.classList.add('fonts-loaded');
    });
}

// Initialize lazy loading and animations
document.addEventListener('DOMContentLoaded', function () {
    // Initialize lazy loading for images
    const lazyImages = document.querySelectorAll('.lazy-load');
    lazyImages.forEach(img => {
        lazyImageObserver.observe(img);
    });

    // Initialize animations
    const animateElements = document.querySelectorAll('.service-main, .service-card-container, .credential-item');
    animateElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        animationObserver.observe(el);
    });
});