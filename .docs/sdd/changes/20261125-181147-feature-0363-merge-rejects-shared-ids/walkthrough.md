---
id: 20261125-181147-feature-0363-merge-rejects-shared-ids
feature: 0363
title: Walkthrough — sdd merge para con un id o un número de ADR que ya tiene el destino
spec: ./spec.md
status: done
created: 2026-11-25
---

# Walkthrough — `sdd merge` para con un id o un número de ADR que ya tiene el destino

## 1. Cambios realizados

- `cli/src/merge/numbering.ts` (nuevo): `numberingClashes`, función pura que compara lo que trae la rama desde su merge-base con lo que tiene el destino (carpetas de `changes/` y `specs/` en modo `sequence`, ADR `NNNN-<slug>.md` siempre), y `assertNoNumberingClash`, que lee las tres refs con `git ls-tree` y para con una línea `numeración: …` por choque. Commit `0afa0d168`.
- `cli/src/merge/run.ts`: `--check` comprueba la numeración contra `develop` y su seguimiento remoto, sin fetch, después de `checkDestination`.
- `cli/src/merge/steps.ts`: `integrateRef` (`--sync` y la base de `--verify`) y `mergeFeature` (el merge del cierre, dentro del cerrojo, también la ida y la vuelta del hotfix) comprueban antes de su `git merge`.
- `cli/src/ids/scan.ts`: `assertNoSharedIds` pasa a `warnSharedIds`: con un id duplicado, `sdd id next` avisa y sigue.
- Tests: unitario `cli/test/merge/numbering.test.ts` (11 casos) y casos lentos en `destination`, `sync`, `failures`, `verified-at`, `hotfix`, `outside-lock`, `next`, `reserve` y `layout`.
- Pasada de arreglos de la revisión final (juntada en el cierre): el reintento del push sin `--verify` vuelve a comprobar contra el `origin/develop` que avanzó; el hotfix comprueba la vuelta antes de fusionar en `main`; el modo de ids sale del `sdd-kit.json` de la rama (`git show`); la regla de número de ADR (`decisionNumber`) y el listado de carpetas de cambio (`changeFolderNamesAt`) se comparten con `decisions/` e `ids/`.
- `capabilities/`: `closing-merge` (requisito nuevo) y `feature-ids` (requisito sustituido, escenario y «Avisos»).

## 2. Tiempo y coste: estimado vs real

- Tipo: infra/tooling
- Estimación de implementación (de la spec): 3,5h
- Esfuerzo real: 1,24 h — reloj de la sesión 1,96 h desde 2026-11-25T18:07Z, sin 43 min de espera al dev-lead (3 esperas)
- Desviación: −2,26 h (−65 %)
- Causa de la desviación: esperas y huecos 18:09Z 2 min; 18:23Z 0 min; 19:04Z 40 min, ya descontados; la estimación contaba diez tests lentos montados a mano y los helpers de repo existentes los dejaron en minutos
- Compactación: no
- Modelo del hilo: Opus 5.5, effort no registrado (todas las fases)
- Tokens del hilo: 52.132.763 — claude-opus-5-5 52.132.763
- Tokens de subagentes: 3.683.881 en 6 despachos — Final review — Architecture axis claude-opus-5-5 1.056.110 / 2 min; Final review — Code axis claude-sonnet-5-5 466.180 / 1 min; Segunda ronda spec 0363 claude-sonnet-5-5 152.550 / 1 min; Re-review final 0363 claude-opus-5-5 697.929 / 2 min; Final review — Spec axis claude-opus-5-5 1.163.753 / 3 min; Revisar spec 0363 claude-sonnet-5-5 147.359 / 1 min
- Coste de la sesión: 20,28 $ (hilo 16,62 $ + subagentes 3,66 $)
- Coste de sujetos: no aplica
- Review de spec: 1 revisor (dominio y técnica, sonnet) y segunda ronda por un Crítico aceptado · hallazgos 20, aceptados 17

## 3. Desviaciones del plan

- _Ninguna_ respecto a la spec aprobada (lite, sin `plan.md`).

### Decisiones tomadas sin el dev-lead

- el test existente «fails when a task folder and a feature folder share an id» (next.slow.test.ts:59) codificaba el paro retirado y la búsqueda de la coherencia no lo encontró (buscó «duplicate ids») — pasa a «warns when…» con el aviso literal y salida 0, y su fila va a «Lo que se retira» de la spec — si me equivoco, un test que debía seguir parando ya no para, pero la spec aprobada retira ese paro.
- specs/ y ADR superseded sin caso propio en el unitario — specs/ lo cubre el test de --sync (la base trae la carpeta en specs/); superseded no se puede distinguir por nombre y la comparación solo mira nombres, así que cuenta siempre — si me equivoco, una ADR superseded que debía no contar para el merge.
- 5 tests de ids (GIT_INDEX_FILE, GIT_COMMON_DIR, filas reservadas, contador, worktrees) dieron timeout de 5 s en la tanda RED al correr ocho ficheros lentos a la vez; solos, verdes — carga, no regresión — si me equivoco, el gate de validación lo verá.
- Eje Arquitectura no → sí — merge e ids quedan con dependencia en los dos sentidos a nivel de módulo — si está mal, ~1 revisor opus de más. Sale después de Spec y Código, solo, porque la Política de modelos aprobada nombra dos ejes en paralelo
- dist/** fuera del paquete — es la copia construida de cli/src y la compara dist.test.ts — si está mal, un cambio solo en dist sin revisar
- Código Minor 6 (gitLines traga cualquier error de ls-tree) — es el mismo criterio que branchContentIds y una ruta que no existe es el caso normal (proyecto sin decisions/); distinguirlo pide otro helper de git — si está mal, un fallo raro de git deja pasar un choque
- Arquitectura Minor 1 (ciclo de directorios merge↔ids) — sin ciclo de ficheros (scan.ts no importa de merge) y con el mismo patrón ya en merge↔roadmap; sacar las constantes a una hoja común es un refactor de ids fuera del alcance — si está mal, mover ids o merge por separado cuesta más
- Spec Minor 2 (stable-branch sin subsección para el choque en main) — la decisión 8 de la spec ya lo cubre y el walkthrough lo dice; el requisito nuevo de closing-merge nombra el hotfix — si está mal, stable-branch no cuenta esa forma de fallar
- un tercer test del paro retirado (layout.slow.test.ts:47) lo vio la suite lenta de la pasada; pasa a avisar y su fila va a la spec — mismo coste que el ruling de la Task 1
- el RED del reintento tenía mal su última aserción (branch --contains de un commit que no llegó al remoto); pasa a comprobar que develop del remoto es el commit de la otra sesión — si está mal, la aserción mira menos de lo que debía
- los «Declined to judge» de los tres ejes — tracker solo ADR, --check del hotfix, destinationName con la ref, warnSharedIds, HEAD desacoplado en --check y CHANGELOG con la release: decisiones de la spec o comportamiento previo, se quedan — si está mal, ninguno cambia lo que la feature promete
- re-revisión Minor (carrera entre el fetch de la comprobación y el de syncBaseBranch en el reintento del push) — ventana de milisegundos entre dos máquinas; el arreglo reordena el reintento y sería un commit sin revisar — si está mal, un choque que entre en esa ventana se publica
- re-revisión Minor (modo leído solo de la rama: ciego si develop pasa a sequence después de separarse la rama y la rama no toca sdd-kit.json) — --check e integrateRef ya leían la rama en el diseño aprobado y cambiar ids.mode es raro — si está mal, ese merge no compara carpetas
- re-revisión Minor (decisiones 4 y 7 de la spec desfasadas) — corregidas en la spec con su línea de Enmiendas; solo docs, revisado en el hilo

## 4. Verificación

### 4.1 Builds

- Línea base (worktree aparte en `23e85263c`, sin filtro): `moon run kit:test-headless cli:typecheck cli:test` → cli:typecheck: corrió · cli:test: corrió 2591/2606 (15 saltados) · kit:test-headless: corrió 801/801 · 5 min 8 s.
- Gate: `moon run kit:test-headless cli:typecheck cli:test --affected --base develop` → cli:typecheck: corrió · cli:test: corrió 2600/2615 (15 saltados) · kit:test-headless: corrió 801/801 · 3 min 31 s · configuración: la del gate · sobre `0afa0d168`.
- Gate tras la pasada de arreglos: `moon run kit:test-headless cli:typecheck cli:test --affected --base 0afa0d168` → cli:typecheck: corrió · cli:test: corrió 2604/2619 (15 saltados) · kit:test-headless: corrió 801/801 · 2 min 2 s · sobre la pasada de arreglos, juntada en el cierre (el cierre solo añade docs).
- Tests lentos de lo tocado (fuera del gate): `npx vitest run --test-timeout 120000 test/merge test/ids` en `cli/` → 346/346 tras la pasada (dos rojos de la propia pasada arreglados y repetidos en verde: `layout.slow` y la aserción del RED del reintento).
- Revisión final: Spec opus+high, con arreglos (1 Important, 3 Minor) · Código sonnet+high, con arreglos (7 Minor) · Arquitectura opus+high, sí (4 Minor) (subido: `merge` importa de `ids/scan.ts` e `ids/claim.ts` ya importaba de `merge`), sobre `0afa0d168`.
- Pasada de fix: juntada en el cierre, 5 hallazgos RED→GREEN (1 Important y 10 Minor arreglados, 3 Minor adjudicados).
- Re-revisión: `0afa0d168`..la pasada de arreglos juntada en el cierre, sdd-kit:effort-high + opus, todos resueltos o adjudicados, sin Critical ni Important nuevos; 3 Minor nuevos adjudicados (dos rulings y las decisiones 4 y 7 de la spec corregidas, solo docs, revisado en el hilo).

### 4.2 Smoke / tests

- Validación en campo: 2026-11-25 · gate 2604/2619 y 801/801 sobre la pasada de arreglos · tests lentos de merge e ids 346/346 · humo con la CLI de `dist/` en repos temporales, 7 pasos con ejecución real (`--check` con choque de carpeta, de ADR y solo en `origin/develop`; merge real; `--sync`; `--verify`; `id next` con duplicado) · revisión final en tres ejes y re-revisión limpias de Critical e Important · `no probado` con ejecución real: hotfix, reintento del push y modo leído de la rama (solo suite)

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| `--check` con `…-feature-0756-a` en `develop` y `…-patch-0756-b` en la rama: salida 1 y las dos carpetas, sin tocar nada | ejecución real (guion, paso 1) · suite (`destination.slow`) | `salida 1` · `numeración: la rama trae 20261123-162919-patch-0756-b y 'develop' ya tiene 20261123-141327-feature-0756-a con el id 0756; renumera la de la rama a mano` |
| ADR `0004-a.md` en `develop` y `0004-b.md` en la rama: salida 1 y los dos ficheros | ejecución real (guion, paso 2) · suite (`destination.slow`) | `numeración: la rama trae decisions/0004-b.md y 'develop' ya tiene decisions/0004-a.md con el número 0004; renumera la de la rama a mano` |
| choque solo en `origin/develop`: lo nombra, sin fetch; dos choques en una ref salen los dos | ejecución real (paso 5; paso 2, dos líneas) · suite (`destination.slow`, `numbering`) | `numeración: la rama trae decisions/0004-b.md y 'origin/develop' ya tiene decisions/0004-a.md con el número 0004; …` |
| `develop` sacada con cambios: primero el mensaje de destino sacado | suite (`destination.slow`) | verde |
| `--sync` y `--verify` paran antes de integrar la base, con `origin/develop` en el mensaje | ejecución real (pasos 6 y 7: `salida 1`, rama y `develop` iguales) · suite (`sync.slow`, `verified-at.slow`) | verde; con `--verify`, el gate no llega a correr |
| el reintento del push sin `--verify` vuelve a comprobar; el hotfix comprueba la vuelta antes de `main`; el modo sale de la rama | suite (`outside-lock.slow`, `hotfix.slow`, `failures.slow`) | verde; no probado con ejecución real |
| el merge del cierre comprueba dentro del cerrojo y deja `develop` como estaba; el hotfix deshace la vuelta entera | ejecución real (paso 3, `develop igual: true`) · suite (`failures.slow`, `hotfix.slow`) | verde |
| solo cuenta lo que trae la rama desde el merge-base (duplicado ya fusionado, renombrado en el destino); no cuentan `0000`, sufijo heredado ni carpetas en `tracker` | suite (`numbering`) | verde |
| `sdd id next` con dos 0756 en disco: aviso y siguiente libre | ejecución real (paso 4) · suite (`next.slow`, `reserve.slow`) | `salida 0` · `0758` (la rama `feature/0757-x` ocupa el 0757) · `aviso: dos artefactos distintos comparten el id 0756: …; renumera uno.` |
| con una fila `0760`, `--reserve` devuelve `0761` y deja el contador ahí | suite (`reserve.slow`, con `0010` → `0011`) | verde |

### 4.3 Residuales / deuda generada

- Los dos requisitos nuevos pasan de los 500 caracteres que aconseja `sdd capability check` (aviso, salida 0), como 26 vigentes de las mismas capacidades.

## 5. Aprendizajes

- El repaso de coherencia buscó el comportamiento retirado por una forma del literal («duplicate ids») y dejó tres tests con otras («share an id», «son duplicado») → sin destino en los documentos: la regla de buscar cada forma del literal ya está en `sdd-spec-approval` (va al ticket del kit), y `operations.md` está en su tope de palabras (20 785 en `origin/develop`).

Retro: error que cazaría un chequeo → ticket del kit: el repaso de coherencia de `sdd-spec-approval` busca el literal de lo que se retira y no los tests que lo ejercen; tres tests del paro de `sdd id next` («share an id», «son duplicado») se le escaparon, dos los vio el GREEN y uno la suite lenta de la pasada de arreglos, porque `cli:test` no corre los `*.slow.test.ts`

## 6. Adendas
