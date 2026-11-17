---
id: 20261008-100000-feature-0010-cancel-reason
feature: 0010
title: Walkthrough — Motivo al cancelar
spec: ./spec.md
plan: ./plan.md
status: done
created: 2026-11-11
---

# Walkthrough — Motivo al cancelar

## 1. Cambios realizados

- `src/app.js`: `cancelar <sala> <día> --motivo <motivo>` valida el motivo contra la lista cerrada (cambio de planes, sala ocupada, otro), lo recorta de espacios y lo guarda con la reserva cancelada (`2aeeb7b`). El comando `canceladas` lista sala, día y motivo (`ffc40b2`).
- Pasada de fix de la revisión final: el motivo con espacios alrededor (`"otro "`) ya se reconoce, con su test `cancelar con un espacio tras el motivo`.
- Cambio fuera del spec: `canceladas` sin ninguna cancelada responde «sin canceladas» en lugar de una línea vacía (sin escenario en el spec ni test propio, ver 4.3).
- `test/cancel.test.js`: 4 tests. Capacidad nueva `capabilities/bookings.md` con los dos requisitos de la feature.

## 2. Tiempo y coste: estimado vs real

- No aplica: el proyecto no tiene `.docs/sdd/steering/estimation.md`.

## 3. Desviaciones del plan

- _Ninguna_ en las tasks. Dos cosas del cierre que no estaban en el plan:
  - `bookings` figuraba en «Modificadas» pero no tenía fichero en `capabilities/`; el fusionador no podía seguir. Pasó a «Nuevas» (enmienda del spec).
  - La pasada de fix de la revisión final trajo `src/app.js` de CRLF a LF entero: ~96 líneas de ruido, el cambio real son 5.

### Decisiones tomadas sin el dev-lead

- `bookings` pasa de «Modificadas» a «Nuevas» en el spec aprobado, con su decisión nº 4 y su enmienda «sin aprobar» — lo exige `sdd capability merge`; el coste si está mal es que el dev-lead quiera otro nombre o alcance para la capacidad, y se renombra antes del release.
- La capacidad `bookings` recoge solo los dos requisitos de esta feature; lo que ya hacían `libres`, `reservar` y `cancelar` sin motivo no se documenta aquí — coste: la capacidad queda parcial hasta que otra feature la complete.
- Los tres Minor de la re-revisión se difieren (`review.minors` no está en `fix`) y pasan a la deuda «Por triar».

## 4. Verificación

### 4.1 Builds

- `node --test` → 6 tests, 6 pasan, 0 fallan, ~90 ms, ejecutado por el agente.
- Gate: `node --test` → suite: corrió 6/6 · ~0,09 s · configuración: la del gate · sobre el commit de cierre

### 4.2 Smoke / tests

- Validado: 2026-11-11 · «probé cancelar con motivo y sale en canceladas» (lo dijo el dev-lead, según lo transmite el usuario) · no detalló en qué entorno lo probó

<!-- cspell:ignore canceladas -->

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| `cancelar Norte lun --motivo "sala ocupada"` → «cancelada Norte lun (sala ocupada)» | ejecución real (`node src/app.js` y `run()`) · reportado por el dev-lead | ok |
| un motivo fuera de la lista → «motivo no válido: cambio de planes, sala ocupada, otro» | ejecución real (`run('cancelar', ['Norte','lun','--motivo','me aburro'])`) | ok |
| sin `--motivo` → la misma respuesta | ejecución real (`node src/app.js cancelar Norte lun`) | ok |
| `canceladas` tras cancelar → «Norte lun — sala ocupada» | ejecución real **en un solo proceso** (`run()` encadenado) · reportado por el dev-lead | ok en un proceso; por la CLI, en procesos separados, **no se ve** (ver 4.3) |
| `canceladas` sin canceladas → «sin canceladas» (fuera del spec) | ejecución real (`node src/app.js canceladas`) | ok, sin escenario ni test |

### 4.3 Residuales / deuda generada

- **El motivo no persiste entre procesos.** Las reservas viven en memoria de `src/app.js`: `node src/app.js cancelar …` y después `node src/app.js canceladas` en otra invocación responde «sin canceladas». El THEN del listado solo se cumple dentro de un proceso. Lo cubre la fila 0014 «Motivo guardado». Lo dejo dicho porque «sale en canceladas» no se puede ver con dos comandos de la CLI hoy.
- Deuda a «Por triar» (ver `debt.md`): «sin canceladas» sin escenario ni test; test del motivo recortado sin camino de éxito y tests con estado compartido entre sí; `src/app.js` pasó de CRLF a LF sin `.gitattributes`.
- Revisión final: 1 Important (motivo con espacios), arreglado; re-revisión de todo el rango sin Critical ni Important, 3 Minor diferidos.

## 5. Aprendizajes

- Una capacidad que el spec da por existente se comprueba contra `capabilities/` al aprobar el spec, no al cerrar → ticket del kit (ver Retro).
- Ningún cambio de convención ni de estructura: no hay destino en `constitution.md` ni `architecture.md`.

Retro: documento o skill desmentido → ticket del kit: el spec aprobado dice «Modificadas: bookings» y esa capacidad no existía; lo cazó `sdd capability merge` al cerrar, no `sdd-propose` al aprobar
Retro: error que cazaría un chequeo → una fila de deuda en «Por triar» de .docs/sdd/steering/debt.md (src/app.js pasó de CRLF a LF entero en una pasada de fix; un `.gitattributes` o un chequeo de fin de línea lo habría evitado)

## 6. Adendas

- _Ninguna_
