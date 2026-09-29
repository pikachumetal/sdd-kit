# RED — el cierre fuera del camino crítico (feature 0096)

Pasos 6 y 7 de `sdd-start-feature` y pasos 0-12 de `sdd-end-feature`, con el kit de `develop` en `94dc27f` (la rama en `0eca803` solo añade la spec). Lanzador de referencia (`tests/headless/run.sh`) con [`red/subject.sh`](../.docs/sdd/specs/20260929-133151-feature-0096-closing-off-critical-path/red/subject.sh). Sujetos Sonnet headless aislados (`SUPERPOWERS_DIR`, superpowers 6.4.2), 2026-09-29. Salidas en [`red/out/`](../.docs/sdd/specs/20260929-133151-feature-0096-closing-off-critical-path/red/out/).

Moldes: `c1` sobre `pedidos` de la 0099, con el hook [`deny-agent.mjs`](../.docs/sdd/specs/20260927-145355-feature-0085-post-final-review/red/deny-agent.mjs) de la 0085, que deniega `Agent` y guarda el encargo. `c2` y `c3` sobre `salas` de la 0085/0091, con [`clean-review.mjs`](../.docs/sdd/specs/20260929-133151-feature-0096-closing-off-critical-path/red/clean-review.mjs), que guarda el encargo y responde con un veredicto limpio.

## c1 — La última task, que cambia la UI, commiteada con su verificación visual pendiente

Feature 0015 en Native y perfil delegate. Tasks 1 y 2 completas en el ledger, la Task 3 commiteada y sin su verificación visual. Petición: seguir hasta presentar la validación.

Criterios: (a) el revisor final se despacha antes de arrancar la aplicación; (b) el encargo ancla el revisor en el sha (worktree desanclado o sin commits posteriores); (c) escribe borradores de cierre antes de presentar.

| Sujeto | (a) | (b) | (c) |
| --- | --- | --- | --- |
| [c1-1](../.docs/sdd/specs/20260929-133151-feature-0096-closing-off-critical-path/red/out/c1-1.tools.txt) | ❌ `node server.mjs` y cuatro scripts de Playwright (l. 208-303), `Agent` en la l. 418 | ❌ [encargo](../.docs/sdd/specs/20260929-133151-feature-0096-closing-off-critical-path/red/out/c1-1/agent-prompts.txt) sin sha ni worktree; la rama avanzó dos commits más | ❌ «No he cerrado nada: no hay walkthrough» |
| [c1-2](../.docs/sdd/specs/20260929-133151-feature-0096-closing-off-critical-path/red/out/c1-2.tools.txt) | ❌ `node server.mjs` en la l. 133, `Agent` en la l. 262 | ❌ [encargo](../.docs/sdd/specs/20260929-133151-feature-0096-closing-off-critical-path/red/out/c1-2/agent-prompts.txt) sin sha ni worktree; la rama avanzó dos commits tras el despacho | ❌ sin borradores |

**c1 falla 0/2 en los tres criterios.** Es el orden del ticket de la feature 0001 §1: el paso 7 pone la revisión «con la implementación terminada», y los dos sujetos entienden la verificación visual como parte de la implementación. Los dos siguieron commiteando después del despacho (un test y el registro de la Task 3): un revisor en segundo plano sobre el árbol del hilo habría visto esos commits, que es el caso del ticket 0027 §2.

Ruido del molde: la Task 3 de la 0015 no trae test, y los dos sujetos lo añadieron en un commit propio. No cambia ningún criterio.

## c2 — Feature validada; el dev-lead pide cambiar el texto de un error antes de cerrar

Criterios: (a) re-revisión del tramo antes del walkthrough (control); (b) el walkthrough y el mensaje final separan el cambio posterior de lo que probó el dev-lead; (c) no se niega ni lo trata como «second fix pass».

| Sujeto | (a) | (b) | (c) |
| --- | --- | --- | --- |
| [c2-1](../.docs/sdd/specs/20260929-133151-feature-0096-closing-off-critical-path/red/out/c2-1.texts.txt) | ✅ `Agent` «Re-revisión mensaje franja 0012» antes del walkthrough | ✅ [walkthrough](../.docs/sdd/specs/20260929-133151-feature-0096-closing-off-critical-path/red/out/c2-1/walkthrough.md): «Lo probó con el mensaje anterior; el mensaje nuevo lo verifica la suite, no lo ha probado él»; mensaje final: «El mensaje nuevo solo lo verifica la suite» | ✅ |
| [c2-2](../.docs/sdd/specs/20260929-133151-feature-0096-closing-off-critical-path/red/out/c2-2.texts.txt) | ✅ | ✅ [walkthrough](../.docs/sdd/specs/20260929-133151-feature-0096-closing-off-critical-path/red/out/c2-2/walkthrough.md): «El mensaje nuevo, que pidió después, lo verifico yo (`ejecución real`) y no lo ha probado él»; mensaje final: «Tú probaste el mensaje antiguo, no el nuevo» | ✅ |

**c2 pasa 2/2: el baseline no exhibe el fallo.** Origen de la conducta: el paso 1 de `sdd-end-feature` («distingue siempre **verificado por ti** […] de **reportado por el usuario**»), que los dos sujetos leen al escribir la verificación. No es una fuente incidental: está en el paso que siempre se ejecuta. Por el Art. I, la guía de «cambiado después de tu prueba» no se escribe.

Descartado: `c2-1-descartado`, primera versión con el hook que deniega `Agent`. El sujeto paró antes del walkthrough por no tener revisor y no midió (b). Se relanzó con `clean-review.mjs`.

Hallazgo lateral: c2-1 **no juntó el cierre**, porque «el walkthrough cita `0d6a3e3` y juntarlos lo habría dejado sin hash». Es la tensión de c3 vista desde el walkthrough: la regla del hito y la del hash chocan también fuera de `tasks.md`.

## c3 — Pasada de fix y re-revisión apuntadas con shas del tramo que el cierre junta

Criterio: (a) tras el commit de cierre, todo sha de `tasks.md` cumple `git merge-base --is-ancestor <sha> HEAD`.

| Sujeto | (a) |
| --- | --- |
| [c3-1](../.docs/sdd/specs/20260929-133151-feature-0096-closing-off-critical-path/red/out/c3-1.state.txt) | ❌ 4 shas no alcanzables (`590bbad`, `3e7cb77` y dos más en una nota); añade «esos hashes ya no existen en la rama» |
| [c3-2](../.docs/sdd/specs/20260929-133151-feature-0096-closing-off-critical-path/red/out/c3-2.state.txt) | ❌ `922be6b` y `82cf298` no alcanzables; nota «dejan de existir como commits sueltos» |

**c3 falla 0/2.** Los dos ven el problema y lo anotan, pero dejan los shas. Es el tercer caso de la fila de deuda: `commit-milestones.md` (fila «Cierre») y el último revisado de los pasos 7 y 9 son buenas reglas por separado y nadie las cruza.

## c4 — Un commit del hilo mientras revisa el revisor final, y después su pasada de fix (tras la revisión final)

Hallazgo Important de la revisión final de rama: con el revisor en segundo plano, un commit del hilo hecho mientras revisa, seguido de una pasada de fix, podría quedar sin revisar si la cadena del último revisado salta a la pasada. Enmienda aprobada el 2026-09-29 con medición. Molde `salas`: revisión final `Needs fixes` sobre el commit de la última task, un commit de código del hilo entre medias y la pasada apuntada. Petición: seguir con el paso 7.

Criterio: (a) la re-revisión cubre el tramo desde el `sobre` de la revisión final, no desde la pasada.

| Sujeto | (a) |
| --- | --- |
| [c4-1-confundido](../.docs/sdd/specs/20260929-133151-feature-0096-closing-off-critical-path/red/out/c4-1-confundido.texts.txt) | — el commit del molde cambiaba la salida («Falta la sala»), saltó el freno de alcance y el sujeto paró por eso; descartado |
| [c4-2](../.docs/sdd/specs/20260929-133151-feature-0096-closing-off-critical-path/red/out/c4-2.state.txt) | ✅ `Re-revisión: 370c4e3..cd09083`, desde el `sobre`; la petición nombraba el commit intermedio |
| [c4-3](../.docs/sdd/specs/20260929-133151-feature-0096-closing-off-critical-path/red/out/c4-3.state.txt) | ✅ `Re-revisión: 8a32df7..f07df42`, desde el `sobre`, con la petición realista: «Entre la revisión final (`sobre 8a32df7`) y la pasada de fix hay un commit de código del hilo, `64ea3cf`, que ningún revisor había visto» |

**c4 pasa 2/2: el baseline no exhibe el fallo.** Origen: el sujeto lee `git log` y aplica «todo commit del hilo entra en la revisión» del paso 6, que siempre se lee. La excepción en la cadena no se escribe (Art. I). Sí se corrigen las tres frases que mandaban ese commit a «la revisión final», ya anclada antes (paso 6, `control-profiles.md`, `overrides-superpowers.md`).

Coste de c4 en el RED: 3 sujetos, 1,09 $ (0,32 descartado + 0,37 + 0,40). Techo subido a 17 sujetos por el dev-lead.

## Coste

7 sujetos, 4,10 $ (c1: 1,08 + 0,61; c2: 0,42 descartado + 0,62 + 0,54; c3: 0,38 + 0,45). Previsión: 12 sujetos y ~24 $ para RED y GREEN; techo de 15 sujetos y 35 $.
