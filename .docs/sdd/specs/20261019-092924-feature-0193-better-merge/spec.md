---
id: 20261019-092924-feature-0193-better-merge
feature: 0193
title: Merge mejor que el de git por defecto — trozos con histogram y zdiff3, registros por id, el merge de sincronización en la CLI, Mergiraf opcional y los menores de la 0187
mode: full
profile: delegate
status: approved
created: 2026-10-19
author: Claude (Opus 5.5)
approvers:
  - role: dev-lead
    name: Àngel Delgado
    approved_at: 2026-10-19
---

# Spec — Merge mejor que el de git por defecto

🦆 Al cerrar una feature, el merge parará menos por conflictos que no lo son. Si dos features añaden cada una su fila al roadmap, o una marca la 0190 ✅ y la otra añade la 0201 justo debajo, se quedan las dos sin preguntar; si las dos añaden la misma fila, sale una vez, y si son dos filas distintas con el mismo id, se quedan las dos y te avisa. Dos requisitos nuevos al final de la misma capacidad, o dos métodos nuevos en el mismo sitio de un `.cs` (si tienes `mergiraf` instalado), también se quedan los dos. Esto vale también al integrar `develop` en la rama antes del merge, que pasa a hacerlo la CLI con `sdd merge --sync` en vez del agente a mano. Si los dos lados cambian la misma línea, sigue parando para que lo resuelvas tú.

## Capacidades

- Modificadas: `control-profiles` — el merge del cierre calcula los trozos con `histogram` y `zdiff3`, une los registros por id, prueba Mergiraf con lo que queda y hace el merge de sincronización (`--sync`); el hotfix valida la etiqueta antes de tocar nada y decide la vuelta con los refs remotos.
- Modificadas: `archive` — el cierre integra la base con `sdd merge --sync` en vez de `git merge` a mano.

## ✋ Decisiones que he tomado yo — valida estas

```text
Review de spec propuesta: ninguna — señales: contrato público (opciones y salidas de `sdd merge` que lee la receta de `sdd-archive`), MODIFIED (siete requisitos de `control-profiles` y uno de `archive`), dependencia externa (`mergiraf`, opcional) · tamaño: ~500 líneas en ~14 ficheros (`cli/src/merge/`, sus tests, la receta y el paso 6 de `sdd-archive`)
- Mínimo razonable: ninguna — deja sin mirar si un AND de los MODIFIED se pierde al reescribirlos; el repaso de coherencia los ha contrastado con la capacidad y `capability merge` sobre una copia lo comprueba
```

1. **Sin entrevista ni diseño por secciones**: el dev-lead trajo las decisiones en el arranque y el perfil es `delegate`; la regla 3 del `CLAUDE.md` del repo («sin preguntas intermedias») manda sobre el diseño por secciones de `spec-writing.md`. Lo que habría preguntado está en esta lista.
2. **No se parte**: 5 tasks previstas (opciones de git y Mergiraf · registros por id · `--sync` y la receta · hotfix: etiqueta y vuelta · los menores), todas en `cli/src/merge/` salvo el texto de la receta, sin migración ni datos.
3. **El merge de sincronización pasa a la CLI: `sdd merge --sync --project-root <worktree>`** (alcance que añado yo). El caso del ticket de la 0185 §3, dos requisitos al final de `capabilities/routing.md`, saltó en el merge de sincronización, que hoy hace el agente a mano con `git merge` y una receta que solo resuelve los registros; `sdd merge` ya une ese add/add (requisito «une los registros que solo añaden líneas»: «una sección al final de otro documento»). Sin `--sync`, la decisión de las capacidades no llegaría al caso que la motivó. `--sync` integra `<remoto>/<merge.into>` (sin remoto, la `merge.into` local) en la rama del worktree, con la misma cadena de resolución que el merge, sin cerrojo (no toca la rama destino), sin `--verify` (la suite de después la decide la receta, como hoy) y sin push. Coste: una edición de `sdd-archive` (paso 6 y la receta) con su prueba (decisión 15).
4. **Literales de `--sync`**: `base: al día: '<remoto>/<into>' ya está en '<rama>'` (sale con 0 sin commit); `base: integrada '<remoto>/<into>' en '<rama>': <hash corto>` (sale con 0); con un conflicto que no se resuelve, `git merge --abort`, la rama como estaba y `base: conflicto en <ficheros>.`, con 1. Con `--into`, `--tag`, `--order`, `--push`, `--verify`, `--verified-at` o `--check` sale con 2: `--sync no admite <opción>`. Con cambios sin commitear en el worktree sale con 1 antes de tocar nada: `base: '<rama>' tiene cambios sin commitear; commitéalos antes de integrar la base`.
5. **Opciones de git**: cada `git merge` de la CLI (base, merge, vuelta del hotfix y `--sync`) lleva `-c merge.conflictStyle=zdiff3` y `-X diff-algorithm=histogram`, y la reescritura de las marcas para resolver pasa de `--conflict=diff3` a `--conflict=zdiff3`. Requiere git ≥ 2.35 (`zdiff3`); la máquina tiene 2.55. Sin comprobación de versión: un git más viejo falla con su propio error.
6. **Cadena de resolución**, en este orden y por fichero en conflicto: (a) `estimation-log.md`, se regenera como hoy; (b) los registros, unión por id (decisión 7); (c) cualquier otro fichero de texto con base, unión de trozos que solo añaden, como hoy; (d) lo que quede, Mergiraf (decisión 9). Si después de (d) queda algún fichero, `git merge --abort` y el error de hoy (`merge: conflicto en`, `base: conflicto en`, `vuelta: conflicto en`) con los que quedan.
7. **Registros y su id**: por ruta desde la raíz del repo, `.docs/sdd/roadmap.md`, `.docs/sdd/changelog.md`, `ROADMAP.md`, `CHANGELOG.md` y `.docs/sdd/steering/debt.md`. Dentro de un trozo en conflicto, una línea con id es una fila de tabla que no es cabecera ni separador (id: su primera celda, sin espacios a los lados) o una entrada de changelog `- **<id>** — …` (id: el texto en negrita). El id vale dentro de su sección: el último encabezado `#` anterior en el trozo, de modo que `**Feature 0185**` en `### Added` y en `### Changed` son dos ids. Por id: lo que cambia un solo lado respecto a la base gana; los dos con el mismo cambio, uno; los dos con cambios distintos de una fila que estaba en la base, conflicto. Las líneas sin id tienen que quedar iguales en los dos lados o cambiar solo en uno; si no, conflicto. Orden: el de la rama destino, con las filas nuevas de la rama detrás de las nuevas de la destino, en el trozo («primero la rama destino», como hoy).
8. **Duplicados**: dos filas nuevas con el mismo id y el mismo texto quedan una. Con el mismo id y texto distinto se quedan las dos, la de la destino primero, y la salida dice `registros: dos filas distintas con el id '<id>' en <fichero>; se quedan las dos, revísalas`; el merge sigue (el dev-lead pidió avisar, no parar). No se buscan duplicados fuera de los trozos en conflicto: dos ramas que añaden la misma fila en sitios distintos los fusiona git sin conflicto y quedan dos; no lo cubre esta feature.
9. **Mergiraf**: «en el PATH» es que `mergiraf --version` arranca. Por cada fichero que queda tras (c): `mergiraf solve <fichero>` en el worktree; con 0, `mergiraf: resuelto <fichero>`; con otro código, `mergiraf: no resuelve <fichero>` y ese fichero queda en conflicto. Sin `mergiraf` no se escribe nada de Mergiraf. Con todo resuelto, el merge se commitea y `--verify` corre sobre el resultado como siempre. Sin `git config` ni `.gitattributes` (decisión del dev-lead).
10. **Merge driver en `.gitattributes`: descartado**. Su definición es `git config` local, como `core.hooksPath`, y sin ella git vuelve al merge normal sin avisar; con `--sync`, los dos merges del cierre ya pasan por la CLI. Un merge o un rebase a mano fuera del cierre sigue con el merge de git. El descarte va a `tech-stack.md` al cerrar (Art. XI).
11. **Hotfix — etiqueta**: `--tag` se valida con `git check-ref-format refs/tags/<nombre>` antes del cerrojo; inválida, sale con 2: `--tag: '<nombre>' no es un nombre de etiqueta válido`. Una etiqueta que ya existe en el remoto de `--into` (`git ls-remote --tags`) falla igual que una local: `--tag: ya existe '<nombre>' en '<remoto>'`, con 1 y sin tocar nada.
12. **Hotfix — vuelta**: el script hace `git fetch <remoto> +refs/heads/release/*:refs/remotes/<remoto>/release/*` y decide «varias release/ abiertas» antes de sincronizar ni fusionar nada. Con remoto cuentan solo las `release/` del remoto: una `release/` solo local no está abierta para el equipo. Sin remoto, las locales. Si el fetch falla: `vuelta: no se pudo hacer fetch de las release/ de '<remoto>'`, con 1. `--check` no hace fetch y decide con los refs remotos que ya hay.
13. **Los 14 menores de código** de `tasks.md` de la 0187 (la etiqueta inválida y «varias release/» son las decisiones 11 y 12): (1) ninguna función con más de 3 parámetros (`explainFailure`, `verifyMerge`, `mergeFeature`); (2) `mergeBranch` e `integrate` ≤ 20 líneas; (3) una clase `MergeConflict` con los ficheros en vez de parsear el mensaje; (4) un solo esqueleto para integrar y publicar en el merge y el hotfix, o el motivo en el walkthrough si juntarlos lo hace menos legible; (5) si la vuelta tiene otro remoto que la estable, falla antes de tocar nada: `push: '<into>' y '<vuelta>' tienen remotos distintos ('<a>', '<b>'); fusiona a mano`; (6) un `ls-remote` que falla por red ya no cuenta como «vuelta no publicada»: `vuelta: no se pudo consultar '<vuelta>' en '<remoto>'`; (7) `isRegistry` por ruta (decisión 7), no por nombre en cualquier carpeta; (8) test de `--verified-at` con un sha de otra rama; (9) la etiqueta solo remota, decisión 11; (10) test de `--verified-at` con código cambiado en la rama; (11) «varias release/» antes de sincronizar, decisión 12; (12) el código del fetch de `release/*`, decisión 12; (13) el hook `pre-receive` de los tests, con bit de ejecución; (14) el comentario de `mergeHotfix` dice lo que hace; (15) sin `back: ''` de relleno en `prepareHotfix`. Son 15 porque la lista de la 0187 tiene 16 viñetas y la etiqueta inválida ya va en la 11.
14. **La salida «Llevarlos a la rama de la feature»** del destino sacado pasa a decir los registros con sus rutas de las dos formas: `solo tocan registros (roadmap, changelog, deuda, estimation-log)`.
15. **Prueba de la edición de `sdd-archive`** (Art. I): tramo `a3` y `a3n` de `tests/batteries/sdd-archive/` y un escenario nuevo `a3c` del fallo del ticket (dos requisitos al final de la misma capacidad en el merge de sincronización), RED con el texto vigente y GREEN con el editado, n = 1, Sonnet. Previsión: 4 sujetos (1 RED, 3 GREEN), ~40 min, ~6 $. Ningún paso nuevo de `SKILL.md` queda sin escenario: el paso 6 y la receta los cubren `a3`, `a3n` y `a3c`.
16. **Una pieza entra, otra sale**: sale la resolución a mano de los registros en el merge de sincronización (paso 6 de `sdd-archive` y «Integrated base» de la receta) y la frase «This is the only `git merge` by hand of the close»; entra `--sync`. La edición deja `sdd-archive` más corta.
17. **`cli` no se toca**: la capacidad `cli` no detalla las opciones de `sdd merge` (la fila 0193 la nombraba); `--sync` sale en `sdd merge --help` por el registro de opciones del verbo, como las demás.

18. **Repaso de coherencia**: la «Regla ante conflicto» de `control-profiles` ya existía (perfiles y push): el delta la copia entera y añade la frase del merge. `capability merge` sobre una copia de `.docs/sdd`: 4 añadidos y 7 sustituidos en `control-profiles`, 1 sustituido en `archive`, 2 reglas sustituidas, salida 0; `capability check` sobre la copia: `Capacidades válidas: 20`.

- Política de modelos: revisores de la spec, ninguno · ejes de la revisión final: Spec opus+high, Código sonnet+high, Arquitectura según el plan · sujetos de la prueba de `sdd-archive`: sonnet + `sdd-kit:effort-medium`, el RED solo y los 3 GREEN en una tanda · en paralelo hasta `control.maxParallelAgents` (3) — al aprobar la spec, esta línea es la confirmación de paralelizar que pide el `CLAUDE.md` del dev-lead; lo que no nombra se confirma aparte

### Decisiones tomadas con el dev-lead

- `-X diff-algorithm=histogram` y `merge.conflictStyle=zdiff3` — «sdd merge pasa `-X diff-algorithm=histogram` y `merge.conflictStyle=zdiff3`» (2026-10-19)
- Registros por id, formas 2.x y 3.0.0 — «Los registros (roadmap, changelog, deuda) se unen por id, no por líneas: quita duplicados y avisa de dos filas distintas con el mismo id. Cubre las dos formas» (2026-10-19)
- Capacidades — «dos ramas que añaden cada una un requisito entero se quedan con los dos, en el orden de la base, como resolveAddOnlyConflicts» (2026-10-19)
- Mergiraf opcional — «si quedan conflictos y `mergiraf` está en el PATH, sdd merge lanza `mergiraf solve <fichero>` en cada uno y lo dice en la salida; con código 0 sigue y la suite corre sobre el resultado; con otro código o sin mergiraf, para como hoy. Sin git config ni .gitattributes» (2026-10-19)
- Merge driver — «valorarlo en la spec» → decisión 10
- Hotfix y menores — «--tag se valida con `git check-ref-format` y sale con código 2 antes de tocar nada; «varias ramas release/ abiertas» se decide con los refs remotos tras un fetch; y los 14 menores de código del tasks.md de la 0187» (2026-10-19)
- «Un conflicto de verdad lo sigue resolviendo una persona» (2026-10-19)
- Perfil `delegate` y al fusionar `sdd merge --push` (2026-10-19)

## Intent

Hoy `sdd merge` fusiona con el algoritmo y el estilo de conflicto por defecto de git y solo une los trozos en los que los dos lados añaden: dos filas distintas tocadas en el mismo trozo de un registro, la misma fila añadida por las dos ramas, o dos métodos nuevos en el mismo sitio de un fichero de código paran el cierre para una persona. Además, el merge de sincronización del cierre lo hace el agente a mano y para por un add/add en una capacidad (ticket de la 0185 §3). Éxito: esos casos se fusionan sin parar, con el resultado que una persona habría dejado, y el conflicto real (los dos lados cambian lo mismo) sigue llegando a una persona con la rama destino intacta. Fracaso aunque funcione: una fila perdida o duplicada en silencio, o un conflicto real resuelto por la máquina.

## Scope

- Entra: opciones `histogram` y `zdiff3` en todos los `git merge` de la CLI; unión por id de los cinco registros; Mergiraf opcional; `sdd merge --sync` y su uso en el paso 6 de `sdd-archive` y la receta; validación de `--tag` y decisión de la vuelta del hotfix con los refs remotos; los menores de la decisión 13.
- No entra: merge driver en `.gitattributes` (decisión 10); duplicados que git fusiona sin conflicto (decisión 8); instalar o exigir `mergiraf`; resolver un conflicto en el que los dos lados cambian lo mismo; Difftastic.

## Lo que se retira o cambia de forma

| Qué | Dónde aparece | Destino |
| --- | --- | --- |
| El merge de sincronización a mano (`git merge --no-edit <remoto>/<merge.into>`) | `skills/sdd-archive/SKILL.md:46` (paso 6) y `:47` («except the sync merge of the recipe»); `skills/sdd-archive/references/merge-recipe.md:9` y `:15`; `.docs/sdd/capabilities/archive.md:29` | `sdd merge --sync`: Scope, decisión 3; delta `archive` (`MODIFIED`) |
| La resolución a mano de los registros en el merge de sincronización | `merge-recipe.md:11-12`; `capabilities/control-profiles.md` «Un conflicto solo en los registros se resuelve con un merge de sincronización» y «Un conflicto que no se puede conservar entero es de una persona»; `capabilities/archive.md:31` y su «Regla ante conflicto» | delta `control-profiles` y `archive` (`MODIFIED`) |
| La vuelta decidida con los refs locales («fetch first, or a release already closed on the remote can abort it») | `merge-recipe.md:80`; `control-profiles.md` «Un hotfix se fusiona en la rama estable…» | decisión 12; delta (`MODIFIED`) |
| «only-add hunks are joined» | `merge-recipe.md:34`; `control-profiles.md` «El merge del cierre parte de la rama destino publicada» y «…une los registros que solo añaden líneas» | decisión 6; delta (`MODIFIED`) |
| Salida «Llevarlos a la rama de la feature: solo tocan registros (roadmap, changelog, estimation-log).» y `isRegistry` por nombre | `cli/src/merge/exits.ts`; `control-profiles.md` «Con la rama destino sacada y con cambios sin commitear…» | decisión 14; delta (`MODIFIED`) |
| `merge: conflicto en` «the sync merge above should have caught it» | `merge-recipe.md:47` | se queda: con `--sync` sigue siendo cierto |

- Filas que implementa: 0193 → `roadmap.md:49`, fila de la 0193, se cierra; 0200 → `roadmap.md:55` (absorbida), se cierra con la 0193; «Menores diferidos de la feature 0187» → `roadmap.md:439`, sale de la deuda con la parte de código. En `capabilities/` y `skills/`, «0200» solo aparece como rama de ejemplo `hotfix/0200-fix-login` (`archive.md:46-61`, `control-profiles.md:321-324`), que no es la fila: se queda. Comprobado con `grep -rn "0193\|0200\|[Mm]ergiraf\|Menores diferidos" .docs/sdd/capabilities skills`.

## Approach

Una sola cadena de resolución (decisión 6) que usan los cuatro merges de la CLI, con la unión por id como una función pura sobre los tres lados de un trozo, y Mergiraf como el último paso, que solo se intenta si arranca. `--sync` reutiliza esa cadena en el worktree de la feature. El hotfix adelanta sus comprobaciones (etiqueta, remoto de la vuelta, `release/` del remoto) a antes de tocar nada.

## Dónde se prueba

- Unión por id, duplicados y aviso: tests unitarios de la función pura (Vitest, `cli/test/merge/`), y uno lento con dos ramas sobre un repo temporal, como `registries.slow.test.ts`.
- `histogram` y `zdiff3`: un test lento con un caso que con `myers` da conflicto y con `histogram` no (o, si no se encuentra uno estable, que el comando lleva las opciones: decisión de la Task 1 con su ruling).
- Mergiraf: test lento con dos ramas que añaden un método en el mismo sitio de un `.ts`, saltado si `mergiraf` no arranca; y el camino sin `mergiraf` con el `PATH` vacío de él.
- `--sync`: tests lentos en repo temporal (al día, integrada, conflicto, capacidad add/add, opción no admitida, cambios sin commitear) y uno de uso en `usage.test.ts`.
- Hotfix y menores: en los tests lentos del hotfix y de `--verified-at` que ya existen.
- `sdd-archive`: decisión 15.

## Términos y ADR

- Términos resueltos: **registro** — uno de los cinco documentos de la decisión 7, más `estimation-log.md`, que se regenera; **merge de sincronización** — integrar la rama destino en la rama del cambio tras su commit de cierre, ahora `sdd merge --sync`.
- ADR candidatas: ninguna — el descarte del merge driver va al documento de anclaje (decisión 10).

## Delta de comportamiento

### Capacidad: `control-profiles`

**ADDED — Los trozos del merge se calculan con histogram y se escriben con zdiff3**
- GIVEN cualquier merge que hace `sdd merge`: la base, la rama, la vuelta de un hotfix o `--sync`
- WHEN el script ejecuta `git merge`
- THEN lo ejecuta con `-c merge.conflictStyle=zdiff3` y `-X diff-algorithm=histogram`
- AND un conflicto que llega a una persona lleva las marcas de `zdiff3`, con la base entre `|||||||` y `=======`

**ADDED — Los registros se unen por id**
- GIVEN `develop` y la rama que se fusiona, que en el mismo trozo de `.docs/sdd/roadmap.md` (o de `ROADMAP.md`, `CHANGELOG.md`, `.docs/sdd/changelog.md` o `.docs/sdd/steering/debt.md`) marcan una la fila `0190` como `✅` y añaden la otra la fila `0201` debajo
- WHEN el cierre ejecuta `sdd merge`
- THEN el trozo queda con la `0190` en `✅` y la `0201`, sin conflicto
- AND si las dos ramas añaden la misma fila `0201` con el mismo texto, queda una sola
- AND si añaden dos filas `0201` con texto distinto, se quedan las dos, la de la rama destino primero, y la salida dice `registros: dos filas distintas con el id '0201' en .docs/sdd/roadmap.md; se quedan las dos, revísalas`
- AND una entrada `- **Feature 0185** — …` en `### Added` y otra en `### Changed` son ids distintos
- AND si las dos ramas cambian de forma distinta la misma fila que ya estaba en la base, es conflicto y lo resuelve una persona

**ADDED — Mergiraf resuelve lo que queda si está instalado**
- GIVEN dos ramas que añaden cada una un método distinto en el mismo sitio de `src/rooms.ts` y `mergiraf` en el `PATH`
- WHEN el merge deja ese fichero en conflicto tras unir los registros y los trozos que solo añaden
- THEN el script ejecuta `mergiraf solve src/rooms.ts`, escribe `mergiraf: resuelto src/rooms.ts`, commitea el merge y corre `--verify` sobre el resultado
- AND si `mergiraf solve` sale con otro código, escribe `mergiraf: no resuelve src/rooms.ts`, aborta el merge y falla como hoy con el fichero en la lista de `conflicto en`
- AND sin `mergiraf` en el `PATH` no escribe nada de Mergiraf y falla como hoy
- AND el script no escribe `git config` ni `.gitattributes`

**ADDED — El merge de sincronización lo hace `sdd merge --sync`**
- GIVEN la rama `feature/0186-x` con su commit de cierre, y `origin/develop` con la 0185 fusionada, que, como la rama, añade un requisito al final de `.docs/sdd/capabilities/routing.md` y una fila al roadmap
- WHEN se ejecuta `sdd merge --sync --project-root <worktree de la 0186>`
- THEN integra `origin/develop` en `feature/0186-x` con la misma resolución que el merge del cierre, sin coger el cerrojo, sin `--verify` y sin push; la capacidad queda con los dos requisitos (primero el de `develop`) y el roadmap con las dos filas, y escribe `base: integrada 'origin/develop' en 'feature/0186-x': <hash>`
- AND si `origin/develop` ya es antecesora de la rama, no hace nada y escribe `base: al día: 'origin/develop' ya está en 'feature/0186-x'`
- AND con un conflicto que no resuelve, aborta el merge, deja la rama como estaba y sale con 1 con `base: conflicto en <ficheros>.`
- AND con cambios sin commitear sale con 1 sin tocar nada: `base: 'feature/0186-x' tiene cambios sin commitear; commitéalos antes de integrar la base`
- AND con `--into`, `--tag`, `--order`, `--push`, `--verify`, `--verified-at` o `--check` sale con 2: `--sync no admite <opción>`
- Se valida en: worktree con la base al día

**MODIFIED — El merge del cierre parte de la rama destino publicada**
- GIVEN una rama destino con remoto que avanzó después de abrir la feature
- WHEN el cierre fusiona
- THEN antes de fusionar la feature, integra en la rama destino local los commits del remoto
- AND resuelve sus conflictos como el merge de la feature: regenera `estimation-log.md` con `sdd estimation log`, une los registros por id, une los trozos que solo añaden líneas por los dos lados (primero la rama destino) y prueba Mergiraf si está instalado; con cualquier otro conflicto, falla con `base: conflicto en` y la lista de ficheros
- REMOVED AND si en cada fichero en conflicto cada trozo solo añade líneas por los dos lados, los une (primero la rama destino) y regenera `estimation-log.md` con `sdd estimation log`; con cualquier otro conflicto, falla con `base: conflicto en` y la lista de ficheros

**MODIFIED — El merge del cierre une los registros que solo añaden líneas**
- GIVEN dos ramas desde la misma rama destino que añaden cada una una fila a `roadmap.md`, una línea a `changelog.md`, una sección al final de otro documento o una palabra a `.cspell/custom-words.txt` en el mismo sitio, y la primera ya se ha fusionado
- WHEN el cierre de la segunda ejecuta `sdd merge`
- THEN el script resuelve el conflicto dentro del cerrojo, en su worktree: deja las líneas de la rama destino y después las de la rama, regenera `estimation-log.md` y fusiona sin intervención
- AND si en algún trozo los dos lados cambian una línea que ya existía y ni la unión por id de los registros ni Mergiraf lo resuelven, o los dos crean el mismo fichero, aborta y falla con `merge: conflicto en` y la lista de ficheros, sin tocar la rama destino
- REMOVED AND si en algún trozo los dos lados cambian una línea que ya existía, o los dos crean el mismo fichero, aborta y falla con `merge: conflicto en` y la lista de ficheros, sin tocar la rama destino

**MODIFIED — Con la rama destino sacada y con cambios sin commitear, el cierre no fusiona**
- GIVEN la rama destino sacada en un worktree con cambios sin commitear
- WHEN el cierre va a fusionar
- THEN no fusiona ahí y sale con 1 con `destino sacado: el checkout de '<into>' en '<ruta>' tiene cambios sin commitear; el merge se haría encima de ellos, así que no se toca.`, el `git diff --stat HEAD` del checkout, `sin seguimiento: <ficheros>` si los hay, y el bloque `Salidas:` (commit de quien los hizo y relanzar, llevarlos a la feature y dejar el merge para luego)
- AND la salida «Llevarlos a la rama de la feature: solo tocan registros (roadmap, changelog, deuda, estimation-log).» solo aparece si todos los ficheros sucios son `.docs/sdd/roadmap.md`, `.docs/sdd/changelog.md`, `ROADMAP.md`, `CHANGELOG.md`, `.docs/sdd/steering/debt.md` o `estimation-log.md`; con `.gitignore` o un `docs/roadmap.md` modificados, las salidas son dos
- AND no hace `stash`, `reset` ni commit de lo ajeno
- REMOVED AND la salida «Llevarlos a la rama de la feature: solo tocan registros (roadmap, changelog, estimation-log).» solo aparece si todos los ficheros sucios son `roadmap.md`, `changelog.md` o `estimation-log.md`; con `.gitignore` modificado, las salidas son dos

**MODIFIED — Un conflicto solo en los registros se resuelve con un merge de sincronización**
- GIVEN un cierre de feature o de patch con su commit de cierre hecho y `origin/develop` por delante
- WHEN el agente sigue la receta del merge
- THEN ejecuta `sdd merge --sync --project-root <worktree>`, que integra `origin/develop` en la rama y resuelve los registros, los trozos que solo añaden y, si está instalado, lo que Mergiraf resuelva; con `base: integrada`, sigue con `sdd merge`, sin parar a preguntar
- AND la rama destino acaba con las entradas de las dos features en cada registro y el log regenerado
- REMOVED GIVEN un cierre de feature o de patch con su commit de cierre hecho y `origin/develop` por delante, cuyo merge de sincronización (`git merge --no-edit origin/develop` en el worktree de la feature) deja conflicto solo en `changelog.md`, `roadmap.md` o `estimation-log.md` de `.docs/sdd/`
- REMOVED THEN en `changelog.md` y `roadmap.md` deja cada línea con el cambio del lado que la tocó, sin duplicar ninguna, regenera `estimation-log.md` con `sdd estimation log`, commitea el merge y sigue con `sdd merge`, sin parar a preguntar

**MODIFIED — Un conflicto que no se puede conservar entero es de una persona**
- GIVEN un cierre cuyo `sdd merge --sync` o cuyo `sdd merge` deja conflicto (`base: conflicto en` o `merge: conflicto en`), o el relanzamiento vuelve a fallar
- WHEN el agente sigue la receta del merge
- THEN no resuelve: cita el mensaje del script y los ficheros, y el cierre queda «No terminado», como hoy; el script ya ha abortado el merge
- AND con `vuelta: conflicto en <ficheros>` de un hotfix, el script ya lo ha deshecho todo: una persona porta el arreglo a la rama de integración y relanza el hotfix
- REMOVED GIVEN un cierre cuyo merge de sincronización o cuyo `sdd merge` deja conflicto (`base: conflicto en` o `merge: conflicto en`) y en la lista hay un fichero que no es uno de los tres registros, o los dos lados tocaron la misma línea de `changelog.md` o `roadmap.md`, o el relanzamiento vuelve a fallar
- REMOVED THEN no resuelve: aborta el merge de sincronización si lo empezó (`git merge --abort`), cita el mensaje del script o de git y los ficheros, y el cierre queda «No terminado», como hoy

**MODIFIED — Un hotfix se fusiona en la rama estable, se etiqueta y vuelve a la integración**
- GIVEN `merge.into: develop`, la rama `hotfix/0200-fix-login` salida de `main` y ninguna `release/*` abierta
- WHEN se ejecuta `sdd merge --branch hotfix/0200-fix-login --into main --tag v3.0.1 --order "fusiona el hotfix del login en main" --push`
- THEN bajo un solo cerrojo fusiona la rama en `main` con `--no-ff` y el commit `merge: hotfix/0200-fix-login en main` con la línea `Orden del dev-lead: «fusiona el hotfix del login en main»`, crea la etiqueta anotada `v3.0.1` en ese commit, fusiona la misma rama en `develop` con `--no-ff`, y publica `main`, `develop` y `v3.0.1` en un solo push atómico
- AND escribe `Fusionado hotfix/0200-fix-login en main: <hash>`, `etiqueta v3.0.1 en <hash>`, `Fusionado hotfix/0200-fix-login en develop: <hash>` y `publicado en origin`
- AND con `release/3.1.0` abierta en `origin` (no antecesora de `main`), la vuelta va a `release/3.1.0` y no a `develop`; con dos abiertas en `origin` tras el fetch de `release/*` que hace el script, falla antes de sincronizar ni fusionar nada con `vuelta: hay varias ramas release/ abiertas (release/3.1.0, release/3.2.0); fusiona a mano`; una `release/` solo local no cuenta si hay remoto
- AND una rama `release/3.1.0` con `--into main` vuelve a `develop`
- AND `--into main` sin `--order` sale con 2 con `--into 'main' distinta de merge.into necesita --order "<frase del dev-lead>"`; `--tag` sin ese `--into`, con `--tag solo con --into a la rama estable`; `--tag 'v3.0.1 beta'`, con `--tag: 'v3.0.1 beta' no es un nombre de etiqueta válido`, antes del cerrojo; y una etiqueta que ya existe falla sin tocar nada con `--tag: ya existe 'v3.0.1'`, o con `--tag: ya existe 'v3.0.1' en 'origin'` si solo existe en el remoto
- REMOVED AND con `release/3.1.0` abierta (no antecesora de `main`), la vuelta va a `release/3.1.0` y no a `develop`; con dos abiertas falla antes de tocar nada con `vuelta: hay varias ramas release/ abiertas (release/3.1.0, release/3.2.0); fusiona a mano`
- REMOVED AND `--into main` sin `--order` sale con 2 con `--into 'main' distinta de merge.into necesita --order "<frase del dev-lead>"`; `--tag` sin ese `--into`, con `--tag solo con --into a la rama estable`; y una etiqueta existente falla con `--tag: ya existe 'v3.0.1'` sin tocar nada

**MODIFIED — Un hotfix cuya vuelta falla se deshace entero**
- GIVEN un hotfix que se fusiona en `main` y cuya vuelta a `develop` tiene un conflicto en `skills/x/SKILL.md` en el que los dos lados cambian la misma línea
- WHEN el script llega a la vuelta
- THEN deshace la vuelta, el merge en `main` y la etiqueta, no publica nada y falla con `vuelta: conflicto en skills/x/SKILL.md; se deshacen el merge en 'main' y la etiqueta: porta el arreglo a 'develop' a mano`
- AND con la verificación de la vuelta en rojo, deshace lo mismo y da el error de verificación con su línea `base:`
- AND si el push atómico se rechaza porque `main` o `develop` avanzaron en el remoto, deshace lo mismo y falla con `push: 'main' o 'develop' avanzó en 'origin'; relanza el hotfix`
- AND si `main` y la rama de vuelta tienen remotos distintos, falla antes de tocar nada con `push: 'main' y 'develop' tienen remotos distintos ('origin', 'upstream'); fusiona a mano`; y si no se puede consultar la vuelta en el remoto, con `vuelta: no se pudo consultar 'develop' en 'origin'`

**Reglas de la capacidad**
- **Regla ante conflicto**: el perfil sigue feature → persona (`sdd-kit.local.json`) → release → proyecto; `execution` sigue método nombrado para la feature → persona → proyecto, sin nivel de release, y un valor fijado manda sobre la recomendación del handoff; ninguna regla del perfil cubre el merge a `main`, el tag ni las acciones hacia fuera distintas del push de la rama de integración que autoriza `merge.push`, y no deroga la ruta «Merge y tag sin segunda ronda cuando la decisión ya está tomada» de `release-flow`, donde la decisión ya la tomó una persona. Un merge o un push que el entorno o el remoto deniegan no se reintenta: lo desbloquea una persona. Un conflicto de merge en el que los dos lados cambian lo mismo lo resuelve una persona: `sdd merge` solo resuelve, en este orden, el `estimation-log.md` (regenerado), los registros por id, los trozos que solo añaden y lo que Mergiraf resuelva con código 0.

### Capacidad: `archive`

**MODIFIED — El cierre integra la base tras su commit y repite la suite solo si la base trae código**
- GIVEN la 0081 con la suite completa en verde en `a1b2c3d`, en la validación, y `origin/develop` que avanzó desde que se abrió la rama con el merge de la 0080, que cambia `src/rooms.js`
- WHEN el cierre ha hecho su commit de cierre
- THEN hace `git fetch` y `sdd merge --sync --project-root <worktree>`, que integra `origin/develop` en la rama como último commit, y corre la suite completa (E2E incluidos si el proyecto los declara) sobre el resultado, porque la 0080 cambia `src/`
- AND el merge final lleva `--verified-at <sha del merge de sincronización>`
- AND si la 0080 solo hubiera cambiado `.docs/sdd/roadmap.md`, no corre la suite y el merge lleva `--verified-at a1b2c3d`
- AND con conflicto en `roadmap.md`, `changelog.md` o un add/add de dos requisitos al final de una capacidad, `--sync` lo resuelve y el cierre sigue; con `base: conflicto en src/slots.js`, el cierre queda «No terminado» para una persona
- REMOVED THEN hace `git fetch` y `git merge --no-edit origin/develop` en la rama, que queda como último commit, y corre la suite completa (E2E incluidos si el proyecto los declara) sobre el resultado, porque la 0080 cambia `src/`
- REMOVED AND con conflicto solo en `roadmap.md` y `changelog.md`, deja cada línea con el cambio del lado que la tocó, regenera `estimation-log.md` con `sdd estimation log` y sigue; con conflicto en `src/slots.js`, hace `git merge --abort` y el cierre queda «No terminado» para una persona

**Reglas de la capacidad**
- **Regla ante conflicto**: un conflicto al integrar la base o al fusionar que `sdd merge` no resuelve lo resuelve una persona; un rojo que también falla sin la rama lo decide el dev-lead tras la búsqueda en la deuda; el merge a la rama estable, el tag y su push solo con la frase del dev-lead; la fila de la madre de una familia la cierra el dev-lead, no el cierre

## Topes de palabras

Medidos con `wc -w` (el test parte por espacios en blanco igual); se vuelven a medir con `tests/WordBudget.Tests.ps1` al editar.

| Fichero | Medido / tope | Margen | Tope propuesto |
| --- | --- | --- | --- |
| `skills/sdd-archive/SKILL.md` | 3846 / 3850 | 4 | sin cambio (la edición acorta el paso 6) |
| `skills/sdd-archive` total | 6181 / 6300 | 119 | sin cambio |

## Enmiendas

## Aprobaciones

| Nombre | Fecha | Estado |
| --- | --- | --- |
| Àngel Delgado | 2026-10-19 | aprobada (opción «Apruebo») |
