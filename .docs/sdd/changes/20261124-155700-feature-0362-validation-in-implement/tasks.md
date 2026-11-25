---
id: 20261124-155700-feature-0362-validation-in-implement
title: Tasks — La validación vuelve al final de sdd-implement
spec: ./spec.md
plan: ./plan.md
created: 2026-11-24
---

# Tasks — La validación vuelve al final de `sdd-implement` (registro vivo)

- **Spec**: `./spec.md`
- **Plan**: `./plan.md`
- **Rama**: `feature/0362-validation-in-implement`

## Estado de las tasks

| # | Task | Status | Commit | Notas |
| --- | --- | --- | --- | --- |
| 1 | Batería nueva de `sdd-validate`: escenarios, moldes y los que se mueven | done | aa65156 | |
| 2 | Batería de `sdd-archive`: sin validación, con `Validado:` y la reentrada | done | d124e1a | |
| 3 | RED: los escenarios nuevos exhiben el fallo con el texto vigente | done | 2dad1e4 | vf6 es control (la regla ya existe); coste del RED 17,91 $ frente a 12,8 $ |
| 4 | `sdd-validate`: la skill nueva | done | 4e80c80 | |
| 5 | `sdd-implement` y sus métodos: el pase a `sdd-validate` | done | 841c974 | |
| 6 | `sdd-archive` y los textos que nombran la validación | done | 67ee053 | |
| 7 | ADR, topes, docs del flujo y enmiendas de redacción | done | 82e3f62 | |
| 8 | GREEN, REFACTOR y controles | done | 8b0be17 | GREEN, una ronda de REFACTOR, controles 8/8 y humo 5/5; ver tests/validation-in-implement-green.md |

## Rulings

- Pre-flight: cada task fija en su commit el tope de palabras de la skill que engorda (T4 la entrada nueva de `sdd-validate`, T6 `sdd-archive`), con el valor de la spec; T7 lo ajusta a lo medido + 2 %.

Revisión final: Spec opus+high, con arreglos · Código sonnet+high, con arreglos · Arquitectura no (plan), sobre juntada en el cierre
Pasada de fix: juntada en el cierre, 10 hallazgos RED→GREEN
Re-revisión: juntada en el cierre, sdd-kit:effort-high + opus, con arreglos (4 Important de la pasada arreglados a mano, sin revisar)

- Task 1: Ruling: el `subject.mjs` de `sdd-validate` es el de `sdd-archive` con `BATTERY_DIR` — el plan decía copiar ~400 líneas de moldes; compartirlos deja un solo sitio y un diff de ~45 líneas — coste si es erróneo: la batería de `sdd-validate` depende del `subject.mjs` de otra, y un cambio de moldes de `sdd-archive` la afecta
- Task 1: Ruling: el RED de `sdd-validate` con un kit sin la skill pide la validación sin nombrarla y la guarda mira `sdd-implement` (como el RED de `sdd-archive` con `sdd-end-feature`) — coste si es erróneo: el RED mide lo que hace hoy un kit sin `sdd-validate`, no una invocación fallida
- Task 1: Ruling: el RED se lanza con `BATTERY=sdd-validate SPEC_DIR=<carpeta de la spec> KIT_DIR=<dist del commit> PHASE=red COST_CAP SUBJECT SCENARIOS MAX_PARALLEL node tests/headless/battery.mjs run` y `DRY_RUN=1` monta cada molde sin gastar — comprobado en seco con los 7 `vf*` y 5 movidos — coste si es erróneo: ninguno
- Task 2: Ruling: `g6` se retira y `g7` pasa a `sdd-validate` (11 escenarios movidos) — `g6` mide el requisito que la spec quita y `g7` el gate que ya corre en `sdd-validate` — aprobado por el dev-lead («1»); la previsión sube ~3 $ — coste si es erróneo: ninguno, la spec lo recoge en «Enmiendas»
- Task 2: Ruling: `a3r` no cambia su esperado (ya mide un rojo que también falla sin la rama); el rojo de la rama lo mide `av2` — coste si es erróneo: ninguno; sin aprobar, avisado en «Enmiendas» y en el mensaje de cierre
- Task 2: Ruling: el registro de la validación de los moldes de cierre va en un `walkthrough.md` commiteado (en un patch, una línea bajo §4 del `patch.md`); `c1` y `c2` piden completarlo en vez de crearlo — un borrador sin commitear lo barrería el `add -A` de los commits siguientes del molde — coste si es erróneo: un molde sin su borrador sin commitear no mide «Pre-checks» con él
- Task 3: Ruling: `vf6` es control, no RED — con el texto vigente 2/2 corren el gate sin filtro tras tocar `package.json` (la regla ya está en «Running a gate»); no se escribe guidance nueva para ella — coste si es erróneo: ninguno; sigue como no regresión en GREEN
- Task 3: Ruling: las rúbricas VF5 y VF7 se ajustan tras leer los sujetos y antes de escribir guidance (VF5 pide presentar y registrar la validación; VF7 distingue la re-revisión de una revisión de vuelta) — coste si es erróneo: los RED de vf5 y vf7 miden lo que la spec dice, no el atajo
- Task 4: Ruling: `upstream.json` clasifica `skills/sdd-validate/` como `own` (lo exige `notices.test.ts`; el plan no lo nombraba) — coste si es erróneo: ninguno
- Task 4: Ruling: «After the last task» de `sdd-implement` se reduce a la invocación de `sdd-validate` en este commit, y el paso 1 de `sdd-archive` apunta a `validation-modes.md` en su sitio nuevo — el pre-commit (`kit:own`, `skills.test.ts`) lo exige y el plan lo ponía en T5 y T6 — coste si es erróneo: T5 y T6 tienen menos que hacer
- Task 7: Ruling: la ADR 0043 sustituye a la 0040 entera (la repite con el disparador nuevo) y la 0040 pasa a `superseded by 0043` — es la forma de la 0040 con la 0028 y el Art. XI no permite sustituir una ADR en un solo punto; la decisión 13 de la spec decía «sin cambiar el status» — coste si es erróneo: ninguno, el porqué de la 0040 sigue en su fichero
- Task 7: Ruling: los topes bajan a lo medido + 2 % (sdd-archive 2729/8220, sdd-implement 2545/6620), no a los de la spec (2625 y 8450; 2625 no cabía: SKILL.md de sdd-archive mide 2675) — bajar un tope no pide decisión del dev-lead; `sdd-validate` queda en 655/1735 — coste si es erróneo: ninguno
- Task 7: Ruling: la enmienda de redacción de closing-suite y control-profiles (4 requisitos) entra en la spec sin aprobar, como anunciaba el Scope — coste si es erróneo: el dev-lead la ve en «Enmiendas»
- Task 8: Ruling: la primera tanda GREEN (35 sujetos, 27,7 $) se descarta como evidencia — los moldes de la batería de sdd-validate llevaban ya la línea `Validación en campo:` en el borrador del walkthrough (el registro del cierre que `done0010` escribe para sdd-archive), y la columna «Esperado» de los diez escenarios movidos seguía en `sdd-archive`; se corrige (`RECORD` solo en la batería de sdd-archive; Esperado a `sdd-validate`) y se repite la de sdd-validate (31 sujetos, ~27 $); la de sdd-archive (av1, av2) vale — coste si es erróneo: ~28 $ gastados sin evidencia; el total pasa a ~72 $ antes de controles y humo
- Task 8: Ruling: una sola ronda de REFACTOR (f4763ee51) que cubre los tres paros de delegate (vf2-1, vf3-2, g3-2) y v1a, que mezclaba la decisión con el guion porque la regla «decisión sola» no viajó de sdd-archive a sdd-validate; dos «sin preguntar» en SKILL.md y la regla en validation-modes.md, dentro de los topes 655/1735 — coste si es erróneo: ninguno; v1a y g3 quedaron fuera de lo que decía la tarea y se avisa
- Task 8: Ruling: el humo de sdd-implement-native, sdd-implement-subagent y sdd-templates usa escenarios de las baterías de sdd-implement (sp1, r1) y sdd-propose (p2) porque no tienen batería propia — coste si es erróneo: ninguno
- Task 8: Ruling: campaña total ~92,4 $ (64,65 $ medidos + 27,7 $ de la tanda descartada), por encima de los 90 $: avisado al dev-lead en el hilo y en el cierre — coste si es erróneo: ~2,4 $ sobre el techo
- Final: Ruling: Spec 7 (dos caminos para un fallo de la revisión final) — se deja: vf7 midió 2/2 la pasada de fix con el texto vigente y cambiarlo exige otra tanda de sujetos — coste si es erróneo: un agente que sigue «Closing the review» en vez de la vuelta; sale a ✋
- Final: Ruling: Spec 8 (la vuelta de un patch) y Spec 9 (rúbricas VF2, AV2, vf5 y h1 y h2 sin las mediciones nuevas) — no se miden en esta feature: la reentrada de av2 y la vuelta del patch se leen en texto, no por batería — coste si es erróneo: dos reglas sin sujeto; sale a ✋ como no verificado
- Final: Ruling: Spec 10 (sdd-spec-approval sin humo) — una línea de nombre, sin escenario en batería: se deja — coste si es erróneo: ninguno visible
- Final: minor (deferred): holgura de los topes de sdd-archive y sdd-implement (2674 y 2493 frente a 2729 y 2545), BATTERY redundante en subject.mjs, molde reservas-gate-open muerto, validation-project-neutral.test.ts solo busca tres nombres, upstream.json fuera de orden alfabético, Revisión de vuelta sin su propia línea
- Final: Ruling: tope de sdd-archive SKILL.md 2729 frente a los 2625 de la spec — se midió 2675 antes de este arreglo; no sube un valor de la spec, baja desde 2932 — coste si es erróneo: ninguno
- Final: minor (deferred): Minor 2 de la re-revisión («Verificación visual» desfasada en sdd-verify) y Minor 4 (excepción tras el absoluto de «Every commit of yours»)
