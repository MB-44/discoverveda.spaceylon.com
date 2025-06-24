// Floating UI Bar Functionality for Main Page

// Show floating UI immediately
document.addEventListener('DOMContentLoaded', () => {
  const floatingUI = document.querySelector('.floating-ui-bar');
  if (floatingUI) {
    floatingUI.classList.add('show');
  }
});

// SOUND - Audio player for main page with autoplay and fade effects
let audio = document.getElementById('backgroundAudio');
if (!audio) {
  audio = document.createElement('audio');
  audio.id = 'backgroundAudio';
  audio.src = './music.mp3';
  audio.loop = true;
  audio.volume = 0;
  audio.autoplay = true;
  audio.muted = false;
  document.body.appendChild(audio);
}

let isMuted = false;
let targetVolume = 0.7;
let fadeInterval = null;
const soundBtn = document.getElementById('floatingSoundBtn');

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

// Initialize sound UI and autoplay
window.addEventListener('DOMContentLoaded', () => {
  isMuted = false;
  audio.muted = false;
  
  // Force autoplay immediately
  const playPromise = audio.play();
  
  if (playPromise !== undefined) {
    playPromise.then(() => {
      // Autoplay started successfully
      console.log('Audio autoplay started');
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

 