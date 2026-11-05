/* Rivington Marx — Study 08 / The Eye-Line Hang
   The whole collection on one wall, at eye level. Choose a frame and step inside.
   GSAP 3.12.5 + Observer (vendored in ./vendor). */

(() => {
  'use strict';

  /* ------------------------------------------------------------------
     DATA — shares project groupings and photographs with Study 07.
     Names other than "Tailored in Stone" are working titles.
  ------------------------------------------------------------------ */
  const A = '../assets/';
  const full = (k) => `${A}${k}.jpg`;
  const thumb = (k) => `${A}thumbs/${k}.jpg`;

  const WIDE = new Set([
    's7-stone-kitchen-island', 's7-stone-kitchen-corner', 's7-stone-kitchen-side',
    's7-holiday-dining', 's7-holiday-living',
    's7-salon-living', 's7-salon-gold-table', 's7-salon-blue-chair', 's7-salon-blue-wall',
    's7-glass-living', 's7-glass-guest', 's7-garnet-kitchen',
    's7-teal-kitchen', 's7-teal-bedroom', 's7-teal-desk',
    's7-tudor-range', 's7-tudor-bedroom', 's7-velvet-gold-room', 's7-velvet-red-wall',
    's7-light-living', 's7-light-dining', 's7-studio-exterior'
  ]);

  const credits = (photo) => ({
    'Interior design': 'Rivington Marx Interiors',
    'Architecture': '[Architect]',
    'Build': '[Builder]',
    'Photography': photo || '[Photographer]'
  });

  const PROJECTS = [
    { id: 'salon', shade: '#22344f', name: 'The Blue Salon', type: 'Living & Bar', tint: '#1f3550', frame: 's7-salon-blue-room',
      imgs: ['s7-salon-blue-room', 's7-salon-blue-bar', 's7-salon-blue-chair', 's7-salon-blue-wall', 's7-salon-velvet-corner', 's7-salon-living', 's7-salon-gold-table', 's7-salon-gilt-figure'],
      story: 'Deep blue walls, velvet and gilt. The salon is built around a painted bar cabinet and a collection of gold pieces, with a lounge in sand and teal beside it. Pattern stays on the walls and the textiles; the furniture stays low and generous.', credits: credits() },
    { id: 'stone', shade: '#5a3a35', name: 'Tailored in Stone', type: 'Kitchen & Baths', tint: '#7a4f47', frame: 's7-stone-powder-sink',
      imgs: ['s7-stone-powder-sink', 's7-stone-coffee-bar', 's7-stone-coffee-doors', 's7-stone-kitchen-island', 's7-stone-kitchen-vignette', 's7-stone-kitchen-corner', 's7-stone-bar', 's7-stone-bar-vignette', 's7-stone-kitchen-side', 's7-stone-powder-lights', 's7-stone-powder-tile', 's7-stone-primary-bath', 's7-stone-primary-tub', 's7-stone-shower'],
      story: 'A kitchen, a bar and three baths drawn from one quiet palette: veined marble, warm oak and a rose-coloured stone that carries from the coffee bar into the powder room. The joinery is tailored to the inch, so storage disappears and the stone is left to speak.', credits: credits('Eric Lucero Photography') },
    { id: 'glass', shade: '#343c40', name: 'The Stained Glass House', type: 'Whole Home', tint: '#33393a', frame: 's7-glass-window',
      imgs: ['s7-glass-window', 's7-glass-foyer', 's7-glass-hall', 's7-glass-console', 's7-glass-living', 's7-glass-sofa', 's7-glass-desk', 's7-glass-guest', 's7-glass-bedroom', 's7-glass-bath', 's7-glass-powder'],
      story: 'A tall house of stained glass, a dark staircase and gold light fittings that read like jewellery against grey grasscloth. Blue-and-white pottery, patterned rugs and strong art keep the darker palette warm from the front door to the powder room.', credits: credits() },
    { id: 'light', shade: '#6b6255', name: 'Soft Light', type: 'Whole Home', tint: '#6f6455', frame: 's7-light-wall-hanging',
      imgs: ['s7-light-wall-hanging', 's7-light-living', 's7-light-fireplace', 's7-light-sitting', 's7-light-reading', 's7-light-console', 's7-light-dining', 's7-light-kitchen', 's7-light-desk', 's7-light-vanity', 's7-light-bath'],
      story: 'Plaster white, linen and pale stone, with sculptural lighting and black accents. A calm house made for daylight, where a woven wall hanging, a curved vanity and a reading corner carry all the texture.', credits: credits() },
    { id: 'garnet', shade: '#4f1c27', name: 'The Garnet Room', type: 'Dining & Library', tint: '#5a1f2b', frame: 's7-garnet-dining',
      imgs: ['s7-garnet-dining', 's7-garnet-library', 's7-garnet-study', 's7-garnet-nook', 's7-garnet-kitchen', 's7-garnet-glassware', 's7-garnet-brick', 's7-garnet-cellar'],
      story: 'A dining room and library lacquered in garnet, under a sculptural pendant and painted branches. Below, an exposed-brick hall, a glass-fronted bar and a wine room in leather and stone carry the same warmth through the house.', credits: credits() },
    { id: 'teal', shade: '#1f4446', name: 'The Teal Kitchen House', type: 'Whole Home', tint: '#1f4a4d', frame: 's7-teal-pink-bedroom',
      imgs: ['s7-teal-pink-bedroom', 's7-teal-fireplace', 's7-teal-kitchen', 's7-teal-nook', 's7-teal-doors', 's7-teal-window-seat', 's7-teal-desk', 's7-teal-powder', 's7-teal-bedroom'],
      story: 'Teal tile, navy cabinetry and brass in the kitchen; a fireside sitting room in stone and silver; and upstairs, a pink bedroom with flamingo wallpaper. Each room takes one confident colour and lets the detail follow.', credits: credits() },
    { id: 'holiday', shade: '#5a1b1a', name: 'Holiday House', type: 'Seasonal', tint: '#6e1f1d', frame: 's7-holiday-red-tree',
      imgs: ['s7-holiday-red-tree', 's7-holiday-living', 's7-holiday-window', 's7-holiday-candles', 's7-holiday-dining', 's7-holiday-cabinet', 's7-holiday-hearth', 's7-holiday-garland-stair', 's7-holiday-stripe-stair', 's7-holiday-tree-lounge', 's7-holiday-silver-tree', 's7-holiday-mantel', 's7-holiday-breakfast', 's7-holiday-kitchen'],
      story: 'The house dressed for the season. Garland runs the stair, candles gather on the table and one tree is lit entirely in red. Every room keeps its own colour story, so the decoration reads as part of the interior rather than a layer on top of it.', credits: credits() },
    { id: 'velvet', shade: '#561f1a', name: 'Red Velvet House', type: 'Whole Home', tint: '#6b2a22', frame: 's7-velvet-arch',
      imgs: ['s7-velvet-arch', 's7-velvet-sofa', 's7-velvet-red-wall', 's7-velvet-piano', 's7-velvet-throw', 's7-velvet-chest', 's7-velvet-gold-room', 's7-velvet-brick-bar', 's7-velvet-dining', 's7-velvet-koi-powder'],
      story: 'Red velvet, carved wood and gold. A collected house where an arched passage frames a portrait, a brick wall holds the bar and the living room gathers a piano, a fireplace and a lifetime of art.', credits: credits() },
    { id: 'tudor', shade: '#3a3029', name: 'Patterned Ceilings', type: 'Whole Home', tint: '#3a3128', frame: 's7-tudor-kitchen',
      imgs: ['s7-tudor-kitchen', 's7-tudor-range', 's7-tudor-stair', 's7-tudor-shelves', 's7-tudor-chair', 's7-tudor-portrait', 's7-tudor-bedroom', 's7-tudor-bath', 's7-tudor-powder'],
      story: 'Printed ceilings, black millwork and old rugs. The kitchen sits beneath a patterned ceiling with an arched hood, the powder room pairs black tile with butter yellow, and portraits hang throughout.', credits: credits() }
  ];
  const P = Object.fromEntries(PROJECTS.map((p) => [p.id, p]));
  const HANG = ['salon', 'stone', 'glass', 'light', 'garnet', 'teal', 'holiday'];

  const SERVICES = [
    { word: 'Interiors', name: 'Interior Design', cover: 's7-salon-living', imgs: ['s7-velvet-piano', 's7-glass-sofa'],
      copy: 'Full-service interior design, from the plan and the palette to the last object on the shelf. Rooms are layered slowly, with pieces chosen to last.' },
    { word: 'Kitchens', name: 'Kitchen Design', cover: 's7-stone-kitchen-island', imgs: ['s7-tudor-kitchen', 's7-stone-coffee-bar'],
      copy: 'Kitchens planned around the way a household cooks and gathers. Cabinetry, stone and light are designed together, so the room works as hard as it looks.' },
    { word: 'Baths', name: 'Bathroom Design', cover: 's7-stone-primary-tub', imgs: ['s7-stone-powder-sink', 's7-glass-powder'],
      copy: 'Primary baths and powder rooms treated as rooms in their own right. Stone, tile and light are chosen to feel calm every day and memorable for guests.' },
    { word: 'Remodeling', name: 'Home Remodeling', cover: 's7-glass-living', imgs: ['s7-garnet-brick', 's7-tudor-stair'],
      copy: 'Remodels that respect what a house already has. Walls, flow and finishes are reworked so the home suits the way you live now.' },
    { word: 'Design Build', name: 'Design Build', cover: 's7-garnet-kitchen', imgs: ['s7-garnet-glassware', 's7-stone-bar'],
      copy: 'Design and construction managed as one process. A single team carries the drawings through the build, so the details survive to the finish.' },
    { word: 'Architecture', name: 'Architectural Design', cover: 's7-tudor-range', imgs: ['s7-glass-foyer', 's7-glass-window'],
      copy: 'Interior architecture that sets the bones before the decoration: plans, elevations, millwork and the proportions of every room.' }
  ];

  /* ------------------------------------------------------------------
     HELPERS
  ------------------------------------------------------------------ */
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const el = (tag, cls, html) => { const n = document.createElement(tag); if (cls) n.className = cls; if (html != null) n.innerHTML = html; return n; };
  const pad = (n) => String(n).padStart(2, '0');
  const REDUCE = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const T = (s) => (REDUCE ? Math.min(s, 0.2) : s);
  const store = {
    get(k) { try { return sessionStorage.getItem(k); } catch (e) { return null; } },
    set(k, v) { try { sessionStorage.setItem(k, v); } catch (e) { /* private mode */ } }
  };
  const loadImg = (img, url) => new Promise((res) => {
    if (img.getAttribute('src') === url && img.complete) return res();
    img.onload = img.onerror = () => { img.onload = img.onerror = null; res(); };
    img.src = url;
  });

  const views = { home: $('#home'), work: $('#work'), services: $('#services'), studio: $('#studio') };
  const win = $('#win'), contact = $('#contact'), toast = $('#toast');
  const state = { view: 'home', busy: false };
  const topLayer = () => (!contact.hidden ? 'contact' : !win.hidden ? 'window' : (!$('#svcSheet').hidden ? 'svc' : state.view));

  function say(msg) {
    toast.textContent = msg; toast.classList.add('is-on');
    clearTimeout(say.t); say.t = setTimeout(() => toast.classList.remove('is-on'), 1800);
  }

  /* ------------------------------------------------------------------
     WALL — the room takes on the photograph (or its colour)
  ------------------------------------------------------------------ */
  const wall = (() => {
    const box = $('#wall'), colour = $('#wallColour');
    const layers = $$('.wall-img', box);
    let front = 0, current = null, mode = 'colour';
    function show(key, tint) {
      const id = key || 'none';
      if (id === current) return;
      current = id;
      box.classList.remove('is-shade');
      gsap.to(colour, { backgroundColor: '#14110f', duration: T(0.6), ease: 'power2.out' });
      const next = layers[1 - front], prev = layers[front];
      box.classList.toggle('has-photo', !!key);
      if (!key) {
        gsap.to(layers, { opacity: 0, duration: T(0.6), ease: 'power2.out' });
        return;
      }
      gsap.killTweensOf(next);
      loadImg(next, full(key)).then(() => {
        if (current !== id) return;
        gsap.to(next, { opacity: 1, duration: T(0.6), ease: 'power2.out' });
        gsap.to(prev, { opacity: 0, duration: T(0.6), ease: 'power2.out' });
        front = 1 - front;
      });
      show.tint = tint;
    }
    /* a solid, opaque shade of the interior — no photograph behind */
    function shade(c) {
      const id = 'shade:' + c;
      if (id === current) return;
      current = id;
      box.classList.add('is-shade'); box.classList.remove('has-photo');
      gsap.to(layers, { opacity: 0, duration: T(0.5), ease: 'power2.out' });
      gsap.to(colour, { backgroundColor: c, duration: T(0.7), ease: 'power2.out' });
    }
    function toggle() {
      mode = mode === 'photo' ? 'colour' : 'photo';
      say(mode === 'photo' ? 'Hover wall · photograph' : 'Hover wall · colour');
    }
    function hover(p) { shade(p.shade); }
    return { show, shade, hover, toggle, clear: () => show(null) };
  })();

  /* ------------------------------------------------------------------
     VIEW SWITCHING — a quiet dissolve on the same wall
  ------------------------------------------------------------------ */
  function setNavHere() {
    $$('.head-nav [data-go]').forEach((b) => b.classList.toggle('is-here', b.dataset.go === state.view));
  }
  function go(name) {
    if (state.busy) return;
    if (!win.hidden) winCtl.close(true);
    if (!contact.hidden) closeContact();
    if (name === state.view) return;
    state.busy = true;
    const from = views[state.view], to = views[name];
    gsap.to(from, { opacity: 0, duration: T(0.35), ease: 'power2.in', onComplete: () => {
      from.hidden = true; gsap.set(from, { opacity: 1 });
      if (state.view === 'home') home.reset();
      if (state.view === 'services') svc.closeSheet(true);
      if (state.view === 'studio') studio.close(true);
      state.view = name; setNavHere();
      wall.clear();
      to.hidden = false;
      if (name === 'work') work.enter();
      if (name === 'services') svc.enter();
      if (name === 'home') home.enter();
      if (name === 'studio') studio.enter();
      gsap.fromTo(to, { opacity: 0 }, { opacity: 1, duration: T(0.5), ease: 'power2.out', onComplete: () => { state.busy = false; } });
    } });
  }

  /* ------------------------------------------------------------------
     HOME — seven frames at eye level
  ------------------------------------------------------------------ */
  const home = (() => {
    const hang = $('#hang'), label = $('#label');
    let active = -1, leaveT = null;
    const frames = HANG.map((id, k) => {
      const p = P[id];
      const b = el('button', 'frame');
      b.type = 'button'; b.setAttribute('role', 'listitem');
      b.setAttribute('aria-label', `${p.name}, ${p.type}`);
      b.innerHTML = `<img src="${thumb(p.frame)}" alt="" decoding="async">`;
      b.addEventListener('mouseenter', () => activate(k));
      b.addEventListener('focus', () => activate(k));
      b.addEventListener('click', () => open(k));
      hang.appendChild(b);
      return b;
    });

    function activate(k) {
      clearTimeout(leaveT);
      if (k === active || winOpening) return;
      active = k;
      const p = P[HANG[k]];
      frames.forEach((f, n) => {
        gsap.to(f, {
          scale: n === k && !REDUCE ? 1.1 : 1, y: n === k && !REDUCE ? -6 : 0,
          opacity: n === k ? 1 : 0.35, duration: T(0.45), ease: 'power3.out', overwrite: 'auto'
        });
      });
      wall.hover(p);
      // gallery label beneath the active frame
      $('.label-name', label).textContent = p.name;
      $('.label-sub', label).textContent = p.type;
      const r = frames[k].getBoundingClientRect();
      const fw = frames[k].offsetWidth, fh = frames[k].offsetHeight;
      const cx = r.left + r.width / 2;
      const hr = hang.getBoundingClientRect();
      const top = hr.top + (REDUCE ? fh : fh * 1.1 - 6) + 24;
      gsap.set(label, { left: cx, top });
      void fw;
      label.classList.add('is-on');
    }
    function rest() {
      active = -1;
      frames.forEach((f) => gsap.to(f, { scale: 1, y: 0, opacity: 1, duration: T(0.45), ease: 'power3.out', overwrite: 'auto' }));
      label.classList.remove('is-on');
      wall.clear();
    }
    hang.addEventListener('mouseleave', () => { leaveT = setTimeout(rest, 120); });

    let winOpening = false;
    function open(k) {
      if (state.busy) return;
      winOpening = true;
      const id = HANG[k], p = P[id];
      label.classList.remove('is-on');
      // the other frames step aside
      frames.forEach((f, n) => {
        if (n === k) return;
        gsap.to(f, { x: n < k ? -innerWidth * 0.55 : innerWidth * 0.55, opacity: 0, duration: T(0.9), ease: 'expo.inOut' });
      });
      winCtl.open(id, p.imgs.indexOf(p.frame), $('img', frames[k]), () => { winOpening = false; });
    }

    function reset() {
      winOpening = false; active = -1;
      frames.forEach((f) => gsap.set(f, { x: 0, y: 0, scale: 1, opacity: 1 }));
      label.classList.remove('is-on');
    }
    function enter() {
      reset();
      gsap.fromTo(frames, { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: T(0.6), stagger: 0.06, ease: 'power2.out' });
    }
    function returnFrom(id) {
      // frames slide back in after a project closes
      const k = HANG.indexOf(id);
      frames.forEach((f, n) => {
        if (n === k) gsap.set(f, { x: 0, y: 0, scale: 1, opacity: 0 });
        else gsap.to(f, { x: 0, y: 0, scale: 1, opacity: 1, duration: T(0.8), ease: 'expo.out', delay: 0.05 });
      });
      active = -1;
      return k >= 0 ? frames[k] : null;
    }
    function key(e) {
      if (e.key === 'ArrowRight') { e.preventDefault(); const n = Math.min(HANG.length - 1, active + 1); frames[n].focus(); }
      if (e.key === 'ArrowLeft') { e.preventDefault(); const n = Math.max(0, active < 0 ? 0 : active - 1); frames[n].focus(); }
    }
    function intro() {
      const introEl = $('#intro');
      if (REDUCE || store.get('rm-s8-intro')) { introEl.remove(); return; }
      store.set('rm-s8-intro', '1');
      gsap.set(frames, { opacity: 0, y: 14 });
      gsap.set(['.head-logo', '.head-nav'], { opacity: 0 });
      gsap.timeline({ onComplete: () => introEl.remove() })
        .to(introEl, { opacity: 1, duration: 0.45, ease: 'power2.out' })
        .fromTo($('img', introEl), { scale: 0.92 }, { scale: 1, duration: 0.7, ease: 'power3.out' }, 0)
        .to(introEl, { opacity: 0, duration: 0.35, ease: 'power2.in' }, 0.75)
        .to(frames, { opacity: 1, y: 0, duration: 0.55, stagger: 0.08, ease: 'power3.out' }, 0.85)
        .to(['.head-logo', '.head-nav'], { opacity: 1, duration: 0.5 }, 1.1);
    }
    return { activate, rest, reset, enter, returnFrom, key, intro, frames };
  })();

  /* ------------------------------------------------------------------
     PROJECT WINDOW — the frame grows into the stage
  ------------------------------------------------------------------ */
  const winCtl = (() => {
    const stage = $('#stage'), track = $('#track'), strip = $('#strip'), drawer = $('#drawer');
    const countEl = $('#winCount'), detailsBtn = $('#detailsBtn');
    let proj = null, i = 0, slides = [], lockUntil = 0, origin = null, drawerOpen = false;

    function build(id, start) {
      proj = P[id]; i = Math.max(0, start);
      win.setAttribute('aria-label', proj.name);
      track.innerHTML = ''; strip.innerHTML = '';
      slides = proj.imgs.map((k, n) => {
        const s = el('div', 'slide' + (WIDE.has(k) ? ' is-wide' : ''));
        s.style.top = `${n * 100}%`;
        const im = el('img'); im.alt = `${proj.name}, image ${n + 1}`; im.decoding = 'async'; im.dataset.src = full(k);
        s.appendChild(im); track.appendChild(s);
        const t = el('button', '', `<img src="${thumb(k)}" alt="" loading="lazy">`);
        t.type = 'button'; t.setAttribute('aria-label', `Image ${n + 1}`);
        t.addEventListener('click', () => goTo(n));
        strip.appendChild(t);
        return s;
      });
      drawer.innerHTML = `<p class="eyebrow">Details</p><h2>${proj.name}</h2><p class="meta">${proj.type}</p><p>${proj.story}</p>
        <dl>${Object.entries(proj.credits).map(([a, b]) => `<dt>${a}</dt><dd>${b}</dd>`).join('')}</dl>`;
      closeDrawer(true);
      gsap.set(track, { yPercent: -100 * i });
      update();
    }
    function update() {
      for (let k = i - 1; k <= i + 2; k++) { const s = slides[k]; if (s) { const im = $('img', s); if (!im.getAttribute('src')) im.src = im.dataset.src; } }
      $$('button', strip).forEach((b, n) => b.classList.toggle('is-current', n === i));
      const cur = $$('button', strip)[i]; if (cur) cur.scrollIntoView({ block: 'nearest' });
      countEl.textContent = `${pad(i + 1)} / ${pad(proj.imgs.length)}`;
      wall.show(proj.imgs[i], proj.tint); // the room re-tones with each image
    }
    function goTo(n, instant) {
      n = Math.max(0, Math.min(n, proj.imgs.length - 1));
      if (n === i) return;
      i = n;
      if (instant || REDUCE) gsap.set(track, { yPercent: -100 * i });
      else gsap.to(track, { yPercent: -100 * i, duration: 0.8, ease: 'power3.inOut', overwrite: true });
      update();
    }
    function step(d) {
      const now = performance.now();
      if (now < lockUntil) return;
      lockUntil = now + (REDUCE ? 300 : 850);
      goTo(i + d);
    }

    function stageRect() {
      const r = stage.getBoundingClientRect();
      return { left: r.left, top: r.top, width: r.width, height: r.height };
    }
    function fly(fromRect, toRect, src, { duration = 0.9, ease = 'expo.inOut' } = {}) {
      const c = el('img', 'fly'); c.src = src; c.alt = '';
      Object.assign(c.style, { left: `${fromRect.left}px`, top: `${fromRect.top}px`, width: `${fromRect.width}px`, height: `${fromRect.height}px` });
      document.body.appendChild(c);
      return new Promise((res) => {
        gsap.to(c, { left: toRect.left, top: toRect.top, width: toRect.width, height: toRect.height, duration: T(duration), ease, onComplete: () => res(c) });
      });
    }

    const chrome = () => [strip, $('.win-side'), $('.win-foot')];

    /* open: fromImg is the element that grows into the stage */
    function open(id, start, fromImg, done) {
      if (state.busy) return;
      state.busy = true;
      origin = state.view === 'home' ? 'home' : 'sheet';
      build(id, start);
      win.hidden = false;
      gsap.set(stage, { opacity: 0 }); gsap.set(chrome(), { opacity: 0 });
      const to = stageRect();
      const from = fromImg.getBoundingClientRect();
      fromImg.style.visibility = 'hidden';
      const key = proj.imgs[i];
      const wide = WIDE.has(key);
      void wide;
      fly(from, to, thumb(key)).then((c) => {
        gsap.set(stage, { opacity: 1 });
        gsap.to(c, { opacity: 0, duration: T(0.35), onComplete: () => c.remove() });
        fromImg.style.visibility = '';
        gsap.to(chrome(), { opacity: 1, duration: T(0.5), stagger: 0.06 });
        views[state.view].inert = true;
        if (origin === 'home') gsap.to(views.home, { autoAlpha: 0, duration: T(0.3) });
        state.busy = false;
        $('#winClose').focus({ preventScroll: true });
        if (done) done();
      });
      if (origin === 'sheet') gsap.to('#sheet', { opacity: 0, duration: T(0.6), ease: 'power2.out' });
    }

    function close(instant) {
      if (state.busy && !instant) return;
      const id = proj && proj.id;
      if (instant) {
        win.hidden = true; views[state.view].inert = false;
        gsap.set(views.home, { autoAlpha: 1 });
        home.reset(); wall.clear(); gsap.set('#sheet', { opacity: 1 }); return;
      }
      state.busy = true;
      closeDrawer(true);
      gsap.to(chrome(), { opacity: 0, duration: T(0.3) });
      const fromR = stageRect();
      let target = null;
      if (origin === 'home') { gsap.set(views.home, { autoAlpha: 1 }); target = home.returnFrom(id); }
      else gsap.to('#sheet', { opacity: 1, duration: T(0.6), delay: 0.2 });
      const finish = () => {
        win.hidden = true; views[state.view].inert = false; state.busy = false;
        if (origin === 'home') { wall.clear(); home.reset(); }
        else wall.clear();
      };
      if (target && P[id].imgs[i] === P[id].frame) {
        // the stage shrinks back into its frame on the wall
        gsap.set(stage, { opacity: 0 });
        const tImg = $('img', target);
        fly(fromR, tImg.getBoundingClientRect(), thumb(P[id].frame), { duration: 0.8 }).then((c) => {
          gsap.set(target, { opacity: 1 }); c.remove(); finish();
        });
      } else {
        gsap.to(stage, { opacity: 0, duration: T(0.45), onComplete: () => {
          if (target) gsap.to(target, { opacity: 1, duration: T(0.5) });
          finish();
        } });
      }
    }

    function neighbour(d) {
      if (state.busy) return;
      const order = PROJECTS.map((p) => p.id);
      const n = (order.indexOf(proj.id) + d + order.length) % order.length;
      state.busy = true;
      gsap.to([stage, strip], { opacity: 0, duration: T(0.35), ease: 'power2.in', onComplete: () => {
        build(order[n], 0);
        gsap.to([stage, strip], { opacity: 1, duration: T(0.55), ease: 'power2.out', onComplete: () => { state.busy = false; } });
      } });
    }

    function openDrawer() {
      if (drawerOpen) return; drawerOpen = true;
      drawer.hidden = false; detailsBtn.textContent = 'Details –'; detailsBtn.setAttribute('aria-expanded', 'true');
      gsap.fromTo(drawer, { yPercent: 100 }, { yPercent: 0, duration: T(0.6), ease: 'power3.out' });
    }
    function closeDrawer(instant) {
      drawerOpen = false; detailsBtn.textContent = 'Details +'; detailsBtn.setAttribute('aria-expanded', 'false');
      if (instant) { drawer.hidden = true; return; }
      gsap.to(drawer, { yPercent: 100, duration: T(0.45), ease: 'power3.in', onComplete: () => { drawer.hidden = true; } });
    }

    detailsBtn.addEventListener('click', () => (drawerOpen ? closeDrawer() : openDrawer()));
    $('#winClose').addEventListener('click', () => close());
    $('#prevProj').addEventListener('click', () => neighbour(-1));
    $('#nextProj').addEventListener('click', () => neighbour(1));
    track.addEventListener('click', () => { if (i === proj.imgs.length - 1) neighbour(1); else step(1); });

    return {
      open, close, step, neighbour,
      escape() { if (drawerOpen) closeDrawer(); else close(); },
      key(e) {
        if (e.key === 'ArrowDown') { e.preventDefault(); step(1); }
        if (e.key === 'ArrowUp') { e.preventDefault(); step(-1); }
        if (e.key === 'ArrowRight') { e.preventDefault(); neighbour(1); }
        if (e.key === 'ArrowLeft') { e.preventDefault(); neighbour(-1); }
      }
    };
  })();

  /* ------------------------------------------------------------------
     WORK — contact sheet of every photograph, and an index
  ------------------------------------------------------------------ */
  const work = (() => {
    const sheet = $('#sheet'), scroll = $('#sheetScroll'), index = $('#index'), list = $('#indexList'), preview = $('#indexPreview');
    const toggle = $('#workToggle');
    const order = [...HANG, 'velvet', 'tudor'];
    const cells = [];
    order.forEach((id) => {
      const p = P[id];
      p.imgs.forEach((k, n) => {
        const c = el('button', 'cell', `<img src="${thumb(k)}" alt="" loading="lazy" decoding="async">`);
        c.type = 'button'; c.dataset.p = id;
        c.setAttribute('aria-label', `${p.name}, image ${n + 1}`);
        c.addEventListener('mouseenter', () => light(id));
        c.addEventListener('focus', () => light(id));
        c.addEventListener('click', () => winCtl.open(id, n, $('img', c)));
        sheet.appendChild(c); cells.push(c);
      });
    });
    function light(id) {
      sheet.classList.add('is-dim');
      cells.forEach((c) => c.classList.toggle('is-lit', c.dataset.p === id));
    }
    sheet.addEventListener('mouseleave', () => { sheet.classList.remove('is-dim'); });

    order.forEach((id) => {
      const p = P[id];
      const li = el('li');
      const b = el('button', '', p.name); b.type = 'button';
      const show = () => {
        preview.innerHTML = p.imgs.slice(0, 12).map((k) => `<img src="${thumb(k)}" alt="">`).join('');
        gsap.fromTo(preview.children, { opacity: 0 }, { opacity: 1, duration: T(0.4), stagger: 0.025 });
      };
      b.addEventListener('mouseenter', show); b.addEventListener('focus', show);
      b.addEventListener('click', () => {
        const img = preview.querySelector('img') || b;
        winCtl.open(id, 0, img);
      });
      li.appendChild(b); list.appendChild(li);
    });

    toggle.addEventListener('click', () => {
      const toIndex = index.hidden;
      const out = toIndex ? scroll : index, inn = toIndex ? index : scroll;
      gsap.to(out, { opacity: 0, duration: T(0.3), onComplete: () => {
        out.hidden = true; gsap.set(out, { opacity: 1 }); inn.hidden = false;
        if (toIndex) {
          list.querySelector('button').dispatchEvent(new Event('mouseenter'));
          gsap.fromTo($$('li', list), { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: T(0.6), stagger: 0.04, ease: 'power3.out' });
        } else {
          gsap.fromTo(inn, { opacity: 0 }, { opacity: 1, duration: T(0.4) });
        }
      } });
      toggle.textContent = toIndex ? 'Sheet' : 'Index';
      toggle.setAttribute('aria-pressed', toIndex);
    });

    return {
      enter() {
        scroll.scrollTop = 0; sheet.classList.remove('is-dim'); gsap.set(sheet, { opacity: 1 });
        gsap.fromTo(cells.slice(0, 72), { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: T(0.6), stagger: { each: 0.008, from: 'start' }, ease: 'power2.out' });
      }
    };
  })();

  /* ------------------------------------------------------------------
     SERVICES — six chapters, one word each, and an ivory sheet
  ------------------------------------------------------------------ */
  const svc = (() => {
    const view = $('#services'), box = $('#chapters'), prog = $('#chapterProgress'), sheetEl = $('#svcSheet'), body = $('#svcBody');
    let current = 0, loop = null, open = false, peeking = false, shown = -1;
    const chapters = SERVICES.map((s, n) => {
      const c = el('button', 'chapter', `<img src="${full(s.cover)}" alt="" loading="${n < 2 ? 'eager' : 'lazy'}" decoding="async"><span class="chapter-word">${s.word}</span>`);
      c.type = 'button'; c.setAttribute('aria-label', s.name);
      c.addEventListener('click', () => { if (!open) openSheet(n); });
      box.appendChild(c);
      const t = el('button'); t.type = 'button'; t.setAttribute('aria-label', s.name);
      t.addEventListener('click', () => centre(n));
      prog.appendChild(t);
      return c;
    });
    const ticks = $$('button', prog);
    const io = new IntersectionObserver((en) => en.forEach((e) => {
      if (e.isIntersecting && e.intersectionRatio > 0.55) {
        e.target.classList.add('is-in');
        if (open) return;
        current = chapters.indexOf(e.target);
        ticks.forEach((t, n) => t.classList.toggle('is-active', n === current));
      }
    }), { root: box, threshold: [0.55] });
    chapters.forEach((c) => io.observe(c));

    function centre(n) {
      const c = chapters[n];
      const top = c.offsetTop - (box.clientHeight - c.offsetHeight) / 2;
      box.scrollTo({ top, behavior: REDUCE ? 'auto' : 'smooth' });
    }

    /* With the sheet open, the left side moves ONLY when the visitor scrolls over it.
       A scroll shrinks the chapters so the services before and after are visible,
       steps one service, then settles back to full height. */
    const size = { h: 0, g: 0, pos: 0 };
    let settleT = null, lockUntil = 0;
    function apply() {
      const H = box.clientHeight, p = (H - size.h) / 2;
      chapters.forEach((c) => { c.style.height = `${size.h}px`; });
      box.style.rowGap = `${size.g}px`; box.style.paddingTop = box.style.paddingBottom = `${p}px`;
      box.scrollTop = size.pos * (size.h + size.g);
    }
    function setSize(on, dur) {
      peeking = on;
      const H = box.clientHeight;
      gsap.to(size, { h: on ? H * 0.62 : H, g: on ? 16 : 0, duration: T(dur), ease: 'power3.inOut', overwrite: 'auto', onUpdate: apply });
      view.classList.toggle('is-peek', on);
    }
    function lockFull() {
      // exact full-height state, no animation in flight
      gsap.killTweensOf(size);
      size.h = box.clientHeight; size.g = 0; size.pos = current; peeking = false;
      view.classList.remove('is-peek');
      apply();
    }
    function peek(on) { if (!on) { clearTimeout(settleT); lockFull(); } }
    box.addEventListener('wheel', (e) => {
      if (!open) return;
      e.preventDefault();
      if (Math.abs(e.deltaY) < 4) return;
      clearTimeout(settleT);
      settleT = setTimeout(() => setSize(false, 0.6), 700);
      const now = performance.now();
      if (now < lockUntil) return;
      const n = Math.max(0, Math.min(SERVICES.length - 1, current + (e.deltaY > 0 ? 1 : -1)));
      if (!peeking) setSize(true, 0.45);
      if (n === current) return;
      lockUntil = now + 750;
      current = n;
      ticks.forEach((t, k) => t.classList.toggle('is-active', k === n));
      chapters[n].classList.add('is-in');
      gsap.to(size, { pos: n, duration: T(0.7), ease: 'power3.inOut', onUpdate: apply });
      render(n, true);
    }, { passive: false });

    function render(n, animate) {
      shown = n;
      const s = SERVICES[n];
      const html = `<p class="eyebrow">Service ${pad(n + 1)} / ${pad(SERVICES.length)}</p><h2>${s.name}</h2><p>${s.copy}</p>
        <div class="svc-frame"><div class="svc-frame-track">${s.imgs.map((k, j) => `<div class="slide" style="top:${j * 100}%"><img src="${full(k)}" alt=""></div>`).join('')}</div></div>
        <button class="cap ink send" type="button" data-open="contact">Begin a project</button>`;
      const fill = () => {
        body.innerHTML = html;
        gsap.fromTo(body.children, { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: T(0.55), stagger: 0.05, ease: 'power2.out' });
        const tr = $('.svc-frame-track', body); let j = 0;
        clearInterval(loop);
        if (!REDUCE) loop = setInterval(() => { j = 1 - j; gsap.to(tr, { yPercent: -100 * j, duration: 1.1, ease: 'power3.inOut' }); }, 3200);
      };
      if (animate) gsap.to(body.children, { opacity: 0, y: -8, duration: T(0.25), onComplete: fill });
      else fill();
    }

    function openSheet(n) {
      open = true; current = n;
      view.classList.add('has-sheet'); document.body.classList.add('svc-open');
      sheetEl.hidden = false;
      render(n, false);
      box.style.overflowY = 'hidden'; box.style.scrollSnapType = 'none'; box.style.scrollBehavior = 'auto';
      ticks.forEach((t, k) => t.classList.toggle('is-active', k === n));
      requestAnimationFrame(() => lockFull());
      gsap.fromTo(sheetEl, { xPercent: 100 }, { xPercent: 0, duration: T(0.7), ease: 'power3.out' });
      $('#svcClose').focus({ preventScroll: true });
    }
    function closeSheet(instant) {
      if (!open && !instant) return;
      open = false; clearInterval(loop); shown = -1;
      peek(false);
      const done = () => { box.style.scrollBehavior = ''; box.style.overflowY = ''; box.style.scrollSnapType = ''; chapters.forEach((c) => { c.style.height = ''; }); box.style.rowGap = box.style.paddingTop = box.style.paddingBottom = ''; sheetEl.hidden = true; view.classList.remove('has-sheet'); document.body.classList.remove('svc-open'); requestAnimationFrame(() => centre(current)); };
      if (instant) { done(); return; }
      gsap.to(sheetEl, { xPercent: 100, duration: T(0.55), ease: 'power3.in', onComplete: done });
    }
    $('#svcClose').addEventListener('click', () => closeSheet());
    return {
      enter() { box.scrollTop = 0; chapters.forEach((c) => c.classList.remove('is-in')); requestAnimationFrame(() => chapters[0].classList.add('is-in')); },
      closeSheet, get open() { return open; }
    };
  })();

  /* ------------------------------------------------------------------
     STUDIO — one frame alone, Details + reveals the rest
  ------------------------------------------------------------------ */
  const STUDIO_IMGS = ['s7-studio-lounge', 's8-studio-office', 's8-studio-lounge-wide', 's7-studio-doors', 's8-studio-chair',
    's7-studio-cabinet', 's8-studio-conference', 's8-studio-bar-cart', 's7-studio-samples', 's8-studio-logo-wall', 's8-studio-desk',
    's7-studio-gallery', 's8-studio-reception', 's8-studio-red-room', 's7-studio-powder', 's8-studio-workroom', 's7-studio-exterior'];
  const studio = (() => {
    const view = $('#studio'), row = $('#studioRow'), drawer = $('#studioDrawer'), btn = $('#studioDetails');
    let isOpen = false, target = 0;
    STUDIO_IMGS.forEach((k, n) => {
      const f = el('figure', '', `<img src="${full(k)}" alt="The Rivington Marx studio, photograph ${n + 1}" loading="${n < 4 ? 'eager' : 'lazy'}" decoding="async" draggable="false">`);
      row.appendChild(f);
    });
    const max = () => row.scrollWidth - row.clientWidth;
    function glide(to) {
      target = Math.max(0, Math.min(max(), to));
      gsap.to(row, { scrollLeft: target, duration: T(0.9), ease: 'power3.out', overwrite: true });
    }
    // vertical wheel moves the row sideways — the only movement on this screen
    view.addEventListener('wheel', (e) => {
      if (isOpen) return;
      e.preventDefault();
      const d = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
      glide(target + d * 1.6);
    }, { passive: false });
    // drag to scroll
    let down = null;
    row.addEventListener('pointerdown', (e) => { down = { x: e.clientX, s: row.scrollLeft }; row.classList.add('is-drag'); row.setPointerCapture(e.pointerId); });
    row.addEventListener('pointermove', (e) => { if (!down) return; gsap.killTweensOf(row); row.scrollLeft = down.s - (e.clientX - down.x) * 1.4; target = row.scrollLeft; });
    const up = () => { down = null; row.classList.remove('is-drag'); };
    row.addEventListener('pointerup', up); row.addEventListener('pointercancel', up);
    row.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowRight') { e.preventDefault(); glide(target + 480); }
      if (e.key === 'ArrowLeft') { e.preventDefault(); glide(target - 480); }
    });

    function open() {
      isOpen = true; drawer.hidden = false; btn.textContent = 'Details –'; btn.setAttribute('aria-expanded', 'true');
      gsap.fromTo(drawer, { yPercent: 100 }, { yPercent: 0, duration: T(0.6), ease: 'power3.out' });
    }
    function close(instant) {
      isOpen = false; btn.textContent = 'Details +'; btn.setAttribute('aria-expanded', 'false');
      if (instant) { drawer.hidden = true; return; }
      gsap.to(drawer, { yPercent: 100, duration: T(0.45), ease: 'power3.in', onComplete: () => { drawer.hidden = true; } });
    }
    btn.addEventListener('click', () => (isOpen ? close() : open()));
    return {
      close, get open() { return isOpen; },
      enter() { row.scrollLeft = 0; target = 0; gsap.fromTo($$('figure', row).slice(0, 5), { opacity: 0, x: 40 }, { opacity: 1, x: 0, duration: T(0.8), stagger: 0.07, ease: 'power3.out' }); }
    };
  })();

  /* ------------------------------------------------------------------
     CONTACT — a drawer from the right; the wall stays visible
  ------------------------------------------------------------------ */
  const panel = $('#contactPanel');
  function openContact() {
    contact.hidden = false;
    gsap.fromTo('.contact-scrim', { opacity: 0 }, { opacity: 1, duration: T(0.5) });
    gsap.fromTo(panel, { xPercent: 100 }, { xPercent: 0, duration: T(0.7), ease: 'power3.out' });
    gsap.fromTo($('#contactBody').children, { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: T(0.6), stagger: 0.06, delay: T(0.25) });
    $('.contact-close').focus({ preventScroll: true });
  }
  function closeContact() {
    gsap.to('.contact-scrim', { opacity: 0, duration: T(0.4) });
    gsap.to(panel, { xPercent: 100, duration: T(0.5), ease: 'power3.in', onComplete: () => { contact.hidden = true; } });
  }
  $$('[data-close-contact]').forEach((b) => b.addEventListener('click', closeContact));
  $('#contactForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const b = $('#contactBody');
    gsap.to(b, { opacity: 0, duration: T(0.3), onComplete: () => {
      b.innerHTML = '<p class="eyebrow">Thank you</p><h2>We will be in touch.</h2><p style="font:400 15px/1.6 var(--ui);color:#3a342e">This study does not send messages. On the live site this form would reach the studio.</p>';
      gsap.to(b, { opacity: 1, duration: T(0.5) });
    } });
  });

  /* ------------------------------------------------------------------
     GLOBAL WIRING
  ------------------------------------------------------------------ */
  document.addEventListener('click', (e) => {
    const g = e.target.closest('[data-go]');
    if (g) { e.preventDefault(); go(g.dataset.go); return; }
    const o = e.target.closest('[data-open="contact"]');
    if (o) { e.preventDefault(); openContact(); }
  });

  function initObserver() {
    gsap.registerPlugin(Observer);
    Observer.create({
      target: window, type: 'wheel,touch', wheelSpeed: -1, tolerance: 14, preventDefault: false,
      onUp: () => { if (topLayer() === 'window') winCtl.step(1); },
      onDown: () => { if (topLayer() === 'window') winCtl.step(-1); }
    });
  }

  document.addEventListener('keydown', (e) => {
    const t = topLayer();
    if (e.target.closest('input, textarea')) { if (e.key === 'Escape') closeContact(); return; }
    if (e.key === 'Escape') {
      if (t === 'contact') closeContact();
      else if (t === 'window') winCtl.escape();
      else if (t === 'svc') svc.closeSheet();
      else if (t === 'studio' && studio.open) studio.close();
      else if (t !== 'home') go('home');
      return;
    }
    if (t === 'home') home.key(e);
    else if (t === 'window') winCtl.key(e);
  });

  /* ------------------------------------------------------------------
     START
  ------------------------------------------------------------------ */
  initObserver();
  setNavHere();
  const h = location.hash.replace('#', '');
  if (views[h] && h !== 'home') {
    views.home.hidden = true; views[h].hidden = false; state.view = h; setNavHere();
    if (h === 'work') work.enter(); if (h === 'services') svc.enter();
    $('#intro').remove();
  } else {
    home.intro();
  }
})();
