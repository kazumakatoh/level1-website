/* ============================================================
   LEVEL1 Corporate Site — main.js
   ============================================================ */

'use strict';

/* ---------- Utilities ---------- */
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

/* ============================================================
   1. NAVIGATION — scroll state & hamburger
   ============================================================ */
(function initNav() {
  const header    = $('#site-header');
  const hamburger = $('#nav-hamburger');
  const mobileMenu= $('#mobile-menu');
  const mobileLinks = $$('.mobile-nav-link');

  // Header scroll state
  const SCROLL_THRESHOLD = 60;
  let lastScrollY = 0;

  const updateHeader = () => {
    const y = window.scrollY;
    if (y > SCROLL_THRESHOLD) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
    lastScrollY = y;
  };

  window.addEventListener('scroll', updateHeader, { passive: true });
  updateHeader();

  // Hamburger toggle
  const toggleMenu = (open) => {
    hamburger.classList.toggle('open', open);
    mobileMenu.classList.toggle('open', open);
    document.body.style.overflow = open ? 'hidden' : '';
  };

  hamburger.addEventListener('click', () => {
    const isOpen = mobileMenu.classList.contains('open');
    toggleMenu(!isOpen);
  });

  // Close on link click
  mobileLinks.forEach(link => {
    link.addEventListener('click', () => toggleMenu(false));
  });

  // Close on backdrop click
  mobileMenu.addEventListener('click', (e) => {
    if (e.target === mobileMenu) toggleMenu(false);
  });

  // Active nav link on scroll
  const sections = $$('section[id]');
  const navLinks  = $$('.nav-link');

  const highlightNav = () => {
    const scrollMid = window.scrollY + window.innerHeight / 2;
    let activeId = '';
    sections.forEach(sec => {
      if (sec.offsetTop <= scrollMid) activeId = sec.id;
    });
    navLinks.forEach(link => {
      const href = link.getAttribute('href').replace('#', '');
      link.classList.toggle('active', href === activeId);
    });
  };

  window.addEventListener('scroll', highlightNav, { passive: true });
})();

/* ============================================================
   2. SMOOTH SCROLL for anchor links
   ============================================================ */
(function initSmoothScroll() {
  document.addEventListener('click', (e) => {
    const link = e.target.closest('a[href^="#"]');
    if (!link) return;
    const target = document.querySelector(link.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const headerH = 72;
    const top = target.getBoundingClientRect().top + window.scrollY - headerH;
    window.scrollTo({ top, behavior: 'smooth' });
  });
})();

/* ============================================================
   3. SCROLL REVEAL — Intersection Observer
   ============================================================ */
(function initReveal() {
  const elements = $$('.reveal');
  if (!elements.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
  });

  elements.forEach(el => observer.observe(el));
})();

/* ============================================================
   4. ANIMATED COUNTERS
   ============================================================ */
(function initCounters() {
  const counters = $$('[data-target]');
  if (!counters.length) return;

  const easeOutQuart = t => 1 - Math.pow(1 - t, 4);

  const animateCounter = (el) => {
    const target = parseInt(el.dataset.target, 10);
    const suffix = el.dataset.suffix || '';
    const duration = 1600;
    const start = performance.now();

    const tick = (now) => {
      const elapsed = Math.min((now - start) / duration, 1);
      const value = Math.round(easeOutQuart(elapsed) * target);
      el.textContent = value + suffix;
      if (elapsed < 1) requestAnimationFrame(tick);
    };

    requestAnimationFrame(tick);
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(el => observer.observe(el));
})();

/* ============================================================
   5. HERO PARTICLES
   ============================================================ */
(function initParticles() {
  const container = $('#hero-particles');
  if (!container) return;

  const COUNT = 24;

  const createParticle = () => {
    const el = document.createElement('div');
    el.className = 'particle';
    const size = Math.random() * 3 + 1;
    el.style.cssText = `
      width: ${size}px;
      height: ${size}px;
      left: ${Math.random() * 100}%;
      animation-duration: ${Math.random() * 12 + 8}s;
      animation-delay: ${Math.random() * 10}s;
      opacity: 0;
    `;
    container.appendChild(el);
  };

  for (let i = 0; i < COUNT; i++) createParticle();
})();

/* ============================================================
   6. PARALLAX — hero content subtle depth
   ============================================================ */
(function initParallax() {
  const hero = $('.hero');
  const content = $('.hero-content');
  if (!hero || !content) return;

  let ticking = false;

  const onScroll = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      const y = window.scrollY;
      const max = hero.offsetHeight;
      if (y <= max) {
        content.style.transform = `translateY(${y * 0.2}px)`;
        content.style.opacity = 1 - (y / max) * 1.2;
      }
      ticking = false;
    });
  };

  window.addEventListener('scroll', onScroll, { passive: true });
})();

/* ============================================================
   7. CURSOR GLOW (desktop only)
   ============================================================ */
(function initCursorGlow() {
  if (window.matchMedia('(hover: none)').matches) return;

  const glow = document.createElement('div');
  glow.style.cssText = `
    position: fixed;
    pointer-events: none;
    z-index: 9999;
    width: 400px;
    height: 400px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(201,168,76,0.06) 0%, transparent 70%);
    transform: translate(-50%, -50%);
    transition: opacity 0.5s;
    top: 0; left: 0;
  `;
  document.body.appendChild(glow);

  let mx = 0, my = 0, gx = 0, gy = 0;

  document.addEventListener('mousemove', e => {
    mx = e.clientX;
    my = e.clientY;
  });

  const animate = () => {
    gx += (mx - gx) * 0.08;
    gy += (my - gy) * 0.08;
    glow.style.left = gx + 'px';
    glow.style.top  = gy + 'px';
    requestAnimationFrame(animate);
  };
  animate();
})();

/* ============================================================
   8. STAGGER animation on business cards & cf-steps
   ============================================================ */
(function initStagger() {
  const groups = [
    { parent: '.business-grid', child: '.business-card' },
    { parent: '.cf-flow',       child: '.cf-step' },
    { parent: '.contact-cards', child: '.contact-card' },
  ];

  groups.forEach(({ parent, child }) => {
    const parentEl = $(parent);
    if (!parentEl) return;
    const children = $$(child, parentEl);
    children.forEach((el, i) => {
      el.classList.add('reveal');
      el.style.transitionDelay = `${i * 0.12}s`;
    });
  });

  // Re-init reveal observer for newly marked elements
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -30px 0px' });

  $$('.reveal').forEach(el => {
    if (!el.classList.contains('visible')) observer.observe(el);
  });
})();
