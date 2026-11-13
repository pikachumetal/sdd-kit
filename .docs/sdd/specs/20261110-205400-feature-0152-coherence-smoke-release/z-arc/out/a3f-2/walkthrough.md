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

- Task 1 (`17f79c5`): `cancelar <sala> <día> --motivo <motivo>` valida el motivo contra la lista cerrada (cambio de planes, sala ocupada, otro) y lo guarda con la reserva cancelada; sin motivo o fuera de la lista responde «motivo no válido: …». `src/app.js`, `test/cancel.test.js`.
- Task 2 (`7ef19a9`): comando `canceladas`, una línea «sala día — motivo» por reserva cancelada. `src/app.js`, `test/cancel.test.js`.
- Capacidad nueva `capabilities/bookings.md`, mezclada con `sdd capability merge` desde el delta de la spec.

## 2. Tiempo y coste: estimado vs real

- No aplica: el proyecto no tiene `.docs/sdd/steering/estimation.md`.

## 3. Desviaciones del plan

- _Ninguna_.

### Decisiones tomadas sin el dev-lead

- Task 2: el test de `canceladas` reutiliza la cancelación del primer test en vez de preparar la suya — workaround hasta que cada test prepare sus datos — coste si es erróneo: el test falla si corre solo o en otro orden (deuda en «Por triar» de `debt.md`).

## 4. Verificación

### 4.1 Builds

- `node --test` entero, sobre el commit de cierre: 6/6 en verde. No hay «Suites» ni `operations.md` en el proyecto: el gate es el de cierre del plan, sin filtro.
- Gate: `node --test` → corrió 6/6 (entero, sin filtro).
- La primera pasada salió roja, 5/6, en `test/ids.test.js` (`TypeError [Error]: Cannot read properties of undefined (reading 'trim')`), un fichero de `faf3179`, anterior a la rama. Contrastado: el fichero solo y la suite entera dan verde, en la rama y en un worktree desvinculado de `develop`. No se repite; deuda en «Por triar» con su causa probable.
- Revisión final: Spec y Código limpias sobre `7ef19a9`; lo posterior solo toca `tasks.md`, sin re-revisión.

### 4.2 Smoke / tests

- Validación en campo: 2026-11-12 · suite 6/6 (tras una primera pasada roja ajena que no se repite) · smoke 4/4 THEN con ejecución real, ejecutados por el agente · revisión final Spec y Código limpias sobre `7ef19a9`. Nadie del equipo ha probado a mano.

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| `cancelar Norte lun --motivo "sala ocupada"` responde «cancelada Norte lun (sala ocupada)» | ejecución real (`node src/app.js …`) y suite | verificado |
| un motivo fuera de la lista responde «motivo no válido: cambio de planes, sala ocupada, otro» | ejecución real (con «me aburro») y suite | verificado |
| sin `--motivo` responde lo mismo | ejecución real; la suite no lo cubre | verificado |
| `canceladas` tras cancelar responde «Norte lun — sala ocupada» | ejecución real en un mismo proceso (`run` del módulo) y suite | verificado, con la salvedad de 4.3 |

### 4.3 Residuales / deuda generada

- `canceladas` desde la CLI en una invocación nueva sale vacío: las reservas viven en memoria y no persisten entre invocaciones, así que el THEN del listado solo se ve dentro de un proceso. Es de antes de la 0010; deuda en «Por triar».
- `test/ids.test.js` falla la primera vez que corre en un clon (depende de `ids-store` en el directorio común de git); deuda en «Por triar».
- Test de `canceladas` encadenado al primero (ruling de la Task 2); deuda en «Por triar».

## 5. Aprendizajes

- La capacidad `bookings` no existía: nace de esta spec → `capabilities/bookings.md`.
- Un test que depende del estado que deja otro es una deuda, y la regla va a la constitución → `steering/constitution.md` (regla 5) y `steering/debt.md`.

Retro: error que cazaría un chequeo → norma del revisor: cada test prepara sus datos y no depende de otro ni de un fichero que deje una pasada anterior (`.docs/sdd/steering/constitution.md`, regla 5)

## 6. Adendas

- _Ninguna_.
