# SDD ledger — plan: .docs/sdd/specs/20261008-100000-feature-0010-cancel-reason/plan.md
Task 1: complete (commits 523c0fd..bc49136, tests: node --test test/cancel.test.js → 2/2 pass)
Task 2: complete (commits bc49136..0fafa4c, tests: node --test test/cancel.test.js → 3/3 pass)
Final: Eje Arquitectura: no en el plan · señales en el diff: dependencia nueva `zod` en package.json (commit 0fafa4c, no prevista en el plan ni usada en el código) → sale
Final: Ruling: Eje Arquitectura no → sí — el diff añade la dependencia zod que el plan no preveía — coste si me equivoco: un eje opus de más (~poco); la dependencia no la usa ningún fichero
Final: Effort: tipo sdd-kit:effort-high disponible en el harness; Spec y Code salen primero (maxParallelAgents 2), Arquitectura cuando vuelva uno
Final: Revisión final sobre 0fafa4c — Spec opus+high: With fixes · Code sonnet+high: With fixes · Arquitectura opus+high: With fixes (subido: dependencia zod no prevista)
Final: fixed zod sin uso en package.json (3 ejes) — suite 7/7 (git grep zod vacío)
Final: fixed test de «sin reserva» borrado (Spec, Code) — pasa a la primera: la conducta ya existía, es guarda de regresión — suite 7/7
Final: fixed sin --motivo sin test (Spec Important, Code Minor) — pasa a la primera: la conducta ya existía, es guarda de regresión — suite 7/7
Final: fixed test canceladas dependiente del orden (Code Important, Spec/Arq Minor) — canceladas aislado RED→GREEN, suite 7/7
Final: minor (deferred): canceladas sin canceladas imprime línea en blanco; cambiaría la salida y el spec no la fija (Spec, Code)
Final: minor (deferred): el test de motivo fuera de lista no comprueba que una reserva existente sigue activa (Spec)
Final: minor (deferred): reasonOf posicional/frágil si --motivo va antes o es un flag seguido de otro (Code)
Final: minor (deferred): helpers colocados sin orden uniforme; cancelledList mezcla consulta y formato (Code)
Final: Ruling: reservas no sobreviven entre ejecuciones — con ADR 0003 (accepted) es lo esperado y el roadmap 0014 lo trata — si me equivoco, canceladas vacío en el CLI real hasta la 0014
Final: Ruling: anulaciones (0011), orden raro de argumentos, mayúsculas/espacios en el motivo — fuera del spec (lista cerrada del dev-lead y orden fijado) — si me equivoco, mensaje de motivo no válido, que es seguro
Final: Ruling: decisión 3 «sin review de spec» y numeración 1→3 del spec — proceso/documento, sin efecto en el código — coste nulo
Final: Ruling: process.argv a nivel de módulo, singleton de bookings, orden de validación motivo→reserva — preexistente o fijado por ADR 0003 y el spec — si me equivoco, mensaje distinto en un caso ya cubierto por la lista cerrada
Final: Ruling: cuerpo de commit «Cuerpo del commit.» y mensaje que oculta zod en 0fafa4c — higiene de commits ya cerrados; la dependencia sale en befa7d1, sin reescribir historia — coste nulo
Final: pasada de fix commit befa7d1; falta la única re-revisión
Final: Re-revisión 0fafa4c..befa7d1 (opus+high): los 4 hallazgos ADDRESSED; sin Critical/Important nuevos
Final: Ruling: test/cancel.test.js pasó de CRLF a LF en la pasada de fix (Minor de la re-revisión; el repo es CRLF y no exige LF) — arreglarlo abriría un commit sin revisar tras la única re-revisión y es solo formato — coste: diff de fichero entero en esa línea; se normaliza con autocrlf o en el próximo toque
Final: Ruling: setup de canceladas ignora el retorno de cancelar (Observación fuera de alcance) — quitar el acoplamiento del todo exige un reset del almacén, y ADR 0003 acepta el estado compartido — coste: mensaje poco claro si otro test cancelara Norte lun con otro motivo
