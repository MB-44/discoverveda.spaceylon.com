document.addEventListener('DOMContentLoaded', function() {
    const forestCircle = document.getElementById('forest-circle');
    const seaCircle = document.getElementById('sea-circle');
    const forestDescription = document.getElementById('forest-description');
    const seaDescription = document.getElementById('sea-description');
    
    console.log('Forest Circle found:', forestCircle);
    console.log('Sea Circle found:', seaCircle);
    
    if (!forestCircle || !seaCircle) {
        console.error('Circle elements not found!');
        return;
    }
    
    forestCircle.addEventListener('mouseenter', function() {
        forestDescription.classList.add('show');
    });
    
    forestCircle.addEventListener('mouseleave', function() {
        forestDescription.classList.remove('show');
    });
    
    seaCircle.addEventListener('mouseenter', function() {
        seaDescription.classList.add('show');
    });
    
    seaCircle.addEventListener('mouseleave', function() {
        seaDescription.classList.remove('show');
    });
    
    const ctaButton = document.querySelector('.cta-button');
    ctaButton.addEventListener('click', function() {
        this.style.transform = 'translateY(-2px) scale(0.98)';
        setTimeout(() => {
            this.style.transform = 'translateY(-2px) scale(1)';
        }, 150);
        
        console.log('Choose the Energy You Seek button clicked!');
    });
    
    forestCircle.addEventListener('click', function(event) {
        event.preventDefault();
        console.log('Forest Veda selected! Navigating to FOREST/index.html');
        this.style.transform = 'scale(0.95)';
        setTimeout(() => {
            this.style.transform = '';
            window.location.href = './forest/index.html';
        }, 150);
    });
    
    seaCircle.addEventListener('click', function(event) {
        event.preventDefault();
        console.log('Sea Veda selected! Navigating to SEA/index.html');
        this.style.transform = 'scale(0.95)';
        setTimeout(() => {
            this.style.transform = '';
            window.location.href = './sea/index.html';
        }, 150);
    });
    
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

document.addEventListener('DOMContentLoaded', function() {
    const circles = document.querySelectorAll('.circle');
    circles.forEach(circle => {
    });
});

function navigateToForest() {
    console.log('Navigate to Forest called!');
    window.location.href = './forest/index.html';
}

function navigateToSea() {
    console.log('Navigate to Sea called!');
    window.location.href = './sea/index.html';
}
