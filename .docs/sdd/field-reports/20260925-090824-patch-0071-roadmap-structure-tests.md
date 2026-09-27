---
kit_version: 1.1.0
superpowers_version: 6.3.0 (caché del plugin)
lane: patch
id: 20260925-090824-patch-0071-roadmap-structure-tests
task: 0071
mode:
date: 2026-09-25
---

# Ticket para el kit — patch 0071: el cierre del patch no dice si la validación final para antes del merge en `delegate`

## Contexto

- Carril y modo: patch
- Skills del kit usadas: `sdd-start-patch`, `sdd-templates` (plantilla de patch, `Get-NextSddId.ps1`, `Build-EstimationLog.ps1`), `sdd-end-patch`, `sdd-feedback`
- Proyecto: el propio repo del kit (Markdown + PowerShell/Pester), un dev-lead
- Modelo del hilo: Opus 5.5
- Modelos de los subagentes: no aplica
- Coste en reloj: ~0,25 h hasta el cierre, más la vuelta de validación
- Coste en tokens: no medido

## Cómo leer este ticket

Los hallazgos son hipótesis a testear con RED/GREEN, no cambios aprobados, y van ordenados por coste observado.

## Hallazgos

### 1. En `delegate`, `sdd-end-patch` fusiona sin parada de validación final; el `CLAUDE.md` del repo dice que esa parada no se quita nunca

- **Qué pasó**: con el bloque `merge` completo (`push: true`) y perfil `delegate`, el paso 6 de `sdd-end-patch` y la fila «Merge a develop (cierre de task y de patch)» de `control-profiles.md` mandan fusionar y empujar sin preguntar. La regla 6 del `CLAUDE.md` del repo lista «la validación final» entre las cuatro paradas de `delegate` y dice que «no se quita nunca». Paré antes del merge, por el `CLAUDE.md`. El dev-lead respondió con «pruebas diferidas a uso, feedback, commit y merge»: la parada le sirvió para diferir la validación y pedir el ticket.
- **Dónde en el kit**: `skills/sdd-end-patch/SKILL.md` paso 6; `skills/sdd-start-task/references/control-profiles.md`, fila «Merge a develop». Buscar «alidación final» en `control-profiles.md` no da coincidencias, así que no localicé dónde fija el kit esa parada para un patch.
- **Por qué el kit no lo evitó**: el paso 6 no nombra la validación final, y la fila del merge no la cita como requisito previo.
- **Coste**: bajo. Hubo que decidir entre dos textos contradictorios, y otro agente habría fusionado y empujado sin la validación.
- **Propuesta**: que el paso 6 de `sdd-end-patch` diga que en `delegate` el merge va después de la validación final del dev-lead (o de su diferimiento explícito), igual que el cierre de una task; o bien, si el kit no quiere esa parada en un patch, corregir la regla 6 del `CLAUDE.md`.
- **Criterio de aceptación**: GIVEN un patch cerrado en `delegate` con el bloque `merge` completo y sin validación del dev-lead en la sesión, WHEN el agente llega al paso 6 de `sdd-end-patch`, THEN para y pide la validación (o su diferimiento) antes de lanzar `Invoke-SddMerge.ps1`; hoy 1 de 1 textos del kit lo permite sin parar.

## Lo que hice por iniciativa propia

- **RED contra el documento histórico entero, con la fixture recortada**: el test lee el roadmap desde `$env:SDD_KIT_ROOT`, el mismo override que ya usa `PathLength.Tests.ps1`. El RED se ejecutó con esa variable apuntando a una copia temporal del roadmap completo de `0fc231e^` (168 KB). La fixture versionada es un extracto literal de 25 líneas con los cuatro defectos, y un segundo `It` fija lo que el comprobador detecta en ella. Funcionó: el RED tiene la evidencia completa y el repo no carga una copia de 168 KB.

## Funcionó, no tocar

- `Get-NextSddId.ps1 -Reserve` y el renombrado de rama antes del primer commit: sin fricción.
- El pre-commit con el conjunto rápido (17 s) recogió el test nuevo sin tocar nada: basta con no marcarlo `Slow`.
- `Build-EstimationLog.ps1` regeneró la fila del patch y el total «sin publicar» desde `patch.md`.

## Errores míos, no huecos del kit

- Calculé a mano las líneas de las filas vacías en la fixture y fallé por una: el primer GREEN falló por mi expectativa, no por el comprobador.
- Pasé el mensaje de commit como here-string a `git commit -F -` sin tubería, y git lo tomó como pathspec; lo rehíce con un fichero temporal.
