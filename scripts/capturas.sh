#!/usr/bin/env bash
# Capturas de todas las rutas a tres anchos, contra `pnpm preview`.
#   ./scripts/capturas.sh [directorio-de-salida] [base-url]
set -euo pipefail

SALIDA="${1:-capturas}"
BASE="${2:-http://localhost:4321}"
CHROME="${CHROME:-/usr/bin/chromium}"

RUTAS=(
  "/" "/reserva/" "/servicios/" "/galeria/" "/contactanos/" "/vinculate/"
  "/sendero/" "/sendero/rv-gratis/"
  "/conservacion_investigacion/" "/conservacion_investigacion/herpetos/"
  "/conservacion_investigacion/aracnidos/" "/conservacion_investigacion/nutria/"
  "/educacion_ambiental/" "/educacion_ambiental/semillero_arte_ambiental/"
  "/educacion_ambiental/semillero_aves/" "/educacion_ambiental/semillero_sembradores/"
  "/emprendimientos/" "/emprendimientos/cerveza/"
  "/emprendimientos/yogurt/" "/emprendimientos/mermelada/"
)
ANCHOS=(390 768 1440)

mkdir -p "$SALIDA"
for ruta in "${RUTAS[@]}"; do
  nombre="$(echo "$ruta" | sed 's|^/||; s|/$||; s|/|_|g')"
  [ -z "$nombre" ] && nombre="inicio"
  for ancho in "${ANCHOS[@]}"; do
    "$CHROME" --headless --disable-gpu --hide-scrollbars \
      --virtual-time-budget=4000 \
      --window-size="${ancho},900" \
      --screenshot="${SALIDA}/${nombre}-${ancho}.png" \
      "${BASE}${ruta}" >/dev/null 2>&1
    echo "  ${nombre}-${ancho}.png"
  done
done
echo "Capturas en ${SALIDA}/"
