/* ============================================================
   TensionFreez Solar Solutions — Main JS
   ============================================================ */

// ── DOM Refs ─────────────────────────────────────────────────
const header       = document.getElementById('site-header');
const nav          = document.getElementById('site-nav');
const menuToggle   = document.getElementById('menu-toggle');
const heroParticles= document.getElementById('hero-particles');
const heroScroll   = document.getElementById('hero-scroll');
const yearNodes    = document.querySelectorAll('[data-year]');
const countNodes   = document.querySelectorAll('[data-count]');
const revealNodes  = document.querySelectorAll('[data-reveal]');
const reviewForm   = document.querySelector('[data-review-form]');
const reviewList   = document.querySelector('[data-review-list]');
const reviewStatus = document.querySelector('[data-review-status]');
const inquiryForm  = document.querySelector('[data-inquiry-form]');
const inquiryStatus= document.querySelector('[data-inquiry-status]');
const interestField= document.querySelector('[data-interest-field]');
const packageLink  = document.querySelector('[data-package-link]');
const lightbox     = document.getElementById('lightbox');
const lightboxImg  = document.getElementById('lightbox-img');
const lightboxClose= document.getElementById('lightbox-close');

const workDescriptions = [
  'Clean on-grid rooftop setup for dependable daytime savings and smoother net-metering readiness.',
  'Elevated solar structure designed to improve panel angle, airflow, and long-term rooftop performance.',
  'Compact residential installation planned for efficient generation, tidy wiring, and easy maintenance access.',
  'Tilt-frame rooftop system optimized for stronger sunlight capture and a neat, professional finish.',
];

// ── Package URL map ───────────────────────────────────────────
const packageLinks = {
  'Urban Saver 2kW'       : 'packages.html#urban-saver-2kw',
  'Family Plus 3kW'       : 'packages.html#family-plus-3kw',
  'Premium Home 3.3kW'    : 'packages.html#premium-home-33kw',
  'Commercial Edge 4kW'   : 'packages.html#commercial-edge-4kw',
  'Power Max 5kW'         : 'packages.html#power-max-5kw',
  'Custom Solar Package'  : 'packages.html#custom-solar-package',
};

// ── Year ─────────────────────────────────────────────────────
yearNodes.forEach(n => { n.textContent = new Date().getFullYear(); });

// ── Scroll — header shadow ────────────────────────────────────
window.addEventListener('scroll', () => {
  if (!header) return;
  header.classList.toggle('scrolled', window.scrollY > 40);
}, { passive: true });

// ── Mobile nav ────────────────────────────────────────────────
if (menuToggle && nav) {
  menuToggle.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    menuToggle.setAttribute('aria-expanded', String(open));
    menuToggle.querySelectorAll('span').forEach((s, i) => {
      if (open) {
        if (i === 0) s.style.transform = 'rotate(45deg) translate(5px, 5px)';
        if (i === 1) s.style.opacity = '0';
        if (i === 2) s.style.transform = 'rotate(-45deg) translate(5px, -5px)';
      } else {
        s.style.transform = '';
        s.style.opacity = '';
      }
    });
  });
  nav.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      nav.classList.remove('open');
      menuToggle.setAttribute('aria-expanded', 'false');
      menuToggle.querySelectorAll('span').forEach(s => {
        s.style.transform = '';
        s.style.opacity = '';
      });
    });
  });
}

// ── Smooth hero scroll hint ───────────────────────────────────
if (heroScroll) {
  heroScroll.addEventListener('click', () => {
    window.scrollBy({ top: window.innerHeight, behavior: 'smooth' });
  });
}

// ── Hero particles ────────────────────────────────────────────
function createParticles() {
  if (!heroParticles) return;
  const count = window.innerWidth < 720 ? 12 : 24;
  const frag = document.createDocumentFragment();
  for (let i = 0; i < count; i++) {
    const p = document.createElement('span');
    const size = Math.random() * 5 + 2;
    p.className = 'p-dot';
    p.style.cssText = `
      left: ${Math.random() * 100}%;
      bottom: -20px;
      width: ${size}px;
      height: ${size}px;
      opacity: ${Math.random() * 0.5 + 0.2};
      animation-duration: ${Math.random() * 12 + 10}s;
      animation-delay: ${Math.random() * 8}s;
    `;
    frag.appendChild(p);
  }
  heroParticles.appendChild(frag);
}
createParticles();

// ── Animated counter ─────────────────────────────────────────
function animateCount(node) {
  if (node.dataset.countDone) return;
  node.dataset.countDone = '1';
  const target = Number(node.dataset.count);
  if (!target) return;
  const duration = 1600;
  const start = performance.now();
  function tick(now) {
    const t = Math.min((now - start) / duration, 1);
    const ease = 1 - Math.pow(1 - t, 3);
    node.textContent = Math.round(target * ease);
    if (t < 1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}

// ── Reveal on scroll ─────────────────────────────────────────
if (revealNodes.length) {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        entry.target.querySelectorAll('[data-count]').forEach(animateCount);
        if (entry.target.matches('[data-count]')) animateCount(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  revealNodes.forEach((node, i) => {
    // stagger children of the same parent
    const siblings = node.parentElement.querySelectorAll('[data-reveal]');
    if (siblings.length > 1) {
      Array.from(siblings).forEach((sib, si) => {
        sib.classList.add(`reveal-d${Math.min(si + 1, 5)}`);
      });
    }
    observer.observe(node);
  });
}

// ── Lightbox ─────────────────────────────────────────────────
function openLightbox(src, alt) {
  if (!lightbox || !lightboxImg) return;
  lightboxImg.src = src;
  lightboxImg.alt = alt || '';
  lightbox.classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeLightbox() {
  if (!lightbox) return;
  lightbox.classList.remove('open');
  document.body.style.overflow = '';
}

document.querySelectorAll('[data-lightbox]').forEach(el => {
  el.addEventListener('click', () => openLightbox(el.dataset.lightbox, el.querySelector('img')?.alt));
  el.addEventListener('keydown', e => { if (e.key === 'Enter') openLightbox(el.dataset.lightbox, el.querySelector('img')?.alt); });
  el.setAttribute('tabindex', '0');
  el.style.cursor = 'zoom-in';
});

document.querySelectorAll('.work-item').forEach(el => {
  el.addEventListener('click', () => {
    const img = el.querySelector('img');
    if (img) openLightbox(img.src, img.alt);
  });
});

if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
if (lightbox) {
  lightbox.addEventListener('click', e => { if (e.target === lightbox) closeLightbox(); });
}
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeLightbox(); });

document.querySelectorAll('.work-full-overlay p').forEach((node, index) => {
  if (workDescriptions[index]) node.textContent = workDescriptions[index];
});

// ── Reviews — data ────────────────────────────────────────────
const defaultReviews = [
  { name: 'Ravi Sharma', location: 'Lucknow', rating: 5, message: 'Very smooth installation and the team explained subsidy, net metering, and maintenance clearly. Our power bill dropped in the first month itself.' },
  { name: 'Neha Verma', location: 'Kanpur', rating: 5, message: 'TensionFreez handled everything from site visit to final setup. The system looks clean and the after-sales support has been excellent.' },
  { name: 'Amaan Khan', location: 'Noida', rating: 4, message: 'Good service and fast updates on each step. They helped us choose the right package for our office and completed the work on schedule.' },
];

function cleanReview(r) {
  const n = v => String(v || '').trim().toLowerCase();
  return n(r.name) === 'ishan sahu' && n(r.location) === 'agra' && n(r.message) === 'best';
}

function loadReviews() {
  try {
    const stored = localStorage.getItem('tfss-reviews');
    if (!stored) {
      localStorage.setItem('tfss-reviews', JSON.stringify(defaultReviews));
      return [...defaultReviews];
    }
    const list = JSON.parse(stored).filter(r => !cleanReview(r));
    return list;
  } catch { return [...defaultReviews]; }
}

function saveReviews(list) {
  try { localStorage.setItem('tfss-reviews', JSON.stringify(list)); } catch {}
}

function renderReviews() {
  if (!reviewList) return;
  const list = loadReviews();
  reviewList.innerHTML = list.slice().reverse().map(r => {
    const stars = '★'.repeat(r.rating) + '☆'.repeat(5 - r.rating);
    return `
      <article class="review-card revealed">
        <div class="stars">${stars}</div>
        <h3>${escHtml(r.name)}</h3>
        <p class="review-meta">${escHtml(r.location)}</p>
        <p>${escHtml(r.message)}</p>
      </article>`;
  }).join('');
}

function escHtml(s) {
  return String(s).replace(/[&<>"']/g, m => ({
    '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'
  })[m]);
}

if (reviewList) renderReviews();

if (reviewForm) {
  reviewForm.addEventListener('submit', e => {
    e.preventDefault();
    const fd = new FormData(reviewForm);
    const r = {
      name: String(fd.get('name') || '').trim(),
      location: String(fd.get('location') || '').trim(),
      rating: Number(fd.get('rating') || 5),
      message: String(fd.get('message') || '').trim(),
    };
    if (!r.name || !r.location || !r.message) {
      if (reviewStatus) reviewStatus.textContent = 'Please fill in your name, city, and review.';
      return;
    }
    const list = loadReviews();
    list.push(r);
    saveReviews(list);
    renderReviews();
    reviewForm.reset();
    if (reviewStatus) reviewStatus.textContent = '✓ Thank you! Your review has been added.';
    setTimeout(() => { if (reviewStatus) reviewStatus.textContent = ''; }, 4000);
  });
}

// ── Contact form — package interest ──────────────────────────
function updatePackageLink() {
  if (!packageLink || !interestField) return;
  const val = String(interestField.value || '').trim();
  packageLink.href = packageLinks[val] || 'packages.html';
  packageLink.style.opacity = val ? '1' : '0.5';
}

function setInterestFromQuery() {
  if (!interestField) return;
  const params = new URLSearchParams(window.location.search);
  const pkg = params.get('package');
  const svc = params.get('service');

  // remove dynamic options
  Array.from(interestField.querySelectorAll('[data-dynamic]')).forEach(o => o.remove());

  if (pkg && interestField.querySelector(`option[value="${pkg}"]`)) {
    interestField.value = pkg;
  } else if (svc) {
    const opt = document.createElement('option');
    opt.value = svc;
    opt.textContent = svc;
    opt.setAttribute('data-dynamic', '1');
    interestField.appendChild(opt);
    interestField.value = svc;
  }
  updatePackageLink();
}

if (interestField) {
  setInterestFromQuery();
  interestField.addEventListener('change', updatePackageLink);
}

// ── Inquiry form — WhatsApp ───────────────────────────────────
function buildMessage(fd) {
  const get = k => String(fd.get(k) || '').trim();
  return [
    '🌞 *New Solar Inquiry — TensionFreez*',
    '',
    `👤 *Name:* ${get('name') || 'Not provided'}`,
    `📞 *Phone:* ${get('phone') || 'Not provided'}`,
    `✉️ *Email:* ${get('email') || 'Not provided'}`,
    `🏠 *Property Type:* ${get('property') || 'Not provided'}`,
    `📦 *Package Interest:* ${get('interest') || 'Not specified'}`,
    `💬 *Message:* ${get('message') || 'No message'}`,
  ].join('\n');
}

function buildWhatsAppMessage(fd) {
  const get = k => String(fd.get(k) || '').trim();
  return [
    '*New Solar Inquiry - TensionFreez*',
    '',
    `*Name:* ${get('name') || 'Not provided'}`,
    `*Phone:* ${get('phone') || 'Not provided'}`,
    `*Email:* ${get('email') || 'Not provided'}`,
    `*Property Type:* ${get('property') || 'Not provided'}`,
    `*Package Interest:* ${get('interest') || 'Not specified'}`,
    `*Message:* ${get('message') || 'No message'}`,
  ].join('\n');
}

if (inquiryForm) {
  inquiryForm.addEventListener('submit', e => {
    e.preventDefault();
    const fd = new FormData(inquiryForm);
    const msg = buildWhatsAppMessage(fd);
    const url = `https://wa.me/9369956944?text=${encodeURIComponent(msg)}`;
    window.location.href = url;
  });
}

// ── Stagger grid items ────────────────────────────────────────
['.svc-card', '.pkg-card', '.process-card', '.value-card', '.testi-card', '.work-full-item'].forEach(sel => {
  document.querySelectorAll(sel).forEach((el, i) => {
    if (!el.hasAttribute('data-reveal')) {
      el.setAttribute('data-reveal', i % 3 === 0 ? 'left' : i % 3 === 2 ? 'right' : '');
    }
  });
});

// -- Homepage Jotform agent: keep mobile chat docked bottom-left -----------
const mobileJotformManagedNodes = new Set();
const mobileJotformManagedProps = [
  'position',
  'left',
  'right',
  'bottom',
  'top',
  'inset',
  'width',
  'max-width',
  'height',
  'max-height',
  'transform',
  'margin',
  'border-radius',
  'overflow',
  'z-index',
  'box-shadow',
  'touch-action',
];
let mobileJotformDockTimer = null;
let mobileJotformScrollLockY = 0;
let mobileJotformGlobalTouchGuardReady = false;

function clearManagedJotformNode(node) {
  if (!node) return;
  mobileJotformManagedProps.forEach(prop => node.style.removeProperty(prop));
  node.classList.remove('mobile-jotform-docked');
}

function resetDockedJotformAgentMobile() {
  mobileJotformManagedNodes.forEach(node => clearManagedJotformNode(node));
  mobileJotformManagedNodes.clear();
  unlockMobileJotformPageScroll();
}

function lockMobileJotformPageScroll() {
  if (window.innerWidth > 480) return;
  if (document.body.dataset.jotformPageLocked === '1') return;

  mobileJotformScrollLockY = window.scrollY;
  document.documentElement.classList.add('jotform-chat-open-mobile');
  document.body.classList.add('jotform-chat-open-mobile');
  document.body.dataset.jotformPageLocked = '1';
  document.body.dataset.jotformPrevPosition = document.body.style.position || '';
  document.body.dataset.jotformPrevTop = document.body.style.top || '';
  document.body.dataset.jotformPrevWidth = document.body.style.width || '';
  document.body.dataset.jotformPrevLeft = document.body.style.left || '';
  document.body.dataset.jotformPrevRight = document.body.style.right || '';

  document.body.style.position = 'fixed';
  document.body.style.top = `-${mobileJotformScrollLockY}px`;
  document.body.style.left = '0';
  document.body.style.right = '0';
  document.body.style.width = '100%';
}

function unlockMobileJotformPageScroll() {
  if (document.body.dataset.jotformPageLocked !== '1') return;

  document.documentElement.classList.remove('jotform-chat-open-mobile');
  document.body.classList.remove('jotform-chat-open-mobile');
  document.body.style.position = document.body.dataset.jotformPrevPosition || '';
  document.body.style.top = document.body.dataset.jotformPrevTop || '';
  document.body.style.width = document.body.dataset.jotformPrevWidth || '';
  document.body.style.left = document.body.dataset.jotformPrevLeft || '';
  document.body.style.right = document.body.dataset.jotformPrevRight || '';

  delete document.body.dataset.jotformPageLocked;
  delete document.body.dataset.jotformPrevPosition;
  delete document.body.dataset.jotformPrevTop;
  delete document.body.dataset.jotformPrevWidth;
  delete document.body.dataset.jotformPrevLeft;
  delete document.body.dataset.jotformPrevRight;

  window.scrollTo(0, mobileJotformScrollLockY);
}

function isVisibleMobileJotformPanel(node) {
  if (!node || node.nodeType !== 1) return false;

  const style = window.getComputedStyle(node);
  if (style.position !== 'fixed' && style.position !== 'absolute') return false;
  if (style.display === 'none' || style.visibility === 'hidden' || Number(style.opacity || '1') === 0) return false;

  const rect = node.getBoundingClientRect();
  if (rect.width < Math.min(240, window.innerWidth * 0.62) || rect.height < 190) return false;

  const text = (node.textContent || '').replace(/\s+/g, ' ').trim();
  const hasOpenUiText = /Type here|Powered by|History|Voice|Call Start|Call End/i.test(text);
  const hasBrandText = /Jotform AI|Solar Consultant/i.test(text);

  return hasOpenUiText || (hasBrandText && rect.width > 240 && rect.height > 220);
}

function getActiveMobileJotformPanels() {
  return Array.from(document.querySelectorAll('body *')).filter(isVisibleMobileJotformPanel);
}

function getClosestScrollableJotformArea(startNode, panel) {
  let current = startNode instanceof Element ? startNode : null;

  while (current && current !== panel) {
    const style = window.getComputedStyle(current);
    const canScroll =
      current.scrollHeight > current.clientHeight + 6 &&
      (/(auto|scroll)/i.test(style.overflowY) || current.scrollHeight > current.clientHeight + 20);

    if (canScroll) return current;
    current = current.parentElement;
  }

  if (panel && panel.scrollHeight > panel.clientHeight + 6) {
    return panel;
  }

  return null;
}

function dockJotformAgentMobile() {
  if (!document.body.classList.contains('home-page')) return;

  if (window.innerWidth > 480) {
    resetDockedJotformAgentMobile();
    return;
  }

  const clamp = (value, min, max) => Math.min(Math.max(value, min), max);
  const activePanels = getActiveMobileJotformPanels();
  const activePanelSet = new Set(activePanels);

  mobileJotformManagedNodes.forEach(node => {
    if (!activePanelSet.has(node) || !node.isConnected || !isVisibleMobileJotformPanel(node)) {
      clearManagedJotformNode(node);
      mobileJotformManagedNodes.delete(node);
    }
  });

  const applyImportantStyles = (node, styles) => {
    if (!node) return;
    Object.entries(styles).forEach(([prop, value]) => {
      node.style.setProperty(prop, value, 'important');
    });
    node.classList.add('mobile-jotform-docked');
    mobileJotformManagedNodes.add(node);
  };

  const applyDock = node => {
    if (!node) return;

    applyImportantStyles(node, {
      position: 'fixed',
      width: 'min(320px, calc(100vw - 20px))',
      'max-width': 'calc(100vw - 20px)',
      height: 'min(54vh, 430px)',
      'max-height': 'min(54vh, 430px)',
      transform: 'none',
      margin: '0',
      'border-radius': '18px',
      overflow: 'hidden',
      'z-index': '9999',
      'box-shadow': '0 18px 42px rgba(7, 27, 18, 0.24)',
      'touch-action': 'auto',
    });

    const moved = node.dataset.mobileDockMoved === '1';
    if (moved) {
      const rect = node.getBoundingClientRect();
      const maxLeft = Math.max(8, window.innerWidth - rect.width - 8);
      const maxTop = Math.max(8, window.innerHeight - rect.height - 8);
      const left = clamp(parseFloat(node.dataset.mobileDockLeft || '12'), 8, maxLeft);
      const top = clamp(parseFloat(node.dataset.mobileDockTop || `${window.innerHeight - rect.height - 12}`), 8, maxTop);

      applyImportantStyles(node, {
        left: `${left}px`,
        top: `${top}px`,
        right: 'auto',
        bottom: 'auto',
        inset: 'auto auto auto auto',
      });
      return;
    }

    applyImportantStyles(node, {
      left: '12px',
      right: 'auto',
      bottom: '12px',
      top: 'auto',
      inset: 'auto auto 12px 12px',
    });
  };

  const enhanceScrollableAreas = node => {
    if (!node) return;

    node.querySelectorAll('*').forEach(child => {
      const style = window.getComputedStyle(child);
      const isScrollable =
        /(auto|scroll)/i.test(style.overflowY) ||
        child.scrollHeight > child.clientHeight + 20;

      if (!isScrollable || child.clientHeight < 80) return;

      child.style.setProperty('overscroll-behavior', 'contain', 'important');
      child.style.setProperty('-webkit-overflow-scrolling', 'touch');
    });
  };

  const makeAdjustable = node => {
    if (!node || node.dataset.mobileDockReady) return;
    node.dataset.mobileDockReady = '1';

    let activePointerId = null;
    let startX = 0;
    let startY = 0;
    let startLeft = 12;
    let startTop = 12;

    const pointerMove = event => {
      if (event.pointerId !== activePointerId) return;

      const maxLeft = Math.max(8, window.innerWidth - node.offsetWidth - 8);
      const maxTop = Math.max(8, window.innerHeight - node.offsetHeight - 8);
      const nextLeft = clamp(startLeft + (event.clientX - startX), 8, maxLeft);
      const nextTop = clamp(startTop + (event.clientY - startY), 8, maxTop);

      node.dataset.mobileDockMoved = '1';
      node.dataset.mobileDockLeft = `${nextLeft}`;
      node.dataset.mobileDockTop = `${nextTop}`;

      applyImportantStyles(node, {
        left: `${nextLeft}px`,
        top: `${nextTop}px`,
        right: 'auto',
        bottom: 'auto',
        inset: 'auto auto auto auto',
      });

      event.preventDefault();
    };

    const pointerUp = event => {
      if (event.pointerId !== activePointerId) return;
      activePointerId = null;
      window.removeEventListener('pointermove', pointerMove);
      window.removeEventListener('pointerup', pointerUp);
      window.removeEventListener('pointercancel', pointerUp);
    };

    const pointerDown = event => {
      if (window.innerWidth > 480) return;

      const interactiveTarget = event.target.closest('button, a, input, textarea, select, label');
      if (interactiveTarget) return;

      const rect = node.getBoundingClientRect();
      const inHeaderBand = event.clientY <= rect.top + Math.min(76, rect.height * 0.2);
      const onCloseSide = event.clientX >= rect.right - 84;
      if (!inHeaderBand || onCloseSide) return;

      activePointerId = event.pointerId;
      startX = event.clientX;
      startY = event.clientY;
      startLeft = rect.left;
      startTop = rect.top;

      window.addEventListener('pointermove', pointerMove, { passive: false });
      window.addEventListener('pointerup', pointerUp, { passive: true });
      window.addEventListener('pointercancel', pointerUp, { passive: true });
    };

    node.addEventListener('pointerdown', pointerDown);
  };

  const trapTouchScroll = node => {
    if (!node || node.dataset.mobileTouchTrapReady) return;
    node.dataset.mobileTouchTrapReady = '1';

    let startY = 0;

    node.addEventListener('touchstart', event => {
      if (window.innerWidth > 480 || event.touches.length !== 1) return;
      startY = event.touches[0].clientY;
    }, { passive: true });

    node.addEventListener('touchmove', event => {
      if (window.innerWidth > 480 || event.touches.length !== 1) return;

      const touch = event.touches[0];
      const rect = node.getBoundingClientRect();
      const inHeaderBand = touch.clientY <= rect.top + Math.min(76, rect.height * 0.2);
      const onCloseSide = touch.clientX >= rect.right - 84;
      if (inHeaderBand && !onCloseSide) return;

      const scrollable = getClosestScrollableJotformArea(event.target, node);
      if (!scrollable) {
        event.preventDefault();
        return;
      }

      const deltaY = touch.clientY - startY;
      const atTop = scrollable.scrollTop <= 0;
      const atBottom = scrollable.scrollTop + scrollable.clientHeight >= scrollable.scrollHeight - 1;

      if ((atTop && deltaY > 0) || (atBottom && deltaY < 0)) {
        event.preventDefault();
      }
    }, { passive: false });
  };

  activePanels.forEach(node => {
    applyDock(node);
    enhanceScrollableAreas(node);
    makeAdjustable(node);
    trapTouchScroll(node);
  });

  if (activePanels.length) {
    lockMobileJotformPageScroll();
  } else {
    unlockMobileJotformPageScroll();
  }
}

function scheduleDockJotformAgentMobile() {
  window.clearTimeout(mobileJotformDockTimer);
  mobileJotformDockTimer = window.setTimeout(dockJotformAgentMobile, 120);
}

function installGlobalMobileJotformTouchGuard() {
  if (mobileJotformGlobalTouchGuardReady) return;
  mobileJotformGlobalTouchGuardReady = true;

  document.addEventListener('touchmove', event => {
    if (window.innerWidth > 480) return;
    if (document.body.dataset.jotformPageLocked !== '1') return;

    const target = event.target instanceof Element ? event.target : null;
    const activePanels = getActiveMobileJotformPanels();
    const insideActivePanel = target && activePanels.some(panel => panel.contains(target));

    if (!insideActivePanel) {
      event.preventDefault();
    }
  }, { passive: false });
}

if (document.body.classList.contains('home-page')) {
  installGlobalMobileJotformTouchGuard();
  const jotformObserver = new MutationObserver(() => scheduleDockJotformAgentMobile());
  jotformObserver.observe(document.body, { childList: true, subtree: true });
  window.addEventListener('resize', scheduleDockJotformAgentMobile, { passive: true });
  window.addEventListener('load', () => {
    scheduleDockJotformAgentMobile();
    setTimeout(scheduleDockJotformAgentMobile, 800);
    setTimeout(scheduleDockJotformAgentMobile, 1800);
  });
}
