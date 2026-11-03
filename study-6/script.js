/* Rivington Marx — Study 6 / The Daylight Atelier. */
(() => {
  'use strict';

  const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const behavior = () => motion.matches ? 'auto' : 'smooth';
  const two = number => String(number).padStart(2, '0');

  // Each chapter holds its final viewport while the following chapter covers it.
  // Tall chapters remain fully readable before their bottom edge is held.
  const main = document.querySelector('main');
  const chapters = main ? [...main.children].filter(element => element.tagName === 'SECTION') : [];
  const measureChapters = () => {
    chapters.forEach((chapter, index) => {
      chapter.style.setProperty('--chapter-height', `${chapter.getBoundingClientRect().height}px`);
      chapter.style.setProperty('--chapter-order', index + 1);
    });
  };
  if (main && 'ResizeObserver' in window) {
    const chapterObserver = new ResizeObserver(measureChapters);
    chapters.forEach(chapter => chapterObserver.observe(chapter));
    measureChapters();
    main.classList.add('layered-chapters');
  }

  const reveals = [...document.querySelectorAll('.reveal')];
  if (motion.matches || !('IntersectionObserver' in window)) {
    reveals.forEach(element => element.classList.add('is-visible'));
  } else {
    document.documentElement.classList.add('js-motion');
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08 });
    reveals.forEach(element => observer.observe(element));
    motion.addEventListener('change', event => {
      if (event.matches) {
        reveals.forEach(element => element.classList.add('is-visible'));
        observer.disconnect();
      }
    });
  }

  const rail = document.querySelector('#room-rail');
  if (rail) {
    const cards = [...rail.querySelectorAll('.rail-card')];
    const previous = document.querySelector('.rail-prev');
    const next = document.querySelector('.rail-next');
    const count = document.querySelector('#rail-count');
    const progress = document.querySelector('#rail-progress');
    let scheduled = false;
    const limit = () => Math.max(0, rail.scrollWidth - rail.clientWidth);
    const position = card => card.getBoundingClientRect().left - rail.getBoundingClientRect().left + rail.scrollLeft - (parseFloat(getComputedStyle(rail).paddingLeft) || 0);
    const updateRail = () => {
      scheduled = false;
      const maximum = limit();
      const atStart = rail.scrollLeft <= 2;
      const atEnd = rail.scrollLeft >= maximum - 2;
      let current = 0;
      let nearest = Infinity;
      cards.forEach((card, index) => {
        const distance = Math.abs(position(card) - rail.scrollLeft);
        if (distance < nearest) {
          nearest = distance;
          current = index;
        }
      });
      if (atStart) current = 0;
      else if (atEnd) current = Math.max(0, cards.length - 1);
      if (count) count.textContent = `${two(current + 1)} / ${two(cards.length)}`;
      if (progress) progress.style.transform = `scaleX(${maximum ? rail.scrollLeft / maximum : 1})`;
      if (previous) previous.disabled = atStart;
      if (next) next.disabled = atEnd;
    };
    const scheduleUpdate = () => {
      if (!scheduled) {
        scheduled = true;
        requestAnimationFrame(updateRail);
      }
    };
    const moveRail = direction => {
      if (!cards.length) return;
      const maximum = limit();
      const stops = [...new Set([0, ...cards.map(card => Math.max(0, Math.min(maximum, position(card)))), maximum])].sort((a, b) => a - b);
      const destination = direction > 0
        ? stops.find(stop => stop > rail.scrollLeft + 3) ?? maximum
        : [...stops].reverse().find(stop => stop < rail.scrollLeft - 3) ?? 0;
      rail.scrollTo({ left: destination, behavior: behavior() });
    };
    previous?.addEventListener('click', () => moveRail(-1));
    next?.addEventListener('click', () => moveRail(1));
    rail.addEventListener('scroll', scheduleUpdate, { passive: true });
    rail.addEventListener('keydown', event => {
      if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
        event.preventDefault();
        moveRail(event.key === 'ArrowLeft' ? -1 : 1);
      } else if (event.key === 'Home' || event.key === 'End') {
        event.preventDefault();
        rail.scrollTo({ left: event.key === 'Home' ? 0 : limit(), behavior: behavior() });
      }
    });
    const section = rail.closest('.gallery-section') || rail;
    section.addEventListener('wheel', event => {
      if (event.ctrlKey) return;
      // Accept mouse wheels and diagonal trackpad gestures. Avoid scroll snap,
      // which can pull small wheel movements back to the current photograph.
      let delta = event.deltaY || event.deltaX;
      if (event.deltaMode === 1) delta *= 18;
      if (event.deltaMode === 2) delta *= rail.clientWidth;
      const canMove = delta > 0 ? rail.scrollLeft < limit() - 1 : rail.scrollLeft > 1;
      if (!canMove || !delta) return;
      event.preventDefault();
      rail.scrollLeft = Math.max(0, Math.min(limit(), rail.scrollLeft + delta));
    }, { passive: false, capture: true });
    if ('ResizeObserver' in window) new ResizeObserver(scheduleUpdate).observe(rail);
    else window.addEventListener('resize', scheduleUpdate, { passive: true });
    updateRail();
  }

  const projects = {
    light: {
      label: '01 / Light & material',
      title: 'Tailored in stone.',
      intro: 'Quiet materials. Beautiful light. A considered balance of sculptural forms and the rituals of everyday life.',
      photographs: [
        ['tailored-bath.jpg', 'A marble bath beneath a sunlit bay window with flowering branches and globe sconces', 'A moment of stillness.'],
        ['stone-kitchen.jpg', 'Pale marble kitchen with warm oak cabinetry, brass taps, and sculptural branch lighting', 'Natural materials, in conversation.'],
        ['tailored-bar.jpg', 'Dark timber bar with glass-front cabinetry, stone surfaces, and carefully arranged glassware', 'The quieter details.']
      ]
    },
    colour: {
      label: '02 / Colour & character',
      title: 'A more expressive home.',
      intro: 'Colour creates the atmosphere. Art, pattern, and personal pieces bring a room into its own.',
      photographs: [
        ['blue-salon.jpg', 'Rich blue salon with upholstered chairs, a lacquered cabinet, and sculptural brass lighting', 'An enveloping shade of blue.'],
        ['pink-dining.jpg', 'Dining room with red bookcases, a pink glass chandelier, and patterned walls', 'Made for a lively table.'],
        ['green-study.jpg', 'Deep green study with collected art, layered fabrics, and a patterned armchair', 'A place to pause.']
      ]
    },
    collected: {
      label: '03 / Collected living',
      title: 'Rooms with a point of view.',
      intro: 'A home should hold the things you love. Architectural detail gives art, objects, and everyday life room to belong.',
      photographs: [
        ['collected-living.jpg', 'Sunlit living room with dark architectural trim, patterned seating, and collected furnishings', 'Character, in every layer.'],
        ['foyer.jpg', 'Entry hall with dark timber stair, still-life painting, and a table of fresh hydrangeas', 'A thoughtful first impression.'],
        ['portrait-vignette.jpg', 'Burl wood cabinet with a large portrait, flowers, and sculptural objects', 'A personal collection.']
      ]
    },
    details: {
      label: '04 / An eye for detail',
      title: 'The small things, considered.',
      intro: 'A line, a texture, an unexpected object. The details that make a space feel entirely its own.',
      photographs: [
        ['powder-detail.jpg', 'Sculptural red flowers reflected in a mirror against pale patterned wallcovering', 'An unexpected accent.'],
        ['chair-detail.jpg', 'Detail of an upholstered chair, showing the fabric, shape, and crafted finish', 'Tactile, personal, lasting.'],
        ['dining-detail.jpg', 'A closely composed dining room detail with expressive furnishings and materials', 'The art of gathering.'],
        ['vignette.jpg', 'A composed interior vignette of decorative objects, art, and layered materials', 'Objects with a story.']
      ]
    }
  };

  const projectDialog = document.querySelector('#project-dialog');
  const menuDialog = document.querySelector('#menu-dialog');
  let savedOverflow = null;
  const syncScrollLock = () => {
    const isOpen = projectDialog?.open || menuDialog?.open;
    if (isOpen && savedOverflow === null) {
      savedOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
    } else if (!isOpen && savedOverflow !== null) {
      document.body.style.overflow = savedOverflow;
      savedOverflow = null;
    }
  };

  if (projectDialog) {
    const keys = Object.keys(projects);
    let activeProject = keys[0];
    const setText = (selector, value) => {
      const element = document.querySelector(selector);
      if (element) element.textContent = value;
    };
    const openProject = key => {
      const project = projects[key];
      if (!project) return;
      activeProject = key;
      setText('#project-title', project.title);
      setText('#project-intro', project.intro);
      setText('#project-label', project.label);
      setText('#project-position', `${two(keys.indexOf(key) + 1)} / ${two(keys.length)}`);
      const gallery = document.querySelector('#project-gallery');
      if (gallery) {
        gallery.replaceChildren(...project.photographs.map(([file, alt, caption], index) => {
          const figure = document.createElement('figure');
          const image = document.createElement('img');
          image.src = `../assets/${file}`;
          image.alt = alt;
          image.loading = index ? 'lazy' : 'eager';
          image.decoding = 'async';
          const text = document.createElement('figcaption');
          text.textContent = `${two(index + 1)} — ${caption}`;
          figure.append(image, text);
          return figure;
        }));
        gallery.scrollTop = 0;
      }
      if (!projectDialog.open) {
        projectDialog.showModal();
        syncScrollLock();
      }
      projectDialog.scrollTop = 0;
      projectDialog.querySelector('.project-layout')?.scrollTo({ top: 0, behavior: 'auto' });
    };
    document.querySelectorAll('[data-project]').forEach(button => {
      button.addEventListener('click', event => {
        event.preventDefault();
        openProject(button.dataset.project);
      });
    });
    projectDialog.querySelectorAll('.project-close').forEach(button => button.addEventListener('click', () => projectDialog.close()));
    projectDialog.querySelector('.project-prev')?.addEventListener('click', () => {
      openProject(keys[(keys.indexOf(activeProject) - 1 + keys.length) % keys.length]);
    });
    projectDialog.querySelector('.project-next')?.addEventListener('click', () => {
      openProject(keys[(keys.indexOf(activeProject) + 1) % keys.length]);
    });
    document.querySelector('#project-inquire')?.addEventListener('click', event => {
      event.preventDefault();
      projectDialog.close();
      syncScrollLock();
      requestAnimationFrame(() => document.querySelector('#contact')?.scrollIntoView({ behavior: behavior() }));
    });
    projectDialog.addEventListener('close', syncScrollLock);
    projectDialog.addEventListener('click', event => {
      if (event.target === projectDialog) {
        const bounds = projectDialog.getBoundingClientRect();
        if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) projectDialog.close();
      }
    });
  }

  if (menuDialog) {
    const toggle = document.querySelector('.menu-toggle');
    toggle?.addEventListener('click', () => {
      if (menuDialog.open) menuDialog.close();
      else menuDialog.showModal();
      toggle.setAttribute('aria-expanded', String(menuDialog.open));
      syncScrollLock();
    });
    menuDialog.querySelectorAll('[data-menu-close], a[href^="#"]').forEach(element => {
      element.addEventListener('click', event => {
        const destination = element.getAttribute('href');
        menuDialog.close();
        syncScrollLock();
        if (destination && destination.length > 1) {
          event.preventDefault();
          requestAnimationFrame(() => document.querySelector(destination)?.scrollIntoView({ behavior: behavior() }));
        }
      });
    });
    menuDialog.addEventListener('close', () => {
      toggle?.setAttribute('aria-expanded', 'false');
      syncScrollLock();
    });
  }

  const studioTabs = [...document.querySelectorAll('[data-studio]')];
  const studio = {
    listen: {
      title: 'It begins with you.',
      copy: 'How you live. What you love. What a room could become. We start with a conversation, and give every possibility room to grow.',
      image: 'studio.jpg',
      alt: 'Rivington Marx design studio with material boards, worktables, and interior design samples'
    },
    compose: {
      title: 'Every element, connected.',
      copy: 'Architecture, materials, furnishings, and art develop together. We find the unexpected connections that make a home feel personal.',
      image: 'studio-detail.jpg',
      alt: 'Materials and objects arranged in the Rivington Marx design studio'
    },
    realise: {
      title: 'An idea, beautifully lived.',
      copy: 'From the first drawing to the final detail, design and construction stay in conversation. A clear vision, carried thoughtfully into everyday life.',
      image: 'desk.jpg',
      alt: 'A thoughtfully arranged desk and working space at the Rivington Marx studio'
    }
  };
  const selectStudio = tab => {
    const content = studio[tab.dataset.studio];
    if (!content) return;
    studioTabs.forEach(item => {
      const selected = item === tab;
      item.setAttribute('aria-selected', String(selected));
      item.tabIndex = selected ? 0 : -1;
      item.classList.toggle('is-active', selected);
    });
    const photo = document.querySelector('#studio-photo');
    if (photo) {
      photo.src = `../assets/${content.image}`;
      photo.alt = content.alt;
    }
    const title = document.querySelector('#studio-title');
    document.querySelector('#studio-panel')?.setAttribute('aria-labelledby', tab.id);
    const copy = document.querySelector('#studio-copy');
    const step = document.querySelector('#studio-step');
    if (title) title.textContent = content.title;
    if (copy) copy.textContent = content.copy;
    if (step) step.textContent = `${two(studioTabs.indexOf(tab) + 1)} / ${two(studioTabs.length)}`;
  };
  studioTabs.forEach((tab, index) => {
    tab.addEventListener('click', () => selectStudio(tab));
    tab.addEventListener('keydown', event => {
      let nextIndex;
      if (event.key === 'ArrowRight' || event.key === 'ArrowDown') nextIndex = (index + 1) % studioTabs.length;
      if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') nextIndex = (index - 1 + studioTabs.length) % studioTabs.length;
      if (event.key === 'Home') nextIndex = 0;
      if (event.key === 'End') nextIndex = studioTabs.length - 1;
      if (nextIndex !== undefined) {
        event.preventDefault();
        selectStudio(studioTabs[nextIndex]);
        studioTabs[nextIndex].focus();
      }
    });
  });
})();
