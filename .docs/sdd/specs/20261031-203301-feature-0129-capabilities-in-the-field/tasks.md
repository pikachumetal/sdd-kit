# Tasks — Capacidades en campo

| Task | Estado | Commit |
| --- | --- | --- |
| 1 — La marca en índice y migración, y el control de la línea en blanco | ✅ | 2d67d630 |
| 2 — El aviso de 500 caracteres | ✅ | f792b94c |
| 3 — La retirada de una capacidad y las filas de deuda | ✅ | 2ddf4383 |

Revisión final: Spec opus+high, con arreglos (2 Important, 7 Minor), 4 sin verificar · Código sonnet+high, lista (6 Minor) · Arquitectura no (plan), sobre 2ddf4383
Pasada de fix: juntada en el cierre, 2 hallazgos RED→GREEN, y los Minor con `review.minors: fix`
Re-revisión: 2ddf4383..pasada de fix, juntada en el cierre, sdd-kit:effort-high + opus, todos los hallazgos atendidos, 4 Minor nuevos adjudicados

## Rulings

- Task 1: RED de la migración repetido sin vecino marcado: el molde con `funcional.md` marcado sesgaba — coste si es erróneo: un sujeto.
- Task 1: paso 7 de v2.0.0 lleva la excepción aunque el sujeto ya saltó `funcional.md` (n = 1, como en el ticket 6298): la pide el THEN aprobado y el saldo es 0 — coste si es erróneo: 6 palabras.
- Task 1: v1.0.0 corregida por enmienda de Scope — coste si es erróneo: una frase.
- Task 2: la ayuda de la plantilla se escribe aunque el RED de plantilla no exhibió el fallo (n = 1, sin diferencia con el GREEN): la pide el dev-lead y un THEN aprobado — coste si es erróneo: 34 palabras de ayuda, con saldo negativo.
- Task 3: test «rerun with an ADDED» simplificado tras el RED (sin `rooms.md` ni primera fusión), mismos asserts — coste si es erróneo: ninguno.
- Final: `Retiradas` de un nombre que nunca existió con solo `REMOVED` da «ya estaba borrado», salida 0: no se distingue de una repetición sin guardar estado — coste si es erróneo: un typo que no borra nada y pasa inadvertido.
- Final: nombres de dos tests de `check` del plan absorbidos en `merge.test.ts`: misma cobertura — coste si es erróneo: ninguno.
- Final: v1.0.0 sin título deja la marca en la primera línea e `isNotCapability` no la ve: caso sin evidencia, y la verificación de la 3.0.0 propone la marca — coste si es erróneo: un rojo que se arregla con una línea.
- Final: `reportMissingArtifact` sin `warnings`, `Retiradas` sobre un puntero o un marcado, un nombre duplicado en el bloque y `Retiradas` con `REMOVED` y reglas repetido se quedan como están: bloques mal escritos o fuera de la spec — coste si es erróneo: un mensaje repetido o un error de fusión visible.
- Final: Minor de la re-revisión en `red/subject.mjs` (comentario de uso con otro nombre, ya no escribe `funcional.md`, cita «la spec»): se quedan, es evidencia congelada y no código del producto — coste si es erróneo: reproducir `red/marked` pide añadir ese fichero al molde.
- Final: el GREEN no lleva un documento marcado: el primer THEN de migración se observa en `red/marked`, donde el sujeto ya lo saltaba, y el texto lo dice — coste si es erróneo: un agente reescribe un marcado en el paso 7, visible en su diff.
