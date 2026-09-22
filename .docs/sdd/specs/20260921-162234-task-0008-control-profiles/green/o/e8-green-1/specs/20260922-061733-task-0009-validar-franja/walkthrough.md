---
id: 20260922-061733-task-0009-validar-franja
task: 0009
title: Walkthrough — Validar formato de franja horaria en libres y reservar
spec: ./spec.md
status: done
created: 2026-09-22
---

# Walkthrough — Validar formato de franja horaria en libres y reservar

## 1. Cambios realizados

- `src/app.js`: regex `SLOT_FORMAT` (`HH:MM-HH:MM`, horas 00-23, minutos 00-59) y helper `invalidSlotMessage`; `libres` valida `params[0]`, `reservar` valida `params[1]` antes de ejecutar cualquier lógica. `reservar` pasa a tener firma `reservar <sala> <franja> [--cada-semana]`.
- `test/app.test.js`: 3 tests nuevos (franja mal formada en `libres`, horas fuera de rango, franja mal formada en `reservar`); actualizado el test de `reservar --cada-semana` para incluir la franja.
- Commit: `133ebec` (rama `feature/0009`).

## 3. Desviaciones del plan

- _No aplica (modo lite, sin plan.md)._

### Decisiones tomadas sin el dev-lead

- `reservar` no tenía hasta ahora un argumento de franja (solo sala y flag); le añadí `params[1]` como franja para poder validarla, y actualicé el test existente que no la incluía — coste si está mal: bajo, es el único consumidor del comando y la spec lo registra como decisión 3.
- La revisión de código (commit `133ebec`) señaló una asimetría menor: `libres` tenía test de rango horario inválido y `reservar` no. Añadí el test simétrico (commit `bdda70e`) — coste si está mal: ninguno, solo añade cobertura, no cambia comportamiento.

## 4. Verificación

### 4.1 Builds

- No aplica (sin paso de build; Node ejecuta `src/app.js` directamente).

### 4.2 Smoke / tests

- Validación diferida: 2026-09-22 · perfil `unattended`, sin dev-lead presente · disparador: smoke de la release 0.4.0.

| # | Caso | Resultado |
| --- | --- | --- |
| 1 | `node --test` (suite completa) | ✔ 6/6 pass |
| 2 | `libres` con franja bien formada (`10:00-12:00`) | ✔ sigue devolviendo salas libres (regresión) |
| 3 | `libres` con franja mal formada (`10-12`) | ✔ mensaje de error, sin consultar |
| 4 | `libres` con horas fuera de rango (`25:00-26:00`) | ✔ mensaje de error |
| 5 | `reservar` con franja mal formada | ✔ mensaje de error, no reserva |
| 6 | `reservar --cada-semana` con franja válida | ✔ sigue creando la reserva semanal (regresión) |
| 7 | `reservar` con horas fuera de rango | ✔ mensaje de error, no reserva |

- Code-review (agente, `feature-dev:code-reviewer`) sobre `ea1dcc1..133ebec`: 0 Critical, 0 Important, 1 Minor (asimetría de cobertura, corregida en `bdda70e`). Veredicto: listo para cerrar.

### 4.3 Residuales / deuda generada

- Ninguna nueva. La deuda ya existente en el roadmap ("Sin validación del formato de franja horaria") queda resuelta por esta task.

## 5. Aprendizajes

- `reservar` no tenía franja como argumento explícito antes de esta task — queda documentado en `capabilities/bookings.md` (capacidad nueva, creada por esta task) para que futuras tasks no lo reintroduzcan sin franja.

## 6. Adendas

- _Ninguna._
