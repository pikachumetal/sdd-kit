---
id: 20261103-130212-feature-0299-own-skills-audit
feature: 0299
title: Plan de implementación — Auditoría de las skills con las tres reglas del dev-lead
spec: ./spec.md
status: approved
created: 2026-11-03
---

# Plan de implementación — Auditoría de las skills con las tres reglas del dev-lead

## Decisiones que he tomado yo — valida estas

1. Modelo y effort: las cuatro tasks las hace la sesión (Native); sin subagentes. La revisión final, con los ejes de `sdd-verify`: Spec con `sdd-kit:effort-high` + `opus`; Código con `sdd-kit:effort-high` + `sonnet` (solo el script).
2. Ejecución: native — un spike siempre es Native (`plan-writing.md`).
3. Decisión técnica: `rules.mjs` copia de `audit.mjs` la segmentación por unidades (`unitsOf`) y las frases de 6 palabras; no se importa, porque `audit.mjs` es un script de otra carpeta sin exports.
4. Riesgo alto: más de 300 candidatos o más de 4 h de lectura → freno de la spec (decisión 3): parar y dar la cifra.
5. Coste: 3,5 h de sesión, sin despachos salvo la revisión final.
- Review Focus: 2 entradas que la spec no fija; ver la sección.

**Goal**: sacar candidatos mecánicos de las 22 skills en la base `8e22a49f`, confirmarlos leyendo las dos frases y dejar `research.md` con la tabla por skill y la propuesta de §5.

**Architecture**: un script Node lee `skills/**/*.md` (sin `migrations/` ni `NOTICE.md`) y escribe tres listas de candidatos con su `git blame`; la lectura confirma o descarta cada uno en un fichero de trabajo por grupo, y el research los resume.

**Tech Stack**: Node 26 (scripts `.mjs` sin dependencias), `git blame` / `git log -L`.

**Spec**: `./spec.md`

**Ejecución**: native, porque es un spike (`plan-writing.md`: un spike siempre es Native). Si esta sesión se retomó tras una compactación (empieza por «This session is being continued from a previous conversation») y quedan dos o más tasks sin su línea `complete` en el ledger, no las hagas tú: despacha las que quedan con el método SDD de sdd-implement sobre el mismo ledger. La sesión que ejecuta va bien en gama media (Sonnet, effort medium); el modelo más capaz se reserva para los ejes Spec y Arquitectura de la revisión final.

**Eje Arquitectura**: no — solo añade un script y documentos en la carpeta del spike.

## Restricciones globales

### De código

- Base de la medida: commit `8e22a49f`; citas `skills/<skill>/<fichero>:<línea>` en ese commit, más el sha de `git blame`.
- No se cambia ningún fichero fuera de la carpeta del spike.
- Art. X: sin comentarios que repitan el código ni que citen documentos (constitution, spec, task, capacidad); nombres en inglés; funciones ≤ 20 líneas y ≤ 3 parámetros; early returns; sin duplicación; texto humano en castellano con tildes.

### De proceso

- Política de modelos de `sdd-implement`; `fable` y `opus xhigh` prohibidos.
- Commits: tipo/scope en inglés, título y cuerpo en castellano; uno por task.

## Review Focus

- Una línea con absoluta y excepción en la misma frase que ya nombra la salida → descarte por «predicado (Art. II)», no hallazgo · Task 2, descartes de `own.md`.
- Una cita de ticket junto a la frase que cambió → descarte por «evidencia del Art. I» · Task 2 y 3, comprobado con `git log -L` de la línea.

---

## Phase -1 — Pre-Implementation Gates

- [x] **Simplicity gate**: un script y lectura; nada más.
- [x] **YAGNI gate**: sin abstracciones.
- [x] **Constitution check**: Art. VII (dogfooding, carril spike); no edita skills (Art. I no aplica).

---

## 1. Decisiones técnicas

### 1.1 Estructura de ficheros

**Crear** (en `.docs/sdd/specs/20261103-130212-feature-0299-own-skills-audit/`):

- `scripts/rules.mjs` — candidatos mecánicos con su blame.
- `out/exceptions.md`, `out/shared.md`, `out/tickets.md` — salidas en bruto del script.
- `own.md` — confirmaciones y descartes de las 11 propias.
- `copies.md` — confirmaciones y descartes de la capa del kit de las 11 copias.
- `research.md` — el informe, calcado de `research-template.md`.

**NO se tocan**: `skills/`, `tests/`, `cli/`, `capabilities/` — el spike solo mide.

### 1.7 Riesgos

| Riesgo | Probabilidad | Impacto | Mitigación |
| --- | --- | --- | --- |
| Demasiados candidatos de frases compartidas (plantillas, tablas) | media | lectura > 4 h | filtrar frases dentro de bloques de código y filas de tabla de cabecera; freno a 300 |
| `git blame` da el commit que movió el texto (`4597d47e`) | alta en copias | origen equivocado | `git log -L` hasta el commit que lo creó, como en `provenance.md` |

### 1.9 Excepciones a la constitution

Ninguna.

---

## 2. Tasks

### Task 1 — Candidatos mecánicos

**Tras**: —
**Modelo**: la sesión (Native).
**Evidencia**: O1-O4 · `scripts/rules.mjs` → `out/exceptions.md`, `out/shared.md`, `out/tickets.md` · cifras en `research.md` §2.
**Superficies**: tooling.
**Verificación**: `node scripts/rules.mjs <repo> <out>` imprime `excepciones: N · compartidas: N · tickets: N` y sale con 0; comprobación a mano de 3 candidatos contra `git show 8e22a49f:<ruta>`.

**Interfaces**:
- Produce: cada candidato como `- <id> · skills/<skill>/<fichero>:<línea> · <sha> · «<frase>»`, y en `exceptions.md` y `shared.md` la segunda frase con su sitio y la distancia (`unidad` · `sección` · `skill` · `otra skill`).

**Ficheros**: crear `scripts/rules.mjs`, `out/*.md`.

- [ ] **Step 1**: `rules.mjs <repoRoot> <outDir>` lee los `.md` de `skills/` en `8e22a49f` (`git ls-tree` + `git show`), sin `migrations/` ni `NOTICE.md`; unidades como `unitsOf` de `audit.mjs`.
- [ ] **Step 2**: excepciones — unidad con `except|unless|not an exception|instead of|exception`; empareja con la absoluta (`only|never|always|must|every`) más cercana con el mismo sujeto (≥ 2 sustantivos comunes) en la misma unidad, la sección o otra skill.
- [ ] **Step 3**: compartidas — frases de 6 palabras que aparecen en dos ficheros o dos secciones, fuera de bloques de código, agrupadas por par de sitios.
- [ ] **Step 4**: tickets — unidades con `tests/…-red.md`, `ticket`, `dev-lead, 20`.
- [ ] **Step 5**: `git blame --porcelain 8e22a49f` por línea de candidato.
- [ ] **Step 6**: commit de la task.

### Task 2 — Confirmar las 11 propias

**Tras**: Task 1
**Modelo**: la sesión (Native).
**Evidencia**: O1, O3, O5 · `own.md` · filas de las 11 propias en `research.md` §2.
**Superficies**: docs.
**Verificación**: cada candidato de las 11 propias tiene en `own.md` «confirmado (tipo, distancia)» o «descartado: <motivo>»; recuento = total de candidatos de esas skills.

- [ ] **Step 1**: leer cada candidato con sus dos frases en `8e22a49f`; `git log -L` de la segunda.
- [ ] **Step 2**: apuntar hallazgo con `fichero:línea`, tipo, las dos frases literales, distancia y commit; o descarte con motivo.
- [ ] **Step 3**: lo no leído por skill.
- [ ] **Step 4**: commit de la task.

### Task 3 — Capa del kit de las 11 copias

**Tras**: Task 1
**Modelo**: la sesión (Native).
**Evidencia**: O2, O3, O5 · `copies.md` · filas de las 11 copias en `research.md` §2, con los 5 hallazgos de `fork-audit.md` citados.
**Superficies**: docs.
**Verificación**: como la Task 2, sobre los candidatos de las copias que caen en texto del kit (no en texto literal de la fuente).

- [ ] **Step 1-3**: como la Task 2.
- [ ] **Step 4**: commit de la task.

### Task 4 — research.md

**Tras**: Task 2, Task 3
**Modelo**: la sesión (Native).
**Evidencia**: O4, O6 · `research.md`.
**Superficies**: docs.
**Verificación**: 22 filas en §2; tabla de reglas repetidas; descartes; «no leído»; §4 con la lectura de O5; §5 con los tres cubos y las entradas «para la 0300».

- [ ] **Step 1**: calcar `research-template.md`; rellenar §1, §2, §4, §5.
- [ ] **Step 2**: commit de la task.

---

## Estimación y esfuerzo

- Tipo: docs
- Esfuerzo spec + plan: 0,5 h
- Estimación de implementación: 3,5 h
- Estimación de revisión: 0,3 h
- Estimación de cierre: 0,5 h + el gate de cierre
- Base de la estimación: 4 tasks; la 0296 auditó 11 copias en una sesión con scripts parecidos; incertidumbre en el número de candidatos compartidos
- Confianza: media

---

## 3. Validación final

- [ ] Gate de cierre, una vez y en el hilo principal: `moon run kit:test-headless cli:typecheck cli:test --affected --base develop`
- [ ] Objetivos O1-O6 de la spec, cada uno con su evidencia
- [ ] Cierre de rama según el flujo del proyecto (`sdd-archive`)

---

## 4. Self-review (cobertura spec → tasks)

- O1 (propias, 100 % de candidatos) → Task 2, recuento en `own.md`. ✓
- O2 (capa del kit de las copias) → Task 3, recuento en `copies.md`. ✓
- O3 (`fichero:línea`, tipo, frases, commit) → Task 1 (blame) y Tasks 2-3. ✓
- O4 (reglas repetidas entre skills) → Task 1 `out/shared.md`, Task 4 tabla. ✓
- O5 (distancia) → Task 1 columna de distancia, Tasks 2-3 confirmación. ✓
- O6 (research con 22 filas, descartes, no leído, §5) → Task 4. ✓
- Freno (300 / 4 h) → decisión 4 del plan. ✓
- Base `8e22a49f` y «para la 0300» → Restricciones de código, Task 4. ✓
