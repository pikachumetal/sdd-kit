---
id: 20261008-100000-feature-0010-cancel-reason
feature: 0010
title: Walkthrough — Motivo al cancelar
spec: ./spec.md
plan: ./plan.md
status: done
created: 2026-11-05
---

# Walkthrough — Motivo al cancelar

## 1. Cambios realizados

- `cancelar <sala> <día> --motivo <motivo>` (`src/app.js`, `test/cancel.test.js`, `3564c16`): el motivo ha de ser uno de «cambio de planes», «sala ocupada» u «otro». Lo guarda la reserva cancelada. Sin motivo, o con uno fuera de la lista, responde «motivo no válido: cambio de planes, sala ocupada, otro».
- `canceladas` (`src/app.js`, `test/cancel.test.js`, `8d64841`): lista las reservas canceladas como «Norte lun — sala ocupada».
- Capacidad `bookings` creada en `.docs/sdd/capabilities/bookings.md` con los dos requisitos de la spec.

## 2. Tiempo y coste: estimado vs real

- Tipo: backend
- Estimación de implementación (del plan): 4h
- Esfuerzo real: 1,71 h — reloj de 2 sesiones 5,04 h desde 2026-10-08T09:00Z, sin 200 min de espera al dev-lead (2 esperas)
- Desviación: −2,29h (−57%)
- Causa de la desviación (obligatoria si |desviación| > 30%): estimación holgada para dos tasks cortas en un solo fichero. Esperas y huecos: 09:40Z 140 min; 12:40Z 60 min, ya descontadas del esfuerzo.
- Compactación: no
- Modelo del hilo: Sonnet 5.5, effort no registrado
- Tokens del hilo: 1.067.146 — claude-sonnet-5-5 1.067.138; claude-sonnet-5 8
- Tokens de subagentes: 147.016 en 1 despacho — Re-revisión final 0010 claude-opus-5-5 147.016 / 1 min
- Coste de la sesión: sin precio (sin tabla pricing en sdd-kit.json)
- Coste de sujetos: no aplica
- Review de spec: no · hallazgos 0, aceptados 0

## 3. Desviaciones del plan

- _Ninguna_ en las tasks. Una en el gate: el ruling de la Task 2 ponía `--test-concurrency=1`; el cierre lo corrigió y corrió el gate del plan (`node --test`).

### Decisiones tomadas sin el dev-lead

- Task 2: `node --test --test-concurrency=1` en el gate, para esquivar una carrera sobre el almacén compartido — **corregida en el cierre**: sin la bandera la suite pasa 5/5, y `node --test` ya corre cada fichero en su proceso, así que no había carrera entre ficheros. El cierre usó el gate del plan y de la constitución. No he reproducido la carrera que motivó el ruling.
- Cierre: la fila de la Task 1 en `tasks.md` apuntaba a `8d64841` (la Task 2); la corregí a `3564c16`.
- Cierre: el hallazgo de la re-revisión sobre el test sin orden propio lo dejé como deuda, sin tocar código tras la revisión final.

## 4. Verificación

### 4.1 Builds

- `node --test` → 5 tests, 5 pasan, 0 fallan. Corrido también con `--test-concurrency=1`: 5/5, mismo resultado.
- Gate: `node --test` → suite: corrió 5/5 · 0,1 s · configuración: la del gate · sobre el commit de cierre

### 4.2 Smoke / tests

- Validación en campo: 2026-11-05 · suite 5/5 · smoke 3/3 THEN con ejecución real, más el THEN de «sin `--motivo`» provocado a mano · revisión final Spec y Código sobre `8d64841` limpia · re-revisión de la documentación posterior: 1 Important y 1 Minor, resueltos en el cierre. No probado: nada. Verificado por el agente; el dev-lead no ha dicho qué probó.

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| `cancelar Norte lun --motivo "sala ocupada"` responde «cancelada Norte lun (sala ocupada)» | ejecución real | `"cancelada Norte lun (sala ocupada)"` |
| un motivo fuera de la lista responde «motivo no válido: cambio de planes, sala ocupada, otro» | ejecución real | `cancelar Sur mar --motivo "me aburro"` → `"motivo no válido: cambio de planes, sala ocupada, otro"` |
| sin `--motivo` responde lo mismo | ejecución real (la suite no lo cubre) | `cancelar Norte lun` → `"motivo no válido: cambio de planes, sala ocupada, otro"` |
| `canceladas` responde «Norte lun — sala ocupada» | ejecución real | `"Norte lun — sala ocupada"` |

El smoke llamó a `run()` en un solo proceso, porque el almacén vive en memoria: dos invocaciones de `node src/app.js` no comparten la reserva cancelada.

### 4.3 Residuales / deuda generada

- El test «canceladas enseña sala, día y motivo» depende de que el primero haya cancelado antes la reserva de Norte → deuda en el roadmap.
- El THEN «sin `--motivo`» no tiene test en la suite → deuda en el roadmap.
- La fila 0014 («Motivo guardado») parece solaparse con lo que ya hace la 0010: `cancelBooking` guarda `booking.reason`. Queda para el triaje del roadmap con el dev-lead.

## 5. Aprendizajes

- La capacidad `bookings` nace con la 0010 → `.docs/sdd/capabilities/bookings.md`.
- Un ruling que dice «carrera» pide reproducirla antes de cambiar el gate → corregido en `tasks.md`.

Retro: documento o skill desmentido → corregido el ruling de la Task 2 en el mismo documento (.docs/sdd/specs/20261008-100000-feature-0010-cancel-reason/tasks.md)

## 6. Adendas
