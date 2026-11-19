---
id: 20261119-080717-patch-0346-ci-checkout-v5
task: 0346
title: Patch — el CI usa actions/checkout@v5, sin el aviso de Node 20
type: patch
solution: dev-lead
status: done
created: 2026-11-19
branch: patch/0346-ci-checkout-v5
commit: <hash>
---

# Patch 0346 — el CI usa actions/checkout@v5, sin el aviso de Node 20

Validación: dev-lead — `validation.mode: field` en `sdd-kit.json`: la valida el uso en los runs de `ci.yml` de las próximas ramas.

## Capacidades

- Ninguna, porque ninguna capacidad describe el workflow de CI del repo (`.github/workflows/ci.yml`): es una herramienta del repo, no del kit que se instala.

## 1. Síntoma

Fila 0346 del roadmap: el run de `ci.yml` avisa «Node.js 20 is deprecated. The following actions target Node.js 20 but are being forced to run on Node.js 24: actions/checkout@v4» (run 43957982630 de `develop`, 2026-11-16).

Reproducido sobre la base de hoy: el run 44426894204 de `develop` (`ff00f38`, `success`) trae la anotación `warning: Node.js 20 is deprecated. The following actions target Node.js 20 but are being forced to run on Node.js 24: actions/checkout@v4. For more information see: https://github.blog/changelog/2025-09-19-deprecation-of-node-20-on-github-actions-runners/` (`gh api repos/{owner}/{repo}/check-runs/<job>/annotations`).

## 2. Solución fijada

Fila 0346 (dev-lead, 2026-11-16, durante el corte de la 3.0.0) y la petición de la sesión: «Subir `ci.yml:14` a `actions/checkout@v5`, comprobando antes en su changelog que su runtime es Node 24 y que `fetch-depth: 0` sigue igual». Lo que da por existente existe: `ci.yml:14` es `- uses: actions/checkout@v4` con `fetch-depth: 0`.

Comprobado antes del cambio, en el repo de `actions/checkout`:

- `CHANGELOG.md`, `v5.0.0`: «Update actions checkout to use node 24» (PR 2226), único cambio de la versión; su release pide runner ≥ v2.327.1, que `ubuntu-latest` cumple. El tag flotante `v5` apunta hoy a `v5.1.0` (`fbc6f39`), que añade la limpieza de `v5.0.1` y `allow-unsafe-pr-checkout` (abajo).
- `gh api repos/actions/checkout/compare/v4...v5`: `action.yml` pasa de `using: node20` a `using: node24`; la entrada `fetch-depth` («Number of commits to fetch. 0 indicates all history for all branches and tags.», `default: 1`) no cambia, y ningún fichero de `src/` del diff toca `fetchDepth`.
- Lo demás que trae el tag `v5` no toca este workflow: `allow-unsafe-pr-checkout` solo bloquea el checkout de PR de forks en `pull_request_target` y `workflow_run` (`ci.yml` corre en `push`), y la limpieza de credenciales al estilo v6 (`v5.0.1`, PR 2301) solo actúa si un `checkout@v6` ya dejó su configuración en la misma ruta.

## 3. Fix

- **Fichero(s)**: `.github/workflows/ci.yml`
- **Cambio**: la línea 14 pasa de `actions/checkout@v4` a `actions/checkout@v5`; `fetch-depth: 0` sigue igual.
- **Decisiones**:
  - `actions/checkout@v5`, no la última mayor (`v7`) — dev-lead (fila 0346 y petición de la sesión)
  - `moonrepo/setup-toolchain@v0` y el Node de la suite (22.18.0 de `proto install`) no se tocan — dev-lead (petición de la sesión, «Fuera de alcance»)

## 4. Verificación

Ningún test del repo lee el `ci.yml` real: las fixtures de `tests/batteries/sdd-archive/subject.mjs` y `tests/batteries/sdd-init/subject.mjs` con `actions/checkout@v4` son moldes sintéticos de los sujetos y no entran. La prueba es el run de `ci.yml` de la rama.

| # | Caso | Resultado |
| --- | --- | --- |
| 1 | run de `ci.yml` de `develop` antes del cambio (RED) | run 44426894204 (`ff00f38`): `success` con la anotación «Node.js 20 is deprecated… actions/checkout@v4» |

Revisor (sonnet, effort medium), sin Críticos ni Importantes:

- Menor, §2 cita `v5.0.0` y `@v5` resuelve a `v5.1.0` — arreglado: §2 nombra `v5.1.0` y lo que añade.
- Menor, `ci.yml:14` usa un tag flotante — rechazado: ya flotaba con `@v4`, como `moonrepo/setup-toolchain@v0`; fijarlo a un sha es otro cambio que nadie pidió.

## 5. Tiempo (ligero)

- Estimación: 0,25 h + 0,07 h del gate de cierre (4 min, patch 0286)
- Inicio: 2026-11-19T08:07Z
