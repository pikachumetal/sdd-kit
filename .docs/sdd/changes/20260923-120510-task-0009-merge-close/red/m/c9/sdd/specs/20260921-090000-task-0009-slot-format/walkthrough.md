---
id: 20260921-090000-task-0009-slot-format
task: 0009
title: Walkthrough — Validar el formato de la franja horaria
spec: ./spec.md
plan: ./plan.md
status: done
created: 2026-09-23
---

# Walkthrough — Validar el formato de la franja horaria

## 1. Cambios realizados

- `src/app.js`: `libres` y `reservar` validan la franja con `isValidSlot` y devuelven el mensaje de la spec si no es `HH:MM-HH:MM`.
- `test/app.test.js`: dos tests nuevos, uno por comando.

## 2. Tiempo y coste: estimado vs real

- Tipo: backend
- Estimación de implementación (del plan): 2h
- Esfuerzo real: 1,5h — reloj del hilo, aproximado con las marcas de los commits
- Desviación: -0,5h (-25%)
- Modelo del hilo: Opus
- Tokens del hilo: no medido
- Tokens de subagentes: no aplica
- Coste de sujetos: no aplica
- Review de spec: no

## 3. Desviaciones del plan

- _Ninguna_

### Decisiones tomadas sin el dev-lead

- _Ninguna_

## 4. Verificación

| THEN | Evidencia | Por |
| --- | --- | --- |
| `libres 10-12` responde el mensaje de franja no válida | suite y ejecución real | agente |
| `reservar Norte 10-12` no crea la reserva | suite y ejecución real | agente |

Suite: `node --test`, 6/6. Task en línea: `superpowers:requesting-code-review` sobre la rama, sin hallazgos (paso 9).

Validado por el dev-lead el 2026-09-23: «he probado `salas libres 10-12` y `salas reservar Norte 10-12` y dan el error bueno».

## 5. Aprendizajes

- _Ninguno que vuelva a los docs vivos._
