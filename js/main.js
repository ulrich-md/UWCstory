/* MY JOURNEY · shared renderer for every page (no dependencies)
 * index.html  → the desk (cassette + tracklist) and the map board
 * stop.html   → one stop of the journey (?id=<event id>)
 * end.html    → travel log + liner notes
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
  const E = D.events;
  const half = Math.ceil(E.length / 2);
  const sideOf = (i) => (i < half ? "A" : "B");
  const stopUrl = (ev) => `stop.html?id=${encodeURIComponent(ev.id)}`;
  const page = document.body.dataset.page;

  /* ── Shared chrome: svg filters, HUD, lightbox, film grade ── */
  document.body.insertAdjacentHTML(
    "afterbegin",
    `<svg class="defs" aria-hidden="true" focusable="false" width="0" height="0"><defs>
      <filter id="rough"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="4" result="n"/><feDisplacementMap in="SourceGraphic" in2="n" scale="2.4"/></filter>
      <filter id="ink"><feTurbulence type="fractalNoise" baseFrequency="0.6" numOctaves="3" seed="9" result="n"/><feDisplacementMap in="SourceGraphic" in2="n" scale="1.6"/><feGaussianBlur stdDeviation="0.25"/></filter>
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

  const bind = (root = document) =>
    $$("[data-bind]", root).forEach((el) => {
      const v = D[el.dataset.bind];
      if (v != null) el.textContent = v;
    });

  /* ── Photos + lightbox registry ─────────────────────── */
  const all = [];
  const reg = (p, ev, i) => all.push({ ...p, ev, i }) - 1;
  const img = (p, cls = "", eager = false) =>
    `<img class="${cls}" src="${esc(p.src)}" width="${p.w}" height="${p.h}" alt="${esc(p.alt)}" ${eager ? "" : 'loading="lazy"'} decoding="async" />`;
  const zoom = (gi, inner) =>
    `<button class="zoom" type="button" data-open="${gi}" aria-label="Open photo: ${esc(all[gi].alt)}">${inner}</button>`;
  const pin = (k) => `<span class="pin pin--${["red", "green", "yellow"][k % 3]}" aria-hidden="true"></span>`;
  const vt = (ev) => `view-transition-name: cover-${ev.id.replace(/[^a-z0-9-]/gi, "")}`;

  /* ── Hand-drawn map (real Natural Earth coastline) ──── */
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
  const inCR = (e) => e.coords[0] > 8 && e.coords[0] < 11.4 && e.coords[1] > -86.2 && e.coords[1] < -82.4;
  function renderMap(svg, pinsEl, current = -1) {
    const G = window.GEO;
    const outline = G.cr.map(projLL);
    const neighbours = [...G.nic, ...G.pan].map((run) => `<path class="land land--nb" d="${smooth(run.map(projLL), false)}"/>`).join("");
    const mountains = [[-85.2, 10.75], [-84.95, 10.5], [-84.55, 10.25], [-84.1, 10.05], [-83.8, 9.7], [-83.45, 9.4], [-83.1, 9.15]]
      .map(projLL)
      .map(([x, y], i) => `<path class="mtn" d="M${x - 9},${y + 5} l9,-12 l9,12 ${i % 2 ? `M${x + 4},${y + 5} l6,-8 l6,8` : ""}"/>`)
      .join("");
    svg.innerHTML = `
      ${neighbours}
      <text class="nb" x="70" y="14">NICARAGUA</text>
      <text class="nb" transform="translate(352 300) rotate(-90)">PANAMÁ</text>
      <path class="land land--fill" d="${smooth(outline)}"/>
      <path class="land" d="${smooth(outline, true, 2.2, 3)}"/>
      <path class="land land--2" d="${smooth(outline, true, 3.2, 11)}"/>
      ${mountains}
      <path class="route" d="${smooth(E.filter(inCR).map((e) => proj(e.coords)), false)}"/>
      <text class="sea" x="40" y="292">Pacific</text>
      <text class="sea" x="250" y="62">Caribbean</text>
      <g class="compass" transform="translate(320 140)">
        <circle r="18"/><circle r="12" class="c2"/>
        <path d="M0,-26 L4,0 L0,26 L-4,0Z" class="needle"/><path d="M-26,0 L0,3.5 L26,0 L0,-3.5Z" class="needle needle--h"/>
        <text y="-30" text-anchor="middle">N</text>
      </g>
      <text class="map-title" x="14" y="348">Costa Rica</text>`;
    // stops in the same place (Santa Ana = campus) share one pin showing every stop number
    const groups = [];
    E.forEach((e, i) => {
      if (!inCR(e)) return;
      const g = groups.find((g) => Math.hypot(g.lat - e.coords[0], g.lon - e.coords[1]) < 0.08);
      if (g) g.items.push(i);
      else groups.push({ lat: e.coords[0], lon: e.coords[1], place: e.place, items: [i] });
    });
    pinsEl.innerHTML = groups.map((g) => {
      const [x, y] = proj([g.lat, g.lon]);
      const here = g.items.includes(current);
      const stack = g.items.length > 2;
      return `<div class="mpin${x > 250 || stack ? " mpin--flip" : ""}${stack ? " mpin--stack" : ""}${here ? " is-here" : ""}" style="left:${(x / 360) * 100}%;top:${(y / 360) * 100}%">
        <span class="mpin__badges">${g.items.map((i) => `<a class="mpin__x${i === current ? " is-current" : ""}" href="${stopUrl(E[i])}" data-mpin="${i}" aria-label="Stop ${i + 1}: ${esc(E[i].title)} — ${esc(E[i].place)}">${i + 1}</a>`).join("")}</span>
        ${current < 0 || here ? `<span class="mpin__l">${esc(g.place)}</span>` : ""}</div>`;
    }).join("");
  }

  /* ── Flight map: from home (Tehuacán) to the campus ───── */
  const fproj = ([lat, lon]) => [(lon + 101.5) * 18.2, (22.5 - lat) * 18.2];
  function renderFlight(svg, pinsEl, current = -1) {
    const R = window.GEO.region;
    const lands = Object.entries(R)
      .map(([code, runs]) => runs.map((r) => `<path class="land${code === "cri" ? " land--cr" : ""}${r.c ? "" : " land--open"}" d="${smooth(r.p.map(([lon, lat]) => fproj([lat, lon])), r.c)}"/>`).join(""))
      .join("");
    const a = fproj(D.from.coords);
    const firstCR = E.find(inCR) || E[0];
    const b = fproj(firstCR.coords);
    // arc bows out over the Pacific, like the real flight path
    const mx = (a[0] + b[0]) / 2, my = (a[1] + b[1]) / 2;
    const dx = b[0] - a[0], dy = b[1] - a[1];
    const c = [mx - dy * 0.32, my + dx * 0.32];
    const t = 0.55;
    const px = (1 - t) ** 2 * a[0] + 2 * (1 - t) * t * c[0] + t * t * b[0];
    const py = (1 - t) ** 2 * a[1] + 2 * (1 - t) * t * c[1] + t * t * b[1];
    const ang = (Math.atan2(2 * (1 - t) * (c[1] - a[1]) + 2 * t * (b[1] - c[1]), 2 * (1 - t) * (c[0] - a[0]) + 2 * t * (b[0] - c[0])) * 180) / Math.PI;
    svg.innerHTML = `
      ${lands}
      <text class="nb nb--big" x="${fproj([20.6, -99.6])[0]}" y="${fproj([20.6, -99.6])[1]}">MÉXICO</text>
      <text class="nb" x="${fproj([15.9, -91.6])[0]}" y="${fproj([15.9, -91.6])[1]}">GUATEMALA</text>
      <text class="nb" x="${fproj([14.9, -87.6])[0]}" y="${fproj([14.9, -87.6])[1]}">HONDURAS</text>
      <text class="nb" x="${fproj([12.9, -86.2])[0]}" y="${fproj([12.9, -86.2])[1]}">NICARAGUA</text>
      <text class="nb nb--cr" x="${fproj([10.6, -83.6])[0]}" y="${fproj([10.6, -83.6])[1]}">COSTA RICA</text>
      <text class="sea" x="${fproj([11.2, -97.6])[0]}" y="${fproj([11.2, -97.6])[1]}">Pacific Ocean</text>
      <text class="sea" x="${fproj([17.4, -84.6])[0]}" y="${fproj([17.4, -84.6])[1]}">Caribbean Sea</text>
      <text class="sea" x="${fproj([22.1, -95.6])[0]}" y="${fproj([22.1, -95.6])[1]}">Gulf of Mexico</text>
      <path class="flight" d="M${a[0]},${a[1]} Q${c[0]},${c[1]} ${b[0]},${b[1]}"/>
      <g class="plane" transform="translate(${px} ${py}) rotate(${ang})"><path d="M10 0 L-6 -3 L-9 -9 L-11 -9 L-8 -2.4 L-13 -2 L-15 -5 L-17 -5 L-15 0 L-17 5 L-15 5 L-13 2 L-8 2.4 L-11 9 L-9 9 L-6 3 Z"/></g>
      <text class="map-title" x="14" y="280">The flight</text>`;
    const home = E.findIndex((e) => !inCR(e));
    const crIdx = E.map((e, i) => (inCR(e) ? i : -1)).filter((i) => i >= 0);
    pinsEl.innerHTML = `
      <div class="mpin${home === current ? " is-here" : ""}" style="left:${(a[0] / 400) * 100}%;top:${(a[1] / 292) * 100}%">
        <span class="mpin__badges">${home >= 0 ? `<a class="mpin__x${home === current ? " is-current" : ""}" href="${stopUrl(E[home])}" data-mpin="${home}" aria-label="Stop ${home + 1}: ${esc(E[home].title)}">${home + 1}</a>` : ""}</span>
        <span class="mpin__l">${esc(D.from.place)}</span></div>
      <div class="mpin mpin--flip mpin--dest" style="left:${(b[0] / 400) * 100}%;top:${(b[1] / 292) * 100}%">
        <span class="mpin__badges"><a class="mpin__x mpin__x--dest" href="${crIdx.length ? stopUrl(E[crIdx[0]]) : "#"}" aria-label="Costa Rica: stops ${crIdx[0] + 1} to ${crIdx[crIdx.length - 1] + 1}">★</a></span>
        <span class="mpin__l">Santa Ana · campus</span></div>`;
  }

  /* ── Red string (twisted: a cord plus a thin fibre highlight) ── */
  function center(el, box) {
    const r = el.getBoundingClientRect();
    return [r.left + r.width / 2 - box.left, r.top + r.height / 2 - box.top];
  }
  function draw(container, pairs, animate) {
    const svg = $(":scope > .strings", container);
    if (!svg) return;
    const g = $("g", svg);
    const box = container.getBoundingClientRect();
    svg.setAttribute("viewBox", `0 0 ${box.width} ${box.height}`);
    g.innerHTML = pairs
      .filter(([a, b]) => a && b && a.offsetParent && b.offsetParent)
      .map(([a, b]) => {
        const [x1, y1] = center(a, box);
        const [x2, y2] = center(b, box);
        const sag = Math.min(70, Math.hypot(x2 - x1, y2 - y1) * 0.12);
        const d = `M${x1},${y1} Q${(x1 + x2) / 2},${Math.max(y1, y2) + sag} ${x2},${y2}`;
        return `<path class="cord" pathLength="1" d="${d}"/><path class="fibre" d="${d}"/>`;
      })
      .join("");
    g.classList.toggle("is-drawn", !animate || reduced);
    if (animate && !reduced) requestAnimationFrame(() => requestAnimationFrame(() => g.classList.add("is-drawn")));
  }
  const chain = (root) => {
    const pins = $$(".pin", root);
    return pins.slice(1).map((p, k) => [pins[k], p]);
  };

  /* ── Reveal on scroll ───────────────────────────────── */
  const onReveal = new Map();
  const io = new IntersectionObserver(
    (entries) =>
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        e.target.classList.add("in");
        io.unobserve(e.target);
        const fn = onReveal.get(e.target);
        if (fn) setTimeout(fn, reduced ? 0 : 1300);
      }),
    { rootMargin: "0px 0px -12% 0px", threshold: 0.06 }
  );
  const reveal = (el, fn) => {
    if (!el) return;
    if (fn) onReveal.set(el, fn);
    io.observe(el);
  };

  /* ── Shared bits of a stop: newspaper, polaroids, bag ── */
  const prots = [-4, 3, -2, 5, -5, 2, 4];
  const filler = (ev) =>
    [
      `${ev.place.toUpperCase()} — Sources close to the student describe it as “unforgettable, mostly in a good way.”`,
      "Witnesses report laughter, at least one wrong bus and a surprising amount of rice and beans.",
      "Asked for comment, the student said only that the people made all the difference.",
      "Residents note the group arrived as strangers and left arguing like siblings.",
      "The weather, as usual, could not be reached for comment.",
      "Editors confirm the full story does not fit in 650 words. Photographs pinned nearby.",
      "Continued on the next stop.",
    ].join(" ");
  const news = (ev, i, withPhoto, gi) => `
    <article class="news">
      ${pin(0)}
      <header class="news__mast">
        <p class="news__name">The UWCCR Times</p>
        <p class="news__line"><span>${esc(ev.date)}</span><span>${esc(ev.place)}</span><span>No. ${pad(i + 1)}</span></p>
      </header>
      <h3 class="news__head">${esc(ev.headline)}</h3>
      ${withPhoto ? `<div class="news__photo" data-cover style="${vt(ev)}">${zoom(gi, img(ev.photos[0], "", true))}</div>` : ""}
      <p class="news__lede">${esc(ev.note)}</p>
      <p class="news__body" aria-hidden="true">${esc(filler(ev))}</p>
    </article>`;
  const pol = (p, gi, k, extra = "", style = "") => `
    <figure class="pol ${extra}" style="--rot:${prots[k % prots.length]}deg;--i:${k};${style}">
      ${pin(k + 1)}
      ${zoom(gi, img(p, "", !!style))}
      <figcaption class="pol__cap">${esc(p.caption)}</figcaption>
      ${extra.includes("circled") ? `<svg class="chalk-ring" viewBox="0 0 200 200" preserveAspectRatio="none" aria-hidden="true"><path pathLength="1" d="M100 8 C 170 6, 194 60, 192 104 C 190 160, 140 194, 94 192 C 40 190, 8 150, 10 98 C 12 50, 50 12, 112 12"/></svg>` : ""}
    </figure>`;
  const doodles = (ev) =>
    (ev.chalk || [])
      .slice(0, 2)
      .map(
        (t, k) => `<span class="chalk ev-doodle ev-doodle--${k}" aria-hidden="true">${esc(t)}
        <svg class="arrow" viewBox="0 0 64 60"><path pathLength="1" d="${k ? "M52 6 C 20 10, 6 30, 18 54 M18 54 l-2 -14 M18 54 l13 -5" : "M8 6 C 40 4, 58 22, 50 52 M50 52 l-10 -9 M50 52 l9 -12"}"/></svg></span>`
      )
      .join("");

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
    $("#lb-count").textContent = `STOP ${pad(E.indexOf(p.ev) + 1)} · PHOTO ${String.fromCharCode(65 + p.i)} · ${p.ev.title.toUpperCase()} · ${p.ev.date.toUpperCase()}`;
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
    if (e.key === "ArrowLeft") { e.stopPropagation(); show(cur - 1); }
    if (e.key === "ArrowRight") { e.stopPropagation(); show(cur + 1); }
  });
  let sx = null;
  lb.addEventListener("touchstart", (e) => (sx = e.touches[0].clientX), { passive: true });
  lb.addEventListener("touchend", (e) => {
    if (sx == null) return;
    const dx = e.changedTouches[0].clientX - sx;
    if (Math.abs(dx) > 50) show(cur + (dx < 0 ? 1 : -1));
    sx = null;
  });

  /* ── Flashlight: warm pool of light follows the pointer ── */
  const torch = $(".torch");
  if (finePointer && !reduced) {
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

  /* ── HUD + reels: tape winds as you move through the journey ── */
  const hud = $(".hud");
  const hudReels = $$(".hud__reel");
  let reels = [];
  let spinBoost = 0;
  let span = [0, 1]; // share of the whole tape this page covers
  let labelFor = () => ({ side: "A", label: "" });
  let ticking = false;
  function frame() {
    ticking = false;
    const max = document.documentElement.scrollHeight - innerHeight;
    const local = Math.min(1, Math.max(0, scrollY / Math.max(1, max)));
    const p = span[0] + (span[1] - span[0]) * local;
    const l = 1 - p * 0.42;
    const r = 0.58 + p * 0.42;
    const base = (span[0] * 4000 + scrollY) * 0.45 + spinBoost;
    if (reels.length) {
      reels[0].style.setProperty("--tape", l);
      reels[1].style.setProperty("--tape", r);
      reels[0].style.setProperty("--spin", `${base / l}deg`);
      reels[1].style.setProperty("--spin", `${base / r}deg`);
    }
    hudReels.forEach((h, i) => h.style.setProperty("--spin", `${base / (i ? r : l)}deg`));
    $("#hudCount").textContent = pad(Math.floor(p * 999), 3);
    const { side, label } = labelFor();
    $("#hudSide").textContent = `SIDE ${side}`;
    $("#hudLabel").textContent = label;
    hud.classList.toggle("is-on", page !== "home" || scrollY > innerHeight * 0.4);
  }
  const onScroll = () => {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(frame);
    }
  };
  addEventListener("scroll", onScroll, { passive: true });
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

  /* resize redraws whatever strings are on the page */
  const redrawers = [];
  let rz;
  const redraw = () => {
    redrawers.forEach((fn) => fn());
    frame();
  };
  addEventListener("resize", () => {
    clearTimeout(rz);
    rz = setTimeout(redraw, 150);
  });
  addEventListener("load", redraw);
  document.fonts && document.fonts.ready.then(redraw);

  /* ════════════════ HOME ════════════════ */
  function home() {
    const track = (ev, i) => `
      <li><a href="${stopUrl(ev)}" class="track">
        <span class="track__n">${pad(i + 1)}</span>
        <span class="track__t">${esc(ev.title)}</span>
        <span class="track__d">${esc(ev.date)}</span>
      </a></li>`;
    $("#tracks").innerHTML = `
      <div class="jside"><p class="jside__h">SIDE A</p><ol>${E.slice(0, half).map((e, i) => track(e, i)).join("")}</ol></div>
      <div class="jside"><p class="jside__h">SIDE B</p><ol start="${half + 1}">${E.slice(half).map((e, i) => track(e, i + half)).join("")}</ol></div>`;
    $("#evCount").textContent = E.length;
    $("#startLink").href = stopUrl(E[0]);
    $("#startTitle").textContent = E[0].title;

    renderMap($("#mapSvg"), $("#mapPins"));
    renderFlight($("#flightSvg"), $("#flightPins"));

    const rots = [-6, 5, 3, -4, -3, 6, 4, -5];
    const dxs = [10, -14, -6, 16, 12, -8, -12, 8];
    $("#boardGrid").insertAdjacentHTML(
      "beforeend",
      E.map((e, i) => `
        <a class="bpol" href="${stopUrl(e)}" style="--c:${i % 2 ? 3 : 1};--r:${Math.floor(i / 2) + 1};--rot:${rots[i % rots.length]}deg;--dx:${dxs[i % dxs.length]}px;--i:${i}">
          ${pin(i)}
          <span class="bpol__img" style="${vt(e)}">${img(e.photos[0])}</span>
          <span class="bpol__cap"><b>${pad(i + 1)}</b> ${esc(e.title)}</span>
        </a>`).join("")
    );
    $("#boardGrid").style.setProperty("--rows", Math.ceil(E.length / 2));
    $("#profile").innerHTML = D.profile.map(([k, v]) => `<div><dt>${esc(k)}</dt><dd>${esc(v)}</dd></div>`).join("");

    const boardEl = $("#boardEl");
    const narrow = matchMedia("(max-width: 860px)");
    const pairs = () => {
      const pins = $$(".bpol .pin", boardEl);
      // stacked layout: chain the polaroids instead of running strings across the whole board
      if (narrow.matches) return pins.slice(1).map((p, i) => [pins[i], p]);
      const out = pins.map((p, i) => [p, $(`[data-mpin="${i}"]`, boardEl)]);
      out.push([$(".notepad .pin", boardEl), $(`[data-mpin="0"]`, boardEl)]);
      out.push([$(".news--board .pin", boardEl), $(`[data-mpin="${E.length - 1}"]`, boardEl)]);
      return out;
    };
    reveal(boardEl, () => draw(boardEl, pairs(), true));
    redrawers.push(() => boardEl.classList.contains("in") && draw(boardEl, pairs(), false));

    // cassette: portrait, stacked depth plates, tilt + holographic sheen
    const cassette = $("#cassette");
    const hp = $("#heroPhoto");
    hp.src = D.portrait.src;
    hp.alt = D.portrait.alt;
    cassette.insertAdjacentHTML(
      "afterbegin",
      `<span class="cassette__shadow" aria-hidden="true"></span>` +
        Array.from({ length: 6 }, (_, k) => `<span class="cassette__layer" style="--z:${k + 1}" aria-hidden="true"></span>`).join("")
    );
    if (finePointer && !reduced) {
      const stage = $(".deck");
      stage.addEventListener("pointermove", (e) => {
        const r = cassette.getBoundingClientRect();
        const x = (e.clientX - (r.left + r.width / 2)) / r.width;
        const y = (e.clientY - (r.top + r.height / 2)) / r.height;
        cassette.style.setProperty("--ry", `${Math.max(-1, Math.min(1, x)) * 7}deg`);
        cassette.style.setProperty("--rx", `${Math.max(-1, Math.min(1, y)) * -6}deg`);
        cassette.style.setProperty("--mx", `${50 + x * 60}%`);
      });
      stage.addEventListener("pointerleave", () => {
        cassette.style.setProperty("--ry", "0deg");
        cassette.style.setProperty("--rx", "0deg");
        cassette.style.setProperty("--mx", "50%");
      });
    }
    reels = $$(".reel", cassette);
    span = [0, 0.12];
    labelFor = () => ({ side: "A", label: $("#board").getBoundingClientRect().top < innerHeight * 0.5 ? "THE MAP" : "INTRO" });
    $("#play").addEventListener("click", () => spin(1));
  }

  /* ════════════════ STOP ════════════════ */
  function stop() {
    const want = new URLSearchParams(location.search).get("id");
    let i = E.findIndex((e) => e.id === want);
    if (i < 0) i = 0;
    const ev = E[i];
    const prev = E[i - 1];
    const next = E[i + 1];
    document.title = `${ev.title} — ${D.title}`;

    const layouts = ["cluster", "row", "bag"];
    const layout = ev.layout || layouts[i % layouts.length];
    const gis = ev.photos.map((p, k) => reg(p, ev, k));
    let body = "";
    if (layout === "cluster") {
      body = `
        <div class="ev__news">${news(ev, i, true, gis[0])}</div>
        <div class="ev__pics">${ev.photos.slice(1).map((p, k) => pol(p, gis[k + 1], k, k === 1 ? "circled" : "")).join("")}</div>`;
    } else if (layout === "row") {
      body = `
        <div class="ev__pics">${ev.photos.map((p, k) => pol(p, gis[k], k, k === 2 ? "circled" : "", k === 0 ? vt(ev) : "")).join("")}</div>
        <div class="ev__news">${news(ev, i, false)}</div>`;
    } else {
      const p0 = ev.photos[0];
      body = `
        <div class="ev__bag">
          <figure class="bag">
            ${pin(1)}
            <div class="bag__strip" aria-hidden="true"></div>
            <div class="bag__photo" style="${vt(ev)}">${zoom(gis[0], img(p0, "", true))}</div>
            <div class="bag__label" aria-hidden="true">
              <p><b>KEEPSAKE</b> · STOP ${pad(i + 1)}</p>
              <p><span>DATE</span> ${esc(ev.date)}</p>
              <p><span>PLACE</span> ${esc(ev.place)}</p>
              <p class="bag__hand">${esc(p0.caption)}</p>
            </div>
            <span class="bag__shine" aria-hidden="true"></span>
          </figure>
        </div>
        <div class="ev__side">
          ${news(ev, i, false)}
          <div class="ev__pics">${ev.photos.slice(1).map((p, k) => pol(p, gis[k + 1], k, k === 0 ? "circled" : "")).join("")}</div>
        </div>`;
    }

    const nextHref = next ? stopUrl(next) : "end.html";
    $("#stop").innerHTML = `
      <nav class="topbar" aria-label="Journey">
        <a class="topbar__back" href="index.html#board"><span aria-hidden="true">←</span> The map</a>
        <a class="topbar__brand" href="index.html">${esc(D.title)}</a>
        <span class="topbar__count">STOP ${pad(i + 1)} / ${pad(E.length)}</span>
      </nav>
      <section class="ev ev--${layout}" aria-labelledby="ev-title">
        <header class="ev__head" data-reveal>
          <p class="ev__track">TRACK ${pad(i + 1)} · SIDE ${sideOf(i)}</p>
          <p class="ev__no">STOP ${pad(i + 1)}</p>
          <h1 class="ev__title chalk-title" id="ev-title">${esc(ev.title)}</h1>
          <p class="tag"><span>${esc(ev.date)}</span><span>${esc(ev.place)}</span></p>
          <figure class="minimap" aria-label="Where this stop is on the map">
            ${pin(2)}
            <div class="map__paper"><div class="map__area">
              <svg class="map__svg" viewBox="${inCR(ev) ? "0 0 360 360" : "0 0 400 292"}" aria-hidden="true"></svg><div class="map__pins"></div>
            </div></div>
          </figure>
        </header>
        <div class="ev__body" data-reveal>
          <svg class="strings" aria-hidden="true"><g></g></svg>
          ${body}
          ${doodles(ev)}
        </div>
      </section>
      <nav class="stopnav" aria-label="Previous and next stop">
        ${prev ? `<a class="tbtn stopnav__prev" href="${stopUrl(prev)}" rel="prev"><span aria-hidden="true">⏮</span> ${esc(prev.title)}</a>` : `<a class="tbtn stopnav__prev" href="index.html#board"><span aria-hidden="true">⏮</span> The map</a>`}
        <a class="stopnav__next" href="${nextHref}" rel="next">
          ${next ? `<span class="pol pol--next" style="--rot:3deg">${pin(0)}<span class="pol__img" style="${vt(next)}">${img(next.photos[0])}</span><span class="pol__cap">${esc(next.photos[0].caption)}</span></span>` : `<img class="stopnav__walkman" src="assets/props/walkman.webp" width="533" height="681" alt="" loading="lazy" />`}
          <span class="stopnav__txt"><small>${next ? `Next stop · ${pad(i + 2)}` : "Side B ends"}</small><b>${next ? esc(next.title) : "The end (for now)"}</b><i aria-hidden="true">▶▶</i></span>
        </a>
      </nav>`;
    (inCR(ev) ? renderMap : renderFlight)($(".minimap .map__svg"), $(".minimap .map__pins"), i);

    const bodyEl = $(".ev__body");
    reveal($(".ev__head"));
    reveal(bodyEl, () => draw(bodyEl, chain(bodyEl), true));
    redrawers.push(() => bodyEl.classList.contains("in") && draw(bodyEl, chain(bodyEl), false));

    addEventListener("keydown", (e) => {
      if (lb.open || e.altKey || e.metaKey || e.ctrlKey) return;
      if (e.key === "ArrowRight") location.href = nextHref;
      if (e.key === "ArrowLeft") location.href = prev ? stopUrl(prev) : "index.html#board";
    });

    span = [0.12 + (0.8 * i) / E.length, 0.12 + (0.8 * (i + 1)) / E.length];
    labelFor = () => ({ side: sideOf(i), label: `STOP ${pad(i + 1)} · ${ev.title.toUpperCase()}` });
  }

  /* ════════════════ END ════════════════ */
  function end() {
    const photos = E.reduce((n, e) => n + e.photos.length, 0);
    $("#report").innerHTML = [
      ["Traveler", D.name],
      ["Based in", D.school],
      ["Period", D.years],
      ["Stops", `${E.length} stops, ${photos} photographs`],
      ...D.profile.slice(2),
    ]
      .map(([k, v]) => `<div><dt>${esc(k)}</dt><dd>${esc(v)}</dd></div>`)
      .join("");
    $("#cast").innerHTML = D.cast.map(([n, c]) => `<li><b>${esc(n)}</b> <span>${esc(c)}</span></li>`).join("");
    $("#creditsList").innerHTML = D.credits.map(([k, v]) => `<div><dt>${esc(k)}</dt><dd>${esc(v)}</dd></div>`).join("");
    $("#lastStop").href = stopUrl(E[E.length - 1]);
    reveal($(".folder"));
    span = [0.92, 1];
    labelFor = () => ({ side: "B", label: "TO BE CONTINUED" });
  }

  bind();
  if (page === "home") home();
  if (page === "stop") stop();
  if (page === "end") end();
  frame();
})();
