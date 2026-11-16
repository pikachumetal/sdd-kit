# Tasks — 0010 Motivo al cancelar

| Task | Estado | Commit |
| --- | --- | --- |
| 1 — Cancelar con motivo | hecha, revisión limpia | a9e82fc |
| 2 — Listado de canceladas | hecha, revisión limpia | (el hash va en el commit de cierre) |

Revisión final: Spec opus+high, listo para merge (3 Minor) · Código sonnet+high, con arreglos (2 Important: 1 arreglado, 1 falso) · Arquitectura no (plan), sobre 6865d6f
Pasada de fix: 249c906, 2 hallazgos RED→GREEN (por mutación)
Re-revisión: 6865d6f..249c906, sdd-kit:effort-high + opus, limpia

## Rulings
Ruling: modelo de implementador sonnet + sdd-kit:effort-low en ambas tasks — el plan no declara Modelo; 1 fichero de src, spec con textos exactos — si falla, el fix loop escala.
Ruling: sin worktree nuevo, trabajo en la rama feature/0010-cancel-reason ya aislada de main — el usuario pidió implementar aquí — coste: ninguno.
Ruling: el test «cancelar una reserva activa» se reescribe al contrato nuevo de la spec — la spec manda sobre el test viejo — coste: ninguno.
Ruling: sin reserva se comprueba antes que el motivo, así «cancelar sin reserva lo dice» queda intacto — la spec solo fija «sin --motivo» con reserva existente — coste: si el dev-lead prefiere motivo primero, cambia el orden de 2 líneas.
Ruling: los tests importan un módulo fresco por test (`import('../src/app.js?<n>')`) para no depender del orden por el estado compartido — coste: ninguno.
Ruling: `canceladas` une varias líneas con salto de línea y solo lista estado cancelled (no voided) — la spec no cubre varias — coste: bajo.
Final: Ruling: Code Important 'CRLF→LF reescribe cancel.test.js' — falso: blobs LF en 2e528b6 y en HEAD (0 líneas con CR); el diff grande es la reescritura de tests por la spec — coste si me equivoco: ruido de diff
Final: minor (deferred): `canceladas` sin canceladas imprime línea en blanco (spec muda; Code Minor 1 / Spec Minor 3)
Final: minor (deferred): `cancelar --motivo otro Norte lun` (flag antes de posicionales) toma mal sala/día (Code Minor 3)
Final: minor (deferred): truco `?fresh=N` en tests, constante entre funciones, mensaje «falta --motivo» (Code Minors 2, 4, 6)
