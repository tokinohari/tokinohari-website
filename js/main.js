/* TOKINOHARI — main.js */

// ── Header scroll
const header = document.getElementById('header');
window.addEventListener('scroll', () => {
  header.classList.toggle('scrolled', window.scrollY > 60);
}, { passive: true });

// ── Hamburger menu
const hamburger = document.getElementById('hamburger');
const navSp = document.getElementById('navSp');

hamburger?.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  navSp.classList.toggle('open');
  document.body.style.overflow = navSp.classList.contains('open') ? 'hidden' : '';
});

document.querySelectorAll('.sp-link').forEach(link => {
  link.addEventListener('click', () => {
    hamburger?.classList.remove('open');
    navSp?.classList.remove('open');
    document.body.style.overflow = '';
  });
});

// ── Smooth scroll
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', e => {
    const href = anchor.getAttribute('href');
    if (href === '#') return;
    const target = document.querySelector(href);
    if (!target) return;
    e.preventDefault();
    const offset = 72;
    const top = target.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});

// ── Reveal on scroll (staggered)
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.08, rootMargin: '0px 0px -48px 0px' });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

// ── Stagger children
document.querySelectorAll('[data-stagger]').forEach(parent => {
  const children = parent.children;
  Array.from(children).forEach((child, i) => {
    child.classList.add('reveal');
    child.style.transitionDelay = `${i * 0.1}s`;
    revealObserver.observe(child);
  });
});

// ── Hero image load animation
const heroImg = document.querySelector('.hero-image');
if (heroImg) {
  if (heroImg.complete) {
    heroImg.classList.add('loaded');
  } else {
    heroImg.addEventListener('load', () => heroImg.classList.add('loaded'));
  }
}

// ── Parallax (subtle, performance-aware)
let ticking = false;
const heroRight = document.querySelector('.hero-right');

if (heroRight && window.innerWidth > 768) {
  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        const scrollY = window.scrollY;
        const img = heroRight.querySelector('.hero-image');
        if (img && scrollY < window.innerHeight) {
          img.style.transform = `scale(1) translateY(${scrollY * 0.12}px)`;
        }
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });
}

// ── Number counter animation
function animateCounter(el) {
  const target = parseFloat(el.dataset.target);
  const isDecimal = el.dataset.target.includes('.');
  const duration = 1800;
  const start = performance.now();

  const update = (now) => {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = target * eased;

    el.textContent = isDecimal
      ? current.toFixed(2)
      : Math.floor(current).toString();

    if (progress < 1) requestAnimationFrame(update);
    else el.textContent = isDecimal ? target.toFixed(2) : target.toString();
  };

  requestAnimationFrame(update);
}

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateCounter(entry.target);
      counterObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('[data-target]').forEach(el => counterObserver.observe(el));

// ── Duplicate ticker for seamless loop
const tickerInner = document.querySelector('.ticker-inner');
if (tickerInner) {
  tickerInner.innerHTML += tickerInner.innerHTML;
}
