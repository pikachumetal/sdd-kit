---
id: 20261029-082835-feature-0251-suite-lock-root-cause
feature: 0251
title: Walkthrough — El cerrojo de suites fuera de verdad
spec: ./spec.md
plan: ./plan.md
status: done
created: 2026-10-29
---

# Walkthrough — El cerrojo de suites fuera de verdad

## 1. Cambios realizados

- **(a) `sdd merge --verify` sin el cerrojo de merge** (`14825b47`, con la pasada de fix en el cierre): `cli/src/merge/run.ts` separa la ruta con `--verify` (`mergeVerified`): integra `<remoto>/<destino>` y la `<destino>` local en la rama del cambio (`integrateRef`, en `steps.ts`, que también usa `--sync`), verifica en su worktree y solo entonces coge el cerrojo para fusionar y publicar (`publishVerified`); si el merge difiere de lo verificado fuera de docs o el push encuentra el remoto movido, deshace y repite, hasta 3 intentos. Un fallo devuelve la rama a su commit; el contraste de un rojo corre con el worktree del cambio desacoplado en la base (`explainFailure` con `base`, en `verify.ts`), y sin poder sacarla no da veredicto. Sin `--verify` y en el hotfix, la ruta de antes. Tests: `cli/test/merge/outside-lock.slow.test.ts` (18) y las expectativas que cambia el delta en `push-retry`, `intersection`, `failures`, `verified-at` y `mergiraf`. `merge-recipe.md`: la frase de «The merge is a script», cinco filas de «Its outputs» y la frase de después de un fallo; `sdd-templates/SKILL.md`, la fila de `sdd merge`.
- **(b) Workers y lentos** (`7ffcf529`): `cli:test` con `--maxWorkers 50%` (`cli/moon.yml`); los dos tests de `merge/mergiraf.test.ts` pasan a `mergiraf.slow.test.ts`.
- **(c) La medida y el cerrojo** (`fe3a985b`): dos gates a la vez sin cerrojo, verdes en 80 s; `kit:test-headless` (`moon.yml`), `cli:test-slow` (`cli/moon.yml`) y el gate de cierre de `tech-stack.md` §Testing dejan el `sdd lock run`. Tabla en `tasks.md` §Medida.

## 2. Tiempo y coste: estimado vs real

- Tipo: infra/tooling
- Estimación de implementación (del plan): 4,5h
- Esfuerzo real: 1,51 h — reloj de la sesión 1,64 h desde 2026-10-29T08:24Z, sin 7 min de espera al dev-lead (2 esperas)
- Desviación: −2,99 h (−66 %)
- Causa de la desviación: la estimación sumó en serie horas de trabajo que corrieron en segundo plano (la línea base, la medida, las suites de `test/merge` y la revisión final), y la Task 1 salió con la interfaz que fijaba el plan; el aviso de `estimation.md` sobre estimar en horas secuenciales se repite aquí con código.
- Compactación: no
- Modelo del hilo: Opus 5.5, effort no registrado (spec, plan y ejecución)
- Tokens del hilo: 46.335.141 — claude-opus-5-5 46.335.141
- Tokens de subagentes: 7.564.129 en 3 despachos — Final review — Code axis claude-sonnet-5-5 1.262.701 / 3 min; Re-review final 0251 claude-opus-5-5 1.790.126 / 4 min; Final review — Spec axis claude-opus-5-5 4.511.302 / 8 min
- Coste de la sesión: 20,96 $ (hilo 16,08 $ + subagentes 4,88 $)
- Coste de sujetos: no aplica
- Review de spec: no · hallazgos 0, aceptados 0

## 3. Desviaciones del plan

- La spec tuvo una enmienda aprobada antes del plan (decisión 9: integrar también la `develop` local) y otra sin aprobar en la pasada de fix: cuatro `MODIFIED` de coherencia y el caso del hotfix en el contraste (spec, «Enmiendas»).
- `integrateRef` y `assertNothingPending` viven en `steps.ts`, no en `sync.ts`; `hotfix.ts` no se tocó.
- Las expectativas que cambia el delta en los tests existentes (los literales `merge:`, el conflicto que sale en el merge, `develop^2^1`, el orden de mergiraf y el cwd por hook) y una aserción del RED «tras tres intentos…», que pedía más que el `MODIFIED`.
- La pasada de fix añadió el contraste sin base sacable (sin veredicto), el aviso de vuelta fallida a la rama, `destinationUnpublished` antes del primer intento y los Minor de Art. X.

### Decisiones tomadas sin el dev-lead

- La línea base de `test/merge` (188/189) dio un rojo de git por carga a la vez que los RED; en la Task 1 pasó — coste si está mal: un rojo de base sin fila.
- `integrateRef` y `assertNothingPending` en `steps.ts` — para no hacer un ciclo de imports con `sync.ts` — coste: ninguno.
- `hotfix.ts` sin tocar: `explainFailure` recibe `base` opcional — coste: ninguno.
- El RED «tras tres intentos…» se ajustó al `MODIFIED`: el destino queda sincronizado con el remoto que se movió, sin la rama — coste: un destino sincronizado que alguien no esperaba.
- Lo que toca la rama se mide hasta su punta antes de la integración — coste: ninguno, es el requisito del cruce.
- Los commits que «también publica» se calculan una vez, antes del primer intento — coste: un commit local publicado durante la verificación que no se nombra.
- `mergiraf.slow.test.ts` acepta `{ a, b, c }` o `{ a, c, b }` — coste: imports en otro orden, que la verificación decide.
- El cwd del worktree temporal se mide con un hook, sin `--verify` — coste: ninguno.
- El conflicto de «un conflicto al reintegrar…» sale como `merge: conflicto en` — coste: el mismo «No terminado» con otro prefijo.
- La pasada sola de la medida dio `error: unable to migrate temporary objects` en `molds.test.ts`; se repitió el fichero y el gate solo, no la medida en paralelo — coste: un rojo de carga sin fila de deuda.
- `tech-stack.md` corrige también la frase del tope de 60 min de espera — coste: ninguno.
- La `develop` local queda sincronizada con el remoto tras agotar los intentos o en un fallo — coste: un merge de sincronización en la `develop` local que la receta llama «como estaba».
- Sin base sacable para el contraste no hay línea `base:`, y si no se puede volver a la rama se dice con `base: no se pudo volver a '<rama>' en '<worktree>'; sácala con git checkout <rama>` — coste: un rojo sin contraste, que la receta manda contrastar a mano.
- «Declined to judge» del eje Código: la vuelta de la rama si el dev edita mientras verifica, los fetch concurrentes y el `mergeBase` contra la ref remota se quedan como están — coste: un edit perdido hecho durante el merge, o un cruce de menos con commits locales de código sin publicar.
- Seis Minor de la re-revisión se quedan con su ruling (`tasks.md` §Rulings): la `develop` sincronizada, la lista de «también publica», `Where` frente a `BaseSync`, el literal de vuelta sin test, el rojo sin contraste que no lo dice y la fila `base: conflicto en` — coste: el que dice cada ruling, todos menores.

## 4. Verificación

### 4.1 Builds

- `pnpm exec tsc --noEmit` (desde `cli/`) → sin salida, código 0, tras la pasada de fix.
- `npx vitest run test/merge test/kit/word-budget.test.ts test/kit/skills.test.ts --test-timeout 120000` → 392 passed | 12 skipped (404), 240 s, sobre la pasada de fix (juntada en el cierre).
- Gate: el de cierre de `tech-stack.md` §Testing corre una vez en el paso 6 del cierre, sobre el commit de cierre, porque `feature/0236-project-gate-levels` está abierta; su línea `Gate:` va en el mensaje final.
- Línea base, la medida y las verificaciones por task: `tasks.md`.

### 4.2 Smoke / tests

- Validación en campo: 2026-10-29 · `test/merge` + `kit/word-budget` + `kit/skills` 392/392 sobre la pasada de fix (juntada en el cierre) · 14 THEN por suite · medida de dos gates a la vez en verde (80 s) · revisión final Spec y Código sobre `fe3a985b`, re-revisión de la pasada de fix sin Critical ni Important abiertos y 6 Minor adjudicados · el `sdd merge --push --verify` de esta feature queda pendiente (CI de `develop` en rojo).

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| Integra `origin/develop` en la rama sin cerrojo y lo escribe | suite: `verifica en el worktree de la rama sin el cerrojo de merge` | verde |
| Integra también la `develop` local sin publicar | suite: `integra también la develop local con commits sin publicar` | verde |
| Verifica en el worktree del cambio, sin cerrojo, con el cruce | suite: el mismo test (cwd, cerrojo) e `intersection.slow.test.ts` | verde |
| Solo en verde coge el cerrojo y no verifica dentro | suite: los gates de `outside-lock` fallan si ven el cerrojo | verde |
| El destino cambió fuera de docs → `merge: … (2/3)`; solo docs → publica | suite: `si develop cambia durante la verificación…` y `con un cambio solo de docs…` | verde |
| Push movido → `push: … (2/3)` fuera del cerrojo | suite: `el push que encuentra el remoto movido repite fuera del cerrojo` | verde |
| Tope de 3 con sus dos literales | suite: `tras tres intentos con develop cambiando…` y `tras tres push con el remoto movido…` | verde |
| Base ya en la rama, sin integración; `--verified-at` en `HEAD`, omitida | suite: `con la base ya en la rama no hay commit de integración` y `verified-at.slow.test.ts` | verde |
| Sin `--verify`, como antes | suite: `sin --verify no integra en la rama` y `sin --verify, tras tres push…` | verde |
| Rama sucia → 1 sin tocar nada | suite: `con cambios sin commitear en la rama sale con 1 sin tocar nada` | verde |
| `--branch` de otra rama → 2 | suite: `--verify con --branch de otra rama sale con 2` | verde |
| Hotfix dentro del cerrojo | suite: `hotfix.slow.test.ts` e `intersection` «crosses on a hotfix» | verde |
| Dos cierres a la vez sin esperarse con un cerrojo cogido | suite: `el segundo fusiona mientras el primero verifica…` | verde |
| Un fallo devuelve la rama a su commit; contraste en la base, sin cerrojo | suite: `con la verificación en rojo…`, `un hook en rojo…`, `un conflicto al integrar la base en la rama…` y `si la base no se puede sacar…` | verde |
| (c) Dos gates a la vez, verdes y en menos de 5 min | ejecución real: `tasks.md` §Medida | verde, 80 s |

### 4.3 Residuales / deuda generada

- La CI de `develop` (`b8ab5635`, run 40782953211) está en rojo en `cli:test-min`: 7 tests de `test/merge/intersection.slow.test.ts` (0235) dan `verificación: sin cruce: moon query falló (… Unable to resolve a merge base between the base and head revisio…)` en Linux. Es de la 0235, no de esta rama, y para su merge (regla 7 de `CLAUDE.md`).

## 5. Aprendizajes

- La verificación del merge no cabe en un worktree temporal: solo el del cambio tiene las dependencias, y la CLI no sabe cómo prepara un proyecto las suyas → capacidad `control-profiles` (delta) y `merge-recipe.md`.
- Con `cli:test` a la mitad de los núcleos, dos gates caben a la vez: el cerrojo de suites venía de la carga de Vitest, no de las suites lentas → `tech-stack.md` §Testing.
- Un hook de la máquina del dev-lead bloquea cualquier comando cuyo texto contenga `git reset --hard`, también dentro de un mensaje para el ledger: escribir esas líneas con `Write` y añadirlas desde el fichero → ninguno del kit (configuración de la máquina); lo recoge el ticket.

- Revisión de skills: `.claude/skills/` (`skill-creator`, `writing-for-agents`, `writing-skills`) no habla de `sdd merge` ni del cerrojo: no aplica; de `skills/`, lo cambiaron `merge-recipe.md` y `sdd-templates/SKILL.md`.

## 6. Adendas
