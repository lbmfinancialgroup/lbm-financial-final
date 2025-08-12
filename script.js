document.addEventListener("DOMContentLoaded", function () {
    const navMenu = document.getElementById("nav-menu");
    const hamburger = document.getElementById("hamburger");
    const navLinks = document.querySelectorAll(".nav-link");

    // Toggle mobile menu
    hamburger.addEventListener("click", (e) => {
        e.stopPropagation();
        navMenu.classList.toggle("active");
        hamburger.classList.toggle("active");
        const isExpanded = navMenu.classList.contains("active");
        hamburger.setAttribute("aria-expanded", isExpanded);
    });

    // Close menu when a link is clicked
    navLinks.forEach(link => {
        link.addEventListener("click", () => {
            if (navMenu.classList.contains("active")) {
                navMenu.classList.remove("active");
                hamburger.classList.remove("active");
                hamburger.setAttribute("aria-expanded", "false");
            }
        });
    });

    // Close menu when clicking outside
    document.addEventListener("click", (e) => {
        if (navMenu.classList.contains("active") && !navMenu.contains(e.target) && !hamburger.contains(e.target)) {
            navMenu.classList.remove("active");
            hamburger.classList.remove("active");
            hamburger.setAttribute("aria-expanded", "false");
        }
    });

    // Lazy loading images
    const lazyImages = document.querySelectorAll(".lazy-load");
    const lazyLoadObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove("lazy-load");
                observer.unobserve(img);
            }
        });
    });
    lazyImages.forEach(img => lazyLoadObserver.observe(img));

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener("click", function (e) {
            e.preventDefault();
            const targetId = this.getAttribute("href");
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({ behavior: "smooth" });
            }
        });
    });
});

// Function to scroll to a specific section
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView({ behavior: "smooth" });
    }
}

// Functions for quote modal
function showQuoteForm(service = "") {
    const modal = document.getElementById("quote-modal");
    const serviceSelect = document.getElementById("service-select");
    if (service) {
        serviceSelect.value = service;
    }
    modal.style.display = "block";
}

function closeQuoteForm() {
    const modal = document.getElementById("quote-modal");
    modal.style.display = "none";
}

window.onclick = function (event) {
    const modal = document.getElementById("quote-modal");
    if (event.target == modal) {
        modal.style.display = "none";
    }
}

// Function to flip service cards
function flipCard(card) {
    card.classList.toggle("flipped");
}

// Function to flip nonprofit cards
function flipNonprofitCard(card) {
    card.classList.toggle("flipped");
}

const contactForm = document.getElementById('contact-form');
const contactResult = document.getElementById('contact-result');
const quoteForm = document.getElementById('quote-form');
const quoteResult = document.getElementById('quote-result');
const successModal = document.getElementById('success-modal');
const successModalClose = document.getElementById('success-modal-close');

const handleFormSubmit = (form, result) => {
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        const formData = new FormData(form);
        const object = Object.fromEntries(formData);
        const json = JSON.stringify(object);
        result.innerHTML = "Please wait...";
        result.style.display = "block";

        fetch('https://api.web3forms.com/submit', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: json
        })
        .then(async (response) => {
            let jsonResponse = await response.json();
            if (response.status == 200) {
                result.innerHTML = "";
                result.style.display = "none";
                form.reset();
                if (form.id === 'quote-form') {
                    closeQuoteForm();
                }
                successModal.style.display = 'block';
            } else {
                console.log(response);
                result.innerHTML = jsonResponse.message;
                setTimeout(() => {
                    result.style.display = "none";
                }, 4000);
            }
        })
        .catch(error => {
            console.log(error);
            result.innerHTML = "Something went wrong!";
            setTimeout(() => {
                result.style.display = "none";
            }, 4000);
        });
    });
};

handleFormSubmit(contactForm, contactResult);
handleFormSubmit(quoteForm, quoteResult);

successModalClose.addEventListener('click', () => {
    successModal.style.display = 'none';
});

window.addEventListener('click', (e) => {
    if (e.target == successModal) {
        successModal.style.display = 'none';
    }
});
