# GREEN — la validación en `sdd-validate` (feature 0362)

Campaña de la Task 8. Sonnet salvo `a1` de `sdd-implement` (Opus, su modelo). Kit de la rama: `dist/` de `82e3f6212` para el GREEN y de `f4763ee51` para el REFACTOR, los controles y el humo. Salidas en `.docs/sdd/changes/20261124-155700-feature-0362-validation-in-implement/{green,refactor,control,smoke}/out/`.

La primera tanda del GREEN (35 sujetos, 27,7 $) se descartó: los moldes de la batería de `sdd-validate` llevaban ya la línea `Validación en campo:` en el borrador del walkthrough y la columna «Esperado» de los diez movidos seguía en `sdd-archive`. Se corrigieron y se repitió la de `sdd-validate` (32 sujetos, 24,17 $). De la primera tanda solo vale `av1`.

## GREEN con el texto de `82e3f6212`

| Escenario | Resultado | Lectura |
| --- | --- | --- |
| vf1 | 2/2 | gate, guion, ejes y mensaje de validación, en orden, sin `sdd-archive` |
| vf2 | 2/2 en vuelta y gate; `vf2-1` paró a preguntar «¿Lanzo la revisión final ahora?» | **fallo de `delegate`** → REFACTOR |
| vf3 | `vf3-1` pasa; `vf3-2` paró a preguntar «¿Arranco la task de arreglo?» | **fallo de `delegate`** → REFACTOR |
| vf4 | 2/2 | `Validación diferida:` con disparador e invoca `sdd-archive` |
| vf5 | 2/2 | un patch presenta la validación sin ejes y espera |
| vf6 | 2/2 | tras tocar `package.json` corre el gate entero (`run bookings:test rooms:test` sin `--affected`), control |
| vf7 | 2/2 | test que falla antes, paso `canceladas` y gate tras la pasada de fix, una sola revisión de su diff |
| av1 | 2/2 | devuelve a `sdd-validate` sin escribir nada, «No terminado» |
| g1 g2 g4 | 2/2 cada uno | pasos del reporte primero, ensayo del agente, nada en marcha contra el entorno |
| g3 | `g3-1` pasa; `g3-2` encontró un test que depende de otro, no presentó el guion y paró a preguntar «¿Abro la Task 3?» | **mismo paro** → REFACTOR |
| g7 | 2/2 en G7a (unitarios y gate sin filtro con `rooms:test`); G7b `g7-1` no escribe la línea literal `rooms:test: corrió <N>/<M> (sin filtro: cambia el build)` (nombra las dos suites y el motivo con otras palabras) | pasa con una nota: la línea `Gate:` es de registro y la validación no la escribe |
| v1a | 0/1: `v1a-1` pone la decisión de producto y el guion en el mismo mensaje | **la regla «decisión sola» no viajó de `sdd-archive` a `sdd-validate`** → REFACTOR |
| v1b | 1/1 con una nota: abre con una línea de estado antes del 🦆 y el ✋ | se deja |
| se1, t1, t2, t3 | pasan | forma de la plantilla, guion con rama, worktree y `env-up`, `t3` valida el agente |
| av2 | 2/2 (con el molde corregido) | devuelve a `sdd-implement` el test rojo de la rama; no lo arregla ni fusiona |

## REFACTOR (una ronda, 7 sujetos, 7,88 $)

Contraejemplos medidos: `vf2-1`, `vf3-2` y `g3-2` paran a preguntar si abren la task de arreglo o lanzan la revisión (`delegate` no admite parar ahí), y `v1a-1` junta la decisión con el guion. Cambio de texto, sin alargar ninguna skill por encima de su tope:

- `skills/sdd-validate/SKILL.md`: «goes back to `sdd-implement` without asking» y «follow its «Closing the review», without asking, before any stop»; «its tests» sustituye a «the tests that failed or are born».
- `skills/sdd-validate/references/validation-modes.md`: «A decision the final review left to the user is asked alone, in its own turn, before the validation.», la regla que tenía `sdd-archive` y se perdió al moverla.

Resultado con el kit de `f4763ee51`: `vf2` 2/2, `vf3` 2/2, `g3` 2/2 (entorno arriba) y `v1a` 1/1 (pregunta la decisión sola). Los dos `vf2` terminan pidiendo datos al dev-lead tras la pasada de fix, que es una parada de validación, no el paro anterior. Topes: `sdd-validate` queda en 655/1735, `word-budget.test.ts` y `skills.test.ts` en verde.

## Controles (N = 2, kit de `f4763ee51`)

| Batería | Escenarios | Resultado |
| --- | --- | --- |
| `sdd-implement` | h1 h2 g1 a1 | 2/2 cada uno; `h1` y `h2` presentan la validación, `g1` y `a1` paran con sus opciones, como pide su rúbrica |
| `sdd-archive` | a3 a3r a3a a5 | 2/2 cada uno; `a3`, `a3a` y `a5` fusionan; `a3r` para en el rojo y espera la decisión (su esperado no cambia) |

La conducta fina de los controles se leyó solo en el mensaje final de cada sujeto (la puerta de `battery.mjs` es verde en los ocho escenarios).

## Humo (N = 1, un escenario por skill editada)

`sdd-verify` f1, `sdd-implement-native` sp1, `sdd-implement-subagent` r1, `sdd-propose` a1, `sdd-templates` p2 (el de «TP Plantillas» de `sdd-propose`): puerta verde en los cinco; ninguna regresión visible en el mensaje final.

## Coste

Campaña medida por `battery.mjs` (RED, GREEN con `av2`, REFACTOR, controles y humo): 64,65 $ en 80 sujetos, de ellos 17,91 $ de RED. A eso se suman los 27,7 $ de la primera tanda descartada: ~92,4 $ en total frente a los ~86 $ de la previsión y el techo de 90 $ (el aviso al dev-lead va en el mensaje de cierre). Sujetos medidos: 80 de 118 permitidos.
