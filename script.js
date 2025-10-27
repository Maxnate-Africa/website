// ===========================
// MOBILE NAVIGATION TOGGLE
// ===========================
document.addEventListener('DOMContentLoaded', function() {
    const mobileToggle = document.querySelector('.mobile-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (mobileToggle) {
        mobileToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
        });
    }
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.navbar')) {
            navMenu.classList.remove('active');
        }
    });
});

// ===========================
// SMOOTH SCROLLING FOR ANCHOR LINKS
// ===========================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        
        // Skip if it's just "#" or a dropdown toggle
        if (href === '#' || this.classList.contains('dropdown-toggle')) {
            return;
        }
        
        e.preventDefault();
        const target = document.querySelector(href);
        
        if (target) {
            const navHeight = document.querySelector('.navbar').offsetHeight;
            const targetPosition = target.offsetTop - navHeight;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
            
            // Close mobile menu if open
            document.querySelector('.nav-menu').classList.remove('active');
        }
    });
});

// ===========================
// TESTIMONIAL CAROUSEL
// ===========================
class TestimonialCarousel {
    constructor() {
        this.currentSlide = 0;
        this.slides = document.querySelectorAll('.testimonial-card');
        this.indicators = document.querySelectorAll('.indicator');
        this.prevBtn = document.querySelector('.carousel-control.prev');
        this.nextBtn = document.querySelector('.carousel-control.next');
        
        if (this.slides.length > 0) {
            this.init();
        }
    }
    
    init() {
        // Button event listeners
        if (this.prevBtn) {
            this.prevBtn.addEventListener('click', () => this.prevSlide());
        }
        
        if (this.nextBtn) {
            this.nextBtn.addEventListener('click', () => this.nextSlide());
        }
        
        // Indicator event listeners
        this.indicators.forEach((indicator, index) => {
            indicator.addEventListener('click', () => this.goToSlide(index));
        });
        
        // Auto-advance carousel every 5 seconds
        this.startAutoPlay();
    }
    
    showSlide(index) {
        // Hide all slides
        this.slides.forEach(slide => {
            slide.classList.remove('active');
        });
        
        // Remove active class from all indicators
        this.indicators.forEach(indicator => {
            indicator.classList.remove('active');
        });
        
        // Show current slide
        this.slides[index].classList.add('active');
        this.indicators[index].classList.add('active');
        
        this.currentSlide = index;
    }
    
    nextSlide() {
        let next = this.currentSlide + 1;
        if (next >= this.slides.length) {
            next = 0;
        }
        this.showSlide(next);
        this.resetAutoPlay();
    }
    
    prevSlide() {
        let prev = this.currentSlide - 1;
        if (prev < 0) {
            prev = this.slides.length - 1;
        }
        this.showSlide(prev);
        this.resetAutoPlay();
    }
    
    goToSlide(index) {
        this.showSlide(index);
        this.resetAutoPlay();
    }
    
    startAutoPlay() {
        this.autoPlayInterval = setInterval(() => {
            this.nextSlide();
        }, 5000);
    }
    
    resetAutoPlay() {
        clearInterval(this.autoPlayInterval);
        this.startAutoPlay();
    }
}

// Initialize carousel when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    new TestimonialCarousel();
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
    const animatedElements = document.querySelectorAll('.slide-in-left, .slide-in-right, .slide-in-up, .fade-in');
    animatedElements.forEach(el => observer.observe(el));
});

// ===========================
// NAVBAR SCROLL EFFECT
// ===========================
let lastScroll = 0;
const navbar = document.querySelector('.navbar');

window.addEventListener('scroll', function() {
    const currentScroll = window.pageYOffset;
    
    // Add shadow when scrolled
    if (currentScroll > 50) {
        navbar.style.boxShadow = '0 4px 20px rgba(0,0,0,0.15)';
    } else {
        navbar.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
    }
    
    lastScroll = currentScroll;
});

// ===========================
// FORM VALIDATION & SUBMISSION
// ===========================
document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.querySelector('.contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(contactForm);
            const data = {};
            formData.forEach((value, key) => {
                data[key] = value;
            });
            
            // Basic validation
            if (!data.name || !data.email || !data.subject || !data.message) {
                alert('Please fill in all required fields.');
                return;
            }
            
            // Email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(data.email)) {
                alert('Please enter a valid email address.');
                return;
            }
            
            // TODO: Replace with actual form submission logic
            // Options:
            // 1. Formspree: action="https://formspree.io/f/YOUR_FORM_ID"
            // 2. EmailJS: Use EmailJS SDK
            // 3. Backend API: fetch('/api/contact', { method: 'POST', body: JSON.stringify(data) })
            
            console.log('Form data:', data);
            alert('Thank you for your message! We will get back to you soon.');
            contactForm.reset();
            
            // Example EmailJS integration (commented out):
            /*
            emailjs.send('YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', data)
                .then(function(response) {
                    alert('Message sent successfully!');
                    contactForm.reset();
                }, function(error) {
                    alert('Failed to send message. Please try again.');
                });
            */
        });
    }
});

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
// HERO CAROUSEL NAVIGATION
// ===========================
document.addEventListener('DOMContentLoaded', function() {
    const prevButton = document.querySelector('.hero-carousel .carousel-button.prev');
    const nextButton = document.querySelector('.hero-carousel .carousel-button.next');
    const carouselImages = document.querySelector('.hero-carousel .carousel-images');
    const slides = document.querySelectorAll('.hero-carousel .hero-image');
    let currentIndex = 0;
    const totalSlides = slides.length;

    function showSlide(index) {
        const width = slides[0].clientWidth;
        carouselImages.style.transform = `translateX(${-width * index}px)`;
        currentIndex = index;
    }

    if (prevButton && nextButton && carouselImages) {
        prevButton.addEventListener('click', function() {
            const newIndex = (currentIndex === 0) ? totalSlides - 1 : currentIndex - 1;
            showSlide(newIndex);
        });

        nextButton.addEventListener('click', function() {
            const newIndex = (currentIndex === totalSlides - 1) ? 0 : currentIndex + 1;
            showSlide(newIndex);
        });

        // Optional: auto-play every 5 seconds
        setInterval(() => {
            const newIndex = (currentIndex === totalSlides - 1) ? 0 : currentIndex + 1;
            showSlide(newIndex);
        }, 5000);
    }
});
