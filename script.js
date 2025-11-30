/**
 * =============================================
 * SISTEMA DE GESTIÓN DE RIESGO - MATEARE
 * JavaScript - Interactive Features
 * =============================================
 * 
 * MODIFICACIONES REALIZADAS:
 * - Eliminado auto-rotate del carrusel de fases (el usuario controla la navegación)
 * - Eliminado scrollIntoView() que movía la página automáticamente
 * - El dinamismo ahora reside en la interacción del usuario, no en animaciones forzadas
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initPreloader();
    initNavigation();
    initScrollAnimations();
    initStatCounters();
    initPhasesCarousel();
    initAccordion();
    initBackToTop();
    initSmoothScroll();
});

/**
 * Preloader
 */
function initPreloader() {
    const preloader = document.getElementById('preloader');
    
    window.addEventListener('load', function() {
        setTimeout(function() {
            preloader.classList.add('hidden');
            document.body.style.overflow = 'auto';
        }, 1500);
    });
    
    // Fallback - hide preloader after 3 seconds regardless
    setTimeout(function() {
        if (!preloader.classList.contains('hidden')) {
            preloader.classList.add('hidden');
            document.body.style.overflow = 'auto';
        }
    }, 3000);
}

/**
 * Navigation
 */
function initNavigation() {
    const navbar = document.getElementById('navbar');
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');
    
    // Scroll effect
    let lastScrollTop = 0;
    
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        // Add scrolled class
        if (scrollTop > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        
        // Update active nav link based on scroll position
        updateActiveNavLink();
        
        lastScrollTop = scrollTop;
    });
    
    // Mobile menu toggle
    navToggle.addEventListener('click', function() {
        navToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
        document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : 'auto';
    });
    
    // Close menu when clicking a link
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = 'auto';
        });
    });
    
    // Update active link based on scroll position
    function updateActiveNavLink() {
        const sections = document.querySelectorAll('section[id]');
        const scrollPosition = window.scrollY + 200;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }
}

/**
 * Scroll Animations (AOS-like functionality)
 */
function initScrollAnimations() {
    const animatedElements = document.querySelectorAll('[data-aos]');
    
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const delay = entry.target.getAttribute('data-aos-delay') || 0;
                setTimeout(() => {
                    entry.target.classList.add('aos-animate');
                }, delay);
            }
        });
    }, observerOptions);
    
    animatedElements.forEach(element => {
        observer.observe(element);
    });
    
    // Also animate elements without data-aos on scroll
    animateSectionsOnScroll();
}

function animateSectionsOnScroll() {
    const sections = document.querySelectorAll('.section');
    
    const observerOptions = {
        root: null,
        rootMargin: '-50px',
        threshold: 0.1
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                
                // Animate children with stagger
                const children = entry.target.querySelectorAll('.stat-card, .objective-card, .source-card, .level-card, .component-card, .measure-item, .resilience-card, .conclusion-card, .priority-block, .timeline-item');
                
                children.forEach((child, index) => {
                    setTimeout(() => {
                        child.style.opacity = '1';
                        child.style.transform = 'translateY(0)';
                    }, index * 100);
                });
            }
        });
    }, observerOptions);
    
    sections.forEach(section => {
        observer.observe(section);
        
        // Set initial styles for children
        const children = section.querySelectorAll('.stat-card, .objective-card, .source-card, .level-card, .component-card, .measure-item, .resilience-card, .conclusion-card, .priority-block, .timeline-item');
        
        children.forEach(child => {
            child.style.opacity = '0';
            child.style.transform = 'translateY(30px)';
            child.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        });
    });
}

/**
 * Statistics Counter Animation
 */
function initStatCounters() {
    const counters = document.querySelectorAll('.stat-number[data-count]');
    
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.5
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    counters.forEach(counter => {
        observer.observe(counter);
    });
}

function animateCounter(element) {
    const target = parseInt(element.getAttribute('data-count'));
    const duration = 2000; // 2 seconds
    const step = target / (duration / 16); // 60fps
    let current = 0;
    
    const updateCounter = () => {
        current += step;
        if (current < target) {
            element.textContent = formatNumber(Math.floor(current));
            requestAnimationFrame(updateCounter);
        } else {
            element.textContent = formatNumber(target);
        }
    };
    
    updateCounter();
}

function formatNumber(num) {
    return num.toLocaleString('es-NI');
}

/**
 * Phases Carousel
 * 
 * MODIFICADO: Se eliminó el auto-rotate y el scrollIntoView()
 * Ahora el carrusel solo cambia cuando el usuario interactúa con los botones
 * Esto respeta el flujo natural de navegación del usuario
 */
function initPhasesCarousel() {
    const carousel = document.querySelector('.phases-carousel');
    const cards = document.querySelectorAll('.phase-card');
    const buttons = document.querySelectorAll('.phase-btn');
    
    if (!carousel || !cards.length || !buttons.length) return;
    
    let currentPhase = 1;
    
    // Set initial state
    updatePhase(currentPhase);
    
    // Button clicks - El usuario controla la navegación
    buttons.forEach(btn => {
        btn.addEventListener('click', function() {
            const target = parseInt(this.getAttribute('data-target'));
            updatePhase(target);
        });
    });
    
    // ELIMINADO: Auto-rotate cada 5 segundos
    // El carrusel ya no cambia automáticamente
    // El usuario tiene control total sobre qué fase ver
    
    function updatePhase(phase) {
        currentPhase = phase;
        
        // Update cards
        cards.forEach(card => {
            card.classList.remove('active');
            if (parseInt(card.getAttribute('data-phase')) === phase) {
                card.classList.add('active');
                // ELIMINADO: scrollIntoView() que movía la página automáticamente
                // El contenido se actualiza sin mover la posición del scroll del usuario
            }
        });
        
        // Update buttons
        buttons.forEach(btn => {
            btn.classList.remove('active');
            if (parseInt(btn.getAttribute('data-target')) === phase) {
                btn.classList.add('active');
            }
        });
    }
}

/**
 * Accordion
 */
function initAccordion() {
    const accordionItems = document.querySelectorAll('.accordion-item');
    
    accordionItems.forEach(item => {
        const header = item.querySelector('.accordion-header');
        
        header.addEventListener('click', function() {
            const isActive = item.classList.contains('active');
            
            // Close all items
            accordionItems.forEach(i => {
                i.classList.remove('active');
            });
            
            // Open clicked item if it wasn't active
            if (!isActive) {
                item.classList.add('active');
            }
        });
    });
    
    // Open first item by default
    if (accordionItems.length > 0) {
        accordionItems[0].classList.add('active');
    }
}

/**
 * Back to Top Button
 */
function initBackToTop() {
    const backToTopBtn = document.getElementById('backToTop');
    
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 500) {
            backToTopBtn.classList.add('visible');
        } else {
            backToTopBtn.classList.remove('visible');
        }
    });
    
    backToTopBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

/**
 * Smooth Scroll for Anchor Links
 * Este scroll SÍ es intencional porque responde a una acción del usuario (clic en enlace)
 */
function initSmoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (!targetElement) return;
            
            const navbarHeight = document.getElementById('navbar').offsetHeight;
            const targetPosition = targetElement.offsetTop - navbarHeight;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        });
    });
}

/**
 * Parallax Effect for Hero Background
 */
window.addEventListener('scroll', function() {
    const hero = document.querySelector('.hero');
    if (!hero) return;
    
    const scrollPosition = window.pageYOffset;
    const heroHeight = hero.offsetHeight;
    
    if (scrollPosition < heroHeight) {
        const tectonicLines = hero.querySelector('.tectonic-lines');
        const gridOverlay = hero.querySelector('.grid-overlay');
        
        if (tectonicLines) {
            tectonicLines.style.transform = `translateY(${scrollPosition * 0.3}px)`;
        }
        
        if (gridOverlay) {
            gridOverlay.style.transform = `translateY(${scrollPosition * 0.1}px)`;
        }
    }
});

/**
 * Seismic Wave Animation on Scroll (for visual effect)
 */
function createSeismicEffect() {
    const hero = document.querySelector('.hero');
    if (!hero) return;
    
    // Create seismic ripple on scroll
    let lastScrollTop = 0;
    let rippleTimeout;
    
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset;
        const scrollDelta = Math.abs(scrollTop - lastScrollTop);
        
        if (scrollDelta > 50) {
            clearTimeout(rippleTimeout);
            
            // Visual feedback could be added here
            
            rippleTimeout = setTimeout(() => {
                // Reset effect
            }, 300);
        }
        
        lastScrollTop = scrollTop;
    });
}

// Initialize seismic effect
createSeismicEffect();

/**
 * Typing Effect for Hero Title (optional enhancement)
 */
function initTypingEffect() {
    const highlightLine = document.querySelector('.title-line.highlight');
    if (!highlightLine) return;
    
    const text = highlightLine.textContent;
    highlightLine.textContent = '';
    
    let charIndex = 0;
    
    function typeChar() {
        if (charIndex < text.length) {
            highlightLine.textContent += text.charAt(charIndex);
            charIndex++;
            setTimeout(typeChar, 50);
        }
    }
    
    // Start typing after page load animation
    setTimeout(typeChar, 1500);
}

// Uncomment to enable typing effect
// initTypingEffect();

/**
 * Alert Level Pulse Animation
 */
function initAlertPulse() {
    const redLevel = document.querySelector('.level-red .level-color');
    if (!redLevel) return;
    
    // The CSS already handles the glow effect
    // This function can add additional dynamic effects if needed
}

initAlertPulse();

/**
 * Interactive Timeline
 */
function initTimeline() {
    const timelineItems = document.querySelectorAll('.timeline-item');
    
    timelineItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            this.querySelector('.timeline-content').style.transform = 'scale(1.02)';
        });
        
        item.addEventListener('mouseleave', function() {
            this.querySelector('.timeline-content').style.transform = 'scale(1)';
        });
    });
}

initTimeline();

/**
 * Lazy Loading for Images (if any are added later)
 */
function initLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.getAttribute('data-src');
                img.removeAttribute('data-src');
                observer.unobserve(img);
            }
        });
    });
    
    images.forEach(img => {
        imageObserver.observe(img);
    });
}

initLazyLoading();

/**
 * Performance Optimization - Throttle scroll events
 */
function throttle(func, limit) {
    let lastFunc;
    let lastRan;
    return function() {
        const context = this;
        const args = arguments;
        if (!lastRan) {
            func.apply(context, args);
            lastRan = Date.now();
        } else {
            clearTimeout(lastFunc);
            lastFunc = setTimeout(function() {
                if ((Date.now() - lastRan) >= limit) {
                    func.apply(context, args);
                    lastRan = Date.now();
                }
            }, limit - (Date.now() - lastRan));
        }
    };
}

/**
 * Print-friendly version
 */
function initPrintVersion() {
    const printBtn = document.querySelector('.print-btn');
    if (!printBtn) return;
    
    printBtn.addEventListener('click', function() {
        window.print();
    });
}

initPrintVersion();

/**
 * Keyboard Navigation Support
 */
function initKeyboardNav() {
    document.addEventListener('keydown', function(e) {
        // ESC to close mobile menu
        if (e.key === 'Escape') {
            const navMenu = document.getElementById('navMenu');
            const navToggle = document.getElementById('navToggle');
            if (navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
                navToggle.classList.remove('active');
                document.body.style.overflow = 'auto';
            }
        }
        
        // Arrow keys for phase navigation
        if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
            const activePhaseBtnEl = document.querySelector('.phase-btn.active');
            if (activePhaseBtnEl) {
                const currentPhase = parseInt(activePhaseBtnEl.getAttribute('data-target'));
                let newPhase;
                
                if (e.key === 'ArrowLeft') {
                    newPhase = currentPhase > 1 ? currentPhase - 1 : 5;
                } else {
                    newPhase = currentPhase < 5 ? currentPhase + 1 : 1;
                }
                
                const newBtn = document.querySelector(`.phase-btn[data-target="${newPhase}"]`);
                if (newBtn) {
                    newBtn.click();
                }
            }
        }
    });
}

initKeyboardNav();

/**
 * Console message for developers
 */
console.log(`
╔═══════════════════════════════════════════════════════════╗
║                                                           ║
║   SISTEMA DE GESTIÓN DE RIESGO SÍSMICO                   ║
║   Municipio de Mateare, Managua, Nicaragua               ║
║                                                           ║
║   Universidad Nacional Casimiro Sotelo Montenegro        ║
║   Asignatura: Gestión de Riesgo                          ║
║                                                           ║
║   Autores:                                                ║
║   - Jaime A. Espino A.                                   ║
║   - Elder Castillo Talavera                              ║
║                                                           ║
║   Docente: Ing. Nadia Potosme                            ║
║   Noviembre 2025                                          ║
║                                                           ║
╚═══════════════════════════════════════════════════════════╝
`);
