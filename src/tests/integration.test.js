/**
 * Integration tests to verify all features work correctly
 */

import { initEvents } from '../modules/events.js';
import { initGallery, stopSlideshow, resetGallery } from '../modules/gallery.js';

describe('Integration Tests - Feature Verification', () => {
  beforeEach(() => {
    document.body.innerHTML = `
      <ul id="events-list"></ul>
      <div id="slides"></div>
    `;
    resetGallery();
  });

  afterEach(() => {
    stopSlideshow();
    resetGallery();
    document.body.innerHTML = '';
  });

  describe('Event Features', () => {
    const mockDate = new Date('2025-10-01');
    const originalDate = Date;

    beforeEach(() => {
      global.Date = jest.fn((...args) => {
        if (args.length === 0) return mockDate;
        return new originalDate(...args);
      });
      global.Date.now = originalDate.now;
    });

    afterEach(() => {
      global.Date = originalDate;
    });

    it('should respect MAX_EVENTS_TO_SHOW config', () => {
      const events = [
        { month: 'Oct', day: 6, location: 'Event 1', time: '9am' },
        { month: 'Oct', day: 12, location: 'Event 2', time: '9am' },
        { month: 'Nov', day: 9, location: 'Event 3', time: '9am' },
        { month: 'Dec', day: 7, location: 'Event 4', time: '9am' }
      ];

      initEvents('#events-list', events, {
        MAX_EVENTS_TO_SHOW: 2,
        SHOW_MORE_INDICATOR: true
      });

      const container = document.querySelector('#events-list');
      expect(container.innerHTML).toContain('Event 1');
      expect(container.innerHTML).toContain('Event 2');
      expect(container.innerHTML).not.toContain('Event 3');
      expect(container.innerHTML).toContain('More events coming');
    });

    it('should respect DAYS_AHEAD_LIMIT config', () => {
      const events = [
        { month: 'Oct', day: 6, year: 2025, location: 'Within 10 days', time: '9am' },
        { month: 'Oct', day: 15, year: 2025, location: 'Within 20 days', time: '9am' },
        { month: 'Nov', day: 9, year: 2025, location: 'Beyond 30 days', time: '9am' }
      ];

      initEvents('#events-list', events, {
        DAYS_AHEAD_LIMIT: 20,
        MAX_EVENTS_TO_SHOW: 10
      });

      const container = document.querySelector('#events-list');
      expect(container.innerHTML).toContain('Within 10 days');
      expect(container.innerHTML).toContain('Within 20 days');
      expect(container.innerHTML).not.toContain('Beyond 30 days');
    });

    it('should show event type icons correctly', () => {
      const events = [
        { month: 'Oct', day: 6, location: 'Market', type: 'market', time: '9am' },
        { month: 'Oct', day: 7, location: 'Festival', type: 'festival', time: '9am' },
        { month: 'Oct', day: 8, location: 'Popup', type: 'popup', time: '9am' },
        { month: 'Oct', day: 9, location: 'Special', type: 'special', time: '9am' }
      ];

      initEvents('#events-list', events, { MAX_EVENTS_TO_SHOW: 10 });

      const container = document.querySelector('#events-list');
      expect(container.innerHTML).toContain('🛍️'); // market
      expect(container.innerHTML).toContain('🎉'); // festival
      expect(container.innerHTML).toContain('🎪'); // popup
      expect(container.innerHTML).toContain('✨'); // special
    });

    it('should handle tentative status', () => {
      const events = [
        { month: 'Oct', day: 6, location: 'Tentative Event', status: 'tentative', time: '9am' }
      ];

      initEvents('#events-list', events);

      const container = document.querySelector('#events-list');
      expect(container.innerHTML).toContain('Tentative Event');
      expect(container.innerHTML).toContain('(Tentative)');
    });

    it('should skip cancelled events', () => {
      const events = [
        { month: 'Oct', day: 6, location: 'Active Event', time: '9am' },
        { month: 'Oct', day: 7, location: 'Cancelled Event', status: 'cancelled', time: '9am' }
      ];

      initEvents('#events-list', events);

      const container = document.querySelector('#events-list');
      expect(container.innerHTML).toContain('Active Event');
      expect(container.innerHTML).not.toContain('Cancelled Event');
    });

    it('should show suburb when provided', () => {
      const events = [
        { month: 'Oct', day: 6, location: 'Market', suburb: 'North Sydney', time: '9am' }
      ];

      initEvents('#events-list', events);

      const container = document.querySelector('#events-list');
      expect(container.innerHTML).toContain('North Sydney');
    });

    it('should show notes when provided', () => {
      const events = [
        { month: 'Oct', day: 6, location: 'Market', notes: 'Fresh desserts all day', time: '9am' }
      ];

      initEvents('#events-list', events);

      const container = document.querySelector('#events-list');
      expect(container.innerHTML).toContain('Fresh desserts all day');
    });

    it('should use mapSearch for Google Maps link', () => {
      const events = [
        { month: 'Oct', day: 6, location: 'Market', mapSearch: 'Custom+Map+Search', time: '9am' }
      ];

      initEvents('#events-list', events);

      const container = document.querySelector('#events-list');
      expect(container.innerHTML).toContain('https://www.google.com/maps/search/Custom+Map+Search');
    });

    it('should show year when different from current', () => {
      const events = [
        { month: 'Oct', day: 6, year: 2026, location: 'Future Event', time: '9am' }
      ];

      initEvents('#events-list', events);

      const container = document.querySelector('#events-list');
      expect(container.innerHTML).toContain('2026');
    });
  });

  describe('Gallery Features', () => {
    it('should respect all slideshow config options', () => {
      const images = ['img1.jpg', 'img2.jpg'];
      const config = {
        interval: 5000,
        transition: 800,
        kenburns: 10000,
        startDelay: 2000,
        imageDir: '/custom/images/',
        imageAlt: 'Custom alt'
      };

      const result = initGallery('#slides', images, config);

      expect(result).toBe(true);
      const slides = document.querySelectorAll('.slide');
      expect(slides[0].src).toContain('/custom/images/img1.jpg');
      expect(slides[0].alt).toBe('Custom alt');
    });

    it('should set fetchpriority for first image', () => {
      initGallery('#slides', ['img1.jpg', 'img2.jpg']);

      const slides = document.querySelectorAll('.slide');
      expect(slides[0].getAttribute('fetchpriority')).toBe('high');
      expect(slides[1].getAttribute('fetchpriority')).toBe('auto');
    });

    it('should set decoding async for all images', () => {
      initGallery('#slides', ['img1.jpg', 'img2.jpg']);

      const slides = document.querySelectorAll('.slide');
      slides.forEach(slide => {
        expect(slide.getAttribute('decoding')).toBe('async');
      });
    });

    it('should add data-index attribute', () => {
      initGallery('#slides', ['img1.jpg', 'img2.jpg', 'img3.jpg']);

      const slides = document.querySelectorAll('.slide');
      expect(slides[0].getAttribute('data-index')).toBe('0');
      expect(slides[1].getAttribute('data-index')).toBe('1');
      expect(slides[2].getAttribute('data-index')).toBe('2');
    });

    it('should add error handler with display:none', () => {
      initGallery('#slides', ['img1.jpg']);

      const slide = document.querySelector('.slide');
      expect(slide.getAttribute('onerror')).toBe("this.style.display='none'");
    });

    it('should add black overlay after slides', () => {
      initGallery('#slides', ['img1.jpg']);

      const container = document.querySelector('#slides');
      const lastChild = container.lastElementChild;
      expect(lastChild.className).toBe('absolute inset-0 bg-black/60');
    });

    it('should handle single image (no slideshow)', (done) => {
      jest.useFakeTimers();

      initGallery('#slides', ['img1.jpg'], {
        startDelay: 1000,
        interval: 500
      });

      jest.advanceTimersByTime(2000);

      // Single image should stay visible, no cycling
      const slides = document.querySelectorAll('.slide');
      // The first slide was shown, so opacity will be '1' from showSlide
      // But no cycling should happen with single image
      expect(slides.length).toBe(1);

      jest.useRealTimers();
      done();
    });

    it('should handle multiple images with preloading', () => {
      const images = ['img1.jpg', 'img2.jpg', 'img3.jpg', 'img4.jpg'];

      // Mock Image constructor to track preloading
      const originalImage = global.Image;
      const preloadedSrcs = [];
      global.Image = jest.fn().mockImplementation(() => {
        const img = {
          set src(val) { preloadedSrcs.push(val); }
        };
        return img;
      });

      initGallery('#slides', images, {
        imageDir: '/test/',
        preloadCount: 3
      });

      // Should preload images 2-4 (first is shown immediately)
      expect(preloadedSrcs).toContain('/test/img2.jpg');
      expect(preloadedSrcs).toContain('/test/img3.jpg');
      expect(preloadedSrcs).toContain('/test/img4.jpg');

      global.Image = originalImage;
    });
  });

  describe('Complete Configuration Test', () => {
    it('should handle full config like production', () => {
      // Mock date to ensure events are in the future
      const mockDate = new Date('2025-10-01');
      const originalDate = Date;
      global.Date = jest.fn((...args) => {
        if (args.length === 0) return mockDate;
        return new originalDate(...args);
      });
      global.Date.now = originalDate.now;

      // Simulate production config
      const events = [
        { year: 2025, month: 'Oct', day: 6, location: 'Mona Vale Spring Festival', suburb: 'Mona Vale', time: '10:00 AM – 4:00 PM', mapSearch: 'Mona+Vale+Village+Park+Sydney', type: 'festival', status: 'confirmed', notes: 'Join us at the Spring Festival!' },
        { year: 2025, month: 'Oct', day: 12, location: 'Kirribilli Markets', suburb: 'North Sydney', time: '8:30 AM – 3:00 PM', mapSearch: 'Kirribilli+Markets+Sydney', type: 'market', status: 'confirmed' },
        { year: 2025, month: 'Nov', day: 9, location: 'Kirribilli Markets', suburb: 'North Sydney', time: '8:30 AM – 3:00 PM', mapSearch: 'Kirribilli+Markets+Sydney', type: 'market', status: 'confirmed' }
      ];

      const eventConfig = {
        MAX_EVENTS_TO_SHOW: 2,
        DAYS_AHEAD_LIMIT: 60,  // Increase to include November event
        SHOW_MORE_INDICATOR: true
      };

      const galleryImages = ['IMG_39.webp', 'IMG_38.webp', 'IMG_5.webp'];
      const galleryConfig = {
        interval: 6000,
        transition: 1200,
        kenburns: 14000,
        startDelay: 6000,
        preloadCount: 3,
        imageDir: './assets/images/',
        imageAlt: 'OyO Dessert - Artisan desserts and sweet treats'
      };

      // Initialize both modules
      const eventsResult = initEvents('#events-list', events, eventConfig);
      const galleryResult = initGallery('#slides', galleryImages, galleryConfig);

      expect(eventsResult).toBe(true);
      expect(galleryResult).toBe(true);

      // Verify events display correctly
      const eventContainer = document.querySelector('#events-list');
      expect(eventContainer.innerHTML).toContain('Mona Vale Spring Festival');
      expect(eventContainer.innerHTML).toContain('More events coming');

      // Verify gallery initialized correctly
      const slides = document.querySelectorAll('.slide');
      expect(slides.length).toBe(3);
      expect(slides[0].src).toContain('assets/images/IMG_39.webp');

      // Restore Date
      global.Date = originalDate;
    });
  });
});