# Tokens y utilidades

Todo sale del `@theme` de `src/styles/global.css`. En Tailwind se usan como
`bg-esmeralda-700`, `text-tinta-tenue`…; en CSS a mano, como `var(--color-…)`.

## Color

| Token | Valor | Para qué |
|---|---|---|
| `--color-esmeralda` / `-500` | `#2c8936` | marca; eyebrows, acentos de titular |
| `--color-esmeralda-600` | `#257a2e` | |
| `--color-esmeralda-700` | `#1e6426` | botón sólido, enlaces con flecha |
| `--color-esmeralda-800` | `#17491e` | hover del anterior |
| `--color-esmeralda-900` | `#0f2f16` | = selva-900 |
| `--color-esmeralda-ink` | `#1e6426` | **el único verde legible como texto sobre papel** |
| `--color-esmeralda-50…400` | `#f0f9f1 · #dcf0de · #b9e1bd · #8ccd93 · #59b165` | fondos suaves, estados |
| `--color-selva-900` | `#0f2f16` | fondo de `.banda-oscura`, de `.tile`, del pie |
| `--color-selva-950` | `#081a0d` | menú móvil, velos |
| `--color-lima` | `#a3e635` | **la acción**: botón principal, acento sobre oscuro |
| `--color-lima-300` | `#bef264` | hover de lima |
| `--color-lima-100` | `#ecfccb` | fondo tenue |
| `--color-papel` | `#fbfcf9` | fondo del sitio |
| `--color-niebla` | `#f2f6ef` | banda alterna, cajas |
| `--color-tinta` | `#0f1f15` | texto |
| `--color-tinta-suave` | `#33423a` | `.lead`, párrafos secundarios |
| `--color-tinta-tenue` | `#66756c` | notas, pies |
| `--color-linea` | `rgba(15,31,21,.10)` | separadores |

## Tipografía

- `--font-sans`: **Manrope** variable (200–800), autohospedada. Titulares en 800
  con `letter-spacing: -0.025em`.
- `--font-acento`: **Fraunces**, solo itálica variable (200–500), peso 300,
  `font-variation-settings: "opsz" 144, "SOFT" 40`. Se aplica sola a
  `h1 em, h2 em, h3 em` y a `.acento`.

| Clase | Tamaño |
|---|---|
| `.eyebrow` | 12 px / 700 / `0.18em` mayúsculas, con guion de 28 px antes |
| `.titulo` | `clamp(34px, 5.2vw, 60px)` / 1.02. `.titulo em` va en esmeralda |
| `.titulo.on-dark` | blanco, con el `em` en lima |
| `.lead` | 17/28, 19/30 en ≥768, `tinta-suave` |

## Movimiento

- `--ease-esm`: `cubic-bezier(.2,.7,.2,1)` — la curva de todo.
- `.reveal` — revelado al entrar en viewport (scroll-driven, dentro de
  `@supports (animation-timeline: view())`). **Es la que se pone en el markup**:
  una por bloque, no una por elemento.
- `.rise` + `.d1`…`.d6` — entrada escalonada, solo above-the-fold (el hero).
- `.hero-img` — ken burns 18 s.
- `.marquee` / `.marquee-track` (+ `.slow`, `.rev`) — cintas en bucle, pausan al
  pasar el ratón.
- `prefers-reduced-motion` apaga todo lo anterior; ya está resuelto.

## Radios

`--radius-tile: 28px` (tarjetas grandes, `.tile`), `--radius-tarjeta: 20px`
(cajas), `999px` (botones y chips).

## Estructura

- `.wrap` — ancho máximo 1320 px, padding 20 px (40 en ≥768). Va dentro de la banda.
- `.grid12` — rejilla de 12 columnas, gap 24 px (40 en ≥1024). Se usa con
  `grid-column: span N` en CSS propio, no con clases de Tailwind.

## Botones y enlaces

Base `.btn` (56 px de alto, píldora, gap 12) + variante:

| Clase | Uso |
|---|---|
| `.btn-lima` | acción principal, también sobre oscuro |
| `.btn-esm` | acción principal sobre fondo claro |
| `.btn-ghost` | secundaria **sobre imagen u oscuro** (cristal + borde) |
| `.btn-outline` | secundaria sobre claro |
| `.arrow-link` | enlace de texto con flecha que avanza al hover; `.on-dark` |
| `.ico-btn` | botón circular de 56 px; `.ico-sm` (44), `.on-dark`, `.sobre-foto` |
| `.btn-esmeralda`, `.btn-esmeralda-outline` | alias antiguos, aún vivos |
| `.btn-donar` | botones de aporte de `vinculate` / `rv-gratis` |

Los `svg` dentro de `.btn` se desplazan 4 px al hover: úsalos con flechas.

## Piezas

- `.chip` + `.chip-niebla` / `.chip-lima` / `.chip-glass` — etiquetas cortas.
- `.glass` — cristal sobre imagen (blur 16, borde blanco al 22 %).
- `.tile` — contenedor con imagen `object-fit: cover` a sangre, radio 28, zoom
  al hover. Su `img` va en `position: absolute`, así que el alto lo pone el
  contenedor (normalmente `aspect-ratio`).
- `.grain` — grano SVG en línea para fondos oscuros.
- `.text-shadow-custom` — sombra de texto sobre fotografía.
- `.faq-item` — acordeón nativo `<details name="faq">`, sin JS.
- `.logo-tile`, `.foot-link`, `.social` — aliados y pie.
- `.prosa` — cuerpo editorial del detalle: `> section > h2` se numera solo
  (01, 02…), `p.destacado`, `.prosa-cajas`, `.prosa-pasos`, `blockquote`.
- `.ficha` — tarjeta lateral de datos del detalle.
- `.lightbox` + `.lightbox-cerrar` / `.lightbox-nav` — `<dialog>` de fotos.

## Catálogo completo

Las clases están agrupadas por módulo en `global.css`, cada bloque con su
cabecera: PORTADA, HUBS, DETALLE, LA RESERVA (aquí vive `.banda-oscura`),
VIVENCIAS, GALERIA, VINCULATE, CONTACTANOS, AVES, SENDERO, RECORRIDO VIRTUAL.
Para ver qué existe:

```sh
grep -n '^/\* =' src/styles/global.css     # los bloques
grep -oE '^\.[a-z0-9-]+' src/styles/global.css | sort -u
```
