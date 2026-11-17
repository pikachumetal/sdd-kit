---
id: 20260925-081130-task-0070-openspec-capabilities
task: 0070
title: Walkthrough — Capacidades al estilo OpenSpec
spec: ./spec.md
plan: ./plan.md
status: done
created: 2026-09-25
date: 2026-09-25
---

# Walkthrough — Capacidades al estilo OpenSpec

## 1. Cambios realizados

- **Validador** (`5d49009`, `cecb831`, `64f0105`): `skills/sdd-templates/scripts/Test-Capabilities.ps1` y `tests/Test-Capabilities.Tests.ps1` (31 tests, con el fixture `tests/fixtures/capabilities/bookings.md`). Valida título, secciones, escenario completo por requisito, restos de delta (incluido el bloque de reglas en negrita) y las cinco reglas; con `-Artifact`, el bloque «Capacidades» frente al delta, bloque vacío incluido. Admite la nota `*(…)*` de las cabeceras de la plantilla. Fila en el índice de scripts de `sdd-templates/SKILL.md`.
- **Capacidades sin historial** (`ac084d9`): `capability-template.md`, fusión de `sdd-end-task` (`aprendizajes-skills.md` paso 4) y de `sdd-end-patch` (paso 1), volcado de `sdd-init-greenfield` y las 13 capacidades del repo. `migration`, `roadmap`, `task-flow` y `task-ids` tenían el bloque de reglas del delta pegado en un requisito: pasa a `## Reglas de la capacidad` con sus cinco entradas.
- **Bloque «## Capacidades»** (`8815507`, `64f0105`): al principio de `spec-template.md` y `patch-template.md`; los dos cierres ejecutan el validador con `-Artifact` tras fusionar, y un fallo en una capacidad que el delta no toca se informa sin bloquear. Revierte la regla de la 0067 «sin línea de sin delta».
- **Migración** (`3444589`): `skills/sdd-init-brownfield/references/migrations/v2.0.0.md` quita el historial sin gate y verifica con el validador. `tech-stack.md` nombra el script.
- **Evidencia**: `tests/capability-format-red.md` y `tests/capability-format-green.md`, con `red/`, `green/` y `refactor/` en esta carpeta.
- **Capacidades fusionadas en el cierre**: `capabilities` (cuatro `MODIFIED`, tres `ADDED` y «Avisos») y `migration` (un `ADDED`).

## 2. Tiempo y coste: estimado vs real

- Tipo: infra/tooling
- Estimación de implementación (del plan): 4h
- Esfuerzo real: 1,6h — reloj del hilo aproximado con las marcas de los commits: de la apertura (10:58) al control tras la revisión final (12:17), más el cierre. Spec y plan: ~1h (09:55–10:58), con el RED previo.
- Desviación: -2,4h (-60 %)
- Causa de la desviación: el plan traía las interfaces y los mensajes literales del validador, que salió en verde a la primera; las campañas de sujetos corrieron en segundo plano mientras el hilo preparaba la task siguiente.
- Modelo del hilo: Opus 5.5, effort no registrado (toda la task; la aprobación por delegación quitó la parada donde se baja a gama media)
- Tokens del hilo: 56.699.494 — claude-opus-5-5 56.699.494
- Tokens de subagentes: 5.298.318 en 2 despachos — Revisor técnico de la spec 0070 claude-sonnet-5 217.127 / 2 min; Revisión final de rama 0070 claude-opus-5-5 5.081.191 / 8 min
- Coste de la sesión: 21,34 $ (hilo 18,32 $ + subagentes 3,02 $)
- Coste de sujetos: 6,58 $ en 17 sujetos Sonnet — RED 3,32 $ (8); GREEN 2,60 $ (7); control tras la revisión final 0,66 $ (2)
- Review de spec: 1 revisor (técnica) · hallazgos 6, aceptados 5

## 3. Desviaciones del plan

- La pieza (4) de la fila, fusionar un `MODIFIED` contra la base de la spec, salió de la spec antes del plan: el RED dio 6 de 6 limpio, y el dev-lead eligió pasarla a deuda si la tanda sin `(antes:)` salía limpia.
- La revisión final abrió dos enmiendas de la spec, que decidió el dev-lead: el bloque vacío falla, y un fallo del validador en una capacidad ajena al delta no bloquea el cierre. Llevaron un control de 2 sujetos (Art. I).

### Decisiones tomadas sin el dev-lead

- Integré `develop` antes de la Task 1 (patch 0072) y antes de la Task 4 (0071–0074); el conflicto del roadmap era de posición, con la fila 0070 idéntica en base y `develop` — coste si está mal: un merge de sincronización de más.
- Fixtures del validador inline sobre un solo `bookings.md` versionado — coste si está mal: mover casos a ficheros.
- Fila del script en el índice de `sdd-templates/SKILL.md` sin sujetos: es inventario, sin conducta — coste si está mal: ninguno medible.
- Reglas completadas: «Avisos» de `migration` (pendiente explícito) y de `task-flow` (aviso en llano), sacados de sus requisitos; el resto, «no aplica» — coste si está mal: un valor que el dev-lead corrige (la revisión final ve incompletos los de `task-flow`).
- La racionalización de `sdd-init-greenfield` pierde «y las dejó sin historial» — coste si está mal: ninguno.
- Placeholder `<capacidad>` → `<nombre>` por `NamingConvention.Tests.ps1` — coste si está mal: ninguno.
- Commit provisional para que el GREEN midiera la rama, juntado después — coste si está mal: ninguno.
- Molde del GREEN migrado a 2.0.0 y con la spec de la 0020 trayendo su bloque — coste si está mal: el GREEN no mediría la transición desde un proyecto sin migrar.
- El validador se nombra en `tech-stack.md`, donde están los otros scripts, no en `architecture.md` — coste si está mal: mover una línea.
- La línea `**Escribe**` de `v2.0.0.md` dice «historial de cada capacidad» para no casar con el filtro del RED — coste si está mal: ninguno.
- Corregí el Minor 8 de la revisión final (la evidencia del GREEN citaba una línea mal y contaba de más): la evidencia no puede afirmar lo que no pasó.
- Minors diferidos de la revisión final: (4) `sdd-end-patch` escribe `<nombre>` sin comillas invertidas y el parser no admite raya corta ni negrita; (5) `-Artifact` con ruta inexistente da una traza; (6) el test fija el recuento en 13 y el de la migración no cubre un `## Historial` antes de las reglas; (7) valores de reglas de `migration` y `task-flow`; (9) `v2.0.0.md` chocará con la de la 0062; (10) el README de migraciones pone «un borrado» como ejemplo de gate; (11) un patch sin `capabilities/` se queda con el placeholder del bloque; (12) `.docs/workflow/greenfield.md:39` habla del historial.

## 4. Verificación

### 4.1 Builds

- Sin build. Suite completa con los `Slow`, tras los arreglos de la revisión final: `Invoke-Pester -Path tests` → 740 pasan, 0 fallan, 7 omitidos.

### 4.2 Smoke / tests

- Validación diferida: 2026-09-25 · «diferido al uso, feedback, commit, merge» · disparador: el primer cierre de una task o un patch con el kit de `develop` en un proyecto con `capabilities/`, a cargo del dev-lead (lo concreté yo: la frase no lo nombraba).

| # | Caso | Resultado |
| --- | --- | --- |
| 1 | `Test-Capabilities.ps1 -Path .docs/sdd -Artifact <spec 0070>` tras fusionar el delta | ✅ verificado por el agente: `Capacidades válidas: 13` |
| 2 | Escenarios del validador de la spec (sin THEN, Historial, bloque vacío, «Nuevas» en un patch…) | ✅ verificado por el agente: 31 tests Pester |
| 3 | La spec abre con el bloque «Capacidades» (ADDED «La spec y el patch declaran…») | ✅ GREEN `c` 2/2 |
| 4 | Cierre de task: sin historial, validador tras fusionar (MODIFIED «El cierre fusiona…») | ✅ GREEN `m` 2/2; control `m-3` 1/1 con `rooms.md` ajeno roto |
| 5 | Cierre de patch con delta (MODIFIED «El cierre de un patch…») | ✅ GREEN `p1` 2/2; control `p1-3` 1/1 |
| 6 | Patch que devuelve el comportamiento: «Ninguna, porque el fix devuelve…» | ✅ GREEN `p2` 1/1 |
| 7 | Migración a 2.0.0 (ADDED de `migration`) | ✅ verificado por el agente: tests de la migración y `MigrationInitParity.Tests.ps1` |

### 4.3 Residuales / deuda generada

- Pieza (4) de la fila → fila de deuda (posible falso negativo).
- Ocho menores pendientes de la revisión final → fila de deuda.

## 5. Aprendizajes

- Tras integrar la rama de integración, `git merge-base` es su punta: para saber qué cambió desde que se escribió la spec, se compara con el commit que la añadió → roadmap (fila de deuda de la pieza 4).
- Un molde que imita un proyecto de una versión del kit lleva el formato de esa versión: con el historial de 1.x en un GREEN de 2.0.0, el validador habría fallado por el molde → `tech-stack.md`.
- Un regex de PowerShell escrito desde un heredoc de Python pierde `\b`, que pasa a ser un retroceso, y el test falla lejos de la causa → `tech-stack.md`.
- La fusión de una task anterior pegó el bloque `**Reglas de la capacidad**` del delta dentro de un requisito en cuatro capacidades; ahora lo detecta el validador → `capabilities/capabilities.md` (requisito del validador).

## 6. Adendas

- _Ninguna_
