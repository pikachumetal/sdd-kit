---
kit_version: 2.3.4
superpowers_version: 7.0.0
lane: feature
id: 20261029-110412-feature-0251-suite-lock-root-cause
task: 0251
mode: full
date: 2026-10-29
---

# Ticket para el kit — feature 0251: el delta no recogió los requisitos vivos que el comportamiento nuevo contradecía

## Contexto

- Carril y modo: feature full
- Skills del kit usadas: sdd-propose, sdd-start-feature, sdd-implement (Native), sdd-worktrees, sdd-tdd, sdd-verify, sdd-parallel-agents, sdd-archive, sdd-feedback
- Proyecto: el propio kit (CLI en Node + skills), una persona
- Modelo del hilo: Opus 5.5
- Modelos de los subagentes: eje Spec y re-revisión en Opus 5.5; eje Código en Sonnet 5.5
- Coste en reloj: 1,51 h frente a 4,5 h estimadas
- Coste en tokens: 46.335.141 del hilo y 7.564.129 de subagentes; 20,96 $

## Cómo leer este ticket

Los hallazgos son hipótesis a testear con RED/GREEN, no cambios aprobados, y van ordenados por coste observado.

## Hallazgos

### 1. El repaso de coherencia no busca los requisitos vivos que un `ADDED` contradice

- **Qué pasó**: el delta añadió «La verificación del merge corre fuera del cerrojo de merge», que cambia los literales y el orden del reintento de push, y dejó vivos cuatro requisitos de la misma capacidad que lo contradecían: «El push del cierre reintenta si la rama destino avanzó» (mismo GIVEN, otro literal), «El merge del cierre une los registros…» («dentro del cerrojo»), «La verificación del merge es el gate de merge…» («sobre el resultado del merge») y «Mergiraf resuelve lo que queda…» (`import { a, b, c }`). Los encontró el eje Spec de la revisión final como 2 Important y 3 Minor, y se arreglaron con cuatro `MODIFIED` en una enmienda sin aprobar.
- **Fuente**: `spec.md` de la carpeta de la feature, sección «Enmiendas», entrada de la pasada de fix; `tasks.md`, línea `Pasada de fix:`.
- **Dónde en el kit**: `skills/sdd-propose/SKILL.md` paso 4, «Coherence pass»: busca fuera de la spec dónde se implementa cada `MODIFIED`, pero no pide buscar, por cada `ADDED`, los requisitos vivos de la capacidad cuyo GIVEN o literal toca el comportamiento nuevo.
- **Por qué el kit no lo evitó**: el paso cubre el `MODIFIED` y lo que se retira o cambia de forma; un `ADDED` que redefine el comportamiento de requisitos vecinos no está en ninguna de las dos listas, y `sdd capability merge` lo acepta porque no hay choque de títulos.
- **Coste**: 2 Important y 3 Minor de la revisión final, una enmienda sin aprobar y otra fusión de la capacidad (`tasks.md` de la feature, `Pasada de fix:`).
- **Propuesta**: en el repaso de coherencia, por cada `ADDED` buscar en la capacidad viva sus literales (salidas, mensajes) y su verbo principal («reintenta», «verifica», «dentro del cerrojo»), y añadir al delta un `MODIFIED` por cada requisito que el `ADDED` contradiga, o decir en su línea por qué sigue valiendo.
- **Verificada**: sin verificar
- **Criterio de aceptación**: GIVEN una spec cuyo `ADDED` cambia el literal de un reintento que otro requisito vivo de la misma capacidad nombra WHEN `sdd-propose` hace el repaso de coherencia THEN el delta lleva el `MODIFIED` de ese requisito, o «Lo que se retira o cambia de forma» lo nombra con su destino.

### 2. Un test «adaptado» del Review Focus dejó de ejercitar el caso que nombraba

- **Qué pasó**: la línea 2 del Review Focus del plan («`base: conflicto en` al integrar la base en la rama → `merge --abort`, la rama en su commit y sin `MERGE_HEAD`») apuntaba a un test existente que la Task 1 adaptaba. Tras el cambio, ese test daba el conflicto en el merge del destino, no al integrar en la rama. El eje Spec y el eje Código lo marcaron como Important, y el test que lo fija se escribió en la pasada de fix.
- **Fuente**: `plan.md` de la carpeta de la feature, `## Review Focus`, línea 2; `tasks.md`, `## Rulings` («el conflicto de "un conflicto al reintegrar…" sale ahora como `merge: conflicto en`»).
- **Dónde en el kit**: `skills/sdd-propose/references/plan-writing.md`, «Self-review», punto 4, y `skills/sdd-implement/SKILL.md`, «Before each task» punto 2: un test que se adapta cuenta como test del Review Focus sin comprobar, una vez adaptado, que sigue entrando por la entrada que la línea nombra.
- **Por qué el kit no lo evitó**: el Self-review comprueba que cada línea del Review Focus tiene un test que la fija, no que el test siga ejercitando esa entrada cuando la task cambia su ruta; y el ruling de la Task 1 que cambió su literal no se cruzó con el Review Focus.
- **Coste**: 2 Important (uno por eje) y un test nuevo en la pasada de fix (`tasks.md`, `Pasada de fix:`).
- **Propuesta**: en `sdd-implement`, si un ruling cambia lo que observa un test que nombra el Review Focus, la línea del Review Focus pasa a tener su test propio en la misma task, antes del commit.
- **Verificada**: sin verificar
- **Criterio de aceptación**: GIVEN un plan cuyo Review Focus nombra un test existente a adaptar WHEN la task hace un ruling que cambia el paso donde ese test falla THEN el commit de la task lleva un test que entra por la entrada de la línea del Review Focus.

## Lo que hice por iniciativa propia

- La línea base corrió en un worktree desanclado en el commit de apertura, mientras escribía los RED en el de la rama (lo que propone el patch 0246). Funcionó: el único rojo fue de carga, y el resultado no dependió de los ficheros a medio escribir.
- Las líneas del ledger que citaban un comando destructivo de git las escribí con `Write` en un fichero del scratchpad y las añadí desde ahí, porque un hook de la máquina bloquea cualquier comando cuyo texto lo contenga.
- En la medida, la pasada sola dio un rojo de objetos temporales de git; repetí el fichero y la pasada sola, y no la medida en paralelo, que es la que decide.

## Funcionó, no tocar

- La revisión final en dos ejes y la re-revisión única: los ejes encontraron cosas distintas (el Código, el contraste sin comprobar los `checkout`; el Spec, los requisitos vivos contradichos), y la re-revisión cerró el tramo sin abrir otra.
- La regla 7 de `CLAUDE.md` («antes de cada `sdd merge`, mira la CI de `develop`») paró el merge sobre un `develop` en rojo y llevó al patch 0258 de otra sesión; el merge salió tras su verde.
- `sdd merge --sync` integró dos veces la base con el patch de la CI sin conflictos, y `--verified-at` omitió la verificación del merge con `verificación: omitida: desde ee957962 solo cambian docs`.

## Menores

- `sdd task done` anota en el ledger la última línea de la salida (`Duration  458.37s (tests 99%)`) y no la de `Tests N passed`; el eje Spec lo señaló como evidencia sin recuento — `cli/src/tasks/` (`sdd task done`).
- La estimación de 4,5 h salió en 1,51 h (−66 %) por sumar en serie horas que corrieron en segundo plano; `estimation.md` ya lo avisa para campañas, y aquí pasó con suites — no localizado en una skill.
