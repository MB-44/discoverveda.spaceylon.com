// Floating UI Bar Functionality for Main Page

// Show floating UI immediately
document.addEventListener('DOMContentLoaded', () => {
  const floatingUI = document.querySelector('.floating-ui-bar');
  if (floatingUI) {
    floatingUI.classList.add('show');
  }
});

let audio = document.getElementById('backgroundAudio');
if (!audio) {
  audio = document.createElement('audio');
  audio.id = 'backgroundAudio';
  audio.src = './music.mp3';
  audio.loop = true;
  audio.preload = 'auto'; // Preload the audio
  audio.volume = 0;
  document.body.appendChild(audio);
}

let isMuted = false;
let targetVolume = 0.7;
let fadeInterval = null;
let audioReady = false;
const soundBtn = document.getElementById('floatingSoundBtn');

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
    soundBtn?.classList.remove('active');
  } else {
    soundBtn?.classList.add('active');
  }
}

// Attempt to play audio immediately
function tryPlayAudio() {
  if (audioReady) return;
  
  const playPromise = audio.play();
  
  if (playPromise !== undefined) {
    playPromise.then(() => {
      audioReady = true;
      isMuted = false;
      fadeIn(3000);
      updateSoundUI();
      console.log('Audio started successfully');
    }).catch((error) => {
      console.log('Autoplay prevented, waiting for user interaction:', error);
      // Set up listeners for first user interaction
      setupUserInteractionListeners();
    });
  }
}

// Set up listeners for the first user interaction
function setupUserInteractionListeners() {
  function enableAudio() {
    if (!audioReady) {
      audio.play().then(() => {
        audioReady = true;
        isMuted = false;
        fadeIn(2000);
        updateSoundUI();
        console.log('Audio enabled after user interaction');
      }).catch(e => console.log('Audio play failed:', e));
      
      // Remove all listeners after first successful play
      window.removeEventListener('click', enableAudio);
      window.removeEventListener('touchstart', enableAudio);
      window.removeEventListener('keydown', enableAudio);
      window.removeEventListener('scroll', enableAudio);
      window.removeEventListener('mousemove', enableAudio);
    }
  }
  
  // Listen to multiple interaction types for better coverage
  window.addEventListener('click', enableAudio, { once: true });
  window.addEventListener('touchstart', enableAudio, { once: true });
  window.addEventListener('keydown', enableAudio, { once: true });
  window.addEventListener('scroll', enableAudio, { once: true });
  window.addEventListener('mousemove', enableAudio, { once: true });
}

// Sound button functionality
if (soundBtn) {
  soundBtn.addEventListener('click', () => {
    if (!audioReady) {
      // If audio hasn't started yet, start it
      tryPlayAudio();
      return;
    }
    
    isMuted = !isMuted;
    if (!isMuted) {
      audio.play().then(() => {
        fadeIn(2000);
      }).catch(e => console.log('Audio play failed:', e));
    } else {
      fadeOut(1500);
    }
    updateSoundUI();
  });
}

// Initialize when DOM is loaded
window.addEventListener('DOMContentLoaded', () => {
  // Try to play immediately when page loads
  setTimeout(() => {
    tryPlayAudio();
  }, 100); // Small delay to ensure everything is ready
  
  updateSoundUI();
});

// Handle page visibility changes (when user switches tabs)
document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    // Page is hidden (user switched tab)
    if (!audio.paused && audio.volume > 0) {
      audio.volume = 0; // Mute immediately when hidden
    }
  } else {
    // Page is visible again
    if (audioReady && !isMuted) {
      fadeIn(1000); // Fade back in when visible
    }
  }
});

// Handle page unload - stop music when leaving
window.addEventListener('beforeunload', () => {
  if (!audio.paused) {
    audio.pause();
    audio.currentTime = 0; // Reset to beginning
  }
});

// Additional pagehide event for better mobile support
window.addEventListener('pagehide', () => {
  if (!audio.paused) {
    audio.pause();
    audio.currentTime = 0;
  }
});

// Cleanup function to prevent memory leaks
window.addEventListener('unload', () => {
  if (fadeInterval) {
    clearInterval(fadeInterval);
    fadeInterval = null;
  }
  if (audio) {
    audio.pause();
    audio.src = '';
    audio.load();
  }
});

// Additional optimization: Preload audio when possible
audio.addEventListener('canplaythrough', () => {
  console.log('Audio is ready to play');
}, { once: true });

audio.addEventListener('error', (e) => {
  console.error('Audio loading error:', e);
});

// For better mobile experience
audio.addEventListener('loadstart', () => {
  console.log('Audio loading started');
});

// Export functions for external use if needed
window.audioController = {
  play: () => tryPlayAudio(),
  stop: () => fadeOut(500),
  setVolume: (vol) => {
    targetVolume = Math.max(0, Math.min(1, vol));
    if (!isMuted && audioReady) {
      audio.volume = targetVolume;
    }
  },
  mute: () => {
    isMuted = true;
    fadeOut(1000);
    updateSoundUI();
  },
  unmute: () => {
    isMuted = false;
    if (audioReady) {
      audio.play().then(() => fadeIn(1000));
    } else {
      tryPlayAudio();
    }
    updateSoundUI();
  }
};