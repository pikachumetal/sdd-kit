---
id: 20260922-153902-task-0018-roadmap-closing
task: 0018
title: Plan de implementación — Cómo se cierra una fila del roadmap
spec: ./spec.md
status: approved
created: 2026-09-22
---

# Plan de implementación — Cómo se cierra una fila del roadmap

## Decisiones que he tomado yo — valida estas

1. **Las tres tasks van en línea.** Son ediciones de Markdown y un test de Pester de unas 40 líneas, y el dev-lead está ausente («avanza hasta el end»). Su `CLAUDE.md` global pide confirmar modelos antes de despachar subagentes, y aquí nadie puede confirmarlos. Despachar agentes para cambiar una línea costaría más que el cambio.
2. **Revisión final: un solo revisor**, Sonnet con effort medium, vía `superpowers:requesting-code-review`, con la cabecera de `encargo-revision.md`. Hace falta porque la ejecución en línea se salta las revisiones por task (`sdd-end-task` paso 9). Uno solo, sin paralelizar.
3. **El GREEN repite el RED**: 4 sujetos Sonnet con los mismos moldes y el mismo `run.sh`, por unos 3 $.
4. **Enmienda propuesta, sin aprobar**: la regex del THEN está anclada a `^` y no lista las filas de «Backlog», cuya celda «Ítem» es la segunda columna. Se implementa la regex literal de la spec y la enmienda se presenta en la validación (ver `## Enmiendas` de la spec).
5. **Coste**: unas 1,5 h de reloj y unos 3 $ de sujetos, más un revisor de unos 100k tokens.

**Goal**: un solo formato contable para cerrar filas de deuda y de backlog, citado desde los dos cierres, con este roadmap normalizado.

**Architecture**: la forma vive en el bloque de ayuda de «Deuda técnica» de `roadmap-template.md`. `sdd-end-task` paso 8 y `sdd-end-patch` paso 4 la citan con su condición. Un test de Pester vigila las citas y el roadmap de este repo.

**Tech Stack**: Markdown de skills, PowerShell 7 con Pester 5, sujetos `claude -p --model sonnet`.

**Spec**: `./spec.md`

## Restricciones globales

- Formato saldada: `**[<Task|Patch> <id>, <AAAA-MM-DD>: saldada — <enlace>]**`; parcial: `**[<Task|Patch> <id>, <AAAA-MM-DD>: parcial — <enlace>; queda: <lo pendiente>]**`; enlace al `walkthrough.md` o al `patch.md`; el texto original de la fila sigue detrás sin reescribir.
- Regex de conteo, literal: `grep -E '^\| \*\*\[(Task|Patch) [^],]+, [0-9]{4}-[0-9]{2}-[0-9]{2}: saldada — '`.
- Una fila lleva un solo prefijo; un cierre posterior lo sustituye.
- El formato vive solo en `roadmap-template.md` (Art. VIII); las skills lo citan y no lo copian.
- Art. I: ninguna edición de skill sin RED→GREEN documentado en `tests/`.
- Art. III: texto humano en castellano con ortografía correcta; nombres de fichero en inglés kebab-case.
- Art. VI: commits con tipo/scope en inglés, título y cuerpo en castellano, nunca title-only.
- Art. X, literal: «Sin comentarios que repitan el código. Un comentario existe solo si sin él la línea no se entiende, y antes de escribirlo se intenta que el nombre o una extracción lo hagan innecesario. Lo que se conserva es el *porqué* no deducible (una convención heredada, un límite externo). El bloque de ayuda de `Get-Help` no es un comentario. · Sin comentarios que citen documentos. Un comentario nunca referencia la constitution, una spec, una task, un requisito ni `capabilities/` · Clean Code: nombres descriptivos en inglés, funciones ≤ 20 líneas y ≤ 3 parámetros, early returns, sin duplicación, sin alias de PowerShell. Texto humano (mensajes, warnings, ayuda) en castellano con tildes (Art. III). · El revisor marca el incumplimiento como Important, no como estilo.»
- Política de modelos (Art. IV): modelo y effort explícitos al despachar; gama media como suelo para revisores; `fable` y `opus xhigh` prohibidos por defecto.
- Modo de ejecución: `subagent-driven-development` por defecto; este plan declara las tres tasks en línea (decisión 1).
- El pre-commit corre la suite entera: el test RED se aparca en la carpeta de la spec y entra en `tests/` con `git mv` en el commit de la implementación; nunca `--no-verify`.
- Ninguna ruta versionada llega a 140 caracteres.

---

## Phase -1 — Pre-Implementation Gates

- [x] **Simplicity gate**: una receta en la plantilla y dos citas; sin script ni validador nuevo más allá del test.
- [x] **YAGNI gate**: sin migración para los proyectos y sin estados más allá de `saldada` y `parcial`.
- [x] **Constitution check**: Art. I (RED hecho, GREEN en la Task 1), VIII (fuente única), X (test).

---

## 1. Decisiones técnicas

### 1.1 Estructura de ficheros

**Crear**:

- `tests/RoadmapClosing.Tests.ps1` — citas de las dos skills, fuente única del formato y roadmap de este repo normalizado.
- `.docs/sdd/capabilities/roadmap.md` — capacidad nueva; la crea la fusión del delta en `sdd-end-task`, tras la validación, no esta implementación.
- `tests/roadmap-closing-green.md` — evidencia GREEN.

**Modificar**:

- `skills/sdd-templates/templates/roadmap-template.md` — bloque de ayuda de «Deuda técnica» con el formato y la regex.
- `skills/sdd-end-task/SKILL.md` — paso 8: cita del formato.
- `skills/sdd-end-patch/SKILL.md` — paso 4: cita del formato.
- `.docs/sdd/roadmap.md` — filas cerradas de «Backlog» y «Deuda técnica» al prefijo; fila de deuda del frente A.
- `.docs/sdd/tech-stack.md` — regla del disparador observable en «Fixtures y baselines».

**NO se tocan**:

- `skills/sdd-start-patch/SKILL.md` — volver a medir al arrancar un patch es de la 0015.
- `skills/sdd-init-brownfield/references/migrations/` — sin migración (decisión 9 de la spec).

### 1.7 Riesgos

| Riesgo | Probabilidad | Impacto | Mitigación |
| --- | --- | --- | --- |
| El sujeto del GREEN copia el prefijo pero reescribe el texto original | media | medio | la receta dice «sin reescribir» y el GREEN lo mide aparte |
| Normalizar filas antiguas cambia su significado | baja | medio | solo cambia el prefijo; el texto se conserva y el diff se lee fila a fila |

### 1.8 Rollout

Directo, con la release 1.2.0.

### 1.9 Excepciones a la constitution

Ninguna.

---

## 2. Tasks

### Task 1 — Receta, citas, capacidad y GREEN

**Modelo**: hilo principal (Opus 5); sujetos del GREEN `sonnet`, effort por defecto de `claude -p`, como en el RED.
**Ejecución**: en línea — decisión 1.
**Tests RED**: TDD del propio hilo, `RoadmapClosing.Tests.ps1` aparcado en la carpeta de la spec hasta la implementación.

**Interfaces**:
- Consume: nada.
- Produce: el formato en `roadmap-template.md` bajo el encabezado `## Deuda técnica`, con los literales `: saldada — <enlace>]**`, `: parcial — <enlace>; queda: <lo pendiente>]**` y la regex; las citas «formato de cierre de `roadmap-template.md`» en los dos pasos.

- [ ] **Step 1**: escribir `RoadmapClosing.Tests.ps1` con los casos de plantilla, citas y no-copia; ejecutarlo y verlo fallar.
- [ ] **Step 2**: bloque de ayuda en la plantilla; frase en el paso 8 de `sdd-end-task`: «Si la task salda una fila de «Deuda técnica» o de «Backlog», ciérrala con el formato de cierre de `roadmap-template.md` (`sdd-templates`)»; frase equivalente en el paso 4 de `sdd-end-patch`.
- [ ] **Step 3**: test en verde; `git mv` del test a `tests/`; commit.
- [ ] **Step 4**: GREEN con `red/run.sh` sobre una copia del kit con la guía; evidencia en `tests/roadmap-closing-green.md`; commit.

### Task 2 — Normalizar este roadmap

**Modelo**: hilo principal.
**Ejecución**: en línea — decisión 1.
**Tests RED**: casos del roadmap de este repo en `RoadmapClosing.Tests.ps1`, que fallan con el roadmap actual.

**Interfaces**:
- Consume: el formato de la Task 1.
- Produce: «Backlog» y «Deuda técnica» de `.docs/sdd/roadmap.md` sin tachados, sin cursiva de cierre, sin `Saldada por` y sin corchetes que no sigan el formato.

- [ ] **Step 1**: casos del roadmap en el test, en rojo.
- [ ] **Step 2**: convertir cada fila cerrada al prefijo, conservando el texto original; sacar del prefijo las notas que no cierran; añadir la fila de deuda del frente A con la evidencia.
- [ ] **Step 3**: test en verde; `grep` de conteo ejecutado y leído; commit.

### Task 3 — Disparador observable en `tech-stack.md`

**Modelo**: hilo principal.
**Ejecución**: en línea — decisión 1.
**Tests RED**: ninguno; es una regla de método de este repo, en un documento y no en una skill.

**Interfaces**:
- Consume: nada.
- Produce: una entrada en «Fixtures y baselines».

- [ ] **Step 1**: entrada nueva: una fila de deuda de conducta nombra su disparador observable (comando, frase o estado del molde que precede al fallo), y al volver a medir se informa «disparador ausente N/M» aparte de «no se reproduce», con el caso del patch 0028.
- [ ] **Step 2**: commit.

---

## Estimación y esfuerzo

- Tipo: docs
- Esfuerzo spec + plan: 1,25h (RED previo incluido)
- Estimación de implementación: 1,5h (rango 1–2 h)
- Base de la estimación: tres tasks de docs y un test; campaña GREEN en segundo plano (≈ 10 min de redacción de evidencia, según `estimation.md`); normalizar unas 20 filas del roadmap a mano.
- Confianza: media

---

## 3. Validación final

- [ ] Suite de Pester en verde
- [ ] GREEN: frente B con el prefijo y el texto original en 4/4; frente A sin regresión
- [ ] `grep` de conteo sobre este roadmap leído
- [ ] Revisión final limpia
- [ ] Cierre con `sdd-end-task` tras la validación del dev-lead

---

## 4. Self-review (cobertura spec → tasks)

- ADDED «Cerrar una fila de deuda o de backlog deja un prefijo contable», THEN y dos AND → Task 1 (receta, citas, GREEN). ✓
- Decisión 1 (frente A a deuda) → Task 2, paso 2. ✓
- Decisiones 2–6 (formato, grep, tablas, sustitución, fuente única) → Task 1. ✓
- Decisión 7 (capacidad `roadmap`) → fusión del delta en `sdd-end-task`. ✓
- Decisión 8 (disparador) → Task 3. ✓
- Decisión 9 (normalización y test) → Task 2 y Task 1, paso 1. ✓
- Escenario → task: el único escenario de la spec tiene su task (Task 1). ✓
