/* ---
   script.js for Meemah's Petal Palace
   --- */

document.addEventListener('DOMContentLoaded', function() {

    const sidebar = document.getElementById('sidebar');
    const main = document.getElementById('main');
    const navLinks = document.querySelectorAll('.nav-link');
    const panels = {
        intro: document.getElementById('intro'),
        content: document.getElementById('content-wrapper')
    };
    const mobileToggle = document.querySelector('.toggle');
    
    // --- 1. Panel Navigation ---
    function handleNavigation(e) {
        e.preventDefault();
        const link = e.currentTarget;
        const targetId = link.getAttribute('href'); // e.g., "#about"
        const targetPanel = (targetId === '#intro') ? 'intro' : 'content';

        // 1a. Update Panel Visibility
        if (targetPanel === 'intro') {
            panels.intro.classList.add('active');
            panels.content.classList.remove('active');
        } else {
            panels.intro.classList.remove('active');
            panels.content.classList.add('active');
            
            // 1b. Scroll to section within content panel
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const container = panels.content;
                const containerTop = container.offsetTop;
                const elementTop = targetElement.offsetTop;
                
                container.scrollTo({
                    top: elementTop - containerTop, // Scroll to element relative to container
                    behavior: 'smooth'
                });
            }
        }

        // 1c. Update Active Link
        navLinks.forEach(nav => nav.classList.remove('active'));
        // Find all links pointing to this ID (for 'Book Now' button)
        document.querySelectorAll(`.nav-link[href="${targetId}"]`).forEach(l => l.classList.add('active'));

        // 1d. Close mobile menu on click
        if (window.innerWidth <= 768) {
            sidebar.classList.remove('visible');
        }
    }

    navLinks.forEach(link => {
        link.addEventListener('click', handleNavigation);
    });

    // --- 2. Mobile Menu Toggle ---
    mobileToggle.addEventListener('click', function(e) {
        e.preventDefault();
        sidebar.classList.toggle('visible');
    });

    // Close mobile menu if clicking outside of it
    main.addEventListener('click', function() {
        if (sidebar.classList.contains('visible')) {
            sidebar.classList.remove('visible');
        }
    });

    // --- 3. Scroll Fade-In Animations (Intersection Observer) ---
    const fadeElements = document.querySelectorAll('.fade-in');
    
    if ("IntersectionObserver" in window) {
        const observerOptions = {
            root: panels.content, // Observe scrolling within the #content-wrapper
            rootMargin: '0px',
            threshold: 0.15 // 15% of the item must be visible
        };

        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    // Optional: stop observing once it's visible
                    // observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        fadeElements.forEach(el => {
            observer.observe(el);
        });
    } else {
        // Fallback for older browsers
        fadeElements.forEach(el => el.classList.add('visible'));
    }

    // --- 4. Gallery Lightbox ---
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxCaption = document.getElementById('lightbox-caption');
    const galleryItems = document.querySelectorAll('.gallery-item');
    const closeBtn = document.querySelector('.close-lightbox');

    galleryItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            lightboxImg.src = this.href;
            lightboxCaption.textContent = this.dataset.caption || '';
            lightbox.style.display = 'block';
        });
    });

    function closeLightbox() {
        lightbox.style.display = 'none';
    }

    // Close on 'x' button
    closeBtn.addEventListener('click', closeLightbox);
    
    // Close on clicking outside the image
    lightbox.addEventListener('click', function(e) {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });

});