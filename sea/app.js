// Prefetch is now handled by prefetch-utils.js
// Scene-specific initialization can be added here if needed
function preventRubberBand(e) {
  const scrollY = window.scrollY;
  const maxScroll = document.body.scrollHeight - window.innerHeight;
  const touch = e.touches[0];

  if ((scrollY <= 0 && touch.clientY > touch.screenY) || (scrollY >= maxScroll && touch.clientY < touch.screenY)) {
    e.preventDefault();
  }
}

document.addEventListener('touchmove', preventRubberBand, {passive: false});


const canvas = document.querySelector(".canvas");
const textCanvas = document.querySelector(".text-canvas");
const cursorCanvas = document.querySelector(".cursor-canvas");
const loader = document.querySelector(".loader");
const progressText = document.getElementById("progress");
const loadingBar = document.querySelector('.loading-bar');

const linkButtonsContainer = document.querySelector('.link-buttons-container');
const exploreForestVedaBtn = document.getElementById('exploreForestVedaBtn');

// Get references to the floating UI elements
const floatingScrollBtn = document.getElementById('floatingScrollBtn');
const floatingScrollLabel = floatingScrollBtn.querySelector('.floating-ui-label');
const floatingScrollCircle = floatingScrollBtn.querySelector('.floating-ui-scroll-circle');

const navigateTo = (url) => {
  gsap.to([canvas, textCanvas, cursorCanvas, linkButtonsContainer], {
    opacity: 0,
    duration: 0.5,
    onComplete: () => {
      window.location.href = url;
    }
  });
};

let isAtLastFrame = false;

function updateScrollButton() {
  if (ball.frame >= frameCount - 10) {
    if (!isAtLastFrame) {
      isAtLastFrame = true;
      floatingScrollLabel.textContent = "RESTART JOURNEY";

            floatingScrollCircle.querySelector('svg').style.transform = 'rotate(180deg)';
    }
  } else {
    if (isAtLastFrame) {
      isAtLastFrame = false;
      floatingScrollLabel.textContent = "SCROLL";
      floatingScrollCirclee.querySelector('svg').style.transform = 'rotate(0deg)';
    }
  }
}

function restartJourney() {
  gsap.to(window, {
    scrollTo: 0,
    duration: 1.5,
    ease: "power2.inOut",
  });
}

floatingScrollBtn.addEventListener('click', () => {
  if (isAtLastFrame){
    restartJourney();
  }
});

const originalRender = render;
render = function() {
  originalRender();
  updateScrollButton();
}

exploreForestVedaBtn.addEventListener('click', () => navigateTo('index_s2.html'));

window.addEventListener('popstate', (event) => {
  // Check if there's a previous page to go back to
  if (document.referrer && document.referrer !== window.location.href) {
    // Refresh and go back to previous page
    window.location.href = document.referrer;
  } else {
    // If no referrer, just reload the current page
    window.location.reload();
  }
});

// Add state to history for back button handling
window.addEventListener('load', () => {
  // Only push state if we're not already in a pushed state
  if (!history.state || !history.state.page) {
    history.pushState({page: 'scene1', timestamp: Date.now()}, '', '');
  }
});

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
    this.color = `rgba(130, 223, 216, ${this.life})`;
  }

  update() {
    this.x += this.speedX;
    this.y += this.speedY;
    this.life -= 0.015;
    this.color = `rgba(130, 223, 216, ${this.life})`;
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

function updateBackground() {
  const isMobile = window.innerWidth <= 768;
  const bgImage = isMobile ? `./Scene1_MO/${ball.frame + 1}.webp` : `./Scene1_PC/${ball.frame + 1}.webp`;
  document.body.style.backgroundImage = `url('${bgImage}')`;
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
  // Calculate mouse position relative to center of screen
  mouseX = (e.clientX - window.innerWidth / 2) * 0.02;
  mouseY = (e.clientY - window.innerHeight / 2) * 0.02;
  
  // Create particles at cursor position
  createParticles(e.clientX, e.clientY);
});

// Add touch event listeners for mobile
document.addEventListener('touchstart', handleTouch);
document.addEventListener('touchmove', handleTouch);

function handleTouch(e) {
  e.preventDefault(); // Prevent default touch behavior
  
  // Get touch position
  const touch = e.touches[0];
  const touchX = touch.clientX;
  const touchY = touch.clientY;
  
  // Calculate position relative to center of screen
  mouseX = (touchX - window.innerWidth / 2) * 0.02;
  mouseY = (touchY - window.innerHeight / 2) * 0.02;
  
  // Create particles at touch position
  createParticles(touchX, touchY);
}

// Detect mobile device
const isMobile = window.innerWidth <= 768; // Updated to standard mobile breakpoint

// Set frame count
const frameCount = 200; // Same frame count for both mobile and desktop

// Choose image folder based on device
const currentFrame = (index) =>
  isMobile
    ? `./Scene1_MO/${(index + 1).toString()}.webp`
    : `./Scene1_PC/${(index + 1).toString()}.webp`;

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
  img.onerror = () => {
    console.warn(`Failed to load frame ${i + 1}`);
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
  img.onload = () => {
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
    end: () => `+=${window.innerHeight * 4}`, // Increased scroll length for slower scrolling
  },
  onUpdate: () => {
    render();
  },
});

// Animation loop for smooth parallax and cursor
function animate() {
  // Clear cursor canvas
  cursorContext.clearRect(0, 0, cursorCanvas.width, cursorCanvas.height);
  
  // Update and draw particles
  updateParticles();
  
  // Smooth interpolation for mouse movement with slower speed
  currentX += (mouseX - currentX) * 0.03;
  currentY += (mouseY - currentY) * 0.03;
  
  // Apply the transform to the text canvas
  textCanvas.style.transform = `translate(${currentX}px, ${currentY}px)`;
  
  requestAnimationFrame(animate);
}

// Start the animation loop
animate();

// Render current frame
function render() {
  context.canvas.width = images[0].width;
  context.canvas.height = images[0].height;
  context.clearRect(0, 0, canvas.width, canvas.height);
  context.drawImage(images[ball.frame], 0, 0);

  updateBackground();

  // Show link button in frames 160-200
  if (ball.frame >= 160) {
    linkButtonsContainer.style.display = 'flex';
    linkButtonsContainer.style.opacity = '1';
  } else {
    linkButtonsContainer.style.opacity = '0';
    setTimeout(() => {
      if (ball.frame < 197) {
        linkButtonsContainer.style.display = 'none';
      }
    }, 500);
  }
}

// Add resize handler to update mobile detection
window.addEventListener('resize', () => {
  const wasMobile = isMobile;
  isMobile = window.innerWidth <= 768;
  
  // If mobile state changed, reload the appropriate frames
  if (wasMobile !== isMobile) {
    // Clear existing images
    images.length = 0;
    loadedImages = 0;
    
    // Reload frames with same frame count but different folder
    for (let i = 0; i < frameCount; i++) {
      const img = new Image();
      img.src = currentFrame(i);
      img.onload = () => {
        loadedImages++;
        let percent = Math.floor((loadedImages / frameCount) * 100);
        updateLoadingProgress(percent);
        
        if (loadedImages === frameCount) {
          render();
        }
      };
      images.push(img);
    }
  }
});