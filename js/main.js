/* MY JOURNEY · photos scattered on a desk under a lamp (no dependencies)
 * opening (who) → maps on the desk → moments, one after another → a last note
 */
(() => {
  const D = window.JOURNEY;
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const finePointer = matchMedia("(hover: hover) and (pointer: fine)").matches;
  const esc = (s = "") =>
    String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const pad = (n, l = 2) => String(n).padStart(l, "0");
  const M = D.moments;

  /* ── Shared chrome: HUD, lightbox, lamp light + film grade ── */
  document.body.insertAdjacentHTML(
    "beforeend",
    `<div class="hud" aria-hidden="true">
      <span class="hud__tape"><i class="hud__reel"></i><i class="hud__reel"></i></span>
      <span class="hud__count" id="hudCount">000</span>
      <span class="hud__label" id="hudLabel"></span>
    </div>
    <dialog class="lightbox" id="lightbox" aria-label="Photo viewer">
      <figure class="lightbox__frame"><img id="lb-img" src="" alt="" />
        <figcaption><span class="lightbox__count" id="lb-count"></span><span class="lightbox__cap" id="lb-cap"></span></figcaption>
      </figure>
      <button class="lb-btn lb-btn--prev" id="lb-prev" aria-label="Previous photo">‹</button>
      <button class="lb-btn lb-btn--next" id="lb-next" aria-label="Next photo">›</button>
      <button class="lb-btn lb-btn--close" id="lb-close" aria-label="Close">×</button>
    </dialog>
    <div class="torch" aria-hidden="true"></div>
    <div class="grade" aria-hidden="true"></div>
    <div class="grain" aria-hidden="true"></div>`
  );
  $$("[data-bind]").forEach((el) => {
    const v = D[el.dataset.bind];
    if (v != null) el.textContent = v;
  });
  $("#heroPhoto").src = D.portrait.src;
  $("#heroPhoto").alt = D.portrait.alt;
  $("#thesis").textContent = `“${D.thesis}”`;
  $("#letter").innerHTML = D.letter.map((l) => `<p>${esc(l)}</p>`).join("");

  /* ── Photos + lightbox registry ─────────────────────── */
  const all = [];
  const reg = (p, m, i) => all.push({ ...p, m, i }) - 1;
  const zoom = (gi, p) =>
    `<button class="zoom" type="button" data-open="${gi}" aria-label="Open photo: ${esc(p.alt)}"><img src="${esc(p.src)}" width="${p.w}" height="${p.h}" alt="${esc(p.alt)}" loading="lazy" decoding="async" /></button>`;
  // the orange date an old camera prints in the corner: "8 '25"
  const months = { jan: 1, feb: 2, mar: 3, apr: 4, may: 5, jun: 6, jul: 7, aug: 8, sep: 9, oct: 10, nov: 11, dec: 12 };
  const stampOf = (when = "") => {
    const y = (when.match(/(20\d\d)(?!.*20\d\d)/) || [])[1];
    if (!y) return "";
    const mo = months[(when.match(/[a-z]{3}/i) || [""])[0].toLowerCase()];
    return `${mo ? mo + " " : ""}'${y.slice(2)}`;
  };

  /* ── Maps on the desk (Natural Earth coastlines) ────── */
  const proj = ([lat, lon]) => [(lon + 86.05) * 100, (11.55 - lat) * 100];
  const projLL = ([lon, lat]) => proj([lat, lon]);
  // Catmull-Rom → cubic Bézier, with optional jitter for a sketchy second stroke
  function smooth(points, closed = true, jitter = 0, seed = 1) {
    let s = seed;
    const rnd = () => ((s = (s * 9301 + 49297) % 233280) / 233280 - 0.5) * jitter;
    const p = points.map(([x, y]) => [x + rnd(), y + rnd()]);
    const n = p.length;
    const at = (i) => (closed ? p[(i + n) % n] : p[Math.max(0, Math.min(n - 1, i))]);
    let d = `M${p[0][0].toFixed(1)},${p[0][1].toFixed(1)}`;
    const last = closed ? n : n - 1;
    for (let i = 0; i < last; i++) {
      const p0 = at(i - 1), p1 = at(i), p2 = at(i + 1), p3 = at(i + 2);
      const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
      const c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
      d += ` C${c1[0].toFixed(1)},${c1[1].toFixed(1)} ${c2[0].toFixed(1)},${c2[1].toFixed(1)} ${p2[0].toFixed(1)},${p2[1].toFixed(1)}`;
    }
    return d + (closed ? "Z" : "");
  }
  const inCR = ([lat, lon]) => lat > 8 && lat < 11.4 && lon > -86.2 && lon < -82.4;
  // every place in the photos, once (the campus first)
  const places = [{ place: D.campus.place, coords: D.campus.coords }];
  M.forEach((m) => (m.places || (m.coords ? [{ place: m.where, coords: m.coords }] : [])).forEach((p) => {
    if (!places.some((q) => Math.hypot(q.coords[0] - p.coords[0], q.coords[1] - p.coords[1]) < 0.05)) places.push(p);
  }));
  const dot = (p, x, y, w, h, flip) =>
    `<div class="mpin mpin--dot${flip ? " mpin--flip" : ""}" style="left:${(x / w) * 100}%;top:${(y / h) * 100}%"><span class="mpin__x" aria-hidden="true"></span><span class="mpin__l">${esc(p.place)}</span></div>`;

  (function renderCR() {
    const G = window.GEO;
    const outline = G.cr.map(projLL);
    const neighbours = [...G.nic, ...G.pan].map((run) => `<path class="land land--nb" d="${smooth(run.map(projLL), false)}"/>`).join("");
    const mountains = [[-85.2, 10.75], [-84.95, 10.5], [-84.55, 10.25], [-84.1, 10.05], [-83.8, 9.7], [-83.45, 9.4], [-83.1, 9.15]]
      .map(projLL)
      .map(([x, y], i) => `<path class="mtn" d="M${x - 9},${y + 5} l9,-12 l9,12 ${i % 2 ? `M${x + 4},${y + 5} l6,-8 l6,8` : ""}"/>`)
      .join("");
    const local = places.filter((p) => inCR(p.coords));
    $("#mapSvg").innerHTML = `
      ${neighbours}
      <path class="land land--fill" d="${smooth(outline)}"/>
      <path class="land" d="${smooth(outline, true, 2.2, 3)}"/>
      <path class="land land--2" d="${smooth(outline, true, 3.2, 11)}"/>
      ${mountains}
      <text class="sea" x="40" y="292">Pacific</text>
      <text class="sea" x="250" y="62">Caribbean</text>
      <text class="map-title" x="14" y="348">Costa Rica</text>`;
    // nearby places (campus, Desamparados, Cartago) get their labels fanned out: left, above, below
    const placed = [];
    $("#mapPins").innerHTML = local.map((p) => {
      const [x, y] = proj(p.coords);
      const near = placed.filter(([px, py]) => Math.hypot(px - x, py - y) < 34).length;
      placed.push([x, y]);
      const cls = near === 0 ? "" : near === 1 ? " mpin--above" : " mpin--below";
      return dot(p, x, y, 360, 360, x > 250 || (near === 0 && p === local[0])).replace('class="mpin mpin--dot', `class="mpin mpin--dot${cls}`);
    }).join("");
  })();

  (function renderFlight() {
    const fproj = ([lat, lon]) => [(lon + 101.5) * 18.2, (22.5 - lat) * 18.2];
    const R = window.GEO.region;
    const lands = Object.entries(R)
      .map(([code, runs]) => runs.map((r) => `<path class="land${code === "cri" ? " land--cr" : ""}${r.c ? "" : " land--open"}" d="${smooth(r.p.map(([lon, lat]) => fproj([lat, lon])), r.c)}"/>`).join(""))
      .join("");
    const a = fproj(D.from.coords);
    const b = fproj(D.campus.coords);
    // the arc bows out over the Pacific, like the real flight
    const mx = (a[0] + b[0]) / 2, my = (a[1] + b[1]) / 2;
    const dx = b[0] - a[0], dy = b[1] - a[1];
    const c = [mx - dy * 0.32, my + dx * 0.32];
    const t = 0.55;
    const px = (1 - t) ** 2 * a[0] + 2 * (1 - t) * t * c[0] + t * t * b[0];
    const py = (1 - t) ** 2 * a[1] + 2 * (1 - t) * t * c[1] + t * t * b[1];
    const ang = (Math.atan2(2 * (1 - t) * (c[1] - a[1]) + 2 * t * (b[1] - c[1]), 2 * (1 - t) * (c[0] - a[0]) + 2 * t * (b[0] - c[0])) * 180) / Math.PI;
    const lbl = (txt, lat, lon, cls = "nb") => { const [x, y] = fproj([lat, lon]); return `<text class="${cls}" x="${x}" y="${y}">${txt}</text>`; };
    $("#flightSvg").innerHTML = `
      ${lands}
      ${lbl("MÉXICO", 20.6, -99.6, "nb nb--big")}${lbl("GUATEMALA", 15.9, -91.6)}${lbl("HONDURAS", 14.9, -87.6)}${lbl("NICARAGUA", 12.9, -86.2)}${lbl("COSTA RICA", 10.6, -83.6, "nb nb--cr")}
      ${lbl("Pacific Ocean", 11.2, -97.6, "sea")}${lbl("Caribbean Sea", 17.4, -84.6, "sea")}
      <path class="flight" d="M${a[0]},${a[1]} Q${c[0]},${c[1]} ${b[0]},${b[1]}"/>
      <g class="plane" transform="translate(${px} ${py}) rotate(${ang})"><path d="M10 0 L-6 -3 L-9 -9 L-11 -9 L-8 -2.4 L-13 -2 L-15 -5 L-17 -5 L-15 0 L-17 5 L-15 5 L-13 2 L-8 2.4 L-11 9 L-9 9 L-6 3 Z"/></g>`;
    $("#flightPins").innerHTML = dot(D.from, a[0], a[1], 400, 292, false) + dot(D.campus, b[0], b[1], 400, 292, true);
    // great-circle distance for the little note on the desk
    const rad = (d) => (d * Math.PI) / 180;
    const [la1, lo1] = D.from.coords.map(rad), [la2, lo2] = D.campus.coords.map(rad);
    const km = 6371 * 2 * Math.asin(Math.sqrt(Math.sin((la2 - la1) / 2) ** 2 + Math.cos(la1) * Math.cos(la2) * Math.sin((lo2 - lo1) / 2) ** 2));
    $("#distance").textContent = `${D.from.place} → ${D.campus.place} · ${(Math.round(km / 100) * 100).toLocaleString("en")} km`;
  })();

  /* ── Moments: little collages, no titles ────────────── */
  // slot = [left %, top %, width %, rotation, kind]; kind p = polaroid, r = print, w = wide print
  const T = {
    five: { h: 0.74, slots: [[3, 3, 35, -3, "p"], [40, 0, 29, 3, "r"], [72, 7, 24, -5, "p"], [42, 42, 27, -2, "r"], [24, 60, 18, 6, "p"]], note: [71, 58, 26, 2] },
    four: { h: 0.66, slots: [[1, 20, 30, -4, "r"], [29, 0, 27, 3, "p"], [57, 26, 25, -2, "r"], [78, 4, 21, 5, "p"]], note: [26, 62, 36, -1.5] },
    three: { h: 0.6, slots: [[4, 8, 44, -2, "w"], [50, 0, 24, 4, "p"], [75, 24, 23, -3, "r"]], note: [52, 64, 34, 2] },
  };
  const pick = (n) => (n >= 5 ? T.five : n === 4 ? T.four : T.three);
  const washi = ["a", "b", "c", "d"];
  const propsBetween = [
    { after: 1, src: "flashlight", w: 676, h: 733, side: "r" },
    { after: 3, src: "magnifier", w: 447, h: 975, side: "l" },
    { after: 5, src: "spectacles", w: 773, h: 331, side: "r" },
    { after: 7, src: "camera", w: 749, h: 801, side: "l" },
  ];

  $("#flow").innerHTML = M.map((m, mi) => {
    const t = pick(m.photos.length);
    const flip = mi % 2 === 1; // mirror every other collage so the desk doesn't repeat
    const stamp = stampOf(m.when);
    const items = m.photos.slice(0, t.slots.length).map((p, k) => {
      const gi = reg(p, m, k);
      let [l, tp, w, r, kind] = t.slots[k];
      if (flip) { l = 100 - l - w; r = -r; }
      return `
        <figure class="ph ph--${kind}" style="--l:${l}%;--t:${tp}%;--w:${w}%;--r:${r}deg;--i:${k}">
          ${kind !== "p" ? `<span class="washi washi--${washi[(mi + k) % 4]}" aria-hidden="true"></span>` : ""}
          ${zoom(gi, p)}
          ${kind !== "p" && stamp ? `<span class="ph__date" aria-hidden="true">${esc(stamp)}</span>` : ""}
          ${p.caption ? `<figcaption class="ph__cap">${esc(p.caption)}</figcaption>` : ""}
        </figure>`;
    }).join("");
    // photos beyond the template's slots still open in the viewer
    m.photos.slice(t.slots.length).forEach((p, k) => reg(p, m, t.slots.length + k));
    let [nl, nt, nw, nr] = t.note;
    if (flip) { nl = 100 - nl - nw; nr = -nr; }
    const prop = propsBetween.find((p) => p.after === mi);
    return `
    <section class="mo${flip ? " mo--flip" : ""}" data-i="${mi}" aria-label="${esc([m.when, m.where].filter(Boolean).join(", "))}">
      <div class="mo__collage" style="--h:${t.h}">
        ${items}
        <p class="note" style="--l:${nl}%;--t:${nt}%;--w:${nw}%;--r:${nr}deg">
          <span class="note__meta">${esc([m.when, m.where].filter(Boolean).join(" · "))}</span>
          <span class="note__hand">${esc(m.note)}</span>
        </p>
      </div>
      ${prop ? `<img class="prop prop--side prop--${prop.side}" src="assets/props/${prop.src}.webp" width="${prop.w}" height="${prop.h}" alt="" aria-hidden="true" loading="lazy" decoding="async" />` : ""}
    </section>`;
  }).join("");

  /* ── Reveal: photos drop onto the desk as they come into view ── */
  const io = new IntersectionObserver(
    (entries) =>
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        e.target.classList.add("in");
        io.unobserve(e.target);
      }),
    { rootMargin: "0px 0px -10% 0px", threshold: 0.06 }
  );
  [...$$(".mo"), $(".spread--maps"), $(".spread--end")].forEach((el) => io.observe(el));

  /* ── HUD: just the date of whatever is under the lamp ── */
  const hudLabel = $("#hudLabel");
  const mid = new IntersectionObserver(
    (entries) =>
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        const m = M[+e.target.dataset.i];
        hudLabel.textContent = m ? [m.when, m.where].filter(Boolean).join(" · ").toUpperCase() : e.target.dataset.label || "";
      }),
    { rootMargin: "-50% 0px -50% 0px" }
  );
  $(".spread--maps").dataset.label = "THE WAY HERE";
  $(".spread--end").dataset.label = "SIDE B · SOON";
  [$(".spread--maps"), ...$$(".mo"), $(".spread--end")].forEach((el) => mid.observe(el));

  /* ── Lightbox ───────────────────────────────────────── */
  const lb = $("#lightbox");
  const lbImg = $("#lb-img");
  let cur = 0;
  let lastFocus = null;
  function show(i) {
    cur = (i + all.length) % all.length;
    const p = all[cur];
    lbImg.src = p.src;
    lbImg.alt = p.alt;
    lbImg.width = p.w;
    lbImg.height = p.h;
    $("#lb-cap").textContent = p.caption || p.m.note;
    $("#lb-count").textContent = `${[p.m.when, p.m.where].filter(Boolean).join(" · ").toUpperCase()} · ${p.i + 1}/${p.m.photos.length}`;
  }
  document.addEventListener("click", (e) => {
    const b = e.target.closest("[data-open]");
    if (!b) return;
    lastFocus = b;
    show(+b.dataset.open);
    lb.showModal();
    document.documentElement.classList.add("lb-open");
  });
  lb.addEventListener("close", () => {
    document.documentElement.classList.remove("lb-open");
    lastFocus && lastFocus.focus({ preventScroll: true });
  });
  $("#lb-close").addEventListener("click", () => lb.close());
  $("#lb-prev").addEventListener("click", () => show(cur - 1));
  $("#lb-next").addEventListener("click", () => show(cur + 1));
  lb.addEventListener("click", (e) => e.target === lb && lb.close());
  lb.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft") show(cur - 1);
    if (e.key === "ArrowRight") show(cur + 1);
  });
  let sx = null;
  lb.addEventListener("touchstart", (e) => (sx = e.touches[0].clientX), { passive: true });
  lb.addEventListener("touchend", (e) => {
    if (sx == null) return;
    const dx = e.changedTouches[0].clientX - sx;
    if (Math.abs(dx) > 50) show(cur + (dx < 0 ? 1 : -1));
    sx = null;
  });

  /* ── Desktop extras: cassette tilt + the lamp follows the pointer ── */
  const cassette = $("#cassette");
  cassette.insertAdjacentHTML(
    "afterbegin",
    `<span class="cassette__shadow" aria-hidden="true"></span>` +
      Array.from({ length: 6 }, (_, k) => `<span class="cassette__layer" style="--z:${k + 1}" aria-hidden="true"></span>`).join("")
  );
  if (finePointer && !reduced) {
    $(".deck").addEventListener("pointermove", (e) => {
      const r = cassette.getBoundingClientRect();
      const x = Math.max(-1, Math.min(1, (e.clientX - (r.left + r.width / 2)) / r.width));
      const y = Math.max(-1, Math.min(1, (e.clientY - (r.top + r.height / 2)) / r.height));
      cassette.style.setProperty("--ry", `${x * 7}deg`);
      cassette.style.setProperty("--rx", `${y * -6}deg`);
      cassette.style.setProperty("--mx", `${50 + x * 60}%`);
    });
    const torch = $(".torch");
    let lt = false, lx = 0, ly = 0;
    addEventListener("pointermove", (e) => {
      lx = e.clientX;
      ly = e.clientY;
      if (lt) return;
      lt = true;
      requestAnimationFrame(() => {
        lt = false;
        torch.style.transform = `translate3d(${lx}px, ${ly}px, 0)`;
        document.documentElement.classList.add("has-torch");
      });
    }, { passive: true });
  }

  /* ── Scroll: tape winds from reel to reel ───────────── */
  const reels = $$(".reel", cassette);
  const hud = $(".hud");
  const hudReels = $$(".hud__reel");
  const hudCount = $("#hudCount");
  let spinBoost = 0;
  let ticking = false;
  function frame() {
    ticking = false;
    const max = document.documentElement.scrollHeight - innerHeight;
    const p = Math.min(1, Math.max(0, scrollY / Math.max(1, max)));
    const l = 1 - p * 0.42;
    const r = 0.58 + p * 0.42;
    const base = scrollY * 0.45 + spinBoost;
    reels[0].style.setProperty("--tape", l);
    reels[1].style.setProperty("--tape", r);
    reels[0].style.setProperty("--spin", `${base / l}deg`);
    reels[1].style.setProperty("--spin", `${base / r}deg`);
    hudReels.forEach((h, i) => h.style.setProperty("--spin", `${base / (i ? r : l)}deg`));
    hudCount.textContent = pad(Math.floor(p * 999), 3);
    hud.classList.toggle("is-on", scrollY > innerHeight * 0.5);
  }
  addEventListener("scroll", () => {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(frame);
    }
  }, { passive: true });
  function spin(dir) {
    if (reduced) return;
    const start = performance.now();
    const step = (t) => {
      const k = Math.min(1, (t - start) / 900);
      spinBoost += dir * 26 * (1 - k);
      frame();
      if (k < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }
  $("#play").addEventListener("click", () => spin(1));
  cassette.addEventListener("click", () => spin(1));
  $("#rewind").addEventListener("click", () => spin(-1));
  addEventListener("resize", frame);
  frame();
})();
