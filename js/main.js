(function () {
  const SUPPORT_EMAIL = 'support@adspring.ai';
  const CONTACT = 'mailto:' + SUPPORT_EMAIL;

  document.querySelectorAll('[data-contact]').forEach((el) => {
    el.setAttribute('href', CONTACT);
  });

  initDemoModal();

  const carousel = document.querySelector('[data-hero-carousel]');
  if (carousel) {
    let slide = 0;
    let hovering = false;
    const slides = carousel.querySelectorAll('[data-hero-slide]');
    const dots = carousel.querySelectorAll('[data-hero-dot]');
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    function setSlide(i) {
      slide = i;
      slides.forEach((s, idx) => {
        const on = idx === slide;
        s.classList.toggle('active-slide', on);
        s.classList.toggle('hidden-slide', !on);
        s.setAttribute('aria-hidden', on ? 'false' : 'true');
      });
      dots.forEach((d, idx) => {
        d.setAttribute('aria-selected', idx === slide ? 'true' : 'false');
        const dot = d.querySelector('span');
        if (dot) {
          dot.className =
            idx === slide
              ? 'h-2 w-2 rounded-full bg-[#ff6b35]'
              : 'h-1.5 w-1.5 rounded-full bg-neutral-900/20';
        }
      });
    }

    dots.forEach((dot, i) => {
      dot.addEventListener('click', () => setSlide(i));
    });

    carousel.addEventListener('mouseenter', () => { hovering = true; });
    carousel.addEventListener('mouseleave', () => { hovering = false; });

    if (!reducedMotion) {
      setInterval(() => {
        if (!hovering) setSlide((slide + 1) % 2);
      }, 4000);
    }
    setSlide(0);
  }

  const loopRoot = document.querySelector('[data-hero-loop]');
  if (loopRoot) {
    initHeroLoop(loopRoot);
  }

  function initDemoModal() {
    const mailto =
      'mailto:' +
      SUPPORT_EMAIL +
      '?subject=' +
      encodeURIComponent('Book a meeting');

    const root = document.createElement('div');
    root.className = 'demo-modal';
    root.id = 'demo-modal';
    root.setAttribute('role', 'dialog');
    root.setAttribute('aria-modal', 'true');
    root.setAttribute('aria-labelledby', 'demo-modal-title');
    root.setAttribute('aria-hidden', 'true');
    root.innerHTML =
      '<div class="demo-modal__dialog" role="document">' +
      '<button type="button" class="demo-modal__close" data-demo-close aria-label="Close">&times;</button>' +
      '<div class="demo-modal__header">' +
      '<span class="demo-modal__badge">Book a demo</span>' +
      '<h2 id="demo-modal-title" class="demo-modal__title">Email us to book a meeting</h2>' +
      '<p class="demo-modal__lead">Please send us an email to schedule a demo. Briefly share your product and what you&rsquo;d like to achieve with ad video&mdash;we&rsquo;ll reply to set up a call.</p>' +
      '</div>' +
      '<div class="demo-modal__email-box">' +
      '<p class="demo-modal__email-label">Email</p>' +
      '<a class="demo-modal__email-link" href="' +
      mailto +
      '">' +
      SUPPORT_EMAIL +
      '</a>' +
      '<p class="demo-modal__email-subject">Suggested subject: <strong>Book a meeting</strong></p>' +
      '</div>' +
      '<div class="demo-modal__actions">' +
      '<button type="button" class="demo-modal__btn demo-modal__btn--primary" data-demo-close>Got it</button>' +
      '</div>' +
      '</div>';

    document.body.appendChild(root);

    let lastTrigger = null;
    const gotItBtn = root.querySelector('.demo-modal__btn--primary');

    function openModal(trigger) {
      lastTrigger = trigger || null;
      root.classList.add('is-open');
      root.setAttribute('aria-hidden', 'false');
      document.body.classList.add('demo-modal-open');
      window.setTimeout(() => gotItBtn.focus(), 50);
    }

    function closeModal() {
      root.classList.remove('is-open');
      root.setAttribute('aria-hidden', 'true');
      document.body.classList.remove('demo-modal-open');
      if (lastTrigger && typeof lastTrigger.focus === 'function') {
        lastTrigger.focus();
      }
    }

    document.querySelectorAll('[data-demo]').forEach((el) => {
      el.setAttribute('href', '#book-demo');
      el.addEventListener('click', (e) => {
        e.preventDefault();
        openModal(el);
      });
    });

    root.querySelectorAll('[data-demo-close]').forEach((btn) => {
      btn.addEventListener('click', closeModal);
    });

    root.addEventListener('click', (e) => {
      if (e.target === root) closeModal();
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && root.classList.contains('is-open')) {
        e.preventDefault();
        closeModal();
      }
    });
  }

  function initHeroLoop(loopRoot) {
    const steps = [
      { src: 'assets/adspring/hero-workflow/vs-cycle-03-patterns.jpg', label: 'Deconstruct patterns', short: 'Patterns' },
      { src: 'assets/adspring/hero-workflow/vs-cycle-04-scripts.jpg', label: 'Draft script variants', short: 'Scripts', nowrap: true },
      { src: 'assets/adspring/hero-workflow/vs-cycle-05-delivery.jpg', label: 'Deliver live-ready ads', short: 'Launch' },
      { src: 'assets/adspring/hero-workflow/vs-cycle-01-positioning.jpg', label: 'Extract positioning', short: 'Position', nowrap: true },
      { src: 'assets/adspring/hero-workflow/vs-cycle-02-research.jpg', label: 'Source viral references', short: 'Research' },
    ];

    const VB = 400;
    const CX = VB / 2;
    const CY = VB / 2;
    const R = 128;
    const LINE_PAD = 48;
    const n = steps.length;

    function vertex(i) {
      const th = -Math.PI / 2 + (i * 2 * Math.PI) / n;
      return { x: CX + R * Math.cos(th), y: CY + R * Math.sin(th) };
    }

    function shortenSegment(a, b, pad) {
      const dx = b.x - a.x;
      const dy = b.y - a.y;
      const len = Math.hypot(dx, dy);
      if (len <= pad * 2) return null;
      const ux = dx / len;
      const uy = dy / len;
      return { x1: a.x + ux * pad, y1: a.y + uy * pad, x2: b.x - ux * pad, y2: b.y - uy * pad };
    }

    const verts = steps.map((_, i) => vertex(i));
    const svg = loopRoot.querySelector('[data-hero-loop-svg]');
    if (svg) {
      verts.forEach((p, i) => {
        const q = verts[(i + 1) % n];
        const seg = shortenSegment(p, q, LINE_PAD);
        if (!seg) return;
        const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        line.setAttribute('x1', String(seg.x1));
        line.setAttribute('y1', String(seg.y1));
        line.setAttribute('x2', String(seg.x2));
        line.setAttribute('y2', String(seg.y2));
        line.setAttribute('stroke', '#ff6b35');
        line.setAttribute('stroke-opacity', '0.38');
        line.setAttribute('stroke-width', '2.25');
        line.setAttribute('stroke-linecap', 'round');
        line.setAttribute('marker-end', 'url(#hero-loop-arrow)');
        svg.appendChild(line);
      });
    }

    const nodesHost = loopRoot.querySelector('[data-hero-loop-nodes]');
    if (!nodesHost) return;

    steps.forEach((step, i) => {
      const { x, y } = verts[i];
      const el = document.createElement('div');
      el.className = 'hero-loop-step';
      el.style.left = (x / VB) * 100 + '%';
      el.style.top = (y / VB) * 100 + '%';

      const thumbBox = document.createElement('div');
      thumbBox.className = 'hero-loop-thumb';
      const img = document.createElement('img');
      img.src = step.src;
      img.alt = step.label;
      img.width = 360;
      img.height = 360;
      img.loading = 'lazy';
      thumbBox.appendChild(img);

      const label = document.createElement('p');
      label.className =
        'mt-1.5 max-w-[5.75rem] text-center text-[10px] font-semibold leading-tight text-neutral-600 md:text-[11px]' +
        (step.nowrap ? ' md:max-w-none' : ' md:max-w-[7rem]');
      label.innerHTML =
        '<span class="md:hidden">' +
        step.short +
        '</span><span class="hidden md:inline' +
        (step.nowrap ? ' whitespace-nowrap' : '') +
        '">' +
        step.label +
        '</span>';

      el.appendChild(thumbBox);
      el.appendChild(label);
      nodesHost.appendChild(el);
    });
  }
})();
