# Deuda técnica — salas

## Por triar

| Ítem | Origen | Fecha |
| --- | --- | --- |
| Sin validación del formato de franja horaria | roadmap 2.x | 2026-09-18 |
| Suite E2E fuera de presupuesto: 48 s medidos de 0,5 min de «Presupuesto E2E» (la traza completa `trace: on` pone 6 s por paso) | [walkthrough 0010 §4.3](specs/20261008-100000-feature-0010-cancel-reason/walkthrough.md) | 2026-11-11 |

## En espera

| Ítem | Causa | Origen | Impacto | Falta | Fecha |
| --- | --- | --- | --- | --- | --- |

## Lista

| Ítem | Causa | Origen | Impacto | Evidencia | Remedio temporal | Arreglo | Destino |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Tests de `test/` comparten el almacén de reservas en memoria: carrera entre tests, sorteada en la Task 2 con `--test-concurrency=1`; se arregla aislando el almacén por test y con un test que falle si depende del estado de otro | prueba o molde | [tasks.md 0010 · Rulings](specs/20261008-100000-feature-0010-cancel-reason/tasks.md) | medio: sin el workaround el gate puede fallar de forma intermitente; con él la suite tarda el doble | el ruling de la Task 2; en el cierre `node --test test/` pasó 5/5 sin la opción, así que la carrera no se reprodujo | `node --test --test-concurrency=1` (no está en el gate declarado ni en `operations.md`) | comprobación automática | sin fila |
