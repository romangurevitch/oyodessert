/**
 * Tests for simplified events module
 */

import { initEvents, testHelpers } from '../modules/events.js';

const { filterEvents, sortByDate, getIcon } = testHelpers;

describe('Events Module', () => {
  let container;

  beforeEach(() => {
    document.body.innerHTML = '<ul id="test-events"></ul>';
    container = document.querySelector('#test-events');
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  describe('initEvents', () => {
    it('should display events in container', () => {
      const events = [
        { month: 'Nov', day: 15, location: 'Test Market', time: '9am-5pm' }
      ];

      const result = initEvents('#test-events', events);
      expect(result).toBe(true);
      expect(container.innerHTML).toContain('Test Market');
      expect(container.innerHTML).toContain('Nov');
      expect(container.innerHTML).toContain('15');
    });

    it('should return false with no container', () => {
      const result = initEvents('#non-existent', []);
      expect(result).toBe(false);
    });

    it('should show empty state with no events', () => {
      initEvents('#test-events', []);
      expect(container.innerHTML).toContain('No upcoming events scheduled');
    });

    it('should limit number of events', () => {
      const events = [
        { month: 'Nov', day: 15, location: 'Market 1', time: '9am' },
        { month: 'Nov', day: 16, location: 'Market 2', time: '9am' },
        { month: 'Nov', day: 17, location: 'Market 3', time: '9am' }
      ];

      initEvents('#test-events', events, { MAX_EVENTS_TO_SHOW: 2 });

      expect(container.innerHTML).toContain('Market 1');
      expect(container.innerHTML).toContain('Market 2');
      expect(container.innerHTML).not.toContain('Market 3');
    });

    it('should show more events indicator', () => {
      const events = [
        { month: 'Nov', day: 15, location: 'Market 1', time: '9am' },
        { month: 'Nov', day: 16, location: 'Market 2', time: '9am' },
        { month: 'Nov', day: 17, location: 'Market 3', time: '9am' }
      ];

      initEvents('#test-events', events, {
        MAX_EVENTS_TO_SHOW: 2,
        SHOW_MORE_INDICATOR: true
      });

      expect(container.innerHTML).toContain('More events coming');
    });
  });

  describe('filterEvents', () => {
    const mockDate = new Date('2024-11-10');
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

    it('should filter out past events', () => {
      const events = [
        { month: 'Nov', day: 5, location: 'Past' },
        { month: 'Nov', day: 15, location: 'Future' }
      ];

      const filtered = filterEvents(events);
      expect(filtered.length).toBe(1);
      expect(filtered[0].location).toBe('Future');
    });

    it('should filter out cancelled events', () => {
      const events = [
        { month: 'Nov', day: 15, location: 'Active' },
        { month: 'Nov', day: 16, location: 'Cancelled', status: 'cancelled' }
      ];

      const filtered = filterEvents(events);
      expect(filtered.length).toBe(1);
      expect(filtered[0].location).toBe('Active');
    });

    it('should include past events when showPast is true', () => {
      const events = [
        { month: 'Nov', day: 5, location: 'Past' },
        { month: 'Nov', day: 15, location: 'Future' }
      ];

      const filtered = filterEvents(events, true);
      expect(filtered.length).toBe(2);
    });

    it('should handle empty array', () => {
      expect(filterEvents([])).toEqual([]);
    });

    it('should handle non-array input', () => {
      expect(filterEvents(null)).toEqual([]);
      expect(filterEvents(undefined)).toEqual([]);
    });
  });

  describe('sortByDate', () => {
    it('should sort events chronologically', () => {
      const events = [
        { month: 'Dec', day: 1 },
        { month: 'Nov', day: 15 },
        { month: 'Nov', day: 20 }
      ];

      const sorted = [...events].sort(sortByDate);

      expect(sorted[0].day).toBe(15);
      expect(sorted[1].day).toBe(20);
      expect(sorted[2].day).toBe(1);
    });

    it('should handle events with explicit years', () => {
      const events = [
        { month: 'Jan', day: 1, year: 2025 },
        { month: 'Dec', day: 31, year: 2024 }
      ];

      const sorted = [...events].sort(sortByDate);

      expect(sorted[0].year).toBe(2024);
      expect(sorted[1].year).toBe(2025);
    });
  });

  describe('getIcon', () => {
    it('should return correct icons for event types', () => {
      expect(getIcon('market')).toBe('🛍️');
      expect(getIcon('popup')).toBe('🎪');
      expect(getIcon('special')).toBe('✨');
      expect(getIcon('festival')).toBe('🎉');
    });

    it('should return default icon for unknown type', () => {
      expect(getIcon('unknown')).toBe('📍');
      expect(getIcon()).toBe('📍');
    });
  });

  describe('event rendering', () => {
    it('should show tentative status', () => {
      const events = [
        { month: 'Nov', day: 15, location: 'Test', time: '9am', status: 'tentative' }
      ];

      initEvents('#test-events', events);
      expect(container.innerHTML).toContain('(Tentative)');
    });

    it('should show year when different from current', () => {
      const currentYear = new Date().getFullYear();
      const differentYear = currentYear + 1;
      const events = [
        { month: 'Nov', day: 15, location: 'Test', time: '9am', year: differentYear }
      ];

      initEvents('#test-events', events);
      expect(container.innerHTML).toContain(differentYear.toString());
    });

    it('should include suburb if provided', () => {
      const events = [
        { month: 'Nov', day: 15, location: 'Test', suburb: 'Sydney', time: '9am' }
      ];

      initEvents('#test-events', events);
      expect(container.innerHTML).toContain('Sydney');
    });

    it('should include notes if provided', () => {
      const events = [
        { month: 'Nov', day: 15, location: 'Test', time: '9am', notes: 'Special event' }
      ];

      initEvents('#test-events', events);
      expect(container.innerHTML).toContain('Special event');
    });

    it('should create map links', () => {
      const events = [
        { month: 'Nov', day: 15, location: 'Test Market', time: '9am', mapSearch: 'Custom+Search' }
      ];

      initEvents('#test-events', events);
      expect(container.innerHTML).toContain('https://www.google.com/maps/search/Custom+Search');
    });
  });
});