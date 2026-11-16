---
id: 20261015-110000-feature-0032-free-rooms-fast
title: Research — ¿aguanta `libres` 1.000 reservas?
spec: ./spec.md
status: draft
created: 2026-11-12
timeboxed: 2h
---

# Research — ¿aguanta `libres` 1.000 reservas?

## 1. Pregunta a resolver

¿Aguanta `libres` 1.000 reservas?

## 2. Objetivos

| Objetivo | Estado | Detalle | Evidencia |
| --- | --- | --- | --- |
| O1 — `libres` con 1.000 reservas responde en < 0,05 ms | no cumple tal como se definió | 0,0555–0,0726 ms por llamada en las 10 repeticiones (media de 1.000 llamadas cada una); ninguna baja de 0,05 ms | `salida-medir-libres.txt` (script: `medir-libres.mjs`) |

## 3. Aguante

Carga: 1.000 reservas activas en la misma franja (`10:00-12:00`), cargadas con `seed`; más la reserva previa del módulo. Salas de la carga: `Sala-N`, que no coinciden con Norte/Sur, así `some` recorre el array entero (lectura más desfavorable; la spec no fija las salas).

| Repetición | Tiempo (ms/llamada) | Recurso acumulado (heapUsed MB tras gc) |
| --- | --- | --- |
| 1 | 0,0567 | 4,42 |
| 2 | 0,0555 | 4,42 |
| 3 | 0,0661 | 4,42 |
| 4 | 0,0617 | 4,42 |
| 5 | 0,0726 | 4,42 |
| 6 | 0,0634 | 4,43 |
| 7 | 0,0585 | 4,46 |
| 8 | 0,0604 | 4,46 |
| 9 | 0,0632 | 4,46 |
| 10 | 0,0586 | 4,46 |

El heap crece 0,04 MB en 10 repeticiones (10.000 llamadas): casi plano, pero no exactamente.

Diagnóstico aparte (`medir-sort.mjs`, `salida-medir-sort.txt`), copia de `freeRooms` con y sin el `bookings.slice().sort(...)` cuyo resultado se descarta, misma carga, 10 repeticiones: con él 0,0546–0,0751 ms; sin él 0,0069–0,0078 ms.

## 4. Recomendación

- **Elegida**: no abrir `libres` a toda la oficina tal cual, pero tampoco una caché todavía: quitar antes el `slice().sort()` sin efecto y volver a medir O1 · **Por qué**: O1 no cumple (fila O1) y la copia sin el `sort` mide 0,007 ms, bajo el umbral (diagnóstico de `medir-sort.mjs`); esa cifra es de una copia, no de `src/app.js` corregido: sin medir en producción.
- **Descartadas**: caché de `libres` (la medida no la justifica mientras el `sort` sin efecto explique el coste; se reabre si, corregido, O1 sigue sin cumplirse); dar O1 por cumplido (ninguna repetición baja de 0,05 ms).

## 5. Lo que sale

- Quitar `bookings.slice().sort(...)` de `freeRooms` y remedir O1 sobre `src/app.js` → fila del roadmap por abrir (la abre el dev-lead; el spike no toca código de producción).
