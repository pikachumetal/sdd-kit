# Tasks — Motivo al cancelar

| Task | Estado | Commit |
| --- | --- | --- |
| 1 — Cancelar con motivo | ✅ | 2aa628b |
| 2 — Listado de canceladas | ✅ | 95f472b |

Revisión final: sdd-kit:effort-high + opus, With fixes (0 Critical, 1 Important, 3 Minor), sobre 95f472b
Pasada de fix: e5c8808, 1 hallazgo RED→GREEN (re-revisión acotada de la pasada: sonnet medium, sin Critical ni Important)

## Rulings

- Task 2: recuperación tras corte por cuota — informe completo (`Status: DONE`, commit `95f472b`); paso a su revisión de task sin relanzar. Coste si erra: ninguno, la revisión y los tests lo comprueban.
- Final: `canceladas` no persiste entre ejecuciones (reservas en memoria; el guardado es la 0014 del roadmap) — fuera de scope de la 0010; lo dirá el walkthrough. Coste si erra: quien espere ver el listado entre ejecuciones del CLI no lo verá.
- Final: sin test de `anular` en el repo — su código no cambia en la rama; se cubre con el gate `node --test` y un smoke manual. Coste si erra: una regresión de `anular` no la detectaría ningún test.

## Minors diferidos

- Task 2: el test de `canceladas` depende del estado que deja el primer test (orden de fichero).
- Task 2: sin canceladas, `canceladas` devuelve cadena vacía; la spec no define la lista vacía.
- Final: `cancelar Norte lun` sin `--motivo` responde «motivo no válido…» sin decir que falta el motivo (la spec no lo define).
- Final: `--motivo` sin comillas toma solo la primera palabra, y `--motivo` antes de sala/día rompe la lectura de argumentos.
