---
id: 20261008-100000-feature-0010-cancel-reason
title: Tasks — Motivo al cancelar
---

# Tasks — Motivo al cancelar (registro vivo)

| # | Task | Status | Commit | Notas |
| --- | --- | --- | --- | --- |
| 1 | Cancelar con motivo | done | c5b09aa | |
| 2 | Listado de canceladas | done | c5b09aa | |


Revisión final: Spec opus+high, listo para integrar (1 minor) · Código sonnet+high, con fixes (1 important) · Arquitectura no (plan), sobre c5b09aa
Pasada de fix: 8707873, 1 hallazgo RED→GREEN (+1 minor corregido por `review.minors: fix`)
Re-revisión: c5b09aa..8707873, sdd-kit:effort-high + opus, hallazgos resueltos; 1 important y 1 minor nuevos adjudicados (ver Rulings)

## Rulings

Final: Ruling: re-revisión Important — test 'cancelar acepta un motivo… espacios alrededor' cambió dato y aserción en 8707873 tras su RED de 17a0e06, sin declararlo — el cambio es real; lo comprobé ahora: la versión actual contra src/app.js de c5b09aa falla (3 pass, 1 fail), y comprueba además que el motivo guardado va recortado; se queda, sin segunda pasada — coste si me equivoco: un test más estricto que el que se vio en RED al escribirlo
Final: Ruling: re-revisión Minor — src/app.js y test/cancel.test.js pasaron de CRLF a LF en 17a0e06/8707873 (diff de 96 y 41 líneas por 1 y ~20 reales); es un efecto mío y no se revierte: la re-revisión no abre otra pasada — coste si me equivoco: diff ruidoso en esos dos ficheros y ficheros con fin de línea distinto al resto del repo (ámbito autocrlf=true)
Final: minor (deferred): falta un test del THEN «sin --motivo responde motivo no válido» (ya faltaba en c5b09aa; el código lo cumple)
