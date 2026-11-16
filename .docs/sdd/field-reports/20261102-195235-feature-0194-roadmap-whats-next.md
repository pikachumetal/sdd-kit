---
kit_version: 2.3.4
lane: feature
id: 20261102-195235-feature-0194-roadmap-whats-next
task: 0194
mode: full
date: 2026-11-02
---

# Ticket para el kit — feature 0194: entrada «qué sigue» de `sdd-roadmap`

## Contexto

- Carril y modo: feature full
- Skills del kit usadas: `sdd-propose`, `sdd-grilling`, `sdd-implement`, `sdd-worktrees`, `sdd-tdd`, `sdd-verify`, `sdd-archive`, `sdd-retro`, `sdd-feedback`
- Proyecto: el propio kit, un repo de skills y CLI en Node
- Modelo del hilo: Opus 5.5
- Modelos de los subagentes: Opus 5.5 y Sonnet 5.5 en la revisión; sujetos Sonnet
- Coste en reloj: 1,54 h frente a 2 h estimadas
- Coste en tokens: 15.604.448 del hilo y 3.551.073 de subagentes; 12,75 $ de sesión y 23,76 $ de sujetos

## Cómo leer este ticket

Los hallazgos son hipótesis a testear con RED/GREEN, no cambios aprobados, y van ordenados por coste observado.

## Hallazgos

### 1. Di al dev-lead cifras de puerta como si fueran de conducta, y decidió sobre ellas

- **Qué pasó**: presenté `m2` 1/2 y 3/6 y `c2` frente a «`develop` 2/2», contando la puerta en `m2` y las filas de la deuda en `c2`, sin aplicar la rúbrica. Por fila, `m2` daba 1/6 frente a 1/2 y `c2` en `develop`, 1/2. El dev-lead eligió sobre esas cifras, y lo cazó el eje Spec. Tuve que parar otra vez.
- **Fuente**: `.docs/sdd/specs/20261102-163922-feature-0194-roadmap-whats-next/walkthrough.md`, §4.2; `spec.md`, «Enmiendas».
- **Dónde en el kit**: `tests/headless/battery.mjs`, `verdict`; `tests/batteries/sdd-roadmap/battery.md`, filas M2 y C2 de la rúbrica; `skills/sdd-verify/SKILL.md`, «The Iron Law».
- **Por qué el kit no lo evitó**: la regla existía y no la apliqué bien: `verdict` dice `puerta verde · sin leer: M2`, y yo convertí la tanda en una cifra. Con filas en prosa, nada obliga a dar la cifra por fila, y el A/B lo calificas tú a mano.
- **Coste**: 2 paradas del dev-lead y 6 sujetos más de lo previsto (walkthrough, §2).
- **Propuesta**: pasar a máquina lo que se pueda de M2 (`file:` o `tools:`, como pide la feature 0273), y que el mensaje de `verdict` no lleve una cifra `n/m` sola cuando quedan filas sin leer: `puerta 3/6 · conducta sin leer`.
- **Verificada**: sin verificar.
- **Criterio de aceptación**: GIVEN un escenario con fila en prosa WHEN `battery.mjs verdict` da su línea THEN la cifra se lee como de puerta, sin poder confundirse con la del escenario.

### 2. El umbral 2/2 de `m2` falla sin ningún cambio del kit

- **Qué pasó**: con el kit de `develop`, `m2` da 4/6 en la puerta y 3/6 en conducta, y `m3` 1/2. `r1`, con casi la misma petición, tiene umbral 2/4 por acertar ~70 %. Un rojo de `m2` no dice nada de la edición, pero pide A/B: cuando la batería de `sdd-roadmap` es criterio de hecho, no se puede cumplir.
- **Fuente**: `tests/batteries/sdd-roadmap/battery.md`, tabla de escenarios; `tests/batteries/using-sdd/battery.md`, fila `r1`; carpetas `base`, `base2`, `base3` de la spec.
- **Dónde en el kit**: `tests/batteries/sdd-roadmap/battery.md`, fila `m2`.
- **Por qué el kit no lo evitó**: el umbral viene de un n = 2 de la feature 0161, y su propia nota dice que el enrutado varía sin cambio del kit.
- **Coste**: ~4 $ en sujetos de A/B (`more1`, `more2`, `base2`, `base3`).
- **Propuesta**: separar puerta y conducta en `m2`: que la petición nombre el verbo de planificar, para que mida el cierre, y dejar el enrutado a `r1`.
- **Verificada**: sí — medido con `BATTERY=sdd-roadmap STEPS=closing` y `KIT_DIR` de `develop`.
- **Criterio de aceptación**: GIVEN el kit de `develop` sin cambios WHEN corre `m2` con n = 6 THEN la puerta llega a su umbral.

### 3. `m2` puede haber bajado en conducta con esta feature, sin causa encontrada

- **Qué pasó**: entre los sujetos que entran por `sdd-roadmap`, dan prompt al cerrar 1 de 3 en la rama y 3 de 4 en `develop`. La regla del paso 7 no cambió, y los revisores no ven mecanismo. Con este n no se distingue del azar.
- **Fuente**: carpetas `ctl`, `more1`, `more2`, `base`, `base2` y `base3` de la spec, `m2-*.texts.txt`.
- **Dónde en el kit**: `skills/sdd-roadmap/SKILL.md`, paso 7 del checklist.
- **Por qué el kit no lo evitó**: se midió la puerta como criterio de cierre, no esta conducta.
- **Coste**: sin coste todavía; riesgo abierto.
- **Propuesta**: medir `M2` con n ≥ 8 en los dos kits al cortar la release.
- **Verificada**: sin verificar.
- **Criterio de aceptación**: GIVEN `m2` en los dos kits WHEN se lee la fila M2 con n ≥ 8 THEN la rama no da menos prompts que `develop`.

## Lo que hice por iniciativa propia

- Molde con rama abierta tras `initRepo` y copia temporal de la batería con n = 1 para el control de la pasada de fix: costó 0,44 $ frente a 1,3 $ de la tanda entera. Funcionó, pero `tests/batteries/tmp-*` no tiene soporte; `n` por variable lo evitaría.

## Funcionó, no tocar

- El RED antes de la spec: destapó que «qué sigue» entraba por `sdd-explore` y movió `using-sdd` al Scope.
- Leer los controles a mano cazó que «blocked» de la entrada nueva hacía negar un prompt pedido por id (`m1`), con la puerta verde.
- El eje Spec recontó la rúbrica y cazó mis cifras.

## Menores

- `RUNS_DIR=D:/r/0194` rechazado con `RUNS_DIR fuera del scratchpad o de .temp/`, pese al remedio de ruta corta del triaje de la 0276 — `tests/headless/lib.mjs`.
- `task done` de una task de control no tiene una «Verificación» que salga con 0 si hay rojos aceptados: lo registré con un comando vacío — `skills/sdd-implement/SKILL.md`, paso 4 del bucle Native.
- El resultado del eje Código llegó cortado y hubo que pedirlo otra vez al mismo agente — no localizado.
- `sdd review package` de la re-revisión mete la evidencia de la spec, 61 KB — `skills/sdd-verify/references/encargo-revision.md`.
