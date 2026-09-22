---
kit_version: 1.1.0
superpowers_version: 6.3.0
lane: patch
id: 20260922-134556-patch-0024-readme-marketplace
task: 0024
mode:
date: 2026-09-22
---

# Ticket para el kit — patch 0024: la skill de la caché habría dado otro id, y no hay forma fijada de saldar una fila de deuda

## Contexto

- Carril y modo: patch
- Skills del kit usadas: `sdd-start-patch`, `sdd-end-patch`, `sdd-templates` (`patch-template.md`, `kit-feedback-template.md`, `Get-NextSddId.ps1`, `Build-EstimationLog.ps1`), `sdd-feedback`; todas leídas del working tree, no de la caché
- Proyecto: el propio kit (repo de Markdown + scripts PowerShell con Pester), un dev-lead
- Modelo del hilo: Opus 5
- Modelos de los subagentes: no aplica
- Coste en reloj: ~20 min
- Coste en tokens: no medido

## Cómo leer este ticket

Los hallazgos son hipótesis a testear con RED/GREEN, no cambios aprobados, y van ordenados por coste observado.

## Hallazgos

### 1. La skill cargada desde la caché habría nombrado mal la carpeta del patch

- **Qué pasó**: el harness cargó `sdd-start-patch` de la caché del plugin (1.1.0). Su paso 2 dice «`<id>` = ticket, `0000` si no hay». La versión del working tree lee `ids.mode` de `.docs/sdd/sdd-kit.json`, que aquí es `sequence`, y manda pedir el id a `Get-NextSddId.ps1`, que devolvió `0024`. Siguiendo la caché, la carpeta habría salido como `patch-0000-…` y `NamingConvention.Tests.ps1` o la secuencia de ids se habrían roto. Lo evité porque la regla 2 del `CLAUDE.md` pide comparar el texto cargado con `skills/<nombre>/SKILL.md` de la rama. El diff mostró la diferencia en el paso 2 y en la `description`.
- **Dónde en el kit**: no está en una skill. Es la forma de arrancar la sesión en este repo (`CLAUDE.md`, regla 2) y la distribución del plugin (`tech-stack.md`). Es el cuarto reporte, tras los tickets 0003, 0004 y 0013.
- **Por qué el kit no lo evitó**: la sesión arrancó con el plugin instalado, no con `--plugin-dir .`. La regla 2 solo funciona si el agente se acuerda de hacer el diff antes de cada paso, y el harness no avisa de que la skill cargada no coincide con la del repo.
- **Coste**: esta vez, un diff extra. Sin él, el patch habría salido con un id que no pertenece a la secuencia y habría hecho falta renombrar la carpeta, el `patch.md` y las filas del roadmap y del changelog.
- **Propuesta**: que un test compare la versión de `plugin.json` con la de la caché instalada y que el hook `SessionStart` avise en este repo cuando difieran. Alternativa más barata: un script `Start-KitSession.ps1` que lance `claude` con la receta de la regla 2, citado en la primera línea del `CLAUDE.md`.
- **Criterio de aceptación**: GIVEN una sesión en este repo con el plugin instalado en una versión distinta de la del working tree, WHEN arranca, THEN el agente recibe un aviso que nombra las dos versiones antes de cargar ninguna skill del kit.

### 2. No hay forma fijada de marcar una fila de deuda como saldada

- **Qué pasó**: el dev-lead pidió marcar la fila de deuda como saldada con enlace al patch. Ninguna skill ni plantilla dice cómo, y el roadmap usa tres formas distintas: título tachado con `— **saldada el …**` (fila de los documentos de flujo), prefijo `**[Task 0013, 2026-09-22: saldada …]**` (filas recientes) y `✅ patch 0023` dentro de la columna Destino. Tuve que leer diez filas para elegir una. Elegí el prefijo, que es el más reciente y admite «saldada en parte».
- **Dónde en el kit**: `skills/sdd-end-patch/SKILL.md` paso 4, `skills/sdd-end-task/SKILL.md` paso 8 («Deuda descubierta → fila en la tabla de deuda técnica»: dice cómo se abre una fila, no cómo se cierra) y `skills/sdd-templates/templates/roadmap-template.md`, sección «Deuda técnica».
- **Por qué el kit no lo evitó**: amplía el hallazgo 2 del ticket del patch 0023, que pedía marcar la fila sin fijar la forma. Aquí lo pidió el usuario, pero el formato siguió sin respaldo.
- **Coste**: bajo por sesión, pero la tabla deriva: con tres formas, «¿qué deuda sigue abierta?» no se responde con un `grep`.
- **Propuesta**: fijar un solo formato en `roadmap-template.md`, por ejemplo el prefijo `**[<Task|Patch> <id>, <fecha>: saldada | saldada en parte — <enlace>]**`, y citarlo desde el paso 4 de `sdd-end-patch` y el paso 8 de `sdd-end-task`.
- **Criterio de aceptación**: GIVEN un roadmap con una fila de deuda que salda un patch, WHEN se cierra con `sdd-end-patch`, THEN la fila lleva el prefijo del template con el enlace al `patch.md`, y un `Select-String 'saldada'` lista todas las filas cerradas y ninguna abierta.

## Lo que hice por iniciativa propia

- Antes de fijar el alcance comparé la base: `git log -- README.md` desde la fecha de la fila y `git show` del único commit posterior (`ed7130f`). Me lo pidió el dev-lead, y es justo lo que proponía el hallazgo 1 del ticket del patch 0023, así que es evidencia a favor de esa propuesta: medir sobre la base actual costó dos comandos y confirmó que el alcance seguía en pie.
- Al cerrar, señalé que el `.claude/settings.json` de este repo tiene el mismo hueco que el patch documenta: solo `enabledPlugins`, sin `extraKnownMarketplaces`. Candidato a regla: cuando un patch documenta una convención para los proyectos, comprobar si el propio repo la cumple (dogfooding, Art. VII).

## Funcionó, no tocar

- `Get-NextSddId.ps1` dio el id 0024 sin ambigüedad en modo `sequence`.
- `Build-EstimationLog.ps1` regeneró el log desde `patch.md` §5.
- El hook de pre-commit pasó la suite completa en los dos commits (291 pasan, 0 fallan).

## Errores míos, no huecos del kit

- Inserté la fila de la tabla de patches por índice y cayó encima del separador `| --- |`. Lo vi en el diff y la moví antes de commitear.
- En el informe de cierre escribí «el `.claude/settings.json` de este repo sigue llevando solo `enabledPlugins`» sin decir qué fichero era ni por qué importaba. El dev-lead tuvo que preguntar a qué me refería. Es lo que ya pide la regla 6 del `CLAUDE.md`: explicar lo que doy por sabido.
