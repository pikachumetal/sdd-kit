---
id: 20261009-082930-feature-0162-validation-panel-spike
feature: 0162
title: Walkthrough — Spike: panel de validación inyectado con Claude in Chrome
spec: ./spec.md
plan: ./plan.md
status: done
created: 2026-10-09
---

# Walkthrough — Spike: panel de validación inyectado con Claude in Chrome

## 1. Cambios realizados

- **Spike, sin código del kit**: `probe/panel.js` (panel desechable que guarda su estado y su propio código en `localStorage`), tres ficheros de evidencia en `probe/evidence/` y `research.md` con el resultado de O1-O5, cuatro opciones (A medida; B, C y D sobre el papel), la recomendación, el plan B y la lista para Mac. Commits `4d76fa1b` (apertura), `73a98975` (evidencia), `2b36eeb6` (research), `2c377bfa` (O1 a mano y O4) y `fe666d49` (pasada de fix).
- **App de las medidas**: Vite + React desechable en el scratchpad de la sesión, fuera del repo (enmienda de la spec).
- **Respuesta**: sí, Claude in Chrome sustituye el copia y pega de los resultados (O1 y O2), pero no adjunta el contexto completo del KO (O3: red sin hora, captura del momento de leer), y el panel desaparece en cada recarga completa (2 veces en una prueba de 3 pasos con el dev-lead), con un aviso y un turno para recuperarlo. Plan B: la página servida por la CLI `sdd`. Opcional: un spike de la opción D (Playwright con navegador visible que maneja el dev).
- **Pasada de fix** `fe666d49`: estados de O1, O3, O4 y O5 ajustados a lo medido, Review Focus declarado, cuarta regla para la consola, app mínima versionada en `probe/app/` para la lista de Mac y `saveChanges` en `panel.js`.

## 2. Tiempo y coste: estimado vs real

- Tipo: docs
- Estimación de implementación (del plan): 2h
- Esfuerzo real: 1,3h — reloj del hilo, aproximado con los commits (apertura 10:35, pasada de fix 11:45) más el cierre; el dev-lead estuvo ausente ~1 h y el hilo siguió midiendo
- Desviación: -0,7h (-35 %)
- Causa de la desviación: la app de las medidas la levantó Claude en minutos, y O1-O3 se midieron sin esperar al dev-lead; la estimación contaba con esperar sus pruebas
- Modelo del hilo: Opus 5.5, effort no registrado
- Tokens del hilo: 17.098.216 — claude-opus-5-5 17.098.216
- Tokens de subagentes: 353.633 en 1 despacho — Revisión final spike 0162 claude-opus-5-5 353.633 / 3 min
- Coste de la sesión: 8,00 $ (hilo 7,26 $ + subagentes 0,74 $)
- Coste de sujetos: no aplica
- Review de spec: no · hallazgos 0, aceptados 0

## 3. Desviaciones del plan

- La app de las medidas no fue la Angular del dev-lead, sino una Vite + React desechable que levantó Claude (enmienda de la spec, aprobada por el dev-lead).
- O1 y O3 se midieron primero con clics de Claude, con el dev-lead ausente, y O1 se repitió después a mano con él.
- `panel.js` ganó dos cambios que el plan no preveía: guarda su propio código para reinyectarlo con una línea, y guarda el comentario en `input`.

### Decisiones tomadas sin el dev-lead

- Opción D (Playwright con navegador visible) añadida al research sobre el papel y fuera de la recomendación — la spec pedía dos alternativas y D responde a los fallos medidos de A — coste si está mal: una opción de más que leer.
- Reinyección desde `localStorage` en lugar de reenviar el script entero — baja el coste de cada recuperación de ~1,5k tokens a una línea — coste si está mal: ninguno para el spike; en una CSP por cabecera no probada, `eval` podría fallar.
- Revisión de skills: `.claude/skills/` del repo (`skill-creator`, `writing-for-agents`, `writing-skills`) mirada; el spike no las toca — no aplica.
- Sin entrada en el changelog: el spike no cambia nada del kit (ninguna categoría de Keep a Changelog aplica) — coste si está mal: una línea que falta.

## 4. Verificación

### 4.1 Builds

- `node --check probe/panel.js` → sin salida (OK).
- `node cli/bin/sdd.js roadmap check --path .docs/sdd` → `Roadmap válido`.
- Suite completa: el pre-commit corrió `kit:roadmap`, `kit:test-fast`, `cli:typecheck` y `cli:test` en cada commit → `Tests Passed: 955, Failed: 0` (Pester) y `711 passed` (Vitest) · ~25 s.

### 4.2 Smoke / tests

- Validación en campo: 2026-10-09 · O1-O5 con ejecución real en Chrome 155 (O1 y O4 con el dev-lead probando a mano) · revisión final opus con hallazgos sobre 2c377bf (1 Critical, 8 Important, 1 Minor), aplicados en la pasada de fix fe666d4 · pre-commit 955 Pester + 711 Vitest en verde

| Objetivo | Evidencia | Resultado |
| --- | --- | --- |
| O1 — inyectar y leer sin copiar | ejecución real, con el dev-lead | cumple, salvo el comentario a mano (el KO del dev-lead llegó sin comentario) |
| O2 — 10 recargas y redirección | ejecución real | cumple con reinyección: estado 10/10 y tras el login |
| O3 — KO con captura, consola y red | ejecución real | no cumple: red sin hora y captura del momento de leer |
| O4 — espera sin tokens | ejecución real, `/cost` del dev-lead | no cumple tal como se definió: 2,5 min, no ≥ 5; 0 peticiones sin un mensaje del dev |
| O5 — Orca en Windows | ejecución real | cumple en conexión (Chrome 155); versión de la extensión no medida; Mac en lista |

### 4.3 Residuales / deuda generada

- Spike opcional de la opción D → fila B15 del backlog.
- Las cuatro reglas para la validación con Claude in Chrome → fila B14 del backlog, para la feature de la 3.0.0 que escriba la validación manual.
- No medidos: CSP por cabecera HTTP, redirección a otro origen (SSO externo), política de Chrome de la empresa y Mac.

## 5. Aprendizajes

- Para la validación manual de la 3.0.0: armar `read_network_requests` al inyectar, reinyectar desde `localStorage` y decir que la captura es la del momento de leer → `research.md` §3 y fila B14 del backlog (no hay skill de validación con Claude in Chrome que tocar todavía).
- Un puerto de desarrollo en Windows puede caer en un rango reservado (`EACCES`), y el error no lo dice → `research.md` §4 y fila B14 del backlog, como aviso para la guía de entornos de los proyectos.

## 6. Adendas
