# SDD ledger — plan: .docs/sdd/specs/20261008-100000-feature-0010-cancel-reason/plan.md
Task 1: complete (commits 095484e..9bd87ab, review clean)
Task 2: Ruling: recuperación tras corte por cuota — informe task-2-report.md completo (DONE, 986158f): lo cuento como devuelto y va a su revisión; sin copia RED en el workspace, no se puede comparar — coste si me equivoco: la revisión no detecta un test ajustado al código
Task 2: Ruling: informe dice 4/4 y cancel.test.js tiene 3 tests — discrepancia de recuento sin efecto (suite completa 5/5 pasa al retomar); Minor del revisor (test canceladas depende del estado del primer test) aparcado — coste: fragilidad si se reordena
Task 2: complete (commits 9bd87ab..986158f, review clean)
Final: Eje Arquitectura: no en el plan (sin línea) · señales en el diff: ninguna (sin módulo nuevo, sin dependencias, sin contrato entre módulos; solo un campo reason en memoria) → no sale
Final: Revisión final sobre 5fcff90 — Spec: With fixes (2 Important, 3 Minor) · Código: With fixes (2 Important, 3 Minor) · Arquitectura: no sale
Final: Important a arreglar (una pasada, un fixer): (1) test cancelar sin --motivo [Spec1]; (2) test cancelar con motivo válido sobre reserva inexistente → «sin reserva Sur mar» [Spec2=Código1]; (3) test de canceladas con su propio GIVEN, sin depender del orden [Spec3=Código2, el Minor aparcado sube a Important por su efecto: única prueba de un ADDED]
Final: Ruling: «4/4 vs 3 tests» — se reabre: falta el test de sin --motivo (Important 1), no era solo recuento — coste: ninguno, se arregla en la pasada
Final: minor (deferred): `cancelar --motivo otro Norte lun` toma --motivo como sala (src/app.js:67)
Final: minor (deferred): `canceladas` sin canceladas imprime línea vacía — el spec calla, efecto pequeño
Final: minor (deferred): ADDED del spec debería ser MODIFIED y «Decisiones» salta del 1 al 3 (documental, va al walkthrough)
Final: Ruling: motivo solo en memoria (reviewer lo dejó fuera) — la app ya es en memoria y la persistencia es otra feature del ROADMAP — coste si me equivoco: motivos perdidos entre ejecuciones
Final: Ruling: anular sin motivo — es la 0011, fuera de Scope — coste: ninguno en esta feature
Final: Ruling: canceladas excluye anuladas — lo pide el Approach — coste: ninguno
Final: Ruling: CHANGELOG/ROADMAP sin actualizar — lo hace sdd-archive — coste: ninguno
Final: Ruling: --motivo sin comillas solo toma la primera palabra — comillas son de la shell y el error lista los motivos — coste: mensaje confuso al usuario
Final: Ruling: módulo único app.js mezcla parseo y dominio — sin eje Arquitectura, app de un fichero según architecture.md — coste: deuda si crece
Final: Ruling: Function lengths bajo límite — sin acción
Final: fixed Important 1-3 (sin motivo, sin reserva, canceladas sin depender del orden) — d10ac20; RED→GREEN por mutación en cada test, suite 7/7 y canceladas aislada 1/1 (verificado en el hilo)
Final: minor (deferred): test «sin motivo» (libres → 'Sur') depende de ir antes del test de cancelar con éxito; falso fallo posible si se reordena
