const EVENTS = [
    {
        month: 'Sep',
        day: 6,
        location: 'Southpoint Shopping Centre',
        suburb: 'Hillsdale',
        time: '9:00 AM – 4:00 PM',
        mapSearch: 'Southpoint+Shopping+Centre+Sydney'
    },
    {
        month: 'Sep',
        day: 14,
        location: 'Kirribilli Markets',
        suburb: 'North Sydney',
        time: '8:30 AM – 3:00 PM',
        mapSearch: 'Kirribilli+Markets+Sydney'
    }
];
if (typeof window !== 'undefined') {
    window.EVENTS = EVENTS;
}