document.addEventListener('DOMContentLoaded', () => {

    // --- Mobile Menu Toggle & Accessibility Enhancements ---
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    const header = document.querySelector('.main-header');

    // Navbar Scroll Effect
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    function closeMenu() {
        navLinks.classList.remove('active');
        hamburger.classList.remove('toggle');
        document.body.style.overflow = '';
        if (hamburger) hamburger.setAttribute('aria-expanded', 'false');
    }

    function openMenu() {
        navLinks.classList.add('active');
        hamburger.classList.add('toggle');
        document.body.style.overflow = 'hidden';
        if (hamburger) hamburger.setAttribute('aria-expanded', 'true');
    }

    if (hamburger && navLinks) {
        hamburger.setAttribute('role', 'button');
        if (!hamburger.hasAttribute('tabindex')) hamburger.setAttribute('tabindex', '0');
        hamburger.setAttribute('aria-controls', 'main-navigation');
        hamburger.setAttribute('aria-expanded', 'false');

        hamburger.addEventListener('click', () => {
            if (navLinks.classList.contains('active')) closeMenu(); else openMenu();
        });

        hamburger.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                hamburger.click();
            }
            if (e.key === 'Escape') closeMenu();
        });

        document.querySelectorAll('.nav-links a').forEach(a => {
            a.addEventListener('click', () => {
                closeMenu();
            });
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') closeMenu();
        });
    }

    // --- Active Link Highlighting ---
    const currentPage = window.location.pathname.split("/").pop() || 'index.html';
    document.querySelectorAll('.nav-links a').forEach(link => {
        if (link.getAttribute('href') === currentPage) {
            link.classList.add('active');
        }
    });

    // --- Intersection Observer for Scroll Animations ---
    const observerOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe sections and cards
    document.querySelectorAll('.section, .card, .hero-content, .gallery-item').forEach(el => {
        el.style.opacity = '0'; // Hide initially
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
        observer.observe(el);

        // Add class for the transition to take effect when class is added
        el.addEventListener('transitionend', () => {
            el.style.opacity = '';
            el.style.transform = '';
            el.style.transition = '';
        });
    });

    // Custom fade-in logic handling
    // We'll actually specificy the .fade-in class in CSS, but let's just use the observer to add the class
    // Redoing the observer logic to match the CSS animation approach simpler:

    const fadeObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animation = 'fadeInUp 0.8s ease-out forwards';
                fadeObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.section, .card, .gallery-item').forEach(el => {
        el.style.opacity = '0';
        fadeObserver.observe(el);
    });


    // --- Form Validation (Admission & Contact) ---
    const admissionForm = document.getElementById('admissionForm');
    if (admissionForm) {
        admissionForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const phone = document.getElementById('phone').value;
            const feedback = document.getElementById('formFeedback');

            if (!/^\d{10}$/.test(phone)) {
                feedback.innerHTML = '<p style="color:red; background: #fee; padding: 10px; border-radius: 6px;">Please enter a valid 10-digit phone number.</p>';
            } else {
                feedback.innerHTML = '<p style="color:green; background: #eef; padding: 10px; border-radius: 6px;">Thank you! Your inquiry has been sent.</p>';
                admissionForm.reset();
            }
        });
    }

    // --- Gallery Filter ---
    const filterBtns = document.querySelectorAll('.filter-btn');
    const galleryItems = document.querySelectorAll('.gallery-item');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filterValue = btn.getAttribute('data-filter');

            galleryItems.forEach(item => {
                if (filterValue === 'all' || item.classList.contains(filterValue)) {
                    item.style.display = 'block';
                    // Re-trigger animation
                    item.style.animation = 'none';
                    item.offsetHeight; /* trigger reflow */
                    item.style.animation = 'fadeInUp 0.5s ease-out forwards';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    });

    // --- Lightbox Feature ---
    // --- Lightbox Feature (Images & Videos) ---
    const lightbox = document.createElement('div');
    lightbox.id = 'lightbox';
    lightbox.className = 'lightbox';
    lightbox.innerHTML = `
        <span class="close-lightbox">&times;</span>
        <div id="lightbox-container" style="display: flex; justify-content: center; width: 100%;"></div>
    `;
    document.body.appendChild(lightbox);

    const lightboxContainer = document.getElementById('lightbox-container');
    const closeBtn = lightbox.querySelector('.close-lightbox');

    const openLightbox = (content) => {
        lightboxContainer.innerHTML = ''; // Clear previous
        lightboxContainer.appendChild(content);
        lightbox.style.display = 'flex';
        document.body.style.overflow = 'hidden'; // Prevent scrolling bg
    };

    const closeLightbox = () => {
        lightbox.style.display = 'none';
        lightboxContainer.innerHTML = ''; // Stop video playback
        document.body.style.overflow = '';
    };

    // Image triggers
    document.querySelectorAll('.gallery-item').forEach(item => {
        item.addEventListener('click', () => {
            const imgPath = item.querySelector('img').src;
            const img = document.createElement('img');
            img.src = imgPath;
            img.className = 'lightbox-content';
            openLightbox(img);
        });
    });

    // Video triggers
    document.querySelectorAll('.video-thumb').forEach(item => {
        item.addEventListener('click', () => {
            const videoSrc = item.getAttribute('data-video-src');
            if (videoSrc) {
                const video = document.createElement('video');
                video.className = 'lightbox-content';
                video.controls = true;
                video.autoplay = true;
                video.innerHTML = `<source src="${videoSrc}" type="video/mp4">Your browser does not support the video tag.`;
                openLightbox(video);
            }
        });
    });

    if (closeBtn) closeBtn.addEventListener('click', closeLightbox);

    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox || e.target === lightboxContainer) closeLightbox();
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && lightbox.style.display === 'flex') closeLightbox();
    });

    // Smooth Scrolling
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const target = this.getAttribute('href');
            if (target === '#' || !document.querySelector(target)) return;
            e.preventDefault();
            document.querySelector(target).scrollIntoView({ behavior: 'smooth' });
        });
    });

    // Contact form basic handler
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            let feedback = document.getElementById('contactFeedback');
            if (!feedback) {
                feedback = document.createElement('div');
                feedback.id = 'contactFeedback';
                contactForm.appendChild(feedback);
            }
            feedback.innerHTML = '<p style="color: green; background: #eef; padding: 10px; border-radius: 6px; margin-top: 15px;">Thank you — your message has been sent.</p>';
            contactForm.reset();
        });
    }
});





// --- Google Translate Integration ---

function googleTranslateElementInit() {
    new google.translate.TranslateElement({
        pageLanguage: 'en', // Default language of your site
        includedLanguages: 'en,mr,hi', // English, Marathi, Hindi
        layout: google.translate.TranslateElement.InlineLayout.SIMPLE,
        autoDisplay: false
    }, 'google_translate_element');
}

// Load the Google Translate Script
(function () {
    var googleScript = document.createElement('script');
    googleScript.type = 'text/javascript';
    googleScript.async = true;
    googleScript.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
    (document.getElementsByTagName('head')[0] || document.getElementsByTagName('body')[0]).appendChild(googleScript);
})();

// --- Custom Language Selector Logic ---
document.addEventListener('DOMContentLoaded', () => {
    const langBtn = document.querySelector('.lang-btn');
    const langDropdown = document.querySelector('.lang-dropdown');
    const langOptions = document.querySelectorAll('.lang-dropdown li');
    const currentLangSpan = document.querySelector('.lang-code');

    if (langBtn && langDropdown) {
        // Toggle Dropdown
        langBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            langDropdown.classList.toggle('show');
            langBtn.classList.toggle('active');
        });

        // Close when clicking outside
        document.addEventListener('click', (e) => {
            if (!langBtn.contains(e.target) && !langDropdown.contains(e.target)) {
                langDropdown.classList.remove('show');
                langBtn.classList.remove('active');
            }
        });

        // Handle Language Selection
        langOptions.forEach(option => {
            option.addEventListener('click', () => {
                const langCode = option.getAttribute('data-lang');
                if (langCode) {
                    setLanguage(langCode);
                }
            });
        });

        // Initialize UI based on existing cookie
        const currentCookie = getCookie('googtrans');
        if (currentCookie) {
            // Cookie format is usually /source/target, e.g., /en/mr
            // But sometimes simple language code.
            const parts = currentCookie.split('/');
            const langCode = parts[parts.length - 1]; // Get last part
            updateLangUI(langCode);
        } else {
            updateLangUI('en');
        }
    }

    function setLanguage(lang) {
        // Google Translate uses the cookie 'googtrans' to track the language
        // Format: /source/target
        // We assume source is 'en'
        const newCookieValue = `/en/${lang}`;

        // Set cookie for current path and root
        document.cookie = `googtrans=${newCookieValue}; path=/`;
        document.cookie = `googtrans=${newCookieValue}; path=/; domain=${window.location.hostname}`;

        // Reload to trigger translation
        window.location.reload();
    }

    function getCookie(name) {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
        return null;
    }

    function updateLangUI(lang) {
        const langMap = {
            'en': 'EN',
            'mr': 'MR',
            'hi': 'HI'
        };
        const label = langMap[lang] || 'EN';

        if (currentLangSpan) currentLangSpan.textContent = label;

        // Highlight active option
        if (langOptions) {
            langOptions.forEach(opt => {
                const optLang = opt.getAttribute('data-lang');
                if (optLang === lang) {
                    opt.style.background = 'rgba(26, 77, 46, 0.1)';
                    opt.style.fontWeight = 'bold';
                    opt.style.color = 'var(--primary-color)';
                } else {
                    opt.style.background = '';
                    opt.style.fontWeight = '';
                    opt.style.color = '';
                }
            });
        }
    }
});




// --- Google Sheets Connection ---
const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzf1LwYx_izBToOptYo1MzhP-h8qF8qJTw-Jz-IyA-Ko2OrdC5V1enm6s0j3_p2raza/exec';

// 1. Handle Admission Form
const admissionForm = document.getElementById('admissionForm');
if (admissionForm) {
    admissionForm.addEventListener('submit', e => {
        e.preventDefault();
        const feedback = document.getElementById('formFeedback');
        feedback.innerHTML = 'Sending data...';

        // Prepare Data
        const data = {
            formType: 'admission',
            'Parent Name': document.getElementById('parentName').value,
            'Email': document.getElementById('email').value,
            'Phone': document.getElementById('phone').value,
            'Grade/Class': document.getElementById('grade').value
        };

        fetch(SCRIPT_URL, {
            method: 'POST',
            body: JSON.stringify(data),
            mode: 'no-cors' // Important for Google Apps Script
        })
            .then(() => {
                feedback.innerHTML = '<span style="color:green">Application submitted successfully!</span>';
                admissionForm.reset();
            })
            .catch(error => {
                feedback.innerHTML = '<span style="color:red">Error! Please try again.</span>';
                console.error('Error!', error.message);
            });
    });
}

// 2. Handle Contact Form
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', e => {
        e.preventDefault();
        const feedback = document.getElementById('contactFeedback');
        feedback.innerHTML = 'Sending message...';

        // Prepare Data
        const data = {
            formType: 'contact',
            'Name': document.getElementById('contactName').value,
            'Email': document.getElementById('contactEmail').value,
            'Message': document.getElementById('contactMessage').value
        };

        fetch(SCRIPT_URL, {
            method: 'POST',
            body: JSON.stringify(data),
            mode: 'no-cors'
        })
            .then(() => {
                feedback.innerHTML = '<span style="color:green">Message sent successfully!</span>';
                contactForm.reset();
            })
            .catch(error => {
                feedback.innerHTML = '<span style="color:red">Error sending message.</span>';
                console.error('Error!', error.message);
            });
    });
}