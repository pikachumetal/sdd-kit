---
id: 20261003-144033-patch-0138-task-done-exit-code
task: 0138
title: Patch — El comando de task-done sale con distinto de 0 si algo falla
type: patch
solution: dev-lead
status: done
created: 2026-10-03
branch: hotfix/v2.3.1
commit: d9f78fca
---

# Patch 0138 — El comando de task-done sale con distinto de 0 si algo falla

## Capacidades

- Modificadas: `feature-flow` — cambia «Los scripts de Native se lanzan con la herramienta Bash y con salida»: el comando de `task-done` sale con distinto de 0 si algo falla (con Pester, `-CI`)

## 1. Síntoma

Ticket de la feature 0128 §4 (`field-reports/20261003-120530-feature-0128-sdd-grilling.md`, en `develop`): `task-done … -- pwsh -NoProfile -Command "Invoke-Pester tests/HeadlessLauncher.Tests.ps1, tests/Battery.Tests.ps1 -Output Minimal"` en Git Bash dio `Tests Passed: 33, Failed: 1` y aun así `ledger: Task 1: complete`: `Invoke-Pester` sin `-CI` termina con 0. La regla «usa `-CI`» solo estaba en el `tech-stack.md` de este repo, y el plan copió un comando sin ella.

## 2. Solución fijada

Dev-lead, 2026-10-03: «El comando que se pasa a `task-done` tiene que salir con un código distinto de 0 si algo falla. Con Pester, `-CI`. Una frase en el paso 6 de skills/sdd-start-feature/SKILL.md y en el campo «Verificación» de plan-template.md. Excepción a la congelación de la 0121 aprobada por el dev-lead (2026-10-03).»

Lo que da por existente, comprobado: el paso 6 de `sdd-start-feature` ya dice qué tiene que cumplir el comando de `task-done` (imprimir algo), y `plan-template.md` tiene el campo `**Verificación**: <los comandos de esas superficies y ninguno más>`.

## 3. Fix

- **Fichero(s)**:
  - `skills/sdd-start-feature/SKILL.md` (paso 6)
  - `skills/sdd-templates/templates/plan-template.md` (campo «Verificación»)
  - `tests/WordBudget.Tests.ps1` (topes)
  - `tests/task-done-exit-code-red.md` (evidencia RED/GREEN)
  - `.docs/sdd/capabilities/feature-flow.md` (fusión del delta, en el cierre)
- **Cambio**: tras la regla de la salida vacía, el paso 6 dice «Y tiene que salir con un código distinto de 0 si algo falla: con Pester, `-CI`, porque sin él `Invoke-Pester` sale con 0 con un test en rojo y `task-done` da la task por completa». El campo «Verificación» de la plantilla añade «cada uno sale con un código distinto de 0 si algo falla (con Pester, `-CI`)».
- **Decisiones**:
  - Las dos frases, su sitio y la excepción a la congelación de la 0121 — dev-lead
  - Campaña: micro-test Opus, n=6 por mensaje, ~4 $ de previsión — dev-lead
  - Subir los topes de palabras en vez de recortar: `sdd-start-feature` 8400 → 8430 (`SKILL.md`) y 20210 → 20250 (skill), `sdd-templates` 11960 → 11980, kit 53880 → 53930; el adelgazamiento queda en la 0121 — dev-lead
  - La redacción exacta de las dos frases — sin el dev-lead (la lee el agente, no el usuario del proyecto)

## 4. Verificación

| # | Caso | Resultado |
| --- | --- | --- |
| 1 | RED `plan`: «Verificación» de una task con Pester, plantilla de 2.3.0 | ❌ sale distinto de 0 si falla en 0 de 6 |
| 2 | RED `td2`: `task-done` con la «Verificación» del plan completa, `SKILL.md` de 2.3.0 | ❌ 2 de 6 copian el comando sin `-CI` |
| 3 | RED `td`: `task-done` con `Invoke-Pester <fichero>` | ✅ 6 de 6 ya lo protegen (control) |
| 4 | GREEN de los tres mensajes con el texto del patch | ✅ `-CI` en 6 de 6 en cada uno |
| 5 | fila de control: «el comando tiene que imprimir algo» | ✅ los 6 comandos de `td2` imprimen (Pester con `-CI` da su resumen) |
| 6 | `tests/WordBudget.Tests.ps1`, `tests/Skills.Tests.ps1`, `tests/AnchorTemplates.Tests.ps1` | ✅ 222/222 |

Los casos los verificó el agente. Método y lectura en `tests/task-done-exit-code-red.md`; las 36 salidas, en `micro/out/`.

Validación en campo: 2026-10-03 · micro-test Opus n=6 por mensaje (plan: 0 → 6 de 6; copia literal en task-done: 4 → 6 de 6; control td 6 → 6 de 6) · WordBudget, Skills y AnchorTemplates 222/222 · pre-commit 949/0

## 5. Tiempo (ligero)

- Real: 0,7h

## 6. Delta de capacidad

### Capacidad: `feature-flow`

**MODIFIED — Los scripts de Native se lanzan con la herramienta Bash y con salida**
- GIVEN un plan con `Ejecución: native` en Windows, con PowerShell como shell principal, y una «Verificación» que no imprime nada si pasa
- WHEN el hilo abre y cierra cada task con `task-start` y `task-done`
- THEN los lanza con la herramienta Bash (Git Bash), nunca con `bash <ruta>` desde PowerShell, y comprueba que la ruta de `sdd-workspace` no está vacía antes de escribir en el ledger
- AND pasa a `task-done` un comando que imprime algo (`sh -c '<comando> && echo ok'`), y la línea `Task <N>: complete` queda en el ledger a la primera
- AND el comando sale con un código distinto de 0 si algo falla: con Pester, `Invoke-Pester … -CI`, y la «Verificación» del plan ya lo trae así; con un test en rojo, `task-done` no escribe `Task <N>: complete`