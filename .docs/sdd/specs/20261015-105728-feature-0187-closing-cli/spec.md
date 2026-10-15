---
id: 20261015-105728-feature-0187-closing-cli
feature: 0187
parent: 0149
proposal: 0131
title: CLI del cierre — `sdd merge` para el hotfix, el destino sacado, la base en rojo, la suite una vez y el push que reintenta
mode: full
profile: delegate
status: approved
created: 2026-10-15
author: Claude (Opus 5.5)
approvers:
  - role: dev-lead
    name: Àngel Delgado
    approved_at: 2026-10-15
---

# Spec — CLI del cierre: `sdd merge` para el hotfix, el destino sacado, la base en rojo, la suite una vez y el push que reintenta

🦆 Cuando el agente fusione una feature, `sdd merge` dará más información y se atascará menos. Si `develop` tiene un cambio tuyo a medio guardar, el mensaje te dice qué es y te da tres caminos, y el agente lo puede comprobar antes de pedirte la validación. Los tests no se repiten si desde la última pasada solo cambiaron documentos. Si fallan, el merge mira si ya fallaban en `develop` sin la feature. Si alguien publica en `develop` mientras tanto, el merge lo junta y reintenta hasta 3 veces. Y un arreglo urgente `hotfix/0200-x` se fusiona en `main`, se etiqueta `v3.0.1` y vuelve a `develop` con un solo comando que lleva tu orden escrita, como manda git-flow.

## Capacidades

- Modificadas: `control-profiles` — el destino sacado da el `diff --stat`, el motivo y tres salidas; el merge que falla en la verificación dice si la base también falla; ganan requisito la comprobación del destino (`--check`), la suite que no se repite (`--verified-at`), el push que reintenta y el hotfix a la rama estable con su vuelta.

## ✋ Decisiones que he tomado yo — valida estas

```text
Review de spec propuesta: ninguna — señales: contrato público (las opciones y salidas de `sdd merge` las leerá la receta de `sdd-archive` de la 0149), MODIFIED (dos requisitos de `control-profiles`) · tamaño: ~600 líneas en ~12 ficheros de `cli/`
- Mínimo razonable: ninguna — deja sin mirar si un AND de los dos MODIFIED se pierde al reescribirlos; la pasada de coherencia los ha contrastado línea a línea con la capacidad
```

1. **Literales del destino sacado** — primera línea `destino sacado: el checkout de '<into>' en '<ruta>' tiene cambios sin commitear; el merge se haría encima de ellos, así que no se toca.`; después la salida de `git diff --stat HEAD` del checkout; los ficheros sin seguimiento en una línea `sin seguimiento: <ficheros separados por coma>`; y el bloque `Salidas:` con `1. Que quien los hizo los commitee (o los descarte) en '<ruta>', y relanzar el merge.`, `2. Llevarlos a la rama de la feature: solo tocan registros (roadmap, changelog, estimation-log).` y `3. Dejar el merge para luego.`
2. **«Registros»** son los tres documentos que la CLI ya resuelve en `cli/src/cli/layout.ts` (`roadmap.md`/`ROADMAP.md`, `changelog.md`/`CHANGELOG.md` y `estimation-log.md`). La salida 2 solo sale si todos los ficheros sucios, sin seguimiento incluidos, son uno de ellos; si no, las salidas se numeran `1.` y `2.` (commit y dejar para luego).
3. **`sdd merge --check`** no coge el cerrojo, no hace fetch y no escribe nada. Comprueba la política, cada destino que el merge tocaría (en un hotfix, la rama estable y la de vuelta) que la carpeta del worktree temporal esté libre y, en un hotfix, las negativas de los puntos 7, 8 y 10, con los refs remotos que ya hay. Sale con 0 y una línea por destino: `destino: listo: '<into>' sacado en '<ruta>', sin cambios` o `destino: listo: '<into>' irá en el worktree temporal '<ruta>'`. Si no, sale con 1 y el mensaje de destino sacado (o el de `ya existe` que hay hoy para la carpeta temporal).
4. **`--verified-at <sha>`**: «solo docs» es `git diff --quiet <sha> HEAD -- . ':!.docs' ':!*.md'` tras el merge, la regla que proponía la fila de deuda. Línea `verificación: omitida: desde <sha corto> solo cambian docs`. Un `<sha>` que no resuelve a un commit sale con 2 antes del cerrojo: `--verified-at: '<valor>' no es un commit`. Sin `--verify` no hace nada.
5. **Base en rojo**: tras deshacer el merge, el mismo `--verify` corre sobre el commit de antes del merge, con su propio log. Línea añadida al error: `base: en rojo: el mismo comando también falla sin la rama (salida en <log>); mira la deuda del proyecto antes de investigar` o `base: en verde: el rojo lo trae la rama`. No corre tras un `bloqueado:` ni tras un rechazo del hook: no son un rojo de la suite.
6. **Bucle del push: 3 intentos** de push en total, como decía la fila de la 0048 («unos 3 intentos»). Un push rechazado se reintenta solo si, tras un fetch, la rama remota ya no es antecesora de la local; cualquier otro rechazo es el `push: no se pudo publicar` de hoy. Cada reintento escribe `push: '<into>' avanzó en '<remoto>'; integro y reintento (<n>/3)`, integra el remoto como hoy al empezar, sus conflictos incluidos, y repite `--verify` con la regla del punto 4 contra el último commit verificado. Tras el tercero: `push: '<into>' sigue moviéndose en '<remoto>' tras 3 intentos; relanza el merge en un rato`, con la rama destino como estaba.
7. **Opciones del hotfix**: `--into <rama>` (rama de destino en lugar de `merge.into`), `--order "<frase>"` y `--tag <nombre>`. Con `--into` distinto de `merge.into`, sin `--order` sale con 2: `--into '<rama>' distinta de merge.into necesita --order "<frase del dev-lead>"`. `--tag` sin un `--into` distinto de `merge.into` sale con 2: `--tag solo con --into a la rama estable`. Una etiqueta que ya existe falla antes de tocar nada: `--tag: ya existe '<nombre>'`.
8. **Git-flow: a la rama estable solo llegan `hotfix/` y `release/`**. Con otra rama: `--into: a '<into>' solo llegan ramas hotfix/ o release/ (git-flow); '<rama>' no lo es`, sale con 1 y no toca nada. El kit no tiene una clave de «rama estable»: la estable es la que nombra `--into` cuando no es `merge.into`.
9. **Commit de la rama estable**: título `merge: <rama> en <into>`, cuerpo `Orden del dev-lead: «<frase>»` y `Fusión hecha con sdd merge (sdd-kit).`, siempre `--no-ff` (git-flow) aunque `merge.noFf` sea `false`. Etiqueta anotada en ese commit con el mensaje `<tag> — <rama>`.
10. **La vuelta**: git-flow fusiona la propia rama `hotfix/` en la release abierta si la hay, y si no en `merge.into`; una rama `release/` vuelve siempre a `merge.into`. «Release abierta» es una rama `release/*`, local o del remoto de `--into`, que no es antecesora de `--into` tras el fetch. Con más de una abierta, falla antes de tocar nada: `vuelta: hay varias ramas release/ abiertas (<lista>); fusiona a mano`. Commit `merge: <rama> en <destino de vuelta>`, `--no-ff`, con la misma línea `Orden del dev-lead`.
11. **Todo o nada en el hotfix**: si la vuelta tiene conflicto que no son líneas añadidas, o su verificación falla, se deshacen la vuelta, el merge de la rama estable y la etiqueta, y no se publica nada: `vuelta: conflicto en <ficheros>; se deshacen el merge en '<into>' y la etiqueta: porta el arreglo a '<destino de vuelta>' a mano`. La alternativa (dejar la estable hecha sin publicar) se descarta: deja un estado a medias que se olvida.
12. **El push del hotfix** sale en un solo `git push --atomic <remoto> <into> <destino de vuelta> refs/tags/<tag>`, con el remoto de `--into`, y lo autoriza la orden, no `merge.push`. *shortcut*: sin bucle; si el remoto avanzó, se deshace todo y falla con `push: '<into>' o '<destino de vuelta>' avanzó en '<remoto>'; relanza el hotfix`. Pasará a bucle si un hotfix lo sufre en campo.
13. **Salida del hotfix**: `Fusionado <rama> en <into>: <hash>`, `etiqueta <tag> en <hash>`, `Fusionado <rama> en <destino de vuelta>: <hash>` y, con `--push`, `publicado en <remoto>`.
14. **Fuera de las skills**: `skills/sdd-end-feature/references/merge-recipe.md` y `skills/sdd-end-patch` siguen describiendo `sdd merge` como hoy. La receta que nombra `--check`, `--verified-at`, `--into` y las tres salidas es la de `sdd-archive`, en la 0149; todas las opciones nuevas son opcionales y lo de hoy funciona igual.
15. **El punto (f) de la fila** (`capability check` por artefacto y los punteros raíz → plantilla) sale a la feature **0191**, reservada con `sdd id next --reserve`, con su fila en el roadmap y una línea en las Enmiendas de la propuesta 0131.

### Decisiones tomadas con el dev-lead

- Va antes de la 0149, porque la receta de `sdd-archive` describe sus salidas — dev-lead, 2026-10-15, en el prompt de arranque.
- Solo CLI, con tests Vitest; los que crean repos o lanzan procesos van en `*.slow.test.ts` — prompt de arranque.
- `sdd merge --into <rama>` hace merge, tag y vuelta a la integración con un solo comando y registra la orden del dev-lead — prompt de arranque.
- `destino sacado:` da el `diff --stat`, el motivo en una frase y tres salidas — prompt de arranque.
- Antes del bucle del push, mirar si `--push` ya lo cubre — comprobado: no, `pushDestination` hace un push simple y un rechazo deshace el merge (`cli/src/merge/steps.ts`).
- Partir: el punto (f) va a una feature propia — «Partir (Recomendada)», 2026-10-15.
- Diseño de las cuatro secciones aceptado — «si», «sí», «ok!», 2026-10-15.
- El hotfix sigue git-flow — «al final todo esto tiene que seguir la normativa de git-flow», 2026-10-15: vuelta con la rama del hotfix, a la release abierta si la hay, solo `hotfix/` y `release/` llegan a la estable.

## Intent

Hoy `sdd merge` solo sabe fusionar en `merge.into`. Los tickets de campo cuentan cuatro fricciones. Un `destino sacado:` que no dice qué hacer (dos tickets de document-manager). La suite corre otra vez en el merge aunque solo cambiaron docs (~4 min con el usuario esperando). Un rojo ajeno se investiga 25 minutos sin saber que la base ya fallaba. Y el hotfix 2.3.4 se fusionó en `main`, se etiquetó y volvió a `develop` a mano y sin cerrojo. Además, un push rechazado porque la integración avanzó deshace el merge entero. El éxito: cada uno de esos casos sale del comando con una línea que dice qué pasó y qué hacer, sin que el agente relance nada para entenderlo, y el hotfix entero va en un comando bajo el cerrojo. Fracasaría si una opción nueva cambiara lo que hacen hoy las llamadas sin ella.

## Scope

- Entra: el mensaje nuevo de destino sacado y `--check`; `--verified-at`; la línea `base:` tras una verificación en rojo; el bucle del push; `--into`, `--order` y `--tag` con la vuelta de git-flow; sus tests Vitest; el delta de `control-profiles`; la fila 0191 del roadmap y la enmienda de la propuesta 0131; las filas de deuda que salda (marca de cierre, en el cierre).
- No entra: el punto (f), que pasa a la 0191. Las skills (`merge-recipe.md`, `sdd-end-feature`, `sdd-end-patch`): las reescribe la 0149. Borrar la rama del hotfix al terminar, que git-flow hace y el kit no hace con ninguna rama. Que el agente ejecute una de las tres salidas del destino sacado. Una clave de configuración para la rama estable. Comparar las incidencias de la base con las de la rama, propuesta sin verificar de la fila del rojo ajeno; la 0149 se queda con su parte de receta.

## Approach

La CLI sigue la estructura de `cli/src/merge/`: el cerrojo envuelve todo y `withDestination` da el checkout de cada destino. `integrate` gana tres piezas: el salto de la verificación, la pasada sobre la base en rojo y el bucle del push. El hotfix compone dos `integrate` bajo el mismo cerrojo, la rama estable y después la vuelta, con la etiqueta en medio, y un deshacer que cubre las dos. `--check` reutiliza las comprobaciones de `withDestination` sin crear worktree. Las opciones nuevas solo actúan si se pasan.

## Dónde se prueba

- Destino sacado con `diff --stat` y salidas, y `--check`: repos reales en `cli/test/merge/failures.slow.test.ts` y un `destination.slow.test.ts` nuevo, como los tests de destino sacado de hoy; el texto del bloque de salidas, con una función pura en un `*.test.ts`.
- `--verified-at` y la base en rojo: `cli/test/merge/verify.slow.test.ts`, con un `--verify` que falla según un fichero del árbol, como los tests de verificación de hoy.
- El bucle del push: `lock-and-base.slow.test.ts`, con un remoto bare que avanza desde un `--verify` que hace push desde otro clon, y uno que avanza siempre para agotar los 3 intentos.
- El hotfix: un `hotfix.slow.test.ts` nuevo con `main`, `develop`, una `release/` abierta o no y un remoto bare: merge, etiqueta, vuelta, push atómico, la negativa de git-flow y el todo o nada.
- Las opciones y sus salidas con 2: `cli/test/merge/usage.test.ts`.

## Términos y ADR

- Términos resueltos: **rama estable** — la que nombra `--into` cuando no es `merge.into` (`main` en git-flow); **vuelta** — el merge de la rama del hotfix en la release abierta o en `merge.into`; **registros** — `roadmap`, `changelog` y `estimation-log`.
- ADR candidatas: el hotfix todo o nada — alternativa descartada: dejar la rama estable fusionada y etiquetada sin publicar cuando la vuelta tiene conflicto.

## Delta de comportamiento

### Capacidad: `control-profiles`

**MODIFIED — Con la rama destino sacada y con cambios sin commitear, el cierre no fusiona** (antes: "THEN no fusiona ahí: dice qué ficheros tienen cambios y para")

- GIVEN la rama destino sacada en un worktree con cambios sin commitear
- WHEN el cierre va a fusionar
- THEN no fusiona ahí y sale con 1 con `destino sacado: el checkout de '<into>' en '<ruta>' tiene cambios sin commitear; el merge se haría encima de ellos, así que no se toca.`, el `git diff --stat HEAD` del checkout, `sin seguimiento: <ficheros>` si los hay, y el bloque `Salidas:` (commit de quien los hizo y relanzar, llevarlos a la feature y dejar el merge para luego)
- AND la salida «Llevarlos a la rama de la feature: solo tocan registros (roadmap, changelog, estimation-log).» solo aparece si todos los ficheros sucios son `roadmap.md`, `changelog.md` o `estimation-log.md`; con `.gitignore` modificado, las salidas son dos
- AND no hace `stash`, `reset` ni commit de lo ajeno

**ADDED — La comprobación del destino no toca nada**
- GIVEN un worktree de feature y `develop` sacada en el checkout principal con `roadmap.md` modificado
- WHEN se ejecuta `node sdd.js merge --check --project-root <worktree>`
- THEN sale con 1 con el mismo mensaje de destino sacado que daría el merge, sin coger el cerrojo, sin fetch y sin cambiar ningún ref, índice ni fichero
- AND con el checkout limpio sale con 0 y `destino: listo: 'develop' sacado en '<ruta>', sin cambios`; sin `develop` sacada, con `destino: listo: 'develop' irá en el worktree temporal '<ruta>'`

**MODIFIED — Un merge del cierre que falla deja la rama destino como estaba** (antes: sin la línea `base:`)

- GIVEN un merge del cierre que falla: conflicto que no es el del log, verificación en rojo, push rechazado o error de git
- WHEN el script termina
- THEN la rama destino local vuelve al commit que tenía antes de fusionar la feature; no se empuja nada; el worktree temporal se ha retirado y el cerrojo está libre
- AND el script sale con error y nombra el paso que falló y el motivo
- AND si un hook rechaza el merge y no hay ficheros en conflicto, el motivo es `verificación: el hook rechazó el merge.` seguido de las últimas 20 líneas de la salida del hook, no un conflicto
- AND si la verificación falla porque un fichero lo tiene abierto otro proceso, el motivo es `bloqueado: '<fichero>' lo tiene abierto <proceso>` (el que nombre la salida del gate, u «otro proceso») y la ruta del log, no `verificación:`
- AND si `--verify` sale en rojo, el mismo comando corre sobre el commit de antes del merge y el error acaba con `base: en rojo: el mismo comando también falla sin la rama (salida en <log>); mira la deuda del proyecto antes de investigar` o con `base: en verde: el rojo lo trae la rama`; tras un `bloqueado:` o un rechazo del hook no corre

**ADDED — La suite no se repite si desde el commit verificado solo cambian docs**
- GIVEN una feature cuyo gate de cierre pasó en el commit `a1b2c3d` y una rama destino que desde entonces solo avanzó en `.docs/sdd/roadmap.md`
- WHEN el cierre ejecuta `sdd merge --verify "<gate>" --verified-at a1b2c3d`
- THEN no ejecuta `<gate>` y escribe `verificación: omitida: desde a1b2c3d solo cambian docs`
- AND si desde `a1b2c3d` cambió cualquier fichero fuera de `.docs/` que no sea `*.md`, de la rama o de la base, ejecuta `<gate>` como sin la opción
- AND `--verified-at nada` sale con 2 y `--verified-at: 'nada' no es un commit`, sin coger el cerrojo

**ADDED — El push del cierre reintenta si la rama destino avanzó**
- GIVEN `sdd merge --push` y un remoto en el que otra sesión publica `develop` mientras corre `--verify`
- WHEN el push se rechaza y, tras un fetch, la `develop` remota ya no es antecesora de la local
- THEN escribe `push: 'develop' avanzó en 'origin'; integro y reintento (2/3)`, integra la `develop` remota como al empezar, repite `--verify` salvo que desde el último commit verificado solo cambien docs, y vuelve a empujar
- AND tras el tercer push rechazado falla con `push: 'develop' sigue moviéndose en 'origin' tras 3 intentos; relanza el merge en un rato` y la rama destino como estaba
- AND un rechazo con la remota todavía antecesora (credenciales, hook del servidor) falla como hoy con `push: no se pudo publicar 'develop' en 'origin'.`, sin reintentar

**ADDED — Un hotfix se fusiona en la rama estable, se etiqueta y vuelve a la integración**
- GIVEN `merge.into: develop`, la rama `hotfix/0200-fix-login` salida de `main` y ninguna `release/*` abierta
- WHEN se ejecuta `sdd merge --branch hotfix/0200-fix-login --into main --tag v3.0.1 --order "fusiona el hotfix del login en main" --push`
- THEN bajo un solo cerrojo fusiona la rama en `main` con `--no-ff` y el commit `merge: hotfix/0200-fix-login en main` con la línea `Orden del dev-lead: «fusiona el hotfix del login en main»`, crea la etiqueta anotada `v3.0.1` en ese commit, fusiona la misma rama en `develop` con `--no-ff`, y publica `main`, `develop` y `v3.0.1` en un solo push atómico
- AND escribe `Fusionado hotfix/0200-fix-login en main: <hash>`, `etiqueta v3.0.1 en <hash>`, `Fusionado hotfix/0200-fix-login en develop: <hash>` y `publicado en origin`
- AND con `release/3.1.0` abierta (no antecesora de `main`), la vuelta va a `release/3.1.0` y no a `develop`; con dos abiertas falla antes de tocar nada con `vuelta: hay varias ramas release/ abiertas (release/3.1.0, release/3.2.0); fusiona a mano`
- AND una rama `release/3.1.0` con `--into main` vuelve a `develop`
- AND `--into main` sin `--order` sale con 2 con `--into 'main' distinta de merge.into necesita --order "<frase del dev-lead>"`; `--tag` sin ese `--into`, con `--tag solo con --into a la rama estable`; y una etiqueta existente falla con `--tag: ya existe 'v3.0.1'` sin tocar nada

**ADDED — A la rama estable solo llegan ramas hotfix y release**
- GIVEN la rama `patch/0201-typo`
- WHEN se ejecuta `sdd merge --branch patch/0201-typo --into main --order "llévalo a main"`
- THEN sale con 1 con `--into: a 'main' solo llegan ramas hotfix/ o release/ (git-flow); 'patch/0201-typo' no lo es`, sin coger el cerrojo ni tocar ningún ref

**ADDED — Un hotfix cuya vuelta falla se deshace entero**
- GIVEN un hotfix que se fusiona en `main` y cuya vuelta a `develop` tiene un conflicto en `skills/x/SKILL.md` en el que los dos lados cambian la misma línea
- WHEN el script llega a la vuelta
- THEN deshace la vuelta, el merge en `main` y la etiqueta, no publica nada y falla con `vuelta: conflicto en skills/x/SKILL.md; se deshacen el merge en 'main' y la etiqueta: porta el arreglo a 'develop' a mano`
- AND con la verificación de la vuelta en rojo, deshace lo mismo y da el error de verificación con su línea `base:`
- AND si el push atómico se rechaza porque `main` o `develop` avanzaron en el remoto, deshace lo mismo y falla con `push: 'main' o 'develop' avanzó en 'origin'; relanza el hotfix`

**Reglas de la capacidad**
- **Límites**: `control.maxParallelAgents` 3 por defecto; su conducta la aplica `sdd-parallel-agents` (requisito «Dos revisores de spec se despachan con `sdd-parallel-agents`» de `feature-flow`). `control.silence` 8 y 20 minutos por defecto: 20 (`longCommandMinutes`) si la llamada que espera el subagente es un comando de shell o si se vigila la salida de una verificación lenta, y 8 (`betweenStepsMinutes`) en cualquier otra espera; un subagente colgado se relanza una sola vez (requisitos de `feature-flow`). Umbral para proponer partir una feature: más de 5 tasks internas previstas, o 4 o 5 que tocan capacidades o superficies distintas o llevan migración; con 3 o menos, nunca. Checkpoint de alcance: en el 3.º fix descubierto de una feature y en cada tercero después. `sdd merge --push`: 3 intentos de push como máximo cuando la rama destino avanza en el remoto; el push de un hotfix, uno.

## Enmiendas

## Aprobaciones

| Rol | Nombre | Fecha | Estado |
| --- | --- | --- | --- |
| dev-lead | Àngel Delgado | 2026-10-15 | aprobada: «Apruebo (Recomendada)» |
