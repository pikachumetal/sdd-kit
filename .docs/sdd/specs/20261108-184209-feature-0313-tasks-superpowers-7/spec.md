---
id: 20261108-184209-feature-0313-tasks-superpowers-7
feature: 0313
proposal: 0301
title: cli/src/tasks al día con los scripts de superpowers 7.0.2
mode: full
status: approved
created: 2026-11-08
author: Àngel Delgado
approvers:
  - name: Àngel Delgado
    approved_at: 2026-11-08
---

# Spec — `cli/src/tasks` al día con los scripts de superpowers 7.0.2

🦆 Los verbos con los que el kit abre, cierra y revisa cada task (`sdd workspace`, `sdd task start|brief|done`, `sdd review package`) son un port de los scripts de superpowers v6.4.2, y la 7.0.2 les arregló cosas que el kit no tiene. Hoy, lanzado desde el worktree de revisión, `sdd workspace` deja el workspace del plan dentro de ese worktree, que se borra al retirarlo. Con la 0313, `sdd workspace -C D:\code\reservas "<plan>"` lo deja en el worktree que dices, sin moverte de carpeta. También pasa esto: `sdd task brief plan.md 6b` saca solo la Task 6b, y un bloque de código sin cerrar que se tragaría el resto del plan se para con la línea donde se abre. Por último, `sdd task start` en un repo sin commits se para en vez de dar `base: HEAD`.

Validación: agente — `validation.mode: field` en `sdd-kit.json`: es CLI con tests, y ninguna persona observaría algo que los tests no midan.

## Capacidades

- Modificadas: `cli` — seis requisitos nuevos: `-C` en los verbos del workspace, la parada fuera de un repo o sin commits, los ids de task, el bloque de código sin cerrar, el plan sin encabezados `Task` y el `.gitignore` del workspace que no se pisa. También cambian sus reglas de Límites, Avisos y Regla ante conflicto.

## ✋ Decisiones que he tomado yo — valida estas

```text
Review de spec propuesta: dos revisores — señales: contrato público (opciones, mensajes y códigos de salida de `sdd workspace`, `sdd task start|brief|done` y `sdd review package`, que invocan sdd-implement-native, sdd-implement-subagent y la receta de sdd-verify) · tamaño: ~120 líneas de código y ~250 de tests en 8 ficheros
- Dominio (sonnet): si los THEN de «Los verbos de tasks paran fuera de un repo o sin commits» mantienen lo que `feature-flow` exige a `sdd task start` (ruta en forma Windows, salir distinto de 0 sin ruta), y si la tabla «Cambios del diff» deja algún cambio sin «se trae» o «no aplica» (señal: contrato público)
- Técnica (sonnet): si `-C` con `process.chdir` choca con la resolución de la ruta del plan relativa, y si los ids nuevos rompen `requireTasksFile` o la cuenta de tasks de un plan con un bloque de código sin cerrar (señal: contrato público)
- Mínimo razonable: solo técnica — deja sin contrastar el delta con `feature-flow` y `capabilities/cli.md`, donde un ADDED que cambia un requisito vivo pasaría por nuevo
```

1. **Enfoque (decisión central)**: el comportamiento de v7.0.2 se porta a los módulos que ya existen, más un resolvedor del repo (`cli/src/tasks/repo.ts`, el `sdd-repo` de la fuente) que usan los cinco verbos. `-C DIR` hace `process.chdir(DIR)` en el `run` del verbo, antes de nada, como el `cd "$2"` de la fuente («runs as if started in DIR»). Nunca va en `writeBrief`, `workspaceFor` ni `writePackage`, que siguen leyendo `process.cwd()`, y los tests de `-C` van con el binario. Descartados: pasar un `cwd` por cada función de `workspace.ts`, `brief.ts`, `package.ts` y `done.ts`, porque cambia cuatro firmas para el mismo efecto; y llamar a los scripts bash de la fuente, porque la CLI es Node sin bash ([ADR 0011](../../decisions/0011-node-cli.md)).
2. **`-C` solo en `sdd workspace`, `sdd task brief` y `sdd review package`**, los tres que lo tienen en la fuente; `task start` y `task done` no lo llevan, como `task-start` y `task-done`, y con él salen con 2 y `opción desconocida`. Se declara con nombre largo `--directory` y corto `-C`, porque `parseArgs` exige nombre largo; vale cualquiera de los dos. El `--help` lo enseña como las demás opciones, `[--directory <valor>]`, sin tocar el formato de la ayuda.
3. **La receta del paquete de la revisión final no se toca** (`skills/sdd-verify/references/encargo-revision.md`, `WORKSPACE="$(sdd workspace "<plan>")"`): **es tuya, valida esta**. Con la 0313 el menor del ticket de la 0300 tiene arreglo en la CLI, pero en campo sigue pasando hasta que la receta diga `sdd workspace -C "<worktree del plan>" "<plan>"`. Editarla es editar una skill (Art. I, con su prueba) y queda fuera del alcance de la fila. Recomiendo dejarla fuera: va al ticket de cierre como hallazgo, y la sesión `develop` decide al triar.
4. **Mensajes nuevos en castellano** (Art. X), con los literales de «Reglas de la capacidad — cli», Avisos. La parada fuera de un repo tiene dos variantes: `workspace` y `task brief` solo piden un repo, y `task start`, `task done` y `review package` piden además un commit. La línea `git dijo: ` cita la primera línea del stderr de git: de `git rev-parse --show-toplevel` fuera de un repo, y de `git rev-parse --verify HEAD` sin commits. El test comprueba el prefijo y no el texto de git, que cambia con su idioma. `<dir>` es `process.cwd()` después de `-C`. Los mensajes que ya existen («bad BASE», «task N not found…», «usage: …») no cambian: los fijan los tests, y traducirlos no es de esta fila. Sin el prefijo `warning:` de la fuente, como los demás avisos de `cli`.
5. **Códigos de salida**: la parada fuera de un repo o sin commits y el `-C` no válido salen con 2. Es lo que la CLI da hoy en los mismos casos (`fatal: not a git repository` y `bad BASE`, medidos con 2) y lo que da `sdd-repo`. Otro caso es `task done` sin commits en el rango, que sale con 1: ahí el repo está bien y es la task la que no commiteó. El bloque sin cerrar sale con 1, como los demás errores de dominio del kit, y no con el 4 de la fuente: la CLI solo usa 0, 1 y 2, y ninguna skill distingue el 4.
6. **Gramática del id de task**, la de la fuente: tramos de letras y dígitos separados por puntos, con al menos un dígito (`3`, `6b`, `A1`, `2.1`). `6.`, `.6`, `Overview` y `6*` quedan fuera. Se compara como texto entero, distinguiendo mayúsculas (`a1` no es `A1`), y nunca como regex. Un encabezado más profundo que la task pedida sigue en su brief si su id es el pedido seguido de una letra o un punto (`7` → `7a`, `7.1`). Si sigue un dígito no cuenta (`1` → `12`): `#### Task 12` corta la `### Task 1`. `task start`, `task brief` y `task done` validan el id con esta gramática.
7. **Qué verbos exigen un commit**: `sdd workspace` y `sdd task brief` piden un repo y nada más, como `sdd-workspace` y `task-brief` de la fuente, que llaman a `sdd-repo` sin `--with-commit`. `task brief` con OUTFILE no pide ni repo, como hoy y como la fuente. `task start`, `task done` y `review package` exigen además un commit.
8. **La entrada de `upstream.json` suma `skills/subagent-driven-development/scripts/sdd-repo` a sus `paths`**: el port lo implementa ahora (decisión 1). `THIRD_PARTY_NOTICES.md` se regenera desde el registro con el build.
9. **Los cambios que no aplican no dejan código ni test**: su porqué está en la tabla. La entrada sube igual a v7.0.2, como la de la 0297 (decisión del dev-lead).
10. **«Encabezado con forma de task»**, el de la fuente: fuera de un bloque de código, `#`, una palabra y un token de letras, dígitos y puntos que acaba en dígito (`## Tarea 1`, `## Paso 2`). La lista sale solo si el plan no tiene ningún encabezado `Task` y no es una spec lite. Una spec lite se abre entera, como hoy, sin la lista.
11. **Orden de las comprobaciones** en `task start` y `task brief`: el directorio de `-C`, el repo, `tasks.md`, el bloque sin cerrar y la task no encontrada; para el primero que falla. La cuenta de tasks que exige `tasks.md` usa la gramática nueva y no cuenta los encabezados dentro de un bloque, tampoco de uno sin cerrar.
12. **Delta probado en una copia de `.docs/sdd`**: `sdd capability merge` añade los seis requisitos a `cli.md` y sale con 0. Se repite tras meter los hallazgos.
13. **Medidos con el port de hoy, el 2026-11-08, en un repo de prueba**: `task start` en un repo sin commits escribe el brief, imprime `base: HEAD` y sale con 0. Fuera de un repo, `review package` y `task done` dicen `bad BASE: …`, y `workspace` y `task start` dicen `fatal: not a git repository`; todos salen con 2. `-C` da `opción desconocida: «-C»`, y `task brief plan.md 6b` da el uso. El `.gitignore` de `.temp/sdd/` se reescribe a `*`. La ruta impresa es `D:\…`.
- Política de modelos: revisores de la spec, dos `sonnet` con `sdd-kit:effort-medium` (hechos) · ejes de la revisión final: Spec opus+high, Código sonnet+high, Arquitectura según el plan · ningún otro despacho en paralelo, sin sujetos · en paralelo hasta `control.maxParallelAgents` (3)

### Hallazgos de la review

Dominio (D) y técnica (T), sonnet. Ningún Crítico ni cambio de la decisión central: sin segunda ronda.

- **Aceptado** — D1, T7: el mensaje «con al menos un commit» miente en `workspace` y `task brief`, que no lo exigen → dos variantes del mensaje (decisión 4, Avisos y el THEN).
- **Rechazado** — D2: la parada del repo debería salir con 1, como los errores de dominio → hoy esos mismos casos ya salen con 2 (medido) y la fuente también; el 1 de `task done` es otra causa (decisión 5, con el porqué escrito).
- **Aceptado** — D3, T2: la lista de un plan sin `Task` podría salir con una spec lite → AND en el requisito, y decisión 10 con la forma definida. El requisito vivo de la lite no cambia: su caso sin `mode: lite` no tiene encabezados con forma de task, y su literal se conserva.
- **Aceptado** — D4: faltaba «Reglas de la capacidad» → bloque con Límites, Avisos y Regla ante conflicto completos. Dónde viven los datos e Idioma de los nombres no cambian.
- **Aceptado** — D5, T8: el caso del bloque sin cerrar que no oculta nada era ambiguo → GIVEN nuevo con la task pedida y la línea, y un AND para el bloque abierto en una task posterior.
- **Aceptado** — D6, T1: faltaban `tasks.md` y el orden frente al bloque sin cerrar → `tasks.md` en los GIVEN y decisión 11.
- **Aceptado** — D7: `task brief` no tenía su caso de id inválido → incluido en el AND.
- **Aceptado** — D8, T5: `--help` y `-C` en `task start` → AND en el requisito de `-C` y decisión 2.
- **Aceptado** — D9: la ruta real de la máquina en el 🦆 → `D:\code\reservas`. La del clon de superpowers se queda: es la fuente de la medida.
- **Aceptado** — D10: prefijo `aviso:` sin convención → fuera (decisión 4).
- **Aceptado** — T3: «extiende» sin definir, mayúsculas e ids como `6.` → decisión 6 y un caso `#### Task 12` en el delta.
- **Aceptado** — T4: dónde vive el `chdir` → decisión 1.
- **Aceptado** — T6: qué comando de git cita `git dijo:` y qué `<dir>` → decisión 4.
- **Aceptado** — T9: `plan.md` commiteado o no en el repo sin commits → el AND lo dice sin commitear.
- **Aceptado** — T10: comprobar el aviso regenerado → en «Dónde se prueba».

## Intent

El port de `cli/src/tasks/` sigue en superpowers v6.4.2, y `moon run kit:upstream` lo da en rojo porque la 7.0.2 cambió esos scripts. Algunos de esos cambios arreglan fallos que el kit también tiene. El del worktree de revisión ya pasó en campo (ticket de la 0300, «Menores»). `sdd task start` en un repo sin commits da una BASE falsa (`HEAD`) y sale con 0. Un bloque de código sin cerrar alarga el brief hasta el final del plan. Y `6b` o `2.1` no se aceptan como id. El éxito tiene tres condiciones: cada cambio del diff tiene su «se trae» o «no aplica» con el porqué; cada «se trae» tiene un test que falla con el port de hoy y pasa con el nuevo; y `kit:upstream` deja de dar rojo en `cli/src/tasks/`.

## Scope

- Entra: los cambios «se trae» de la tabla en `cli/src/tasks/` (y `cli/src/cli/` si `-C` lo pide), con sus tests en `cli/test/tasks/`; la entrada de `cli/src/tasks/` en `upstream.json` a v7.0.2 con `sdd-repo` en `paths`, y `THIRD_PARTY_NOTICES.md` regenerado; el delta de `cli`.
- No entra: la entrada de `skills/sdd-grilling/SKILL.md` en `upstream.json` y `brainstorming` 7.0.2, que son de la 0314; la receta de `encargo-revision.md` (decisión 3); la cuenta de tasks de `cli/src/session/timing.ts` (`^#{2,4} Task \d+`), que no cuenta un id `A1`, porque mide la estimación y los planes del kit numeran `Task 1…N`; los cambios «no aplica».

### Cambios del diff `v6.4.2..v7.0.2`

Contados sobre `git -C D:\code\github\upstream\superpowers diff v6.4.2 v7.0.2 --` de los cinco scripts, más `sdd-repo`, que es nuevo en la 7.0.2: 23 cambios, 15 se traen y 8 no aplican.

| # | Script | Cambio | Decisión |
| --- | --- | --- | --- |
| 1 | `task-start` | BASE sale del repo de `sdd-repo --with-commit`, comprobado antes de escribir el brief | **se trae**: hoy, sin commits, escribe el brief, da `base: HEAD` y sale con 0 |
| 2 | `task-done` | BASE y HEAD se leen en el repo de `sdd-repo --with-commit` | **se trae**: hoy, fuera de un repo, dice `bad BASE: HEAD` |
| 3 | `task-done` | `(no output)` si el log de tests está vacío | no aplica: `resultLine` ya da `(sin salida)` |
| 4 | `review-package` | `-C DIR` | **se trae** |
| 5 | `review-package` | repo de `sdd-repo --with-commit` para BASE, HEAD y el rango | **se trae**: hoy, fuera de un repo, dice `bad BASE` |
| 6 | `review-package` | se mueve el comentario de los bits de ejecución (#2040) | no aplica: Node no ejecuta los scripts por sus bits |
| 7 | `sdd-workspace` | `-C DIR` | **se trae** |
| 8 | `sdd-workspace` | la raíz sale de `sdd-repo`, que se para con su mensaje | **se trae**: hoy dice `fatal: not a git repository`, sin el directorio ni qué hacer |
| 9 | `sdd-workspace` | raíz física con la grafía de `pwd -P` (Git Bash da `/c/…` y git `C:/…`) | no aplica: el port compara con `realpathSync.native` y `canonicalSpelling` |
| 10 | `sdd-workspace` | `CDPATH=''` | no aplica: es de bash |
| 11 | `sdd-workspace` | `.gitignore` de la carpeta de workspaces, solo si no existe | **se trae**: hoy se reescribe a `*` en cada llamada (medido) |
| 12 | `sdd-workspace` | ruta impresa `C:/…` con `cygpath -m`, que PowerShell abre | no aplica: Node imprime `D:\…` (medido), y `feature-flow` ya lo exige a `task start` |
| 13 | `task-brief` | `-C DIR` | **se trae** |
| 14 | `task-brief` | ids `A1`, `6b` y `2.1`, comparados enteros y nunca como regex | **se trae**: hoy los verbos solo aceptan dígitos |
| 15 | `task-brief` | una sub-task más profunda que extiende el id sigue en el brief; una del mismo nivel, no | **se trae**: hoy `Task 6` se lleva el `## Task 6b` que le sigue, y `Task 1` el `## Task 1.1` |
| 16 | `task-brief` | un bloque sin cerrar que oculta un encabezado `Task` mientras se captura la pedida: error, sin brief | **se trae**: hoy el brief sigue hasta el final del plan |
| 17 | `task-brief` | un bloque sin cerrar que oculta el encabezado pedido: se dice antes del «not found» | **se trae** |
| 18 | `task-brief` | un bloque sin cerrar que no oculta ningún `Task`: brief con aviso | **se trae**: hoy sale sin aviso |
| 19 | `task-brief` | sin encabezados `Task`, lista hasta 5 con forma de task (plan traducido, #2496) | **se trae** |
| 20 | `task-brief` | la ruta del plan va por `ENVIRON` y no por `-v` | no aplica: es de awk |
| 21 | `task-brief` | borra el OUTFILE a medias si awk falla | no aplica: el port solo escribe al final, si no hay error |
| 22 | `sdd-repo` | el repo es el del directorio actual; la ruta del plan nunca lo elige | no aplica: el port ya usa `process.cwd()` (medido) |
| 23 | `sdd-repo` | mensaje único fuera de un repo o sin commits, con el directorio actual y la primera línea de git | **se trae**: lo dan los cambios 1, 2, 5 y 8, en dos variantes (decisión 4) |

## Lo que se retira o cambia de forma

| Qué | Dónde aparece | Destino |
| --- | --- | --- |
| `fatal: not a git repository` de `sdd workspace` | `cli/src/tasks/workspace.ts:69`; ningún test, skill ni capacidad lo nombra (`git grep`) | mensaje de la decisión 4 |
| id de task solo con dígitos (`/^[0-9]+$/`) | `cli/src/tasks/verbs.ts:17` | gramática de la decisión 6 |
| `.gitignore` de `.temp/sdd/` reescrito en cada llamada | `cli/src/tasks/workspace.ts:75`; `cli/test/tasks/workspace.slow.test.ts:34` lo comprueba solo cuando no existe, y sigue valiendo | delta, «El workspace no pisa su `.gitignore`» |
| entrada de `cli/src/tasks/` en `v6.4.2` | `upstream.json:549`, `THIRD_PARTY_NOTICES.md:51` | `v7.0.2` con `sdd-repo` (decisión 8) |

- Filas que implementa: 0313 → `.docs/sdd/roadmap.md:148` (la fila; la marca el cierre), y la nombran como dependencia las filas 0312 (`:139`), 0314 (`:149`) y 0311 (`:156`), que no cambian.

## Approach

Lo fijó el dev-lead: se lee el diff entero antes de diseñar, y cada cambio va con «se trae» o «no aplica» y su porqué (tabla de arriba). Lo que se trae entra test primero (`sdd-tdd`), con un caso que falla con el port de hoy. La entrada del registro pasa a v7.0.2 también por lo que no aplica. El GIVEN del test de `-C` es el caso de campo de la 0300: el paquete de revisión lanzado dentro del worktree de revisión.

## Dónde se prueba

- `-C`, la parada fuera de un repo o sin commits, el `.gitignore` y la validación del id en los verbos: con el binario y repos git de prueba, como `cli/test/tasks/workspace.slow.test.ts` y `executing.slow.test.ts`.
- Ids, sub-tasks, bloque sin cerrar y plan traducido: llamando a `writeBrief` con `out`, sin git, como `cli/test/tasks/brief.test.ts`.
- El registro: `moon run kit:build` regenera `THIRD_PARTY_NOTICES.md` y, tras commitearlo, otra pasada no deja diff. `moon run kit:upstream` ya no nombra `cli/src/tasks/` (el rojo de `sdd-grilling` sigue: es de la 0314), y eso prueba también que `sdd-repo` existe en v7.0.2.

## Términos y ADR

- Términos resueltos: ninguno.
- ADR candidatas: ninguna.

## Delta de comportamiento

### Capacidad: `cli`

#### ADDED — `-C` sitúa los verbos del workspace en otro working tree

- GIVEN el repo de una feature con `plan.md` commiteado y un worktree de revisión `review-0300-abc1234` creado con `git worktree add --detach` junto a él
- WHEN desde el worktree de revisión se ejecuta `sdd workspace -C <worktree de la feature> plan.md`
- THEN imprime `<worktree de la feature>\.temp\sdd\plan` (en Windows; `/` en Linux y macOS), sale con 0 y el worktree de revisión no tiene `.temp/sdd/`
- AND `sdd task brief -C <worktree de la feature> plan.md 1` y `sdd review package -C <worktree de la feature> plan.md <base> <head>` escriben en ese mismo workspace, y la ruta del plan se resuelve desde `<worktree de la feature>`
- AND `--directory` vale lo mismo que `-C`, y `sdd workspace --help`, `sdd task brief --help` y `sdd review package --help` lo enseñan como `[--directory <valor>]`
- AND con un `-C` que no existe escribe `directorio de -C no válido: <dir>` y el uso, y sale con 2 sin escribir nada
- AND `sdd task start -C <dir> plan.md 1` y `sdd task done -C <dir> …` salen con 2 y `opción desconocida: «-C»`

#### ADDED — Los verbos de tasks paran fuera de un repo o sin commits

- GIVEN un directorio fuera de cualquier repo git con `plan.md`
- WHEN se ejecuta `sdd review package plan.md HEAD~1 HEAD`, `sdd task done plan.md 1 HEAD -- node -v` o `sdd task start plan.md 1`
- THEN escribe en stderr `Los verbos de tasks se ejecutan dentro del working tree de git en el que trabajas, con al menos un commit (directorio actual: <dir>). Si es un proyecto nuevo, haz git init y un primer commit, y vuelve a lanzarlo.`, en la línea siguiente `git dijo: ` con la primera línea del stderr de git, y el uso; sale con 2 sin escribir nada
- AND `sdd workspace plan.md` y `sdd task brief plan.md 1` escriben `Los verbos de tasks se ejecutan dentro del working tree de git en el que trabajas (directorio actual: <dir>). Si es un proyecto nuevo, haz git init y vuelve a lanzarlo.`, la línea `git dijo: ` y el uso, y salen con 2 sin escribir nada
- AND `sdd task brief plan.md 1 brief.md`, con OUTFILE, escribe el brief sin pedir repo
- AND en un repo recién creado sin commits y con `plan.md` sin commitear, `sdd task start plan.md 1`, `sdd task done plan.md 1 HEAD -- node -v` y `sdd review package plan.md HEAD HEAD` dan el mensaje con «al menos un commit», salen con 2, y `task start` no escribe el brief
- AND en ese repo sin commits, `sdd workspace plan.md` y `sdd task brief plan.md 1` funcionan como en uno con commits

#### ADDED — El id de una task admite letras y puntos

- GIVEN un plan con `## Task 6`, `## Task 6b`, `## Task A1`, `## Task Overview`, `## Task 2` y `## Task 2.1`, en ese orden, y `tasks.md` junto a él
- WHEN se ejecuta `sdd task brief plan.md 6b`
- THEN el brief tiene solo la sección de `## Task 6b`, hasta el siguiente encabezado de task, y sale con 0
- AND el brief de `6` no tiene `## Task 6b`, el de `2` no tiene `## Task 2.1`, y el de `A1` tiene `## Task Overview` y lo que le sigue, porque un encabezado sin dígito en el id no corta una task
- AND en otro plan con `### Task 7`, `#### Task 7a`, `### Task 8`, `### Task 1` y `#### Task 12`, en ese orden, el brief de `7` incluye `#### Task 7a` y el de `1` no incluye `#### Task 12`
- AND `sdd task start`, `sdd task brief` y `sdd task done` aceptan los mismos ids, y un id sin dígito (`Overview`), con otros caracteres (`6*`) o con un punto al borde (`6.`) sale con 2 y el uso

#### ADDED — Un bloque de código sin cerrar no alarga el brief

- GIVEN un plan con `tasks.md` junto a él, cuya `## Task 1` abre en la línea 7 un bloque con tres comillas invertidas que no se cierra, con `## Task 2` después
- WHEN se ejecuta `sdd task brief plan.md 1`
- THEN escribe `el bloque de código abierto en la línea 7 de plan.md no se cierra y oculta los encabezados de task que le siguen: ciérralo en el plan y vuelve a lanzarlo`, sale con 1 y no escribe el brief
- AND `sdd task brief plan.md 2` escribe esa misma línea antes de `task 2 not found in plan.md (no heading matching 'Task 2')` y sale con 1
- AND en un plan con `## Task 1` y `## Task 2`, con bloques cerrados, cuya última línea es otra con solo tres comillas invertidas dentro de la `## Task 2`, `sdd task brief plan.md 2` escribe el brief, avisa en stderr con `el bloque de código abierto en la línea <n> de plan.md no se cierra; no oculta ningún encabezado de task, así que el brief está completo` y sale con 0
- AND en ese mismo plan, `sdd task brief plan.md 1` escribe el brief sin aviso y sale con 0, porque el bloque se abre después de la task pedida

#### ADDED — Un plan sin encabezados `Task` dice por qué no encuentra la task

- GIVEN un plan sin `mode: lite`, con `## Tarea 1: Login` y `## Tarea 2: Logout` y sin ningún encabezado `Task`
- WHEN se ejecuta `sdd task brief plan.md 1`
- THEN escribe en stderr `no hay encabezados de task: se escriben con la palabra inglesa «Task» («### Task 1: …») aunque el plan esté en otro idioma. Encabezados con forma de task:`, debajo `  ## Tarea 1: Login` y `  ## Tarea 2: Logout`, y después `task 1 not found in plan.md (no heading matching 'Task 1')`; sale con 1
- AND con más de cinco encabezados así lista solo los cinco primeros
- AND una `spec.md` con `mode: lite` y `## Fase 1` se abre entera como brief, sin la lista, como hoy

#### ADDED — El workspace no pisa su `.gitignore`

- GIVEN un repo con `.temp/sdd/.gitignore` que dice `*` y `!*/progress.md`
- WHEN se ejecuta `sdd workspace plan.md`
- THEN el fichero conserva sus dos líneas
- AND sin `.temp/sdd/.gitignore`, lo crea con `*`

#### Reglas de la capacidad — cli

- **Límites**: `--ignore` relativo a la raíz, sin vacío, absoluto, `..`, espacios al borde ni saltos de línea; una acción por llamada; `--mark`, solo una versión `X.Y.Z` numérica, con su `vX.Y.Z.md` en el kit y mayor que la del proyecto; `sdd validation serve` escucha solo en `127.0.0.1` y en un puerto que elige el sistema, acepta solo peticiones con `Host` y `Origin` de `127.0.0.1:<puerto>`, y `--steps` es una lista JSON de al menos un `{id, title}` con ids únicos y `title` de texto; `--out` es relativo al directorio de trabajo, su carpeta se crea si falta, y el fichero se escribe de nuevo al arrancar; `sdd hook session-end` borra solo las sesiones sin escrituras en las últimas 24 h, nunca la del `session_id`, y tras 1 s desde que arranca no empieza a borrar ninguna más; el id de una task, tramos de letras y dígitos separados por puntos con al menos un dígito, comparado como texto entero; `-C` de `sdd workspace`, `sdd task brief` y `sdd review package`, un directorio que existe; la lista de encabezados con forma de task, cinco como mucho.
- **Avisos**: `<clave>: la fija sdd init, se ignora`; `<ruta con puntos>: se deja <valor JSON>`; `autoMemoryEnabled: se deja true; pregunta al usuario si lo cambia`; `<ruta> no es JSON válido: no se toca`; `<ruta> no se puede fusionar: <ruta con puntos> no es un objeto`; `el proyecto ya está al día con el kit <versión>`; `sin sdd-kit.json: se aplican todas`; `init en curso: sigue con sdd-init`; `--mark <versión>: el kit no trae esa migración`; `--mark <versión>: el proyecto ya está en <versión>`; `panel: http://127.0.0.1:<puerto>/`; `<ruta>: no es una lista de pasos {id, title}`; `sdd-kit: no borro los temporales de Claude Code: sin session_id válido en la entrada del hook`; `sdd-kit: no borro los temporales de Claude Code: <base> no es una ruta absoluta`; `sdd-kit: no borro los temporales de Claude Code: no sale el nombre de la carpeta del proyecto de <ruta>`; `--<opción> y --project-root no van juntas`; `opción desconocida: «--<opción>»; la raíz del proyecto va en --project-root`; `Los verbos de tasks se ejecutan dentro del working tree de git en el que trabajas (directorio actual: <dir>). Si es un proyecto nuevo, haz git init y vuelve a lanzarlo.`; `Los verbos de tasks se ejecutan dentro del working tree de git en el que trabajas, con al menos un commit (directorio actual: <dir>). Si es un proyecto nuevo, haz git init y un primer commit, y vuelve a lanzarlo.`; `git dijo: <primera línea del stderr de git>`; `directorio de -C no válido: <dir>`; `el bloque de código abierto en la línea <n> de <plan> no se cierra y oculta los encabezados de task que le siguen: ciérralo en el plan y vuelve a lanzarlo`; `el bloque de código abierto en la línea <n> de <plan> no se cierra; no oculta ningún encabezado de task, así que el brief está completo`; `no hay encabezados de task: se escriben con la palabra inglesa «Task» («### Task 1: …») aunque el plan esté en otro idioma. Encabezados con forma de task:`.
- **Regla ante conflicto**: en `settings.json`, la hoja que ya existe manda sobre la de la init, salvo `autoMemoryEnabled` con `--memory-off`; en `sdd-kit.json`, `channel` y `updated` los fija la CLI, `version` la fija la CLI salvo que ya exista (la de un template), y en el resto gana el `--config`; con `sdd upgrade --mark`, `version` es la que se marca y el resto de claves se queda; con `sdd validation serve`, un `--out` que ya existe se escribe de nuevo con los pasos de `--steps` en `pending`: cada validación empieza de cero; en `sdd task start` y `sdd task brief`, para la primera comprobación que falla, en este orden: el directorio de `-C`, el repo, `tasks.md`, el bloque sin cerrar y la task no encontrada; un `.temp/sdd/.gitignore` que ya existe manda sobre el de la CLI.

## Enmiendas

## Aprobaciones

| Nombre | Fecha | Estado |
| --- | --- | --- |
| Àngel Delgado | 2026-11-08 | aprobada («1»: Apruebo; la decisión 3, receta fuera, como la recomendé) |
