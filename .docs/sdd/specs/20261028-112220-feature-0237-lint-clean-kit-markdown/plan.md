---
id: 20261028-112220-feature-0237-lint-clean-kit-markdown
feature: 0237
title: Plan de implementación — El markdown del kit pasa markdownlint
spec: ./spec.md
status: draft
created: 2026-10-28
---

# Plan de implementación — El markdown del kit pasa markdownlint

## Decisiones que he tomado yo — valida estas

1. Modelo y effort: Native, la sesión implementa las tres tasks; revisión final con Spec `sdd-kit:effort-high` + `opus` y Código `sdd-kit:effort-high` + `sonnet`; sin eje Arquitectura.
2. Ejecución: native (ver la línea `Ejecución`).
3. Una sola regex reconoce las dos formas de marca: `^(?:\*\*|####\s+)(ADDED|MODIFIED|REMOVED|Reglas de la capacidad)\b`; el título sale de `—` hasta `**` (negrita) o hasta ` (antes:`, los `#` de cierre o el final (encabezado).
4. Un encabezado `####` se da por cerrado cuando sus paréntesis cuadran, igual que la negrita: así se une un `(antes: …)` partido sin código aparte.
5. Las líneas en blanco de una tabla se ponen al guardar (`withBlankLines` de `document.ts`), no al leer el delta: cubre también una tabla del vivo que ya estuviera pegada. Una tabla es una línea cuyo texto sin sangría empieza por `|`.
6. Riesgos: un `####` ajeno a las marcas en una capacidad (`#### Notas`) no lo toca `deltaLeftoverProblems`: solo cuentan las cuatro marcas.
7. Coste: ~2 h, sin despachos salvo la revisión final (~200k tokens).
8. Review Focus: 2 entradas; ver la sección.

**Goal**: la CLI lee las marcas de delta en encabezado `####` además de la negrita, las plantillas las escriben así, y la fusión deja una línea en blanco alrededor de cada tabla.

**Architecture**: el parser del delta (`sections.ts`) es el único que reconoce marcas; `merge.ts` y `check.ts` lo usan. El validador busca restos de delta en `check.ts`. Las líneas en blanco las fija `withBlankLines` al guardar.

**Tech Stack**: TypeScript en Node 22, Vitest (`cli/test/capability/`), moon.

**Spec**: `./spec.md`

**Ejecución**: native, porque 3 tasks pequeñas encadenadas por el parser de `sections.ts`, un error lo caza el test de su task y el plan cabe en un contexto. Si esta sesión se retomó tras una compactación (empieza por «This session is being continued from a previous conversation») y quedan dos o más tasks sin su línea `complete` en el ledger, no las hagas tú: despacha las que quedan con el método SDD de sdd-implement sobre el mismo ledger. La sesión que ejecuta va bien en gama media (Sonnet, effort medium); el modelo más capaz se reserva para los ejes Spec y Arquitectura de la revisión final.

**Eje Arquitectura**: no — cambia la lectura de un formato dentro de `cli/src/capabilities/` y dos plantillas; ningún módulo, dependencia ni contrato nuevo entre módulos.

## Restricciones globales

### De código

- La forma en negrita (`**ADDED — <título>**`, `**Reglas de la capacidad**`) se sigue leyendo igual: ningún test existente de `cli/test/capability/` cambia salvo el mensaje de `merge.test.ts:218`.
- Mensajes literales de la spec: `resto de delta «#### <MARCA> —» en la línea <n>`, `resto de delta «#### Reglas de la capacidad» en la línea <n>: sus entradas van en «## Reglas de la capacidad»`, `no leo el título de «<cabecera tal como está>»: escríbelo como «#### <MARCA> — <título>», con raya`.
- Art. X de la constitution: sin comentarios que repitan el código ni que citen documentos (constitution, spec, task, capacidad); nombres descriptivos en inglés, funciones ≤ 20 líneas y ≤ 3 parámetros, early returns, sin duplicación; texto humano en castellano con tildes.

### De proceso

- Política de modelos del kit (Art. IV): modelo y effort explícitos en cada despacho; `fable` y `opus xhigh` prohibidos por defecto.
- Commits: tipo/scope en inglés, título y cuerpo en castellano; uno por task.

## Review Focus

- Un título con `(antes: …)` en encabezado cerrado con `#` (`#### MODIFIED — X (antes: «a») ##`) → título «X» · Task 1, `reads a closed heading with its before clause`
- Una tabla del vivo, no del delta, ya pegada a su párrafo → al fusionar otra cosa en esa capacidad queda con sus líneas en blanco · Task 3, `adds blank lines around a table already in the capability`

---

## Phase -1 — Pre-Implementation Gates

- [x] **Simplicity gate**: una regex para las dos formas; la tabla, en la función que ya pone las líneas en blanco.
- [x] **YAGNI gate**: nada abstraído.
- [x] **Brownfield gate**: retrocompatible con la negrita; sigue el patrón de `sections.ts`.
- [x] **Constitution check**: Art. I (decisión 8 de la spec), Art. VIII (las plantillas solo en `sdd-templates`), Art. X.

---

## 1. Decisiones técnicas

### 1.1 Estructura de ficheros

**Modificar**:

- `cli/src/capabilities/sections.ts` — `DELTA_HEADER`, `DELTA_TITLE` y `isHeaderClosed` leen las dos formas.
- `cli/src/capabilities/merge.ts` — mensaje del título ilegible con la forma nueva.
- `cli/src/capabilities/check.ts` — `deltaLeftoverProblems` rechaza también `#### ADDED|MODIFIED|REMOVED —` y `#### Reglas de la capacidad`.
- `cli/src/capabilities/document.ts` — `withBlankLines` rodea cada tabla de líneas en blanco (si el rojo lo reproduce).
- `skills/sdd-templates/templates/spec-template.md` y `patch-template.md` — marcas en `####` con línea en blanco debajo.
- `cli/test/capability/merge.test.ts` y `check.test.ts` — casos nuevos.

**NO se tocan**:

- Fixtures de `tests/batteries/` y los casos en negrita de `cli/test/capability/` — prueban la forma vieja.
- `.docs/sdd/capabilities/capabilities.md` — lo fusiona `sdd-archive` al cerrar.

### 1.2–1.6

No aplican.

### 1.7 Riesgos

| Riesgo | Probabilidad | Impacto | Mitigación |
| --- | --- | --- | --- |
| La regex del título en encabezado se come parte de un título con paréntesis propios | baja | media | solo corta en ` (antes:`; test con título y `(antes: …)` |

### 1.8 Rollout

Directo, con el plugin de la 3.0.0.

### 1.9 Excepciones a la constitution

Ninguna.

---

## 2. Tasks

Las tasks se ejecutan en orden, sin paralelo; `Tras` dice de cuál depende cada una.

### Task 1 — La CLI lee y rechaza las marcas en encabezado

**Tras**: —
**Modelo**: sesión (Native)
**Tests RED**: hilo principal · `cli/test/capability/merge.test.ts`, `cli/test/capability/check.test.ts`
**Superficies**: tooling
**Verificación**: `moon run cli:test-min` → `Tests  <n> passed (<n>)`; `moon run cli:typecheck` → sale con 0

**Interfaces**:
- Consume: nada
- Produce: `deltaEntries(lines)` devuelve la misma `Delta` (`kind`, `writtenKind`, `title`, `header`, `lines`) para `**MODIFIED — X**` y `#### MODIFIED — X`; `header` es la cabecera tal como está escrita.

**Ficheros**: modificar `cli/src/capabilities/sections.ts`, `merge.ts`, `check.ts` y sus tests.

- [ ] **Step 1: Tests RED** — en `merge.test.ts`, con los `bookings` y helpers existentes:
  - `merges heading marks like bold marks`: el mismo MODIFIED en `#### MODIFIED — Reservar una franja (antes: «la reserva queda guardada»)` y en `**MODIFIED — Reservar una franja**` sobre dos carpetas → las dos salidas contienen `bookings.md: sustituido «Reservar una franja»`, código 0, y `readFileSync` de los dos `bookings.md` es igual.
  - `merges heading ADDED, REMOVED and rules`: `#### ADDED — Cancelar una reserva`, `#### REMOVED — Consultar salas libres`, `#### Reglas de la capacidad — bookings` + `- **Avisos**: aviso si la reserva pisa un festivo o dura más de 4 h` → las tres líneas de la spec (`añadido`, `quitado`, `regla «Avisos» sustituida`).
  - `reads a heading without a blank line, a closed heading and a split before clause`: `#### ADDED — Cancelar una reserva` + `- GIVEN` sin blanco; `#### ADDED — Cancelar una reserva ##`; `#### MODIFIED — Reservar una franja (antes: «la reserva queda` + `guardada»)` → añadido/sustituido, y `bookings.md` no contiene `guardada»)`.
  - `reads a closed heading with its before clause`: `#### MODIFIED — Reservar una franja (antes: «a») ##` → `sustituido «Reservar una franja»`.
  - `rejects an unreadable title in both forms`: `#### ADDED - Cancelar una reserva` y `**ADDED - Cancelar una reserva**` → `toContain` los dos mensajes literales de la spec, código 1, ficheros sin cambiar. El test de la línea 218 pasa a esperar `escríbelo como «#### ADDED — <título>», con raya`.
  - En `check.test.ts`: `rejects heading marks in a capability` (las tres marcas y `#### Reglas de la capacidad — bookings` en la línea 14 → `bookings.md: resto de delta «#### MODIFIED —» en la línea 14`, idem ADDED/REMOVED, y el de reglas); `reads a heading delta with --artifact` (`#### ADDED — Cancelar una reserva` sin fusionar → `spec.md: «Cancelar una reserva» del delta no está en capabilities/bookings.md`; `#### MODIFIED — Reservar una franja` con otro THEN → `… del delta no coincide con capabilities/bookings.md`).
- [ ] **Step 2: Implementación** — `DELTA_HEADER = /^(?:\*\*|####\s+)(ADDED|MODIFIED|REMOVED|Reglas de la capacidad)\b/i`; el título del encabezado: `/^####\s+[\p{L}\p{N}_]+ —\s*(.+?)(?:\s+\(antes:.*)?\s*#*\s*$/u`. `isHeaderClosed` acepta `####` sin exigir `**…**` y conserva la cuenta de paréntesis. `merge.ts:65`: `escríbelo como «#### ${entry.writtenKind} — <título>», con raya`. `check.ts`: la regex de marca admite `####\s+` y el mensaje cita la marca con su prefijo (`«**MODIFIED —»` o `«#### MODIFIED —»`); el de reglas, `«#### Reglas de la capacidad»` para el encabezado.
- [ ] **Step 3: Verificación** — los comandos de «Verificación»: verdes.
- [ ] **Step 4: Commit de la task** — `feat(cli): leer las marcas de delta en encabezado`.

### Task 2 — Las plantillas escriben las marcas en encabezado

**Tras**: Task 1
**Modelo**: sesión (Native)
**Tests RED**: hilo principal · `cli/test/capability/merge.test.ts`
**Superficies**: tooling, docs (plantillas)
**Verificación**: `moon run cli:test-min` → `Tests  <n> passed (<n>)`; `moon run kit:test` → verde; pasada manual de `npx --yes markdownlint-cli2@0.18.1` en el scratchpad (config `{ "MD013": false, "MD033": false }`) sobre un delta calcado de cada plantilla con los huecos rellenos y sobre la capacidad fusionada → `Summary: 0 error(s)`

**Interfaces**:
- Consume: la lectura de `####` de la Task 1.
- Produce: nada.

**Ficheros**: modificar `skills/sdd-templates/templates/spec-template.md`, `patch-template.md`, `cli/test/capability/merge.test.ts`.

- [ ] **Step 1: Tests RED** — `template deltas use heading marks`: para `spec-template.md` y `patch-template.md`, la sección del delta no tiene líneas que casen con `/^\*\*(ADDED|MODIFIED|REMOVED|Reglas de la capacidad)/`, y cada línea `^#### ` va seguida de `''`. El caso existente que calca `spec-template.md` (línea ~322) reemplaza `#### ADDED — <título estable>` y se fusiona con 0; uno nuevo igual con `patch-template.md` (`#### MODIFIED — <título estable>` → `Reservar una franja`, con sus GIVEN/WHEN/THEN rellenos).
- [ ] **Step 2: Implementación** — `spec-template.md`: `#### ADDED — <título estable>`, `#### MODIFIED — <título estable> (antes: "<la cláusula que cambia>" — opcional)`, `#### REMOVED — <título estable>`, `#### Reglas de la capacidad — <nombre> *(…la ayuda actual…)*`, cada uno con una línea en blanco debajo. `patch-template.md`: `#### MODIFIED — <título estable>` con línea en blanco debajo.
- [ ] **Step 3: Verificación** — los comandos de «Verificación»; el resultado de markdownlint se apunta para el walkthrough.
- [ ] **Step 4: Commit de la task** — `feat(templates): marcas de delta como encabezados`.

### Task 3 — La fusión deja una línea en blanco alrededor de cada tabla

**Tras**: Task 1
**Modelo**: sesión (Native)
**Tests RED**: hilo principal · `cli/test/capability/merge.test.ts`
**Superficies**: tooling
**Verificación**: `moon run cli:test-min` → `Tests  <n> passed (<n>)`; `moon run cli:typecheck` → sale con 0

**Interfaces**:
- Consume: la lectura de `####` de la Task 1.
- Produce: nada.

**Ficheros**: modificar `cli/test/capability/merge.test.ts` y, si el rojo lo reproduce, `cli/src/capabilities/document.ts`.

- [ ] **Step 1: Tests RED** — `adds blank lines around a glued table`: `#### ADDED — Consultar las tarifas` con `- GIVEN …`, `- WHEN …`, `- THEN responde:`, `  | Sala | Tarifa |`, `  | --- | --- |`, `  | Norte | 20 € |`, `- AND sin sala responde las de todas`, sin blancos → en `bookings.md` la línea anterior a `  | Sala | Tarifa |` es `''`, la siguiente a `  | Norte | 20 € |` es `''`, no hay `''` entre filas ni dos `''` seguidas; y `capability check --artifact` → `Capacidades válidas: 1`, código 0. `keeps a table already surrounded by blank lines`: el mismo delta con blancos → mismo `bookings.md`. `adds blank lines around a table already in the capability`: `bookings` con esa tabla pegada en «Reservar una franja» y un ADDED cualquiera → la tabla queda con sus blancos. Correr: si los tres pasan sin código, se apunta «no se reproduce» para el walkthrough y no se toca `document.ts`.
- [ ] **Step 2: Implementación** (solo si hay rojo) — en `withBlankLines`, `isTable = (text) => text.trimStart().startsWith('|')`; antes de una línea de tabla cuyo anterior no es tabla, y antes de una no-tabla cuyo anterior es tabla, se empuja `''` (con el mismo guardado de no duplicar).
- [ ] **Step 3: Verificación** — los comandos de «Verificación»: verdes.
- [ ] **Step 4: Commit de la task** — `fix(cli): líneas en blanco alrededor de las tablas al fusionar`.

---

## Estimación y esfuerzo

- Tipo: infra/tooling
- Esfuerzo spec + plan: 1,2h
- Estimación de implementación: 1,5h
- Base de la estimación: 3 tasks pequeñas sobre un parser conocido; la incertidumbre es si la tabla se reproduce.
- Confianza: media

---

## 3. Validación final

- [ ] Gate de cierre, una vez y en el hilo principal: `moon run kit:test kit:test-headless cli:typecheck cli:test-min --affected --base develop`
- [ ] Verificación de los criterios de éxito de la spec (Intent)
- [ ] Spec satisfecha: cada requisito tiene su task (ver Self-review)
- [ ] Cierre de rama según el flujo del proyecto (`sdd-archive`)

---

## 4. Self-review (cobertura spec → tasks)

- «El delta declara…», AND de la marca en encabezado y la negrita que se sigue leyendo → Task 2, `template deltas use heading marks`; Task 1, `merges heading marks like bold marks`. ✓
- Resto de AND de «El delta declara…» → N/A: no cambian. ✓
- «El validador…», AND de las marcas en negrita y en encabezado, y sus mensajes → Task 1, `rejects heading marks in a capability`. ✓
- «El validador…», AND de `--artifact` con `####` (no está / no coincide) → Task 1, `reads a heading delta with --artifact`. ✓
- «El validador…», AND del título partido ceñido a la negrita → tests existentes de `check.test.ts:343`. ✓
- «La fusión lee las dos formas…», THEN y ANDs → Task 1, sus cinco tests de `merge.test.ts`; el AND de las plantillas → Task 2. ✓
- «La fusión deja una línea en blanco…», THEN y ANDs → Task 3, sus tres tests. ✓
- Intent (markdownlint salvo MD013 y MD033) → Task 2, pasada manual de markdownlint. ✓
- Review Focus → Task 1 `reads a closed heading with its before clause`; Task 3 `adds blank lines around a table already in the capability`. ✓
