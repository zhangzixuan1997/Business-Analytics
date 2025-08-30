// Left Sidebar Navigation with Smooth Scrolling and Highlighting
document.addEventListener('DOMContentLoaded', function() {
    'use strict';
    
    // Feature detection and error handling
    const hasIntersectionObserver = 'IntersectionObserver' in window;
    const hasRequestAnimationFrame = 'requestAnimationFrame' in window;
    
    // Polyfill for requestAnimationFrame
    if (!hasRequestAnimationFrame) {
        window.requestAnimationFrame = function(callback) {
            return setTimeout(callback, 1000 / 60);
        };
    }

    // Mobile menu toggle for sidebar with error handling
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const sidebarNav = document.querySelector('.sidebar-nav');
    
    // Enhanced mobile menu with proper ARIA attributes
    function toggleMobileMenu() {
        if (!mobileMenuToggle || !sidebarNav) return;
        
        const isActive = sidebarNav.classList.contains('active');
        const icon = mobileMenuToggle.querySelector('i');
        
        sidebarNav.classList.toggle('active');
        mobileMenuToggle.setAttribute('aria-expanded', !isActive);
        
        if (icon) {
            icon.classList.toggle('fa-bars');
            icon.classList.toggle('fa-times');
        }
    }
    
    if (mobileMenuToggle && sidebarNav) {
        mobileMenuToggle.addEventListener('click', toggleMobileMenu);
        
        // Close sidebar when clicking outside on mobile
        document.addEventListener('click', function(e) {
            if (window.innerWidth <= 768) {
                if (!sidebarNav.contains(e.target) && !mobileMenuToggle.contains(e.target)) {
                    sidebarNav.classList.remove('active');
                    const icon = mobileMenuToggle.querySelector('i');
                    icon.classList.add('fa-bars');
                    icon.classList.remove('fa-times');
                }
            }
        });
    }

    // Smooth scrolling for sidebar navigation links
    document.querySelectorAll('.nav-link[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const target = document.querySelector(targetId);
            
            if (target) {
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - 20;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });

                // Update active nav item and add fade effect
                const sidebar = document.querySelector('.sidebar-nav');
                document.querySelectorAll('.nav-link').forEach(link => {
                    link.classList.remove('active');
                });
                this.classList.add('active');
                sidebar.classList.add('has-active');

                // Close mobile sidebar if open
                if (sidebarNav && sidebarNav.classList.contains('active')) {
                    sidebarNav.classList.remove('active');
                    const icon = mobileMenuToggle.querySelector('i');
                    icon.classList.add('fa-bars');
                    icon.classList.remove('fa-times');
                }
            }
        });
    });

    // Active navigation highlighting based on scroll position
    const sections = document.querySelectorAll('section[id], #hero');
    const navItems = document.querySelectorAll('.nav-link');

    function highlightNavigation() {
        let current = 'hero'; // Default to hero section
        
        sections.forEach(section => {
            const sectionTop = section.getBoundingClientRect().top;
            const sectionHeight = section.offsetHeight;
            
            // Check if section is in viewport (with some offset)
            if (sectionTop <= 150 && sectionTop + sectionHeight > 150) {
                current = section.getAttribute('id') || 'hero';
            }
        });

        // Update active nav item and add fade effect
        const sidebar = document.querySelector('.sidebar-nav');
        navItems.forEach(item => {
            item.classList.remove('active');
            const href = item.getAttribute('href');
            if (href === `#${current}`) {
                item.classList.add('active');
            }
        });
        
        // Add has-active class for fade effect
        const hasActiveItem = Array.from(navItems).some(item => item.classList.contains('active'));
        if (hasActiveItem) {
            sidebar.classList.add('has-active');
        } else {
            sidebar.classList.remove('has-active');
        }
    }

    // Initial highlight
    highlightNavigation();
    
    // Highlight on scroll
    window.addEventListener('scroll', highlightNavigation);
    
    // Highlight on resize (for responsive behavior)
    window.addEventListener('resize', highlightNavigation);

    // Terminal typing effect
    const terminalLines = [
        { element: '.code-line:nth-of-type(1)', delay: 500 },
        { element: '.output:nth-of-type(2)', delay: 1000 },
        { element: '.code-line:nth-of-type(3)', delay: 1500 },
        { element: '.output:nth-of-type(4)', delay: 2000 },
        { element: '.code-line:nth-of-type(5)', delay: 2500 },
        { element: '.output:nth-of-type(6)', delay: 3000 }
    ];

    // Animate terminal content
    function animateTerminal() {
        const terminalBody = document.querySelector('.terminal-body');
        if (!terminalBody) return;

        // Hide all content initially
        terminalBody.style.opacity = '0';
        
        // Fade in terminal
        setTimeout(() => {
            terminalBody.style.transition = 'opacity 0.5s ease';
            terminalBody.style.opacity = '1';
        }, 200);
    }

    // Intersection Observer for animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animation = 'fadeInUp 0.6s ease forwards';
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe elements for animation
    document.querySelectorAll('.timeline-item, .project-card, .skill-category, .stat').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        observer.observe(el);
    });

    // Skill bars animation
    const skillBars = document.querySelectorAll('.skill-progress');
    const skillObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const progressBar = entry.target;
                const width = progressBar.style.width;
                progressBar.style.width = '0%';
                setTimeout(() => {
                    progressBar.style.transition = 'width 1.5s ease';
                    progressBar.style.width = width;
                }, 200);
                skillObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);

    skillBars.forEach(bar => {
        skillObserver.observe(bar);
    });

    // Parallax effect for matrix background
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const parallax = document.querySelector('.matrix-bg');
        if (parallax) {
            const speed = scrolled * 0.2;
            parallax.style.transform = `translate3d(0, ${speed}px, 0)`;
        }
    });

    // Add glitch effect to logo on hover
    const logo = document.querySelector('.logo');
    if (logo) {
        logo.addEventListener('mouseenter', function() {
            this.style.animation = 'glitch 0.3s ease';
        });
        
        logo.addEventListener('animationend', function() {
            this.style.animation = '';
        });
    }

    // Random matrix characters in background
    function createMatrixRain() {
        const matrixContainer = document.createElement('div');
        matrixContainer.className = 'matrix-rain';
        matrixContainer.style.position = 'fixed';
        matrixContainer.style.top = '0';
        matrixContainer.style.left = '0';
        matrixContainer.style.width = '100%';
        matrixContainer.style.height = '100%';
        matrixContainer.style.pointerEvents = 'none';
        matrixContainer.style.zIndex = '-1';
        matrixContainer.style.opacity = '0.05';
        
        document.body.appendChild(matrixContainer);

        const characters = '01234567890ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz</>{}[]()';
        const drops = [];
        const fontSize = 14;
        const columns = Math.floor(window.innerWidth / fontSize);

        for (let i = 0; i < columns; i++) {
            drops[i] = Math.random() * window.innerHeight;
        }

        function drawMatrix() {
            matrixContainer.innerHTML = '';
            
            for (let i = 0; i < drops.length; i++) {
                const char = characters[Math.floor(Math.random() * characters.length)];
                const charElement = document.createElement('span');
                charElement.textContent = char;
                charElement.style.position = 'absolute';
                charElement.style.left = i * fontSize + 'px';
                charElement.style.top = drops[i] + 'px';
                charElement.style.color = '#00ff88';
                charElement.style.fontFamily = 'monospace';
                charElement.style.fontSize = fontSize + 'px';
                
                matrixContainer.appendChild(charElement);
                
                if (drops[i] > window.innerHeight && Math.random() > 0.975) {
                    drops[i] = 0;
                }
                drops[i] += fontSize;
            }
        }

        setInterval(drawMatrix, 100);
    }

    // Initialize matrix rain effect
    createMatrixRain();

    // Terminal animation
    animateTerminal();
    
    // Domain expansion animation
    function expandDomain() {
        const expandingD = document.getElementById('expanding-d');
        if (!expandingD) return;
        
        const targetText = 'ata';
        let currentText = 'd';
        let index = 0;
        
        function typeNextChar() {
            if (index < targetText.length) {
                currentText = 'd' + targetText.substring(0, index + 1);
                expandingD.textContent = currentText;
                index++;
                setTimeout(typeNextChar, 250); // Slower typing
            } else {
                // After completion, wait and reset
                setTimeout(() => {
                    // Reverse animation
                    let reverseIndex = targetText.length;
                    function deleteChar() {
                        if (reverseIndex > 0) {
                            currentText = 'd' + targetText.substring(0, reverseIndex - 1);
                            expandingD.textContent = currentText;
                            reverseIndex--;
                            setTimeout(deleteChar, 150); // Slower deletion
                        } else {
                            expandingD.textContent = 'd';
                            // Restart the cycle
                            setTimeout(expandDomain, 1200); // More frequent
                        }
                    }
                    deleteChar();
                }, 2000); // Shorter pause before deletion
            }
        }
        
        setTimeout(typeNextChar, 300); // Slightly slower initial delay
    }
    
    // Start domain expansion after page load
    setTimeout(expandDomain, 800); // Start sooner
});

// Email copy functionality
function copyEmail(event) {
    event.preventDefault(); // Prevent mailto link from opening
    
    const email = 'seancareer@mail.com';
    const tooltip = event.currentTarget.querySelector('.tooltip');
    
    // Copy to clipboard
    navigator.clipboard.writeText(email).then(function() {
        // Show success message
        tooltip.textContent = 'Copied!';
        tooltip.classList.add('copied');
        
        // Reset tooltip after 2 seconds
        setTimeout(() => {
            tooltip.textContent = 'Click to copy';
            tooltip.classList.remove('copied');
        }, 2000);
    }).catch(function(err) {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = email;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        
        // Show success message
        tooltip.textContent = 'Copied!';
        tooltip.classList.add('copied');
        
        // Reset tooltip after 2 seconds
        setTimeout(() => {
            tooltip.textContent = 'Click to copy';
            tooltip.classList.remove('copied');
        }, 2000);
    });
}

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }

    @keyframes glitch {
        0% { transform: translate(0); }
        20% { transform: translate(-2px, 2px); }
        40% { transform: translate(-2px, -2px); }
        60% { transform: translate(2px, 2px); }
        80% { transform: translate(2px, -2px); }
        100% { transform: translate(0); }
    }

    .nav-links.active {
        display: flex;
        position: absolute;
        top: 100%;
        left: 0;
        right: 0;
        background: rgba(26, 26, 26, 0.98);
        backdrop-filter: blur(10px);
        flex-direction: column;
        padding: 1rem 2rem;
        border-top: 1px solid var(--border-color);
    }

    .nav-links a.active {
        color: var(--primary-color);
    }

    .nav-links a.active::after {
        width: 100%;
    }

    .matrix-rain {
        font-family: 'JetBrains Mono', monospace;
        overflow: hidden;
    }

    @media (max-width: 768px) {
        .nav-links {
            display: none;
        }
        
        .nav-links.active {
            display: flex;
        }
    }
`;

document.head.appendChild(style);

// Error boundary for the entire script
window.addEventListener('error', function(e) {
    console.log('Script error caught:', e.error);
    // Graceful degradation - ensure basic functionality still works
});

// Performance monitoring
if ('performance' in window && 'mark' in window.performance) {
    window.performance.mark('portfolio-script-loaded');
}