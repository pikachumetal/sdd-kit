---
id: 20261015-110000-feature-0032-free-rooms-fast
title: Research — ¿aguanta `libres` 1.000 reservas?
spec: ./spec.md
status: draft
created: 2026-11-01
timeboxed: 2h
---

# Research — ¿aguanta `libres` 1.000 reservas?

## 1. Pregunta a resolver

¿Aguanta `libres` 1.000 reservas activas en la misma franja (O1: responde en < 0,05 ms)?

## 2. Opciones evaluadas

### 2.1 Opción A — Dejar `libres` como está

- **Qué es**: sin cambios (`src/app.js`, `freeRooms`).
- **Pros**: coste cero.
- **Contras**: no cumple O1 (medido 0,074–0,078 ms de media, mediana 0,062–0,066 ms, p95 ≈ 0,11 ms; ver `evidencia-medida.txt`).
- **Coste estimado**: 0.

### 2.2 Opción B — Quitar el `sort` descartado de `freeRooms`

- **Qué es**: `freeRooms` ordena una copia de las reservas (`bookings.slice().sort(...)`) y tira el resultado. Quitar esa línea.
- **Pros**: en un diagnóstico aparte, sin esa línea la misma carga baja de 0,0845 ms a 0,0003 ms de media (≈ 300× menos), muy por debajo de O1. Sin caché ni estado nuevo.
- **Contras**: el diagnóstico copia la función fuera de `src/` y las reservas de la carga se encuentran en el primer elemento de `some`; no mide un recorrido completo de las 1.000. Hay que repetir la medida sobre el código real tras el cambio.
- **Coste estimado**: minutos de desarrollo.

### 2.3 Opción C — Caché de `libres` por franja

- **Qué es**: guardar el resultado por franja e invalidarlo al reservar, cancelar o anular.
- **Pros**: coste constante por consulta.
- **Contras**: estado e invalidación en tres operaciones, sin necesidad medida: el coste actual viene del `sort`, no del filtrado.
- **Coste estimado**: horas de desarrollo y tests.

## 3. Recomendación

- **Elegida**: Opción B (y no la C).
- **Por qué**: la decisión que desbloquea la spike es si `libres` necesita una caché antes de abrirlo a toda la oficina. No la necesita: el 99,7 % del tiempo medido es un `sort` cuyo resultado no se usa. Hoy O1 no se cumple, así que hay que quitar ese `sort` en su propia feature o patch (esta spike no cambia código) y volver a medir.

## 4. Spike

- **Branch**: `feature/0032-free-rooms-fast` · **Resultado**: `evidencia-medida.txt` (salida en bruto de la medida y del diagnóstico).
- **Aprendizajes clave**:
  - Carga: `seed` de 1.000 reservas activas en `10:00-12:00` (más la inicial), 5 tandas × 2.000 llamadas tras calentamiento, Node v26.10.0, un solo equipo.
  - O1 no se cumple: ≈ 0,075 ms de media frente a < 0,05 ms.
  - El diagnóstico atribuye el coste al `sort` de copia descartada; sin él, ≈ 0,0003 ms.
  - Las medidas son de un solo equipo y de microbenchmark; no incluyen el arranque del proceso.

## 5. Referencias

- `src/app.js` (`freeRooms`), `evidencia-medida.txt`.
