/* Rivington Marx — Study 07 / The Diptych
   One screen, two photographs, almost no words.
   GSAP 3.12.5 + Observer (vendored in ./vendor). */

(() => {
  'use strict';

  /* ------------------------------------------------------------------
     DATA
     Project names and groupings are working titles for creative review.
     Credits in [brackets] are placeholders to be supplied by the client.
  ------------------------------------------------------------------ */
  const A = '../assets/';
  const src = (k) => `${A}${k}.jpg`;

  const WIDE = new Set([
    'stone-kitchen', 'stone-kitchen-corner', 'stone-kitchen-side',
    'holiday-dining', 'holiday-living',
    'salon-living', 'salon-gold-table', 'salon-blue-chair', 'salon-blue-wall',
    'collected-living', 'glass-guest', 'garnet-kitchen',
    'teal-kitchen', 'teal-bedroom', 'teal-desk',
    'dark-kitchen', 'tudor-bedroom', 'gold-dining', 'velvet-red-wall',
    'light-living', 'light-dining', 'studio-exterior'
  ]);

  const credits = (photo) => ({
    'Interior design': 'Rivington Marx Interiors',
    'Architecture': '[Architect]',
    'Build': '[Builder]',
    'Photography': photo || '[Photographer]'
  });

  const PROJECTS = [
    {
      id: 'stone', name: 'Tailored in Stone', type: 'Kitchen & Baths', tint: '#7a4f47',
      pair: ['stone-coffee-bar', 'stone-powder-sink'],
      imgs: ['stone-coffee-bar', 'stone-coffee-doors', 'stone-kitchen', 'stone-kitchen-vignette',
        'stone-kitchen-corner', 'stone-bar', 'tailored-bar', 'stone-kitchen-side',
        'stone-powder-sink', 'stone-powder-lights', 'stone-powder-tile', 'stone-primary-bath',
        'tailored-bath', 'stone-shower'],
      story: 'A kitchen, a bar and three baths drawn from one quiet palette: veined marble, warm oak and a rose-coloured stone that carries from the coffee bar into the powder room. The joinery is tailored to the inch, so storage disappears and the stone is left to speak.',
      credits: credits('Eric Lucero Photography')
    },
    {
      id: 'salon', name: 'The Blue Salon', type: 'Living & Bar', tint: '#1f3550',
      pair: ['blue-salon', 'salon-velvet-corner'],
      imgs: ['blue-salon', 'salon-blue-bar', 'salon-blue-chair', 'salon-blue-wall',
        'salon-velvet-corner', 'salon-living', 'salon-gold-table', 'salon-gilt-figure'],
      story: 'Deep blue walls, velvet and gilt. The salon is built around a painted bar cabinet and a collection of gold pieces, with a lounge in sand and teal beside it. Pattern stays on the walls and the textiles; the furniture stays low and generous.',
      credits: credits()
    },
    {
      id: 'glass', name: 'The Stained Glass House', type: 'Whole Home', tint: '#33393a',
      pair: ['glass-window', 'foyer'],
      imgs: ['glass-window', 'foyer', 'glass-hall', 'portrait-vignette', 'collected-living',
        'glass-sofa', 'desk', 'glass-guest', 'glass-bedroom', 'black-bath', 'glass-powder'],
      story: 'A tall house of stained glass, a dark staircase and gold light fittings that read like jewellery against grey grasscloth. Blue-and-white pottery, patterned rugs and strong art keep the darker palette warm from the front door to the powder room.',
      credits: credits()
    },
    {
      id: 'teal', name: 'The Teal Kitchen House', type: 'Whole Home', tint: '#1f4a4d',
      pair: ['teal-fireplace', 'teal-pink-bedroom'],
      imgs: ['teal-fireplace', 'teal-kitchen', 'teal-nook', 'teal-doors', 'window-seat',
        'teal-desk', 'teal-powder', 'teal-bedroom', 'teal-pink-bedroom'],
      story: 'Teal tile, navy cabinetry and brass in the kitchen; a fireside sitting room in stone and silver; and upstairs, a pink bedroom with flamingo wallpaper. Each room takes one confident colour and lets the detail follow.',
      credits: credits()
    },
    {
      id: 'holiday', name: 'Holiday House', type: 'Seasonal', tint: '#6e1f1d',
      pair: ['holiday-red-tree', 'holiday-garland-stair'],
      imgs: ['holiday-red-tree', 'holiday-living', 'holiday-window', 'holiday-candles',
        'holiday-dining', 'holiday-cabinet', 'holiday-hearth', 'holiday-garland-stair',
        'holiday-stripe-stair', 'holiday-tree-lounge', 'holiday-silver-tree', 'holiday-mantel',
        'red-detail', 'holiday-kitchen'],
      story: 'The house dressed for the season. Garland runs the stair, candles gather on the table and one tree is lit entirely in red. Every room keeps its own colour story, so the decoration reads as part of the interior rather than a layer on top of it.',
      credits: credits()
    },
    {
      id: 'garnet', name: 'The Garnet Room', type: 'Dining & Library', tint: '#5a1f2b',
      pair: ['garnet-dining', 'garnet-glassware'],
      imgs: ['garnet-dining', 'pink-dining', 'green-study', 'garnet-nook', 'garnet-kitchen',
        'garnet-glassware', 'collected-bath', 'garnet-cellar'],
      story: 'A dining room and library lacquered in garnet, under a sculptural pendant and painted branches. Below, an exposed-brick hall, a glass-fronted bar and a wine room in leather and stone carry the same warmth through the house.',
      credits: credits()
    },
    {
      id: 'velvet', name: 'Red Velvet House', type: 'Whole Home', tint: '#6b2a22',
      pair: ['velvet-arch', 'velvet-sofa'],
      imgs: ['velvet-arch', 'velvet-sofa', 'velvet-red-wall', 'velvet-piano', 'velvet-throw',
        'vignette', 'gold-dining', 'velvet-brick-bar', 'dining-detail', 'velvet-koi-powder'],
      story: 'Red velvet, carved wood and gold. A collected house where an arched passage frames a portrait, a brick wall holds the bar and the living room gathers a piano, a fireplace and a lifetime of art.',
      credits: credits()
    },
    {
      id: 'tudor', name: 'Patterned Ceilings', type: 'Whole Home', tint: '#3a3128',
      pair: ['kitchen-dark', 'tudor-powder'],
      imgs: ['kitchen-dark', 'dark-kitchen', 'tudor-stair', 'tudor-shelves', 'tudor-chair',
        'tudor-portrait', 'tudor-bedroom', 'tudor-bath', 'tudor-powder'],
      story: 'Printed ceilings, black millwork and old rugs. The kitchen sits beneath a patterned ceiling with an arched hood, the powder room pairs black tile with butter yellow, and portraits hang throughout.',
      credits: credits()
    },
    {
      id: 'light', name: 'Soft Light', type: 'Whole Home', tint: '#6f6455',
      pair: ['light-wall-hanging', 'light-bath'],
      imgs: ['light-wall-hanging', 'light-living', 'light-fireplace', 'light-sitting', 'light-reading',
        'light-console', 'light-dining', 'light-kitchen', 'light-desk', 'powder-detail', 'light-bath'],
      story: 'Plaster white, linen and pale stone, with sculptural lighting and black accents. A calm house made for daylight, where a woven wall hanging, a curved vanity and a reading corner carry all the texture.',
      credits: credits()
    }
  ];
  const P = Object.fromEntries(PROJECTS.map((p) => [p.id, p]));
  const FEATURED = ['stone', 'salon', 'glass', 'teal', 'holiday', 'garnet', 'velvet', 'tudor'];

  const SERVICES = [
    { word: 'Interiors', name: 'Interior Design', cover: 'velvet-piano',
      imgs: ['velvet-piano', 'glass-sofa', 'salon-velvet-corner', 'light-wall-hanging', 'velvet-sofa'],
      copy: 'Full-service interior design, from the plan and the palette to the last object on the shelf. Rooms are layered slowly, with pieces chosen to last.' },
    { word: 'Kitchens', name: 'Kitchen Design', cover: 'kitchen-dark',
      imgs: ['kitchen-dark', 'stone-coffee-bar', 'stone-coffee-doors', 'light-kitchen', 'teal-nook'],
      copy: 'Kitchens planned around the way a household cooks and gathers. Cabinetry, stone and light are designed together, so the room works as hard as it looks.' },
    { word: 'Baths', name: 'Bathroom Design', cover: 'stone-powder-sink',
      imgs: ['stone-powder-sink', 'light-bath', 'glass-powder', 'tudor-powder', 'stone-shower'],
      copy: 'Primary baths and powder rooms treated as rooms in their own right. Stone, tile and light are chosen to feel calm every day and memorable for guests.' },
    { word: 'Remodeling', name: 'Home Remodeling', cover: 'collected-bath',
      imgs: ['collected-bath', 'tudor-stair', 'velvet-arch', 'window-seat'],
      copy: 'Remodels that respect what a house already has. Walls, flow and finishes are reworked so the home suits the way you live now.' },
    { word: 'Design Build', name: 'Design Build', cover: 'garnet-glassware',
      imgs: ['garnet-glassware', 'stone-bar', 'powder-detail', 'tailored-bar'],
      copy: 'Design and construction managed as one process. A single team carries the drawings through the build, so the details survive to the finish.' },
    { word: 'Architecture', name: 'Architectural Design', cover: 'foyer',
      imgs: ['foyer', 'glass-window', 'glass-hall', 'light-fireplace'],
      copy: 'Interior architecture that sets the bones before the decoration: plans, elevations, millwork and the proportions of every room.' }
  ];

  const PRESS = ['Houzz', 'LUXE', '5280', 'Colorado Homes & Lifestyles', 'House Beautiful'];

  /* ------------------------------------------------------------------
     HELPERS
  ------------------------------------------------------------------ */
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const el = (tag, cls, html) => { const n = document.createElement(tag); if (cls) n.className = cls; if (html != null) n.innerHTML = html; return n; };
  const pad = (n) => String(n).padStart(2, '0');
  const REDUCE = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const T = (s) => (REDUCE ? Math.min(s, 0.2) : s);

  const loadImg = (img, url) => new Promise((res) => {
    if (img.getAttribute('src') === url && img.complete) return res();
    img.onload = img.onerror = () => { img.onload = img.onerror = null; res(); };
    img.src = url;
  });
  const preload = (url) => { const i = new Image(); i.src = url; };

  /* cross-fade between two stacked .layer images inside a container */
  function fadeTo(box, url, { duration = 1.4, delay = 0, alt = '' } = {}) {
    const front = $('.layer.is-front', box);
    const back = $$('.layer', box).find((l) => l !== front);
    if (front.getAttribute('src') === url) return Promise.resolve();
    gsap.killTweensOf([front, back]);
    // the incoming image must sit above the outgoing one, whichever order they are in the DOM
    gsap.set(front, { zIndex: 1 });
    gsap.set(back, { opacity: 0, zIndex: 2 });
    back.alt = alt;
    return loadImg(back, url).then(() => new Promise((res) => {
      gsap.to(back, {
        opacity: 1, duration: T(duration), delay: REDUCE ? 0 : delay, ease: 'power2.inOut',
        onComplete: () => {
          back.classList.add('is-front'); front.classList.remove('is-front');
          gsap.set(front, { opacity: 0 }); res();
        }
      });
    }));
  }
  function setLayer(box, url, alt = '') {
    const front = $('.layer.is-front', box);
    $$('.layer', box).forEach((l) => { gsap.killTweensOf(l); if (l !== front) gsap.set(l, { opacity: 0 }); });
    gsap.set(front, { opacity: 1 });
    front.alt = alt;
    return loadImg(front, url);
  }

  /* ------------------------------------------------------------------
     STATE + LAYERS
  ------------------------------------------------------------------ */
  const cur = $('#cursorLabel');
  const views = { home: $('#home'), work: $('#work'), services: $('#services') };
  const win = $('#win'), indexOv = $('#indexOv'), menuOv = $('#menuOv'), wipeEl = $('#wipe');
  const state = { view: 'home', stack: [], busy: false };
  const top = () => state.stack[state.stack.length - 1] || state.view;

  function syncInert() {
    const t = top();
    Object.entries(views).forEach(([k, v]) => { v.inert = state.stack.length > 0 || k !== state.view; });
    [['window', win], ['index', indexOv], ['menu', menuOv]].forEach(([k, v]) => { v.inert = k !== t; });
    home.syncPlay();
  }
  function pushLayer(name) { state.stack = state.stack.filter((s) => s !== name); state.stack.push(name); syncInert(); }
  function dropLayer(name) { state.stack = state.stack.filter((s) => s !== name); syncInert(); }

  /* the bone wipe: cover from one side, swap, uncover to the other */
  function wipe(from = 'left', mid = () => {}) {
    if (state.busy) return Promise.resolve();
    state.busy = true;
    wipeEl.classList.add('is-busy');
    cur.classList.remove('is-on');
    return new Promise((res) => {
      const done = () => { state.busy = false; wipeEl.classList.remove('is-busy'); res(); };
      if (REDUCE) {
        gsap.timeline({ onComplete: done })
          .set(wipeEl, { xPercent: 0, opacity: 0 })
          .to(wipeEl, { opacity: 1, duration: 0.1 })
          .add(() => mid())
          .to(wipeEl, { opacity: 0, duration: 0.1 })
          .set(wipeEl, { xPercent: -101, opacity: 1 });
        return;
      }
      const s = from === 'left' ? -1 : 1;
      gsap.timeline({ onComplete: done })
        .set(wipeEl, { xPercent: 101 * s, opacity: 1 })
        .to(wipeEl, { xPercent: 0, duration: 0.45, ease: 'expo.in' })
        .add(() => mid())
        .to(wipeEl, { xPercent: -101 * s, duration: 0.5, ease: 'expo.out' }, '+=0.04');
    });
  }

  function setView(name) {
    Object.entries(views).forEach(([k, v]) => { v.hidden = k !== name; v.classList.toggle('is-active', k === name); });
    state.view = name;
    if (name === 'work') work.enter();
    syncInert();
  }

  function closeAllInstant() {
    if (!win.hidden) winCtl.hideNow();
    indexOv.hidden = true; menuOv.hidden = true;
    state.stack = [];
  }

  function go(name, from = 'left') {
    if (state.view === name && !state.stack.length) return;
    wipe(from, () => { closeAllInstant(); setView(name); });
  }

  /* ------------------------------------------------------------------
     HOME — the diptych
  ------------------------------------------------------------------ */
  const home = (() => {
    const left = $('.half-left'), right = $('.half-right');
    const ticksBox = $('#ticks'), pauseBtn = $('#pauseBtn'), cap = $('#homeCaption');
    const AUTOPLAY = 4; // seconds
    let i = 0, timer = null, userPaused = REDUCE, hoverHold = false, idleT = null, lockUntil = 0, capT = null;

    const ticks = FEATURED.map((id, k) => {
      const b = el('button', 'tick', '<span class="fill"></span>');
      b.type = 'button'; b.setAttribute('role', 'tab');
      b.setAttribute('aria-label', `${P[id].name}`);
      b.addEventListener('click', () => show(k));
      ticksBox.appendChild(b);
      return b;
    });

    function label(k) { const p = P[FEATURED[k]]; return `${p.name} · ${p.type}`; }

    function show(k, first = false) {
      k = (k + FEATURED.length) % FEATURED.length;
      if (!first && k === i) return;
      i = k;
      const p = P[FEATURED[i]];
      ticks.forEach((t, n) => { t.classList.toggle('is-active', n === i); t.setAttribute('aria-selected', n === i); });
      left.setAttribute('aria-label', `Open ${p.name}`);
      right.setAttribute('aria-label', `Open ${p.name}, detail`);
      $('em', cap).textContent = label(i);
      if (first) {
        setLayer(left, src(p.pair[0]), p.name);
        setLayer(right, src(p.pair[1]), p.name);
      } else {
        // left turns first, right follows ~350ms later — a page turning
        fadeTo(left, src(p.pair[0]), { duration: 1.4, alt: p.name });
        fadeTo(right, src(p.pair[1]), { duration: 1.4, delay: 0.35, alt: p.name });
      }
      // preload only the next pair
      const n = P[FEATURED[(i + 1) % FEATURED.length]];
      preload(src(n.pair[0])); preload(src(n.pair[1]));
      startTimer();
    }

    function startTimer() {
      if (timer) timer.kill();
      $$('.fill', ticksBox).forEach((f) => gsap.set(f, { scaleX: 0 }));
      timer = gsap.to($('.fill', ticks[i]), {
        scaleX: 1, duration: AUTOPLAY, ease: 'none', paused: true,
        onComplete: () => show(i + 1)
      });
      syncPlay();
    }
    function syncPlay() {
      if (!timer) return;
      const run = !userPaused && !hoverHold && top() === 'home' && !document.hidden;
      run ? timer.play() : timer.pause();
    }
    function step(d) {
      const now = performance.now();
      if (now < lockUntil) return;
      lockUntil = now + (REDUCE ? 400 : 1300);
      show(i + d);
    }

    pauseBtn.addEventListener('click', () => {
      userPaused = !userPaused;
      pauseBtn.textContent = userPaused ? 'Play' : 'Pause';
      pauseBtn.setAttribute('aria-pressed', userPaused);
      syncPlay();
    });

    // pause while the visitor is pointing at the photographs; resume once the pointer rests
    [left, right].forEach((h) => {
      h.addEventListener('pointermove', () => {
        hoverHold = true; syncPlay();
        cap.classList.add('is-on');
        clearTimeout(idleT); clearTimeout(capT);
        idleT = setTimeout(() => { hoverHold = false; syncPlay(); }, 3000);
        capT = setTimeout(() => cap.classList.remove('is-on'), 2600);
      });
      h.addEventListener('pointerleave', () => {
        cap.classList.remove('is-on'); hoverHold = false; clearTimeout(idleT); syncPlay();
      });
      h.addEventListener('click', () => {
        const p = P[FEATURED[i]];
        const side = h === left ? 'left' : 'right';
        winCtl.openProject(p.id, p.imgs.indexOf(p.pair[side === 'left' ? 0 : 1]), side);
      });
      h.dataset.cursor = 'View';
    });
    document.addEventListener('visibilitychange', syncPlay);

    return { show, step, syncPlay, get index() { return i; } };
  })();

  /* ------------------------------------------------------------------
     WINDOW — project / service / studio / contact
  ------------------------------------------------------------------ */
  const winCtl = (() => {
    const frame = $('#winFrame'), track = $('#winTrack'), right = $('#winRight');
    const comp = $('#winCompanion'), text = $('#winText');
    const story = $('#story'), album = $('#album'), grid = $('#albumGrid');
    const barName = $('#barName'), barMeta = $('#barMeta'), barCount = $('#barCount');
    const storyBtn = $('#storyBtn'), albumBtn = $('#albumBtn'), steps = $('#barSteps');
    let cfg = null, imgs = [], i = 0, slides = [], storyOpen = false, albumOpen = false, lockUntil = 0;

    function build(c, start = 0) {
      cfg = c; imgs = c.imgs; i = Math.max(0, Math.min(start, imgs.length - 1));
      track.innerHTML = '';
      slides = imgs.map((k, n) => {
        const s = el('div', 'slide' + (WIDE.has(k) ? ' is-wide' : ''));
        s.style.top = `${n * 100}%`;
        const im = el('img'); im.alt = `${c.name}, image ${n + 1}`; im.decoding = 'async'; im.dataset.src = src(k);
        s.appendChild(im); track.appendChild(s);
        return s;
      });
      gsap.set(track, { yPercent: -100 * i });
      loadAround();

      const isProject = c.kind === 'project';
      win.classList.toggle('is-textmode', !isProject);
      win.setAttribute('aria-label', c.name);
      win.style.setProperty('--tint', c.tint || '#3a3128');
      comp.hidden = !isProject; text.hidden = isProject;
      storyBtn.hidden = true; albumBtn.hidden = !isProject;
      steps.hidden = !(c.kind === 'project' || c.kind === 'service');
      barName.textContent = c.barName || c.name;
      barMeta.textContent = c.meta || '';
      barMeta.hidden = !c.meta;
      closeStory(true); closeAlbum(true);

      if (isProject) {
        setLayer(comp, src(companionFor(i)), c.name);
        story.innerHTML = `<p class="eyebrow">Story</p><h2>${c.name}</h2><p>${c.story}</p>
          <dl class="credits">${Object.entries(c.credits).map(([k, v]) => `<dt>${k}</dt><dd>${v}</dd>`).join('')}</dl>`;
        story.hidden = false; storyOpen = true; gsap.set(story, { xPercent: 0 });
      } else {
        text.innerHTML = c.html;
        wireText();
      }
      count();
    }

    function companionFor(n) {
      // the next portrait in the sequence, so the right half always holds a full-height image
      for (let k = 1; k <= imgs.length; k++) {
        const key = imgs[(n + k) % imgs.length];
        if (!WIDE.has(key)) return key;
      }
      return imgs[n];
    }
    function loadAround() {
      for (let k = i - 1; k <= i + 2; k++) {
        const s = slides[k]; if (!s) continue;
        const im = $('img', s); if (!im.getAttribute('src')) im.src = im.dataset.src;
      }
    }
    function count() { barCount.textContent = `${pad(i + 1)} / ${pad(imgs.length)}`; }

    function goTo(n, instant = false) {
      n = Math.max(0, Math.min(n, imgs.length - 1));
      if (n === i && !instant) return;
      i = n; loadAround(); count();
      if (instant || REDUCE) gsap.set(track, { yPercent: -100 * i });
      else gsap.to(track, { yPercent: -100 * i, duration: 0.9, ease: 'power3.inOut', overwrite: true });
    }
    function step(d) {
      const now = performance.now();
      if (now < lockUntil || albumOpen) return;
      lockUntil = now + (REDUCE ? 300 : 950);
      goTo(i + d);
    }

    /* story + — tinted panel over the right half only */
    function openStory() {
      if (storyOpen) return; storyOpen = true;
      story.hidden = false; storyBtn.textContent = 'Story –'; storyBtn.setAttribute('aria-expanded', 'true');
      gsap.fromTo(story, { xPercent: 100 }, { xPercent: 0, duration: T(0.6), ease: 'power3.out' });
      gsap.fromTo(story.children, { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: T(0.6), stagger: 0.06, delay: T(0.2), ease: 'power2.out' });
    }
    function closeStory(instant) {
      if (!storyOpen && !instant) return;
      storyOpen = false; storyBtn.textContent = 'Story +'; storyBtn.setAttribute('aria-expanded', 'false');
      if (instant) { story.hidden = true; gsap.set(story, { xPercent: 100 }); return; }
      gsap.to(story, { xPercent: 100, duration: T(0.5), ease: 'power3.in', onComplete: () => { story.hidden = true; } });
    }

    /* album — contact sheet of the project */
    function openAlbum() {
      if (albumOpen) return; albumOpen = true;
      grid.innerHTML = '';
      imgs.forEach((k, n) => {
        const b = el('button', n === i ? 'is-current' : '');
        b.type = 'button'; b.setAttribute('aria-label', `Image ${n + 1}`);
        b.innerHTML = `<img src="${src(k)}" alt="" loading="lazy" decoding="async"><span class="n">${pad(n + 1)}</span>`;
        b.addEventListener('click', () => { goTo(n, true); closeAlbum(); });
        grid.appendChild(b);
      });
      album.hidden = false; album.scrollTop = 0;
      albumBtn.textContent = 'Frames'; albumBtn.setAttribute('aria-pressed', 'true');
      gsap.fromTo(album, { opacity: 0 }, { opacity: 1, duration: T(0.45) });
      gsap.fromTo(grid.children, { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: T(0.7), stagger: 0.035, ease: 'power3.out' });
    }
    function closeAlbum(instant) {
      if (!albumOpen && !instant) return;
      albumOpen = false; albumBtn.textContent = 'Album'; albumBtn.setAttribute('aria-pressed', 'false');
      if (instant) { album.hidden = true; return; }
      gsap.to(album, { opacity: 0, duration: T(0.4), onComplete: () => { album.hidden = true; } });
    }

    /* open / close */
    function open(c, start, side = 'left') {
      if (state.busy) return;
      wipe(side, () => {
        indexOv.hidden = true; menuOv.hidden = true;
        state.stack = state.stack.filter((s) => s === 'window');
        build(c, start);
        win.hidden = false;
        pushLayer('window');
      }).then(() => $('#winClose').focus({ preventScroll: true }));
    }
    function swapTo(c, start = 0) {
      // step to another project without leaving the window: a quiet dissolve
      const parts = [frame, right];
      gsap.to(parts, {
        opacity: 0, duration: T(0.35), ease: 'power2.in',
        onComplete: () => { build(c, start); gsap.to(parts, { opacity: 1, duration: T(0.6), ease: 'power2.out' }); }
      });
    }
    function close() {
      if (state.busy) return;
      wipe('right', () => { hideNow(); dropLayer('window'); });
    }
    function hideNow() { win.hidden = true; closeStory(true); closeAlbum(true); dropLayer('window'); }

    function neighbour(d) {
      if (cfg.kind === 'project') {
        const n = (PROJECTS.findIndex((p) => p.id === cfg.id) + d + PROJECTS.length) % PROJECTS.length;
        swapTo(projectCfg(PROJECTS[n].id));
      } else if (cfg.kind === 'service') {
        const n = (cfg.n + d + SERVICES.length) % SERVICES.length;
        swapTo(serviceCfg(n));
      }
    }

    function wireText() {
      $$('[data-open]', text).forEach((b) => b.addEventListener('click', () => openPanel(b.dataset.open)));
      const form = $('form', text);
      if (form) form.addEventListener('submit', (e) => {
        e.preventDefault();
        const box = form.parentElement;
        gsap.to(box, { opacity: 0, duration: T(0.3), onComplete: () => {
          box.innerHTML = '<p class="eyebrow">Thank you</p><h2>We will be in touch.</h2><p>This study does not send messages. On the live site this form would reach the studio.</p>';
          gsap.to(box, { opacity: 1, duration: T(0.5) });
        } });
      });
      const begin = $('[data-begin]', text);
      if (begin) begin.addEventListener('click', () => {
        const box = $('.contact-body', text);
        gsap.to(box, { opacity: 0, y: -8, duration: T(0.3), onComplete: () => {
          box.innerHTML = FORM_HTML; wireText();
          gsap.fromTo(box, { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: T(0.5) });
          $('input', box).focus();
        } });
      });
    }

    storyBtn.addEventListener('click', () => (storyOpen ? closeStory() : openStory()));
    albumBtn.addEventListener('click', () => (albumOpen ? closeAlbum() : openAlbum()));
    $('#winClose').addEventListener('click', close);
    $('#prevProj').addEventListener('click', () => neighbour(-1));
    $('#nextProj').addEventListener('click', () => neighbour(1));
    frame.addEventListener('click', (e) => {
      if (!e.target.closest('.slide')) return;
      if (i === imgs.length - 1 && (cfg.kind === 'project' || cfg.kind === 'service')) neighbour(1); else step(1);
    });

    return {
      openProject: (id, start = 0, side = 'left') => open(projectCfg(id), start, side),
      open, close, hideNow, step, neighbour,
      escape() { if (albumOpen) closeAlbum(); else close(); },
      get cfg() { return cfg; }, get album() { return albumOpen; },
      swapTo
    };
  })();

  function projectCfg(id) { const p = P[id]; return { kind: 'project', ...p, meta: p.type }; }
  function serviceCfg(n) {
    const s = SERVICES[n];
    return {
      kind: 'service', n, name: s.name, barName: s.word, meta: `Service ${pad(n + 1)} / ${pad(SERVICES.length)}`,
      imgs: s.imgs,
      html: `<p class="eyebrow">Services</p><h2>${s.name}</h2><p>${s.copy}</p>
        <button class="word cta" type="button" data-open="contact">Begin a project</button>`
    };
  }
  const STUDIO_CFG = () => ({
    kind: 'studio', name: 'Studio', meta: 'Denver, Colorado',
    imgs: ['studio-lounge', 'studio-cabinet', 'studio-gallery', 'studio-samples', 'studio-powder'],
    html: `<p class="eyebrow">Studio</p><h2>Rivington Marx</h2>
      <ul class="lines">
        <li>A boutique interior architecture and design firm, founded in Denver.</li>
        <li>Led by Troy Rivington and Chandra Marx.</li>
        <li>Residential work, locally and nationwide.</li>
      </ul>
      <div class="press" aria-label="In the press">${PRESS.map((p) => `<span>${p}</span>`).join('')}</div>
      <button class="word cta" type="button" data-open="contact">Begin a project</button>`
  });
  const CONTACT_CFG = () => ({
    kind: 'contact', name: 'Contact', meta: 'By appointment',
    imgs: ['studio-doors', 'studio-exterior', 'studio-gallery', 'studio-samples'],
    html: `<div class="contact-body"><p class="eyebrow">Contact</p><h2>Visit the studio</h2>
      <ul class="lines">
        <li><a href="mailto:hello@rivingtonmarx.com">hello@rivingtonmarx.com</a></li>
        <li><a href="tel:+13032254448">303 225 4448</a></li>
        <li>450 Lincoln Street, Suite 102, Denver</li>
      </ul>
      <p class="small">By appointment · Monday to Friday, 9 to 5</p>
      <button class="word cta" type="button" data-begin>Begin a project</button></div>`
  });
  const FORM_HTML = `<p class="eyebrow">Begin a project</p><h2>Tell us about your home</h2>
    <form class="form" novalidate>
      <label>Name<input name="name" autocomplete="name" required></label>
      <label>Email<input name="email" type="email" autocomplete="email" required></label>
      <label>The project<textarea name="message" rows="2"></textarea></label>
      <button class="word" type="submit">Send</button>
    </form>`;

  function openPanel(what, side = 'right') {
    if (what === 'menu') return openMenu();
    if (what === 'index') return openIndex();
    const c = what === 'contact' ? CONTACT_CFG() : STUDIO_CFG();
    if (!win.hidden) { winCtl.swapTo(c, 0); return; }
    winCtl.open(c, 0, side);
  }

  /* ------------------------------------------------------------------
     WORK — inset diptychs, gentle vertical scroll
  ------------------------------------------------------------------ */
  const work = (() => {
    const box = $('#workScroll'), countEl = $('#workCount');
    const order = [...FEATURED, 'light'];
    let current = 0;
    const items = order.map((id, n) => {
      const p = P[id];
      const it = el('article', 'work-item');
      it.innerHTML = `
        <button class="work-pair" type="button" data-cursor="View" aria-label="Open ${p.name}">
          <span class="wp-img"><img data-src="${src(p.pair[0])}" alt="" decoding="async"></span>
          <span class="wp-img"><img data-src="${src(p.pair[1])}" alt="" decoding="async"></span>
        </button>
        <p class="work-cap">${p.name}<span>${p.type}</span></p>`;
      $('.work-pair', it).addEventListener('click', (e) => {
        const r = e.currentTarget.getBoundingClientRect();
        const side = e.clientX < r.left + r.width / 2 ? 'left' : 'right';
        winCtl.openProject(id, p.imgs.indexOf(p.pair[side === 'left' ? 0 : 1]), side);
      });
      box.appendChild(it);
      return it;
    });
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (en.isIntersecting) {
          const it = en.target;
          $$('img', it).forEach((im) => { if (!im.getAttribute('src')) im.src = im.dataset.src; });
          if (en.intersectionRatio > 0.5) {
            it.classList.add('is-in');
            current = items.indexOf(it);
            countEl.textContent = `${pad(current + 1)} / ${pad(items.length)}`;
          }
        }
      });
    }, { root: box, threshold: [0, 0.55] });
    items.forEach((it) => io.observe(it));
    $$('.hair-arrow').forEach((b) => b.addEventListener('click', () => {
      const n = Math.max(0, Math.min(items.length - 1, current + Number(b.dataset.step)));
      items[n].scrollIntoView({ behavior: REDUCE ? 'auto' : 'smooth', block: 'center' });
    }));
    return {
      enter() {
        box.scrollTop = 0; current = 0; countEl.textContent = `01 / ${pad(items.length)}`;
        items.forEach((it) => it.classList.remove('is-in'));
        // first two load immediately
        items.slice(0, 2).forEach((it) => $$('img', it).forEach((im) => { im.src = im.dataset.src; }));
        requestAnimationFrame(() => items[0].classList.add('is-in'));
      }
    };
  })();

  /* ------------------------------------------------------------------
     SERVICES — six panels, horizontal accordion on hover
  ------------------------------------------------------------------ */
  (() => {
    const box = $('#panels');
    SERVICES.forEach((s, n) => {
      const b = el('button', 'panel');
      b.type = 'button'; b.dataset.cursor = 'View';
      b.setAttribute('aria-label', s.name);
      b.innerHTML = `<img src="${src(s.cover)}" alt="" loading="lazy" decoding="async"><span class="panel-num">${pad(n + 1)}</span><span class="panel-word">${s.word}</span>`;
      b.addEventListener('click', (e) => {
        const side = e.clientX < innerWidth / 2 ? 'left' : 'right';
        winCtl.open(serviceCfg(n), 0, side);
      });
      box.appendChild(b);
    });
  })();

  /* ------------------------------------------------------------------
     INDEX — list with a fixed preview frame
  ------------------------------------------------------------------ */
  const preview = $('.index-preview');
  (() => {
    const list = $('#indexList');
    PROJECTS.forEach((p) => {
      const li = el('li');
      const b = el('button', '', `${p.name}<span class="t">${p.type}</span>`);
      b.type = 'button';
      const show = () => fadeTo(preview, src(p.pair[0]), { duration: 0.45, alt: p.name });
      b.addEventListener('mouseenter', show); b.addEventListener('focus', show);
      b.addEventListener('click', () => winCtl.openProject(p.id, 0, 'right'));
      li.appendChild(b); list.appendChild(li);
    });
  })();
  function openIndex() {
    indexOv.hidden = false; pushLayer('index');
    setLayer(preview, src(PROJECTS[0].pair[0]), PROJECTS[0].name);
    gsap.fromTo(indexOv, { opacity: 0 }, { opacity: 1, duration: T(0.5), ease: 'power2.out' });
    gsap.fromTo($$('#indexList li'), { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: T(0.7), stagger: 0.04, ease: 'power3.out', delay: T(0.1) });
    $('.ov-close', indexOv).focus({ preventScroll: true });
  }

  /* ------------------------------------------------------------------
     MENU — the logo opens a plain bone field
  ------------------------------------------------------------------ */
  function openMenu() {
    menuOv.hidden = false; pushLayer('menu');
    gsap.fromTo(menuOv, { opacity: 0 }, { opacity: 1, duration: T(0.5), ease: 'power2.out' });
    gsap.fromTo($$('.menu-list button'), { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: T(0.8), stagger: 0.05, ease: 'power3.out', delay: T(0.1) });
    $('.ov-close', menuOv).focus({ preventScroll: true });
  }
  function closeOverlay(ov, name) {
    gsap.to(ov, { opacity: 0, duration: T(0.35), onComplete: () => { ov.hidden = true; gsap.set(ov, { opacity: 1 }); } });
    dropLayer(name);
  }
  $('.ov-close', menuOv).addEventListener('click', () => closeOverlay(menuOv, 'menu'));
  $('.ov-close', indexOv).addEventListener('click', () => closeOverlay(indexOv, 'index'));

  /* ------------------------------------------------------------------
     GLOBAL WIRING
  ------------------------------------------------------------------ */
  document.addEventListener('click', (e) => {
    const g = e.target.closest('[data-go]');
    if (g) { e.preventDefault(); go(g.dataset.go, g.closest('.word-tl') ? 'left' : 'right'); return; }
    const o = e.target.closest('[data-open]');
    if (o && !o.closest('#winText')) {
      e.preventDefault();
      const what = o.dataset.open === 'press' ? 'studio' : o.dataset.open;
      if (menuOv.contains(o) && (what === 'studio' || what === 'contact')) {
        // leave the menu and open the window in one wipe
        winCtl.open(what === 'contact' ? CONTACT_CFG() : STUDIO_CFG(), 0, 'right');
        return;
      }
      openPanel(what, o.classList.contains('word-tr') || o.classList.contains('word-br') ? 'right' : 'left');
    }
  });

  // wheel / trackpad / touch → next & previous, without native page scroll on one-screen surfaces
  function initObserver() {
    gsap.registerPlugin(Observer);
    Observer.create({
      target: window, type: 'wheel,touch', wheelSpeed: -1, tolerance: 14, preventDefault: false,
      onUp: () => route(1), onDown: () => route(-1)
    });
  }
  function route(d) {
    const t = top();
    if (t === 'home') home.step(d);
    else if (t === 'window' && !winCtl.album) winCtl.step(d);
  }

  document.addEventListener('keydown', (e) => {
    const t = top();
    if (e.key === 'Escape') {
      if (t === 'menu') closeOverlay(menuOv, 'menu');
      else if (t === 'index') closeOverlay(indexOv, 'index');
      else if (t === 'window') winCtl.escape();
      else if (t === 'work' || t === 'services') go('home', 'right');
      return;
    }
    if (e.target.closest('input, textarea')) return;
    if (t === 'home') {
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') { e.preventDefault(); home.step(1); }
      if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') { e.preventDefault(); home.step(-1); }
    } else if (t === 'window') {
      if (e.key === 'ArrowDown') { e.preventDefault(); winCtl.step(1); }
      if (e.key === 'ArrowUp') { e.preventDefault(); winCtl.step(-1); }
      if (e.key === 'ArrowRight') { e.preventDefault(); winCtl.neighbour(1); }
      if (e.key === 'ArrowLeft') { e.preventDefault(); winCtl.neighbour(-1); }
    }
  });

  // "View" cursor label for clickable photographs
  let cx = 0, cy = 0;
  const moveCur = REDUCE ? null : { x: gsap.quickTo(cur, 'x', { duration: 0.1, ease: 'power2' }), y: gsap.quickTo(cur, 'y', { duration: 0.1, ease: 'power2' }) };
  window.addEventListener('pointermove', (e) => {
    cx = e.clientX; cy = e.clientY;
    const t = e.target.closest('[data-cursor]');
    const on = !!t && !state.busy;
    if (on && cur.textContent !== t.dataset.cursor) cur.textContent = t.dataset.cursor;
    cur.classList.toggle('is-on', on);
    if (moveCur) { moveCur.x(cx); moveCur.y(cy); } else gsap.set(cur, { x: cx, y: cy });
  });
  document.addEventListener('pointerleave', () => cur.classList.remove('is-on'));

  /* ------------------------------------------------------------------
     START
  ------------------------------------------------------------------ */
  function start() {
    gsap.set(cur, { xPercent: -50, yPercent: -50 });
    gsap.set(wipeEl, { xPercent: -101, x: 0 });
    initObserver();
    home.show(0, true);
    const h = location.hash.replace('#', '');
    if (h === 'work' || h === 'services') setView(h);
    else syncInert();

    const lHalf = $('.half-left .layer.is-front'), rHalf = $('.half-right .layer.is-front');
    Promise.all([lHalf, rHalf].map((im) => (im.complete ? 1 : new Promise((r) => { im.onload = im.onerror = r; })))).then(() => {
      document.body.classList.remove('is-loading');
      if (REDUCE) return;
      gsap.from([lHalf, rHalf], { opacity: 0, duration: 1.6, stagger: 0.35, ease: 'power2.inOut' });
      gsap.fromTo(['.home-logo', '.home-words .word', '.progress'], { opacity: 0 }, { opacity: 1, duration: 1.2, delay: 0.9, stagger: 0.08, ease: 'power2.out', clearProps: 'opacity' });
    });
  }
  start();
})();
