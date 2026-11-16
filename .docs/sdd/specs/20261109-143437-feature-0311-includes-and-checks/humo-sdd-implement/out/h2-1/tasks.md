# Tasks — 0010 Motivo al cancelar

| Task | Estado | Commit |
| --- | --- | --- |
| 1 — Cancelar con motivo | hecha | b72cc18 |
| 2 — Listado de canceladas | hecha | 6f47ad2 |

Revisión final: Spec opus+high, con arreglos opcionales (solo Minor) · Código sonnet+high, Sí (solo Minor) · Arquitectura no (plan), sobre 482ee0c

Gate: `node --test` → 7/7

## Rulings

Ruling: sin worktree nuevo, sigo en feature/0010-cancel-reason — ya es rama de la feature, perfil delegate no se para — coste si falla: mover la rama a un worktree
Ruling: el test existente 'cancelar una reserva activa' (sin motivo) contradice el AND «sin --motivo → motivo no válido»; gana la spec, T1 lo reescribe — coste si falla: un test cambiado de más
Ruling: con reserva inexistente se responde «sin reserva …» antes de validar el motivo — la spec solo fija el motivo para una reserva existente (GIVEN) y así el test 'cancelar sin reserva lo dice' no cambia — coste si falla: un mensaje distinto para sala sin reserva y sin motivo
Task 1: Ruling: ⚠️ del revisor (RED modificados) — comparada la copia RED con test/cancel.test.js commiteado, idéntica salvo EOL — coste si falla: ninguno
Task 2: Ruling: Minor del revisor (test dependiente del orden por estado compartido; `canceladas` vacío devuelve '' sin texto definido) — no se abre ronda: el estado compartido es del módulo en memoria y la spec no define el caso vacío; va al informe para el dev-lead — coste si falla: un test frágil al reordenar
Final: Ruling: reserva inexistente con motivo no válido responde «sin reserva …» (Spec, descartado) — el GIVEN de la spec solo cubre reservas existentes; coincide con la Ruling previa — coste si falla: un mensaje distinto para ese caso
Final: Ruling: persistencia entre ejecuciones del CLI (Spec, descartado) — el estado en memoria ya era así antes de la feature y la spec prueba por run() — coste si falla: `canceladas` desde terminal siempre sale vacío
Final: Ruling: `--motivo` antes de sala y día, mayúsculas distintas, texto libre en «otro» (Spec, descartado) — la sintaxis y la lista cerrada las fija la spec — coste si falla: un usuario que escriba otro orden recibe «sin reserva --motivo otro»
Final: Ruling: anulaciones (0011) sin motivo (Code, descartado) — fuera del Scope de la spec — coste si falla: ninguno en esta feature
Final: minor (deferred): `canceladas` sin canceladas imprime línea en blanco; la spec no define el texto (cambiarlo es un delta nuevo, decisión del dev-lead)
Final: minor (deferred): solo se prueba aceptar «sala ocupada»; «cambio de planes» y «otro» no tienen test de aceptación
Final: minor (deferred): tests de test/cancel.test.js dependen del orden por el estado compartido de `bookings`
Final: minor (deferred): b72cc18 reescribió test/cancel.test.js de CRLF a LF, el diff parece una reescritura completa; no hay .gitattributes
Final: minor (deferred): `optionValue` no comprueba que el siguiente argumento no sea otro flag (hoy inocuo por la lista cerrada)
Final: minor (deferred): cadena de `if` en `run` crece un comando más (6 ramas, aceptable)

## Minors diferidos

- `canceladas` vacío imprime línea en blanco (la spec no define el texto).
- Solo se prueba aceptar «sala ocupada»; faltan «cambio de planes» y «otro».
- Tests dependientes del orden por estado compartido; test CRLF→LF reescrito entero.
- La spec salta de la Decisión 1 a la 3: sin verificar si falta la 2.
