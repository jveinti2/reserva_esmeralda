# Componentes y layouts

Rutas relativas a `src/`. Todos los textos van en español; los props también.

## Layouts

### `layouts/BaseLayout.astro`
Dueño de `<html>`/`<head>`: SEO, canónica, Open Graph, fuentes autohospedadas y
**la única hoja de estilos**.

| Prop | Notas |
|---|---|
| `title`, `description` | tienen valor por defecto, pero ponlos siempre |
| `preloadImage` | ruta de la imagen LCP. **Obligatoria si el hero es imagen de fondo CSS**, que el preload scanner no ve |
| `ogImage` | por defecto `/banner_2.avif` |

### `layouts/PaginaHub.astro`
Hub de área de programa. Es todo props, no se le pasa markup:
`title`, `description`, `eyebrow`, `heroTitulo`, `heroAcento`, `heroLead`,
`heroImagen`, `heroAlt`, `heroPosicion`, `galeria: string[]`, `galeriaAlt`,
`introEyebrow`, `introTitulo`, `introAcento`, `introLead`,
`tarjetasEyebrow`, `tarjetasTitulo`, `tarjetasAcento`,
`tarjetas: {href, imagen, alt, ancho?, alto?, chip?, titulo, texto?}[]`,
`puntosTitulo`, `puntosAcento`, `puntos: {titulo, texto}[]`,
`ctaTitulo`, `ctaAcento`, `ctaTexto`.

### `layouts/PaginaDetalle.astro`
Las 12 páginas de detalle. Props: `title`, `description`, `programa`,
`programaHref`, `heroTitulo`, `heroAcento`, `heroSubtitulo`, `heroImagen`,
`heroAlt`, `heroPosicion`, `ficha: {etiqueta, valor}[]`, `galeriaTitulo`,
`galeria: {src, alt}[]`, `ctaTitulo`, `ctaAcento`, `ctaTexto`.
Slots: **default** (el cuerpo, dentro de `.prosa`), `ficha` (extra en la tarjeta
lateral), `extra` (secciones sueltas antes del CTA).

El cuerpo se escribe como `<section>` con `<h2>`: la numeración 01, 02… la pone
el CSS de `.prosa`, no la escribas a mano.

## Secciones

### `sections/Hero.astro`
| Prop | |
|---|---|
| `imagen`, `alt` | obligatorios |
| `ancho`, `alto` | dimensiones reales del AVIF |
| `posicion` | `object-position`, por defecto `"50% 40%"` |
| `eyebrow`, `titulo`, `acento`, `subtitulo`, `lead` | `acento` = segunda línea en Fraunces lima |
| `tamano` | `"completo"` (100svh, solo portada) · `"compacto"` (62svh) |
| `alineacion` | `"izquierda"` (por defecto) · `"centro"` |

Slots: `acciones` (botones), `lateral` (tarjeta, p. ej. `VideoDialog`),
`pie` (franja `Cifras`).

### `sections/Encabezado.astro`
`eyebrow`, `titulo`, `acento`, `cola` (texto después del acento), `lead`,
`doble` (lead en segunda columna), `claro` (sobre banda oscura), `clase`
(normalmente `"reveal"`).

### `sections/CTABanda.astro`
Cierre de página, imagen a sangre. `imagen` (por defecto la lagartija
`/fondos/fondo5-2.avif`), `alt`, `posicion`, `eyebrow`, `titulo`, `acento`,
`texto`, `primario` y `secundario` como `{texto, href}` (por defecto Vincúlate
y Contáctanos).

### `sections/Cifras.astro`
`cifras: {valor, unidad?, texto, destacada?}[]` + `clase`. Franja en cristal;
normalmente dentro del slot `pie` del hero.

### `sections/Marquesina.astro`
`items: string[]`. Cinta en bucle con puntos lima.

### Otras, con datos ya escritos dentro (no llevan props)
`ProgramasBento`, `ExperienciaLista`, `TestimoniosScroll`, `AliadosMarquee`,
`FAQSection`. Si cambia el contenido, se edita el array del frontmatter del
propio componente.

## UI

### `ui/Tile.astro`
`href` (si lo lleva, renderiza `<a>`; si no, `<div>`), `imagen`, `alt`,
`ancho`, `alto`, `chip`, `titulo`, `texto`, `enlaceTexto`,
`escala: "alto" | "normal"`, `clase`, `estilo`, `eager`.

### `ui/Carousel.astro`
`images: string[]`, `alt`, `wrapperClass`, `heightClass`, `eager`. Se usa en 12
páginas; se restiló pero su lógica no se toca.

### `ui/VideoDialog.astro`
`video`, `poster`, `titulo`, `nota`, `duracion`, `clase`. Abre un `<dialog>`
nativo con el `<video preload="metadata">`. Sin librerías.

### `ui/AccordionItem.astro`
`id`, `question`, `answer` (HTML en cadena). `isFirst`/`isLast` se conservan por
compatibilidad pero ya no hacen nada.

### `ui/TeamMember.astro`, `ui/FloatingNotification.astro`
Equipo de `/reserva/` y chip flotante de la portada.

## Marco

### `layout/Header.astro`
Sticky con margen negativo: **el hero empieza en el borde superior de la
página**. Transparente arriba, teñido al 42 % con blur al hacer scroll (clase
`is-scrolled` desde 40 px, por JS), y se retira al bajar (`is-oculto`).
Megamenú de programas por click y hover, cierre con Escape. Menú móvil a
pantalla completa en `selva-950`, bloquea el scroll del body.

Para añadir una entrada al menú se editan los arrays `programas` y `enlaces`
del frontmatter: escritorio y móvil se pintan de los mismos datos, así que se
toca en un solo sitio. El enlace activo lo resuelve `esActual` comparando con
`Astro.url.pathname`, de ahí que las rutas lleven **barra final**.

### `layout/Footer.astro`
Prop única: `mapa` (por defecto `false`). Con `mapa={true}` renderiza el iframe
de Google Maps; en el resto de páginas, tarjeta estática con enlace a "Cómo
llegar" y cero peticiones a terceros. Solo lo llevan inicio, contacto y sendero.

Los enlaces del pie se editan en su propio frontmatter.
