---
id: 20261110-205400-feature-0152-coherence-smoke-release
feature: 0152
title: Plan de implementación — Coherencia, humo, batería de release y corte de la 3.0.0
spec: ./spec.md
status: approved
created: 2026-11-10
---

# Plan de implementación — Coherencia, humo, batería de release y corte de la 3.0.0

## Decisiones que he tomado yo — valida estas

1. **Modelo y effort**: Native, el hilo implementa y coordina; lectores y sujetos en sonnet, revisores en opus (spec, Política de modelos).
2. **Ejecución**: Native: las tasks comparten el estado del repo y la batería mide el commit final.
3. **Sin commits durante una tanda** (spec, decisión 1): cada task commitea entre tandas.
4. **Coste**: ~360 $ y ~17 h de tandas (spec, «Previsión de coste»).

**Goal**: la 3.0.0 lista para publicar: documentos coherentes, deuda de la fila cerrada, mediciones hechas, batería de release verde.

**Architecture**: texto de documentos y skills, dos verbos de `cli/` con su test, baterías y su evidencia.

**Tech Stack**: Node, pnpm, moon, Vitest; baterías con `tests/headless/battery.mjs`; `dotnet` 10 para el molde C#.

**Spec**: `./spec.md`

**Ejecución**: native, porque el hilo coordina lectores y tandas sobre un mismo árbol.

**Eje Arquitectura**: sí — el dev-lead pidió reviews más exhaustivas.

## Restricciones globales

### De código

- Un arreglo de skill sustituye la frase que falla y no alarga la skill; el saldo de palabras de las skills que toca, igual o menor.
- Art. X: sin comentarios que citen documentos.

### De proceso

- Ningún commit con una tanda en marcha.
- Cada tanda, con su `PHASE` de ≤ 10 caracteres y el commit de su `KIT_DIR` apuntado en `tests/release-3.0.0.md`.
- `COST_CAP` como total de la campaña (360).

## Review Focus

- Un escenario rojo de `develop` que se repite → arreglo con RED y GREEN · Task 3
- Una batería cuya `dist/` cambió tras correr → sus escenarios afectados vuelven a correr · Task 4
- El corte no publica: paso 7 pendiente · Task 6

---

## 2. Tasks

### Task 1 — Coherencia de los documentos
Cinco lectores sonnet (decisión 2 de la spec); el hilo arregla cada contradicción o escribe su motivo; marcadores de `.docs/workflow/`. Verificación: `workflow-docs.test.ts`, `root-docs-links.test.ts`, `kit:own`. Commit `docs(sdd): coherencia de los documentos con el kit 3.0.0`.

### Task 2 — La deuda de la fila
Las seis filas y las 27 en espera (decisión 3): ADR nuevas, `session-start.js` con `sdd-kit.local.json`, `tests/upstream/check.ts`, la receta de `encargo-revision.md`, el hueco de `spec-template.md`, la variante E2E y `e2`. Verificación: sus tests, `sdd decision check`, sus RED y GREEN. Commits por fila.

### Task 3 — Mediciones de la fila y rojos de la base
Decisión 4 de la spec; los rojos que se repiten, con Art. I (decisión 5). Verificación: `tests/release-3.0.0.md`.

### Task 4 — Batería de release
Decisión 6; lectores por batería; re-ejecución por `dist/`. Verificación: `tests/release-3.0.0.md` sin un rojo que se repita.

### Task 5 — Cierre
`sdd-archive`: revisión final en tres ejes, gate, CI, merge.

### Task 6 — Corte
Sobre `develop`: `lock run`, `sdd-end-release` pasos 1 a 6; el paso 7, pendiente del dev-lead.

---

## Estimación y esfuerzo

- Tipo: release
- Esfuerzo spec + plan: 1h
- Estimación de implementación: 20h (17 de tandas en segundo plano)
- Estimación de revisión: 1h
- Estimación de cierre: 1h
- Base de la estimación: la 0311 (humo de 11 baterías) y el plan de `battery.mjs`.
- Confianza: baja

---

## 3. Validación final

- [ ] Gate de cierre: `moon run kit:test-headless cli:typecheck cli:test --affected --base develop`
- [ ] Spec satisfecha
- [ ] Cierre con `sdd-archive`; corte con `sdd-end-release` hasta el paso 6
