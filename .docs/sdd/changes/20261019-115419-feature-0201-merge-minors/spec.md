---
id: 20261019-115419-feature-0201-merge-minors
feature: 0201
title: Menores de sdd merge diferidos de la 0193
mode: lite
profile: delegate
status: approved
created: 2026-10-19
author: Claude (Opus 5.5)
approvers:
  - role: dev-lead
    name: Àngel Delgado
    approved_at: 2026-10-19
---

# Spec — Menores de `sdd merge` diferidos de la 0193

🦆 `sdd merge` deja de callar o de despistar en casos de borde. Si la red falla al consultar las etiquetas del remoto, el hotfix lo dice en vez de dar la etiqueta por libre. Una vuelta sin remoto ya no sale como `'null'`, y `--sync` en un HEAD desacoplado da un error claro. Un `git merge` que falla sin conflictos ya no se atribuye a un hook. Y los avisos de filas repetidas o de Mergiraf solo salen si el merge acaba hecho. El resto es limpieza de código y tests más finos.

## Capacidades

- Modificadas: `control-profiles` — el merge que falla sin conflictos, los registros por id, Mergiraf, `--sync` y los dos requisitos del hotfix ganan cada uno su caso de borde.

## ✋ Decisiones que he tomado yo — valida estas

1. **La receta no se edita, aunque elegiste «con la receta».** El Art. I dice que una guía nueva solo se escribe si el baseline exhibe el fallo, y aquí no lo exhibe:
   - `base: integrada …` ya la medimos: en el GREEN de la 0193, `a3-1`, `a3-2` y `a3c-1` la leyeron bien sin que la receta la nombre (repitieron la suite y pasaron `--verified-at` con el sha del merge de sincronización).
   - `base: '<rama>' tiene cambios sin commitear…` no se puede alcanzar en el cierre: el paso 0 de `sdd-archive` para antes con cualquier cambio en `git status --porcelain`, y `--sync` solo mira los ficheros con seguimiento.

   El menor sale de la deuda como «descartado con evidencia». Si aun así lo quieres, sería un RED de ~0,5 $ que espero en verde, y por el Art. I no se escribiría.
2. **Literales nuevos**:
   - `--tag: no se pudo consultar las etiquetas de '<remoto>'` (sale con 1, antes de tocar nada; también en `--check`).
   - `('<remoto>', sin remoto)` en el mensaje de remotos distintos.
   - `base: HEAD desacoplado; --sync integra la base en una rama` (sale con 1).
   - `<paso>: git merge falló sin conflictos.` seguido de las últimas 20 líneas de su salida.
3. **Hook o error de git:** el merge cuenta como rechazado por un hook si hay `MERGE_HEAD` (git preparó el merge y el commit no salió). Sin `MERGE_HEAD`, es el error de git del punto 2.
4. **Avisos solo con el merge hecho:** `registros: …` y `mergiraf: resuelto …` se escriben solo si no queda ningún fichero en conflicto. `mergiraf: no resuelve …` se escribe siempre.
5. **`--sync` rechaza `--branch`** con `--sync no admite --branch`: integra la base en la rama del worktree, nunca en otra.
6. **El fetch de las `release/*` del hotfix lleva `--prune`:** una release borrada en el remoto deja de contar como abierta.
7. **`dedupeRows`** compara cada fila con todas las de su id que ya vio: con `a, b, b` quedan `a, b`, y se avisa del id una vez. La cabecera de una tabla (una fila seguida de su separador) no lleva id.
8. **Limpieza sin conducta**:
   - `MARKER` en un solo sitio.
   - Fuera el reexport de `isRegistry` en `exits.ts`; el test lo importa de `registries.ts`.
   - Fuera el campo `lines` sobrante de `mergeKeyedHunk`.
   - `seen.set` sin truco.
   - Early return en `completeMergeAttempt`.
9. **Tests**:
   - El de `--sync` con `MERGE_HEAD` pasa a un `git merge --no-commit` limpio y comprueba que `HEAD` y `MERGE_HEAD` siguen igual.
   - El de `--check` con dos releases las crea solo en el remoto y comprueba que no aparece ningún ref de seguimiento nuevo.
   - `mergiraf.test.ts` limpia su temporal.
10. **«vuelta: no se pudo consultar» sigue sin test.** Haría falta un remoto que acepte el `fetch` y rechace el `ls-remote` siguiente, y no hay costura para eso sin un doble de git. Lo revisó el eje Spec de la 0193; sale de la deuda con este motivo.
11. **Review de spec: ninguna** (lite).
12. **Repaso de coherencia:** `capability merge` sobre una copia de `.docs/sdd` sustituye 6 requisitos de `control-profiles` y sale con 0; `capability check` da `Capacidades válidas: 20`.

- Política de modelos: revisores de la spec, ninguno · ejes de la revisión final: Spec opus+high y Código sonnet+high, en paralelo · sin sujetos (el punto 1 no edita la skill) · en paralelo hasta `control.maxParallelAgents`

### Decisiones tomadas con el dev-lead

- Carril lite, con la receta — opción «Lite, con la receta» (2026-10-19); su alcance lo matiza el punto 1.

## Intent

La 0193 dejó 18 menores (fila de deuda «Menores diferidos de la feature 0193»). Los que se ven son casos de borde de `sdd merge`: una etiqueta que se da por libre sin poder consultar el remoto, mensajes con `null` o `undefined`, un error de git que se atribuye a un hook, y avisos de un merge que luego se aborta. Éxito: cada uno de esos casos da un mensaje que dice qué pasó, y la fila de deuda sale entera. Fracaso: cambiar la conducta de un merge que hoy sale bien.

## Scope

- Entra: los puntos 2 a 9 de ✋, y los puntos 1 y 10 como descartes con su motivo.
- No entra: la edición de `merge-recipe.md` (punto 1); un doble de git para probar `ls-remote` (punto 10).

## Lo que se retira o cambia de forma

| Qué | Dónde aparece | Destino |
| --- | --- | --- |
| La lista de opciones que rechaza `--sync` | `capabilities/control-profiles.md`, «El merge de sincronización lo hace `sdd merge --sync`» | delta `MODIFIED` (añade `--branch`) |
| Reexport de `isRegistry` en `exits.ts` | `cli/src/merge/exits.ts`, `cli/test/merge/exits.test.ts` | Scope, punto 8 |

- Filas que implementa: la fila de deuda «Menores diferidos de la feature 0193» → `.docs/sdd/roadmap.md`, saldada al cerrar. Comprobado con `grep -rn "Menores diferidos de la feature 0193" .docs skills`: solo aparece en el roadmap.

## Approach

Cada caso de borde, con su test RED en el fichero de tests que ya lo cubre, y el arreglo en la función que lo produce. La limpieza va al final, con la suite de `test/merge` en verde antes y después.

## Dónde se prueba

- Etiqueta sin consultar, remotos con uno sin remoto, `--prune` de las releases y `--check` sin fetch: `hotfix.slow.test.ts`.
- HEAD desacoplado, `--branch`, `MERGE_HEAD` aislado y el error de git sin conflictos: `sync.slow.test.ts` y `usage.test.ts`.
- Avisos solo con el merge hecho: `registries.slow.test.ts` y `mergiraf.slow.test.ts`.
- `dedupeRows` y la cabecera sin id: `keyed.test.ts`.

## Términos y ADR

- Términos resueltos: ninguno
- ADR candidatas: ninguna

## Delta de comportamiento

### Capacidad: `control-profiles`

**MODIFIED — Un merge del cierre que falla deja la rama destino como estaba**
- GIVEN un merge del cierre que falla: conflicto que no es el del log, verificación en rojo, push rechazado o error de git
- WHEN el script termina
- THEN la rama destino local vuelve al commit que tenía antes de fusionar la feature; no se empuja nada; el worktree temporal se ha retirado y el cerrojo está libre
- AND el script sale con error y nombra el paso que falló y el motivo
- AND si un hook rechaza el merge y no hay ficheros en conflicto, el motivo es `verificación: el hook rechazó el merge.` seguido de las últimas 20 líneas de la salida del hook, no un conflicto
- AND si `git merge` falla sin conflictos y sin llegar a preparar el merge (un fichero sin seguimiento que sobrescribiría, una opción que su versión no admite), el motivo es `<paso>: git merge falló sin conflictos.` seguido de las últimas 20 líneas de su salida, no un rechazo del hook
- AND si la verificación falla porque un fichero lo tiene abierto otro proceso, el motivo es `bloqueado: '<fichero>' lo tiene abierto <proceso>` (el que nombre la salida del gate, u «otro proceso») y la ruta del log, no `verificación:`
- AND si `--verify` sale en rojo, el mismo comando corre sobre el commit de antes del merge y el error acaba con `base: en rojo: el mismo comando también falla sin la rama (salida en <log>); mira la deuda del proyecto antes de investigar` o con `base: en verde: el rojo lo trae la rama`; tras un `bloqueado:` o un rechazo del hook no corre

**MODIFIED — Los registros se unen por id**
- GIVEN `develop` y la rama que se fusiona, que en el mismo trozo de `.docs/sdd/roadmap.md` (o de `ROADMAP.md`, `CHANGELOG.md`, `.docs/sdd/changelog.md` o `.docs/sdd/steering/debt.md`) marcan una la fila `0190` como `✅` y añaden la otra la fila `0201` debajo
- WHEN el cierre ejecuta `sdd merge`
- THEN el trozo queda con la `0190` en `✅` y la `0201`, sin conflicto
- AND si las dos ramas añaden la misma fila `0201` con el mismo texto, queda una sola
- AND si añaden dos filas `0201` con texto distinto, se quedan las dos, la de la rama destino primero, y la salida dice `registros: dos filas distintas con el id '0201' en .docs/sdd/roadmap.md; se quedan las dos, revísalas`
- AND una entrada `- **Feature 0185** — …` en `### Added` y otra en `### Changed` son ids distintos
- AND si las dos ramas cambian de forma distinta la misma fila que ya estaba en la base, es conflicto y lo resuelve una persona
- AND si el merge se aborta después por otro fichero en conflicto, la salida no dice `registros: …`

**MODIFIED — Mergiraf resuelve lo que queda si está instalado**
- GIVEN dos ramas que añaden cada una un método distinto en el mismo sitio de `src/rooms.ts` y `mergiraf` en el `PATH`
- WHEN el merge deja ese fichero en conflicto tras unir los registros y los trozos que solo añaden
- THEN el script ejecuta `mergiraf solve src/rooms.ts`, escribe `mergiraf: resuelto src/rooms.ts`, commitea el merge y corre `--verify` sobre el resultado
- AND si `mergiraf solve` sale con otro código, escribe `mergiraf: no resuelve src/rooms.ts`, aborta el merge y falla como hoy con el fichero en la lista de `conflicto en`
- AND sin `mergiraf` en el `PATH` no escribe nada de Mergiraf y falla como hoy
- AND el script no escribe `git config` ni `.gitattributes`
- AND si resuelve `src/rooms.ts` pero otro fichero queda en conflicto, aborta y no escribe `mergiraf: resuelto src/rooms.ts`

**MODIFIED — El merge de sincronización lo hace `sdd merge --sync`**
- GIVEN la rama `feature/0186-x` con su commit de cierre, y `origin/develop` con la 0185 fusionada, que, como la rama, añade un requisito al final de `.docs/sdd/capabilities/routing.md` y una fila al roadmap
- WHEN se ejecuta `sdd merge --sync --project-root <worktree de la 0186>`
- THEN integra `origin/develop` en `feature/0186-x` con la misma resolución que el merge del cierre, sin coger el cerrojo, sin `--verify` y sin push; la capacidad queda con los dos requisitos (primero el de `develop`) y el roadmap con las dos filas, y escribe `base: integrada 'origin/develop' en 'feature/0186-x': <hash>`
- AND si `origin/develop` ya es antecesora de la rama, no hace nada y escribe `base: al día: 'origin/develop' ya está en 'feature/0186-x'`
- AND con un conflicto que no resuelve, aborta el merge, deja la rama como estaba y sale con 1 con `base: conflicto en <ficheros>.`
- AND con cambios sin commitear, o con otro merge a medias, sale con 1 sin tocar nada: `base: 'feature/0186-x' tiene cambios sin commitear; commitéalos antes de integrar la base`
- AND en un HEAD desacoplado sale con 1 sin tocar nada: `base: HEAD desacoplado; --sync integra la base en una rama`
- AND con `--into`, `--tag`, `--order`, `--push`, `--verify`, `--verified-at`, `--check` o `--branch` sale con 2: `--sync no admite <opción>`
- REMOVED AND con cambios sin commitear sale con 1 sin tocar nada: `base: 'feature/0186-x' tiene cambios sin commitear; commitéalos antes de integrar la base`
- REMOVED AND con `--into`, `--tag`, `--order`, `--push`, `--verify`, `--verified-at` o `--check` sale con 2: `--sync no admite <opción>`

**MODIFIED — Un hotfix se fusiona en la rama estable, se etiqueta y vuelve a la integración**
- GIVEN `merge.into: develop`, la rama `hotfix/0200-fix-login` salida de `main` y ninguna `release/*` abierta
- WHEN se ejecuta `sdd merge --branch hotfix/0200-fix-login --into main --tag v3.0.1 --order "fusiona el hotfix del login en main" --push`
- THEN bajo un solo cerrojo fusiona la rama en `main` con `--no-ff` y el commit `merge: hotfix/0200-fix-login en main` con la línea `Orden del dev-lead: «fusiona el hotfix del login en main»`, crea la etiqueta anotada `v3.0.1` en ese commit, fusiona la misma rama en `develop` con `--no-ff`, y publica `main`, `develop` y `v3.0.1` en un solo push atómico
- AND escribe `Fusionado hotfix/0200-fix-login en main: <hash>`, `etiqueta v3.0.1 en <hash>`, `Fusionado hotfix/0200-fix-login en develop: <hash>` y `publicado en origin`
- AND con `release/3.1.0` abierta en `origin` (no antecesora de `main`), la vuelta va a `release/3.1.0` y no a `develop`; con dos abiertas en `origin` tras el fetch de `release/*` que hace el script, falla antes de sincronizar ni fusionar nada con `vuelta: hay varias ramas release/ abiertas (release/3.1.0, release/3.2.0); fusiona a mano`; una `release/` solo local no cuenta si hay remoto
- AND una `release/3.2.0` que se borró en `origin` no cuenta como abierta aunque su ref de seguimiento siguiera en local antes del fetch
- AND `--check` decide la vuelta con los refs de seguimiento que ya hay, sin fetch: no crea ni mueve ninguno
- AND una rama `release/3.1.0` con `--into main` vuelve a `develop`
- AND `--into main` sin `--order` sale con 2 con `--into 'main' distinta de merge.into necesita --order "<frase del dev-lead>"`; `--tag` sin ese `--into`, con `--tag solo con --into a la rama estable`; `--tag 'v3.0.1 beta'`, con `--tag: 'v3.0.1 beta' no es un nombre de etiqueta válido`, antes del cerrojo; y una etiqueta que ya existe falla sin tocar nada con `--tag: ya existe 'v3.0.1'`, o con `--tag: ya existe 'v3.0.1' en 'origin'` si solo existe en el remoto
- AND si no se pueden consultar las etiquetas del remoto, falla sin tocar nada, también con `--check`, con `--tag: no se pudo consultar las etiquetas de 'origin'`

**MODIFIED — Un hotfix cuya vuelta falla se deshace entero**
- GIVEN un hotfix que se fusiona en `main` y cuya vuelta a `develop` tiene un conflicto en `skills/x/SKILL.md` en el que los dos lados cambian la misma línea
- WHEN el script llega a la vuelta
- THEN deshace la vuelta, el merge en `main` y la etiqueta, no publica nada y falla con `vuelta: conflicto en skills/x/SKILL.md; se deshacen el merge en 'main' y la etiqueta: porta el arreglo a 'develop' a mano`
- AND con la verificación de la vuelta en rojo, deshace lo mismo y da el error de verificación con su línea `base:`
- AND si el push atómico se rechaza porque `main` o `develop` avanzaron en el remoto, deshace lo mismo y falla con `push: 'main' o 'develop' avanzó en 'origin'; relanza el hotfix`
- AND si `main` y la rama de vuelta tienen remotos distintos, falla antes de tocar nada con `push: 'main' y 'develop' tienen remotos distintos ('origin', 'upstream'); fusiona a mano`; y si no se puede consultar la vuelta en el remoto, con `vuelta: no se pudo consultar 'develop' en 'origin'`
- AND si una de las dos no tiene remoto, el mensaje dice `sin remoto` en su lugar: `push: 'main' y 'develop' tienen remotos distintos ('origin', sin remoto); fusiona a mano`

### Estimación y esfuerzo

- Tipo: infra/tooling
- Esfuerzo spec: 0,5 h
- Estimación de implementación: 2,5 h
- Base de la estimación: 18 menores, 8 con test nuevo y el resto limpieza; la 0193 salió en el 32 % de lo estimado
- Confianza: media

## Enmiendas

## Aprobaciones

| Nombre | Fecha | Estado |
| --- | --- | --- |
| Àngel Delgado | 2026-10-19 | aprobada (opción «Apruebo») |
