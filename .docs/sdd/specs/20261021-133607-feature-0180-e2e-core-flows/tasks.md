# Tasks — 0180

| Task | Estado | Commit |
| --- | --- | --- |
| 1 — Campos E2E en `operations.md`, la init y la migración | hecha | `99780955` |
| 2 — La referencia `writing-e2e.md` | hecha | `a7f30faf` |
| 3 — Los scripts de verificación, desechables | recortada por enmienda 2026-10-21: solo el RED de `r4`, limpio 2 de 2 | `c0adadd4` |

Revisión final: Spec opus+high, con fixes (2 Important, 4 Minor) · Código sonnet+high, con fixes (9 Minor) · Arquitectura no (plan), sobre c0adadd4
Pasada de fix: juntada en el cierre, 2 hallazgos RED→GREEN (n3 1/2 → 2/2, v3 → 1/1; mutante de AnchorTemplates) y 10 Minor de texto
Re-revisión: c0adadd4..pasada de fix (juntada en el cierre), sdd-kit:effort-high + opus, con hallazgos abiertos: 1 Important y 5 Minor, adjudicados con ruling (dos a la 0207); revisado en el hilo: el commit de cierre · plan.md, spec.md y roadmap.md · 5 líneas

## Rulings

- Task 1: Ruling: el humo i1 corre sobre una copia del working tree (`kit1`), no sobre un `git archive` del commit — el commit de la task va después de su verificación — si fuera incorrecto: un humo sobre un kit que difiere en lo no commiteado, nada que no esté en el diff.
- Task 1: Ruling: el flujo core de la hoja de la persona de i1 es «marcar una factura como cobrada» (`e2e/0018-invoice-status.spec.ts`), no «emitir una factura» — el molde no tiene un E2E de emitir — si fuera incorrecto: ninguno, el esperado del plan cambia de nombre y no de forma.
- Task 2: Ruling: los ejemplos de código de las reglas 2 y 3 de `writing-e2e.md` van en el dominio de reservas, no en el de copiar y pegar de la hoja: tech-stack (task 0011), el ejemplo de la guidance va en otro dominio que el fixture — el de `typeInCell` (regla 4) se queda, lo decidió el dev-lead, y el GREEN de r1 en el tecleo tras Enter queda contaminado por él: se dice en la evidencia — si fuera incorrecto: un GREEN de la regla 4 que mide copia, no comprensión.
- Final: Ruling: solape «Entorno de la suite» (Testing) con «## Entornos», y «Acceso a la aplicación» con «Acceso» (Frontend) — se queda: Entornos es el montaje del worktree (env:setup) y el campo nuevo, el comando que levanta lo que la suite necesita; los dos Accesos ya existían antes de la 0180 y la plantilla tiene 17 palabras de margen — si fuera incorrecto: un proyecto escribe el mismo comando en dos sitios.
- Final: Ruling: la política de retries y timeouts vive en la regla 6, la plantilla y la fila de sdd-init — se queda: cada sitio lo lee un agente distinto, y la plantilla es la fuente que citan la init y la migración — si fuera incorrecto: deriva entre tres textos al cambiar la política.
- Final: Ruling: la espera interna legítima (Review Focus 2) no tiene escenario que la observe — se queda sin él: ningún sujeto tuvo una espera legítima, y medirla pide un molde con un trabajo en segundo plano; queda dicho en la evidencia del GREEN — si fuera incorrecto: la referencia corrige de más una espera válida y nadie lo ve hasta el campo.
- Final: Ruling: enmienda de la revisión final (Important 1 y 2 del eje Spec) aprobada por el dev-lead: ADDED en migration, n6 y n3 en la batería de sdd-init y v3 en la de sdd-upgrade, techo de 25 sujetos.
- Final: Ruling: re-revisión, Important — la fila «Testing» de v3.0.0.md enumera 4 de los 6 campos E2E (faltan «Entorno de la suite» y «Datos»), y V13 no lo mide — espera a la 0207, que lee esos dos campos y edita su comprobación; queda en su fila del roadmap con V13 ampliada — si fuera incorrecto: un proyecto que migre antes de la 0207 sale sin esos dos campos y la 0207 no encuentra cómo levantar el entorno (la 3.0.0 no está publicada: nadie migra hoy).
- Final: Ruling: re-revisión, Minor — la tabla de racionalizaciones de writing-e2e.md dice «`test.fixme()` with its issue» con la forma sin argumentos — a la 0207 con el anterior; la regla 7 ya da la forma correcta — si fuera incorrecto: un agente copia la forma que ejecuta el test hasta la llamada.
- Final: Ruling: re-revisión, Minor — el literal «60 s por test, sin motivo escrito» de v3.0.0.md fija los 60 s del molde — se queda: dice «literal» para la frase, y el valor sale de la config («con el valor de la config del runner») — si fuera incorrecto: un proyecto con 120 s escribiría 60 s; lo cubre la misma fila de la 0207.
- Final: Ruling: re-revisión, Minor — «neither» para tres opciones en writing-e2e.md — se queda: «role, label or text» se lee como «ninguno de los anteriores»; corregirlo es otra edición de skill sin revisión — si fuera incorrecto: nada observable.
- Final: Ruling: re-revisión, Minor — v3 (pasada 2, n=1) escribió el comando E2E como Runner de `## Entornos` — ruido del molde (la línea «E2E: `npx playwright test`» que añade al tech-stack); ninguna rúbrica lo mide — si fuera incorrecto: una migración mezcla el runner de env con el de E2E; lo verá la batería de release (0152).
- Final: Ruling: re-revisión, Minor — E3 de n6 pasa en vacío (un turno no llega al presupuesto) — se queda: lo cubre i1 (varios turnos con persona, «Presupuesto E2E: pendiente») — si fuera incorrecto: la batería no ve una regresión del presupuesto.
