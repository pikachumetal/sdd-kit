---
kit_version: 1.1.0
superpowers_version: 6.4.1
lane: patch
id: 20260925-090909-patch-0072-subject-output-privacy
task: 0072
mode:
date: 2026-09-25
---

# Ticket para el kit — patch 0072: las salidas de los sujetos sin el home ni el usuario

## Contexto

- Carril y modo: patch, perfil `delegate`
- Skills del kit usadas: `sdd-start-patch`, `sdd-end-patch`, `sdd-feedback`; `Get-NextSddId.ps1`, `Build-EstimationLog.ps1` e `Invoke-SddMerge.ps1`
- Proyecto: el propio kit (Markdown, Pester sobre pwsh 7 y un script Node de la evidencia), una persona
- Modelo del hilo: Opus 5.5
- Modelos de los subagentes: no aplica; sin sujetos (la petición lo excluía)
- Coste en reloj: ~0,5 h hasta el merge, más el cierre de la validación y este ticket
- Coste en tokens: no medido

## Cómo leer este ticket

Los hallazgos son hipótesis a testear con RED/GREEN, no cambios aprobados, y van ordenados por coste observado.

## Hallazgos

### 1. `sdd-end-patch` fusiona sin la parada de validación que la tabla de gates pide en `delegate`

- **Qué pasó**: el patch se cerró y se fusionó en `develop` (`b603883`), con push, sin preguntar la validación. El dev-lead la dio después del merge: «pruebas diferidas a uso». Hubo que reabrir el worktree para apuntar la validación diferida en `patch.md` y en el roadmap, y fusionar otra vez.
- **Dónde en el kit**: `skills/sdd-end-patch/SKILL.md`, pasos 1 y 6; la fila «Validación» de la tabla de gates en `skills/sdd-start-task/references/control-profiles.md` («para» en `pair` y `delegate`). El `CLAUDE.md` del repo, regla 6: «la validación final no se quita nunca».
- **Por qué el kit no lo evitó**: la checklist de `sdd-end-patch` pasa de `patch.md` finalizado (paso 1) al merge (paso 6) sin ningún paso de validación. La tabla de gates no dice si la fila «Validación» vale también para un patch; la fila del merge sí nombra «cierre de task y de patch».
- **Coste**: medio. Un segundo merge y un segundo push por algo que el dev-lead habría dicho en una línea. Con un «no funciona», el fallo ya estaría en `develop` publicado.
- **Propuesta**: `sdd-end-patch` gana un paso de validación antes de la rama: en `pair` y `delegate`, para y pregunta con el smoke de `patch.md` §4; las tres salidas son validado, diferido (forma de «Validación diferida» de `control-profiles.md`, con la línea en `patch.md` §4 y el prefijo 🧪 en la fila de patches) o no validado (no se fusiona). En `unattended`, diferida al smoke de la release. La fila «Validación» de la tabla dice «task y patch». Recoge también la forma de la validación diferida de un patch, que la fila 0015 del roadmap tiene pendiente desde el patch 0038.
- **Criterio de aceptación**: GIVEN un patch en `delegate` con el bloque `merge` completo y `patch.md` finalizado, WHEN el sujeto sigue `sdd-end-patch`, THEN pregunta la validación antes de llamar a `Invoke-SddMerge.ps1`. Hoy fusiona sin preguntar (esta sesión).

### 2. Una petición de varios commits choca con «un solo commit» del patch y con el pre-commit

- **Qué pasó**: el dev-lead pidió tres commits en orden (lanzador, test, saneado) y «test en RED primero». `sdd-start-patch` paso 5 pide un solo commit con código, tests y `patch.md`, y `sdd-end-patch` paso 2 pide juntar los intermedios. Además, el pre-commit del repo corre la suite y no deja commitear el test del repo en rojo, así que el orden pedido no era posible sin saltarse el hook. Decidí yo: tres commits sin juntar, en orden lanzador, saneado y test, con el RED visto antes del saneado y registrado en `patch.md`.
- **Dónde en el kit**: `skills/sdd-start-patch/SKILL.md` paso 5; `skills/sdd-end-patch/SKILL.md` paso 2; `skills/sdd-start-task/references/commit-milestones.md`.
- **Por qué el kit no lo evitó**: ninguna de las tres dice qué pasa cuando el dev-lead fija la forma de los commits, ni que un test que debe verse en RED no puede ir en un commit propio si hay un hook que corre la suite.
- **Coste**: bajo; dos decisiones sin respaldo escrito, contadas en el mensaje final.
- **Propuesta**: en `commit-milestones.md`, una línea: la forma de commits que fija el dev-lead manda sobre «un solo commit»; y si un commit dejaría la suite en rojo con un hook que la corre, el test va en el mismo commit que su arreglo o después de él, y el RED se registra en el artefacto (no en el historial).
- **Criterio de aceptación**: GIVEN un patch cuya petición pide «test en un commit, arreglo en otro» en un repo con pre-commit que corre la suite, WHEN el sujeto commitea, THEN no usa `--no-verify`, commitea el test con el arreglo o después, y registra el RED en `patch.md` §4.

## Lo que hice por iniciativa propia

- Volví a medir la fila de deuda antes de fijar el alcance: 186 ficheros, no los ~110 del ticket de origen (que solo contó `out/`). Funcionó: el alcance salió de la medición, no de la fila (es la regla de «volver a medir» de la fila 0015).
- Amplié el alcance de `red|green` a `red|green|refactor`, porque `refactor/out` es evidencia del mismo tipo y llevaba el usuario. Dicho en el mensaje final como decisión sin el dev-lead.
- Verifiqué el saneado masivo con `git diff --word-diff`: 0 palabras quitadas sin el usuario y 0 añadidas sin marcador. Para un cambio mecánico sobre cientos de ficheros de evidencia, es la prueba de que «no cambia nada más».
- Añadí al test un caso con el usuario de la máquina que corre la suite: el patrón de rutas solo veía 115 de los 186 ficheros.

## Funcionó, no tocar

- `Get-NextSddId.ps1 -Reserve` y el renombrado de la rama antes del primer commit.
- `Invoke-SddMerge.ps1 -Push`: fusionó y publicó sin intervención.
- El formato de cierre de fila de `roadmap-template.md`: la fila de deuda quedó saldada con su prefijo y el texto intacto.

## Errores míos, no huecos del kit

- El primer test del lanzador pasaba en falso: `node` es un shim que no arranca con `USERPROFILE` cambiado, el extracto salía vacío y `Should -Not -Match` pasaba. Lo pilló la segunda aserción. Anotado en `tech-stack.md`.
- El primer patrón del test del repo daba un falso positivo por backtracking (`\\{1,2}` casando una sola barra antes de `\<user>`).
- Un heredoc a `python3` sin contenido se quedó colgado 120 s (el stub de la tienda de Windows), y otro falló por un escape `\U` en un literal de Python. Edité con `Edit`.
