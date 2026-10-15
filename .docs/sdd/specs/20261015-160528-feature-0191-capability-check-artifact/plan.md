---
id: 20261015-160528-feature-0191-capability-check-artifact
feature: 0191
title: Plan de implementación — capability check por artefacto
spec: ./spec.md
status: approved
created: 2026-10-15
---

# Plan de implementación — `capability check` por artefacto: fallos ajenos aparte y punteros raíz → plantilla

## Decisiones que he tomado yo — valida estas

1. **Modelo y effort**: Native, en la sesión (Opus 5.5). Revisión final con los ejes de `sdd-verify`: Spec con `sdd-kit:effort-high` + `opus`, Código con `sdd-kit:effort-high` + `sonnet`. Sin eje Arquitectura.
2. **Ejecución**: Native, porque 2 tasks encadenadas por `validateCapabilities` de `check.ts`, un error lo caza el test rápido de su task y el plan cabe en un contexto.
3. **Un puntero se resuelve una vez** en `validateCapabilities`: cada fichero se convierte en `{ name, lines, problems, target? }`, y el delta del artefacto busca su capacidad en un mapa `slug → { file, label }` (`label` es la ruta del enlace o `capabilities/<slug>.md`). Así el contraste del delta y la validación usan la misma resolución.
4. **`Validation` gana `foreign: string[]`** (vacío sin `--artifact`); el verbo lo usa para el bloque de texto y para la clave `foreign` del JSON, que solo sale con `--artifact`.
5. **Coste**: ~1,5 h de implementación, sin subagentes salvo los dos de la revisión final (~200k tokens).
6. Review Focus: 3 entradas; ver la sección.

**Goal**: que `sdd capability check` siga los punteros hasta su destino y, con `--artifact`, decida el código solo por el artefacto y las capacidades de su delta.

**Architecture**: todo en `cli/src/capabilities/check.ts`, más la salida en `verbs.ts`. Sin módulos nuevos.

**Tech Stack**: TypeScript sobre Node ≥ 22.18 sin dependencias, Vitest (`*.test.ts` rápidos; aquí no hay repos ni procesos).

**Spec**: `./spec.md`

**Ejecución**: native, porque 2 tasks encadenadas por `validateCapabilities` de `check.ts`, un error lo caza el test de su task y el plan cabe en un contexto. Si esta sesión se retomó tras una compactación (empieza por «This session is being continued from a previous conversation») y quedan dos o más tasks sin su línea `complete` en el ledger, no las hagas tú: despacha las que quedan con el método SDD de sdd-implement sobre el mismo ledger. La sesión que ejecuta va bien en gama media (Sonnet, effort medium); el modelo más capaz se reserva para los ejes Spec y Arquitectura de la revisión final.

**Eje Arquitectura**: no — solo cambia el interior de `cli/src/capabilities/`; la clave `foreign` es del verbo que ya existe.

## Restricciones globales

### De código

- Sin `--artifact` y sin punteros, la salida no cambia: los tests de `cli/test/capability/` siguen en verde sin tocarlos.
- Literales de la spec, exactos:
  - `Ajenos al artefacto, no cambian el código de salida: <n>` y cada ajeno con dos espacios delante.
  - `<slug>.md: el puntero no enlaza en una cita a <…>/capabilities/<slug>.md`
  - `<slug>.md: el destino del puntero no existe: <ruta>`
  - `<slug>.md: un puntero no lleva escenarios: van en su destino`
  - `<slug>.md → <ruta>: <qué falla>`
  - `«<requisito>» del delta no está en <ruta>` / `… no coincide con <ruta>`
- Art. X de la constitution: sin comentarios que repitan el código ni que citen documentos; clean code.

### De proceso

- Commits: tipo/scope en inglés, título y cuerpo en castellano, con `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`.

## Review Focus

- Puntero cuyo enlace es absoluto o lleva `./` → se resuelve igual con `resolve(dirname(puntero), ruta)` · Task 1, `a pointer link is resolved from the pointer folder`
- `--artifact` con el nombre de la capacidad del delta en otra caja (`Bookings`) → cuenta como propia · Task 2, `a delta name in another case still owns the capability`
- Un fallo del artefacto y ningún fallo de capacidades → sale con 1, sin bloque de ajenos · Task 2, `an artifact failure exits 1 without a foreign block`

---

## Phase -1 — Pre-Implementation Gates

- [x] **Simplicity gate**: un mapa de resolución y un reparto en dos listas; nada más.
- [x] **YAGNI gate**: sin opción para mostrar u ocultar ajenos.
- [x] **Constitution check**: Art. I (sin texto de skill, sin RED de sujetos), Art. X.

---

## 1. Decisiones técnicas

### 1.1 Estructura de ficheros

**Modificar**:

- `cli/src/capabilities/check.ts` — punteros, contraste del delta contra el destino, reparto propios/ajenos.
- `cli/src/capabilities/verbs.ts` — bloque de ajenos en texto y `foreign` en JSON.
- `cli/test/capability/check.test.ts` — tests de las dos tasks.

**NO se tocan**:

- `merge.ts`, `index.ts` — no siguen punteros (spec, decisión 10).
- `skills/` — sin texto de skill (spec, decisión 11).

### 1.7 Riesgos

| Riesgo | Probabilidad | Impacto | Mitigación |
| --- | --- | --- | --- |
| El smoke del template cambia de salida si el template se mueve | baja | bajo | el smoke se describe con el número de líneas antes y después, no se fija en un test |

### 1.8 Rollout

Directo, con la release 3.0.0.

### 1.9 Excepciones a la constitution

Ninguna.

---

## 2. Tasks

### Task 1 — Un puntero se valida en su destino

**Tras**: —
**Modelo**: la sesión (Native).
**Tests RED**: hilo principal · `cli/test/capability/check.test.ts`, `describe('sdd capability check follows a pointer')`.
**Superficies**: tooling
**Verificación**: `npx vitest run test/capability` desde `cli/`; `moon run cli:typecheck`.

**Interfaces**:
- Consume: `fileProblems(fileName, lines)`, `scenarioLines(lines)`, `deltaAppliedProblems(lines, dir)` de `check.ts`.
- Produce: `type Resolved = { name: string; lines: string[]; problems: string[]; label: string; path: string }`, con `label` la ruta del enlace o `capabilities/<slug>.md`; `resolveFiles(sddPath): Resolved[]`; `deltaAppliedProblems(lines, bySlug: Map<string, Resolved>)` (clave en minúsculas).

**Ficheros**: modificar `cli/src/capabilities/check.ts`, `cli/test/capability/check.test.ts`

- [ ] **Step 1: Tests RED** — con `sddFolder`, un puntero en `capabilities/bookings.md` (título `# Capacidad — bookings (puntero)`, cita `> **Esta capacidad no vive aquí.** Su verdad está en [app/bookings.md](../../../app/.docs/sdd/capabilities/bookings.md)`, `## Propósito`) y el destino escrito en `<root>/app/.docs/sdd/capabilities/bookings.md` con `bookingsFixture`:
  - `a pointer to a valid capability passes and counts` → `['Capacidades válidas: 1']`, código 0.
  - `a pointer reports the problems of its destination` → destino sin `- THEN` en «Consultar salas libres»: `bookings.md → ../../../app/.docs/sdd/capabilities/bookings.md: «Consultar salas libres» no tiene escenario completo (falta - THEN)`, código 1.
  - `a pointer whose destination does not exist fails` → `bookings.md: el destino del puntero no existe: ../../../app/.docs/sdd/capabilities/bookings.md`.
  - `a pointer without a link to its capability fails` → `bookings.md: el puntero no enlaza en una cita a <…>/capabilities/bookings.md`.
  - `a pointer with scenarios fails` → `bookings.md: un puntero no lleva escenarios: van en su destino`.
  - `a pointer link is resolved from the pointer folder` → enlace `./../../../app/.docs/sdd/capabilities/bookings.md` pasa.
  - `the delta is checked against the pointer destination` → spec con `**ADDED — Cancelar una reserva**` en `bookings`, no fusionado: `spec.md: «Cancelar una reserva» del delta no está en ../../../app/.docs/sdd/capabilities/bookings.md`.
- [ ] **Step 2: Implementación** — `POINTER_TITLE = /^# Capacidad — (.+) \(puntero\)\s*$/i`; enlace: primera línea `>` con `\]\(([^)\s]+)\)` cuya ruta acaba en `capabilities/<slug>.md` (sin distinguir mayúsculas). El destino se valida con `fileProblems(<slug>.md, líneas del destino)` y cada fallo sale con el prefijo `<slug>.md → <ruta>`. El puntero cuenta como válido si no tiene fallos.
- [ ] **Step 3: Verificación** — la de la task, en verde.
- [ ] **Step 4: Commit de la task** — `feat(cli): capability check sigue los punteros hasta su destino`.

### Task 2 — Con `--artifact`, los fallos ajenos aparte

**Tras**: Task 1
**Modelo**: la sesión (Native).
**Tests RED**: hilo principal · `cli/test/capability/check.test.ts`, `describe('sdd capability check --artifact separates foreign failures')`.
**Superficies**: tooling
**Verificación**: `npx vitest run test/capability` desde `cli/`; `moon run cli:typecheck`.

**Interfaces**:
- Consume: `resolveFiles`, `Resolved` de la Task 1.
- Produce: `Validation = { lines: string[]; code: number; validCount: number; foreign: string[] }`; el verbo escribe `lines`, y si `foreign.length`, `Ajenos al artefacto, no cambian el código de salida: <n>` y cada ajeno con `'  '` delante; con `--json` y `--artifact`, `{ validCount, errors, foreign }`.

**Ficheros**: modificar `cli/src/capabilities/check.ts`, `cli/src/capabilities/verbs.ts`, `cli/test/capability/check.test.ts`

- [ ] **Step 1: Tests RED** — con `bookings` (válida y fusionada) y `rooms.md` sin `## Requisitos`:
  - `foreign failures do not change the exit code` → `['Capacidades válidas: 1', 'Ajenos al artefacto, no cambian el código de salida: 1', '  rooms.md: falta la sección «Requisitos»']`, código 0.
  - `a failure in a delta capability exits 1 and keeps the foreign block` → `bookings` sin `- THEN`: primero su línea, después el bloque; código 1.
  - `an artifact failure exits 1 without a foreign block` → bloque «Capacidades» vacío y ninguna capacidad rota: solo la línea del artefacto, código 1.
  - `with «Ninguna, porque» every capability failure is foreign` → código 0 y `rooms.md` en el bloque.
  - `a delta name in another case still owns the capability` → `### Capacidad: \`Bookings\`` con `bookings` rota: código 1.
  - `--artifact --json reports foreign` → `{ validCount: 1, errors: [], foreign: ['rooms.md: falta la sección «Requisitos»'] }`.
  - `--json without --artifact has no foreign key`.
- [ ] **Step 2: Implementación** — en `validateCapabilities`, con `artifactPath`, un fallo de fichero es propio si su slug (en minúsculas) está entre los nombres de `### Capacidad:` del delta; los del artefacto, siempre propios. `code` = 1 si hay propios. Sin propios: `summaryLine(validCount, skipped)`. Sin `artifactPath`: todo propio, `foreign: []`.
- [ ] **Step 3: Verificación** — la de la task, en verde.
- [ ] **Step 4: Commit de la task** — `feat(cli): capability check --artifact separa los fallos ajenos`.

---

## Estimación y esfuerzo

- Tipo: infra/tooling
- Esfuerzo spec + plan: 0.5h
- Estimación de implementación: 1.5h
- Base de la estimación: 2 tasks en un fichero ya conocido, tests rápidos sin repos; la 0187 (infra/tooling) estimó 4 h y tardó 1,5.
- Confianza: alta

---

## 3. Validación final

- [ ] Gate de cierre, una vez y en el hilo principal: `moon run kit:test cli:typecheck cli:test cli:test-slow cli:test-min`
- [ ] Smoke: `node cli/bin/sdd.js capability check --path <clon de sdd-project-template>/.docs/sdd` — hoy 36 líneas de fallo; tras la feature, solo los fallos reales de los destinos (o `Capacidades válidas: 20`)
- [ ] Spec satisfecha: cada requisito tiene su task (§4)
- [ ] Cierre de rama con `sdd-end-feature` y `sdd merge --push`

---

## 4. Self-review (cobertura spec → tasks)

- MODIFIED «El validador de capacidades», ANDs de ajenos, «Ninguna», JSON → Task 2. ✓
- MODIFIED, ANDs que no cambian → tests existentes en verde sin tocarlos. ✓
- ADDED «Un puntero se valida en su destino», THEN y ANDs de fallos y delta → Task 1. ✓
- ADDED, AND «merge e index no siguen el puntero» → N/A: no se tocan (§1.1). ✓
- Regla «Avisos» → literales de las dos tasks. ✓
- Review Focus → Task 1 y Task 2, tests nombrados. ✓
