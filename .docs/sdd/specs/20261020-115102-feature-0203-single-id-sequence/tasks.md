---
id: 20261020-115102-feature-0203-single-id-sequence
title: Tasks — Ids, una sola numeración y el push a la integración como árbitro
spec: ./spec.md
plan: ./plan.md
created: 2026-10-20
---

# Tasks — Ids, una sola numeración y el push a la integración como árbitro (registro vivo)

- **Spec**: `./spec.md`
- **Plan**: `./plan.md`
- **Rama**: `feature/0203-single-id-sequence`

## Estado de las tasks

| # | Task | Status | Commit | Notas |
| --- | --- | --- | --- | --- |
| 1 | Later y Backlog con id de la secuencia | done | a26cd90c | id3 RED 0/1, GREEN 2/2; humo m5 1/1 |
| 2 | Reservas sin publicar, renumeración y etiquetas en el escaneo | done | 3382a02e | firma `unpublishedReservations` (ruling) |
| 3 | El verbo `sdd id claim` | done | f776ad67 | 22 tests lentos con remoto *bare*; afectada por enmienda 2026-10-20 → Task 5 |
| 4 | El claim en las skills de arranque | done | b9915e91 | id1/id4 RED 0/2, GREEN 4/4; id2 sin RED: fuera la tercera fuente |
| 5 | enmienda 2026-10-20: carpetas renumeradas, fila publicada con título, merge.push: false con etiqueta | done | (pasada de fix) | con la pasada de fix de la revisión final |

## Revisión

- Revisión final: Spec opus+high, with fixes (2 Important) · Código sonnet+high, with fixes (3 Important) · Arquitectura opus+high, with fixes (6 Important), sobre b9915e91
- Pasada de fix: 18714959, 7 hallazgos RED→GREEN (más el cerrojo, la fontanería compartida y la enmienda de la tercera fuente)
- Re-revisión: b9915e91..18714959, sdd-kit:effort-high + opus, 11 ADDRESSED · 3 Important nuevos: 2 adjudicados (duplicación), 1 decidido por el dev-lead y arreglado sin revisar

## Rulings

| 3 | `claim.slow.test.ts` necesita un fixture con *bare* propio (los helpers de merge no traen `sdd-kit.json` en `sequence`) | — | Ruling: fixture propio en `cli/test/ids/claim-fixture.ts` |
Task 3: Ruling: fixture propio `cli/test/ids/claim-fixture.ts` (no está en «Crear») — los helpers de `cli/test/merge/` no llevan `sdd-kit.json` en `sequence` ni el segundo clon — si es un error, se mueve a helpers.ts sin cambiar tests.
Task 1: Ruling: baseline en rojo solo por FastSuiteBudget (69 s > 30 s) con la máquina cargada por mis vitest en paralelo; cli:test-slow y cli:test-min no corrieron (moon los salta) — se repite el gate completo en la validación final, sin carga — si fuera un fallo real, lo caza ese gate
Task 1: Ruling: la frase del paso 6 de sdd-roadmap («for another clone, until its start runs `sdd id claim`») pasa a la Task 4 — docs-claims.test.ts rechaza un verbo que aún no existe — coste si es un error: ninguno, solo cambia el commit donde entra
Task 2: Ruling: renumber.ts se escribió antes de correr su RED; el RED se comprobó con un stub sin renumerar (5 de 7 fallan) — coste si es un error: ninguno, el test ya existe y falla sin la lógica
Task 2: Ruling: unpublished.ts expone unpublishedReservations(worktree, remoteRef, into): Reservation[] ({ commit: '<hash> <asunto>', ids }) en vez de unpublishedIds(): string[] — el claim necesita saber qué commits no son de la tarea para la línea «también publica» y que una fila modificada (+ y -) no cuente como reserva — coste si es un error: solo la firma, que consume la Task 3; refIds devuelve Set
Task 3: Ruling: el caso «rama: ya existe <rama>; no se renombra» (spec, decisión 9) queda como guarda en claim.ts sin test — el siguiente libre sale del escaneo, que cuenta los nombres de rama locales y remotas, así que solo se da en una carrera con otra sesión — coste si es un error: un git branch -m que falla con su mensaje de git en vez del literal
Task 3: Ruling: en los tests el siguiente libre es 0204 con una sola fila 0203, y 0203 sin fila (las filas 0201-0202 del molde superan el contador 0179); la spec da 0205 y 0180 como ejemplo con otros datos — coste si es un error: ninguno, la regla «el siguiente libre» es la misma
Task 3: Ruling: diferencias del RED al test commiteado, todas de fixture o de expectativa mal calculada, no de ajustar el test al código: timeout de 120 s como cli:test-slow; el escenario «ya integrado» usa una fila del otro en otra zona del fichero (con la misma zona el pull daba conflicto), con regex por CRLF; ids esperados 0204 (siguiente libre real); el hook pre-receive hace unset GIT_QUARANTINE_PATH (git prohíbe mover refs en cuarentena); la etiqueta del otro clon apunta a un commit con su fila; fuera el test de «rama ya existe» (ver ruling anterior)
Task 4: Ruling: fuera la frase de la tercera fuente («sin fila, el de la rama si ya lo lleva») de sdd-start-patch paso 2 y de nombrado.md — id2 sale limpio en el baseline 2/2 con el kit de develop (los dos sujetos usan la 0016 de la rama), y el Art. I no escribe guía sin fallo; el claim (que toma por defecto el id de la rama) sí se queda — coste si es un error: un patch sin fila en una rama con id podría reservar otro, que es el fallo del ticket 0176; id2 se re-mide como control sin la frase
Final: Ruling: el eje Arquitectura va con opus+high, como fijan sdd-verify y la constitution (Art. IV), y no con sonnet+high, como decía por error la línea «Política de modelos» de la spec — coste si es un error: el precio de un eje en Opus
Final: Ruling: los encargos de los tres ejes van en ficheros del workspace (brief-spec.md, brief-code.md, brief-architecture.md), rellenados desde las plantillas de sdd-verify con un script, y el despacho le pide al eje leerlo entero — no se pegan en el prompt para no duplicar ~30 KB — coste si es un error: un eje que no lea el fichero entero; el informe lo delata
Final: Ruling: Spec I1 (tercera fuente), Arquitectura I2 (carpetas), I3 (develop atrasado) e I6 (merge.push: false) cambian la spec: preguntados al dev-lead y aprobados como enmienda del 2026-10-20; van en la Task 5 — enmienda
Final: Ruling: Arquitectura I1 (fontanería duplicada) se arregla a medias: withIntegrationTarget, el cerrojo y runGit pasan a un módulo compartido que usan claim y publish; pushInto no se funde con pushDestination, porque cambiarlo tocaría la salida de sdd merge — coste si es un error: dos funciones de push que divergen
Task 5: Ruling: diferencias del RED al test commiteado: el test de «integración sin rama en el remoto» mueve antes el HEAD del bare a main (git no borra la rama a la que apunta HEAD) y comprueba que develop desaparece; el de «id de rama tomado sin fila» toma el id de otra rama local, porque una fila del remoto ahora es «ya estaba» (enmienda) — coste si es un error: ninguno, el comportamiento lo fija la enmienda
Final: minor (deferred): runGit duplicado (Código 4) — arreglado de paso por integration.ts
Final: minor (deferred): claim.ts mezcla claim y asentamiento de la rama (Código 6, Arquitectura): sacar settleBranch a su módulo
Final: minor (deferred): remoteForBranch llamado dos veces y los «!» de claim.ts (Código 7) — arreglado de paso por claimRemote
Final: minor (deferred): renumberCell reescribe cualquier celda que sea solo una lista de ids (Código 8, Spec 11), y las regex se compilan por línea
Final: minor (deferred): pushInto pierde el stderr de git y un fallo de red cae en la etiqueta (Código 9, Arquitectura)
Final: minor (deferred): tests sin cubrir: CRLF de rewriteFile, --into, rama ya existe, tagStep retry, worktree limpio tras el conflicto; «takes the moved path…» solo mira la etiqueta (Código 10, Spec 4-6)
Final: minor (deferred): unpublishedReservations lanza 2 procesos git por commit (Código 11)
Final: minor (deferred): optionalText con un cast redundante y idNextVerb con su propio parseo (Código 12)
Final: minor (deferred): ciclo entre los dominios ids y roadmap (resolveProjectRoot, IdsMode) (Arquitectura)
Final: minor (deferred): renumber reserva de una en una en vez de con --count (Arquitectura) — arreglado de paso (nextFreeIds con count)
Final: minor (deferred): roadmap check falla con un sdd-kit.json mal formado, ahora que lo lee (Arquitectura)
Final: minor (deferred): «destino con cambios» y los 3 intentos salen por stderr y la regla Avisos dice salida estándar (Spec 3)
Final: minor (deferred): el paso 3 de sdd-propose no dice qué hacer con «rama: tiene commits propios…» (Spec 9)
Final: minor (deferred): tras renumerar, «también publica … de la 0203» nombra el id viejo (Spec 10)
Final: minor (deferred): campaña con a1 y a3 en n = 1 y sin humo de una batería de sdd-start-patch, que no existe (Spec 7)
Final: Ruling: regex de rutas de artefacto repetida en claim.ts (artifactPattern) y renumber.ts (Important de la re-revisión, Art. X) — no hay segunda pasada de fix; se queda hasta que alguien toque renumber — coste si es un error: cambiar las rutas en un sitio y no en el otro
Final: Ruling: idsOutsideTask repite el bucle de branchIds y el flatMap de worktreeDiskIds (Important de la re-revisión, Art. X) — no hay segunda pasada; se queda — coste si es un error: dos escaneos que divergen
Final: Ruling: merge.push ausente publicaba develop (Important de la re-revisión) — preguntado al dev-lead: «Ausente = no publica (Recomendada)»; arreglado tras la re-revisión, sin revisar — test «…without merge.push» RED→GREEN (mutante ?? true: 1 fallo), claim.slow 29/29, typecheck limpio
Final: minor (deferred): ls-remote --heads <remote> <into> casa también refs/heads/x/<into>; pasar refs/heads/<into> (re-revisión)
Final: minor (deferred): el patrón de rutas incluye -task- y la decisión 8 no lo nombra (re-revisión)
Final: minor (deferred): rowTitle de una fila con fecha y sin negrita devuelve el id (re-revisión)
Final: minor (deferred): configuredMergePush repite la forma de configuredMergeInto (re-revisión)
Final: minor (deferred): dentro del claim el cerrojo del contador espera 30 min y no 2 (re-revisión)
Final: minor (deferred): ANDs del «Sin fila» sin test (carpeta de otro worktree o de origin/develop); la carpeta movida y la etiqueta de merge.push false sin aserción de que van en el mismo commit y llegan al remoto (re-revisión)
Final: minor (deferred): merge/run.ts sigue construyendo el cerrojo sdd-merge.lock a mano en vez de withMergeLock (re-revisión)
Final: minor (deferred): textos de la spec anteriores a la enmienda S1 (tabla «Lo que se retira» y la fila id2 de la previsión) (re-revisión)
