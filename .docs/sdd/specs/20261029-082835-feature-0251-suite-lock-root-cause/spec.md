---
id: 20261029-082835-feature-0251-suite-lock-root-cause
feature: 0251
title: El cerrojo de suites fuera de verdad — sdd merge verifica sin el cerrojo de merge y dos gates caben a la vez
mode: full
profile: delegate
status: approved
created: 2026-10-29
author: Àngel Delgado
approvers:
  - name: Àngel Delgado
    approved_at: 2026-10-29
---

# Spec — El cerrojo de suites fuera de verdad

🦆 Hoy, cuando dos cierres coinciden, el que fusiona coge el cerrojo de merge y dentro corre su verificación, que espera el cerrojo de suites del otro: los dos se quedan esperando. Con esta feature, `sdd merge` verifica en el worktree de la rama, sin el cerrojo de merge, y solo lo coge para fusionar y publicar, lo que dura segundos; si otra rama se fusionó mientras verificaba, integra la base y verifica solo lo que se cruza. Además, el gate usa la mitad de los núcleos para Vitest y saca de `cli:test` el test que lanza procesos, y se repite la medida de la 0240: si dos gates a la vez salen en verde y en menos de 5 min, el cerrojo de suites sale del gate y de `kit:test-headless` y `cli:test-slow`.

## Capacidades

- Modificadas: `control-profiles` — dónde corre la verificación del merge (fuera del cerrojo, en el worktree del cambio), qué deja un merge que falla, y el tope de intentos.

## ✋ Decisiones que he tomado yo — valida estas

```text
Review de spec propuesta: ninguna — señales: MODIFIED, contrato público (la salida de sdd merge que leen las skills) · tamaño: ~250 líneas en 9 ficheros
- Mínimo razonable: ninguna — deja sin cubrir una segunda lectura de los THEN de reintento (2/3) contra push-retry.slow.test.ts; lo cubren los tests de la Task 1
```

1. **La verificación corre en el worktree del cambio**, no en un worktree temporal: es el único con las dependencias instaladas (un `merge-<id>` recién creado da `Cannot find module`, patch 0245), y la CLI no puede saber cómo prepara un proyecto sus dependencias. Por eso `sdd merge --verify`, si la base avanzó, integra `<remoto>/<destino>` en la rama del cambio con la resolución de `--sync`: el commit de integración queda en la rama, como el que ya pide el paso «Integrated base» de `merge-recipe.md`.
2. **Dentro del cerrojo no se verifica nunca**: el script fusiona en el destino y compara el resultado con el commit verificado con el predicado de `--verified-at` (`git diff --quiet <verificado> HEAD -- . ':!.docs' ':!*.md'`). Si solo difieren docs (el triaje de la sesión `develop`, lo habitual), publica; si no, deshace el merge del destino, suelta el cerrojo y repite fuera de él la integración y la verificación del cruce desde el commit verificado.
3. **Un tope de 3 intentos compartido** entre «el destino cambió al fusionar» y «el push encontró el remoto movido» (hoy, 3 intentos de push). Literales nuevos: `merge: '<destino>' cambió durante la verificación; integro y verifico lo que se cruza (<n>/3)` y, al agotarse, `merge: '<destino>' sigue cambiando tras 3 intentos; relanza el merge en un rato`. El del push no cambia: `push: '<destino>' avanzó en '<remoto>'; integro y reintento (<n>/3)`, y su agotamiento tampoco.
4. **El contraste de un rojo corre en el worktree del cambio, desacoplado en la base** (`git checkout --detach <remoto>/<destino>`), y vuelve a la rama al acabar; antes, la rama vuelve al commit que tenía antes de la integración del script. Sin el cerrojo de merge, igual que la verificación.
5. **Sin `--verify`, nada cambia**: el script coge el cerrojo, fusiona y publica como hoy, sin integrar en la rama del cambio.
6. **El hotfix no entra**: `mergeHotfix` sigue verificando dentro del cerrojo. Es raro, lo decide una persona con `--order`, y su ida y vuelta atómica a dos ramas no cabe en este reparto.
7. **`--branch` con una rama que no es la sacada en `--project-root`, junto con `--verify`**, sale con 2: `--verify corre en el worktree de la rama; '<rama>' no está sacada en '<ruta>'`, sin coger el cerrojo. Sin `--verify`, `--branch` sigue como hoy.
8. **Una rama con cambios sin commitear** o un merge a medias, con `--verify`, sale con 1 con el mensaje de `--sync`: `base: '<rama>' tiene cambios sin commitear; commitéalos antes de integrar la base`, sin coger el cerrojo ni tocar nada. Solo se comprueban los ficheros con seguimiento, como `--sync`: el ticket sin commitear de la regla 6 de `CLAUDE.md` no lo para.
9. **Los commits locales de `develop` sin publicar también se integran en la rama**: tras `<remoto>/<destino>`, si la `develop` local tiene commits que la rama no lleva, la rama la integra también, con la misma resolución y el mensaje `base: integrada 'develop' en '<rama>': <hash>`. Así el árbol del merge coincide con el verificado aunque `develop` lleve commits sin publicar (enmienda del 2026-10-29).
10. **(b) Qué pasa a lento**: de los cuatro que caducaron en la 0240, solo `merge/mergiraf.test.ts` lanza procesos (`mergirafRuns` y `solveWithMergiraf` arrancan un programa): sus dos tests van a `merge/mergiraf.slow.test.ts`. `estimation/layout.test.ts` y `estimation/statistics.test.ts` escriben en el `tmpdir` y leen una carpeta de `specs/`, no la evidencia entera: se quedan. `kit/subject-output-privacy.test.ts` lanza un `git diff --cached`, pero es el control rápido del commit que `tech-stack.md` §Testing deja en el conjunto rápido a propósito («si debe frenar el commit, deja en el rápido un control de lo que el commit lleva»): se queda.
11. **(b) `--maxWorkers 50%` en `cli:test`** (`cli/moon.yml`), que alcanza también al pre-commit; `kit:test-headless`, `cli:test-slow` y `cli:test-min` siguen con 8.
12. **(c) La medida**, como la de la 0240: dos worktrees desanclados en el commit de la Task 2, con `moon.yml` y `cli/moon.yml` sin `sdd lock run`, `pnpm install` en cada uno y `moon run kit:test-headless cli:typecheck cli:test` sin `--affected` (el peor caso) lanzado a la vez en los dos; después, el mismo gate solo, para el tiempo sin carga. Una sola tanda; si sale roja, no se relanza para sacar verde.
13. **(c) Si la medida sale en verde**, salen del cerrojo `kit:test-headless` (`moon.yml`), `cli:test-slow` (`cli/moon.yml`) y el gate de cierre de `tech-stack.md` §Testing (el `node cli/bin/sdd.js lock run --` de delante, de la 0228). `cli:test-slow` no se mide en paralelo: solo corre al cortar una release, y ahí la regla 5 de `CLAUDE.md` lo envuelve en un `sdd lock run` que se queda, así que quitarle el suyo no cambia cuándo corre. `cli:test-min` conserva el suyo, igual que el job de la CI (`.github/workflows/ci.yml`), que corre solo.
14. **(c) Si sale en rojo**, el cerrojo se queda, la fila 0251 y `tech-stack.md` §Testing lo dicen con las medidas, y la feature cierra con (a) y (b).
15. **«Con otra rama en cierre, el gate corre antes de que esa rama fusione»** se salda con (a): la espera del cerrojo con el `--verify` dentro desaparece, y el gate que invalida el merge de otra rama lo repite el propio `sdd merge`, solo con lo que se cruza. Si los escenarios de (a) no pasan, la fila lo dice.
16. **Previsión de coste (Art. I)**: `skills/sdd-archive/references/merge-recipe.md` (la frase de «The merge is a script» y dos filas de «Its outputs»): no se mide con sujetos. Solo dice qué hace la CLI y nombra sus salidas, con «You do: nothing» como la del push; lo cubren los tests de la CLI, como en la 0235. 0 sujetos, 0 $.
17. **Una pieza entra, otra sale**: sale el cerrojo de suites del gate (si (c) sale en verde) y la verificación dentro del cerrojo de merge; entra el bucle de intentos fuera del cerrojo.

- Delta probado con `sdd capability merge` sobre una copia de `.docs/sdd`: 2 añadidos, 1 sustituido y la regla «Límites» sustituida, código 0.
- Política de modelos: revisores de la spec, ninguno · ejes de la revisión final: Spec opus+high, Código sonnet+high, Arquitectura según el plan · sin sujetos · en paralelo hasta `control.maxParallelAgents` (3)

### Decisiones tomadas con el dev-lead

- (a) El `--verify` corre sin el cerrojo de merge; el cerrojo se coge solo para fusionar, y si la base se movió entre medias se vuelve a verificar lo que se cruza — «El --verify corre sin el cerrojo de merge; el cerrojo se coge solo para fusionar, y si la base se movió entre medias se vuelve a verificar lo que se cruza» (2026-10-29).
- (b) El gate acota los workers de Vitest y pasan a lentos los tests que caducaron si leen la evidencia entera — «El gate acota los workers de Vitest (p. ej. --maxWorkers 50%); estimation/layout, estimation/statistics, merge/mergiraf y kit/subject-output-privacy […] pasan a *.slow.test.ts si leen la evidencia entera del repo, como pide tech-stack.md §Testing» (2026-10-29).
- (c) La medida de la 0240 decide si sale el cerrojo — «En verde los dos y en menos de 5 min, kit:test-headless y cli:test-slow dejan el sdd lock run y solo cli:test-min lo conserva; si no, la fila lo dice con las medidas» (2026-10-29).
- Perfil `delegate`; al fusionar, `sdd merge --push` — «Perfil delegate. Al fusionar, `sdd merge --push`» (2026-10-29).

## Intent

Hoy `mergeBranch` (`cli/src/merge/run.ts`) tiene el cerrojo de merge durante todo `integrate`, y dentro corren el `--verify`, la verificación de cada reintento de push y el contraste de un rojo, que piden el cerrojo de suites: una sesión fusiona con el cerrojo de merge cogido mientras espera las suites de otra, y la otra, al acabar su gate, espera el merge (dev-lead: «ya me he encontrado dos tareas esperándose una a la otra»). Además, el cerrojo de suites sigue en el gate porque dos gates a la vez dan `Test timed out in 5000ms` en `cli:test` (0240). El éxito: dos cierres a la vez no se esperan con un cerrojo cogido, el segundo fusiona sin esperar el `--verify` entero del primero, y, si la medida lo permite, dos gates caben a la vez sin cerrojo en menos de 5 min. Fracaso aunque funcione: que lo que se publica en `develop` no esté verificado, o que el merge deje un commit de integración en la rama tras un rojo.

## Scope

- Entra: (a) `sdd merge --verify` sin el cerrojo de merge, con integración en la rama, intentos y contraste fuera del cerrojo (`cli/src/merge/run.ts`, `cli/src/merge/verify.ts`, `cli/src/merge/sync.ts` si se reutiliza su integración, `cli/test/merge/`); la frase y las filas de `merge-recipe.md`. (b) `--maxWorkers 50%` en `cli:test` y `mergiraf.test.ts` a `mergiraf.slow.test.ts`. (c) la medida, y según ella `moon.yml`, `cli/moon.yml` y `tech-stack.md` §Testing.
- No entra: el hotfix (decisión 6); `cli:test-min` y su cerrojo; la CI; `kit:test` y otras suites; el aislamiento de un `vitest` a mano que no coge el cerrojo (deuda «El baseline del gate de cierre sale rojo…»); la cola visible del cerrojo (0228).
- Ficheros: `cli/src/merge/run.ts`, `cli/src/merge/verify.ts`, `cli/src/merge/sync.ts`, `cli/test/merge/` (los `*.slow.test.ts` de verificación, push y contraste, y `mergiraf.test.ts` → `mergiraf.slow.test.ts`), `cli/moon.yml`, `moon.yml`, `.docs/sdd/tech-stack.md` §Testing, `skills/sdd-archive/references/merge-recipe.md`, `.docs/sdd/capabilities/control-profiles.md` (al cerrar, por el delta).

## Lo que se retira o cambia de forma

| Qué | Dónde aparece | Destino |
| --- | --- | --- |
| La verificación dentro del cerrojo de merge | `merge-recipe.md:40` («Under one lock per repo, the script … runs `--verify` on the result and pushes») | Scope: la frase dice que verifica en el worktree del cambio, fuera del cerrojo |
| El contraste «sobre el commit de antes del merge», en el destino | `control-profiles.md`, requisito «Un merge del cierre que falla deja la rama destino como estaba» | delta, `MODIFIED` |
| «3 intentos de push como máximo» | `control-profiles.md`, Reglas, **Límites** | delta, Reglas (decisión 3) |
| `push: … integro y reintento (n/3)` verifica dentro del cerrojo | `run.ts:44` (`publish`); `merge-recipe.md:63` | el literal no cambia; la verificación pasa fuera (decisión 3) |
| `sdd lock run` de `kit:test-headless` y `cli:test-slow` | `moon.yml:9`, `cli/moon.yml` (`test-slow` y su comentario) | Scope, solo con (c) en verde (decisión 13) |
| El prefijo `node cli/bin/sdd.js lock run --` del gate de cierre | `tech-stack.md:32` | Scope, solo con (c) en verde |
| «`kit:test-headless`, `cli:test-slow` y `cli:test-min` corren dentro de `sdd lock run` … Tras la 0216 y la 0233 sigue haciendo falta (0240…)» | `tech-stack.md:8` | Scope: con (c) en verde, solo `cli:test-min`, y la medida; en rojo, la medida nueva junto a la de la 0240 |
| «nunca una tarea de moon con el cerrojo de suites» | `tech-stack.md:34` (Verificación de una task) | Scope, con (c) en verde: solo `cli:test-min` lo lleva |
| `sdd lock run -- moon run cli:test-slow cli:test-min` | `CLAUDE.md:34` (regla 5) | se queda (decisión 13) |
| `sdd lock run -- moon run … cli:test-min` | `.github/workflows/ci.yml:32` | se queda: lo conserva `cli:test-min` |
| `merge/mergiraf.test.ts` | `cli/test/merge/` | Scope: sus tests a `mergiraf.slow.test.ts` (decisión 10) |

- Filas que implementa: 0251 → `roadmap.md:37`, al cerrar; «Con otra rama en cierre, el gate corre antes de que esa rama fusione» → `roadmap.md:578`, saldada por (a) (decisión 15); «Menores del ticket del patch 0254» (b) → `roadmap.md:609`, saldada con la medida. Nombran la medida de la 0240 y el cerrojo, y el cierre las pone al día con la medida nueva: la 0246 (`roadmap.md:32`, «La espera del cerrojo se queda»), «El baseline del gate de cierre sale rojo…» (`roadmap.md:560`) y el `afterAll` de `hotfix.slow.test.ts` (`roadmap.md:148`, «`cli:test-slow` conserva el cerrojo»). Comprobado con `git grep -n -e 'lock run' -e '0240' -e '0251'` fuera de `specs/` y `field-reports/`.

## Approach

Tres tasks, en orden: (a) el merge, (b) los workers y el test a lento, (c) la medida y, según su resultado, el cerrojo. (a) sigue la decisión del dev-lead: el `--verify` sale del cerrojo de merge, que se coge solo para fusionar y publicar, y si la base se movió entre medias se vuelve a verificar lo que se cruza (el cruce de la 0235, con `--verified-at` en el commit verificado). (c) es la medida de la 0240 sobre el commit de (b), y su resultado decide qué ficheros cambian.

## Dónde se prueba

- Verificación fuera del cerrojo, intentos, rojo con contraste, rama sucia y `--branch`: `cli/test/merge/*.slow.test.ts`, con los repos y el remoto *bare* de `helpers.ts`, como `push-retry.slow.test.ts` e `intersection.slow.test.ts`; los dos cierres a la vez, con un `--verify` que espera a que aparezca un fichero, como el cerrojo de `lock-and-base.slow.test.ts`.
- `mergiraf` a lento: `npx vitest run test/merge/mergiraf.slow.test.ts` en verde y `mergiraf.test.ts` ya no existe.
- `--maxWorkers 50%` y el cerrojo fuera: la medida de (c), con sus tiempos y resultados en el walkthrough.

## Términos y ADR

- Términos resueltos: **commit verificado** — el `HEAD` de la rama del cambio sobre el que corrió en verde la última verificación de `sdd merge` (o el de `--verified-at` si no corrió ninguna).
- ADR candidatas: ninguna.

## Delta de comportamiento

### Capacidad: `control-profiles`

#### ADDED — La verificación del merge corre fuera del cerrojo de merge

- GIVEN `feature/0251-x`, sacada en `D:\code\kit-0251` y verificada en `c3d4e5f`, y `origin/develop`, que avanzó a `d4e5f6a` con un cambio en `cli/src/`
- WHEN el cierre ejecuta `sdd merge --push --verify "moon run cli:test --affected --base develop" --verified-at c3d4e5f`
- THEN sin coger el cerrojo de merge, integra `origin/develop` en `feature/0251-x` en `D:\code\kit-0251`, con la resolución de `--sync`, y escribe `base: integrada 'origin/develop' en 'feature/0251-x': <hash>`
- AND si la `develop` local tiene commits sin publicar que la rama no lleva, los integra también, y escribe `base: integrada 'develop' en 'feature/0251-x': <hash>`
- AND corre la verificación en `D:\code\kit-0251`, todavía sin el cerrojo, con el cruce desde `c3d4e5f`
- AND solo con la verificación en verde coge el cerrojo de merge, fusiona `feature/0251-x` en `develop` y la publica, sin correr otra verificación dentro del cerrojo
- AND si al fusionar, dentro del cerrojo, el resultado difiere del commit verificado fuera de `.docs/` y de `*.md`, deshace el merge de `develop`, suelta el cerrojo, escribe `merge: 'develop' cambió durante la verificación; integro y verifico lo que se cruza (2/3)` y vuelve a integrar y a verificar lo que se cruza desde el commit verificado; si solo difieren docs, publica
- AND si el push encuentra `origin/develop` movido, deshace el merge, suelta el cerrojo, escribe `push: 'develop' avanzó en 'origin'; integro y reintento (2/3)` y repite igual, fuera del cerrojo
- AND los dos casos comparten el tope de 3 intentos; al agotarlo por el merge, sale con 1 con `merge: 'develop' sigue cambiando tras 3 intentos; relanza el merge en un rato`, y por el push, con `push: 'develop' sigue moviéndose en 'origin' tras 3 intentos; relanza el merge en un rato`, sin publicar
- AND con `origin/develop` ya en la rama, no hay commit de integración, y con `--verified-at` en el `HEAD` de la rama la verificación se omite con `verificación: omitida: desde <sha> solo cambian docs`
- AND sin `--verify`, coge el cerrojo y fusiona como antes, sin integrar en la rama del cambio
- AND con cambios sin commitear en ficheros con seguimiento de `feature/0251-x`, o un merge a medias, sale con 1 con `base: 'feature/0251-x' tiene cambios sin commitear; commitéalos antes de integrar la base`, sin coger el cerrojo ni tocar nada
- AND `--verify` con `--branch feature/0252-y`, que no es la sacada en `--project-root`, sale con 2 con `--verify corre en el worktree de la rama; 'feature/0252-y' no está sacada en 'D:\code\kit-0251'`, sin coger el cerrojo
- AND en un hotfix (`--into` a la rama estable) la verificación sigue dentro del cerrojo

#### ADDED — Dos cierres a la vez no se esperan con un cerrojo cogido

- GIVEN `feature/0251-x` en `sdd merge --verify`, con su verificación en marcha, y `feature/0252-y`, que acaba su gate y ejecuta `sdd merge --push` mientras tanto
- WHEN las dos quieren fusionar en `develop`
- THEN `feature/0252-y` coge el cerrojo de merge, fusiona y publica sin esperar a que acabe la verificación de `feature/0251-x`
- AND `feature/0251-x`, al acabar su verificación en verde, coge el cerrojo, ve `develop` cambiada, lo suelta e integra `origin/develop`, verifica solo lo que se cruza con lo que trajo `feature/0252-y`, y fusiona
- AND en ningún momento una de las dos espera un cerrojo mientras tiene el otro cogido

#### MODIFIED — Un merge del cierre que falla deja la rama destino como estaba

- GIVEN un merge del cierre que falla: conflicto que no es el del log, verificación en rojo, push rechazado o error de git
- WHEN el script termina
- THEN la rama destino local vuelve al commit que tenía antes de fusionar la feature; no se empuja nada; el worktree temporal se ha retirado y el cerrojo está libre
- AND la rama del cambio vuelve al commit que tenía antes de la integración que hizo el script, y su worktree queda en ella
- AND el script sale con error y nombra el paso que falló y el motivo
- AND si un hook rechaza el merge y no hay ficheros en conflicto, el motivo es `verificación: el hook rechazó el merge.` seguido de los tests fallidos y de las últimas 20 líneas de la salida del hook, no un conflicto
- AND con el hook o `--verify` en rojo, si la salida tiene líneas de un test fallido —`[-] se llama sdd-archive` de Pester, ` FAIL  test/a.test.ts > grupo > nombre` o `× nombre` de Vitest, también tras un prefijo de moon como `cli:test | `—, antes de la cola va `tests fallidos:` y esas líneas, en orden y hasta 20; sin ninguna, el mensaje no cambia
- AND si `git merge` falla sin conflictos y sin llegar a preparar el merge (un fichero sin seguimiento que sobrescribiría, una opción que su versión no admite), el motivo es `<paso>: git merge falló sin conflictos.` seguido de las últimas 20 líneas de su salida, no un rechazo del hook
- AND si la verificación falla porque un fichero lo tiene abierto otro proceso, el motivo es `bloqueado: '<fichero>' lo tiene abierto <proceso>` (el que nombre la salida del gate, u «otro proceso») y la ruta del log, no `verificación:`
- REMOVED AND si `--verify` sale en rojo, corre otra vez sobre el commit de antes del merge: con un gate `moon run … --affected`, los targets que corrió la pasada roja, como lista y sin `--affected`, y sin cruce, el gate sin `--affected`; y el error acaba con `base: en rojo: el mismo comando también falla sin la rama (salida en <log>); mira la deuda del proyecto antes de investigar` o con `base: en verde: el rojo lo trae la rama`; tras un `bloqueado:` o un rechazo del hook no corre
- AND si `--verify` sale en rojo, corre otra vez, sin el cerrojo de merge, sobre la base integrada (`<remoto>/<destino>`), en el worktree del cambio desacoplado en ella, que vuelve después a su rama (en un hotfix, dentro del cerrojo y sobre el commit de antes del merge): con un gate `moon run … --affected`, los targets que corrió la pasada roja, como lista y sin `--affected`, y sin cruce, el gate sin `--affected`; y el error acaba con `base: en rojo: el mismo comando también falla sin la rama (salida en <log>); mira la deuda del proyecto antes de investigar` o con `base: en verde: el rojo lo trae la rama`; tras un `bloqueado:` o un rechazo del hook no corre

#### MODIFIED — El push del cierre reintenta si la rama destino avanzó

- GIVEN `sdd merge --push` y un remoto en el que otra sesión publica `develop` entre el merge y el push
- WHEN el push se rechaza y, tras un fetch, la `develop` remota ya no es antecesora de la local
- REMOVED THEN escribe `push: 'develop' avanzó en 'origin'; integro y reintento (2/3)`, integra la `develop` remota como al empezar, repite `--verify` salvo que desde el último commit verificado solo cambien docs, y vuelve a empujar
- REMOVED AND en el reintento, con un gate `moon run … --affected`, corre solo lo que toca la rama y también tocó lo que llegó desde el último commit verificado; sin `--verified-at`, el último commit verificado es el resultado del merge que pasó la primera pasada
- THEN escribe `push: 'develop' avanzó en 'origin'; integro y reintento (2/3)`; sin `--verify`, integra la `develop` remota en la local y vuelve a empujar; con `--verify`, deshace el merge, suelta el cerrojo y repite fuera de él la integración en la rama y la verificación, como en «La verificación del merge corre fuera del cerrojo de merge»
- AND en el reintento con `--verify` y un gate `moon run … --affected`, corre solo lo que toca la rama y también tocó lo que llegó desde el último commit verificado, que es la punta de la rama integrada que pasó la pasada anterior
- AND si otra sesión publica `develop` mientras corre `--verify`, el reintento lo da el merge, con `merge: 'develop' cambió durante la verificación; …`, no el push
- AND tras el tercer push rechazado falla con `push: 'develop' sigue moviéndose en 'origin' tras 3 intentos; relanza el merge en un rato` y la rama destino como estaba
- AND un rechazo con la remota todavía antecesora (credenciales, hook del servidor) falla con `push: no se pudo publicar 'develop' en 'origin'.` y, en las líneas siguientes, lo que escribió `git push` (`remote: rama protegida`), sin reintentar; el push atómico de un hotfix, igual

#### MODIFIED — El merge del cierre une los registros que solo añaden líneas

- GIVEN dos ramas desde la misma rama destino que añaden cada una una fila a `roadmap.md`, una línea a `changelog.md`, una sección al final de otro documento o una palabra a `.cspell/custom-words.txt` en el mismo sitio, y la primera ya se ha fusionado
- WHEN el cierre de la segunda ejecuta `sdd merge`
- REMOVED THEN el script resuelve el conflicto dentro del cerrojo, en su worktree: deja las líneas de la rama destino y después las de la rama, regenera `estimation-log.md` y fusiona sin intervención
- THEN el script resuelve el conflicto en su worktree —con `--verify`, al integrar la base en la rama del cambio, fuera del cerrojo; sin él, dentro del cerrojo—: deja las líneas de la rama destino y después las de la rama, regenera `estimation-log.md` y fusiona sin intervención
- AND si en algún trozo los dos lados cambian una línea que ya existía y ni la unión por id de los registros ni Mergiraf lo resuelven, o los dos crean el mismo fichero, aborta y falla con `merge: conflicto en` y la lista de ficheros, sin tocar la rama destino; si el conflicto sale al integrar la base en la rama, falla con `base: conflicto en` y la rama del cambio vuelve a su commit, sin `MERGE_HEAD`

#### MODIFIED — La verificación del merge es el gate de merge, no la suite completa

- GIVEN un proyecto cuyo `tech-stack.md` §Testing separa un conjunto rápido de la suite completa
- WHEN el cierre fusiona con `sdd merge`
- REMOVED THEN `--verify` es el conjunto rápido, que corre sobre el resultado del merge y antes del push; con una sola suite, es esa
- THEN `--verify` es el conjunto rápido, que corre sobre la rama del cambio integrada con la base, antes del merge y del push; con una sola suite, es esa
- AND la suite completa ya corrió antes del script: en la validación final y, si la base trajo cambios fuera de `.docs/` que no sean `*.md`, otra vez tras el merge de sincronización del cierre; el mensaje final da su resultado y su sha
- AND si un hook `pre-merge-commit` del repo ya ejecuta el gate, `--verify` se omite; la suite completa no se omite nunca

#### MODIFIED — Mergiraf resuelve lo que queda si está instalado

- GIVEN dos ramas que añaden cada una un método distinto en el mismo sitio de `src/rooms.ts` y `mergiraf` en el `PATH`
- WHEN el merge deja ese fichero en conflicto tras unir los registros y los trozos que solo añaden
- THEN el script ejecuta `mergiraf solve src/rooms.ts`, escribe `mergiraf: resuelto src/rooms.ts`, commitea el merge y corre `--verify` sobre el resultado
- AND si `mergiraf solve` sale con otro código, escribe `mergiraf: no resuelve src/rooms.ts`, aborta el merge y falla como hoy con el fichero en la lista de `conflicto en`
- AND sin `mergiraf` en el `PATH` no escribe nada de Mergiraf y falla como hoy
- AND el script no escribe `git config` ni `.gitattributes`
- AND si resuelve `src/rooms.ts` pero otro fichero queda en conflicto, aborta y no escribe `mergiraf: resuelto src/rooms.ts`
- REMOVED AND si las dos ramas cambian el mismo import de forma compatible (`import { a, b }` y `import { a, c }`), Mergiraf los une en `import { a, b, c }` y `--verify` decide: en rojo, el merge se deshace como cualquier verificación en rojo
- AND si las dos ramas cambian el mismo import de forma compatible (`import { a, b }` y `import { a, c }`), Mergiraf los une en un solo import con `b` y `c`, en el orden que da Mergiraf según qué lado entra, y `--verify` decide: en rojo, el merge se deshace como cualquier verificación en rojo
- AND no se lanza sobre ficheros de `.docs/` ni sobre `*.md`: un conflicto ahí que las reglas del kit no resuelven sale en `conflicto en` sin línea de Mergiraf
- AND si resolvió algún fichero, `--verified-at` no omite `--verify`

#### Reglas de la capacidad — control-profiles

- **Límites**: `control.maxParallelAgents` 3 por defecto; su conducta la aplica `sdd-parallel-agents` (requisito «Dos revisores de spec se despachan con `sdd-parallel-agents`» de `feature-flow`). `control.silence` 8 y 20 minutos por defecto: 20 (`longCommandMinutes`) si la llamada que espera el subagente es un comando de shell o si se vigila la salida de una verificación lenta, y 8 (`betweenStepsMinutes`) en cualquier otra espera; un subagente colgado se relanza una sola vez (requisitos de `feature-flow`). Umbral para proponer partir una feature: más de 5 tasks internas previstas, o 4 o 5 que tocan capacidades o superficies distintas o llevan migración; con 3 o menos, nunca. Checkpoint de alcance: en el 3.º fix descubierto de una feature y en cada tercero después. `sdd merge`: 3 intentos como máximo entre la verificación y la publicación cuando la rama destino cambia, al fusionar o al empujar; el push de un hotfix, uno.

## Topes de palabras

| Fichero | Medido / tope | Margen | Tope propuesto |
| --- | --- | --- | --- |
| `skills/sdd-archive/` (total) | 8.981 / 10.000 | 1.019 | sin cambio (~+60 palabras) |
| `.docs/sdd/tech-stack.md` | 20.832 / 24.579 | 3.747 | sin cambio (~+80 palabras) |

## Enmiendas

- 2026-10-29 — Delta: `MODIFIED` de «El push del cierre reintenta…», «El merge del cierre une los registros…», «La verificación del merge es el gate de merge…» y «Mergiraf resuelve lo que queda…», y «en un hotfix, dentro del cerrojo…» en el contraste de «Un merge del cierre que falla…» — la revisión final (eje Spec) encontró en la capacidad textos que el comportamiento aprobado (decisiones 1, 2, 3 y 6) ya contradice; no cambian el comportamiento, lo describen — pasada de fix de la revisión final — sin aprobar
- 2026-10-29 — Decisión 9 y un AND de «La verificación del merge corre fuera del cerrojo de merge»: la rama integra también la `develop` local si tiene commits sin publicar — sin ello, `develop` con un commit local de código no converge y rompe «con un commit local y un reintento solo nombra el local» de `push-retry.slow.test.ts` — Task 1 — aprobada (opción «Integrar también develop local»)

## Aprobaciones

| Nombre | Fecha | Estado |
| --- | --- | --- |
| Àngel Delgado | 2026-10-29 | aprobada (opción «Apruebo») |
