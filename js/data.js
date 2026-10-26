/*
 * ─────────────────────────────────────────────────────────────
 *  UWCCR — THE FILM · content file
 *  This is the only file you need to edit.
 *  · Replace photos in /photos/<scene>/ (keep the same filenames,
 *    or change the "src" paths below).
 *  · Notes are handwritten-style: keep them SHORT (max ~10 words).
 *  · "alt" describes the photo for screen readers — always fill it.
 * ─────────────────────────────────────────────────────────────
 */
window.FILM = {
  director: "Ulrich",
  school: "UWC Costa Rica",
  place: "Santa Ana, Costa Rica",
  years: "2024 — 2026",
  runtime: "2 min 30 sec",
  portrait: {
    src: "photos/cover/portrait.webp",
    alt: "Portrait of Ulrich holding a vintage camera",
    w: 900, h: 1100,
  },

  scenes: [
    {
      id: "friends",
      number: "01",
      title: "Friends",
      kicker: "the cast",
      mood: "warm",
      note: "Strangers in August. Family by December.",
      layout: "corkboard",
      photos: [
        { src: "photos/friends/01.webp", w: 1000, h: 800, alt: "Two friends sitting on a bench at sunset", caption: "first week" },
        { src: "photos/friends/02.webp", w: 1000, h: 800, alt: "Friends hugging on a city street", caption: "the airport goodbye" },
        { src: "photos/friends/03.webp", w: 1000, h: 800, alt: "Paddling a canoe on a lake", caption: "lake day" },
        { src: "photos/friends/04.webp", w: 1000, h: 800, alt: "Crowd crossing a busy street", caption: "san josé, lost again" },
        { src: "photos/friends/05.webp", w: 1000, h: 800, alt: "People talking in a café", caption: "sunday crew" },
        { src: "photos/friends/06.webp", w: 1000, h: 800, alt: "Reading in tall grass", caption: "quiet company" },
        { src: "photos/friends/07.webp", w: 1000, h: 800, alt: "Friend taking a photo with a film camera", caption: "she shot this one" },
      ],
    },
    {
      id: "humor",
      number: "02",
      title: "Humor",
      kicker: "outtakes",
      mood: "playful",
      note: "Not for theatrical release.",
      layout: "filmstrip",
      photos: [
        { src: "photos/humor/01.webp", w: 1000, h: 750, alt: "Pug wrapped in a blanket in a forest", caption: "me at 6am assembly" },
        { src: "photos/humor/02.webp", w: 1000, h: 750, alt: "Walruses piled on a beach", caption: "dorm, movie night" },
        { src: "photos/humor/03.webp", w: 1000, h: 750, alt: "Black puppy looking up", caption: "after 'one more episode'" },
        { src: "photos/humor/04.webp", w: 1000, h: 750, alt: "Pug wrapped in a blanket on a bed", caption: "rainy season, day 41" },
        { src: "photos/humor/05.webp", w: 1000, h: 750, alt: "Brown bear staring at the camera", caption: "when the wifi drops" },
        { src: "photos/humor/06.webp", w: 1000, h: 750, alt: "Coyote with a suspicious look", caption: "who ate my gallo pinto?" },
      ],
    },
    {
      id: "culture",
      number: "03",
      title: "Culture",
      kicker: "contact sheet",
      mood: "curious",
      note: "Every table had a different grandmother's recipe.",
      layout: "contactsheet",
      selects: [0, 3, 5],
      photos: [
        { src: "photos/culture/01.webp", w: 900, h: 900, alt: "Coffee on a wooden table", caption: "café chorreado" },
        { src: "photos/culture/02.webp", w: 900, h: 900, alt: "Fresh vegetables on a cutting board", caption: "cooking night" },
        { src: "photos/culture/03.webp", w: 900, h: 900, alt: "Colourful clothes on a rack", caption: "culture day fits" },
        { src: "photos/culture/04.webp", w: 900, h: 900, alt: "Musician on stage under a spotlight", caption: "the show" },
        { src: "photos/culture/05.webp", w: 900, h: 900, alt: "Bowl of food from above", caption: "someone's home" },
        { src: "photos/culture/06.webp", w: 900, h: 900, alt: "Fresh strawberries", caption: "feria on saturday" },
        { src: "photos/culture/07.webp", w: 900, h: 900, alt: "Tea being poured", caption: "chai lesson" },
        { src: "photos/culture/08.webp", w: 900, h: 900, alt: "Green door on a yellow wall", caption: "open doors" },
      ],
    },
    {
      id: "vulnerable",
      number: "04",
      title: "Vulnerable",
      kicker: "the quiet reel",
      mood: "quiet",
      note: "The parts I didn't post.",
      layout: "projector",
      photos: [
        { src: "photos/vulnerable/01.webp", w: 1400, h: 933, alt: "Person in a hood facing the sea", caption: "Month two. Homesickness was louder than the music." },
        { src: "photos/vulnerable/02.webp", w: 1400, h: 933, alt: "Silhouette looking over a misty city", caption: "I learned to ask for help. Out loud." },
        { src: "photos/vulnerable/03.webp", w: 1400, h: 933, alt: "Person walking toward a sunset", caption: "Someone listened. Then I learned to listen back." },
        { src: "photos/vulnerable/04.webp", w: 1400, h: 933, alt: "Tea cup and flowers on a bed", caption: "Some days, rest was the bravest thing." },
        { src: "photos/vulnerable/05.webp", w: 1400, h: 933, alt: "Person under the Milky Way", caption: "Small, but not alone." },
      ],
    },
    {
      id: "serious",
      number: "05",
      title: "Serious",
      kicker: "director's notes",
      mood: "focused",
      note: "The work behind the laughter.",
      layout: "slate",
      photos: [
        { src: "photos/serious/01.webp", w: 1000, h: 750, alt: "Vintage typewriter keys", caption: "Wrote the proposal for the student council." },
        { src: "photos/serious/02.webp", w: 1000, h: 750, alt: "Laptop and notebook on a desk", caption: "IB finals. 2am. Still going." },
        { src: "photos/serious/03.webp", w: 1000, h: 750, alt: "Vintage film camera", caption: "Documented our community project." },
        { src: "photos/serious/04.webp", w: 1000, h: 750, alt: "Railway tracks crossing a bridge", caption: "Led the trip. Everyone got home." },
        { src: "photos/serious/05.webp", w: 1000, h: 750, alt: "Hiker standing in a misty valley", caption: "What's next? I'm ready." },
      ],
    },
  ],

  /* End credits — first names + countries. Ask permission first. */
  cast: [
    ["Amara", "Kenya"], ["Mateo", "Argentina"], ["Lina", "Norway"],
    ["Yusuf", "Jordan"], ["Sofía", "Costa Rica"], ["Kenji", "Japan"],
    ["Priya", "India"], ["Elif", "Türkiye"], ["Tomás", "Chile"],
    ["Nia", "Ghana"], ["Lukas", "Germany"], ["Mei", "China"],
  ],
  crew: [
    ["Directed by", "Ulrich"],
    ["Filmed on location", "UWC Costa Rica"],
    ["Catering", "Gallo pinto, every single morning"],
    ["Soundtrack", "Rain on a tin roof"],
    ["Special thanks", "Everyone who stayed up to talk"],
  ],
  disclaimer: "No pugs were harmed in the making of this film.",
};
