/* MY JOURNEY · one-page renderer + interactions (no dependencies)
 * 1 who (hero) → 2 the route (maps) → 3 the stops → 4 what I'm taking with me
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
  const S = D.stops;
  const half = Math.ceil(S.length / 2);
  const sideOf = (i) => (i < half ? "A" : "B");
  const anchor = (st) => `#stop-${st.id}`;

  /* ── Shared chrome: svg filters, HUD, lightbox, light + film grade ── */
  document.body.insertAdjacentHTML(
    "afterbegin",
    `<svg class="defs" aria-hidden="true" focusable="false" width="0" height="0"><defs>
      <filter id="rough"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="4" result="n"/><feDisplacementMap in="SourceGraphic" in2="n" scale="2.4"/></filter>
    </defs></svg>`
  );
  document.body.insertAdjacentHTML(
    "beforeend",
    `<div class="hud" aria-hidden="true">
      <span class="hud__tape"><i class="hud__reel"></i><i class="hud__reel"></i></span>
      <span class="hud__side" id="hudSide">SIDE A</span>
      <span class="hud__count" id="hudCount">000</span>
      <span class="hud__label" id="hudLabel">INTRO</span>
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

  /* ── Photos + lightbox registry ─────────────────────── */
  const all = [];
  const reg = (p, st, i) => all.push({ ...p, st, i }) - 1;
  const img = (p) =>
    `<img src="${esc(p.src)}" width="${p.w}" height="${p.h}" alt="${esc(p.alt)}" loading="lazy" decoding="async" />`;
  const zoom = (gi, inner) =>
    `<button class="zoom" type="button" data-open="${gi}" aria-label="Open photo: ${esc(all[gi].alt)}">${inner}</button>`;
  const pin = (k) => `<span class="pin pin--${["red", "green", "yellow"][k % 3]}" aria-hidden="true"></span>`;

  /* ── Hero ───────────────────────────────────────────── */
  $("#heroPhoto").src = D.portrait.src;
  $("#heroPhoto").alt = D.portrait.alt;
  $("#heroMeta").innerHTML = D.meta.map((m) => `<li>${esc(m)}</li>`).join("");
  $("#thesis").textContent = `“${D.thesis}”`;
  $("#thesisSub").textContent = D.thesisSub;
  $("#stopCount").textContent = S.length;

  /* ── Maps (Natural Earth coastlines) ────────────────── */
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
  // every point on the map: a stop, or one place of a multi-place stop
  const spots = S.flatMap((st, i) =>
    st.places ? st.places.map((pl) => ({ i, name: pl.name, coords: pl.coords })) : [{ i, name: st.place, coords: st.coords }]
  );
  const badge = (i) =>
    `<a class="mpin__x" href="${anchor(S[i])}" data-mpin="${i}" aria-label="Stop ${i + 1}: ${esc(S[i].title)}">${i + 1}</a>`;

  (function renderCR() {
    const G = window.GEO;
    const outline = G.cr.map(projLL);
    const neighbours = [...G.nic, ...G.pan].map((run) => `<path class="land land--nb" d="${smooth(run.map(projLL), false)}"/>`).join("");
    const mountains = [[-85.2, 10.75], [-84.95, 10.5], [-84.55, 10.25], [-84.1, 10.05], [-83.8, 9.7], [-83.45, 9.4], [-83.1, 9.15]]
      .map(projLL)
      .map(([x, y], i) => `<path class="mtn" d="M${x - 9},${y + 5} l9,-12 l9,12 ${i % 2 ? `M${x + 4},${y + 5} l6,-8 l6,8` : ""}"/>`)
      .join("");
    const local = spots.filter((p) => inCR(p.coords));
    $("#mapSvg").innerHTML = `
      ${neighbours}
      <text class="nb" x="70" y="14">NICARAGUA</text>
      <text class="nb" transform="translate(352 300) rotate(-90)">PANAMÁ</text>
      <path class="land land--fill" d="${smooth(outline)}"/>
      <path class="land" d="${smooth(outline, true, 2.2, 3)}"/>
      <path class="land land--2" d="${smooth(outline, true, 3.2, 11)}"/>
      ${mountains}
      <path class="route" d="${smooth(local.map((p) => proj(p.coords)), false)}"/>
      <text class="sea" x="40" y="292">Pacific</text>
      <text class="sea" x="250" y="62">Caribbean</text>
      <g class="compass" transform="translate(320 140)">
        <circle r="18"/><circle r="12" class="c2"/>
        <path d="M0,-26 L4,0 L0,26 L-4,0Z" class="needle"/><path d="M-26,0 L0,3.5 L26,0 L0,-3.5Z" class="needle needle--h"/>
        <text y="-30" text-anchor="middle">N</text>
      </g>
      <text class="map-title" x="14" y="348">Costa Rica</text>`;
    // points in the same place (the campus) share one pin, numbers stacked upwards
    const groups = [];
    local.forEach((p) => {
      const g = groups.find((g) => Math.hypot(g.coords[0] - p.coords[0], g.coords[1] - p.coords[1]) < 0.08);
      if (g) { if (!g.items.includes(p.i)) g.items.push(p.i); }
      else groups.push({ coords: p.coords, name: p.name, items: [p.i] });
    });
    $("#mapPins").innerHTML = groups.map((g) => {
      const [x, y] = proj(g.coords);
      const stack = g.items.length > 2;
      return `<div class="mpin${x > 250 || stack ? " mpin--flip" : ""}${stack ? " mpin--stack" : ""}" style="left:${(x / 360) * 100}%;top:${(y / 360) * 100}%">
        <span class="mpin__badges">${g.items.map(badge).join("")}</span><span class="mpin__l">${esc(g.name)}</span></div>`;
    }).join("");
  })();

  (function renderFlight() {
    const fproj = ([lat, lon]) => [(lon + 101.5) * 18.2, (22.5 - lat) * 18.2];
    const R = window.GEO.region;
    const lands = Object.entries(R)
      .map(([code, runs]) => runs.map((r) => `<path class="land${code === "cri" ? " land--cr" : ""}${r.c ? "" : " land--open"}" d="${smooth(r.p.map(([lon, lat]) => fproj([lat, lon])), r.c)}"/>`).join(""))
      .join("");
    const a = fproj(D.from.coords);
    const firstCR = spots.find((p) => inCR(p.coords));
    const b = fproj(firstCR ? firstCR.coords : [9.93, -84.18]);
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
      ${lbl("Pacific Ocean", 11.2, -97.6, "sea")}${lbl("Caribbean Sea", 17.4, -84.6, "sea")}${lbl("Gulf of Mexico", 22.1, -95.6, "sea")}
      <path class="flight" d="M${a[0]},${a[1]} Q${c[0]},${c[1]} ${b[0]},${b[1]}"/>
      <g class="plane" transform="translate(${px} ${py}) rotate(${ang})"><path d="M10 0 L-6 -3 L-9 -9 L-11 -9 L-8 -2.4 L-13 -2 L-15 -5 L-17 -5 L-15 0 L-17 5 L-15 5 L-13 2 L-8 2.4 L-11 9 L-9 9 L-6 3 Z"/></g>
      <text class="map-title" x="14" y="280">The flight</text>`;
    const far = spots.filter((p) => !inCR(p.coords));
    $("#flightPins").innerHTML =
      far.map((p) => { const [x, y] = fproj(p.coords); return `<div class="mpin" style="left:${(x / 400) * 100}%;top:${(y / 292) * 100}%"><span class="mpin__badges">${badge(p.i)}</span><span class="mpin__l">${esc(p.name)}</span></div>`; }).join("") +
      `<div class="mpin mpin--flip" style="left:${(b[0] / 400) * 100}%;top:${(b[1] / 292) * 100}%"><span class="mpin__badges"><a class="mpin__x mpin__x--dest" href="#map" aria-label="Costa Rica map">★</a></span><span class="mpin__l">Santa Ana · campus</span></div>`;
  })();

  $("#legend").innerHTML = S.map((st, i) => `
    <li><a href="${anchor(st)}"><b>${pad(i + 1)}</b><span>${esc(st.title)}</span><i>${esc(st.places ? st.places.map((p) => p.name).join(" · ") : st.place)}</i></a></li>`).join("");

  /* ── The stops, one after another ───────────────────── */
  const rots = [-4, 3, -2, 5, -5, 2, 4];
  $("#stops").innerHTML = S.map((st, i) => {
    const gis = st.photos.map((p, k) => reg(p, st, k));
    let media;
    if (st.places) {
      media = `<div class="st__strip">${st.photos.map((p, k) => `
        <figure class="pol" style="--rot:${rots[(k + i) % rots.length]}deg;--i:${k}">${pin(k)}${zoom(gis[k], img(p))}<figcaption class="pol__cap">${esc(p.caption)}</figcaption></figure>`).join("")}</div>`;
    } else {
      const [p0, p1] = st.photos;
      media = `
        <figure class="pol pol--big" style="--rot:${rots[i % rots.length]}deg;--i:0">${pin(i)}${zoom(gis[0], img(p0))}<figcaption class="pol__cap">${esc(p0.caption)}</figcaption></figure>
        ${p1 ? `<figure class="pol pol--small" style="--rot:${-rots[i % rots.length] * 1.5}deg;--i:1">${pin(i + 1)}${zoom(gis[1], img(p1))}<figcaption class="pol__cap">${esc(p1.caption)}</figcaption></figure>` : ""}
        ${st.photos.length > 2 ? `<button class="st__more" type="button" data-open="${gis[2]}">+${st.photos.length - 2} photos</button>` : ""}`;
    }
    return `
    <article class="st${i % 2 ? " st--r" : ""}${st.places ? " st--strip" : ""}" id="stop-${st.id}" data-i="${i}" aria-labelledby="st-${st.id}">
      <svg class="strings" aria-hidden="true"><g></g></svg>
      <div class="st__media">${media}</div>
      <div class="st__text">
        <p class="st__num">STOP ${pad(i + 1)} <span>· side ${sideOf(i)}</span></p>
        <h2 class="st__title chalk-title" id="st-${st.id}">${esc(st.title)}</h2>
        <p class="tag"><span>${esc(st.date)}</span><span>${esc(st.place)}</span></p>
        <div class="st__card">${pin(i + 2)}<p>${esc(st.line)}</p></div>
        ${st.fact ? `<span class="st__fact">${esc(st.fact)}</span>` : ""}
      </div>
    </article>`;
  }).join("");

  $("#takeaways").innerHTML = D.takeaways.map((t) => `<li>${esc(t)}</li>`).join("");

  /* ── Red string (a cord plus a thin fibre highlight) ── */
  function draw(container, animate) {
    const svg = $(":scope > .strings", container);
    const g = $("g", svg);
    const pins = $$(".pin", container);
    const box = container.getBoundingClientRect();
    svg.setAttribute("viewBox", `0 0 ${box.width} ${box.height}`);
    const c = (el) => { const r = el.getBoundingClientRect(); return [r.left + r.width / 2 - box.left, r.top + r.height / 2 - box.top]; };
    g.innerHTML = pins.slice(1).map((p, k) => {
      const [x1, y1] = c(pins[k]);
      const [x2, y2] = c(p);
      const sag = Math.min(70, Math.hypot(x2 - x1, y2 - y1) * 0.12);
      const d = `M${x1},${y1} Q${(x1 + x2) / 2},${Math.max(y1, y2) + sag} ${x2},${y2}`;
      return `<path class="cord" pathLength="1" d="${d}"/><path class="fibre" d="${d}"/>`;
    }).join("");
    g.classList.toggle("is-drawn", !animate || reduced);
    if (animate && !reduced) requestAnimationFrame(() => requestAnimationFrame(() => g.classList.add("is-drawn")));
  }

  /* ── Reveal on scroll ───────────────────────────────── */
  const io = new IntersectionObserver(
    (entries) =>
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        const t = e.target;
        t.classList.add("in");
        io.unobserve(t);
        if (t.classList.contains("st")) setTimeout(() => draw(t, true), reduced ? 0 : 1100);
      }),
    { rootMargin: "0px 0px -12% 0px", threshold: 0.08 }
  );
  [$("#boardEl"), ...$$(".st"), $(".folder")].forEach((el) => io.observe(el));

  /* ── HUD label: whichever section is in the middle of the screen ── */
  const mid = new IntersectionObserver(
    (entries) =>
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        const t = e.target;
        let side = "A", text;
        if (t.classList.contains("st")) {
          const i = +t.dataset.i;
          side = sideOf(i);
          text = `STOP ${pad(i + 1)} · ${S[i].title.toUpperCase()}`;
        } else {
          side = t.id === "end" ? "B" : "A";
          text = { top: "INTRO", route: "THE ROUTE", end: "WHAT'S NEXT" }[t.id] || "";
        }
        $("#hudSide").textContent = `SIDE ${side}`;
        $("#hudLabel").textContent = text;
      }),
    { rootMargin: "-50% 0px -50% 0px" }
  );
  [$("#top"), $("#route"), ...$$(".st"), $("#end")].forEach((el) => mid.observe(el));

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
    $("#lb-cap").textContent = p.caption;
    $("#lb-count").textContent = `STOP ${pad(S.indexOf(p.st) + 1)} · ${p.st.title.toUpperCase()} · ${p.i + 1}/${p.st.photos.length}`;
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

  /* ── Desktop extras: cassette tilt + flashlight ─────── */
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

  /* ── Scroll: tape winds from reel to reel; HUD counter ── */
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
    hud.classList.toggle("is-on", scrollY > innerHeight * 0.4);
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

  let rz;
  addEventListener("resize", () => {
    clearTimeout(rz);
    rz = setTimeout(() => {
      $$(".st.in").forEach((s) => draw(s, false));
      frame();
    }, 150);
  });
  document.fonts && document.fonts.ready.then(() => $$(".st.in").forEach((s) => draw(s, false)));
  frame();
})();
