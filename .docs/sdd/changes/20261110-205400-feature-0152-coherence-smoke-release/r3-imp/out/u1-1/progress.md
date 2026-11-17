# SDD ledger — plan: .docs/sdd/specs/20261008-100000-feature-0010-cancel-reason/plan.md
Task 2: complete (commits 1bcd12d..f095332, tests: node --test test/cancel.test.js → ℹ duration_ms 72.2976)
Final: Eje Arquitectura: no en el plan (sin línea) · señales en el diff: ninguna (sin módulo nuevo, sin dependencia, sin contrato entre módulos, sin datos persistentes: el motivo vive en memoria) → no sale
Final: Ruling: Eje Arquitectura no — el plan no trae línea y el diff no cruza ninguna señal — si hubiera un contrato que no vi, no lo revisaría un eje fresco
Task 2: Ruling: la enmienda del 2026-11-12 (sin «quién canceló») va aprobada por el dev-lead en la sesión; su hueco de THEN lista vacía no se añade — coste si es incorrecto: `canceladas` sin canceladas devuelve cadena vacía
Final: Revisión final: Spec opus+high, con arreglos · Código sonnet+high, con arreglos · Arquitectura no (plan), sobre 0105b2d
Final: fixed cancelar sin --motivo sin test (Spec, Importante) — "cancelar sin --motivo responde que el motivo no es válido" RED→GREEN por mutación de reasonOf, suite 7/7
Final: fixed cobertura de «sin reserva» perdida (Spec y Código, Importante) — "cancelar con motivo válido una reserva que no existe lo dice" RED→GREEN por mutación del texto, suite 7/7
Final: fixed test de canceladas dependiente del primero (Spec y Código, Importante) — ahora importa un módulo propio; pasa aislado, suite 7/7
Final: Ruling: canceladas sin canceladas devuelve cadena vacía (Spec Menor→Importante por efecto) — arreglarlo añade una salida nueva y un THEN que la spec no tiene: es una desviación, no la decido yo; va a ✋ — coste si es incorrecto: el usuario ve una línea en blanco sin saber si no hay canceladas
Final: minor (deferred): test de cancelar con motivo inválido no comprueba que no se cancele nada ni que el motivo se valide antes de buscar la reserva
Final: minor (deferred): cancelar acepta --motivo solo tras sala y día; con otro orden toma --motivo como sala
Final: minor (deferred): separador « — » del listado difícil de parsear para scripts (fijado por la spec)
Final: minor (deferred): cadenas 'active', 'cancelled', 'voided' repetidas; ya estaba antes
Final: minor (deferred): ledger sin línea de la Task 1, que se hizo antes de abrir el workspace
Final: Ruling: no se mira si el listado debe enseñar quién canceló ni si --motivo es obligatorio (Código lo dejó al eje Spec) — lo cubre la enmienda aprobada y la spec — coste si es incorrecto: ninguno nuevo
Final: Ruling: estado en memoria, bookings mutable y efecto de process.argv al importar (Código, arquitectura previa) — es anterior a la feature y la spec no pide persistencia — coste si es incorrecto: con procesos separados, canceladas siempre sale vacío; hay que decidir persistencia aparte
Final: Ruling: el patrón de if encadenados y errores como cadenas (Código, anterior) — no lo introduce esta rama — coste si es incorrecto: deuda previa sin tocar
Final: Ruling: reservas canceladas antes de la feature sin motivo, anular sin motivo (Spec) — no puede ocurrir sin persistencia, y la anulación es la 0011 — coste si es incorrecto: ninguno hoy
