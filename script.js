/* ═══════════════════════════════════════════
   INTRO OVERLAY / LOADER
═══════════════════════════════════════════ */
function startIntroOrLoader() {
  const intro = document.getElementById('intro-overlay');
  const introLeft = document.getElementById('intro-left');
  const introRight = document.getElementById('intro-right');
  const introContent = document.getElementById('intro-content');
  const introNameEl = document.getElementById('intro-name-el');

  // If we have the intro overlay, use it as the transition
  if (intro && introLeft && introRight) {
    document.body.style.overflow = 'hidden';

    if (introNameEl) {
      const name = 'Ashley Lim';
      let i = 0;
      const tick = () => {
        introNameEl.textContent = name.slice(0, i);
        i += 1;
        if (i <= name.length) requestAnimationFrame(tick);
      };
      tick();
    }

    window.setTimeout(() => {
      introLeft.classList.add('open');
      introRight.classList.add('open');
      if (introContent) introContent.classList.add('fade');

      window.setTimeout(() => {
        intro.classList.add('gone');
        document.body.style.overflow = '';
        startCounters();
      }, 1100);
    }, 900);

    return;
  }

  // Fallback: old loader (if present)
  const loader = document.getElementById('loader');
  if (loader) {
    document.body.style.overflow = 'hidden';
    window.setTimeout(() => {
      loader.classList.add('gone');
      document.body.style.overflow = '';
      startCounters();
    }, 1500);
    return;
  }

  document.body.style.overflow = '';
  startCounters();
}

window.addEventListener('load', startIntroOrLoader);

/* ═══════════════════════════════════════════
   CURSOR GLOW (desktop only)
═══════════════════════════════════════════ */
const glow = document.getElementById('cursor-glow');
if (window.innerWidth > 768) {
  document.addEventListener('mousemove', e => {
    glow.style.left = e.clientX + 'px';
    glow.style.top  = e.clientY + 'px';
  });
} else {
  glow.style.display = 'none';
}

/* ═══════════════════════════════════════════
   PARTICLE CANVAS
═══════════════════════════════════════════ */
(function initParticles() {
  const canvas = document.getElementById('particle-canvas');
  const ctx    = canvas.getContext('2d');
  let W, H, particles;
  const COUNT   = 70;
  const MAX_DIST = 130;
  const isDark  = () => !document.body.classList.contains('light');

  function resize() {
    W = canvas.width  = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  }

  function makeParticle() {
    return {
      x:  Math.random() * W,
      y:  Math.random() * H,
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5,
      r:  Math.random() * 1.8 + 0.6,
    };
  }

  function init() {
    resize();
    particles = Array.from({ length: COUNT }, makeParticle);
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);
    const dotCol  = isDark() ? 'rgba(139,92,246,0.55)' : 'rgba(124,58,237,0.4)';
    const lineCol = isDark() ? 'rgba(0,212,255,'       : 'rgba(2,132,199,';

    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0) p.x = W; if (p.x > W) p.x = 0;
      if (p.y < 0) p.y = H; if (p.y > H) p.y = 0;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = dotCol;
      ctx.fill();

      for (let j = i + 1; j < particles.length; j++) {
        const q  = particles[j];
        const dx = p.x - q.x, dy = p.y - q.y;
        const d  = Math.sqrt(dx * dx + dy * dy);
        if (d < MAX_DIST) {
          const alpha = (1 - d / MAX_DIST) * 0.35;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y);
          ctx.strokeStyle = lineCol + alpha + ')';
          ctx.lineWidth   = 0.8;
          ctx.stroke();
        }
      }
    }
    requestAnimationFrame(draw);
  }

  window.addEventListener('resize', resize);
  init(); draw();
})();

/* ═══════════════════════════════════════════
   TYPEWRITER
═══════════════════════════════════════════ */
(function typewriter() {
  const el    = document.getElementById('tw-text');
  const words = [
    'ML models',
    'data pipelines',
    'LLM applications',
    'NLP solutions',
    'interactive dashboards',
    'data-driven strategies',
  ];
  let wi = 0, ci = 0, deleting = false;
  const TYPE_SPEED   = 80;
  const DELETE_SPEED = 45;
  const PAUSE        = 2200;

  function tick() {
    const word = words[wi];
    if (!deleting) {
      el.textContent = word.slice(0, ++ci);
      if (ci === word.length) { deleting = true; setTimeout(tick, PAUSE); return; }
    } else {
      el.textContent = word.slice(0, --ci);
      if (ci === 0) { deleting = false; wi = (wi + 1) % words.length; }
    }
    setTimeout(tick, deleting ? DELETE_SPEED : TYPE_SPEED);
  }
  setTimeout(tick, 1800);
})();

/* ═══════════════════════════════════════════
   STAT COUNTERS
═══════════════════════════════════════════ */
function startCounters() {
  document.querySelectorAll('.stat-num').forEach(el => {
    const target = +el.dataset.target;
    const dur    = 1800;
    const step   = 16;
    const inc    = target / (dur / step);
    let val = 0;
    const timer = setInterval(() => {
      val += inc;
      if (val >= target) { val = target; clearInterval(timer); }
      el.textContent = Math.floor(val);
    }, step);
  });
}

/* ═══════════════════════════════════════════
   SCROLL REVEAL
═══════════════════════════════════════════ */
const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      revealObserver.unobserve(e.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

/* ═══════════════════════════════════════════
   ACTIVE NAV LINK
═══════════════════════════════════════════ */
const sections  = document.querySelectorAll('section[id]');
const navAnchors = document.querySelectorAll('.nav-links a[data-section]');

const navObserver = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      navAnchors.forEach(a => {
        a.classList.toggle('active', a.dataset.section === e.target.id);
      });
    }
  });
}, { rootMargin: '-35% 0px -55% 0px' });

sections.forEach(s => navObserver.observe(s));

/* ═══════════════════════════════════════════
   SHOW MORE — CERTIFICATIONS
═══════════════════════════════════════════ */
(function initCertShowMore() {
  const grid   = document.getElementById('cert-grid');
  const btn    = document.getElementById('cert-show-more');
  if (!grid || !btn) return;

  const INITIAL = 8;
  const cards   = Array.from(grid.querySelectorAll('.cert-card'));

  // Hide cards beyond the initial count
  cards.forEach((c, i) => {
    if (i >= INITIAL) c.classList.add('cert-hidden');
  });

  // Update button label
  function updateBtn(expanded) {
    btn.querySelector('span').textContent = expanded ? 'Show less' : `Show ${cards.length - INITIAL} more`;
    btn.classList.toggle('expanded', expanded);
  }
  updateBtn(false);

  btn.addEventListener('click', () => {
    const expanding = btn.classList.contains('expanded') === false;
    cards.forEach((c, i) => {
      if (i < INITIAL) return;
      if (expanding) {
        c.classList.remove('cert-hidden');
        // Stagger fade-in
        c.style.opacity = '0';
        c.style.transform = 'translateY(12px)';
        requestAnimationFrame(() => {
          setTimeout(() => {
            c.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
            c.style.opacity = '1';
            c.style.transform = 'translateY(0)';
          }, (i - INITIAL) * 40);
        });
      } else {
        c.classList.add('cert-hidden');
        c.style.opacity = '';
        c.style.transform = '';
        c.style.transition = '';
      }
    });
    updateBtn(expanding);
    if (!expanding) {
      document.getElementById('certifications').scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
})();

/* ═══════════════════════════════════════════
   SHOW MORE — VOLUNTEERING
═══════════════════════════════════════════ */
(function initVolShowMore() {
  const grid = document.querySelector('.vol-grid');
  const btn  = document.getElementById('vol-show-more');
  if (!grid || !btn) return;

  const INITIAL = 3;
  const cards   = Array.from(grid.querySelectorAll('.vol-card'));
  const hidden  = cards.filter(c => c.classList.contains('vol-hidden'));

  function updateBtn(expanded) {
    btn.querySelector('span').textContent = expanded ? 'Show less' : `Show ${hidden.length} more`;
    btn.classList.toggle('expanded', expanded);
  }
  updateBtn(false);

  btn.addEventListener('click', () => {
    const expanding = !btn.classList.contains('expanded');
    hidden.forEach((c, i) => {
      if (expanding) {
        c.classList.remove('vol-hidden');
        c.style.opacity = '0';
        c.style.transform = 'translateY(12px)';
        requestAnimationFrame(() => {
          setTimeout(() => {
            c.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
            c.style.opacity = '1';
            c.style.transform = 'translateY(0)';
          }, i * 60);
        });
      } else {
        c.classList.add('vol-hidden');
        c.style.opacity = '';
        c.style.transform = '';
        c.style.transition = '';
      }
    });
    updateBtn(expanding);
    if (!expanding) {
      document.getElementById('volunteering').scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
})();

/* ═══════════════════════════════════════════
   CERTIFICATIONS FILTER
═══════════════════════════════════════════ */
document.querySelectorAll('.cf-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.cf-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const filter = btn.dataset.cf;

    document.querySelectorAll('.cert-card').forEach(card => {
      const match = filter === 'all' || card.dataset.cc === filter;
      if (match) {
        card.style.display = '';
        requestAnimationFrame(() => {
          card.style.opacity  = '1';
          card.style.transform = 'scale(1)';
        });
      } else {
        card.style.opacity  = '0';
        card.style.transform = 'scale(0.95)';
        setTimeout(() => { card.style.display = 'none'; }, 350);
      }
    });
  });
});

/* ═══════════════════════════════════════════
   THEME TOGGLE
═══════════════════════════════════════════ */
const themeBtn = document.getElementById('theme-toggle');
const themeIcon = themeBtn.querySelector('i');
let isLight = localStorage.getItem('theme') === 'light';

function applyTheme() {
  document.body.classList.toggle('light', isLight);
  themeIcon.className = isLight ? 'fas fa-moon' : 'fas fa-sun';
}
applyTheme();

themeBtn.addEventListener('click', () => {
  isLight = !isLight;
  localStorage.setItem('theme', isLight ? 'light' : 'dark');
  applyTheme();
});

/* ═══════════════════════════════════════════
   MOBILE MENU
═══════════════════════════════════════════ */
const burger     = document.getElementById('burger');
const mobileMenu = document.getElementById('mobile-menu');

burger.addEventListener('click', () => {
  const open = mobileMenu.classList.toggle('open');
  burger.classList.toggle('open', open);
});

mobileMenu.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => {
    mobileMenu.classList.remove('open');
    burger.classList.remove('open');
  });
});

/* ═══════════════════════════════════════════
   BACK TO TOP
═══════════════════════════════════════════ */
const btt = document.getElementById('back-to-top');
window.addEventListener('scroll', () => {
  btt.classList.toggle('visible', window.scrollY > 400);
});
btt.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

/* ═══════════════════════════════════════════
   NAVBAR BACKGROUND ON SCROLL
═══════════════════════════════════════════ */
const topbar = document.getElementById('topbar');
window.addEventListener('scroll', () => {
  topbar.style.borderBottomColor = window.scrollY > 20
    ? 'rgba(0,212,255,0.12)'
    : 'var(--border)';
});

/* ═══════════════════════════════════════════
   CLOSE MOBILE MENU ON NAV LINK CLICK
═══════════════════════════════════════════ */
document.querySelectorAll('.nav-links a').forEach(a => {
  a.addEventListener('click', () => {
    mobileMenu.classList.remove('open');
    burger.classList.remove('open');
  });
});


/* ═══════════════════════════════════════════
   GALLERY CAROUSEL (3D)
═══════════════════════════════════════════ */
(function initGalleryCarousel() {
  const track = document.getElementById('carousel-track');
  const viewport = document.getElementById('carousel-viewport');
  const dotsWrap = document.getElementById('carousel-dots');
  const prevBtn = document.getElementById('carousel-prev');
  const nextBtn = document.getElementById('carousel-next');

  if (!track || !dotsWrap) return;

  const gallery = [
    { src: "public/Faculty Banner.JPG", caption: "NUS Open House Banner" },
    { src: "public/Squash.jpg", caption: "NUS Squash IHG" },
    { src: "public/ASICS Tennis.JPG", caption: "ASICS Campus Advocate" },
    { src: "public/ASG.JPEG", caption: "ASEAN School Games Badminton" },
    { src: "public/Racketlon 2025.png", caption: "NUS Racketlon" },
    { src: "public/WUG 2023.JPEG", caption: "World University Games" }
  ];

  // Build DOM
  track.innerHTML = "";
  dotsWrap.innerHTML = "";

  gallery.forEach((item, idx) => {
    const card = document.createElement('div');
    card.className = 'carousel-item';
    card.dataset.idx = String(idx);

    const imgWrap = document.createElement('div');
    imgWrap.className = 'ci-img-wrap';

    const img = document.createElement('img');
    img.src = item.src;
    img.alt = item.caption;

    imgWrap.appendChild(img);

    const cap = document.createElement('div');
    cap.className = 'ci-caption';
    cap.textContent = item.caption;

    card.appendChild(imgWrap);
    card.appendChild(cap);

    card.addEventListener('click', () => {
      activeIndex = idx;
      render();
    });

    track.appendChild(card);

    const dot = document.createElement('button');
    dot.className = 'c-dot';
    dot.setAttribute('aria-label', `Go to image ${idx + 1}`);
    dot.addEventListener('click', () => {
      activeIndex = idx;
      render();
    });
    dotsWrap.appendChild(dot);
  });

  const items = Array.from(track.querySelectorAll('.carousel-item'));
  const dots  = Array.from(dotsWrap.querySelectorAll('.c-dot'));

  // Start with the "main trio" showing: Faculty (left), Squash (center), ASICS (right)
  let activeIndex = 1;

  function clampIndex(i) {
    const n = gallery.length;
    return (i % n + n) % n;
  }

  function getTuning() {
    const w = (viewport || track).clientWidth || window.innerWidth;
    const isMobile = w < 720;
    const spread = isMobile ? 42 : 48;               // degrees between cards
    const radius = isMobile ? 420 : Math.min(560, Math.max(440, w * 0.55)); // depth
    return { spread, radius, w, isMobile };
  }

  function render() {
    activeIndex = clampIndex(activeIndex);
    const { spread, radius } = getTuning();

    items.forEach((el, i) => {
      // wrap offsets so carousel feels circular
      let offset = i - activeIndex;
      const n = items.length;
      if (offset > n / 2) offset -= n;
      if (offset < -n / 2) offset += n;

      const angle = offset * spread;
      const rad = (angle * Math.PI) / 180;

      const x = Math.sin(rad) * (radius * 0.70);
      const z = Math.cos(rad) * radius;

      const scale = 1 - Math.min(0.12 * Math.abs(offset), 0.36);
      const rotY  = angle * -0.55;

      const opacity = 1 - Math.min(0.18 * Math.abs(offset), 0.70);

      el.style.transform = `translate(-50%, -50%) translateX(${x}px) translateZ(${z}px) rotateY(${rotY}deg) scale(${scale})`;
      el.style.opacity   = opacity.toFixed(3);
      el.style.filter    = `blur(${Math.min(2.2, Math.abs(offset) * 0.45)}px)`;
      el.style.zIndex    = String(1000 - Math.abs(offset) * 10);
      el.classList.toggle('active', i === activeIndex);
    });

    dots.forEach((d, i) => d.classList.toggle('active', i === activeIndex));
  }

  function next() { activeIndex += 1; render(); }
  function prev() { activeIndex -= 1; render(); }

  if (nextBtn) nextBtn.addEventListener('click', next);
  if (prevBtn) prevBtn.addEventListener('click', prev);

  window.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') next();
    if (e.key === 'ArrowLeft') prev();
  });

  // Drag / swipe
  const dragEl = viewport || track;
  let dragging = false;
  let startX = 0;
  let lastX = 0;
  let acc = 0;

  function onDown(e){
    dragging = true;
    startX = (e.touches ? e.touches[0].clientX : e.clientX);
    lastX = startX;
    acc = 0;
  }
  function onMove(e){
    if (!dragging) return;
    const x = (e.touches ? e.touches[0].clientX : e.clientX);
    const dx = x - lastX;
    lastX = x;
    acc += dx;

    const threshold = 42;
    if (acc > threshold) { prev(); acc = 0; }
    if (acc < -threshold) { next(); acc = 0; }
  }
  function onUp(){ dragging = false; }

  dragEl.addEventListener('mousedown', onDown);
  window.addEventListener('mousemove', onMove);
  window.addEventListener('mouseup', onUp);

  dragEl.addEventListener('touchstart', onDown, { passive: true });
  dragEl.addEventListener('touchmove', onMove, { passive: true });
  window.addEventListener('touchend', onUp, { passive: true });

  // Auto rotate (subtle), pause on hover/touch
  let auto = window.setInterval(next, 5200);
  const stopAuto = () => { if (auto) { window.clearInterval(auto); auto = null; } };
  dragEl.addEventListener('mouseenter', stopAuto);
  dragEl.addEventListener('touchstart', stopAuto, { passive: true });

  window.addEventListener('resize', render);
  render();
})();