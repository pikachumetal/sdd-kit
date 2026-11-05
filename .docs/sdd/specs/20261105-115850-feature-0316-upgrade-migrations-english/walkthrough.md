---
id: 20261105-115850-feature-0316-upgrade-migrations-english
feature: 0316
title: Walkthrough — Las migraciones de sdd-upgrade en inglés
spec: ./spec.md
plan: ./plan.md
status: done
created: 2026-11-05
---

# Walkthrough — Las migraciones de sdd-upgrade en inglés

## 1. Cambios realizados

- **Literales de forma y migraciones cortas** (`af186c9f`): `**Escribe**:` → `**Writes**:` y `## Verificación` → `## Verification` en las 13 migraciones y en el fixture `tests/batteries/sdd-upgrade/v2.3.5.md`; v0.2.0, v0.4.0, v1.0.0, v1.1.0 y las seis de solo marcador (v2.1.0 a v2.3.4) en inglés; la nota «No es una capacidad» de la v1.0.0, en un bloque `markdown` sangrado dentro del paso 1. `skills/sdd-upgrade/SKILL.md` (líneas 16, 19, 24, 26 y 38): «Verification», `**Writes**:` y «no gate». Art. V de la constitution: «no changes to the project» y `**Writes**:`. Tests: `migration-init-parity.test.ts` y la verificación de la v2.0.0 en `check.test.ts`.
- **v2.0.0 y v2.3.0** (`e6acaa75`): en inglés; el paso 1 de la v2.3.0 conserva su nombre en castellano entre «…», porque lo citan `sdd-roadmap`, `sdd-archive` y la capacidad `roadmap`. `check.test.ts` busca los pasos 6 y 7 por «Capability history» y «Capability purpose» y comprueba `/no gate/i`, `/skip the step/i` y `/pending/i`.
- **v3.0.0** (`73c4b25e`): en inglés; las secciones y columnas de `debt.md` y `ROADMAP.md`, entre «…»; las dos parejas de líneas del paso 6, de tabla a bloques `text`. `operations-gate-fields.test.ts` busca «The steps go in this order».
- **Pasada de fix de la revisión final** (juntada en el cierre): en la v3.0.0, «skip the step and say so» en las seis frases de paso saltado y «Backlog» entre comillas; en la v1.0.0, «Tipo» y «Restricciones globales» en castellano y la verificación con el «solo» de la fuente («no file other than `legacy.md` and …»); en la v1.1.0, `legado.md`.
- `capabilities/migration.md`: el delta de la spec, fusionado con `sdd capability merge` (9 requisitos y 2 reglas).

## 2. Tiempo y coste: estimado vs real

- Tipo: docs
- Estimación de implementación (del plan): 2,5 h
- Esfuerzo real: 0,88 h — reloj de la sesión 1,48 h desde 2026-11-05T11:51Z, sin 36 min de espera al dev-lead (3 esperas)
- Desviación: −1,62 h (−65 %)
- Causa de la desviación: Esperas y huecos: 12:02Z 30 min; 12:32Z 0 min; 12:40Z 6 min, fuera del real; el resto es la estimación, hecha por volumen de texto (~55 KB), cuando la traducción frase a frase fue más rápida
- Compactación: no
- Modelo del hilo: Opus 5.5, effort no registrado
- Tokens del hilo: 45.132.759 — claude-opus-5-5 45.132.759
- Tokens de subagentes: 5.990.353 en 4 despachos — Re-revisión final de la 0316 claude-opus-5-5 246.969 / 1 min; Final review — Spec axis claude-opus-5-5 2.111.528 / 4 min; Revisión adversarial spec 0316 claude-opus-5-5 2.436.158 / 4 min; Final review — Code axis claude-sonnet-5-5 1.195.698 / 2 min
- Coste de la sesión: 19,94 $ (hilo 15,77 $ + subagentes 4,17 $)
- Coste de sujetos: 1,39 $ en 3 sujetos sonnet — humo GREEN de `sdd-upgrade` (`m1` ×1, `v1` ×2) 1,39 $
- Review de spec: 1 revisor (siete puntos, Opus, a petición del dev-lead) · hallazgos 9, aceptados 9

## 3. Desviaciones del plan

- La traducción literal de tres frases chocaba con las comprobaciones de `kit:own` (absoluta con excepción, y castellano dentro de código con doble comilla invertida); se reescribieron con el mismo sentido. El paso 6 de la v3.0.0 pasa de tabla a bloques `text`.
- El humo corrió `v1` con la n de su batería (2), no con la n = 1 de la spec: 3 sujetos en vez de 2.

### Decisiones tomadas sin el dev-lead

- Task 1: la verificación de la v1.0.0 se reescribió sin «only … except», que `kit:own` da como absoluta con excepción; la sustituyó el fix de la revisión final («no file other than `legacy.md` and the capabilities that tasks created later»), que recupera el «solo» — coste si está mal: una frase de una verificación vieja.
- Task 3: el paso 6 de la v3.0.0 pasa de tabla a cuatro bloques `text`, con el mismo texto y «with the rest of the line the same», porque la tabla daba dos falsos positivos de castellano en `kit:own` (castellano dentro de código con doble comilla invertida) y la heurística está fuera de alcance — coste si está mal: la forma del paso 6.
- Task 3: «Datos», `pendiente` «salvo que el dev-lead lo diga» pasa a «if the dev-lead doesn't say it», no a «unless», porque la celda ya lleva «only» — coste si está mal: una celda.
- Task 3: el humo corrió `v1` con n = 2 (3 sujetos, 1,39 $), por encima de la fila GREEN (1,1 $) y dentro del tope de 2,2 $; no se repitió tras el fix, que solo cambia literales que `v1` no lee — coste si está mal: 0,55 $ de más.
- Revisión final: Now, Next, Later y §Testing se quedan sin «…»: son nombres en inglés de la plantilla, iguales en los dos idiomas — coste si está mal: comillas en 6 sitios.
- Revisión final: `not.toContain('**Writes**:')` de `migration-init-parity` se queda así: ninguna init lleva esa etiqueta, y si una la llevara el test fallaría en voz alta — coste si está mal: un rojo falso en una init futura.
- Revisión final: el fixture `v2.3.5.md` se queda mixto (decisión 4 de la spec), y las rúbricas de `sdd-upgrade` (V6) y `sdd-archive` siguen citando los literales viejos: es prosa de las baterías, y el molde de `sdd-archive` lleva su propia línea `**Escribe**` — coste si está mal: una rúbrica describe un literal que ya no existe.
- Revisión final: `/pending/i` de `check.test.ts` queda tan laxo como el `/pendiente/i` de antes — coste si está mal: nada nuevo.

## 4. Verificación

### 4.1 Builds

- Por task y tras la pasada de fix: `moon run kit:build` → exit 0 · `moon run cli:test` → `Tests  2210 passed | 12 skipped (2222)` · `moon run kit:own` → 0 líneas de `dist/skills/sdd-upgrade/references/migrations/` (antes de la feature: 277).
- `moon run kit:skill-size`: no marca `sdd-upgrade`; sus rojos (`sdd-archive`, `sdd-implement`, `sdd-propose`, `sdd-roadmap`) son anteriores a esta rama.
- Línea base, en un worktree desligado de `16e7a235`: `moon run kit:test-headless cli:typecheck cli:test` → kit:test-headless: corrió 399/399 · cli:typecheck: verde · cli:test: corrió 2210/2222.
- Gate de cierre: corre en el paso 6 del cierre, sobre la base integrada (la rama 0315 está abierta y `develop` va por delante); su línea `Gate:` va en el mensaje final.

### 4.2 Smoke / tests

- Validación en campo: 2026-11-05 · `cli:test` 2210/2222 en cada task y tras el fix · `kit:own` sin líneas en `migrations/` · humo de `sdd-upgrade` `m1` 1/1 y `v1` 2/2, puerta verde y rúbrica leída por el hilo · revisión final Spec y Código sobre `73c4b25e`, re-revisión limpia de la pasada de fix

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| Cada release lleva su migración: «no changes to the project», su «Verification» y su línea `**Writes**:` | suite (`migration-init-parity.test.ts`) + `grep` de las seis de solo marcador | ✅ |
| Una migración sin cambios solo avanza el marcador, con `sdd upgrade --mark` y su commit | ejecución real (`m1`: `--mark 2.3.4`, `chore(sdd): migrar al kit v2.3.4`, `git status` limpio) | ✅ |
| Un proyecto ya inicializado se migra: `sdd upgrade --root`, cada versión con su «Verification», marcador y commit | ejecución real (`m1` y `v1`) | ✅ |
| Lo que escribe una migración va en su línea `**Writes**:`, y lo recibe la init | suite (`migration-init-parity.test.ts`) | ✅ |
| La v2.0.0 añade el propósito sin gate; su `**Writes**:` sin tokens nuevos, con «Also…» | suite (`check.test.ts`, `migration-init-parity.test.ts`) | ✅ (la conducta del paso: no probado, sin molde 1.1.0) |
| La v2.3.0 declara `roadmap.md`, `validation.mode` y el marcador en `**Writes**:` | suite (`migration-init-parity.test.ts`) | ✅ (la conducta del paso: no probado, sin molde 2.2.0) |
| Un paso sin marca que borra pregunta antes; uno marcado «no gate» corre sin preguntar | no probado (`m2` fuera del humo; `SKILL.md` solo cambia el literal) | — |
| La v3.0.0 cambia los nombres de las skills retiradas, y su «Verification» no devuelve nada | ejecución real (`v1`, V7: `sdd-archive`, `/sdd-explore`) | ✅ |
| La v3.0.0 deja el hook del proyecto una sola vez, y `**Writes**:` lo nombra | ejecución real (`v1`: `sdd-kit-loaded.mjs` una vez en `hooks.UserPromptSubmit`) + suite | ✅ |
| Ninguna línea de castellano de `kit:own` en `migrations/` | ejecución real (`moon run kit:own`) | ✅ |

Rúbrica de `v1` (V1-V4, V6-V10), leída en `green/out/v1-*.state.txt` y `texts.txt`: `Roadmap válido`, `Capacidades válidas: 1`, los documentos en su sitio, cada fila de deuda en su sección con las celdas en castellano («Por triar», «En espera», «Lista», «Descartadas»), el Tamaño pedido y no deducido, la estimación con «Cuenta desde el arranque…», `(post hoc)` y la nota 0016, y la tabla de reglas en castellano, con la regla de los ids quitada.

### 4.3 Residuales / deuda generada

- Las demás `references/` en castellano siguen en sus filas: 0305, 0306, 0296 y 0307.

## 5. Aprendizajes

- Al traducir una skill, una frase literal con «solo … salvo …» da el rojo «absoluta con excepción» de `kit:own`; se escribe «no X other than Y», que conserva el «solo». Y el castellano dentro de código con doble comilla invertida da un falso positivo de prosa en castellano → `tech-stack.md`, §Herramientas del repo

Retro: documento o skill desmentido → ticket del kit: `tests/batteries/sdd-upgrade/battery.md` describe el kit con `v2.3.4.md` como mayor migración, y su fila M1 falla si cambia otro fichero que `sdd-kit.json`; con la v3.0.0 en el kit, `m1` aplica también la v3.0.0 (la spec lo puntuó con su decisión 7 y no tocó la rúbrica)
Retro: error que cazaría un chequeo → ticket del kit: `kit:own` no quita el código con doble comilla invertida (` `` … `` `) y da prosa en castellano dentro de él; la tabla del paso 6 de la v3.0.0 tuvo que pasar a bloques `text`

## 6. Adendas
