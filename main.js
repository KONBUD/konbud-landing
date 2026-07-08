gsap.registerPlugin(ScrollTrigger);

gsap.defaults({ ease: 'power2.out' });

// ─── HERO ────────────────────────────────────────────────────────────────────

function initHero() {
  const tl = gsap.timeline({ delay: 0.1 });

  tl.from('.hero-logo', {
    autoAlpha: 0,
    scale: 0.86,
    duration: 1.1,
    ease: 'power3.out',
  })
    .from('.hero-badge', { autoAlpha: 0, y: 14, duration: 0.6 }, '-=0.55')
    .from('.hero-title', { autoAlpha: 0, y: 22, duration: 0.75, ease: 'power3.out' }, '-=0.4')
    .from('.hero-market-badge', { autoAlpha: 0, y: 10, duration: 0.5 }, '-=0.3')
    .from('.hero-sub', { autoAlpha: 0, y: 14, duration: 0.6 }, '-=0.35')
    .from('.scroll-hint', { autoAlpha: 0, duration: 0.5 }, '-=0.1');

  // Floating logo
  gsap.to('.hero-logo', {
    y: -10,
    duration: 3.2,
    repeat: -1,
    yoyo: true,
    ease: 'sine.inOut',
    delay: 1.4,
  });
}

// ─── FEATURES ────────────────────────────────────────────────────────────────

function initFeatures() {
  ScrollTrigger.batch('.feature-card', {
    onEnter: (batch) =>
      gsap.from(batch, {
        autoAlpha: 0,
        y: 28,
        stagger: 0.08,
        duration: 0.65,
        ease: 'power2.out',
      }),
    start: 'top 88%',
    once: true,
  });
}

// ─── LED SVG ─────────────────────────────────────────────────────────────────

function initLED() {
  document.querySelectorAll('.step-card').forEach((card) => {
    const paths = card.querySelectorAll('.led-path');

    // Set initial state: hidden stroke
    paths.forEach((path) => {
      const len = path.getTotalLength();
      gsap.set(path, { strokeDasharray: len, strokeDashoffset: len });
    });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: card,
        start: 'top 80%',
        toggleActions: 'play none none reset',
      },
    });

    // Card entrance
    tl.from(card, { autoAlpha: 0, y: 24, duration: 0.55 });

    // Icon scale pop
    tl.from(card.querySelector('.step-svg'), {
      scale: 0.75,
      autoAlpha: 0,
      duration: 0.4,
      ease: 'back.out(1.7)',
      transformOrigin: 'center center',
    }, '-=0.2');

    // LED draw — stagger paths if multiple
    paths.forEach((path, i) => {
      const len = path.getTotalLength();
      tl.to(
        path,
        { strokeDashoffset: 0, duration: 1.3, ease: 'power2.inOut' },
        i === 0 ? '-=0.15' : '-=1.1'
      );
    });
  });
}

// ─── SECTION REVEALS ─────────────────────────────────────────────────────────

function initReveals() {
  gsap.utils.toArray('.section-header').forEach((el) => {
    gsap.from(el.children, {
      autoAlpha: 0,
      y: 18,
      stagger: 0.1,
      duration: 0.65,
      scrollTrigger: { trigger: el, start: 'top 86%', once: true },
    });
  });

  gsap.utils.toArray('.contact-card').forEach((card, i) => {
    gsap.from(card, {
      autoAlpha: 0,
      y: 20,
      duration: 0.55,
      delay: i * 0.08,
      scrollTrigger: { trigger: card, start: 'top 88%', once: true },
    });
  });

  gsap.utils.toArray('.email-box').forEach((el) => {
    gsap.from(el, {
      autoAlpha: 0,
      y: 20,
      duration: 0.65,
      scrollTrigger: { trigger: el, start: 'top 85%', once: true },
    });
  });
}

// ─── NAV SCROLL STYLE ────────────────────────────────────────────────────────

function initNav() {
  const nav = document.getElementById('nav');
  ScrollTrigger.create({
    start: 'top -60',
    onUpdate: (self) => {
      nav.classList.toggle('scrolled', self.scroll() > 60);
    },
  });
}

// ─── SCROLL HINT ─────────────────────────────────────────────────────────────

function initScrollHint() {
  gsap.to('.scroll-hint svg', {
    y: 5,
    duration: 1.2,
    repeat: -1,
    yoyo: true,
    ease: 'sine.inOut',
  });
}

// ─── COUNTERS & BARS ─────────────────────────────────────────────────────────

function initROI() {
  // Animated number counters
  document.querySelectorAll('.kpi-num').forEach((el) => {
    const target = parseInt(el.dataset.target, 10);
    const obj    = { val: 0 };
    ScrollTrigger.create({
      trigger: el,
      start: 'top 85%',
      once: true,
      onEnter() {
        gsap.to(obj, {
          val: target,
          duration: 1.6,
          ease: 'power2.out',
          onUpdate() { el.textContent = Math.round(obj.val); },
        });
      },
    });
  });

  // Animated KPI progress bars
  document.querySelectorAll('.kpi-bar-fill').forEach((bar) => {
    ScrollTrigger.create({
      trigger: bar,
      start: 'top 88%',
      once: true,
      onEnter() { bar.classList.add('animated'); },
    });
  });

  // Before/After bars scale from bottom
  ScrollTrigger.create({
    trigger: '.before-after',
    start: 'top 80%',
    once: true,
    onEnter() {
      gsap.from('.before-bar', {
        scaleY: 0,
        transformOrigin: 'bottom',
        duration: 1,
        ease: 'power3.out',
      });
      gsap.from('.after-bar', {
        scaleY: 0,
        transformOrigin: 'bottom',
        duration: 0.7,
        delay: 0.4,
        ease: 'power3.out',
      });
      gsap.from('.ba-arrow', { autoAlpha: 0, x: -10, duration: 0.5, delay: 0.6 });
    },
  });

  // ROI section text
  gsap.from('.roi-intro > *', {
    autoAlpha: 0,
    y: 18,
    stagger: 0.1,
    duration: 0.7,
    scrollTrigger: { trigger: '.roi-intro', start: 'top 86%', once: true },
  });

  gsap.from('.roi-cta', {
    autoAlpha: 0,
    y: 16,
    duration: 0.6,
    scrollTrigger: { trigger: '.roi-cta', start: 'top 88%', once: true },
  });
}

// ─── PRICING REVEALS ─────────────────────────────────────────────────────────

function initPricing() {
  ScrollTrigger.batch('.pricing-card', {
    onEnter: (batch) =>
      gsap.from(batch, {
        autoAlpha: 0,
        y: 28,
        stagger: 0.1,
        duration: 0.65,
        ease: 'power2.out',
      }),
    start: 'top 88%',
    once: true,
  });

  gsap.from('.pricing-footer', {
    autoAlpha: 0,
    y: 14,
    duration: 0.55,
    scrollTrigger: { trigger: '.pricing-footer', start: 'top 90%', once: true },
  });
}

// ─── KON — SECCIÓN + CHAT MOCKUP ─────────────────────────────────────────────

function initKon() {
  const section = document.querySelector('.kon-section');
  if (!section) return;

  gsap.from('.kon-figure', {
    autoAlpha: 0,
    y: 30,
    duration: 0.8,
    scrollTrigger: { trigger: '.kon-layout', start: 'top 80%', once: true },
  });

  gsap.from('.kon-points li', {
    autoAlpha: 0,
    y: 18,
    stagger: 0.12,
    duration: 0.55,
    scrollTrigger: { trigger: '.kon-points', start: 'top 85%', once: true },
  });

  // Conversación: los mensajes aparecen en secuencia, como un chat real
  const messages = gsap.utils.toArray('.chat-body > *');
  const tl = gsap.timeline({
    scrollTrigger: { trigger: '.kon-chat', start: 'top 75%', once: true },
  });

  tl.from('.kon-chat', { autoAlpha: 0, y: 30, duration: 0.6 });
  messages.forEach((msg) => {
    tl.from(msg, { autoAlpha: 0, y: 14, duration: 0.45 }, '+=0.4');
  });
  tl.fromTo(
    '.chat-action-btn',
    { scale: 1 },
    { scale: 1.06, duration: 0.35, repeat: 3, yoyo: true, ease: 'sine.inOut' },
    '-=1.4'
  );
}

// ─── BILLING TOGGLE (mensual / anual) ────────────────────────────────────────

function initBillingToggle() {
  const toggle = document.querySelector('.billing-toggle');
  if (!toggle) return;

  const btns = toggle.querySelectorAll('.billing-btn');
  const grid = document.querySelector('.pricing-grid');

  btns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const mode = btn.dataset.billing;
      btns.forEach((b) => {
        const active = b === btn;
        b.classList.toggle('active', active);
        b.setAttribute('aria-pressed', String(active));
      });
      grid.classList.toggle('annual', mode === 'annual');
      document.querySelectorAll('.price-amount').forEach((el) => {
        el.textContent = '€' + el.dataset[mode];
      });
    });
  });
}

// ─── INIT ─────────────────────────────────────────────────────────────────────

const mm = gsap.matchMedia();

mm.add('(prefers-reduced-motion: no-preference)', () => {
  initHero();
  initROI();
  initFeatures();
  initLED();
  initReveals();
  initNav();
  initScrollHint();
  initKon();
  initPricing();
  document.fonts.ready.then(() => ScrollTrigger.refresh());
});

// Fallback: show everything if reduced motion
mm.add('(prefers-reduced-motion: reduce)', () => {
  gsap.set(['.hero-logo', '.hero-badge', '.hero-market-badge', '.hero-title', '.hero-sub', '.scroll-hint'], {
    autoAlpha: 1,
    y: 0,
    scale: 1,
  });
  document.querySelectorAll('.led-path').forEach((path) => {
    const len = path.getTotalLength();
    gsap.set(path, { strokeDasharray: len, strokeDashoffset: 0 });
  });
});

// El toggle de precios funciona con o sin animaciones
initBillingToggle();
