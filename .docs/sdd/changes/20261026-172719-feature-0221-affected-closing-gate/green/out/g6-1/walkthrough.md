---
id: 20261008-100000-feature-0010-cancel-reason
feature: 0010
title: Walkthrough — Motivo al cancelar
spec: ./spec.md
plan: ./plan.md
status: done
created: 2026-10-26
---

# Walkthrough — Motivo al cancelar

## 1. Cambios realizados

- `cancelar <sala> <día> --motivo <motivo>` valida el motivo contra la lista cerrada (cambio de planes, sala ocupada, otro) y lo guarda con la reserva cancelada — `src/app.js`, `test/cancel.test.js` (Task 1, 9aaae15).
- Comando `canceladas`: lista «sala día — motivo» de las reservas canceladas — `src/app.js`, `test/cancel.test.js` (Task 2, 5a4fd76).
- Capacidad `bookings` creada con los dos requisitos (`capabilities/bookings.md`); changelog y roadmap al día.

## 2. Tiempo y coste: estimado vs real

- Sin `.docs/sdd/estimation.md`: no hay estimación que comparar.
- Esfuerzo real: 0,05 h — reloj de la sesión 0,05 h desde 2026-10-26T18:27Z, sin 0 min de espera al dev-lead (0 esperas) *(solo la sesión de cierre; la implementación fue en una sesión anterior y no se mide aquí)*
- Tokens del hilo: 605.446 — claude-sonnet-5-5 605.446
- Tokens de subagentes: 115.264 en 1 despacho — Re-revisión del tramo final claude-opus-5-5 115.264 / 1 min
- Coste de la sesión: sin precio (sin tabla pricing en sdd-kit.json)
- Review de spec: no (dos señales: MODIFIED, datos)

## 3. Desviaciones del plan

- _Ninguna_ sobre el plan.

### Decisiones tomadas sin el dev-lead

- Task 2: `node --test --test-concurrency=1` en el gate, para esquivar una carrera sobre el almacén en memoria — workaround — coste si es erróneo: la suite tarda el doble. **La re-revisión lo contradice**: el flag no está aplicado en `gate.json` y no hay carrera (cada fichero corre en su proceso); el problema real es que el test `canceladas` depende del orden por estado compartido del módulo. Queda como deuda, no como ruling vigente.

## 4. Verificación

### 4.1 Builds

- Suite completa: no corrida en esta rama. Con `feature/0011-others` abierta y la base por delante (1 commit), la corre una sola vez el paso 6 del cierre sobre el merge de sincronización; su resultado y sha van en el mensaje final.
- Antes: `node --test test/cancel.test.js` → 3/3 (re-revisión, sobre 5a4fd76).

### 4.2 Smoke / tests

- Validación en campo: 2026-10-26 · smoke 4/4 THEN con ejecución real · revisión final Spec y Código limpia sobre 5a4fd76 · re-revisión del tramo 5a4fd76..HEAD con 2 Important (ver 3 y 4.3), sin tocar código · suite pendiente del merge de sincronización.

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| `cancelar Norte lun --motivo "sala ocupada"` → «cancelada Norte lun (sala ocupada)» | ejecución real (`node src/app.js cancelar …`) + suite | cumple |
| motivo fuera de la lista → «motivo no válido: …» | ejecución real (`--motivo "me aburro"`) + suite | cumple |
| sin `--motivo` → «motivo no válido: …» | ejecución real (sin flag); sin test en la suite | cumple |
| `canceladas` → «Norte lun — sala ocupada» | ejecución real en un mismo proceso (`run('cancelar')` y `run('canceladas')`) + suite | cumple, con salvedad |

Salvedad: el almacén es en memoria, así que `node src/app.js canceladas` en un proceso aparte sale vacío. Es el comportamiento del almacén actual (la 0014 lo guarda), no un fallo de esta feature.

### 4.3 Residuales / deuda generada

- Test `canceladas` depende del orden (estado compartido del módulo) → deuda en el roadmap.
- Sin test de «cancelar sin `--motivo`» → deuda en el roadmap.

## 5. Aprendizajes

- Un ruling que justifica un flag por una «carrera» se comprueba antes de registrarlo: aquí `node --test` ya aísla por fichero → sin destino estructural; queda en la deuda.

## 6. Adendas

- _Ninguna_
