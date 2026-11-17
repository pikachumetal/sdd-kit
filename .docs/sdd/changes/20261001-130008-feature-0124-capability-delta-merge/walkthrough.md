---
id: 20261001-130008-feature-0124-capability-delta-merge
feature: 0124
title: Walkthrough — La fusión del delta de capacidades como script
spec: ./spec.md
plan: ./plan.md
status: done
created: 2026-10-01
---

# Walkthrough — La fusión del delta de capacidades como script

## 1. Cambios realizados

- **Apertura** (`928b5c65`): spec aprobada por delegación, plan Native de tres tasks. La 0124 se partió al arrancar: el marcador de legado o puntero, la línea en blanco obligatoria tras el título y su migración pasan a la fila 0129, en la release siguiente.
- **Parser compartido y validador** (`9ba04ccb`): `CapabilitySections.ps1` tiene ahora el único parser del delta (`Get-DeltaEntries`, con ADDED, MODIFIED, REMOVED y las reglas; el encabezado se une hasta cerrar la negrita y el `(antes: …)`), `Get-Requirements` y `Get-DeclaredCapabilities` (con el resumen tras «—»). `Test-Capabilities.ps1` falla con una línea suelta bajo un requisito y con `- Se valida en:` en una capacidad.
- **`Merge-CapabilityDelta.ps1`** (`8f194cab`): fusiona el delta de una spec o un `patch.md`. Es todo o nada y se puede volver a ejecutar sin efecto. Normaliza los ficheros que toca a la forma de la plantilla. Rechaza un `MODIFIED` ausente, un `ADDED` con otro texto, una cita «decisión N» fuera del código en línea, un hueco `<…>` de la plantilla y una capacidad sin fichero no declarada en «Nuevas». Tiene 20 tests Pester, dos de ellos contra `spec-template.md` calcada sin tocar y a medias.
- **Guía de los cierres** (`d17355f8`): el paso 4 de `sdd-end-feature`, su detalle en `aprendizajes-skills.md` y la parte «Capacidades» del paso 1 de `sdd-end-patch` fusionan con el script, nunca a mano. El paso 7 de `sdd-start-feature` escribe el borrador con el mismo comando, y `sdd-templates/SKILL.md` lista el script. Campaña RED/GREEN en `tests/capability-merge-red.md` y `-green.md`.
- **Cierre**: el delta de esta spec fusionado en `capabilities/capabilities.md` con el propio script (siete cambios, `Capacidades válidas: 14`), y el script nombrado en «Contenido» de `tech-stack.md`.

## 2. Tiempo y coste: estimado vs real

- Tipo: infra/tooling
- Estimación de implementación (del plan): 3h
- Esfuerzo real: 0,7h — reloj del hilo aproximado por las marcas de los commits: apertura a las 15:05 y pasada de fix a las 15:30, más el cierre hasta las ~15:45. La spec y el plan, de ~14:35 a 15:05, no cuentan aquí.
- Desviación: -2,3h (-77 %)
- Causa de la desviación: la campaña, estimada como la de la 0127 (~70 min), costó ~12 min. Fueron 10 sujetos cortos (7 a 12 turnos), porque cada escenario pedía un solo paso. El script salió en una pasada, con los tests escritos antes desde la spec.
- Modelo del hilo: Opus 5.5, effort no registrado (spec, plan, ejecución y cierre)
- Tokens del hilo: 35.594.955 — claude-opus-5-5 35.594.955
- Tokens de subagentes: 2.217.626 en 1 despacho — Revisor final 0124 claude-opus-5-5 2.217.626 / 6 min
- Coste de la sesión: 15,49 $ (hilo 13,75 $ + subagentes 1,75 $)
- Coste de sujetos: 1,68 $ en 10 sujetos Sonnet — RED 0,86 $; GREEN 0,82 $
- Review de spec: no · hallazgos 0, aceptados 0

## 3. Desviaciones del plan

- La línea de `spec-template.md` («un THEN no cita decisiones por número») no se escribió: su escenario `t1` salió limpio en el RED (0 de 2), como prevé la decisión 13 de la spec, y se repitió como control en el GREEN (0 de 2).

### Decisiones tomadas sin el dev-lead

- La entrada del changelog va en el cierre, vía `add-to-changelog`, y no en el commit de la Task 3 — así no hay dos entradas — coste si está mal: ninguno.
- `t1` limpio en el RED: sin línea en `spec-template.md`; la cita la para `Merge-CapabilityDelta.ps1`, que es donde aparece en campo (al copiar un delta que ya la trae) — coste si está mal: una línea de plantilla que falta si un agente redacta la cita desde cero.
- Revisión final: el Minor 6 (un «< 4 h» tomado por hueco de la plantilla) sube a Important, porque bloquea el cierre con un mensaje que engaña — coste si está mal: un test y un regex de más.
- Minor diferidos de la revisión final: un «(antes: …)» en su propia línea, tras un encabezado ya cerrado, pasa a la capacidad (el validador lo caza después); los bloques de código cercados en una capacidad, que el formateador reformatea y `Test-LooseLines` marca; el mensaje «no la declara en «Nuevas»» para un `patch.md` que sí la declara (literal fijado por la spec); y huecos de test (la posición del `ADDED`, el valor nuevo de la regla con continuación, el código de salida en el test de mayúsculas) — van a una fila de deuda del roadmap.
- `CapabilityRules.Tests.ps1` exigía el enlace a `aprendizajes-skills.md` en el paso 1 de `sdd-end-patch`; el paso lo sustituye por el comando, y el test pasa a exigir `Merge-CapabilityDelta.ps1` — coste si está mal: el paso pierde un enlace a la regla en prosa, que sigue en `aprendizajes-skills.md`.

## 4. Verificación

### 4.1 Builds

- `Invoke-Pester -Path tests` desde la herramienta PowerShell, sobre la pasada de fix: 1190 pasan, 0 fallan y 10 se saltan.
- Suite completa: `Invoke-Pester -Path tests` → 1190/1190 · 7,1 min
- Revisión final: `sdd-kit:effort-high` + opus sobre `d17355f8`, «With fixes» (0 Critical, 4 Important, 5 Minor). El Minor 6 se reclasificó a Important. Pasada de fix, juntada en el commit de cierre: 4 hallazgos RED→GREEN y 1 refactor. Sin re-revisión: la pasada la verifica su TDD.

### 4.2 Smoke / tests

- Validación en campo: 2026-10-01 · suite 1190/1190 · smoke 16/16 THEN (13 con ejecución real, 3 por suite o sujetos) · campaña GREEN 5/5 · revisión final opus «With fixes» sobre d17355f8, 5 hallazgos arreglados en el commit de cierre

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| «La fusión del delta es un script»: ADDED al final sin «Se valida en:», MODIFIED con el `(antes: …)` partido sustituido, REMOVED quitado, regla «Avisos» sustituida y las otras cuatro igual | ejecución real | las cuatro líneas de la spec en su orden, exit 0; ni `Se valida`, ni `guardada»)`, ni `motivo` en la capacidad |
| … sin ayuda `>` ni `(antes: …)` en la capacidad | ejecución real | fusión de `capabilities.md` de este repo con el delta de esta spec: 0 líneas de ayuda, 0 de `(antes:` |
| … línea en blanco tras cada título, sin dobles | ejecución real + suite | `capabilities.md` de este repo normalizado (16 títulos de requisito); test `normaliza las líneas en blanco del fichero que toca` |
| … y `Test-Capabilities.ps1 -Artifact` da `Capacidades válidas: 1` | ejecución real | `Capacidades válidas: 1`, exit 0 (y `14` sobre este repo) |
| «… falla sin escribir nada»: MODIFIED ausente | ejecución real | `spec.md: «Anular una reserva» del MODIFIED no está en capabilities/bookings.md`, exit 1, `bookings.md` byte a byte igual |
| … cita «decisión 10» | ejecución real | `spec.md: «Cancelar una reserva» cita la spec («decisión 10»): reescríbelo…`, exit 1 |
| … la cita entre comillas invertidas no cuenta | ejecución real | exit 0 |
| … ADDED idéntico no se duplica; con otro texto falla | ejecución real | reejecución: `ya estaba`, `ya no estaba`, exit 0, fichero igual; con otro texto, `… del ADDED ya está en capabilities/bookings.md con otro texto: usa MODIFIED`, exit 1 |
| … REMOVED ausente escribe «ya no estaba» | ejecución real | `bookings.md: «Consultar salas libres» ya no estaba` |
| … capacidad declarada en «Nuevas» se crea; sin ella, o desde un patch, falla | ejecución real + suite | `rooms.md` con título, propósito y requisito; sin «Nuevas», `… no tiene fichero en capabilities/ y el bloque no la declara en «Nuevas»`, exit 1; el patch, test `desde un patch.md falla` |
| «El cierre fusiona el delta…»: el agente ejecuta el script y, si falla, corrige el delta y lo vuelve a ejecutar | ejecución real (sujetos) | GREEN `f1` 2 de 2 con el script, los dos reescribieron la cita en la spec y volvieron a ejecutarlo |
| … el borrador del paso 7 sale del mismo script | ejecución real | este cierre: borrador fusionado con el script mientras trabajaba el revisor final |
| «El cierre de un patch fusiona su delta» con el script | ejecución real (sujetos) | GREEN `p1` 1 de 1 con el script, validador en verde |
| «El delta declara…»: un THEN no cita decisiones, y el script lo rechaza | ejecución real + sujetos | rechazo, arriba; `t1` 0 de 2 citan en RED y GREEN |
| «El validador de capacidades»: línea suelta y `- Se valida en:` | ejecución real | `bookings.md: línea suelta en «Reservar una franja» (línea 20): «guardada»)»` y `… resto de delta «Se valida en:» en la línea 21`, exit 1 |
| … el resto de fallos del validador, sin cambios | suite | `Test-Capabilities.Tests.ps1`, 47 tests |

### 4.3 Residuales / deuda generada

- El marcador de legado o puntero, la línea en blanco obligatoria en el validador y su migración: fila 0129, en la release siguiente.
- Los cuatro Minor diferidos de la revisión final: fila de deuda «Bordes de `Merge-CapabilityDelta.ps1` que dejó la revisión final de la 0124» en el roadmap.
- Medido solo en Sonnet y en capacidades cortas: el ahorro de ~10 min por cierre de los tickets de campo se comprobará en campo, en el primer cierre con delta de un proyecto real.

## 5. Aprendizajes

- `Merge-CapabilityDelta.ps1` es la pieza que fusiona el delta y comparte parser con el validador → `tech-stack.md` («Contenido»).
- La fusión a mano copia lo que es del delta (`Se valida en:`, citas a la spec) a la capacidad viva, y el validador de antes lo daba por bueno → skills `sdd-end-feature` (paso 4) y `sdd-end-patch` (paso 1), y el validador.

## 6. Adendas
