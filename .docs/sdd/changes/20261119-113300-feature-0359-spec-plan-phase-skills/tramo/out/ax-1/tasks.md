# Tasks — Motivo al cancelar

| Task | Estado | Commit |
| --- | --- | --- |
| 1 — Cancelar pide un motivo de la lista | completa | b6f92b4 |
| 2 — El listado de canceladas enseña el motivo | completa | d4f5ced |

## Rulings

Revisión final: Spec opus+high, con arreglos (3 menores) · Código sonnet+high, con arreglos (1 importante) · Arquitectura opus+high, con arreglos (1 importante), sobre d4f5ced
Pasada de fix: b067a50, 2 hallazgos: 1 RED→GREEN (código), 1 documental (operations.md y README)
Re-revisión: d4f5ced..b067a50, sdd-kit:effort-high + opus, limpia (3 menores aplazados)
Ruling: estado en memoria compartido entre tests del fichero — el orden manda: el test de canceladas vacío va primero; Norte lun se cancela una sola vez — si falla el orden, hay que reordenar tests.
Task 1: Ruling: añadido .gitignore con node_modules/ — sin él npm install dejaba node_modules sin ignorar — coste si falla: un fichero de más
Task 1: Ruling: --motivo ausente → motivo undefined (no params[indexOf+1]) — evita que 'cancelar otro lun' tome la sala como motivo — coste: ninguno
Final: minor (deferred): CRLF→LF en test/cancel.test.js y package.json minificado sin salto final
Final: minor (deferred): `cancelar sin motivo no cancela` no comprueba que la reserva sigue activa (depende del orden)
Final: minor (deferred): Review Focus nombra `sin reserva con motivo válido lo dice`; el test real es `cancelar sin reserva lo dice`
Final: minor (deferred): sin test de anuladas; un test/void.test.js aparte lo permitiría (el motivo del plan no valía entre ficheros)
Final: minor (deferred): REASONS y reasonSchema duplicados (reasonSchema.options); argumentos sobrantes ignorados; falta "name" en package.json
Final: Ruling: zod dentro de cancelBooking (fuga de framework hacia dentro) — proporcionado en un CLI de un fichero — coste si falla: mover la validación a run
Final: minor (deferred): re-review — test de la bandera en medio (Sur --motivo otro mar) y argumento undefined explícito en src/app.js:46
