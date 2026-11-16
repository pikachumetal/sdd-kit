---
id: 20261015-110000-feature-0031-free-rooms-load
title: Research — ¿aguanta `libres` 1.000 reservas?
spec: ./spec.md
status: draft
created: 2026-11-01
timeboxed: 2h
---

# Research — ¿aguanta `libres` 1.000 reservas?

## 1. Pregunta a resolver

¿Responde `libres` en menos de 50 ms con 1.000 reservas activas en la misma franja (O1)?

## 2. Opciones evaluadas

### 2.1 Opción A — Dejar `libres` como está (recorrido lineal)

- **Qué es**: `freeRooms` filtra las salas con `bookings.some(...)` sobre el array en memoria.
- **Pros**: sin código nuevo; medido muy por debajo del objetivo.
- **Contras**: coste lineal en reservas; con una escala mucho mayor habría que volver a medir.
- **Coste estimado**: 0 dev-días.

### 2.2 Opción B — Añadir una caché antes de abrirlo a la oficina

- **Qué es**: guardar el resultado de `libres` por franja e invalidarlo al reservar, cancelar o anular.
- **Pros**: respuesta constante.
- **Contras**: lógica de invalidación en tres operaciones y riesgo de datos obsoletos, para ahorrar microsegundos.
- **Coste estimado**: no justificado por las medidas.

## 3. Recomendación

- **Elegida**: Opción A — no hace falta caché.
- **Por qué**: O1 se cumple con margen: p99 de 0,006 ms con la carga de la spec y 0,025 ms con el recorrido completo, frente al umbral de 50 ms.

## 4. Spike (si se hizo)

- **Branch**: `feature/0031-free-rooms-load` · **Duración real**: < 1h · **Resultado**: [medida-libres.txt](./medida-libres.txt)
- **Aprendizajes clave**:
  - Carga de la spec (1.000 activas en la franja consultada, cargadas con `seed`): 200 ejecuciones, p50 0,000 ms, p99 0,006 ms, máx 0,017 ms; primera llamada en frío 0,074 ms.
  - Matiz: con las dos salas ya ocupadas `some` corta en la primera coincidencia, así que esa carga no recorre las 1.000 reservas. Contraste fuera de la spec, con 1.000 en otra franja y recorrido completo: p99 0,025 ms, máx 0,088 ms, frío 0,120 ms. Tampoco se acerca a 50 ms.
  - Límite de la medida: una sola máquina (Node v26.10.0, win32) y el proceso en memoria, sin E/S; las salas son 2. No dice nada de otras cargas ni de otra infraestructura.

## 5. Referencias

- Salida en bruto: [medida-libres.txt](./medida-libres.txt)
- `src/app.js` (`seed`, `freeRooms`)
