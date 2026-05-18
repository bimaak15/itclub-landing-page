/* =============================================
   IT Club — SMK Negeri 1 Surabaya
   main.js
   ============================================= */

(function () {
  'use strict';

  /* -------------------------------------------------- */
  /* 1. NAVBAR — scroll shadow + active link highlight  */
  /* -------------------------------------------------- */
  const navbar  = document.querySelector('.navbar');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');

  function onScroll() {
    // Scrolled class for shadow effect
    if (window.scrollY > 20) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    // Active nav-link based on scroll position
    let current = '';
    sections.forEach((sec) => {
      const top = sec.offsetTop - 90;
      if (window.scrollY >= top) current = sec.id;
    });

    navLinks.forEach((link) => {
      link.classList.remove('active');
      if (link.getAttribute('href') === '#' + current) {
        link.classList.add('active');
      }
    });
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // run once on load

  /* -------------------------------------------------- */
  /* 2. HAMBURGER MENU                                   */
  /* -------------------------------------------------- */
  const hamburger  = document.querySelector('.nav-hamburger');
  const mobileNav  = document.querySelector('.nav-mobile');
  const mobileLinks = document.querySelectorAll('.nav-mobile .nav-link, .nav-mobile .nav-cta');

  function closeMenu() {
    hamburger.classList.remove('open');
    mobileNav.classList.remove('open');
    document.body.style.overflow = '';
  }

  function toggleMenu() {
    const isOpen = hamburger.classList.toggle('open');
    mobileNav.classList.toggle('open', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  }

  if (hamburger) {
    hamburger.addEventListener('click', toggleMenu);
  }

  // Close on mobile link click
  mobileLinks.forEach((link) => {
    link.addEventListener('click', closeMenu);
  });

  // Close on outside click
  document.addEventListener('click', (e) => {
    if (
      mobileNav &&
      mobileNav.classList.contains('open') &&
      !mobileNav.contains(e.target) &&
      !hamburger.contains(e.target)
    ) {
      closeMenu();
    }
  });

  // Close on resize if desktop
  window.addEventListener('resize', () => {
    if (window.innerWidth > 900) closeMenu();
  });

  /* -------------------------------------------------- */
  /* 3. SCROLL-REVEAL (Intersection Observer)           */
  /* -------------------------------------------------- */
  const revealEls = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target); // animate once only
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );

    revealEls.forEach((el) => observer.observe(el));
  } else {
    // Fallback: just show all immediately
    revealEls.forEach((el) => el.classList.add('visible'));
  }

  /* -------------------------------------------------- */
  /* 4. SMOOTH SCROLL for anchor links                  */
  /* -------------------------------------------------- */
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const offset = 72; // navbar height
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });

  /* -------------------------------------------------- */
  /* 5. ANIMATED COUNTER (stats in hero)               */
  /* -------------------------------------------------- */
  function animateCounter(el, target, suffix) {
    const duration = 1400;
    const start = performance.now();
    const startVal = 0;

    function step(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // Ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(startVal + (target - startVal) * eased);
      el.textContent = current + suffix;
      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  const statEls = document.querySelectorAll('[data-counter]');
  let countersStarted = false;

  function maybeStartCounters(entries) {
    entries.forEach((entry) => {
      if (entry.isIntersecting && !countersStarted) {
        countersStarted = true;
        statEls.forEach((el) => {
          const target = parseInt(el.dataset.counter, 10);
          const suffix = el.dataset.suffix || '';
          animateCounter(el, target, suffix);
        });
      }
    });
  }

  if (statEls.length > 0 && 'IntersectionObserver' in window) {
    const statsObserver = new IntersectionObserver(maybeStartCounters, {
      threshold: 0.5,
    });
    const statsSection = document.querySelector('.hero-stats');
    if (statsSection) statsObserver.observe(statsSection);
  }

  /* -------------------------------------------------- */
  /* 6. EVENT ROW — click ripple effect                 */
  /* -------------------------------------------------- */
  document.querySelectorAll('.event-row').forEach((row) => {
    row.addEventListener('click', function (e) {
      // Simple visual feedback
      this.style.background = 'rgba(26, 123, 191, 0.08)';
      setTimeout(() => {
        this.style.background = '';
      }, 300);
    });
  });

  /* -------------------------------------------------- */
  /* 7. YEAR in footer copyright                        */
  /* -------------------------------------------------- */
  const yearEl = document.getElementById('footer-year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

})();
