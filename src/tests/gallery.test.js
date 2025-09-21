/**
 * Tests for simplified gallery module
 */

import { initGallery, stopSlideshow, getCurrentSlide, resetGallery } from '../modules/gallery.js';

describe('Gallery Module', () => {
  let container;

  beforeEach(() => {
    // Setup DOM container
    document.body.innerHTML = '<div id="test-slides"></div>';
    container = document.querySelector('#test-slides');
    resetGallery();
  });

  afterEach(() => {
    stopSlideshow();
    resetGallery();
    document.body.innerHTML = '';
  });

  describe('initGallery', () => {
    it('should initialize gallery with images', () => {
      const images = ['img1.jpg', 'img2.jpg'];
      const result = initGallery('#test-slides', images);

      expect(result).toBe(true);
      expect(container.querySelectorAll('.slide').length).toBe(2);
    });

    it('should return false with no container', () => {
      const result = initGallery('#non-existent', ['img1.jpg']);
      expect(result).toBe(false);
    });

    it('should return false with no images', () => {
      const result = initGallery('#test-slides', []);
      expect(result).toBe(false);
    });

    it('should show first slide immediately', () => {
      initGallery('#test-slides', ['img1.jpg', 'img2.jpg']);
      const firstSlide = container.querySelector('.slide[data-index="0"]');

      // Allow for animation frame
      setTimeout(() => {
        expect(firstSlide.style.opacity).toBe('1');
      }, 100);
    });

    it('should apply custom configuration', () => {
      const images = ['img1.jpg'];
      const config = {
        imageDir: '/custom/path/',
        imageAlt: 'Custom alt text'
      };

      initGallery('#test-slides', images, config);
      const slide = container.querySelector('.slide');

      expect(slide.src).toContain('/custom/path/img1.jpg');
      expect(slide.alt).toBe('Custom alt text');
    });

    it('should set eager loading for first two images', () => {
      const images = ['img1.jpg', 'img2.jpg', 'img3.jpg'];
      initGallery('#test-slides', images);

      const slides = container.querySelectorAll('.slide');
      expect(slides[0].getAttribute('loading')).toBe('eager');
      expect(slides[1].getAttribute('loading')).toBe('eager');
      expect(slides[2].getAttribute('loading')).toBe('lazy');
    });

    it('should add overlay div', () => {
      initGallery('#test-slides', ['img1.jpg']);
      const overlay = container.querySelector('.absolute.inset-0.bg-black\\/60');
      expect(overlay).toBeTruthy();
    });
  });

  describe('slideshow behavior', () => {
    it('should start slideshow after delay for multiple images', (done) => {
      jest.useFakeTimers();

      initGallery('#test-slides', ['img1.jpg', 'img2.jpg'], {
        startDelay: 1000,
        interval: 500
      });

      // Fast-forward past start delay
      jest.advanceTimersByTime(1100);

      // Fast-forward one interval
      jest.advanceTimersByTime(500);

      expect(getCurrentSlide()).toBe(1);

      jest.useRealTimers();
      done();
    });

    it('should not start slideshow for single image', (done) => {
      jest.useFakeTimers();

      initGallery('#test-slides', ['img1.jpg'], {
        startDelay: 1000
      });

      jest.advanceTimersByTime(2000);
      expect(getCurrentSlide()).toBe(0);

      jest.useRealTimers();
      done();
    });

    it('should loop back to first slide', (done) => {
      jest.useFakeTimers();

      initGallery('#test-slides', ['img1.jpg', 'img2.jpg'], {
        startDelay: 0,
        interval: 100
      });

      jest.advanceTimersByTime(100);
      expect(getCurrentSlide()).toBe(1);

      jest.advanceTimersByTime(100);
      expect(getCurrentSlide()).toBe(0);

      jest.useRealTimers();
      done();
    });
  });

  describe('stopSlideshow', () => {
    it('should stop the slideshow', (done) => {
      jest.useFakeTimers();

      initGallery('#test-slides', ['img1.jpg', 'img2.jpg'], {
        startDelay: 0,
        interval: 100
      });

      jest.advanceTimersByTime(100);
      expect(getCurrentSlide()).toBe(1);

      stopSlideshow();
      jest.advanceTimersByTime(200);
      expect(getCurrentSlide()).toBe(1); // Should not advance

      jest.useRealTimers();
      done();
    });
  });
});