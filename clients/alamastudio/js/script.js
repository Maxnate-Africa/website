/*
 * Alama Studios - script.js
 * This file handles all client-side interactivity.
 * 1. Mobile Navigation (Hamburger Menu)
 * 2. Sticky Header on Scroll
 * 3. Scroll Reveal Animations (Intersection Observer)
 * 4. Portfolio Lightbox
 * 5. Footer: Current Year
 * 6. Smooth Scroll for Nav Links
 */

document.addEventListener('DOMContentLoaded', () => {

    /**
     * 1. Mobile Navigation (Hamburger Menu)
     */
    const burger = document.querySelector('.burger');
    const navLinks = document.querySelector('.nav-links');
    const navLinksList = document.querySelectorAll('.nav-links li');

    const toggleNav = () => {
        // Toggle Nav
        navLinks.classList.toggle('nav-active');

        // Burger Animation
        burger.classList.toggle('toggle');
    };

    burger.addEventListener('click', toggleNav);

    // Close nav when a link is clicked
    navLinksList.forEach(link => {
        link.addEventListener('click', () => {
            if (navLinks.classList.contains('nav-active')) {
                toggleNav();
            }
        });
    });

    /**
     * 2. Sticky Header on Scroll
     */
    const header = document.getElementById('main-header');
    const scrollThreshold = 50; // Pixels to scroll before header becomes 'scrolled'

    const stickyHeader = () => {
        if (window.scrollY > scrollThreshold) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    };

    window.addEventListener('scroll', stickyHeader);

    /**
     * 3. Scroll Reveal Animations (Intersection Observer)
     * This is a modern, performant way to detect when an element enters the viewport.
     */
    const revealElements = document.querySelectorAll('.reveal');

    const revealOptions = {
        root: null, // observes intersections relative to the viewport
        threshold: 0.15, // 15% of the element must be visible to trigger
        rootMargin: "0px"
    };

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target); // Stop observing once it's visible
            }
        });
    }, revealOptions);

    revealElements.forEach(el => {
        revealObserver.observe(el);
    });

    /**
     * 4. Portfolio Lightbox
     */
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxTriggers = document.querySelectorAll('.lightbox-trigger');
    const lightboxClose = document.querySelector('.lightbox-close');

    // Open Lightbox
    lightboxTriggers.forEach(trigger => {
        trigger.addEventListener('click', (e) => {
            e.preventDefault();
            lightboxImg.src = trigger.src;
            lightbox.classList.add('active');
        });
    });

    // Close Lightbox
    const closeLightbox = () => {
        lightbox.classList.remove('active');
        // Reset src after transition to prevent ugly flash on next open
        setTimeout(() => {
            lightboxImg.src = '';
        }, 300); // Must match CSS transition duration
    };

    lightboxClose.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', (e) => {
        // Close only if clicking on the background, not the image itself
        if (e.target === lightbox) {
            closeLightbox();
        }
    });

    /**
     * 5. Footer: Current Year
     */
    const yearSpan = document.getElementById('current-year');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }

    /**
     * 6. Smooth Scroll for Nav Links (Anchor Links)
     */
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();

            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

/**
     * 7. Services Accordion
     */
    const serviceHeaders = document.querySelectorAll('.service-header');

    serviceHeaders.forEach(header => {
        header.addEventListener('click', () => {
            const serviceItem = header.parentElement;
            
            // Check if the clicked item is already active
            const isActive = serviceItem.classList.contains('active');

            // 1. Close all other items
            document.querySelectorAll('.service-item').forEach(item => {
                item.classList.remove('active');
            });

            // 2. If the clicked item wasn't active, open it
            if (!isActive) {
                serviceItem.classList.add('active');
            }
            // If it *was* active, the line above already closed it,
            // so clicking an open item just closes it.
        });
    });
});