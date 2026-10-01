---
id: 20261001-112831-feature-0127-sdd-config-field-validation
feature: 0127
title: Plan de implementación — sdd-config pregunta la validación en campo
spec: ./spec.md
status: approved
created: 2026-10-01
---

# Plan de implementación — `sdd-config` pregunta la validación en campo

## Decisiones que he tomado yo — valida estas

1. **Ejecución Native.** La guía se escribe a partir de lo que mide el RED, y la escribe el hilo que ha leído las salidas. Con dos tasks, un implementador por task no compensa su contexto.
2. **Modelo.** Implementa la sesión (Opus 5.5): el dev-lead aprobó sin la parada para bajar a Sonnet. Los sujetos headless van con Sonnet (`MODEL=sonnet`). El revisor final, con `sdd-kit:effort-high` + `opus`.
3. **El RED de los tres escenarios va junto, en la Task 1**, antes de editar ninguna skill y contra un `git worktree add --detach` de `develop` en el scratchpad.
4. **Un solo `subject.sh`** en `red/subject.sh`, con el molde `salas` de la 0118 y los escenarios `c1`, `m1` y `g1`, y para el GREEN `m2`, `k1` y `c2`. El GREEN usa el mismo script con el kit de este worktree.
5. **Test estático**: `tests/SddConfig.Tests.ps1` pasa a ocho preguntas, y gana dos tests: la 7 escribe `validation.mode` en `sdd-kit.json`, y `v2.3.0.md` invoca `sdd-config`. Es el RED por fallo de la Task 2; la conducta la mide la campaña.
6. **Coste**: ~1,5 h de implementación. Campaña: 6 sujetos en el RED, 9 en el GREEN y 4 de reserva; ~5 $, techo 8 $ (spec, decisión 7). Revisor final: ~120k tokens.
7. Review Focus: 4 entradas que la spec no fija, con su comportamiento esperado; ver la sección.

**Goal**: que `sdd-config`, las dos init y la migración a v2.3.0 pregunten `validation.mode` desde el catálogo, con `manual` recomendado salvo en un proyecto sin nada que probar al cerrar.

**Architecture**: una fila más en el catálogo de `sdd-config`, la única fuente de las preguntas de claves. Las init la heredan al invocarlo y solo nombran el tema. La migración gana un paso con el patrón de las claves de control de la v2.0.0. La conducta se mide con sujetos headless, y la forma, con Pester.

**Tech Stack**: Markdown (skills), PowerShell 7 y Pester ≥ 5, `tests/headless/` (sujetos Sonnet).

**Spec**: `./spec.md`

**Ejecución**: native, porque las tasks son campaña y prosa que escribe el hilo a partir de lo que mide · Si esta sesión se retomó tras una compactación (empieza por «This session is being continued from a previous conversation») y quedan dos o más tasks sin su línea `complete` en el ledger, no las hagas tú: despacha las que quedan con subagent-driven-development sobre el mismo ledger. · La sesión que ejecuta va bien en gama media (Sonnet, effort medium); el modelo más capaz se reserva para la revisión final.

## Restricciones globales

### De código

- Sin comentarios que repitan el código. Un comentario existe solo si sin él la línea no se entiende; se conserva el porqué no deducible. El bloque de ayuda de `Get-Help` no es un comentario.
- Sin comentarios que citen documentos: nunca la constitution, una spec, una task, un requisito ni `capabilities/`.
- Clean Code: nombres descriptivos en inglés, funciones ≤ 20 líneas y ≤ 3 parámetros, early returns, sin duplicación, sin alias de PowerShell. Texto humano (mensajes, ayuda, skills) en castellano con tildes.
- El revisor marca el incumplimiento como Important, salvo un umbral numérico superado en una unidad, que es Minor.
- Literales: la clave es `validation.mode`, con `manual` (default, también sin clave) y `field`, solo en `sdd-kit.json`. Pregunta 7 del catálogo: «¿Quién valida el trabajo al cerrar: el dev-lead, probándolo (`manual`), o el uso real, por los tickets de `sdd-feedback` (`field`)?». La de `validation.startEnvironment` pasa a ser la 8.
- `control-profiles.md`, las skills de cierre y `Test-Roadmap.ps1` no se tocan.

### De proceso

- Política de modelos: la del Art. IV. Revisor final con `sdd-kit:effort-high` + `opus`; sujetos headless con Sonnet.
- Campaña: `SUBJECT_CAP=19`, `COST_CAP=8` en cada llamada a `tests/headless/run.sh`, con `SPEC_DIR` en esta carpeta.
- Si un escenario sale limpio en el RED, su guía no se escribe y se repite como control en el GREEN (Art. I), tras mirar de dónde sacó cada sujeto la conducta.
- Commits: tipo y scope en inglés, título y cuerpo en castellano, con el trailer `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`. Un commit por task. Nunca `--no-verify`; la suite completa, desde la herramienta PowerShell.

## Review Focus

- `validation.mode` ya escrito (`field` en este repo) y el usuario que invoca `sdd-config` sin pedir cambiarla → no se vuelve a preguntar · Task 2, regla vigente del paso 2 de `sdd-config` («una clave con valor no se vuelve a preguntar»); lectura
- Una init greenfield, donde aún no hay código → la recomendación sale del stack de la pregunta 11 (con interfaz: `manual`) · Task 2, la fila 7 nombra en qué se fija; `g1` en el GREEN
- La migración con el roadmap pendiente de gate y el dev-lead presente → la pregunta de quién valida se hace igual, y el marcador no sube por el roadmap, no por ella · Task 2, el paso nuevo no depende del 1; lectura
- Respuesta «`field`» dada en la migración → el commit de la migración la cita como frase del dev-lead (regla del atajo de `control-profiles.md`) · Task 2, el paso lo dice; lectura

---

## Phase -1 — Pre-Implementation Gates

- [x] **Simplicity gate**: una fila de catálogo, una frase en cada init y un paso de migración; sin script nuevo.
- [x] **YAGNI gate**: sin cambio en `control-profiles.md` ni en los cierres.
- [x] **Brownfield gate**: sin la clave, todo sigue en `manual`, como hoy.
- [x] **Constitution check**: Art. I (RED/GREEN con previsión), Art. V (una sola fuente, migración en la release en preparación), Art. VIII (sin plantillas nuevas).

---

## 1. Decisiones técnicas

### 1.1 Estructura de ficheros

**Crear**:

- `red/subject.sh` de esta carpeta — molde `salas` y los escenarios.
- `tests/sdd-config-field-validation-red.md`, `tests/sdd-config-field-validation-green.md` — evidencia.

**Modificar**:

- `skills/sdd-config/SKILL.md` — fila 7 nueva, la 8 de hoy, «Quién pregunta qué».
- `skills/sdd-init-greenfield/SKILL.md` (fila 19) y `skills/sdd-init-brownfield/SKILL.md` (fila 1) — «y quién valida» en la lista de temas.
- `skills/sdd-init-brownfield/references/generacion.md` — `validation` entre las claves de `sdd-kit.json`.
- `skills/sdd-init-brownfield/references/migrations/v2.3.0.md` — título, entradilla, paso 2 nuevo (el marcador pasa a 3), `**Escribe**:` y verificación.
- `tests/SddConfig.Tests.ps1` — ocho preguntas y los dos tests nuevos.

**NO se tocan**:

- `skills/sdd-start-feature/references/control-profiles.md` — la clave, su default y la regla del atajo ya están (spec, decisión 5).
- `tests/MigrationInitParity.Tests.ps1` — debe seguir en verde sin cambios.

### 1.7 Riesgos

| Riesgo | Probabilidad | Impacto | Mitigación |
| --- | --- | --- | --- |
| `g1` no llega a la pregunta 7 porque el sujeto vuelve a preguntar algo de la 1 a la 18 | media | el escenario no mide | la petición trae todas las respuestas; si el RED no llega, se ajusta la petición antes del GREEN y se dice |
| El RED sale limpio en `c1` porque el sujeto lee la clave en `control-profiles.md` | baja | la guía no tendría baseline | Art. I: se mira de dónde la sacó y se lanza una tanda más antes de recortar |

### 1.9 Excepciones a la constitution

Ninguna.

---

## 2. Tasks

### Task 1 — RED de `c1`, `m1` y `g1`

**Modelo**: la sesión (Opus 5.5) · sujetos `MODEL=sonnet`
**Tests RED**: hilo principal · la campaña es el test
**Superficies**: tooling (campaña)
**Verificación**: `ls red/out/` lista 6 sujetos con su transcripción
**Se prueba en la aplicación**: no, porque es la medición previa a la guía

**Interfaces**:
- Consume: `tests/headless/run.sh` y `lib.sh`; molde `salas` de `../20260930-211302-feature-0118-field-validation-mode/red/subject.sh`
- Produce: `red/subject.sh <kit> <etiqueta> <escenario> <salida>` con `c1`, `m1`, `g1`, `m2`, `k1`, `c2`; `tests/sdd-config-field-validation-red.md` con una fila por medida

**Ficheros**: crear `red/subject.sh`, `tests/sdd-config-field-validation-red.md`

- [ ] **Step 1: Molde** — `subject.sh` con `sdd-kit.json` en 2.2.0 y todas las claves de control, sin `validation`. `c1`: skill `sdd-config`, petición «Revisa la configuración del kit y ponla al día». `m1` y `m2`: skill `sdd-init-brownfield`, roadmap que pasa `Test-Roadmap.ps1`, petición «Ponme el proyecto al día con sdd-init-brownfield»; `m2` añade «Estaré fuera un rato: déjame al final un informe». `g1`: skill `sdd-init-greenfield` en un repo vacío, con las respuestas de la 1 a la 18 (stack con interfaz web) y las seis primeras de `sdd-config` en la petición. `k1`: `c1` con `mission.md` de un kit de skills sin aplicación. `c2`: skill `sdd-config`, «Quiero validación en campo solo para mí».
- [ ] **Step 2: Ejecutar** — kit de `develop` en un worktree desanclado del scratchpad; 2 sujetos por escenario `c1`, `m1`, `g1`, en paralelo.
- [ ] **Step 3: Evidencia** — tabla con las medidas de la spec (decisión 7) por sujeto, citas literales y de dónde sacó cada sujeto la conducta; coste y turnos.
- [ ] **Step 4: Commit de la task** — `test(sdd-config): RED de la pregunta de validation.mode`.

### Task 2 — La pregunta en el catálogo, las init y la migración

**Modelo**: la sesión (Opus 5.5) · sujetos `MODEL=sonnet`
**Tests RED**: hilo principal · `tests/SddConfig.Tests.ps1`, antes de editar
**Superficies**: docs (skills), tooling (Pester)
**Verificación**: `Invoke-Pester -Path tests/SddConfig.Tests.ps1, tests/MigrationInitParity.Tests.ps1, tests/ControlProfiles.Tests.ps1` en verde; GREEN de los 9 sujetos
**Se prueba en la aplicación**: no, porque el kit se prueba en campo: lo mide el GREEN

**Interfaces**:
- Consume: `red/subject.sh` y las salidas del RED (Task 1)
- Produce: nada que use otra task

**Ficheros**: modificar los de §1.1

- [ ] **Step 1: Tests RED** — en `tests/SddConfig.Tests.ps1`: «el catálogo tiene ocho preguntas, en su orden» (`$rows.Count | Should -Be 8`, `$rows[6] | Should -Match 'validation\.mode'`, `$rows[7] | Should -Match 'validation\.startEnvironment'`); «la pregunta del entorno escribe solo en el fichero local» sobre `$rows[7]`; «la pregunta de quién valida escribe en sdd-kit.json» (`$rows[6] | Should -Match 'sdd-kit\.json'` y `-Not -Match 'sdd-kit\.local\.json'`); `v2.3.0.md` en la lista de «<_> invoca sdd-config». Ejecutar: falla.
- [ ] **Step 2: Guía** — fila 7 con la pregunta literal de «Restricciones», la recomendada (`manual`, con su motivo; `field` solo sin pantalla ni uso que el dev-lead pueda probar al cerrar, con el ejemplo del kit de skills; en greenfield, por el stack de la 11), «Escribe» (la respuesta: `validation.mode`; «no sé»: nada, y rige `manual`) y `sdd-kit.json`; «Quién pregunta qué» de la 1 a la 7, la 8 personal. Init: «y quién valida (`validation.mode`)». `generacion.md`: `"validation"?` en la forma y en «solo con lo respondido». `v2.3.0.md`: paso 2 con el patrón del paso 2 de `v2.0.0.md`, sin dev-lead pendiente y nunca `field`, el marcador sube igual; con `field`, el cuerpo del commit cita la respuesta; `**Escribe**:` con `validation.mode`; verificación: la clave existe o el informe la lista como pendiente.
- [ ] **Step 3: Verificación** — Pester de «Verificación» en verde; GREEN: `c1`, `m1`, `g1` ×2, `m2`, `k1`, `c2` ×1, con `tests/sdd-config-field-validation-green.md` (fallos del RED y controles).
- [ ] **Step 4: Commit de la task** — `feat(sdd-config): preguntar validation.mode en el catálogo, las init y la migración`.

---

## Estimación y esfuerzo

- Tipo: docs
- Esfuerzo spec + plan: 0,7h
- Estimación de implementación: 1,5h
- Base de la estimación: 2 tasks; campaña de 15 sujetos como la de la 0118 (16 sujetos, ~2,5 h con cinco skills); aquí una sola skill de guía y tres consumidores de una línea
- Confianza: media

---

## 3. Validación final

- [ ] Gate de cierre, una vez y en el hilo principal: `pwsh -NoProfile -Command "Invoke-Pester -Path tests"`, más `Test-Roadmap.ps1 -Path .docs/sdd`
- [ ] Smoke con una fila por THEN de la spec
- [ ] Spec satisfecha: cada requisito tiene su task (ver Self-review)
- [ ] Cierre en campo (`validation.mode: field`) con `sdd-end-feature`

---

## 4. Self-review (cobertura spec → tasks)

- ADDED «`sdd-config` pregunta quién valida el trabajo» → Task 2, `c1` y `k1`. ✓
- MODIFIED «`sdd-config` escribe solo lo respondido…» → Task 2 (fila 7, fichero `sdd-kit.json`), `c2`. ✓
- MODIFIED «La entrevista fija las claves de control» → Task 2 (init), `g1`. ✓
- ADDED «La migración a v2.3.0 pregunta quién valida» → Task 2 (`v2.3.0.md`), `m1` y `m2`. ✓
- MODIFIED «La migración a v2.3.0 lleva el roadmap…» (línea `**Escribe**:`) → Task 2, `MigrationInitParity.Tests.ps1` en verde. ✓
- Review Focus → Task 2, por lectura y `g1`. ✓
