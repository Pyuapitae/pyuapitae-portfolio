const isTouchDevice = window.matchMedia('(hover: none) and (pointer: coarse)').matches;

if (!isTouchDevice) {
  const cursor = document.getElementById('cursor');
  const darkSections = document.querySelectorAll('.carousel-track-wrapper, .second-section, .footer-bottom');

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

  // Visual "clickable" detection — used for the yellow cursor state.
  // Includes .masonry-grid images so they still show as interactive.
  function isInteractive(el) {
    if (!el) return false;
    const interactiveTags = ['A', 'BUTTON', 'INPUT', 'TEXTAREA', 'SELECT', 'SUMMARY', 'LABEL'];
    if (interactiveTags.includes(el.tagName)) return true;
    if (el.hasAttribute('onclick') || el.getAttribute('role') === 'button') return true;
    if (el.closest('.masonry-grid')) return true;
    return window.getComputedStyle(el).cursor === 'pointer';
  }

  // Sound-trigger detection — same as above, but EXCLUDES .masonry-grid images.
  function shouldPlaySound(el) {
    if (!el) return false;
    if (el.closest('.masonry-grid')) return false;
    return isInteractive(el);
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

    if (found && shouldPlaySound(e.target)) {
      playHoverSound();
    }
  });

  document.addEventListener('click', (e) => {
    if (shouldPlaySound(e.target)) {
      playHoverSound();
    }
  });
}

// ---------- LIGHTBOX (works on all devices, all grids) ----------
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');

if (lightbox && lightboxImg) {
  const closeLightbox = () => {
    lightbox.classList.remove('active');
    lightboxImg.src = '';
  };

  document.querySelectorAll('.masonry-grid').forEach(grid => {
    grid.addEventListener('click', (e) => {
      if (e.target.tagName !== 'IMG') return;
      // grid shows the 800px version; lightbox loads the 1600px one
      lightboxImg.src = e.target.dataset.full || e.target.src.replace('-800.webp', '-1600.webp');
      lightboxImg.alt = e.target.alt;
      lightbox.classList.add('active');
    });
  });

  lightbox.addEventListener('click', closeLightbox);
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeLightbox();
  });
}

// ---------- YOUTUBE: load the real player only when clicked ----------
document.querySelectorAll('.yt-facade').forEach(facade => {
  facade.addEventListener('click', () => {
    const iframe = document.createElement('iframe');
    iframe.src = `https://www.youtube.com/embed/${facade.dataset.id}?autoplay=1&rel=0`;
    iframe.title = facade.dataset.title || 'Video';
    iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
    iframe.allowFullscreen = true;
    facade.replaceWith(iframe);
  });
});

// ---------- SCROLL FADE-IN ----------
const fadeEls = document.querySelectorAll('.two-col-grid img, .three-col-grid img, .concept-storyboard, .concept-thumbnail, .video-hero, .video-embed-wrapper');

fadeEls.forEach(el => el.classList.add('fade-in-el'));

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('fade-in-visible');
      observer.unobserve(entry.target);
    }
  });
}, {
  threshold: 0.15
});

fadeEls.forEach(el => observer.observe(el));