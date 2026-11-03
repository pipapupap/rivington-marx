(() => {
  'use strict';
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const assets = '../assets/';
  const image = (file, alt) => ({ file, alt });
  const kitchen = image('stone-kitchen.jpg', 'Warm oak cabinetry, pale marble, and sculptural lighting in a sunlit kitchen.');
  const bath = image('tailored-bath.jpg', 'A marble bath framed by a bay window and delicate flowering branches.');
  const living = image('collected-living.jpg', 'Pattern, art, and dark architectural trim in an individual living room.');
  const collections = {
    light: { title: 'Light, in detail.', kicker: '02 / Light & material', description: 'Natural light. Beautiful materials. A quiet balance of warm wood, expressive stone, and considered detail.', images: [bath, kitchen, image('tailored-bar.jpg', 'Dark timber and stone give a drinks cabinet a tailored character.'), image('powder-detail.jpg', 'Flowers, reflection, and a pale textured wall.')] },
    collected: { title: 'The collected home.', kicker: '01 / Collected character', description: 'Spaces with something to say. Familiar pieces and unexpected details meet in rooms that feel deeply personal.', images: [living, image('green-study.jpg', 'A green study with collected books, art, and layered upholstery.'), image('window-seat.jpg', 'A window seat with considered fabrics and natural light.'), image('foyer.jpg', 'An expressive entry composed with architectural woodwork and art.')] },
    colour: { title: 'A world of colour.', kicker: '03 / An expressive palette', description: 'Colour creates the atmosphere. Rich tones, sculptural objects, and tactile fabrics make room for a more expressive way of living.', images: [image('blue-salon.jpg', 'An immersive blue salon with a decorative drinks cabinet.'), image('black-bath.jpg', 'Expressive abstract artwork brings colour to a dark bathroom.'), image('red-detail.jpg', 'A red interior detail, part of an expressive palette.')] },
    gathering: { title: 'Made for gathering.', kicker: '04 / The art of gathering', description: 'A place at the table. Thoughtful rooms for conversation, shared rituals, and the pleasure of being together.', images: [image('pink-dining.jpg', 'A dining room with a pink glass chandelier and red library shelves.'), image('gold-dining.jpg', 'A dining space layered with warm gold tones and dramatic lighting.'), image('dining-detail.jpg', 'A close look at a considered dining composition.')] },
    details: { title: 'An individual eye.', kicker: 'The details / A closer look', description: 'The smallest gestures can change the feeling of a room. A flower, a curve, a material, a beautiful object in just the right place.', images: [image('powder-detail.jpg', 'Red flowers and sculptural objects reflected in a mirror.'), image('vignette.jpg', 'An intimate composition of furnishings and decorative objects.'), image('chair-detail.jpg', 'A close view of upholstery, form, and texture.'), image('portrait-vignette.jpg', 'A portrait vignette of individually collected pieces.')] }
  };
  const allImages = [...collections.collected.images, ...collections.light.images, ...collections.colour.images, ...collections.gathering.images, ...collections.details.images];
  collections.all = { title: 'A sense of home.', kicker: 'The portfolio / All interiors', description: 'An editorial collection of rooms and details from Rivington Marx. Explore the images at your own pace.', images: allImages.filter((photo, index) => allImages.findIndex(other => other.file === photo.file) === index) };

  // Reveal effects enhance the static page; the HTML stays readable without JS.
  const observer = 'IntersectionObserver' in window ? new IntersectionObserver(entries => entries.forEach(entry => {
    if (entry.isIntersecting) { entry.target.classList.add('is-visible'); observer.unobserve(entry.target); }
  }), { threshold: 0.08 }) : null;
  if (observer) { document.documentElement.classList.add('js'); $$('.reveal').forEach(el => observer.observe(el)); }

  const featuredImages = $$('.hero-image');
  const featuredTitles = ['Light, material, and a sense of home.', 'A quieter moment. A different perspective.', 'Character, collected over time.'];
  const featuredCollections = ['light', 'light', 'collected'];
  let heroIndex = 0;
  $$('[data-hero]').forEach(button => button.addEventListener('click', () => {
    heroIndex = (heroIndex + Number(button.dataset.hero) + featuredImages.length) % featuredImages.length;
    featuredImages.forEach((img, i) => { img.classList.toggle('is-current', i === heroIndex); img.setAttribute('aria-hidden', String(i !== heroIndex)); });
    $('.hero-caption-title').textContent = featuredTitles[heroIndex];
    $('.hero-count').textContent = `${String(heroIndex + 1).padStart(2, '0')} — 03`;
    $('.hero-image-button').dataset.open = featuredCollections[heroIndex];
    $('.hero-image-button').setAttribute('aria-label', `Explore ${collections[featuredCollections[heroIndex]].title}`);
  }));
  featuredImages.forEach((img, i) => img.setAttribute('aria-hidden', String(i !== 0)));

  const cards = $$('.work-card');
  // Wheel input belongs to the image only; there is no autoplay. Keep the
  // page still. Three repeated strips let the preview wrap without reversing
  // through the whole collection or exposing an empty frame.
  $$('.work-image[data-open]').forEach(button => {
    const photos = collections[button.dataset.open].images;
    const track = document.createElement('span'); track.className = 'work-preview-track';
    track.setAttribute('aria-hidden', 'true');
    $('img', button).remove();
    [...photos, ...photos, ...photos].forEach(photo => {
      const img = document.createElement('img'); img.src = assets + photo.file;
      img.alt = ''; img.decoding = 'async'; track.append(img);
    });
    button.prepend(track);
    let index = 0, visualIndex = photos.length, moving = false, accumulated = 0, lastInput = 0, nextAllowed = 0;
    track.style.transition = 'none';
    track.style.transform = `translateX(-${visualIndex * 100}%)`;
    requestAnimationFrame(() => { track.style.transition = ''; });
    const finish = () => {
      if (visualIndex < photos.length || visualIndex >= photos.length * 2) {
        visualIndex = photos.length + index;
        track.style.transition = 'none';
        track.style.transform = `translateX(-${visualIndex * 100}%)`;
        void track.offsetWidth;
        track.style.transition = '';
      }
      moving = false;
    };
    track.addEventListener('transitionend', event => { if (event.target === track && event.propertyName === 'transform') finish(); });
    const show = next => {
      if (moving) return;
      visualIndex += Math.sign(next - index);
      index = (next % photos.length + photos.length) % photos.length;
      button.dataset.previewIndex = String(index);
      moving = true;
      track.style.transform = `translateX(-${visualIndex * 100}%)`;
      if (matchMedia('(prefers-reduced-motion: reduce)').matches) finish();
    };
    button.addEventListener('wheel', event => {
      if (event.ctrlKey) return;
      event.preventDefault(); event.stopPropagation();
      const now = performance.now();
      const raw = Math.abs(event.deltaX) > Math.abs(event.deltaY) ? event.deltaX : event.deltaY;
      const delta = raw * (event.deltaMode === 1 ? 20 : event.deltaMode === 2 ? button.clientWidth : 1);
      if (now - lastInput > 180 || Math.sign(delta) !== Math.sign(accumulated)) accumulated = 0;
      lastInput = now;
      if (now < nextAllowed || moving) return;
      accumulated += delta;
      if (Math.abs(accumulated) >= 55) {
        show(index + Math.sign(accumulated)); accumulated = 0; nextAllowed = now + 650;
      }
    }, { passive: false });
    button.addEventListener('pointerleave', () => { accumulated = 0; nextAllowed = 0; });
    button.addEventListener('keydown', event => {
      if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
        event.preventDefault(); show(index + (event.key === 'ArrowRight' ? 1 : -1));
      }
    });
  });
  $$('[data-filter]').forEach(button => button.addEventListener('click', () => {
    const category = button.dataset.filter;
    $$('[data-filter]').forEach(filter => {
      const active = filter === button;
      filter.classList.toggle('is-active', active);
      filter.setAttribute('aria-pressed', String(active));
    });
    $('.work-grid').classList.toggle('is-filtered', category !== 'all');
    let count = 0;
    cards.forEach(card => { card.hidden = category !== 'all' && card.dataset.category !== category; if (!card.hidden) { count++; card.classList.add('is-visible'); } });
    $('.work-count').textContent = category === 'all' ? 'Four visual collections' : `${count === 1 ? 'One visual collection' : 'Two visual collections'}`;
  }));

  const menu = $('#menu-dialog');
  const gallery = $('#collection-dialog');
  const zoom = $('#zoom-dialog');
  function syncBodyLock() { document.body.classList.toggle('modal-open', [menu, gallery, zoom].some(dialog => dialog.open)); }
  [menu, gallery, zoom].forEach(dialog => dialog.addEventListener('close', syncBodyLock));
  $('.menu-button').addEventListener('click', () => { menu.showModal(); $('.menu-button').setAttribute('aria-expanded', 'true'); syncBodyLock(); });
  menu.addEventListener('close', () => $('.menu-button').setAttribute('aria-expanded', 'false'));
  $('[data-close-menu]').addEventListener('click', () => menu.close());
  $$('.menu-body a').forEach(link => link.addEventListener('click', () => menu.close()));

  let currentCollection = collections.light;
  let currentIndex = 0;
  let lastOpener = null;
  const verticalGallery = document.createElement('div');
  verticalGallery.className = 'collection-scroll';
  verticalGallery.tabIndex = 0;
  verticalGallery.setAttribute('aria-label', 'Collection photographs. Scroll up or down.');
  $('.collection-zoom').replaceWith(verticalGallery);
  const collectionHint = document.createElement('span');
  collectionHint.className = 'eyebrow scroll-instruction';
  collectionHint.textContent = 'Scroll images vertically ↕';
  $('.collection-controls').before(collectionHint);
  function renderImage(shouldScroll = true) {
    const photo = currentCollection.images[currentIndex];
    const fullSrc = assets + photo.file;
    if (shouldScroll) verticalGallery.scrollTo({ top: currentIndex * verticalGallery.clientHeight, behavior: motion() });
    $('#zoom-image').src = fullSrc;
    $('#zoom-image').alt = photo.alt;
    $('#collection-caption').textContent = photo.alt;
    const counter = `${String(currentIndex + 1).padStart(2, '0')} / ${String(currentCollection.images.length).padStart(2, '0')}`;
    $('#collection-count').textContent = counter;
    $('.zoom-count').textContent = counter;
    $$('.collection-thumbnails button').forEach((button, index) => button.setAttribute('aria-pressed', String(index === currentIndex)));
    const next = currentCollection.images[(currentIndex + 1) % currentCollection.images.length];
    const preload = new Image(); preload.src = assets + next.file;
  }
  function openCollection(key, opener) {
    currentCollection = collections[key] || collections.all;
    currentIndex = 0;
    if (opener.classList.contains('work-image')) currentIndex = Number(opener.dataset.previewIndex || 0);
    if (opener.classList.contains('hero-image-button')) {
      const firstFile = featuredImages[heroIndex].getAttribute('src').split('/').pop();
      const matchingIndex = currentCollection.images.findIndex(photo => photo.file === firstFile);
      currentIndex = Math.max(0, matchingIndex);
    }
    lastOpener = opener;
    $('#collection-title').textContent = currentCollection.title;
    $('#collection-kicker').textContent = currentCollection.kicker;
    $('#collection-description').textContent = currentCollection.description;
    buildStory(currentCollection);
    verticalGallery.replaceChildren();
    currentCollection.images.forEach((photo, index) => {
      const button = document.createElement('button');
      button.type = 'button'; button.className = 'vertical-photo';
      button.setAttribute('aria-label', `Enlarge image ${index + 1}: ${photo.alt}`);
      const img = document.createElement('img'); img.src = assets + photo.file; img.alt = photo.alt;
      button.append(img);
      button.addEventListener('click', () => { currentIndex = index; renderImage(false); zoom.showModal(); syncBodyLock(); });
      verticalGallery.append(button);
    });
    const thumbnails = $('.collection-thumbnails');
    thumbnails.replaceChildren();
    currentCollection.images.forEach((photo, index) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.setAttribute('aria-label', `View image ${index + 1}: ${photo.alt}`);
      const thumb = document.createElement('img'); thumb.src = assets + photo.file; thumb.alt = ''; thumb.loading = 'lazy';
      button.append(thumb); button.addEventListener('click', () => { currentIndex = index; renderImage(); });
      thumbnails.append(button);
    });
    gallery.showModal(); syncBodyLock();
    verticalGallery.scrollTop = currentIndex * verticalGallery.clientHeight;
    renderImage(false);
  }
  $$('[data-open]').forEach(button => button.addEventListener('click', () => openCollection(button.dataset.open, button)));
  $$('[data-close-collection]').forEach(button => button.addEventListener('click', event => { event.preventDefault(); gallery.close(); }));
  gallery.addEventListener('close', () => { if (zoom.open) zoom.close(); lastOpener?.focus({ preventScroll: true }); });
  $('[data-collection-inquire]').addEventListener('click', () => gallery.close());
  verticalGallery.addEventListener('scroll', () => {
    const index = Math.max(0, Math.min(currentCollection.images.length - 1, Math.round(verticalGallery.scrollTop / verticalGallery.clientHeight)));
    if (index !== currentIndex) { currentIndex = index; renderImage(false); }
  }, { passive: true });
  $('.collection-controls [data-gallery="-1"]').setAttribute('aria-label', 'Scroll to previous photograph');
  $('.collection-controls [data-gallery="-1"]').textContent = '↑';
  $('.collection-controls [data-gallery="1"]').setAttribute('aria-label', 'Scroll to next photograph');
  $('.collection-controls [data-gallery="1"]').textContent = '↓';
  $('.zoom-close').addEventListener('click', () => zoom.close());
  function advance(delta) { currentIndex = (currentIndex + delta + currentCollection.images.length) % currentCollection.images.length; renderImage(); }
  $$('[data-gallery]').forEach(button => button.addEventListener('click', () => advance(Number(button.dataset.gallery))));
  [gallery, zoom].forEach(dialog => dialog.addEventListener('keydown', event => {
    if (event.target.closest('.story-window, .story-controls')) return;
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') { event.preventDefault(); advance(event.key === 'ArrowLeft' ? -1 : 1); }
  }));
  function motion() { return matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth'; }
  // Native overflow provides trackpad, scrollbar and keyboard access. Vertical
  // wheel input moves these two horizontal sections; at either end it releases.
  function horizontalControls(viewport, parent, label, wheelTarget = viewport) {
    viewport.tabIndex = 0;
    viewport.setAttribute('aria-label', label);
    const controls = document.createElement('div'); controls.className = 'story-controls';
    const prev = document.createElement('button'); prev.type = 'button'; prev.textContent = '←'; prev.setAttribute('aria-label', 'Previous ' + label);
    const next = document.createElement('button'); next.type = 'button'; next.textContent = '→'; next.setAttribute('aria-label', 'Next ' + label);
    const counter = document.createElement('span'); counter.className = 'eyebrow'; counter.setAttribute('aria-live', 'polite');
    const hint = document.createElement('span'); hint.className = 'eyebrow'; hint.textContent = 'Scroll to explore →';
    controls.append(prev, next, counter, hint); parent.append(controls);
    const move = direction => viewport.scrollTo({ left: (Math.round(viewport.scrollLeft / viewport.clientWidth) + direction) * viewport.clientWidth, behavior: motion() });
    prev.addEventListener('click', () => move(-1)); next.addEventListener('click', () => move(1));
    viewport.addEventListener('keydown', event => {
      if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') { event.preventDefault(); event.stopPropagation(); move(event.key === 'ArrowLeft' ? -1 : 1); }
    });
    wheelTarget.addEventListener('wheel', event => {
      if (event.ctrlKey) return;
      const delta = Math.abs(event.deltaX) > Math.abs(event.deltaY) ? event.deltaX : event.deltaY;
      const end = viewport.scrollWidth - viewport.clientWidth;
      if (!delta || end < 2 || (delta < 0 && viewport.scrollLeft < 1) || (delta > 0 && viewport.scrollLeft >= end - 1)) return;
      event.preventDefault();
      viewport.scrollLeft += delta * (event.deltaMode === 1 ? 20 : event.deltaMode === 2 ? viewport.clientWidth : 1);
    }, { passive: false });
    const update = () => {
      const count = Math.max(1, Math.round(viewport.scrollWidth / viewport.clientWidth));
      const index = Math.round(viewport.scrollLeft / viewport.clientWidth);
      counter.textContent = `${String(index + 1).padStart(2, '0')} / ${String(count).padStart(2, '0')}`;
      prev.disabled = index === 0; next.disabled = index >= count - 1;
    };
    viewport.addEventListener('scroll', update, { passive: true });
    new ResizeObserver(update).observe(viewport);
    return update;
  }
  const copy = $('.collection-copy');
  const storyWindow = document.createElement('div'); storyWindow.className = 'story-window';
  const storyTrack = document.createElement('div'); storyTrack.className = 'story-track';
  const firstStory = document.createElement('div'); firstStory.className = 'story-page';
  copy.prepend(storyWindow); storyWindow.append(storyTrack); storyTrack.append(firstStory);
  ['#collection-kicker', '#collection-title', '#collection-description'].forEach(selector => firstStory.append($(selector)));
  const storyControlHost = document.createElement('div'); storyWindow.after(storyControlHost);
  const updateStory = horizontalControls(storyWindow, storyControlHost, 'text chapter');
  const chapters = {
    light: [['Material, made meaningful.', 'Oak, stone, and metal each bring their own character. Their relationships create warmth, contrast, and a feeling of ease.'], ['Room for the everyday.', 'The beauty is in how a space feels to use. Light and proportion give familiar rituals a more considered setting.']],
    collected: [['Collected, over time.', 'Pattern and artwork introduce a personal rhythm. Architecture provides a quiet frame for the pieces that make a room individual.'], ['A place to belong.', 'The conversation between old and new creates depth. Familiar objects and unexpected details make space for a life of your own.']],
    colour: [['An atmosphere of its own.', 'A saturated wall, a tactile fabric, an expressive piece of art. Each colour changes how the room is experienced.'], ['Contrast, in balance.', 'Richness has room to breathe when shape, light, and material are thoughtfully composed.']],
    gathering: [['The pleasure of company.', 'A generous table and a welcoming seat set the scene. Lighting brings intimacy to the moments shared around them.'], ['Beyond the occasion.', 'These are spaces for simple daily rituals as much as special gatherings. Comfortable, individual, and ready to be lived in.']],
    details: [['A closer conversation.', 'Texture, reflection, and a single beautiful object can shift the feeling of a space. The smallest decisions carry the idea through.'], ['Unexpected connections.', 'A curve meets a straight line. An expressive colour sits against a quiet surface. Individual gestures become a thoughtful whole.']]
  };
  function buildStory(collection) {
    $$('.story-page', storyTrack).slice(1).forEach(page => page.remove());
    const key = Object.keys(collections).find(key => collections[key] === collection);
    (chapters[key] || chapters.collected).forEach(([title, text], index) => {
      const page = document.createElement('div'); page.className = 'story-page';
      const kicker = document.createElement('span'); kicker.className = 'eyebrow'; kicker.textContent = `0${index + 2} / A personal perspective`;
      const heading = document.createElement('h3'); heading.textContent = title;
      const paragraph = document.createElement('p'); paragraph.textContent = text;
      page.append(kicker, heading, paragraph); storyTrack.append(page);
    });
    storyWindow.scrollLeft = 0; requestAnimationFrame(updateStory);
  }

  const interlude = $('.interlude');
  const interludeWindow = document.createElement('div'); interludeWindow.className = 'interlude-window';
  const interludeTrack = document.createElement('div'); interludeTrack.className = 'interlude-track';
  const firstPanel = document.createElement('div'); firstPanel.className = 'interlude-panel';
  while (interlude.firstChild) firstPanel.append(interlude.firstChild);
  interlude.append(interludeWindow); interludeWindow.append(interludeTrack); interludeTrack.append(firstPanel);
  const morePanels = [
    ['An instinct for connection', 'Objects with a past.', 'Spaces with a future.', 'A favourite chair. A well-loved object. Familiar things find a new conversation.', 'vignette.jpg', 'An intimate composition of collected furnishings and objects.'],
    ['A thoughtful balance', 'Rich in character.', 'Quiet in confidence.', 'Expressive materials and individual pieces, with enough room for each to be seen.', 'chair-detail.jpg', 'A considered upholstery and furniture detail.'],
    ['The art of everyday living', 'More than a room.', 'A feeling of home.', 'Light, colour, and texture come together around the way you live.', 'window-seat.jpg', 'A bright window seat with layered fabrics.']
  ];
  morePanels.forEach(([kicker, title, italic, text, file, alt]) => {
    const panel = document.createElement('div'); panel.className = 'interlude-panel';
    const content = document.createElement('div'); content.className = 'interlude-copy';
    const label = document.createElement('span'); label.className = 'eyebrow'; label.textContent = kicker;
    const h = document.createElement('h2'); h.append(title, document.createElement('br')); const em = document.createElement('em'); em.textContent = italic; h.append(em);
    const p = document.createElement('p'); p.textContent = text;
    content.append(label, h, p);
    const figure = document.createElement('figure'); figure.className = 'interlude-image';
    const button = document.createElement('button'); button.type = 'button'; button.setAttribute('aria-label', 'Explore the detail collection');
    button.addEventListener('click', () => openCollection('details', button));
    const img = document.createElement('img'); img.src = assets + file; img.alt = alt; img.loading = 'lazy'; button.append(img); figure.append(button);
    panel.append(content, figure); interludeTrack.append(panel);
  });
  horizontalControls(interludeWindow, interlude, 'editorial panel', interlude);

  const studioFigure = $('.studio-image');
  const studioScroll = document.createElement('div'); studioScroll.className = 'studio-scroll'; studioScroll.tabIndex = 0;
  studioScroll.setAttribute('aria-label', 'Studio photographs. Scroll vertically to explore.');
  studioScroll.append($('.studio-image > img')); studioFigure.prepend(studioScroll);
  [['studio-detail.jpg', 'Materials and details in the Rivington Marx design studio.'], ['desk.jpg', 'A closer look at the studio workspace.']].forEach(([file, alt]) => {
    const img = document.createElement('img'); img.src = assets + file; img.alt = alt; img.loading = 'lazy'; studioScroll.append(img);
  });
  const studioControls = document.createElement('div'); studioControls.className = 'studio-controls';
  const studioHint = document.createElement('span'); studioHint.className = 'eyebrow'; studioHint.textContent = 'Inside the studio / Scroll to explore';
  studioControls.append(studioHint);
  [-1, 1].forEach(direction => {
    const button = document.createElement('button'); button.type = 'button'; button.textContent = direction === -1 ? '↑' : '↓';
    button.setAttribute('aria-label', direction === -1 ? 'Previous studio photograph' : 'Next studio photograph');
    button.addEventListener('click', () => studioScroll.scrollBy({ top: direction * studioScroll.clientHeight * .8, behavior: motion() }));
    studioControls.append(button);
  });
  studioScroll.after(studioControls);
  // Escape and focus containment are supplied by native dialog elements.
  // Only one service explanation remains open, keeping this section concise.
  const approachDetails = $$('.accordion details');
  approachDetails.forEach(detail => detail.addEventListener('toggle', () => {
    if (detail.open) approachDetails.forEach(other => { if (other !== detail) other.open = false; });
  }));
})();
