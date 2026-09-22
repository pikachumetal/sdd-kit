---
kit_version: 1.1.0
superpowers_version: 6.4.1
lane: patch
id: 20260922-220504-patch-0035-ids-de-otras-ramas
task: 0035
mode:
date: 2026-09-23
---

# Ticket para el kit — patch 0035: la fila de release no tiene formato de cierre parcial, y la sesión volvió a cargar la skill de la caché

## Contexto

- Carril y modo: patch, perfil `delegate`
- Skills del kit usadas: `sdd-start-patch`, `sdd-end-patch`, `sdd-feedback`, `sdd-templates` (`patch-template.md`, `kit-feedback-template.md`, `Get-NextSddId.ps1`, `Build-EstimationLog.ps1`), las tres primeras leídas del working tree
- Proyecto: el propio kit (repo de Markdown + scripts PowerShell con Pester), un dev-lead
- Modelo del hilo: Opus 5.5
- Modelos de los subagentes: no aplica
- Coste en reloj: ~45 min
- Coste en tokens: no medido

## Cómo leer este ticket

Los hallazgos son hipótesis a testear con RED/GREEN, no cambios aprobados, y van ordenados por coste observado.

## Hallazgos

### 1. Saldar una pieza de una fila de la release no tiene formato

- **Qué pasó**: el dev-lead pidió anotar en la fila 0009 que este patch salda la pieza de los ids en paralelo. La fila está en la tabla de la release 1.2.0, no en «Deuda técnica» ni en «Backlog», y reúne muchas piezas, de las que el patch salda dos. Seguí el precedente del patch 0030: un corchete `**[Patch 0035, <fecha>: saldada — [patch](…)]**` en línea, justo detrás de cada pieza.
- **Dónde en el kit**: `skills/sdd-templates/templates/roadmap-template.md` («Formato de cierre (esta tabla y el Backlog)») y `skills/sdd-end-patch/SKILL.md` paso 4, que solo cita filas de «Deuda técnica» o «Backlog».
- **Por qué el kit no lo evitó**: el formato de cierre asume que un patch salda una fila entera, o una fila parcial con el prefijo al principio. No contempla que un patch salde una pieza dentro de una fila de release que sigue abierta. Los prefijos al principio de la celda romperían el recuento con `grep` de las filas saldadas.
- **Coste**: bajo. Hay dos formas en uso, el prefijo al principio y el corchete en línea, y el `grep` de saldadas no ve el corchete en línea (a propósito, porque la fila sigue abierta).
- **Propuesta**: que el formato de cierre del `roadmap-template.md` declare la tercera forma, «pieza saldada dentro de una fila abierta»: corchete en línea detrás de la pieza, con el mismo texto que el prefijo, y fuera del recuento de filas saldadas. Que el paso 4 de `sdd-end-patch` y el paso 8 de `sdd-end-task` la citen.
- **Criterio de aceptación**: GIVEN una fila de release con varias piezas y un patch que salda una de ellas, WHEN `sdd-end-patch` ejecuta el paso 4, THEN el corchete queda en línea detrás de la pieza, la fila no cuenta como saldada en el `grep` y el texto original sigue intacto.

### 2. La sesión cargó `sdd-start-patch` de la caché 1.1.0: sexto reporte

- **Qué pasó**: la sesión no se arrancó con `./Start-KitSession.ps1`. El harness cargó `sdd-start-patch` desde `~/.claude/plugins/cache/sdd-kit/sdd-kit/1.1.0/`, cuyo paso 2 no conoce el modo `sequence` (id = ticket o `0000`). La regla 2 del `CLAUDE.md` me hizo leer `skills/sdd-start-patch/SKILL.md` de la rama antes de actuar. La diferencia estaba justo en el paso que decide el id. Con la versión de la caché, este patch habría salido como `patch-0000`.
- **Dónde en el kit**: `CLAUDE.md` regla 2 del repo del kit y `Start-KitSession.ps1` (patch 0027). No es una skill.
- **Por qué el kit no lo evitó**: el script de arranque es voluntario. Una sesión lanzada con `claude` a secas, por ejemplo desde un worktree que crea otra herramienta, sigue cargando la caché. La única red es que el agente se acuerde de contrastar el texto.
- **Coste**: nulo esta vez, porque contrasté. Sin la regla 2, el id del patch habría salido `0000` y la secuencia habría quedado rota.
- **Propuesta**: que un hook `SessionStart` del repo (no del plugin publicado) avise cuando el `Base directory` de las skills del kit apunte a la caché. Alternativa: que el hook de enrutado del plugin compare la versión cargada con la del `plugin.json` del working tree y avise si no coinciden.
- **Criterio de aceptación**: GIVEN una sesión de este repo lanzada con `claude` a secas, WHEN arranca, THEN el contexto inicial incluye un aviso de que las skills cargadas son las de la caché y no las de la rama.

### 3. La descripción del script en `sdd-templates` queda corta

- **Qué pasó**: `skills/sdd-templates/SKILL.md:41` describe `Get-NextSddId.ps1` como «mirando `specs/`, `roadmap.md` y las ramas del repo». Después de este patch lee también el roadmap y `specs/` de cada rama. La frase sigue siendo cierta, pero no dice que la reserva en otra rama cuenta. No la toqué, porque editar una skill exige un ciclo RED→GREEN (Art. I), y eso es desproporcionado para un patch de script.
- **Dónde en el kit**: `skills/sdd-templates/SKILL.md`, tabla de scripts.
- **Por qué el kit no lo evitó**: el Art. I no distingue una línea descriptiva de una regla de comportamiento.
- **Coste**: bajo. Un agente que lea la tabla puede creer que tiene que mirar a mano el roadmap de `develop`.
- **Propuesta**: en la próxima edición de `sdd-templates`, que la fila diga «el roadmap y `specs/` del working tree y de cada rama». Aparte, que la constitution decida si una línea que solo describe un script, sin regla, necesita ciclo.
- **Criterio de aceptación**: GIVEN la tabla de scripts de `sdd-templates`, WHEN un agente pregunta si una fila reservada en otra rama sin fusionar cuenta para el siguiente id, THEN la respuesta sale de la tabla sin abrir el script.

### 4. `created:` del patch y fecha del roadmap no dicen si son UTC o locales

- **Qué pasó**: la carpeta se nombró con timestamp UTC `20260922-220001`, que en hora local ya era 2026-09-23. En `created:` del `patch.md` puse 2026-09-22 (la UTC) y en el roadmap y en el cierre, 2026-09-23 (la local). `Build-EstimationLog.ps1` tomó 2026-09-22.
- **Dónde en el kit**: `skills/sdd-templates/templates/patch-template.md` (`created: <YYYY-MM-DD>`), y la columna «Fecha» de la tabla de patches de `roadmap-template.md`.
- **Por qué el kit no lo evitó**: solo el timestamp de la carpeta dice que es UTC. Las demás fechas no dicen nada.
- **Coste**: bajo. Un día de diferencia entre artefactos del mismo patch cerca de medianoche.
- **Propuesta**: una línea en la plantilla: las fechas `YYYY-MM-DD` son las de la carpeta (UTC), o bien las locales. Cualquiera de las dos, pero una sola.
- **Criterio de aceptación**: GIVEN un patch abierto a las 00:00 locales en UTC+2, WHEN se cierra, THEN `created:`, la fila del roadmap y el estimation-log llevan la misma fecha.

## Lo que hice por iniciativa propia

- Reproduje la colisión en el repo real antes de dar el fix por bueno. Con `git worktree add --detach` en la base de la que partió la 0019 (`02da87b^`), ejecuté el script de esa base y el nuevo: el viejo dio `0031`, el id que ya estaba reservado, y el nuevo `0035`. Después retiré el worktree. Es una receta barata para verificar cualquier cambio de `Get-NextSddId.ps1` sobre una colisión histórica, y podría ir a `tech-stack.md`.
- Amplié el alcance que pidió el dev-lead (el roadmap de la rama de integración y `specs/` de `feature/*`): el script lee roadmap y `specs/` de **todas** las ramas. Con lo pedido, una fila reservada en otra `feature/*` sin fusionar, que fue el caso de la 0005 y la 0012, seguía sin verse, y el test que pidió el dev-lead habría fallado. Lo dije en el informe al dev-lead.
- El caso de la rama actual del ticket del patch 0027 §1 no estaba implementado, aunque la petición decía «mantén». Lo implementé con su test.

## Funcionó, no tocar

- La regla 2 del `CLAUDE.md`: detectó la diferencia entre la caché y la rama en el paso 2 de `sdd-start-patch`.
- `Build-EstimationLog.ps1` regeneró el log desde `patch.md` §5.
- El pre-commit pasó la suite completa en cada commit (321 pasan, 0 fallan).
- La regla de la 0010 sobre rutas con tildes: los tests nuevos usan un repo en `0035-Partición-en-paralelo` y ramas con tildes, y el script ya tenía el `Invoke-GitUtf8` que lo resuelve.

## Errores míos, no huecos del kit

- El primer commit falló: pasé el mensaje como here-string detrás de `git commit -F -`, y PowerShell lo entregó como pathspec, no por stdin. Lo rehíce con un fichero temporal.
