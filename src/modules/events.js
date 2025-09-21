const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export function initEvents(containerSelector, events, options = {}) {
  const defaults = {
    MAX_EVENTS_TO_SHOW: 999,
    DAYS_AHEAD_LIMIT: 0,
    SHOW_MORE_INDICATOR: false,
    showPastEvents: false
  };

  const config = { ...defaults, ...options };
  const container = document.querySelector(containerSelector);

  if (!container) return false;

  let upcomingEvents = filterEvents(events, config.showPastEvents);

  if (config.DAYS_AHEAD_LIMIT > 0) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const limitDate = new Date(today);
    limitDate.setDate(limitDate.getDate() + config.DAYS_AHEAD_LIMIT);

    upcomingEvents = upcomingEvents.filter(event => {
      const eventDate = new Date(
        event.year || today.getFullYear(),
        MONTHS.indexOf(event.month),
        event.day
      );
      return eventDate <= limitDate;
    });
  }

  const sortedEvents = upcomingEvents.sort(sortByDate);
  const hasMore = sortedEvents.length > config.MAX_EVENTS_TO_SHOW;
  const displayEvents = sortedEvents.slice(0, config.MAX_EVENTS_TO_SHOW);

  if (displayEvents.length === 0) {
    container.innerHTML = `
      <li class="text-center text-white/70 py-8">
        <p class="text-lg">No upcoming events scheduled.</p>
        <p class="text-sm mt-2">Follow us on social media for updates!</p>
      </li>`;
  } else {
    let html = displayEvents.map(createEventHTML).join('');

    if (hasMore && config.SHOW_MORE_INDICATOR) {
      html += `
        <li class="text-center pt-4">
          <p class="text-sm text-white/70 italic">
            ✨ More events coming! Follow our social media for the full schedule.
          </p>
        </li>`;
    }

    container.innerHTML = html;
  }

  return true;
}

function filterEvents(events, showPast = false) {
  if (!Array.isArray(events)) return [];

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return events.filter(event => {
    if (event.status === 'cancelled') return false;
    if (showPast) return true;

    const eventDate = new Date(
      event.year || today.getFullYear(),
      MONTHS.indexOf(event.month),
      event.day
    );
    eventDate.setHours(23, 59, 59, 999);

    return eventDate >= today;
  });
}

function sortByDate(a, b) {
  const year = new Date().getFullYear();
  const dateA = new Date(a.year || year, MONTHS.indexOf(a.month), a.day);
  const dateB = new Date(b.year || year, MONTHS.indexOf(b.month), b.day);
  return dateA - dateB;
}

function createEventHTML(event) {
  const icon = getIcon(event.type);
  const currentYear = new Date().getFullYear();
  const showYear = event.year && event.year !== currentYear;
  const mapUrl = `https://www.google.com/maps/search/${event.mapSearch || event.location}`;

  return `
    <li class="group">
      <a href="${mapUrl}"
         target="_blank"
         rel="noopener"
         class="flex items-start gap-4 bg-white/20 backdrop-blur rounded-xl px-5 py-4 ring-1 ring-white/30 shadow-glow hover:bg-white/30 hover:ring-white/40 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
        <div class="flex flex-col items-center min-w-[60px] text-center">
          <span class="text-xs font-medium text-white/70 uppercase tracking-wide">${event.month}</span>
          <span class="text-2xl font-bold text-white leading-none">${event.day}</span>
          ${showYear ? `<span class="text-xs text-white/60 mt-1">${event.year}</span>` : ''}
        </div>
        <div class="flex-1 space-y-1">
          <div class="flex items-center gap-2">
            <span class="text-lg">${icon}</span>
            <div class="text-lg font-semibold text-white leading-tight group-hover:text-white/90">
              ${event.location}
              ${event.status === 'tentative' ? '<span class="text-xs text-yellow-400/80 ml-2">(Tentative)</span>' : ''}
            </div>
          </div>
          ${event.suburb ? `<div class="text-sm text-white/75 font-medium">${event.suburb}</div>` : ''}
          <div class="text-white/85 text-base font-medium">${event.time}</div>
          ${event.notes ? `<div class="text-xs text-white/70 italic">${event.notes}</div>` : ''}
          <div class="text-xs text-white/60 group-hover:text-white/80 transition-colors">📍 Click for directions</div>
        </div>
      </a>
    </li>`;
}

function getIcon(type) {
  const icons = {
    market: '🛍️',
    popup: '🎪',
    special: '✨',
    festival: '🎉'
  };
  return icons[type] || '📍';
}

export const testHelpers = {
  filterEvents,
  sortByDate,
  getIcon
};