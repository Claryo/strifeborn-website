// STRIFEBORN WEBSITE JAVASCRIPT
// Handle mobile menu, hero filtering, and other interactivity

document.addEventListener('DOMContentLoaded', function() {
    // === MOBILE MENU TOGGLE ===
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const mainNav = document.querySelector('.main-nav');
    
    if (mobileMenuToggle && mainNav) {
        mobileMenuToggle.addEventListener('click', function() {
            mainNav.classList.toggle('active');
            
            // Animate hamburger menu
            this.classList.toggle('active');
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', function(event) {
            if (!event.target.closest('.site-header')) {
                mainNav.classList.remove('active');
                if (mobileMenuToggle) {
                    mobileMenuToggle.classList.remove('active');
                }
            }
        });
    }
    
    // === HERO FILTERING ===
    const filterButtons = document.querySelectorAll('.filter-btn');
    const heroCards = document.querySelectorAll('.hero-card');
    
    if (filterButtons.length > 0 && heroCards.length > 0) {
        filterButtons.forEach(button => {
            button.addEventListener('click', function() {
                // Remove active class from all buttons
                filterButtons.forEach(btn => btn.classList.remove('active'));
                
                // Add active class to clicked button
                this.classList.add('active');
                
                // Get filter value
                const filterValue = this.getAttribute('data-filter');
                
                // Filter heroes
                heroCards.forEach(card => {
                    const cardFaction = card.getAttribute('data-faction');
                    
                    if (filterValue === 'all' || cardFaction === filterValue) {
                        card.style.display = 'flex';
                        // Fade in animation
                        card.style.opacity = '0';
                        setTimeout(() => {
                            card.style.opacity = '1';
                        }, 10);
                    } else {
                        card.style.display = 'none';
                    }
                });
            });
        });
    }
    
    // === SMOOTH SCROLL FOR ANCHOR LINKS ===
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            // Don't prevent default for empty href
            if (href === '#') return;
            
            e.preventDefault();
            const target = document.querySelector(href);
            
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // === ADD TRANSITIONS TO HERO CARDS ===
    heroCards.forEach((card, index) => {
        card.style.transition = 'all 0.3s ease';
        card.style.transitionDelay = `${index * 0.05}s`;
    });
});

// === SCROLL TO TOP BUTTON (Optional enhancement) ===
window.addEventListener('scroll', function() {
    const scrollButton = document.querySelector('.scroll-to-top');
    
    if (scrollButton) {
        if (window.pageYOffset > 300) {
            scrollButton.classList.add('visible');
        } else {
            scrollButton.classList.remove('visible');
        }
    }
});

// === HERO CARD ANIMATIONS ===
// Add subtle animations when hero cards come into view
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe all cards that should animate on scroll
document.addEventListener('DOMContentLoaded', function() {
    const animatedElements = document.querySelectorAll('.feature-card, .faction-card, .devlog-card');

    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
});

// === GAMEPLAY CAROUSEL ===
(function () {
    const carousel = document.getElementById('gameplayCarousel');
    if (!carousel) return;

    const track = carousel.querySelector('.lp-carousel-track');
    const dots  = carousel.querySelectorAll('.lp-dot');
    const prev  = carousel.querySelector('.lp-carousel-prev');
    const next  = carousel.querySelector('.lp-carousel-next');
    const total = dots.length;
    let current = 0;

    function goTo(index) {
        current = (index + total) % total;
        track.style.transform = 'translateX(-' + (current * 100) + '%)';
        dots.forEach(function (dot, i) {
            dot.classList.toggle('active', i === current);
        });
    }

    prev.addEventListener('click', function () { goTo(current - 1); });
    next.addEventListener('click', function () { goTo(current + 1); });
    dots.forEach(function (dot, i) {
        dot.addEventListener('click', function () { goTo(i); });
    });

    // Touch swipe support
    var startX = 0;
    track.addEventListener('touchstart', function (e) {
        startX = e.touches[0].clientX;
    }, { passive: true });
    track.addEventListener('touchend', function (e) {
        var diff = startX - e.changedTouches[0].clientX;
        if (Math.abs(diff) > 50) goTo(current + (diff > 0 ? 1 : -1));
    });
}());
