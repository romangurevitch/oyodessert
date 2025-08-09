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
Add the filename to SLIDESHOW_IMAGES array.
Images should be in WebP format in assets/images/

Example of adding a new event:
{
  month: 'Oct',
  day: 28,
  location: 'Bondi Markets',
  time: '8:00 AM – 2:00 PM',
  mapSearch: 'Bondi+Markets+Sydney'
}

Example of adding a new image:
Just add 'IMG_38.webp' to the array below.
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

// 🖼️ SLIDESHOW IMAGES CONFIGURATION - Easy to update!
const SLIDESHOW_IMAGES = [
  'IMG_1.webp',
  'IMG_2.webp', 
  'IMG_3.webp',
  'IMG_4.webp',
  'IMG_5.webp',
  'IMG_6.webp'
];

// Export for use in main website (keep this line)
if (typeof window !== 'undefined') {
  window.EVENTS = EVENTS;
  window.SLIDESHOW_IMAGES = SLIDESHOW_IMAGES;
}