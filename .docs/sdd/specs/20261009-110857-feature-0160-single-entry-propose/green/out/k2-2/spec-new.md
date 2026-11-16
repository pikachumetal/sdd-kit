---
id: 20261009-122909-feature-0012-libres-1000-reservas
feature: 0012
title: ¿Aguanta `libres` con 1.000 reservas?
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

# Spec — ¿Aguanta `libres` con 1.000 reservas?

🦆 Hoy no sabes si `libres 10:00-12:00` sigue contestando rápido cuando hay 1.000 reservas en memoria. Esta investigación lo mide: llena la lista con 1.000 reservas (y con otros tamaños para ver el margen), ejecuta `libres` muchas veces y te deja una tabla con los tiempos y el veredicto «aguanta» o «no aguanta» frente a un umbral que apruebas tú ahora. No cambia nada de lo que ve quien usa la herramienta: el entregable es la tabla.

> **Estado**: draft. **Siguiente paso**: `plan.md` con `superpowers:writing-plans`.

## Capacidades

- Ninguna, porque herramientas: es una medición, no cambia comportamiento observable.

## ✋ Decisiones que he tomado yo — valida estas

Review de la spec: sin review. Señales: 0 (sin capacidades, sin datos, sin UI, 1 fichero de medición). Una sola lente bastaría y no aporta: hago yo la pasada de coherencia.

1. **Umbral de «aguanta»**: la mediana de `node src/app.js libres 10:00-12:00` de punta a punta con 1.000 reservas es ≤ 200 ms. Nadie fijó el número; 200 ms es lo que una herramienta de línea de comandos puede tardar sin que se note.
2. **Tamaños medidos**: 1 (la reserva que ya hay), 100, 1.000, 10.000 y 100.000 reservas. 1.000 es tu pregunta; los demás dan margen y dicen dónde dejaría de aguantar.
3. **Dos formas de reserva**: todas activas en la misma franja que se consulta (peor caso: ninguna sala sale libre) y todas en franjas distintas a la consultada. Mezclo ambas porque el coste depende de cuántas coinciden.
4. **Cómo se mide**: (a) dentro del proceso, 1.000 llamadas a `run('libres', …)` por tamaño, con mediana y p95; (b) de punta a punta, 30 ejecuciones del comando por tamaño. El tiempo de arranque de Node va solo en (b).
5. **Cómo entran las 1.000 reservas**: `reservar` no guarda nada y la lista no se exporta, así que la sonda lee `src/app.js`, cambia la lista inicial por una generada y ejecuta esa copia temporal. El código medido es el real; no toco `src/`.
6. **Dónde queda el resultado**: la tabla y el veredicto en `mediciones.md` de esta carpeta, con la máquina y la versión de Node. El script de medición se queda en la carpeta como desechable, no en `src/` ni en `test/`.
7. **Sin arreglo**: si no aguanta, la spec termina con la tabla y una recomendación; arreglarlo es otra propuesta.

## Intent

`libres` recorre la lista de reservas entera cada vez que se llama. Con la reserva de ejemplo es instantáneo, pero no hay una medida con volumen. Se quiere saber, con datos, si 1.000 reservas son un problema y con cuántas lo sería.

## Scope

- Entra: sonda de medición, tabla de tiempos por tamaño y forma de reserva, veredicto frente al umbral, recomendación.
- No entra: cambiar `libres`, añadir índices o caché, medir `reservar`, `cancelar` o `anular`, medir memoria.

## Approach

Una sonda en la carpeta de la feature genera una copia temporal de `src/app.js` con N reservas y mide el tiempo de `libres` en proceso y de punta a punta. Los resultados van a `mediciones.md`.

## Dónde se prueba

- Que la sonda mide lo que dice: con un test de `node --test` en la carpeta de la feature sobre un tamaño pequeño (la copia con 3 reservas devuelve las mismas salas que `libres` real), como los tests actuales.
- La tabla: se valida leyéndola; no hay pantalla.

## Términos y ADR

- Términos resueltos: ninguno
- ADR candidatas: ninguna

## Delta de comportamiento

Sin delta: no cambia el comportamiento observable.

## Enmiendas

_Ninguna._

## Aprobaciones

| Rol | Nombre | Fecha | Estado |
| --- | --- | --- | --- |
| dev-lead | | | pendiente |
