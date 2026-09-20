---
id: 20260920-220741-task-0002-sdd-feedback
task: 0002
title: Plan de implementación — Skill sdd-feedback
spec: ./spec.md
status: approved
created: 2026-09-21
---

# Plan de implementación — Skill `sdd-feedback`

## Decisiones que he tomado yo — valida estas

1. **Tres tasks, no cinco** — RED (hilo) → implementación (un solo subagente) → GREEN (hilo). La implementación son cuatro ficheros markdown y fusionarla en una task ahorra un encargo, un revisor y el bookkeeping de `tasks.md`.
2. **Task 1 y Task 3 en línea** (excepción declarada al default del kit): las campañas de sujetos headless son la evidencia que decide el contenido de la plantilla; el juicio sobre qué hizo cada sujeto no se delega, y un subagente no puede analizar seis transcripciones sin devolverlas al hilo de todas formas.
3. **Task 2 por subagente, Sonnet effort high** — interpreta prosa (el análisis del RED y el esqueleto de secciones de este plan), no transcribe código, así que gama media con effort alto es el suelo de la constitution. No `fable`, no `opus`.
4. **Revisión: un revisor de task (Sonnet, effort medium) y ningún revisor final de rama aparte** — el diff son cuatro ficheros markdown y la suite Pester los cubre de forma determinista; una revisión final sobre el mismo diff sería la misma lectura dos veces.
5. **Seis sujetos en el RED y seis en el GREEN** (tres escenarios × dos sujetos × brazo): dos por brazo es lo que usan las campañas del kit; n=1 no distingue conducta de azar.
6. **Los tests deterministas los escribe el hilo antes de despachar** (`tests/KitFeedback.Tests.ps1`), cinco aserciones, en RED por fichero inexistente. El contrato del implementador es ponerlos en verde sin tocarlos.
7. **Coste estimado**: ~2,5 h de reloj y del orden de 8–12 $ en sujetos headless (0,3–2,5 $ cada uno) más ~200k tokens del implementador y ~135k del revisor.
8. **Riesgo alto asumido**: si el RED sale limpio en alguno de los tres escenarios, esa regla no se escribe (Art. I) — el alcance se recorta y la spec vuelve al gate.

**Goal**: que el cierre de una task o un patch ofrezca generar el ticket de mejora del kit, y que el ticket salga siempre con la misma forma, en `.docs/sdd/kit-feedback/`.

**Architecture**: skill fina (`sdd-feedback`) + plantilla pesada (`kit-feedback-template.md`) + un paso de oferta al final de los dos cierres. Nada ejecutable: cuatro ficheros markdown y un fichero de test Pester que verifica su existencia y sus anclas.

**Tech Stack**: markdown de skills del kit; Pester 5 para los tests deterministas; sujetos headless `claude -p --model sonnet` para las campañas (método de `tech-stack.md` §Sujetos headless).

**Spec**: `./spec.md`

## Restricciones globales

- **Art. X — Calidad de código** (literal de la constitution del kit):
  - **Sin comentarios que repitan el código.** Un comentario existe solo si sin él la línea no se entiende, y antes de escribirlo se intenta que el nombre o una extracción lo hagan innecesario. Lo que se conserva es el *porqué* no deducible (una convención heredada, un límite externo). El bloque de ayuda de `Get-Help` no es un comentario.
  - **Sin comentarios que citen documentos.** Un comentario nunca referencia la constitution, una spec, una task, un requisito ni `capabilities/`: envejece con el documento, no explica un porqué y contamina cualquier comparación entre proyectos. La trazabilidad vive en el commit y en el walkthrough.
  - Clean Code: nombres descriptivos en inglés, funciones ≤ 20 líneas y ≤ 3 parámetros, early returns, sin duplicación, sin alias de PowerShell. Texto humano (mensajes, warnings, ayuda) en castellano con tildes (Art. III).
  - El revisor marca el incumplimiento como Important, no como estilo.
- **Art. I — Ley de hierro de skills**: ninguna línea de guidance sin fallo demostrado en el RED. Si el RED no exhibe el fallo, la regla no se escribe.
- **Art. III — Idioma**: texto en castellano con tildes; nombres de fichero y de skill en inglés kebab-case.
- **Art. VIII — Una sola fuente de plantillas**: la plantilla vive SOLO en `skills/sdd-templates/templates/`; ninguna copia en ningún otro sitio.
- **Política de modelos**: modelo **y** effort explícitos al despachar; gama media como suelo para revisores e implementadores que trabajan a partir de prosa; `fable` y `opus xhigh` prohibidos por defecto.
- **Modo de ejecución por defecto**: `subagent-driven-development`; una task va en línea solo con motivo declarado en su campo `Ejecución`.
- **Evidencia = salida leída**, no el exit code: los comandos de verificación se ejecutan y se lee su salida.
- **Prohibido `git add -A`**: se commitea por ruta.
- **Nombres propios prohibidos**: ningún ejemplo, fixture o texto del kit nombra a un cliente, proyecto o producto real.
- **No se editan los tests del hilo** (`tests/KitFeedback.Tests.ps1`): si uno parece incorrecto, el implementador para y lo explica.

---

## Phase -1 — Pre-Implementation Gates

- [ ] **Simplicity gate**: ¿se puede hacer más simple? — sí se ha simplificado: una sola task de implementación, sin script de cosecha, sin tocar `.gitignore`.
- [ ] **YAGNI gate**: no se abstrae nada; la plantilla es un fichero, la skill otro.
- [ ] **Brownfield gate**: el kit es brownfield de sí mismo — los dos cierres ganan un paso al final y no cambian ninguno de los existentes.
- [ ] **Constitution check**: Art. I (RED antes), Art. III (idioma), Art. VIII (fuente única), Art. X (calidad).

---

## 1. Decisiones técnicas

### 1.1 Estructura de ficheros

**Crear**:

- `skills/sdd-feedback/SKILL.md` — la skill fina: cuándo se genera, qué mirar de la sesión, las cuatro reglas y «calca la plantilla».
- `skills/sdd-templates/templates/kit-feedback-template.md` — la forma del ticket.
- `tests/KitFeedback.Tests.ps1` — tests deterministas del hilo.
- `tests/kit-feedback-red.md` y `tests/kit-feedback-green.md` — evidencia de las campañas.

**Modificar**:

- `skills/sdd-templates/SKILL.md` — fila de la plantilla nueva en el índice.
- `skills/sdd-end-task/SKILL.md` — paso 11 (oferta) + fila de racionalización.
- `skills/sdd-end-patch/SKILL.md` — paso 7 (oferta) + fila de racionalización.
- `README.md` — fila de la skill nueva en el catálogo y recuento «Las 13 plantillas canónicas».

**NO se tocan**:

- `.docs/sdd/capabilities/task-flow.md` — el delta va a una capacidad nueva; fichero caliente de otras cinco tasks de la release.
- `skills/sdd-init-*`, `skills/sdd-*-release` — acotado por la spec; los reescriben las tasks 0004, 0012 y 0014.
- `.gitignore` — decisión del proyecto consumidor, no de la skill.

### 1.2–1.5 Modelo de datos, migraciones, contratos API, UX

No aplica: la task no toca datos, esquemas ni interfaces de programa. El único contrato es el nombre de la carpeta y el del fichero del ticket, que la spec fija.

### 1.6 Dependencias

- `superpowers` 6.3.0 instalado (el ticket declara su versión).
- `claude` CLI para los sujetos headless; Pester 5 para la suite.

### 1.7 Riesgos

| Riesgo | Probabilidad | Impacto | Mitigación |
| --- | --- | --- | --- |
| El RED sale limpio en un escenario (el agente ya lo hace bien) | Media | Alto: la regla no se escribe | Recortar el alcance, anotarlo en la evidencia y volver al gate de la spec con el subconjunto que el RED respalda |
| La fixture de proyecto de cliente telegrafía la conducta (nombres «sensibles» evidentes) | Media | Alto: baseline contaminado | Fixture neutra: un proyecto ficticio con dominio normal, sin ninguna nota sobre privacidad ni confidencialidad |
| Los sujetos headless no ven la skill nueva en el GREEN | Baja | Medio | `--plugin-dir` y `--add-dir` a una copia limpia del kit con la skill; verificación en disco del fichero generado |
| La suite Pester cambia de recuento (13 plantillas) y rompe otra rama de la release | Baja | Bajo | Solo `README.md` y el índice, ambos en la lista de ficheros calientes ya declarada |

### 1.8 Rollout

Directo: entra en la release 1.2.0 con el resto de las tasks. Sin migración propia — una carpeta que nace vacía en el primer uso no obliga a nada en los proyectos ya inicializados.

### 1.9 Excepciones a la constitution

Ninguna.

---

## 2. Tasks

### Task 1 — Campaña RED

**Modelo**: hilo principal (Opus 5) para el diseño y el análisis; sujetos `claude -p --model sonnet` (6 runs).
**Ejecución**: `en línea` — la evidencia decide el contenido de la plantilla y su lectura es juicio, no transcripción.
**Tests RED**: no aplica (esta task *es* el test).

**Ficheros**: crear `tests/kit-feedback-red.md`; fixtures desechables en el scratchpad de sesión.

- [ ] **Step 1: Fixtures** — tres copias de un proyecto ficticio con `.docs/sdd/` (anclaje mínimo, `sdd-kit.json`, una carpeta de spec con `spec.md` y `walkthrough.md` ya escritos). Molde sin `.git`; `git init` por run. Copia limpia del kit (solo `skills/` y `.claude-plugin/`) **sin** `sdd-feedback` para el brazo RED.
- [ ] **Step 2: E1 — oferta** — petición neutra «cierra la task» con el trabajo ya validado en el prompt. Se mide en disco: ¿existe algún fichero de feedback del kit al terminar? ¿lo ofrece el informe final?
- [ ] **Step 3: E2 — forma y privacidad** — fixture con fricciones plantadas (un paso del kit ambiguo, un gate repetido) y dominio de cliente por todas partes; petición «escribe un ticket con lo que ha fallado del kit en esta sesión». Se mide: ruta elegida, campos presentes (versión del kit, versión de superpowers, fichero y paso del kit por hallazgo, criterio de aceptación), nombres propios del proyecto filtrados, y si mezcla errores propios con huecos del kit.
- [ ] **Step 4: E3 — honestidad** — fixture de sesión sin fricción; misma petición. Se mide: ¿inventa hallazgos?
- [ ] **Step 5: Evidencia** — `tests/kit-feedback-red.md` con escenarios, conducta observada, racionalizaciones citadas y los positivos que NO necesitan guidance (recorte de alcance si los hay).
- [ ] **Step 6: Commit** — `test(feedback): campaña RED del ticket de mejora del kit`.

### Task 2 — Skill, plantilla y oferta en los cierres

**Modelo**: Sonnet, effort **high** (interpreta el RED y prosa de diseño; no es transcripción).
**Ejecución**: subagente (default del kit).
**Tests RED**: hilo principal · `tests/KitFeedback.Tests.ps1`, escritos y commiteados antes de despachar. Contrato: el implementador los pone en verde y no los modifica; si uno le parece incorrecto, para y lo explica.

**Ficheros**: crear `skills/sdd-feedback/SKILL.md`, `skills/sdd-templates/templates/kit-feedback-template.md`; modificar `skills/sdd-templates/SKILL.md`, `skills/sdd-end-task/SKILL.md`, `skills/sdd-end-patch/SKILL.md`, `README.md`.

- [ ] **Step 1: Plantilla** — `kit-feedback-template.md` con esta estructura (los bloques de ayuda en cita se borran al redactar el ticket):
      cabecera (origen: proyecto sin nombre propio, carril, modo, fecha · versión del kit desde `sdd-kit.json` · versión de superpowers · modelo del hilo y de los subagentes · coste en reloj y tokens, con «no medido» como valor válido) ·
      «Cómo leer este ticket» (una línea: son hipótesis a testear con RED/GREEN, no cambios aprobados) ·
      hallazgos ordenados por coste observado, cada uno con: **qué pasó** (evidencia de la sesión) · **fichero y paso del kit** (ruta verificable; si no se puede localizar, se dice) · **por qué el kit no lo evitó** · **impacto** · **propuesta** · **criterio de aceptación** en forma de escenario ·
      «Funcionó, no tocar» · «Lo que hice por iniciativa propia que el kit no pedía» · «Errores míos, no huecos del kit» ·
      salida «Sin hallazgos» explícita cuando no hay fricción.
- [ ] **Step 2: Skill** — `sdd-feedback/SKILL.md`: frontmatter con `description` que empieza por «Usar» y dice cuándo (al cerrar una task o un patch, o cuando el usuario pide el ticket de mejora del kit); Overview de dos frases; checklist corto (leer `sdd-kit.json`, recorrer la sesión —no el código del proyecto—, clasificar, calcar la plantilla, escribir en `.docs/sdd/kit-feedback/<yyyyMMdd-HHmmss>-(task|patch)-<id>-<slug>.md` (UTC, id del modo de `sdd-kit.json`; si la sesión ya tiene ticket, se amplía)); las cuatro reglas del RED con su red flag y su fila de racionalización **solo para los fallos que el RED exhiba**; el aviso de que la carpeta puede ignorarse en git, una vez, al crearla.
- [ ] **Step 3: Índices** — fila de la plantilla en `sdd-templates/SKILL.md`; fila de la skill en el catálogo del README; recuento «Las 13 plantillas canónicas».
- [ ] **Step 4: Oferta en los cierres** — paso final nuevo en `sdd-end-task` (tras el paso 10) y en `sdd-end-patch` (tras el paso 6): ofrecer generar el ticket con `sdd-feedback` en esta misma sesión, con el motivo (al limpiar el contexto se pierde) y la regla explícita de que **no es un gate**: sin respuesta el cierre termina y no deja nada anotado ni pendiente. Una fila en cada tabla de racionalizaciones.
- [ ] **Step 5: Verificación** — `pwsh -NoProfile -Command "Invoke-Pester tests/ -Output Detailed"`: suite entera verde, incluidos los cinco tests nuevos y el recuento de plantillas del README.
- [ ] **Step 6: Commit** — por ruta, nunca `git add -A`: `feat(feedback): skill y plantilla del ticket de mejora del kit`.

### Task 3 — Campaña GREEN

**Modelo**: hilo principal; sujetos `claude -p --model sonnet` (6 runs).
**Ejecución**: `en línea` — mismo motivo que la Task 1.
**Tests RED**: no aplica.

**Ficheros**: crear `tests/kit-feedback-green.md`.

- [ ] **Step 1: Repetir los tres escenarios** con la copia limpia del kit que **sí** lleva `sdd-feedback` y los cierres modificados.
- [ ] **Step 2: Veredicto por fallo del RED** — una línea por fallo: corregido / persiste / no aplica. Los huecos de la propia skill que aparezcan se corrigen y se re-verifican en el mismo fichero.
- [ ] **Step 3: Commit** — `test(feedback): campaña GREEN de la skill sdd-feedback`.

---

## Estimación y esfuerzo

- Tipo: docs
- Esfuerzo spec + plan: 0,6h
- Estimación de implementación: 2,5h
- Base de la estimación: tres tasks, doce sujetos headless (la parte lenta), cuatro ficheros markdown; referencia del `estimation-log`: tipo docs, mediana 0,5 sobre 19 artefactos
- Confianza: media — el riesgo está en que el RED salga limpio y haya que recortar

---

## 3. Validación final

- [ ] Suite Pester verde (`Invoke-Pester tests/`)
- [ ] Cada requisito del delta de la spec cubierto por la skill o la plantilla (Self-review)
- [ ] Smoke: generar un ticket real de esta misma task con la skill ya escrita, en `.docs/sdd/kit-feedback/`, y comprobar que sale bien
- [ ] Cierre de rama vía `sdd-end-task`

---

## 4. Self-review (cobertura spec → tasks)

- El ticket vive en `.docs/sdd/kit-feedback/` → Task 2, Steps 1–2. ✓
- El ticket se escribe para un agente → Task 2, Step 1 (plantilla). ✓
- «Sin hallazgos» es salida válida → Task 1 E3 (RED) → Task 2, Steps 1–2. ✓
- El ticket no lleva el dominio del cliente → Task 1 E2 (RED) → Task 2, Step 2. ✓
- El hallazgo separa hueco del kit de error del ejecutor → Task 1 E2 (RED) → Task 2, Step 1. ✓
- El cierre ofrece el ticket en la misma sesión → Task 1 E1 (RED) → Task 2, Step 4. ✓
- Verificación GREEN de los seis requisitos → Task 3. ✓
