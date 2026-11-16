---
id: 20261011-130007-feature-0168-fork-brainstorming-writing-plans
title: Tasks — propose sin superpowers: fork de brainstorming y writing-plans en referencias de sdd-propose
spec: ./spec.md
plan: ./plan.md
created: 2026-10-11
---

# Tasks — propose sin superpowers (registro vivo)

- **Spec**: `./spec.md`
- **Plan**: `./plan.md`
- **Rama**: `feature/0168-fork-brainstorming-writing-plans`

## Estado de las tasks

| # | Task | Status | Commit | Notas |
| --- | --- | --- | --- | --- |
| 1 | RED de las reglas nuevas | done | `e553fc26` | la regla de ADR sale limpia; `adr6` en la Task 2 |
| 2 | Mover a las referencias sin cambiar reglas | done | `89cc7e5d` | afectada por enmienda 2026-10-11 (`sdd-explore` en Scope), cubierta en el commit de cierre |
| 3 | Diseño por secciones en `spec-writing.md` | done | `96d9a3d0` | sin la regla de ADR (enmienda 2026-10-11) |
| 4 | Boceto en `sdd-grilling` | done | `18e17e92` | REFACTOR con contraejemplo; parada por PID o puerto |

## Verificación por task

- [x] Task 1 — `battery.mjs plan` de los escenarios nuevos; RED en `tests/superpowers-fork-red.md`
- [x] Task 2 — Pester de forma (357 en verde) y humos GREEN 8 de 8
- [x] Task 3 — Pester `SuperpowersCompat` y `WordBudget`; GREEN `pb` 2/2 y `pb-c`
- [x] Task 4 — Pester `SuperpowersCompat` y `WordBudget`; GREEN `sk-4`, `sk-5` y `sk-c-2`

## Revisión

Revisión final: sdd-kit:effort-high + opus, con arreglos (0 Critical, 2 Important, 6 Minor), sobre 18e17e92
Pasada de fix: juntada en el cierre, 1 hallazgo RED→GREEN (recuento en `spec-writing.md`); el otro Important, desvío aprobado como enmienda

## Rulings

Task 1: Ruling: molde — pb-1, sk-1..sk-4, pb-3 y pb-4 invalidados por el molde (fecha que no existe, estado que no existe, recuento ≤3); apartados a red-molde/out, su coste cuenta en el techo — peticiones de pb y sk y datos de mold-web corregidos
Task 2: Ruling: RED adr6-1, adr6-2 limpios 2/2 con seis ADR → la regla de ADR sale (decisión del dev-lead: «si sale limpia, la quito»); enmienda en la spec; Task 3 queda solo con el diseño por secciones; Review Focus 1 del plan deja de aplicar
Task 2: Ruling: sdd-explore cambia «NEVER `superpowers:brainstorming`» por una forma sin el prefijo — la prohibición se queda, pero el README cuenta como «invocadas» las skills con `superpowers:` en skills/ — si es incorrecto, el README declararía brainstorming como invocada sin serlo
Task 2: Ruling: el pre-commit rechazó el commit — CommitMilestones y LocalConfig fijaban en overrides y en el paso 5 dos frases que pasan a plan-writing.md; sus asserts apuntan ahora allí — el «Verificación» de la task no los incluía
Task 4: Ruling: sk-1 del GREEN clasificó lite y preguntó el carril sin llegar al diseño — apartado a green-molde; sk y sk-c llevan «Carril feature:» (lo medido no cambia); techo de sujetos 28 → 32 por decisión del dev-lead («Subir a 32 sujetos (Recomendada)»)
Task 4: Ruling: GREEN sk-3 usa el respaldo con «no he arrancado la app»; REFACTOR con contraejemplo (Art. II), techo 32 → 34 por decisión del dev-lead («REFACTOR + 2 sujetos (Recomendada)»); sk-2 ofrece lite y no llega al diseño → green-molde; sk pasa a «Carril feature, modo full:»
Task 4: Ruling: sk-4 paró su servidor con pkill -f y taskkill //IM node.exe — la regla del boceto lleva a arrancar la app desde la entrevista; se añade a sdd-grilling «stop what you started by its PID or port, never by name» de sdd-implement, sin GREEN propio (techo agotado; regla medida en tests/closing-verification-red.md) — si falla, una entrevista puede matar procesos node del dev-lead
Final: minor (deferred): sdd-grilling no dice dónde se guarda la captura (la capacidad dice fuera de git, scratchpad)
Final: minor (deferred): la spec sigue nombrando la regla de ADR en 🦆, ✋15 y Approach fuera de la enmienda
Final: minor (deferred): adr6 no está en la lista de MAX_TURNS=25 de subject.sh (hereda 40)
Final: minor (deferred): dos líneas en blanco seguidas antes de la tabla de procedencia de la batería de sdd-propose
Final: minor (deferred): las Interfaces de la Task 2 prometían «## Purpose» en spec-writing.md; va como párrafo inicial
Final: Ruling: cuentas de coste de la evidencia — ya corregidas en el hilo antes del veredicto (4,34 $ RED válidos; GREEN 8,42 $); sk-c-1 no existe porque el techo cortó y corrió como sk-c-2 — coste si está mal: el estimation-log hereda la cifra
