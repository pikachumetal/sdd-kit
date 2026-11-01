---
id: 20261015-120000-feature-0032-free-rooms-fast
title: Research — ¿aguanta `libres` 1.000 reservas?
spec: ./spec.md
status: draft
created: 2026-11-01
timeboxed: 2h
---

# Research — ¿aguanta `libres` 1.000 reservas?

## 1. Pregunta a resolver

¿Aguanta `libres` 1.000 reservas activas en la misma franja, cargadas con `seed`, respondiendo en < 0,05 ms (O1)?

## 2. Opciones evaluadas

Medida en bruto: [medida-bruta.txt](./medida-bruta.txt) (Node v26.10.0, 5 tandas × 20.000 llamadas tras calentamiento, `run('libres', [franja])`).

| Carga (1.000 reservas activas, misma franja) | Mediana ms/llamada | O1 (< 0,05 ms) |
| --- | --- | --- |
| Todas de `Norte` | 0,0181 | cumple |
| Todas de `Sur` | 0,0168 | cumple |
| Mezcla `Norte`/`Sur` alternas | 0,0837 (tandas 0,072–0,088) | **no cumple** |

La mezcla es la peor y falla O1 por ~1,7×. La causa es el `bookings.slice().sort(...)` de `freeRooms` (`src/app.js`): ordena una copia cuyo resultado se descarta, y su coste crece con el desorden de las reservas. Quitándolo en una copia (sin tocar `src/`), la misma mezcla baja a menos de 0,0001 ms (mediana 0,0000; tandas 0,0003 a 0,0000, con el calentamiento aún asentándose).

### 2.1 Opción A — Caché de `libres`

- **Qué es**: guardar el resultado por franja e invalidarlo en cada alta, cancelación o anulación.
- **Pros**: respuesta constante.
- **Contras**: invalidación en tres sitios (`seed`, `cancelBooking`, `voidBooking`); más estado para arreglar un coste que no es del cálculo.
- **Coste estimado**: no estimado; el spike no lo necesita.

### 2.2 Opción B — Quitar el `sort` descartado

- **Qué es**: borrar la línea que ordena una copia y tira el resultado.
- **Pros**: sin estado nuevo; el cálculo restante (`some` sobre 1.000) queda muy por debajo de O1.
- **Contras**: es un cambio de código; este spike no lo hace (la spec solo mide).
- **Coste estimado**: una línea y su test.

## 3. Recomendación

- **Elegida**: Opción B; no hace falta caché antes de abrir `libres` a la oficina.
- **Por qué**: con 1.000 reservas O1 solo falla por el `sort` inútil, no por el cálculo. Con esa línea fuera, la peor mezcla medida queda por debajo de 0,0001 ms, mucho más bajo que 0,05 ms. Esa última cifra es de una copia fuera de `src/`, por lo que conviene reconfirmarla sobre el código real al hacer el cambio (feature aparte).

## 4. Spike (si se hizo)

- **Branch**: `feature/0032-free-rooms-fast` · **Duración real**: no cronometrada · **Resultado**: [medida-bruta.txt](./medida-bruta.txt)
- **Aprendizajes clave**:
  - O1 no se cumple tal cual: 0,084 ms con reservas mezcladas, 0,017–0,018 ms con una sola sala.
  - El tiempo depende del orden de las reservas por el `sort` descartado, no del número de coincidencias.
  - Solo se midió una franja con 1.000 reservas y dos salas; con más salas no se ha probado.
  - Las líneas `salas` del bruto vienen de pasar la variante como argumento a `app.js`; no afectan a la medida.

## 5. Referencias

- `src/app.js` (`freeRooms`, `seed`), `spec.md` (O1).
