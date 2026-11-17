---
id: 20261008-100000-feature-0010-cancel-reason
feature: 0010
title: Walkthrough — Motivo al cancelar
spec: ./spec.md
plan: ./plan.md
status: done
created: 2026-11-02
---

# Walkthrough — Motivo al cancelar

## 1. Cambios realizados

- `cancelar <sala> <día> --motivo <motivo>` valida el motivo contra la lista cerrada (cambio de planes, sala ocupada, otro) y lo guarda con la reserva cancelada: `src/app.js`, `test/cancel.test.js` (Task 1, `54d070d`).
- Comando `canceladas`: lista «<sala> <día> — <motivo>» de las reservas canceladas: `src/app.js`, `test/cancel.test.js` (Task 2, `edd43dd`).
- Capacidad `bookings` creada desde el delta de la spec (`sdd capability merge`): `.docs/sdd/capabilities/bookings.md`.

## 2. Tiempo y coste: estimado vs real

- Tipo: backend
- Estimación de implementación (del plan): 4h
- Esfuerzo real: 1,71 h — reloj de 2 sesiones 5,04 h desde 2026-10-08T09:00Z, sin 200 min de espera al dev-lead (2 esperas)
- Desviación: −2,29h (−57%)
- Causa de la desviación (obligatoria si |desviación| > 30%): `Esperas y huecos`: 09:40Z 140 min; 12:40Z 60 min. Son dos tasks cortas en el mismo fichero, y la estimación de 4h era holgada.
- Compactación: no
- Modelo del hilo: Sonnet 5.5, effort no registrado
- Tokens del hilo: 591.721 — claude-sonnet-5-5 591.713; claude-sonnet-5 8
- Tokens de subagentes: 163.742 en 1 despacho — Re-revisión docs 0010 claude-opus-5-5 163.742 / 1 min
- Coste de la sesión: sin precio (sin tabla pricing en sdd-kit.json)
- Coste de sujetos: no aplica
- Review de spec: no · hallazgos 0, aceptados 0

## 3. Desviaciones del plan

- Gate de cierre: el plan decía `node --test` y se ejecutó con `node --test --test-concurrency=1` (ver la decisión de abajo). La re-revisión de cierre lo señaló y `plan.md` §3 quedó enmendado.
- `tasks.md` daba `edd43dd` como commit de la Task 1; el real es `54d070d`. Corregido en el cierre.

### Decisiones tomadas sin el dev-lead

- Gate con `--test-concurrency=1` — los tests comparten el almacén de reservas en memoria y corren en carrera; es un workaround hasta aislar el almacén por test — coste si está mal: la suite tarda el doble. Fila en la deuda técnica del roadmap.
- Enmendé `plan.md` §3 (el gate) y el commit de la Task 1 en `tasks.md` para que el registro cuadre con lo que se ejecutó, tras los dos hallazgos de la re-revisión de cierre.

## 4. Verificación

### 4.1 Builds

- `node --test --test-concurrency=1` → 5 tests, 5 pass, 0 fail, sobre el árbol del cierre; la salida completa quedó guardada en el scratchpad.
- Gate: `node --test --test-concurrency=1` → suite: corrió 5/5 · 0,23 s · configuración: la del plan más `--test-concurrency=1` · sobre el commit de cierre (el cierre solo toca documentación y junta los commits de documentación posteriores a la última task)

### 4.2 Smoke / tests

- Validación en campo: 2026-11-02 · verificación del agente: suite 5/5 · smoke de 4 THEN con ejecución real por el CLI (`node src/app.js …`) · revisión final Spec y Código sobre `edd43dd`, limpia · re-revisión del tramo de documentación posterior, con 2 Important de documentación corregidos en el cierre. Sin validación del dev-lead.

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| `cancelar Norte lun --motivo "sala ocupada"` responde «cancelada Norte lun (sala ocupada)» | ejecución real + suite | OK |
| Un motivo fuera de la lista (`"me aburro"`) responde «motivo no válido: cambio de planes, sala ocupada, otro» | ejecución real + suite | OK |
| Sin `--motivo` responde lo mismo | ejecución real (sin test en la suite) | OK |
| `canceladas` tras la cancelación responde «Norte lun — sala ocupada» | ejecución real en un solo proceso | OK; en una invocación aparte el CLI responde vacío porque el almacén es en memoria (lo cubre la 0014) |

### 4.3 Residuales / deuda generada

- `cancelar` sin `--motivo` sin test en la suite → fila en la deuda técnica del roadmap.
- Workaround `--test-concurrency=1` → fila en la deuda técnica del roadmap.
- `cancelar` y `canceladas` en procesos distintos no comparten estado: ya está planificado en la 0014 (Motivo guardado).

## 5. Aprendizajes

- La capacidad `bookings` nace con esta feature → `.docs/sdd/capabilities/bookings.md`.
- Un almacén en memoria compartido entre tests obliga a serializarlos → deuda técnica del roadmap (aislar el almacén por test).

Retro: error que cazaría un chequeo → ticket del kit: `tasks.md` pudo citar un commit que no era el de la task, y el gate del plan contradecir un Ruling, sin que el kit lo avisara; solo lo cazó la re-revisión de cierre

## 6. Adendas

- (ninguna)
