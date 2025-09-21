let currentSlide = 0;
let slides = [];
let intervalId = null;

export function initGallery(containerSelector, images, options = {}) {
  const defaults = {
    interval: 6000,
    transition: 1200,
    kenburns: 14000,
    startDelay: 6000,
    imageDir: './assets/images/',
    imageAlt: 'OyO Dessert - Artisan desserts and sweet treats'
  };

  const config = { ...defaults, ...options };
  const container = document.querySelector(containerSelector);

  if (!container || !images?.length) return false;

  const slidesHTML = images.map((img, i) => `
    <img class="absolute inset-0 w-full h-full object-cover slide"
         src="${config.imageDir}${img}"
         alt="${config.imageAlt}"
         loading="${i < 2 ? 'eager' : 'lazy'}"
         fetchpriority="${i === 0 ? 'high' : 'auto'}"
         decoding="async"
         style="opacity: 0; will-change: opacity, transform;"
         data-index="${i}"
         onerror="this.style.display='none'">
  `).join('');

  container.innerHTML = slidesHTML + '<div class="absolute inset-0 bg-black/60"></div>';

  slides = container.querySelectorAll('.slide');
  currentSlide = 0;

  showSlide(0, config.transition, config.kenburns);

  if (images.length > 1) {
    setTimeout(() => startSlideshow(config), config.startDelay);
  }

  images.slice(1).forEach(img => {
    (new Image()).src = config.imageDir + img;
  });

  return true;
}

function showSlide(index, transitionMs, kenburnsMs) {
  if (!slides[index]) return;

  slides.forEach((slide, i) => {
    if (i !== index && slide.style.opacity === '1') {
      slide.style.transition = `opacity ${transitionMs}ms ease-in-out`;
      slide.style.opacity = '0';
      setTimeout(() => slide.style.animation = '', transitionMs);
    }
  });

  const current = slides[index];
  current.style.animation = '';
  current.style.transition = `opacity ${transitionMs}ms ease-out`;

  requestAnimationFrame(() => {
    current.style.opacity = '1';
    current.style.animation = `zoom ${kenburnsMs}ms ease-in-out both`;
  });
}

function startSlideshow(config) {
  if (intervalId) return;

  intervalId = setInterval(() => {
    currentSlide = (currentSlide + 1) % slides.length;
    showSlide(currentSlide, config.transition, config.kenburns);
  }, config.interval);
}

export function stopSlideshow() {
  if (intervalId) {
    clearInterval(intervalId);
    intervalId = null;
  }
}

export function getCurrentSlide() {
  return currentSlide;
}

export function resetGallery() {
  stopSlideshow();
  currentSlide = 0;
  slides = [];
}