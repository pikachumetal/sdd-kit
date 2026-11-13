# Tasks — Motivo al cancelar

| Task | Estado | Commit |
| --- | --- | --- |
| Task 1 — Cancelar con motivo | hecha | afe9113 |
| Task 2 — Listado de canceladas | hecha | 95e4fa0 |

Revisión final: self-review sin herramienta de subagentes (más débil que revisores frescos) — Spec: limpia · Código: limpia, 1 minor diferido · Arquitectura no (plan sin línea; señales: ninguna), sobre 95e4fa0

## Rulings

- Setup: Ruling: trabajo en el sitio en feature/0010-cancel-reason, sin worktree nuevo — el dev-lead está fuera, la rama ya es la de la feature y no es main — si estaba mal, mover los commits a un worktree es un cherry-pick.
- Task 1: Ruling: el test «cancelar una reserva activa» (sin motivo) se sustituye por el THEN con motivo, y «cancelar sin reserva lo dice» pasa `--motivo otro` — la spec cambia la respuesta sin motivo — si el dev-lead quería conservar algo del viejo, es un test más.
- Task 1: Ruling: el motivo se valida antes de buscar la reserva (sin reserva y motivo inválido → «motivo no válido…») — la spec no fija el orden y así un comando mal formado se rechaza siempre igual — si no, se intercambian dos líneas.
- Task 2: Ruling: `canceladas` con varias reservas pone una por línea, y sin ninguna responde vacío — la spec solo fija el caso de una — si el dev-lead quiere otro separador o un «sin canceladas», es un cambio de una línea y una enmienda.
- Final: Ruling: Eje Arquitectura decidido en el despacho como «no» — el plan no trae la línea y el diff no cruza ninguna señal — si estaba mal, falta una lectura de fronteras de un diff de 20 líneas en un solo fichero.
- Final: Ruling: (Spec, declinado) `canceladas` en una ejecución real por CLI siempre sale vacío, porque las reservas viven en memoria y cada comando es un proceso nuevo — ya pasaba con `cancelar` antes de la rama, y guardar el motivo en el almacén es la 0014 del roadmap — si el dev-lead esperaba verlo por CLI ya, la 0014 se adelanta.
- Final: Ruling: (Spec, declinado) un motivo de dos palabras sin comillas (`--motivo sala ocupada`) responde «motivo no válido: …» — la spec fija el motivo como un argumento y el mensaje enseña la lista — si molesta, se puede juntar el resto de argumentos tras `--motivo`.
- Final: Ruling: (Código, declinado) `--motivo` en otra posición (`cancelar --motivo otro Norte lun`) toma `--motivo` como sala — la spec fija la sintaxis `cancelar <sala> <día> --motivo <motivo>` — coste bajo: responde «sin reserva».
