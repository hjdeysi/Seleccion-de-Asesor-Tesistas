# CLAUDE.md — Proyecto: Asesores de Tesis UPCH 2026-1

## Descripción del Proyecto
Página web estática para el curso de tesis de **pregrado** de la Universidad Peruana Cayetano Heredia (UPCH).
Muestra el perfil de 11 asesores con foto, descripción, área de especialidad y estadísticas.
Desplegada en GitHub Pages. Ciclo: **2026-1**.

## Estructura de Archivos
```
├── index.html       # Estructura semántica completa
├── styles.css       # Todo el CSS (variables, layout, animaciones, responsive)
├── app.js           # Lógica de render + interactividad (lee datos desde advisors.json)
├── advisors.json    # ← EDITAR AQUÍ los datos de los asesores
├── images/
│   ├── Escudo_Universidad_UPCH.jpg   # Logo completo (usado en hero)
│   └── Escudo_UPCH.jpg               # Solo el escudo (usado en navbar y footer)
└── CLAUDE.md        # Este archivo
```

## Skills Aplicadas

### taste-skill (DESIGN_VARIANCE: 3 | MOTION_INTENSITY: 10 | VISUAL_DENSITY: 7)
- Fuente: **Outfit** (Google Fonts) — Inter está PROHIBIDO
- Un solo color acento: **#1a6655** (teal jade profundo, saturación baja)
- NO gradientes neon ni aesthetic AI-purple
- Layout asimétrico de grid (tarjetas featured con `grid-column: span 2`)
- Animaciones con `cubic-bezier(0.16, 1, 0.3, 1)` (easing tipo spring en CSS)
- `min-h: 100dvh` en hero — NUNCA `h-screen`
- CSS Grid para layouts — no flexbox con cálculos porcentuales complejos

### redesign-skill
- Separación de secciones con tonos suaves del mismo tono (no secciones oscuras aleatorias)
- Hover states en todos los elementos interactivos
- Scroll suavizado via JS con easing expo-out (NO `scroll-behavior: smooth` — interfiere con JS)
- HTML semántico: `<nav>`, `<main>`, `<section>`, `<article>`, `<footer>`, `<ol>`
- Foco visible para navegación por teclado (`skip-to-content` link)
- Alt text en todas las imágenes
- Meta tags completos (description, og:title, og:description)

### output-skill
- Código completo sin truncaciones ni placeholders
- Todos los 11 asesores con datos reales ficticios (sin "John Doe" ni números redondos)
- Sin filler words: "Elevate", "Seamless", "Unleash" — PROHIBIDOS

## Decisiones de Diseño

### Paleta de Colores — UPCH (Carmesí + Cremas cálidas)
- `--color-bg: #fdf9f5` — crema cálida (NO blanco puro, NO negro puro)
- `--color-surface: #ffffff` — tarjetas
- `--color-text-primary: #1a1012` — casi negro con tinte cálido
- `--color-text-secondary: #74646a` — gris cálido
- `--color-accent: #8c1a2c` — **CARMESÍ UPCH** (color oficial de la universidad)
- `--color-accent-light: #fae8eb` — tinte muy claro para chips/badges
- About section: `#f4ece1` — crema más intensa
- Footer: `#1a1012` — negro cálido oscuro (tinte rojo sutil)
- Sombras tintadas con carmesí `rgba(140, 26, 44, 0.xx)` para coherencia

### Imágenes UPCH
- `Escudo_UPCH.png` → Navbar (34px) y Footer (40px, sin fondo artificial)
- Ambas son **PNG con canal alfa nativo (RGBA)** — no se necesita `mix-blend-mode` ni fondos blancos
- **Extensión: `.png`** — Si se cambian los archivos de imagen, siempre usar `.png`

### Layout de la Grid de Asesores (3 columnas en desktop)
```
[Asesor 1 — span 2] [Asesor 2]
[Asesor 3] [Asesor 4] [Asesor 5]
[Asesor 6] [Asesor 7 — span 2]
[Asesor 8] [Asesor 9] [Asesor 10]
           [Asesor 11 — col 2]
```
- Tarjetas featured (1 y 7): layout horizontal (foto | contenido)
- Tarjetas regulares: layout vertical (foto arriba, contenido abajo)
- Bio truncada a 3 líneas en tarjetas regulares (full bio en featured)

### Hero
- Sin `min-height: 100dvh` — altura determinada por el contenido + padding generoso
- `align-items: flex-start` en la sección; contenido arranca justo después del navbar
- Texto: eyebrow (nombre universidad) → tag (curso/ciclo) → h1 → descripción → CTA
- Mosaico: 4 fotos (grid 2×2) a la derecha — visible en `>= 768px`

### Responsive Breakpoints
- `< 768px`: 1 columna, hero solo texto, menú hamburguesa
- `768px - 1023px`: 2 columnas, tarjetas featured son span 2
- `>= 1024px`: 3 columnas, layout asimétrico completo, mosaic visible

### Efectos Interactivos
- **Spotlight card**: gradiente radial que sigue el cursor (CSS custom properties + JS)
- **3D tilt**: `perspective(1100px) rotateX rotateY` en mousemove (máx ±3°)
  — `transform 0.1s ease-out` en mousemove (suaviza saltos), `0.55s var(--ease-expo)` en mouseleave
- **Mosaic flotante**: animación CSS `@keyframes floatA/floatB` con stagger (4 fotos, grid 2×2)
- **Scroll reveal**: `IntersectionObserver` agrega clase `.is-visible` con delay por `--i`
  — `will-change: opacity, transform` para aceleración GPU; se libera con `will-change: auto` al completar
- **Nav blur**: `backdrop-filter: blur(18px)` al hacer scroll

### Fotos de Asesores
- Fuente: archivos `.jfif` locales en `images/` — `NombreAsesor_Perfil.jfif`
- Fallback: `images/Desconocido_Perfil.jfif` para asesores sin foto asignada (via `onerror`)
- Recorte circular con `border-radius: 50%` + `object-fit: cover` en CSS

### Modal de Perfil Completo
- Clic en cualquier tarjeta abre un modal centrado con overlay oscuro (`rgba + blur`)
- Header del modal: foto circular grande + nombre del asesor
- Cuerpo: sección "Sobre el asesor" (bio) + sección "Trayectoria y contribuciones" (resumen)
- Cierre: botón ×, clic fuera del card, tecla ESC
- Animación: overlay fade-in `0.35s` + card `translateY + scale` con `var(--ease-expo)`
- `document.body.overflow = 'hidden'` mientras el modal está abierto

## Historial de Cambios

### v1.0 — Creación inicial (2026-03-02)
- Estructura completa de 3 archivos (HTML, CSS, JS)
- 11 asesores con información ficticia realista
- Layout asimétrico con tarjetas featured
- Animaciones scroll reveal + spotlight + 3D tilt
- Responsive completo (mobile → desktop)
- Hero con mosaic flotante de fotos, barra de estadísticas, sección "El proceso", footer

### v1.1 — Identidad UPCH + JSON + Fixes (2026-03-02)
- Paleta carmesí UPCH (#8c1a2c) + fondos crema; imágenes UPCH integradas
- Datos movidos a `advisors.json` con `fetch()` asíncrono
- "Posgrado" → "Pregrado"; "2026" → "Ciclo 2026-1"
- Fix alineación tarjetas: `height: 100%` + `margin-top: auto` en `.card-footer`
- Footer simplificado: sin legales, 2 columnas desktop

### v1.2 — Fixes de imágenes, hover y footer (2026-03-02)
- Imágenes → `.png` (RGBA nativo)
- Bug hover foto corregido: `.card-photo-ring` eliminado, reemplazado por `box-shadow` doble
- Fix ACL Windows: imágenes PNG tenían ACL vacía (EPERM). Fix con PowerShell `Set-Acl`

### v1.3 — Refine visual hero y footer (2026-03-02 / 03-03)
- Imagen `Escudo_Universidad_UPCH.png` eliminada del hero; reemplazada por texto eyebrow
- Barra de estadísticas eliminada (datos no reales)
- Mosaico reducido de 6 → 4 fotos (grid 2×2); hero sin `min-height: 100dvh`
- Nav shield y footer shield: eliminados fondos blancos artificiales (PNG RGBA nativo)
- Footer description: texto más conciso y ancho (`max-width: 56ch`)

### v1.6 — Modal de perfil + fotos reales (2026-03-03)
- `advisors.json` rediseñado: solo `name`, `photo`, `bio`, `resumen`, `featured`
- Fotos reales `.jfif` enlazadas por nombre; `Desconocido_Perfil.jfif` como fallback
- Roy Yali Samaniego (pos. 1) y Jaime Luis Escobar Aguirre (pos. 7) marcados como featured
- `buildCardHTML()` simplificado: foto circular + nombre + bio truncada + "Ver perfil →"
- Modal completo: overlay blur, foto circular grande, bio, resumen, animación expo-out
- Cierre por botón ×, clic fuera y tecla ESC

### v1.5 — Smooth scroll personalizado (2026-03-03)
- `scroll-behavior: smooth` eliminado del CSS — el navegador usa interpolación lineal que se siente brusca
- Implementado `smoothScrollTo()` + `setupSmoothScroll()` en JS:
  easing `easeExpoOut` idéntico al `--ease-expo` del diseño
- Duración dinámica: proporcional a la distancia de scroll (500–1000 ms)
- Offset automático de `--nav-height` (70px) para que el contenido no quede bajo el navbar fijo
- Cubre todos los `<a href="#...">` de la página: navbar, hero CTA, footer nav

### v1.4 — Transiciones suavizadas (2026-03-03)
- `will-change: opacity, transform` en `.animate-in`; liberado con `will-change: auto` post-animación
- 3D tilt: `transform 0.1s ease-out` en mousemove (suaviza saltos de cursor); `0.55s var(--ease-expo)` en mouseleave
- Press feedback: transition propia en mousedown/mouseup
- `.card-photo`: `box-shadow` añadido al transition para anillo suave
- Nav/footer links: `var(--ease-expo)` reemplaza `ease` lineal
- Steps hover: `color` añadido al transition; duración aumentada a 0.4s

## Errores Conocidos / Notas
- Los `grid-column: span 2` y `grid-column: 2 / 3` para card 11 son `desktop only`
  (se resetean automáticamente en breakpoints menores — no hay override manual necesario)
- Las fotos de pravatar.cc requieren conexión a internet; sin conexión usan picsum como fallback
- `fetch('./advisors.json')` NO funciona con `file://` en Chrome/Firefox por CORS.
  Se necesita un servidor HTTP: GitHub Pages, VS Code Live Server, o `python -m http.server`
- Las imágenes UPCH PNG en Windows pueden perder ACL al ser renombradas/convertidas → EPERM.
  Fix: `Set-Acl` en PowerShell para añadir `Everyone: Read`
- NO usar Inter font — explícitamente prohibido por las skills
- NO añadir más colores acento — solo `#8c1a2c`
- NO cambiar "pregrado" de vuelta a "posgrado"
- NO agregar "Política de privacidad" / "Términos de uso" — eliminados a pedido del usuario
- Las imágenes UPCH son `.png` — NO usar `.jpg`
- `.card-photo-ring` fue eliminado (causaba que la foto desapareciera al hover).
  El anillo se logra con `box-shadow` doble en `.card-photo:hover`
