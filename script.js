// JavaScript for interactive functionality
document.addEventListener('DOMContentLoaded', function() {
    // Get circle elements and their descriptions
    const forestCircle = document.getElementById('forest-circle');
    const seaCircle = document.getElementById('sea-circle');
    const forestDescription = document.getElementById('forest-description');
    const seaDescription = document.getElementById('sea-description');
    
    // Debug: Check if elements are found
    console.log('Forest Circle found:', forestCircle);
    console.log('Sea Circle found:', seaCircle);
    
    // Ensure elements exist before adding event listeners
    if (!forestCircle || !seaCircle) {
        console.error('Circle elements not found!');
        return;
    }
    
    // Forest Circle Hover Events
    forestCircle.addEventListener('mouseenter', function() {
        forestDescription.classList.add('show');
    });
    
    forestCircle.addEventListener('mouseleave', function() {
        forestDescription.classList.remove('show');
    });
    
    // Sea Circle Hover Events
    seaCircle.addEventListener('mouseenter', function() {
        seaDescription.classList.add('show');
    });
    
    seaCircle.addEventListener('mouseleave', function() {
        seaDescription.classList.remove('show');
    });
    
    // CTA Button Click Event
    const ctaButton = document.querySelector('.cta-button');
    ctaButton.addEventListener('click', function() {
        // Add a subtle animation on click
        this.style.transform = 'translateY(-2px) scale(0.98)';
        setTimeout(() => {
            this.style.transform = 'translateY(-2px) scale(1)';
        }, 150);
        
        // You can add more functionality here, such as:
        // - Scroll to a specific section
        // - Open a modal
        // - Navigate to another page
        console.log('Choose the Energy You Seek button clicked!');
    });
    
    // Add click events to circles for navigation
    forestCircle.addEventListener('click', function(event) {
        event.preventDefault();
        console.log('Forest Veda selected! Navigating to FOREST/index.html');
        // Add visual feedback
        this.style.transform = 'scale(0.95)';
        setTimeout(() => {
            this.style.transform = '';
            // Navigate to Forest Veda experience
            window.location.href = './forest/index.html';
        }, 150);
    });
    
    seaCircle.addEventListener('click', function(event) {
        event.preventDefault();
        console.log('Sea Veda selected! Navigating to SEA/index.html');
        // Add visual feedback
        this.style.transform = 'scale(0.95)';
        setTimeout(() => {
            this.style.transform = '';
            // Navigate to Sea Veda experience
            window.location.href = './sea/index.html';
        }, 150);
    });
    
    // Smooth scroll behavior for any future anchor links
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
});

// Optional: Add some additional interactive features
function addRippleEffect(element) {
    element.addEventListener('click', function(e) {
        const ripple = document.createElement('span');
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        ripple.classList.add('ripple');
        
        this.appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
        }, 600);
    });
}

// Add ripple effect to circles (optional enhancement)
document.addEventListener('DOMContentLoaded', function() {
    const circles = document.querySelectorAll('.circle');
    circles.forEach(circle => {
        // You can uncomment the line below to add ripple effects
        // addRippleEffect(circle);
    });
});

// Fallback navigation functions (called from HTML onclick)
function navigateToForest() {
    console.log('Navigate to Forest called!');
    window.location.href = './forest/index.html';
}

function navigateToSea() {
    console.log('Navigate to Sea called!');
    window.location.href = './sea/index.html';
}
