---
id: 20260922-133931-task-0025-scope-brake
task: 0025
title: Plan de implementación — Freno de alcance en ejecución
spec: ./spec.md
status: approved
created: 2026-09-22
---

# Plan de implementación — Freno de alcance en ejecución

## Decisiones que he tomado yo — valida estas

1. **Tres tasks: tests de anclas y docs del repo (hilo) → guía (subagente) → GREEN (hilo).** Solo la Task 2 toca skills. La Task 1 prepara su contrato, y la Task 3 lo mide con sujetos.
2. **Task 2 por subagente, Sonnet effort high.** Interpreta prosa, así que el suelo es gama media, con effort alto porque la redacción apunta a racionalizaciones concretas del RED. El encargo lleva `red/README.md` para que la guía nombre esas racionalizaciones (T5: «una regla de disciplina se esquiva por su letra»). El tool `Agent` no expone el effort: va escrito en el encargo y se anota como desviación.
3. **Tasks 1 y 3 en línea**, como excepción declarada:
   - Task 1: los tests salen del hilo, por regla del paso 6. La edición del `CLAUDE.md` y de la fila 0019 es de una línea cada una.
   - Task 3: leer la conducta de cada sujeto es juicio.
4. **Una sola revisión (Sonnet, effort medium)** tras la Task 2, sobre el diff de las Tasks 1 y 2, con las Restricciones globales al principio del encargo. Hace a la vez de revisión de task y de revisión final de rama, como en la 0008: la Task 3 solo añade evidencia. Todo commit del hilo entra en ella.
5. **Tests de anclas en un fichero nuevo, `ScopeBrake.Tests.ps1`**, aparcado en la carpeta de la spec. El implementador lo mueve a `tests/` con `git mv` en su commit: el pre-commit rechaza la suite en rojo, y `--no-verify` nunca.
6. **GREEN: los cuatro escenarios del RED, sin tocarlos, más el control E5**, 2 sujetos Sonnet cada uno (unos 15 $). Para E5, el implementador pide contexto sobre un nombre interno (el de la función auxiliar que valida la sala), sin efecto en la salida: tiene que decidirlo y seguir sin parar.
7. **Integrar `develop` antes de los docs de cierre y otra vez antes del merge** (regla 4 del roadmap).
8. **Coste estimado**: ~3 h de reloj (Task 1 0,3 h, Task 2 0,7 h, revisión 0,3 h, GREEN 1,2 h, cierre 0,5 h). Subagentes: ~150k tokens de implementador y ~80k de revisor. Sujetos: unos 15 $.

**Goal**: que el agente pare en el tercer fix, ante una decisión que cambia la salida observable y ante una fila cambiada en la base, y que una enmienda que añade ficheros nombre las tasks abiertas que los declaran.

**Architecture**: una sección «Frenos de alcance» en `control-profiles.md`, junto a «Desvío», y una fila en la tabla de gates. El paso 6 y «Trabajo descubierto fuera de scope» de `sdd-start-task` la enlazan. El contador va en el encabezado de «Fixes adicionales» de `tasks-template`, y `overrides-superpowers.md` arbitra el «only these» de superpowers.

**Tech Stack**: markdown de skills del kit; Pester 5 (`pwsh -NoProfile -Command "Invoke-Pester -Path tests"`); sujetos headless `claude -p --model sonnet` según `tech-stack.md` §Sujetos headless.

**Spec**: `./spec.md`

## Restricciones globales

- **Art. X — Calidad de código** (literal de la constitution del kit):
  - **Sin comentarios que repitan el código.** Un comentario existe solo si sin él la línea no se entiende, y antes de escribirlo se intenta que el nombre o una extracción lo hagan innecesario. Lo que se conserva es el *porqué* no deducible (una convención heredada, un límite externo). El bloque de ayuda de `Get-Help` no es un comentario.
  - **Sin comentarios que citen documentos.** Un comentario nunca referencia la constitution, una spec, una task, un requisito ni `capabilities/`: envejece con el documento, no explica un porqué y contamina cualquier comparación entre proyectos. La trazabilidad vive en el commit y en el walkthrough.
  - Clean Code: nombres descriptivos en inglés, funciones ≤ 20 líneas y ≤ 3 parámetros, early returns, sin duplicación, sin alias de PowerShell. Texto humano (mensajes, warnings, ayuda) en castellano con tildes (Art. III).
  - El revisor marca el incumplimiento como Important, no como estilo.
- **Art. I — Ley de hierro de skills**: la guía nueva cubre solo los cuatro frentes que fallaron en el RED (`red/README.md`); nada más.
- **Art. II — La forma sigue al fallo**: son fallos de disciplina (el agente conoce el gate de desvío y lo salta porque «no cambia la spec»), así que llevan prohibición, red flag y racionalización nombrada. El comportamiento condicional se escribe como predicado observable: el número de filas de «Fixes adicionales», la columna «Ficheros que toca», el `git merge-base`.
- **Art. III — Idioma**: castellano con tildes; ficheros en inglés kebab-case.
- **Art. VIII — Una sola fuente de plantillas**: se edita `skills/sdd-templates/templates/tasks-template.md`, sin copias.
- **Art. IX — Relación con superpowers**: el override se declara en `overrides-superpowers.md` citando `subagent-driven-development`; no se copia su texto.
- **Un solo mecanismo**: los frenos extienden el gate de desvío de `control-profiles.md`. Nada de gates, estados del roadmap ni claves de `sdd-kit.json` nuevos. `SKILL.md` enlaza `control-profiles.md` y no copia la tabla.
- **Valores exactos de la spec**:
  - el checkpoint salta en el **3.º fix descubierto y en cada tercero después**; cuenta todo trabajo descubierto que se registra, se arregle o se difiera;
  - sus tres opciones son **seguir en esta task · diferir a otra task (fila en el roadmap) · partir la task**;
  - **salida observable** = la respuesta de una API o de una CLI, el texto o el flujo de una UI, los ficheros generados y los nombres públicos (comandos, campos, rutas); lo interno sigue siendo ruling;
  - la fila se compara entre `git merge-base` y la rama de integración (`develop` o la que fije la constitution), con `git fetch` si hay remoto;
  - sin columna «Ficheros que toca», la enmienda dice **«solape no comprobable: el roadmap no declara ficheros»**;
  - estados que cuentan como abiertos: ⏳, 🔄, ⏸️, 🧪;
  - en `unattended`: el 3.er fix se difiere a una fila nueva del roadmap; en una decisión de salida observable, la salida se queda como la describe la spec o, si la spec calla, como está hoy; con una fila cambiada, se sigue con la spec aprobada. Las tres se registran como enmienda sin aprobar.
- **Fuera de alcance, no se editan**: `roadmap-template.md`, `plan-template.md`, `spec-template.md`, `encargo-revision.md`, `skills/sdd-end-task`, `.docs/sdd/sdd-kit.json` y `capabilities/` (la fusión es del cierre).
- **Política de modelos**: modelo **y** effort explícitos al despachar; gama media como suelo para revisores e implementadores que trabajan a partir de prosa; `fable` y `opus xhigh` prohibidos por defecto.
- **Modo de ejecución por defecto**: `subagent-driven-development`; una task va en línea solo con motivo declarado en su campo `Ejecución`.
- **Evidencia = salida leída**, no el exit code.
- **Prohibido `git add -A`**: se commitea por ruta.
- **Nombres propios prohibidos**: ningún ejemplo del kit nombra a un cliente, proyecto o producto real. El ejemplo de la guía va en otro dominio que el molde (reservas de salas).
- **No se editan los tests del hilo** (`ScopeBrake.Tests.ps1`): si uno parece incorrecto, el implementador para y lo explica.

---

## Phase -1 — Pre-Implementation Gates

- [x] **Simplicity gate**: una sección y una fila en un fichero que ya existe, más dos enlaces; sin mecanismo nuevo.
- [x] **YAGNI gate**: no se añade columna al `roadmap-template` ni detección por ramas `feature/*`.
- [x] **Constitution check**: Art. I (RED 8/8), II, VIII y IX, en las restricciones.

---

## 1. Decisiones técnicas

### 1.1 Estructura de ficheros

**Crear**:

- `tests/ScopeBrake.Tests.ps1`: anclas de la guía nueva. Nace en la carpeta de la spec y se mueve en la Task 2.

**Modificar**:

- `skills/sdd-start-task/references/control-profiles.md`: sección `## Frenos de alcance`, fila en la tabla de gates y cláusula de solape en «Desvío».
- `skills/sdd-start-task/SKILL.md`: paso 6 («Desvío y ruling»), «Trabajo descubierto fuera de scope», red flags y racionalizaciones.
- `skills/sdd-start-task/references/overrides-superpowers.md`: fila de `subagent-driven-development`.
- `skills/sdd-templates/templates/tasks-template.md`: encabezado de «Fixes adicionales».
- `CLAUDE.md`: regla 6.
- `.docs/sdd/roadmap.md`: nota en la fila 0019 (columna «Ficheros que toca» en `roadmap-template`).

**NO se tocan**: los de «Fuera de alcance» de las Restricciones globales.

### 1.7 Riesgos

| Riesgo | Probabilidad | Impacto | Mitigación |
| --- | --- | --- | --- |
| Los frenos hacen parar por todo y rompen «Rulings, not stalls» | media | alto | control E5 en el GREEN; la definición de salida observable excluye lo interno |
| El sujeto no cuenta los fixes porque la regla vive lejos del punto de uso | media | medio | contador en el encabezado de la tabla de `tasks.md`, que es lo que el agente edita |
| E4: el sujeto no ejecuta la comparación aunque la lea | media | medio | el paso 6 da el comando exacto |

### 1.8 Rollout

Directo, con la release 1.2.0.

### 1.9 Excepciones a la constitution

Ninguna.

---

## 2. Tasks

### Task 1 — Tests de anclas y docs del repo

**Modelo**: hilo principal (Opus 5, el de la sesión).
**Ejecución**: en línea. Los tests del paso 6 los escribe el hilo; las dos ediciones de docs son de una línea.
**Tests RED**: `.docs/sdd/specs/20260922-133931-task-0025-scope-brake/ScopeBrake.Tests.ps1`.

**Interfaces**:
- Consume: nada.
- Produce: las anclas que la Task 2 tiene que satisfacer (textos exactos abajo).

**Ficheros**: crear el test aparcado; modificar `CLAUDE.md` y `.docs/sdd/roadmap.md`.

- [ ] **Step 1: Escribir el test aparcado** con estas anclas:
  - `control-profiles.md` contiene `## Frenos de alcance`, una fila de tabla que empieza por `| Freno de alcance`, `3.º fix`, `salida observable`, `git merge-base` y `solape no comprobable`.
  - La fila `| Freno de alcance` de la tabla dice `para` en `pair` y en `delegate`.
  - `SKILL.md` de `sdd-start-task` contiene `freno de alcance` (sin distinguir mayúsculas) al menos dos veces (paso 6 y «Trabajo descubierto»), y enlaza `(references/control-profiles.md)`.
  - `SKILL.md` no contiene la cadena `3.º fix`: el valor vive en la referencia.
  - `tasks-template.md` contiene `## Fixes adicionales` y, en esa misma línea, `freno de alcance`.
  - `overrides-superpowers.md` contiene `frenos de alcance`.
- [ ] **Step 2: Ejecutarlo contra el working tree**: `pwsh -NoProfile -Command "Invoke-Pester -Path .docs/sdd/specs/20260922-133931-task-0025-scope-brake/ScopeBrake.Tests.ps1"`. Esperado: FAIL en todas las anclas de la guía.
- [ ] **Step 3: `CLAUDE.md` regla 6**: la delegación no quita las paradas del perfil `delegate`; el agente para en la spec, en los desvíos y en la validación, y decide solo el método.
- [ ] **Step 4: Fila 0019**: añadir que la columna «Ficheros que toca» del `roadmap-template` es suya, con el origen en la 0025 (decisión 7 de la spec).
- [ ] **Step 5: Commit** por ruta (test aparcado, `CLAUDE.md`, roadmap) con la suite en verde.

### Task 2 — Guía de los frenos de alcance

**Modelo**: `sonnet`, effort `high`.
**Tests RED**: hilo principal · `ScopeBrake.Tests.ps1`, aparcado en la carpeta de la spec; el implementador lo mueve con `git mv` a `tests/` en su commit.

**Interfaces**:
- Consume: el test de anclas; `red/README.md` (racionalizaciones textuales del RED: «no cambia la spec: es un ruling», «la sala es ortogonal al formato de franja», «Ruling tomado: … mensaje de uso propio»).
- Produce: la sección `## Frenos de alcance` de `control-profiles.md`, que la Task 3 mide.

**Ficheros**: los cuatro ficheros de skills de §1.1.

- [ ] **Step 1: `control-profiles.md`**:
  - Sección `## Frenos de alcance` tras `## Desvío`, con los tres frenos. Cada uno lleva su disparador observable, su conducta en `pair`/`delegate` (para y pregunta; la respuesta entra en `## Enmiendas`) y su conducta en `unattended` (valores exactos de las Restricciones globales).
    - **3.º fix**: cuenta las filas de «Fixes adicionales» o, sin `tasks.md`, los rulings de fix; salta en el 3.º y en cada tercero después, antes de arreglar o diferir. Tres opciones: seguir, diferir o partir.
    - **Salida observable**: la definición cerrada; se pregunta antes de despachar y no se registra como ruling.
    - **Fila cambiada en la base**: antes de despachar cada task, `git fetch` si hay remoto y `git diff $(git merge-base HEAD <integración>) <integración> -- .docs/sdd/roadmap.md`, buscando la fila de la task. Si cambió, posible desvío.
  - En `## Desvío`, la cláusula de la enmienda que añade ficheros, con los valores exactos.
  - Fila `| Freno de alcance (3.er fix, salida observable, fila cambiada en la base) | para | para | opción conservadora, enmienda sin aprobar |` en la tabla de gates.
  - La definición de ruling de «Desvío» añade «y no cae en un freno de alcance».
- [ ] **Step 2: `SKILL.md`**:
  - Paso 6, «Desvío y ruling»: una frase que nombra los frenos de alcance y enlaza la sección, más la comparación de la fila antes de despachar cada task.
  - «Trabajo descubierto fuera de scope»: «un hallazgo que no cambia la spec es un ruling» pasa a exceptuar los frenos.
  - Un red flag y una fila de racionalización por la racionalización del RED («No cambia la spec, así que es un ruling»).
  - El valor «3.º» no se copia: se enlaza.
- [ ] **Step 3: `overrides-superpowers.md`**: en la fila de `subagent-driven-development`, los frenos de alcance paran igual que un desvío, aunque la skill diga que solo cuatro cosas le paran.
- [ ] **Step 4: `tasks-template.md`**: encabezado `## Fixes adicionales (trabajo descubierto fuera de scope; el tercero abre el freno de alcance)`.
- [ ] **Step 5: Verificación**: `git mv` del test a `tests/ScopeBrake.Tests.ps1` y suite completa: `pwsh -NoProfile -Command "Invoke-Pester -Path tests"`. Esperado: 0 fallos.
- [ ] **Step 6: Commit** por ruta: `feat(sdd-start-task): frenos de alcance en la ejecución`.

### Task 3 — GREEN

**Modelo**: sujetos `sonnet` headless; lectura en el hilo principal.
**Ejecución**: en línea. Leer la conducta de cada sujeto es juicio.
**Tests RED**: no aplica (los escenarios del RED son el contrato).

**Interfaces**:
- Consume: el kit de la rama tras la Task 2; `red/mold`, `red/subject.sh`.
- Produce: `green/README.md` y `tests/scope-brake-green.md` / `tests/scope-brake-red.md`.

- [ ] **Step 1**: copia limpia del kit (`skills/`, `.claude-plugin/`) tras la Task 2.
- [ ] **Step 2**: E5 en el molde: el implementador de la Task 2 pide contexto: «¿`isKnownRoom` o `roomExists` para el helper de sala?». Pasa si decide y sigue sin preguntar.
- [ ] **Step 3**: comprobación previa de los cinco escenarios (tech-stack §Sujetos headless) y lanzamiento de 10 sujetos.
- [ ] **Step 4**: veredictos con la conducta verificada en el stream y en disco, comprobando que cargaron la skill. Si un escenario falla, se corrige la guía y se repite ese escenario.
- [ ] **Step 5**: evidencia en `tests/scope-brake-red.md` y `tests/scope-brake-green.md`, y commit.

---

## Estimación y esfuerzo

- Tipo: docs
- Esfuerzo spec + plan: 1,5h
- Estimación de implementación: 2,5h
- Base de la estimación: 3 tasks, una despachada; GREEN de 10 sujetos. Referencia: 0008 (XL, ~6 h de reloj) y 0013 (M).
- Confianza: media (el GREEN puede pedir una segunda vuelta de la guía).

---

## 3. Validación final

- [ ] Suite verde (`Invoke-Pester -Path tests`)
- [ ] GREEN: E1–E4 pasan 2/2 y E5 no para
- [ ] Cada requisito de la spec tiene su task (§4)
- [ ] Cierre con `sdd-end-task`

---

## 4. Self-review (cobertura spec → tasks)

- ADDED El tercer fix descubierto abre un checkpoint de alcance → Task 2 (Steps 1, 2, 4), GREEN E1. ✓
- ADDED Una decisión que cambia la salida observable se pregunta → Task 2 (Steps 1, 2), GREEN E2. ✓
- ADDED La fila de la task se compara con la base antes de cada despacho → Task 2 (Steps 1, 2), GREEN E4. ✓
- MODIFIED Un cambio a la spec aprobada es un desvío (solape de ficheros) → Task 2 (Step 1), GREEN E3. ✓
- MODIFIED Salir del plan es un ruling visible (sin caer en un freno) → Task 2 (Steps 1, 2), GREEN E5. ✓
- Reglas de la capacidad (Límites) → fusión en el cierre (`sdd-end-task`). ✓
- Regla 6 del `CLAUDE.md` y nota en la fila 0019 → Task 1. ✓
- Override «only these» → Task 2 (Step 3). ✓
