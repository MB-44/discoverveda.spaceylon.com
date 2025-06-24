// Prefetch is now handled by prefetch-utils.js
// Scene-specific initialization can be added here if needed

const canvas = document.querySelector(".canvas");
const textCanvas = document.querySelector(".text-canvas");
const cursorCanvas = document.querySelector(".cursor-canvas");
const loader = document.querySelector(".loader");
const progressText = document.getElementById("progress");
const loadingBar = document.querySelector('.loading-bar');

const linkButtonsContainer = document.querySelector('.link-buttons-container');
const exploreForestVedaBtn = document.getElementById('exploreForestVedaBtn');

// Detect mobile device
let isMobile = window.innerWidth <= 768;

// Set frame count
const frameCount = 200;

// Choose image folder based on device
const currentFrame = (index) =>
  isMobile
    ? `./Scene1_MO/${(index + 1).toString()}.webp`
    : `./Scene1_PC/${(index + 1).toString()}.webp`;

// Initialize default background immediately to prevent Safari bounce
function initializeDefaultBackground() {
  const defaultBg = currentFrame(0); // Use first frame as default
  document.body.style.backgroundImage = `url('${defaultBg}')`;
  document.body.style.backgroundSize = 'cover';
  document.body.style.backgroundPosition = 'center center';
  document.body.style.backgroundRepeat = 'no-repeat';
  document.body.style.backgroundAttachment = 'fixed';
}

// Call immediately
initializeDefaultBackground();

// Prevent Safari overscroll/rubber-band effect
function preventOverscroll() {
  // Add CSS to prevent overscroll
  const style = document.createElement('style');
  style.textContent = `
    html, body {
      overflow-x: hidden;
      overscroll-behavior: none;
      -webkit-overflow-scrolling: touch;
      position: relative;
      min-height: 100vh;
    }
    
    body {
      background-attachment: fixed !important;
    }
    
    /* Prevent rubber band effect on Safari */
    body.no-scroll {
      position: fixed;
      width: 100%;
      height: 100%;
      overflow: hidden;
    }
  `;
  document.head.appendChild(style);
  
  // Prevent touch events that cause bouncing
  document.addEventListener('touchstart', function(e) {
    if (e.touches.length > 1) {
      e.preventDefault();
    }
  }, { passive: false });
  
  document.addEventListener('touchmove', function(e) {
    // Only prevent default if we're at the boundaries
    const touch = e.touches[0];
    const element = document.elementFromPoint(touch.clientX, touch.clientY);
    
    // Don't prevent scrolling on scrollable content
    if (!element || !element.closest('.scrollable-content')) {
      const isAtTop = window.pageYOffset <= 0;
      const isAtBottom = window.pageYOffset >= document.body.scrollHeight - window.innerHeight;
      
      if (isAtTop || isAtBottom) {
        e.preventDefault();
      }
    }
  }, { passive: false });
}

// Apply overscroll prevention
preventOverscroll();

const navigateTo = (url) => {
  gsap.to([canvas, textCanvas, cursorCanvas, linkButtonsContainer], {
    opacity: 0,
    duration: 0.5,
    onComplete: () => {
      window.location.href = url;
    }
  });
};

exploreForestVedaBtn.addEventListener('click', () => navigateTo('index_s2.html'));

// Handle browser back button
window.addEventListener('popstate', (event) => {
  if (document.referrer && document.referrer !== window.location.href) {
    window.location.href = document.referrer;
  } else {
    window.location.reload();
  }
});

// Add state to history for back button handling
window.addEventListener('load', () => {
  if (!history.state || !history.state.page) {
    history.pushState({page: 'scene1', timestamp: Date.now()}, '', '');
  }
});

function updateBackground() {
  const bgImage = isMobile ? `./Scene1_MO/${ball.frame + 1}.webp` : `./Scene1_PC/${ball.frame + 1}.webp`;
  document.body.style.backgroundImage = `url('${bgImage}')`;
  document.body.style.backgroundSize = 'cover';
  document.body.style.backgroundPosition = 'center center';
  document.body.style.backgroundRepeat = 'no-repeat';
  document.body.style.backgroundAttachment = 'fixed';
}

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const context = canvas.getContext("2d");

// Set up text canvas
textCanvas.width = window.innerWidth;
textCanvas.height = window.innerHeight;
const textContext = textCanvas.getContext("2d");

// Set up cursor canvas
cursorCanvas.width = window.innerWidth;
cursorCanvas.height = window.innerHeight;
const cursorContext = cursorCanvas.getContext("2d");

// Particle system for cursor
class Particle {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.size = Math.random() * 1.5 + 0.5;
    this.speedX = Math.random() * 1.5 - 0.75;
    this.speedY = Math.random() * 1.5 - 0.75;
    this.life = 1;
    this.color = `rgba(144, 238, 144, ${this.life})`;
  }

  update() {
    this.x += this.speedX;
    this.y += this.speedY;
    this.life -= 0.015;
    this.color = `rgba(144, 238, 144, ${this.life})`;
  }

  draw() {
    cursorContext.fillStyle = this.color;
    cursorContext.beginPath();
    cursorContext.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    cursorContext.fill();
  }
}

let particles = [];
const maxParticles = 80;

function createParticles(x, y) {
  for (let i = 0; i < 3; i++) {
    if (particles.length < maxParticles) {
      particles.push(new Particle(x, y));
    }
  }
}

function updateParticles() {
  for (let i = particles.length - 1; i >= 0; i--) {
    particles[i].update();
    particles[i].draw();
    
    if (particles[i].life <= 0) {
      particles.splice(i, 1);
    }
  }
}

// Mouse position tracking
let mouseX = 0;
let mouseY = 0;
let targetX = 0;
let targetY = 0;
let currentX = 0;
let currentY = 0;

// Add mouse move event listener
document.addEventListener('mousemove', (e) => {
  mouseX = (e.clientX - window.innerWidth / 2) * 0.02;
  mouseY = (e.clientY - window.innerHeight / 2) * 0.02;
  createParticles(e.clientX, e.clientY);
});

// Add touch event listeners for mobile
document.addEventListener('touchstart', handleTouch, { passive: false });
document.addEventListener('touchmove', handleTouch, { passive: false });

function handleTouch(e) {
  const touch = e.touches[0];
  const touchX = touch.clientX;
  const touchY = touch.clientY;
  
  mouseX = (touchX - window.innerWidth / 2) * 0.02;
  mouseY = (touchY - window.innerHeight / 2) * 0.02;
  
  createParticles(touchX, touchY);
}

const images = [];
let ball = { frame: 0 };
let loadedImages = 0;

// Update the loading progress display
function updateLoadingProgress(percent) {
  progressText.textContent = `${percent}%`;
  loadingBar.style.setProperty('--progress', `${percent}%`);
}

// Preload all frames
for (let i = 0; i < frameCount; i++) {
  const img = new Image();
  img.src = currentFrame(i);
  
  const handleImageLoad = () => {
    loadedImages++;
    let percent = Math.floor((loadedImages / frameCount) * 100);
    updateLoadingProgress(percent);

    if (loadedImages === frameCount) {
      // Fade out loader
      gsap.to(loader, {
        opacity: 0,
        duration: 0.5,
        onComplete: () => {
          loader.style.display = "none";
          // Show floating UI after loader is hidden
          const floatingUI = document.querySelector('.floating-ui-bar');
          if (floatingUI) {
            floatingUI.classList.add('show');
          }
          
          // Smooth entry animation for scene elements
          gsap.fromTo([canvas, textCanvas, cursorCanvas], {
            opacity: 0
          }, {
            opacity: 1,
            duration: 0.8,
            ease: "power2.out"
          });
        }
      });
      render();
    }
  };
  
  img.onerror = () => {
    console.warn(`Failed to load frame ${i + 1}`);
    handleImageLoad();
  };
  
  img.onload = handleImageLoad;
  images.push(img);
}

// Scroll animation with GSAP
gsap.to(ball, {
  frame: frameCount - 1,
  snap: "frame",
  ease: "none",
  scrollTrigger: {
    scrub: 1.5,
    pin: "canvas",
    end: () => `+=${window.innerHeight * 4}`,
  },
  onUpdate: () => {
    render();
  },
});

// Animation loop for smooth parallax and cursor
function animate() {
  cursorContext.clearRect(0, 0, cursorCanvas.width, cursorCanvas.height);
  updateParticles();
  
  currentX += (mouseX - currentX) * 0.03;
  currentY += (mouseY - currentY) * 0.03;
  
  textCanvas.style.transform = `translate(${currentX}px, ${currentY}px)`;
  
  requestAnimationFrame(animate);
}

animate();

function render() {
  if (images[ball.frame] && images[ball.frame].complete) {
    context.canvas.width = images[0].width;
    context.canvas.height = images[0].height;
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.drawImage(images[ball.frame], 0, 0);
  }

  updateBackground();

  if (ball.frame >= 160) {
    linkButtonsContainer.style.display = 'flex';
    linkButtonsContainer.style.opacity = '1';
  } else {
    linkButtonsContainer.style.opacity = '0';
    setTimeout(() => {
      if (ball.frame < 160) {
        linkButtonsContainer.style.display = 'none';
      }
    }, 500);
  }
}

// Handle resize with proper mobile detection update
window.addEventListener('resize', () => {
  const wasMobile = isMobile;
  isMobile = window.innerWidth <= 768;
  
  // Update canvas sizes
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  textCanvas.width = window.innerWidth;
  textCanvas.height = window.innerHeight;
  cursorCanvas.width = window.innerWidth;
  cursorCanvas.height = window.innerHeight;
  
  if (wasMobile !== isMobile) {
    // Clear existing images and reload for new device type
    images.length = 0;
    loadedImages = 0;
    
    // Show loader again
    loader.style.display = "flex";
    loader.style.opacity = "1";
    
    for (let i = 0; i < frameCount; i++) {
      const img = new Image();
      img.src = currentFrame(i);
      
      const handleImageLoad = () => {
        loadedImages++;
        let percent = Math.floor((loadedImages / frameCount) * 100);
        updateLoadingProgress(percent);
        
        if (loadedImages === frameCount) {
          gsap.to(loader, {
            opacity: 0,
            duration: 0.5,
            onComplete: () => {
              loader.style.display = "none";
            }
          });
          render();
        }
      };
      
      img.onerror = () => {
        console.warn(`Failed to load frame ${i + 1} after resize`);
        handleImageLoad();
      };
      
      img.onload = handleImageLoad;
      images.push(img);
    }
  }
  
  // Update background for current frame
  updateBackground();
});