/* THE ULRICH FILES · renderer + interactions (no dependencies) */
(() => {
  const D = window.FILES;
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

  /* ── Simple binds ───────────────────────────────────── */
  $$("[data-bind]").forEach((el) => {
    const v = D[el.dataset.bind];
    if (v != null) el.textContent = v;
  });
  $("#evCount").textContent = E.length;

  /* ── Lightbox registry ──────────────────────────────── */
  const all = [];
  const reg = (p, ev, i) => all.push({ ...p, ev, i }) - 1;
  const img = (p, cls = "") =>
    `<img class="${cls}" src="${esc(p.src)}" width="${p.w}" height="${p.h}" alt="${esc(p.alt)}" loading="lazy" decoding="async" />`;
  const zoom = (gi, inner) =>
    `<button class="zoom" type="button" data-open="${gi}" aria-label="Open photo: ${esc(all[gi].alt)}">${inner}</button>`;

  /* ── Tracklist (J-card) ─────────────────────────────── */
  const track = (ev, i) => `
    <li><a href="#ev-${ev.id}" class="track">
      <span class="track__n">${pad(i + 1)}</span>
      <span class="track__t">${esc(ev.title)}</span>
      <span class="track__d">${esc(ev.date)}</span>
    </a></li>`;
  $("#tracks").innerHTML = `
    <div class="jside"><p class="jside__h">SIDE A</p><ol>${E.slice(0, half).map((e, i) => track(e, i)).join("")}</ol></div>
    <div class="jside"><p class="jside__h">SIDE B</p><ol start="${half + 1}">${E.slice(half).map((e, i) => track(e, i + half)).join("")}</ol></div>`;

  /* ── Hand-drawn map of Costa Rica ───────────────────── */
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

  const G = window.GEO;
  const outline = G.cr.map(projLL);
  const neighbours = [...G.nic, ...G.pan].map((run) => `<path class="land land--nb" d="${smooth(run.map(projLL), false)}"/>`).join("");
  const route = E.map((e) => proj(e.coords));
  const mountains = [[-85.2, 10.75], [-84.95, 10.5], [-84.55, 10.25], [-84.1, 10.05], [-83.8, 9.7], [-83.45, 9.4], [-83.1, 9.15]]
    .map(projLL)
    .map(([x, y], i) => `<path class="mtn" d="M${x - 9},${y + 5} l9,-12 l9,12 ${i % 2 ? `M${x + 4},${y + 5} l6,-8 l6,8` : ""}"/>`)
    .join("");
  $("#mapSvg").innerHTML = `
    ${neighbours}
    <text class="nb" x="70" y="14">NICARAGUA</text>
    <text class="nb" transform="translate(352 300) rotate(-90)">PANAMÁ</text>
    <path class="land land--fill" d="${smooth(outline)}"/>
    <path class="land" d="${smooth(outline, true, 2.2, 3)}"/>
    <path class="land land--2" d="${smooth(outline, true, 3.2, 11)}"/>
    ${mountains}
    <path class="route" d="${smooth(route, false)}"/>
    <text class="sea" x="40" y="292">Pacific</text>
    <text class="sea" x="250" y="62">Caribbean</text>
    <g class="compass" transform="translate(320 140)">
      <circle r="18"/><circle r="12" class="c2"/>
      <path d="M0,-26 L4,0 L0,26 L-4,0Z" class="needle"/><path d="M-26,0 L0,3.5 L26,0 L0,-3.5Z" class="needle needle--h"/>
      <text y="-30" text-anchor="middle">N</text>
    </g>
    <text class="map-title" x="14" y="348">Costa Rica</text>`;
  const labelled = new Set();
  $("#mapPins").innerHTML = E.map((e, i) => {
    const [x, y] = proj(e.coords);
    // label each place once, so repeated places don't stack labels
    const label = labelled.has(e.place) ? "" : `<span class="mpin__l">${esc(e.place)}</span>`;
    labelled.add(e.place);
    return `<a class="mpin${x > 250 ? " mpin--flip" : ""}" href="#ev-${e.id}" style="left:${(x / 360) * 100}%;top:${(y / 360) * 100}%" data-mpin="${i}" aria-label="${esc(e.title)} — ${esc(e.place)}">
      <span class="mpin__x">${i + 1}</span>${label}</a>`;
  }).join("");

  /* ── Board polaroids ────────────────────────────────── */
  const rots = [-6, 5, 3, -4, -3, 6, 4, -5];
  const dxs = [10, -14, -6, 16, 12, -8, -12, 8];
  $("#boardGrid").insertAdjacentHTML(
    "beforeend",
    E.map((e, i) => {
      const c = i % 2 ? 3 : 1;
      const r = Math.floor(i / 2) + 1;
      const p = e.photos[0];
      return `
      <a class="bpol" href="#ev-${e.id}" style="--c:${c};--r:${r};--rot:${rots[i % rots.length]}deg;--dx:${dxs[i % dxs.length]}px;--i:${i}" data-bpol="${i}">
        <span class="pin ${i % 3 === 1 ? "pin--red" : "pin--green"}" aria-hidden="true"></span>
        ${img(p)}
        <span class="bpol__cap"><b>#${pad(i + 1)}</b> ${esc(e.title)}</span>
      </a>`;
    }).join("")
  );
  $("#boardGrid").style.setProperty("--rows", Math.ceil(E.length / 2));

  $("#profile").innerHTML = D.profile.map(([k, v]) => `<div><dt>${esc(k)}</dt><dd>${esc(v)}</dd></div>`).join("");

  /* ── Evidence sections ──────────────────────────────── */
  const layouts = ["cluster", "row", "bag"];
  const prots = [-4, 3, -2, 5, -5, 2, 4];

  const pol = (p, gi, i, extra = "") => `
    <figure class="pol ${extra}" style="--rot:${prots[i % prots.length]}deg;--i:${i}">
      <span class="pin ${i % 2 ? "pin--red" : "pin--green"}" aria-hidden="true"></span>
      ${zoom(gi, img(p))}
      <figcaption class="pol__cap">${esc(p.caption)}</figcaption>
      ${extra.includes("circled") ? `<svg class="chalk-ring" viewBox="0 0 200 200" preserveAspectRatio="none" aria-hidden="true"><path pathLength="1" d="M100 8 C 170 6, 194 60, 192 104 C 190 160, 140 194, 94 192 C 40 190, 8 150, 10 98 C 12 50, 50 12, 112 12"/></svg>` : ""}
    </figure>`;

  const news = (ev, i, withPhoto, gi) => `
    <article class="news" style="--i:0">
      <span class="pin pin--red" aria-hidden="true"></span>
      <header class="news__mast">
        <p class="news__name">The UWCCR Times</p>
        <p class="news__line"><span>${esc(ev.date)}</span><span>${esc(ev.place)}</span><span>No. ${pad(i + 1)}</span></p>
      </header>
      <h3 class="news__head">${esc(ev.headline)}</h3>
      ${withPhoto ? `<div class="news__photo">${zoom(gi, img(ev.photos[0]))}</div>` : ""}
      <p class="news__lede">${esc(ev.note)}</p>
      <div class="news__cols" aria-hidden="true"><i></i><i></i></div>
    </article>`;

  const doodles = (ev) =>
    (ev.chalk || [])
      .slice(0, 2)
      .map(
        (t, k) => `<span class="chalk ev-doodle ev-doodle--${k}" aria-hidden="true">${esc(t)}
        <svg class="arrow" viewBox="0 0 64 60"><path pathLength="1" d="${k ? "M52 6 C 20 10, 6 30, 18 54 M18 54 l-2 -14 M18 54 l13 -5" : "M8 6 C 40 4, 58 22, 50 52 M50 52 l-10 -9 M50 52 l9 -12"}"/></svg></span>`
      )
      .join("");

  $("#case").innerHTML = E.map((ev, i) => {
    const layout = ev.layout || layouts[i % layouts.length];
    const gis = ev.photos.map((p, k) => reg(p, ev, k));
    let body = "";
    if (layout === "cluster") {
      body = `
        <div class="ev__news">${news(ev, i, true, gis[0])}</div>
        <div class="ev__pics">${ev.photos.slice(1).map((p, k) => pol(p, gis[k + 1], k, k === 1 ? "circled" : "")).join("")}</div>`;
    } else if (layout === "row") {
      body = `
        <div class="ev__pics">${ev.photos.map((p, k) => pol(p, gis[k], k, k === 2 ? "circled" : "")).join("")}</div>
        <div class="ev__news">${news(ev, i, false)}</div>`;
    } else {
      const p0 = ev.photos[0];
      body = `
        <div class="ev__bag">
          <figure class="bag" style="--i:0">
            <span class="pin pin--green" aria-hidden="true"></span>
            <div class="bag__strip" aria-hidden="true"></div>
            <div class="bag__photo">${zoom(gis[0], img(p0))}</div>
            <div class="bag__label" aria-hidden="true">
              <p><b>EVIDENCE</b> #${pad(i + 1)}-A</p>
              <p><span>DATE</span> ${esc(ev.date)}</p>
              <p><span>LOC.</span> ${esc(ev.place)}</p>
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
    return `
    <section class="ev ev--${layout}" id="ev-${ev.id}" data-label="EV ${pad(i + 1)} · ${esc(ev.title).toUpperCase()}" data-side="${sideOf(i)}" aria-labelledby="ev-${ev.id}-t">
      <header class="ev__head" data-reveal>
        <p class="ev__track">TRACK ${pad(i + 1)} · SIDE ${sideOf(i)}</p>
        <p class="ev__no">EVIDENCE #${pad(i + 1)}</p>
        <h2 class="ev__title chalk-title" id="ev-${ev.id}-t">${esc(ev.title)}</h2>
        <p class="tag"><span>${esc(ev.date)}</span><span>${esc(ev.place)}</span></p>
      </header>
      <div class="ev__body" data-reveal data-strings>
        <svg class="strings" aria-hidden="true"><g></g></svg>
        ${body}
        ${doodles(ev)}
      </div>
    </section>`;
  }).join("");

  /* ── Final report + liner notes ─────────────────────── */
  $("#report").innerHTML = [
    ["Subject", D.name],
    ["Location", D.school],
    ["Period", D.years],
    ["Evidence", `${E.length} events, ${all.length} photographs`],
    ...D.profile.slice(2),
  ]
    .map(([k, v]) => `<div><dt>${esc(k)}</dt><dd>${esc(v)}</dd></div>`)
    .join("");
  $("#cast").innerHTML = D.cast.map(([n, c]) => `<li><b>${esc(n)}</b> <span>${esc(c)}</span></li>`).join("");
  $("#creditsList").innerHTML = D.credits.map(([k, v]) => `<div><dt>${esc(k)}</dt><dd>${esc(v)}</dd></div>`).join("");

  /* ── Red strings ────────────────────────────────────── */
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
        return `<path pathLength="1" d="M${x1},${y1} Q${(x1 + x2) / 2},${Math.max(y1, y2) + sag} ${x2},${y2}"/>`;
      })
      .join("");
    g.classList.toggle("is-drawn", !animate || reduced);
    if (animate && !reduced) requestAnimationFrame(() => requestAnimationFrame(() => g.classList.add("is-drawn")));
  }
  const boardEl = $("#boardEl");
  const narrow = matchMedia("(max-width: 860px)");
  function boardPairs() {
    const pins = $$(".bpol .pin", boardEl);
    // stacked layout: chain the polaroids instead of running strings across the whole board
    if (narrow.matches) return pins.slice(1).map((p, i) => [pins[i], p]);
    const pairs = pins.map((p, i) => [p, $(`[data-mpin="${i}"] .mpin__x`, boardEl)]);
    const note = $(".notepad .pin", boardEl);
    const nw = $(".news--board .pin", boardEl);
    if (note) pairs.push([note, $(`[data-mpin="0"] .mpin__x`, boardEl)]);
    if (nw) pairs.push([nw, $(`[data-mpin="${E.length - 1}"] .mpin__x`, boardEl)]);
    return pairs;
  }
  function evPairs(body) {
    const pins = $$(".pin", body);
    const pairs = [];
    for (let k = 1; k < pins.length; k++) pairs.push([pins[k - 1], pins[k]]);
    return pairs;
  }
  const drawBoard = (anim) => draw(boardEl, boardPairs(), anim);
  const drawEv = (body, anim) => draw(body, evPairs(body), anim);

  /* ── Reveal on scroll ───────────────────────────────── */
  const io = new IntersectionObserver(
    (entries) =>
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        const t = e.target;
        t.classList.add("in");
        io.unobserve(t);
        const delay = reduced ? 0 : 1300;
        if (t === boardEl) setTimeout(() => drawBoard(true), delay);
        if (t.hasAttribute("data-strings")) setTimeout(() => drawEv(t, true), delay);
      }),
    { rootMargin: "0px 0px -15% 0px", threshold: 0.06 }
  );
  [...$$("[data-reveal]"), boardEl, $(".folder")].forEach((el) => io.observe(el));

  /* ── Cassette: depth layers, tilt + holographic sheen ─ */
  const cassette = $("#cassette");
  const hp = $("#heroPhoto");
  hp.src = D.portrait.src;
  hp.alt = D.portrait.alt;
  // stacked plates give the plastic shell real thickness when it tilts
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

  /* ── Flashlight: a warm pool of light follows the pointer ── */
  if (finePointer && !reduced) {
    let lt = false, lx = 0, ly = 0;
    addEventListener("pointermove", (e) => {
      lx = e.clientX;
      ly = e.clientY;
      if (lt) return;
      lt = true;
      requestAnimationFrame(() => {
        lt = false;
        document.documentElement.style.setProperty("--lx", `${lx}px`);
        document.documentElement.style.setProperty("--ly", `${ly}px`);
        document.documentElement.classList.add("has-torch");
      });
    }, { passive: true });
  }

  /* ── Scroll: reels, HUD counter, current label ──────── */
  const reels = $$(".reel", cassette);
  const hud = $(".hud");
  const hudReels = $$(".hud__reel");
  const hudCount = $("#hudCount");
  const hudSide = $("#hudSide");
  const hudLabel = $("#hudLabel");
  const evs = $$(".ev");
  let spinBoost = 0;
  let ticking = false;

  function frame() {
    ticking = false;
    const max = document.documentElement.scrollHeight - innerHeight;
    const p = Math.min(1, Math.max(0, scrollY / Math.max(1, max)));
    // tape moves from the left reel to the right reel as you scroll
    const l = 1 - p * 0.42;
    const r = 0.58 + p * 0.42;
    const base = scrollY * 0.45 + spinBoost;
    reels[0].style.setProperty("--tape", l);
    reels[1].style.setProperty("--tape", r);
    reels[0].style.setProperty("--spin", `${base / l}deg`);
    reels[1].style.setProperty("--spin", `${base / r}deg`);
    hudReels.forEach((h, i) => h.style.setProperty("--spin", `${base / (i ? r : l)}deg`));

    hudCount.textContent = pad(Math.floor(p * 999), 3);
    let label = "INTRO";
    let side = "A";
    const mid = innerHeight * 0.5;
    if ($("#board").getBoundingClientRect().top < mid) label = "THE BOARD";
    evs.forEach((s) => {
      const rr = s.getBoundingClientRect();
      if (rr.top < mid && rr.bottom > mid) {
        label = s.dataset.label;
        side = s.dataset.side;
      }
    });
    if ($("#credits").getBoundingClientRect().top < mid) {
      label = "CASE CLOSED";
      side = "B";
    }
    hudLabel.textContent = label;
    hudSide.textContent = `SIDE ${side}`;
    hud.classList.toggle("is-on", scrollY > innerHeight * 0.4);
  }
  const onScroll = () => {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(frame);
    }
  };
  addEventListener("scroll", onScroll, { passive: true });

  // a little extra spin when pressing play / rewind
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
  $("#rewind").addEventListener("click", (e) => {
    e.preventDefault();
    spin(-1);
    window.scrollTo({ top: 0, behavior: reduced ? "auto" : "smooth" });
  });

  let rz;
  const redraw = () => {
    if (boardEl.classList.contains("in")) drawBoard(false);
    $$(".ev__body.in").forEach((b) => drawEv(b, false));
    frame();
  };
  addEventListener("resize", () => {
    clearTimeout(rz);
    rz = setTimeout(redraw, 150);
  });
  addEventListener("load", redraw);
  document.fonts && document.fonts.ready.then(redraw);
  frame();

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
    const n = E.indexOf(p.ev) + 1;
    $("#lb-count").textContent = `EVIDENCE #${pad(n)}-${String.fromCharCode(65 + p.i)} · ${p.ev.title.toUpperCase()} · ${p.ev.date.toUpperCase()}`;
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
})();
