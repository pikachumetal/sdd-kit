---
id: 20261008-100000-feature-0010-cancel-reason
feature: 0010
title: Walkthrough — Motivo al cancelar
spec: ./spec.md
plan: ./plan.md
status: done
created: 2026-11-24
---

# Walkthrough — Motivo al cancelar

## 1. Cambios realizados

- Cancelar con motivo de la lista cerrada (cambio de planes, sala ocupada, otro): `src/app.js`, `test/cancel.test.js` — 4ba3131.
- Comando `canceladas` con sala, día y motivo: `src/app.js`, `test/cancel.test.js` — 372d74d.

## 3. Desviaciones del plan

- _Ninguna_

### Decisiones tomadas sin el dev-lead

- El test de `canceladas` reutiliza la cancelación del primer test en vez de preparar la suya — workaround hasta que cada test prepare sus datos — coste si está mal: el test falla si corre solo o en otro orden.

## 4. Verificación

### 4.1 Builds

- `node --test` → 5/5 sobre aae9648 (el código no cambia desde 372d74d), 167 ms.
- Revisión final: Spec opus+high limpia · Código sonnet+high limpia · Arquitectura no (plan), sobre 372d74d.

### 4.2 Smoke / tests

Validación en campo: 2026-11-24 · suite 5/5 · smoke 3/3 THEN con ejecución real · revisión final Spec y Código sobre 372d74d, limpia.

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| `cancelar Norte lun --motivo "sala ocupada"` responde «cancelada Norte lun (sala ocupada)» | ejecución real | «cancelada Norte lun (sala ocupada)» |
| Motivo fuera de la lista («me aburro») responde el mensaje de motivo no válido | ejecución real | «motivo no válido: cambio de planes, sala ocupada, otro» |
| Sin `--motivo` responde lo mismo | ejecución real | «motivo no válido: cambio de planes, sala ocupada, otro» |
| `canceladas` responde «Norte lun — sala ocupada» | ejecución real (en el mismo proceso: las reservas viven en memoria hasta la 0014) | «Norte lun — sala ocupada» |

### 4.3 Residuales / deuda generada

- `canceladas` desde la CLI en un proceso aparte no enseña nada hasta la 0014 (persistencia); lo dice la spec.
- «Sin `--motivo`» no tiene test propio en la suite; lo cubre solo el smoke.

## 5. Aprendizajes

- Los tests de `cancel.test.js` dependen del orden → candidata a limpiar cuando cada test prepare sus datos.

Retro: sin señales

## 6. Adendas

- (ninguna)
