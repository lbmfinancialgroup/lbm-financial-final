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

// Intersection Observer for animations (optional enhancement)
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe elements for animation
document.addEventListener('DOMContentLoaded', function () {
    const animateElements = document.querySelectorAll('.service-main, .service-card, .credential-item');
    animateElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
});