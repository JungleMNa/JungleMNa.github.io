// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all functionality
    initNavigation();
    initSideNavigation();
    initAnimations();
    // initSkillBars(); // Removed - skill bars no longer exist
    initCounters();
    initContactForm();
    initScrollEffects();
    initVisitorCounter();
});

// Side Navigation functionality
function initSideNavigation() {
    const sideNav = document.querySelector('.side-nav');
    const navTab = document.querySelector('.nav-tab');
    
    if (sideNav && navTab) {
        // Add smooth transition delays
        sideNav.addEventListener('mouseenter', () => {
            sideNav.style.transition = 'left 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
        });
        
        sideNav.addEventListener('mouseleave', () => {
            sideNav.style.transition = 'left 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
        });
        
        // Add click functionality to nav tab for mobile
        navTab.addEventListener('click', () => {
            sideNav.classList.toggle('mobile-active');
        });
        
        // Set active page indicator
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        const navLinks = document.querySelectorAll('.nav-link-side');
        
        navLinks.forEach(link => {
            const href = link.getAttribute('href');
            if (href === currentPage || (currentPage === '' && href === 'index.html')) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
        
        // Ensure custom cursor works on all side nav elements
        const sideNavElements = document.querySelectorAll('.nav-tab, .nav-link-side');
        sideNavElements.forEach(element => {
            // Remove any existing cursor styles
            element.style.cursor = 'none';
        });
    }
}

// Navigation functionality
function initNavigation() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Mobile menu toggle
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // Close mobile menu when clicking on a link
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });

    // Smooth scrolling for navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 70;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Active navigation link highlighting
    window.addEventListener('scroll', () => {
        const sections = document.querySelectorAll('section');
        const scrollPos = window.scrollY + 100;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    });
}

// Intersection Observer for animations
function initAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
            }
        });
    }, observerOptions);

    // Observe elements for animation
    const animateElements = document.querySelectorAll(
        '.about-card, .skill-category, .project-card, .contact-item, .stat-card'
    );
    
    animateElements.forEach(el => {
        observer.observe(el);
    });
}

// Skill bars animation removed - no longer needed

// Counter animation
function initCounters() {
    const counters = document.querySelectorAll('.stat-number');
    
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const target = parseInt(counter.getAttribute('data-target'));
                const duration = 2000; // 2 seconds
                const step = target / (duration / 16); // 60fps
                let current = 0;
                
                const updateCounter = () => {
                    current += step;
                    if (current < target) {
                        counter.textContent = Math.floor(current);
                        requestAnimationFrame(updateCounter);
                    } else {
                        counter.textContent = target;
                    }
                };
                
                updateCounter();
                counterObserver.unobserve(counter);
            }
        });
    }, { threshold: 0.5 });

    counters.forEach(counter => {
        counterObserver.observe(counter);
    });
}

// Contact form functionality
function initContactForm() {
    const form = document.querySelector('.contact-form');
    
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(form);
            const name = formData.get('name');
            const email = formData.get('email');
            const subject = formData.get('subject');
            const message = formData.get('message');
            
            // Simple validation
            if (!name || !email || !subject || !message) {
                showNotification('Please fill in all fields', 'error');
                return;
            }
            
            if (!isValidEmail(email)) {
                showNotification('Please enter a valid email address', 'error');
                return;
            }
            
            // Simulate form submission
            showNotification('Message sent successfully! I\'ll get back to you soon.', 'success');
            form.reset();
        });
    }
}

// Email validation
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Notification system
function showNotification(message, type) {
    // Remove existing notifications
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-message">${message}</span>
            <button class="notification-close">&times;</button>
        </div>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#4CAF50' : '#f44336'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 10px;
        box-shadow: 0 10px 30px rgba(0,0,0,0.3);
        z-index: 10000;
        transform: translateX(400px);
        transition: transform 0.3s ease;
        max-width: 300px;
    `;
    
    const notificationContent = notification.querySelector('.notification-content');
    notificationContent.style.cssText = `
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 1rem;
    `;
    
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.style.cssText = `
        background: none;
        border: none;
        color: white;
        font-size: 1.5rem;
        padding: 0;
        line-height: 1;
    `;
    
    // Add to DOM
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Close functionality
    closeBtn.addEventListener('click', () => {
        notification.style.transform = 'translateX(400px)';
        setTimeout(() => {
            notification.remove();
        }, 300);
    });
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.transform = 'translateX(400px)';
            setTimeout(() => {
                notification.remove();
            }, 300);
        }
    }, 5000);
}

// Scroll effects
function initScrollEffects() {
    const navbar = document.querySelector('.navbar');
    
    window.addEventListener('scroll', () => {
        const scrolled = window.scrollY;
        
        // Navbar background opacity
        if (scrolled > 50) {
            navbar.style.background = 'rgba(10, 10, 10, 0.98)';
        } else {
            navbar.style.background = 'rgba(10, 10, 10, 0.95)';
        }
    });
    
    // Parallax effect for hero section
    const hero = document.querySelector('.hero');
    if (hero) {
        window.addEventListener('scroll', () => {
            const scrolled = window.scrollY;
            const rate = scrolled * -0.5;
            hero.style.transform = `translateY(${rate}px)`;
        });
    }
}

// Floating icons animation
function initFloatingIcons() {
    const floatingIcons = document.querySelectorAll('.floating-icon');
    
    floatingIcons.forEach((icon, index) => {
        // Random floating animation
        setInterval(() => {
            const randomX = Math.random() * 20 - 10;
            const randomY = Math.random() * 20 - 10;
            icon.style.transform = `translate(${randomX}px, ${randomY}px)`;
        }, 2000 + index * 500);
    });
}

// Initialize floating icons when page loads
window.addEventListener('load', initFloatingIcons);

// Smooth scroll for all anchor links
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

// Create custom cursor
    const cursor = document.createElement('div');
    cursor.className = 'custom-cursor';
    document.body.appendChild(cursor);

    // Create scroll progress bar
    const scrollProgress = document.createElement('div');
    scrollProgress.className = 'scroll-progress';
    document.body.appendChild(scrollProgress);

    // Cursor movement
    document.addEventListener('mousemove', (e) => {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
    });

    // Cursor hover effects
    const hoverElements = document.querySelectorAll('a, button, .skill-item, .floating-icon, .nav-tab, .nav-link-side, .project-card, .project-link, .tech-tag');
    hoverElements.forEach(element => {
        element.addEventListener('mouseenter', () => {
            cursor.classList.add('hover');
        });
        element.addEventListener('mouseleave', () => {
            cursor.classList.remove('hover');
        });
    });
    
    // Scroll progress bar
    window.addEventListener('scroll', () => {
        const scrollTop = window.pageYOffset;
        const docHeight = document.body.offsetHeight - window.innerHeight;
        const scrollPercent = (scrollTop / docHeight) * 100;
        scrollProgress.style.width = scrollPercent + '%';
    });
    


// Add CSS for animations
const animationStyles = document.createElement('style');
animationStyles.textContent = `
    .about-card,
    .skill-category,
    .project-card,
    .contact-item,
    .stat-card {
        opacity: 0;
        transform: translateY(30px);
        transition: all 0.6s ease;
    }
    
    .about-card.animate,
    .skill-category.animate,
    .project-card.animate,
    .contact-item.animate,
    .stat-card.animate {
        opacity: 1;
        transform: translateY(0);
    }
    
    .nav-link.active {
        color: #ffffff !important;
    }
    
    .hamburger.active .bar:nth-child(2) {
        opacity: 0;
    }
    
    .hamburger.active .bar:nth-child(1) {
        transform: translateY(8px) rotate(45deg);
    }
    
    .hamburger.active .bar:nth-child(3) {
        transform: translateY(-8px) rotate(-45deg);
    }
    
    .section {
        opacity: 0;
        transform: translateY(50px);
        transition: all 0.8s ease;
    }
    
    .section.visible {
        opacity: 1;
        transform: translateY(0);
    }
    
    .skill-item {
        transform: translateX(-50px);
        opacity: 0;
        transition: all 0.6s ease;
    }
    
    .skill-item.animate {
        transform: translateX(0);
        opacity: 1;
    }
    
    .text-reveal {
        overflow: hidden;
    }
    
    .text-reveal span {
        display: inline-block;
        transform: translateY(100%);
        transition: transform 0.6s ease;
    }
    
    .text-reveal.animate span {
        transform: translateY(0);
    }
    
    .floating-icon {
        position: absolute;
        font-size: 2rem;
        opacity: 0.1;
        animation: float 6s ease-in-out infinite;
    }
    
    .floating-icon:nth-child(odd) {
        animation-direction: reverse;
    }
    
    @keyframes float {
        0%, 100% {
            transform: translateY(0px) rotate(0deg);
        }
        50% {
            transform: translateY(-20px) rotate(180deg);
        }
    }
    
    .custom-cursor {
        position: fixed;
        width: 20px;
        height: 20px;
        background: rgba(255, 255, 255, 0.5);
        border-radius: 50%;
        pointer-events: none;
        z-index: 9999;
        transition: all 0.1s ease;
        mix-blend-mode: difference;
    }
    
    .custom-cursor.hover {
        transform: scale(2);
        background: rgba(255, 255, 255, 0.8);
    }
`;
document.head.appendChild(animationStyles);

// Add particle effects on scroll
let particles = [];

function createParticle(x, y) {
    const particle = document.createElement('div');
    particle.style.cssText = `
        position: fixed;
        width: 4px;
        height: 4px;
        background: rgba(255, 255, 255, 0.8);
        border-radius: 50%;
        pointer-events: none;
        z-index: 1000;
        left: ${x}px;
        top: ${y}px;
    `;
    document.body.appendChild(particle);
    
    const angle = Math.random() * Math.PI * 2;
    const velocity = Math.random() * 3 + 1;
    const life = 60;
    
    particles.push({
        element: particle,
        x: x,
        y: y,
        vx: Math.cos(angle) * velocity,
        vy: Math.sin(angle) * velocity,
        life: life,
        maxLife: life
    });
}

function updateParticles() {
    particles.forEach((particle, index) => {
        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.life--;
        
        const opacity = particle.life / particle.maxLife;
        particle.element.style.left = particle.x + 'px';
        particle.element.style.top = particle.y + 'px';
        particle.element.style.opacity = opacity;
        
        if (particle.life <= 0) {
            document.body.removeChild(particle.element);
            particles.splice(index, 1);
        }
    });
    
    requestAnimationFrame(updateParticles);
}

updateParticles();

// Create particles on mouse movement
let lastMouseMove = 0;
document.addEventListener('mousemove', (e) => {
    const now = Date.now();
    if (now - lastMouseMove > 50) {
        createParticle(e.clientX, e.clientY);
        lastMouseMove = now;
    }
    
    const cursor = document.querySelector('.custom-cursor');
    if (!cursor) {
        const newCursor = document.createElement('div');
        newCursor.className = 'custom-cursor';
        newCursor.style.cssText = `
            position: fixed;
            width: 20px;
            height: 20px;
            background: rgba(255, 255, 255, 0.5);
            border-radius: 50%;
            pointer-events: none;
            z-index: 9999;
            transition: transform 0.1s ease;
            mix-blend-mode: difference;
        `;
        document.body.appendChild(newCursor);
    }
    
    const customCursor = document.querySelector('.custom-cursor');
    customCursor.style.left = e.clientX - 10 + 'px';
    customCursor.style.top = e.clientY - 10 + 'px';
});

// Add hover effects for interactive elements
document.querySelectorAll('a, button, .project-card, .skill-item').forEach(el => {
    el.addEventListener('mouseenter', () => {
        const cursor = document.querySelector('.custom-cursor');
        if (cursor) {
            cursor.style.transform = 'scale(2)';
        }
    });
    
    el.addEventListener('mouseleave', () => {
        const cursor = document.querySelector('.custom-cursor');
        if (cursor) {
            cursor.style.transform = 'scale(1)';
        }
    });
});

// Animate sections on scroll
const sections = document.querySelectorAll('section');
const sectionObserverOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            
            // Animate skill items
            const skillItems = entry.target.querySelectorAll('.skill-item');
            skillItems.forEach((item, index) => {
                setTimeout(() => {
                    item.classList.add('animate');
                }, index * 100);
            });
        }
    });
}, sectionObserverOptions);

sections.forEach(section => {
    section.classList.add('section');
    sectionObserver.observe(section);
});

// Add text reveal animation
const textElements = document.querySelectorAll('h1, h2, h3, .hero-subtitle');
textElements.forEach(element => {
    const text = element.textContent;
    element.innerHTML = '';
    element.classList.add('text-reveal');
    
    text.split('').forEach(char => {
        const span = document.createElement('span');
        span.textContent = char === ' ' ? '\u00A0' : char;
        element.appendChild(span);
    });
});

const textObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate');
            const spans = entry.target.querySelectorAll('span');
            spans.forEach((span, index) => {
                setTimeout(() => {
                    span.style.transform = 'translateY(0)';
                }, index * 50);
            });
        }
    });
}, { threshold: 0.5 });

textElements.forEach(element => {
    textObserver.observe(element);
});

// Visitor Counter functionality
function initVisitorCounter() {
    const visitorCountElement = document.getElementById('visitor-count');
    
    if (!visitorCountElement) return;
    
    // Set initial loading state
    visitorCountElement.textContent = '...';
    
    // Use a simple but reliable approach
    trySimpleCounter(visitorCountElement);
}

function trySimpleCounter(element) {
    // Try the most reliable CountAPI endpoint
    fetch('https://api.countapi.xyz/hit/junglemnagithubio.github.io/visits')
        .then(response => {
            console.log('CountAPI response status:', response.status);
            return response.json();
        })
        .then(data => {
            console.log('CountAPI response data:', data);
            if (data && data.value !== undefined) {
                animateCounter(element, data.value);
            } else {
                throw new Error('No value in response');
            }
        })
        .catch(error => {
            console.log('CountAPI failed, trying backup:', error);
            // Backup: Use a different CountAPI key
            fetch('https://api.countapi.xyz/hit/portfolio-site/total-visits')
                .then(response => response.json())
                .then(data => {
                    console.log('Backup CountAPI data:', data);
                    if (data && data.value !== undefined) {
                        animateCounter(element, data.value);
                    } else {
                        throw new Error('Backup also failed');
                    }
                })
                .catch(backupError => {
                    console.log('Backup failed, using enhanced localStorage:', backupError);
                    useEnhancedLocalStorage(element);
                });
        });
}

function useEnhancedLocalStorage(element) {
    // Get or create a visitor session
    const sessionKey = 'portfolio_visit_session';
    const totalVisitsKey = 'portfolio_total_visits';
    const lastVisitKey = 'portfolio_last_visit';
    
    const now = Date.now();
    const lastVisit = localStorage.getItem(lastVisitKey);
    const currentSession = sessionStorage.getItem(sessionKey);
    
    // If this is a new session (no session storage or more than 30 minutes since last visit)
    if (!currentSession || !lastVisit || (now - parseInt(lastVisit)) > 30 * 60 * 1000) {
        // Increment total visits
        let totalVisits = parseInt(localStorage.getItem(totalVisitsKey) || '0');
        totalVisits++;
        
        localStorage.setItem(totalVisitsKey, totalVisits.toString());
        localStorage.setItem(lastVisitKey, now.toString());
        sessionStorage.setItem(sessionKey, 'active');
        
        console.log('New visit recorded. Total visits:', totalVisits);
        animateCounter(element, totalVisits);
    } else {
        // Same session, just show current count
        const totalVisits = parseInt(localStorage.getItem(totalVisitsKey) || '1');
        console.log('Same session. Showing existing count:', totalVisits);
        animateCounter(element, totalVisits);
    }
}

// Remove the alternative counter function that used random numbers

// Animate the counter display
function animateCounter(element, targetValue) {
    let currentValue = 0;
    const increment = Math.ceil(targetValue / 50); // Animate over ~50 steps
    const duration = 2000; // 2 seconds
    const stepTime = duration / (targetValue / increment);
    
    const timer = setInterval(() => {
        currentValue += increment;
        if (currentValue >= targetValue) {
            currentValue = targetValue;
            clearInterval(timer);
        }
        
        // Format number with commas for readability
        element.textContent = currentValue.toLocaleString();
    }, stepTime);
}