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

## 1. Qué se hizo

- Las dos tasks del plan.
- Arreglo de la validación: quita los espacios del motivo (juntado en el cierre).

Detalle:

- Task 1, cancelar con un motivo de la lista (`src/app.js`, `test/cancel.test.js`) — `8710bd6`.
- Task 2, listado de canceladas con su motivo (`src/app.js`, `test/cancel.test.js`) — `25ae8cc`.
- Arreglo posterior a la revisión final: `reasonOf` recorta el motivo (`?.trim()`), juntado en el cierre.
- Cierre: `test/cancel-reason.test.js` cubre ese arreglo y los casos límite del motivo; la capacidad `bookings` nace en `.docs/sdd/capabilities/bookings.md` con los dos requisitos del delta.

## 3. Desviaciones del plan

- _Ninguna_ respecto al plan.

### Decisiones tomadas sin el dev-lead

- Task 2: `node --test --test-concurrency=1` en el gate, para esquivar una carrera sobre el almacén compartido en memoria — workaround hasta aislar el almacén por test — coste si es erróneo: la suite tarda el doble. En el cierre, `node --test` a secas dio 9/9 en verde: la carrera no se ha reproducido y la revisión duda de que exista (cada fichero corre en su proceso).
- El motivo se recorta antes de validarlo, así que `"  sala ocupada  "` se acepta; el delta de la spec no lo dice y no consta que el dev-lead lo decidiera — coste si está mal: se aceptan entradas que la spec no menciona; se quita con una línea.
- Cierre: arreglé yo el Important de la re-revisión (el recorte no tenía test) y dejé los tres Minor en el registro como diferidos.

## 4. Verificación

### 4.1 Builds

- `node --test` entero sobre el árbol del cierre: 9 tests, 9 en verde, exit 0; la salida está guardada entera.
- RED→GREEN del test nuevo: sin el recorte falla «con el motivo entre espacios lo acepta recortado»; con `.trim()` sin `?.` falla «con --motivo como último argumento, sin valor»; con el código actual pasan los cuatro.
- Gate: `node --test` → 9/9 · 0,36 s · configuración: la del gate de la constitución · sobre el commit de cierre

### 4.2 Smoke / tests

- Validación en campo: 2026-11-11 · verificado por el agente: suite 9/9 · smoke por la CLI real en 3 de 4 THEN, el cuarto solo en un proceso · revisión final Spec y Código limpia sobre `25ae8cc`; re-revisión de `25ae8cc..HEAD` con 1 Important (arreglado) y 3 Minor diferidos · 1 sin revisar. Nadie del equipo ha dicho qué probó: no hay «Validado».
- ✋ sin revisar: el commit de test del arreglo (juntado en el cierre) — añade `test/cancel-reason.test.js`, no toca código de producción.

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| `cancelar Norte lun --motivo "sala ocupada"` responde «cancelada Norte lun (sala ocupada)» | ejecución real (`node src/app.js`) y suite | ok |
| un motivo fuera de la lista responde «motivo no válido: cambio de planes, sala ocupada, otro» | ejecución real (`--motivo "me aburro"`) y suite | ok |
| sin `--motivo` responde lo mismo | ejecución real y suite (`cancel-reason.test.js`) | ok |
| `canceladas` responde «Norte lun — sala ocupada» | suite, y ejecución real en un solo proceso (cancelar y luego `canceladas`). Por la CLI en dos llamadas: `no probado`, porque `canceladas` sale vacío | parcial |

### 4.3 Residuales / deuda generada

- `canceladas` sale vacío en una ejecución nueva de la CLI: el almacén vive en memoria y no persiste entre llamadas. La spec no pide persistencia, pero la intención («Hoy cancelar no deja rastro») no se cumple de punta a punta por la CLI → deuda, «Por triar».
- `src/app.js` pasó de CRLF a LF entera sin querer, y el repo no fija convención de fin de línea → deuda, «Por triar».
- Ruling de la Task 2 (`--test-concurrency=1`) sin carrera demostrada → deuda, «Por triar».

## 5. Aprendizajes

- Cancelar pide un motivo de la lista y el listado de canceladas lo enseña → `capabilities/bookings.md`, creada en este cierre.
- Un test que necesita estado limpio del almacén en memoria va en su propio fichero, porque `cancel.test.js` comparte estado entre sus tests → deuda «aislar el almacén por test»; sin convención nueva en la constitución.

Retro: documento o skill desmentido → corregido en el mismo documento: la Task 1 pasa a su commit real (`tasks.md`)
Retro: error que cazaría un chequeo → un `.gitattributes` que fije el fin de línea, propuesto como deuda y no aplicado, porque renormaliza todo el repo y lo decide el dev-lead (`.docs/sdd/steering/debt.md`)
