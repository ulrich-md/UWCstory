/*
 * ─────────────────────────────────────────────────────────────
 *  MY JOURNEY · content file — the only file you need to edit.
 *
 *  This is NOT the activity list. No titles, no numbers, no roles:
 *  just moments, people and how they felt. One continuous scroll.
 *
 *  · Each item in `moments` is a little collage of 3–5 photos
 *    plus ONE handwritten note. That note is the only text.
 *  · `when` and `where` show as a small typed line on the note
 *    (and the date is "printed" on the photos, like an old camera).
 *  · `coords` (optional) adds a pin on the map. Use `places` for
 *    a moment that happened in several places.
 *  · The first photo is the biggest one in the collage.
 *  · ⚠ Every photo and note below is a DRAFT. Keep only what is
 *    true, and rewrite the notes until they sound like you.
 * ─────────────────────────────────────────────────────────────
 */
window.JOURNEY = {
  title: "My Journey",
  name: "Ulrich Mohrhardt Doger",
  short: "Ulrich",
  years: "2025 — 2027",
  line: "UWC Costa Rica · 2025 — 2027 · from Tehuacán, Puebla",
  from: { place: "Tehuacán", coords: [18.46, -97.39] },
  campus: { place: "Santa Ana", coords: [9.93, -84.18] },
  portrait: { src: "photos/cover/portrait.webp", w: 760, h: 950, alt: "Ulrich smiling in a black jacket in front of the UWC Costa Rica sign" },

  /* The sentence on the first screen. Draft — make it yours. */
  thesis: "In the band back home, it never mattered how well I played if the person next to me was off.",

  moments: [
    {
      when: "2021 — 2025",
      where: "Tehuacán, Puebla",
      coords: [18.46, -97.39],
      note: "Home. Four years of lead sax in the school band. If the person next to me was off, so was I.",
      photos: [
        { src: "photos/e1/05.webp", w: 1000, h: 750, alt: "Railway tracks crossing a bridge", caption: "home" },
        { src: "photos/e1/04.webp", w: 1400, h: 933, alt: "Silhouette over a misty city", caption: "my street" },
        { src: "photos/e5/02.webp", w: 1400, h: 933, alt: "Person walking toward a sunset", caption: "band practice" },
        { src: "photos/e3/03.webp", w: 900, h: 900, alt: "Coffee on a wooden table", caption: "mamá's kitchen" },
      ],
    },
    {
      when: "Aug 2025",
      where: "Santa Ana",
      note: "One suitcase, two hundred new faces. I didn't know a single name.",
      photos: [
        { src: "photos/e1/01.webp", w: 1000, h: 800, alt: "Two people on a bench facing the sea", caption: "first week" },
        { src: "photos/e1/03.webp", w: 900, h: 900, alt: "Green door in a yellow wall", caption: "my door" },
        { src: "photos/e1/02.webp", w: 1000, h: 800, alt: "Crowd crossing a busy street", caption: "orientation" },
        { src: "photos/e6/02.webp", w: 1000, h: 800, alt: "Friends talking in a café", caption: "first friends" },
        { src: "photos/e2/05.webp", w: 900, h: 900, alt: "Tea being poured into a cup", caption: "first night" },
      ],
    },
    {
      when: "2025",
      where: "Tortuguero Residence",
      note: "The people I came home to every night. Most of what I learned here, I learned in this hallway.",
      photos: [
        { src: "photos/e2/02.webp", w: 1000, h: 750, alt: "Pug wrapped in a blanket on a bed", caption: "movie night" },
        { src: "photos/e6/04.webp", w: 1000, h: 750, alt: "Walruses piled on a beach", caption: "us, every sunday" },
        { src: "photos/e4/05.webp", w: 1000, h: 800, alt: "Friend taking a photo", caption: "she took most of these" },
        { src: "photos/e2/04.webp", w: 1000, h: 750, alt: "Black puppy looking up", caption: "3am" },
      ],
    },
    {
      when: "Rainy season",
      where: "Santa Ana",
      note: "Day 41 of rain. We stopped pretending to be dry and just laughed about it.",
      photos: [
        { src: "photos/e2/01.webp", w: 1000, h: 750, alt: "Pug wrapped in a blanket in a forest", caption: "me, 6am" },
        { src: "photos/e2/03.webp", w: 1000, h: 750, alt: "Brown bear staring at the camera", caption: "when the wifi dies" },
        { src: "photos/e6/05.webp", w: 900, h: 900, alt: "Fresh strawberries", caption: "snack run" },
      ],
    },
    {
      when: "2026",
      where: "Santa Ana",
      note: "We shaved our heads so our hair could become wigs for people with cancer. It was cold for a month.",
      photos: [
        { src: "photos/e4/03.webp", w: 1000, h: 750, alt: "Vintage film camera", caption: "before" },
        { src: "photos/e1/02.webp", w: 1000, h: 800, alt: "Crowd crossing a busy street", caption: "everyone came" },
        { src: "photos/e2/01.webp", w: 1000, h: 750, alt: "Pug wrapped in a blanket", caption: "after (cold)" },
        { src: "photos/e3/02.webp", w: 900, h: 900, alt: "Colourful clothes on a rack", caption: "hats, everywhere" },
      ],
    },
    {
      when: "Some weeks",
      where: "",
      note: "Not every week was good. Some nights I just needed someone to stay up with me — and someone did.",
      photos: [
        { src: "photos/e5/01.webp", w: 1400, h: 933, alt: "Person in a hood facing the sea", caption: "" },
        { src: "photos/e5/03.webp", w: 1400, h: 933, alt: "Tea cup and flowers on a bed", caption: "" },
        { src: "photos/e5/04.webp", w: 1000, h: 750, alt: "Laptop and notebook on a desk", caption: "" },
      ],
    },
    {
      when: "2025 — 2026",
      where: "Desamparados",
      coords: [9.88, -84.06],
      note: "The kids at Parque La Libertad already had the ideas. We brought markers and mostly watched.",
      photos: [
        { src: "photos/e4/02.webp", w: 1000, h: 750, alt: "Hiker in a misty valley", caption: "camp" },
        { src: "photos/e4/04.webp", w: 1000, h: 800, alt: "Reading in tall grass", caption: "their plan" },
        { src: "photos/e3/05.webp", w: 900, h: 900, alt: "Vegetables on a cutting board", caption: "lunch" },
        { src: "photos/e1/05.webp", w: 1000, h: 750, alt: "Railway tracks", caption: "the walk back" },
      ],
    },
    {
      when: "Weekends",
      where: "Guanacaste · Puerto Viejo · Cartago",
      places: [
        { place: "Guanacaste", coords: [10.45, -85.45] },
        { place: "Puerto Viejo", coords: [9.65, -82.75] },
        { place: "Cartago", coords: [9.86, -83.92] },
      ],
      note: "The loudest buses in Costa Rica, rice and beans with coconut, and the Caribbean at 6am.",
      photos: [
        { src: "photos/e4/01.webp", w: 1000, h: 800, alt: "Paddling a canoe on a lake", caption: "Guanacaste" },
        { src: "photos/e6/03.webp", w: 1400, h: 933, alt: "Person under the Milky Way", caption: "Puerto Viejo" },
        { src: "photos/e1/01.webp", w: 1000, h: 800, alt: "Two people on a bench", caption: "sunset, again" },
        { src: "photos/e1/04.webp", w: 1400, h: 933, alt: "Misty city at dawn", caption: "Cartago" },
        { src: "photos/e6/05.webp", w: 900, h: 900, alt: "Fresh strawberries", caption: "the feria" },
      ],
    },
    {
      when: "Sep 2026",
      where: "Santa Ana",
      note: "Central American Week. I danced badly in front of the whole school, and I'd do it again.",
      photos: [
        { src: "photos/e3/01.webp", w: 900, h: 900, alt: "Musician on stage under a spotlight", caption: "the dance" },
        { src: "photos/e3/02.webp", w: 900, h: 900, alt: "Colourful clothes on a rack", caption: "costumes" },
        { src: "photos/e3/04.webp", w: 900, h: 900, alt: "Bowl of food from above", caption: "the food" },
        { src: "photos/e3/03.webp", w: 900, h: 900, alt: "Coffee on a wooden table", caption: "after" },
      ],
    },
    {
      when: "Aug 2026",
      where: "Tortuguero Residence",
      note: "A year later, I'm the one still awake at 11pm when someone new is homesick.",
      photos: [
        { src: "photos/e6/01.webp", w: 1000, h: 800, alt: "Two friends hugging on a street", caption: "welcome" },
        { src: "photos/e6/02.webp", w: 1000, h: 800, alt: "Friends in a café", caption: "the new ones" },
        { src: "photos/e2/05.webp", w: 900, h: 900, alt: "Tea being poured", caption: "11pm" },
      ],
    },
  ],

  /* The last note on the desk. */
  letter: [
    "That's the tape so far.",
    "None of it fits in an essay, so I left it on the table instead.",
    "Side B is still being recorded.",
  ],
  signature: "— Ulrich",
};
