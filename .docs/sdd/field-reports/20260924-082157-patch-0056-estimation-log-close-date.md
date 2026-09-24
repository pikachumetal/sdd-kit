---
kit_version: 1.1.0
superpowers_version: 6.4.1
lane: patch
id: 20260924-082157-patch-0056-estimation-log-close-date
task: 0056
mode:
date: 2026-09-24
---

# Ticket para el kit — patch 0056: el estimation-log fecha la fila con el cierre

## Contexto

- Carril y modo: patch
- Skills del kit usadas: `sdd-start-patch`, `sdd-end-patch`, `sdd-feedback`; script `Build-EstimationLog.ps1` y `Get-NextSddId.ps1`
- Proyecto: el propio repo del kit (skills en markdown + scripts PowerShell con Pester), una persona
- Modelo del hilo: Opus 5.5 (1M context)
- Modelos de los subagentes: no aplica
- Coste en reloj: ~0,4 h
- Coste en tokens: no medido

## Cómo leer este ticket

Los hallazgos son hipótesis a testear con RED/GREEN, no cambios aprobados, y van ordenados por coste observado.

## Hallazgos

### 1. No hay formato para saldar un solo ítem de una fila de roadmap que agrupa varios

- **Qué pasó**: el patch saldó «fecha de **cierre** en la fila del log», uno de los muchos ítems de la fila 0015 («Pulido transversal de la ejecución»). El formato de cierre de `roadmap-template.md` (`**[Patch <id>, <fecha>: saldada — <enlace>]**` o `parcial — …; queda: <…>`) está pensado para la fila entera; con `parcial` habría que resumir en «queda:» decenas de ítems. Imité la nota en cursiva que ya usa la fila para lo que pasó a la 0053 («*El 2026-09-24 el patch 0056 saldó …*») y dejé el texto original intacto.
- **Dónde en el kit**: `skills/sdd-templates/templates/roadmap-template.md` (formato de cierre) y `skills/sdd-end-patch/SKILL.md` paso 4.
- **Por qué el kit no lo evitó**: el formato solo contempla la fila como unidad; las filas «cajón» con muchos ítems no tienen salida.
- **Coste**: bajo (un par de minutos), pero la nota en cursiva no la encuentra el `grep` de lo saldado que promete el formato.
- **Propuesta**: permitir en el formato de cierre la variante «ítem saldado» (`**[Patch <id>, <fecha>: ítem saldado «<ítem>» — <enlace>]**`) al principio de la celda, acumulable, que sí case con el `grep`.
- **Criterio de aceptación**: GIVEN una fila de «Backlog» con varios ítems y un patch que salda uno WHEN el agente ejecuta `sdd-end-patch` paso 4 THEN la celda empieza por un prefijo reconocible por el mismo `grep` que lista lo saldado, y el texto original queda intacto.

## Lo que hice por iniciativa propia

- Antes del fix medí sobre todo el corpus qué artefactos tenían `created:`/`date:` distinto de la fecha de su carpeta (10). Eso dio el diff esperado del `estimation-log.md` regenerado y permitió verificarlo fila a fila: cambiaron exactamente esas 10 y la tabla por release. Funcionó; candidato a práctica para cualquier patch de `Build-EstimationLog.ps1`: medir el corpus antes y comparar el diff del log con la medición.
- El reporte pedía leer `date:`, pero la plantilla usa `created:` (solo un walkthrough lleva `date:`). Acepté los dos, `created:` primero, en vez de implementar el campo del reporte tal cual.

## Funcionó, no tocar

- `sdd-start-patch` paso 1 («la hipótesis del reporte no es la causa hasta confirmarla»): hizo mirar la plantilla y encontrar que el campo real es `created:`.
- «Es un script: test Pester en RED primero, sin campaña de sujetos» encajó sin fricción con el carril patch.
- `Get-NextSddId.ps1` dio el id (0056) sin colisión con la 0055 en paralelo.

## Errores míos, no huecos del kit

- Llamé a `Get-NextSddId.ps1 -Root .` (el parámetro es `-ProjectRoot`); `Build-EstimationLog.ps1` usa `-Root`, y confundí los dos.
- Primera versión de `patch.md` con recuento 11 en vez de 10 (conté dos veces la 0053, que tiene `created:` y `date:`) y con una celda de tabla que contenía `|`; corregido antes del commit.
