# Plantillas

Piezas ya resueltas en el sitio. Copia el markup y reutiliza la clase existente
antes de escribir CSS nuevo; si el módulo necesita su variante, clónala con su
propio prefijo (`.despertar-*`, `.ave-*`) en un bloque nuevo al final de
`global.css`.

## Cabecera de sección

```astro
<section class="banda-papel">
  <div class="wrap">
    <Encabezado
      eyebrow="Antes de venir"
      titulo="Información"
      acento="práctica"
      lead="Todo lo que necesitas saber para agendar."
      doble
      clase="reveal"
    />
    …
  </div>
</section>
```

`doble` pone el lead en una segunda columna. En `banda-oscura`, añade `claro`.

## Lista numerada con imagen (filas alternas)

Referencia viva: `.despertares` en `src/pages/sendero/index.astro`.
La numeración va en `.acento` (Fraunces) y las filas pares invierten el orden
en el `@media (min-width: 768px)` del bloque CSS.

```astro
<ol class="despertares">
  {items.map((d, i) => (
    <li class="despertar reveal">
      <button type="button" class="tile despertar-img" data-abre-foto={i}
              aria-label={`Ampliar: ${d.alt}`}>
        <img src={d.imagen} alt={d.alt} width="1152" height="1440"
             loading="lazy" decoding="async" />
        <span class="despertar-lupa">…svg lupa…</span>
      </button>
      <div class="despertar-cuerpo">
        <span class="despertar-n acento">{String(i + 1).padStart(2, "0")}</span>
        <h3>{d.titulo}</h3>
        <span class="chip chip-lima">{d.subtitulo}</span>
        <p>{d.texto}</p>
      </div>
    </li>
  ))}
</ol>
```

## Rejilla de tarjetas

Con `Tile`, que ya trae imagen a sangre, degradado, chip y flecha:

```astro
<div class="hub-tarjetas reveal">
  {tarjetas.map((t) => (
    <Tile href={t.href} imagen={t.imagen} alt={t.alt} ancho={800} alto={600}
          chip={t.chip} titulo={t.titulo} texto={t.texto}
          enlaceTexto="Ver más" clase="hub-tile" />
  ))}
</div>
```

## Ficha de datos con icono

`.visita-datos` / `.dato-visita` (sendero) o `.datos` / `.dato` (portada).
Los iconos son SVG en línea elegidos por una clave del array —
`stroke-width="1.9"`, 20×20 — **nunca emojis**:

```astro
<div class="visita-datos reveal">
  {practica.map((p) => (
    <div class="dato-visita">
      <span class="dato-visita-ico">
        {p.icono === "reloj" && (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></svg>)}
        …
      </span>
      <span class="dato-visita-texto">
        <span class="dato-visita-etiqueta">{p.etiqueta}</span>
        <span class="dato-visita-valor">{p.valor}</span>
      </span>
    </div>
  ))}
</div>
```

## Cita destacada

```astro
<blockquote class="promesa reveal">
  <span class="eyebrow">Una promesa</span>
  <p>…</p>
</blockquote>
```

## Franja de cifras en el hero

```astro
<Hero … tamano="completo">
  <div slot="acciones">
    <a href="/contactanos/" class="btn btn-lima">Agenda tu recorrido</a>
    <a href="/sendero/rv-gratis/" class="btn btn-ghost">Verlo en 360°</a>
  </div>
  <Cifras slot="pie" cifras={[
    { valor: "2,5", unidad: " km", texto: "de sendero" },
    { valor: "5", texto: "puntos de interés" },
    { valor: "1", unidad: " h", texto: "de recorrido" },
    { valor: "5", texto: "personas por grupo", destacada: true },
  ]} />
</Hero>
```

## Lightbox de fotos

`<dialog>` nativo. El markup va **fuera de `<main>`**, justo antes del
`<Footer />`; el script, al final del archivo. Cópialo tal cual de
`src/pages/galeria.astro` — resuelve teclas, click fuera y navegación.

```astro
  <dialog id="lightbox" class="lightbox" aria-label="Fotografía ampliada">
    <button type="button" class="lightbox-cerrar" data-cierra-foto aria-label="Cerrar">…</button>
    <button type="button" class="lightbox-nav anterior" data-foto-anterior aria-label="Anterior">…</button>
    <button type="button" class="lightbox-nav siguiente" data-foto-siguiente aria-label="Siguiente">…</button>
    <img id="lightbox-img" src="" alt="" />
  </dialog>
```

Cada disparador es un `<button class="tile …" data-abre-foto={i}>` con su `img`
dentro: el script lee `src` y `alt` de esa imagen.

Aviso: el comprobador de humo marca ese `<img src="">` como imagen rota. Es un
falso positivo conocido (el `<dialog>` está cerrado).

## Caja de descarga

`.descarga` dentro de un `.grid12`; sobre banda oscura, añade `.descarga-clara`.
Referencia: el PDF de aves en `src/pages/aves.astro`.

## Marcado persistente (checkbox que recuerda)

`/aves/` guarda lo observado en `localStorage` con `try/catch` alrededor de cada
lectura y escritura, un `<input type="checkbox">` visualmente oculto (1×1 px,
`opacity: 0`, `pointer-events: none`) dentro de un `<label>`, y el estado
pintado con `:has()`:

```css
.ave-tarjeta:has(.ave-marca:checked) { border-color: var(--color-esmeralda); }
.ave-tarjeta:has(.ave-marca:focus-visible) { outline: 2px solid var(--color-esmeralda); }
```

El botón de limpiar se oculta con `hidden`, y por la capa de Tailwind hay que
declararlo: `.aves-limpiar[hidden] { display: none; }`.
