---
id: 20261101-190011-feature-0012-libres-1000-reservas
feature: 0012
title: ¿Aguanta `libres` con 1.000 reservas?
mode: spike
profile: delegate
status: draft
created: 2026-11-01
author: Fixture
approvers:
  - name: TBD
    approved_at: null
---

# Spec — ¿Aguanta `libres` con 1.000 reservas?

🦆 Hoy `libres 10:00-12:00` contesta al instante porque solo hay una reserva; no sabemos qué pasa con 1.000. Voy a medir cuánto tarda `libres` con 1.000 reservas, en la peor situación que se me ocurre (ninguna coincide con la franja pedida, así que hay que mirarlas todas), y te dejo una tabla con las medidas. «Aguanta» significa que la llamada tarda 10 ms o menos, tanto la mediana como el p95. No cambio nada del programa: solo mido y dejo la conclusión.

Validación: agente — es una medición de rendimiento: ninguna persona observaría nada que la tabla de medidas no recoja ya.

## Capacidades

- Ninguna, porque investigación.

## ✋ Decisiones que he tomado yo — valida estas

Spike: sin review de la spec (la review es del modo full); hice el repaso de coherencia yo (1.000, 10 ms, mediana y p95 coinciden en toda la spec; sin delta, así que no hay `capability merge` que probar).

1. **Peor carga: 1.000 reservas activas repartidas entre `Norte` y `Sur`, todas en franjas distintas de la consultada.** `freeRooms` usa `.some`, que se detiene en la primera coincidencia; si ninguna coincide recorre todas las reservas para cada sala (~2.000 comparaciones). Va `sin confirmar` por el dev-lead.
2. **Además de la peor carga, la tabla mide tres cargas más** para leer la forma del coste: 1 reserva (la de hoy), 100 y 1.000 coincidentes con la franja (corta pronto), y 1.000 mezcladas con canceladas y anuladas. Solo la peor carga se compara con el umbral.
3. **Cómo se mide**: `bookings` no se exporta de `src/app.js`, y una spike no toca producción. El arnés carga una copia temporal de `src/app.js` con la reserva inicial sustituida por las 1.000 y mide la función `run('libres', …)` real, no una reescritura. Si la línea de la reserva inicial cambia y no puede sustituirla, el arnés falla en vez de medir otra cosa. Queda fuera del gate (`node --test`) y de `src/`.
4. **Método de medida**: llamadas dentro del proceso, tras un calentamiento, con 1.000 repeticiones por carga; se informa mediana, p95 y máximo en ms. No incluye el arranque de Node (~40 ms) ni la salida por consola: son los mismos con una reserva que con 1.000.
5. **Entorno**: se mide en esta máquina (Windows 11, Node de aquí) y la tabla lo dice; no en tu servidor.
6. **Validación `agente`** (ver arriba): propuesta mía; si prefieres validarla tú, cámbiala en el gate.
7. **Una sola task prevista** (escribir el arnés, medir, redactar la tabla y la conclusión), por eso no propongo partir ni bajar de modelo.

### Decisiones tomadas con el dev-lead

- Umbral de «aguanta»: hasta 10 ms por llamada a `libres` en el peor caso medido, mediana y p95 — «Apruebo» (a la opción 1️⃣ de la pregunta del umbral).

## Forma spike

- **Pregunta**: ¿responde `libres <franja>` en 10 ms o menos con 1.000 reservas?
- **Objetivos**: O1 — la mediana y el p95 de `run('libres', ['10:00-12:00'])` con 1.000 reservas activas, en la peor carga, son ≤ 10 ms.
- **Decisión que desbloquea**: si hace falta indexar las reservas (por franja) antes de que `libres` crezca, o si la implementación actual basta.
- **Peor carga**: 1.000 reservas activas entre `Norte` y `Sur`, ninguna en la franja consultada — `sin confirmar`, y va a ✋ (decisión 1).

## Lo que se retira o cambia de forma

| Qué | Dónde aparece | Destino |
| --- | --- | --- |
| Nada: la spike no retira ni cambia nada de producción | — | — |

- Filas que implementa: 0012 (la reservada para esta spike; no está en `roadmap.md`) → ningún fichero la nombra todavía; el cierre la añade al roadmap · nada más: comprobado con `grep -rn "0012" .docs src test`.

## Términos y ADR

- Términos resueltos: ninguno
- ADR candidatas: ninguna

## Aprobaciones

| Nombre | Fecha | Estado |
| --- | --- | --- |
| | | pendiente |
