---
id: 20261016-105021-feature-0149-archive
feature: 0149
title: Walkthrough — archive: sdd-archive, cierre único de feature y patch
spec: ./spec.md
plan: ./plan.md
status: done
created: 2026-10-17
---

# Walkthrough — archive: `sdd-archive`, cierre único de feature y patch

## 1. Cambios realizados

- **`skills/sdd-archive/`** (nueva, en inglés): `SKILL.md` con el tronco común (comprobaciones previas → validación → registro del evento → docs vivos → índices → historia → base integrada → merge → ticket → mensaje final) y las ramas `Feature only:`, `Patch only:` y `Hotfix only:`; `NOTICE` del fork de `finishing-a-development-branch` 7.0.0; `references/merge-recipe.md` (qué significa cada salida de `sdd merge` y de `capability check --artifact`), `references/records.md` (registros 2.x y 3.0.0, capacidades del patch, «qué sigue») y `references/aprendizajes-skills.md` (movida sin cambios). Tasks 1-4: `7d0b66cd`, `3bc6cd16`, `21eb46ca`, `f5d52697`.
- **Retirada** de `sdd-end-feature` y `sdd-end-patch`, y de las dos invocaciones de `finishing-a-development-branch`; renombrado en `skills/`, plantillas, `mission.md`, `tech-stack.md`, `architecture.md`, la guía de uso, greenfield, brownfield, README, `CLAUDE.md` (22 skills), `THIRD_PARTY_NOTICES.md`, baterías y moldes; 23 Pester portados a la regla equivalente. Task 5: `8e591124`.
- **Otras skills**: `sdd-start-patch` (el commit del fix no toca la deuda; cierra con `sdd-archive`), `sdd-worktrees` (la línea base en rojo se contrasta con la rama de integración y se busca en la deuda), `commit-milestones.md` (guarda los shas que cite cualquier artefacto), `patch-template.md` («Capacidades» con `sdd capability index`).
- **Pasada de fix** de la revisión final y **cierre**: en el commit de cierre.
- **Capacidades**: nueva `archive`; delta en `routing`, `feature-flow`, `control-profiles`, `capabilities`, `commit-history`, `roadmap`, `decisions`, `estimation`, `kit-feedback` y `verification`.
- **ADR 0016** «Un solo cierre para feature y patch, con ramas por carril».

## 2. Tiempo y coste: estimado vs real

- Tipo: docs
- Estimación de implementación (del plan): 6h
- Esfuerzo real: 42,42 h — reloj de la sesión 51,56 h desde 2026-10-15T09:20Z, sin 548 min de espera al dev-lead (29 esperas)
- Desviación: +36,4 h (+607 %)
- Causa de la desviación: la prueba creció de ~32 a 59 sujetos con seis REFACTOR (literales parafraseados, reglas que solo vivían en una referencia, defectos de molde), la retirada portó 23 Pester que nadie había contado en el plan, y la revisión final en tres ejes dejó 13 Important con su pasada de fix. El reloj cuenta además la noche del 2026-10-16 con la sesión parada, que no es espera al dev-lead.
- Compactación: no
- Modelo del hilo: Opus 5.5 (todas las fases)
- Tokens del hilo: 203.585.690 — claude-opus-5-5 203.585.690
- Tokens de subagentes: 26.406.267 en 6 despachos — Revisor de spec, lente técnica claude-sonnet-5-5 1.046.492 / 2 min; Final review — Spec axis claude-opus-5-5 10.551.574 / 9 min; Final review — Code axis claude-sonnet-5-5 6.842.578 / 5 min; Final review — Architecture axis claude-opus-5-5 5.924.437 / 7 min; Revisor de spec, lente dominio claude-opus-5-5 1.992.872 / 4 min; Re-review final 0149 claude-opus-5-5
- Coste de la sesión: 76,81 $ (hilo 65,25 $ + subagentes 11,56 $)
- Coste de sujetos: 24,01 $ en 59 sujetos sonnet — batería de `sdd-archive` (RED, GREEN, REFACTOR, fix)
- Review de spec: 2 revisores · hallazgos 20, aceptados 20 (uno en parte)

## 3. Desviaciones del plan

- La batería creció: `a3` se partió en `a3` y `a3r`; nacieron `a3n` y `a5m` en la pasada de fix; `r1` y `r2` se midieron en la Task 5, con las skills viejas retiradas.
- `references/estimation.md` se fundió en el `SKILL.md` en lugar de moverse, y nació `references/records.md` (enmienda del 2026-10-16).
- El tope de `sdd-archive` subió a 3.850 / 6.300 y el techo de sujetos a 62 (decisiones del dev-lead).

### Decisiones tomadas sin el dev-lead

- Task 1: `SKILL.md` escrito antes de su Pester; el RED del Pester se demostró contra `kit-develop` (0 de 20) — coste si es erróneo: un test que no ve un fallo del texto.
- Task 1: el GREEN prematuro de `a1`, `r1` y `r2` eligió las skills viejas; apartado en `green-premature/`, y los escenarios de conducta piden `sdd-archive` por su nombre — coste: el enrutado no se midió hasta el final.
- Task 1: A3 se puntúa por la fila de deuda (control: el RED también la abría) — coste: la regla del workaround no tiene RED propio.
- Task 2: RED de `a4` descartado (petición que no casaba con el molde) — coste: 0,5 $.
- Task 4: el detalle de registros y capacidades del patch pasa a `references/records.md` y las citas de evidencia a la batería, para caber en el tope — coste: una regla en una referencia se lee menos (lo midió `a5`).
- Task 4: `commit-milestones.md` pierde dos citas de evidencia para que `sdd-start-feature` quepa en su total — coste: la procedencia queda en los tickets.
- Task 5: `RoadmapClosing` pasa a exigir el prefijo literal de la deuda saldada en el cierre (`a2`: 1/2 por remisión, 2/2 con el literal) — coste: dos copias del formato.
- Task 5: `VerifySkill` deja de comprobar que la ADR 0015 cubre `sdd-archive` (sus `rutas` nombran la skill retirada y las ADR son inmutables) — coste: `decision index` no la ofrece; fila de deuda.
- Final: la re-revisión deja abiertos el literal de «qué sigue» (`a5` 1/2 exacto) y el sha de la validación que el squash junta; adjudicados, con su fila de deuda.
- Final: la cláusula de la validación en campo «even if the user is away or only said «cierra»», quitada al recortar, vuelve en el commit de cierre sin revisar.

## 4. Verificación

### 4.1 Builds

- Gate de cierre: `moon run kit:test cli:typecheck cli:test cli:test-slow cli:test-min` → `kit:test` 1328/0, `cli:test` 914, `cli:test-slow` 187, `cli:test-min` 1101 · 3 min 31 s · sobre la pasada de fix, juntada en el cierre (mismo código que este commit salvo el `SKILL.md` sin revisar).
- `sdd capability check --path .docs/sdd --artifact spec.md` → `Capacidades válidas: 20`; `sdd decision check --path .docs/sdd` → `Decisiones válidas`; `sdd roadmap check --path .docs/sdd` → `Roadmap válido`.

### 4.2 Smoke / tests

- Validación en campo: 2026-10-17 · suite 1328/0 kit y 2.202 cli · batería de `sdd-archive` 13 escenarios de conducta y 2 de enrutado con RED, GREEN y REFACTOR (59 sujetos) · revisión final Spec, Código y Arquitectura sobre 8e591124, re-revisión con 2 abiertos adjudicados, 1 sin revisar.

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| archive · el cierre de una feature y el de un patch van por la misma skill | ejecución real (`a1`, `a2`) | 2/2 y 2/2 |
| archive · el cierre comprueba el árbol, el destino y las otras ramas | ejecución real (`a1`, `a3`) | 2/2 |
| archive · integra la base tras su commit y repite la suite solo si trae código | ejecución real (`a3`, `a3n`) | 2/2 y 1/1 |
| archive · un rojo ajeno se busca en la deuda antes de investigarlo | ejecución real (`a3r`) | 2/2 tras dos REFACTOR |
| archive · un hotfix se cierra en la rama estable solo con la frase del dev-lead | ejecución real (`a4`) | 2/2 tras un REFACTOR |
| archive · al cerrar una pieza de una familia, el cierre dice qué falta | ejecución real (`a5`, `a5m`) | contenido 2/2 y 1/1; literal 1/2 exacto |
| archive · el cierre escribe las ADR candidatas y las comprueba | ejecución real (`a6`) | 2/2 |
| archive · un workaround en el stack lleva su fila de deuda | ejecución real (`a1`) | 2/2 (control) |
| archive · el kit no invoca `finishing-a-development-branch` | suite (`ArchiveSkill`) | verde |
| archive · aprendizaje sin destino, carpeta `-task-`, el 4.1 | suite (`AnchorTemplates`, `ArchiveSkill`) y ejecución real (`a1`) | verde, 2/2 |
| routing · el cierre entra por `sdd-archive` | ejecución real (`r1`, `r2`) | 1/1 y 1/1 |
| control-profiles · validación en campo, merge, línea de terminado, verificación del merge, conflictos | suite (`ControlProfiles`, `FieldValidation`, `SyncMerge`) y ejecución real (`a3`) | verde, 2/2 |
| capabilities · el literal viejo de un `MODIFIED` se busca en toda la capacidad | ejecución real (`a7`) | 2/2 |
| commit-history · el cierre en un commit y el patch en dos; los shas citados | ejecución real (`a8`, `a2`) | 2/2 |
| roadmap · Now y `debt.md` en la 3.0.0; la fila «Patch:» se marca | ejecución real (`a9`, `a2`) | 2/2 |
| decisions · el cierre ejecuta `sdd decision check` | ejecución real (`a6`) | 2/2 |
| feature-flow · línea base de `sdd-worktrees`, gate de cierre una vez | ejecución real (`w1`, `a3`) | 2/2 |
| estimation, kit-feedback, verification · nombres y pasos de `sdd-archive` | suite (`ClosingEstimation`, `KitFeedback`, `VerifySkill`, `PostFinalReview`) | verde |

### 4.3 Residuales / deuda generada

- El sha de la validación que cita el 4.1 cae en el tramo que el cierre junta cuando hay pasada de fix → fila de deuda.
- Las `rutas` de las ADR 0005 y 0015 nombran las skills retiradas → fila de deuda (0152).
- Menores diferidos de la feature 0149 (literal de «qué sigue», `aprendizajes-skills.md`, `proposal:` en `patch-template.md`, el arreglo tras la sincronización, el descarte, la línea de terminado con `removeWorktree`, la rúbrica de `a4`) → fila de deuda (0152).
- La receta repite en prosa el predicado de solo-docs y la unión de registros que tiene la CLI → a la 0193, con un verbo de sincronización.
- `sin revisar`: el commit de cierre devuelve la cláusula de la validación en campo y recorta cuatro palabras del `SKILL.md`.

## 5. Aprendizajes

- Con las skills viejas aún en el kit, el router las elige aunque exista la nueva: el enrutado de una skill que sustituye a otras solo se mide tras retirarlas → `tests/batteries/sdd-archive/battery.md` (párrafo de entrada).
- Un literal que solo vive en una referencia se parafrasea (`a5` 0/2), y subido al `SKILL.md` sale exacto en 1 de 2 → procedencia de `battery.md`.
- Una parada que solo vive en la receta no se cumple (`a3r` C3 1/2); en el paso del `SKILL.md`, 2/2 → procedencia de `battery.md`.
- Un cierre único pide un tope propio mayor que el de cualquiera de las dos skills que funde → ADR 0016.
- `tech-stack.md` está en su tope (18.800/18.800): los aprendizajes de esta feature van a la procedencia de la batería, que es donde el método los pide.
- Revisión de skills: `.claude/skills/` del repo tiene tres skills enlazadas de fuera (`skill-creator`, `writing-for-agents`, `writing-skills`); ninguna afirma algo que esta feature desmienta y ningún patrón pide una nueva.
- ADR: Un solo cierre para feature y patch con ramas por carril → decisions/0016-single-archive-for-feature-and-patch.md

## 6. Adendas

- _Ninguna_
