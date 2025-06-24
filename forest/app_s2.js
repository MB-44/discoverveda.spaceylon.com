// app.js

// Prevent rubber-band scrolling on touch devices
function preventRubberBand(e) {
  const scrollY = window.scrollY;
  const maxScroll = document.body.scrollHeight - window.innerHeight;
  const touch = e.touches[0];

  if (
    (scrollY <= 0 && touch.clientY > touch.screenY) ||
    (scrollY >= maxScroll && touch.clientY < touch.screenY)
  ) {
    e.preventDefault();
  }
}

document.addEventListener('touchmove', preventRubberBand, { passive: false });

// Canvas and UI element references
const canvas = document.querySelector(".canvas");
const textCanvas = document.querySelector(".text-canvas");
const cursorCanvas = document.querySelector(".cursor-canvas");
const loader = document.querySelector(".loader");
const progressText = document.getElementById("progress");
const loadingBar = document.querySelector('.loading-bar');
const breathingContainer = document.querySelector('.breathing-container');
const breathingInstruction = document.querySelector('.breathing-instruction');
const meditationBtn = document.getElementById('meditationBtn');
const meditationProgressRing = document.querySelector('.meditation-progress-ring-circle');
const linkButtonsContainer = document.querySelector('.link-buttons-container');
const nextSceneBtn = document.getElementById('nextSceneBtn');
const restartBtn = document.getElementById('restartBtn');

// Floating scroll button references
const floatingScrollBtn = document.getElementById('floatingScrollBtn');
const floatingScrollLabel = floatingScrollBtn.querySelector('.floating-ui-label');
const floatingScrollCircle = floatingScrollBtn.querySelector('.floating-ui-scroll-circle');
let isAtLastFrame = false;

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

// Mouse & touch tracking
let mouseX = 0, mouseY = 0, currentX = 0, currentY = 0;
document.addEventListener('mousemove', (e) => {
  mouseX = (e.clientX - window.innerWidth / 2) * 0.02;
  mouseY = (e.clientY - window.innerHeight / 2) * 0.02;
  createParticles(e.clientX, e.clientY);
});

document.addEventListener('touchstart', handleTouch);
document.addEventListener('touchmove', handleTouch);
function handleTouch(e) {
  e.preventDefault();
  const touch = e.touches[0];
  const touchX = touch.clientX;
  const touchY = touch.clientY;
  mouseX = (touchX - window.innerWidth / 2) * 0.02;
  mouseY = (touchY - window.innerHeight / 2) * 0.02;
  createParticles(touchX, touchY);
}

// Device detection
let isMobile = window.innerWidth <= 768;
const frameCount = 200;
const currentFrame = index =>
  isMobile
    ? `./Scene2_MO/${index + 1}.webp`
    : `./Scene2_PC/${index + 1}.webp`;

const images = [];
let ball = { frame: 0 };
let loadedImages = 0;

// Video loop
const forestLoopVideo = document.getElementById('forestLoop');
let videoStarted = false;
let minimumVideoTime = 3000;
let videoStartTime = 0;

if (forestLoopVideo) {
  const videoSource = document.createElement('source');
  if (isMobile) {
    videoSource.src = './Load_Mo_F.webm';
    videoSource.type = 'video/webm';
  } else {
    videoSource.src = './Load_Pc_F.mp4';
    videoSource.type = 'video/mp4';
  }
  forestLoopVideo.appendChild(videoSource);
  forestLoopVideo.load();
  forestLoopVideo.addEventListener('loadeddata', () => {
    videoStarted = true;
    videoStartTime = Date.now();
  });
}

// Preload frames
for (let i = 0; i < frameCount; i++) {
  const img = new Image();
  img.src = currentFrame(i);
  img.onerror = () => { loadedImages++; checkLoadingComplete(); };
  img.onload = () => { loadedImages++; checkLoadingComplete(); };
  images.push(img);
}

function updateLoadingProgress(percent) {
  progressText.textContent = `${percent}%`;
  loadingBar.style.setProperty('--progress', `${percent}%`);
}

function checkLoadingComplete() {
  if (loadedImages === frameCount) {
    const elapsed = Date.now() - videoStartTime;
    const delay = Math.max(0, minimumVideoTime - elapsed);
    setTimeout(() => {
      gsap.to(loader, {
        opacity: 0,
        duration: 0.8,
        ease: "power2.inOut",
        onComplete: () => {
          loader.style.display = "none";
          const floatingUI = document.querySelector('.floating-ui-bar');
          if (floatingUI) floatingUI.classList.add('show');
          gsap.fromTo(
            [canvas, textCanvas, cursorCanvas],
            { opacity: 0 },
            { opacity: 1, duration: 0.8, ease: "power2.out" }
          );
          render();
        }
      });
    }, delay);
  } else {
    const percent = Math.floor((loadedImages / frameCount) * 100);
    updateLoadingProgress(percent);
  }
}

// Background update
function updateBackground() {
  const bgImage = isMobile
    ? `url('./Scene2_MO/${ball.frame + 1}.webp')`
    : `url('./Scene2_PC/${ball.frame + 1}.webp')`;
  document.body.style.backgroundImage = bgImage;
}

// Original render function
function render() {
  context.canvas.width = images[0].width;
  context.canvas.height = images[0].height;
  context.clearRect(0, 0, canvas.width, canvas.height);
  const frameToShow = ball.frame;
  context.drawImage(images[frameToShow], 0, 0);
  updateBackground();

  if (ball.frame >= 180) {
    linkButtonsContainer.style.display = 'flex';
    linkButtonsContainer.style.opacity = '1';
  } else {
    linkButtonsContainer.style.opacity = '0';
    setTimeout(() => {
      if (ball.frame < 180) linkButtonsContainer.style.display = 'none';
    }, 500);
  }
}

// Inject scroll-button update into render
const originalRender = render;
render = function() {
  originalRender();
  updateScrollButton();
};

// GSAP scroll animation
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

// Scroll-button controls
function updateScrollButton() {
  if (ball.frame >= frameCount - 10) {
    if (!isAtLastFrame) {
      isAtLastFrame = true;
      floatingScrollLabel.textContent = 'RESTART JOURNEY';
      floatingScrollCircle.querySelector('svg').style.transform = 'rotate(180deg)';
    }
  } else {
    if (isAtLastFrame) {
      isAtLastFrame = false;
      floatingScrollLabel.textContent = 'SCROLL';
      floatingScrollCircle.querySelector('svg').style.transform = 'rotate(0deg)';
    }
  }
}

function restartJourney() {
  gsap.to(window, {
    scrollTo: 0,
    duration: 1.5,
    ease: "power2.inOut"
  });
}

floatingScrollBtn.addEventListener('click', () => {
  if (isAtLastFrame) restartJourney();
});

// Resize handler
window.addEventListener('resize', () => {
  const wasMobile = isMobile;
  isMobile = window.innerWidth <= 768;
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  textCanvas.width = window.innerWidth;
  textCanvas.height = window.innerHeight;
  cursorCanvas.width = window.innerWidth;
  cursorCanvas.height = window.innerHeight;
  if (wasMobile !== isMobile) {
    images.length = 0;
    loadedImages = 0;
    for (let i = 0; i < frameCount; i++) {
      const img = new Image();
      img.src = currentFrame(i);
      img.onload = () => {
        loadedImages++;
        let percent = Math.floor((loadedImages / frameCount) * 100);
        updateLoadingProgress(percent);
        if (loadedImages === frameCount) render();
      };
      images.push(img);
    }
  }
});

// Navigation buttons
nextSceneBtn.addEventListener('click', () => {
  window.open('https://lk.spaceylon.com/pages/forest-veda', '_blank');
});
restartBtn.addEventListener('click', () => {
  window.location.href = 'index_s3.html';
});

// Browser back handling
window.addEventListener('popstate', (event) => {
  if (document.referrer && document.referrer !== window.location.href) {
    window.location.href = document.referrer;
  } else {
    window.location.reload();
  }
});

// Push initial history state
window.addEventListener('load', () => {
  if (!history.state || !history.state.page) {
    history.pushState({ page: 'scene2', timestamp: Date.now() }, '', '');
  }
});

// Animation loop
function animate() {
  cursorContext.clearRect(0, 0, cursorCanvas.width, cursorCanvas.height);
  updateParticles();
  currentX += (mouseX - currentX) * 0.03;
  currentY += (mouseY - currentY) * 0.03;
  textCanvas.style.transform = `translate(${currentX}px, ${currentY}px)`;
  requestAnimationFrame(animate);
}
animate();