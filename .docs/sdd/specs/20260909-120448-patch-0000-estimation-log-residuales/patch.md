---
id: 20260909-120448-patch-0000-estimation-log-residuales
task: 0000
title: Patch — residuales parked de la revisión final de T7 en Build-EstimationLog.ps1
type: patch
status: done
created: 2026-09-09
branch: master
commit: 5170957
---

# Patch 0000 — residuales parked de la revisión final de T7 en `Build-EstimationLog.ps1`

## 1. Síntoma

La revisión final de rama de T7 dejó tres minors parked como deuda en el roadmap: (1) la rama «truncar antes del siguiente encabezado» de `Get-TimeSection` no tenía fixture propia (todas las fixtures terminaban el fichero en la sección de tiempo); (2) el singular «1 artefacto» no se assertaba; (3) el `try/catch` alrededor de `Resolve-Path` convertía cualquier excepción (permisos incluidos) en «No se encuentra…». v0.6.0 es la RC: no arrastra deuda (decisión del dev-lead, 2026-09-09).

## 2. Causa raíz

(1) y (2) son huecos de cobertura, no defectos: el código ya cortaba en el siguiente encabezado (verificado a mano por el revisor) y ya escribía el singular; faltaba el test que lo proteja. (3) es un `try/catch` demasiado ancho en `Build-EstimationLog.ps1:179-183`, escrito así por la ronda 1 de arreglos de T7 para uniformizar el mensaje de «raíz inexistente» con el de «sin specs»; la comprobación correcta es explícita (`Test-Path -LiteralPath $Root`) y deja pasar las demás excepciones.

## 3. Fix

- **Fichero(s)**: `skills/sdd-templates/scripts/Build-EstimationLog.ps1`, `tests/Build-EstimationLog.Tests.ps1`, `tests/fixtures/estimation-log/seccion/`
- **Cambio**: fixture `seccion/` con una sección de tiempo seguida de `## 3. Desviaciones` que contiene cifras señuelo (`Esfuerzo real: 99h`), y test que espera `2 | 1 | 0.5`; test del singular sobre la fixture `lite` (`1 artefacto)`); test de `-Root` inexistente con el mensaje «No se encuentra…»; en el script, `if (-not (Test-Path -LiteralPath $Root)) { throw … }` en lugar del `try/catch`.

## 4. Verificación

| # | Caso | Resultado |
| --- | --- | --- |
| 1 | Tests nuevos antes de tocar el script | ✅ verificado por el agente: 30/30 (los dos primeros son cerrojos de cobertura: pasan de entrada; el tercero también, porque el mensaje era el mismo) |
| 2 | Suite completa tras el cambio del script | ✅ verificado por el agente: 136/136, 5 skipped |
| 3 | Log del kit regenerado sin cambios de contenido | ✅ verificado por el agente |

## 5. Tiempo (ligero)

- Estimación: — (entró por la regla «sin deuda en la RC»)
- Real: ~0,15 h
