---
id: 20260921-090000-task-0009-slot-format
title: Tasks — Validar el formato de la franja horaria
spec: ./spec.md
plan: ./plan.md
created: 2026-09-21
---

# Tasks — Validar el formato de la franja horaria (registro vivo)

- **Spec**: `./spec.md`
- **Plan**: `./plan.md`
- **Rama**: `feature/0009`

## Estado de las tasks

| # | Task | Status | Commit | Notas |
| --- | --- | --- | --- | --- |
| 1 | Validación en `libres` | done | d9a753e | revisión de task limpia |
| 2 | Validación en `reservar` | done | a1fac00 | revisión de task limpia; sin helper `findSlotArg` (ruling: `params[1]` basta, `--cada-semana` sin franja sale por early return) |
| 3 | Ayuda con el formato | done | e4a9872 | revisión encontró bug real: el entrypoint no llamaba `run` sin argumentos (`if (command)` lo impedía), el test unitario no lo detectaba por probar `run` directo; fix ronda 1 + re-revisión acotada, ADDRESSED |

## Verificación por task

- [x] Task 1 — `node --test` en verde (5/5)
- [x] Task 2 — `node --test` en verde (8/8)
- [x] Task 3 — `node --test` en verde (9/9); smoke manual de `node src/app.js` confirmado tras el fix

## Fixes adicionales (trabajo descubierto fuera de scope)

| Descubierto | Causa raíz | Decisión | Commit |
| --- | --- | --- | --- |
| Revisión de Task 1: `cancelar 10:00` (sin día) respondía `cancelada 10:00 undefined` | `run` no comprobaba el número de argumentos de `cancelar` | Ruling: arreglado en la rama con mensaje de uso; test añadido | 9e49ed4 |
| Smoke parcial tras Task 1: `cancelar MAR 10:00` no encontraba la reserva del martes | el día se comparaba sin normalizar mayúsculas | Ruling: arreglado en la rama, el día se pasa a minúsculas; test añadido | 50891b7 |
| Revisión final de rama: `console.log(run(command, args));` se ejecutaba al importar `src/app.js`, contaminando `audit()` y la salida de `node --test` | `src/app.js` hace doble papel de entrypoint y módulo importable, sin guarda de módulo principal | Fix único de la revisión final + re-revisión acotada, ADDRESSED (guarda con `pathToFileURL`) | 0e697c5 |

## Minor aplazados de la revisión final (no bloquean, quedan para la siguiente vez que se toque `src/app.js`)

- Un comando no reconocido (`node src/app.js foo`) ahora cae en el mismo texto de ayuda que la invocación sin comando, en vez de devolver el antiguo `'salas'`. Cambio de comportamiento no pedido por la spec, aunque no la contradice; no se toca en esta rama.
- `invalidSlot` usa `slot ?? ''`, así que un argumento totalmente ausente da `Franja horaria no válida: "".` — mensaje razonable, la spec no cubre explícitamente el caso de argumento ausente.
