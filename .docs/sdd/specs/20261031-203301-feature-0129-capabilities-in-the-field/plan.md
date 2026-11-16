---
id: 20261031-203301-feature-0129-capabilities-in-the-field
feature: 0129
title: Plan de implementación — Capacidades en campo
spec: ./spec.md
status: approved
created: 2026-10-31
---

# Plan de implementación — Capacidades en campo

## Decisiones que he tomado yo — valida estas

1. Modelo y effort: las tres tasks en la sesión (Native); la revisión final, con los ejes de `sdd-verify`. Sujetos en `sonnet`.
2. `isNotCapability` se mueve de `check.ts` a `sections.ts`, con `NOT_CAPABILITY_MARK`: la leen `check.ts` e `index.ts`.
3. `v1.0.0.md` paso 1 escribe una nota que no es la marca y al principio del fichero: es de donde nacen los `legacy.md`. Se corrige para que sea `> **No es una capacidad.** …` tras el título, con el saldo igual; va como enmienda de la spec, porque el Scope solo nombraba v2.0.0 y v3.0.0.
4. Coste estimado: ~2 h y ~3 $ de sujetos. Review Focus: 3 entradas; ver la sección.

**Goal**: los cuatro arreglos de la spec, cada uno con su test.

**Architecture**: cambios locales en `cli/src/capabilities/`; la retirada decide en `mergeDelta`, antes de `saveDocument`, para conservar «falla sin escribir nada».

**Tech Stack**: TypeScript en Node, Vitest (`cli/test/capability/`).

**Spec**: `./spec.md`

**Ejecución**: native, porque 3 tasks poco dependientes entre sí, un error lo caza el test de su task y el plan cabe en un contexto. Si esta sesión se retomó tras una compactación (empieza por «This session is being continued from a previous conversation») y quedan dos o más tasks sin su línea `complete` en el ledger, no las hagas tú: despacha las que quedan con el método SDD de sdd-implement sobre el mismo ledger. La sesión que ejecuta va bien en gama media (Sonnet, effort medium); el modelo más capaz se reserva para los ejes Spec y Arquitectura de la revisión final.

**Eje Arquitectura**: no — sin módulos, dependencias ni contratos entre módulos nuevos; el JSON de `check` solo gana una clave.

## Restricciones globales

### De código

- Art. X: sin comentarios que repitan el código. Un comentario nunca referencia la constitution, una spec, una task, un requisito ni `capabilities/`. Nombres descriptivos en inglés, funciones ≤ 20 líneas y ≤ 3 parámetros, early returns, sin duplicación, sin alias de PowerShell. Mensajes en castellano con tildes.
- Umbral exacto: 500 pasa, 501 avisa, sobre las líneas no vacías del requisito, sin título, unidas con un espacio.
- El saldo de palabras de cada plantilla y migración editada queda igual o baja.

### De proceso

- Política de modelos de `sdd-implement`; sujetos en sonnet, por tandas, hasta `maxParallelAgents`.
- Commits: título y cuerpo en castellano, con la atribución de la sesión.

## Review Focus

- Un `REMOVED` en dos capacidades, una que se vacía sin marcador y otra válida → no se escribe ninguna · Task 3, `leaves every file untouched when one capability would be emptied`.
- Un delta que `Retiradas` con el fichero ausente y un `ADDED` → falla como capacidad sin fichero, no «ya estaba borrado» · Task 3, `rerun with an ADDED still fails without a file`.
- Fichero marcado con 501 caracteres en líneas `>` → sin aviso · Task 2, `does not warn on a marked document or a pointer`.

---

## Phase -1 — Pre-Implementation Gates

- [x] **Simplicity gate**: tres cambios locales, sin opciones nuevas.
- [x] **YAGNI gate**: ninguna abstracción nueva.
- [x] **Brownfield gate**: `--json` solo añade una clave; `index` deja de listar solo lo marcado.
- [x] **Constitution check**: Art. I (prueba y previsión en la spec), Art. X.

---

## 1. Decisiones técnicas

### 1.1 Estructura de ficheros

**Modificar**:

- `cli/src/capabilities/sections.ts` — `isNotCapability`, `Declared.kind` con `Retiradas`.
- `cli/src/capabilities/index.ts` — omite lo marcado.
- `cli/src/capabilities/check.ts` — avisos, excepción de `Retiradas`.
- `cli/src/capabilities/verbs.ts` — imprime los avisos, `warnings` en JSON.
- `cli/src/capabilities/merge.ts` — para y borra.
- `cli/test/capability/{index-cases,check,merge}.test.ts`.
- `skills/sdd-templates/templates/{capability,spec,patch}-template.md`.
- `skills/sdd-upgrade/references/migrations/{v1.0.0,v2.0.0,v3.0.0}.md`.
- `.docs/sdd/roadmap.md` — filas de deuda de la decisión 10, al cierre.

**NO se tocan**:

- `.docs/sdd/capabilities/*.md` — los fusiona el cierre; sin normalizar (0198).

### 1.7 Riesgos

| Riesgo | Probabilidad | Impacto | Mitigación |
| --- | --- | --- | --- |
| Un test existente de `merge` vacía una capacidad | Media | Bajo | se adapta su fixture y se dice en el commit |
| Un agente recorta requisitos por el aviso | Baja | Medio | el propio aviso dice que no; sujeto de plantilla |

### 1.8 Rollout

Directo: entra en la 3.0.0.

### 1.9 Excepciones a la constitution

Ninguna.

---

## 2. Tasks

### Task 1 — La marca en índice y migración, y el control de la línea en blanco

**Tras**: —
**Modelo**: la sesión (Native).
**Tests RED**: TDD del propio hilo; sujeto de migración con molde en el scratchpad.
**Superficies**: tooling · docs
**Verificación**: `npx vitest run test/capability` en `cli/` → `Tests  N passed (N)`.
**Se prueba en la aplicación**: no, porque es una CLI: lo cubre Vitest.

**Interfaces**:
- Consume: nada.
- Produce: `isNotCapability(lines: string[]): boolean` en `sections.ts`.

**Ficheros**: `sections.ts`, `check.ts`, `index.ts`, `index-cases.test.ts`, `check.test.ts`, `capability-template.md`, `v1.0.0.md`, `v2.0.0.md`, `v3.0.0.md`.

- [ ] **Step 1**: RED de `omits a marked document` (`funcional.md` marcado + `bookings.md` → solo `bookings`) y `only a marked document has no capabilities` (`['Sin capacidades']`). Control `does not require a blank line after a requirement title`: `Capacidades válidas: 1`, código 0.
- [ ] **Step 2**: RED del sujeto: molde con `capabilities/funcional.md` marcado y sin `## Propósito`, y `legacy.md` sin marca; aplica v2.0.0 paso 7 y v3.0.0 «Verificación». Anotar lo que hace.
- [ ] **Step 3**: mover `isNotCapability`; `capabilityIndex` filtra con él. Texto: v2.0.0 paso 7 salta lo marcado; v3.0.0 propone en el informe la línea `> **No es una capacidad.**`, sin escribirla; v1.0.0 nota con la marca, tras el título. Plantilla: rule con la marca. Saldo igual en cada fichero.
- [ ] **Step 4**: GREEN de tests y sujeto; commit.

### Task 2 — El aviso de 500 caracteres

**Tras**: Task 1
**Modelo**: la sesión (Native).
**Tests RED**: TDD del propio hilo; sujeto de plantilla.
**Superficies**: tooling · docs
**Verificación**: `npx vitest run test/capability` en `cli/` → `Tests  N passed (N)`.
**Se prueba en la aplicación**: no, porque es una CLI: lo cubre Vitest.

**Interfaces**:
- Consume: `isNotCapability`.
- Produce: `Validation.warnings: string[]`; `Resolved.warnings: string[]`.

**Ficheros**: `check.ts`, `verbs.ts`, `check.test.ts`, `capability-template.md`.

- [ ] **Step 1**: RED: `warns over 500 characters and exits 0` (501 avisa con el literal de la spec, 500 no), `writes the failure and then the warning, and exits 1`, `with --artifact warns only about the delta capabilities`, `does not warn on a marked document or a pointer`, `lists warnings in the JSON`. Sujeto: escribir un requisito con ejemplos y bordes, y un `MODIFIED` de un bloque de 800 caracteres.
- [ ] **Step 2**: `REQUIREMENT_MAX_LENGTH = 500`; `lengthWarnings(name, lines)` usa `requirementsOf(sectionLines(lines, 'Requisitos'))`. Con `--artifact`, filtrar por `isOwn`. `verbs.ts` imprime avisos tras el bloque de ajenos.
- [ ] **Step 3**: plantilla: bajo el título, un comportamiento por requisito, ejemplos y bordes en escenarios; bajo `MODIFIED` no se parte ni se recorta. Saldo igual.
- [ ] **Step 4**: GREEN; commit.

### Task 3 — La retirada de una capacidad y las filas de deuda

**Tras**: —
**Modelo**: la sesión (Native).
**Tests RED**: TDD del propio hilo.
**Superficies**: tooling · docs
**Verificación**: `npx vitest run test/capability` en `cli/` → `Tests  N passed (N)`.
**Se prueba en la aplicación**: no, porque es una CLI: lo cubre Vitest.

**Interfaces**:
- Consume: nada.
- Produce: `Declared.kind: 'Nuevas' | 'Modificadas' | 'Retiradas'`.

**Ficheros**: `sections.ts`, `merge.ts`, `check.ts`, `merge.test.ts`, `check.test.ts`, `spec-template.md`, `patch-template.md`.

- [ ] **Step 1**: RED: `stops before emptying a capability without Retiradas`, `leaves every file untouched when one capability would be emptied`, `deletes the file with Retiradas`, `stops when a Retirada keeps requirements`, `rerun says it was already deleted`, `rerun with an ADDED still fails without a file`, `an already empty capability is not emptied by this merge`; en `check`: `accepts a Retirada without a file after the merge`, `fails when a Retirada is still in capabilities`. Literales, los de la spec.
- [ ] **Step 2**: en `mergeCapability`, tras aplicar: si esta fusión quitó un requisito y no queda ninguno, y no está en `Retiradas` → error. Si está en `Retiradas` y quedan → error. `mergeDelta` borra con `rmSync` tras el `if (run.errors.length)`. Sin fichero, en `Retiradas` y solo `REMOVED` → `ya estaba borrado`.
- [ ] **Step 3**: `check.ts`: exigir fichero solo a `Nuevas` y `Modificadas`; `Retiradas` con fichero falla. Plantillas: línea `- Retiradas:`; saldo igual.
- [ ] **Step 4**: comprobar (1), (4), (6) y (7) de los menores de la 0070; aplicar la decisión 10 en `roadmap.md`, y `sdd roadmap check`.
- [ ] **Step 5**: GREEN; commit.

---

## Estimación y esfuerzo

- Tipo: infra/tooling
- Esfuerzo spec + plan: 0,5 h
- Estimación de implementación: 2 h
- Base de la estimación: 3 tasks de CLI locales, 2 sujetos con RED/GREEN
- Confianza: media

---

## 3. Validación final

- [ ] Gate de cierre, una vez y en el hilo principal: `moon run kit:test-headless cli:typecheck cli:test --affected --base develop`
- [ ] Verificación de los criterios de éxito de la spec
- [ ] Spec satisfecha: cada requisito tiene su task
- [ ] Cierre de rama según el flujo del proyecto (`sdd-archive`)

---

## 4. Self-review (cobertura spec → tasks)

- Línea en blanco → Task 1, control. ✓
- Aviso: 501/500, fallo + aviso, `--artifact`, marcado y puntero, plantilla → Task 2, sus tests y el sujeto. ✓
- Retirada: para, borra, check tras borrar, quedan requisitos, repetición, ya vacía → Task 3, sus tests. ✓
- `- Retiradas:` en spec y en patch → Task 3, tests con `patch.md`. ✓
- «El validador», `--json` con `warnings` → Task 2 y Task 3. ✓
- «Falla sin escribir», excepción de `Retiradas` → Task 3. ✓
- Índice omite lo marcado → Task 1. ✓
- Migración, paso 7 y verificación → Task 1, sujeto. ✓
- Review Focus → Task 2 y Task 3, tests nombrados. ✓
