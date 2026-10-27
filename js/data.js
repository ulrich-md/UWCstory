/*
 * ─────────────────────────────────────────────────────────────
 *  MY JOURNEY · content file — the only file you need to edit.
 *
 *  One page, ~2 minutes. Each item in `stops` becomes a pin on
 *  the map, a line in the map legend and a block on the page.
 *
 *  · coords: [latitude, longitude]. Stops in Costa Rica go on the
 *    Costa Rica map; anything else (Tehuacán) on the flight map.
 *  · `places` (instead of coords) = one block with several pins,
 *    e.g. weekend trips.
 *  · `line`: 1–2 sentences in your own voice. This is what the
 *    officer actually reads — keep it short and specific.
 *  · `fact`: one number or detail, shown as a sticker (optional).
 *  · The FIRST photo is the big one; the rest open in the viewer.
 *  · ⚠ Photos and dates marked TODO are still placeholders.
 * ─────────────────────────────────────────────────────────────
 */
window.JOURNEY = {
  title: "My Journey",
  name: "Ulrich Mohrhardt Doger",
  short: "Ulrich",
  school: "UWC Costa Rica",
  years: "2025 — 2027",
  meta: ["UWC Costa Rica · Class of 2027", "Grieg Scholar", "From Tehuacán, Puebla"],
  from: { place: "Tehuacán, Puebla", coords: [18.46, -97.39] },
  portrait: { src: "photos/cover/portrait.webp", w: 760, h: 950, alt: "Ulrich smiling in a black jacket in front of the UWC Costa Rica sign" },

  /* The hero sentence. Draft — change it until it sounds like you. */
  thesis: "In the band back home, it never mattered how well I played if the person next to me was off.",
  thesisSub: "Two years in Costa Rica have mostly been about that same thing.",

  stops: [
    {
      id: "tehuacan",
      title: "Tehuacán",
      date: "2021 — 2025",
      place: "Tehuacán, Puebla",
      coords: [18.46, -97.39],
      line: "Four years as lead saxophone in my school's marching band. The section only sounded good when everyone did, and that was my job.",
      fact: "lead sax · 4 years",
      photos: [ // TODO: your photos from home / the band
        { src: "photos/e1/05.webp", w: 1000, h: 750, alt: "Railway tracks crossing a bridge", caption: "home" },
        { src: "photos/e1/04.webp", w: 1400, h: 933, alt: "Silhouette looking over a misty city", caption: "the last morning" },
      ],
    },
    {
      id: "arrival",
      title: "Arrival",
      date: "Aug 2025",
      place: "Santa Ana",
      coords: [9.93, -84.18],
      line: "One suitcase, a full scholarship and two hundred classmates from more than seventy countries.",
      fact: "Grieg Scholar · 1 of 9",
      photos: [ // TODO
        { src: "photos/e1/01.webp", w: 1000, h: 800, alt: "Two people on a bench facing the sea", caption: "first week" },
        { src: "photos/e1/03.webp", w: 900, h: 900, alt: "Green door in a yellow wall", caption: "my door" },
      ],
    },
    {
      id: "axiom",
      title: "Team Axiom",
      date: "Sep 2025 — Feb 2026",
      place: "Santa Ana",
      coords: [9.93, -84.18],
      line: "Six students, six countries, one portfolio for the Wharton competition. Our first idea failed the backtest, so we started over.",
      fact: "+26% in 6 months",
      photos: [ // TODO
        { src: "photos/e5/04.webp", w: 1000, h: 750, alt: "Laptop and notebook on a desk", caption: "2am, the model" },
        { src: "photos/e4/03.webp", w: 1000, h: 750, alt: "Vintage film camera", caption: "pitch day" },
      ],
    },
    {
      id: "bald-for-a-cause",
      title: "Bald for a Cause",
      date: "2026", // TODO: month
      place: "Santa Ana",
      coords: [9.93, -84.18],
      line: "We shaved our heads so our hair could become wigs for people going through cancer treatment. It grew back. That was the point.",
      fact: "hair donated",
      photos: [ // TODO
        { src: "photos/e2/03.webp", w: 1000, h: 750, alt: "Brown bear staring at the camera", caption: "before" },
        { src: "photos/e4/05.webp", w: 1000, h: 800, alt: "Friend taking a photo with a camera", caption: "after" },
      ],
    },
    {
      id: "agents-of-change",
      title: "Agents of Change",
      date: "2025 — 2026", // TODO
      place: "Desamparados",
      coords: [9.88, -84.06],
      line: "A camp at Parque La Libertad with kids who already had the drive. We only brought the tools — and mostly watched.",
      fact: "facilitator",
      photos: [ // TODO
        { src: "photos/e4/02.webp", w: 1000, h: 750, alt: "Hiker standing in a misty valley", caption: "camp day" },
        { src: "photos/e5/02.webp", w: 1400, h: 933, alt: "Person walking toward a sunset", caption: "the kids' ideas" },
      ],
    },
    {
      id: "supernova",
      title: "SUPERNOVA",
      date: "2025 — 2027",
      place: "Los Anonos, Escazú",
      coords: [9.94, -84.12],
      line: "Computers rebuilt from e-waste, handed over with lessons. A computer does very little until someone shows you how to use it.",
      fact: "chapter cofounder",
      photos: [ // TODO
        { src: "photos/e4/04.webp", w: 1000, h: 800, alt: "Reading in tall grass", caption: "Los Anonos" },
        { src: "photos/e5/03.webp", w: 1400, h: 933, alt: "Tea cup and flowers on a bed", caption: "first boot" },
      ],
    },
    {
      id: "weekends",
      title: "Weekends away",
      date: "2025 — 2026",
      place: "Guanacaste · Puerto Viejo · Cartago",
      places: [
        { name: "Guanacaste", coords: [10.45, -85.45] },
        { name: "Puerto Viejo", coords: [9.65, -82.75] },
        { name: "Cartago", coords: [9.86, -83.92] },
      ],
      line: "The other half of the education: long bus rides, rice and beans, and friends I'll have for life.",
      photos: [ // TODO: one photo per place works best
        { src: "photos/e4/01.webp", w: 1000, h: 800, alt: "Paddling a canoe on a lake", caption: "Guanacaste" },
        { src: "photos/e6/05.webp", w: 900, h: 900, alt: "Fresh strawberries", caption: "Puerto Viejo" },
        { src: "photos/e1/02.webp", w: 1000, h: 800, alt: "Crowd crossing a busy street", caption: "Cartago" },
      ],
    },
    {
      id: "residence",
      title: "Tortuguero Residence",
      date: "Aug 2026",
      place: "Santa Ana",
      coords: [9.93, -84.18],
      line: "A year ago I was the one arriving. Now I'm the Resident Assistant who is still awake at 11pm when someone is homesick.",
      fact: "15 first-years · 12+ countries",
      photos: [ // TODO
        { src: "photos/e6/02.webp", w: 1000, h: 800, alt: "Friends talking in a café", caption: "our first night" },
        { src: "photos/e2/02.webp", w: 1000, h: 750, alt: "Pug wrapped in a blanket on a bed", caption: "movie night" },
      ],
    },
    {
      id: "central-american-week",
      title: "Central American Week",
      date: "Sep 2026",
      place: "Santa Ana",
      coords: [9.93, -84.18],
      line: "Project manager for a week of music, food and history. Thirty volunteers didn't have to listen to me, so every part had to feel like theirs.",
      fact: "30 volunteers · 1 week",
      photos: [ // TODO
        { src: "photos/e3/01.webp", w: 900, h: 900, alt: "Musician on stage under a spotlight", caption: "the dance" },
        { src: "photos/e3/04.webp", w: 900, h: 900, alt: "Bowl of food from above", caption: "someone's grandmother's recipe" },
        { src: "photos/e3/02.webp", w: 900, h: 900, alt: "Colourful clothes on a rack", caption: "costumes" },
      ],
    },
  ],

  /* Closing: three things you're taking with you (short!) */
  takeaways: [
    "Make the people around you sound good.",
    "Start over when the evidence says so.",
    "Be there at 11pm.",
  ],
  nextStop: "Next stop: university.",
  credits: "Photos by my friends at UWC Costa Rica. Site designed and built by me.",
};
