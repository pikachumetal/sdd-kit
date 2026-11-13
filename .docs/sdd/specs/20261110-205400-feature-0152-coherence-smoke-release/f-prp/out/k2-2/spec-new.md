---
id: 20261112-121646-feature-0012-libres-1000-reservas
feature: 0012
title: ¿Aguanta el comando libres con 1.000 reservas?
mode: spike
status: draft
created: 2026-11-12
author: Fixture
approvers:
  - name: TBD
    approved_at: null
---

# Spec — ¿Aguanta `libres` con 1.000 reservas?

🦆 Hoy `salas libres 10:00-12:00` responde al instante porque hay una sola reserva. Esta investigación mide cuánto tarda con 100, 1.000 y 10.000 reservas activas, por ejemplo con 1.000 reservas en Norte y Sur, y te deja una tabla con la mediana, el p95 y el máximo de cada carga. No se toca el código de la herramienta: se mide una copia con las reservas inyectadas. Con la tabla decides si `libres` se queda como está o si hace falta una fila para optimizarlo.

Validación: agente — es una medición de rendimiento; un humano no observaría nada que el agente no haya medido ya.

## Capacidades

- Ninguna, porque investigación.

## ✋ Decisiones que he tomado yo — valida estas

Sin review de spec: una spike no tiene delta ni Scope que revisar (`review-spec.md`).

1. Qué es «1.000 reservas»: 1.000 reservas con estado `active`, repartidas a partes iguales entre Norte y Sur — nadie dio la carga; la tomo del enunciado.
2. Peor caso medido: la franja buscada no coincide con ninguna reserva, así que `some` recorre las 1.000 en cada sala — es el recorrido completo.
3. Cargas de la tabla: 1, 100, 1.000 y 10.000 reservas — 1 es la línea base (el estado de hoy) y 10.000 es un control para ver cómo crece la medida; el enunciado solo pide 1.000.
4. Umbral O1: p95 de una llamada en proceso ≤ 1 ms con 1.000 reservas — lo propongo yo; nadie fijó un umbral.
5. Umbral O2: `salas libres` de extremo a extremo (proceso incluido) con 1.000 reservas, mediana ≤ 200 ms y ≤ 20 ms por encima de la línea base — lo propongo yo.
6. Método: copia de `src/app.js` en una carpeta temporal fuera del repo, con el array `bookings` sustituido por la carga; el CLI no puede cargar reservas porque viven en memoria y fijas en el código, y así no se toca producción — frente a exportar `bookings` desde `app.js` (cambiaría producción) o medir solo la función con un duplicado escrito a mano (no mediría el código real).
7. Repeticiones: 50 llamadas en proceso tras 10 de calentamiento, y 30 ejecuciones del CLI por carga; se anotan Node, SO y máquina en la tabla — repeticiones elegidas por mí.
8. El script de medida y la tabla se guardan en la carpeta de esta spike (`evidencia/`) — para que se pueda repetir.
- Política de modelos: sin revisores de spec · ejes de la revisión final: Spec opus+high, Código sonnet+high, Arquitectura según el plan · sin otros despachos en paralelo · en paralelo hasta `control.maxParallelAgents` — al aprobar la spec, esta línea es la confirmación de paralelizar que pidan las instrucciones del usuario.

### Decisiones tomadas con el dev-lead

- Medir `libres` con 1.000 reservas y entregar una tabla de medidas — «¿Aguanta el comando libres con 1.000 reservas? Quiero la tabla de medidas.»

## Forma spike

- **Pregunta**: ¿responde `libres` en un tiempo aceptable con 1.000 reservas activas?
- **Objetivos**:
  - O1 — latencia de `libres` en proceso con 1.000 reservas activas, peor caso: p95 ≤ 1 ms.
  - O2 — `salas libres <franja>` de extremo a extremo con 1.000 reservas: mediana ≤ 200 ms y ≤ 20 ms más que la línea base de 1 reserva.
- **Decisión que desbloquea**: si `libres` se queda como está con ese volumen o si se abre una fila de roadmap para optimizarlo.
- **Peor carga**: 1.000 reservas activas, franja sin coincidencias — `sin confirmar`, va a ✋ (decisiones 1 y 2).

## Lo que se retira o cambia de forma

| Qué | Dónde aparece | Destino |
| --- | --- | --- |
| Nada: la spike no retira ni cambia nada | — | — |

- Filas que implementa: nada: comprobado con `git grep -nE "libres|0012" -- . ':!.docs/sdd/specs'` — `libres` solo está en `src/app.js:28`, su test y el CHANGELOG, y `0012` no está en el roadmap (id reservado con `sdd id claim`).

## Enmiendas

## Aprobaciones

| Nombre | Fecha | Estado |
| --- | --- | --- |
| | | pendiente |
