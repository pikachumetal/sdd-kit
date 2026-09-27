---
kit_version: 1.1.0
superpowers_version: 6.4.1
lane: patch
id: 20260923-074153-patch-0037-disparador-vago
task: 0037
mode:
date: 2026-09-23
---

# Ticket para el kit — patch 0037: id repetido con una carpeta sin commitear, el aviso final no se cumple desde el paso 0 y el bloque de tiempo del patch no tiene sitio para el coste de sujetos

## Contexto

- Carril y modo: patch, perfil `delegate`
- Skills del kit usadas: `sdd-start-patch` (cargada por el harness desde la caché 1.1.0 y contrastada con la del working tree), `sdd-end-patch` y `sdd-feedback`, leídas del working tree; `sdd-templates` (`patch-template.md`, `kit-feedback-template.md`, `Get-NextSddId.ps1`, `Build-EstimationLog.ps1`)
- Proyecto: el propio kit (repo de Markdown + scripts PowerShell con Pester), un dev-lead
- Modelo del hilo: Opus 5.5
- Modelos de los subagentes: no aplica; 10 sujetos headless Sonnet (RED 2, GREEN 2 + 2, control 2)
- Coste en reloj: ~0,6 h
- Coste en tokens: no medido; sujetos 6,10 $

## Cómo leer este ticket

Los hallazgos son hipótesis a testear con RED/GREEN, no cambios aprobados, y van ordenados por coste observado.

## Hallazgos

### 1. `Get-NextSddId.ps1` no ve la carpeta de un patch sin commitear en otro worktree

- **Qué pasó**: a las 09:02 el script dio 0036 y creé `specs/20260923-070206-patch-0036-disparador-vago/`. El patch no tiene fila de reserva: la fila de patches se escribe al cerrar. A las 09:26, otro worktree partió la task 0006 y reservó 0036 en `develop`, porque la carpeta seguía sin commitear. Lo vi al ir a fusionar. Tuve que integrar `develop` y renumerar a 0037 carpeta, ticket, tests, roadmap, changelog y log; los tres primeros commits de la rama siguen diciendo 0036.
- **Dónde en el kit**: `skills/sdd-templates/scripts/Get-NextSddId.ps1`, `Get-WorktreeRoadmapIds`: del disco de cada worktree lee el roadmap, no `.docs/sdd/specs/`. `skills/sdd-start-patch/SKILL.md` paso 2 crea la carpeta y no la publica.
- **Por qué el kit no lo evitó**: la ampliación del patch 0035 cubrió la reserva sin commitear del roadmap (la de una task), no la de un patch, que reserva con la carpeta.
- **Coste**: ~10 min de merge y renumerado, y un id viejo en tres mensajes de commit.
- **Propuesta**: que `Get-WorktreeRoadmapIds` lea también los nombres de carpeta de `.docs/sdd/specs/` en el disco de cada worktree, en el mismo bucle.
- **Criterio de aceptación**: GIVEN el worktree A con `specs/<ts>-patch-0036-x/` sin commitear y sin fila WHEN el worktree B ejecuta `Get-NextSddId.ps1` THEN devuelve 0037. Hoy devuelve 0036.

### 2. Una obligación del mensaje final escrita en el paso 0 no se cumple

- **Qué pasó**: la primera versión del fix ponía «dilo en el mensaje de cierre» en el paso 0 de `sdd-end-task`, donde se decide si hay validación diferida. Los dos sujetos del GREEN aplicaron el resto de la regla (cerrar sin preguntar, uso concreto, dueño) y ninguno lo dijo en el mensaje final. Uno lo dejó solo en el walkthrough. Con la frase en el paso 11 pasaron 2/2.
- **Dónde en el kit**: `skills/sdd-end-task/SKILL.md`. No hay un paso de «mensaje final». El paso 11 («Ticket para el kit») es el último y ahora lleva también el aviso del disparador.
- **Por qué el kit no lo evitó**: el checklist no tiene un punto donde se compone el informe de cierre. Lo que tiene que acabar en él se queda en el paso donde nace, y el agente no vuelve ahí.
- **Coste**: una segunda ronda de GREEN (2,06 $, ~10 min).
- **Propuesta**: un paso propio «Mensaje final» en `sdd-end-task` (y en `sdd-end-patch`) que reúna lo que el cierre debe decir: el disparador concretado, las decisiones tomadas sin el dev-lead, lo pendiente y la oferta del ticket. El paso 11 volvería a ser solo el ticket. Aprendizaje de método ya escrito en `tech-stack.md`, «Sujetos headless».
- **Criterio de aceptación**: GIVEN un cierre con el disparador concretado por el agente y un ruling de ejecución WHEN el agente termina el checklist THEN el mensaje final nombra los dos, con 2/2 sujetos y sin regresión en el control «Cierra la task» sin diferir.

### 3. `patch-template.md` §5 no tiene línea para el coste de sujetos

- **Qué pasó**: puse el coste de la campaña al final de §4. `Build-EstimationLog.ps1` dejó `—` en la columna `Sujetos ($)`. Al moverlo a §5 como `- Coste de sujetos: …`, el log lo leyó (6.1).
- **Dónde en el kit**: `skills/sdd-templates/templates/patch-template.md` §5; el lector es `skills/sdd-templates/scripts/Build-EstimationLog.ps1` (`$script:SubjectCostLabel`).
- **Por qué el kit no lo evitó**: la plantilla del walkthrough tiene la etiqueta desde la task 0010; la del patch solo tiene «Estimación» y «Real». Un patch que edita skills lleva campaña RED/GREEN por el Art. I, y el coste existe.
- **Coste**: un regenerado del log; habría quedado sin dato si no se mira la fila.
- **Propuesta**: añadir a §5 de `patch-template.md` `- Coste de sujetos: <$> (si hubo campaña)`.
- **Criterio de aceptación**: GIVEN un patch con campaña que calca la plantilla WHEN se regenera el log THEN la columna `Sujetos ($)` de su fila tiene la cifra.

### 4. La rama del patch no sigue `feature/<id>` cuando el worktree ya existía

- **Qué pasó**: la sesión arrancó en un worktree con rama `feature/fix-01`, que el gestor de worktrees creó antes de saber el id. `patch.md` lleva `branch: feature/fix-01`, fuera de la forma `<feature|hotfix>/<id>` de la plantilla.
- **Dónde en el kit**: `skills/sdd-templates/templates/patch-template.md` (frontmatter `branch`); `skills/sdd-start-patch/SKILL.md` no dice qué hacer con una rama ya creada con otro nombre.
- **Por qué el kit no lo evitó**: la plantilla supone que la rama nace con el id.
- **Coste**: bajo; `Get-NextSddId.ps1` no puede usar la rama para devolver el id.
- **Propuesta**: una frase en `sdd-start-patch` paso 2: con la rama ya creada con otro nombre, se registra la real y no se renombra (el gestor de worktrees depende de ella).
- **Criterio de aceptación**: GIVEN un worktree en `feature/<nombre libre>` WHEN arranca un patch THEN `patch.md` registra la rama real y el agente no la renombra.

## Lo que hice por iniciativa propia

- **Reutilicé el molde `m-close` y `subject.sh` de la task 0008** con un lanzador pequeño que archiva solo walkthrough, roadmap, estado git y mensaje final de cada turno, en rutas cortas (máximo 95 caracteres). Así no tuve que construir un molde nuevo y no hubo problema de longitud de ruta. Funcionó.
- **Brazo de control sin diferir** («Cierra la task 0009.» a un turno): la guía quita una parada y había que comprobar que no la quita de más. 2/2 siguieron parando. Queda escrito en `tech-stack.md`.
- **Marqué en línea dos piezas de la fila 0015** con el corchete `**[Patch 0037, …: saldada — …]**` delante de cada una, fuera del recuento de filas saldadas. Es la tercera forma que la fila 0015 pide para `roadmap-template.md` (0035 §1); es su segundo uso sin plantilla.

## Funcionó, no tocar

- La regla 2 del `CLAUDE.md` (contrastar la skill cargada con `skills/<nombre>/SKILL.md`): la copia de la caché de `sdd-start-patch` no tenía el modo `sequence` del id, y el diff lo enseñó antes de crear la carpeta.
- El pre-commit con la suite entera: todos los commits pasaron en verde, también el merge de `develop` (356/0, por `pre-merge-commit`).

## Errores míos, no huecos del kit

- El primer RED del ancla Pester falló por la expresión regular (`^…$` con CRLF), no por la aserción. Lo vi al leer el mensaje y lo corregí antes de dar el RED por bueno.
- El extractor de mensajes finales escribió con la codificación de consola de Windows y dejó mojibake; lo rehice con `PYTHONIOENCODING=utf-8`.
