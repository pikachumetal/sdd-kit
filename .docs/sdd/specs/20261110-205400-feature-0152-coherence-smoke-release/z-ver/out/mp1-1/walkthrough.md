---
id: 20261008-100000-feature-0010-cancel-reason
feature: 0010
title: Walkthrough — Motivo al cancelar
spec: ./spec.md
plan: ./plan.md
status: done
created: 2026-11-12
---

# Walkthrough — Motivo al cancelar

## 1. Cambios realizados

- **Cancelar con motivo** (`src/app.js`, `test/cancel.test.js`, b7b9132): lista cerrada de motivos (cambio de planes, sala ocupada, otro); `cancelar <sala> <día> --motivo <motivo>` valida el motivo, lo guarda en la reserva y lo devuelve en la respuesta; un motivo fuera de la lista o ausente responde «motivo no válido: …».
- **Listado de canceladas** (`src/app.js`, `test/cancel.test.js`, 7a9c950): comando `canceladas`, una línea «<sala> <día> — <motivo>» por reserva cancelada.
- **Pasada de fix de la revisión final** (`test/cancel.test.js`, juntada en el cierre): test del AND «sin `--motivo`» y vuelta del test «sin reserva», que se había perdido al reescribir el fichero.
- **Capacidad** `capabilities/bookings.md`, nueva, con los dos requisitos del delta.

## 2. Tiempo y coste: estimado vs real

- Tipo: backend
- Estimación y esfuerzo real: no aplica (el proyecto no tiene `estimation.md`)
- Compactación: no
- Modelo del hilo: Opus 5.5, effort no registrado
- Tokens de subagentes: 3 despachos — Revisión final eje Spec opus ~40k · eje Código sonnet ~32k · re-revisión opus ~35k
- Review de spec: no

## 3. Desviaciones del plan

- `tasks.md` no se escribió antes de la Task 1; se creó en la pasada de fix a partir del ledger.
- El bloque «Capacidades» de la spec decía `Modificadas: bookings`, pero `capabilities/bookings.md` no existía: `sdd capability merge` lo rechazó y pasó a `Nuevas`. El delta ya era todo ADDED; ningún requisito cambia.

### Decisiones tomadas sin el dev-lead

- --motivo antes de sala y día: no se admite; la spec fija el formato `cancelar <sala> <día> --motivo <motivo>` — quien lo ponga primero recibe «sin reserva --motivo otro»
- Motivo de varias palabras sin comillas: no se toca; lo parte el shell y la spec lo escribe entre comillas — responde «motivo no válido», un error visible
- Persistencia del motivo: fuera, es la 0014 — el motivo se pierde al cerrar el proceso, como hoy las reservas
- Informe de canceladas por sala con total: fuera, es la 0012 — ninguno
- Anulaciones del responsable: fuera, es la 0011; `voidBooking` no registra motivo — ninguno en esta feature
- Dependencia de orden del test de `canceladas`: queda como minor diferido — un reorden rompe el test, no la app
- Partir `run` en manejadores por comando: no; el eje Arquitectura no sale y son 6 ramas — crecerá con más comandos
- `bookings` como estado del módulo: diseño de la base, fuera del diff — ninguno nuevo

## 4. Verificación

### 4.1 Builds

- Gate: `node --test` → 7/7 · 0,11 s · configuración: la del gate · sobre el commit de cierre
- Revisión final: Spec opus+high, con arreglos (2 Important, 2 Minor) · Código sonnet+high, con arreglos (1 Important, 4 Minor) · Arquitectura no (plan, sin señales en el diff), sobre 7a9c950. Pasada de fix: 2 hallazgos RED→GREEN (cada test nuevo visto en rojo con una mutación del código que protege). Re-revisión opus+high: limpia.

### 4.2 Smoke / tests

- Validación en campo: 2026-11-12 · suite 7/7 · smoke 3/3 del requisito «Cancelar pide un motivo» con ejecución real de la CLI; «canceladas» con ejecución real en un mismo proceso (`run` de `src/app.js`), porque en un proceso nuevo de la CLI sale vacío: las reservas viven en memoria · revisión final Spec y Código sobre 7a9c950, re-revisión limpia

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| `cancelar Norte lun --motivo "sala ocupada"` → «cancelada Norte lun (sala ocupada)» | ejecución real (`node src/app.js …`) | ✅ |
| motivo fuera de la lista («me aburro») → «motivo no válido: cambio de planes, sala ocupada, otro» | ejecución real | ✅ |
| sin `--motivo` → «motivo no válido: cambio de planes, sala ocupada, otro» | ejecución real | ✅ |
| `canceladas` tras cancelar con «sala ocupada» → «Norte lun — sala ocupada» | ejecución real en un mismo proceso; como comando suelto de la CLI sale una línea vacía (sin persistencia, 0014) | ✅ en proceso · ⚠️ CLI suelta |

### 4.3 Residuales / deuda generada

- `canceladas` como comando suelto de la CLI sale vacío: el estado no persiste entre invocaciones → «Por triar» de `debt.md` (lo cierra la 0014).
- Minors diferidos de la revisión final:
  - Spec#3: el test del motivo no válido usa Sur mar y no el GIVEN Norte lun, así que no fija que la reserva quede intacta.
  - Spec#4 / Código#M1: `canceladas` sin canceladas imprime una línea vacía → «Por triar» de `debt.md`.
  - Código#M2: el test de `canceladas` depende del estado del primer test.
  - Código#M3: `--motivo` solo funciona después de sala y día.
  - Código#M4: un motivo no válido se informa antes que «sin reserva».

## 5. Aprendizajes

- Las reservas viven en memoria del proceso: un THEN que depende de un comando anterior (`canceladas` tras `cancelar`) no se ve por la CLI suelta; se prueba en un mismo proceso hasta la 0014 → `steering/architecture.md`

Retro: error que cazaría un chequeo → ticket del kit: la spec se aprobó declarando `Modificadas: bookings` sin `capabilities/bookings.md`, y `sdd capability check` solo lo cazó en el cierre; correrlo al aprobar la spec lo habría parado allí

## 6. Adendas
