---
id: 20261108-120335-feature-0319-roadmap-check-file-overlap
feature: 0319
title: Plan de implementación — sdd roadmap check avisa de dos filas abiertas que tocan los mismos ficheros sin «tras» entre ellas
spec: ./spec.md
status: approved
created: 2026-11-08
---

# Plan de implementación — sdd roadmap check avisa de dos filas abiertas que tocan los mismos ficheros sin «tras» entre ellas

## Decisiones que he tomado yo — valida estas

1. **Modelo y effort**: Native, esta sesión implementa las dos tasks; sin subagentes por task. Revisión final en ejes: Spec `sdd-kit:effort-high` + `opus`, Código `sdd-kit:effort-high` + `sonnet`; Arquitectura no (abajo).
2. **Ejecución**: native (motivo en la línea `Ejecución`).
3. **Una función pura y dos lectores** en `cli/src/roadmap/overlap.ts`: `overlapWarnings(rows)` hace el trabajo (pares, cadena, solape, orden); `twoPointOverlapRows` y `nowNextOverlapRows` solo leen filas. Así la Task 2 solo añade un lector y su llamada.
4. **Los ids de la cadena** se toman de todas las filas que leen los lectores, de cualquier estado (decisión 5 de la spec); los pares, solo de las abiertas.
5. **Los tests que ya existen**: `validRoadmap` de `project.ts` tiene la 0013 y la 0014 con el mismo `**Toca:**` y la 0014 «Tras» `0012, 0013`: no avisa. Los tests de `now-next-later.test.ts` que montan filas con `row({ id })` sin «Tras» pueden ganar avisos; se arreglan en la Task 2 solo si un test compara la salida entera, sin tocar lo que prueban.
6. **`dist/`** se regenera con `moon run kit:build` antes de cada commit: `cli:test` compara `dist/` con la fuente.
7. **Riesgo alto**: ninguno; el código de salida no cambia.
8. **Coste estimado**: 1,5 h de implementación; sin subagentes salvo los dos ejes de la revisión final (~250k tokens).
9. Review Focus: 3 entradas que la spec no fija; ver la sección.

**Goal**: `sdd roadmap check` avisa, sin fallar, de cada par de filas abiertas que comparten ruta sin estar ordenadas por una cadena de «tras».

**Architecture**: un módulo nuevo en el dominio `roadmap` de la CLI, con una función pura sobre filas ya leídas y un lector por forma de roadmap; `check.ts` concatena sus avisos detrás de los que ya da cada forma.

**Tech Stack**: TypeScript que Node ≥ 22.18.0 ejecuta sin compilar, solo módulos `node:*`; Vitest en `cli/test/`.

**Spec**: `./spec.md`

**Ejecución**: native, porque son 2 tasks encadenadas por la interfaz de `overlapWarnings`, un error lo caza el Vitest de su task y el plan cabe en un contexto; `execution: auto` en `sdd-kit.json` deja el método a esta recomendación. Si esta sesión se retomó tras una compactación (empieza por «This session is being continued from a previous conversation») y quedan dos o más tasks sin su línea `complete` en el ledger, no las hagas tú: invoca `sdd-implement-subagent` y despacha con él las que quedan sobre el mismo ledger. La sesión que ejecuta va bien en gama media (Sonnet, effort medium); el modelo más capaz se reserva para los ejes Spec y Arquitectura de la revisión final.

**Eje Arquitectura**: no — un fichero nuevo dentro del dominio `cli/src/roadmap/`, que ya existe, sin dependencia en un manifest ni contrato nuevo entre módulos: solo lo llama `check.ts`.

## Restricciones globales

### De código

- Art. X de la constitution: sin comentarios que repitan el código; sin comentarios que citen documentos (constitution, spec, task, requisito, `capabilities/`); nombres descriptivos en inglés, funciones ≤ 20 líneas y ≤ 3 parámetros, early returns, sin duplicación; texto humano (mensajes, avisos) en castellano con tildes. El revisor marca el incumplimiento como Important, salvo un umbral superado en una unidad, que es Minor.
- Solo módulos `node:*`, sin dependencias nuevas; sintaxis que el type stripping de Node borra.
- Texto literal del aviso: `aviso: línea <n>: la <id> y la <id-anterior> (línea <m>) tocan `<ruta>`[, `<ruta>`…] sin «tras» entre ellas`, en la línea de la fila de más abajo; `check.ts` le pone delante `<fichero>: `.
- Fila abierta: estado que empieza por `⏳` o `🔄`. Ruta: texto entre comillas invertidas sin espacios y con `/` o `.`, con `\` → `/` y sin `./` inicial; distingue mayúsculas. Solape: iguales, o `b` empieza por `a` terminada en `/`. Sale la ruta más larga de cada solape; varias, en orden de aparición, separadas por `, ` y sin repetir.
- Orden 2.x: `/(?<!\p{L})(tras|antes de) (?:(?:la|el) )?(\d{4}(?:(?:, | y | e )\d{4})*)/giu` sobre las celdas entre el id y el estado, salvo «Ficheros que toca» de una release. «A antes de B» es «B tras A». Orden 3.0.0: la columna «Tras», ids separados por comas. El par calla si una llega a la otra por la cadena.
- Mismo id: no se compara, salvo `0000`. Avisos ordenados por la línea del aviso y después por la de la otra fila.

### De proceso

- Native: esta sesión implementa; commits por task, juntados al quedar limpia su revisión (`commit-milestones.md`). Mensajes: tipo/scope en inglés, título y cuerpo en castellano; pie `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`.
- `moon run kit:build` antes de cada commit; el pre-commit corre `cli:typecheck cli:test kit:roadmap`.

## Review Focus

- Una fila de «Próximo» con «Ficheros:» pero sin ninguna ruta entre comillas → no avisa · Task 1, `no avisa una fila sin rutas entre comillas`.
- Un ciclo en la cadena («0040 tras 0041» y «0041 tras 0040») → no se cuelga y no avisa · Task 1, `una cadena con ciclo termina`.
- Una fila de `## Release <N>` cuya cabecera no es la de la plantilla → no cuenta, como en `openRows` · Task 1, `una release fuera de plantilla no cuenta`.

---

## Phase -1 — Pre-Implementation Gates

- [x] **Simplicity gate**: una función pura y dos lectores; reutiliza `parseSections`, `tableBlocks`, `openRows` y `rowsOf`.
- [x] **YAGNI gate**: sin opciones ni configuración; sin tope de avisos (decisión 11 de la spec).
- [x] **Brownfield gate**: el código de salida y los avisos de hoy no cambian; solo se añaden líneas detrás.
- [x] **Constitution check**: Art. X (restricciones de código), Principio 4 (lo mecánico a la CLI).

---

## 1. Decisiones técnicas

### 1.1 Estructura de ficheros

**Crear**:

- `cli/src/roadmap/overlap.ts` — `OverlapRow`, `overlapWarnings`, `twoPointOverlapRows`, `nowNextOverlapRows`.
- `cli/test/roadmap/overlap.test.ts` — los escenarios del requisito nuevo.

**Modificar**:

- `cli/src/roadmap/check.ts` — concatena los avisos de solape en `twoPointRoadmapReport` y en la rama de `ROADMAP.md` de `roadmapReport`.
- `dist/cli/src/roadmap/` — lo regenera `moon run kit:build`.
- `cli/test/roadmap/*.test.ts` — solo si un test que compara la salida entera gana un aviso (decisión 5).

**NO se tocan**:

- `cli/src/roadmap/warnings.ts` y `duplicates.ts` — sus avisos siguen igual y en su sitio.
- `skills/` — el texto de solapes de `sdd-roadmap` es de la 0308.
- `tests/batteries/` — los moldes que avisan se registran, no se cambian.

### 1.6 Dependencias

Ninguna.

### 1.7 Riesgos

| Riesgo | Probabilidad | Impacto | Mitigación |
| --- | --- | --- | --- |
| Un test existente compara la salida entera y gana un aviso | media | bajo | decisión 5: se ajusta el fixture o la expectativa, sin cambiar lo que prueba |
| `develop` avanza y cambia los 6 avisos | media | bajo | el cierre vuelve a correrlo y registra lo que dé |

### 1.8 Rollout

Directo: sale con la próxima versión del plugin.

### 1.9 Excepciones a la constitution

Ninguna.

---

## 2. Tasks

Las tasks se ejecutan en orden, sin paralelo; `Tras` dice de cuál depende cada una.

### Task 1 — El aviso de solape en el roadmap 2.x

**Tras**: —
**Modelo**: esta sesión (Native).
**Tests RED**: hilo principal · `cli/test/roadmap/overlap.test.ts`, TDD del propio hilo.
**Superficies**: tooling
**Verificación**: desde `cli/`, `npx vitest run test/roadmap/` → `Tests  <n> passed (<n>)`; y `moon run cli:typecheck` → sale con 0.
**Se prueba en la aplicación**: `node cli/bin/sdd.js roadmap check --path .docs/sdd` sobre el roadmap de la rama da los avisos de la decisión 9 de la spec y acaba en `Roadmap válido`.

**Interfaces**:
- Consume: `parseSections`, `tableBlocks`, `Block` (`parse.ts`); `openRows`, `Row` (`tables.ts`).
- Produce:
  - `export interface OverlapRow { id: string; line: number; open: boolean; paths: string[]; after: string[]; before: string[] }` (`line` empieza en 1).
  - `export function overlapWarnings(rows: OverlapRow[]): string[]` — devuelve `aviso: línea …`, sin prefijo de fichero.
  - `export function twoPointOverlapRows(lines: string[], blocks: Block[]): OverlapRow[]`.

**Ficheros**: crear `cli/src/roadmap/overlap.ts`, `cli/test/roadmap/overlap.test.ts`; modificar `cli/src/roadmap/check.ts`.

- [ ] **Step 1: Tests RED** en `overlap.test.ts`, sobre líneas de un roadmap 2.x (`## Próximo`, `| # | Ítem | Estado |`, separador, filas) pasadas a `twoPointOverlapRows` + `overlapWarnings`, y uno por `runSdd` de `cli/test/capability/helpers.ts` con un `roadmap.md` completo en `sddFolder`:
  - `avisa de la 0041 y la 0040 con la ruta de dentro`: filas 0040 ⏳ (línea 7, «Ficheros: `skills/sdd-verify/`») y 0041 🔄 (línea 8, «Ficheros: `skills/sdd-verify/references/spec-reviewer-prompt.md`, `cli/src/roadmap/`») → `toEqual(['aviso: línea 8: la 0041 y la 0040 (línea 7) tocan `skills/sdd-verify/references/spec-reviewer-prompt.md` sin «tras» entre ellas'])`.
  - `calla con tras o antes de en cualquiera de las dos` (`it.each`): «tras 0040» y «Fila tras la 0040» en la 0041, «tras 0041» y «antes de 0041» en la 0040, «antes de 0040» en la 0041, «tras 0039, 0040 y 0042» en la 0041 → `[]`.
  - `calla con la cadena 0041 tras 0030 tras 0040`: con la 0030 ✅ en la tabla → `[]`.
  - `una cadena con ciclo termina`: 0040 «tras 0041» y 0041 «tras 0040» → `[]`.
  - `ordena tres filas`: con la 0042 ⏳ en la línea 9, «Ficheros: `skills/sdd-verify/`» → los tres avisos de la spec en ese orden.
  - `la carpeta cubre hasta su barra`: `skills/sdd-verify` frente a `skills/sdd-verify/x.md` avisa con `skills/sdd-verify/x.md`; frente a `skills/sdd-verify-old/x.md`, `[]`; `.\skills\sdd-verify\x.md` frente a `skills/sdd-verify/x.md` avisa con `skills/sdd-verify/x.md`; dos rutas compartidas salen como `` `a/x.md`, `b/y.md` ``.
  - `no cuenta lo que no es ruta`: `sdd roadmap check` en las dos → `[]`.
  - `no avisan las filas cerradas o aparcadas` (`it.each` con `⏸️ aparcada: x`, `✅`, `🧪 validación diferida a x`) → `[]`.
  - `no avisa una fila sin «Ficheros:»` (con `skills/sdd-verify/` en la prosa) y `cuenta el último «Ficheros:»` (el primero con `skills/sdd-verify/`, el último con `cli/x.ts`) → `[]` frente a una fila con `skills/sdd-verify/`.
  - `no avisa una fila sin rutas entre comillas`: «Ficheros: sus tests» → `[]`.
  - `el mismo id no se compara, 0000 sí`: dos 0210 → `[]`; dos 0000 → un aviso `la 0000 y la 0000`.
  - `Próximo contra una release`: 0040 en Próximo y 0050 en `## Release 3.1` (`| id | Feature | Origen | Ficheros que toca | Estado |`, ruta en «Ficheros que toca») → un aviso; con «tras 0040» en «Ficheros que toca» de la 0050 sigue avisando.
  - `una release fuera de plantilla no cuenta`: cabecera `| id | Feature | Estado |` → `[]`.
  - `checkRoadmap acaba en Roadmap válido con el aviso tras el id repetido`: `roadmap.md` válido con un id repetido y el par 0040/0041 → `code` 0, la línea de solape con prefijo `roadmap.md: ` después de la del id repetido, última línea `Roadmap válido`.
- [ ] **Step 2: Implementación** en `overlap.ts`: `overlapWarnings` (pares de abiertas, salto de mismo id salvo `0000`, cadena con visitados, solape, orden) y `twoPointOverlapRows` (rutas tras el último `Ficheros:` en «Próximo» o de la celda 3 en una release; orden en `cells.slice(1, -1)` sin la celda 3 en una release). En `check.ts`, `twoPointRoadmapReport` añade `...overlapWarnings(twoPointOverlapRows(lines, blocks))` al final de `warnings`, antes de `prefixed`.
- [ ] **Step 3: Build** — `moon run kit:build`.
- [ ] **Step 4: Verificación** — los comandos de «Verificación», y `node cli/bin/sdd.js roadmap check --path .docs/sdd`.
- [ ] **Step 5: Commit de la task** — `feat(roadmap): …` con el pie de atribución.

### Task 2 — El aviso de solape en `ROADMAP.md` (3.0.0)

**Tras**: Task 1
**Modelo**: esta sesión (Native).
**Tests RED**: hilo principal · `cli/test/roadmap/overlap.test.ts`, TDD del propio hilo.
**Superficies**: tooling
**Verificación**: desde `cli/`, `npx vitest run test/roadmap/` → `Tests  <n> passed (<n>)`; y `moon run cli:typecheck` → sale con 0.
**Se prueba en la aplicación**: `node cli/bin/sdd.js roadmap check --path tests/batteries/sdd-roadmap/mold-salas-3-nofamily/.docs/sdd` da los avisos de ese molde (9 medidos con el borrador).

**Interfaces**:
- Consume: `OverlapRow`, `overlapWarnings` de la Task 1; `rowsOf` (`tables.ts`); `checkProject`, `row`, `validRoadmap`, `brief` de `cli/test/roadmap/project.ts`.
- Produce: `export function nowNextOverlapRows(lines: string[], blocks: Block[]): OverlapRow[]` — filas de las tablas de Now y Next (títulos `Now…` y `Next`); rutas tras `**Toca:**` hasta `</details>`; `after` de la celda 4 partida por comas, sin vacíos ni `—`; `before` vacío; `open` por la celda 3.

**Ficheros**: modificar `cli/src/roadmap/overlap.ts`, `cli/src/roadmap/check.ts`, `cli/test/roadmap/overlap.test.ts`; y los tests de la decisión 5 si hace falta.

- [ ] **Step 1: Tests RED** por `checkProject`:
  - `ROADMAP.md avisa de la 0015 con la 0013 y la 0014`: `validRoadmap` con `row({ id: '0015', after: '—', size: 'S' })` en la línea 17 (tras la 0014) → `lines` contiene, en este orden, `ROADMAP.md: aviso: línea 17: la 0015 y la 0013 (línea 10) tocan `src/avisos.js` sin «tras» entre ellas` y `ROADMAP.md: aviso: línea 17: la 0015 y la 0014 (línea 16) tocan `src/avisos.js` sin «tras» entre ellas`; ninguna línea `la 0014 y la 0013`; `code` 0.
  - `ROADMAP.md calla con la cadena`: la 0015 con «Tras» `0014` → ninguna línea `sin «tras» entre ellas`.
  - `ROADMAP.md no cuenta filas cerradas, aparcadas, sin Toca ni Later` (`it.each` sobre la 0015 con estado `✅`, `🧪 validación diferida a x`, `⏸️ aparcada: x`, y con `task` sin `**Toca:**`; y `laterRow` con `**Toca:** `src/avisos.js``) → ninguna línea de solape.
  - `con los dos ficheros solo compara ROADMAP.md`: `legacy` con un `roadmap.md` 2.x con el par 0040/0041 → ninguna línea `roadmap.md: aviso: línea 8`.
- [ ] **Step 2: Implementación** — `nowNextOverlapRows` en `overlap.ts`; en `check.ts`, la rama de `ROADMAP.md` añade `...prefixed(file, overlapWarnings(nowNextOverlapRows(lines, blocks)))` tras los del id repetido (calcula `blocks` con `tableBlocks(lines, parseSections(lines))`).
- [ ] **Step 3: Build** — `moon run kit:build`.
- [ ] **Step 4: Verificación** — los comandos de «Verificación»; después, `node cli/bin/sdd.js roadmap check` sobre `.docs/sdd` y sobre cada `.docs/sdd` de los moldes de `tests/batteries/`, con la salida para el walkthrough.
- [ ] **Step 5: Commit de la task** — `feat(roadmap): …` con el pie de atribución.

---

## Estimación y esfuerzo

- Tipo: infra/tooling
- Esfuerzo spec + plan: 1,2 h
- Estimación de implementación: 1,5 h
- Estimación de revisión: 0,3 h
- Estimación de cierre: 0,4 h
- Base de la estimación: 2 tasks sobre un módulo nuevo y una llamada; la lógica ya está escrita en el borrador del scratchpad; infra/tooling tiene ratio mediano 0,48 en el log (70 artefactos), la 0320 0,34.
- Confianza: media

---

## 3. Validación final

- [ ] Gate de cierre, una vez y en el hilo principal: `moon run kit:test-headless cli:typecheck cli:test --affected --base develop`
- [ ] Verificación de los criterios de éxito de la spec (Intent): los 6 avisos sobre `develop`, `Roadmap válido`, ningún aviso de un par ordenado
- [ ] Spec satisfecha: cada requisito tiene su task (§4)
- [ ] Cierre de rama según el flujo del proyecto (`sdd-archive`)

---

## 4. Self-review (cobertura spec → tasks)

- THEN: aviso `línea 8: la 0041 y la 0040 (línea 7)…`, `Roadmap válido`, 0 → Task 1, `avisa de la 0041 y la 0040…` y `checkRoadmap acaba en Roadmap válido…`. ✓
- AND «tras», «Fila tras la», «antes de» y lista de ids → Task 1, `calla con tras o antes de…`. ✓
- AND la cadena por la 0030 → Task 1, `calla con la cadena…`. ✓
- AND orden de tres filas, tras el id repetido y antes de `debt.md` → Task 1, `ordena tres filas` y `checkRoadmap…`; el «antes de `debt.md`» lo da la concatenación de `checkRoadmap` (roadmap, después debt), que no cambia. ✓
- AND carpeta hasta la barra, normalización, varias rutas → Task 1, `la carpeta cubre hasta su barra`. ✓
- AND lo que no es ruta → Task 1, `no cuenta lo que no es ruta`. ✓
- AND filas ⏸️, ✅, 🧪; sin «Ficheros:»; el último «Ficheros:» → Task 1, `no avisan las filas cerradas…`, `no avisa una fila sin «Ficheros:»`, `cuenta el último «Ficheros:»`. ✓
- AND mismo id y `0000` → Task 1, `el mismo id no se compara, 0000 sí`. ✓
- AND Próximo contra release → Task 1, `Próximo contra una release`. ✓
- AND `ROADMAP.md` con 0013, 0014 y 0015, y la cadena con «Tras» `0014` → Task 2, `ROADMAP.md avisa…` y `ROADMAP.md calla con la cadena`. ✓
- AND Now/Next cerradas, aparcadas, sin `**Toca:**`, Later → Task 2, `ROADMAP.md no cuenta…`. ✓
- AND con los dos ficheros → Task 2, `con los dos ficheros solo compara ROADMAP.md`. ✓
- Regla **Avisos** → la fusiona el cierre; comprobada con `sdd capability merge` en el repaso de coherencia. ✓
- Decisiones 9 y 10 de la spec (develop y moldes) → Task 2, Step 4, al walkthrough. ✓
- Review Focus → Task 1, los tres tests nombrados. ✓
