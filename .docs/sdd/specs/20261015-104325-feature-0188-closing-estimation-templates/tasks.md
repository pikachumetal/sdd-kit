---
id: 20261015-104325-feature-0188-closing-estimation-templates
title: Tasks — Estimación y plantillas del cierre
spec: ./spec.md
plan: ./plan.md
created: 2026-10-15
---

# Tasks — Estimación y plantillas del cierre (registro vivo)

- **Spec**: `./spec.md`
- **Plan**: `./plan.md`
- **Rama**: `feature/0188-closing-estimation-templates`

## Estado de las tasks

Status: `pending` → `in_progress` → `done` (o `blocked` / `skipped`).

| # | Task | Status | Commit | Notas |
| --- | --- | --- | --- | --- |
| 1 | CLI: `post hoc` en el log y esfuerzo real medido | done | 342e78e | |
| 2 | Plantillas y método | done | 4583776 | |
| 3 | Cierres: `post hoc` y la línea medida, con RED/GREEN | done | 7564f21 | enmienda 2026-10-15: sin regla de `post hoc` en `sdd-end-patch` (RED limpio); su paso 1 se edita en la pasada de fix |

## Verificación por task

- [x] Task 1 — `moon run cli:typecheck cli:test` y `sdd session tokens` sobre este worktree
- [x] Task 2 — Pester de `ClosingEstimation` y `SessionTokensClose`
- [x] Task 3 — Pester de `ClosingEstimation` y `SessionTokensClose`, GREEN de `p1` y `f1`

Revisión final: Spec opus+high, con arreglos (3 Important) · Código sonnet+high, listo (1 Minor reclasificado a Important) · Arquitectura no (plan), sobre 7564f21e
Pasada de fix: juntada en el cierre, 4 hallazgos (1 RED→GREEN en clock.slow.test.ts; 3 de spec y evidencia, con su GREEN p2 2/2)
Re-revisión: juntada en el cierre, sdd-kit:effort-high + opus, 4/4 resueltos, sin rotura nueva (1 Important fuera de alcance, corregido en el cierre)

## Fixes adicionales (trabajo descubierto fuera de scope; el tercero abre el freno de alcance)

| Descubierto | Causa raíz | Decisión | Commit |
| --- | --- | --- | --- |

## Rulings

- Setup: Ruling: línea base con FastSuiteBudget en rojo (42 s en el gate, 34,1 s solo; umbral 30 s) — 73 procesos pwsh/node de otras sesiones en la máquina y 22 s en el pre-commit de las 13:04; la rama solo añade docs — sigo y lo re-mido en el gate de cierre — si me equivoco: un rojo propio tapado hasta el cierre.
- Task 3: Ruling: enmienda aprobada — sdd-end-patch sin regla de post hoc (RED limpio 0/2) y sin editar: el GREEN del real con la plantilla sola salió 2/2 en ejecutar el script — si me equivoco: una estimación escrita al cerrar entra sin marca, como antes
- Task 3: Ruling: hallazgo del GREEN f1 (pegó Esfuerzo real 0,00 h cuando los transcripts no cubren el trabajo) a deuda «Esperar 2.º ticket», no al texto — sería un AND nuevo de la spec y solo pasa sin transcripts del trabajo — si me equivoco: filas con real 0 en el log de quien cierre en otra máquina
- Task 3: Ruling: references/estimation.md de sdd-end-feature adelgazado (paso 2 repetido, «que vive junto a las plantillas», frase de cierre) para caber en el tope de 4518 palabras — sin cambio de conducta — si me equivoco: se pierde «pregunta si no conoces el tiempo»
- Final: minor (deferred): clock.ts lee y parsea cada transcript dos veces (readResponses + timeline)
- Final: minor (deferred): clock.ts — tras el tool_result de una AskUserQuestion, lastAgent no se limpia: un mensaje tecleado sin respuesta intermedia del agente sumaría la espera dos veces
- Final: minor (deferred): clock.ts — isTypedByUser no excluye isCompactSummary (resumen de autocompactación cuenta como mensaje del usuario)
- Final: minor (deferred): clock.ts — un elemento null en message.content lanzaría TypeError
- Final: minor (deferred): Clock.hours frente a clockHours: nombre ambiguo, ya expuesto en --json
- Final: minor (deferred): clock.test.ts — parámetro day sin uso; helper agent con 4 parámetros
- Final: minor (deferred): format.ts — formatHours entre funciones exportadas, lejos de formatMoney
- Final: minor (deferred): sdd-end-feature paso 2 — «nunca de los commits si el script lo da» se lee ambiguo
- Final: minor (deferred): una línea Esfuerzo real 0,00 h entra al log con real 0 (ya va a deuda, Esperar 2.º ticket)
- Final: minor (deferred): clock.ts sin una línea de porqué de la definición de espera
- Final: Ruling: el MODIFIED anterior se aplica sin aprobación aparte — aplica la decisión 2, ya aprobada, a un requisito que el delta se dejó — si me equivoco: el dev-lead lo revierte en la validación en campo
- Final: Ruling: techo de sujetos de 6 a 8 para p2 (la tanda de REFACTOR que el Art. I incluye en la previsión) — coste acumulado 1,51 $ frente al techo de 12 $ — si me equivoco: ~0,6 $
- Final: minor (deferred): post-hoc.test.ts solo prueba el factor global; faltan dispersión, tendencia, tipo, mediana y Horas reales de la release
- Final: minor (deferred): clock.test.ts — la entrada isMeta va antes de toda respuesta del agente y con prefijo de harness: no prueba la exclusión de isMeta
- Final: minor (deferred): falta un caso Vitest de la línea Esfuerzo real en un walkthrough.md (solo patch.md)
- Final: minor (deferred): una sesión lanzada fuera de la carpeta del worktree infracuenta el real en silencio — va a la fila de deuda del 0,00 h
- Final: minor (deferred): la vía sin transcripts de las plantillas (commits) no cuenta la investigación previa ni descuenta esperas — viene de la decisión 5
- Final: minor (deferred): walkthrough-template §2 — «<h>» sin « h» y sin la variante «reloj de <n> sesiones»
- Final: minor (deferred): sdd-templates/SKILL.md:59 — sdd session tokens «mide los tokens y el coste… lo usa sdd-end-feature» no nombra el esfuerzo real ni el patch
- Final: minor (deferred): una release con todas sus filas post hoc pierde la tabla de releases (calibrationSection vacía), como ya pasaba sin estimado
- Final: Ruling: los «Declined to judge» de los dos ejes (resumen de compactación, interrupciones y mensajes encolados como espera, --resume que copie historial, esperas por permisos o ExitPlanMode) — fuera de la decisión 3 aprobada; el efecto es de minutos; van con el resto de bordes a la fila de deuda del reloj — si me equivoco: reales algo bajos en sesiones con muchas interrupciones
- Final: Ruling: GREEN p2 con la plantilla sola salió 1/2 (p2-1 no abrió la plantilla) → se edita el paso 1 de sdd-end-patch, como prevé la enmienda; tanda extra p2 ×2 aprobada por el dev-lead («Editar y otra tanda GREEN (Recomendada)») — si me equivoco: ~0,4 $
- Final: Ruling: sdd-end-patch recortado tras lanzar la tanda (la vía sin transcripts, que ya dice §5 de la plantilla, y la enumeración de pasos del Overview) para caber en el tope de 2460 — la frase medida es la misma — si me equivoco: la versión recortada no está medida en la vía sin transcripts
- Final: Ruling: Important fuera del alcance de la re-revisión (el ejemplo del requisito post hoc decía «- Real: 0,75h, como da la forma §5») — corregido en el cierre, texto de .docs/ de menos de 20 líneas revisado en el hilo — si me equivoco: una frase de la capacidad
- Final: minor (deferred): green/subject.sh siembra seed-0042.jsonl en ~/.claude/projects y no lo borra, y usa cygpath -w sin fallback
