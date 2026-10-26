/* UWCCR — The Film · renderer + interactions (no dependencies) */
(() => {
  const F = window.FILM;
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const esc = (s = "") =>
    String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  /* ── Bind simple text fields ─────────────────────────── */
  $$("[data-bind]").forEach((el) => {
    const v = F[el.dataset.bind];
    if (v != null) el.textContent = v;
  });
  const portrait = $("#portrait");
  portrait.src = F.portrait.src;
  portrait.alt = F.portrait.alt;

  /* ── Lightbox registry: every photo gets a global index ─ */
  const all = [];
  const reg = (p, scene) => all.push({ ...p, scene }) - 1;

  const img = (p, i, cls = "", eager = false) =>
    `<img class="${cls}" src="${esc(p.src)}" width="${p.w}" height="${p.h}" alt="${esc(p.alt)}" ${eager ? "" : 'loading="lazy"'} decoding="async" />`;

  const open = (gi) =>
    `<button class="zoom" type="button" data-open="${gi}" aria-label="Open photo: ${esc(p_alt(gi))}">`;
  const p_alt = (gi) => all[gi].alt;

  /* Hand-drawn chalk arrows (a few variations) */
  const arrows = [
    "M8 6 C 40 4, 58 22, 50 52 M50 52 l-10 -9 M50 52 l9 -12",
    "M52 6 C 20 10, 6 30, 18 54 M18 54 l-2 -14 M18 54 l13 -5",
    "M6 40 C 20 10, 46 6, 58 20 M58 20 l-14 -1 M58 20 l-2 -13",
    "M30 4 C 34 22, 22 34, 30 56 M30 56 l-8 -10 M30 56 l9 -9",
  ];
  const arrow = (n, cls = "") =>
    `<svg class="arrow ${cls}" viewBox="0 0 64 60" aria-hidden="true"><path pathLength="1" d="${arrows[n % arrows.length]}"/></svg>`;

  const miniClapper = `
    <svg class="mini-clapper" viewBox="0 0 64 56" aria-hidden="true">
      <rect x="4" y="20" width="56" height="34" rx="3" class="mc-board"/>
      <line x1="4" y1="31" x2="60" y2="31" class="mc-line"/>
      <line x1="24" y1="31" x2="24" y2="54" class="mc-line"/>
      <line x1="44" y1="31" x2="44" y2="54" class="mc-line"/>
      <g class="mc-top"><rect x="4" y="8" width="56" height="11" rx="2" class="mc-stick"/>
        <path d="M10 8h8l-5 11H5zM26 8h8l-5 11h-8zM42 8h8l-5 11h-8z" class="mc-stripe"/></g>
    </svg>`;

  /* ── Shot list ──────────────────────────────────────── */
  const moods = { warm: "warm", playful: "playful", curious: "curious", quiet: "quiet", focused: "focused" };
  $("#shots").innerHTML = F.scenes
    .map(
      (s) => `
      <li>
        <a href="#${s.id}" class="shot">
          <span class="shot__n typewriter">SC.${s.number}</span>
          <span class="shot__t">${esc(s.title)}</span>
          <span class="shot__k pen">${esc(s.kicker)}</span>
          <span class="shot__m typewriter">${esc(moods[s.mood] || s.mood)} · ${s.photos.length} shots</span>
          <svg class="shot__check" viewBox="0 0 30 24" aria-hidden="true"><path d="M3 13 l8 7 L27 3"/></svg>
        </a>
      </li>`
    )
    .join("");

  /* ── Scene layouts ──────────────────────────────────── */
  const layouts = {
    corkboard(s) {
      const rot = [-4, 3, -2, 5, -3, 2.5, -5, 4];
      const dy = [0, 34, -12, 22, 6, -18, 16, -6];
      return `
        <div class="cork" data-reveal>
          <svg class="cork__string" aria-hidden="true"><path/></svg>
          <ul class="cork__grid">
            ${s.photos
              .map((p, i) => {
                const gi = reg(p, s);
                return `
              <li class="polaroid polaroid--cork" style="--r:${rot[i % rot.length]}deg; --dy:${dy[i % dy.length]}px; --i:${i}">
                <span class="pin" aria-hidden="true"></span>
                ${open(gi)}${img(p, i)}</button>
                <span class="pen polaroid__cap">${esc(p.caption)}</span>
              </li>`;
              })
              .join("")}
          </ul>
          <span class="tape tape--corner" aria-hidden="true"></span>
        </div>`;
    },

    filmstrip(s) {
      return `
        <div class="strip-wrap">
          <div class="strip-sticky">
            <div class="stamp" aria-hidden="true">OUTTAKES<small>not for theatrical release</small></div>
            <div class="strip-track">
              <ol class="strip" data-reveal>
                ${s.photos
                  .map((p, i) => {
                    const gi = reg(p, s);
                    const n = 11 + i;
                    return `
                  <li class="frame" style="--i:${i}">
                    <div class="frame__film">
                      <span class="frame__code" aria-hidden="true">▷ ${n}A</span>
                      ${open(gi)}${img(p, i)}</button>
                      <span class="frame__code frame__code--b" aria-hidden="true">${n}</span>
                    </div>
                    <p class="chalk frame__cap">${arrow(i + 3, "arrow--up")}${esc(p.caption)}</p>
                  </li>`;
                  })
                  .join("")}
                <li class="frame frame--end" aria-hidden="true"><div class="frame__film"><span class="chalk">…that's a wrap</span></div></li>
              </ol>
            </div>
          </div>
        </div>`;
    },

    contactsheet(s) {
      const sel = new Set(s.selects || []);
      return `
        <div class="folder" data-reveal>
          <div class="sheet">
            <p class="sheet__edge typewriter" aria-hidden="true"><span>SAFETY FILM 400</span><span>◀ 14</span><span>PURA VIDA STOCK</span><span>15 ▶</span></p>
            <ul class="sheet__grid">
              ${s.photos
                .map((p, i) => {
                  const gi = reg(p, s);
                  const picked = sel.has(i);
                  return `
                <li class="cs ${picked ? "cs--pick" : ""}" style="--i:${i}">
                  ${open(gi)}${img(p, i)}</button>
                  <span class="cs__n typewriter" aria-hidden="true">${14 + i}${i % 2 ? "A" : ""}</span>
                  ${
                    picked
                      ? `<svg class="cs__circle" viewBox="0 0 120 120" preserveAspectRatio="none" aria-hidden="true"><path pathLength="1" d="M60 6 C 100 4, 116 34, 114 62 C 112 96, 84 116, 56 114 C 22 112, 4 88, 6 58 C 8 28, 30 8, 66 9"/></svg>
                         <span class="pen pen--red cs__note">${esc(p.caption)}</span>`
                      : ""
                  }
                </li>`;
                })
                .join("")}
            </ul>
            <p class="sheet__edge typewriter" aria-hidden="true"><span>▶ 16</span><span>SAFETY FILM 400</span><span>17</span><span>▶ 18A</span></p>
          </div>
          <div class="ticket" aria-hidden="true"><span>ADMIT</span><b>ONE</b><small>culture night · row 3</small></div>
          <span class="tape tape--folder" aria-hidden="true"></span>
        </div>`;
    },

    projector(s) {
      const items = s.photos.map((p) => ({ p, gi: reg(p, s) }));
      return `
        <div class="proj" style="--n:${s.photos.length}">
          <div class="proj__sticky">
            <div class="proj__beam" aria-hidden="true"></div>
            <div class="proj__screen">
              ${items
                .map(
                  ({ p, gi }, i) =>
                    `<figure class="proj__slide ${i === 0 ? "is-on" : ""}" data-slide="${i}">${open(gi)}${img(p, i)}</button></figure>`
                )
                .join("")}
            </div>
            <p class="proj__line typewriter" aria-hidden="true"><span>${esc(s.photos[0].caption)}</span></p>
            <div class="proj__dots" aria-hidden="true">${items.map((_, i) => `<i class="${i === 0 ? "is-on" : ""}"></i>`).join("")}</div>
            <ul class="sr-only">${s.photos.map((p) => `<li>${esc(p.caption)}</li>`).join("")}</ul>
          </div>
        </div>`;
    },

    slate(s) {
      return `
        <div class="bigslate" data-reveal>
          <div class="bigslate__sticks" aria-hidden="true"><span></span><span></span></div>
          <div class="bigslate__board">
            <div class="bigslate__head" aria-hidden="true">
              <div><span class="slate-label">PROD.</span><span class="tape tape--label tape--olive">${esc(s.kicker)}</span></div>
              <div class="bigslate__cols"><span>ROLL</span><span>SCENE</span><span>TAKE</span></div>
            </div>
            <ul class="bigslate__grid">
              ${s.photos
                .map((p, i) => {
                  const gi = reg(p, s);
                  return `
                <li class="sframe" style="--i:${i}; --r:${[-3, 2, -1.5, 3, -2][i % 5]}deg">
                  <span class="tape tape--red" aria-hidden="true"></span>
                  <div class="sframe__film">${open(gi)}${img(p, i)}</button>
                    <span class="sframe__code" aria-hidden="true">▷ ${10 + i}A</span></div>
                  <p class="ink sframe__note">${arrow(i, "arrow--ink arrow--up")}${esc(p.caption)}</p>
                </li>`;
                })
                .join("")}
            </ul>
          </div>
        </div>`;
    },
  };

  $("#scenes").innerHTML = F.scenes
    .map(
      (s) => `
    <section class="scene scene--${s.layout}" id="${s.id}" data-label="SC ${s.number} · ${esc(s.title).toUpperCase()}" aria-labelledby="${s.id}-t">
      <header class="scene__head" data-reveal>
        ${miniClapper}
        <p class="scene__num typewriter">SCENE ${s.number} <span>· TAKE 1</span></p>
        <h2 class="scene__title" id="${s.id}-t">${esc(s.title)}</h2>
        <p class="scene__kicker">${esc(s.kicker)}</p>
        <p class="scene__note chalk">${esc(s.note)}</p>
      </header>
      ${layouts[s.layout](s)}
    </section>`
    )
    .join("");

  /* ── Credits ────────────────────────────────────────── */
  $("#cast").innerHTML = F.cast
    .map(([n, c]) => `<li><span>${esc(n)}</span><i aria-hidden="true"></i><span>${esc(c)}</span></li>`)
    .join("");
  $("#crew").innerHTML = F.crew.map(([k, v]) => `<div><dt>${esc(k)}</dt><dd>${esc(v)}</dd></div>`).join("");

  /* ── Opening clapper snap ───────────────────────────── */
  const clapper = $("#clapper");
  const snap = () => {
    clapper.classList.remove("is-snapped");
    void clapper.offsetWidth;
    requestAnimationFrame(() => clapper.classList.add("is-snapped"));
  };
  if (reduced) clapper.classList.add("is-snapped", "no-anim");
  else setTimeout(snap, 450);

  $("#replay").addEventListener("click", (e) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: reduced ? "auto" : "smooth" });
    if (!reduced) setTimeout(snap, 900);
  });

  /* ── Reveal on scroll ───────────────────────────────── */
  const io = new IntersectionObserver(
    (entries) =>
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("in");
          io.unobserve(e.target);
          if (e.target.classList.contains("cork")) setTimeout(() => drawString(e.target, true), reduced ? 0 : 1500);
        }
      }),
    { rootMargin: "0px 0px -12% 0px", threshold: 0.08 }
  );
  $$("[data-reveal]").forEach((el) => io.observe(el));

  /* ── Red string between pins on corkboards ──────────── */
  function drawString(cork, animate) {
    const svg = $(".cork__string", cork);
    const path = $("path", svg);
    const box = cork.getBoundingClientRect();
    const pts = $$(".pin", cork).map((p) => {
      const r = p.getBoundingClientRect();
      return [r.left + r.width / 2 - box.left, r.top + r.height / 2 - box.top];
    });
    svg.setAttribute("viewBox", `0 0 ${box.width} ${box.height}`);
    let d = "";
    pts.forEach(([x, y], i) => {
      if (!i) return (d = `M${x},${y}`);
      const [px, py] = pts[i - 1];
      const sag = Math.min(60, Math.hypot(x - px, y - py) * 0.18);
      d += ` Q${(x + px) / 2},${Math.max(y, py) + sag} ${x},${y}`;
    });
    path.setAttribute("d", d);
    const len = path.getTotalLength();
    path.style.strokeDasharray = len;
    path.style.strokeDashoffset = animate && !reduced ? len : 0;
    if (animate && !reduced) requestAnimationFrame(() => requestAnimationFrame(() => (path.style.strokeDashoffset = 0)));
  }

  /* ── Sticky horizontal film strip (desktop) ─────────── */
  const strips = $$(".strip-wrap");
  const wide = matchMedia("(min-width: 860px)");
  function sizeStrips() {
    strips.forEach((w) => {
      const strip = $(".strip", w);
      if (!wide.matches || reduced) {
        w.style.height = "";
        strip.style.transform = "";
        w.classList.remove("is-pinned");
        return;
      }
      w.classList.add("is-pinned");
      const dist = Math.max(0, strip.scrollWidth - innerWidth + 80);
      w.dataset.dist = dist;
      w.style.height = `${innerHeight + dist}px`;
    });
  }

  /* ── Projector (sticky slideshow) ───────────────────── */
  const projs = $$(".proj");

  /* ── HUD timecode + current scene ───────────────────── */
  const hud = $(".hud");
  const tc = $("#tc");
  const hudScene = $("#hud-scene");
  const scenes = $$(".scene");
  const pad = (n) => String(n).padStart(2, "0");
  const TOTAL = 150; // seconds of "runtime"

  let ticking = false;
  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      ticking = false;
      const max = document.documentElement.scrollHeight - innerHeight;
      const t = (Math.min(1, scrollY / Math.max(1, max)) * TOTAL);
      const f = Math.floor((t % 1) * 24);
      tc.textContent = `00:${pad(Math.floor(t / 60))}:${pad(Math.floor(t % 60))}:${pad(f)}`;

      let label = scrollY < innerHeight * 0.6 ? "OPENING" : "SHOT LIST";
      scenes.forEach((s) => {
        const r = s.getBoundingClientRect();
        if (r.top < innerHeight * 0.5 && r.bottom > innerHeight * 0.5) label = s.dataset.label;
      });
      const cr = $("#credits").getBoundingClientRect();
      if (cr.top < innerHeight * 0.5) label = "END CREDITS";
      hudScene.textContent = label;
      hud.classList.toggle("is-on", scrollY > innerHeight * 0.45);

      strips.forEach((w) => {
        if (!w.classList.contains("is-pinned")) return;
        const r = w.getBoundingClientRect();
        const dist = +w.dataset.dist;
        const p = Math.min(1, Math.max(0, -r.top / Math.max(1, dist)));
        $(".strip", w).style.transform = `translate3d(${-p * dist}px,0,0)`;
      });

      projs.forEach((pr) => {
        const r = pr.getBoundingClientRect();
        const slides = $$(".proj__slide", pr);
        const span = r.height - innerHeight;
        const p = Math.min(0.999, Math.max(0, -r.top / Math.max(1, span)));
        const idx = Math.floor(p * slides.length);
        if (pr.dataset.idx == idx) return;
        pr.dataset.idx = idx;
        slides.forEach((s, i) => s.classList.toggle("is-on", i === idx));
        $$(".proj__dots i", pr).forEach((d, i) => d.classList.toggle("is-on", i === idx));
        const line = $(".proj__line", pr);
        const cap = all[+$(".zoom", slides[idx]).dataset.open].caption;
        line.innerHTML = `<span>${esc(cap)}</span>`;
      });
    });
  }
  addEventListener("scroll", onScroll, { passive: true });

  let rz;
  function onResize() {
    sizeStrips();
    $$(".cork.in").forEach((c) => drawString(c, false));
    onScroll();
  }
  addEventListener("resize", () => {
    clearTimeout(rz);
    rz = setTimeout(onResize, 120);
  });
  wide.addEventListener("change", onResize);
  addEventListener("load", onResize);
  document.fonts && document.fonts.ready.then(onResize);
  sizeStrips();
  onScroll();

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
    $("#lb-count").textContent = `SC.${p.scene.number} ${p.scene.title.toUpperCase()} — ${pad(cur + 1)}/${pad(all.length)}`;
  }
  document.addEventListener("click", (e) => {
    const b = e.target.closest("[data-open]");
    if (!b) return;
    lastFocus = b;
    show(+b.dataset.open);
    lb.showModal();
    document.documentElement.classList.add("lb-open");
  });
  const close = () => lb.close();
  lb.addEventListener("close", () => {
    document.documentElement.classList.remove("lb-open");
    lastFocus && lastFocus.focus({ preventScroll: true });
  });
  $("#lb-close").addEventListener("click", close);
  $("#lb-prev").addEventListener("click", () => show(cur - 1));
  $("#lb-next").addEventListener("click", () => show(cur + 1));
  lb.addEventListener("click", (e) => {
    if (e.target === lb) close();
  });
  lb.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft") show(cur - 1);
    if (e.key === "ArrowRight") show(cur + 1);
  });
  // swipe on touch
  let sx = null;
  lb.addEventListener("touchstart", (e) => (sx = e.touches[0].clientX), { passive: true });
  lb.addEventListener("touchend", (e) => {
    if (sx == null) return;
    const dx = e.changedTouches[0].clientX - sx;
    if (Math.abs(dx) > 50) show(cur + (dx < 0 ? 1 : -1));
    sx = null;
  });
})();
