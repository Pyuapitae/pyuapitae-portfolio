const cursor = document.getElementById('cursor');
const darkSections = document.querySelectorAll('.carousel-track-wrapper, .second-section');

const hoverSound = new Audio('public/sound/hover.mp3');
hoverSound.volume = 0.15;

function unlockAudio() {
  hoverSound.play().then(() => {
    hoverSound.pause();
    hoverSound.currentTime = 0;
  }).catch(() => {});
}

document.addEventListener('click', unlockAudio, { once: true });
document.addEventListener('scroll', unlockAudio, { once: true });

let lastPlayed = 0;
const minInterval = 80;

function playHoverSound() {
  const now = Date.now();
  if (now - lastPlayed < minInterval) return;
  lastPlayed = now;

  const sound = hoverSound.cloneNode();
  sound.volume = hoverSound.volume;
  sound.play().catch(() => {});
}

function isInteractive(el) {
  if (!el) return false;
  const interactiveTags = ['A', 'BUTTON', 'INPUT', 'TEXTAREA', 'SELECT', 'SUMMARY', 'LABEL'];
  if (interactiveTags.includes(el.tagName)) return true;
  if (el.hasAttribute('onclick') || el.getAttribute('role') === 'button') return true;
  return window.getComputedStyle(el).cursor === 'pointer';
}

document.addEventListener('mousemove', (e) => {
  cursor.style.left = e.clientX + 'px';
  cursor.style.top = e.clientY + 'px';

  let onDark = false;
  for (const section of darkSections) {
    const rect = section.getBoundingClientRect();
    if (
      e.clientX >= rect.left &&
      e.clientX <= rect.right &&
      e.clientY >= rect.top &&
      e.clientY <= rect.bottom
    ) {
      onDark = true;
      break;
    }
  }

  cursor.classList.toggle('on-dark', onDark);
});

document.addEventListener('mouseover', (e) => {
  let el = e.target;
  let found = false;

  while (el && el !== document.body) {
    if (isInteractive(el)) {
      found = true;
      break;
    }
    el = el.parentElement;
  }

  cursor.classList.toggle('hovering', found);

  if (found) {
    playHoverSound();
  }
});