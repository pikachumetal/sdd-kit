# Tasks — 0010 Motivo al cancelar

| Task | Estado | Commit |
| --- | --- | --- |
| 1 — Cancelar con motivo | hecha | 6fc7fc4 |
| 2 — Listado de canceladas | hecha | c2528d9 |

Revisión final: Spec opus+high, With fixes (solo Minor, diferidos) · Código sonnet+high, Yes · Arquitectura no (plan sin eje; sin señales en el diff), sobre d32ce0e

## Rulings

Ruling: tests viejos de cancel.test.js pasan a usar --motivo — la spec (AND sin --motivo) manda sobre el comportamiento previo — coste si falla: rehacer 2 tests.
Ruling: trabajo en el checkout actual (feature branch) sin crear worktree — no hay preferencia declarada y la rama ya está aislada de main — coste: ninguno, revertible con git.
Ruling: plan dice Ejecución subagent y sdd-kit.json execution native — decide la línea del plan (SDD) — coste: más tokens.
Task 2: RED escrito (1 de 5 falla) — copia ../red-copies/task2-cancel.test.js; base check limpio. Ruling: el GIVEN de canceladas depende del test anterior (estado de módulo compartido) — spec fija test/cancel.test.js y el GIVEN es el mismo hecho — coste: orden de tests frágil
Final: Ruling: plan sin línea Eje Arquitectura — decido no con las 4 señales — coste si falla: eje de arquitectura sin pasar en un cambio de 2 funciones
Final: minor (deferred): `canceladas` sin canceladas imprime línea en blanco (src/app.js:58-63; texto nuevo de interfaz sin spec, lo decide el dev-lead)
Final: minor (deferred): test de `canceladas` depende del estado del test anterior (test/cancel.test.js:117-120)
Final: minor (deferred): motivo validado antes de buscar la reserva (src/app.js:37); sin test explícito de que un motivo inválido deje la reserva activa
Final: minor (deferred): optionValue colocada entre funciones de dominio; CRLF/LF en test/cancel.test.js reescribe el diff entero (core.autocrlf=true)
Final: Ruling: persistencia entre ejecuciones del CLI — el estado es en memoria desde la base (3a1d1ef) y la spec no la pide; el listado desde el CLI en un proceso nuevo sale vacío — coste si falla: feature 0014 («Motivo guardado») lo cubre en el roadmap
Final: Ruling: --motivo antes de los posicionales, mayúsculas en el motivo, formato con varias canceladas, anulaciones, decisión 3 de la spec — fuera de la sintaxis y la lista cerrada que fija la spec; anulaciones son la 0011 — coste si falla: rework pequeño
Final: Ruling: cancelar sin sala/día responde «sin reserva undefined undefined» — ya era así antes y queda fuera del alcance — coste: mensaje feo sin pérdida
Final: Ruling: bookings como estado de módulo y run+CLI en un fichero — arquitectura previa a la feature — coste: ninguno ahora
