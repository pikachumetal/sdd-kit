# Tasks — 0020 claves de control en las entrevistas de las init

Registro vivo: status y commit por task.

| Task | Nombre | Status | Commit |
| --- | --- | --- | --- |
| 1 | Bloque único de preguntas y sus tres consumidores | ✅ | 6e3bebc |
| 2 | GREEN | ✅ | ver commit «test(sdd): GREEN…» |

## Rulings

- Task 1: el test estructural no se aparcó en `red/`. Se ejecutó en rojo antes de escribir el bloque (`Invoke-Pester tests/ControlProfiles.Tests.ps1`: 15 pasan y 1 falla, en `Should -Match '(?m)^## Preguntas de las claves de control'`) y se commiteó ya en verde junto a la implementación. Aparcarlo solo sirve para no commitear un test en rojo, y entre el RED y el verde no hubo commit. Coste si es un error: el rojo no queda en git, solo en esta nota. Lo marcó como Important el revisor final.
- Task 2: el GREEN superó el techo de 22 $ (26,30 $), por un sujeto que siguió a `sdd-start-task` después de cerrar la init. La lección para el lanzador está en `tests/init-control-keys-green.md`.
- Revisión final: aplicados los dos Minor (la coma que faltaba en el paso 3 de greenfield y el ajuste de línea en el predicado de `v1.2.0.md`).
