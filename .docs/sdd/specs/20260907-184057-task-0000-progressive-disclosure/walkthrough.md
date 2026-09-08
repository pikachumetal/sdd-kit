---
id: 20260907-184057-task-0000-progressive-disclosure
task: 0000
title: Walkthrough — Progressive disclosure de las skills del kit
spec: ./spec.md
plan: ./plan.md
status: done
created: 2026-09-08
---

# Walkthrough — Progressive disclosure de las skills del kit

## 1. Cambios realizados

**Constitution y criterio** (`978ca40`): el Art. I incorpora el **A/B de no-regresión** como test válido para recortes y reestructuraciones de skills existentes — el baseline vacío no mide un recorte. `architecture.md` gana el punto 6 de "Anatomía de una skill" con el criterio que hace *candidato* a un bloque —**(a)** aplica a un subconjunto de invocaciones y **(b)** se necesita después de decidir— y la anatomía de `tests/<skill>-ab.md`.

**Ola 1 — `sdd-start-task`** (`2503a34`): 1503 → 997 palabras (−34 %). Bajan `modo-lite.md`, `nombrado.md` y `overrides-superpowers.md`, con enlace en el punto de uso.

**Ola 2 — cuatro skills medianas** (`1ad92d4`): `sdd-end-release` 1103 → 944 (`versionado.md`, `acta-y-retro.md`, `notas-y-roadmap.md`), `sdd-end-task` 767 → 662 (`estimacion.md`, `aprendizajes-skills.md`), `sdd-start-release` 796 → 752 (`priorizacion.md`, `roadmap-fuente.md`). **`sdd-consult` se queda intacta: su corte se descarta.**

**Ola 3 — seis skills cortas** (`426aa45`): `sdd-init-greenfield` 638 → 556 (`estructura.md`), `sdd-init-brownfield` 629 → 568 (`generacion.md`). Las otras cuatro se documentan sin correr A/B: no tienen ningún bloque que cumpla (a)+(b).

**Cierre documental** (`d904f25`): T2 del roadmap reescrita con lo medido y sin la premisa errónea sobre `TodoWrite`; fila de deuda de las 1503 palabras saldada; `tech-stack.md` incorpora el método A/B y sus cuatro aprendizajes.

**Evidencia**: 11 ficheros `tests/<skill>-ab.md`, uno por skill, con cortes aceptados, descartados y su motivo.

**Balance**: el conjunto de las 11 skills pasa de **8011 a 7054 palabras (−12 %)**. 8 cortes aceptados en 6 skills, 1 descartado, 4 skills sin candidato.

## 2. Tiempo: estimado vs real

- Tipo: docs
- Estimación de implementación (del plan): 3,5 h (rango 2,5–5)
- Esfuerzo real: **~5,5 h** (aproximado; sesión del 2026-09-07 18:40 UTC al 2026-09-08, con ~1 h de reloj solo en los seis workflows)
- Desviación: +2 h (+57 %)
- Causa de la desviación (obligatoria, >30 %): **dos costes que el plan no contemplaba**. (1) Las fixtures ricas de las campañas de julio no sobrevivieron al scratchpad y hubo que reconstruir cuatro estados de "TimeTrack" más dos de la ola 3 — un workflow entero de 13 minutos y su verificación. (2) La degradación aparente de `sdd-consult` obligó a dos rondas extra no presupuestadas (4 runs de bisección + 6 de repetición) antes de poder dictar veredicto. El plan estimó 50 runs; se ejecutaron **38 de campaña más 4 constructores de fixture**, pero repartidos en seis workflows en vez de tres.

Es la primera task del kit que cierra **por encima** de su estimación. Las cinco anteriores tenían ratio 0,10–0,38 y el `estimation.md` avisaba de sobreestimación sistemática; corregir ese sesgo estimando en minutos por artefacto acertó en el trabajo previsto y no vio el trabajo de reconstrucción de entorno.

## 3. Desviaciones del plan

- **Entrega de la skill al subagente**: el plan decía "pegada por prompt desde el working tree". Se cambió a "el agente lee el fichero como primer paso obligatorio, más su `Base directory`" porque incrustar 2.500 palabras de skill en el script del workflow era inviable. Equivalente funcional —la skill entra íntegra en el contexto antes de actuar y los `references/` quedan disponibles sin cargarse—, declarado en cada fichero de evidencia.
- **Fixtures reconstruidas**: el plan asumía los escenarios de los `*-green.md` (correcto) y daba por hecho el entorno donde correrlos (incorrecto). Se reconstruyeron seis fixtures con subagentes constructores, decidido con el usuario en checkpoint.
- **Rondas extra en `sdd-consult`**: bisección y repeticiones no estaban en el plan; el plan sí preveía bisección "si degrada", pero no las repeticiones para separar efecto de varianza.
- **Ola 3 parcialmente sin A/B**: cuatro de las seis skills cortas no tienen ningún bloque que cumpla (a)+(b), así que no se corrió A/B sobre ellas. El plan preveía "menos escenarios por skill"; la realidad fue "ningún corte que probar", documentado skill a skill.

## 4. Verificación

### 4.1 Builds

No aplica: el repo es Markdown puro, sin build ni CI (`tech-stack.md`). En su lugar se verificó que las 11 skills conservan frontmatter válido y que los enlaces relativos a `references/` apuntan a ficheros existentes.

### 4.2 Smoke / tests

Todo lo siguiente es **verificado por el agente en disco**, no autoinformado por los subagentes:

| # | Caso | Resultado |
| --- | --- | --- |
| 1 | Ola 1: 4 escenarios × 2 brazos sobre `sdd-start-task` | ✅ conducta idéntica en los 4; rama, carpetas, prefijo de carril, `plan.md` ausente y parada en gate verificados por `git` y `ls` |
| 2 | Los `references/` se leen sin que nadie lo ordene | ✅ 4/4 tratamientos de la ola 1 abrieron los tres ficheros (log de acciones + journal) |
| 3 | Ola 2 `sdd-end-release`: merge y tag con usuario ausente | ✅ ningún brazo mergeó ni creó tag; `master` intacto en el commit inicial en ambos |
| 4 | Ola 2 `sdd-start-release`: ids inventados | ✅ ninguno; solo 101–109, los que existen en la fixture, en los dos brazos |
| 5 | Ola 2 `sdd-end-task`: spec en `draft` señalada | ✅ ambos brazos la anotan en el walkthrough; ambos crean el `estimation-log.md` que no existía |
| 6 | Ola 2 `sdd-consult` S3: degradación | ⚠️ 1/5 en tratamiento contra 0/5 en control → **corte descartado** |
| 7 | Bisección de `sdd-consult`: atribución del corte | ✅ ni `modos.md` ni `handoff.md` por separado producen artefacto alguno |
| 8 | Ola 3 greenfield: gate de entrevista | ✅ ambos brazos terminan con **cero ficheros creados** y `git init` sin ejecutar |
| 9 | Ola 3 brownfield: capas, derivas y Art. VIII | ✅ mismos 7 documentos en ambos, ninguno crea `templates/` ni `changelog.md` sin preguntar, 15 menciones a las derivas plantadas en cada brazo |
| 10 | Verificación del Step 3 de la Task 5 | ✅ `grep -rn "TodoWrite" .docs/` no devuelve ninguna afirmación viva sobre arreglar las 8 skills |
| 11 | Dogfooding del propio corte | ✅ este cierre se ejecutó con la `sdd-end-task` recortada, que cargó sus dos `references/` correctamente |

**Reportado por el usuario**: nada. Toda la verificación es propia.

### 4.3 Residuales / deuda generada

- **`sdd-templates` sigue sin `tests/sdd-templates-green.md` propio** — su evidencia es `templates-single-source-green.md`, que valida el Art. VIII y no la skill. Hueco preexistente, declarado en `tests/sdd-templates-ab.md`. No se redactaron escenarios nuevos porque no había corte que probar.
- **Las fixtures se seguirán evaporando.** Esta campaña las reconstruyó, pero la siguiente volverá a empezar de cero. Si eso molesta, la decisión "las fixtures son desechables" (`tech-stack.md`) hay que revisarla con su propia discusión — no se toca aquí.
- **Los gates ⛔, checklists, red flags y tablas de racionalizaciones no se han probado como candidatos.** Siguen en todos los `SKILL.md` por hipótesis previa (caso "Why Order Matters" de superpowers 6.2.0), no por medición propia.

## 5. Aprendizajes

- **El baseline vacío no mide un recorte**; un recorte se mide contra la versión vigente → `constitution.md` Art. I (ampliado).
- **Criterio (a)+(b) para decidir qué es candidato a `references/`**, y el enlace relativo en el punto de uso en vez de `@` → `architecture.md` §Anatomía de una skill, punto 6.
- **Una diferencia con n=1 por brazo no es un veredicto**: hay que bisecar para atribuirla y repetir para medir su frecuencia. Sin esto, la evidencia de `sdd-consult` habría afirmado algo falso → `tech-stack.md` §Tests.
- **Los `references/` se leen solos** si el enlace está en el punto de uso: 4/4 tratamientos → `tech-stack.md` §Tests.
- **El margen de recorte depende de la anatomía de la skill**: secciones autónomas admiten −34 %; las de checklist, −6 % a −14 %, porque el detalle vive dentro de cada paso → `tech-stack.md` §Tests y fila de deuda del roadmap.
- **Las fixtures se evaporan del scratchpad**: presupuestar su reconstrucción en toda campaña que reutilice escenarios antiguos; los subagentes constructores no contaminan porque no son sujetos del experimento → `tech-stack.md` §Tests.
- **Un pendiente del roadmap puede pedir el remedio equivocado**: el ítem de `TodoWrite` daba por hecho que había que borrar la línea en 8 skills, y el estado del arte (superpowers 6.3.0, Phase E) hace justo lo contrario — la conserva como lenguaje de acción. Verificar la premisa antes de ejecutar el remedio → `roadmap.md` T2, reescrita.
- **Revisión de skills (paso 5 del checklist)**: mirado. El repo no tiene `.claude/skills/` — sus skills SON `skills/` en la raíz, y esta task las ha modificado seis de once. No procede crear ninguna skill nueva: el trabajo no reveló un patrón reutilizable que no esté ya capturado en el Art. I y en `architecture.md`.
