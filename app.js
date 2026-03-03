/* ============================================================
   CARGA DE DATOS
   Los asesores se leen desde advisors.json.
   Para editar la información, modifica ese archivo.
   NOTA: Requiere servidor HTTP (GitHub Pages, Live Server, etc.)
         No funciona con file:// directamente en algunos navegadores.
   ============================================================ */

async function fetchAdvisors() {
  const res = await fetch('./advisors.json');
  if (!res.ok) throw new Error(`Error ${res.status}: no se pudo cargar advisors.json`);
  return res.json();
}

/* ============================================================
   ICON SVG — Universidad
   ============================================================ */

const universityIcon = `
  <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13"
    viewBox="0 0 24 24" fill="none" stroke="currentColor"
    stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
    aria-hidden="true">
    <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
    <polyline points="9 22 9 12 15 12 15 22"/>
  </svg>
`;

/* ============================================================
   RENDER — MOSAICO HERO (primeros 6 asesores)
   ============================================================ */

function renderHeroMosaic(advisors) {
  const container = document.getElementById('heroMosaic');
  if (!container) return;

  // Solo mostrar asesores con foto real; excluir el placeholder de desconocido
  const mosaicAdvisors = advisors
    .filter(a => !a.photo.includes('Desconocido'))
    .slice(0, 4);

  mosaicAdvisors.forEach((advisor, index) => {
    const item = document.createElement('div');
    item.className = 'mosaic-item';

    const img = document.createElement('img');
    img.src = advisor.photo;
    img.alt = `Foto de ${advisor.name}`;
    img.loading = index < 2 ? 'eager' : 'lazy';
    img.onerror = function () {
      this.parentElement.style.display = 'none'; // ocultar si falla
    };

    item.appendChild(img);
    container.appendChild(item);
  });
}

/* ============================================================
   RENDER — TARJETAS DE ASESORES
   ============================================================ */

function buildCardHTML(advisor) {
  const featuredClass = advisor.featured ? ' advisor-card--featured' : '';

  return `
    <article
      class="advisor-card${featuredClass}"
      role="button"
      tabindex="0"
      aria-label="Ver perfil de ${advisor.name}"
    >
      <div class="card-inner">
        <div class="card-photo-wrap">
          <img
            src="${advisor.photo}"
            alt="Foto de ${advisor.name}"
            class="card-photo"
            loading="lazy"
            onerror="this.src='images/Desconocido_Perfil.jfif'"
          />
        </div>

        <div class="card-body">
          <h3 class="card-name">${advisor.name}</h3>
          <p class="card-bio">${advisor.bio}</p>
          <span class="card-cta">Ver perfil completo →</span>
        </div>
      </div>
    </article>
  `;
}

function renderAdvisors(advisors) {
  const grid = document.getElementById('advisorsGrid');
  if (!grid) return;

  grid.innerHTML = '';

  const fragment = document.createDocumentFragment();

  advisors.forEach((advisor, index) => {
    const wrapper = document.createElement('div');
    wrapper.innerHTML = buildCardHTML(advisor);

    const card = wrapper.firstElementChild;
    card.style.setProperty('--i', index);

    // Abrir modal al hacer clic o presionar Enter/Space
    card.addEventListener('click', () => openModal(advisor));
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openModal(advisor);
      }
    });

    fragment.appendChild(card);
  });

  grid.appendChild(fragment);
}

/* ============================================================
   MODAL — PERFIL COMPLETO DEL ASESOR
   ============================================================ */

function openModal(advisor) {
  const overlay  = document.getElementById('advisorModal');
  const photo    = document.getElementById('modalPhoto');
  const name     = document.getElementById('modalName');
  const bio      = document.getElementById('modalBio');
  const resumen  = document.getElementById('modalResumen');

  photo.src = advisor.photo;
  photo.alt = `Foto de ${advisor.name}`;
  photo.onerror = () => { photo.src = 'images/Desconocido_Perfil.jfif'; };
  name.textContent = advisor.name;
  bio.textContent  = advisor.bio;
  resumen.textContent = advisor.resumen;

  overlay.classList.add('is-open');
  document.body.style.overflow = 'hidden';

  // Foco al botón de cierre para accesibilidad
  overlay.querySelector('.modal-close').focus();
}

function closeModal() {
  const overlay = document.getElementById('advisorModal');
  overlay.classList.remove('is-open');
  document.body.style.overflow = '';
}

function setupModal() {
  const overlay  = document.getElementById('advisorModal');
  const closeBtn = document.getElementById('modalClose');

  closeBtn.addEventListener('click', closeModal);

  // Clic fuera de la tarjeta cierra el modal
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) closeModal();
  });

  // ESC cierra el modal
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && overlay.classList.contains('is-open')) {
      closeModal();
    }
  });
}

/* ============================================================
   ESTADO DE CARGA Y ERROR
   ============================================================ */

function showLoadingState() {
  const grid = document.getElementById('advisorsGrid');
  if (!grid) return;
  grid.innerHTML = '<p class="grid-loading">Cargando asesores...</p>';
}

function showErrorState(message) {
  const grid = document.getElementById('advisorsGrid');
  if (!grid) return;
  grid.innerHTML = `<p class="grid-error">No se pudo cargar la información de los asesores.<br><small>${message}</small></p>`;
}

/* ============================================================
   ANIMACIÓN DE ENTRADA AL HACER SCROLL (Intersection Observer)
   ============================================================ */

function setupScrollReveal() {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const delayIndex = parseInt(el.style.getPropertyValue('--i') || 0);
          const delay = Math.min(delayIndex * 80, 800);

          setTimeout(() => {
            el.classList.add('is-visible');
          }, delay);

          observer.unobserve(el);
        }
      });
    },
    {
      threshold: 0.1,
      rootMargin: '0px 0px -30px 0px'
    }
  );

  // Observar tarjetas de asesores
  document.querySelectorAll('.advisor-card').forEach((card) => {
    card.classList.add('animate-in');
    observer.observe(card);
  });

  // Observar pasos del proceso
  document.querySelectorAll('.process-step').forEach((step, i) => {
    step.classList.add('animate-in');
    step.style.setProperty('--i', i);
    observer.observe(step);
  });
}

/* ============================================================
   ANIMACIÓN DE HERO (al cargar la página)
   ============================================================ */

function animateHero() {
  const selectors = [
    '.hero-eyebrow',
    '.hero-tag',
    '.hero-title',
    '.hero-description',
    '.btn-primary',
    '.hero-right'
  ];

  selectors.forEach((selector, index) => {
    const el = document.querySelector(selector);
    if (!el) return;

    el.classList.add('animate-in');

    setTimeout(() => {
      el.classList.add('is-visible');
    }, 100 + index * 120);
  });
}

/* ============================================================
   EFECTO SPOTLIGHT + 3D TILT EN TARJETAS
   ============================================================ */

function setupCardEffects() {
  document.querySelectorAll('.advisor-card').forEach((card) => {
    // Spotlight: radial gradient que sigue el cursor
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);

      // 3D tilt (máx ±3°): transition mínima en transform para suavizar
      // movimientos rápidos del cursor sin añadir lag perceptible
      card.style.transition =
        'box-shadow 0.5s var(--ease-expo), transform 0.1s ease-out';

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = ((y - centerY) / centerY) * -3;
      const rotateY = ((x - centerX) / centerX) * 3;

      card.style.transform = `perspective(1100px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px) scale(1.008)`;
    });

    // Resetear con transición suave al salir
    card.addEventListener('mouseleave', () => {
      card.style.transition =
        'box-shadow 0.5s var(--ease-expo), transform 0.55s var(--ease-expo)';
      card.style.transform = '';
    });

    // Feedback táctil al hacer clic
    card.addEventListener('mousedown', () => {
      card.style.transition = 'transform 0.12s var(--ease-expo)';
      card.style.transform = 'scale(0.985)';
    });

    card.addEventListener('mouseup', () => {
      card.style.transition = 'transform 0.3s var(--ease-expo)';
      card.style.transform = '';
    });
  });
}

/* ============================================================
   NAVBAR — EFECTO BLUR AL HACER SCROLL
   ============================================================ */

function setupNavbar() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;

  const onScroll = () => {
    navbar.classList.toggle('scrolled', window.scrollY > 48);
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

/* ============================================================
   MENÚ HAMBURGUESA (MOBILE)
   ============================================================ */

function setupMobileNav() {
  const toggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');
  if (!toggle || !navLinks) return;

  toggle.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('is-open');
    toggle.classList.toggle('is-open', isOpen);
    toggle.setAttribute('aria-expanded', String(isOpen));
  });

  navLinks.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('is-open');
      toggle.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', 'false');
    });
  });

  document.addEventListener('click', (e) => {
    const navbar = document.getElementById('navbar');
    if (navbar && !navbar.contains(e.target) && navLinks.classList.contains('is-open')) {
      navLinks.classList.remove('is-open');
      toggle.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', 'false');
    }
  });
}

/* ============================================================
   CONTADOR ANIMADO PARA ESTADÍSTICAS
   ============================================================ */

/* ============================================================
   SMOOTH SCROLL PERSONALIZADO
   Reemplaza scroll-behavior: smooth del navegador con easing
   expo-out (cubic-bezier 0.16, 1, 0.3, 1) — el mismo que usa
   toda la página. Duración dinámica según la distancia.
   ============================================================ */

function smoothScrollTo(targetY, duration) {
  const startY = window.scrollY;
  const distance = targetY - startY;
  if (Math.abs(distance) < 1) return;

  // Duración proporcional a la distancia: rápido en saltos cortos,
  // más largo en saltos grandes — entre 500 ms y 1000 ms
  const ms = duration ?? Math.min(Math.max(Math.abs(distance) * 0.45, 500), 1000);

  const start = performance.now();

  // Idéntico al --ease-expo: cubic-bezier(0.16, 1, 0.3, 1)
  const easeExpoOut = (t) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t));

  const step = (now) => {
    const elapsed = now - start;
    const progress = Math.min(elapsed / ms, 1);
    window.scrollTo(0, startY + distance * easeExpoOut(progress));
    if (progress < 1) requestAnimationFrame(step);
  };

  requestAnimationFrame(step);
}

function setupSmoothScroll() {
  const NAV_HEIGHT = 70; // var(--nav-height)

  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (!href || href === '#') return;

      const target = document.querySelector(href);
      if (!target) return;

      e.preventDefault();

      const targetY = Math.max(
        0,
        target.getBoundingClientRect().top + window.scrollY - NAV_HEIGHT
      );

      smoothScrollTo(targetY);
    });
  });
}

/* ============================================================
   INICIALIZACIÓN
   ============================================================ */

document.addEventListener('DOMContentLoaded', async () => {
  // Interactividad base (no depende de los datos)
  setupNavbar();
  setupMobileNav();
  setupSmoothScroll();
  setupModal();
  animateHero();

  // Mostrar estado de carga mientras se obtiene el JSON
  showLoadingState();

  try {
    const advisors = await fetchAdvisors();

    // Renderizar contenido con los datos del JSON
    renderHeroMosaic(advisors);
    renderAdvisors(advisors);

    // Activar efectos interactivos una vez que las tarjetas están en el DOM
    requestAnimationFrame(() => {
      setupScrollReveal();
      setupCardEffects();
    });

  } catch (err) {
    console.error('[App] Error cargando asesores:', err);
    showErrorState(err.message);
  }
});
