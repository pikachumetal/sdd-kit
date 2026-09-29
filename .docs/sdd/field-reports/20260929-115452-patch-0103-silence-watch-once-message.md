---
kit_version: 2.0.0 (sdd-kit.json; skills servidas desde la caché 2.1.0, contrastadas con el working tree)
superpowers_version: 6.4.2
lane: patch
id: 20260929-115452-patch-0103-silence-watch-once-message
task: 0103
mode:
date: 2026-09-29
---

# Ticket para el kit — patch 0103: `Watch-SubagentSilence.ps1 -Once` no encontraba despachos de hace más de 60 s

## Contexto

- Carril y modo: patch
- Skills del kit usadas: `sdd-start-patch`, `sdd-end-patch`, `sdd-feedback` (con `superpowers:systematic-debugging` implícito en el paso 1)
- Proyecto: el propio repo del kit (PowerShell + Pester, una persona)
- Modelo del hilo: Opus 5.5
- Modelos de los subagentes: no aplica
- Coste en reloj: ~0,5 h hasta el merge, de ellas ~9 min de la suite completa
- Coste en tokens: no medido

## Cómo leer este ticket

Los hallazgos son hipótesis a testear con RED/GREEN, no cambios aprobados, y van ordenados por coste observado.

## Hallazgos

### 1. `FastSuiteBudget` falla dentro de la suite completa y pasa suelto

- **Qué pasó**: `Invoke-Pester tests/` dio 1050 verdes y 1 rojo: `FastSuiteBudget`, con 35,3 s frente a 30 s y `SubjectOutputPrivacy.Tests.ps1` a 12 s. Suelto también falló una vez (10,4 s ese fichero). Luego pasó en la base sin el cambio (con un `git stash push -u -m` etiquetado) y 2 de 2 veces con el cambio. El pre-commit, que corre el mismo conjunto, pasó en los tres commits.
- **Dónde en el kit**: `tests/FastSuiteBudget.Tests.ps1` (umbral de 30 s) y `tests/SubjectOutputPrivacy.Tests.ps1` (7 tests, 9-12 s, sin `-Tag 'Slow'`).
- **Por qué el kit no lo evitó**: el presupuesto mide tiempo de reloj en una sola pasada, y `SubjectOutputPrivacy` ya se come un tercio del margen: con la máquina cargada se sale. El mensaje del fallo pide marcar el fichero como `Slow`, y un agente puede hacerlo a ciegas en un patch que no toca ese fichero.
- **Coste**: ~3 min y un stash sobre la pila compartida de worktrees para descartar que el fix fuera la causa.
- **Propuesta**: marcar con `-Tag 'Slow'` los bloques de `SubjectOutputPrivacy.Tests.ps1` que crean repos o lanzan procesos, como pide el propio mensaje; o que el presupuesto mida la mediana de dos pasadas antes de fallar.
- **Criterio de aceptación**: GIVEN la máquina con la suite completa corriendo en paralelo en otro worktree. WHEN se ejecuta `Invoke-Pester tests/FastSuiteBudget.Tests.ps1` 5 veces. THEN pasa las 5.

### 2. El margen de 60 s del vigía continuo se queda sin test

- **Qué pasó**: el test «no toma un despacho anterior con la misma description» comprobaba el margen de `DispatchMarginSeconds` a través de `-Once`, porque todos los tests del script corren con `-Once`. Ese atajo es el que escondía el defecto: fijaba como correcto que `-Once` diera `SIN TRANSCRIPT` con un despacho vivo. Con el fix, el test pasa a cubrir que `-Once` toma el más reciente, y el margen del modo continuo no lo cubre ningún test.
- **Dónde en el kit**: `tests/Watch-SubagentSilence.Tests.ps1` (`Invoke-Watcher` siempre añade `-Once`) y `skills/sdd-templates/scripts/Watch-SubagentSilence.ps1` (`TranscriptGraceSeconds` y `PollSeconds` fijos, 120 y 30 s).
- **Por qué el kit no lo evitó**: el modo continuo no se puede probar sin esperar la gracia de 2 min, así que la 0095 lo probó con el modo de una pasada, que tiene otra semántica.
- **Coste**: bajo hoy; el riesgo es que un cambio futuro rompa el margen del continuo sin que salte nada.
- **Propuesta**: exponer la gracia y el sondeo como parámetros ocultos (o variables de entorno de test) para que un test del modo continuo termine en segundos.
- **Criterio de aceptación**: RED que hoy no se puede escribir en menos de 2 min: GIVEN un despacho con `meta.json` de hace 30 min. WHEN corre el vigía sin `-Once` con gracia de 2 s. THEN termina con `SIN TRANSCRIPT:` en menos de 10 s.

## Lo que hice por iniciativa propia

- Reproduje el fallo con el test Pester **antes** de reservar id, renombrar la rama o crear la carpeta: el paso 1 de `sdd-start-patch` lo exige en espíritu («no abrir el patch sin reproducir»), pero no dice que el test RED pueda escribirse antes de la carpeta. Funcionó: el id 0103 solo se reservó con el RED en mano.
- Para descartar que el rojo de `FastSuiteBudget` viniera del fix, lo corrí en la base con un stash etiquetado, aplicado por SHA y soltado por su etiqueta. Funcionó, pero es una comprobación que la regla de «un rojo en un fichero no tocado» podría pedir de forma explícita.

## Funcionó, no tocar

- El hook `SessionStart` avisó de que las skills venían de la caché; el `diff` de `sdd-start-patch`, `sdd-end-patch` y `sdd-feedback` contra el working tree mostró solo diferencias en la variante visual, que no aplicaba.
- `sdd-start-patch` paso 2: renombrar `feature/<slug>` a `feature/0103-<slug>` sin commits propios, antes del primer commit.
- La receta «Conflicto solo en los registros»: el patch 0101 se fusionó a la vez, chocaron `roadmap.md` (dos filas nuevas en la tabla de patches) y `estimation-log.md`; merge de sincronización, las dos filas y el log regenerado, y `Invoke-SddMerge.ps1` pasó a la segunda.
- La opción de diferir la validación, rellenada antes de preguntar: el dev-lead la eligió sin escribir nada y no hizo falta otra pregunta.

## Errores míos, no huecos del kit

- Corrí la suite completa (~9 min) antes del commit, cuando el pre-commit ya corre el conjunto rápido y el script tocado está en `Slow`: bastaba con `tests/Watch-SubagentSilence.Tests.ps1` más el conjunto rápido.
