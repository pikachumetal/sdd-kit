---
id: 20261110-181442-feature-0198-migrate-repo-v3
feature: 0198
title: Plan de implementación — Migrar este repo a la 3.0.0
spec: ./spec.md
status: approved
created: 2026-11-10
---

# Plan de implementación — Migrar este repo a la 3.0.0

## Decisiones que he tomado yo — valida estas

1. **Modelo y effort**: Native, el hilo implementa; sujetos en sonnet; revisión final con los ejes de `sdd-verify` (Spec `sdd-kit:effort-high` + `opus`, Código `sdd-kit:effort-high` + `sonnet`).
2. **Ejecución**: Native: las tasks comparten la migración y el estado del repo, y el hilo ya tiene el contexto.
3. **Orden**: la batería primero (RED en segundo plano mientras se escriben los arreglos), después la migración, el aviso de versión y, al final, la aplicación a este repo con sus dos páginas.
4. **Coste**: ~6 h; sujetos 3,80 $ (spec).

**Goal**: la migración v3.0.0 sin los huecos que destapa este repo, y este repo migrado.

**Architecture**: texto de `skills/sdd-upgrade/references/migrations/v3.0.0.md`, un molde y un escenario de batería, una función de `cli/bin/session-start.js` y los documentos de `.docs/sdd/`.

**Tech Stack**: Node, pnpm, moon, Vitest; baterías con `tests/headless/battery.mjs`.

**Spec**: `./spec.md`

**Ejecución**: native, porque las tasks comparten estado y el plan cabe en un contexto.

**Eje Arquitectura**: no — documentos, una migración y una función.

## Restricciones globales

### De código

- La migración no gana ni renumera pasos y su línea `**Writes**:` no cambia.
- Las marcas en castellano de la migración, entre comillas latinas o en código (`tests/own`).
- Ningún documento se reescribe salvo lo que pida una tabla aprobada.
- Art. X: sin comentarios que citen documentos.

### De proceso

- Antes de editar la migración, `sdd-agent-writing`; después, `moon run kit:build`.
- Las páginas de aprobación son paradas: sin «sí», nada se mueve.
- `roadmap.md` no se edita en `develop` mientras viva la rama.

## Review Focus

- Fila ✅ cuyo `walkthrough.md` ninguna etiqueta contiene → Now · Task 1, fila de `v5`
- Enlace `](specs/…)` del changelog → `](.docs/sdd/specs/…)` en `CHANGELOG.md` · Task 1 y Task 4, test de enlaces
- Proyecto en 3.0.0 con kit 2.3.4 que trae `v3.0.0.md` → sin aviso · Task 3

---

## Phase -1 — Pre-Implementation Gates

- [x] **Simplicity gate**: frases en el paso que decide; una función.
- [x] **YAGNI gate**: nada sin un caso de este repo.
- [x] **Brownfield gate**: los escenarios de `mold-v2x` no cambian; la variante es aparte.
- [x] **Constitution check**: Art. I (RED con `v5` antes de los arreglos), Art. X.

---

## 2. Tasks

### Task 1 — La batería ve los huecos de la migración

**Tras**: —
**Modelo**: Native, el hilo; sujetos de `v5` en sonnet, `N=2`.
**Tests RED**: `BATTERY=sdd-upgrade SCENARIOS="v5" N=2 PHASE=red node tests/headless/battery.mjs run` con `KIT_DIR` del kit de `develop`.
**Verificación**: el RED sale rojo en las filas nuevas; `tests/sdd-upgrade-0198-red.md` con los recuentos de este repo.
**Ficheros**: `tests/batteries/sdd-upgrade/battery.md`, `subject.mjs`, `persona-v2x.md`; evidencia.

- [ ] **Step 1**: `subject.mjs` etiqueta la release del molde en `main`; variante `v2x-release` y escenario `v5`; `v2xReport` con `CHANGELOG.md`, `capabilities/` y `git tag`; persona y V5.
- [ ] **Step 2**: filas de rúbrica por arreglo; `node --check`; plan en seco.
- [ ] **Step 3**: RED en segundo plano; recuentos de este repo.
- [ ] **Step 4**: commit `test(sdd-upgrade): v5, los casos de la migración que destapa este repo`.

### Task 2 — La migración v3.0.0 sin huecos

**Tras**: Task 1
**Modelo**: Native, el hilo.
**Verificación**: `pnpm --dir cli exec vitest run test/kit/operations-gate-fields.test.ts test/kit/migration-init-parity.test.ts`; `moon run kit:build kit:own kit:skill-size`; GREEN `v5` × 2 y `v1` × 2.
**Ficheros**: `skills/sdd-upgrade/references/migrations/v3.0.0.md`, `dist/`; evidencia GREEN.

- [ ] **Step 1**: arreglos (a) a (g) de la spec.
- [ ] **Step 2**: build y tests.
- [ ] **Step 3**: GREEN.
- [ ] **Step 4**: commit `fix(sdd-upgrade): la migración v3.0.0 conserva enlaces e ids y decide lo publicado por la etiqueta`.

### Task 3 — El aviso de versión con un kit que ya trae la migración

**Tras**: —
**Modelo**: Native, el hilo.
**Tests RED**: test de `sessionStartOutput` con el proyecto en 3.0.0 y el kit en 2.3.4 con `v3.0.0.md`.
**Verificación**: `pnpm --dir cli exec vitest run` del fichero de test de `session-start`.
**Ficheros**: `cli/bin/session-start.js` y su test.

- [ ] **Step 1**: test rojo, arreglo, verde.
- [ ] **Step 2**: commit `fix(cli): sin aviso de versión cuando el kit cargado trae la migración del proyecto`.

### Task 4 — Este repo, migrado

**Tras**: Tasks 2 y 3
**Modelo**: Native, el hilo.
**Verificación**: la «Verification» de la migración; `sdd roadmap check` y `capability check`; test de enlaces nuevo; cruce por id; gate.
**Ficheros**: `.docs/sdd/`, `PRODUCT.md`, `ROADMAP.md`, `CHANGELOG.md`, `CLAUDE.md`, `README.md`, `.github/workflows/ci.yml`, `cli/test/kit/word-budget.test.ts`, test de enlaces, `.gitignore`, `.claude/`.

- [ ] **Step 1**: primera página (pasos 1, 2, 3 y 6), con el ensayo que mide los topes → parada.
- [ ] **Step 2**: con el «sí», enmienda con los topes; aplicar los pasos 1 a 7, herramientas, decisiones 9 y 10; verificación; marca y commit `chore(sdd): migrar al kit v3.0.0`.
- [ ] **Step 3**: segunda página (pasos 8 y 10) → parada; con el «sí», sus commits.

---

## Estimación y esfuerzo

- Tipo: infra/tooling
- Esfuerzo spec + plan: 1,5h
- Estimación de implementación: 5h
- Estimación de revisión: 0,5h
- Estimación de cierre: 0,5h
- Base de la estimación: la 0197 (la migración, 8 h) y la 0199 (sus textos); aquí, siete arreglos y una aplicación real.
- Confianza: baja

---

## 3. Validación final

- [ ] Gate de cierre: `moon run kit:test-headless cli:typecheck cli:test --affected --base develop`
- [ ] Spec satisfecha (Self-review)
- [ ] Cierre con `sdd-archive`

---

## 4. Self-review (cobertura spec → tasks)

- MODIFIED aviso de versión → Task 3. ✓
- MODIFIED nombres, roadmap, deuda; ADDED enlaces, publicado, prefijo, ids → Tasks 1 y 2 (`v5`, `v1`). ✓
- Decisiones 3 a 13 → Task 4. ✓
- Decisión 14 → Task 1. ✓
