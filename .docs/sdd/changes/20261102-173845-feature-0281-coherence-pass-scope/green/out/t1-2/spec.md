---
id: 20261008-110000-feature-0011-void-others
feature: 0011
title: Anular reservas de otros
mode: full
profile: delegate
status: draft
created: 2026-10-08
author: agente con el dev-lead
approvers:
  - role: dev-lead
    name: Laura
    approved_at: null
---

# Spec — Anular reservas de otros

🦆 Hoy cualquiera puede anular cualquier reserva. Con este cambio, `anular Norte lun --como Luis` responde «solo Ana anula reservas de Norte» y la reserva sigue activa, y solo `anular Norte lun --como Ana` la anula. Quién responde de cada sala se lee de un fichero nuevo, `data/managers.json`, y `anular` pasa a exigir `--como NOMBRE` para saber quién lo ejecuta.

Validación: dev-lead — es un comando que usa una persona y lo que se observa son respuestas de la terminal que el agente no puede juzgar por sí solo.

## Capacidades

- Nuevas: `room-managers` — quién es responsable de cada sala.
- Nuevas: `bookings` — anular una reserva: hoy no existe en `capabilities/` (el comportamiento está solo en el código), así que el requisito entra como `ADDED`, no como `MODIFIED`.

## ✋ Decisiones que he tomado yo — valida estas

Review de spec propuesta: ninguna — señales: capacidad nueva (`room-managers`, `bookings`), datos (`data/managers.json`), regla de permiso (quién anula) = 3 de 8 · tamaño: ~30 líneas en 3 ficheros
- Mínimo razonable: ninguna — deja sin mirar que `anular` sin `--como` y la sala sin responsable (decisiones 5 y 6) cubran todos los casos; los lees tú en este gate.

1. Capacidad nueva `room-managers`, con los responsables en `data/managers.json` (`{"Norte": "Ana", "Sur": "Luis"}`).
2. Quien ejecuta el comando se identifica con `--como NOMBRE`.
3. **Solape con la fila 0009 del roadmap** («Responsables de sala: quién responde de cada sala y qué puede hacer», ⏳, anterior a esta): `docs/config.md` dice que «quién es cada uno y su fichero los define la 0009». Esta spec los define aquí (decisiones 1 y 2) para no depender de ella. Si prefieres que los defina la 0009, pide cambios: `room-managers` y el fichero salen de esta spec y la 0011 queda detrás de la 0009.
4. `bookings` entra como capacidad nueva con `ADDED`, no `MODIFIED`: `capabilities/` está vacía y `sdd capability merge` rechazó el `MODIFIED` («`bookings` no tiene fichero en capabilities/»).
5. `anular` sin `--como` responde «indica quién anula: usa --como seguido de tu nombre» y no anula nada (texto mío).
6. Una sala con reserva pero sin responsable en el fichero, o sin fichero, responde «Sur no tiene responsable» (con `<sala>` en su sitio) y no anula (texto mío).
7. También se rechaza a quien anula su propia reserva si no es el responsable: para eso existe `cancelar`, que sigue igual (`PRODUCT.md`: Cancelación = la anula el propio cliente; Anulación = la anula el responsable). Así `anular` no necesita saber de quién es la reserva.
8. Si no hay reserva activa, `anular` sigue respondiendo «sin reserva Norte mar» sin mirar quién lo pide (comportamiento actual intacto).

- Política de modelos: ningún revisor de spec · ejes de la revisión final: Spec opus+high, Código sonnet+high, Arquitectura según el plan · otros despachos en paralelo: ninguno · en paralelo hasta `control.maxParallelAgents` — al aprobar la spec, esta línea es la confirmación de paralelizar que pidan las instrucciones del usuario; lo que no nombra se confirma aparte.
- Fusión de prueba (`sdd capability merge` sobre una copia de `.docs/sdd` en temp; `capabilities/` del repo sin tocar): exit 0 · `room-managers.md`: añadido «Cada sala tiene un responsable» y sus cinco reglas · `bookings.md`: añadido «Anular una reserva». El primer intento falló por el `MODIFIED` de `bookings` y por un `<nombre>` dentro de un literal: corregidos (decisiones 4 y 5).

### Decisiones tomadas con el dev-lead

- (ninguna: la entrevista no ha recogido frases literales)

## Intent

Hoy cualquiera anula cualquier reserva. Solo el responsable de cada sala debe poder anular las reservas de otras personas. Éxito: `anular Norte lun --como Luis` no cambia nada y lo dice; `anular Norte lun --como Ana` anula. Fracaso aunque funcione: que `anular` sin `--como` anule, o que una sala sin responsable deje anular a cualquiera.

## Scope

- Entra: `anular <sala> <día> --como NOMBRE` (`src/app.js`: `voidBooking`, y el despacho de `run`); `data/managers.json`; `docs/config.md` (las dos líneas que hoy dicen «Hoy no hay ninguno» y «aún no hay… los define la 0009»); un test nuevo para `anular` junto a `test/cancel.test.js`.
- No entra: cancelar la propia reserva (`cancelar`), que sigue igual; `PRODUCT.md` (el término «Anulación» ya dice lo que esta spec implementa); qué más puede hacer el responsable, que es de la 0009.

## Lo que se retira o cambia de forma

| Qué | Dónde aparece | Destino |
| --- | --- | --- |
| `anular <sala> <día>` sin identidad: pasa a exigir `--como` | `src/app.js:20-25` (`voidBooking`) y `src/app.js:31` (`run`) | Scope y delta de `bookings` |
| «`data/`: … Hoy no hay ninguno» | `docs/config.md:3` | Scope: pasa a nombrar `data/managers.json` |
| «Responsables de sala: aún no hay; … los define la 0009» | `docs/config.md:4` | Scope y decisión 3 |
| Término «Anulación» (la anula el responsable de sala) | `PRODUCT.md:12` | Sin cambio: ya coincide con el delta (No entra) |

- Filas que implementa: 0011 → `roadmap.md:9` (su fila) y `docs/config.md:4` («la define la 0009», solape con la fila 0009, `roadmap.md:8`) y su destino, la decisión 3.

## Approach

`anular` lee `data/managers.json` y rechaza a quien no es responsable de la sala.

## Dónde se prueba

- Anular como responsable o como otra persona, sin `--como` y en sala sin responsable: llamando a `run('anular', [...])`, como los tests de `test/cancel.test.js`.
- `room-managers`: el mismo `run`, por el efecto en `anular` (no hay otro comando que pregunte el responsable).

## Términos y ADR

- Términos resueltos: ninguno
- ADR candidatas: ninguna

## Delta de comportamiento

### Capacidad: `room-managers`

#### ADDED — Cada sala tiene un responsable

- GIVEN `data/managers.json` con `{"Norte": "Ana", "Sur": "Luis"}`
- WHEN se pregunta el responsable de Norte
- THEN es Ana

#### Reglas de la capacidad — room-managers

- **Dónde viven los datos**: `data/managers.json`, un objeto `{"<sala>": "<nombre>"}`
- **Idioma de los nombres**: no aplica
- **Límites**: un responsable por sala
- **Avisos**: no aplica
- **Regla ante conflicto**: no aplica

### Capacidad: `bookings`

#### ADDED — Anular una reserva

- GIVEN la reserva de Norte del lunes, de Pedro, y `data/managers.json` con `{"Norte": "Ana", "Sur": "Luis"}`
- WHEN `anular Norte lun --como Luis`
- THEN responde «solo Ana anula reservas de Norte» y la reserva sigue activa
- AND `anular Norte lun --como Ana` responde «anulada Norte lun»
- AND `anular Norte lun --como Pedro` responde «solo Ana anula reservas de Norte»
- AND `anular Norte lun` responde «indica quién anula: usa --como seguido de tu nombre» y la reserva sigue activa
- AND con la reserva de Sur del martes y `data/managers.json` sin Sur (o sin fichero), `anular Sur mar --como Ana` responde «Sur no tiene responsable» y la reserva sigue activa
- AND `anular Norte mar --como Luis`, sin reserva ese día, responde «sin reserva Norte mar»

## Enmiendas

- (ninguna)

## Aprobaciones

| Rol | Nombre | Fecha | Estado |
| --- | --- | --- | --- |
| dev-lead | Laura | | pendiente |
