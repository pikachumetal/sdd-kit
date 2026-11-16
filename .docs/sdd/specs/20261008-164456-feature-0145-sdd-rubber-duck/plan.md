---
id: 20261008-164456-feature-0145-sdd-rubber-duck
feature: 0145
title: Plan de implementación — sdd-rubber-duck, explicar en llano en modo corto y modo largo
spec: ./spec.md
status: approved
created: 2026-10-08
---

# Plan de implementación — `sdd-rubber-duck`

## Decisiones que he tomado yo — valida estas

1. **Dos tasks, no tres**: RED (molde, batería y baseline) y skill con su GREEN. Escribir la skill y medirla es un solo ciclo, y un revisor no puede aprobar el texto sin el GREEN que lo respalda.
2. **Ejecución Native**: dos tasks seguidas, la segunda depende del resultado de la primera (qué reglas sobreviven), y casi todo es texto y evidencia. La revisión final de rama, con `sdd-kit:effort-high` + `opus`.
3. **Modelo de los sujetos**: Sonnet, porque los fallos de campo vinieron de sesiones con Sonnet y Opus por igual, y Sonnet es el defecto de las baterías.
4. **RED con el kit de la base** (`git archive HEAD skills .claude-plugin hooks cli` antes del commit de la skill) y GREEN con el kit de la rama: así el RED tiene todo el kit menos la skill nueva.
5. **Petición por fase**: en s1 y s2 el GREEN antepone «Invoca la skill sdd-kit:sdd-rubber-duck en modo corto y », que es como la invocará una parada desde la 0146; el RED lleva la misma petición sin ese prefijo. En l1 la petición es igual en las dos fases, porque mide también el enrutado.
6. **Riesgo alto**: el baseline puede salir limpio en alguna fila (Art. I). Entonces esa regla y su THEN salen, y paro a pedir otra aprobación de la spec, como dice la decisión 7 de la spec.
7. **Coste estimado**: ~3 h de reloj y ~5 $ de sujetos (18 como máximo, techo de 10 $), más la revisión final.
8. Review Focus: 3 entradas que la spec no fija, con su comportamiento esperado; ver la sección.

**Goal**: crear la skill `sdd-rubber-duck`, con modo corto (el 🦆 de una parada) y modo largo (explicación por pasos con el glosario), respaldada por su batería RED/GREEN.

**Architecture**: una skill de forma en inglés, sin `references/`: una sección de palabras y dos contratos de salida. La prueba es una batería nueva en `tests/batteries/sdd-rubber-duck/` sobre el molde `exportes`, con veredicto de puerta (`battery.sh`) y veredicto de conducta con la rúbrica de la spec, que lee quien lanza.

**Tech Stack**: Markdown (skill), Bash y Node (lanzador `tests/headless/`), Pester (tests de anatomía y de topes), Node 22 `node --test` (el test del molde).

**Spec**: `./spec.md`

**Ejecución**: native, porque son dos tasks en serie, la segunda depende de lo que deje el RED y el trabajo es texto y evidencia; `execution: auto` en `sdd-kit.json`. Si esta sesión se retomó tras una compactación (empieza por «This session is being continued from a previous conversation») y quedan dos o más tasks sin su línea `complete` en el ledger, no las hagas tú: despacha las que quedan con subagent-driven-development sobre el mismo ledger. La sesión que ejecuta va bien en gama media (Sonnet, effort medium); el modelo más capaz se reserva para la revisión final.

## Restricciones globales

### De código

- La skill se escribe en inglés y le dice al agente que hable con el usuario en su idioma; nombres de skill y de fichero en inglés kebab-case; texto humano (docs, tests, commits) en castellano con tildes (Art. III).
- Fuente citada como «mattpocock/skills 1.2.3», MIT, Copyright (c) 2026 Matt Pocock, en `skills/sdd-rubber-duck/NOTICE` y en `THIRD_PARTY_NOTICES.md`.
- Tope de palabras: `'sdd-rubber-duck' = @{ SkillMd = 500; Total = 500 }`.
- Art. X, literal: **Sin comentarios que repitan el código.** Un comentario existe solo si sin él la línea no se entiende, y antes se intenta que el nombre o una extracción lo hagan innecesario. Lo que se conserva es el *porqué* no deducible (una convención heredada, un límite externo). La ayuda de `--help` no es un comentario. **Sin comentarios que citen documentos.** Un comentario nunca referencia la constitution, una spec, una task, un requisito ni `capabilities/`; la trazabilidad vive en el commit y en el walkthrough. Clean Code: nombres descriptivos en inglés, funciones ≤ 20 líneas y ≤ 3 parámetros, early returns, sin duplicación, sin alias de PowerShell. Texto humano (mensajes, warnings, ayuda) en castellano con tildes (Art. III). El revisor marca el incumplimiento como Important, no como estilo, salvo un umbral numérico superado en una unidad (21 líneas con un límite de 20), que es Minor.

### De proceso

- Política de modelos del Art. IV: modelo y effort declarados al despachar; sujetos Sonnet; revisor final `sdd-kit:effort-high` + `opus`; `fable` y `opus xhigh`, prohibidos.
- Ejecución Native: implementa la sesión.
- Commits: tipo/scope en inglés, título y cuerpo en castellano, con `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`.

## Review Focus

- Un proyecto sin `PRODUCT.md` o sin sección `Terminology` → la skill explica igual en llano, no inventa un glosario ni crea `PRODUCT.md` · Task 2, lectura del `SKILL.md` en la revisión (no hay rama propia que medir: decisión 4 de la spec).
- Un 🦆 de un cambio que no cambia nada para quien usa el producto (un refactor) → lo dice en una frase en vez de inventar un efecto · Task 2, el contrato del modo corto lo nombra y la revisión lo comprueba.
- Un usuario que escribe en inglés → la explicación sale en inglés · Task 2, «Overview» del `SKILL.md` (R7 mide el castellano).

---

## Phase -1 — Pre-Implementation Gates

- [x] **Simplicity gate**: una skill sin `references/` ni scripts.
- [x] **YAGNI gate**: sin modo re-pitch ni rama sin glosario (decisiones 4 y 5 de la spec).
- [x] **Brownfield gate**: no se toca ninguna skill existente.
- [x] **Constitution check**: Art. I (batería, RED antes, previsión de coste), Art. III (inglés), Art. IX (`THIRD_PARTY_NOTICES.md`), Art. XI (evidencia como evento en `tests/`).

---

## 1. Decisiones técnicas

### 1.1 Estructura de ficheros

**Crear**:

- `tests/batteries/sdd-rubber-duck/battery.md` — escenarios, rúbrica y procedencia de las reglas.
- `tests/batteries/sdd-rubber-duck/subject.sh` — monta el molde y lanza la petición por fase.
- `tests/batteries/sdd-rubber-duck/mold-exportes/` — el molde (detalle en la Task 1).
- `tests/sdd-rubber-duck-red.md`, `tests/sdd-rubber-duck-green.md` — evidencia.
- `.docs/sdd/specs/20261008-164456-feature-0145-sdd-rubber-duck/red/out/`, `green/out/` — salidas versionadas de los sujetos.
- `skills/sdd-rubber-duck/SKILL.md`, `skills/sdd-rubber-duck/NOTICE`.

**Modificar**:

- `THIRD_PARTY_NOTICES.md` — una viñeta.
- `tests/WordBudget.Tests.ps1` — el tope de la skill.
- `README.md` — fila del catálogo tras `sdd-grilling`.
- `.docs/sdd/architecture.md` — línea del árbol tras `sdd-grilling`.
- `CLAUDE.md` — «las 15 skills» → «las 16 skills».

**NO se tocan**:

- `skills/using-sdd/`, `skills/sdd-consult/`, `skills/sdd-grilling/`, `skills/sdd-start-feature/references/control-profiles.md` — la conexión es de la 0146.

### 1.6 Dependencias

- `tests/headless/` (lanzador, `battery.sh`, `battery.mjs`) y superpowers 6.4.2 en `SUPERPOWERS_DIR`.

### 1.7 Riesgos

| Riesgo | Probabilidad | Impacto | Mitigación |
| --- | --- | --- | --- |
| El baseline sale limpio en una fila | media | la regla sale y hay que volver a aprobar | rúbrica fijada antes; parada prevista |
| `l1` no entra por la skill | media | el requisito de `routing` sale | enmienda pre-aprobada (decisión 6 de la spec) |
| El molde da la respuesta (nombres del glosario en el código) | baja | el RED no mide | el código usa solo los nombres de _Evitar_ |

### 1.8 Rollout

Directo: entra en la release 3.0.0.

### 1.9 Excepciones a la constitution

Ninguna.

---

## 2. Tasks

### Task 1 — Molde `exportes`, batería y RED

**Modelo**: sesión (Native). Sujetos: `MODEL=sonnet`.
**Tests RED**: la propia campaña RED: la rúbrica R1–R7 sobre las salidas de s1, s2 y l1 con el kit de la base.
**Superficies**: tooling (batería y molde), docs (evidencia).
**Verificación**: `bash -n tests/batteries/sdd-rubber-duck/subject.sh`; `node tests/headless/battery.mjs plan tests/batteries/sdd-rubber-duck/battery.md` (sale 0 y lista s1, s2, l1, c1); `node --test` en una copia del molde (exactamente 1 test en rojo: `exporta en la hora del usuario`); `Invoke-Pester tests/PathLength.Tests.ps1,tests/SubjectOutputPrivacy.Tests.ps1 -CI`.
**Interfaces**:
- Consume: nada.
- Produce: `tests/batteries/sdd-rubber-duck/battery.md` con los escenarios `s1`, `s2`, `l1` (paso `rubber-duck`) y `c1` (paso `control`); la lista de filas de la rúbrica que fallaron en el RED, en `tests/sdd-rubber-duck-red.md`.

**Ficheros**: los de §1.1 bajo `tests/batteries/sdd-rubber-duck/`, `tests/sdd-rubber-duck-red.md` y `red/out/`.

- [ ] **Step 1: Molde `mold-exportes/`** — app Node ESM de reservas por terminal, sin dependencias:
  - `src/cli.js`: `exportar --mes 2026-03 [--sala Norte]` llama a `exportMonth(month, room)` e imprime la ruta del fichero.
  - `src/bookings/repository.js`: `loadBookings()` lee `data/bookings.json` (campos `room`, `day` en ISO, `slot` como `'10:00-12:00'`, `status`).
  - `src/export/filter.js`: `bookingsBySlot(bookings, month)` deja las del mes que no están `cancelled`.
  - `src/export/ics.js`: `toIcs(bookings)` escribe un `VEVENT` por reserva con `DTSTART` en UTC sin `Z` (el fallo del test).
  - `src/export/writer.js`: `writeExport(month, ics)` escribe `exports/<mes>.ics`.
  - `test/export.test.js`: `exporta en la hora del usuario` (espera `DTSTART:20260302T100000` para la reserva del 2 de marzo de 10:00 a 12:00 en Norte; falla con `080000`) y un test que pasa sobre el filtro.
  - `data/bookings.json`: 4 reservas de marzo (Norte y Sur, una `cancelled`) y 1 de abril.
  - `PRODUCT.md`: glosario con Reserva (_Evitar_: booking, cita), Franja (_Evitar_: slot, hueco), Sala (_Evitar_: room), Exportación (_Evitar_: export, volcado).
  - `.docs/sdd/` mínimo (constitution, mission, tech-stack, roadmap) copiado de `mold-salas` y adaptado a «exportes».
  - La spec de la feature 0013 (`.docs/sdd/specs/20261005-090000-feature-0013-export-by-room/spec.md`), con su Approach en jerga técnica que nombra `src/export/filter.js` y `bookingsBySlot`, y sin párrafo de apertura.
  - Una fila 0012 en el roadmap: «exportar en la hora del usuario», ⏳, bloqueada por ese test.
  - Ningún nombre del glosario en el código.
- [ ] **Step 2: `battery.md` y `subject.sh`** — copiados de la forma de la batería de `sdd-grilling`. En `battery.md`, la rúbrica de la spec literal (R1–R7, C1, C2) y estos escenarios:

  | Id | Paso | Petición | Molde | Esperado | n | Umbral | Modelo | Procedencia |
  | --- | --- | --- | --- | --- | --- | --- | --- | --- |
  | s1 | rubber-duck | Escribe el párrafo que abre la spec de la feature 0013 (.docs/sdd/specs/20261005-090000-feature-0013-export-by-room/spec.md): qué vamos a hacer y cómo, para que el dev-lead la apruebe. Déjalo solo en tu respuesta, no edites el fichero. | exportes | `sdd-kit:sdd-rubber-duck` | 2 | 2/2 | sonnet | tickets de las tasks 0010 y 0012 |
  | s2 | rubber-duck | Para aquí y explícale al dev-lead por qué no puedes cerrar la feature 0012: mira los tests. | exportes | `sdd-kit:sdd-rubber-duck` | 2 | 2/2 | sonnet | tickets de la feature 6298 y de la 0038 de document-manager |
  | l1 | rubber-duck | Explícame cómo viaja una exportación de punta a punta, desde que la pido hasta que tengo el fichero. | exportes | `sdd-kit:sdd-rubber-duck` | 2 | 2/2 | sonnet | propuesta 0131, B13 |
  | c1 | control | Oye, ¿cómo está montado lo de cancelar reservas? No lo pillo. | salas | `sdd-kit:sdd-consult` | 1 | 1/1 | sonnet | batería de `using-sdd`, c1 |

  `subject.sh` antepone «Invoca la skill sdd-kit:sdd-rubber-duck en modo corto y » a s1 y s2 cuando `PHASE` no empieza por `red`. Los escenarios del paso `control` solo van en el GREEN. Molde `salas` = `tests/batteries/using-sdd/mold-salas`. `MAX_TURNS` 30.
- [ ] **Step 3: Verificación** — los comandos de «Verificación» de esta task.
- [ ] **Step 4: RED** — kit de la base con `git archive HEAD skills .claude-plugin hooks cli` en el scratchpad; `BATTERY=sdd-rubber-duck STEPS=rubber-duck PHASE=red KIT_DIR=<copia> SPEC_DIR=<carpeta de la spec> RUNS_DIR=<scratchpad> SUPERPOWERS_DIR=<superpowers 6.4.2> bash tests/headless/battery.sh`, en segundo plano con su vigía. El veredicto de puerta sale rojo por construcción (la skill no existe); el que cuenta es el de conducta.
- [ ] **Step 5: Evidencia** — `tests/sdd-rubber-duck-red.md`: por escenario y fila, pasa o falla con la cita literal; coste y sujetos. Si alguna fila R1–R6 pasa en los 6 sujetos, su regla sale: parar y pedir otra aprobación de la spec.
- [ ] **Step 6: Commit de la task** — `test(sdd-rubber-duck): batería y RED de la skill de explicar en llano`.

### Task 2 — Skill `sdd-rubber-duck`, avisos y GREEN

**Modelo**: sesión (Native). Sujetos: `MODEL=sonnet`.
**Tests RED**: el tope de `tests/WordBudget.Tests.ps1` (rojo sin la entrada en cuanto exista la carpeta de la skill); la batería entera (`STEPS` sin filtro) con `PHASE=green`.
**Superficies**: skills, docs, tooling (topes).
**Verificación**: `Invoke-Pester tests/WordBudget.Tests.ps1,tests/Skills.Tests.ps1,tests/PathLength.Tests.ps1,tests/SubjectOutputPrivacy.Tests.ps1 -CI`; `BATTERY=sdd-rubber-duck PHASE=green … bash tests/headless/battery.sh` sale 0, más la rúbrica de conducta sin filas en rojo.
**Interfaces**:
- Consume: `battery.md` y la lista de filas de la rúbrica que fallaron en el RED (Task 1).
- Produce: `skills/sdd-rubber-duck/SKILL.md` con frontmatter `name: sdd-rubber-duck` y la `description` de abajo; el contrato del modo corto, que invocará la 0146: recibe la parada y su material, devuelve un párrafo que empieza por 🦆 y no pregunta.

**Ficheros**: `skills/sdd-rubber-duck/SKILL.md`, `skills/sdd-rubber-duck/NOTICE`, `THIRD_PARTY_NOTICES.md`, `tests/WordBudget.Tests.ps1`, `README.md`, `.docs/sdd/architecture.md`, `CLAUDE.md`, `tests/sdd-rubber-duck-green.md`, `green/out/`.

- [ ] **Step 1: `SKILL.md`** — en inglés, solo con las reglas cuya fila falló en el RED. `description`: «Use when the user asks for a plain explanation of how something in the project works («explícame cómo viaja una exportación de punta a punta», «explícamelo en llano»), or when another sdd-kit skill needs the 🦆 paragraph of a stop.» Secciones:
  - Overview: idioma del usuario, la cita a `teach` y `wait-what` (MIT, ver `NOTICE`), y que el lector conoce el producto, no el código ni el kit.
  - Words: el glosario de `PRODUCT.md` «Terminology» si existe, nunca una palabra de _Evitar_ aunque la use el código; sin rutas, identificadores, comandos, ids ni jerga del kit; el término técnico necesario se explica en la misma frase por su efecto; frases cortas en voz activa.
  - Short mode: un párrafo que empieza por 🦆, como mucho cinco frases; primero qué cambia o qué pasa para quien usa el producto (o que no cambia nada), con un ejemplo con datos, y después cómo; lo devuelve sin preguntar.
  - Long mode: leer el camino en el código antes de escribir; un ejemplo con datos que recorre los pasos; de 3 a 9 pasos numerados; rutas solo en una lista final «Dónde mirar»; terminar ofreciendo resolver dudas.
- [ ] **Step 2: Avisos y listas** — `NOTICE` con la forma del de `sdd-grilling` (fuente: `skills/productivity/teach/SKILL.md` y `skills/productivity/wait-what/SKILL.md` de mattpocock/skills 1.2.3, y la licencia MIT, Copyright (c) 2026 Matt Pocock); viñeta en `THIRD_PARTY_NOTICES.md` tras la de `PRODUCT-template.md`; tope en `WordBudget.Tests.ps1` tras `sdd-grilling`; fila del README; línea del árbol de `architecture.md`; «16 skills» en `CLAUDE.md`.
- [ ] **Step 3: Verificación de anatomía** — el `Invoke-Pester` de «Verificación».
- [ ] **Step 4: GREEN** — kit de la rama (copia con `git archive` del commit de la skill, o el working tree); batería entera con `PHASE=green`, en segundo plano con su vigía; rúbrica de conducta sobre cada `texts.txt`. Si una fila falla: una tanda de REFACTOR, con un sujeto de control por escenario afectado, dentro del techo de 10 $. Si C1 sigue rojo tras el REFACTOR de la `description`: enmienda pre-aprobada (quitar el requisito de `routing` y abrir la deuda).
- [ ] **Step 5: Evidencia** — `tests/sdd-rubber-duck-green.md`: veredicto contra cada fallo del RED, controles, REFACTOR si lo hubo, coste total de la campaña; la tabla «Procedencia de las reglas» de `battery.md` rellenada.
- [ ] **Step 6: Commit de la task** — `feat(sdd-rubber-duck): skill para explicar en llano, modo corto y modo largo`.

---

## Estimación y esfuerzo

- Tipo: infra/tooling
- Esfuerzo spec + plan: 1h
- Estimación de implementación: 3h (rango 2–4 h)
- Base de la estimación: dos tasks; molde nuevo de ~10 ficheros, dos campañas de 6 y 8 sujetos que corren en paralelo (el reloj es la redacción, ~10 min por fichero de evidencia) y una skill de ~400 palabras. Referencia: la 0128 (`sdd-grilling`, skill nueva con batería), estimada en 6 h y real 3,5 h; factor del log 0,6. Condicionada al RED.
- Confianza: media

---

## 3. Validación final

- [ ] Gate de cierre, una vez y en el hilo principal: `moon run :test` (Vitest de la CLI, Pester rápido y `roadmap check`, el mismo que corre el pre-commit).
- [ ] Criterios de éxito de la spec: cada THEN con su fila del smoke (`ejecución real` desde las salidas del GREEN).
- [ ] Spec satisfecha: ver Self-review.
- [ ] Cierre con `sdd-end-feature` (validación en campo).

---

## 4. Self-review (cobertura spec → tasks)

- `explaining` — El 🦆 de una spec es un párrafo llano de qué y cómo → Task 1 (s1 en RED), Task 2 (s1 en GREEN). ✓
- `explaining` — El 🦆 de un bloqueo lo cuenta en palabras del producto → Task 1 (s2), Task 2 (s2). ✓
- `explaining` — Una explicación larga sigue el camino real, paso a paso → Task 1 (l1), Task 2 (l1). ✓
- `routing` — Una petición de explicar en llano entra por `sdd-rubber-duck` → Task 2 (l1 con C1, c1 con C2). ✓
- Decisiones 2, 3, 10 y 11 de la spec (inglés, `NOTICE`, tope, listas) → Task 2, Step 2. ✓
- Review Focus (sin glosario, refactor, inglés) → Task 2, Step 1 y revisión final. ✓
