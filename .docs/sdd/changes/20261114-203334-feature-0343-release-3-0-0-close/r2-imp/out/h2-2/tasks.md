# Tasks — feature 0010 Motivo al cancelar

| Task | Estado | Commit |
| --- | --- | --- |
| 1 — Cancelar con motivo | hecha, revisión limpia | 637c7db |
| 2 — Listado de canceladas | hecha, revisión limpia | d40f129 |

Revisión final: Spec opus+high, Ready Sí · Código sonnet+high, With fixes (1 Important), sobre 42a3f03 · Arquitectura no (plan sin eje; sin señales en el diff)
Pasada de fix: 6f04a46, 1 hallazgo RED→GREEN
Re-revisión: 42a3f03..6f04a46, sdd-kit:effort-high + opus, hallazgo resuelto y sin roturas nuevas

## Rulings

Ruling: método SDD — la línea `Ejecución: subagent` del plan manda sobre `execution: native` de sdd-kit.json — coste si erróneo: ninguno, solo más revisión.
Ruling: effort — el plan no declara effort; uso sdd-kit:effort-medium con sonnet — coste: rework menor.
Ruling: el test existente de cancelar se reescribe para el THEN de la spec (con --motivo "sala ocupada") — la spec manda — coste: ninguno, está en los ficheros de T1.
Ruling: los tests de T2 se escriben en el mismo fichero y tras los de T1, apoyándose en el estado que deja T1 (el GIVEN de T2 coincide con el WHEN de T1) — coste: orden de tests acoplado.
Final: Ruling: effort-high + opus (Spec) y sonnet (Código) en paralelo, cap 3 por defecto
Final: minor (deferred): canceladas sin canceladas devuelve '' y la CLI imprime línea en blanco (spec muda; `libres` hace lo mismo)
Final: minor (deferred): `--motivo` antes de sala/día desplaza los posicionales (cancelar --motivo otro Norte lun → «sin reserva --motivo otro»)
Final: minor (deferred): test/cancel.test.js pasó de CRLF (base) a LF al reescribirlo el hilo en el RED; src/app.js sigue en CRLF — el diff reescribe el fichero entero
Final: minor (deferred): constante CANCEL_REASONS entre funciones, no arriba junto a rooms/bookings
Final: minor (deferred): sin test de `--motivo` sin valor, de voided excluida de canceladas ni de lista vacía
Final: minor (deferred): la lista «Decisiones que he tomado yo» de la spec salta del 1 al 3 (¿falta la 2?) — a confirmar con el dev-lead
Final: Ruling: Declined (Code) — el RED de cancelar se reescribió porque el test antiguo contradecía el AND «sin --motivo»: la spec manda — coste: ninguno
Final: Ruling: Declined (Code) — estado global en memoria y entrada CLI de app.js son previos a la rama, eje Arquitectura (no sale) — coste: deuda previa sin tocar
Final: Ruling: Declined (Spec) — persistencia del motivo entre invocaciones es la 0014; regla de 24 h, test de regresión del patch 0007 y CHANGELOG no son de esta rama — coste: salida de `canceladas` vacía en la CLI real hasta la 0014
Final: Ruling: Declined (Spec) — motivo de varias palabras sin comillas se rechaza; orden de validación motivo→reserva coherente con el AND incondicional; «— undefined» imposible con el código actual — coste: UX de citar el motivo
Final: Ruling: Declined (Spec) — decisión 3 (sin review de spec) es de proceso, sin regla de código — coste: ninguno
