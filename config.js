/*
========================================
🍰 OyO Dessert Website Configuration
========================================

This file contains all the data for events and slideshow images.
Edit this file to update the website content!

ADDING EVENTS:
Add a new object to the EVENTS array with:
- month: Short month name (e.g., 'Sep', 'Oct')
- day: Date number
- location: Venue name
- time: Time range in readable format
- mapSearch: Location name for Google Maps (replace spaces with +)

ADDING IMAGES:
Simply add your image files to the assets/images/ directory!
The website will automatically detect and display all images.
Images should be in WebP format and follow the naming pattern IMG_1.webp, IMG_2.webp, etc.

Example of adding a new event:
{
  month: 'Oct',
  day: 28,
  location: 'Bondi Markets',
  time: '8:00 AM – 2:00 PM',
  mapSearch: 'Bondi+Markets+Sydney'
}

Example of adding a new image:
Just drop 'IMG_38.webp' into the assets/images/ folder - no code changes needed!
*/

// 📅 EVENTS CONFIGURATION - Easy to update!
const EVENTS = [
  {
    month: 'Sep',
    day: 6,
    location: 'Southpoint Shopping Centre',  
    time: '9:00 AM – 4:00 PM',
    mapSearch: 'Southpoint+Shopping+Centre+Sydney'
  },
  {
    month: 'Sep', 
    day: 14,
    location: 'Kirribilli Markets',
    time: '8:30 AM – 3:00 PM', 
    mapSearch: 'Kirribilli+Markets+Sydney'
  }
];

// 🖼️ SLIDESHOW IMAGES - Now loaded automatically! 
// No manual configuration needed - just add images to assets/images/
// The website will automatically detect all IMG_*.webp files and display them randomly.

// Export for use in main website (keep this line)
if (typeof window !== 'undefined') {
  window.EVENTS = EVENTS;
  // SLIDESHOW_IMAGES no longer needed - images are loaded dynamically!
}