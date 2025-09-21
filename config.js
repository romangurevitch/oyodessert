/**
 * OYO DESSERT EVENT CONFIGURATION
 * ================================
 *
 * This file contains all upcoming events where OyO Dessert will be selling.
 * To add a new event, simply copy an existing event object and modify the values.
 *
 * IMPORTANT: Events are automatically filtered and sorted by date.
 * Past events are automatically hidden from the website.
 * Only the next few upcoming events are shown to keep the website focused.
 *
 * EVENT FIELDS:
 * -------------
 * year:        (required) Event year, e.g., 2024, 2025
 * month:       (required) Month abbreviation: Jan, Feb, Mar, Apr, May, Jun, Jul, Aug, Sep, Oct, Nov, Dec
 * day:         (required) Day of month (1-31)
 * location:    (required) Main venue/market name
 * suburb:      (optional) Suburb or area name
 * time:        (required) Operating hours, e.g., "9:00 AM – 4:00 PM"
 * mapSearch:   (required) Google Maps search query (use + for spaces)
 * type:        (optional) Event type: "market", "popup", "special", "festival"
 * status:      (optional) Event status: "confirmed", "tentative", "cancelled" (default: "confirmed")
 * notes:       (optional) Special notes or instructions for customers
 * recurring:   (optional) For regular events: "weekly", "monthly", "fortnightly"
 *
 * EXAMPLES ARE PROVIDED BELOW
 */

// Display Configuration - Control how many events show on the website
const EVENT_DISPLAY_CONFIG = {
    MAX_EVENTS_TO_SHOW: 2,        // Maximum number of upcoming events to display
    DAYS_AHEAD_LIMIT: 30,         // Only show events within this many days (0 = no limit)
    SHOW_MORE_INDICATOR: true     // Show "Follow us for more events" when there are hidden events
};

// Gallery Configuration - Static list of images for better performance
const GALLERY_CONFIG = {
    // List your best dessert photos here (keep it under 8 for performance)
    images: [
        'IMG_1.webp',   // Hero image - always show first
        'IMG_2.webp',
        'IMG_10.webp',
        'IMG_14.webp',
        'IMG_17.webp',
        'IMG_19.webp',
        'IMG_30.webp',
        'IMG_33.webp'
    ],

    // Slideshow settings
    slideDuration: 6000,      // Time per slide in milliseconds
    transitionDuration: 1200,  // Fade transition time in milliseconds
    shuffle: false,            // Set to true to randomize order (except first image)
    preloadCount: 2           // Number of images to preload for faster initial display
};

const EVENTS = [
    {
        year: 2025,
        month: 'Oct',
        day: 6,
        location: 'Mona Vale Spring Festival',
        suburb: 'Mona Vale',
        time: '10:00 AM – 4:00 PM',
        mapSearch: 'Mona+Vale+Village+Park+Sydney',
        type: 'festival',
        status: 'confirmed',
        notes: 'Join us at the Spring Festival! Fresh desserts all day.'
    },

    {
        year: 2025,
        month: 'Oct',
        day: 12,
        location: 'Kirribilli Markets',
        suburb: 'North Sydney',
        time: '8:30 AM – 3:00 PM',
        mapSearch: 'Kirribilli+Markets+Sydney',
        type: 'market',
        status: 'confirmed',
    },

    {
        year: 2025,
        month: 'Nov',
        day: 9,
        location: 'Kirribilli Markets',
        suburb: 'North Sydney',
        time: '8:30 AM – 3:00 PM',
        mapSearch: 'Kirribilli+Markets+Sydney',
        type: 'market',
        status: 'confirmed',
    },

    {
        year: 2025,
        month: 'Dec',
        day: 7,
        location: 'Kirribilli Markets',
        suburb: 'North Sydney',
        time: '8:30 AM – 3:00 PM',
        mapSearch: 'Kirribilli+Markets+Sydney',
        type: 'market',
        status: 'confirmed',
    },

    {
        year: 2025,
        month: 'Dec',
        day: 14,
        location: 'Kirribilli Markets',
        suburb: 'North Sydney',
        time: '8:30 AM – 3:00 PM',
        mapSearch: 'Kirribilli+Markets+Sydney',
        type: 'market',
        status: 'confirmed',
    },

];

// Export for use in the website
if (typeof window !== 'undefined') {
    window.EVENTS = EVENTS;
    window.EVENT_DISPLAY_CONFIG = EVENT_DISPLAY_CONFIG;
    window.GALLERY_CONFIG = GALLERY_CONFIG;
}