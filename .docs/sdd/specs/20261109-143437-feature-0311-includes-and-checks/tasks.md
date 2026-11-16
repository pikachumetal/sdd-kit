---
id: 20261109-143437-feature-0311-includes-and-checks
title: Tasks — Una sola fuente por regla en las skills, y las comprobaciones del corte en el pre-commit y la CI
spec: ./spec.md
plan: ./plan.md
created: 2026-11-09
---

# Tasks — Una sola fuente por regla en las skills, y las comprobaciones del corte en el pre-commit y la CI (registro vivo)

- **Spec**: `./spec.md`
- **Plan**: `./plan.md`
- **Rama**: `feature/0311-includes-and-checks`

## Estado de las tasks

| # | Task | Status | Commit | Notas |
| --- | --- | --- | --- | --- |
| 1 | Una copia admite una inclusión dentro de un bloque del kit, y `kit:skill-size` lee la fuente | done | a22bf5d | |
| 2 | Las reglas repetidas, en una sola fuente (filas 2 a 21) | done | 914f190 | |
| 3 | Las secciones fijas del encargo de los ejes, en inglés | done | 4347fee | |
| 4 | El aprendizaje se mide contra el tope de la base (si el RED lo exhibe) | done | 81a9b5e | c2: RED 0/2, GREEN 1/2, REFACTOR 2/2 |
| 5 | La frase de idioma, las comprobaciones en el pre-commit y la CI, y el humo | done | 4f80215 | enmienda 2026-11-09: sale `kitBudget`; humo de 11 baterías, control con `develop` y REFACTOR de `k3` |

## Verificación por task

- [x] Task 1 — los comandos de su campo «Verificación» del plan
- [x] Task 2 — los comandos de su campo «Verificación» del plan
- [x] Task 3 — los comandos de su campo «Verificación» del plan
- [x] Task 4 — los comandos de su campo «Verificación» del plan
- [x] Task 5 — los comandos de su campo «Verificación» del plan

Revisión final: Spec opus+high, con arreglos (3 Important, 6 Minor), 5 sin verificar · Código sonnet+high, con arreglos (1 Important, 5 Minor) · Arquitectura no (plan), sobre 4f80215 y `tasks.md` juntado en el cierre
Pasada de fix: juntada en el cierre, 13 hallazgos RED→GREEN
Re-revisión: juntada en el cierre, sdd-kit:effort-high + opus, limpia (1 Minor nuevo adjudicado)

## Rulings

- Ruling: el resto de castellano de `implementer-prompt.md` fuera de las piezas que lista la decisión 6 de la spec («## Tests RED», «## Verificación», «Reglas del implementador») no se traduce en esta feature — la spec enumera las piezas y el criterio de hecho es el `grep` de «Restricciones de código» — si es un error, queda castellano en un encargo que la regla de la constitution (Art. III) ya tolera hasta reescribirlo.
- Task 1: Ruling: fixtures de «reports an include after the blank line…» y «…outside any block» sin la línea en blanco extra tras la inclusión — con ella, la línea en blanco sobrante daba además «texto que no es del original», un artefacto de la fixture y no del aviso; las aserciones no cambian — si es un error, una inclusión fuera de bloque seguida de línea en blanco da dos avisos en vez de uno.
- Task 1: Ruling: sin caso nuevo en dist.test.ts — el build expande una inclusión igual en una copia que en una propia (renderLines no distingue), ya cubierto por el test de inclusión de la 0304; un test nuevo pasaría sin RED — si es un error, falta un test que fije la expansión en una copia.
- Task 2: Ruling: relectura de las salidas — fila 12: la regla de cuándo sale la revisión la aplican «Final review» de sdd-verify (los dos métodos) y Finish de sdd-implement-native, antes de leer encargo-revision.md, que se abre al componer el encargo; fila 13: el hilo rellena re-review-prompt.md con él abierto, y su primer párrafo dice cómo; fila 14: la línea Ejecución la escribe plan-writing.md antes de sdd-implement, y el cambio de método tras compactar es una regla fija; fila 16: el paso 1 de «Before each task» corre antes de cada task y ahora lleva la excepción de los tres registros; fila 18: §Scope brakes va justo debajo de la tabla — si es un error, un paso deja de llegar a su regla y lo mide el humo de la Task 5.
- Task 2: Ruling: visual-evidence toma la redacción corta de validation-modes.md (remite a §5 de frontend-verification.md), y sdd-implement «In pair» deja de enumerar criterio, detector, medidas y capturas, que §5 lista — decisión 16 de la spec (la más corta que conserva cada condición); ninguna batería mide esa lista — si es un error, en pair la presentación de una task con Verificación visual pierde algún dato de §5.
- Task 2: Ruling: las inclusiones que dejaban una racha cruzando su borde (base-red-debt + «Then», last-reviewed-sha + «A Revisión final») se resolvieron cambiando la primera palabra de la línea propia que sigue — si es un error, ninguno: el texto dice lo mismo.
- Task 2: Ruling: el park de unattended («⏸️ aparcada») se queda solo en control-profiles §Deviation y no en la inclusión — sdd-implement no lo decía; decisión 16 — si es un error, un hilo en unattended que sigue solo sdd-implement no aparca.
- Task 3: Ruling: tests/batteries/sdd-verify/compose-axis.mjs no se toca — su «tras «Cómo revisar» va esta sección» lo busca legacyBrief() en el encargo-revision.md de un kit antiguo (sdd-start-feature, en castellano), y cambiarlo rompería los moldes heredados; el «grep … tests/batteries/» del plan esperaba vacío por error — si es un error, ninguno: el kit nuevo no pasa por legacyBrief.
- Task 5: Ruling: la fixture de cli/test/kit/hooks.slow.test.ts gana las tareas own, skill-size y copies como noop — su repo de prueba solo tenía roadmap y el hook nuevo las pide — si es un error, ninguno: el test mide el entorno de git del hook, no las tareas.
- Task 5: Ruling: commit de la Task 5 antes del humo — la prueba del pre-commit (Step 3) usa el hook commiteado; una ronda de REFACTOR del humo va en su propio commit, que se junta al cierre — si es un error, el commit de la task se reparte en dos hasta el squash.
- Final: Ruling: Spec M1 — kit:dist-compare da «líneas con otra forma» en patch-flow.md y sdd-roadmap: son las líneas incluidas, continuación perezosa del mismo paso en dist/ (patch-flow.md:14-16, sdd-roadmap:58-59) — si es un error, un paso se parte en dos al renderizar
- Final: Ruling: Código m3 — las copias conservan sus marcas 0312 y 4597d47e: el texto cambiado es del kit, dentro de bloques que ya existían, y kit:copies da Copias al día — si es un error, la procedencia del cambio no se ve en la marca
- Final: Ruling: Código m5 — los topes bajan a su medida exacta en el cierre (sdd-archive) — si es un error, quedan topes con margen
- Final: Ruling: el AND de archive «ni el commit del merge de sincronización se salta el hook» no lo ejerce c2: su molde no tiene merge de sincronización; Tope4 cubre el commit del cierre — si es un error, un --no-verify en el merge de sincronización pasaría sin verse en la batería
- Final: Ruling: Declined (Código) — que cada inclusión conserve las condiciones, la fórmula de topes, citas en capacidades y tech-stack, la frase de learnings.md, comentarios del check de skill-size: los cubren el eje Spec, la spec y el cierre — si es un error, ninguno nuevo
- Final: Ruling: Declined (Spec) — ADR 0025 en la ronda de c2, marcas de copias, la condición del tope en el paso 3 y en learnings.md (misma skill), «It goes before the script.», el saldo +173 (enmienda), rojos del humo ya contrastados — si es un error, ninguno nuevo
- Final: Ruling: no verificado (Spec) — CI de la rama, orden de corte en verde, topes exactos, ADR candidata y delta: los hace el cierre (sdd-archive, regla 7 de CLAUDE.md) antes del merge — si es un error, el merge espera a ellos
- Final: Ruling: el setx repetido en CLAUDE.md se queda — la decisión 12 deja la regla 5 como estaba salvo kit:copies (M4), y la línea de core.hooksPath es la de la decisión 5 — si es un error, la misma instrucción vive en dos sitios del fichero
- Final: Ruling: fixtures de sdd-verify sin la clave de «Flujos core…» (f3, rm, sv1, eje code) y de «ruta de research.md…» (f4, f5, f6, f6b, eje spec): ya pasaba en la base 3b8502cf, no es de esta rama — va al ticket — si es un error, esos escenarios siguen con un hueco literal en su encargo
