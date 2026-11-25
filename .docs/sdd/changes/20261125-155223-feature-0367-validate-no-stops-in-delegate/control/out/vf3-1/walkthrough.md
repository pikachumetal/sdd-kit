---
id: 20261008-100000-feature-0010-cancel-reason
feature: 0010
title: Walkthrough — Motivo al cancelar
spec: ./spec.md
plan: ./plan.md
status: done
created: 2026-11-25
---

# Walkthrough — Motivo al cancelar

## 1. Cambios realizados

- `cancelar <sala> <día> --motivo <motivo>` valida el motivo contra la lista cerrada (cambio de planes, sala ocupada, otro) y lo guarda con la reserva (`src/app.js`, 3eaae61).
- `canceladas` lista las reservas canceladas con su motivo: «Norte lun — sala ocupada» (`src/app.js`, b7f166a).
- `libres` solo cuenta como ocupadas las reservas activas, así que una cancelada libera la sala (`src/app.js`, b599b3d).
- Tests: `test/cancel.test.js` (8 en total) y `e2e/cancel.e2e.mjs`.
- Capacidad nueva `bookings`, fusionada desde el delta de la spec en `.docs/sdd/capabilities/bookings.md`.

## 2. Tiempo y coste: estimado vs real

- No aplica: el proyecto no tiene `.docs/sdd/steering/estimation.md`.

## 3. Desviaciones del plan

- Task 3, añadida al plan durante la validación: el paso «Se prueba en la aplicación» falló (tras cancelar Norte, `libres 10:00-12:00` seguía diciendo «Sur»). La causa era `e594c5a`, un commit sin task que había dejado `libres` ocupando salas canceladas; b599b3d lo corrige con test.
- El plan decía «dos tasks»: quedaron tres.

### Decisiones tomadas sin el dev-lead

- Task 2: el test de `canceladas` reutiliza la cancelación del primer test — workaround hasta que cada test prepare sus datos — falla si corre solo o en otro orden (aplazado: aislarlo como la Task 3).
- Eje Arquitectura no: el plan no lo declara y el diff no cruza ninguna señal — una frontera entre módulos pasaría sin revisar.
- `e594c5a` queda como causa del fallo del script y su efecto neto sobre `libres` y `anular` es cero — un cambio de `libres` quedaría sin spec.
- `canceladas` vacío, parseo posicional de `--motivo`, motivo validado antes de buscar la reserva, CRLF→LF: ver `tasks.md`, «Rulings».
- Minor aplazados: orden de los tests de `canceladas`, línea vacía de `canceladas` sin canceladas, mismo mensaje con motivo ausente o inválido, literales de estado repetidos, CRLF/LF mezclados.

## 4. Verificación

### 4.1 Builds

- Gate: `node --test test/` · `node e2e/run.mjs` → unitaria: corrió 8/8 · e2e: corrió 5/5 · sobre 7ce98bc.
- Entorno de la suite: `node scripts/env-up.mjs` · `curl -f http://localhost:63946/health` → ok, levantado en esta sesión.
- E2E: 30 s de 0,5 min de presupuesto.
- Revisión final: Spec opus+high y Código sonnet+high sobre 1ce5ebf, con 3 Important; pasada de fix 7ce98bc; re-revisión opus+high limpia. Arquitectura no salió.

### 4.2 Smoke / tests

- Validación: pendiente del dev-lead.

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| `cancelar Norte lun --motivo "sala ocupada"` → «cancelada Norte lun (sala ocupada)» | ejecución real + suite | ok |
| motivo fuera de la lista → «motivo no válido: cambio de planes, sala ocupada, otro» | ejecución real + suite | ok |
| sin `--motivo` → el mismo mensaje | ejecución real + suite | ok |
| `canceladas` → «Norte lun — sala ocupada» | ejecución real + suite | ok |
| tras cancelar Norte, `libres 10:00-12:00` → «Norte, Sur» | ejecución real + suite | ok |

### 4.3 Residuales / deuda generada

- Minor aplazados de 3. Las reservas viven en memoria hasta la 0014.

## 5. Aprendizajes

- Un commit `feat` sin task cambió el comportamiento de `libres`: lo cazó el script de validación, no la suite → ninguno (caso aislado).

Retro: sin señales

## 6. Adendas

- (ninguna)
