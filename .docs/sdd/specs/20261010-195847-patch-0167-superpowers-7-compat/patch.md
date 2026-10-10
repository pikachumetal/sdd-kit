---
id: 20261010-195847-patch-0167-superpowers-7-compat
task: 0167
title: Patch — el kit con superpowers 7.0.0
type: patch
solution: dev-lead
status: done
created: 2026-10-10
branch: patch/0167-superpowers-7-compat
commit: 4da56991
---

# Patch 0167 — el kit con superpowers 7.0.0

## Capacidades

- Modificadas: `feature-flow` — saltarse las preguntas de brainstorming no se lleva la spec ni su gate, y el kit no lo ofrece

## 1. Síntoma

Fila 0167 del roadmap de `develop` (dev-lead, 2026-10-10, al ver la 7.0.0): «el kit 2.3.3 no fija la versión de superpowers y la 7.0.0 (2026-10-09) reescribe `brainstorming`», con siete puntos: (a) desaparece el «Spec Self-Review» que cita el repaso de coherencia del paso 4 de `sdd-start-feature`; (b) la clasificación spike / bounded / architectural pasa a tamaños y una feature puede quedarse sin `spec.md` ni gate; (c) el primer mensaje ofrece saltarse las preguntas, «the skill is done and the gate goes with it»; (d) el builder check sustituye al revisor de la spec; (e) la fila del Execution Handoff cita una frase de la HARD-GATE que ya no existe; (f) «Each message ends with one question… no list of example answers» choca con el estilo de preguntas del kit; (g) «Versión validada: 6.4.2».

Medido en el RED ([`tests/superpowers-700-red.md`](../../../../tests/superpowers-700-red.md), 6 sujetos Sonnet sobre la caché 7.0.0): solo se reproduce (c) en su oferta, 5 de 5 sujetos que llegaron a preguntar ofrecieron saltarse las preguntas; aceptarla no se llevó la spec ni el gate (0 de 2), el tamaño no dejó ninguna feature sin spec (0 de 6) y nadie despachó el builder check (0 de 6). Ningún sujeto leyó `overrides-superpowers.md`.

## 2. Solución fijada

Dev-lead, 2026-10-10 (petición del patch, «Decisiones ya tomadas»):

- «Toda feature tiene spec.md y su gate: el tamaño que elige brainstorming 7.0.0 («quick task», «small change in chat», «project») no gobierna los artefactos, y no se ofrece saltarse las preguntas. Sustituye a la fila «Clasificación de brainstorming (spike / bounded / architectural)» de overrides-superpowers.md.»
- «El repaso de coherencia del paso 4 de sdd-start-feature escribe sus cuatro comprobaciones (placeholders, contradicciones, alcance, ambigüedad) en el propio paso, sin citar el «Spec Self-Review» de brainstorming.»
- «El builder check de brainstorming no se despacha: la review de spec del kit (review-spec.md) ocupa su sitio.»
- «Las preguntas siguen el estilo del kit (primera pregunta de sdd-start-feature con sus opciones; técnica de sdd-roadmap con la recomendada primero) frente a «Each message ends with one question… no list of example answers».»
- «La fila del Execution Handoff deja de citar la frase de la HARD-GATE que ya no existe.»
- «Versión validada: 7.0.0 en README.md, tech-stack.md y tests/SuperpowersCompat.Tests.ps1.»
- «Lo que salga limpio en el RED se queda solo en el cambio mecánico.»

Lo que da por existente, comprobado en `~/.claude/plugins/cache/superpowers-marketplace/superpowers/7.0.0/`: `RELEASE-NOTES.md` §v7.0.0 y `skills/brainstorming/SKILL.md` traen «Size the Work», la oferta del primer mensaje, el «Builder check», la HARD-GATE sin «reviews the written implementation plan» y «Each message ends with one question»; el «Spec Self-Review» ya no está. En el kit, las citas están en `sdd-start-feature/SKILL.md:42`, `overrides-superpowers.md:11` y `:14`, `sdd-roadmap/SKILL.md:42`, `README.md:182`, `tech-stack.md:274` y `tests/SuperpowersCompat.Tests.ps1`.

## 3. Fix

- **Fichero(s)**: `skills/sdd-start-feature/SKILL.md`, `skills/sdd-start-feature/references/overrides-superpowers.md`, `skills/sdd-roadmap/SKILL.md`, `README.md`, `.docs/sdd/tech-stack.md`, `tests/SuperpowersCompat.Tests.ps1`, `tests/ProportionalReview.Tests.ps1`, `tests/superpowers-700-red.md`, `tests/superpowers-700-green.md`, `tests/WordBudget.Tests.ps1`
- **Cambio**: el paso 4 prohíbe ofrecer saltarse las preguntas y dice qué hacer si el usuario pide empezar ya (lo único que reprodujo el RED), y su repaso de coherencia escribe las cuatro comprobaciones. En `overrides-superpowers.md`, la fila de «Size the Work» y la oferta sustituye a la de la clasificación vieja, hay filas nuevas del builder check y del estilo de preguntas, y la del Execution Handoff deja de citar la HARD-GATE. La entrevista de `sdd-roadmap` dice su técnica sin atribuírsela a brainstorming. Versión validada: 7.0.0.
- **Decisiones**:
  - Toda feature tiene `spec.md` y gate; no se ofrece saltarse las preguntas — dev-lead
  - Si el usuario pide empezar ya sin que se le ofrezca, la spec se escribe con lo que hay y los huecos van a «Decisiones que he tomado yo» — sin el dev-lead (no cambia lo que el usuario ve ni puede hacer en su proyecto: es lo que ya hacían 2 de 2 sujetos del RED)
  - La frase va en el paso 4 además de en la fila de overrides, porque 0 de 6 sujetos leyeron la tabla — sin el dev-lead (método)
  - Los topes de palabras de `sdd-start-feature` suben a 8490 (`SKILL.md`) y 20310 (la skill), y el del kit a 54005, para que la frase del paso 4 quede como se midió; el repaso de coherencia nombra sus cuatro comprobaciones sin glosarlas y las filas de overrides se comprimen — dev-lead, 2026-10-10 («Subir los topes»)

## 4. Verificación

| # | Caso | Resultado |
| --- | --- | --- |
| 1 | RED: oferta de saltarse las preguntas, kit 2.3.3 + superpowers 7.0.0 | 5 de 5 la ofrecen ([red](../../../../tests/superpowers-700-red.md)) |
| 2 | GREEN: el mismo escenario con el fix | 0 de 5 que llegaron a brainstorming ([green](../../../../tests/superpowers-700-green.md)) |
| 3 | GREEN: «Sí, sáltate las preguntas» sin oferta | 2 de 2 escriben la spec con los huecos en «Decisiones que he tomado yo» y no pasan el gate |
| 4 | GREEN: feature sin spec por tamaño · builder check | 0 de 6 · 0 de 6 |
| 5 | `tests/SuperpowersCompat.Tests.ps1`, `ProportionalReview.Tests.ps1`, `MigrationInitParity.Tests.ps1`, `PathLength.Tests.ps1` | en verde |

Validación en campo: 2026-10-10 · RED 6 sujetos y GREEN 6 sujetos con superpowers 7.0.0 (oferta de saltarse las preguntas 5/5 → 0/5) · `SuperpowersCompat.Tests.ps1` 10/10 · pre-commit en verde

Coste de la campaña: 4,61 $ (RED 2,38 $, GREEN 2,23 $), dentro de los ~6-10 $ previstos.

## 5. Tiempo (ligero)

- Real: 0,3h

## 6. Delta de capacidad

### Capacidad: `feature-flow`

**ADDED — Saltarse las preguntas de brainstorming no se lleva la spec**
- GIVEN una feature en el paso 4 de `sdd-start-feature`, con `superpowers:brainstorming` 7.0.0, cuyo primer mensaje ofrece saltarse las preguntas
- WHEN el agente pregunta al usuario
- THEN no le ofrece saltarse las preguntas
- AND si el usuario pide empezar ya, el agente escribe `spec.md` con lo que hay, con los huecos en «Decisiones que he tomado yo», y la spec pasa por su gate
