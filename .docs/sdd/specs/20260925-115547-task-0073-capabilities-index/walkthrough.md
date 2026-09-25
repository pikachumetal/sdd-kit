---
id: 20260925-115547-task-0073-capabilities-index
task: 0073
title: Walkthrough — Índice de capacidades generado
spec: ./spec.md
plan: ./plan.md
status: done
created: 2026-09-25
---

# Walkthrough — Índice de capacidades generado

## 1. Cambios realizados

- **Formato de capacidad** (`50eacb1`): `capability-template.md` abre con `## Propósito` (una o dos frases, 300 caracteres como máximo, sin procedencia), y su ayuda nombra el índice generado en lugar de «el listado es el índice». Las 14 capacidades del repo cambian su párrafo inicial por el propósito. `migrations/v2.0.0.md` gana el paso 2, que lo escribe en los proyectos.
- **Validador** (`50eacb1`): `Test-Capabilities.ps1` exige la sección, que sea la primera, que no esté vacía ni sea el hueco de la plantilla y que no pase de 300 caracteres medidos en una línea. La lectura de secciones baja a `CapabilitySections.ps1`, compartido con el índice.
- **Índice** (`6e42727`): `Get-CapabilityIndex.ps1` escribe `` - `<nombre>` — <propósito> `` por capacidad, `(sin propósito)` si falta, `Sin capacidades` sin carpeta; siempre sale con 0. Tests Pester contra la plantilla calcada tal cual y rellenada a medias, y sobre las capacidades del repo. Documentado en `sdd-templates/SKILL.md` y `tech-stack.md`.
- **Skills** (`888f151`): el paso de contexto de `sdd-start-task`, `sdd-roadmap` y `sdd-consult` ejecuta el índice antes de abrir capacidades; la ayuda del bloque «Capacidades» de `spec-template.md` lo nombra. Evidencia en `tests/capabilities-index-red.md` y `-green.md`.
- **Tanda de migración** (en el commit de cierre): el hallazgo importante de la revisión final, medido con 2 sujetos.
- **Sincronización** (`e689360`): `develop` integrado antes de la Task 2 por el freno de alcance.

## 2. Tiempo y coste: estimado vs real

- Tipo: infra/tooling
- Estimación de implementación (del plan): 2,5h
- Esfuerzo real: 1,0h — reloj del hilo, de la apertura (14:05) al cierre (15:06), por las marcas de los commits; spec y plan, ~0,5h más antes de la apertura
- Desviación: -1,5h (-60%)
- Causa de la desviación: la estimación contaba la campaña como trabajo del hilo, y corrió en segundo plano mientras el hilo escribía el plan y el código; el arnés salió de la 0070 casi entero y los dos scripts se apoyaron en el parser que ya existía. Ninguna task necesitó una ronda de fix.
- Modelo del hilo: Opus 5.5, effort no registrado (toda la task)
- Tokens del hilo: 36.365.437 — claude-opus-5-5 36.365.437
- Tokens de subagentes: 4.473.520 en 2 despachos — Revisión final de la rama 0073 claude-opus-5-5 4.253.683 / 6 min; Review técnica de la spec 0073 claude-sonnet-5 219.837 / 3 min
- Coste de la sesión: 15,49 $ (hilo 12,79 $ + subagentes 2,70 $)
- Coste de sujetos: 4,70 $ en 14 sujetos sonnet — RED 2,13 $; GREEN 1,99 $; migración 0,59 $
- Review de spec: 1 revisor (técnica) · hallazgos 6, aceptados 6

## 3. Desviaciones del plan

- Develop integrado a mitad de rama (merge `e689360`), por el freno de alcance de `tech-stack.md`; decisión del dev-lead, en «Enmiendas» de la spec.
- La campaña pasó de 12 a 14 sujetos por el escenario `m` de la migración, que el plan no tenía; decisión del dev-lead tras la revisión final.

### Decisiones tomadas sin el dev-lead

- La sesión siguió en Opus sin parar a ofrecer bajarla a gama media — la oferta vivía en el gate de la spec, aprobada por delegación — la implementación Native costó como Opus.
- 14 capacidades en el repo, no las 13 que dice la spec: `planning` llegó con la 0062, y se trataron todas — ninguno.
- El test de la plantilla rellenada a medias pasaba antes del código: se deja como guarda de no regresión que pide `architecture.md` — un test que no discrimina la conducta nueva.
- El lanzador copiado de la 0070 extraía con el `tools.mjs` de la 0055, que no sanea el home: pasa al de la 0009 con `--clean` y se regeneran las salidas del RED — ninguno, el hook de privacidad lo comprueba.
- El GREEN usa el mismo arnés que el RED, no `tests/headless/` del patch 0076, que llegó a `develop` tras el RED: cambiar de lanzador cambia las flags y la extracción — la campaña no sigue la regla nueva de `tech-stack.md`, que aplicará la siguiente.
- El test RED de `sdd-roadmap` tomaba el primer «1.» del fichero (la lista «Items del gestor»): busca ahora el paso por su nombre en las tres skills, con las mismas aserciones — ninguno.
- Menores diferidos de la revisión final: paréntesis sin cerrar en el paso 1 de `sdd-start-task`; el paso de contexto no dice qué hacer con `(sin propósito)`; «Una capacidad no guarda historial» no nombra `## Propósito`; el validador no rechaza un párrafo libre antes de `## Propósito`; el GREEN no declaraba quién escribió los propósitos del molde (ya declarado en sus límites); selector del test RED cambiado (arriba); `CapabilityRules.Tests.ps1` sin salto de línea final; `tasks.md` desfasado en HEAD (corregido en este cierre); sin test `Slow` del índice con un `pwsh` hijo. Los pendientes pasan a deuda (§4.3).

## 4. Verificación

### 4.1 Builds

- Gate de cierre: `pwsh -NoProfile -Command "Invoke-Pester tests -Output Normal"` → 808 pasados, 0 fallos, 8 omitidos (con los `Slow`).
- `Test-Capabilities.ps1 -Path .docs/sdd -Artifact <spec.md>` tras fusionar el delta → `Capacidades válidas: 14`, código 0.

### 4.2 Smoke / tests

- Validación diferida: 2026-09-25 · «diferido» · disparador: el primer arranque de task o consulta con el kit de `develop` en un proyecto con `capabilities/`, a cargo del dev-lead (concretado por el agente: la frase no lo nombraba)

| # | Caso | Resultado |
| --- | --- | --- |
| 1 | Índice sobre el repo (`Get-CapabilityIndex.ps1 -Path .docs/sdd`) | ✅ verificado por el agente: 14 líneas, ninguna `(sin propósito)` |
| 2 | Validador sobre el repo | ✅ verificado por el agente: `Capacidades válidas: 14` |
| 3 | Escenarios del delta del validador y del índice (sección que falta, vacía, hueco, 412 caracteres, detrás de otra sección, plantilla tal cual y a medias, varias líneas, carpeta vacía y ausente) | ✅ verificado por el agente: Pester, `Test-Capabilities.Tests.ps1` y `Get-CapabilityIndex.Tests.ps1` |
| 4 | Las skills ejecutan el índice antes de abrir capacidades | ✅ verificado por el agente: GREEN 6/6; el fallo del RED (1/2 en `sdd-roadmap`) no aparece |
| 5 | La migración a v2.0.0 escribe el propósito sin procedencia y sin gate | ✅ verificado por el agente: escenario `m`, 2/2 |
| 6 | Guion de pruebas del dev-lead (índice, validador, quitar el propósito de `routing.md`, plantilla, consulta en sesión nueva) | pendiente: validación diferida |

### 4.3 Residuales / deuda generada

- El cierre del patch escribe el bloque «Capacidades» sin el índice → fila de deuda (decisión 6 de la spec).
- Guía del índice ante `(sin propósito)` y paréntesis sin cerrar en `sdd-start-task`; el paso 2 de la migración no completa con los requisitos un propósito pobre (`m-2`: «Exportación a calendarios.») → fila de deuda.
- Validador: párrafo libre antes de `## Propósito`, requisito «Una capacidad no guarda historial» sin `## Propósito`, test `Slow` del índice con un `pwsh` hijo, salto de línea final de `CapabilityRules.Tests.ps1` → fila de deuda.

## 5. Aprendizajes

- Un molde con propósitos escritos por quien conoce los escenarios mide el mejor caso; si la guía depende de un texto que en campo escribe otro, se mide también ese texto → `tech-stack.md` (campañas).
- `[IO.File]` resuelve rutas relativas con el directorio del proceso, y reescribir con CRLF bajo `core.autocrlf=true` marca el fichero entero en el diff → `tech-stack.md` (campañas y scripts).
- El comportamiento observable nuevo (propósito, índice, validador, migración) → `capabilities/capabilities.md` y `capabilities/migration.md`, fusionados desde el delta.

## 6. Adendas
