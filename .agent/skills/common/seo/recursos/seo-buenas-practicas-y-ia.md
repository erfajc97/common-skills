# SEO: buenas prácticas y recomendaciones para IA de Google

Documento de referencia para el skill **seo**. Resume qué debe tener una página para un buen SEO y cómo preparar el sitio para que las recomendaciones de IA de Google (p. ej. AI Overviews) y el SEO tradicional favorezcan el proyecto.

---

## 1. Lo que debe tener toda página pública

### Meta y head
- **Title** único por página (máx. ~60 caracteres), con marca o sitio al final si se desea.
- **Meta description** única (~150–160 caracteres), que resuma el contenido y anime al clic.
- **Canonical**: `link rel="canonical" href="URL_ABSOLUTA_DE_ESTA_PAGINA"` para evitar contenido duplicado.
- **Open Graph** (redes sociales y muchos crawlers): `og:title`, `og:description`, `og:url`, `og:image`, `og:site_name`. Opcional: `og:type`.
- **Twitter Cards**: `twitter:card` (p. ej. `summary_large_image`), `twitter:title`, `twitter:description`, `twitter:image`, `twitter:url` si se quiere control fino.

La URL base del sitio (ej. `https://midominio.com`) debe ser configurable (variable de entorno o config) y usarse en canonical y en `og:url`.

### Estructura y contenido
- Un **H1** por página, coherente con el title.
- **H2/H3** jerárquicos que describan secciones; bajo cada H2, un párrafo resumen (40–60 palabras) que responda de forma directa (favorece GEO).
- **URLs** legibles y estables (slug en lugar de IDs crípticos cuando sea posible).
- **Enlaces internos** desde y hacia páginas relacionadas (clusters de contenido).

### Imágenes
- **Atributo alt** descriptivo (qué se ve o qué representa), no genérico (“imagen”, “foto”).
- **Dimensiones** o **aspect-ratio** en contenedor para evitar CLS (layout shift).
- **Lazy load** (`loading="lazy"`) en imágenes below-the-fold; prioridad para LCP (hero) con `loading="eager"` y/o `fetchPriority="high"`.

### Técnico
- **Sitemap** (`sitemap.xml`) con las URLs públicas importantes.
- **robots.txt** con `Sitemap: <URL_BASE>/sitemap.xml` (y reglas Disallow si aplica).
- **Rendimiento**: primera carga < 3 s en condiciones normales; Core Web Vitals (LCP, CLS, INP) en verde. Compresión (gzip/brotli) en servidor o CDN.
- **Responsive** y **móvil-first**; viewport y contenido usable en móvil.

---

## 2. Datos estructurados (Schema.org / JSON-LD)

Ayudan a Google y a la IA a entender de qué trata la página y a citarte como fuente.

| Tipo | Cuándo usarlo | Campos típicos |
|------|----------------|------------------|
| **Organization** / **TravelAgency** | Sitio o negocio global | name, url, description, areaServed |
| **WebPage** | Páginas genéricas | name, description, url |
| **Event** | Página de un evento | name, description, startDate, location, image, offers (price) |
| **Article** | Artículos, posts, journals | headline, description, image, datePublished, author |
| **FAQPage** | Página de preguntas frecuentes | mainEntity (Question/Answer) |
| **Product** | Página de producto o membresía | name, description, image, offers |

- Inyectar como `<script type="application/ld+json">` en el `<head>` (o desde el head del framework).
- Un solo objeto o array de objetos; JSON válido y escapado correctamente.
- No duplicar en el JSON-LD información que no esté visible en la página.

---

## 3. GEO: optimización para motores generativos (IA de Google)

Para que la IA recomiende o cite tu sitio (p. ej. en AI Overviews):

### Respuesta atómica
- La IA prefiere fragmentos fáciles de extraer.
- **Resúmenes directos**: párrafo de 40–60 palabras bajo H2 que sean preguntas o temas clave (ej.: “Las mejores escapadas de lujo cerca de Madrid incluyen…”).
- **Listas y tablas**: viñetas o tablas para amenidades, precios, ubicaciones; facilitan respuestas rápidas.

### E-E-A-T (Experiencia, Experiencia, Autoridad, Confianza)
- **Contenido propio**: experiencias reales, fotos propias, consejos que solo quien ha estado podría dar.
- **Datos y fuentes**: cuando cites algo, enlazar o nombrar la fuente.
- **Autoría** clara en artículos (schema Article con `author`).

### Clusters y enlaces internos
- Una pieza central (ej. “Guía de escapadas VIP en Madrid”) que enlace a subpáginas (destinos, membresías, eventos).
- Enlazar desde la home y entre secciones relacionadas para que la IA y los usuarios descubran todo el contenido.

### Velocidad y móvil
- Carga en menos de 3 segundos y diseño 100 % responsivo; el rendimiento técnico influye en ranking y en la decisión de la IA de citarte.

### Citas de marca (brand mentions)
- Que la marca aparezca en directorios, prensa o redes con buena reputación; la IA suele preferir fuentes que otros sitios citan.

---

## 4. Rendimiento y Core Web Vitals

| Métrica | Objetivo | Cómo mejorarla |
|--------|----------|-----------------|
| **LCP** (Largest Contentful Paint) | < 2,5 s | Priorizar recurso LCP (imagen/vídeo del hero), preload si hace falta; servidor/CDN rápido. |
| **CLS** (Cumulative Layout Shift) | < 0,1 | Reservar espacio para imágenes (width/height o aspect-ratio); evitar inyectar contenido above-the-fold que desplace el layout; fuentes con font-display que no provoquen salto (p. ej. optional). |
| **INP** (Interaction to Next Paint) | < 200 ms | Menos JS bloqueante; handlers ligeros; evitar layout thrashing. |

Además:
- **Preload** de la hoja de estilos crítica para reducir FOUC (flash de contenido sin estilos).
- **Lazy load** de imágenes below-the-fold.
- **Compresión** gzip o brotli en respuestas de texto (HTML, CSS, JS).

---

## 5. Checklist rápido por página nueva

- [ ] Title y meta description únicos.
- [ ] Canonical con URL absoluta.
- [ ] OG y Twitter (title, description, url, image).
- [ ] Un H1; H2 con párrafo resumen 40–60 palabras donde encaje.
- [ ] Imágenes con alt descriptivo y espacio reservado (CLS).
- [ ] JSON-LD si aplica (Event, Article, FAQPage, etc.).
- [ ] Enlaces internos relevantes.
- [ ] Sitemap y robots actualizados si es una URL importante.

---

## 6. Referencias útiles

- [Google Search Central](https://developers.google.com/search) (documentación oficial).
- [Schema.org](https://schema.org/) (tipos y propiedades para datos estructurados).
- Guías de Google sobre E-E-A-T y contenido útil para búsqueda y para experiencias generativas (AI Overviews).

---

*Este documento es la fuente de verdad para el skill `seo` en `.agent/skills/common/seo/`.*
