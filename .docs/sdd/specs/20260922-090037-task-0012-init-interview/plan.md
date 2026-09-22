---
id: 20260922-090037-task-0012-init-interview
task: 0012
title: Plan de implementación — Entrevista de sdd-init-greenfield
spec: ./spec.md
status: approved
created: 2026-09-22
---

# Plan de implementación — Entrevista de sdd-init-greenfield

## Decisiones que he tomado yo — valida estas

1. **Las dos tasks van en línea**, sin subagentes. La Task 1 es editar una sola skill en prosa, y el hilo principal tiene el RED entero en contexto: un implementador necesitaría ~200k tokens para reconstruirlo. La Task 2 lanza sujetos headless, que es trabajo del hilo por método (tech-stack, «Sujetos headless»).
2. **Modelos**: sujetos en Sonnet y simulador en Haiku, los mismos del RED, para que el GREEN sea comparable.
3. **El GREEN es más ligero que el RED.** E2 con 2 sujetos, que es donde estaban los tres fallos de conducta. E4 es nuevo y barato: arranca en el paso 5 con el repo existente, 2 sujetos a 2 turnos. E3 con 2 sujetos a 1 turno, como control. E1 con **un solo sujeto** como control de no regresión del modo template. Con n=1 no hay veredicto: si E1 falla, se repite antes de concluir.
4. **Coste estimado del GREEN: ~22 $** (E2 ~13 $, E1 ~8 $, E3 y E4 ~1,5 $), a ~0,4 $ por turno medido en el RED. Unas 1,5 h de reloj.
5. **Sin test Pester nuevo.** Un test que busque «git-flow» en el texto de la skill no mide la conducta; la evidencia del Art. I es el GREEN.
6. **Gate del plan**: no hay, por el perfil `delegate`. Comprobado que cada escenario de la spec tiene su task (§4).

**Goal**: la entrevista de `sdd-init-greenfield` pregunta una sola cosa por turno, recomienda git-flow, no repite lo que ya fijan las instrucciones del usuario y sabe tratar un repo existente.

**Architecture**: se reescribe el paso 1 de la skill como lista numerada con destino y se amplía el paso 5. Ni referencias nuevas ni plantillas.

**Tech Stack**: Markdown de skills; sujetos `claude -p` con el lanzador del RED (`red/driver.py`).

**Spec**: `./spec.md`

## Restricciones globales

- Art. I: ninguna edición de skill sin RED → GREEN documentado en `tests/` (RED: `tests/init-interview-red.md`; GREEN: `tests/init-interview-green.md`).
- Art. II: el fallo de forma se resuelve con una receta (la lista numerada), no con prohibiciones.
- Art. III: texto humano en castellano con tildes; nombres de fichero en inglés kebab-case.
- Art. VIII: sin copias de plantillas.
- Art. IX: no se reescribe nada que superpowers ya cubra; de `brainstorming` no se toca nada (el RED no mostró choque).
- Art. X (literal): «Sin comentarios que repitan el código. Un comentario existe solo si sin él la línea no se entiende… Sin comentarios que citen documentos. Un comentario nunca referencia la constitution, una spec, una task, un requisito ni `capabilities/`… Clean Code: nombres descriptivos en inglés, funciones ≤ 20 líneas y ≤ 3 parámetros, early returns, sin duplicación, sin alias de PowerShell. Texto humano (mensajes, warnings, ayuda) en castellano con tildes (Art. III). El revisor marca el incumplimiento como Important, no como estilo.»
- Política de modelos (Art. IV): modelo y effort explícitos; `fable` y `opus xhigh` prohibidos por defecto. Ejecución por defecto: `subagent-driven-development`; aquí las dos tasks van en línea con motivo.
- Alcance: solo `skills/sdd-init-greenfield/SKILL.md`. `sdd-init-brownfield` no se toca (spec, decisión 8).

---

## Phase -1 — Pre-Implementation Gates

- [x] **Simplicity gate**: un fichero de skill; la lista sustituye a la prosa, no se suma a ella.
- [x] **YAGNI gate**: sin referencias ni plantillas nuevas.
- [x] **Constitution check**: Art. I (RED hecho, GREEN en Task 2), II, VIII, IX.

---

## 1. Decisiones técnicas

### 1.1 Estructura de ficheros

**Crear**:

- `tests/init-interview-green.md` — evidencia GREEN.
- `.docs/sdd/specs/20260922-090037-task-0012-init-interview/green/` — moldes nuevos y salidas del GREEN.

**Modificar**:

- `skills/sdd-init-greenfield/SKILL.md` — paso 1 (lista numerada, línea de instrucciones del usuario, git-flow) y paso 5 (repo existente).

**NO se tocan**:

- `skills/sdd-init-brownfield/` — sin medir (spec, decisión 8).
- `skills/sdd-init-greenfield/references/estructura.md` — es de la 0019.
- `.docs/sdd/capabilities/onboarding.md` — la fusiona `sdd-end-task`.

### 1.7 Riesgos

| Riesgo | Probabilidad | Impacto | Mitigación |
| --- | --- | --- | --- |
| La lista numerada hace que en un template se pregunte el stack (regresión de E1) | media | alto | E1 como control; la fila del stack dice «si no está ya en `tech-stack.md`» |
| La lista alarga la skill | media | bajo | sustituye a la prosa del paso 1; medir líneas antes y después |
| El GREEN se va de coste como el RED | media | medio | E2 con tope de 16 turnos; E4 arranca a mitad del flujo |

### 1.8 Rollout

Directo; entra en la release 1.2.0 junto al resto de tasks.

### 1.9 Excepciones a la constitution

Ninguna.

---

## 2. Tasks

### Task 1 — Reescribir la entrevista y el paso de git

**Modelo**: el del hilo principal (Opus 5, effort del hilo).
**Ejecución**: en línea — una sola skill en prosa con el RED en el contexto del hilo; despachar costaría más que editar.
**Tests RED**: los escenarios E2 y E4 de la Task 2 (conducta, no Pester).

**Ficheros**: modificar `skills/sdd-init-greenfield/SKILL.md`

- [ ] **Step 1: Implementación** — el paso 1 pasa a ser:
  - una línea de forma: cada turno termina con una sola pregunta de la lista, en su orden. «No sé» deja la entrada pendiente y «no aplica» la cierra. Lo que ya existe (código, documentos de anclaje sin marcador) o ya fijan las instrucciones del usuario (`CLAUDE.md` global o del proyecto) no se pregunta: se presenta como propuesta o se referencia;
  - la tabla `# · Pregunta · Va a`, que separa en filas lo que hoy va junto (roles y módulos; ramas, worktrees y entorno) y conserva todas las preguntas actuales, incluidas las cinco reglas de producto por nombre;
  - la fila de ramas lleva git-flow como opción recomendada (`main` estable, `develop` de integración, `feature/<id>` desde `develop`).

  El paso 5 añade el caso de repo existente: presentar el plan completo (renombrados, ramas nuevas, rama por defecto del remoto, borrados) y esperar el «sí»; lo que toca el remoto lo ejecuta el usuario con los comandos que le da el agente.
- [ ] **Step 2: Build** — `Invoke-Pester tests` (lo corre también el pre-commit). Esperado: 242/0.
- [ ] **Step 3: Verificación** — releer la skill contra los cuatro THEN de la spec.
- [ ] **Step 4: Commit** — `feat(sdd-init-greenfield): …`.

### Task 2 — GREEN

**Modelo**: sujetos Sonnet (effort por defecto de `claude -p`, el mismo del RED), simulador Haiku.
**Ejecución**: en línea — lanzar sujetos headless es trabajo del hilo por método.
**Tests RED**: `tests/init-interview-red.md`.

**Ficheros**: crear `tests/init-interview-green.md`, `green/` en la carpeta de la spec.

- [ ] **Step 1: Molde E4** — el molde E2 más `.docs/sdd/` ya aprobado (mission, constitution con git-flow acordado, tech-stack, roadmap, `sdd-kit.json`). Petición: «Sigue con sdd-init-greenfield: la entrevista y los documentos ya están aprobados; acordamos git-flow. Te toca el paso de git.» Turno 2: «adelante».
- [ ] **Step 2: Comprobación previa** (tech-stack, cinco puntos): la skill se carga en el turno 1, el molde tiene lo que la petición da por hecho, el turno 2 encaja, la petición tiene una sola lectura y la copia del kit lleva la skill nueva.
- [ ] **Step 3: Lanzar** E2 ×2 (16 turnos), E4 ×2 (2 turnos), E3 ×2 (1 turno) y E1 ×1 (hasta el cierre), en paralelo.
- [ ] **Step 4: Veredicto** por THEN y controles, con literales. Stream: comprobar que se cargó la skill.
- [ ] **Step 5: Commit** — evidencia y `tests/init-interview-green.md`.

---

## Estimación y esfuerzo

- Tipo: docs
- Esfuerzo spec + plan: 2,5h (RED incluido)
- Estimación de implementación: 2h
- Base de la estimación: una skill en prosa y una campaña de 7 sujetos; referencia: la 0003 (~1,75 h de spec y plan, ~3 h de implementación y cierre)
- Confianza: media

---

## 3. Validación final

- [ ] Suite verde
- [ ] Los cuatro THEN de la spec en GREEN; controles E1 y E3 sin regresión
- [ ] Cierre vía `sdd-end-task`

---

## 4. Self-review (cobertura spec → tasks)

- Una sola pregunta por turno → Task 1 (tabla) · GREEN E2. ✓
- Ramas: git-flow recomendado → Task 1 (fila de ramas) · GREEN E2. ✓
- Instrucciones del usuario no se preguntan → Task 1 (línea de forma) · GREEN E2. ✓
- Git sobre repo existente → Task 1 (paso 5) · GREEN E4. ✓
- Modo template sin cambios → control E1. ✓
- Usuario ausente sin cambios → control E3. ✓
