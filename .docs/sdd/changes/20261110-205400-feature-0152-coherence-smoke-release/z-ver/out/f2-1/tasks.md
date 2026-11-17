# Tasks — 0010 Motivo al cancelar

| Task | Estado | Commits |
| --- | --- | --- |
| 1 — Cancelar con motivo | completa | 143fca2..9ecf1d4 |
| 2 — Listado de canceladas | completa | 9ecf1d4..85e9377 |

Revisión final: Spec opus+high, With fixes · Código sonnet+high, With fixes · Arquitectura no (no lanzada: sin confirmación del dev-lead), sobre 85e9377
Pasada de fix: bb26168, 3 hallazgos (suite 7/7; sin RED: el cambio era quitar una dependencia y añadir tests de comportamiento ya implementado)
Re-revisión: 85e9377..bb26168, sdd-kit:effort-high + opus, Sí (0 Critical, 0 Important, 1 Minor)

## Rulings

Final: Ruling: canceladas depende del estado del primer test — node --test corre en orden y en un proceso; independizarlo exige un reset en src/ que la spec no pide — si se ejecuta solo con --test-name-pattern falla
Final: minor (deferred): canceladas sin canceladas imprime línea vacía (cambiaría la salida observable; fuera de la spec)
Final: minor (deferred): cancelar --motivo otro Norte lun toma --motivo como sala (orden de argumentos no contemplado)
Final: Ruling: Eje Arquitectura no lanzado — sin confirmación; ADR 0003 y zod ya cubiertos por los otros ejes — una frontera de módulo sin revisar; la rama es un solo fichero
Final: minor (deferred): test «sin motivo» usa Sur mar (sin reserva) y no una reserva activa; comprueba el orden de validación, no que la reserva siga activa

## Pendiente del dev-lead

- `zod` entró en el commit 85e9377 sin estar en spec ni plan; se quitó en bb26168. Confirmar que no se quería.
