// ========================================
// Animated Background - Floating Particles
// ========================================
const createParticles = () => {
    const canvas = document.createElement('canvas');
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.pointerEvents = 'none';
    canvas.style.zIndex = '0';
    document.body.insertBefore(canvas, document.body.firstChild);

    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles = [];
    const particleCount = 40;

    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 2 + 0.5;
            this.speedX = (Math.random() - 0.5) * 0.4;
            this.speedY = (Math.random() - 0.5) * 0.4;
            this.opacity = Math.random() * 0.5 + 0.2;
            this.color = Math.random() > 0.5 ? '#0FBF3F' : '#5FED83';
        }

        update() {
            this.x += this.speedX;
            this.y += this.speedY;

            if (this.x > canvas.width) this.x = 0;
            if (this.x < 0) this.x = canvas.width;
            if (this.y > canvas.height) this.y = 0;
            if (this.y < 0) this.y = canvas.height;
        }

        draw() {
            ctx.fillStyle = this.color;
            ctx.globalAlpha = this.opacity;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }

    const animate = () => {
        // Clear with pure black background
        ctx.fillStyle = '#000000';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.globalAlpha = 1;

        particles.forEach(particle => {
            particle.update();
            particle.draw();
        });

        // Draw connecting lines
        particles.forEach((particle, index) => {
            for (let i = index + 1; i < particles.length; i++) {
                const dx = particles[i].x - particle.x;
                const dy = particles[i].y - particle.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < 150) {
                    ctx.strokeStyle = '#0FBF3F';
                    ctx.globalAlpha = (1 - distance / 150) * 0.25;
                    ctx.lineWidth = 1.2;
                    ctx.beginPath();
                    ctx.moveTo(particle.x, particle.y);
                    ctx.lineTo(particles[i].x, particles[i].y);
                    ctx.stroke();
                }
            }
        });

        requestAnimationFrame(animate);
    };

    animate();

    // Resize handler
    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        ctx.fillStyle = '#000000';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    });
};

// Initialize particles on load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', createParticles);
} else {
    createParticles();
}

// ========================================
// Navbar Scroll Effect
// ========================================
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// ========================================
// Smooth Scroll for Navigation Links
// ========================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href !== '#') {
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                target.scrollIntoView({ 
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        }
    });
});

// ========================================
// Intersection Observer for Scroll Animations
// ========================================
const observerOptions = {
    threshold: 0.15,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
            setTimeout(() => {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }, index * 100);
            
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe skill blocks and contact items (project items live inside
// collapsible folders, so they're animated separately below)
document.querySelectorAll('.skill-category, .contact-item').forEach((el) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(40px)';
    el.style.transition = 'opacity 0.7s cubic-bezier(0.4, 0, 0.2, 1), transform 0.7s cubic-bezier(0.4, 0, 0.2, 1)';
    observer.observe(el);
});

// Observe folder cards themselves with the same fade-in
document.querySelectorAll('.folder').forEach((el) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(40px)';
    el.style.transition = 'opacity 0.7s cubic-bezier(0.4, 0, 0.2, 1), transform 0.7s cubic-bezier(0.4, 0, 0.2, 1)';
    observer.observe(el);
});

// ========================================
// Featured Projects: Folder Expand/Collapse
// ========================================
// Uses a JS-measured max-height (rather than a pure CSS grid-rows trick)
// so collapsed folders fully hide their contents in every browser, with
// no partial bleed-through of tags/badges.
const initProjectFolders = () => {
    const folders = document.querySelectorAll('.folder');

    const simpleDebounce = (fn, wait) => {
        let timeout;
        return (...args) => {
            clearTimeout(timeout);
            timeout = setTimeout(() => fn(...args), wait);
        };
    };

    const setOpenHeight = (folder) => {
        const content = folder.querySelector('.folder-content');
        if (content) content.style.maxHeight = content.scrollHeight + 'px';
    };

    const openFolder = (folder) => {
        const header = folder.querySelector('.folder-header');
        folder.classList.add('open');
        if (header) header.setAttribute('aria-expanded', 'true');
        setOpenHeight(folder);
    };

    const closeFolder = (folder) => {
        const content = folder.querySelector('.folder-content');
        const header = folder.querySelector('.folder-header');
        if (content) content.style.maxHeight = '0px';
        folder.classList.remove('open');
        if (header) header.setAttribute('aria-expanded', 'false');
    };

    folders.forEach((folder) => {
        const header = folder.querySelector('.folder-header');
        if (!header) return;

        header.addEventListener('click', () => {
            const isOpen = folder.classList.contains('open');

            // Only one folder open at a time
            folders.forEach((other) => {
                if (other !== folder && other.classList.contains('open')) {
                    closeFolder(other);
                }
            });

            if (isOpen) {
                closeFolder(folder);
            } else {
                openFolder(folder);
            }
        });

        // Keyboard support (Enter/Space) for accessibility
        header.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                header.click();
            }
        });

        // Videos may report their layout box late; recalc height once
        // metadata loads so playing content never gets clipped.
        folder.querySelectorAll('video').forEach((video) => {
            video.addEventListener('loadedmetadata', () => {
                if (folder.classList.contains('open')) setOpenHeight(folder);
            });
        });
    });

    // Replace the generous CSS fallback height on the default-open folder
    // with its exact measured height once layout has settled.
    const defaultOpen = document.querySelector('.folder.open');
    if (defaultOpen) {
        requestAnimationFrame(() => {
            requestAnimationFrame(() => setOpenHeight(defaultOpen));
        });
    }

    // Recompute the open folder's height if the viewport is resized
    // (text reflow changes content height on smaller screens).
    window.addEventListener('resize', simpleDebounce(() => {
        document.querySelectorAll('.folder.open').forEach(setOpenHeight);
    }, 150));
};

initProjectFolders();

// ========================================
// Project Media Lightbox (click to enlarge)
// ========================================
// Screen-recorded demo videos are too detailed to read at thumbnail
// size; clicking one opens a much larger view so every UI detail is
// actually legible.
const initProjectLightbox = () => {
    const mediaBoxes = document.querySelectorAll('.project-image');
    if (!mediaBoxes.length) return;

    // Build the lightbox shell once and reuse it for every project.
    const overlay = document.createElement('div');
    overlay.className = 'lightbox-overlay';
    overlay.innerHTML = `
        <div class="lightbox-content">
            <button class="lightbox-close" aria-label="Close"><i class="fas fa-times"></i></button>
        </div>
    `;
    document.body.appendChild(overlay);

    const content = overlay.querySelector('.lightbox-content');
    const closeBtn = overlay.querySelector('.lightbox-close');
    let activeMedia = null;

    const closeLightbox = () => {
        overlay.classList.remove('active');
        document.body.style.overflow = '';
        if (activeMedia && activeMedia.tagName === 'VIDEO') {
            activeMedia.pause();
        }
        if (activeMedia) {
            activeMedia.remove();
            activeMedia = null;
        }
    };

    const openLightbox = (box) => {
        // Pull the same source the thumbnail uses (video > source, or img)
        const sourceVideo = box.querySelector('video');
        const sourceImg = box.querySelector('img');

        let el;
        if (sourceVideo) {
            const src = sourceVideo.querySelector('source');
            el = document.createElement('video');
            el.autoplay = true;
            el.muted = true;
            el.loop = true;
            el.playsInline = true;
            el.controls = true;
            const s = document.createElement('source');
            s.src = src ? src.src : '';
            s.type = 'video/mp4';
            el.appendChild(s);
        } else if (sourceImg) {
            el = document.createElement('img');
            el.src = sourceImg.src;
            el.alt = sourceImg.alt || '';
        } else {
            return;
        }

        // Remove any previous media, then insert the new one before the close button
        if (activeMedia) activeMedia.remove();
        activeMedia = el;
        content.insertBefore(el, closeBtn);

        overlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    };

    mediaBoxes.forEach((box) => {
        // Hover hint so the click-to-enlarge affordance is discoverable
        const hint = document.createElement('div');
        hint.className = 'project-zoom-hint';
        hint.innerHTML = '<i class="fas fa-expand"></i>';
        box.appendChild(hint);

        box.addEventListener('click', () => openLightbox(box));
    });

    closeBtn.addEventListener('click', closeLightbox);
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) closeLightbox();
    });
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && overlay.classList.contains('active')) closeLightbox();
    });
};

initProjectLightbox();

// ========================================
// Active Navigation Link Highlighting
// ========================================
const highlightActiveLink = () => {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-links a');
    
    window.addEventListener('scroll', () => {
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (scrollY >= sectionTop - 300) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.style.color = '';
            if (link.getAttribute('href').slice(1) === current) {
                link.style.color = 'var(--github-green)';
                link.style.textShadow = '0 0 10px rgba(15, 191, 63, 0.5)';
            } else {
                link.style.textShadow = 'none';
            }
        });
    });
};

highlightActiveLink();

// ========================================
// Smooth Page Load Animation
// ========================================
window.addEventListener('load', () => {
    document.body.style.opacity = '1';
    
    const heroContent = document.querySelector('.hero-content');
    if (heroContent) {
        heroContent.style.animation = 'fadeInUp 1s ease 0.3s both';
    }
});

// ========================================
// Parallax Effect for Hero Section
// ========================================
const addParallaxEffect = () => {
    const heroSection = document.querySelector('.hero');
    if (!heroSection) return;
    
    window.addEventListener('scroll', () => {
        const scrollPosition = window.scrollY;
        
        if (scrollPosition < window.innerHeight) {
            heroSection.style.backgroundPosition = `0 ${scrollPosition * 0.3}px`;
        }
    });
};

addParallaxEffect();

// ========================================
// Text Reveal Animation on Scroll
// ========================================
const addTextRevealAnimation = () => {
    const titles = document.querySelectorAll('.hero-title, .projects-header h2, .skills-header h2, .contact h2, .project-content h3');
    
    titles.forEach(title => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.animation = 'fadeInUp 0.8s ease 0.2s both';
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });
        
        observer.observe(title);
    });
};

addTextRevealAnimation();

// ========================================
// Keyboard Navigation Support
// ========================================
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        console.log('Escape key pressed');
    }
});

// ========================================
// Accessibility: Reduced Motion Support
// ========================================
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (prefersReducedMotion) {
    document.documentElement.style.setProperty('--transition-smooth', '0s');
    document.documentElement.style.setProperty('--transition-fast', '0s');
    
    document.querySelectorAll('*').forEach(el => {
        el.style.animation = 'none !important';
        el.style.transition = 'none !important';
    });
}

// ========================================
// Cursor Effects
// ========================================
const addCursorEffect = () => {
    const interactiveElements = document.querySelectorAll('a, button, .cta-button, .project-link, .skill-list span, .contact-item');
    
    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', function() {
            this.style.cursor = 'pointer';
        });
    });
};

addCursorEffect();

// ========================================
// Performance Optimization: Debounce Scroll
// ========================================
const debounce = (func, wait) => {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
};

const debouncedScroll = debounce(() => {
    // Scroll-based logic here
}, 100);

window.addEventListener('scroll', debouncedScroll);

// ========================================
// Scroll Progress Indicator
// ========================================
const createScrollProgress = () => {
    const progressBar = document.createElement('div');
    progressBar.style.position = 'fixed';
    progressBar.style.top = '0';
    progressBar.style.left = '0';
    progressBar.style.height = '3px';
    progressBar.style.background = 'linear-gradient(90deg, #0FBF3F, #5FED83)';
    progressBar.style.width = '0%';
    progressBar.style.zIndex = '999';
    progressBar.style.transition = 'width 0.1s ease';
    progressBar.style.boxShadow = '0 0 10px rgba(15, 191, 63, 0.5)';
    document.body.appendChild(progressBar);
    
    window.addEventListener('scroll', () => {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = (scrollTop / docHeight) * 100;
        progressBar.style.width = scrollPercent + '%';
    });
};

createScrollProgress();

// ========================================
// Lazy Load Animation for Images
// ========================================
const observeImages = () => {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.style.opacity = '0';
                img.style.transition = 'opacity 0.6s ease';
                img.onload = () => {
                    img.style.opacity = '1';
                };
                observer.unobserve(img);
            }
        });
    });
    
    document.querySelectorAll('img').forEach(img => {
        imageObserver.observe(img);
    });
};

observeImages();

// ========================================
// Smooth Page Load
// ========================================
document.body.style.opacity = '0';
window.addEventListener('load', () => {
    document.body.style.transition = 'opacity 0.6s ease';
    document.body.style.opacity = '1';
});