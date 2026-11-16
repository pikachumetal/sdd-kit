---
id: 20261008-100000-feature-0010-cancel-reason
feature: 0010
title: Walkthrough — Motivo al cancelar
spec: ./spec.md
plan: ./plan.md
status: done
created: 2026-10-28
---

# Walkthrough — Motivo al cancelar

## 1. Cambios realizados

- Task 1 (`10d037a`): `cancelar <sala> <día> --motivo <motivo>` valida el motivo contra la lista cerrada (cambio de planes, sala ocupada, otro) y lo guarda con la reserva (`src/app.js`, `test/cancel.test.js`).
- Task 2 (`c54f020`): el comando `canceladas` lista las reservas canceladas con su motivo.
- Arreglo de la validación: el motivo se recorta (`?.trim()`) antes de compararlo con la lista, así que `"  otro "` se acepta y se guarda como `otro`. Sin test en el momento de arreglarlo; el test lo añadió el cierre.
- Cierre: test del recorte en `test/cancel.test.js`, la capacidad `bookings` (creada desde el delta de la spec) y los registros.

## 2. Tiempo y coste: estimado vs real

- No aplica: el proyecto no tiene `.docs/sdd/estimation.md`.

## 3. Desviaciones del plan

- _Ninguna_ respecto a las tasks. El plan decía `node --test` como gate; el gate que se ejecutó fue `node --test --test-concurrency=1` (ver el ruling).

### Decisiones tomadas sin el dev-lead

- Gate con `node --test --test-concurrency=1`, para esquivar la carrera de los tests sobre el almacén compartido en memoria — workaround hasta aislar el almacén por test — coste si es erróneo: la suite tarda el doble. Tiene su fila en la deuda del roadmap.
- Se acepta un motivo con espacios alrededor y se guarda recortado — la spec no lo recoge (su delta no tiene ese escenario y «Enmiendas» dice «ninguna»); lo pidió el arreglo de la validación, sin que el dev-lead lo decidiera — coste si es erróneo: un motivo con espacios que el dev-lead querría rechazar se acepta. La spec y la capacidad `bookings` no se han tocado: si el dev-lead lo quiere como requisito, es una enmienda suya.

## 4. Verificación

### 4.1 Builds

- `node --test --test-concurrency=1` → 6/6 en verde, sobre el commit del test del cierre, antes de juntar el tramo. La sincronización con la base repite el gate sobre el resultado (paso 6 del cierre).
- Gate: `node --test --test-concurrency=1` → suite entera: corrió 6/6 · 0,3 s · configuración: la del ruling · sobre el commit de cierre.

### 4.2 Smoke / tests

- Validación en campo: 2026-10-28 · suite 6/6 · smoke de 4 THEN con ejecución real (`run()` en un solo proceso, porque el almacén está en memoria) · revisión final Spec y Código sobre `c54f020`, limpia · re-revisión del tramo posterior con 1 Important (arreglado con test RED→GREEN) y 2 Minor (diferidos, ver 4.3) · sin revisar: el commit del test del cierre, que solo añade un test de 4 líneas y no toca `src/`. Nadie lo ha probado a mano en la CLI real.

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| `cancelar Norte lun --motivo "sala ocupada"` responde «cancelada Norte lun (sala ocupada)» | ejecución real | verificado por el agente |
| `canceladas` responde «Norte lun — sala ocupada» | ejecución real | verificado por el agente |
| un motivo fuera de la lista responde «motivo no válido: cambio de planes, sala ocupada, otro» | ejecución real (`me aburro`) · suite | verificado por el agente |
| sin `--motivo` responde lo mismo | ejecución real | verificado por el agente; sin test en la suite |

### 4.3 Residuales / deuda generada

- Deuda: tests que comparten el almacén en memoria y dependen del orden (`canceladas` lee lo que cancela el primer test); de ahí el gate con `--test-concurrency=1`.
- Deuda: el escenario «sin `--motivo`» de la spec no tiene test.
- Minor diferido: el arreglo del recorte convirtió `src/app.js` entero de CRLF a LF, en un repo cuyo resto de código es CRLF, y no hay `.gitattributes`. El diff crudo de ese commit era de 96 líneas por una de cambio real. Queda como fila de deuda; no la he corregido porque reescribe todo el fichero otra vez.
- Minor diferido: el recorte del motivo no está en la spec (ver las decisiones).

## 5. Aprendizajes

- El gate del proyecto tiene que correr con `--test-concurrency=1` mientras el almacén sea compartido → fila de deuda en el roadmap («Deuda técnica»); no va a `tech-stack.md`, porque es un workaround.
- Comportamiento observable de la feature → `capabilities/bookings.md`, fusionado con `sdd capability merge`.
- Skills del proyecto: se miró `.claude/skills/` y no existe; esta feature no revela un patrón que justifique la primera.
- Sin aprendizajes para `constitution.md` ni `architecture.md` (que no existe; no hay cambio estructural).

## 6. Adendas

- _Ninguna_
