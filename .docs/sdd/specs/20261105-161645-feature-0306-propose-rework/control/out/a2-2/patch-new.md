---
id: 20261106-095901-patch-0012-cancel-day
task: 0012
title: Patch — cancelar y anular miran el día
type: patch
solution: causa raíz
status: done
created: 2026-11-06
branch: feature/0012-cancel-day
commit: PENDIENTE
---

# Patch 0012 — cancelar y anular miran el día

Validación: dev-lead — el fallo se ve en la terminal y quien lo reportó lo comprueba con su caso.

## Capacidades

Ninguna, porque ninguna capacidad describe la cancelación ni la anulación (`sdd capability index`: «Sin capacidades»).

## 1. Síntoma

«Si cancelo Norte el martes, que no tengo reservado, me dice "cancelada Norte mar" y me quita la del lunes.»

Reproducido en la base actual (`develop`, 4 tests en verde):

```text
$ node src/app.js cancelar Norte mar
cancelada Norte mar
$ node src/app.js anular Norte mar
anulada Norte mar
```

Con la única reserva de Norte el lunes, ambos comandos la tocan. Lo medido añade a lo reportado que la anulación del responsable de sala falla igual.

## 2. Causa raíz

`findBooking(room, day)` (`src/app.js:11`) recibe `day` y no lo usa: busca la primera reserva activa de la sala, sea del día que sea. Evidencia: la función solo compara `b.room === room && b.status === 'active'`, mientras que `bookings` guarda `day` en cada reserva. `cancelBooking` y `voidBooking` comparten esa búsqueda, así que ambas heredan el fallo. Con la reserva de Norte el lunes, cualquier día pedido para Norte devuelve la del lunes.

El patch 0007 corrigió una comparación solo por hora; esta búsqueda sigue sin mirar el día. Los tests actuales no lo cubren: «cancelar sin reserva» usa `Sur`, que no tiene ninguna reserva, y no hay test de `anular`.

## 3. Fix

- **Fichero(s)**: `src/app.js`, `test/cancel.test.js`
- **Cambio**: `findBooking` compara también `b.day === day`.

## 4. Verificación

| # | Caso | Resultado |
| --- | --- | --- |
| 1 | `cancelar Norte mar` (Norte solo reservada el lunes): en el RED devolvía `cancelada Norte mar`; ahora `sin reserva Norte mar` y `libres 10:00-12:00` sigue en `Sur` | ✅ |
| 2 | `anular Norte mar`: medido en un proceso limpio antes del fix, devolvía `anulada Norte mar`; ahora `sin reserva Norte mar` y la del lunes sigue activa | ✅ |
| 3 | `cancelar Norte lun` sigue cancelando la reserva del lunes | ✅ |

En el RED, el test de `anular` cayó en cascada porque el de `cancelar` ya había borrado la del lunes (el estado es de módulo); su fallo propio se midió aparte, en un proceso limpio.

Revisión del patch (un revisor, sin Críticos ni Importantes; 4 Menores):

- Los dos tests nuevos dependen de ir antes de `cancelar Norte lun` — rechazado: el comentario del fichero lo avisa y `node:test` respeta el orden de declaración; reiniciar el estado exigiría tocar `src/app.js` fuera del fallo.
- El RED de `anular` cayó en cascada — rechazado: ya constaba arriba y su fallo propio se midió en un proceso limpio.
- Tiempos de §5 (`09:57Z` de sesión, `09:59Z` de inicio, «0 min de espera») — rechazado: la línea de esfuerzo es la que imprime `sdd session tokens`, pegada tal cual; el inicio es la apertura del patch.
- `commit: PENDIENTE` — se rellena en el commit de cierre de `sdd-archive`; la base `develop` y el patch 0007 sí existen (rama inicial y `roadmap.md`), el revisor no los veía.

Gate: `node --test && node scripts/lint.mjs` → corrió 6/6 · lint: sin hallazgos.

## 5. Tiempo (ligero)

- Estimación: 0,5 h
- Inicio: 2026-11-06T09:59Z
- Esfuerzo real: 0,03 h — reloj de la sesión 0,03 h desde 2026-11-06T09:57Z, sin 0 min de espera al dev-lead (1 espera)
- Coste de sujetos: no aplica
