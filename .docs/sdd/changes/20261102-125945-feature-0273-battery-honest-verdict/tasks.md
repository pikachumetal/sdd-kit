---
id: 20261102-125945-feature-0273-battery-honest-verdict
title: Tasks — battery.mjs dice lo que de verdad comprobó
spec: ./spec.md
plan: ./plan.md
created: 2026-11-02
---

# Tasks — battery.mjs dice lo que de verdad comprobó (registro vivo)

- **Spec**: `./spec.md`
- **Plan**: `./plan.md`
- **Rama**: `feature/0273-battery-honest-verdict`

## Estado de las tasks

| # | Task | Status | Commit | Notas |
| --- | --- | --- | --- | --- |
| 1 | `puerta verde` y la fila `file:` | done | 9eb19f8e | |
| 2 | Una campaña que no midió nada sale con 3 | done | 94a0c4e9 | |
| 3 | Cabeceras y `tech-stack.md` | done | 13ea72fa | |

Revisión final: Spec opus+high, with fixes · Código sonnet+high, with fixes · Arquitectura no (plan), sobre 13ea72fa
Pasada de fix: juntada en el cierre, 12 hallazgos (3 tests RED→GREEN, el resto cobertura o refactor sin RED)
Re-revisión: juntada en el cierre, sdd-kit:effort-high + opus, 12 abordados, 1 Important de proceso resuelto con la aprobación del dev-lead, 2 Minor adjudicados

## Rulings

- Task 1: Ruling: test `puerta verde y nombra sus filas` lleva también tools de k2 para que noEvidence sea cierto; y `da verde a ws3` pasa a puerta verde, sin leer: WS, L, como anticipa el riesgo del plan — sin cambiar lo que pide la spec — si está mal, un test.
- Task 2: Ruling: el test de la tabla vacía pasa de resolves 3 a rejects code 3 y el aviso: `battery.mjs run` necesita salir antes de readConfig, que daba `define SCENARIOS`; el THEN de la spec (sale con 3 y lo dice) no cambia; comprobado también `verdict` a mano — si está mal, una línea.
- Final: Ruling: rango en prosa «k1 a k3» cubre solo sus extremos — ninguna batería lo usa; marcador ponytail en el código — si aparece, un verde falso para los del medio
- Final: Ruling: verdict sigue con 4 parámetros — API pública previa, la usan todos los tests; fuera del alcance — ninguno
- Final: Ruling: file: con nombre de carpeta o `..` lanza EISDIR — error de autor que grita, no da verde — ninguno
- Final: Ruling: test de frases de la cabecera — la spec lo pide en «Dónde se prueba» — un test frágil ante reformular
- Final: Ruling: launchIndex ignora el código de cada campaña — decisión 10; el veredicto nombra lo mismo — ninguno
- Final: Ruling: SCENARIOS en blanco imprime `sin sujetos: ` sin etiqueta — sale con 3 igual — texto feo
- Final: Ruling: failedChecksOf con 4 parámetros, superado en uno — privada y sin mejor agrupación; arreglarlo sería un commit de código sin revisar — ninguno
- Final: Ruling: `?? fila` en rowIds no aporta en casos reales — inocuo; mismo motivo — ninguno
- Final: Ruling: parseCheck sigue con el primer token en filas de máquina — ninguna rúbrica real junta ids ahí — una nota con coma
- Final: Ruling: la enmienda de la decisión 1 se marcó como aplicación literal sin serlo, y se commiteó en 266e86ea — desvío: paro y pregunto al dev-lead
