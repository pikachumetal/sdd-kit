---
id: 20261014-122606-feature-0181-upstream-watch
title: Tasks — Vigilancia de fuentes
spec: ./spec.md
plan: ./plan.md
created: 2026-10-14
---

# Tasks — Vigilancia de fuentes (registro vivo)

- **Spec**: `./spec.md`
- **Plan**: `./plan.md`
- **Rama**: `feature/0181-upstream-watch`

## Estado de las tasks

Status: `pending` → `in_progress` → `done` (o `blocked` / `skipped`). Una task cerrada que cambia por una enmienda no se reabre: lleva en «Notas» `afectada por enmienda <fecha> → Task N`, y la Task N nueva hace el trabajo; si la enmienda solo cambia la task en curso, sigue en ella con la nota.

| # | Task | Status | Commit | Notas |
| --- | --- | --- | --- | --- |
| 1 | Tabla de fuentes vigiladas, versiones de los avisos e inventario de procedencia | done | `fa72e65c` | mensaje corregido con `--amend` (el commit salió como «gitdir: …») |
| 2 | El check `kit:upstream` | done | `873880a9` | con `tests/upstream/package.json` (`"type": "module"`) |
| 3 | Revisión de las fuentes | done | `a9965de9` | dos hallazgos de OpenSpec a la fila 0129 |

## Verificación por task

- [x] Task 1 — `moon run kit:test-fast` → 1123 en verde
- [x] Task 2 — `Invoke-Pester -Path tests/UpstreamWatch.Tests.ps1` → 10/10; RED real con `moon run kit:upstream`: 4 fuentes con versión nueva
- [x] Task 3 — `moon run kit:upstream kit:roadmap` → `Fuentes al día: 6.` y `Roadmap válido`

## Fixes adicionales (trabajo descubierto fuera de scope; el tercero abre el freno de alcance)

| Descubierto | Causa raíz | Decisión | Commit |
| --- | --- | --- | --- |

## Revisión final

Revisión final: sdd-kit:effort-high + opus, With fixes (0 Critical, 2 Important, 10 Minor), sobre `a9965de9`
Pasada de fix: juntada en el cierre, 3 hallazgos corregidos por lectura (contenido de la revisión de fuentes, sin código: no hay test que reproducir)

## Rulings

- Task 2: Ruling: `New-Source` recibe la URL del remoto (`-Url`, por defecto `https://github.com/acme/<n>`) y el `insteadOf` se fija con esa misma URL entera — insteadOf casa por prefijo y con la URL sin `.git` el test del `.git` haría fetch a una ruta inexistente — si me equivoco: un test en rojo que se ve al instante.
- Task 1: Ruling: versión de `sdd-grilling` por fecha, no por texto — el barrido da 0 frases de 8 palabras en común con `grilling` en v1.2.3, 86cba45, 85f83d3, 95249b0 y v1.3.1 (reescritura, no copia); se adaptó el 2026-10-02 (a299ba80) y el último commit de la fuente antes de esa fecha es `85f83d3` (2026-08-20, posterior a v1.2.3) — si me equivoco: el aviso nombra un commit vecino.
- Task 1: Ruling: `sdd-grilling` comparte 14 frases con `brainstorming` de superpowers («come up with several ideas and drop the weak ones… show the comparison only when it helps them decide», patch 0172) y su NOTICE solo cita a mattpocock — se añade superpowers 7.0.0 a su NOTICE y a su línea de THIRD_PARTY_NOTICES — si me equivoco: un aviso de más.
- Task 1: Ruling: la línea «Adapted from `grilling` by Matt Pocock» de `sdd-grilling/SKILL.md` no se toca: editar una skill pide prueba del Art. I y la spec deja fuera los cambios de skills; el `NOTICE` y `THIRD_PARTY_NOTICES.md` ya nombran superpowers — si me equivoco: la cabecera de la skill omite una de sus dos fuentes, a corregir con la próxima edición de la skill.
- Task 2: Ruling: `tests/upstream/package.json` con `"type": "module"` — sin él Node escribe por stderr el aviso MODULE_TYPELESS_PACKAGE_JSON y ensucia la salida del check; renombrar a `.mts` cambiaba el nombre que fija la spec — si me equivoco: un fichero de 3 líneas de más.
- Task 2: Ruling: `tech-stack.md` quedó en 18.711 palabras con el párrafo nuevo (tope 18.700); se condensó dentro de la misma sección hasta 18.698, sin subir el tope — si me equivoco: el párrafo pierde matices («Abajo, referencias sin versión», «feature 0181»).
- Final: Ruling: Minor 9 (OpenSpec `## Workflow follow-up` y casillas sin fila) re-graduado a Important — mismo caso que el Important 2: con la vista subida a v1.14.1 el check no volverá a avisar — fila añadida, «sin pieza del kit» — si me equivoco: una fila de más en la revisión.
- Final: Ruling: la cabecera «Adapted from `grilling`» pendiente (ruling de la Task 1) va a la fila de deuda nueva de `sdd-grilling`, junto a la de Spec Kit — sin fila se perdía (Art. XI) — si me equivoco: nada, la fila se tría.
- Final: Ruling: «Declined to judge» 1 — el Art. IX enumera las fuentes sin impeccable: va a la fila 0152 (coherencia de documentos); al editar esa línea queda también su punto final (Minor 10) — si me equivoco: una línea más en la 0152.
- Final: Ruling: «Declined to judge» 2-7 y 9 — se mantienen como dice el revisor (GitHub solo por la spec, ruta sin comillas, dos clones con el mismo origin, aviso MIT conservador de mattpocock, solapes internos de superpowers, 95249b0 al próximo tag, converge contrastado también en `templates/commands/`).
