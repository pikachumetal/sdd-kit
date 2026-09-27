---
kit_version: 1.1.0
superpowers_version: 6.4.1
lane: task
id: 20260922-220856-task-0021-proportional-review
task: 0021
mode: full
date: 2026-09-23
---

# Ticket para el kit — task 0021: revisión por task abaratada, partición, RED previo y cierre en una sesión

## Contexto

- Carril y modo: task full, perfil `delegate`, ejecución en línea (Tasks 1 y 2) y GREEN con sujetos headless
- Skills del kit usadas: `sdd-start-task`, `sdd-start-release` (camino de replanificación, para publicar la reserva), `sdd-templates`, `sdd-end-task`, `add-to-changelog`, `sdd-feedback`; de superpowers, `brainstorming`, `writing-plans`, `executing-plans`, `test-driven-development`
- Proyecto: el propio kit (skills en Markdown, tests Pester, repo bare con worktrees, una persona y varias sesiones de agente en paralelo)
- Modelo del hilo: Opus 5.5
- Modelos de los subagentes: revisor final Sonnet; 14 sujetos headless Sonnet
- Coste en reloj: ~1,5 h de hilo más ~0,3 h de cierre
- Coste en tokens: hilo no medido; revisor final 142k; sujetos 5,15 $

## Cómo leer este ticket

Los hallazgos son hipótesis a testear con RED/GREEN, no cambios aprobados, y van ordenados por coste observado.

## Hallazgos

### 1. Publicar la reserva cuando la rama de integración está sacada en el worktree temporal de otra sesión

- **Qué pasó**: tras partir la 0021, el paso 4 de la replanificación manda commitear la reserva «en el worktree donde está sacada». `develop` estaba sacada en `res-0019`, el worktree temporal que otra sesión acababa de crear para publicar su propia reserva, limpio y a mitad de su trabajo. Pregunté al dev-lead (esperar o hacer fast-forward allí), esperé, y la otra sesión publicó la 0033 y la 0034: había leído el roadmap de `feature/0021` y saltó mis ids. Mi reserva salió después con un worktree temporal propio y un conflicto en la fila de ficheros calientes de `sdd-start-task/SKILL.md`, que tocaban las dos.
- **Dónde en el kit**: `skills/sdd-start-release/SKILL.md`, «Replanificar la release en curso», paso 4.
- **Por qué el kit no lo evitó**: el paso da dos casos, sacada en un worktree o en ninguno, y no distingue un worktree ajeno en uso de uno de trabajo normal.
- **Coste**: una pregunta al dev-lead, una espera y un conflicto resuelto a mano en `roadmap.md`.
- **Propuesta**: si el worktree donde está sacada la rama de integración es temporal de otra sesión (nombre de reserva o merge, sin rama `feature/*`), no se commitea allí: se espera a que desaparezca y se usa uno temporal propio. Mientras tanto la reserva ya es visible a los demás en el roadmap de la rama propia (paso 1 del mismo camino), y así evitó el choque.
- **Criterio de aceptación**: GIVEN `develop` sacada en un worktree temporal de otra sesión y una partición pendiente de publicar WHEN el agente llega al paso 4 THEN no commitea en ese worktree, espera o lo dice, y publica con un worktree propio cuando `develop` queda libre.

### 2. Validación diferida sin disparador: la regla escrita y la decisión del dev-lead no coinciden

- **Qué pasó**: el dev-lead respondió «diferida» sin nombrar disparador. `control-profiles.md` («Validación diferida») exige las tres condiciones y, sin disparador, la task queda EN ESPERA. La decisión del dev-lead del 2026-09-22 (fila 0015 del roadmap) dice lo contrario: el agente concreta el uso más próximo, lo dice en el mensaje de cierre y no vuelve a preguntar. Apliqué la decisión de la fila y lo registré como ruling.
- **Dónde en el kit**: `skills/sdd-start-task/references/control-profiles.md`, «Validación diferida»; `skills/sdd-end-task/SKILL.md` paso 0.
- **Por qué el kit no lo evitó**: la decisión vive solo en la fila de una task pendiente (0015); el texto que lee el agente es el anterior.
- **Coste**: un juicio contra la letra de la skill; es el cuarto cierre seguido con un disparador vago (0012, 0013, 0020, 0021).
- **Propuesta**: llevar a `control-profiles.md` la regla de la fila 0015: sin disparador, el agente concreta el uso más próximo con el que difiere como dueño, lo escribe así y lo dice en el mensaje de cierre.
- **Criterio de aceptación**: GIVEN un usuario presente que responde «diferida» sin disparador WHEN el agente ejecuta el paso 0 de `sdd-end-task` THEN no se queda EN ESPERA: escribe `Validación diferida: <fecha> · «diferida» · disparador: <uso más próximo>, a cargo de <quien difiere>` y lo dice en el cierre para que lo corrija.

### 3. La copia del molde en `green/` rompe el límite de longitud de ruta

- **Qué pasó**: copié `red/m3` a `green/m3` para el GREEN. La ruta más larga pasó de 138 a 140 caracteres y el pre-commit rechazó el commit (`PathLength.Tests.ps1`). El molde no había cambiado, así que lo quité y el lanzador GREEN usa `red/m3`.
- **Dónde en el kit**: `.docs/sdd/tech-stack.md`, «Fixtures y baselines» (el molde se versiona en `red/` y `green/`).
- **Por qué el kit no lo evitó**: la regla dice versionar molde y salida en las dos carpetas, pero no avisa de que `green/` son dos caracteres más que `red/`, ni de que un molde que no cambia no hace falta copiarlo.
- **Coste**: un commit rechazado y ~3 min.
- **Propuesta**: una línea en `tech-stack.md`: el GREEN reutiliza el molde de `red/` si no cambia; solo se copia lo que el GREEN modifica.
- **Criterio de aceptación**: GIVEN un GREEN cuyo molde no cambia respecto al RED WHEN el agente prepara `green/` THEN su lanzador apunta al molde de `red/` y la carpeta no duplica ficheros.

### 4. Seis sujetos headless en paralelo dejaron la máquina sin memoria para git

- **Qué pasó**: con la tanda RED en marcha (seis `claude -p` en paralelo), un `git commit` desde el hilo falló con `error launching git: The paging file is too small for this operation to complete.` El índice quedó con los cambios y el commit salió al acabar la tanda.
- **Dónde en el kit**: `.docs/sdd/tech-stack.md`, «Sujetos headless»; no hay guía de concurrencia.
- **Por qué el kit no lo evitó**: el método no dice cuántos sujetos lanzar a la vez ni que el hilo no ejecute el pre-commit (la suite) mientras corren.
- **Coste**: un commit fallido; sin pérdida.
- **Propuesta**: en «Sujetos headless», con la campaña en marcha el hilo no commitea (el pre-commit corre la suite) y espera a que acabe la tanda.
- **Criterio de aceptación**: GIVEN una tanda de seis sujetos en marcha WHEN el hilo tiene un cambio de docs pendiente THEN lo commitea al terminar la tanda, no durante.

## Lo que hice por iniciativa propia

- **Leer las plantillas de superpowers antes de diseñar la spec**: cuatro de las cinco palancas de la fila ya estaban en `subagent-driven-development`, y lo que las anulaba era texto del kit. Recortó la spec a quitar texto en vez de añadirlo. Volcado a `tech-stack.md`.
- **Revisores como sujetos headless**: el encargo compuesto (cabecera del kit + plantilla de superpowers rellenada) como petición de `claude -p` sobre un molde con el paquete de `review-package`; las tool calls del stream dicen si ejecutó la suite o rehízo el diff. Barato (~0,25 $ por revisor). Volcado a `tech-stack.md`.
- **Paquete del revisor final sin `red/` ni `green/`**, generado a mano con `git diff -- . ':(exclude)…'` porque `review-package` no admite exclusiones: 79 KB. Candidato para la 0032, que tiene esa fila.
- **El repaso de coherencia aplicado a mi propia spec** antes del gate: encontró dos incoherencias (el bloque de lite y una regla de la 0006 metida en la decisión 6).

## Funcionó, no tocar

- La regla 2 del `CLAUDE.md` del repo: el harness cargó `sdd-start-task` y `sdd-end-task` desde la caché 1.1.0 (sesión no arrancada con `Start-KitSession.ps1`); contrastar con `skills/<nombre>/SKILL.md` de la rama lo detectó en el primer paso las dos veces. Sexto reporte de la familia, sin coste.
- La primera pregunta sola con la propuesta de partir: una respuesta fijó carril, perfil, enunciado y partición en tres.
- El RED antes de la spec (regla de `tech-stack.md`): cambió el diseño (la sección «Fuera del alcance del revisor» del ticket chocaba con superpowers) por 2,44 $.
- La política de merge del bloque `merge` en `delegate`: merge `--no-ff` en un worktree temporal con la suite en el `pre-merge-commit`, sin preguntar.

## Errores míos, no huecos del kit

- El lint del molde no detectaba el fallo con finales CRLF; lo vi al probar el molde antes de lanzar.
- Un bloque del plan del molde GREEN, escrito desde bash con comillas invertidas, se ejecutó como comandos; lo reescribí con Edit.
- Un `git commit -F -` desde PowerShell tomó el mensaje como pathspec; pasé a `-F <fichero>`.
