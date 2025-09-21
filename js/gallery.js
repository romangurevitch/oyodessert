/**
 * Simplified Gallery Slideshow
 * Uses static configuration from config.js
 */

class GallerySlideshow {
    constructor(containerSelector) {
        this.container = document.querySelector(containerSelector);
        this.config = window.GALLERY_CONFIG || this.getDefaultConfig();
        this.slides = [];
        this.currentIndex = 0;
        this.intervalId = null;
        this.preloadedImages = new Set();
    }

    getDefaultConfig() {
        return {
            images: [],
            slideshow: {
                intervalMs: 6000,
                transitionMs: 1000,
                kenBurnsMs: 14000,
                startDelay: 6000,
                preloadCount: 3
            },
            imageDirectory: './assets/images/',
            imageAlt: 'OyO Dessert'
        };
    }

    initialize() {
        if (!this.container || !this.config.images.length) return;

        // Use images directly from config - no shuffling
        this.createSlides(this.config.images);
        this.showSlide(0);
        this.preloadUpcomingImages();

        if (this.config.images.length > 1) {
            setTimeout(() => this.startSlideshow(), this.config.slideshow.startDelay);
        }
    }

    createSlides(images) {
        const slidesHTML = images.map((img, index) => {
            const loading = index < 2 ? 'eager' : 'lazy';
            const fetchPriority = index === 0 ? 'high' : 'auto';

            return `<img
                class="absolute inset-0 w-full h-full object-cover slide"
                src="${this.config.imageDirectory}${img}"
                alt="${this.config.imageAlt}"
                loading="${loading}"
                fetchpriority="${fetchPriority}"
                decoding="async"
                style="opacity: 0; will-change: opacity, transform;"
                data-index="${index}"
                onerror="this.style.display='none'">`;
        }).join('');

        this.container.innerHTML = slidesHTML + '<div class="absolute inset-0 bg-black/60"></div>';
        this.slides = Array.from(this.container.querySelectorAll('.slide'));
    }

    showSlide(index) {
        if (!this.slides[index]) return;

        const previousSlide = this.slides[this.currentIndex];
        const nextSlide = this.slides[index];
        const transitionMs = this.config.slideshow.transitionMs;
        const kenBurnsMs = this.config.slideshow.kenBurnsMs;

        // Fade out previous slide smoothly without disrupting its animation
        if (previousSlide && previousSlide !== nextSlide) {
            previousSlide.style.transition = `opacity ${transitionMs}ms ease-in-out`;
            previousSlide.style.opacity = '0';

            // Clean up after transition completes
            setTimeout(() => {
                if (previousSlide.style.opacity === '0') {
                    previousSlide.style.animation = '';
                }
            }, transitionMs);
        }

        // Prepare and show next slide
        nextSlide.style.transition = `opacity ${transitionMs}ms ease-out`;

        // Use requestAnimationFrame for smooth animation start
        requestAnimationFrame(() => {
            nextSlide.style.opacity = '1';
            // Only apply Ken Burns if not already animating
            if (!nextSlide.style.animation) {
                nextSlide.style.animation = `zoom ${kenBurnsMs}ms ease-in-out both`;
            }
        });

        this.currentIndex = index;
        this.preloadUpcomingImages();
    }

    preloadUpcomingImages() {
        const preloadCount = this.config.slideshow.preloadCount;

        for (let i = 1; i <= preloadCount; i++) {
            const nextIndex = (this.currentIndex + i) % this.slides.length;
            const nextSlide = this.slides[nextIndex];

            if (nextSlide && !this.preloadedImages.has(nextIndex)) {
                const img = new Image();
                img.src = nextSlide.src;
                this.preloadedImages.add(nextIndex);
            }
        }
    }

    startSlideshow() {
        if (this.intervalId) return;

        this.intervalId = setInterval(() => {
            const nextIndex = (this.currentIndex + 1) % this.slides.length;
            this.showSlide(nextIndex);
        }, this.config.slideshow.intervalMs);
    }

    stopSlideshow() {
        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = null;
        }
    }
}

class EventRenderer {
    constructor(containerSelector) {
        this.container = document.querySelector(containerSelector);
        this.monthOrder = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    }

    render(events) {
        if (!this.container) return;

        const displayConfig = window.EVENT_DISPLAY_CONFIG || {
            MAX_EVENTS_TO_SHOW: 999,
            DAYS_AHEAD_LIMIT: 0,
            SHOW_MORE_INDICATOR: false
        };

        const result = this.filterAndSortEvents(events, displayConfig);
        const filteredEvents = result.events;

        if (filteredEvents.length === 0) {
            this.container.innerHTML = `
                <li class="text-center text-white/70 py-8">
                    <p class="text-lg">No upcoming events scheduled.</p>
                    <p class="text-sm mt-2">Follow us on social media for updates!</p>
                </li>
            `;
            return;
        }

        let eventsHTML = filteredEvents.map(event => this.renderEvent(event)).join('');

        if (result.hasMore) {
            eventsHTML += `
                <li class="text-center pt-4">
                    <p class="text-sm text-white/70 italic">
                        ✨ More events coming! Follow our social media for the full schedule.
                    </p>
                </li>
            `;
        }

        this.container.innerHTML = eventsHTML;
    }

    filterAndSortEvents(events, config) {
        if (!events || !Array.isArray(events)) return { events: [], hasMore: false };

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // Filter out past and cancelled events
        let upcomingEvents = events.filter(event => {
            if (event.status === 'cancelled') return false;

            const eventDate = new Date(
                event.year || today.getFullYear(),
                this.monthOrder.indexOf(event.month),
                event.day
            );
            eventDate.setHours(23, 59, 59, 999);

            return eventDate >= today;
        });

        // Apply days ahead limit if configured
        if (config.DAYS_AHEAD_LIMIT > 0) {
            const limitDate = new Date(today);
            limitDate.setDate(limitDate.getDate() + config.DAYS_AHEAD_LIMIT);

            upcomingEvents = upcomingEvents.filter(event => {
                const eventDate = new Date(
                    event.year || today.getFullYear(),
                    this.monthOrder.indexOf(event.month),
                    event.day
                );
                return eventDate <= limitDate;
            });
        }

        // Sort chronologically
        upcomingEvents.sort((a, b) => {
            const dateA = new Date(
                a.year || today.getFullYear(),
                this.monthOrder.indexOf(a.month),
                a.day
            );
            const dateB = new Date(
                b.year || today.getFullYear(),
                this.monthOrder.indexOf(b.month),
                b.day
            );
            return dateA - dateB;
        });

        const hasMoreEvents = upcomingEvents.length > config.MAX_EVENTS_TO_SHOW;
        const eventsToShow = upcomingEvents.slice(0, config.MAX_EVENTS_TO_SHOW);

        return {
            events: eventsToShow,
            hasMore: hasMoreEvents && config.SHOW_MORE_INDICATOR,
            totalUpcoming: upcomingEvents.length
        };
    }

    renderEvent(event) {
        const isTentative = event.status === 'tentative';
        const eventIcon = this.getEventTypeIcon(event.type);
        const currentYear = new Date().getFullYear();

        return `
            <li class="group">
                <a href="https://www.google.com/maps/search/${event.mapSearch}"
                   target="_blank"
                   rel="noopener"
                   class="flex items-start gap-4 bg-white/20 backdrop-blur rounded-xl px-5 py-4 ring-1 ring-white/30 shadow-glow hover:bg-white/30 hover:ring-white/40 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                    <div class="flex flex-col items-center min-w-[60px] text-center">
                        <span class="text-xs font-medium text-white/70 uppercase tracking-wide">${event.month}</span>
                        <span class="text-2xl font-bold text-white leading-none">${event.day}</span>
                        ${event.year && event.year !== currentYear ? `<span class="text-xs text-white/60 mt-1">${event.year}</span>` : ''}
                    </div>
                    <div class="flex-1 space-y-1">
                        <div class="flex items-center gap-2">
                            <span class="text-lg">${eventIcon}</span>
                            <div class="text-lg font-semibold text-white leading-tight group-hover:text-white/90">
                                ${event.location}
                                ${isTentative ? '<span class="text-xs text-yellow-400/80 ml-2">(Tentative)</span>' : ''}
                            </div>
                        </div>
                        ${event.suburb ? `<div class="text-sm text-white/75 font-medium">${event.suburb}</div>` : ''}
                        <div class="text-white/85 text-base font-medium">${event.time}</div>
                        ${event.notes ? `<div class="text-xs text-white/70 italic">${event.notes}</div>` : ''}
                        <div class="text-xs text-white/60 group-hover:text-white/80 transition-colors">📍 Click for directions</div>
                    </div>
                </a>
            </li>
        `;
    }

    getEventTypeIcon(type) {
        const icons = {
            market: '🛍️',
            popup: '🎪',
            special: '✨',
            festival: '🎉'
        };
        return icons[type] || '📍';
    }
}

// Initialize app on DOM ready
document.addEventListener('DOMContentLoaded', function () {
    // Update year in footer
    const yearElement = document.getElementById('year');
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }

    // Initialize gallery slideshow
    const gallery = new GallerySlideshow('#slides');
    gallery.initialize();

    // Render events
    const eventRenderer = new EventRenderer('#events-list');
    if (window.EVENTS) {
        eventRenderer.render(window.EVENTS);
    }

    // Expose gallery for debugging if needed
    if (typeof window !== 'undefined') {
        window.oyoGallery = gallery;
    }
});