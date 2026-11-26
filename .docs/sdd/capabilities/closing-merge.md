# Capacidad — closing-merge

## Propósito

El merge del cierre con `sdd merge`: la política declarada, el destino, el turno, el push y sus fallos, la verificación del merge y el merge de sincronización.

## Requisitos

### El merge a develop sigue la política declarada

- GIVEN una feature o un patch validados (o diferidos) y un bloque `merge` completo (`into`, `noFf`, `removeWorktree`) en `sdd-kit.json`
- WHEN el agente llega al paso del merge de `sdd-archive`
- THEN en `delegate` y `unattended` aplica la política sin preguntar: fusiona en `merge.into`, con `--no-ff` si `merge.noFf` es `true`; en `pair` la presenta y espera
- AND con el bloque ausente o incompleto pregunta como hoy; nunca fusiona a `main` ni etiqueta salvo en un hotfix con la frase del dev-lead en `--order`
- AND el bloque autoriza el merge, no la validación: `sdd-archive` no arranca sin la validación registrada, y en `pair` y `delegate` `sdd-validate` para con el smoke y la pregunta de validación antes de invocarlo
- AND en cualquier perfil, con la CI de la base en `failure` no fusiona («Antes del merge, el cierre lee la CI de la base y no fusiona sobre un rojo», en `archive`)

### Sin la rama destino sacada, el merge va en un worktree temporal junto a los demás

- GIVEN un repo en el que `git worktree list` no muestra la rama destino sacada en ningún worktree
- WHEN el cierre fusiona
- THEN crea un worktree temporal de la rama destino en la carpeta que contiene el worktree de la feature, con nombre `merge-<id>`, fusiona allí y lo retira con `git worktree remove` antes de terminar
- AND el worktree de la feature sigue en su rama, el temporal no se crea en el scratchpad, en `%TEMP%` ni con `mktemp`, y ningún commit usa `--no-verify`
- AND un registro de worktree cuya carpeta ya no existe no cuenta como rama destino sacada: el cierre lo poda con `git worktree prune` antes de buscarla y otra vez al retirar el temporal, y no deja ninguno *prunable*

### Con la rama destino sacada y con cambios sin commitear, el cierre no fusiona

- GIVEN la rama destino sacada en un worktree con cambios sin commitear
- WHEN el cierre va a fusionar
- THEN no fusiona ahí y sale con 1 con `destino sacado: el checkout de '<into>' en '<ruta>' tiene cambios sin commitear; el merge se haría encima de ellos, así que no se toca.`, el `git diff --stat HEAD` del checkout, `sin seguimiento: <ficheros>` si los hay, y el bloque `Salidas:` (commit de quien los hizo y relanzar, llevarlos a la feature y dejar el merge para luego)
- AND la salida «Llevarlos a la rama de la feature: solo tocan registros (roadmap, changelog, deuda, estimation-log).» solo aparece si todos los ficheros sucios son `.docs/sdd/roadmap.md`, `.docs/sdd/changelog.md`, `ROADMAP.md`, `CHANGELOG.md`, `.docs/sdd/steering/debt.md` o `estimation-log.md`; con `.gitignore` o un `docs/roadmap.md` modificados, las salidas son dos
- AND no hace `stash`, `reset` ni commit de lo ajeno

### Un merge que el entorno deniega se informa con su evidencia

- GIVEN una política que autoriza el merge y un entorno que lo deniega (clasificador del harness o hook)
- WHEN el cierre termina
- THEN el informe final cita en un bloque el comando denegado, literal; cita el texto de la denegación y el hash de la rama destino, que sigue sin tocar; y dice que el resto del cierre está hecho
- AND no reintenta el merge con otra herramienta ni con otra forma del comando

### El push de la rama de integración sigue `merge.push`

- GIVEN un cierre de feature o de patch que acaba de fusionar en `merge.into` según la política, con la suite en verde sobre el resultado, `merge.push: true` en `sdd-kit.json` y un upstream en `merge.into`
- WHEN el perfil vigente es `delegate` o `unattended`
- THEN el agente hace push de `merge.into` a su upstream sin preguntar, y no empuja ninguna otra rama ni tags

### Sin autorización, el push no lo hace el agente solo

- GIVEN un cierre de feature o de patch que acaba de fusionar en `merge.into`
- WHEN el perfil vigente es `pair`, `merge.push` está ausente o es `false`, o `merge.into` no tiene upstream
- THEN el agente no hace push sin confirmación: en `pair` presenta el push junto con el merge y espera; en los demás casos no lo hace
- AND el mensaje final dice que el push no se hizo y por qué

### Un push que no sale se informa y no se fuerza

- GIVEN `merge.push: true` y un push que falla: el remoto lo rechaza, faltan credenciales o el entorno lo deniega
- WHEN el cierre termina
- THEN el mensaje final cita en un bloque el comando literal, cita el error y dice que el merge queda en local con el hash de `merge.into`
- AND el agente no reintenta con `--force`, `pull` ni `rebase`, y un push que el remoto rechaza o el entorno deniega lo desbloquea una persona, sin otra herramienta ni otra forma de la orden
- AND un push cuya clave SSH falla, con `Permission denied (publickey)` y una sesión en `gh auth status`, se relanza una vez antes de informar: el mismo `sdd merge --push`, por HTTPS con el token de `gh`, con las claves solo en el entorno de esa orden (`GIT_CONFIG_COUNT=2`, `url.https://github.com/.insteadOf` con el prefijo `git@github.com:` del remoto y `credential.helper` con `!gh auth git-credential`), sin tocar `~/.ssh` ni `.gitconfig`; si publica, el mensaje final da el push como hecho y lleva `Push relanzado por HTTPS: Permission denied (publickey) por SSH`
- AND sin sesión de `gh`, o si el relanzamiento falla también, es un push que no sale: informa como arriba

### El merge del cierre espera su turno

- GIVEN dos cierres del mismo repo que fusionan en `merge.into` a la vez, desde worktrees distintos
- WHEN los dos ejecutan `sdd merge`
- THEN el segundo espera y dice quién tiene el cerrojo (rama y worktree); fusiona cuando el primero lo suelta, sobre la rama destino que dejó el primero
- AND si el cerrojo no se libera en `--lock-timeout`, el script falla nombrando al dueño y no toca nada; un cerrojo de un proceso que ya no existe en la misma máquina se toma, y el script lo dice

### El merge del cierre parte de la rama destino publicada

- GIVEN una rama destino con remoto que avanzó después de abrir la feature
- WHEN el cierre fusiona
- THEN antes de fusionar la feature, integra en la rama destino local los commits del remoto
- AND resuelve sus conflictos como el merge de la feature: regenera `estimation-log.md` con `sdd estimation log`, une los registros por id, une los trozos que solo añaden líneas por los dos lados (primero la rama destino), une los `THEN` y `AND` de un requisito de una capacidad y prueba Mergiraf si está instalado; con cualquier otro conflicto, falla con `base: conflicto en` y la lista de ficheros

### El push del cierre publica la rama destino

- GIVEN un merge del cierre cuyo push ha confirmado una persona o autoriza `merge.push` (perfil `delegate` o `unattended`)
- WHEN el script empuja
- THEN empuja la rama destino por su nombre (`git push <remoto> <destino>`), nunca `HEAD:<destino>`, y al terminar la rama local y la remota apuntan al mismo commit
- AND sin la confirmación ni `merge.push`, el script fusiona en local y no empuja
- AND si la rama destino no tiene remoto, el script fusiona en local, no empuja y acaba con `push: no hecho: sin remoto`, que el mensaje final del cierre cita

### Un merge del cierre que falla deja la rama destino como estaba

- GIVEN un merge del cierre que falla: conflicto que no es el del log, verificación en rojo, push rechazado o error de git
- WHEN el script termina
- THEN la rama destino local vuelve al commit que tenía antes de fusionar la feature; no se empuja nada; el worktree temporal se ha retirado y el cerrojo está libre
- AND la rama del cambio vuelve al commit que tenía antes de la integración que hizo el script, y su worktree queda en ella
- AND el script sale con error y nombra el paso que falló y el motivo
- AND si un hook rechaza el merge y no hay ficheros en conflicto, el motivo es `verificación: el hook rechazó el merge.` seguido de los tests fallidos y de las últimas 20 líneas de la salida del hook, no un conflicto
- AND con el hook o `--verify` en rojo, si la salida tiene líneas de un test fallido —`[-] se llama sdd-archive` de Pester, ` FAIL  test/a.test.ts > grupo > nombre` o `× nombre` de Vitest, también tras un prefijo de moon como `cli:test | `—, antes de la cola va `tests fallidos:` y esas líneas, en orden y hasta 20; sin ninguna, el mensaje no cambia
- AND si `git merge` falla sin conflictos y sin llegar a preparar el merge (un fichero sin seguimiento que sobrescribiría, una opción que su versión no admite), el motivo es `<paso>: git merge falló sin conflictos.` seguido de las últimas 20 líneas de su salida, no un rechazo del hook
- AND si la verificación falla porque un fichero lo tiene abierto otro proceso, el motivo es `bloqueado: '<fichero>' lo tiene abierto <proceso>` (el que nombre la salida del gate, u «otro proceso») y la ruta del log, no `verificación:`
- AND si `--verify` sale en rojo, corre otra vez, sin el cerrojo de merge, sobre la base integrada (`<remoto>/<destino>`), en el worktree del cambio desacoplado en ella, que vuelve después a su rama (en un hotfix, dentro del cerrojo y sobre el commit de antes del merge): con un gate `moon run … --affected`, los targets que corrió la pasada roja, como lista y sin `--affected`, y sin cruce, el gate sin `--affected`; y el error acaba con `base: en rojo: el mismo comando también falla sin la rama (salida en <log>); mira la deuda del proyecto antes de investigar` o con `base: en verde: el rojo lo trae la rama`; tras un `bloqueado:` o un rechazo del hook no corre

### La verificación del merge es el gate de merge, no la suite completa

- GIVEN un proyecto cuyo `steering/operations.md` §Testing separa un conjunto rápido de la suite completa
- WHEN el cierre fusiona con `sdd merge`
- THEN `--verify` es el conjunto rápido, que corre sobre la rama del cambio integrada con la base, antes del merge y del push; con una sola suite, es esa
- AND el gate de cierre ya corrió antes del script: al acabar las tasks y, si la base trajo cambios que cruzan la rama, tras el merge de sincronización del cierre; el mensaje final da su resultado y su sha
- AND si un hook `pre-merge-commit` del repo ya ejecuta el gate, `--verify` se omite; el gate de cierre no se omite nunca
- AND `--verify` no lleva las suites unitarias ni lee «Sin filtro»: los aplicó el gate de cierre

### La comprobación del destino no toca nada

- GIVEN un worktree de feature y `develop` sacada en el checkout principal con `roadmap.md` modificado
- WHEN se ejecuta `node sdd.js merge --check --project-root <worktree>`
- THEN sale con 1 con el mismo mensaje de destino sacado que daría el merge, sin coger el cerrojo, sin fetch y sin cambiar ningún ref, índice ni fichero
- AND con el checkout limpio sale con 0 y `destino: listo: 'develop' sacado en '<ruta>', sin cambios`; sin `develop` sacada, con `destino: listo: 'develop' irá en el worktree temporal '<ruta>'`

### La suite no se repite si desde el commit verificado solo cambian docs

- GIVEN una feature cuyo gate de cierre pasó en el commit `a1b2c3d` y una rama destino que desde entonces solo avanzó en `.docs/sdd/roadmap.md`
- WHEN el cierre ejecuta `sdd merge --verify "<gate>" --verified-at a1b2c3d`
- THEN no ejecuta `<gate>` y escribe `verificación: omitida: desde a1b2c3d solo cambian docs`
- AND si desde `a1b2c3d` cambió cualquier fichero fuera de `.docs/` que no sea `*.md`, de la rama o de la base, ejecuta `<gate>`, y con un gate `moon run … --affected`, solo lo que se cruza; también si Mergiraf resolvió algún fichero, que tocaron los dos lados
- AND `--verified-at nada` sale con 2 y `--verified-at: 'nada' no es un commit`, sin coger el cerrojo

### El push del cierre reintenta si la rama destino avanzó

- GIVEN `sdd merge --push` y un remoto en el que otra sesión publica `develop` entre el merge y el push
- WHEN el push se rechaza y, tras un fetch, la `develop` remota ya no es antecesora de la local
- THEN escribe `push: 'develop' avanzó en 'origin'; integro y reintento (2/3)`; sin `--verify`, integra la `develop` remota en la local y vuelve a empujar; con `--verify`, deshace el merge, suelta el cerrojo y repite fuera de él la integración en la rama y la verificación, como en «La verificación del merge corre fuera del cerrojo de merge»
- AND en el reintento con `--verify` y un gate `moon run … --affected`, corre solo lo que toca la rama y también tocó lo que llegó desde el último commit verificado, que es la punta de la rama integrada que pasó la pasada anterior
- AND si otra sesión publica `develop` mientras corre `--verify`, el reintento lo da el merge, con `merge: 'develop' cambió durante la verificación; …`, no el push
- AND tras el tercer push rechazado falla con `push: 'develop' sigue moviéndose en 'origin' tras 3 intentos; relanza el merge en un rato` y la rama destino como estaba
- AND un rechazo con la remota todavía antecesora (credenciales, hook del servidor) falla con `push: no se pudo publicar 'develop' en 'origin'.` y, en las líneas siguientes, lo que escribió `git push` (`remote: rama protegida`), sin reintentar; el push atómico de un hotfix, igual

### El merge de sincronización lo hace `sdd merge --sync`

- GIVEN la rama `feature/0186-x` con su commit de cierre, y `origin/develop` con la 0185 fusionada, que, como la rama, añade un requisito al final de `.docs/sdd/capabilities/routing.md` y una fila al roadmap
- WHEN se ejecuta `sdd merge --sync --project-root <worktree de la 0186>`
- THEN integra `origin/develop` en `feature/0186-x` con la misma resolución que el merge del cierre, sin coger el cerrojo, sin `--verify` y sin push; la capacidad queda con los dos requisitos (primero el de `develop`) y el roadmap con las dos filas, y escribe `base: integrada 'origin/develop' en 'feature/0186-x': <hash>`
- AND si `origin/develop` ya es antecesora de la rama, no hace nada y escribe `base: al día: 'origin/develop' ya está en 'feature/0186-x'`
- AND con un conflicto que no resuelve, no aborta: deja el merge a medias, con lo que sí resuelve —los registros unidos por id— ya en el índice, y sale con 1 con `base: conflicto en <ficheros>.`, que lista solo lo que queda; con filas contiguas del roadmap y la misma línea de `steering/operations.md` editadas en los dos lados, el roadmap queda unido y solo `steering/operations.md` en conflicto
- AND con cambios sin commitear, o con otro merge a medias, sale con 1 sin tocar nada: `base: 'feature/0186-x' tiene cambios sin commitear; commitéalos antes de integrar la base`
- AND en un HEAD desacoplado sale con 1 sin tocar nada: `base: HEAD desacoplado; --sync integra la base en una rama`
- AND con `--into`, `--tag`, `--order`, `--push`, `--verify`, `--verified-at`, `--check` o `--branch` sale con 2: `--sync no admite <opción>`

### El push nombra los commits de la rama destino que no son del cambio

- GIVEN una `develop` local con `f5b76897 docs(roadmap): triaje` sin publicar en `origin`, y la rama `feature/0150-x` lista para fusionar
- WHEN el cierre ejecuta `sdd merge --push`
- THEN publica `develop` con ese commit y con el merge, y escribe `push: también publica 1 commit de 'develop' que no es de feature/0150-x:` y `- f5b76897 docs(roadmap): triaje`, antes de `publicado en origin`
- AND con dos commits así, `push: también publica 2 commits de 'develop' que no son de feature/0150-x:` y una línea `- <hash> <asunto>` por cada uno
- AND sin commits locales sin publicar, sin `--push` o sin remoto, la línea no sale
- AND los commits que trae de la remota un reintento del push no cuentan
- AND en un hotfix, cada rama publicada (la estable y la de vuelta) que tenga commits así da su línea, con su nombre

### La verificación del merge corre solo lo que se cruza

- GIVEN una rama que solo toca `apps/frontend/`, verificada en `a1b2c3d`, y una base que desde entonces trajo un cambio en `apps/backend/`
- WHEN el cierre ejecuta `sdd merge --verify "moon run :test --affected --base develop" --verified-at a1b2c3d`
- THEN no corre ninguna tarea, escribe `verificación: frontend:test: saltada (la base no toca sus inputs)` y `verificación: backend:test: saltada (solo la toca la base)`, y fusiona
- AND si la base también tocó `apps/frontend/`, escribe `verificación: corre frontend:test (las tocan la rama y la base)` y corre `moon run frontend:test --affected --base a1b2c3d`
- AND si la rama tiene un commit en `apps/frontend/` posterior a `a1b2c3d` y la base no tocó `apps/frontend/`, también corre `frontend:test`: lo que tocó la base se mide desde el commit verificado hasta el resultado del merge, que incluye esos commits de la rama
- AND lo que toca la rama se mide desde `git merge-base <destino antes del merge> <rama>` hasta la punta de la rama; el `--base` declarado en el gate no cuenta
- AND sin `--verified-at`, corre las tareas que toca la rama, con `--base <merge-base>`
- AND con `-g` o `--include-relations` en el gate, una tarea cuya dependencia cambió cuenta como tocada en los dos lados
- AND una tarea que no tocan ni la rama ni la base no sale en la salida
- AND un gate sin `--affected`, o que no es `moon run`, corre como está declarado
- AND con `--stdin`, `--status`, `--force` o un target que no es `proyecto:tarea` ni `:tarea`, escribe `verificación: sin cruce: '<opción o target>' no admitido; corre lo que toca la rama` y corre el gate con `--base <merge-base>`
- AND si `moon query` falla, escribe `verificación: sin cruce: moon query falló (<primera línea del error>); corre lo que toca la rama` y corre el gate con `--base <merge-base>`
- AND en un hotfix vale igual en la ida a la rama estable y en la vuelta a la de integración, con el merge-base de cada destino antes del merge

### La verificación del merge lanza el gate sin shell

- GIVEN una máquina Windows sin `pwsh` ni `powershell.exe` en el `PATH`
- WHEN el cierre ejecuta `sdd merge --verify "moon run app:test"`
- THEN el gate corre como `moon` con los argumentos `run app:test`, sin ningún intérprete de comandos
- AND las comillas dobles o simples agrupan un argumento: `node -e "process.exit(1)"` son dos argumentos tras `node`
- AND un `.cmd` o un `.bat` de Windows se lanza con el `cmd.exe` de `ComSpec`
- AND `--verify "pnpm lint && pnpm test"` sale con 2, sin coger el cerrojo, con `--verify: el gate encadena comandos con '&&'; hazlo una tarea de moon o un script de package.json`; igual con `||`, `;`, `|`, `>` y `<` fuera de comillas
- AND `$VAR`, `%VAR%` y `~` llegan literales al programa
- AND un programa que no está en el `PATH` falla con `verificación: no se encuentra '<programa>' en el PATH`

### La verificación del merge corre fuera del cerrojo de merge

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

### Dos cierres a la vez no se esperan con un cerrojo cogido

- GIVEN `feature/0251-x` en `sdd merge --verify`, con su verificación en marcha, y `feature/0252-y`, que acaba su gate y ejecuta `sdd merge --push` mientras tanto
- WHEN las dos quieren fusionar en `develop`
- THEN `feature/0252-y` coge el cerrojo de merge, fusiona y publica sin esperar a que acabe la verificación de `feature/0251-x`
- AND `feature/0251-x`, al acabar su verificación en verde, coge el cerrojo, ve `develop` cambiada, lo suelta e integra `origin/develop`, verifica solo lo que se cruza con lo que trajo `feature/0252-y`, y fusiona
- AND en ningún momento una de las dos espera un cerrojo mientras tiene el otro cogido

### El merge para si la rama trae un id o un número de ADR que el destino ya usa

- GIVEN un proyecto en modo `sequence`, `develop` con `.docs/sdd/changes/20261123-141327-feature-0756-a/`, y la rama `feature/0757-x` con `.docs/sdd/changes/20261123-162919-patch-0756-b/`
- WHEN se ejecuta `sdd merge --check --project-root <worktree de la rama>`
- THEN sale con 1 sin tocar nada y escribe `numeración: la rama trae 20261123-162919-patch-0756-b y 'develop' ya tiene 20261123-141327-feature-0756-a con el id 0756; renumera la de la rama a mano`
- AND con `develop` con `.docs/sdd/decisions/0004-a.md` y la rama con `.docs/sdd/decisions/0004-b.md`, en cualquier modo de ids, sale con 1 y escribe `numeración: la rama trae decisions/0004-b.md y 'develop' ya tiene decisions/0004-a.md con el número 0004; renumera la de la rama a mano`
- AND `--check` compara con `develop` y, si existe, con `origin/develop`, sin fetch
- AND con el choque solo en `origin/develop`, `--check` sale con 1 y nombra `'origin/develop'`; con el choque en las dos, solo nombra `'develop'`; con dos choques en la misma ref, escribe las dos líneas
- AND con `develop` sacada con cambios sin commitear, `--check` da primero el mensaje de destino sacado de «La comprobación del destino no toca nada»
- AND `sdd merge --sync`, y el merge con `--verify` al integrar la base, paran igual antes de integrar, con la ref que integran (`origin/develop`) en el mensaje y la rama sin tocar
- AND el merge del cierre, con o sin `--verify`, y la vuelta del hotfix a `develop` vuelven a comprobar dentro del cerrojo, justo antes de fusionar: si `develop` recibió entretanto `…-feature-0756-a`, sale con 1 con el mismo mensaje y `develop` queda como estaba; en el hotfix, la vuelta se deshace entera, como manda `stable-branch`
- AND cuentan las carpetas de `changes/` y de `specs/`, y los ficheros `NNNN-<slug>.md` de `decisions/`, también los `superseded`
- AND solo cuenta lo que la rama trae desde su merge-base con el destino: con `develop` que ya tiene `…-feature-0756-a` y `…-patch-0756-b`, una rama que no trae ninguna carpeta con el id 0756 fusiona; y si `develop` renombró `…-feature-0756-a` a `…-feature-0756-a2` después del merge-base, la rama que aún lleva `…-feature-0756-a` fusiona
- AND no cuentan el id y el número `0000`, las carpetas las de sufijo heredado (`…-task-0006a-…`) ni, en modo `tracker`, las carpetas de cambio
