/*
 * ─────────────────────────────────────────────────────────────
 *  THE ULRICH FILES · content file
 *  This is the only file you need to edit.
 *
 *  · Each item in `events` becomes:
 *      – a track on the cassette's tracklist
 *      – a polaroid + map pin on the investigation board
 *      – its own "evidence" section further down
 *  · Add, remove or reorder events freely (4–8 works best).
 *  · coords: [latitude, longitude] anywhere in Costa Rica
 *    (Google Maps → right-click a place → copy the numbers).
 *  · layout: "cluster" | "row" | "bag"  (leave empty to rotate).
 *  · The FIRST photo of each event is its cover.
 *  · Notes are handwritten-style: keep them SHORT.
 * ─────────────────────────────────────────────────────────────
 */
window.FILES = {
  name: "Ulrich",
  school: "UWC Costa Rica",
  years: "2024 — 2026",
  caseNo: "UWCCR-2426",
  portrait: { src: "photos/cover/portrait.webp", w: 900, h: 1100, alt: "Portrait of Ulrich holding a vintage camera" },

  /* The "suspect profile" notepad on the board — the 10-second summary */
  profile: [
    ["Subject", "Ulrich"],
    ["Last seen", "UWC Costa Rica"],
    ["Known for", "Making strangers laugh"],
    ["Trusted by", "Friends from 30+ countries"],
    ["Weakness", "Gallo pinto"],
  ],

  events: [
    {
      id: "arrival",
      title: "Arrival",
      date: "Aug 2024",
      place: "Santa Ana",
      coords: [9.93, -84.18],
      headline: "New student arrives with one suitcase, leaves with forty friends",
      note: "Day one. I didn't know anyone's name.",
      chalk: ["who is he?", "??"],
      photos: [
        { src: "photos/e1/01.webp", w: 1000, h: 800, alt: "Two people on a bench facing the sea", caption: "first sunset" },
        { src: "photos/e1/02.webp", w: 1000, h: 800, alt: "Busy street full of people", caption: "lost in San José" },
        { src: "photos/e1/03.webp", w: 900, h: 900, alt: "Green door in a yellow wall", caption: "room 214" },
        { src: "photos/e1/04.webp", w: 1400, h: 933, alt: "Silhouette over a misty city", caption: "the view that week" },
        { src: "photos/e1/05.webp", w: 1000, h: 750, alt: "Railway tracks crossing a bridge", caption: "no way back" },
      ],
    },
    {
      id: "rainy-season",
      title: "Rainy Season",
      date: "Oct 2024",
      place: "Manuel Antonio",
      coords: [9.39, -84.14],
      headline: "Local rain refuses to stop; students build a fort of blankets",
      note: "Forty days of rain. Zero dry socks.",
      chalk: ["suspicious", "ha!"],
      photos: [
        { src: "photos/e2/01.webp", w: 1000, h: 750, alt: "Pug wrapped in a blanket in a forest", caption: "me, 6am assembly" },
        { src: "photos/e2/02.webp", w: 1000, h: 750, alt: "Pug wrapped in a blanket on a bed", caption: "day 41" },
        { src: "photos/e2/03.webp", w: 1000, h: 750, alt: "Brown bear staring at the camera", caption: "when the wifi drops" },
        { src: "photos/e2/04.webp", w: 1000, h: 750, alt: "Black puppy looking up", caption: "'one more episode'" },
        { src: "photos/e2/05.webp", w: 900, h: 900, alt: "Tea being poured into a cup", caption: "survival kit" },
      ],
    },
    {
      id: "culture-night",
      title: "Culture Night",
      date: "Nov 2024",
      place: "Puerto Viejo",
      coords: [9.65, -82.75],
      headline: "Eighteen countries, one stage, zero rehearsals: crowd demands encore",
      note: "Every table had a different grandmother's recipe.",
      chalk: ["!!!", "encore"],
      photos: [
        { src: "photos/e3/01.webp", w: 900, h: 900, alt: "Musician on stage under a spotlight", caption: "the show" },
        { src: "photos/e3/02.webp", w: 900, h: 900, alt: "Colourful clothes on a rack", caption: "costume chaos" },
        { src: "photos/e3/03.webp", w: 900, h: 900, alt: "Coffee on a wooden table", caption: "café chorreado" },
        { src: "photos/e3/04.webp", w: 900, h: 900, alt: "Bowl of food from above", caption: "someone's home" },
        { src: "photos/e3/05.webp", w: 900, h: 900, alt: "Vegetables on a cutting board", caption: "cooking night" },
      ],
    },
    {
      id: "project-week",
      title: "Project Week",
      date: "Mar 2025",
      place: "Monteverde",
      coords: [10.3, -84.82],
      headline: "Group gets lost in cloud forest, finds the way — and each other",
      note: "The map was wrong. We weren't.",
      chalk: ["the team", "→ leader?"],
      photos: [
        { src: "photos/e4/01.webp", w: 1000, h: 800, alt: "Paddling a canoe on a lake", caption: "plan B" },
        { src: "photos/e4/02.webp", w: 1000, h: 750, alt: "Hiker in a misty valley", caption: "cloud forest" },
        { src: "photos/e4/03.webp", w: 1000, h: 750, alt: "Vintage film camera", caption: "documenting it all" },
        { src: "photos/e4/04.webp", w: 1000, h: 800, alt: "Reading in tall grass", caption: "the break" },
        { src: "photos/e4/05.webp", w: 1000, h: 800, alt: "Friend taking a photo", caption: "she shot this one" },
      ],
    },
    {
      id: "the-quiet-month",
      title: "The Quiet Month",
      date: "May 2025",
      place: "Santa Ana",
      coords: [10.02, -84.32],
      headline: "Student learns that asking for help is also a skill",
      note: "The parts I didn't post.",
      chalk: ["?", "important"],
      photos: [
        { src: "photos/e5/01.webp", w: 1400, h: 933, alt: "Person in a hood facing the sea", caption: "homesick" },
        { src: "photos/e5/02.webp", w: 1400, h: 933, alt: "Person walking toward a sunset", caption: "someone listened" },
        { src: "photos/e5/03.webp", w: 1400, h: 933, alt: "Tea cup and flowers on a bed", caption: "rest is brave" },
        { src: "photos/e5/04.webp", w: 1000, h: 750, alt: "Laptop and notebook on a desk", caption: "back to work" },
      ],
    },
    {
      id: "graduation",
      title: "Graduation",
      date: "May 2026",
      place: "Santa Ana",
      coords: [9.86, -84.1],
      headline: "Case closed? Witnesses say the story is just beginning",
      note: "Strangers in August. Family by May.",
      chalk: ["the end?", "♥"],
      photos: [
        { src: "photos/e6/01.webp", w: 1000, h: 800, alt: "Two friends hugging on a street", caption: "the goodbye" },
        { src: "photos/e6/02.webp", w: 1000, h: 800, alt: "Friends in a café", caption: "last sunday crew" },
        { src: "photos/e6/03.webp", w: 1400, h: 933, alt: "Person under the Milky Way", caption: "what's next" },
        { src: "photos/e6/04.webp", w: 1000, h: 750, alt: "Walruses piled on a beach", caption: "the last movie night" },
        { src: "photos/e6/05.webp", w: 900, h: 900, alt: "Fresh strawberries", caption: "one last feria" },
      ],
    },
  ],

  verdict: "Verdict: worth getting to know.",

  /* Liner notes (back of the cassette case) — ask permission for names */
  cast: [
    ["Amara", "Kenya"], ["Mateo", "Argentina"], ["Lina", "Norway"],
    ["Yusuf", "Jordan"], ["Sofía", "Costa Rica"], ["Kenji", "Japan"],
    ["Priya", "India"], ["Elif", "Türkiye"], ["Tomás", "Chile"],
    ["Nia", "Ghana"], ["Lukas", "Germany"], ["Mei", "China"],
  ],
  credits: [
    ["Recorded live at", "UWC Costa Rica"],
    ["Produced by", "Ulrich"],
    ["Catering", "Gallo pinto, every single morning"],
    ["Special thanks", "Everyone who stayed up to talk"],
  ],
};
