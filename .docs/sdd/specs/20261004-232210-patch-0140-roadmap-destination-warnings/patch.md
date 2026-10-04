---
id: 20261004-232210-patch-0140-roadmap-destination-warnings
task: 0140
title: Patch — Test-Roadmap.ps1 avisa de destinos y prefijos de cierre fuera de la plantilla
type: patch
solution: dev-lead
status: done
created: 2026-10-05
branch: hotfix/v2.3.2
commit: <hash>
---

# Patch 0140 — Test-Roadmap.ps1 avisa de destinos y prefijos de cierre fuera de la plantilla

## Capacidades

- Modificadas: `roadmap` — añade «El roadmap avisa de un destino o un cierre fuera de la plantilla»

## 1. Síntoma

Ticket del patch 0057 de un proyecto (`field-reports/20261004-225436-patch-0057-keep-app-base-href.md` §1, en `develop`): tres cierres de feature escribieron en «Deuda técnica» destinos `Decidir dev-lead: …` y `Antes de la v0.1.0 (…)`, y otro saldó una fila con `**[Feature 0051, 2026-10-05: saldada, salvo el GO … — …]**`. `Test-Roadmap.ps1` dio `Roadmap válido` con las cuatro; en el colapso de `sdd-end-release`, la fila del prefijo irregular no salió con las saldadas.

## 2. Solución fijada

Dev-lead, 2026-10-05: «Que avise de una fila de «Deuda técnica» o «Backlog» cuyo «Destino» no empiece por `Actuar`, `Esperar 2.º ticket` o `Descartada`. Que avise también de una celda «Ítem» que empiece por `**[` sin casar con el formato de cierre (`saldada — ` o `parcial — …; queda:`). Aviso, no fallo: en un proyecto que ya tiene esas filas, un fallo pondría el pre-commit en rojo al actualizar, y la release dejaría de ser un patch (Art. V). Que falle queda para la 3.0.0. Apúntalo como deuda con destino el lienzo 0131. Comprueba también que el colapso de sdd-end-release reconoce el prefijo que el aviso da por bueno.»

Lo que da por existente, comprobado: `Test-Roadmap.ps1` no mira ni «Destino» ni el prefijo, y solo reconoce `: saldada — ` (`SettledPattern`). RED en `tests/Test-Roadmap.Tests.ps1`: las tres filas del ticket, reproducidas en el fixture, dan `Roadmap válido` sin más líneas.

## 3. Fix

- **Fichero(s)**:
  - `skills/sdd-templates/scripts/Test-Roadmap.ps1`
  - `skills/sdd-templates/templates/roadmap-template.md` (fila de ejemplo de «Deuda técnica»)
  - `tests/Test-Roadmap.Tests.ps1`, `tests/RoadmapStructure.Tests.ps1`
  - `.docs/sdd/capabilities/roadmap.md` (fusión del delta, en el cierre)
  - `.docs/sdd/roadmap.md` (fila de deuda, en el cierre)
- **Cambio**: el validador escribe `roadmap.md: aviso: línea <n>: …` por cada fila de «Deuda técnica» con un «Destino» que no empieza (negrita aparte) por `Actuar`, `Esperar 2.º ticket` o `Descartada`, y por cada celda «Ítem» de «Backlog» o «Deuda técnica» que empieza por `**[` sin el formato de cierre. Los avisos van antes de la línea final y no cambian el código de salida: sin fallos, la última línea sigue siendo `Roadmap válido` y sale con 0. El prefijo de cierre comparte la expresión con `SettledPattern`: lo que el aviso da por `saldada — ` es justo lo que el corte saca.
- **Decisiones**:
  - Aviso y no fallo; el fallo, para la 3.0.0 con destino el lienzo 0131 — dev-lead
  - «Destino» solo se mira en «Deuda técnica»: la tabla de «Backlog» (`| # | Ítem | Origen |`) no tiene esa columna; en «Backlog» aplica solo el aviso del prefijo — sin el dev-lead (la petición nombra una columna que el Backlog no tiene)
  - La fila de ejemplo de la plantilla pasa de `<feature, patch o cuándo>` a `**Actuar**: <feature o patch>`: con el valor viejo, la plantilla calcada daba el aviso, y «cuándo» invita a escribir una versión, que la ayuda de la misma sección prohíbe. Mismo número de palabras — sin el dev-lead
  - `RoadmapStructure.Tests.ps1` deja de exigir que el roadmap del repo dé solo `Roadmap válido`: da 98 avisos de «Destino» (`versión siguiente`, `Patch, …`, `Task …`). Normalizarlos en un hotfix chocaría con `develop`; va en la fila de deuda — sin el dev-lead
- **Colapso de `sdd-end-release`**: `references/notas-y-roadmap.md` saca «las filas saldadas», y la plantilla las cuenta con `grep -E '\| \*\*\[(Feature|Task|Patch) [^],]+, [0-9]{4}-[0-9]{2}-[0-9]{2}: saldada — '`, la misma forma que `SettledPattern`; el validador, tras el colapso, falla con una saldada que siga dentro. El caso 4 lo fija con un test.

## 4. Verificación

| # | Caso | Resultado |
| --- | --- | --- |
| 1 | RED: deuda con destino `Decidir dev-lead: patch` | ❌ antes: `Roadmap válido` sin más · ✅ ahora: `aviso: línea 26: «Destino» «Decidir dev-lead: patch» no empieza por Actuar, Esperar 2.º ticket o Descartada`, luego `Roadmap válido`, sale con 0 |
| 2 | destinos `**Actuar** con un patch`, `Actuar en el lienzo 0131`, `Esperar 2.º ticket: …`, `**Descartada**: …` | ✅ sin aviso |
| 3 | RED: `saldada, salvo el GO — …` en Backlog y `parcial — …` sin `queda:` en deuda | ❌ antes: sin aviso · ✅ ahora: un aviso por línea con el formato de la plantilla |
| 4 | corte: `saldada — ` del 2026-09-10 y `saldada, salvo el GO — ` del mismo día, con la v1.2.0 del 2026-09-20 | ✅ la primera falla «sale en el corte»; la segunda no la saca el corte y da el aviso |
| 5 | `Test-Roadmap`, `RoadmapStructure`, `RoadmapClosing`, `WordBudget`, `AnchorTemplates` | ✅ 147/0 |
| 6 | roadmap del repo | ✅ 98 avisos de «Destino», ninguno de prefijo; última línea `Roadmap válido`, sale con 0 |

Los casos los verificó el agente.

## 5. Tiempo (ligero)

- Real: 0,6h

## 6. Delta de capacidad

### Capacidad: `roadmap`

**ADDED — El roadmap avisa de un destino o un cierre fuera de la plantilla**
- GIVEN una fila de «Deuda técnica» con «Destino» `Decidir dev-lead: patch` en la línea 26, y una de «Backlog» que empieza por `**[Feature 0031, 2026-09-25: saldada, salvo el GO — …]**` en la línea 20
- WHEN se ejecuta `Test-Roadmap.ps1`
- THEN escribe `roadmap.md: aviso: línea 26: «Destino» «Decidir dev-lead: patch» no empieza por Actuar, Esperar 2.º ticket o Descartada` y, para la línea 20, `roadmap.md: aviso: línea 20: el prefijo de cierre no casa con «**[<Feature|Patch> <id>, <AAAA-MM-DD>: saldada — <enlace>]**» ni con «…: parcial — <enlace>; queda: <lo pendiente>]**»`
- AND sin fallos, la última línea es `Roadmap válido` y sale con 0; con fallos, los avisos van tras ellos y sale con 1
- AND un «Destino» que empieza por `Actuar`, `Esperar 2.º ticket` o `Descartada`, con o sin negrita, no avisa; «Backlog» no tiene «Destino» y solo avisa del prefijo
- AND el prefijo `saldada — ` que no avisa es el mismo que el corte saca: con fecha no posterior a la última release, falla con «sale en el corte»
