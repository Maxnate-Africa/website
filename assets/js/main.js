// ===========================
// MAXNATE - MAIN JAVASCRIPT
// Professional Software Development & Web Services
// ===========================

'use strict';

// ===========================
// MOBILE NAVIGATION
// ===========================
document.addEventListener('DOMContentLoaded', function() {
    const mobileToggle = document.querySelector('.mobile-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (mobileToggle && navMenu) {
        mobileToggle.addEventListener('click', function(e) {
            e.stopPropagation();
            navMenu.classList.toggle('active');
            mobileToggle.classList.toggle('active');
        });
        
        // Close mobile menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!e.target.closest('.navbar')) {
                navMenu.classList.remove('active');
                mobileToggle.classList.remove('active');
            }
        });
        
        // Close menu when clicking on a link
        const navLinks = navMenu.querySelectorAll('a');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                navMenu.classList.remove('active');
                mobileToggle.classList.remove('active');
            });
        });
    }
});

// ===========================
// SMOOTH SCROLLING
// ===========================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        
        // Skip if it's just "#"
        if (href === '#') {
            e.preventDefault();
            return;
        }
        
        const target = document.querySelector(href);
        
        if (target) {
            e.preventDefault();
            const navHeight = document.querySelector('.navbar')?.offsetHeight || 0;
            const targetPosition = target.offsetTop - navHeight;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// ===========================
// NAVBAR SCROLL EFFECT
// ===========================
let lastScroll = 0;
const navbar = document.querySelector('.navbar');

window.addEventListener('scroll', function() {
    const currentScroll = window.pageYOffset;
    
    if (navbar) {
        if (currentScroll > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }
    
    lastScroll = currentScroll;
});

// ===========================
// HERO CAROUSEL
// ===========================
class HeroCarousel {
    constructor() {
        this.currentIndex = 0;
        this.prevButton = document.querySelector('.hero-carousel .carousel-button.prev');
        this.nextButton = document.querySelector('.hero-carousel .carousel-button.next');
        this.carouselImages = document.querySelector('.hero-carousel .carousel-images');
        this.slides = document.querySelectorAll('.hero-carousel .hero-image');
        this.totalSlides = this.slides.length;
        this.autoPlayInterval = null;
        
        if (this.slides.length > 0) {
            this.init();
        }
    }
    
    init() {
        if (this.prevButton) {
            this.prevButton.addEventListener('click', () => this.prevSlide());
        }
        
        if (this.nextButton) {
            this.nextButton.addEventListener('click', () => this.nextSlide());
        }
        
        // Auto-advance every 5 seconds
        this.startAutoPlay();
        
        // Pause on hover
        if (this.carouselImages) {
            this.carouselImages.addEventListener('mouseenter', () => this.stopAutoPlay());
            this.carouselImages.addEventListener('mouseleave', () => this.startAutoPlay());
        }
    }
    
    showSlide(index) {
        const width = this.slides[0].clientWidth;
        if (this.carouselImages) {
            this.carouselImages.style.transform = `translateX(${-width * index}px)`;
        }
        this.currentIndex = index;
    }
    
    nextSlide() {
        const newIndex = (this.currentIndex === this.totalSlides - 1) ? 0 : this.currentIndex + 1;
        this.showSlide(newIndex);
    }
    
    prevSlide() {
        const newIndex = (this.currentIndex === 0) ? this.totalSlides - 1 : this.currentIndex - 1;
        this.showSlide(newIndex);
    }
    
    startAutoPlay() {
        this.autoPlayInterval = setInterval(() => {
            this.nextSlide();
        }, 5000);
    }
    
    stopAutoPlay() {
        if (this.autoPlayInterval) {
            clearInterval(this.autoPlayInterval);
        }
    }
}

// Initialize hero carousel
document.addEventListener('DOMContentLoaded', function() {
    new HeroCarousel();
});

// ===========================
// SCROLL ANIMATIONS
// ===========================
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate');
        }
    });
}, observerOptions);

// Observe elements with animation classes
document.addEventListener('DOMContentLoaded', function() {
    const animatedElements = document.querySelectorAll(
        '.slide-in-left, .slide-in-right, .slide-in-up, .fade-in, .service-card, .vmv-card, .news-card, .project-card'
    );
    animatedElements.forEach(el => observer.observe(el));
});

// ===========================
// FORM HANDLING
// ===========================
document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contactForm');
    const submitBtn = document.getElementById('submitBtn');
    const formStatus = document.getElementById('form-status');

    if (contactForm && submitBtn && formStatus) {
        // Real-time validation
        const inputs = contactForm.querySelectorAll('input, textarea, select');
        inputs.forEach(input => {
            input.addEventListener('blur', function() {
                validateField(this);
            });

            input.addEventListener('input', function() {
                if (this.classList.contains('error')) {
                    validateField(this);
                }
            });
        });

        contactForm.addEventListener('submit', function(e) {
            e.preventDefault(); // Prevent default form submission

            // Clear previous status
            clearFormStatus();

            // Validate all fields
            let isValid = true;
            inputs.forEach(input => {
                if (!validateField(input)) {
                    isValid = false;
                }
            });

            if (!isValid) {
                showFormStatus('Please correct the errors above.', 'error');
                return;
            }

            // Show loading state
            setLoadingState(true);

            // Collect form data
            const formData = new FormData(contactForm);
            const data = Object.fromEntries(formData.entries());

            // Create WhatsApp message
            const whatsappMessage = createWhatsAppMessage(data);

            // Encode message for URL
            const encodedMessage = encodeURIComponent(whatsappMessage);

            // WhatsApp URL (using the phone number from footer: +255 746 662 612)
            const whatsappURL = `https://wa.me/255746662612?text=${encodedMessage}`;

            // Open WhatsApp in new tab/window
            const whatsappWindow = window.open(whatsappURL, '_blank');

            // Check if popup was blocked
            if (!whatsappWindow) {
                showFormStatus('Please allow popups for this website to send your message via WhatsApp.', 'error');
                setLoadingState(false);
                return;
            }

            // Show success message
            showFormStatus('WhatsApp opened with your message! Our team will respond shortly.', 'success');
            
            // Reset form after successful submission
            contactForm.reset();
            setLoadingState(false);

            // Track successful submission (optional)
            if (typeof gtag !== 'undefined') {
                gtag('event', 'whatsapp_inquiry', {
                    'event_category': 'engagement',
                    'event_label': 'contact_form'
                });
            }
        });

    // Function to create WhatsApp message
    function createWhatsAppMessage(data) {
        return `*New Project Inquiry from Maxnate Website*

👤 *Name:* ${data.name}
📧 *Email:* ${data.email}
${data.phone ? `📞 *Phone:* ${data.phone}\n` : ''}🎯 *Service:* ${data.service || 'Not specified'}

💬 *Project Details:*
${data.message}

---
*Sent from Maxnate Africa website contact form*
*Date:* ${new Date().toLocaleString()}`;
    }
    }

    // Validation functions
    function validateField(field) {
        const value = field.value.trim();
        const fieldName = field.name;
        const errorElement = document.getElementById(`${field.id}-error`);

        if (!errorElement) return true;

        // Clear previous error
        field.classList.remove('error');
        errorElement.textContent = '';

        // Required field validation
        if (field.hasAttribute('required') && !value) {
            showFieldError(field, errorElement, `${field.labels[0].textContent.replace('*', '').trim()} is required.`);
            return false;
        }

        // Email validation
        if (field.type === 'email' && value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                showFieldError(field, errorElement, 'Please enter a valid email address.');
                return false;
            }
        }

        // Phone validation (optional)
        if (field.type === 'tel' && value) {
            const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
            if (!phoneRegex.test(value.replace(/[\s\-\(\)]/g, ''))) {
                showFieldError(field, errorElement, 'Please enter a valid phone number.');
                return false;
            }
        }

        // Message length validation
        if (field.tagName === 'TEXTAREA' && value && value.length < 10) {
            showFieldError(field, errorElement, 'Please provide more details about your project (at least 10 characters).');
            return false;
        }

        return true;
    }

    function showFieldError(field, errorElement, message) {
        field.classList.add('error');
        errorElement.textContent = message;
    }

    function showFormStatus(message, type) {
        formStatus.textContent = message;
        formStatus.className = `form-status ${type}`;
        formStatus.style.display = 'block';

        // Auto-hide success messages after 5 seconds
        if (type === 'success') {
            setTimeout(() => {
                clearFormStatus();
            }, 5000);
        }
    }

    function clearFormStatus() {
        formStatus.textContent = '';
        formStatus.className = 'form-status';
        formStatus.style.display = 'none';
    }

    function setLoadingState(loading) {
        const btnText = submitBtn.querySelector('.btn-text');
        const btnSpinner = submitBtn.querySelector('.btn-spinner');

        if (loading) {
            submitBtn.disabled = true;
            btnText.style.display = 'none';
            btnSpinner.style.display = 'inline-block';
        } else {
            submitBtn.disabled = false;
            btnText.style.display = 'inline';
            btnSpinner.style.display = 'none';
        }
    }
});

// ===========================
// SHOW MORE NEWS TOGGLE
// ===========================
document.addEventListener('DOMContentLoaded', function() {
    const showMoreBtn = document.getElementById('showMoreNews');
    if (!showMoreBtn) return;

    showMoreBtn.addEventListener('click', function() {
        const hiddenCards = document.querySelectorAll('.news-card.hidden');
        const expanded = this.getAttribute('aria-expanded') === 'true';
        if (!expanded) {
            hiddenCards.forEach(c => c.classList.remove('hidden'));
            this.innerHTML = '<i class="fas fa-minus"></i> Show Less';
            this.setAttribute('aria-expanded', 'true');
        } else {
            // Recompute all news beyond first three and hide them
            const allCards = Array.from(document.querySelectorAll('.news-card'));
            allCards.forEach((card, idx) => { if (idx >= 3) card.classList.add('hidden'); });
            this.innerHTML = '<i class="fas fa-plus"></i> Show More';
            this.setAttribute('aria-expanded', 'false');
            const newsSection = document.getElementById('news');
            if (newsSection) newsSection.scrollIntoView({ behavior: 'smooth' });
        }
    });
});

// ===========================
// DYNAMIC CONTENT (APPWRITE) - PROJECTS & NEWS
// ===========================
// SKELETON LOADERS
// ===========================
function createProjectSkeleton() {
    return `
    <div class="skeleton-project-card">
      <div class="skeleton-project-image"></div>
      <div class="skeleton-content">
        <div class="skeleton skeleton-title"></div>
        <div class="skeleton skeleton-text"></div>
        <div class="skeleton skeleton-text"></div>
        <div class="skeleton-tags">
          <div class="skeleton skeleton-tag"></div>
          <div class="skeleton skeleton-tag"></div>
        </div>
      </div>
    </div>`;
}

function createNewsSkeleton() {
    return `
    <div class="skeleton-news-card">
      <div class="skeleton-news-image" style="position: relative;">
        <div class="skeleton skeleton-badge"></div>
      </div>
      <div class="skeleton-content">
        <div class="skeleton skeleton-text" style="width: 50%; height: 14px; margin-bottom: 12px;"></div>
        <div class="skeleton skeleton-title"></div>
        <div class="skeleton skeleton-text"></div>
        <div class="skeleton skeleton-text"></div>
      </div>
    </div>`;
}

// ===========================
// DYNAMIC CONTENT WITH SKELETONS
// ===========================
document.addEventListener('DOMContentLoaded', async function() {
    try {
        if (!window.AppwriteFetch || !window.AppwriteFetch.init()) return; // Not configured: keep static content

        // Render Projects
        const projectsGrid = document.querySelector('#projects .projects-grid');
        if (projectsGrid) {
            // Show skeleton loaders
            projectsGrid.innerHTML = Array(3).fill(0).map(() => createProjectSkeleton()).join('');
            
            const projects = await window.AppwriteFetch.getProjects(6);
            if (projects && projects.length) {
                projectsGrid.innerHTML = projects.map(p => {
                    const imgStyle = p.image ? `style=\"background-image:url('${p.image}')\"` : '';
                    const tags = [p.category||'', p.client?`🤝 ${p.client}`:'', p.year?`📅 ${p.year}`:'']
                                  .filter(Boolean)
                                  .map(t => `<span class=\"tag\">${t}</span>`)
                                  .join('');
                    const link = p.projectUrl ? `<span class=\"tag\"><a href=\"${p.projectUrl}\" target=\"_blank\">🔗 View</a></span>` : '';
                    return `
                    <article class=\"project-card\">
                      <div class=\"project-image\" ${imgStyle}></div>
                      <div class=\"project-content\">
                        <h3>${p.title}</h3>
                        <p>${p.description || ''}</p>
                        <div class=\"project-tags\">${tags}${link}</div>
                      </div>
                    </article>`;
                }).join('');
                // Observe new items for animations
                document.querySelectorAll('#projects .project-card').forEach(el => { try { observer.observe(el); } catch {} });
            }
        }

        // Render News
        const newsGrid = document.querySelector('#news .news-grid');
        if (newsGrid) {
            // Show skeleton loaders
            newsGrid.innerHTML = Array(3).fill(0).map(() => createNewsSkeleton()).join('');
            
            const news = await window.AppwriteFetch.getNews(6);
            if (news && news.length) {
                newsGrid.innerHTML = news.map((n, idx) => {
                    const dateTxt = n.date ? new Date(n.date).toLocaleDateString() : '';
                    const hiddenClass = idx >= 3 ? ' hidden' : '';
                    return `
                    <article class=\"news-card${hiddenClass}\">
                      <div class=\"news-image\">
                        <img src=\"${n.image || 'assets/images/news/placeholder.jpg'}\" alt=\"${n.title}\" loading=\"lazy\">
                        <div class=\"news-badge\">${n.badge || 'News'}</div>
                      </div>
                      <div class=\"news-content\">
                        <div class=\"news-meta\">
                          <span class=\"news-date\"><i class=\"far fa-calendar\"></i> ${dateTxt}</span>
                          <span class=\"news-category\">${n.category || ''}</span>
                        </div>
                        <h3>${n.title}</h3>
                        <p>${n.description || ''}</p>
                        <a href=\"#contact\" class=\"news-link\">${n.linkText || 'Learn More →'}\u00A0</a>
                      </div>
                    </article>`;
                }).join('');
                document.querySelectorAll('#news .news-card').forEach(el => { try { observer.observe(el); } catch {} });
                // Reset Show More button state
                const showMoreBtn = document.getElementById('showMoreNews');
                if (showMoreBtn) { showMoreBtn.setAttribute('aria-expanded','false'); showMoreBtn.innerHTML = '<i class="fas fa-plus"></i> Show More'; }
            }
        }
    } catch (e) {
        console.warn('Dynamic content load skipped', e);
    }
});

// ===========================
// LAZY LOADING IMAGES
// ===========================
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.classList.add('loaded');
                    observer.unobserve(img);
                }
            }
        });
    });
    
    document.addEventListener('DOMContentLoaded', function() {
        const lazyImages = document.querySelectorAll('img[data-src]');
        lazyImages.forEach(img => imageObserver.observe(img));
    });
}

// ===========================
// UTILITY FUNCTIONS
// ===========================

// Debounce function for scroll events
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

// Check if element is in viewport
function isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

// ===========================
// PERFORMANCE MONITORING
// ===========================
if ('PerformanceObserver' in window) {
    try {
        const perfObserver = new PerformanceObserver((list) => {
            for (const entry of list.getEntries()) {
                // Log performance metrics (optional)
                if (entry.entryType === 'navigation') {
                    console.log('Page load time:', entry.loadEventEnd - entry.fetchStart, 'ms');
                }
            }
        });
        perfObserver.observe({ entryTypes: ['navigation', 'paint'] });
    } catch (e) {
        console.warn('Performance observer not supported');
    }
}

// ===========================
// ACCESSIBILITY ENHANCEMENTS
// ===========================
document.addEventListener('DOMContentLoaded', function() {
    // Add keyboard navigation for carousels
    document.addEventListener('keydown', function(e) {
        if (e.key === 'ArrowLeft') {
            const prevBtn = document.querySelector('.carousel-control.prev:hover') ||
                           document.querySelector('.carousel-button.prev:hover');
            if (prevBtn) prevBtn.click();
        } else if (e.key === 'ArrowRight') {
            const nextBtn = document.querySelector('.carousel-control.next:hover') ||
                           document.querySelector('.carousel-button.next:hover');
            if (nextBtn) nextBtn.click();
        }
    });
    
    // Add focus management
    const focusableElements = document.querySelectorAll(
        'a[href], button, input, textarea, select, [tabindex]:not([tabindex="-1"])'
    );
    
    focusableElements.forEach(el => {
        el.addEventListener('focus', function() {
            this.classList.add('focused');
        });
        
        el.addEventListener('blur', function() {
            this.classList.remove('focused');
        });
    });
});

// ===========================
// CONSOLE BRANDING
// ===========================
console.log(
    '%c🚀 Maxnate - Software Development & Web Services',
    'font-size: 16px; font-weight: bold; color: #008080;'
);
console.log(
    '%cBuilding Excellence Across Africa 🌍',
    'font-size: 12px; color: #1c1c1d;'
);
console.log(
    '%cWebsite: https://maxnate.com | Email: info@maxnate.com',
    'font-size: 10px; color: #666;'
);
