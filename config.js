/**
 * OYO DESSERT EVENT CONFIGURATION
 */

// Display Configuration - Control how many events show on the website
const EVENT_DISPLAY_CONFIG = {
    MAX_EVENTS_TO_SHOW: 2,        // Maximum number of upcoming events to display
    DAYS_AHEAD_LIMIT: 30,         // Only show events within this many days (0 = no limit)
    SHOW_MORE_INDICATOR: true     // Show "Follow us for more events" when there are hidden events
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
        month: 'Nov',
        day: 23,
        location: 'Southpoint Shopping Centre',
        suburb: 'Hillsdale',
        time: '9:00 AM – 4:00 PM',
        mapSearch: 'Southpoint+Shopping+Centre',
        type: 'shopping centre',
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
    {
        year: 2026,
        month: 'Mar',
        day: 1,
        location: 'Kirribilli Markets',
        suburb: 'North Sydney',
        time: '8:30 AM – 3:00 PM',
        mapSearch: 'Kirribilli+Markets+Sydney',
        type: 'market',
        status: 'confirmed',
    },
    {
        year: 2026,
        month: 'Mar',
        day: 8,
        location: 'Kirribilli Markets',
        suburb: 'North Sydney',
        time: '8:30 AM – 3:00 PM',
        mapSearch: 'Kirribilli+Markets+Sydney',
        type: 'market',
        status: 'confirmed',
    },
];

/**
 * GALLERY CONFIGURATION
 * Manage slideshow images and settings
 */
const GALLERY_CONFIG = {
    // List of image files in assets/images/ directory
    // Images will display in this exact order
    images: [
        'IMG_39.webp',
        'IMG_38.webp',
        'IMG_5.webp',
        'IMG_8.webp',
        'IMG_10.webp',
        'IMG_19.webp',
        'IMG_20.webp',
        'IMG_22.webp',
        'IMG_23.webp',
        'IMG_25.webp',
        'IMG_26.webp',
        'IMG_27.webp',
        'IMG_31.webp',
        'IMG_33.webp',
        'IMG_34.webp',
        'IMG_36.webp',
        'IMG_4.webp',
        'IMG_1.webp'
    ],

    // Slideshow settings
    slideshow: {
        intervalMs: 6000,          // Time between slides (milliseconds)
        transitionMs: 1200,        // Fade transition duration (smooth crossfade)
        kenBurnsMs: 14000,        // Ken Burns zoom effect duration
        startDelay: 6000,         // Delay before starting auto-advance
        preloadCount: 3           // Number of images to preload ahead
    },

    // Image settings
    imageDirectory: './assets/images/',
    imageAlt: 'OyO Dessert - Artisan desserts and sweet treats'
};

// Export for use in the website
if (typeof window !== 'undefined') {
    window.EVENTS = EVENTS;
    window.EVENT_DISPLAY_CONFIG = EVENT_DISPLAY_CONFIG;
    window.GALLERY_CONFIG = GALLERY_CONFIG;
}