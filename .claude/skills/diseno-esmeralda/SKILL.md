---
name: diseno-esmeralda
description: Sistema de diseño de la Reserva Natural La Esmeralda (Astro 5 + Tailwind v4). Úsalo siempre que crees o rediseñes una página, sección o componente de este sitio — tokens, bandas, Hero/Encabezado/Tile/CTABanda, dónde va el CSS nuevo, y los errores que ya se cometieron una vez. También al añadir un módulo nuevo (/aves, /sendero, etc.).
---

# Sistema de diseño — La Esmeralda

Dirección: **bosque a pantalla completa, marco transparente, verde profundo en
las bandas, lima para la acción**. Manrope lo lleva todo; Fraunces itálica
aparece solo como acento dentro de un titular.

La fuente de verdad son los dos artboards en `design/landing-*.dc.html` y el
CSS ya escrito en `src/styles/global.css`. **No inventes valores**: si algo se
parece a una pieza existente, reutiliza su clase.

## Antes de escribir nada

1. `grep -n '^\.<pieza>' src/styles/global.css` — casi siempre la clase ya existe.
2. Mira la página más parecida (`src/pages/aves.astro`, `sendero/index.astro`,
   `galeria.astro` son las tres más recientes y las mejor alineadas al sistema).
3. Solo entonces decide si hace falta CSS nuevo.

## Anatomía de una página

No hay layout automático: `Header` y `Footer` se colocan **a mano** en cada
página. Elige el molde antes de escribir markup:

| Caso | Molde |
|---|---|
| Detalle de un programa (objetivo, metodología, galería) | `layouts/PaginaDetalle.astro` — pasa props, escribe el cuerpo en `.prosa` |
| Hub de un área de programa | `layouts/PaginaHub.astro` — es todo props, no lleva markup |
| Página especial (galería, sendero, aves, vinculate…) | Página suelta: `BaseLayout` + `Header` + bandas + `Footer` |

Esqueleto de página suelta:

```astro
---
import BaseLayout from "../layouts/BaseLayout.astro";
import Header from "../components/layout/Header.astro";
import Footer from "../components/layout/Footer.astro";
import Hero from "../components/sections/Hero.astro";
import Encabezado from "../components/sections/Encabezado.astro";
import CTABanda from "../components/sections/CTABanda.astro";
---
<BaseLayout title="…" description="…" preloadImage="/x.avif" ogImage="/x.avif">
  <Header />
  <main>
    <Hero imagen="/x.avif" alt="…" ancho={1600} alto={1059}
          eyebrow="…" titulo="Primera línea" acento="segunda línea"
          lead="…" tamano="compacto" />

    <section class="banda-papel">
      <div class="wrap">
        <Encabezado eyebrow="…" titulo="Un titular con" acento="acento"
                    lead="…" doble clase="reveal" />
        …
      </div>
    </section>

    <CTABanda titulo="…" acento="…" texto="…" />
  </main>
  <Footer />
</BaseLayout>
```

`main` no lleva clases: el ritmo lo dan las bandas.

## Ritmo de bandas

Toda sección es `<section class="banda-*"><div class="wrap">…`. El padding
(80 px, 128 px en ≥1024) ya viene en la banda; no lo repitas.

- `.banda-papel` — fondo por defecto (`--color-papel`).
- `.banda-niebla` — variación suave para separar dos bandas claras seguidas.
- `.banda-oscura` — `selva-900`, texto blanco. Dentro va `<Encabezado claro>`,
  `.titulo.on-dark` y `.arrow-link.on-dark`.

Alterna papel → oscura → papel → niebla. Dos bandas del mismo tono seguidas se
leen como una sola: si pasa, es que sobraba una.

## Los cuatro componentes que resuelven casi todo

- **`Hero`** — cabecera con imagen a sangre. `tamano="completo"` solo en la
  portada; el resto `"compacto"`. Slots `acciones`, `lateral`, `pie`.
- **`Encabezado`** — eyebrow + h2 con acento + lead. Cabecera de toda sección.
- **`Tile`** — tarjeta con imagen de fondo, degradado, chip y título. Base del
  bento, los hubs, la galería y el detalle.
- **`CTABanda`** — cierre de página. Siempre la última sección antes del pie.

Props completos: `referencia/componentes.md`.

## Titulares

El titular se parte en dos: la parte recta y el **acento** en Fraunces itálica.

```astro
<Encabezado titulo="Un recorrido donde tu maestra es la" acento="naturaleza" />
```

En markup a mano, el acento es un `<em>` dentro del h2 (`h2 em` ya está
estilado) o un `<span class="acento">`. Nunca cargues Fraunces recta: solo
existe la itálica en `public/fonts/`.

## Dónde va el CSS nuevo

Todo en `src/styles/global.css`, **al final**, en un bloque con cabecera:

```css
/* ============================================================
   NOMBRE DEL MODULO (pages/x.astro)
   ============================================================ */
```

No hay `tailwind.config.js`: el tema vive en el `@theme` de ese archivo. No
uses `<style>` en componentes — el sitio sirve **una sola hoja de estilos** y
eso no se negocia.

Móvil primero, y los breakpoints del sitio son **768** y **1024**. Agrupa los
`@media` al final del bloque del módulo, como hacen los demás.

## Reglas que ya rompieron cosas

- **Capas de Tailwind v4.** Un `.x { display: flex }` sin capa gana a
  `@layer utilities` y a preflight, así que anula a `.hidden` y a `[hidden]`.
  Si una pieza se oculta con `hidden`, declara la combinación:
  `.mi-boton[hidden] { display: none; }`. Nunca `!important`.
- **Tamaño mínimo automático en flex.** Un item flex con `aspect-ratio` se
  estira hasta el contenido. Necesita `min-height: 0` (y `flex: 0 0 auto`).
  Esto descuadró las tarjetas de `/aves/`.
- **Astro borra `<script src="…">` externo** salvo que lleve `is:inline`.
- **Nada de emojis como iconos.** SVG en línea, `stroke-width="2.2"`,
  `stroke-linecap="round"`. No dependemos de la fuente de emoji del sistema.
- **Cero peticiones a terceros** en `BaseLayout`: ni CDN, ni Google Fonts. Las
  excepciones ya existentes (Maps, ePayco, Web3Forms) viven en su página.
- **Enlaces internos con barra final** (`/sendero/`). Sin ella hay 404 en
  producción.
- **Imágenes**: AVIF q55 al ancho real de presentación, ruta absoluta bajo
  `public/`, con `width`/`height` y `loading="lazy" decoding="async"`.
  `public/_headers` las cachea un año como inmutables → una imagen que cambia
  necesita **nombre nuevo**. Se referencian de 7 formas distintas (incluido
  `bg-[url()]`, que se compila dentro del CSS y no aparece en el HTML):
  antes de renombrar o borrar, búscalas todas.
- **Comentarios y mensajes de commit en español**, sin tildes, como el resto.

## JS de cliente

Un `<script>` al final de la página, con el patrón de siempre:

```astro
<script>
  function initX() {
    const dlg = document.getElementById("…");
    if (!dlg) return;
    if (dlg.dataset.listo === "1") return;   // idempotente
    dlg.dataset.listo = "1";
    …
  }
  initX();
  document.addEventListener("astro:page-load", initX);
</script>
```

Las view transitions no están activas, así que el listener es inerte — se pone
igual, por coherencia. El lightbox de fotos es un `<dialog>` nativo: cópialo
tal cual de `src/pages/galeria.astro`, ya está resuelto (teclas, click fuera,
navegación). Marquesinas y revelados son **CSS**, no JS.

## No tocar

- **Pagos ePayco** en `vinculate.astro` y `sendero/rv-gratis.astro`: llave
  pública en línea con `test: false`, son **cobros reales**. Los `id` de los
  botones los enlaza el script y `rv-gratis` solo los enlaza si
  `window.innerWidth < 768` — el corte de `.pago-movil` / `.pago-escritorio`
  tiene que seguir coincidiendo con ese 768. Importes, ids y URL de retorno:
  pregunta antes de arreglarlos.
- **`public/tour-360/`**: bundle de terceros embebido en un iframe. No se edita
  a mano; sus errores de consola son suyos.
- **Formulario Web3Forms** de `contactanos.astro`: su guard siempre es falso y
  el formulario corre en modo demo. Arreglarlo es una tarea aparte.

## Al añadir un módulo nuevo

Una página que nadie puede alcanzar no está terminada:

1. **Header** — añade el enlace a `programas` (como hijo del área que le
   corresponda) o a `enlaces`, en el frontmatter de `layout/Header.astro`.
   Escritorio y móvil salen del mismo array.
2. **Footer** — `<a href="/ruta/" class="foot-link">Nombre</a>` en la columna
   que toque.
3. **Assets** — las imágenes nuevas, AVIF q55 al ancho real, bajo `public/`.
   Los PDF y descargas, en `public/docs/`.
4. **BaseLayout** — `title`, `description`, `preloadImage` y `ogImage`.
5. Verifica (abajo) y haz commit con mensaje en español.

## Verificación (siempre, antes de dar algo por hecho)

```sh
pnpm build && node scripts/check-assets.mjs   # todas las referencias resuelven
pnpm preview                                  # y revisa en navegador real
grep -c 'rel="stylesheet"' dist/<ruta>.html   # = 1
```

En navegador, a **390 / 768 / 1440**: 0 px de desborde horizontal, sin errores
de consola, foco visible con teclado. `scripts/capturas.sh` hace las capturas.

Dos falsos positivos conocidos: el `<img src="">` del lightbox dentro de un
`<dialog>` cerrado (`/galeria/`, `/aves/`, `/sendero/`), y el ruido de consola
del bundle `tour-360` en `/sendero/rv-gratis/`.

Contraste: verde sobre papel solo con `esmeralda-700` / `--color-esmeralda-ink`;
sobre `selva-900`, blanco o lima.

## Referencia

- `referencia/tokens.md` — colores, tipografía, utilidades y catálogo de clases.
- `referencia/componentes.md` — props de cada componente y layout.
- `referencia/plantillas.md` — esqueletos listos para copiar (lista numerada,
  rejilla de tarjetas, lightbox, ficha de datos, cita destacada).
