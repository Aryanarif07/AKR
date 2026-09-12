/* ==========================================================================
   AKR — Aryan Khan Restaurant Official JavaScript
   Version: 1.0.0
   Author: AKR Development Team
   Description: Vanilla JS for Theme Switching, Interactive Components & Animations
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    'use strict';

    /* --------------------------------------------------------------------------
       1. PRELOADER HANDLER
       -------------------------------------------------------------------------- */
    const preloader = document.getElementById('preloader');
    if (preloader) {
        window.addEventListener('load', () => {
            setTimeout(() => {
                preloader.classList.add('hide');
            }, 400);
        });
        // Fallback safety timeout if load event already fired
        setTimeout(() => {
            if (!preloader.classList.contains('hide')) {
                preloader.classList.add('hide');
            }
        }, 2000);
    }

    /* --------------------------------------------------------------------------
       2. DARK / LIGHT MODE THEME SWITCHER
       -------------------------------------------------------------------------- */
    const themeToggleBtn = document.getElementById('themeToggleBtn');
    const themeIcon = themeToggleBtn ? themeToggleBtn.querySelector('i') : null;

    // Check saved theme or system preference
    const savedTheme = localStorage.getItem('akr_theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initialTheme = savedTheme || (systemPrefersDark ? 'dark' : 'light');

    function applyTheme(theme) {
        if (theme === 'dark') {
            document.documentElement.setAttribute('data-theme', 'dark');
            if (themeIcon) {
                themeIcon.className = 'fas fa-sun';
            }
        } else {
            document.documentElement.removeAttribute('data-theme');
            if (themeIcon) {
                themeIcon.className = 'fas fa-moon';
            }
        }
        localStorage.setItem('akr_theme', theme);
    }

    // Apply theme immediately
    applyTheme(initialTheme);

    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            applyTheme(newTheme);
        });
    }

    /* --------------------------------------------------------------------------
       3. STICKY NAVBAR & ACTIVE LINK HIGHLIGHTER
       -------------------------------------------------------------------------- */
    const header = document.querySelector('.header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 40) {
            header?.classList.add('scrolled');
        } else {
            header?.classList.remove('scrolled');
        }
    });

    // Highlight current page in nav
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPath || (currentPath === '' && href === 'index.html')) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });

    /* --------------------------------------------------------------------------
       4. MOBILE HAMBURGER NAVIGATION
       -------------------------------------------------------------------------- */
    const hamburgerBtn = document.getElementById('hamburgerBtn');
    const navMenu = document.getElementById('navMenu');
    const mobileOverlay = document.getElementById('mobileNavOverlay');

    function toggleMobileMenu(open) {
        if (open) {
            navMenu?.classList.add('active');
            mobileOverlay?.classList.add('active');
            document.body.style.overflow = 'hidden';
            if (hamburgerBtn) hamburgerBtn.innerHTML = '<i class="fas fa-times"></i>';
        } else {
            navMenu?.classList.remove('active');
            mobileOverlay?.classList.remove('active');
            document.body.style.overflow = '';
            if (hamburgerBtn) hamburgerBtn.innerHTML = '<i class="fas fa-bars"></i>';
        }
    }

    hamburgerBtn?.addEventListener('click', () => {
        const isOpen = navMenu?.classList.contains('active');
        toggleMobileMenu(!isOpen);
    });

    mobileOverlay?.addEventListener('click', () => toggleMobileMenu(false));

    // Close mobile nav when clicking links
    navLinks.forEach(link => {
        link.addEventListener('click', () => toggleMobileMenu(false));
    });

    /* --------------------------------------------------------------------------
       5. MENU CATEGORY FILTER
       -------------------------------------------------------------------------- */
    const filterButtons = document.querySelectorAll('.filter-btn');
    const menuCards = document.querySelectorAll('.menu-card');

    if (filterButtons.length > 0 && menuCards.length > 0) {
        filterButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                // Remove active class from all buttons
                filterButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                const filterValue = btn.getAttribute('data-filter');

                menuCards.forEach(card => {
                    const cardCategory = card.getAttribute('data-category');

                    if (filterValue === 'all' || cardCategory === filterValue) {
                        card.style.display = 'flex';
                        setTimeout(() => {
                            card.style.opacity = '1';
                            card.style.transform = 'translateY(0)';
                        }, 50);
                    } else {
                        card.style.opacity = '0';
                        card.style.transform = 'translateY(20px)';
                        setTimeout(() => {
                            card.style.display = 'none';
                        }, 300);
                    }
                });
            });
        });
    }

    /* --------------------------------------------------------------------------
       6. ANIMATED STATISTICS COUNTER
       -------------------------------------------------------------------------- */
    const statNumbers = document.querySelectorAll('.stat-number');
    let animatedStats = false;

    function animateCounters() {
        statNumbers.forEach(stat => {
            const target = parseInt(stat.getAttribute('data-target') || '0', 10);
            const suffix = stat.getAttribute('data-suffix') || '';
            const duration = 2000;
            const stepTime = 30;
            const steps = duration / stepTime;
            const increment = target / steps;
            let current = 0;

            const timer = setInterval(() => {
                current += increment;
                if (current >= target) {
                    stat.textContent = target + suffix;
                    clearInterval(timer);
                } else {
                    stat.textContent = Math.floor(current) + suffix;
                }
            }, stepTime);
        });
    }

    const statsSection = document.querySelector('.stats-counter-grid');
    if (statsSection && 'IntersectionObserver' in window) {
        const statsObserver = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting && !animatedStats) {
                animatedStats = true;
                animateCounters();
            }
        }, { threshold: 0.3 });
        statsObserver.observe(statsSection);
    }

    /* --------------------------------------------------------------------------
       7. TESTIMONIALS SLIDER
       -------------------------------------------------------------------------- */
    const testimonialsTrack = document.getElementById('testimonialsTrack');
    const slides = document.querySelectorAll('.testimonial-slide');
    const prevBtn = document.getElementById('sliderPrev');
    const nextBtn = document.getElementById('sliderNext');
    const dotsContainer = document.getElementById('sliderDots');

    if (testimonialsTrack && slides.length > 0) {
        let currentIndex = 0;
        let autoplayTimer = null;

        // Create dots
        if (dotsContainer) {
            dotsContainer.innerHTML = '';
            slides.forEach((_, idx) => {
                const dot = document.createElement('span');
                dot.className = `dot ${idx === 0 ? 'active' : ''}`;
                dot.addEventListener('click', () => goToSlide(idx));
                dotsContainer.appendChild(dot);
            });
        }

        function updateSlider() {
            testimonialsTrack.style.transform = `translateX(-${currentIndex * 100}%)`;
            const dots = dotsContainer?.querySelectorAll('.dot');
            dots?.forEach((dot, idx) => {
                dot.classList.toggle('active', idx === currentIndex);
            });
        }

        function goToSlide(index) {
            currentIndex = (index + slides.length) % slides.length;
            updateSlider();
            resetAutoplay();
        }

        function nextSlide() {
            goToSlide(currentIndex + 1);
        }

        function prevSlide() {
            goToSlide(currentIndex - 1);
        }

        nextBtn?.addEventListener('click', nextSlide);
        prevBtn?.addEventListener('click', prevSlide);

        function startAutoplay() {
            autoplayTimer = setInterval(nextSlide, 5000);
        }

        function resetAutoplay() {
            clearInterval(autoplayTimer);
            startAutoplay();
        }

        // Pause on hover
        const sliderWrap = document.querySelector('.testimonials-slider-wrap');
        sliderWrap?.addEventListener('mouseenter', () => clearInterval(autoplayTimer));
        sliderWrap?.addEventListener('mouseleave', startAutoplay);

        startAutoplay();
    }

    /* --------------------------------------------------------------------------
       8. FAQ ACCORDION
       -------------------------------------------------------------------------- */
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        const questionBtn = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');

        questionBtn?.addEventListener('click', () => {
            const isOpen = item.classList.contains('active');

            // Close other items
            faqItems.forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.classList.remove('active');
                    const otherAnswer = otherItem.querySelector('.faq-answer');
                    if (otherAnswer) otherAnswer.style.maxHeight = null;
                }
            });

            // Toggle current
            if (isOpen) {
                item.classList.remove('active');
                if (answer) answer.style.maxHeight = null;
            } else {
                item.classList.add('active');
                if (answer) answer.style.maxHeight = answer.scrollHeight + 'px';
            }
        });
    });

    /* --------------------------------------------------------------------------
       9. GALLERY LIGHTBOX MODAL
       -------------------------------------------------------------------------- */
    const galleryItems = document.querySelectorAll('.gallery-item');
    const lightboxModal = document.getElementById('lightboxModal');
    const lightboxImg = document.getElementById('lightboxImg');
    const lightboxCaption = document.getElementById('lightboxCaption');
    const lightboxClose = document.getElementById('lightboxClose');
    const lightboxPrev = document.getElementById('lightboxPrev');
    const lightboxNext = document.getElementById('lightboxNext');

    if (galleryItems.length > 0 && lightboxModal) {
        let currentGalleryIndex = 0;
        const galleryData = Array.from(galleryItems).map(item => {
            const img = item.querySelector('img');
            const caption = item.querySelector('.gallery-caption')?.textContent || '';
            return { src: img?.getAttribute('src') || '', alt: caption };
        });

        function openLightbox(index) {
            currentGalleryIndex = index;
            const item = galleryData[currentGalleryIndex];
            if (lightboxImg) lightboxImg.src = item.src;
            if (lightboxCaption) lightboxCaption.textContent = item.alt;
            lightboxModal.classList.add('active');
            document.body.style.overflow = 'hidden';
        }

        function closeLightbox() {
            lightboxModal.classList.remove('active');
            document.body.style.overflow = '';
        }

        galleryItems.forEach((item, index) => {
            item.addEventListener('click', () => openLightbox(index));
        });

        lightboxClose?.addEventListener('click', closeLightbox);

        lightboxPrev?.addEventListener('click', (e) => {
            e.stopPropagation();
            currentGalleryIndex = (currentGalleryIndex - 1 + galleryData.length) % galleryData.length;
            openLightbox(currentGalleryIndex);
        });

        lightboxNext?.addEventListener('click', (e) => {
            e.stopPropagation();
            currentGalleryIndex = (currentGalleryIndex + 1) % galleryData.length;
            openLightbox(currentGalleryIndex);
        });

        lightboxModal.addEventListener('click', (e) => {
            if (e.target === lightboxModal) closeLightbox();
        });

        document.addEventListener('keydown', (e) => {
            if (!lightboxModal.classList.contains('active')) return;
            if (e.key === 'Escape') closeLightbox();
            if (e.key === 'ArrowLeft') lightboxPrev?.click();
            if (e.key === 'ArrowRight') lightboxNext?.click();
        });
    }

    /* --------------------------------------------------------------------------
       10. FORM VALIDATIONS & FEEDBACKS
       -------------------------------------------------------------------------- */
    // Helper validation
    function validateEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    // Reservation Form
    const reservationForm = document.getElementById('reservationForm');
    const reservationFeedback = document.getElementById('reservationFeedback');

    if (reservationForm) {
        reservationForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = reservationForm.querySelector('[name="name"]')?.value.trim();
            const email = reservationForm.querySelector('[name="email"]')?.value.trim();
            const phone = reservationForm.querySelector('[name="phone"]')?.value.trim();
            const date = reservationForm.querySelector('[name="date"]')?.value;
            const time = reservationForm.querySelector('[name="time"]')?.value;

            if (!name || !email || !phone || !date || !time) {
                showFeedback(reservationFeedback, 'Please fill in all required fields.', 'error');
                return;
            }

            if (!validateEmail(email)) {
                showFeedback(reservationFeedback, 'Please enter a valid email address.', 'error');
                return;
            }

            showFeedback(reservationFeedback, 'Thank you! Your table reservation request has been received. We will contact you shortly.', 'success');
            reservationForm.reset();
        });
    }

    // Contact Form
    const contactForm = document.getElementById('contactForm');
    const contactFeedback = document.getElementById('contactFeedback');

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = contactForm.querySelector('[name="name"]')?.value.trim();
            const email = contactForm.querySelector('[name="email"]')?.value.trim();
            const subject = contactForm.querySelector('[name="subject"]')?.value.trim();
            const message = contactForm.querySelector('[name="message"]')?.value.trim();

            if (!name || !email || !subject || !message) {
                showFeedback(contactFeedback, 'Please complete all required fields.', 'error');
                return;
            }

            if (!validateEmail(email)) {
                showFeedback(contactFeedback, 'Please enter a valid email address.', 'error');
                return;
            }

            showFeedback(contactFeedback, 'Thank you for reaching out! Your message has been sent successfully.', 'success');
            contactForm.reset();
        });
    }

    // Newsletter Form
    const newsletterForms = document.querySelectorAll('.newsletter-form');
    newsletterForms.forEach(form => {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const emailInput = form.querySelector('input[type="email"]');
            const email = emailInput?.value.trim();

            if (!email || !validateEmail(email)) {
                alert('Please enter a valid email address.');
                return;
            }

            alert('Thank you for subscribing to AKR Newsletter! You will receive our latest offers soon.');
            form.reset();
        });
    });

    function showFeedback(element, message, type) {
        if (!element) return;
        element.textContent = message;
        element.className = `form-feedback ${type}`;
        element.style.display = 'block';

        setTimeout(() => {
            element.style.display = 'none';
        }, 6000);
    }

    /* --------------------------------------------------------------------------
       11. FLOATING BACK TO TOP BUTTON
       -------------------------------------------------------------------------- */
    const backToTopBtn = document.getElementById('backToTopBtn');
    if (backToTopBtn) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) {
                backToTopBtn.classList.add('visible');
            } else {
                backToTopBtn.classList.remove('visible');
            }
        });

        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    /* --------------------------------------------------------------------------
       12. SCROLL REVEAL ANIMATIONS
       -------------------------------------------------------------------------- */
    const animateElements = document.querySelectorAll('.animate-on-scroll');

    if (animateElements.length > 0 && 'IntersectionObserver' in window) {
        const scrollObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animated');
                }
            });
        }, { threshold: 0.15 });

        animateElements.forEach(el => scrollObserver.observe(el));
    } else {
        // Fallback
        animateElements.forEach(el => el.classList.add('animated'));
    }
});
