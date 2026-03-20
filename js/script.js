/* =========================================
   ItsHimalayas — Main JavaScript
   ========================================= */

'use strict';

/* =========================================
   PAGE LOADER
   ========================================= */
(function () {
  const loader = document.getElementById('page-loader');
  if (!loader) return;

  const done = () => loader.classList.add('loaded');

  if (document.readyState === 'complete') {
    setTimeout(done, 1600);
  } else {
    window.addEventListener('load', () => setTimeout(done, 1600));
  }
})();

/* =========================================
   PAGE TRANSITION
   ========================================= */
(function () {
  const overlay = document.getElementById('page-transition');
  if (!overlay) return;

  document.querySelectorAll('a[href]').forEach(link => {
    const href = link.getAttribute('href');
    if (!href || href.startsWith('#') || href.startsWith('http') ||
        href.startsWith('mailto') || href.startsWith('tel') ||
        href.startsWith('https')) return;

    link.addEventListener('click', function (e) {
      e.preventDefault();
      const target = this.getAttribute('href');
      overlay.classList.add('exit');
      setTimeout(() => {
        window.location.href = target;
      }, 380);
    });
  });

  // Fade overlay out on new page load
  window.addEventListener('pageshow', () => {
    overlay.classList.remove('exit');
  });
})();

/* =========================================
   NAVBAR SCROLL
   ========================================= */
(function () {
  const nav = document.getElementById('navbar');
  if (!nav) return;
  const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 40);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();

/* =========================================
   MOBILE NAV
   ========================================= */
(function () {
  const burger = document.querySelector('.nav-hamburger');
  const links = document.querySelector('.nav-links');
  const overlay = document.querySelector('.nav-overlay');
  if (!burger || !links) return;

  const open = () => {
    links.classList.add('open');
    overlay && overlay.classList.add('show');
    document.body.style.overflow = 'hidden';
    burger.setAttribute('aria-expanded', 'true');
  };
  const close = () => {
    links.classList.remove('open');
    overlay && overlay.classList.remove('show');
    document.body.style.overflow = '';
    burger.setAttribute('aria-expanded', 'false');
    const spans = burger.querySelectorAll('span');
    spans[0].style.transform = '';
    spans[1].style.opacity = '';
    spans[2].style.transform = '';
  };

  burger.addEventListener('click', () => {
    if (links.classList.contains('open')) {
      close();
    } else {
      open();
      const spans = burger.querySelectorAll('span');
      spans[0].style.transform = 'translateY(7px) rotate(45deg)';
      spans[1].style.opacity = '0';
      spans[2].style.transform = 'translateY(-7px) rotate(-45deg)';
    }
  });

  overlay && overlay.addEventListener('click', close);
  links.querySelectorAll('a').forEach(a => a.addEventListener('click', close));
})();

/* =========================================
   SCROLL REVEAL
   ========================================= */
(function () {
  const els = document.querySelectorAll('.reveal');
  if (!els.length) return;
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('in-view');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.1 });
  els.forEach(el => io.observe(el));
})();

/* =========================================
   ACCORDION
   ========================================= */
(function () {
  document.querySelectorAll('.accordion-btn').forEach(btn => {
    btn.addEventListener('click', function () {
      const item = this.closest('.accordion-item');
      const body = item.querySelector('.accordion-body');
      const inner = body.querySelector('.accordion-body-inner');
      const isOpen = item.classList.contains('active');

      const allItems = item.closest('.accordion').querySelectorAll('.accordion-item');
      allItems.forEach(i => {
        if (i !== item) {
          i.classList.remove('active');
          i.querySelector('.accordion-body').style.maxHeight = '';
        }
      });

      if (isOpen) {
        item.classList.remove('active');
        body.style.maxHeight = '';
      } else {
        item.classList.add('active');
        body.style.maxHeight = inner.scrollHeight + 48 + 'px';
      }
    });
  });

  document.querySelectorAll('.faq-btn').forEach(btn => {
    btn.addEventListener('click', function () {
      const item = this.closest('.faq-item');
      const answer = item.querySelector('.faq-answer');
      const inner = answer.querySelector('.faq-answer-inner');
      const isOpen = item.classList.contains('active');

      document.querySelectorAll('.faq-item.active').forEach(i => {
        if (i !== item) {
          i.classList.remove('active');
          i.querySelector('.faq-answer').style.maxHeight = '';
        }
      });

      if (isOpen) {
        item.classList.remove('active');
        answer.style.maxHeight = '';
      } else {
        item.classList.add('active');
        answer.style.maxHeight = inner.scrollHeight + 'px';
      }
    });
  });
})();

/* =========================================
   GALLERY LIGHTBOX
   ========================================= */
(function () {
  const lightbox = document.getElementById('lightbox');
  if (!lightbox) return;
  const lbImg = lightbox.querySelector('.lightbox-img');
  const closeBtn = lightbox.querySelector('.lightbox-close');
  const prevBtn = lightbox.querySelector('.lightbox-prev');
  const nextBtn = lightbox.querySelector('.lightbox-next');
  let items = [], currentIdx = 0;

  const open = (idx) => {
    currentIdx = idx;
    lbImg.src = items[idx];
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
  };
  const close = () => {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
  };
  const prev = () => { currentIdx = (currentIdx - 1 + items.length) % items.length; lbImg.src = items[currentIdx]; };
  const next = () => { currentIdx = (currentIdx + 1) % items.length; lbImg.src = items[currentIdx]; };

  closeBtn && closeBtn.addEventListener('click', close);
  prevBtn && prevBtn.addEventListener('click', prev);
  nextBtn && nextBtn.addEventListener('click', next);
  lightbox.addEventListener('click', e => { if (e.target === lightbox) close(); });
  document.addEventListener('keydown', e => {
    if (!lightbox.classList.contains('active')) return;
    if (e.key === 'Escape') close();
    if (e.key === 'ArrowLeft') prev();
    if (e.key === 'ArrowRight') next();
  });

  document.querySelectorAll('[data-lightbox]').forEach((el, i) => {
    items.push(el.dataset.lightbox || el.querySelector('img')?.src || el.src);
    el.style.cursor = 'pointer';
    el.addEventListener('click', () => open(i));
  });
})();

/* =========================================
   GALLERY FILTER
   ========================================= */
(function () {
  const btns = document.querySelectorAll('.filter-btn');
  const items = document.querySelectorAll('.gm-item');
  if (!btns.length) return;

  btns.forEach(btn => {
    btn.addEventListener('click', function () {
      btns.forEach(b => b.classList.remove('active'));
      this.classList.add('active');
      const filter = this.dataset.filter;
      items.forEach(item => {
        item.style.display = (filter === 'all' || item.dataset.cat === filter) ? '' : 'none';
      });
    });
  });
})();

/* =========================================
   CONTACT FORM
   ========================================= */
(function () {
  const form = document.getElementById('contactForm');
  if (!form) return;
  const success = form.querySelector('.form-success');

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    const btn = form.querySelector('button[type="submit"]');
    btn.textContent = 'Sending...';
    btn.disabled = true;

    setTimeout(() => {
      btn.textContent = 'Message Sent!';
      if (success) success.style.display = 'block';
      form.reset();
      setTimeout(() => {
        btn.textContent = 'Send Message';
        btn.disabled = false;
        if (success) success.style.display = 'none';
      }, 4000);
    }, 1400);
  });
})();

/* =========================================
   ACTIVE NAV LINK
   ========================================= */
(function () {
  const path = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(a => {
    const href = a.getAttribute('href');
    if (href === path || (path === '' && href === 'index.html')) {
      a.classList.add('active');
    }
  });
})();

/* =========================================
   ANCHOR SMOOTH SCROLL
   ========================================= */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

/* =========================================
   COUNTER ANIMATION
   ========================================= */
(function () {
  const counters = document.querySelectorAll('[data-count]');
  if (!counters.length) return;
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const el = e.target;
      const target = parseInt(el.dataset.count, 10);
      let start = 0;
      const duration = 1600;
      const step = (timestamp) => {
        if (!start) start = timestamp;
        const progress = Math.min((timestamp - start) / duration, 1);
        const ease = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.floor(ease * target);
        if (progress < 1) requestAnimationFrame(step);
        else el.textContent = target;
      };
      requestAnimationFrame(step);
      io.unobserve(el);
    });
  }, { threshold: 0.5 });
  counters.forEach(c => io.observe(c));
})();

/* =========================================
   INLINE SECTION NAV (FIXED SCROLL JITTER)
   ========================================= */
(function () {
  const inlineNav = document.querySelector('.inline-nav-list');
  if (!inlineNav) return;

  const sections = document.querySelectorAll('section[id]');
  const links = inlineNav.querySelectorAll('a');

  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        links.forEach(l => l.classList.remove('active'));
        const active = inlineNav.querySelector(`a[href="#${e.target.id}"]`);
        if (active) {
          active.classList.add('active');
          
          // FIX: Safely scroll only the horizontal axis to prevent vertical scroll fighting
          inlineNav.scrollTo({
            left: active.offsetLeft - (inlineNav.clientWidth / 2) + (active.clientWidth / 2),
            behavior: 'smooth'
          });
        }
      }
    });
  }, { threshold: 0.25, rootMargin: '-60px 0px -60px 0px' });

  sections.forEach(s => io.observe(s));
})();