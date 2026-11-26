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

- Cancelar con motivo: `cancelar <sala> <día> --motivo <motivo>` valida el motivo contra la lista cerrada (cambio de planes, sala ocupada, otro) y lo guarda con la reserva — `src/app.js` (94d095a).
- Listado de canceladas: el comando `canceladas` enseña «sala día — motivo» — `src/app.js` (48acea5).
- Fallo del script de validación: `libres` seguía bloqueando una sala con la reserva cancelada; ahora solo bloquea la reserva activa — `src/app.js`, `test/cancel.test.js` (2340c8b).

## 3. Desviaciones del plan

- Task 3 añadida al final del plan: el paso de «Se prueba en la aplicación» (`libres 10:00-12:00` tras cancelar Norte debe responder «Norte, Sur») respondía «Sur».

### Decisiones tomadas sin el dev-lead

- Task 2: el test de `canceladas` reutiliza la cancelación del primer test en vez de preparar la suya — workaround hasta que cada test prepare sus datos — coste si es erróneo: el test falla si corre solo o en otro orden.
- Task 3: el test nuevo importa la app con un estado propio (`?libres-tras-cancelar`), así no depende del orden de los demás — coste si es erróneo: ninguno, solo un test más aislado que el resto.

## 4. Verificación

### 4.1 Builds

- Gate: `node --test test/` · `node e2e/run.mjs` → unit: 7/7 · e2e: 5/5 · sobre 560db9d
- Entorno de la suite: `node scripts/env-up.mjs` · `curl -f http://localhost:62287/health` → ok, levantado en esta sesión
- E2E: 30 s de 0,5 min de presupuesto

### 4.2 Smoke / tests

- Validación en campo: 2026-11-25 · suite 7/7 y e2e 5/5 sobre 560db9d · smoke 4/4 con ejecución real · el script de la app falló una vez (`libres` tras cancelar respondía «Sur») y se arregló en la Task 3 · revisión final Spec y Código sobre 609fbb1, re-revisión limpia sobre 560db9d · 2 minors diferidos

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| `cancelar Norte lun --motivo "sala ocupada"` responde «cancelada Norte lun (sala ocupada)» | ejecución real | «cancelada Norte lun (sala ocupada)» |
| motivo fuera de la lista y sin `--motivo` responden «motivo no válido: cambio de planes, sala ocupada, otro» | ejecución real | los dos dan ese literal |
| `canceladas` responde «Norte lun — sala ocupada» | ejecución real | «Norte lun — sala ocupada» |
| `libres 10:00-12:00` tras cancelar Norte responde «Norte, Sur» (línea «Se prueba en la aplicación» del plan) | ejecución real | «Norte, Sur» |

### 4.3 Residuales / deuda generada

- Minors diferidos: cancelar con motivo válido sobre una reserva inexistente sin test; `canceladas` vacía devuelve una cadena vacía.

<!-- Pendiente: §2 Tiempo y coste, §5 Aprendizajes y §6 Adendas, los cierra sdd-archive. -->
