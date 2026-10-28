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

  // Keep form handling honest: this static site has no configured lead API yet.
  // Never silently swallow a submission or imply that personal data was sent.
  const form = document.querySelector('#guide-form');
  if (form) {
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      let status = form.querySelector('.form-status');
      if (!status) {
        status = document.createElement('p');
        status.className = 'form-status';
        status.setAttribute('role', 'status');
        status.setAttribute('aria-live', 'polite');
        form.append(status);
      }
      status.textContent = 'The online request form is not connected yet. Please contact SERI through the official website to request the course guide.';
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