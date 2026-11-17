---
id: 20261008-100000-feature-0010-cancel-reason
feature: 0010
title: Walkthrough — Motivo al cancelar
spec: ./spec.md
plan: ./plan.md
status: done
created: 2026-11-12
---

# Walkthrough — Motivo al cancelar

## 1. Cambios realizados

- **Cancelar con motivo** (`1769cbe`, `src/app.js`, `test/cancel.test.js`): `cancelar <sala> <día> --motivo <motivo>` guarda el motivo con la reserva cancelada y responde «cancelada Norte lun (sala ocupada)». Un motivo fuera de la lista (cambio de planes, sala ocupada, otro), o sin `--motivo`, responde «motivo no válido: cambio de planes, sala ocupada, otro».
- **Listado de canceladas** (`60f2d74`, `src/app.js`, `test/cancel.test.js`): el comando `canceladas` lista las reservas con estado cancelada como «Norte lun — sala ocupada».
- **Capacidad** `bookings` creada en `.docs/sdd/capabilities/bookings.md` con `sdd capability merge` (2 requisitos).

## 2. Tiempo y coste: estimado vs real

- No aplica: el proyecto no tiene `.docs/sdd/steering/estimation.md`.

## 3. Desviaciones del plan

- _Ninguna_

### Decisiones tomadas sin el dev-lead

- El test de `canceladas` reutiliza la cancelación del primer test en vez de preparar la suya — workaround hasta que cada test prepare sus datos — coste si es erróneo: el test falla si corre solo o en otro orden (Task 2, de `## Rulings` de `tasks.md`; su fila de deuda en «Por triar»).

## 4. Verificación

### 4.1 Builds

- `node --test` entero, en la rama, sobre el árbol previo al cierre (el cierre solo añade documentación): 6/6 en verde.
- El primer pase de esta sesión salió 5/6: `test/ids.test.js` falló con `TypeError [Error]: Cannot read properties of undefined (reading 'trim')`, un fichero que la rama no toca. Contraste hecho a mano: el fichero solo, a la vez en la rama y en un worktree desacoplado de `develop` (`d822b98`): verde en los dos; la tarea entera en ambos: 6/6 en la rama, 5/5 en `develop`. No se repite; deuda en «Por triar» con su causa (el test lee y escribe `ids-store` en el directorio común de git y falla el primer pase de una copia limpia).
- Gate: `node --test` → suite: corrió 6/6 · 0.4 s · configuración: la del gate · sobre el commit de cierre

### 4.2 Smoke / tests

- Validación en campo: 2026-11-12 · suite 6/6 (tras el contraste de 4.1) · smoke 4/4 THEN con ejecución real · revisión final Spec y Código limpias sobre `60f2d74`; `HEAD` solo se movió con un commit de 17 líneas de `tasks.md`, sin código, sin re-revisión.

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| `cancelar Norte lun --motivo "sala ocupada"` responde «cancelada Norte lun (sala ocupada)» | ejecución real (`node src/app.js …`) | ✅ |
| Un motivo fuera de la lista (`--motivo "me aburro"`) responde «motivo no válido: cambio de planes, sala ocupada, otro» | ejecución real, con la entrada que falla | ✅ |
| Sin `--motivo` responde lo mismo | ejecución real, con la entrada que falla | ✅ |
| `canceladas`, con Norte lun cancelada por «sala ocupada», responde «Norte lun — sala ocupada» | ejecución real, `run('cancelar', …)` y `run('canceladas', [])` en un mismo proceso | ✅ |

### 4.3 Residuales / deuda generada

- `canceladas` lanzado como CLI en un proceso aparte sale vacío: las reservas viven en memoria y cada invocación arranca de cero. Es lo que hoy hace el almacén y lo cubre la 0014 «Motivo guardado» del roadmap; el spec acota el THEN al listado de lo cancelado, que es lo que se probó.
- Deuda nueva en «Por triar» de `debt.md`: `test/ids.test.js` falla en el primer pase de una copia limpia (estado en `ids-store`), y el test de `canceladas` depende del orden de los tests.

## 5. Aprendizajes

- El motivo es una lista cerrada (cambio de planes, sala ocupada, otro) y el listado lo enseña → `capabilities/bookings.md`, vía `sdd capability merge` (creada, no existía).
- La suite tiene un test con estado en `.git` que falla el primer pase de una copia limpia → `steering/debt.md`, «Por triar».
- Un test no debe leer estado que no crea ni depender del orden de otros → `steering/constitution.md` (artículo 5); los dos tests que hoy lo incumplen, en `steering/debt.md`, «Por triar», el segundo con el ruling de 3.

Retro: error que cazaría un chequeo → convención de tests autocontenidos (`.docs/sdd/steering/constitution.md`)

## 6. Adendas

- _Ninguna_
