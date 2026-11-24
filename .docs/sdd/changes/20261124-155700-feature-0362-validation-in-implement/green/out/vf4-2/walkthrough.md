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

- `src/app.js` (3c248cc, 1097e19): `cancelar <sala> <día> --motivo <motivo>` valida el motivo contra la lista cerrada (cambio de planes, sala ocupada, otro) y lo guarda en la reserva; `canceladas` lista las reservas canceladas con su motivo.
- `test/cancel.test.js` y `e2e/cancel.e2e.mjs` (3c248cc, 1097e19 y la pasada de fix): tests del comando; el e2e conserva solo el flujo core «cancela una reserva con su motivo».
- Pasada de fix de la revisión final: cada test unitario prepara su propia app; tests nuevos de `cancelar` sin `--motivo` y de `sin reserva` con motivo válido; fuera dos tests e2e que no nombraban un flujo core.

## 3. Desviaciones del plan

- _Ninguna_

### Decisiones tomadas sin el dev-lead

- Validar el motivo antes de buscar la reserva — con un motivo malo sobre una reserva inexistente sale el error del motivo — mensaje menos preciso en un caso raro.
- Task 2: el test de `canceladas` reutilizaba la cancelación del primer test (workaround) — superado en la revisión final: ahora prepara la suya.
- El delta de la spec etiqueta como ADDED lo que cambia el comportamiento de un `cancelar` que ya existía, y numera las decisiones 1 y 3 sin la 2 — error del documento, no del código — ninguno en el código.
- Los tests e2e `anula una reserva` y `anular sin reserva avisa` tampoco nombran un flujo core; ya estaban antes y no se tocan — 12 s de e2e.
- La pasada de fix reescribe dos ficheros de test con saltos de línea LF (estaban en CRLF) — diff ruidoso, sin efecto funcional.

## 4. Verificación

### 4.1 Builds

- Gate de cierre sobre el commit de cierre, ejecutado entero (la rama toca `package.json`, de «Sin filtro»).
- Gate: `node --test test/` · `node e2e/run.mjs` → unit: 7/7 · e2e: 5/5 · sobre el commit de cierre. Antes de la pasada de fix: unit 5/5 · e2e 7/7.
- Entorno de la suite: `node scripts/env-up.mjs` · `curl -f http://localhost:60382/health` → `ok`, levantado en esta sesión (el primer e2e falló con conexión rechazada porque no estaba arriba; repetido con el entorno levantado).
- E2E: ~30 s de 0,5 min de presupuesto.
- Revisión final: Spec opus+high y Código sonnet+high, con arreglos (1 + 3 Important, todos en la pasada de fix); Arquitectura no (plan, sin señales en el diff); re-revisión opus+high sobre la pasada de fix, limpia. Minors diferidos: 3 (en `tasks.md`).

### 4.2 Smoke / tests

Validación diferida: 2026-11-24 · «Lo pruebo mañana en la primera exportación, a cargo del dev-lead» · disparador: mañana (2026-11-25), en la primera exportación que el dev-lead haga; el proyecto no tiene ninguna función de exportación, así que, si ese día no la hay, el disparador es el smoke de la release · dueño: dev-lead. Se prueba con el guion de 4 pasos del mensaje de validación (sesión propia, `x-session`).

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| `cancelar Norte lun --motivo "sala ocupada"` responde «cancelada Norte lun (sala ocupada)» | ejecución real + suite | «cancelada Norte lun (sala ocupada)» |
| un motivo fuera de la lista responde «motivo no válido: cambio de planes, sala ocupada, otro» | ejecución real + suite | «motivo no válido: cambio de planes, sala ocupada, otro» (con «me aburro») |
| sin `--motivo` responde lo mismo | ejecución real + suite | «motivo no válido: cambio de planes, sala ocupada, otro» |
| `canceladas` responde «Norte lun — sala ocupada» | ejecución real + suite | «Norte lun — sala ocupada» |

Ejecución real: contra el servidor del entorno, con una sesión propia (`x-session`), no con la de la persona que valida.

### 4.3 Residuales / deuda generada

- `canceladas` sin canceladas imprime una línea vacía; sin mensaje propio.
- `cancelar` sin `--motivo` no distingue «falta el motivo» de «motivo no válido».
- `reasonOf` lee los flags de forma posicional; un parser común cuando haya un tercer comando con flag.

## 5. Aprendizajes

- Un test unitario que reutiliza el estado del anterior solo falla suelto o reordenado: cada test abre su app con `await import('../src/app.js?<nombre>')` → `.docs/sdd/steering/operations.md` (Datos)
- El e2e del gate de cierre necesita el entorno arriba → `.docs/sdd/steering/operations.md` (Gate de cierre)

Retro: error que cazaría un chequeo → una línea en operations.md, Datos: el test unitario que dependía del orden solo lo cazó la revisión (.docs/sdd/steering/operations.md)
Retro: documento o skill desmentido → corregido en el mismo documento: «Gate de cierre» no decía que el e2e necesita el entorno arriba (.docs/sdd/steering/operations.md)

## 6. Adendas

- (ninguna)
