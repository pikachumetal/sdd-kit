# Tasks — 0010 Motivo al cancelar

| Task | Estado | Commit |
| --- | --- | --- |
| 1 — Cancelar con motivo | hecha (revisión de task: no consta; la cubre la revisión final) | b9057ec |
| 2 — Listado de canceladas | hecha; el implementador cortó por cuota tras commitear, verificada en el hilo: `node --test` 5/5 | dab4a1c |

## Rulings

- Corte por cuota en la Task 2 («usage limit reached»): el commit dab4a1c existía y la suite pasa; se da por entregada y se revisa en la revisión final del rango 19de6b5..HEAD.
- Sin ledger de superpowers ni revisiones de task en el workspace tras el corte: no hay evidencia de que los tests RED se escribieran antes del código; lo cubre la revisión final.

Revisión final: sdd-kit:effort-high + opus, Important ×3 (sin Critical), sobre dab4a1c
Pasada de fix: 23594e4, 2 hallazgos RED→GREEN (Important 1 reproducido en RED: `canceladas` solo devuelve `''`; Important 3 recuperado el test «sin reserva»)

## Rulings (revisión final)

- Important 2 (`cancelar` sin `--motivo` ya no cancela; la spec no lo declara) cambia el comportamiento observable y pide un THEN nuevo: es un desvío de spec, no un ruling. Pendiente del dev-lead, sin tocar spec.md.
