---
kit_version: 2.0.0 (marcador del repo; skills del working tree, plugin.json 2.1.0)
superpowers_version: 6.4.2
lane: patch
id: 20260929-172517-patch-0112-merge-push-no-remote
task: 0112
mode:
date: 2026-09-29
---

# Ticket para el kit — patch 0112: `-Push` sin remoto; el molde de cierre de patch está desfasado

## Contexto

- Carril y modo: patch con edición de skill (recorte de `merge-recipe.md` §Push con RED/GREEN), perfil `delegate`
- Skills del kit usadas: `sdd-start-patch`, `sdd-end-patch`, `sdd-feedback`, `sdd-templates` (`Get-NextSddId.ps1`, `Build-EstimationLog.ps1`, `Test-Capabilities.ps1`, `Invoke-SddMerge.ps1`, `Measure-SessionTokens.ps1`); de superpowers, ninguna invocada
- Proyecto: el propio kit (skills en Markdown, scripts PowerShell con Pester), una persona
- Modelo del hilo: Opus 5.5
- Modelos de los subagentes: no aplica; sujetos headless Sonnet (2)
- Coste en reloj: ~0,8 h
- Coste en tokens: hilo 6.384.490 (2,40 $); sujetos 0,73 $

## Cómo leer este ticket

Los hallazgos son hipótesis a testear con RED/GREEN, no cambios aprobados, y van ordenados por coste observado.

## Hallazgos

### 1. El molde salas de la task 0067 está desfasado frente al kit 2.x y ensucia la salida de los sujetos

- **Qué pasó**: el GREEN reutilizó `mold.sh` de `.docs/sdd/specs/20260924-225643-task-0067-patch-capabilities/red/`, como el lanzador del patch 0075. Los 2 sujetos dedicaron su sección «Pendiente» a lo mismo. Por un lado, `Test-Capabilities.ps1` falla en `capabilities/bookings.md` del molde («sección «Historial», resto del kit 1.x» y «falta la sección «Propósito»»). Por otro, el hook avisa de migraciones pendientes, porque el `sdd-kit.json` del lanzador fija `"version": "2.0.0"` y el kit va por la 2.1.0.
- **Dónde en el kit**: `.docs/sdd/specs/20260924-225643-task-0067-patch-capabilities/red/mold.sh` (`base_files`), y el `sdd-kit.json` literal de `.docs/sdd/specs/20260925-114821-patch-0075-patch-close-validation/red/subject.sh`, que este patch copió. No hay un molde de cierre de patch en `tests/headless/`.
- **Por qué el kit no lo evitó**: los moldes viven en carpetas de spec cerradas y nadie los pone al día cuando cambia el formato de capacidades o la versión. `tech-stack.md` avisa de que «las fixtures se evaporan», pero no de que se quedan viejas.
- **Coste**: bajo en este patch, porque lo medido (la línea de push) no dependía de eso. Aun así, un sujeto que se para en el validador de capacidades no llega al paso medido, y el ruido ocupa el mensaje final que se evalúa.
- **Propuesta**: un molde de cierre de patch vivo en `tests/headless/` (o `base_files` actualizado a capacidades 2.x), con la versión de `sdd-kit.json` leída de `.claude-plugin/plugin.json` en vez de fijada. Un test Pester lo ejecuta en seco y pasa `Test-Capabilities.ps1` sobre él.
- **Criterio de aceptación**: GIVEN el molde de cierre de patch recién construido, WHEN se ejecuta `Test-Capabilities.ps1 -Path .docs/sdd` y se arranca una sesión con el kit de la rama, THEN el validador pasa y el hook no emite el aviso de migraciones pendientes. Hoy falla por las dos cosas.

### 2. Los scripts del kit no coinciden en el nombre del parámetro de la raíz

- **Qué pasó**: `Measure-SessionTokens.ps1 -ProjectRoot .` falló con «A parameter cannot be found that matches parameter name 'ProjectRoot'». Hubo que leer la ayuda y usar `-Path`.
- **Dónde en el kit**: `skills/sdd-templates/scripts/`. `Invoke-SddMerge.ps1` y `Get-NextSddId.ps1` usan `-ProjectRoot`, `Build-EstimationLog.ps1` usa `-Root`, y `Test-Capabilities.ps1` y `Measure-SessionTokens.ps1` usan `-Path`.
- **Por qué el kit no lo evitó**: no hay convención escrita para ese parámetro, y el agente generaliza desde el último script que usó.
- **Coste**: una llamada fallida, con su lectura de ayuda.
- **Propuesta**: aceptar `-ProjectRoot` como alias (`[Alias('ProjectRoot')]`) en los scripts que toman la raíz del proyecto con otro nombre.
- **Criterio de aceptación**: GIVEN un proyecto con `.docs/sdd/`, WHEN se ejecuta `Measure-SessionTokens.ps1 -ProjectRoot .` (o `Build-EstimationLog.ps1 -ProjectRoot .`), THEN hace lo mismo que con `-Path` o `-Root`. Hoy falla por el nombre del parámetro.

## Lo que hice por iniciativa propia

- **Los tickets de campo como RED de un recorte de skill**: usé como baseline los tres tickets que ya documentaban la conducta, sin lanzar sujetos. `tech-stack.md` lo admite para streams y ramas; para tickets no lo dice explícito. Funcionó: el GREEN midió la conducta nueva contra un RED de 0/3 sin gastar en él.
- **Quitar la excepción en vez de reforzarla**: la receta pedía mirar el remoto antes de pasar `-Push`, y 3 de 3 agentes no lo hicieron. En vez de subir la regla a la lista numerada, el script asume el caso y la receta pierde la condición. Candidata a regla: si una excepción de la receta falla en campo y el script puede asumirla, la asume el script.
- **La línea de estado del script como texto del mensaje final**: el script emite `push: no hecho: sin remoto` con la misma forma que la línea de terminado. Los 2 sujetos la copiaron literal, sin inventar motivo.

## Funcionó, no tocar

- El cerrojo de `Invoke-SddMerge.ps1`: otra sesión lo tenía, el script dijo quién y esperó. Fusionó y publicó sin intervención.
- `Get-NextSddId.ps1 -Reserve` y la regla de renombrar `feature/<slug>` a `feature/<id>-<slug>` antes del primer commit.
- La parada de validación de `sdd-end-patch` paso 0, con las tres opciones literales.
- El `pre-commit` con el conjunto rápido: 811 tests en ~24 s por commit.

## Errores míos, no huecos del kit

- El lanzador del GREEN lo copié del patch 0075, que es anterior a `tests/headless/lib.sh` y `run.sh` (patch 0076). Llama a `claude` directamente en vez de usar `subject_init` y `subject_launch`, y sin techo de coste. Lo escogí por ser el cierre de patch más parecido, sin comprobar que tuviera el lanzador de referencia.
- El test reescrito sigue dentro del `Describe` «Un merge del cierre que falla deja la rama destino como estaba», aunque ya no falla.
- Supuse LF en `capabilities/control-profiles.md`, que es CRLF, y un reemplazo exacto falló. Lo repetí respetando el fin de línea.
