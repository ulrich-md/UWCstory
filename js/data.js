/*
 * ─────────────────────────────────────────────────────────────
 *  MY JOURNEY · content file — the only file you need to edit.
 *
 *  No words on the page: just photos scattered on a desk.
 *  · Each item in `moments` is one pile of photos (3–7 looks best;
 *    more than 7 is laid out as several piles in a row).
 *  · `when` prints as an orange camera date on the prints, and
 *    `where` is handwritten on the first polaroid. Both show at
 *    the top of the screen while you scroll, and in the viewer.
 *  · `caption` (optional) replaces the handwriting on a polaroid —
 *    keep it to a name or a place, not a sentence.
 *  · `coords` (optional) adds a pin on the map. Use `places` for
 *    a moment that happened in several places.
 *  · `alt` is read aloud by screen readers: describe the photo.
 *  · ⚠ Every photo below is a PLACEHOLDER until the real ones land.
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


  moments: [
    {
      when: "2021 — 2025",
      where: "Tehuacán, Puebla",
      coords: [18.46, -97.39],
      photos: [
        { src: "photos/e1/05.webp", w: 1000, h: 750, alt: "Railway tracks crossing a bridge" },
        { src: "photos/e1/04.webp", w: 1400, h: 933, alt: "Silhouette over a misty city" },
        { src: "photos/e5/02.webp", w: 1400, h: 933, alt: "Person walking toward a sunset" },
        { src: "photos/e3/03.webp", w: 900, h: 900, alt: "Coffee on a wooden table" },
        { src: "photos/e2/03.webp", w: 1000, h: 750, alt: "Brown bear staring at the camera" },
        { src: "photos/e3/02.webp", w: 900, h: 900, alt: "Colourful clothes on a rack" },
      ],
    },
    {
      when: "Aug 2025",
      where: "Santa Ana",
      photos: [
        { src: "photos/e1/01.webp", w: 1000, h: 800, alt: "Two people on a bench facing the sea" },
        { src: "photos/e1/03.webp", w: 900, h: 900, alt: "Green door in a yellow wall" },
        { src: "photos/e1/02.webp", w: 1000, h: 800, alt: "Crowd crossing a busy street" },
        { src: "photos/e6/02.webp", w: 1000, h: 800, alt: "Friends talking in a café" },
        { src: "photos/e2/05.webp", w: 900, h: 900, alt: "Tea being poured into a cup" },
        { src: "photos/e2/04.webp", w: 1000, h: 750, alt: "Black puppy looking up" },
        { src: "photos/e3/03.webp", w: 900, h: 900, alt: "Coffee on a wooden table" },
      ],
    },
    {
      when: "2025",
      where: "Tortuguero Residence",
      photos: [
        { src: "photos/e2/02.webp", w: 1000, h: 750, alt: "Pug wrapped in a blanket on a bed" },
        { src: "photos/e6/04.webp", w: 1000, h: 750, alt: "Walruses piled on a beach" },
        { src: "photos/e4/05.webp", w: 1000, h: 800, alt: "Friend taking a photo" },
        { src: "photos/e2/04.webp", w: 1000, h: 750, alt: "Black puppy looking up" },
        { src: "photos/e3/04.webp", w: 900, h: 900, alt: "Bowl of food from above" },
        { src: "photos/e4/04.webp", w: 1000, h: 800, alt: "Reading in tall grass" },
      ],
    },
    {
      when: "Rainy season",
      where: "Santa Ana",
      photos: [
        { src: "photos/e2/01.webp", w: 1000, h: 750, alt: "Pug wrapped in a blanket in a forest" },
        { src: "photos/e2/03.webp", w: 1000, h: 750, alt: "Brown bear staring at the camera" },
        { src: "photos/e6/05.webp", w: 900, h: 900, alt: "Fresh strawberries" },
        { src: "photos/e4/05.webp", w: 1000, h: 800, alt: "Friend taking a photo" },
        { src: "photos/e5/04.webp", w: 1000, h: 750, alt: "Laptop and notebook on a desk" },
      ],
    },
    {
      when: "2026",
      where: "Santa Ana",
      photos: [
        { src: "photos/e4/03.webp", w: 1000, h: 750, alt: "Vintage film camera" },
        { src: "photos/e1/02.webp", w: 1000, h: 800, alt: "Crowd crossing a busy street" },
        { src: "photos/e2/01.webp", w: 1000, h: 750, alt: "Pug wrapped in a blanket" },
        { src: "photos/e3/02.webp", w: 900, h: 900, alt: "Colourful clothes on a rack" },
        { src: "photos/e6/01.webp", w: 1000, h: 800, alt: "Two friends hugging on a street" },
        { src: "photos/e1/01.webp", w: 1000, h: 800, alt: "Two people on a bench facing the sea" },
      ],
    },
    {
      when: "2025 — 2026",
      where: "Santa Ana",
      photos: [
        { src: "photos/e5/01.webp", w: 1400, h: 933, alt: "Person in a hood facing the sea" },
        { src: "photos/e5/03.webp", w: 1400, h: 933, alt: "Tea cup and flowers on a bed" },
        { src: "photos/e5/04.webp", w: 1000, h: 750, alt: "Laptop and notebook on a desk" },
        { src: "photos/e1/02.webp", w: 1000, h: 800, alt: "Crowd crossing a busy street" },
        { src: "photos/e2/01.webp", w: 1000, h: 750, alt: "Pug wrapped in a blanket in a forest" },
      ],
    },
    {
      when: "2025 — 2026",
      where: "Desamparados",
      coords: [9.88, -84.06],
      photos: [
        { src: "photos/e4/02.webp", w: 1000, h: 750, alt: "Hiker in a misty valley" },
        { src: "photos/e4/04.webp", w: 1000, h: 800, alt: "Reading in tall grass" },
        { src: "photos/e3/05.webp", w: 900, h: 900, alt: "Vegetables on a cutting board" },
        { src: "photos/e1/05.webp", w: 1000, h: 750, alt: "Railway tracks" },
        { src: "photos/e2/02.webp", w: 1000, h: 750, alt: "Pug wrapped in a blanket on a bed" },
        { src: "photos/e3/01.webp", w: 900, h: 900, alt: "Musician on stage under a spotlight" },
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
      photos: [
        { src: "photos/e4/01.webp", w: 1000, h: 800, alt: "Paddling a canoe on a lake", caption: "Guanacaste" },
        { src: "photos/e6/03.webp", w: 1400, h: 933, alt: "Person under the Milky Way", caption: "Puerto Viejo" },
        { src: "photos/e1/01.webp", w: 1000, h: 800, alt: "Two people on a bench" },
        { src: "photos/e1/04.webp", w: 1400, h: 933, alt: "Misty city at dawn", caption: "Cartago" },
        { src: "photos/e6/05.webp", w: 900, h: 900, alt: "Fresh strawberries" },
        { src: "photos/e3/02.webp", w: 900, h: 900, alt: "Colourful clothes on a rack" },
        { src: "photos/e4/02.webp", w: 1000, h: 750, alt: "Hiker in a misty valley" },
        { src: "photos/e5/01.webp", w: 1400, h: 933, alt: "Person in a hood facing the sea" },
      ],
    },
    {
      when: "Sep 2026",
      where: "Santa Ana",
      photos: [
        { src: "photos/e3/01.webp", w: 900, h: 900, alt: "Musician on stage under a spotlight" },
        { src: "photos/e3/02.webp", w: 900, h: 900, alt: "Colourful clothes on a rack" },
        { src: "photos/e3/04.webp", w: 900, h: 900, alt: "Bowl of food from above" },
        { src: "photos/e3/03.webp", w: 900, h: 900, alt: "Coffee on a wooden table" },
        { src: "photos/e4/03.webp", w: 1000, h: 750, alt: "Vintage film camera" },
        { src: "photos/e5/02.webp", w: 1400, h: 933, alt: "Person walking toward a sunset" },
      ],
    },
    {
      when: "Aug 2026",
      where: "Tortuguero Residence",
      photos: [
        { src: "photos/e6/01.webp", w: 1000, h: 800, alt: "Two friends hugging on a street" },
        { src: "photos/e6/02.webp", w: 1000, h: 800, alt: "Friends in a café" },
        { src: "photos/e2/05.webp", w: 900, h: 900, alt: "Tea being poured" },
        { src: "photos/e5/03.webp", w: 1400, h: 933, alt: "Tea cup and flowers on a bed" },
        { src: "photos/e6/04.webp", w: 1000, h: 750, alt: "Walruses piled on a beach" },
      ],
    },
  ],

};
