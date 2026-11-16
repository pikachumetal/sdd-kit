---
id: 20261109-143437-feature-0311-includes-and-checks
feature: 0311
title: Walkthrough — Una sola fuente por regla en las skills, y las comprobaciones del corte en el pre-commit y la CI
spec: ./spec.md
plan: ./plan.md
status: done
created: 2026-11-09
---

# Walkthrough — Una sola fuente por regla en las skills, y las comprobaciones del corte en el pre-commit y la CI

## 1. Cambios realizados

- **La inclusión en una copia** (Task 1, `a22bf5d`): `tests/copies/annotated.ts` lee `<!-- kit: incluye <nombre> -->` dentro de un bloque `add` o `sustituye` como una línea del bloque; fuera de un bloque da «una inclusión en una copia va dentro de un bloque del kit», y dentro de una valla, el aviso del build. `kit:own` deja de rechazar las inclusiones en copias y su aviso de frase repetida pide releer los pasos antes de quitar una copia (`tests/own/repeated.ts`). `kit:skill-size` mide la fuente con `renderLines` y, como `kit:own`, pierde `deps: ['~:build']` en `moon.yml`.
- **Una sola fuente por regla** (Task 2, `914f190`): catorce ficheros de `includes/` y cinco salidas (filas 12, 13, 14, 16 y 18 de la spec); la definición de desvío, una sola (`includes/deviation.md`), con el revisor de la enmienda.
- **Los encargos de los ejes en inglés** (Task 3, `4347fee`): `## Code constraints` y `## How to review` en los seis encargos y en `encargo-revision.md`, y las filas `h2` y `f1` de las baterías.
- **El aprendizaje contra el tope de la base** (Task 4, `81a9b5e`): la frase de «A destination at its word cap» de `learnings.md`, la condición subida al paso de aprendizajes de `sdd-archive`, y el escenario `c2` con su molde `reservas-cap-base`.
- **La frase de idioma y las comprobaciones** (Task 5, `4f80215`): `includes/user-language.md` en las 15 skills que `kit:own` marcaba; `.githooks/pre-commit` corre `kit:own` y `kit:skill-size` siempre y `kit:copies` si el commit toca `skills/`, `includes/` o `upstream.json`; `.github/workflows/ci.yml` clona las fuentes y corre las tres; sale `kitBudget` (enmienda aprobada); `tech-stack.md`, `CLAUDE.md`, `architecture.md` y la fila 0152 al día. Lleva también la ronda de REFACTOR de `k3`.
- `node tests/own/check.ts` → `Skills al día: 127 ficheros.`; `grep -rn "Restricciones de código" skills/` → sin salida.

## 2. Tiempo y coste: estimado vs real

- Tipo: infra/tooling
- Estimación de implementación (del plan): 7h
- Esfuerzo real: 2,57 h — reloj de la sesión 6,38 h desde 2026-11-09T14:22Z, sin 229 min de espera al dev-lead (9 esperas)
- Desviación: −4,43 h (−63 %)
- Causa de la desviación: las esperas de `Esperas y huecos` (14:41Z 26 min; 15:18Z 1 min; 15:53Z 1 min; 15:54Z 1 min; 15:56Z 3 min; 16:06Z 19 min; 16:24Z 58 min; 17:23Z 120 min; 19:24Z 1 min) se descuentan como espera al dev-lead, y las de 16:24Z y 17:23Z fueron sobre todo tandas de sujetos y el humo colgado tras `sdd-verify` (~3 h, un `find /` huérfano de un sujeto); la estimación contaba ese tiempo de máquina como trabajo
- Compactación: no
- Modelo del hilo: Opus 5.5, effort no registrado
- Tokens del hilo: 188.366.573 — claude-opus-5-5 188.366.573
- Tokens de subagentes: 37.203.403 en 7 despachos — Leer filas en prosa del humo 0311 claude-sonnet-5-5 13.191.080 / 39 min; Revisor de spec 0311 dominio claude-opus-5-5 1.099.840 / 2 min; Revisión final 0311 — eje Código claude-sonnet-5-5 6.199.896 / 6 min; Revisor de spec 0311 técnica claude-sonnet-5-5 153.493 / 2 min; Re-revisión única de la 0311 claude-opus-5-5 2.606.425 / 4 min; Revisión final 0311 — eje Spec claude-opus-5-5 13.646.594 / 8 min; Segunda ronda de review spec 0311 claude-sonnet-5-5 306.075 / 2 min
- Coste de la sesión: 70,77 $ (hilo 55,67 $ + subagentes 15,10 $)
- Coste de sujetos: 27,25 $ en 59 sujetos sonnet — `c2` RED, GREEN y REFACTOR; humo de 11 baterías; controles con `develop`; segunda medida; REFACTOR de `k3` (previsto: 30,49 $)
- Review de spec: 2 revisores y segunda ronda de 1 · hallazgos 30, aceptados 26 (3 en parte)

## 3. Desviaciones del plan

- **Enmienda del 2026-11-09**: sale `kitBudget` de `word-budget.test.ts`, aprobada por el dev-lead tras parar por desvío (el kit medía 103.511 con el tope en 103.372: una inclusión no ahorra palabras y la frase de idioma suma 257). Al cierre, el kit mide 103.527 palabras frente a 103.338 en `develop` (+189), y los topes de las 17 skills tocadas y de `tech-stack.md` y `architecture.md` quedan en su medida exacta.
- La fila 0198 no cambia: su migración solo toca `.docs/`, y el pre-commit nuevo solo pide `SDD_UPSTREAM_DIR` a los commits que tocan `skills/`, `includes/` o `upstream.json`.

### Decisiones tomadas sin el dev-lead

- El castellano de `implementer-prompt.md` fuera de las piezas de la decisión 6 («## Tests RED», «## Verificación», «Reglas del implementador») no se traduce — la spec enumera las piezas y el criterio es el `grep` de «Restricciones de código» — si es un error, queda castellano en un encargo, que el Art. III tolera hasta reescribirlo.
- Fixtures de dos tests de `copies.test.ts` sin la línea en blanco extra tras la inclusión — con ella salía además «texto que no es del original», un artefacto de la fixture — si es un error, una inclusión fuera de bloque seguida de línea en blanco da dos avisos.
- Sin caso nuevo en `dist.test.ts` — el build expande igual una inclusión en una copia que en una propia — si es un error, falta un test que fije la expansión en una copia.
- Relectura de las cinco salidas: cada paso que pierde la frase sigue llegando a su regla (`sdd-verify` «Final review» y Finish de `sdd-implement-native`; la plantilla de la re-revisión; `plan-writing.md`; el paso 1 de `sdd-implement`; §Scope brakes) — si es un error, un paso deja de llegar a su regla.
- `visual-evidence` toma la redacción corta y remite a §5 de `frontend-verification.md` — si es un error, en `pair` la presentación de una task con verificación visual pierde algún dato.
- Las rachas que cruzaban el borde de una inclusión se resolvieron cambiando la primera palabra de la línea propia que sigue — si es un error, ninguno.
- El aparcamiento de `unattended` se queda solo en `control-profiles.md` — `sdd-implement` no lo decía — si es un error, un hilo que solo sigue `sdd-implement` no aparca. (La pasada de fix lo devolvió a la inclusión: hallazgo I2 del eje Spec.)
- `compose-axis.mjs` no se toca: su literal en castellano lo busca en el kit antiguo — si es un error, ninguno.
- La fixture de `hooks.slow.test.ts` gana `own`, `skill-size` y `copies` como `noop` — si es un error, ninguno.
- Commit de la Task 5 antes del humo — la prueba del pre-commit usa el hook commiteado — si es un error, el commit de la task se reparte en dos hasta el squash.
- Fila 0198 del roadmap sin cambios: su migración solo toca `.docs/` (decisión 11).
- Rulings de la revisión final: las copias conservan sus marcas `0312` y `4597d47e` (el texto cambiado es del kit, dentro de bloques que ya existían; `kit:copies` en verde); `kit:dist-compare` da «líneas con otra forma» en `patch-flow.md` y `sdd-roadmap`, que son las líneas incluidas como continuación del mismo paso; el AND de `archive` sobre el merge de sincronización no lo ejerce `c2`, cuyo molde no lo tiene (Tope4 cubre el commit del cierre); `CLAUDE.md` repite «una vez por máquina, `setx SDD_UPSTREAM_DIR`» porque la decisión 12 deja la regla 5 como estaba; los fixtures de `sdd-verify` sin la clave de «Flujos core…» o de «ruta de research.md…» ya estaban así en la base.

## 4. Verificación

### 4.1 Builds

- Gate: `moon run kit:test-headless cli:typecheck cli:test --affected --base develop` → kit:test-headless: corrió 469/469 · cli:typecheck: corrió · cli:test: corrió 2383/2395 (12 saltados) · 115 s · configuración: la del gate · sobre el commit de cierre
- Orden de corte (`CLAUDE.md`, regla 5): `node cli/bin/sdd.js lock run -- moon run kit:build kit:skill-size kit:own kit:copies cli:test-slow cli:test-min` → kit:skill-size OK · kit:own `Skills al día: 127 ficheros.` · kit:copies `Copias al día: 31 ficheros.` · cli:test-slow 554/554 · cli:test-min 2937/2949 (12 saltados) · 12 min 16 s · sobre el commit de cierre
- Pre-commit real del commit de la Task 5: `kit:own`, `kit:skill-size` y `kit:copies` en verde.

### 4.2 Smoke / tests

- Validación en campo: 2026-11-09 · gate 469 + 2383 · orden de corte en verde · smoke 9/9 THEN con ejecución real o suite · humo de 11 baterías (34 sujetos) contra control con `develop`: sin rojos nuevos atribuibles a la rama tras la segunda medida y el REFACTOR de `k3`; `pt1`, `u1`, `h1`, `h2`, `c1` de `sdd-verify`, `n1` de `sdd-init` y `d1` fallan también con `develop`; F1-C (`f1` de `sdd-propose`) y M5 (`m5`) fallan 2/2 con la rama sin cambio en el texto que los gobierna (sin atribuir, al ticket) · revisión final Spec y Código sobre la Task 5 y `tasks.md`, re-revisión limpia

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| `kit-distribution` · el build expande una inclusión | suite | `dist.test.ts`, también dentro del bloque de una copia |
| `kit-distribution` · una copia incluye dentro de un bloque del kit; fuera de bloque y en valla, rojo | ejecución real | las cinco copias con `user-language` dan `Copias al día: 31 ficheros.`; bordes en `copies.test.ts` |
| `kit-distribution` · frase repetida, con el aviso nuevo | ejecución real | commit de prueba parado con «… repiten «this exact test sentence repeats ten words in two skills»: déjala en un solo sitio, en includes/ si la necesitan varias skills; antes de quitar una copia…» |
| `kit-distribution` · lo que dice `kit:own`, sin reconstruir `dist/` | ejecución real | `Skills al día: 127 ficheros.` con `moon.yml` sin `deps` |
| `kit-distribution` · `kit:skill-size` mide la fuente | ejecución real | las dos líneas `OK:`; caso con inclusión en `skill-size.test.ts` |
| `kit-distribution` · `kit:copies` en el pre-commit y la CI, y sin `SDD_UPSTREAM_DIR` | ejecución real | parado con «Falta SDD_UPSTREAM_DIR…» en un commit que toca `skills/` o `upstream.json`; uno de `.docs/` entra; clon sin el tag: «superpowers: falta v7.0.2 en el clon …»; la CI, en el run de la rama |
| `verification` · los encargos de los ejes llevan «Code constraints» y «How to review» | ejecución real | los encargos de esta revisión final y de la re-revisión; `grep -rn "Restricciones de código" skills/` sin salida |
| `feature-flow` · el encargo del implementador lleva el decálogo tras «Code constraints» | ejecución real | fila S de `h2` en el humo |
| `archive` · el aprendizaje se mide contra el tope de la base | ejecución real | `c2`: RED 0/2 (19 y 17 palabras con el tope de `develop` en 12), GREEN 1/2, REFACTOR 2/2 (12 de 12) |

### 4.3 Residuales / deuda generada

- Al ticket: `pt1` despacha un revisor en un patch también con `develop`; `u1` no deja la enmienda escrita ni pasa por revisor también con `develop`; el aviso del workspace del plan (`h1`, `h2`) y `git add -A` (`h1`); F1-C y M5 fallan 2/2 con la rama sin texto que los gobierne cambiado; un sujeto de `sdd-verify` dejó huérfano un `find /` que colgó `tail` en la tanda ~3 h; `texts.txt` mezcla los mensajes de los subagentes con los del sujeto; fixtures de `sdd-verify` sin dos claves.

## 5. Aprendizajes

ADR: una copia admite inclusiones dentro de un bloque del kit → decisions/0026-copies-include-inside-kit-blocks.md

- Una inclusión no ahorra palabras: `word-budget.test.ts` cuenta `dist/`, con la inclusión copiada en cada skill que la usa → `tech-stack.md`, «Contenido y build» (sale la medida de los cuelgues con cuatro worktrees, que vive en el ticket de la 0210 §1); medido contra el tope de `origin/develop`, 23.169 de 23.181
- Una regla que solo vive en una referencia no se lee (`c2`, GREEN 1/2): segundo caso del aprendizaje de la feature 0146 que ya está en `tech-stack.md`, «Baterías por skill»; no cambia
- Una tanda con `| tail` se cuelga si un sujeto deja un proceso huérfano con su salida, y `texts.txt` mezcla los mensajes de los subagentes → ticket del kit (herramientas de las baterías)

Retro: error que cazaría un chequeo → `compose-axis.mjs` y `compose.mjs` fallan si el encargo sale con un hueco sin rellenar, en vez de dejarlo en silencio (tests/batteries/sdd-verify/compose-axis.mjs, tests/batteries/sdd-implement/compose.mjs)
