
const track = document.getElementById('carouselTrack');
const slides = document.querySelectorAll('.carousel-slide');
const dots = document.querySelectorAll('.dot');
const counter = document.getElementById('slideCounter');
const progressBar = document.getElementById('progressBar');
const total = slides.length;
let current = 0;
let autoTimer = null;
let progressTimer = null;
let isDragging = false;
let dragStartX = 0;
let dragDelta = 0;

function pad(n) { return String(n+1).padStart(2,'0'); }

function goTo(index, dir) {
  slides[current].classList.remove('active');
  dots[current].classList.remove('active');
  current = (index + total) % total;
  slides[current].classList.add('active');
  dots[current].classList.add('active');
  track.style.transform = `translateX(-${current * 100}%)`;
  counter.textContent = `${pad(current)} / ${pad(total-1)}`;
  startProgress();
}

function startProgress() {
  progressBar.classList.remove('animating');
  progressBar.style.width = '0%';
  clearTimeout(progressTimer);
  void progressBar.offsetWidth;
  progressBar.classList.add('animating');
  progressBar.style.width = '100%';
  progressTimer = setTimeout(() => goTo(current + 1), 5000);
}

function stopAuto() {
  progressBar.classList.remove('animating');
  progressBar.style.width = '0%';
  clearTimeout(progressTimer);
}

document.getElementById('prevBtn').addEventListener('click', () => { stopAuto(); goTo(current - 1); });
document.getElementById('nextBtn').addEventListener('click', () => { stopAuto(); goTo(current + 1); });

dots.forEach(dot => {
  dot.addEventListener('click', () => { stopAuto(); goTo(parseInt(dot.dataset.i)); });
});

// Swipe / drag
const wrap = document.getElementById('carousel');
wrap.addEventListener('mousedown', e => { isDragging = true; dragStartX = e.clientX; wrap.classList.add('dragging'); stopAuto(); });
window.addEventListener('mousemove', e => {
  if (!isDragging) return;
  dragDelta = e.clientX - dragStartX;
  track.style.transform = `translateX(calc(-${current * 100}% + ${dragDelta}px))`;
});
window.addEventListener('mouseup', () => {
  if (!isDragging) return;
  isDragging = false;
  wrap.classList.remove('dragging');
  if (dragDelta < -60) goTo(current + 1);
  else if (dragDelta > 60) goTo(current - 1);
  else track.style.transform = `translateX(-${current * 100}%)`;
  dragDelta = 0;
});
wrap.addEventListener('touchstart', e => { dragStartX = e.touches[0].clientX; stopAuto(); }, {passive:true});
wrap.addEventListener('touchend', e => {
  const d = e.changedTouches[0].clientX - dragStartX;
  if (d < -50) goTo(current + 1);
  else if (d > 50) goTo(current - 1);
});

// Place list
document.querySelectorAll('.place-item').forEach(item => {
  item.addEventListener('click', () => {
    document.querySelectorAll('.place-item').forEach(i => i.classList.remove('active'));
    item.classList.add('active');
  });
});

// Start
startProgress();