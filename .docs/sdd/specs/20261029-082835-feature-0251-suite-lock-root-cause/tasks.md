# Tasks — feature 0251

| Task | Estado | Commit |
| --- | --- | --- |
| 1 — `sdd merge --verify` sin el cerrojo de merge | ✅ | `14825b47` |
| 2 — `cli:test` con la mitad de los workers y `mergiraf.test.ts` a lento | ✅ | `7ffcf529` |
| 3 — La medida de la 0240 y el cerrojo de suites | ✅ | `fe3a985b` |

Revisión final: Spec opus+high, with fixes · Código sonnet+high, with fixes · Arquitectura no (plan), sobre fe3a985b
Pasada de fix: juntada en el cierre, 1 hallazgo RED→GREEN (el contraste sin base sacable), 5 huecos de cobertura cubiertos con tests que ya pasaban, 4 MODIFIED de coherencia en el delta (enmienda sin aprobar) y 7 Minor; `test/merge` + `kit/word-budget` + `kit/skills` 392/392
Re-revisión: fe3a985b..cierre (la pasada de fix, juntada en el cierre), sdd-kit:effort-high + opus, todos los Critical e Important arreglados; 6 Minor adjudicados (Rulings)

## Línea base

Worktree desanclado en `a215b9a9` (commit de apertura). Gate sin `--affected`, con el cerrojo: `node cli/bin/sdd.js lock run -- moon run kit:test-headless cli:typecheck cli:test` → verde en 86 s (`cli:test` 1625/1625 en 12,60 s; `kit:test-headless` 227/227 en 81,07 s). `npx vitest run test/merge --test-timeout 120000` → 188/189 en 249 s: `cleanup.slow.test.ts` › «un id en dos secciones del roadmap lleva el aviso de roadmap check» con `error: unable to write file .git/objects/df/967b96a579e45a18b8251732d16804b2e56a55: No such file or directory`, a la vez que los RED de la Task 1; en la verificación de la Task 1, en verde (201/201).

## Medida (Task 3)

Dos worktrees desanclados en `7ffcf529` (`measure-0251-a` y `-b`), con `pnpm install --frozen-lockfile` y `moon.yml` sin `sdd lock run` en `kit:test-headless`; sin cerrojo de suites cogido; abierto además `feature-0236-project-gate-levels`. Gate sin `--affected`: `moon run kit:test-headless cli:typecheck cli:test`.

| Pasada | Resultado | Tests | Duración |
| --- | --- | --- | --- |
| a, a la vez que b (10:28:29–10:29:49) | verde | `cli:test` 1623/1623 (22,45 s) · `kit:test-headless` 227/227 (77,01 s) | 80,0 s |
| b, a la vez que a | verde | `cli:test` 1623/1623 (23,89 s) · `kit:test-headless` 227/227 (77,37 s) | 80,1 s |
| a, sola | rojo | `kit:test-headless` 226/227: `molds.test.ts` › «sdd-propose construye en seco el molde reservas-remoto (id1)», `error: unable to migrate temporary objects` / `error: failed to push some refs to '…\red\id1-1\origin.git'` | 52,9 s |
| `molds.test.ts` solo, en a | verde | 98/98 | 41,85 s |
| a, sola, otra vez | verde | `cli:test` 1623/1623 (12,24 s) · `kit:test-headless` 227/227 (45,11 s) | 47,5 s |

Veredicto: en verde los dos y por debajo de 5 min → `kit:test-headless`, `cli:test-slow` y el gate de cierre dejan el `sdd lock run`. El rojo de la pasada sola es un recurso de la máquina (los objetos temporales de git), no se repite y no cuenta para la medida, que es la pasada en paralelo.

## Rulings

- Task 1: Ruling: `hotfix.ts` figura en «NO se tocan» y en los Ficheros de la Task 1 — solo se toca la llamada a `explainFailure` si cambia su firma; si se puede dejar la firma compatible (parámetro opcional), no se toca — coste si falla: una línea más en el diff del hotfix.
- Task 1: Ruling: línea base de test/merge 188/189 — el rojo es cleanup.slow.test.ts «un id en dos secciones del roadmap…» con `git add -A … unable to write file .git/objects/… No such file or directory`, corrido a la vez que los RED: carga de la máquina (tech-stack, «fallos sueltos de git con la máquina cargada»), no código; en la Verificación de la Task 1 pasa — coste si falla: un rojo de base sin fila.
- Task 1: Ruling: `integrateRef` y `assertNothingPending` viven en `steps.ts`, no en `sync.ts` como dice el plan — `sync.ts` importa de `run.ts` y la ruta inversa haría un ciclo de imports — coste si falla: ninguno, solo el sitio.
- Task 1: Ruling: `hotfix.ts` no se toca — `explainFailure` recibe `base` opcional y el hotfix sigue llamándola igual.
- Task 1: Ruling: RED «tras tres intentos…» pedía `develop` igual que antes del merge; el `MODIFIED` dice «vuelve al commit que tenía antes de fusionar la feature», y el destino queda sincronizado con el remoto que se movió, como hacía antes el reintento — la aserción pasa a «ni develop local ni la remota contienen la rama» — coste si falla: un destino sincronizado que alguien no esperaba.
- Task 1: Ruling: lo que toca la rama se mide hasta su punta antes de la integración (`branch: <sha>` en `verifyMerge`): con la rama ya integrada, la base contaba como de la rama y corría backend:test (intersection) — coste si falla: ninguno, es el requisito «lo que toca la rama se mide desde git merge-base … hasta la punta de la rama».
- Task 1: Ruling: los commits que «también publica» se calculan una vez, en el primer intento y antes del sync del destino: el merge local+remoto que crea el sync de un reintento no es del destino (requisito «los commits que trae de la remota un reintento del push no cuentan») — coste si falla: un commit local publicado de más que no se nombra.
- Task 1: Ruling: mergiraf.slow.test.ts acepta `{ a, b, c }` o `{ a, c, b }`: con la integración en la rama, como `--sync`, mergiraf pone primero el lado de la rama — coste si falla: imports en otro orden en el resultado, que la verificación decide.
- Task 1: Ruling: failures «el worktree temporal va junto…» mide el cwd con un hook pre-merge-commit sin --verify, porque el gate ya no corre en `merge-<id>` — coste si falla: ninguno.
- Task 1: Ruling: el conflicto de «un conflicto al reintegrar…» sale ahora como `merge: conflicto en feature-0001.txt` (al fusionar dentro del cerrojo, no al reintegrar) — coste si falla: el mismo «No terminado» con otro prefijo.
- Task 3: Ruling: la pasada sola dio 226/227 por `error: unable to migrate temporary objects` en molds.test.ts (recurso de la máquina); se repitió el fichero (98/98) y el gate solo (verde, 47,5 s) para el tiempo sin carga; la medida en paralelo no se relanzó — coste si falla: un rojo de carga sin fila de deuda.
- Task 3: Ruling: tech-stack.md también corrige «La espera tiene un tope de 60 min: … kit:test-headless puede vencer» → la espera de cli:test-min — la frase quedaba falsa sin el cerrojo — coste si falla: ninguno.
- Final: Ruling: la `develop` local queda sincronizada con el remoto tras agotar intentos o en un fallo (Spec Minor) — el requisito dice «vuelve al commit que tenía antes de fusionar la feature», y el reintento de push ya dejaba el destino sincronizado — coste si falla: un merge de sincronización en la develop local que hizo el script.
- Final: Ruling: si la base no se puede sacar para el contraste (un fichero sin seguimiento que la base trae), no hay línea `base:` — mejor ningún veredicto que uno falso; si no puede volver a la rama, lo dice con `base: no se pudo volver a '<rama>' en '<worktree>'; sácala con git checkout <rama>` — coste si falla: un rojo sin contraste, que la receta manda contrastar a mano.
- Final: Ruling: «Declined to judge» del eje Código, la vuelta de la rama a su commit si el dev edita mientras verifica — el worktree es el de la sesión que lanzó el merge, que espera a que acabe, y el ticket sin commitear no tiene seguimiento; y los fetch concurrentes al mismo ref remoto — git los serializa con el lock del ref — coste si falla: un edit perdido hecho durante el merge.
- Final: Ruling: «Declined to judge» del eje Código, el mergeBase solo contra la ref remota — los commits locales de develop que se integran después cuentan en el lado de la base (verificado..HEAD), no en el de la rama, que es lo correcto; el texto de tech-stack y merge-recipe, y los asertos cambiados de mergiraf y verified-at, ya tienen su ruling de la Task 1 — coste si falla: un cruce de menos con commits locales de código sin publicar.
- Final: Ruling: re-revisión, «develop local sincronizada tras agotar los intentos» (Minor) — se queda: el requisito dice «vuelve al commit que tenía antes de fusionar la feature», y el reintento de push ya lo hacía así antes de la 0251 — coste si falla: un merge de sincronización en la develop local que la receta llama «como estaba».
- Final: Ruling: re-revisión, «la lista de "también publica" se calcula antes de verificar» (Minor) — se queda: un merge sin --push en la develop local mientras otro verifica es raro (la regla 6 empuja lo de coordinación), y su commit sale igualmente, solo sin nombrarse — coste si falla: un commit publicado que el mensaje final no nombra.
- Final: Ruling: re-revisión, «Where duplica BaseSync y el guard remote === null repite» (Minor) — se queda: Where lleva un remoto que puede ser null igual que BaseSync, pero se usa para los literales; unificarlo toca steps.ts sin ganar claridad — coste si falla: dos tipos con los mismos campos.
- Final: Ruling: re-revisión, «el literal "base: no se pudo volver a …" sin test ni fila en la receta» (Minor) — se queda sin test: provocar que falle el checkout de vuelta tras uno de ida que funcionó no tiene fixture estable; es un mensaje de recuperación — coste si falla: un texto de error mal formado en un caso muy raro.
- Final: Ruling: re-revisión, «sin contraste el rojo sale sin línea base: y nada lo dice» (Minor) — se queda: la receta manda contrastar a mano todo rojo, y el agente acaba en el sitio correcto, como dice el propio revisor — coste si falla: un contraste a mano de más.
- Final: Ruling: re-revisión, fuera del tramo, la fila `base: conflicto en` de merge-recipe.md:52 no nombra el conflicto al integrar en la rama con --verify (Minor) — se queda: la fila ya dice «integrating the destination's remote … into the branch» y su salida es la misma, «No terminado» — coste si falla: ninguno.
