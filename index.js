// ...existing code...
document.addEventListener('DOMContentLoaded', () => {
  const iframe = document.getElementById('latestFrame');
  const buttons = Array.from(document.querySelectorAll('.cat'));
  const menuToggle = document.getElementById('menuToggle');
  const nav = document.getElementById('mainNav');

  // Category buttons: set iframe src with query param and toggle active state
  function setCategory(cat) {
    const base = 'latest/latest.html';
    // keep a predictable URL so embedded page can read ?cat=
    iframe.src = cat === 'all' ? base : `${base}?cat=${encodeURIComponent(cat)}`;
    buttons.forEach(b => b.classList.toggle('active', b.dataset.cat === cat));
    // close mobile nav after selection
    nav.classList.remove('open');
    menuToggle.setAttribute('aria-expanded', 'false');
  }

  buttons.forEach(btn => {
    btn.addEventListener('click', () => setCategory(btn.dataset.cat));
  });

  // initialize active
  const initial = buttons.find(b => b.dataset.cat === 'all') || buttons[0];
  if (initial) setCategory(initial.dataset.cat);

  // mobile menu toggle
  menuToggle.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    menuToggle.setAttribute('aria-expanded', String(open));
  });

  // ensure iframe resizes smoothly on orientation change
  window.addEventListener('orientationchange', () => {
    setTimeout(() => {
      iframe.style.height = '100%';
    }, 300);
  });
});
// ...existing code...
