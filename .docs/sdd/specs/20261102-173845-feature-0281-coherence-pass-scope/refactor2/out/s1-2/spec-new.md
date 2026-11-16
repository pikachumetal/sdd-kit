---
id: 20261102-171841-feature-0010-cancel-reason
feature: 0010
title: Motivo al cancelar
mode: full
profile: delegate
status: draft
created: 2026-11-02
author: Fixture
approvers:
  - name: TBD
    approved_at: null
---

# Spec — Motivo al cancelar

🦆 Al cancelar una reserva hay que decir por qué, eligiendo de una lista: cambio de planes, sala ocupada u otro (`cancelar Norte lun --motivo sala-ocupada`). Un comando nuevo, `canceladas`, lista las reservas canceladas con su motivo (`Norte lun 10:00-12:00 · sala ocupada`). Si falta el motivo o no está en la lista, no se cancela nada y el programa dice cuáles valen. Las anulaciones del responsable de sala no cambian.

Validación: dev-lead — es un comando que usa una persona y el formato de la salida lo juzga quien lo lee.

## Capacidades

- Nuevas: `booking-cancellation` — cancelar una reserva con motivo y listar las canceladas.
- Modificadas: ninguna (hoy no hay capacidades en `capabilities/`).
- Retiradas: ninguna.

## ✋ Decisiones que he tomado yo — valida estas

Review de spec: ninguna — el dev-lead dijo «Sin review».

1. **El listado de canceladas no existe hoy**: la petición decía que «el listado de canceladas lo enseña», pero `src/app.js` no tiene ningún listado. Creo el comando `canceladas`. Si pensabas en otro sitio, dímelo.
2. **Capacidad nueva `booking-cancellation`**: la cancelación no estaba documentada en `capabilities/`, así que todo va como `ADDED`.
3. **Cómo se elige el motivo**: opción `--motivo <clave>` en `cancelar`, con las claves `cambio-de-planes`, `sala-ocupada` y `otro`.
4. **Motivo obligatorio**: `cancelar Norte lun` sin motivo ya no cancela; responde `indica un motivo: cambio-de-planes, sala-ocupada, otro`. Un motivo fuera de la lista responde `motivo no válido: usa cambio-de-planes, sala-ocupada u otro`. Se comprueba antes de buscar la reserva, así que con motivo inválido y sin reserva sale el aviso del motivo.
5. **«Otro» no lleva texto libre**: es una opción más de la lista.
6. **Salida de `cancelar`**: no cambia (`cancelada Norte lun`); el motivo solo se ve en `canceladas`.
7. **Formato de `canceladas`**: una línea por reserva, `<sala> <día> <franja> · <motivo en texto>` (`Norte lun 10:00-12:00 · cambio de planes`), en el orden en que se cancelaron. Sin ninguna: `sin canceladas`.
8. **Las anuladas no salen en `canceladas`**: una anulación es del responsable de sala y la 0011 la tocará; aquí solo se listan las reservas con estado cancelada.
9. **Los tests de `cancel.test.js` cambian**: `cancelar una reserva activa` pasa a llevar `--motivo`; hoy llama sin motivo y por la decisión 4 fallaría.
10. Repaso de coherencia: sin placeholders ni contradicciones; textos y claves iguales en decisiones y THEN. Prueba del delta en copia temporal: `capability merge` → `booking-cancellation.md`: añadidos «Cancelar con motivo», «El motivo es obligatorio y de la lista», «Cancelar sin reserva», «Listado de canceladas» (exit 0).
11. Política de modelos: revisores de la spec, ninguno · ejes de la revisión final: Spec opus+high, Código sonnet+high, Arquitectura según el plan · otros despachos en paralelo: ninguno previsto · en paralelo hasta `control.maxParallelAgents` — al aprobar la spec, esta línea es la confirmación de paralelizar que pidan las instrucciones del usuario; lo que no nombra se confirma aparte

### Decisiones tomadas con el dev-lead

- Al cancelar se elige un motivo de una lista (cambio de planes, sala ocupada, otro) y el listado de canceladas lo enseña — petición del dev-lead al arrancar la entrevista.
- Sin review de la spec — «Sin review».

## Intent

Hoy se cancela una reserva sin dejar rastro del porqué (`cancelar Norte lun` → `cancelada Norte lun`) y no hay forma de ver qué reservas se cancelaron. Se quiere saber por qué se cancela y poder consultarlo. Éxito: toda reserva cancelada desde ahora tiene un motivo de la lista y `canceladas` lo muestra. Fracaso, aunque funcione: que una cancelación quede sin motivo, o que `canceladas` incluya anuladas.

## Scope

- Entra: `--motivo` obligatorio en `cancelar`, con las tres claves; guardar el motivo en la reserva; comando `canceladas`; ajustar los tests de `cancelar`.
- No entra: texto libre en «otro»; motivos en la anulación (0011); cambiar la salida de `cancelar`; persistencia fuera de memoria; estadísticas de motivos.

## Lo que se retira o cambia de forma

| Qué | Dónde aparece | Destino |
| --- | --- | --- |
| `cancelar <sala> <día>` sin motivo deja de cancelar | `src/app.js` (`cancelBooking`, rama `cancelar` de `run`); `test/cancel.test.js:5-7` | Scope y decisión 4; el test se ajusta (decisión 9) |
| Cancelación documentada: «Cancelación: la reserva que anula el propio cliente antes de 24 h» | `PRODUCT.md:9` | Sin cambio: el término no varía; el motivo no altera su definición |
| «Cancelar una reserva propia» (release v0.3.0) | `.docs/sdd/changelog.md:20`, `roadmap.md:33` | Historia cerrada; no se toca |

- Filas que implementa: 0010 → `roadmap.md:7` (se marca al cerrar con `sdd-archive`) | búsqueda `grep -rniE "cancel|0010"` sin más hits fuera de las tablas de arriba.

## Approach

El motivo viaja con la reserva: al cancelar se guarda junto a su estado, y `canceladas` recorre las reservas en estado cancelada. Las claves de la lista y su texto en castellano viven en un solo sitio de `src/app.js`. El detalle de código queda para el plan.

## Dónde se prueba

- Cancelar con motivo, sin motivo y con motivo inválido: por `run('cancelar', …)`, como `test/cancel.test.js`.
- Listado `canceladas`: por `run('canceladas', [])`, mismo patrón.
- Anuladas fuera del listado: por `run('anular', …)` seguido de `run('canceladas', [])`.

## Términos y ADR

- Términos resueltos: **motivo** — la razón elegida de la lista al cancelar una reserva.
- ADR candidatas: ninguna

## Delta de comportamiento

### Capacidad: `booking-cancellation`

#### ADDED — Cancelar con motivo

- GIVEN reserva activa Norte lun 10:00-12:00
- WHEN `cancelar Norte lun --motivo sala-ocupada`
- THEN responde `cancelada Norte lun` y la reserva queda cancelada con el motivo «sala ocupada»

#### ADDED — El motivo es obligatorio y de la lista

- GIVEN reserva activa Norte lun
- WHEN `cancelar Norte lun` sin motivo
- THEN responde `indica un motivo: cambio-de-planes, sala-ocupada, otro` y la reserva sigue activa
- GIVEN reserva activa Norte lun
- WHEN `cancelar Norte lun --motivo aburrimiento`
- THEN responde `motivo no válido: usa cambio-de-planes, sala-ocupada u otro` y la reserva sigue activa

#### ADDED — Cancelar sin reserva

- GIVEN no hay reserva activa Sur mar
- WHEN `cancelar Sur mar --motivo otro`
- THEN responde `sin reserva Sur mar`

#### ADDED — Listado de canceladas

- GIVEN Norte lun 10:00-12:00 cancelada con `cambio-de-planes` y Sur mar 14:00-16:00 cancelada con `otro`, en ese orden
- WHEN `canceladas`
- THEN responde dos líneas: `Norte lun 10:00-12:00 · cambio de planes` y `Sur mar 14:00-16:00 · otro`
- GIVEN ninguna reserva cancelada
- WHEN `canceladas`
- THEN responde `sin canceladas`
- GIVEN Norte lun anulada con `anular Norte lun`
- WHEN `canceladas`
- THEN no aparece en el listado

## Aprobaciones

| Nombre | Fecha | Estado |
| --- | --- | --- |
| | | pendiente |
