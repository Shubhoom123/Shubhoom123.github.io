// Smooth scroll animation observer
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.animation = 'fadeIn 0.8s ease-out';
        }
    });
}, observerOptions);

// Observe all projects for fade-in animation
document.querySelectorAll('.project').forEach(el => observer.observe(el));

// Add active state to navigation links based on scroll position
const sections = document.querySelectorAll('section');
const navLinks = document.querySelectorAll('nav a');

window.addEventListener('scroll', () => {
    let current = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        
        if (window.pageYOffset >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.style.color = '#707070';
        if (link.getAttribute('href').slice(1) === current) {
            link.style.color = '#2D2D2D';
        }
    });
});

// Add typing effect to the hero subtitle
const subtitleElement = document.querySelector('.hero .subtitle');
const subtitleText = subtitleElement.textContent;
subtitleElement.textContent = '';

let charIndex = 0;

function typeWriter() {
    if (charIndex < subtitleText.length) {
        subtitleElement.textContent += subtitleText.charAt(charIndex);
        charIndex++;
        setTimeout(typeWriter, 100);
    }
}

// Start typing effect when page loads
window.addEventListener('load', () => {
    setTimeout(typeWriter, 500);
});

// Add smooth scroll behavior for navigation links
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

// Add skill animation on hover
const skillItems = document.querySelectorAll('.skill-group li');

skillItems.forEach(item => {
    item.addEventListener('mouseenter', function() {
        this.style.color = '#2D2D2D';
        this.style.transform = 'translateX(5px)';
        this.style.transition = 'all 0.3s ease';
    });
    
    item.addEventListener('mouseleave', function() {
        this.style.color = '#707070';
        this.style.transform = 'translateX(0)';
    });
});

// Add project hover effect
const projects = document.querySelectorAll('.project');

projects.forEach(project => {
    project.addEventListener('mouseenter', function() {
        this.style.paddingLeft = '20px';
        this.style.transition = 'padding-left 0.3s ease';
    });
    
    project.addEventListener('mouseleave', function() {
        this.style.paddingLeft = '0';
    });
});

// Show/hide navigation on scroll
let lastScroll = 0;
const nav = document.querySelector('nav');

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll <= 0) {
        nav.style.transform = 'translateY(0)';
    } else if (currentScroll > lastScroll && currentScroll > 100) {
        // Scrolling down
        nav.style.transform = 'translateY(-100%)';
    } else {
        // Scrolling up
        nav.style.transform = 'translateY(0)';
    }
    
    nav.style.transition = 'transform 0.3s ease';
    lastScroll = currentScroll;
});

// Add cursor trail effect (optional - can be commented out if too much)
const createCursorTrail = () => {
    const trail = document.createElement('div');
    trail.style.position = 'fixed';
    trail.style.width = '5px';
    trail.style.height = '5px';
    trail.style.borderRadius = '50%';
    trail.style.background = '#2D2D2D';
    trail.style.opacity = '0.3';
    trail.style.pointerEvents = 'none';
    trail.style.zIndex = '9999';
    
    document.body.appendChild(trail);
    
    setTimeout(() => {
        trail.style.opacity = '0';
        trail.style.transition = 'opacity 0.5s ease';
        setTimeout(() => trail.remove(), 500);
    }, 100);
    
    return trail;
};

let trailTimeout;
document.addEventListener('mousemove', (e) => {
    clearTimeout(trailTimeout);
    trailTimeout = setTimeout(() => {
        const trail = createCursorTrail();
        trail.style.left = e.pageX + 'px';
        trail.style.top = e.pageY + 'px';
    }, 50);
});

// Console message for recruiters
console.log('%cHey there! 👋', 'font-size: 20px; font-weight: bold; color: #2D2D2D;');
console.log('%cLooks like you\'re checking out the code. I like your style!', 'font-size: 14px; color: #707070;');
console.log('%cFeel free to reach out if you want to collaborate.', 'font-size: 14px; color: #707070;');