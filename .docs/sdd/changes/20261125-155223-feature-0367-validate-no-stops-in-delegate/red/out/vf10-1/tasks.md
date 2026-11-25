---
id: 20261008-100000-feature-0010-cancel-reason
title: Tasks — Motivo al cancelar
---

# Tasks — Motivo al cancelar (registro vivo)

| # | Task | Status | Commit | Notas |
| --- | --- | --- | --- | --- |
| 1 | Cancelar con motivo | done | 6b06d7f | |
| 2 | Listado de canceladas | done | 7cf3934 | |
| 3 | Libres según el estado de la reserva (vuelta de la validación) | done | 342bfe4 | |



## Rulings

- Task 2: Ruling: el test de `canceladas` reutiliza la cancelación del primer test en vez de preparar la suya — workaround hasta que cada test prepare sus datos — coste si es erróneo: el test falla si corre solo o en otro orden — resuelto en la pasada de fix de la revisión final (737a4ab): el test prepara su propio GIVEN
- Final: Ruling: nº 2 de «Decisiones que he tomado yo» falta en la spec (1, 3) — erratum de numeración; no toco la spec aprobada — coste: una decisión sin recoger si de verdad faltaba
- Final: Ruling: cancelar valida el motivo antes que la reserva — el spec fija «motivo no válido» sin --motivo; con reserva inexistente y sin motivo gana el motivo — coste: mensaje distinto en ese caso cruzado
- Final: Ruling: persistencia, mayúsculas del motivo, --motivo antes de sala/día, anulaciones (0011) fuera de la spec — se quedan como están — coste: ninguno hoy
- Final: Ruling: 06783bc deja libres roto en medio del historial y hay ruido CRLF/LF — se queda; 342bfe4 lo corrige — coste: bisect confuso entre 06783bc y 342bfe4

## Revisión final

Revisión final: Spec opus+high, con arreglos · Código sonnet+high, con arreglos · Arquitectura no (plan sin eje; sin señales en el diff), sobre 342bfe4
Pasada de fix: 737a4ab, 4 hallazgos RED→GREEN
Re-revisión: 342bfe4..737a4ab, sdd-kit:effort-high + opus, listo para merge (solo un menor documental, cerrado aquí)
