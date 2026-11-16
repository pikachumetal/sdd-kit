---
id: 20261009-122439-feature-0012-libres-1000-reservas
feature: 0012
title: Medir si `libres` aguanta 1.000 reservas
mode: full
profile: delegate
status: draft
created: 2026-10-09
author: <git-user>
approvers:
  - role: dev-lead
    name: TBD
    approved_at: null
---

# Spec — Medir si `libres` aguanta 1.000 reservas

🦆 Hoy no sabes si `node src/app.js libres 10:00-12:00` seguirá siendo instantáneo cuando haya mil reservas. Esta tarea no cambia el comando: lo mide. Se genera una lista de reservas de 1 hasta 100.000 y se cronometra cuánto tarda `libres` en cada tamaño. El resultado es una tabla de medidas (`research.md`) con una conclusión: sí o no aguanta 1.000, y hasta dónde llega.

## Capacidades

- Ninguna, porque herramientas: es una medición; el comportamiento de `libres` no cambia.

## ✋ Decisiones que he tomado yo — valida estas

Review de spec propuesta: ninguna — señales: 0 de 8 · tamaño: ~40 líneas en 2 ficheros nuevos y 0 existentes
- Mínimo razonable: ninguna review; deja sin cubrir solo que la sonda mida otra cosa que `libres` (lo cubre el test de humo de la Task 1).

1. **«Aguanta» significa mediana y p95 de una llamada por debajo de 100 ms** a 1.000 reservas — nadie fijó el umbral; 100 ms es el límite a partir del cual un comando de terminal deja de sentirse instantáneo. Si prefieres otro, dilo y se cambia antes de medir.
2. **Tamaños medidos: 1, 10, 100, 1.000, 10.000 y 100.000 reservas** — 1.000 es tu pregunta; los demás sitúan el punto donde dejaría de aguantar.
3. **Dos casos por tamaño**: franja que no coincide con ninguna reserva (recorre todas) y franja que coincide con todas en una sala (peor caso de filtrado) — `libres` recorre la lista por sala, y estos dos extremos acotan el tiempo.
4. **Salas: las 2 actuales (`Norte`, `Sur`)** — no se simulan más salas; la pregunta es sobre reservas.
5. **Método: 1.000 llamadas por celda tras 100 de calentamiento, se publican mediana y p95 en ms** — la función dura microsegundos y una sola llamada solo mediría ruido.
6. **No se toca `src/app.js`**: `bookings` y `freeRooms` no se exportan, así que la sonda extrae `freeRooms` del texto de `src/app.js` y la ejecuta contra una lista generada. Alternativa descartada: exportar `bookings` (cambia el código de producto para medir).
7. **La sonda se queda en el repositorio** como `scripts/bench-libres.mjs`, con un test de humo (`test/bench-libres.test.js`) que comprueba que con 1 reserva da lo mismo que `run('libres', …)` — así la tabla se puede repetir y se sabe que mide la función real.
8. **La tabla vive en `research.md`** de esta carpeta, con la pregunta, las medidas, la máquina y la versión de Node usadas, y la recomendación.
9. **Fuera de la medida, y dicho en la conclusión**: las reservas viven en memoria y el CLI arranca con una sola, así que hoy desde la terminal no se pueden acumular 1.000 en un proceso; la tabla mide la función, no el arranque de Node.

## Intent

`libres` filtra la lista de reservas una vez por sala. Con la lista actual (una reserva) es instantáneo, pero nadie ha medido qué pasa al crecer. Se quiere una respuesta con datos —no una opinión— sobre si 1.000 reservas son un problema y, si no lo son, a partir de cuántas empezaría a serlo.

## Scope

- Entra: sonda `scripts/bench-libres.mjs`; test de humo; `research.md` con la tabla de medidas y la conclusión.
- No entra: cambiar `libres`, optimizarlo, persistir reservas, medir otros comandos, medir el arranque del proceso.

## Approach

Se genera una lista de N reservas activas, se extrae `freeRooms` de `src/app.js` y se cronometra por celda (tamaño × caso) con el método de la decisión 5. La conclusión compara la mediana y el p95 de 1.000 reservas con el umbral de la decisión 1. Si no aguanta, la recomendación lo dice y propone abrir una feature aparte; esta tarea no optimiza.

## Dónde se prueba

- La sonda mide la función real: test de humo en `test/bench-libres.test.js`, mismo patrón que `test/app.test.js` (`node --test`, comparando contra `run('libres', …)`).
- La tabla: se valida leyendo `research.md`; no es comportamiento de producto.

## Términos y ADR

- Términos resueltos: aguanta — mediana y p95 por debajo del umbral de la decisión 1.
- ADR candidatas: ninguna

## Delta de comportamiento

Sin delta: ninguna capacidad cambia.

## Enmiendas

- Ninguna.

## Aprobaciones

| Rol | Nombre | Fecha | Estado |
| --- | --- | --- | --- |
| dev-lead | | | pendiente |
