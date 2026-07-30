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
  // ROI section text
  gsap.from('.roi-intro > *', {
    autoAlpha: 0,
    y: 18,
    stagger: 0.1,
    duration: 0.7,
    scrollTrigger: { trigger: '.roi-intro', start: 'top 86%', once: true },
  });

  // La carrera: el agente cruza la meta en 1s, la ronda manual se arrastra.
  // Se reinicia al salir del viewport para que la comparación se vea siempre en vivo.
  const race = document.querySelector('.race');
  if (race) {
    const dayEl = race.querySelector('.race-count');
    const raceTl = gsap.timeline({
      scrollTrigger: { trigger: race, start: 'top 75%', toggleActions: 'play none none reset' },
    });
    let lastDay = '';
    raceTl.from(race, { autoAlpha: 0, y: 26, duration: 0.55 });
    raceTl.addLabel('go', '+=0.15');
    raceTl.from('.race-bar--agent', { xPercent: -100, duration: 1, ease: 'power3.inOut' }, 'go');
    raceTl.from('.race-done', { autoAlpha: 0, scale: 0.6, duration: 0.4, ease: 'back.out(2)' }, 'go+=1.05');
    raceTl.from('.race-bar--manual', {
      xPercent: -100,
      duration: 3.6,
      ease: 'none',
      onUpdate() {
        const p = this.progress();
        const label = p < 1 ? 'Día ' + Math.max(1, Math.ceil(p * 5)) : '5 días';
        if (label !== lastDay) { lastDay = label; dayEl.textContent = label; }
      },
    }, 'go');
    raceTl.from('.race-note', { autoAlpha: 0, y: 10, duration: 0.5 }, 'go+=1.4');
  }

  // Anillos KPI: el arco se dibuja y el número cuenta a la vez
  document.querySelectorAll('.ring-card').forEach((card) => {
    const ring        = card.querySelector('.ring-fill');
    const circumference = parseFloat(ring.getAttribute('stroke-dasharray'));
    const finalOffset = parseFloat(ring.getAttribute('stroke-dashoffset'));
    const valEl       = card.querySelector('.ring-val');
    const target      = parseFloat(valEl.dataset.target);

    gsap.from(card, {
      autoAlpha: 0,
      y: 24,
      duration: 0.55,
      scrollTrigger: { trigger: card, start: 'top 88%', once: true },
    });

    ScrollTrigger.create({
      trigger: card,
      start: 'top 85%',
      once: true,
      onEnter() {
        gsap.fromTo(ring,
          { strokeDashoffset: circumference },
          { strokeDashoffset: finalOffset, duration: 1.6, ease: 'power2.out' }
        );
        const obj = { v: 0 };
        let lastVal = -1;
        gsap.to(obj, {
          v: target,
          duration: 1.6,
          ease: 'power2.out',
          onUpdate() {
            const v = Math.round(obj.v);
            if (v !== lastVal) { lastVal = v; valEl.textContent = v; }
          },
        });
      },
    });
  });

  // El golpe de dinero: las ofertas se despliegan y el ahorro cuenta en euros
  const savings = document.querySelector('.savings');
  if (savings) {
    const numEl  = savings.querySelector('.savings-num');
    const target = parseFloat(numEl.dataset.target);
    const tl = gsap.timeline({
      scrollTrigger: { trigger: savings, start: 'top 75%', once: true },
    });
    tl.from(savings, { autoAlpha: 0, y: 26, duration: 0.55 });
    tl.from('.savings-copy > *', { autoAlpha: 0, y: 16, stagger: 0.1, duration: 0.5 }, '-=0.2');
    gsap.utils.toArray('.offer-bar').forEach((bar, i) => {
      tl.from(bar, { xPercent: -100, duration: 0.9, ease: 'power3.out' }, 0.45 + i * 0.2);
    });
    tl.from('.offer-badge', { autoAlpha: 0, scale: 0.5, duration: 0.4, ease: 'back.out(2)' }, '-=0.15');
    const obj = { v: 0 };
    let lastVal = -1;
    tl.to(obj, {
      v: target,
      duration: 1.4,
      ease: 'power2.out',
      onUpdate() {
        const v = Math.round(obj.v);
        if (v !== lastVal) { lastVal = v; numEl.textContent = v.toLocaleString('es-ES'); }
      },
    }, 0.8);
  }

  gsap.from('.roi-cta', {
    autoAlpha: 0,
    y: 16,
    duration: 0.6,
    scrollTrigger: { trigger: '.roi-cta', start: 'top 88%', once: true },
  });
}

// ─── SE ADAPTA: tres formatos convergen en una vista ─────────────────────────

function initAdapt() {
  const piece = document.querySelector('.adapt-piece');
  if (!piece) return;

  gsap.from('.adapt-enemy', {
    autoAlpha: 0,
    x: -14,
    duration: 0.6,
    scrollTrigger: { trigger: '.adapt-enemy', start: 'top 88%', once: true },
  });

  // El markup ya trae el estado final: si GSAP no corre, se ve la pieza completa.
  const tl = gsap.timeline({
    scrollTrigger: { trigger: piece, start: 'top 72%', once: true },
  });

  tl.from(piece, { autoAlpha: 0, y: 26, duration: 0.55 });
  tl.from('.adapt-head > *', { autoAlpha: 0, y: 10, stagger: 0.08, duration: 0.4 }, '-=0.25');

  // 1. Entran los tres formatos, cada uno con su propia identidad
  tl.from('.fmt-card', {
    autoAlpha: 0,
    y: 22,
    stagger: 0.13,
    duration: 0.5,
    ease: 'power2.out',
  }, 'in');
  tl.from('.fmt-line', {
    autoAlpha: 0,
    scaleX: 0.4,
    transformOrigin: 'left center',
    stagger: 0.015,
    duration: 0.35,
  }, 'in+=0.2');

  // 2. Las líneas se dibujan hacia el punto de convergencia
  // (el label se define antes de usarlo: si no, GSAP lo ancla al final del timeline)
  tl.addLabel('converge', '-=0.1');
  gsap.utils.toArray('.cvg-path').forEach((path, i) => {
    const len = path.getTotalLength();
    tl.fromTo(path,
      { strokeDasharray: len, strokeDashoffset: len },
      { strokeDashoffset: 0, duration: 0.7, ease: 'power2.inOut' },
      'converge+=' + i * 0.08
    );
  });

  // 3. Sale una sola vista normalizada
  tl.from('.unified', { autoAlpha: 0, y: 18, duration: 0.55, ease: 'power2.out' }, 'converge+=0.55');
  tl.from('.u-row', { autoAlpha: 0, x: -12, stagger: 0.07, duration: 0.4 }, 'converge+=0.75');
  tl.from('.adapt-learned', {
    autoAlpha: 0,
    scale: 0.85,
    duration: 0.45,
    ease: 'back.out(1.8)',
  }, 'converge+=1.15');

  gsap.from('.adapt-facts li', {
    autoAlpha: 0,
    y: 12,
    stagger: 0.07,
    duration: 0.45,
    scrollTrigger: { trigger: '.adapt-facts', start: 'top 88%', once: true },
  });

  gsap.from('.adapt-integr', {
    autoAlpha: 0,
    y: 16,
    duration: 0.6,
    scrollTrigger: { trigger: '.adapt-integr', start: 'top 88%', once: true },
  });

  gsap.from('.adapt-objection > *', {
    autoAlpha: 0,
    y: 14,
    stagger: 0.14,
    duration: 0.6,
    scrollTrigger: { trigger: '.adapt-objection', start: 'top 88%', once: true },
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

// Moneda por región (COP en Colombia, EUR resto) + periodicidad mensual/anual.
// Detección: 1) elección guardada del usuario  2) zona horaria (instantáneo)
// 3) IP vía /api/geo (autoritativo, Vercel). El toggle es visible y editable
// para que nadie sienta que se le "esconde" un precio.
function initPricingControls() {
  const grid = document.querySelector('.pricing-grid');
  if (!grid) return;

  const state = { currency: 'EUR', billing: 'monthly' };
  const LS_KEY = 'konbud_currency';

  const fmtMoney = (cur, v) => {
    const n = new Intl.NumberFormat('es').format(v);
    return cur === 'COP' ? '$' + n : '€' + n;
  };

  function render() {
    const c = state.currency.toLowerCase();
    grid.querySelectorAll('.pricing-card').forEach((card) => {
      const amt = card.querySelector('.price-amount');
      if (!amt) return;
      const monthly = Number(amt.dataset[c + 'Monthly']);
      const value = Number(amt.dataset[c + (state.billing === 'annual' ? 'Annual' : 'Monthly')]);
      amt.textContent = fmtMoney(state.currency, value);
      const note = card.querySelector('.price-annual-note');
      if (note) note.textContent = 'Facturado anualmente — ahorras ' + fmtMoney(state.currency, monthly * 2) + '/año';
    });
    const ea = document.querySelector('[data-ea-price]');
    if (ea) ea.textContent = fmtMoney(state.currency, Number(ea.dataset[state.currency === 'COP' ? 'cop' : 'eur']));
    grid.classList.toggle('annual', state.billing === 'annual');
  }

  function syncUI() {
    document.querySelectorAll('[data-currency]').forEach((b) => {
      const on = b.dataset.currency === state.currency;
      b.classList.toggle('active', on);
      b.setAttribute('aria-pressed', String(on));
    });
    document.querySelectorAll('[data-billing]').forEach((b) => {
      const on = b.dataset.billing === state.billing;
      b.classList.toggle('active', on);
      b.setAttribute('aria-pressed', String(on));
    });
  }

  // Moneda inicial
  let locked = false;
  const saved = localStorage.getItem(LS_KEY);
  if (saved === 'EUR' || saved === 'COP') {
    state.currency = saved;
    locked = true;
  } else {
    try {
      if (Intl.DateTimeFormat().resolvedOptions().timeZone === 'America/Bogota') state.currency = 'COP';
    } catch (_) {}
  }

  render();
  syncUI();

  // Confirmación autoritativa por IP, salvo que el usuario ya haya elegido
  if (!locked) {
    fetch('/api/geo')
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (!d || !d.country) return;
        const geoCur = d.country === 'CO' ? 'COP' : 'EUR';
        if (geoCur !== state.currency) {
          state.currency = geoCur;
          render();
          syncUI();
        }
      })
      .catch(() => {});
  }

  document.querySelectorAll('[data-currency]').forEach((btn) => {
    btn.addEventListener('click', () => {
      state.currency = btn.dataset.currency;
      localStorage.setItem(LS_KEY, state.currency);
      render();
      syncUI();
    });
  });
  document.querySelectorAll('[data-billing]').forEach((btn) => {
    btn.addEventListener('click', () => {
      state.billing = btn.dataset.billing;
      render();
      syncUI();
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
  initAdapt();
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
initPricingControls();
