const cursor = document.getElementById('cursor');

document.addEventListener('mousemove', (e) => {
  cursor.style.left = e.clientX + 'px';
  cursor.style.top = e.clientY + 'px';
});

function isInteractive(el) {
  if (!el) return false;
  const interactiveTags = ['A', 'BUTTON', 'INPUT', 'TEXTAREA', 'SELECT', 'SUMMARY', 'LABEL'];
  if (interactiveTags.includes(el.tagName)) return true;
  if (el.hasAttribute('onclick') || el.getAttribute('role') === 'button') return true;
  return window.getComputedStyle(el).cursor === 'pointer';
}

document.addEventListener('mouseover', (e) => {
  let el = e.target;
  let found = false;
  while (el && el !== document.body) {
    if (isInteractive(el)) { found = true; break; }
    el = el.parentElement;
  }
  cursor.classList.toggle('hovering', found);
});

// text divider

const hoverSound = new Audio('public/sound/hover.mp3');
hoverSound.volume = 0.35;

let lastPlayed = 0;
const minInterval = 80; // ms — prevents sound spam feeling glitchy on rapid-fire hovers

function playHoverSound() {
  const now = Date.now();
  if (now - lastPlayed < minInterval) return; // skip if too soon after the last trigger
  lastPlayed = now;

  // clone the audio so overlapping triggers layer smoothly instead of cutting each other off
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