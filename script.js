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