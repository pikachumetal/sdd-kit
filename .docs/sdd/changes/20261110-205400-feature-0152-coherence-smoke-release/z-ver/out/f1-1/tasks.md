# Tasks — 0010 Motivo al cancelar

- Task 1 — Cancelar con motivo: hecha (48666ee..0a52ced)
- Task 2 — Listado de canceladas: hecha (0a52ced..d8e3fbf)

Revisión final: Spec opus+high, con arreglos · Código sonnet+high, con arreglos · Arquitectura no (plan), sobre d8e3fbf
Pasada de fix: 0f8f0fb, 3 hallazgos RED→GREEN
Re-revisión: d8e3fbf..0f8f0fb, sdd-kit:effort-high + opus, todo arreglado

## Rulings

- Ruling: `canceladas` vacío imprime una línea en blanco; no se toca (cambiaría la salida observable; la spec no lo dice).
- Ruling: sin comillas / `--motivo` antes de sala y día, `anular`/voided, reservas en memoria (ADR 0003) y orden de validación motivo→reserva: la spec o el ADR los fijan.

## Minor diferidos

- `reasonOf` toma el token siguiente sin validar; `reason` solo existe en canceladas; test de motivo inválido sin el GIVEN de Norte lun.
- `test/cancel.test.js` pasó de CRLF a LF; estado en memoria compartido entre el test 1 y «canceladas».
