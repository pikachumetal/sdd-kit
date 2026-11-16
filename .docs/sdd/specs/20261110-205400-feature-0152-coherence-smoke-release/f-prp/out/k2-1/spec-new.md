---
id: 20261112-120557-feature-0012-libres-1000-reservas
feature: 0012
title: ¿Aguanta `libres` con 1.000 reservas?
mode: spike
status: draft
created: 2026-11-12
author: Fixture
approvers:
  - name: TBD
    approved_at: null
---

# Spec — ¿Aguanta `libres` con 1.000 reservas?

🦆 Hoy `node src/app.js libres 10:00-12:00` responde al instante porque solo hay una reserva. Quieres saber si sigue respondiendo bien cuando haya 1.000, por ejemplo 1.000 reservas de la sala Norte en otras franjas. Voy a medirlo sin tocar el código de la herramienta y a dejarte una tabla con cuánto tarda con 1, 10, 100, 1.000 y 10.000 reservas, comparada con un umbral que he puesto yo y que tienes que validar. Por dentro, `libres` recorre todas las reservas una vez por sala: el coste debería crecer en línea recta, y la tabla lo confirmará o lo desmentirá.

Validación: agente — son mediciones de tiempo; un humano no observaría nada que el agente no haya medido ya.

## Capacidades

- Ninguna, porque investigación

## ✋ Decisiones que he tomado yo — valida estas

> Nivel de revisión de la spec: ninguna. El spike no lleva review (solo full y lite); lo que no cubre es la propia validación del dev-lead en este gate.

1. **Umbral de «aguanta»**: O1 pasa si, con 1.000 reservas, el p95 de `run('libres', …)` en proceso es ≤ 5 ms; O2 pasa si el p95 de `node src/app.js libres <franja>` completo es ≤ 200 ms. Nadie dio un umbral: lo fijo yo por ser una CLI interactiva de uso personal, y el arranque de Node (decenas de ms) ya es la mayor parte de O2.
2. **Cargas medidas**: 1, 10, 100, 1.000 y 10.000 reservas. El 10.000 no se pidió: va para ver el margen que queda sobre las 1.000.
3. **Escenarios por carga**: (a) ninguna coincide con la franja consultada (obliga a recorrer todo: peor caso), (b) coincidencia en la primera reserva, (c) coincidencia en la última. Los datos son sintéticos: todas las reservas `active`, en Norte y Sur, con días y franjas variados.
4. **Método**: 20 iteraciones de calentamiento y 500 medidas para O1, 30 ejecuciones para O2; se reporta p50, p95 y máximo en ms con `performance.now()` y `process.hrtime` sobre Node 22, en esta máquina. Nadie fijó el método.
5. **Cómo se inyectan las reservas sin tocar producción**: `bookings` no se exporta y `reservar` no crea reservas de verdad (solo devuelve un texto). El arnés genera una copia temporal de `src/app.js` con la línea `const bookings = [...]` sustituida por la carga sintética, y mide esa copia. Va en `bench/` dentro de la carpeta del cambio, no en `scripts/` ni en `src/`.
6. **Dónde queda la evidencia**: la tabla va en `evidencia.md` de esta carpeta, con el comando exacto que la regenera. No hay `walkthrough` de código porque no hay código de producción.
7. **Qué pasa si no aguanta**: no se optimiza aquí. Se apunta una fila nueva en el roadmap con la medida y la propuesta. Un spike no lleva código de producción.
- Política de modelos: sin revisores de la spec · ejes de la revisión final: Spec opus+high, Código sonnet+high, Arquitectura según el plan · otros despachos en paralelo: ninguno · en paralelo hasta `control.maxParallelAgents` — al aprobar la spec, esta línea es la confirmación de paralelizar que pidan las instrucciones del usuario; lo que no nombra se confirma aparte

### Decisiones tomadas con el dev-lead

- La pregunta y la carga de 1.000 reservas son tuyas — «¿Aguanta el comando libres con 1.000 reservas? Quiero la tabla de medidas.»

## Forma spike

- **Pregunta**: ¿Aguanta el comando `libres` con 1.000 reservas?
- **Objetivos**:
  - O1 — Latencia de `run('libres', franja)` en proceso con 1.000 reservas: p95 ≤ 5 ms en los tres escenarios.
  - O2 — Latencia de `node src/app.js libres <franja>` completo con 1.000 reservas: p95 ≤ 200 ms.
  - O3 — Forma del crecimiento: la tabla de 1 a 10.000 dice si el tiempo crece en línea recta con el número de reservas.
- **Decisión que desbloquea**: si hace falta indexar las reservas antes de cargar más datos, o si se puede dejar como está.
- **Peor carga**: 1.000 reservas activas, ninguna en la franja consultada (recorrido completo en las dos salas) — confirmada: «1.000 reservas» (la cifra es del dev-lead; que sea el escenario sin coincidencia va a ✋ 3).

## Lo que se retira o cambia de forma

| Qué | Dónde aparece | Destino |
| --- | --- | --- |
| Nada: el spike no retira ni cambia la forma de nada | — | — |

- Filas que implementa: nada: comprobado con `git grep -n "0012" -- . ':!.docs/sdd/changes'` (sin resultados fuera de esta carpeta).

## Aprobaciones

| Nombre | Fecha | Estado |
| --- | --- | --- |
| | | pendiente |
