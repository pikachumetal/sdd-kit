---
id: 20260927-150813-feature-0091-closing-review-edges
feature: 0091
title: Bordes del cierre frente a la revisión final
mode: lite
profile: delegate
status: approved
created: 2026-09-27
author: agente
approvers:
  - role: dev-lead
    name: Àngel Delgado (por delegación)
    approved_at: 2026-09-27
---

# Spec — Bordes del cierre frente a la revisión final

## Capacidades

- Modificadas: `feature-flow` — «El cierre no repite la revisión final de Native» (re-revisión del tramo antes del walkthrough), «Un commit del hilo posterior a la revisión final se revisa antes de la validación» (la pasada de fix no abre re-revisión)
- Modificadas: `control-profiles` — «Salir del plan es un ruling visible» (la pasada de fix de la revisión final no entra en la re-revisión del tramo)

## Decisiones que he tomado yo — valida estas

1. **Último commit revisado**: es el de la `Re-revisión:` más reciente; si no hay, el de `Pasada de fix:`; si no hay, el `sobre` de `Revisión final:`. Los pasos 7 de `sdd-start-feature` y 9 de `sdd-end-feature` comparan `HEAD` con ese commit. Así las dos piezas usan una sola regla.
2. **Línea nueva `Pasada de fix: <sha corto>, <n> hallazgos RED→GREEN`**: va debajo de `Revisión final:` en `tasks.md`, o en la presentación si no hay `tasks.md`. La pone el hilo al terminar la pasada. Hace falta porque superpowers borra el ledger (`Final: fixed …`) cuando la revisión queda limpia, y sin la línea el cierre no sabe dónde acabó la pasada.
3. **La pasada de fix no abre la re-revisión en los dos métodos**. En Native la verifica su TDD: `executing-plans` dice «Do not dispatch a re-review». En SDD ya lleva la re-revisión acotada de superpowers. Un commit del hilo posterior a la pasada sí abre la re-revisión, sobre el tramo `<pasada de fix>..HEAD`.
4. **Paso 9 del cierre antes del walkthrough**: el paso 0 manda hacer el paso 9 antes de escribir nada. El paso 9 conserva su número, porque otras skills citan los pasos 10 y 12. Las condiciones de «revisado en el hilo» (docs, menos de 20 líneas, `numstat`, `--remerge-diff`) se copian en el paso 9: el ticket 0085 §1 midió que un resumen sin ellas falla 1 de 2.
5. **Lite, recortada por el RED** (enmienda del 2026-09-27): 3 de 3 sujetos válidos (`l1` ×2, `l2-1`) despacharon el revisor final antes de la validación sacándolo del propio `SKILL.md`, así que no se escribe guía (Art. I). `l1` queda como control en el GREEN.
6. **Fuera del Scope, con motivo** (búsqueda de cada `MODIFIED` en `skills/` y `tests/`):
   - La fila de `executing-plans` en `overrides-superpowers.md` ya adopta su revisión final «tal cual», y la pasada de fix coincide con ella.
   - `commit-milestones.md` (fila «Cierre») ya junta los arreglos de la revisión final en el cierre.
   - `encargo-revision.md` ya tiene la receta de lite (`PLAN_FILE` = `spec.md`).
   - El título de «El cierre no repite la revisión final de Native» se conserva como clave de fusión.
7. **Campaña (Art. I)**. Previsión de RED y GREEN juntos: 19 sujetos Sonnet, unos 17 $ y 1,5 h de redacción. Techo en el lanzador: 24 sujetos y 22 $. El molde es el repo salas de la 0085, con el hook que deniega `Agent` y guarda el encargo.
   - RED: `e1` ×2, `e0` ×1, `r1` ×2, `r2` ×1 y `l1` ×2.
   - RED de más: `l2` ×2 (el sujeto implementa la lite y sigue solo), para mirar la pieza (3) con la condición de la 0086.
   - Pasos nuevos o cambiados y su escenario: paso 0 y paso 9 del cierre → `e1` y `e0`. Paso 7 → `r1`, `r2` y `p1`. Paso 6 (la línea `Pasada de fix:`) → `r1`, y `l1` como control del revisor final. Viñeta del ruling en `control-profiles.md` → `r1`, porque la lee quien consulta la referencia.
8. **Pester**: las anclas nuevas van en `PostFinalReview.Tests.ps1`. `NativeAdapt.Tests.ps1` no cambia: sus anclas del paso 9 («No lances otra», la línea `Revisión final:` de `tasks.md`) siguen en el texto nuevo.

### Decisiones tomadas con el dev-lead

- Las tres piezas, su alcance y el RED/GREEN con sujetos — enunciado de la sesión, «Decidido por el dev-lead (2026-09-27), antes del corte y tras la 0032 y la 0085»
- Modo lite, perfil `delegate` (del proyecto) — respuesta a la primera pregunta, 2026-09-27
- La spec se aprueba por delegación — «Lite · spec por delegación» («apruebo la spec por delegación, nos vemos en la validación»), 2026-09-27
- Recortar la pieza (3), que no falla en el RED — «Recortarla (Recomendada)», 2026-09-27 — «vamos a intentar no generar mas tikets de problemas para poder cerrar v2.0.0», 2026-09-27

## Intent

Hoy hay tres huecos:

1. El paso 9 de `sdd-end-feature` dice «No lances otra» aunque `HEAD` haya avanzado desde la revisión final. En la 0085, un sujeto re-revisó el tramo después de escribir el walkthrough, el roadmap y el changelog.
2. El paso 7 abre re-revisión con cualquier commit posterior a la revisión final, también con la pasada de fix de esa misma revisión, que `executing-plans` verifica con TDD.
3. En lite nada dice cuándo se despacha el revisor final, y en la 0086 llegó en el cierre. El RED no lo reproduce, y esta pieza se recorta (decisión 5).

Se quiere que cada commit se revise una vez, antes de documentarlo, y ninguna vez más.

## Scope

- Entra:
  - `skills/sdd-end-feature/SKILL.md`: paso 0 (hacer el paso 9 antes de escribir) y paso 9 (comparación y re-revisión del tramo).
  - `skills/sdd-start-feature/SKILL.md`: paso 6 (línea `Pasada de fix:`) y paso 7 (último commit revisado y la pasada de fix).
  - `skills/sdd-start-feature/references/control-profiles.md`: viñeta de la excepción en «Ruling».
  - `tests/PostFinalReview.Tests.ps1`.
  - La evidencia `tests/closing-review-edges-red.md` y `tests/closing-review-edges-green.md`.
  - La fila 0091 del roadmap.
- No entra:
  - La regla de redacción de skills del ticket 0085 §1: no la pide la fila.
  - El resto de hallazgos de los tickets 0085 y 0086: tienen fila de deuda propia o ya están resueltos.
  - Renumerar los pasos de `sdd-end-feature`.
  - `overrides-superpowers.md`, `commit-milestones.md` y `encargo-revision.md` (decisión 6).

## Approach

Una sola regla, el último commit revisado, que usan los pasos 7 y 9. Se añaden una línea más en `tasks.md` (`Pasada de fix:`), el salto al paso 9 desde el paso 0 y la excepción en «Ruling».

## Delta de comportamiento

### Capacidad: `feature-flow`

**MODIFIED — El cierre no repite la revisión final de Native** (antes: "WHEN se ejecuta el paso 9 de `sdd-end-feature` THEN no lanza otra revisión")
- GIVEN una feature cuya línea `Revisión final:` de `tasks.md` registra la revisión final de rama `sobre a1b2c3d`, y después de ese commit solo hay commits de los que se revisan en el hilo
- WHEN se entra en `sdd-end-feature`
- THEN no lanza otra revisión: comprueba que hubo revisión final y con qué modelo
- AND si después de `a1b2c3d` hay un commit del hilo `e4f5a6b` que cambia `src/slots.js`, antes de escribir el walkthrough despacha la re-revisión del tramo `a1b2c3d..HEAD` con el encargo del revisor final (`sdd-kit:effort-high` + `opus`) y apunta `Re-revisión: a1b2c3d..e4f5a6b, sdd-kit:effort-high + opus, <veredicto>`
- AND el commit con el que compara `HEAD` es el último revisado: el de la `Re-revisión:` más reciente; si no hay, el de `Pasada de fix:`; si no hay, el `sobre` de `Revisión final:`
- AND solo sin la línea `Revisión final:` (ni, sin `tasks.md`, el informe del revisor de esta sesión) lanza `requesting-code-review`

**MODIFIED — Un commit del hilo posterior a la revisión final se revisa antes de la validación**
- GIVEN `tasks.md` con `Revisión final: sdd-kit:effort-high + opus, limpia, sobre a1b2c3d` y, después, un commit del hilo `e4f5a6b` que cambia 3 líneas de `hooks/hooks.json`
- WHEN el hilo va a presentar la validación del paso 7
- THEN antes despacha un revisor con el encargo del revisor final (`sdd-kit:effort-high` + `opus`) sobre el tramo `a1b2c3d..HEAD`, y no presenta la validación hasta que vuelve sin Critical ni Important abiertos
- AND apunta en `tasks.md` `Re-revisión: a1b2c3d..e4f5a6b, sdd-kit:effort-high + opus, <veredicto>`
- AND si el commit llega con la validación ya presentada (un fix que sale de una pregunta del dev-lead), la re-revisión va antes de invocar `sdd-end-feature`, y el mensaje dice qué cambió y su veredicto
- AND si el tramo solo tiene commits de solo docs de menos de 20 líneas (`.docs/sdd/roadmap.md`, 2 líneas), no despacha revisor: lo anota como `revisado en el hilo`
- AND la pasada de fix de la propia revisión final no abre la re-revisión. Ejemplo: la revisión final vuelve con `Needs fixes (0 Critical, 1 Important, 0 Minor)` sobre `a1b2c3d` y la pasada queda en `c7d8e9f`, con su test RED→GREEN. El hilo apunta `Pasada de fix: c7d8e9f, 1 hallazgo RED→GREEN`, no despacha revisor y lo dice al presentar
- AND un commit del hilo posterior a la pasada, en `src/`, sí abre la re-revisión, sobre el tramo `c7d8e9f..HEAD`

### Capacidad: `control-profiles`

**MODIFIED — Salir del plan es un ruling visible**
- GIVEN una ejecución que se aparta del plan sin cambiar la spec (un fichero de «NO se tocan», un orden distinto, un fix del hilo principal) y sin caer en un freno de alcance
- WHEN el agente decide
- THEN no para: registra el ruling, y todo commit del hilo principal entra en el alcance de la revisión de la task en curso; si no queda ninguna, de la revisión final de rama; y si la revisión final ya volvió, de la re-revisión del tramo `<revisión final>..HEAD`
- AND un commit del hilo cuyos ficheros están todos bajo `.docs/` o son `*.md` de la raíz, y que cambia menos de 20 líneas (añadidas más borradas, `git diff --numstat`; en un merge, las de `git show --remerge-diff`), no despacha revisor: el hilo lee el diff y lo anota en «Me salí del plan en…» como `revisado en el hilo: <sha> · <ficheros> · <n> líneas`
- AND la pasada de fix de la propia revisión final tampoco entra en la re-revisión del tramo: en Native la verifica su TDD, y en SDD su re-revisión acotada. Un commit posterior a la pasada sí entra
- AND la presentación de la validación abre con el bloque «Me salí del plan en…», separado del resto de decisiones

### Estimación y esfuerzo

- Tipo: docs
- Esfuerzo spec: 0,5 h
- Estimación de implementación: 2 h (texto, ~20 min; RED y GREEN con 19 sujetos en paralelo y su evidencia; revisión final)
- Base de la estimación: la 0085 (1,4 h de implementación, 32 sujetos) y la 0086 (1,5 h, 13 sujetos) tocan los mismos pasos
- Confianza: media

## Enmiendas

- 2026-09-27 — Sale del Scope la frase de lite del paso 6 y el requisito ADDED «En lite, el revisor final llega antes de la validación» — el RED no reproduce el fallo: 3 de 3 sujetos válidos despachan el revisor final antes de la validación (`tests/closing-review-edges-red.md`, l1 y l2) — aprobada: «Recortarla (Recomendada)»

## Aprobaciones

| Rol | Nombre | Fecha | Estado |
| --- | --- | --- | --- |
| dev-lead | Àngel Delgado | 2026-09-27 | aprobada por delegación: «apruebo la spec por delegación, nos vemos en la validación» |
