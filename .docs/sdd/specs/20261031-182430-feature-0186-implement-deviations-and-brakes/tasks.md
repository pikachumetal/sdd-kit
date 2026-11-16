---
id: 20261031-182430-feature-0186-implement-deviations-and-brakes
title: Tasks — Freno por regiones, tasks.md antes de la Task 1 y oferta de gama media con su cuenta
spec: ./spec.md
plan: ./plan.md
created: 2026-10-31
---

# Tasks — Freno por regiones, tasks.md antes de la Task 1 y oferta de gama media con su cuenta (registro vivo)

- **Spec**: `./spec.md`
- **Plan**: `./plan.md`
- **Rama**: `feature/0186-implement-deviations-and-brakes`

## Estado de las tasks

| # | Task | Status | Commit | Notas |
| --- | --- | --- | --- | --- |
| 1 | El freno compara regiones | done | aa878b32 | |
| 2 | `tasks.md` nace antes de la primera task | done | dc08cbe0 | afectada por enmienda 2026-10-31 → Task 4 |
| 3 | La oferta de gama media dice cuántas tasks | done | 802cc9d5 | |
| 4 | enmienda 2026-10-31: la CLI exige `tasks.md` | done | 7542081c | |
| 5 | enmienda 2026-10-31: el ruling contra «Dónde se prueba» es desvío | skipped | f17f6964, revertido en el cierre | `g2` no lo reproduce; la frase sale |

Revisión final: Spec opus+high, con arreglos · Código sonnet+high, lista · Arquitectura no (plan), juntada en el cierre
Pasada de fix: juntada en el cierre, 5 hallazgos
Re-revisión: juntada en el cierre, sdd-kit:effort-high + opus, hallazgos resueltos

## Rulings

Task 1: Ruling: compactación — sigo con SDD — quedan 3 tasks
Task 1: Ruling: el implementador firmó Co-Authored-By con Haiku 5.5, el modelo que lo hizo, frente al Opus del plan — atribución fiel — coste si mal: ninguno
Task 1: minor (deferred): ejemplos de flujo de sdd-implement dicen «task files unchanged» (sigue siendo cierto en el cruce por nombre)
Task 2: Ruling: saldo de sdd-implement −14 con wc -w, frente al −16 de la spec, porque SDD lleva «`tasks.md`» explícito — sigue bajando, que es la regla — si fuera mal: dos palabras
Task 2: Ruling: hallazgo de saldo +21 del revisor rechazado — mide solo la task; la feature da −14 (9581→9567 antes del fix) — si fuera mal: recortar texto al cierre
Task 2: minor (deferred): frase al principio del paso 1 de Native densa; literal de la spec
Task 2: Ruling: la regla solo en el paso 1 llega tarde: el sujeto corre task start y luego la aplica. Se añade tasks.md a la caja de Setup y un red flag, sin tocar el THEN ni el sitio que pidió el dev-lead — coste si mal: sale en n1 otra vez y es desvío. Se re-mide n1 n=2 y e1 n=1, por el techo de 35 $.
Task 2: Ruling: hallazgo de saldo de la re-revisión adjudicado: mide desde la base de la task; desde la de la feature queda 9581→9574, −7 frente al −16 previsto. La regla del dev-lead es «igual o baja» y se cumple; la tabla de la spec se corrige a −7 al cerrar — coste si mal: recortar 9 palabras
Task 2: minor (deferred): viñeta de red flag en fragmento, y grafo SDD sin tasks.md (la regla va en su prosa)
Task 3: minor (deferred): fila «I'd better ask which task it is…» de propose sigue tras quitar su red flag
Task 2: Ruling: dev-lead elige opción 1, enmienda aprobada 2026-10-31 → Task 4; techo 40 $ — coste si mal: revertir una comprobación
Task 4: Ruling: dev-lead aprueba («si») la enmienda de g1 → Task 5, g1 n=3, techo 40 $ — coste si mal: otra parada
Task 5: Ruling: g2 no reproduce (2/2 sin frase); se quita la frase, g2-con no se lanza; 41,10 $ — coste si mal: el fallo vuelve en campo y la fila sigue abierta
Final: Ruling: hallazgos 3 y 4 no paran: 3 documenta en el delta `cli` el fallo ya aprobado en la enmienda; 4 hace cumplir el AND «git diff -U0 de la base», sin cambiar THEN ni AND — coste si mal: el dev-lead lo ve en ✋ y se revierte
Final: Ruling: cuarta enmienda: su aprobación es la opción «1» del dev-lead, cuyo texto decía «Si g2 no falla sin la frase, quito la frase» — sin coste
Final: Ruling: «prevé»/«quedan» en la oferta es deliberado: literal de la spec — sin coste
Final: minor (deferred): consumidor con feature a medias sin tasks.md: su siguiente task start falla con mensaje claro; dos encabezados `Task 1` iguales cuentan como dos
