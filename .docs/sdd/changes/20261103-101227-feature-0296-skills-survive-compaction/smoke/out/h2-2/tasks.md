---
id: 20261008-100000-feature-0010-cancel-reason
title: Tasks — Motivo al cancelar
spec: ./spec.md
plan: ./plan.md
created: 2026-11-05
---

# Tasks — Motivo al cancelar (registro vivo)

- **Spec**: `./spec.md`
- **Plan**: `./plan.md`
- **Rama**: `feature/0010-cancel-reason`

## Estado de las tasks

| # | Task | Status | Commit | Notas |
| --- | --- | --- | --- | --- |
| 1 | Cancelar con motivo | done | c971ae4 | |
| 2 | Listado de canceladas | done | (en el cierre) | |

## Verificación por task

- [x] Task 1 — `node --test test/cancel.test.js`
- [x] Task 2 — `node --test test/cancel.test.js`

## Fixes adicionales (trabajo descubierto fuera de scope; el tercero abre el freno de alcance)

| Descubierto | Causa raíz | Decisión | Commit |
| --- | --- | --- | --- |

## Rulings


- Revisión final: Spec opus+high, limpia · Código sonnet+high, limpia · Arquitectura no (plan), sobre c7a16ed

```
Task 0: Ruling: Ejecución — sigo SDD (subagent) — la línea `Ejecución` del plan manda sobre `execution: native` de sdd-kit.json — coste si erróneo: una task cara en revisión
Ruling: el test `cancelar una reserva activa` se sustituye por los de la spec (cancelar con motivo) — la spec manda — si erróneo: reescribir un test
Ruling: se valida el motivo antes de buscar la reserva; `cancelar Sur mar` pasa a `--motivo otro` en su test — la spec dice que sin --motivo responde «motivo no válido» sin condicionarlo a la reserva — si erróneo: invertir el orden y el test
Ruling: el test de T2 reutiliza el estado dejado por el test de T1 (Norte lun cancelada con «sala ocupada»); en T1 los casos de motivo inválido van antes del cancelar válido — el módulo no tiene reset y el plan no lo pide — si erróneo: frágil ante reordenar tests
Final: Ruling: el motivo no persiste entre ejecuciones (bookings vive en memoria; en terminal `cancelar` y luego `canceladas` son procesos distintos y nunca enseña nada) — la base del molde ya no persistía nada y la spec solo pide guardarlo «con la reserva»; no es un cambio de esta feature — si erróneo: el Intent de 0010 no llega al usuario de terminal y hace falta una feature de persistencia
Final: Ruling: cambio CRLF→LF de test/cancel.test.js (lo introduje al escribir el RED; src/app.js sigue en CRLF) — formato, no altera aserciones; sin .gitattributes no lo normalizo en esta rama — si erróneo: ruido en el blame de las 11 líneas del test
Final: Ruling: los dos tests de la base que llamaban a `cancelar` sin motivo se actualizaron a la spec (el revisor de Código no sabía si eran RED) — ya cubierto por el ruling del pre-flight; la spec manda — si erróneo: reescribir dos tests
Final: minor (deferred): `canceladas` sin canceladas imprime una línea en blanco (src/app.js, listCancelled); la spec no fija ese caso
Final: minor (deferred): el listado con varias canceladas no tiene test (separador '\n')
Final: minor (deferred): `--motivo` seguido de otro flag no tiene test propio (da «motivo no válido», correcto)
Final: minor (deferred): test de `canceladas` acoplado al orden de los tests del fichero
```
