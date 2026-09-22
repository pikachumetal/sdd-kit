---
kit_version: 1.1.0 (rama feature/pre-merge, camino de la 1.2.0)
superpowers_version: 6.3.0
lane: patch
id: 20260922-201945-patch-0030-pre-merge-commit
task: 0030
mode:
date: 2026-09-22
---

# Ticket para el kit — patch 0030: el cierre de un patch choca dos veces con el entorno (merge denegado, skill ausente)

## Contexto

- Carril y modo: patch
- Skills del kit usadas: `sdd-start-patch` y `sdd-end-patch` (cargadas de la caché del plugin 1.1.0, contrastadas con el working tree), `sdd-templates` (plantillas `patch-template` y `kit-feedback-template`, script `Get-NextSddId.ps1` y `Build-EstimationLog.ps1`); de superpowers, ninguna invocada explícitamente
- Proyecto: el propio kit (skills en markdown, suite Pester), una persona (dev-lead) más agentes
- Modelo del hilo: Opus 5 (1M)
- Modelos de los subagentes: no aplica, el patch se hizo en línea
- Coste en reloj: ~0,6 h (fix y verificación 0,4 h, cierre 0,2 h)
- Coste en tokens: no medido

## Cómo leer este ticket

Los hallazgos son hipótesis a testear con RED/GREEN, no cambios aprobados, y van ordenados por coste observado.

## Hallazgos

### 1. El paso 6 no prevé que el entorno deniegue el merge, y el cierre se queda a medias sin decir cómo seguir

- **Qué pasó**: con la política `merge` declarada en `sdd-kit.json` (`into: develop`, `noFf: true`) y perfil `delegate`, el agente ejecutó el merge del cierre. El clasificador del harness lo denegó («Merge Without Review») y el paso 6 se quedó sin completar. El agente informó del merge como PENDIENTE y escribió el comando exacto; el dev-lead respondió «dale, reintenta el merge» y a la segunda pasó. Dos turnos para una acción que la política ya autorizaba.
- **Dónde en el kit**: `skills/sdd-end-patch/SKILL.md` paso 6, y el mismo paso 10 de `sdd-end-task`.
- **Por qué el kit no lo evitó**: el paso solo contempla dos estados, «el usuario decide el merge» o «la política lo aplica». No contempla el tercero, que es el habitual en harnesses con clasificador: la política lo autoriza y el entorno lo bloquea. Sin guion, cada agente improvisa el informe.
- **Coste**: dos turnos y un cierre en dos tramos.
- **Propuesta**: el paso declara la forma del informe cuando el merge se deniega: el comando literal en un bloque, el estado de la rama destino (hash actual, sin tocar), y que lo demás del cierre ya está hecho. Añadir a la tabla de gates de `control-profiles.md` que un merge autorizado por política y denegado por el entorno **no** se reintenta con otra herramienta ni se deja en silencio.
- **Criterio de aceptación**: GIVEN un cierre con `merge.into` declarado y un entorno que deniega `git merge`, WHEN el paso 6 termina, THEN el informe final cita el comando denegado, el hash de la rama destino sin tocar y el resto del cierre como completo.

### 2. El paso 7 ofrece una skill que la caché del plugin no tiene, y la llamada falla

- **Qué pasó**: el paso 7 de `sdd-end-patch` (working tree) ofrece `sdd-feedback`. Al invocarla: `Unknown skill: sdd-kit:sdd-feedback`. La sesión no salió de `Start-KitSession.ps1`, así que el harness solo conocía las 12 skills de la caché 1.1.0, donde `sdd-feedback` no existe todavía. El agente siguió leyendo `skills/sdd-feedback/SKILL.md` y la plantilla a mano, que es lo que la skill habría dicho.
- **Dónde en el kit**: `skills/sdd-end-patch/SKILL.md` paso 7 y `skills/sdd-end-task/SKILL.md` paso 11.
- **Por qué el kit no lo evitó**: una skill del kit que nombra a otra da por hecho que están todas instaladas. En este repo conviven dos versiones (caché publicada y working tree) y una instalación parcial es un caso declarado en el propio paso 5 de `sdd-end-patch` («instalación parcial de una sola skill»), pero solo para el script de estimación.
- **Coste**: una llamada fallida y un turno de rodeo.
- **Propuesta**: donde una skill invoca a otra del kit, añadir la salida de respaldo que el paso 5 ya tiene: si la skill no está disponible, calcar su plantilla desde `sdd-templates` y decirlo en el informe. Es el sexto reporte de la familia «la sesión carga las skills de la caché» (tickets 0003, 0004, 0013, 0005 y patch 0024): esta vez el síntoma no fue texto viejo, fue una skill que no existe.
- **Criterio de aceptación**: GIVEN una sesión donde `sdd-feedback` no está registrada, WHEN el cierre llega al paso 7 y el usuario pide el ticket, THEN el agente lo escribe desde la plantilla sin una llamada fallida y avisa de que la skill no estaba disponible.

### 3. Verificar el camino de fallo de un hook obliga a maniobras que los hooks de seguridad bloquean

- **Qué pasó**: para comprobar que el hook nuevo **bloquea** un merge en rojo hacía falta repetir el merge sobre un árbol con un test roto. El intento natural, `git reset --hard <base>` en el worktree de prueba, lo bloqueó el hook de seguridad del entorno («matches dangerous pattern»). El agente lo resolvió retirando y recreando el worktree temporal y dejando el test roto **sin trackear**, que el hook ve igual porque la suite corre sobre el directorio de trabajo. Nunca hizo falta `--no-verify` ni un commit desechable.
- **Dónde en el kit**: no hay sitio: ni `sdd-start-patch` ni `patch-template.md` piden verificación negativa, y la receta de merge en worktree temporal (alcance de la 0009) solo cubre el camino feliz.
- **Por qué el kit no lo evitó**: la verificación de un patch se define como «reproducir el síntoma → ahora OK». Cuando el fix es un guardián (hook, validación, gate), el caso que importa es el que debe fallar, y nadie lo pide.
- **Coste**: un rodeo corto. Habría sido caro si el agente resuelve el bloqueo saltándose el hook.
- **Propuesta**: `patch-template.md` §4 dice que un fix que **bloquea** algo lleva dos filas, la que pasa y la que debe ser rechazada; y la receta de merge de la 0009 añade que el árbol sucio sin trackear sirve para provocar el fallo, sin `reset --hard` ni `--no-verify`.
- **Criterio de aceptación**: GIVEN un patch cuyo fix es un guardián, WHEN se redacta §4 con una sola fila «ahora OK», THEN la red flag de `sdd-end-patch` lo marca como verificación incompleta.

### 4. La rama existía antes que el id, y ninguna regla dice si se renombra

- **Qué pasó**: el dev-lead dictó el encargo con la rama `feature/pre-merge` ya creada. `Get-NextSddId.ps1` devolvió `0030` (correcto: el nombre de rama no es numérico, así que no lo contó como ocupado), la carpeta salió `…-patch-0030-pre-merge-commit` y el `patch.md` quedó con `branch: feature/pre-merge`, que no encaja con la forma `<feature|hotfix>/<id>` de la plantilla. El agente lo señaló en el informe y el dev-lead no pidió renombrar.
- **Dónde en el kit**: `skills/sdd-templates/templates/patch-template.md` (frontmatter `branch:`) y `skills/sdd-start-task/references/nombrado.md`.
- **Por qué el kit no lo evitó**: el nombrado supone que el id nace antes que la rama. Cuando la rama la crea la persona antes de arrancar el carril, la plantilla pide una forma que ya no se puede cumplir sin renombrar.
- **Coste**: bajo; un punto pendiente en el informe de cierre.
- **Propuesta**: `nombrado.md` declara que una rama preexistente se conserva y el vínculo lo lleva la carpeta de `specs/`; el `branch:` de la plantilla acepta el nombre real. Si el equipo prefiere renombrar, que sea una decisión dicha una vez, no una pregunta por patch.
- **Criterio de aceptación**: GIVEN un carril arrancado sobre una rama con nombre no numérico, WHEN se redacta el frontmatter, THEN el agente escribe el nombre real sin preguntar y ninguna red flag salta.

## Lo que hice por iniciativa propia

- **Ensayo del merge antes del merge**: con `git worktree add --detach <ruta> develop` se hizo el merge `--no-ff` real de la rama **sin mover `develop`**, para leer la salida del hook, y luego se retiró el worktree. Da la línea «Tests Passed…» que pide el criterio de aceptación del ticket 0025 §2 sin comprometer la rama destino, y sirve igual como ensayo de conflictos. Candidato a entrar en la receta de merge de la 0009.
- **Fallo provocado con un fichero sin trackear**: para el caso negativo, un `tests/Broken.Tests.ps1` sin añadir a git. El hook falla, el merge se aborta y no queda nada que limpiar en el historial.

## Funcionó, no tocar

- El paso 1 de `sdd-start-patch` («la hipótesis de quien reporta no es la causa hasta que la confirma la investigación») pagó: el encargo decía que un conflicto resuelto a mano podía dejar la rama destino en rojo, y `githooks(5)` dice lo contrario — un merge con conflicto se cierra con `git commit` y ahí sí corre `pre-commit`. El hueco real era el merge que git cierra solo. El matiz quedó en §2 del `patch.md` y no cambió el fix.
- `Build-EstimationLog.ps1 -Root .` regeneró el log con la fila del patch sin tocarlo a mano.
- La red de la regla 2 del `CLAUDE.md` funcionó: las dos skills se contrastaron con `git diff --no-index` contra el working tree, y en `sdd-start-patch` la diferencia era justo la que importaba (el modo `sequence` de los ids, ausente en la caché).

## Errores míos, no huecos del kit

- Primer commit con mensaje `wip:` y luego `--amend` para dejar el mensaje bueno: un rodeo evitable, el `patch.md` podía escribirse antes de commitear.
- En el test nuevo del hook puse la línea de `git ls-files` antes del `Set-ItResult -Skipped`, con lo que el skip llegaba tarde; corregido en el mismo turno.
