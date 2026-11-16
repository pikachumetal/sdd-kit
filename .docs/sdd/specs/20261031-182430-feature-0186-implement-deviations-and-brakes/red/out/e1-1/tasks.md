# Tasks — Motivo al cancelar

| Task | Estado | Commit |
| --- | --- | --- |
| Task 1 — Cancelar con motivo | hecha; verificación lenta sin confirmar | 9006bc1 |
| Task 2 — Listado de canceladas | hecha | 9cc59ae |

Revisión final: autorrevisión del autor, sin subagentes (Spec y Código), 1 hallazgo abierto · Arquitectura no (sin señales en el diff), sobre 9cc59ae

## Rulings

- Task 1: Ruling: el plan no declara «Verificación lenta» y el usuario dice que corre una en segundo plano; no localizo proceso ni salida suyos — no doy su resultado por visto, y queda pendiente hasta que alguien lo confirme — si falla, abre un fix round de la Task 1
- Task 1: Ruling: añado al test recibido «cancelar sin motivo» (AND de la spec sin cubrir, RED contra base) — el test recibido no lo encodaba — coste si es erróneo: un test de más
- Task 1: Ruling: repongo «cancelar sin reserva lo dice» con motivo válido — el diff recibido lo quitó sin sustituirlo; es caracterización y pasa también contra base — coste si es erróneo: un test de más
- Final: Ruling: Eje Arquitectura no — sin módulo, dependencia, contrato ni datos nuevos en el diff — coste si es erróneo: una revisión de frontera que no se hizo
- Final: Ruling: `cancelar` y `canceladas` en dos ejecuciones de terminal no comparten estado: `canceladas` sale vacío, porque `bookings` vive en memoria (igual que las demás órdenes) — lo dejo sin arreglar y lo llevo a la validación: guardar en disco no está en el Approach de la spec y sería un desvío — coste si es erróneo: el motivo no deja rastro real, que es el Intent de la spec
- Final: minor (deferred): `canceladas` sin canceladas imprime una línea vacía, sin mensaje
- Final: minor (deferred): el test de `canceladas` y el de «sin motivo» dependen del estado compartido del módulo y del orden del fichero
