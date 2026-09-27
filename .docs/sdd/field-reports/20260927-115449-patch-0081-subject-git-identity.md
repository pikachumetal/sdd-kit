---
kit_version: 1.1.0
superpowers_version: 6.4.2
lane: patch
id: 20260927-115449-patch-0081-subject-git-identity
task: 0081
mode:
date: 2026-09-27
---

# Ticket para el kit — patch 0081: los sujetos headless usan la identidad fixture de git

## Contexto

- Carril y modo: patch
- Skills del kit usadas: `sdd-start-patch`, `sdd-end-patch`, `sdd-feedback`
- Proyecto: el propio repo del kit (skills en Markdown, tests en Pester, un solo dev-lead)
- Modelo del hilo: Opus 5.5
- Modelos de los subagentes: no aplica (sin sujetos: el fix es de la infraestructura de tests, no de una skill)
- Coste en reloj: ~0,6 h hasta el commit del fix; ~0,9 h con el cierre, con dos paradas por el modo auto del harness
- Coste en tokens: no medido

## Cómo leer este ticket

Los hallazgos son hipótesis a testear con RED/GREEN, no cambios aprobados, y van ordenados por coste observado.

## Hallazgos

### 1. La propuesta de un ticket entra en el roadmap como decidida sin estar verificada

- **Qué pasó**: el ticket del patch 0080 §2 proponía exportar `GIT_AUTHOR_NAME`, `GIT_COMMITTER_NAME` y sus `_EMAIL` en `subject_launch`. La fila de deuda la copió en «Destino» como decisión del dev-lead. La propuesta no arregla el fallo: esas variables cambian el autor de un commit, pero `git config user.name`, que es lo que leen los sujetos, sigue devolviendo el global (comprobado con git 2.55). El fix usó `GIT_CONFIG_COUNT`/`GIT_CONFIG_KEY_n`/`GIT_CONFIG_VALUE_n`. Lo cazó el paso 1 de `sdd-start-patch` (causa raíz con evidencia antes del fix); sin él, el patch habría cerrado en verde sin arreglar nada: el test nuevo de privacidad solo habría fallado en la siguiente campaña.
- **Dónde en el kit**: `skills/sdd-templates/templates/kit-feedback-template.md` (campo «Propuesta») y `skills/sdd-feedback/SKILL.md` (reglas). El §1 del mismo ticket del 0080 sí marcó una propuesta como «Sin verificar»; el §2, no, y nada lo pide.
- **Por qué el kit no lo evitó**: la plantilla no distingue una propuesta ejecutada en la sesión de una supuesta, y `sdd-roadmap` la copia tal cual.
- **Coste**: bajo en este patch (una prueba de dos minutos), porque el paso 1 la desmintió. Sin ese paso, un fix inútil con los tests en verde.
- **Propuesta**: el campo «Propuesta» termina con `Verificada: <cómo>` o `Sin verificar`. `sdd-roadmap`, al copiarla a una fila, conserva esa marca.
- **Criterio de aceptación**: GIVEN una sesión cuya propuesta de ticket no se ejecutó, WHEN escribe el ticket con `sdd-feedback`, THEN la propuesta dice «Sin verificar», y la fila del roadmap que nace de ella también. RED: hoy 0/1 (§2 del ticket del 0080).

### 2. Una pasada de la suite completa falló en el umbral de tiempo del conjunto rápido del pre-commit

- **Qué pasó**: `Invoke-Pester -Path tests` dio 918/1: «Conjunto rápido del pre-commit tarda menos del umbral y, si no, nombra el fichero que hay que marcar con Slow». La siguiente pasada, sin cambios, dio 919/0. El patch añadía un caso a `SubjectOutputPrivacy.Tests.ps1` (que recorre toda la evidencia, 5,6 s) y ampliaba su alcance.
- **Dónde en el kit**: el test del umbral del pre-commit en `tests/` (no localicé el fichero exacto en esta sesión).
- **Por qué el kit no lo evitó**: un umbral de tiempo cerca del valor real depende de la carga de la máquina.
- **Coste**: una pasada extra de la suite (~1 min) y una nota de fallo intermitente en `patch.md`.
- **Propuesta**: medir cuánto margen queda entre el tiempo del conjunto rápido y el umbral; si es menor de un 20 %, marcar `Slow` el fichero más caro o subir el umbral con la medición.
- **Criterio de aceptación**: GIVEN la suite en `develop` sin cambios, WHEN se ejecuta cinco veces seguidas, THEN el test del umbral pasa las cinco.

## Lo que hice por iniciativa propia

- El stream en seco de `subject_launch` (`DRY_RUN=1`) muestra la identidad de git que ve el sujeto (`git: <user.name> <user.email>`). Así el lanzador lleva un test sin gastar en sujetos (`HeadlessLauncher.Tests.ps1`). Funcionó: dio RED antes del fix y GREEN después.
- Amplié el test de privacidad a las carpetas `red*`/`green*`/`refactor*` (las rondas extra, como `green1/` del 0080, quedaban fuera) y a `tests/*-red.md`/`*-green.md`. Salió un falso positivo, una ruta ya tapada con `C:\Users\…`, y la regex dejó de contar `…` como nombre de usuario.
- Saneé con una sustitución literal por bytes y comprobé que `git diff --numstat` daba inserciones = borrados en cada fichero: la codificación y los finales de línea se conservaron.

## Funcionó, no tocar

- Paso 1 de `sdd-start-patch`: «nada de implementar la hipótesis del reporte sin confirmarla con evidencia». Desmintió la propuesta del ticket antes de escribir una línea.
- «Si reproduce un fallo distinto del que predice el ticket o la fila, el patch sigue con el fallo medido»: la fuga medida era más ancha (41 ficheros de 10 carpetas, no solo el 0080). Pregunté una sola vez cuánto sanear y seguí.
- `GitEnvConvention.Tests.ps1` cazó que el test de privacidad ahora ejecuta git sin `Clear-GitEnv`/`Restore-GitEnv`.
- Paso 0 de `sdd-end-patch` con las tres etiquetas literales (patch 0080): el dev-lead eligió «Diferir» sin texto y la línea de §4 quedó completa sin otro turno. Es el disparador que dejó pendiente la validación diferida del 0080.

## Errores míos, no huecos del kit

- `git add -A` metió en el índice un cambio de `.claude/settings.json` que no era del patch; lo saqué antes del commit. Con ficheros del patch nombrados, no habría pasado.
- El modo auto del harness bloqueó las ediciones dos veces, sin veredicto del clasificador. Paré y pedí salir del modo, sin rodearlo por Bash. Es del entorno, no del kit.
