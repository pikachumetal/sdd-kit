---
id: 20261022-083957-feature-0209-worktree-temp
feature: 0209
title: Walkthrough — Temporales por worktree
spec: ./spec.md
plan: ./plan.md
status: done
created: 2026-10-22
---

# Walkthrough — Temporales por worktree

## 1. Cambios realizados

- **Apertura** (`e0f9a84d`): spec aprobada y plan de tres tasks en Native.
- **Task 1 — los tests del repo en `.temp/`** (`c36b7093`):
  - `.temp/` en `.gitignore`;
  - `cli/vitest.config.ts` con el `globalSetup` de `cli/test/temp-setup.ts`: carpeta por ejecución `.temp/vitest-<aleatorio>` en `TEMP` y `TMP`, `GIT_CEILING_DIRECTORIES` en `.temp/`, borrado al acabar con 5 reintentos y barrido de las de más de 24 h;
  - `tests/Invoke-KitTests.ps1` fija lo mismo para los Pester, sin borrado por test.
- **Task 2 — sesiones y sujetos** (`fc94ace7`):
  - `Start-KitSession.ps1` fija y restaura `CLAUDE_CODE_TMPDIR` en `.temp/`;
  - `lib.sh` y `run.sh` aceptan `RUNS_DIR` en el scratchpad o en `.temp/`;
  - un `trap EXIT` de `subject_init` borra el molde de cada sujeto (salvo `KEEP_MOLD=1`) y su carpeta de Claude Code, y deja el stream.
- **Task 3 — la init y la migración** (`a5dca117`):
  - `INIT_IGNORES` gana `.temp/`;
  - `operations-template.md` gana «Temporales» en `## Testing`;
  - la fila «How it is tested» de `sdd-init` lo propone sin editar la config;
  - la v3.0.0 hace lo mismo con o sin E2E y añade `.temp/` al `.gitignore` en el paso del marcador;
  - filas T3 y V14 en las baterías; topes de palabras.
- **Pasada de fix de la revisión final**, juntada en el cierre:
  - la enmienda (valor por defecto del runner);
  - `.gitignore` en la Verificación de la v3.0.0;
  - la carrera del barrido;
  - el test del prefijo de `.temp/`;
  - la persona aislada;
  - `tech-stack.md`;
  - `Battery.Tests.ps1` con `KEEP_MOLD=1`, que el gate de cierre destapó.
- Evidencia: [tests/temp-dir-red.md](../../../../tests/temp-dir-red.md) y [tests/temp-dir-green.md](../../../../tests/temp-dir-green.md).

## 2. Tiempo y coste: estimado vs real

- Tipo: infra/tooling
- Estimación de implementación (del plan): 4h
- Esfuerzo real: 2,9 h — aproximado. `sdd session tokens` da 10,62 h (reloj de la sesión 12,78 h desde 2026-10-21T21:30Z, sin 129 min de espera al dev-lead en 15 esperas), porque cuenta como trabajo la noche entre la interrupción del 2026-10-21 y «puedes seguir» del 2026-10-22. Aproximado con la marca de la carpeta de la spec (08:39Z) y los commits: ~0,2 h la noche anterior y ~2,7 h el 2026-10-22, de 08:00Z al cierre.
- Desviación: −1,1 h (−28 %)
- Causa de la desviación: dentro de ±30 %. Las tasks 1 y 2 fueron cortas y se escribieron mientras corría la línea base; la campaña de sujetos corrió en segundo plano.
- Compactación: no
- Modelo del hilo: Opus 5.5, effort no registrado (toda la feature)
- Tokens del hilo: 76.517.314 — claude-opus-5-5 76.517.314
- Tokens de subagentes: 5.068.093 en 5 despachos — Re-review final 0209 claude-opus-5-5 848.746 / 2 min; Final review — Code axis claude-sonnet-5-5 587.930 / 2 min; Spec review técnica 0209 claude-sonnet-5-5 291.055 / 1 min; Final review — Spec axis claude-opus-5-5 2.974.694 / 6 min; Spec review dominio 0209 claude-opus-5-5 365.668 / 1 min
- Coste de la sesión: 28,16 $ (hilo 23,64 $ + subagentes 4,51 $)
- Coste de sujetos: 5,03 $ en 17 sujetos — sonda Haiku 0,01 $; 16 Sonnet 5,02 $: RED 0,78 $; GREEN 1,16 $; REFACTOR 1,24 $; REFACTOR 2 0,77 $; final 1,07 $
- Review de spec: 2 revisores (dominio Opus, técnica Sonnet, pedidos por el dev-lead) · hallazgos 20, aceptados 18

## 3. Desviaciones del plan

- **La Task 2 pone el borrado en un `trap EXIT` de `lib.sh`**, no en `run.sh`, que no conoce el molde ni la etiqueta de cada sujeto.
- **Pester fija su entorno en `Invoke-KitTests.ps1`**, la caída que preveía la decisión 2 de la spec.
- **RED de sujetos con 2 y no con 4**, y dos vueltas de REFACTOR en vez de una: la segunda la aprobó el dev-lead («Sí, una vuelta más (Recomendada)»).
- **Enmienda de la spec** en la revisión final (el valor por defecto del runner), aprobada: «Apruebo la enmienda (Recomendada)».
- **El gate de cierre destapó `Battery.Tests.ps1`**, un test lento que leía el molde tras la campaña: `KEEP_MOLD=1`, en un commit posterior a la re-revisión.

### Decisiones tomadas sin el dev-lead

Los rulings del ledger, en `tasks.md` (`## Rulings`), con su coste si están mal. Los que cambian algo que se ve:

- La regla del nombre de la carpeta de Claude Code de cada sujeto sale de 59 carpetas de campañas previas (ruta Windows del molde con lo no alfanumérico a «-»), no de la sonda, porque un sujeto sin herramientas no la crea — coste: la carpeta se queda sin aviso si la regla cambia.
- Pester comparte `.temp/` sin barrido (decisión 2 de la spec) — coste: restos en el clon principal, que no se borra.
- La guarda de `RUNS_DIR` sigue en `run.sh` y en `lib.sh` — coste: tocar dos líneas si cambia.
- Los dos Minor de la re-revisión (una línea densa en `subject_init`, un regex poco legible en `temp-dir.test.ts`) se quedan — coste: lectura.

## 4. Verificación

### 4.1 Builds

- Línea base al arrancar (`moon run kit:test cli:typecheck cli:test cli:test-slow cli:test-min`): kit 1354/1354, cli 1124/1124, slow 295/295, min 1422/1422 (slow y min ya con `cli/vitest.config.ts`), 10 min 15 s; `sdd-*` en `%TEMP%`: 1034 antes y después.
- Primer gate de cierre, tras la pasada de fix: rojo en `kit:test`, 1361/1362 (`Battery.Tests.ps1`, el molde borrado); arreglado con `KEEP_MOLD=1`, juntado en el cierre.
- Suite completa: `moon run kit:test cli:typecheck cli:test cli:test-slow cli:test-min` → kit 1362/1362, cli 1127/1127, slow 295/295, min 1422/1422 · 5 min 16 s · configuración: la del gate, con la carpeta por ejecución de Vitest y el entorno de `Invoke-KitTests.ps1` · sobre el código del commit de cierre (desde entonces solo cambian docs). `sdd-*` en `%TEMP%`: 1034 antes y después; `.temp/` sin `vitest-*` al acabar.

### 4.2 Smoke / tests

- Validación en campo: 2026-10-22 · gate de cierre en verde sobre el código del commit de cierre · revisión final Spec y Código sobre `a5dca117`, pasada de fix con enmienda aprobada y re-revisión (15 resueltos, 2 Minor adjudicados), juntadas en el cierre; 1 sin revisar (`KEEP_MOLD=1` en `Battery.Tests.ps1`, juntado en el cierre) · 16 sujetos Sonnet y una sonda Haiku · 12 de 15 THEN con `ejecución real` o `suite`, 3 `no probado`

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| cli · `--finish`: `.gitignore` gana `.temp/` con CRLF, idempotente | suite (`verbs.test.ts`, `gitignore.test.ts`) | pasa |
| onboarding · `.gitignore` con `.temp/` una sola vez | suite (`gitignore.test.ts`) | pasa |
| onboarding · `## Testing` pide dónde deja cada suite sus temporales | suite (`AnchorTemplates.Tests.ps1`, trece campos) | pasa |
| onboarding · con `playwright.config.ts` sin `outputDir`, `e2e` · `test-results/` · propuesta `.temp/playwright`, sin editar config ni añadir filas | ejecución real (`n6` ×2 del REFACTOR 2, `n3` final: «no tocaría ninguna config ni añadiría filas al roadmap») | pasa |
| onboarding · suite sin sitio → `no declarado` | ejecución real (`n3` y `v1` finales: `vitest` · no declarado) | pasa |
| migration · sin E2E, `## Testing` tal cual salvo «Temporales» | ejecución real (`v1` del REFACTOR 2 y final) | pasa |
| migration · `.gitignore` gana `.temp/` una sola vez | ejecución real (`v3` y `v1`: `.gitignore` creado con `.temp/` en el commit del marcador) | pasa |
| migration · «Temporales» con Playwright | ejecución real (`v3` final) | pasa |
| migration · `.temp/` ya en `.gitignore` → lo dice y no duplica | ningún molde lo trae | no probado |
| migration · con el «no», solo el sitio | sin sujeto: el «no» no se mide en headless | no probado |
| migration · sin el dev-lead, nada cambia | texto: el paso 7 solo corre con los gates resueltos | no probado |
| Intent · el gate no deja `sdd-*` nuevas en `%TEMP%` ni `vitest-*` en `.temp/` | ejecución real (cuentas antes y después del gate: 1034 → 1034; 0 `vitest-*`) | pasa |
| Intent · una campaña no deja moldes ni carpetas de Claude en `C:` | ejecución real (16 sujetos con `CLAUDE_CODE_TMPDIR` en `.temp/`: `.temp/runs/*/` sin moldes; `.temp/claude/` vacía) | pasa |
| Intent · `git worktree remove` sin `--force` con `.temp/` ignorada | ejecución real (repo de prueba en el scratchpad, exit 0) | pasa |
| Sesión · `Start-KitSession.ps1` fija y restaura `CLAUDE_CODE_TMPDIR` | suite (`TempDir.Tests.ps1`); el scratchpad en `.temp/` de una sesión real, en campo | pasa (suite) |

### 4.3 Residuales / deuda generada

- `sdd session tokens` cuenta una noche de interrupción como trabajo (10,62 h frente a ~2,9 h) → fila de deuda.
- La batería de `sdd-init`: `n6` de un turno para en la pregunta de flujos core antes del borrador, y T3 no se observa sin `TURN2` → fila de deuda.
- Los tres AND de la migración sin sujeto (ya estaba, el «no», sin dev-lead) → los cubre el texto; sin fila.

## 5. Aprendizajes

- Una regla «lo que no está en la config sale `no declarado`» se lee literal aunque el runner tenga un valor por defecto: 0 de 3 sujetos usaron `test-results/` hasta que el texto lo nombró → texto de `sdd-init` y de la plantilla (la regla vive donde se aplica; `architecture.md` y `tech-stack.md` están en su tope).
- `CLAUDE_CODE_TMPDIR` se ignora en los settings de proyecto: se fija en el entorno antes de lanzar `claude` → comentario de `Start-KitSession.ps1` y prompt de `Select-Claude` para el repo de PowerShell del dev-lead.
- Un escenario de un turno que para en una pregunta antes del punto medido se arregla con `TURN2`, como ya dice `tech-stack.md` («Si un escenario de un turno se queda antes del punto que mide, se arregla la petición») → aplicado; la batería, a deuda.

## 6. Adendas
