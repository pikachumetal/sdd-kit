---
id: 20261008-100000-feature-0010-cancel-reason
feature: 0010
title: Walkthrough — Motivo al cancelar
spec: ./spec.md
plan: ./plan.md
status: done
created: 2026-11-05
---

# Walkthrough — Motivo al cancelar

## 1. Cambios realizados

- **Cancelar con motivo** (`src/app.js`, commit `455e850`): `cancelar <sala> <día> --motivo <motivo>` valida el motivo contra la lista cerrada (cambio de planes, sala ocupada, otro), lo guarda con la reserva y responde `cancelada <sala> <día> (<motivo>)`. Un motivo fuera de la lista, o sin `--motivo`, responde `motivo no válido: cambio de planes, sala ocupada, otro`.
- **Listado de canceladas** (`src/app.js`, `455e850`): `canceladas` lista `<sala> <día> — <motivo>` de las reservas canceladas.
- **Recorte del motivo** (`src/app.js`, juntado en el commit de cierre): lo sacó la validación; `reasonOf` hace `?.trim()`, así que `--motivo "  sala ocupada  "` se acepta ya recortado. Su test (`test/cancel.test.js`) lo añadió la re-revisión.

## 3. Desviaciones del plan

- Dos fuera de plan: el recorte del motivo (surgió al validar, no estaba en la spec) y su test, que pidió la re-revisión porque el fix había entrado sin él. La spec no tiene enmienda del recorte (ver §4.3).

### Decisiones tomadas sin el dev-lead

- Task 2: `node --test --test-concurrency=1` en el gate, para esquivar la carrera de los tests sobre el almacén compartido en memoria — workaround hasta aislar el almacén por test — coste si es erróneo: la suite tarda el doble.

## 4. Verificación

### 4.1 Builds

- `node --test` entero (el gate de la constitución, regla 2): 6/6, tres pasadas seguidas sin flags; y con `--test-concurrency=1` del ruling, 6/6.
- Gate: `node --test` → suite: corrió 6/6 · sobre el commit de cierre.
- RED→GREEN del test del recorte: sin `?.trim()` falla con `motivo no válido: …` en lugar de `sin reserva Sur mar`; con él pasa.

### 4.2 Smoke / tests

- Validación en campo: 2026-11-05 · suite 6/6 · smoke 6/6 THEN con ejecución real (CLI y módulo) · revisión final Spec (opus+high) y Código (sonnet+high) limpias sobre la última task, re-revisión del fix de validación con un Important (fix sin test) arreglado y el resto Minor diferidos. No probado: el entorno de otra persona (CRLF/LF, ver §4.3).

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| `cancelar Norte lun --motivo "sala ocupada"` responde «cancelada Norte lun (sala ocupada)» | ejecución real (`node src/app.js`) + suite | ok, verificado por el agente |
| motivo fuera de la lista responde «motivo no válido: cambio de planes, sala ocupada, otro» | ejecución real (`--motivo "me aburro"`) + suite | ok, verificado por el agente |
| sin `--motivo` responde lo mismo | ejecución real (`cancelar Norte lun`) | ok, verificado por el agente; sin test propio (ver §4.3) |
| `canceladas` responde «Norte lun — sala ocupada» | ejecución real en el mismo proceso que cancela + suite | ok, verificado por el agente |
| motivo con espacios alrededor se acepta recortado | ejecución real (`--motivo "  sala ocupada  "`) + suite | ok, verificado por el agente |

Nada de esto lo ha probado una persona: todo es verificado por el agente.

### 4.3 Residuales / deuda generada

- **CRLF→LF de `src/app.js`**: el fix de validación convirtió el fichero entero a LF; el resto del repo está en CRLF, sin `.gitattributes`. El diff de ese fix sale de 48/48 líneas cuando el cambio real es una. → deuda del roadmap.
- **La spec no recoge el recorte**: «Enmiendas» sigue en «(ninguna)» y el escenario «Cancelar pide un motivo de la lista» no dice que los espacios alrededor se recortan. → la capacidad `bookings` nace del delta de la spec y tampoco lo dice; enmendar una spec aprobada es del dev-lead, así que va como deuda y queda dicho aquí.
- **Sin test para «sin `--motivo`»**: ya faltaba antes del fix; funciona (smoke). → deuda del roadmap.
- **Almacén compartido entre tests** (el origen del ruling de §3): → deuda del roadmap.

## 5. Aprendizajes

- El motivo se recorta antes de validarlo contra la lista → sin destino todavía: es comportamiento observable que la spec no recoge, y la capacidad `bookings` solo se fusiona desde la spec; queda en la deuda del roadmap hasta que el dev-lead enmiende la spec.
- Un fix que sale de la validación entra con su test RED→GREEN, no después → sin destino nuevo: ya lo dice la regla 2 de `constitution.md`.

Retro: error que cazaría un chequeo → un `.gitattributes` con la convención de finales de línea, sin aplicar porque renormaliza el repo y lo decide el dev-lead; queda en la deuda (.docs/sdd/roadmap.md)

## 6. Adendas

- _(ninguna)_
