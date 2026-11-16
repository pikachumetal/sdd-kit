---
kit_version: 3.0.0
lane: feature
id: 20261113-184632-feature-0341-interviewer-spike
task: 0341
mode: spike
date: 2026-11-13
---

# Ticket para el kit — feature 0341: spike de la postura del entrevistador, seis brazos y una lectura que hubo que releer

## Contexto

- Carril y modo: feature, spike (perfil `delegate`, validación en campo)
- Skills del kit usadas: `sdd-explore`, `sdd-propose`, `sdd-grilling`, `sdd-roadmap`, `sdd-implement`, `sdd-implement-native`, `sdd-worktrees`, `sdd-tdd`, `sdd-verify`, `sdd-archive`, `sdd-retro`, `sdd-feedback`
- Proyecto: el repo del propio kit (skills en Markdown, CLI en TypeScript, baterías headless)
- Modelo del hilo: Opus 5.5
- Modelos de los subagentes: Sonnet 5.5 (13 lectores, segunda revisión de la spec), Fable 5.2 (primera revisión de la spec), Opus 5.5 (revisión final y re-revisión); sujetos headless Sonnet, persona Haiku
- Coste en reloj: 3,43 h frente a 8 h estimadas
- Coste en tokens: hilo 79.966.619; subagentes 15.952.014 en 17 despachos; sujetos 44,43 $ en 180

## Cómo leer este ticket

Los hallazgos son hipótesis a testear con RED/GREEN, no cambios aprobados, y van ordenados por coste observado.

## Hallazgos

### 1. Una pasada de fix sobre evidencia de batería metió un Important que solo cazó la re-revisión

- **Qué pasó**: la revisión final pidió marcar «no cargó» a los sujetos que leían el núcleo cortado con `head -80`. El hilo los buscó con un `grep` sobre la línea entera de `tools.txt` y marcó tres. En dos de ellos, el `head -80` cortaba otro fichero de la misma línea (`cat …/control-profiles.md | head -80; cat …/sdd-grilling/SKILL.md`). La re-revisión lo encontró. El arreglo invirtió una conclusión del `research.md` que ya se le había enseñado al dev-lead: si una pieza supera el umbral o no. Hubo que corregirla después de su confirmación. La raíz es que el `transcript.txt` que lee el lector corta los argumentos de cada llamada a 160 caracteres. Por eso el hilo no podía ver la lectura en el transcript y fue a `tools.txt` con un `grep` grueso.
- **Fuente**: `tests/batteries/interviewer/transcript.mjs:10` → `const ARG_MAX = 160;`; el walkthrough del spike, §3 y §4.1 («✋ sin revisar»); `research.md` §8 del spike.
- **Dónde en el kit**: `skills/sdd-verify/references/closing-the-review.md`, «Native» (cada fix se verifica por TDD o, sin test que lo reproduzca, por la suite entera); en un spike, la evidencia no tiene test ni suite que la cubra.
- **Por qué el kit no lo evitó**: para un fix sin test, la regla pide la suite entera, y la suite no mira los recuentos de una batería. Nada pide volver a sacar cada veredicto cambiado de su evidencia en bruto, con el comando exacto.
- **Coste**: una ronda más de re-revisión sobre un error que trajo la propia pasada, y una segunda explicación al dev-lead (walkthrough del spike, §3); en tokens, la revisión final y la re-revisión Opus suman 7.019.173.
- **Propuesta**: en «Native» de `closing-the-review.md`, una línea para el spike: un fix que cambia un veredicto o un recuento de la evidencia cita, por cada sujeto, la llamada exacta de `tools.txt` que lo justifica, partida por `;` y `|`. En la batería, `transcript.mjs` no corta las llamadas que leen ficheros.
- **Verificada**: sí — `grep -E '^>>> .*sdd-grilling/SKILL' <brazo>/out/p1-2.tools.txt` muestra `cat $K/sdd-grilling/SKILL.md` sin `head`, en Git Bash.
- **Criterio de aceptación**: GIVEN un hallazgo de la revisión final que pide reclasificar sujetos de un spike, WHEN el hilo hace la pasada de fix, THEN cada sujeto reclasificado lleva en el ledger la llamada literal que lo justifica, y la re-revisión no encuentra un reclasificado sin su llamada.

### 2. Un escenario partido entre dos lectores se puntuó con dos varas

- **Qué pasó**: con 30 sujetos, `fp` y `pe` fueron cada uno a dos lectores, con tres brazos por lector. En E1 de `fp`, un lector dio 15 «falla» y el otro 8. En E7 de `pe`, un lector dio «falla» a un sujeto y «pasa» a otro con la misma conducta. El hilo fijó una regla por fila y la volvió a aplicar a los 30 sujetos de cada escenario: cambiaron 6 veredictos de E1 y 3 de E7. Sin eso, la diferencia entre lectores se habría leído como diferencia entre brazos.
- **Fuente**: `readings/relectura.md` del spike; `readings/fp-a.md` y `readings/fp-b.md` en el commit `068a410`.
- **Dónde en el kit**: método de baterías (`.docs/sdd/steering/operations.md`, «Baterías por skill», del repo del kit); no hay skill que reparta lectores.
- **Por qué el kit no lo evitó**: el método da un lector por escenario y no dice qué hacer cuando un escenario necesita dos.
- **Coste**: ~30 min del hilo (sin respaldo de reloj; la relectura está en `relectura.md`).
- **Propuesta**: ya aplicada en este cierre, como una línea en «Baterías por skill»: la relectura del hilo fija una regla por fila y la aplica al escenario entero. Lo que falta es partir por sujetos, no por brazos, o dar a los dos lectores una muestra común para medir su acuerdo.
- **Verificada**: sí — `readings/relectura.md` y los recuentos de `readings/totales.md` antes y después de la regla.
- **Criterio de aceptación**: GIVEN un escenario de 30 sujetos partido entre dos lectores, WHEN los dos devuelven su tabla, THEN cada lector puntúa también 3 sujetos comunes, y una discrepancia en ellos dispara la relectura del hilo de esa fila.

### 3. La regla de compactación de `sdd-implement` no se aplicó

- **Qué pasó**: la sesión se compactó durante la Task 3, con 3 tasks sin su línea `complete`. La regla pide pasar a SDD y dejarlo en el ledger. El hilo siguió en Native y escribió la línea `Ruling: compactación` al cerrar, no al retomar.
- **Fuente**: `dist/skills/sdd-implement/SKILL.md:27`, «After a compaction in Native with two or more tasks without their `complete` line, invoke `sdd-implement-subagent`… after compaction you reread the plan and the ledger, not this skill».
- **Dónde en el kit**: `skills/sdd-implement/SKILL.md`, «Method».
- **Por qué el kit no lo evitó**: la propia regla dice que tras compactar se relee el plan y el ledger, no la skill, y la regla vive en la skill. El resumen de la compactación tampoco la trae. La regla existía y no la apliqué.
- **Coste**: sin respaldo; las Tasks 4 y 5 corrieron sobre el contexto compactado.
- **Propuesta**: que la regla viaje en el ledger, donde se relee: `sdd workspace` escribe, bajo la primera línea del ledger, «Tras una compactación con dos o más tasks sin `complete`: `sdd-implement-subagent`».
- **Verificada**: sin verificar.
- **Criterio de aceptación**: GIVEN un plan Native con 3 tasks pendientes y una compactación, WHEN el hilo retoma desde el ledger, THEN su primera acción es invocar `sdd-implement-subagent` o escribir la línea `Ruling: compactación`.

## Lo que hice por iniciativa propia

- Relanzar a los sujetos que no cargaron el núcleo apartando su primer intento a `<brazo>/no-cargo/` y usando `run --resume` con `SCENARIOS`: se conserva el intento y se relanza solo lo que falta. Funcionó (8 de 8 cargaron al segundo).
- Sustituir en las copias para los lectores la ruta de la copia del kit, que nombraba el brazo, por `<kit>`. Funcionó: el chequeo de fugas salió limpio.
- Dar en `research.md` los recuentos con dos criterios de carga (leer el `SKILL.md` entero, o solo `Skill`). Así el dev-lead ve que la conclusión no depende del criterio.

## Funcionó, no tocar

- `sdd task done` con el comando de la «Verificación» y la línea en el ledger; `battery.mjs run --resume`; `sdd merge --sync` y `--push`; `sdd session tokens`.
- La revisión final en un worktree aislado y la re-revisión única: la re-revisión encontró el error que trajo la pasada de fix.

## Menores

- `sdd-archive`, `closing-suite.md`, «What runs»: con las suites en nivel `pendiente`, la regla pide correr enteras las que el gate no corre (`cli:test-slow`, `cli:test-min`), y la regla 5 del `CLAUDE.md` de este repo las deja fuera del gate de cierre. Seguí el precedente de las últimas features (solo el gate) — `skills/sdd-archive/references/closing-suite.md`.
- La fila K de máquina de la batería nueva (`tools: /sdd-grilling/`) casa con texto que el sujeto lee y no prueba la carga; la cambia la 0342 — `tests/batteries/interviewer/battery.md`.
- Un sujeto entró por `sdd-roadmap` antes de `sdd-propose` y la puerta salió roja, aunque cargó el núcleo; se puntuó — no localizado.
- Un lector escribió y borró un script temporal propio; el encargo no lo prohibía — no localizado.
