// Floating UI Bar Functionality

// MENU
const menuBtn = document.getElementById('floatingMenuBtn');
let menuOverlay = null;
if (menuBtn) {
  menuBtn.addEventListener('click', () => {
    if (!menuOverlay || !document.body.contains(menuOverlay)) {
      menuOverlay = document.createElement('div');
      menuOverlay.className = 'floating-ui-menu-overlay';
      menuOverlay.innerHTML = `
        <div class="floating-ui-menu-content">
          <button class="floating-ui-menu-close">&times;</button>
          <ul>
            <li><a href="../index.html">Home</a></li>
            <li><a href="../forest/index.html">ForestVeda</a></li>
            <li><a href="./index.html">SeaVeda</a></li>
            <li><a href="https://lk.spaceylon.com/" target="_blank">Shop</a></li>
          </ul>
        </div>
      `;
      document.body.appendChild(menuOverlay);
      
      // Close button functionality
      const closeBtn = menuOverlay.querySelector('.floating-ui-menu-close');
      closeBtn.onclick = () => {
        menuOverlay.remove();
        menuOverlay = null;
      };
      
      // Click outside to close functionality
      menuOverlay.onclick = (e) => { 
        if (e.target === menuOverlay) {
          menuOverlay.remove();
          menuOverlay = null;
        }
      };
    }
  });
}

// SCROLL
const scrollBtn = document.getElementById('floatingScrollBtn');
if (scrollBtn) {
  scrollBtn.addEventListener('click', () => {
    // Check if breathing exercise is active (defined in app_s3.js)
    if (window.isBreathingExerciseActive) {
      // Skip breathing exercise if active
      if (typeof window.skipBreathingExercise === 'function') {
        window.skipBreathingExercise();
      }
    } else {
      // Normal scroll behavior
      window.scrollTo({
        top: window.innerHeight * 0.8,
        behavior: 'smooth'
      });
    }
  });
}

// SOUND - Enhanced with fade effects
const soundBtn = document.getElementById('floatingSoundBtn');
let audio = document.getElementById('backgroundAudio');
if (!audio) {
  audio = document.createElement('audio');
  audio.id = 'backgroundAudio';
  audio.src = './Forestveda Audio.mp3';
  audio.loop = true;
  audio.volume = 0;
  audio.autoplay = true;
  audio.muted = false;
  document.body.appendChild(audio);
}

let isMuted = false;
let targetVolume = 0.7;
let fadeInterval = null;

// Fade in function
function fadeIn(duration = 2000) {
  if (fadeInterval) clearInterval(fadeInterval);
  
  const steps = 50;
  const stepTime = duration / steps;
  const volumeStep = targetVolume / steps;
  let currentStep = 0;
  
  audio.volume = 0;
  
  fadeInterval = setInterval(() => {
    currentStep++;
    audio.volume = Math.min(currentStep * volumeStep, targetVolume);
    
    if (currentStep >= steps) {
      clearInterval(fadeInterval);
      fadeInterval = null;
    }
  }, stepTime);
}

// Fade out function
function fadeOut(duration = 1500) {
  if (fadeInterval) clearInterval(fadeInterval);
  
  const steps = 50;
  const stepTime = duration / steps;
  const startVolume = audio.volume;
  const volumeStep = startVolume / steps;
  let currentStep = 0;
  
  fadeInterval = setInterval(() => {
    currentStep++;
    audio.volume = Math.max(startVolume - (currentStep * volumeStep), 0);
    
    if (currentStep >= steps) {
      clearInterval(fadeInterval);
      fadeInterval = null;
      audio.pause();
    }
  }, stepTime);
}

function updateSoundUI() {
  if (isMuted || audio.paused) {
    soundBtn.classList.remove('active');
  } else {
    soundBtn.classList.add('active');
  }
}

if (soundBtn) {
  soundBtn.addEventListener('click', () => {
    isMuted = !isMuted;
    if (!isMuted) {
      audio.muted = false;
      audio.play().then(() => {
        fadeIn(2000); // 2 second fade in
      }).catch(e => console.log('Audio play failed:', e));
    } else {
      fadeOut(1500); // 1.5 second fade out
    }
    updateSoundUI();
  });
}

window.addEventListener('DOMContentLoaded', () => {
  isMuted = false;
  audio.muted = false;
  
  // Force autoplay immediately
  const playPromise = audio.play();
  
  if (playPromise !== undefined) {
    playPromise.then(() => {
      // Autoplay started successfully
      console.log('SEA Audio autoplay started');
      fadeIn(3000); // 3 second fade in on page load
      updateSoundUI();
    }).catch(() => {
      // Autoplay was prevented - try on first user interaction
      console.log('Autoplay prevented, waiting for user interaction');
      
      function enableAudio() {
        isMuted = false;
        audio.muted = false;
        audio.play().then(() => {
          fadeIn(2000); // 2 second fade in on user interaction
          updateSoundUI();
        }).catch(e => console.log('Audio play failed:', e));
        window.removeEventListener('click', enableAudio);
        window.removeEventListener('touchstart', enableAudio);
        window.removeEventListener('keydown', enableAudio);
      }
      
      // Listen for any user interaction to start audio
      window.addEventListener('click', enableAudio);
      window.addEventListener('touchstart', enableAudio);
      window.addEventListener('keydown', enableAudio);
    });
  }
  
  // Update UI state immediately
  updateSoundUI();
});

// Add fade out when page is being unloaded
window.addEventListener('beforeunload', () => {
  if (!audio.paused && audio.volume > 0) {
    fadeOut(800); // Quick fade out on page leave
  }
});

// Cleanup function to prevent memory leaks
window.addEventListener('unload', () => {
  if (fadeInterval) {
    clearInterval(fadeInterval);
    fadeInterval = null;
  }
});

// MENU OVERLAY CSS (inject if not present)
if (!document.getElementById('floating-ui-menu-overlay-style')) {
  const style = document.createElement('style');
  style.id = 'floating-ui-menu-overlay-style';
  style.innerHTML = `
  .floating-ui-menu-overlay {
    position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
    background: rgba(0, 0, 0, 0.5); z-index: 20000; display: flex; align-items: center; justify-content: center;
    animation: fadeInOverlay 0.3s;
    backdrop-filter: blur(8px);
    -webkit-backdrop-filter: blur(8px);
    /* Disable momentum scrolling on menu overlay */
    -webkit-overflow-scrolling: auto;
    overscroll-behavior: none;
    overscroll-behavior-y: none;
    overscroll-behavior-x: none;
    touch-action: manipulation;
  }
  @keyframes fadeInOverlay { from { opacity: 0; } to { opacity: 1; } }
  .floating-ui-menu-content {
    background: rgba(0, 0, 0, 0.2);
    border: 1px solid rgba(255, 255, 255, 0.5);
    border-radius: 50px;
    color: white;
    padding: 30px 40px;
    min-width: 280px;
    backdrop-filter: blur(5px);
    -webkit-backdrop-filter: blur(5px);
    display: flex; 
    flex-direction: column; 
    align-items: center;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
    transition: background-color 0.3s, border-color 0.3s;
    position: relative;
    /* Disable momentum scrolling on menu content */
    -webkit-overflow-scrolling: auto;
    overscroll-behavior: none;
    touch-action: manipulation;
  }
  .floating-ui-menu-content:hover {
    background: rgba(255, 255, 255, 0.1);
    border-color: white;
  }
  .floating-ui-menu-content ul { 
    list-style: none; 
    padding: 0; 
    margin: 0; 
    width: 100%;
  }
  .floating-ui-menu-content li { 
    margin: 12px 0; 
    text-align: center;
  }
  .floating-ui-menu-content a { 
    color: white; 
    text-decoration: none; 
    font-family: 'Lato', sans-serif;
    font-size: 14px;
    letter-spacing: 1.5px;
    text-transform: uppercase;
    transition: color 0.3s;
    display: block;
    padding: 8px 12px;
    border-radius: 25px;
    transition: all 0.3s ease;
  }
  .floating-ui-menu-content a:hover { 
    background: rgba(255, 255, 255, 0.1);
    color: #fff;
  }
  .floating-ui-menu-close {
    background: none; 
    border: none; 
    color: white; 
    font-size: 24px; 
    position: absolute; 
    top: 15px; 
    right: 20px; 
    cursor: pointer;
    transition: color 0.3s;
    width: 30px;
    height: 30px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    transition: all 0.3s ease;
  }
  .floating-ui-menu-close:hover { 
    background: rgba(255, 255, 255, 0.1);
    color: #fff;
  }
  /* Sound wave animation */
  .floating-ui-sound:not(.muted) .wave1 {
    animation: wavePulse 1.2s infinite;
    opacity: 0.7;
    transform-origin: center;
  }
  .floating-ui-sound:not(.muted) .wave2 {
    animation: wavePulse 1.2s infinite 0.3s;
    opacity: 0.7;
    transform-origin: center;
  }
  @keyframes wavePulse {
    0%, 100% { opacity: 0.7; transform: scale(1);}
    50% { opacity: 1; transform: scale(1.15);}
  }
  /* Mobile responsive */
  @media (max-width: 768px) {
    .floating-ui-menu-content {
      min-width: 250px;
      padding: 25px 30px;
      margin: 20px;
    }
    .floating-ui-menu-content a {
      font-size: 13px;
      letter-spacing: 1.2px;
    }
  }
  @media (max-width: 480px) {
    .floating-ui-menu-content {
      min-width: 220px;
      padding: 20px 25px;
      margin: 15px;
    }
    .floating-ui-menu-content a {
      font-size: 12px;
      letter-spacing: 1px;
    }
  }
  `;
  document.head.appendChild(style);
} 