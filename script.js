(() => {
  const toggle = document.querySelector('.menu-toggle');
  const nav = document.querySelector('#primary-nav');

  const closeMenu = () => {
    if (!toggle || !nav) return;
    nav.classList.remove('is-open');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'Open navigation');
  };

  if (toggle && nav) {
    toggle.addEventListener('click', () => {
      const open = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', String(!open));
      toggle.setAttribute('aria-label', open ? 'Open navigation' : 'Close navigation');
      nav.classList.toggle('is-open', !open);
    });

    nav.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', closeMenu);
    });

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') closeMenu();
    });

    document.addEventListener('click', (event) => {
      if (toggle.getAttribute('aria-expanded') === 'true' &&
          !nav.contains(event.target) && !toggle.contains(event.target)) {
        closeMenu();
      }
    });
  }

  // If the source website blocks its hosted logo, retain a deliberate brand lockup.
  document.querySelectorAll('.brand-logo').forEach((logo) => {
    logo.addEventListener('error', () => {
      const fallback = document.createElement('span');
      fallback.className = 'brand-fallback';
      fallback.setAttribute('aria-label', 'SERI Skill Center');
      fallback.innerHTML = '<strong>SERI</strong><small>SKILL CENTER</small>';
      logo.replaceWith(fallback);
    }, { once: true });
  });

  const year = document.querySelector('#year');
  if (year) year.textContent = new Date().getFullYear();

  const form = document.querySelector('#guide-form');
  const status = document.querySelector('#form-status');
  if (form && status) {
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      status.textContent = 'Thanks for your interest. This is a preview only; your details have not been sent or saved.';
      status.classList.add('is-shown');
    });
  }

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const revealTargets = document.querySelectorAll('.course-card, .step, .story-note, .guide-form, .faq-list details');
  if (!reduceMotion && 'IntersectionObserver' in window) {
    revealTargets.forEach((item) => item.classList.add('reveal'));
    const observer = new IntersectionObserver((entries, currentObserver) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          currentObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -24px 0px' });
    revealTargets.forEach((item) => observer.observe(item));
  }
})();