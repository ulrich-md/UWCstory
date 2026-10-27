/*
 * ─────────────────────────────────────────────────────────────
 *  MY JOURNEY · content file
 *  This is the only file you need to edit.
 *
 *  · Each item in `events` becomes:
 *      – a track on the cassette's tracklist
 *      – a polaroid + pin on the map board (home page)
 *      – its own page: stop.html?id=<id>
 *  · Add, remove or reorder events freely.
 *  · coords: [latitude, longitude]
 *    (Google Maps → right-click a place → copy the numbers).
 *    Stops inside Costa Rica go on the Costa Rica map; anything
 *    outside (like Tehuacán) goes on the flight map above it.
 *    Stops in the same place share one pin (e.g. Santa Ana).
 *  · layout: "cluster" | "row" | "bag"  (leave empty to rotate).
 *  · The FIRST photo of each event is its cover.
 *  · Notes are handwritten-style: keep them SHORT.
 * ─────────────────────────────────────────────────────────────
 */
window.JOURNEY = {
  title: "My Journey",
  from: { place: "Tehuacán, Puebla", coords: [18.46, -97.39] },
  name: "Ulrich",
  school: "UWC Costa Rica",
  years: "2024 — 2026",
  portrait: { src: "photos/cover/portrait.webp", w: 900, h: 1100, alt: "Portrait of Ulrich holding a vintage camera" },

  /* The "traveler profile" notepad on the board — the 10-second summary */
  profile: [
    ["Name", "Ulrich"],
    ["Based in", "UWC Costa Rica"],
    ["Known for", "Making strangers laugh"],
    ["Trusted by", "Friends from 30+ countries"],
    ["Weakness", "Gallo pinto"],
  ],

  events: [
    {
      id: "tehuacan",
      title: "Leaving Tehuacán",
      date: "Aug 2024",
      place: "Tehuacán, Puebla",
      coords: [18.46, -97.39],
      headline: "Local student packs one suitcase, leaves Tehuacán for two years in Costa Rica",
      note: "One suitcase. Two years. No idea what was coming.",
      chalk: ["home", "✈"],
      photos: [
        { src: "photos/e1/05.webp", w: 1000, h: 750, alt: "Railway tracks crossing a bridge", caption: "last morning at home" },
        { src: "photos/e1/04.webp", w: 1400, h: 933, alt: "Silhouette looking over a misty city", caption: "the view I left" },
        { src: "photos/e5/02.webp", w: 1400, h: 933, alt: "Person walking toward a sunset", caption: "here we go" },
      ],
    },
    {
      id: "residence",
      title: "Home Away From Home",
      date: "Sep 2024",
      place: "Santa Ana",
      coords: [9.93, -84.18],
      headline: "Room full of strangers declared a family by unanimous vote",
      note: "My residence: the people I came home to every night.",
      chalk: ["home #2", "!!"],
      photos: [
        { src: "photos/e1/03.webp", w: 900, h: 900, alt: "Green door in a yellow wall", caption: "our door" },
        { src: "photos/e6/02.webp", w: 1000, h: 800, alt: "Friends talking in a café", caption: "sunday crew" },
        { src: "photos/e2/02.webp", w: 1000, h: 750, alt: "Pug wrapped in a blanket on a bed", caption: "movie night" },
        { src: "photos/e2/05.webp", w: 900, h: 900, alt: "Tea being poured into a cup", caption: "3am talks" },
      ],
    },
    {
      id: "bald-for-a-cause",
      title: "Bald for a Cause",
      date: "Nov 2024",
      place: "Santa Ana",
      coords: [9.93, -84.18],
      headline: "Students shave their heads for a cause; campus runs out of hats",
      note: "We shaved it all off. It grew back. The money stayed.",
      chalk: ["brave?", "ha!"],
      photos: [
        { src: "photos/e2/03.webp", w: 1000, h: 750, alt: "Brown bear staring at the camera", caption: "before" },
        { src: "photos/e4/05.webp", w: 1000, h: 800, alt: "Friend taking a photo with a camera", caption: "the moment" },
        { src: "photos/e2/01.webp", w: 1000, h: 750, alt: "Pug wrapped in a blanket in a forest", caption: "after (cold)" },
        { src: "photos/e1/02.webp", w: 1000, h: 800, alt: "Crowd crossing a busy street", caption: "the whole school came" },
      ],
    },
    {
      id: "axiom",
      title: "Axiom",
      date: "Feb 2025",
      place: "Santa Ana",
      coords: [9.93, -84.18],
      headline: "Investment rookies pitch to the judges and survive the questions",
      note: "Axiom: my first investment competition. Spreadsheets at 2am.",
      chalk: ["the pitch", "→ $$$"],
      photos: [
        { src: "photos/e5/04.webp", w: 1000, h: 750, alt: "Laptop and notebook on a desk", caption: "the model" },
        { src: "photos/e4/03.webp", w: 1000, h: 750, alt: "Vintage film camera on a piano", caption: "pitch day" },
        { src: "photos/e2/04.webp", w: 1000, h: 750, alt: "Black puppy looking up", caption: "waiting for results" },
      ],
    },
    {
      id: "culture-night",
      title: "Culture Night",
      date: "Mar 2025",
      place: "Santa Ana",
      coords: [9.93, -84.18],
      headline: "Eighteen countries, one stage, zero rehearsals: crowd demands encore",
      note: "Every table had a different grandmother's recipe.",
      chalk: ["!!!", "encore"],
      photos: [
        { src: "photos/e3/01.webp", w: 900, h: 900, alt: "Musician on stage under a spotlight", caption: "the dance" },
        { src: "photos/e3/02.webp", w: 900, h: 900, alt: "Colourful clothes on a rack", caption: "costume chaos" },
        { src: "photos/e3/04.webp", w: 900, h: 900, alt: "Bowl of food from above", caption: "someone's home" },
        { src: "photos/e3/03.webp", w: 900, h: 900, alt: "Coffee on a wooden table", caption: "café chorreado" },
      ],
    },
    {
      id: "guanacaste",
      title: "Guanacaste",
      date: "Apr 2025",
      place: "Guanacaste",
      coords: [10.45, -85.45],
      headline: "Group trip ends with sunburn and forty new inside jokes",
      note: "Sunsets, dust roads and the loudest bus in Costa Rica.",
      chalk: ["sunburn", "→"],
      photos: [
        { src: "photos/e1/01.webp", w: 1000, h: 800, alt: "Two friends on a bench at sunset", caption: "first sunset" },
        { src: "photos/e4/01.webp", w: 1000, h: 800, alt: "Paddling a canoe on a lake", caption: "plan B" },
        { src: "photos/e6/04.webp", w: 1000, h: 750, alt: "Walruses piled on a beach", caption: "us at the beach" },
        { src: "photos/e4/04.webp", w: 1000, h: 800, alt: "Reading in tall grass", caption: "the break" },
      ],
    },
    {
      id: "puerto-viejo",
      title: "Puerto Viejo",
      date: "Jul 2025",
      place: "Puerto Viejo",
      coords: [9.65, -82.75],
      headline: "Caribbean weekend: students learn the rhythm, forget the time",
      note: "Rice and beans with coconut. I'm never going back.",
      chalk: ["pura vida", "♫"],
      photos: [
        { src: "photos/e6/05.webp", w: 900, h: 900, alt: "Fresh strawberries", caption: "the market" },
        { src: "photos/e3/05.webp", w: 900, h: 900, alt: "Vegetables on a cutting board", caption: "cooking lesson" },
        { src: "photos/e6/03.webp", w: 1400, h: 933, alt: "Person under the Milky Way", caption: "the stars there" },
      ],
    },
    {
      id: "cartago",
      title: "Cartago",
      date: "Sep 2025",
      place: "Cartago",
      coords: [9.86, -83.92],
      headline: "Volunteers spend the weekend building, painting and listening",
      note: "Community work in Cartago. We came to help; we learned more.",
      chalk: ["important", "→ us"],
      photos: [
        { src: "photos/e4/02.webp", w: 1000, h: 750, alt: "Hiker standing in a misty valley", caption: "the road up" },
        { src: "photos/e5/03.webp", w: 1400, h: 933, alt: "Tea cup and flowers on a bed", caption: "the family we met" },
        { src: "photos/e5/01.webp", w: 1400, h: 933, alt: "Person in a hood facing the sea", caption: "thinking about it" },
      ],
    },
    {
      id: "graduation",
      title: "Graduation",
      date: "May 2026",
      place: "Santa Ana",
      coords: [9.93, -84.18],
      headline: "Journey complete? Witnesses say the story is just beginning",
      note: "Strangers in August. Family by May.",
      chalk: ["the end?", "♥"],
      photos: [
        { src: "photos/e6/01.webp", w: 1000, h: 800, alt: "Two friends hugging on a street", caption: "the goodbye" },
        { src: "photos/e1/01.webp", w: 1000, h: 800, alt: "Two people on a bench facing the sea", caption: "one last sunset" },
        { src: "photos/e6/03.webp", w: 1400, h: 933, alt: "Person under the Milky Way", caption: "what's next" },
      ],
    },
  ],

  nextStop: "Next stop: university.",

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
