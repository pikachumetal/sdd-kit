---
id: 20261008-100000-feature-0010-cancel-reason
feature: 0010
title: Walkthrough — Motivo al cancelar
spec: ./spec.md
plan: ./plan.md
status: done
created: 2026-11-11
---

# Walkthrough — Motivo al cancelar

## 1. Cambios realizados

- Cancelar con motivo: `cancelar <sala> <día> --motivo <motivo>` valida el motivo contra la lista cerrada (`src/app.js`, `test/cancel.test.js`) — e2cb2e5.
- Listado de canceladas: comando `canceladas` con «sala día — motivo» (`src/app.js`, `test/cancel.test.js`) — d14e431.
- Cierre: capacidad `bookings` creada desde el delta de la spec, deuda, roadmap.

## 2. Tiempo y coste: estimado vs real

- No aplica: el proyecto no tiene `.docs/sdd/steering/estimation.md`.

## 3. Desviaciones del plan

- _Ninguna_ en el código. En `tasks.md` la fila de la Task 1 apuntaba al commit de la Task 2; corregida a e2cb2e5.

### Decisiones tomadas sin el dev-lead

- Ruling de la ejecución (Task 2): `node --test --test-concurrency=1` en el gate contra una carrera en el almacén en memoria — workaround — coste si está mal: la suite tarda el doble. No se aplicó en ningún sitio.
- Ruling del cierre: ese flag no se aplica y el gate sigue siendo `node --test`, como dice el plan. Con y sin el flag da 5/5, y cada fichero de test corre en su proceso, así que la carrera no existe — coste si está mal: un test inestable en el gate.

## 4. Verificación

### 4.1 Builds

- `node --test` → 5/5 verdes, también con `--test-concurrency=1`.
- Gate: `node --test` → suite: corrió 5/5 · sobre el commit de cierre (el cierre solo suma docs a lo que corrió).
- Revisión final: Spec y Código limpias sobre d14e431. Re-revisión de lo posterior (solo `tasks.md`): 2 Important (la fila de la Task 1, corregida; el ruling del flag, resuelto con el ruling de arriba) y 1 Minor diferido.

### 4.2 Smoke / tests

- Validación en campo: 2026-11-11 · suite 5/5 · smoke 3 de 3 THEN ejecutables con ejecución real y 1 con suite · revisión final Spec y Código sobre d14e431, re-revisión del resto con 2 Important resueltos y 1 Minor diferido

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| `cancelar Norte lun --motivo "sala ocupada"` responde «cancelada Norte lun (sala ocupada)» | ejecución real | ok |
| motivo fuera de la lista responde «motivo no válido: cambio de planes, sala ocupada, otro» | ejecución real (`--motivo "me aburro"`) | ok |
| sin `--motivo` responde lo mismo | ejecución real | ok (sin test, ver 4.3) |
| `canceladas` responde «Norte lun — sala ocupada» | suite | ok. No `ejecución real`: el almacén es en memoria y cada llamada a la CLI es un proceso nuevo, la cancelación no llega a la siguiente llamada (lo cubre la 0014) |

### 4.3 Residuales / deuda generada

- Falta el test del THEN «sin `--motivo`» (Minor diferido).
- Los tests de `test/cancel.test.js` dependen del orden: el de `canceladas` espera que el primero haya cancelado Norte lun.
- Ambos en «Por triar» de `debt.md`.

## 5. Aprendizajes

- El listado de canceladas solo se ve entero en la suite mientras el almacén sea en memoria → capacidad `bookings` y la fila 0014 (motivo guardado).

Retro: error que cazaría un chequeo → ticket del kit: nada comprueba que cada fila de `tasks.md` cite el commit de su task, y dos filas con el mismo commit llegaron hasta la re-revisión del cierre

## 6. Adendas

- _Ninguna_
