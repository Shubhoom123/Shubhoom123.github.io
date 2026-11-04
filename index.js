// ==========================================================================
// Shubham Khalkho: portfolio
// GSAP + ScrollTrigger handle the choreography. Everything degrades: if the
// scripts fail to load, or the visitor prefers reduced motion, all content is
// simply visible and the page still works.
// ==========================================================================
(function () {
    'use strict';

    const $ = (sel, ctx) => (ctx || document).querySelector(sel);
    const $$ = (sel, ctx) => Array.from((ctx || document).querySelectorAll(sel));

    const calm = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const hasGsap = !!(window.gsap && window.ScrollTrigger);
    const animate = hasGsap && !calm;

    // ----------------------------------------------------------------------
    // Navigation: highlight the section in view
    // ----------------------------------------------------------------------
    const navLinks = $$('.nav nav a');
    const sections = navLinks.map((link) => $(link.getAttribute('href'))).filter(Boolean);
    const placeNav = () => {
        let current = null;
        sections.forEach((section) => {
            if (section.getBoundingClientRect().top <= window.innerHeight * 0.4) current = section.id;
        });
        navLinks.forEach((link) => link.classList.toggle('active', link.getAttribute('href') === '#' + current));
    };
    window.addEventListener('scroll', placeNav, { passive: true });
    placeNav();

    // Placeholder links (href="#" inside a case file) should do nothing.
    document.addEventListener('click', (event) => {
        const link = event.target.closest('a[data-placeholder]');
        if (link) event.preventDefault();
    });

    // ----------------------------------------------------------------------
    // Projects: filter pills
    // ----------------------------------------------------------------------
    const tiles = $$('.tile');
    const filters = $$('.filter');

    // Case-file numbers follow the order of the tiles currently on screen:
    // 01-02 inside a category, 01-06 in "All".
    const renumber = (list) => {
        list.forEach((tile, index) => {
            const n = String(index + 1).padStart(2, '0');
            const label = $('.eyebrow', tile);
            if (label) label.textContent = label.textContent.replace(/Case file \d+/, 'Case file ' + n);
            const art = $('.tile-art', tile);
            if (art) art.textContent = n;
        });
    };

    filters.forEach((button) => {
        button.addEventListener('click', () => {
            const value = button.dataset.filter;
            filters.forEach((other) => other.setAttribute('aria-pressed', String(other === button)));
            const shown = [];
            tiles.forEach((tile) => {
                const match = value === 'all' || tile.dataset.cat === value;
                tile.hidden = !match;
                if (match) shown.push(tile);
            });
            renumber(shown);
            if (animate) {
                gsap.fromTo(shown, { autoAlpha: 0, y: 24 }, { autoAlpha: 1, y: 0, duration: 0.6, stagger: 0.07, ease: 'power3.out', overwrite: true, onComplete: () => gsap.set(shown, { clearProps: 'transform' }) });
                ScrollTrigger.refresh();
            }
        });
    });

    // ----------------------------------------------------------------------
    // Case-file sheet: open a tile to read the whole story
    // ----------------------------------------------------------------------
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-modal', 'true');
    modal.setAttribute('aria-hidden', 'true');
    modal.innerHTML =
        '<div class="modal-sheet" tabindex="-1">' +
        '<button class="modal-close" type="button" aria-label="Close"></button>' +
        '<div class="modal-media"></div>' +
        '<div class="modal-body"><div class="modal-head"></div><div class="modal-copy"></div></div>' +
        '</div>';
    document.body.appendChild(modal);

    const sheet = $('.modal-sheet', modal);
    const mediaBox = $('.modal-media', modal);
    const head = $('.modal-head', modal);
    const copy = $('.modal-copy', modal);
    const closeBtn = $('.modal-close', modal);
    let lastFocus = null;

    const openTile = (tile) => {
        lastFocus = document.activeElement;
        head.innerHTML = '';
        head.appendChild($('.eyebrow', tile).cloneNode(true));
        head.appendChild($('h3', tile).cloneNode(true));
        copy.innerHTML = $('.detail', tile).innerHTML;
        modal.setAttribute('aria-label', $('h3', tile).textContent);

        mediaBox.innerHTML = '';
        const source = $('.tile-media video source', tile);
        if (source) {
            const video = document.createElement('video');
            video.autoplay = true;
            video.muted = true;
            video.loop = true;
            video.playsInline = true;
            video.controls = true;
            const s = document.createElement('source');
            s.src = source.src;
            s.type = 'video/mp4';
            video.appendChild(s);
            mediaBox.appendChild(video);
        }

        sheet.scrollTop = 0;
        modal.setAttribute('aria-hidden', 'false');
        document.documentElement.classList.add('modal-open');
        modal.classList.add('open');
        closeBtn.focus({ preventScroll: true });
    };

    const closeModal = () => {
        if (!modal.classList.contains('open')) return;
        modal.classList.remove('open');
        modal.setAttribute('aria-hidden', 'true');
        document.documentElement.classList.remove('modal-open');
        const video = $('video', mediaBox);
        if (video) video.pause();
        setTimeout(() => { if (!modal.classList.contains('open')) mediaBox.innerHTML = ''; }, 400);
        if (lastFocus && lastFocus.focus) lastFocus.focus({ preventScroll: true });
    };

    tiles.forEach((tile) => {
        tile.addEventListener('click', () => openTile(tile));
        tile.addEventListener('keydown', (event) => {
            if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                openTile(tile);
            }
        });
    });
    closeBtn.addEventListener('click', closeModal);
    modal.addEventListener('click', (event) => { if (event.target === modal) closeModal(); });
    document.addEventListener('keydown', (event) => {
        if (!modal.classList.contains('open')) return;
        if (event.key === 'Escape') { closeModal(); return; }
        if (event.key === 'Tab') {
            // Keep focus inside the sheet.
            const items = $$('button, a[href], video[controls]', sheet).filter((el) => el.offsetParent !== null);
            if (!items.length) return;
            const first = items[0];
            const last = items[items.length - 1];
            if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
            else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
        }
    });

    // ----------------------------------------------------------------------
    // Motion. Everything below needs GSAP and no reduced-motion preference.
    // ----------------------------------------------------------------------
    if (!animate) return;
    gsap.registerPlugin(ScrollTrigger);

    // The name is split by hand so each letter can rise from behind its word's mask.
    const name = $('#name');
    name.innerHTML = name.textContent
        .split(' ')
        .map((word) =>
            '<span class="word" aria-hidden="true">' +
            word.split('').map((ch) => '<span class="ch">' + ch + '</span>').join('') +
            '</span>')
        .join(' ');

    // Arrival
    const arrival = gsap.timeline({ defaults: { ease: 'power3.out' } });
    arrival
        .from('.hero .eyebrow', { autoAlpha: 0, y: 10, duration: 0.6 }, 0)
        .from('.name .ch', { yPercent: 112, duration: 0.9, stagger: 0.028 }, 0.1)
        .from('.claim-big', { autoAlpha: 0, y: 16, duration: 0.8 }, 0.75)
        .from('.hero-cta', { autoAlpha: 0, y: 14, duration: 0.7 }, 0.95);
    // Timers keep running when animation frames are held back, so a slow device never sits on a blank hero.
    setTimeout(() => arrival.progress(1), 2600);

    // The portrait grows into place as it scrolls into view.
    gsap.fromTo('.portrait', { scale: 0.86, y: 40 }, {
        scale: 1,
        y: 0,
        ease: 'none',
        scrollTrigger: { trigger: '.portrait', start: 'top 98%', end: 'top 38%', scrub: 0.6 }
    });

    // Highlights step in.
    gsap.from('.facts > div', {
        autoAlpha: 0, y: 22, duration: 0.7, stagger: 0.1, ease: 'power3.out',
        scrollTrigger: { trigger: '.facts', start: 'top 90%', once: true }
    });

    // Statement: words come up from dim to full brightness as you scroll.
    const statement = $('#statement');
    const pieces = [];
    statement.childNodes.forEach((node) => {
        if (node.nodeType === 3) {
            node.textContent.split(/(\s+)/).forEach((word) => {
                if (!word) return;
                if (/^\s+$/.test(word)) { pieces.push(document.createTextNode(word)); return; }
                const span = document.createElement('span');
                span.className = 'w';
                span.textContent = word;
                pieces.push(span);
            });
        } else {
            node.classList.add('w');
            pieces.push(node);
        }
    });
    statement.textContent = '';
    pieces.forEach((piece) => statement.appendChild(piece));
    gsap.fromTo('#statement .w', { opacity: 0.4 }, {
        opacity: 1,
        stagger: 0.05,
        ease: 'none',
        scrollTrigger: { trigger: statement, start: 'top 80%', end: 'bottom 52%', scrub: 0.5 }
    });

    // Section headings rise once as they arrive.
    $$('.sec-head, .close h2, .close .sec-sub, .reach, .address').forEach((el) => {
        gsap.from(el, {
            autoAlpha: 0, y: 30, duration: 0.9, ease: 'power3.out',
            scrollTrigger: { trigger: el, start: 'top 90%', once: true }
        });
    });

    // Tiles and skill cards arrive in batches.
    [['.tile', 0.1], ['.spec', 0.08]].forEach(([selector, stagger]) => {
        gsap.set(selector, { autoAlpha: 0, y: 40 });
        ScrollTrigger.batch(selector, {
            start: 'top 92%',
            once: true,
            onEnter: (batch) => gsap.to(batch, {
                autoAlpha: 1, y: 0, duration: 0.8, stagger, ease: 'power3.out', overwrite: true,
                // Hand the transform back to CSS so the hover lift works.
                onComplete: () => gsap.set(batch, { clearProps: 'transform' })
            })
        });
    });

    window.addEventListener('load', () => ScrollTrigger.refresh());
})();
