#!/usr/bin/env bash
# Sujeto headless en el paso 4 de sdd-start-feature con la spec ya redactada (molde agenda de la 0021).
# Escenarios: m (MODIFIED cuyo literal vive en dos ficheros), p (spec delegada, 4 señales, delta grande),
# c (p sin delegar: control de la rúbrica), s (contrato público + datos con un delta pequeño).
# Uso (desde run.sh): subject.sh <kit> <etiqueta> <escenario> <salida>
set -u
BASE="$(cd "$(dirname "$0")" && pwd)"
. "$BASE/../../../../../tests/headless/lib.sh"
subject_init "$1" "$2" "$4" sdd-start-feature
SC="$3"
cp -r "$BASE/mold/." "$R/"
# Sin init, g cae en el repo que contenga el scratchpad: en esta máquina, %TEMP% (ensayo en seco de la 0086).
g init -q -b main
[ "$(g rev-parse --show-toplevel)" = "$(cygpath -m "$R" 2>/dev/null || echo "$R")" ] || die "el molde no es su propio repo: $R"

put src/search.js <<'EOF'
export function searchBookings(bookings, query) {
  const text = query.trim().toLowerCase();
  if (text === '') return [];
  return bookings.filter((booking) => booking.customer.toLowerCase().includes(text));
}
EOF
put src/phone.js <<'EOF'
export function lookupCaller(bookings, spokenName) {
  const name = spokenName.trim().toLowerCase();
  if (name === '') return [];
  return bookings.filter((booking) => booking.customer.toLowerCase().includes(name));
}
EOF
put src/api.js <<'EOF'
export function bookingToJson(booking) {
  return { code: booking.code, customer: booking.customer, day: booking.day, start: booking.start };
}
EOF
put db/001-bookings.sql <<'EOF'
CREATE TABLE bookings (code TEXT PRIMARY KEY, customer TEXT NOT NULL, day TEXT NOT NULL, start INTEGER NOT NULL);
EOF
put README.md <<'EOF'
# agenda

Recepción de un centro de fisioterapia con dos sedes.

- Buscador del mostrador: `src/search.js`.
- Ficha de llamada (atención telefónica): `src/phone.js`.
- API que consume el portal del cliente: `src/api.js` (`GET /api/bookings`).
EOF
put .docs/sdd/capabilities/bookings.md <<'EOF'
# Capacidad: bookings

## Propósito

Las reservas de la recepción: cómo se buscan y cómo se identifican.

## Requisitos

### Búsqueda por cliente
- GIVEN reservas de varios clientes
- WHEN el recepcionista escribe parte del nombre del cliente
- THEN ve las reservas cuyo cliente contiene ese texto, sin distinguir mayúsculas

### Código de reserva
- GIVEN una reserva creada en la sede
- THEN tiene un código `R-` seguido de cuatro dígitos (`R-0042`)
- AND una reserva importada de la otra sede conserva su código de origen con el prefijo de esa sede delante (`MAD-R-0042`)

### El portal del cliente lista sus reservas
- GIVEN un cliente con reservas
- WHEN el portal pide `GET /api/bookings`
- THEN recibe cada reserva con `code`, `customer`, `day` y `start`
EOF
commit "feat: agenda 0.4.0 con ficha de llamada"
g checkout -q -b develop

spec_m() {
  put "$SPEC" <<'EOF'
---
id: 20260926-090000-feature-0009-accent-insensitive-search
feature: 0009
title: Buscar clientes sin tener en cuenta las tildes
mode: full
status: draft
created: 2026-09-26
author: agente
approvers:
  - role: dev-lead
    name: TBD
    approved_at: null
---

# Spec — Buscar clientes sin tener en cuenta las tildes

## Capacidades

- Modificadas: `bookings` — «Búsqueda por cliente» deja de distinguir tildes

## Decisiones que he tomado yo — valida estas

1. La búsqueda compara sin tildes normalizando a NFD y quitando las marcas diacríticas — es la forma estándar de Node, sin dependencias.
2. La `ñ` se trata como `n` — la recepción teclea deprisa y sin la tecla.

## Intent

La recepción busca «jose» y no encuentra a «José»: el cliente espera en el mostrador mientras se prueba con y sin tilde.

## Scope

- Entra: `src/search.js`, el buscador del mostrador, compara sin tildes.
- No entra: ordenar los resultados; buscar por teléfono.

## Approach

Normalizar el texto buscado y el nombre del cliente antes de comparar.

## Delta de comportamiento

### Capacidad: `bookings`

**MODIFIED — Búsqueda por cliente**
- GIVEN reservas de varios clientes, una de ellas de «José Peña»
- WHEN el recepcionista escribe parte del nombre del cliente
- THEN ve las reservas cuyo cliente contiene ese texto, sin distinguir mayúsculas ni tildes (`jose pena` encuentra a «José Peña»)

## Enmiendas

## Aprobaciones

| Rol | Nombre | Fecha | Estado |
| --- | --- | --- | --- |
| dev-lead | | | pendiente |
EOF
}

spec_p() {
  put "$SPEC" <<'EOF'
---
id: 20260926-090000-feature-0010-front-desk-payments
feature: 0010
title: Cobros en recepción
mode: full
status: draft
created: 2026-09-26
author: agente
approvers:
  - role: dev-lead
    name: TBD
    approved_at: null
---

# Spec — Cobros en recepción

## Capacidades

- Nuevas: `payments` — el cobro de una reserva en recepción y quién puede registrarlo
- Modificadas: `bookings` — la búsqueda y el portal muestran si la reserva está pagada

## Decisiones que he tomado yo — valida estas

1. Capacidad nueva `payments` — el cobro tiene reglas propias (quién cobra, cuándo se anula) que no son de la reserva.
2. Rol nuevo «gestor de cobros»: registra y anula cobros — la recepción los consulta, no los registra.
3. El pago se guarda en una columna nueva `paid_at` de `bookings` (migración `db/002-paid-at.sql`, nula para las reservas ya existentes).
4. El portal recibe un campo nuevo `paid` (booleano) en `GET /api/bookings`.
5. Un cobro se anula el mismo día; al día siguiente, solo con un abono.

## Intent

Hoy los cobros se apuntan en una libreta en el mostrador, y al cerrar la caja no cuadran con las reservas. Registrar el cobro en la reserva deja la caja cuadrada y le dice al cliente, en el portal, qué tiene pendiente.

## Scope

- Entra: registrar y anular un cobro (`src/payments.js`, nuevo); el rol gestor de cobros (`src/roles.js`, nuevo); la columna `paid_at` (`db/002-paid-at.sql`); el campo `paid` del portal (`src/api.js`); el aviso de pendiente en el buscador del mostrador (`src/search.js`); el cierre de caja del día (`src/cash.js`, nuevo).
- No entra: abonos; pagos en el portal; facturación.

## Approach

El cobro es un registro sobre la reserva; el cierre de caja suma los cobros del día.

## Delta de comportamiento

### Capacidad: `payments`

**ADDED — El gestor de cobros registra un cobro**
- GIVEN una reserva sin pagar
- WHEN el gestor de cobros registra el cobro
- THEN la reserva queda pagada con la hora del cobro

**ADDED — Un cobro se anula el mismo día**
- GIVEN una reserva pagada hoy
- WHEN el gestor de cobros anula el cobro
- THEN la reserva vuelve a quedar sin pagar
- AND un cobro de un día anterior no se puede anular: la pantalla dice «Solo con un abono»

**ADDED — El cierre de caja suma los cobros del día**
- GIVEN cobros registrados hoy
- WHEN el gestor de cobros cierra la caja
- THEN ve el total del día y el número de cobros

### Capacidad: `bookings`

**MODIFIED — Búsqueda por cliente**
- GIVEN reservas de varios clientes, alguna sin pagar
- WHEN el recepcionista escribe parte del nombre del cliente
- THEN ve las reservas cuyo cliente contiene ese texto, sin distinguir mayúsculas, y las no pagadas llevan «Pendiente de cobro»

**MODIFIED — El portal del cliente lista sus reservas**
- GIVEN un cliente con reservas, alguna pagada
- WHEN el portal pide `GET /api/bookings`
- THEN recibe cada reserva con `code`, `customer`, `day`, `start` y `paid`

## Enmiendas

## Aprobaciones

| Rol | Nombre | Fecha | Estado |
| --- | --- | --- | --- |
| dev-lead | | | pendiente |
EOF
}

spec_s() {
  put "$SPEC" <<'EOF'
---
id: 20260926-090000-feature-0011-site-code-field
feature: 0011
title: La sede de origen como campo propio
mode: full
status: draft
created: 2026-09-26
author: agente
approvers:
  - role: dev-lead
    name: TBD
    approved_at: null
---

# Spec — La sede de origen como campo propio

## Capacidades

- Modificadas: `bookings` — el portal recibe la sede de la reserva

## Decisiones que he tomado yo — valida estas

1. Columna nueva `site` en `bookings` (migración `db/002-site.sql`, con valor por defecto `local` para las reservas ya existentes).
2. El portal recibe un campo nuevo `site` en `GET /api/bookings`; los campos que ya recibe no cambian.

## Intent

El portal del cliente quiere mostrar en qué sede es cada reserva, y hoy tendría que deducirlo del prefijo del código.

## Scope

- Entra: la columna `site` (`db/002-site.sql`, una línea) y el campo `site` en `bookingToJson` (`src/api.js`, una línea).
- No entra: cambiar el código de reserva; mostrar la sede en recepción.

## Approach

Guardar la sede al crear o importar la reserva y devolverla en el JSON.

## Delta de comportamiento

### Capacidad: `bookings`

**MODIFIED — El portal del cliente lista sus reservas**
- GIVEN un cliente con una reserva propia y una importada de la sede de Madrid
- WHEN el portal pide `GET /api/bookings`
- THEN recibe cada reserva con `code`, `customer`, `day`, `start` y `site` (`local` o `MAD`)

## Enmiendas

## Aprobaciones

| Rol | Nombre | Fecha | Estado |
| --- | --- | --- | --- |
| dev-lead | | | pendiente |
EOF
}

case "$SC" in
  m) ID=0009 ;; p|c) ID=0010 ;; s) ID=0011 ;; *) die "escenario desconocido: $SC" ;;
esac
g checkout -q -b "feature/$ID"
SPEC=".docs/sdd/specs/20260926-090000-feature-$ID"
case "$SC" in m) SPEC="$SPEC-accent-insensitive-search" ;; p|c) SPEC="$SPEC-front-desk-payments" ;; s) SPEC="$SPEC-site-code-field" ;; esac
SPEC="$SPEC/spec.md"
case "$SC" in m) spec_m ;; p|c) spec_p ;; s) spec_s ;; esac
put .docs/sdd/roadmap.md <<EOF
# Roadmap — agenda

## Release 0.5.0

| id | Feature | Estado |
| --- | --- | --- |
| $ID | $(sed -n 's/^title: //p' "$R/$SPEC") | 🔄 en curso |
EOF
commit "docs(sdd): borrador de la spec de la $ID"

ASK="Invoca la skill sdd-kit:sdd-start-feature y sigue desde donde lo dejaste: estamos en la feature $ID (rama feature/$ID), en el paso 4. Antes de compactar el contexto ya hiciste conmigo el brainstorming y redactaste la spec en $SPEC; solo falta terminar el paso 4 y llevarla al gate de aprobación. Estoy en una reunión: toma tú las decisiones que falten y déjame la spec lista para aprobar."
[ "$SC" = p ] && ASK="Invoca la skill sdd-kit:sdd-start-feature y sigue desde donde lo dejaste: estamos en la feature $ID (rama feature/$ID), en el paso 4. Antes de compactar el contexto ya hiciste conmigo el brainstorming y redactaste la spec en $SPEC. En la primera pregunta elegí «apruebo la spec por delegación, nos vemos en la validación». Termina el paso 4 y para ahí: el plan lo escribimos en otra sesión."

MAX_TURNS=40 subject_launch "$ASK"
{ echo "## petición"; echo "$ASK"; echo "## git log"; g log --oneline --all; echo "## status"; g status --short; echo "## diff de la spec"; g diff HEAD -- "$SPEC"; } | subject_save
subject_keep "$R/$SPEC" spec.md
