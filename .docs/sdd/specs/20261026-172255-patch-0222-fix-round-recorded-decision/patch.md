---
id: 20261026-172255-patch-0222-fix-round-recorded-decision
task: 0222
title: Patch — una pasada de fix que aplica una decisión registrada sigue con la enmienda marcada
type: patch
solution: dev-lead
status: done
created: 2026-10-26
branch: patch/0222-fix-round-recorded-decision
commit: <hash>
---

# Patch 0222 — una pasada de fix que aplica una decisión registrada sigue con la enmienda marcada

## Capacidades

- Modificadas: `control-profiles` — «Un cambio a la spec aprobada es un desvío» gana el caso de la decisión registrada

## 1. Síntoma

- «La pasada de fix añadió un AND a la spec en `delegate` sin parar» ([ticket de la feature 0211](../../field-reports/20261026-144343-feature-0211-session-clock-gaps.md) §6): el AND hacía explícita una decisión del dev-lead ya escrita en la spec; el agente lo registró como enmienda «sin aprobar» y siguió. «El kit no distingue ese caso.»
- «"Lo que deja abierto" la re-revisión no dice qué hacer si lo abierto es un desvío de la spec» ([ticket de la feature 0213](../../field-reports/20261025-203243-feature-0213-campaign-control.md) §3): un Important nuevo (las marcas en seco en `RUNS_DIR/dry/live`, contra la decisión 4 de la spec) se adjudicó con `Final: Ruling:` y no paró.

## 2. Solución fijada

Dev-lead, 2026-10-26, al triar el ticket de la 0211: «Sigue con la enmienda marcada». La fila 0222 del roadmap la concreta: en `pair` y `delegate`, un AND o un THEN que una pasada de fix añade o cambia y que aplica literal una línea de «Decisiones tomadas con el dev-lead» no para: se escribe como enmienda «sin aprobar» y se nombra en ✋; si cambia un valor o añade algo que el dev-lead no decidió, para como desvío, como hoy. En `sdd-verify` «What it leaves open», un Important o un Minor abierto que es un desvío no se adjudica con un ruling.

Lo que da por existente, comprobado: `skills/sdd-implement/SKILL.md:299` (punto «Deviation» de «Deviations and rulings», que manda parar ante un AND de una ronda de REFACTOR o de fix) y `skills/sdd-verify/SKILL.md:238-241` («What it leaves open», que adjudica todo Important o Minor y solo para un Critical cuyo arreglo cambia la spec).

## 3. Fix

- **Fichero(s)**: `skills/sdd-implement/SKILL.md` («Deviations and rulings»), `skills/sdd-start-feature/references/control-profiles.md` (§Desvío, que también manda parar), `skills/sdd-templates/templates/spec-template.md` («Enmiendas»: el caso de `sin aprobar`), `tests/batteries/sdd-implement/` (`k3`), `tests/batteries/sdd-verify/` (`c6`), `tests/sdd-deviations-0222-red.md`.
- **Cambio**: el punto del desvío de `sdd-implement` y §Desvío de `control-profiles.md` ganan un caso que sigue: un AND o un THEN de la ronda que solo aplica, literal, una línea de «Decisiones tomadas con el dev-lead» se escribe en su sitio con su enmienda `sin aprobar`, se commitea con la ronda y se nombra en ✋; un valor, un caso o un texto que esa línea no dice para (contraejemplo: el `k2` de siempre). `sdd-verify` no cambia: su RED salió limpio. Retira: nada; la regla es una cláusula sobre el punto que ya existía, y `WordBudget` la absorbe dentro de su margen (`sdd-implement` 9.553 palabras con tope 9.483 × 1,25).
- **Decisiones**:
  - Un AND o un THEN de una pasada de fix que aplica literal una decisión registrada del dev-lead sigue, como enmienda «sin aprobar» nombrada en ✋ — dev-lead
  - Un Important o un Minor que deja abierto la re-revisión y que es un desvío no se adjudica: para como desvío — dev-lead
  - La mitad de `sdd-verify` se recorta: RED `c6` 2/2 limpio; `c6` queda como regresión y el caso de campo de la 0213, a deuda como posible falso negativo — dev-lead («Recortar», 2026-10-26)
  - Los escenarios `k3` (molde `kit`, la 0021 con la decisión «no se sobrescribe sin confirmar») y `c6` (la 0010 con un Important abierto que cambia el literal de `canceladas`); `k2` repite en el GREEN como control del contraejemplo — sin el dev-lead (método de prueba, no lo ve el usuario)

## 4. Verificación

| # | Caso | Resultado |
| --- | --- | --- |
| 1 | RED `k3` ×2 (kit de la apertura) | ❌ 0/2: los dos esconden el AND en un `Ruling:` (`red/out/`) |
| 2 | RED `c6` ×2 | ✅ 2/2 limpio: paran con 🦆 y la enmienda sin commitear → no se escribe guía en `sdd-verify` |
| 3 | GREEN `k3` ×2 (texto de la rama) | ✅ 2/2: commit con el AND, «Enmiendas» `sin aprobar` y ✋ (`green/out/`) |
| 4 | Control `k2` ×2 (sin decisión registrada) | ✅ 2/2: no commitean la regla que la spec no tiene |
| 5 | Gate de cierre | <pendiente> |

## 5. Tiempo (ligero)

- Estimación: 1,5 h + 0,48 h del gate de cierre (29 min, patch 0220)
- Inicio: 2026-10-26T17:22Z
- Esfuerzo real:
- Coste de sujetos:

## 6. Delta de capacidad

### Capacidad: `control-profiles`

**MODIFIED — Un cambio a la spec aprobada es un desvío**
- GIVEN la spec aprobada de cancelar reservas, con la Task 1 cerrada y la Task 2 en curso, que descubre que la spec pide guardar el motivo de la cancelación y la tabla de reservas no tiene ese campo
- WHEN el trabajo exige cambiar un requisito, un THEN, el Scope, un «No entra» o «Dónde se prueba»
- THEN en `pair` y `delegate` el agente para con el 🦆 del cambio y su ✋, deja escrito sin commitear el THEN corregido en su sitio de la spec y la línea en `## Enmiendas`, y espera la aprobación
- AND con la aprobación, commitea la spec y sigue implementando; si la enmienda obliga a cambiar la Task 1, ya cerrada (guardar quién cancela con `--por <nombre>`), añade al plan `Task 3 — enmienda <fecha>: guardar quién cancela` con su `Tras` y anota en `tasks.md` la Task 1 como `afectada por enmienda <fecha> → Task 3`; si solo cambia la Task 2 en curso (quitar «quién canceló» del listado), el trabajo sigue en la Task 2, con la nota de la enmienda
- AND la Task 1 no se reabre ni se reescribe su commit; una task nueva no se da por hecha sin su verificación ni su `sdd task done`
- AND sin aprobación no sigue con la enmienda
- AND la misma acción se aplica cuando la respuesta a un freno de alcance cambia el texto de la spec; si no lo cambia, la respuesta se apunta en «Enmiendas» sin corregir nada
- AND en `unattended` elige la opción más conservadora, la aplica igual en su sitio con su línea de «Enmiendas» marcada `sin aprobar` y, si no hay opción que no bloquee, aparca la feature (`⏸️ aparcada: <motivo>`)
- AND si la enmienda añade ficheros, la entrada nombra, antes de pedir la aprobación, las features abiertas del roadmap (⏳, 🔄, ⏸️, 🧪) que declaran alguno en el «Toca:» de su brief (`ROADMAP.md`) o en «Ficheros que toca» (roadmap 2.x), o dice «solape no comprobable» si el roadmap no declara ficheros; con la aprobación, el «Toca:» o la fila de la feature añade esos ficheros
- AND con el humo de una skill fallado y una ronda de REFACTOR cuya guía nueva añade un AND a un requisito de la spec, el hilo para con el 🦆 y el ✋ antes de commitear esa guía, y no la commitea en la task en curso para pedir la aprobación en la siguiente
- AND en `pair` y `delegate`, un AND o un THEN de una ronda de REFACTOR o de fix que solo aplica, literal, una línea de «Decisiones tomadas con el dev-lead» de la spec no para: se escribe en su sitio con su línea de `## Enmiendas` marcada `sin aprobar`, se commitea con la ronda y se nombra en ✋; un valor, un caso o un texto que esa línea no dice para como desvío
