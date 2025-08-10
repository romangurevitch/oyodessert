/**
 * OyO Dessert Gallery - Simple & Fast Image Gallery
 * Following SOLID principles with separation of concerns
 */

// Single Responsibility: ImageDetector only handles image detection
class ImageDetector {
  constructor(config = {}) {
    this.config = {
      maxImageNumber: 40,
      imageDirectory: './assets/images/',
      imagePattern: 'IMG_',
      imageExtension: '.webp',
      ...config
    };
  }

  async detectAvailableImages() {
    const promises = [];
    
    for (let i = 1; i <= this.config.maxImageNumber; i++) {
      promises.push(this._checkImage(i));
    }
    
    const results = await Promise.all(promises);
    return results.filter(filename => filename !== null);
  }

  _checkImage(num) {
    return new Promise(resolve => {
      const img = new Image();
      const filename = `${this.config.imagePattern}${num}${this.config.imageExtension}`;
      img.onload = () => resolve(filename);
      img.onerror = () => resolve(null);
      img.src = `${this.config.imageDirectory}${filename}`;
    });
  }
}

// Single Responsibility: ImageShuffler only handles shuffling logic
class ImageShuffler {
  static shuffle(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }
}

// Single Responsibility: SlideshowRenderer only handles DOM creation and transitions
class SlideshowRenderer {
  constructor(containerSelector) {
    this.container = document.querySelector(containerSelector);
    this.slides = [];
  }

  createSlideshow(images) {
    if (!this.container) return;

    const slidesHTML = images.map((img, index) => 
      `<img class="absolute inset-0 w-full h-full object-cover ${index === 0 ? 'opacity-100' : 'opacity-0'}" 
            src="./assets/images/${img}" 
            alt="OyO Dessert"
            loading="${index === 0 ? 'eager' : 'lazy'}"
            style="transition: opacity 1s ease; ${index === 0 ? 'animation: zoom 14s ease-in-out both;' : ''}">`
    ).join('');

    this.container.innerHTML = slidesHTML + '<div class="absolute inset-0 bg-black/60"></div>';
    this.slides = this.container.querySelectorAll('img');
  }

  showSlide(index) {
    // Hide all slides
    this.slides.forEach(slide => slide.style.opacity = '0');

    // Show selected slide
    const slide = this.slides[index];
    if (slide) {
      slide.style.opacity = '1';
      slide.style.transition = 'opacity 1s ease';
      slide.style.animation = 'zoom 14s ease-in-out both';
    }
  }

  getSlideCount() {
    return this.slides.length;
  }
}

// Single Responsibility: SlideshowController manages slideshow timing and state
class SlideshowController {
  constructor(renderer) {
    this.renderer = renderer;
    this.currentIndex = 0;
    this.intervalId = null;
    this.intervalDuration = 6000; // 6 seconds
  }

  start() {
    if (this.renderer.getSlideCount() <= 1) return;

    this.intervalId = setInterval(() => {
      this.currentIndex = (this.currentIndex + 1) % this.renderer.getSlideCount();
      this.renderer.showSlide(this.currentIndex);
    }, this.intervalDuration);
  }

  stop() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }
}

// Single Responsibility: EventRenderer only handles event display
class EventRenderer {
  constructor(containerSelector) {
    this.container = document.querySelector(containerSelector);
  }

  render(events) {
    if (!this.container || !events) return;

    this.container.innerHTML = events.map(event => `
      <li class="group">
        <a href="https://www.google.com/maps/search/${event.mapSearch}" target="_blank" rel="noopener" class="flex items-start gap-4 bg-white/20 backdrop-blur rounded-xl px-5 py-4 ring-1 ring-white/30 shadow-glow hover:bg-white/30 hover:ring-white/40 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
          <div class="flex flex-col items-center min-w-[60px] text-center">
            <span class="text-xs font-medium text-white/70 uppercase tracking-wide">${event.month}</span>
            <span class="text-2xl font-bold text-white leading-none">${event.day}</span>
          </div>
          <div class="flex-1 space-y-1">
            <div class="text-lg font-semibold text-white leading-tight group-hover:text-white/90">${event.location}</div>
            <div class="text-white/85 text-base font-medium">${event.time}</div>
            <div class="text-xs text-white/60 group-hover:text-white/80 transition-colors">📍 Click for directions</div>
          </div>
        </a>
      </li>
    `).join('');
  }
}

// Dependency Inversion: App depends on abstractions, not implementations
class OyoApp {
  constructor() {
    // Dependency injection - easy to swap implementations
    this.imageDetector = new ImageDetector();
    this.renderer = new SlideshowRenderer('#slides');
    this.controller = new SlideshowController(this.renderer);
    this.eventRenderer = new EventRenderer('#events-list');
  }

  async initialize() {
    try {
      // Set copyright year
      this._updateYear();

      // Render events
      this._renderEvents();

      // Initialize gallery
      await this._initializeGallery();

    } catch (error) {
      console.error('Failed to initialize OyO Dessert app:', error);
    }
  }

  async _initializeGallery() {
    // Detect all available images
    const images = await this.imageDetector.detectAvailableImages();
    
    if (images.length === 0) {
      console.warn('No images found');
      return;
    }

    // Shuffle images for variety
    const shuffledImages = ImageShuffler.shuffle(images);

    // Create slideshow structure
    this.renderer.createSlideshow(shuffledImages);

    // Start slideshow after 6 seconds (let first image show)
    setTimeout(() => {
      this.controller.start();
    }, 6000);
  }

  _updateYear() {
    const yearElement = document.getElementById('year');
    if (yearElement) {
      yearElement.textContent = new Date().getFullYear();
    }
  }

  _renderEvents() {
    if (window.EVENTS) {
      this.eventRenderer.render(window.EVENTS);
    }
  }

  // Public API for external control (if needed)
  pauseSlideshow() {
    this.controller.stop();
  }

  resumeSlideshow() {
    this.controller.start();
  }
}

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
  const app = new OyoApp();
  app.initialize();
  
  // Expose app globally for debugging (development only)
  if (typeof window !== 'undefined') {
    window.oyoApp = app;
  }
});