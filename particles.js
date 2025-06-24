// Mixed Forest & Sea Particle System
const particlesCanvas = document.querySelector(".particles-canvas");

// Set up canvas
particlesCanvas.width = window.innerWidth;
particlesCanvas.height = window.innerHeight;
const particlesContext = particlesCanvas.getContext("2d");

// Mixed particle colors - alternating between forest and sea
const particleColors = [
  [144, 238, 144], // Forest green
  [130, 223, 216], // Sea cyan
  [160, 245, 160], // Light forest green
  [115, 200, 195], // Deeper sea blue
  [120, 220, 120], // Medium forest green
  [145, 235, 225], // Light sea cyan
];

// Particle class with mixed colors
class MixedParticle {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.size = Math.random() * 0.8 + 0.2; // Much smaller particles
    this.speedX = Math.random() * 1.5 - 0.75;
    this.speedY = Math.random() * 1.5 - 0.75;
    this.life = 1;
    this.maxLife = 1;
    
    // Randomly select a color from the mixed palette
    this.colorIndex = Math.floor(Math.random() * particleColors.length);
    this.baseColor = particleColors[this.colorIndex];
    
    // Add some variation to the color
    this.colorVariation = [
      Math.random() * 20 - 10,
      Math.random() * 20 - 10,
      Math.random() * 20 - 10
    ];
    
    this.updateColor();
  }

  updateColor() {
    const r = Math.max(0, Math.min(255, this.baseColor[0] + this.colorVariation[0]));
    const g = Math.max(0, Math.min(255, this.baseColor[1] + this.colorVariation[1]));
    const b = Math.max(0, Math.min(255, this.baseColor[2] + this.colorVariation[2]));
    this.color = `rgba(${r}, ${g}, ${b}, ${this.life})`;
  }

  update() {
    this.x += this.speedX;
    this.y += this.speedY;
    this.life -= 0.002; // Much slower fade for longer trails
    this.updateColor();
    
    // Add some sparkle effect with smaller sizes
    if (Math.random() < 0.08) {
      this.size = Math.random() * 1.2 + 0.2;
    }
  }

  draw() {
    particlesContext.save();
    particlesContext.globalAlpha = this.life;
    particlesContext.fillStyle = this.color;
    particlesContext.beginPath();
    particlesContext.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    particlesContext.fill();
    
    // Add a subtle glow effect for brighter particles
    if (this.life > 0.7) {
      particlesContext.shadowColor = this.color;
      particlesContext.shadowBlur = this.size * 3; // Increased glow for visibility
      particlesContext.beginPath();
      particlesContext.arc(this.x, this.y, this.size * 0.6, 0, Math.PI * 2);
      particlesContext.fill();
    }
    
    particlesContext.restore();
  }
}

// Background ambient particles
class AmbientParticle {
  constructor() {
    this.x = Math.random() * window.innerWidth;
    this.y = Math.random() * window.innerHeight;
    this.size = Math.random() * 0.5 + 0.1; // Smaller ambient particles
    this.speedX = Math.random() * 0.3 - 0.15;
    this.speedY = Math.random() * 0.3 - 0.15;
    this.life = Math.random() * 0.25 + 0.08;
    this.maxLife = this.life;
    
    // Softer colors for ambient particles
    this.colorIndex = Math.floor(Math.random() * particleColors.length);
    this.baseColor = particleColors[this.colorIndex];
    this.updateColor();
  }

  updateColor() {
    const r = this.baseColor[0];
    const g = this.baseColor[1];
    const b = this.baseColor[2];
    this.color = `rgba(${r}, ${g}, ${b}, ${this.life * 0.6})`;
  }

  update() {
    this.x += this.speedX;
    this.y += this.speedY;
    
    // Wrap around screen edges
    if (this.x < 0) this.x = window.innerWidth;
    if (this.x > window.innerWidth) this.x = 0;
    if (this.y < 0) this.y = window.innerHeight;
    if (this.y > window.innerHeight) this.y = 0;
    
    // Subtle pulsing effect with longer duration
    this.life = this.maxLife + Math.sin(Date.now() * 0.0005 + this.x * 0.005) * 0.15;
    this.updateColor();
  }

  draw() {
    particlesContext.save();
    particlesContext.globalAlpha = this.life;
    particlesContext.fillStyle = this.color;
    particlesContext.beginPath();
    particlesContext.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    particlesContext.fill();
    particlesContext.restore();
  }
}

// Particle arrays
let cursorParticles = [];
let ambientParticles = [];
const maxCursorParticles = 400; // Much more particles for longer lasting trails
const maxAmbientParticles = 80;

// Initialize ambient particles
for (let i = 0; i < maxAmbientParticles; i++) {
  ambientParticles.push(new AmbientParticle());
}

// Create cursor particles
function createCursorParticles(x, y) {
  for (let i = 0; i < 8; i++) { // Even more particles per cursor movement
    if (cursorParticles.length < maxCursorParticles) {
      cursorParticles.push(new MixedParticle(x, y));
    }
  }
}

// Update and draw all particles
function updateParticles() {
  // Clear canvas
  particlesContext.clearRect(0, 0, particlesCanvas.width, particlesCanvas.height);
  
  // Create continuous particles
  createContinuousParticles();
  
  // Update and draw ambient particles
  for (let i = 0; i < ambientParticles.length; i++) {
    ambientParticles[i].update();
    ambientParticles[i].draw();
  }
  
  // Update and draw cursor particles
  for (let i = cursorParticles.length - 1; i >= 0; i--) {
    cursorParticles[i].update();
    cursorParticles[i].draw();
    
    if (cursorParticles[i].life <= 0) {
      cursorParticles.splice(i, 1);
    }
  }
}

// Mouse position tracking for continuous creation
let lastMouseX = 0;
let lastMouseY = 0;
let mouseActive = false;

// Mouse and touch event listeners
document.addEventListener('mousemove', (e) => {
  lastMouseX = e.clientX;
  lastMouseY = e.clientY;
  mouseActive = true;
  createCursorParticles(e.clientX, e.clientY);
});

document.addEventListener('touchstart', handleTouch);
document.addEventListener('touchmove', handleTouch);

function handleTouch(e) {
  e.preventDefault();
  const touch = e.touches[0];
  lastMouseX = touch.clientX;
  lastMouseY = touch.clientY;
  mouseActive = true;
  createCursorParticles(touch.clientX, touch.clientY);
}

// Continuous particle creation when mouse is active
function createContinuousParticles() {
  if (mouseActive && Math.random() < 0.3) { // 30% chance per frame
    createCursorParticles(lastMouseX + (Math.random() - 0.5) * 10, lastMouseY + (Math.random() - 0.5) * 10);
  }
}

// Reset mouse activity after some time
setInterval(() => {
  mouseActive = false;
}, 500);

// Enhanced interaction with circles
const forestCircle = document.getElementById('forest-circle');
const seaCircle = document.getElementById('sea-circle');

// Create burst effect when hovering over circles
function createBurstEffect(x, y, isForest = true) {
  const burstColors = isForest ? 
    [[144, 238, 144], [120, 220, 120], [160, 245, 160]] :
    [[130, 223, 216], [115, 200, 195], [145, 235, 225]];
  
  for (let i = 0; i < 20; i++) { // More particles for burst
    const particle = new MixedParticle(x, y);
    particle.baseColor = burstColors[Math.floor(Math.random() * burstColors.length)];
    particle.speedX = (Math.random() - 0.5) * 3;
    particle.speedY = (Math.random() - 0.5) * 3;
    particle.size = Math.random() * 1 + 0.3; // Smaller burst particles
    particle.life = 1;
    cursorParticles.push(particle);
  }
}

// Add hover effects to circles
if (forestCircle) {
  forestCircle.addEventListener('mouseenter', (e) => {
    const rect = forestCircle.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    createBurstEffect(centerX, centerY, true);
  });
}

if (seaCircle) {
  seaCircle.addEventListener('mouseenter', (e) => {
    const rect = seaCircle.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    createBurstEffect(centerX, centerY, false);
  });
}

// Animation loop
function animateParticles() {
  updateParticles();
  requestAnimationFrame(animateParticles);
}

// Handle window resize
window.addEventListener('resize', () => {
  particlesCanvas.width = window.innerWidth;
  particlesCanvas.height = window.innerHeight;
  
  // Recreate ambient particles for new dimensions
  ambientParticles = [];
  for (let i = 0; i < maxAmbientParticles; i++) {
    ambientParticles.push(new AmbientParticle());
  }
});

// Start animation when page loads
window.addEventListener('load', () => {
  animateParticles();
});

// Start animation immediately if page is already loaded
if (document.readyState === 'complete') {
  animateParticles();
} 