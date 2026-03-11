'use strict';

const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

/* ============================================================
   1. NAVIGATION
   ============================================================ */
(function initNav() {
  const header     = $('#site-header');
  const hamburger  = $('#nav-hamburger');
  const mobileMenu = $('#mobile-menu');

  if (!header) return;

  // Scroll state
  const updateHeader = () => {
    header.classList.toggle('scrolled', window.scrollY > 60);
  };
  window.addEventListener('scroll', updateHeader, { passive: true });
  updateHeader();

  // Hamburger
  const toggleMenu = (open) => {
    hamburger?.classList.toggle('open', open);
    mobileMenu?.classList.toggle('open', open);
    document.body.style.overflow = open ? 'hidden' : '';
  };
  hamburger?.addEventListener('click', () => toggleMenu(!mobileMenu?.classList.contains('open')));
  mobileMenu?.addEventListener('click', (e) => { if (e.target === mobileMenu) toggleMenu(false); });
  $$('.mobile-nav-link, .mobile-nav-sub a').forEach(l => l.addEventListener('click', () => toggleMenu(false)));

  // Active nav link
  const navLinks = $$('.nav-link');
  const currentPath = location.pathname.split('/').pop() || 'index.html';
  navLinks.forEach(link => {
    const href = link.getAttribute('href') || '';
    if (href === currentPath || (currentPath === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });
})();

/* ============================================================
   2. SMOOTH SCROLL
   ============================================================ */
document.addEventListener('click', (e) => {
  const link = e.target.closest('a[href^="#"]');
  if (!link) return;
  const target = document.querySelector(link.getAttribute('href'));
  if (!target) return;
  e.preventDefault();
  const top = target.getBoundingClientRect().top + window.scrollY - 80;
  window.scrollTo({ top, behavior: 'smooth' });
});

/* ============================================================
   3. SCROLL REVEAL
   ============================================================ */
(function initReveal() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  $$('.reveal').forEach(el => observer.observe(el));
})();

/* ============================================================
   4. COUNTERS
   ============================================================ */
(function initCounters() {
  const easeOut = t => 1 - Math.pow(1 - t, 4);

  const animate = (el) => {
    const target = parseFloat(el.dataset.target);
    const suffix = el.dataset.suffix || '';
    const decimals = el.dataset.decimals ? parseInt(el.dataset.decimals) : 0;
    const duration = 1600;
    const start = performance.now();

    const tick = (now) => {
      const p = Math.min((now - start) / duration, 1);
      const v = easeOut(p) * target;
      el.textContent = (decimals ? v.toFixed(decimals) : Math.round(v)) + suffix;
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) { animate(e.target); observer.unobserve(e.target); } });
  }, { threshold: 0.5 });

  $$('[data-target]').forEach(el => observer.observe(el));
})();

/* ============================================================
   5. FAQ ACCORDION
   ============================================================ */
(function initFaq() {
  $$('.faq-question').forEach(btn => {
    btn.addEventListener('click', () => {
      const item   = btn.closest('.faq-item');
      const answer = item.querySelector('.faq-answer');
      const isOpen = btn.classList.contains('open');

      // Close all
      $$('.faq-question.open').forEach(q => {
        q.classList.remove('open');
        q.closest('.faq-item').querySelector('.faq-answer').classList.remove('open');
      });

      // Open clicked if was closed
      if (!isOpen) {
        btn.classList.add('open');
        answer.classList.add('open');
      }
    });
  });
})();

/* ============================================================
   6. DATA BARS
   ============================================================ */
(function initDataBars() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('animated');
        observer.unobserve(e.target);
      }
    });
  }, { threshold: 0.3 });

  $$('.data-bar-fill').forEach(el => observer.observe(el));
})();

/* ============================================================
   7. HERO PARTICLES
   ============================================================ */
(function initParticles() {
  const container = $('#hero-particles');
  if (!container) return;
  for (let i = 0; i < 24; i++) {
    const el = document.createElement('div');
    el.className = 'particle';
    const size = Math.random() * 3 + 1;
    el.style.cssText = `width:${size}px;height:${size}px;left:${Math.random()*100}%;animation-duration:${Math.random()*12+8}s;animation-delay:${Math.random()*10}s;`;
    container.appendChild(el);
  }
})();

/* ============================================================
   8. PARALLAX (hero only)
   ============================================================ */
(function initParallax() {
  const hero = $('.hero');
  const content = $('.hero-content');
  if (!hero || !content) return;
  let ticking = false;
  window.addEventListener('scroll', () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      const y = window.scrollY;
      if (y <= hero.offsetHeight) {
        content.style.transform = `translateY(${y * 0.18}px)`;
        content.style.opacity = String(Math.max(0, 1 - (y / hero.offsetHeight) * 1.4));
      }
      ticking = false;
    });
  }, { passive: true });
})();

/* ============================================================
   9. CURSOR GLOW (desktop)
   ============================================================ */
(function initCursorGlow() {
  if (window.matchMedia('(hover: none)').matches) return;
  const glow = document.createElement('div');
  glow.style.cssText = 'position:fixed;pointer-events:none;z-index:9999;width:400px;height:400px;border-radius:50%;background:radial-gradient(circle,rgba(201,168,76,0.05) 0%,transparent 70%);transform:translate(-50%,-50%);top:0;left:0;transition:opacity .5s;';
  document.body.appendChild(glow);
  let mx = 0, my = 0, gx = 0, gy = 0;
  document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });
  const tick = () => {
    gx += (mx - gx) * 0.08; gy += (my - gy) * 0.08;
    glow.style.left = gx + 'px'; glow.style.top = gy + 'px';
    requestAnimationFrame(tick);
  };
  tick();
})();

/* ============================================================
   10. STAGGER CHILDREN
   ============================================================ */
(function initStagger() {
  const groups = [
    '.business-grid .business-card',
    '.feature-grid .feature-item',
    '.wood-grid .wood-card',
    '.category-grid .category-card',
    '.result-grid .result-card',
    '.pricing-grid .pricing-card',
    '.mvv-grid .mvv-card',
  ];
  groups.forEach(sel => {
    $$(sel).forEach((el, i) => {
      el.classList.add('reveal');
      el.style.transitionDelay = `${i * 0.1}s`;
    });
  });

  // Re-observe
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.add('visible'); observer.unobserve(entry.target); }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -20px 0px' });
  $$('.reveal:not(.visible)').forEach(el => observer.observe(el));
})();

/* ============================================================
   11. THEME TOGGLE
   ============================================================ */
(function initThemeToggle() {
  const html = document.documentElement;
  const saved = localStorage.getItem('level1-theme') || 'dark';
  html.dataset.theme = saved;

  const updateButtons = (theme) => {
    document.querySelectorAll('.theme-toggle').forEach(btn => {
      btn.textContent = theme === 'dark' ? '☀️' : '🌙';
      btn.setAttribute('aria-label', theme === 'dark' ? 'ライトモードに切替' : 'ダークモードに切替');
    });
  };

  updateButtons(saved);

  document.querySelectorAll('.theme-toggle').forEach(btn => {
    btn.addEventListener('click', () => {
      const next = html.dataset.theme === 'dark' ? 'light' : 'dark';
      html.dataset.theme = next;
      localStorage.setItem('level1-theme', next);
      updateButtons(next);
    });
  });
})();

/* ============================================================
   12. TABS (if present)
   ============================================================ */
(function initTabs() {
  $$('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const group = btn.closest('.tab-group');
      const target = btn.dataset.tab;
      group.querySelectorAll('.tab-btn').forEach(b => b.classList.toggle('active', b === btn));
      group.querySelectorAll('.tab-panel').forEach(p => p.classList.toggle('active', p.dataset.panel === target));
    });
  });
})();
