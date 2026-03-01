---
name: seo
description: >
  Prioriza y aplica SEO técnico, GEO (optimización para IA de Google) y rendimiento en webs y SPAs.
  Usar al crear o revisar páginas públicas, meta tags, datos estructurados, sitemap, Core Web Vitals y contenido para motores generativos.
---

# Skill: SEO y GEO

## Cuándo usar este skill
- Al crear o modificar páginas públicas (landings, listados, detalle de producto/evento/artículo).
- Al implementar o revisar meta tags (title, description, canonical, Open Graph, Twitter).
- Al plantear sitemap, robots.txt o datos estructurados (JSON-LD).
- Cuando se mencione SEO, posicionamiento, Google, AI Overviews o “que la IA recomiende” el sitio.
- Al optimizar carga (imágenes, fuentes, CSS, compresión) o Core Web Vitals (CLS, LCP, INP).

## Fuente de verdad
- **Buenas prácticas y recomendaciones IA**: `recursos/seo-buenas-practicas-y-ia.md` (qué debe tener una página, GEO, E-E-A-T, respuesta atómica).

## Workflow (revisión / implementación)
1. **Meta por página**: Cada ruta pública debe tener título único, descripción (~150–160 caracteres), canonical (URL absoluta) y OG/Twitter (title, description, url, image). Usar una URL base de sitio (env o config) para canonical y og:url.
2. **Datos estructurados**: Incluir JSON-LD según tipo de página (Organization/TravelAgency en raíz; Event en detalle de evento; Article en artículos; FAQPage en FAQ). Inyectar vía head como `script type="application/ld+json"`.
3. **Sitemap y robots**: sitemap.xml con URLs públicas; robots.txt con `Sitemap: <URL_BASE>/sitemap.xml`.
4. **Rendimiento**: Preload o priorizar CSS crítico para reducir FOUC; imágenes con dimensiones o aspect-ratio para evitar CLS; lazy load below-the-fold; fuentes con font-display adecuado (p. ej. optional). Activar compresión (gzip/brotli) en servidor o CDN.
5. **Contenido para GEO**: Bajo H2 relevantes, párrafos resumen 40–60 palabras; listas o tablas donde encaje; FAQ con schema FAQPage; enlaces internos (clusters) y ALT descriptivos en imágenes.

## Checklist resumido (detalle en recursos)
- [ ] Title y meta description únicos por ruta.
- [ ] Canonical y og:url con URL base correcta.
- [ ] Open Graph y Twitter Cards (title, description, image).
- [ ] JSON-LD según tipo (Organization, Event, Article, FAQPage cuando aplique).
- [ ] Sitemap y robots.txt referenciando sitemap.
- [ ] CSS crítico priorizado; imágenes con espacio reservado; lazy load coherente.
- [ ] Contenido con resúmenes bajo H2, FAQ si aplica, ALT en imágenes.

## Si el output no cumple
- No entregar rutas públicas sin meta (title, description, canonical) ni head que dependa de datos sin loader/SSR cuando el contenido sea dinámico. Corregir o pedir la URL base del sitio si falta.

## Recursos
- Para criterios completos y recomendaciones para IA de Google: [recursos/seo-buenas-practicas-y-ia.md](recursos/seo-buenas-practicas-y-ia.md).
