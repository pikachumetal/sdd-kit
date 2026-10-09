---
id: 20261009-110857-feature-0160-single-entry-propose
title: Tasks — Entrada única: sdd-propose con cinco carriles y ceremonia asimétrica
spec: ./spec.md
plan: ./plan.md
created: 2026-10-09
---

# Tasks — Entrada única: sdd-propose con cinco carriles y ceremonia asimétrica (registro vivo)

- **Spec**: `./spec.md`
- **Plan**: `./plan.md`
- **Rama**: `feature/0160-single-entry-propose`

## Estado de las tasks

Status: `pending` → `in_progress` → `done` (o `blocked` / `skipped`). Una task cerrada que cambia por una enmienda no se reabre: lleva en «Notas» `afectada por enmienda <fecha> → Task N`, y la Task N nueva hace el trabajo; si la enmienda solo cambia la task en curso, sigue en ella con la nota.

| # | Task | Status | Commit | Notas |
| --- | --- | --- | --- | --- |
| 1 | Batería de `sdd-propose` y RED de las reglas nuevas | done | `fb01b014` | RED 6 de 8 fallan; a3 y a4, control |
| 2 | `sdd-propose` nace con lo movido, sin cambiar reglas | done | `0490c649` | controles 7 de 7 en conducta |
| 3 | Entrada única: ceremonia asimétrica, carril de la petición, config y spike | done | `4fe7011d` | anuncio tras 4 rondas de REFACTOR; s2 del pato 1/2 |
| 4 | Estimación previa del patch | done | `6824eee8` | a2 2/2; la CLI no cambia |
| 5 | Gate del plan desde `operations.md` y topes finales | done | `e9b4248b` | p2 2/2 |

Revisión final: sdd-kit:effort-high + opus, con arreglos (0 Critical, 6 Important, 6 Minor), sobre e9b4248b
Pasada de fix: juntada en el cierre, 6 hallazgos RED→GREEN
Re-revisión: juntada en el cierre, sdd-kit:effort-high + opus, limpia

## Verificación por task

- [x] Task 1 — `bash -n` del `subject.sh`, `battery.mjs plan` y los Pester de rutas y privacidad
- [x] Task 2 — Pester de anatomía, topes y frases movidas; controles GREEN
- [x] Task 3 — Pester de anatomía, topes y enrutado; GREEN de `a1`, `a3`, `a4`, `k1`-`k4`, `p1`, `s2` y la batería de `using-sdd`
- [x] Task 4 — Vitest de `cli/test/estimation`; GREEN de `a2`
- [x] Task 5 — Pester de topes y plan; GREEN de `p2`

## Fixes adicionales (trabajo descubierto fuera de scope; el tercero abre el freno de alcance)

| Descubierto | Causa raíz | Decisión | Commit |
| --- | --- | --- | --- |

## Rulings

- Task 2: Ruling: las frases que el agente escribe al usuario (aviso de fase «Ahora:/Queda:», opciones del gate, «apruebo la spec por delegación…») se quedan literales en castellano dentro de la skill en inglés — son salida, y los tests y la 0146 las fijan así — cost if wrong: un proyecto en inglés recibe esas frases en castellano.
- Task 2: Ruling: review-spec.md se queda en sdd-start-feature/references y su SKILL.md la enlaza al pie («que aplica el paso de la spec de sdd-propose») — sin enlace quedaba huérfana para Skills.Tests — cost if wrong: un salto más para quien busca la rúbrica.
- Task 2: Ruling: las racionalizaciones de clasificación del patch («Operations ya sabe la causa», «Me han pedido un patch», «El ticket propone el arreglo») y el red flag de abrir como patch lo que no fija la solución se copian a sdd-propose y se quedan también en sdd-start-patch — al clasificar, sdd-start-patch no está cargada — cost if wrong: ~120 palabras duplicadas.
- Task 2: Ruling: subject.sh guarda como spec-new la carpeta de fecha mayor (antes, por mtime, cogía una spec del molde) — cost if wrong: ninguno, los veredictos de s1 se releyeron sobre la spec real.
- Task 2: Ruling: el pre-commit (moon kit:test-fast) sale con FailedCount, que no cuenta un contenedor que no parsea: NativeDefault.Tests.ps1 se commiteó roto en 73c04628 y lo cazó sdd task done con -CI — se arregló y se juntó en el commit de la task — cost if wrong: ninguno aquí; el hueco del hook va al ticket de la feature.
- Task 3: Ruling: a3-2 pregunta si arreglar también `anular` (alcance) tras proponer el patch: cuenta como pasa A3, que mide la pregunta del carril — cost if wrong: A3 sería 1/2.
- Task 3: Ruling: el anuncio de feature y spike va en la cabeza de la nota de entendimiento de brainstorming (cuarta ronda de REFACTOR) — las tres anteriores 0/6 — cost if wrong: en una sesión que no invoque brainstorming, el anuncio depende del aviso de fase.
- Task 3: Ruling: SUBJECT_CAP de run.sh pasa de 78 a 95 por las rondas de REFACTOR; el techo que aprobó el dev-lead es en dólares (64 $), y van ~21 $ — cost if wrong: la previsión en sujetos de la spec queda superada en ~12, sin pasar del techo.
- Task 3: Ruling: s2 del pato queda 1/2 con el escenario ya limpio; la skill no se edita en esta feature (Scope) y la medida va a la fila de deuda — cost if wrong: el pato aún puede listar opciones.
- Task 4: Ruling: estimation-template.md entra en la task (no estaba en el Scope): decía «Los patches registran solo el tiempo real», que contradice la regla — cost if wrong: un fichero de plantilla más en la revisión.
- Task 4: Ruling: el test Vitest pasa sin tocar cli/src (control, como preveía la decisión 8); su título va en castellano como el resto de la carpeta, no el inglés del plan — cost if wrong: ninguno.
- Final: minor (deferred): referencias obsoletas a sdd-start-feature en control-profiles.md:131, spec-template.md:33, sdd-templates/SKILL.md:51 y la fila de sdd-start-feature del README
- Final: minor (deferred): la lista «Perfiles» de control-profiles.md no nombra la parada del arranque en delegate
- Final: minor (deferred): los pasos 3-5 de sdd-propose no dicen que son de feature, lite y spike
- Final: minor (deferred): títulos de Pester de PatchLane que ya no dicen lo que comprueban
- Final: minor (deferred): la fila de procedencia «la primera pregunta, sola, lee sdd-kit.local.json…» de la batería de sdd-propose
- Final: minor (deferred): config en unattended sin ningún gate manda preguntar, y unattended no pregunta
- Final: Ruling: los Declined to judge (routing.md con sdd-start-feature hasta el merge del delta, .docs/workflow, tope del kit suspendido, forma del spike, s2 del pato, frases en castellano, k3-2 crea rama) se quedan como están: cada uno tiene su decisión en la spec o en un ruling — cost if wrong: ninguno nuevo.
- Final: Ruling: el anuncio de feature y spike queda 4/6 con la regla final (2/2 + 2/4) tras seis rondas; la regla se queda y la medida va a una fila de deuda — cost if wrong: un tercio de las features arranca sin decir carril, perfil ni las frases de delegación.
- Final: Ruling: SUBJECT=5 sobrescribió el a1-5 de la tercera ronda de REFACTOR; su veredicto (0/2) queda en la evidencia y en a1-6 — cost if wrong: un fichero de evidencia menos.
