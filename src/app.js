import { initGallery, stopSlideshow } from './modules/gallery.js';
import { initEvents } from './modules/events.js';

class App {
  async init() {
    try {
      if (window.EVENTS) {
        initEvents('#events-list', window.EVENTS, window.EVENT_DISPLAY_CONFIG);
      }

      if (window.GALLERY_CONFIG?.images) {
        initGallery('#slides', window.GALLERY_CONFIG.images, {
          interval: window.GALLERY_CONFIG.slideshow?.intervalMs,
          transition: window.GALLERY_CONFIG.slideshow?.transitionMs,
          kenburns: window.GALLERY_CONFIG.slideshow?.kenBurnsMs,
          startDelay: window.GALLERY_CONFIG.slideshow?.startDelay,
          imageDir: window.GALLERY_CONFIG.imageDirectory,
          imageAlt: window.GALLERY_CONFIG.imageAlt
        });
      }

      const yearEl = document.querySelector('#year');
      if (yearEl) yearEl.textContent = new Date().getFullYear();

    } catch (error) {
      console.error('Failed to initialize app:', error);
    }
  }

  stop() {
    stopSlideshow();
  }
}

if (typeof document !== 'undefined') {
  document.addEventListener('DOMContentLoaded', () => {
    const app = new App();
    app.init();

    if (typeof window !== 'undefined') {
      window.oyoApp = app;
    }
  });
}

export default App;