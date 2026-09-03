// Simple lightbox: click any grid image to view it fullscreen, click again to close.

const grid = document.querySelector('.masonry-grid');
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');

grid.addEventListener('click', (e) => {
  if (e.target.tagName === 'IMG') {
    lightboxImg.src = e.target.src;
    lightboxImg.alt = e.target.alt;
    lightbox.classList.add('active');
  }
});

lightbox.addEventListener('click', () => {
  lightbox.classList.remove('active');
  lightboxImg.src = ''; // clears it so it's not loaded in memory while hidden
});

// optional: close with the Escape key too
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    lightbox.classList.remove('active');
    lightboxImg.src = '';
  }
});
