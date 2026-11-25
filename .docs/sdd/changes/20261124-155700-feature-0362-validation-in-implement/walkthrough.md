---
id: 20261124-155700-feature-0362-validation-in-implement
feature: 0362
title: Walkthrough — La validación vuelve al final de sdd-implement
spec: ./spec.md
plan: ./plan.md
status: done
created: 2026-11-25
---

# Walkthrough — La validación vuelve al final de `sdd-implement`

## 1. Cambios realizados

- **Skill nueva `sdd-validate`** (`skills/sdd-validate/`): la fase entre la última task y el cierre. Orden: gate de cierre una vez, guion recorrido por el agente, revisión final de ejes, validación del dev-lead según su modo y registro en el walkthrough borrador. Un fallo vuelve a `sdd-implement` como task con su test y la vuelta corre solo lo que toca (`--base <sha>`, «Sin filtro» entero). Se mudan a ella `validation-modes.md` y `dev-validation.md`. Commits `4e80c80`, `f4763ee51`.
- **`sdd-implement` y sus métodos** (`sdd-implement-native`, `sdd-implement-subagent`, `patch-flow.md`): al acabar la última task o el fix de un patch invocan `sdd-validate`; el hilo ya no valida ni lanza la revisión final. Commit `841c974`.
- **`sdd-archive`** (`67ee053`): el paso 1 deja de validar y comprueba que el borrador lleva `Validado:`, `Validación diferida:`, `Validación en campo:` o `Validación por el agente:`; sin él devuelve el trabajo a `sdd-validate`. Un rojo de la rama tras el commit de cierre vuelve a `sdd-implement`. `closing-suite.md`, `merge-recipe.md` y `final-review-check.md` dejan de arreglar código en el cierre.
- **Baterías**: batería nueva `tests/batteries/sdd-validate/` con `vf1`…`vf7` y once escenarios que se mueven de `sdd-archive` (`g1 g2 g3 g4 g7 v1a v1b se1 t1 t2 t3`); `sdd-archive` gana `av1` y `av2` y sus moldes llevan el borrador con `Validado:`. Commits `aa65156`, `d124e1a`.
- **Capacidades** (delta fusionado con `sdd capability merge`): nace `validation` y cambian `archive`, `closing-merge`, `closing-suite`, `control-profiles`, `feature-flow`, `frontend-verification`, `implementation`, `routing` y `verification`.
- **Docs y topes** (`82e3f62`): topes de `word-budget.test.ts` a lo medido + 2 % (`sdd-archive` 2729/8220, `sdd-implement` 2545/6620, `sdd-validate` 655/1735); «29 skills» en `README.md`, `PRODUCT.md` y `CLAUDE.md`; guía de uso y greenfield; test `validation-project-neutral.test.ts`.
- **GREEN, REFACTOR y pasada de fix**: `f4763ee51` (sin preguntas en la vuelta, la decisión va sola), la pasada de la revisión final y los arreglos de la re-revisión, juntados en el cierre.
- ADR: La validación es parte de la implementación → decisions/0043-validation-in-implementation.md

## 2. Tiempo y coste: estimado vs real

- Tipo: infra/tooling
- Estimación de implementación (del plan): 3 h
- Esfuerzo real: 4,56 h — reloj de 3 sesiones 19,32 h desde 2026-11-24T15:38Z, sin 885 min de espera al dev-lead (13 esperas)
- Desviación: +1,56 h (+52 %)
- Causa de la desviación: la primera tanda GREEN (35 sujetos) se descartó por moldes contaminados y se repitió; la revisión final y su re-revisión abrieron una pasada de fix que el plan no contaba; esperas 815 min (noche) y 45 min
- Compactación: no
- Modelo del hilo: Sonnet 5.5, effort medium (Task 8, revisión final); Opus 5.5 en la spec y el plan
- Tokens del hilo: 188.998.880 — claude-sonnet-5-5 188.926.736; claude-opus-5-5 72.144
- Tokens de subagentes: 16.437.530 en 7 despachos — Review spec técnica 0362 claude-sonnet-5-5 2.821.709 / 3 min; Segunda ronda review spec 0362 claude-sonnet-5-5 894.628 / 2 min; Review enmienda spec 0362 sdd-validate claude-sonnet-5-5 459.720 / 1 min; Review spec dominio 0362 claude-opus-5-5 546.953 / 1 min; Final review — Spec axis claude-opus-5-5 4.687.838 / 6 min; Final review — Code axis claude-sonnet-5-5 6.118.033 / 5 min; Re-revisión de la pasada de fix claude-opus-5-5 908.649 / 2 min
- Coste de la sesión: 56,35 $ (hilo 47,19 $ + subagentes 9,15 $)
- Coste de sujetos: ~92,4 $ en 115 sujetos Sonnet (y `a1` Opus) — RED 17,91 $ (18); GREEN 24,17 $ + `av2` (34); tanda descartada 27,7 $ (35); REFACTOR 7,88 $ (7); controles ~9,6 $ (16); humo ~4,1 $ (5); frente a ~86 $ previstos y un techo de 90 $
- Review de spec: 2 revisores (dominio y técnica) · hallazgos 12, aceptados 12

## 3. Desviaciones del plan

- El plan ponía la subida de topes en T7; el ledger la movió a T4 y T6, que son las que engordan.
- `g6` se retira y `g7` pasa a `sdd-validate` (11 escenarios movidos, no 10); aprobado por el dev-lead («1»).
- La ADR 0043 sustituye entera a la 0040 en vez de «solo en el disparador»: el Art. XI no permite sustituir una ADR en un punto.
- La previsión de coste se superó (~92,4 $ frente a 90 $): avisado al dev-lead en el hilo.

### Decisiones tomadas sin el dev-lead

- `a3r` no cambia su esperado (ya mide un rojo que también falla sin la rama); el rojo de la rama lo mide `av2` — sin aprobar, avisado en «Enmiendas» — coste si es erróneo: ninguno.
- Cuatro `MODIFIED` de redacción de `closing-suite` y `control-profiles` entran sin aprobar, como anunciaba el Scope — coste si es erróneo: el dev-lead los ve en «Enmiendas».
- La ADR 0043 sustituye entera a la 0040 — coste si es erróneo: ninguno, el porqué de la 0040 sigue en su fichero.
- Decisión 17: hotfix y spike siguen validando en el paso 1 de `sdd-archive`. El spike pasa hoy por `sdd-validate` porque su método invoca la skill al acabar la última task; la rama del paso 1 queda de refuerzo — coste si es erróneo: incoherencia pequeña para el spike, a decidir por el dev-lead.
- El tope de `sdd-archive` `SKILL.md` midió 2675 (la spec decía 2625) y quedó en 2729 — baja desde 2932, no sube un valor de la spec.
- El primer GREEN (35 sujetos) se descarta y se repite; `v1a`, `vf2`, `vf3` y `g3` abren una única ronda de REFACTOR — coste si es erróneo: ~28 $ sin evidencia.
- La pasada de fix de la revisión final y los cuatro Important de la re-revisión se arreglan en el hilo y quedan `sin revisar`.
- Sin arreglar y adjudicados: dos caminos para un fallo de la revisión final (`vf7` midió 2/2), vuelta del patch y rúbricas `VF2`, `AV2`, `vf5`, `h1` y `h2` sin la medición nueva, y `sdd-spec-approval` sin humo.

## 4. Verificación

### 4.1 Builds

- `moon run kit:test-headless cli:typecheck cli:test --affected --base develop` sobre la última task, 2 min; tras la pasada de fix, `moon run kit:test-headless cli:typecheck cli:test --affected --base <última pasada verde>` sobre el commit de cierre, 2 min.
- Gate: `moon run kit:test-headless cli:typecheck cli:test --affected --base <última pasada verde>` → kit:test-headless: corrió 792/792 · cli:typecheck: corrió (sin tests) · cli:test: corrió 2591/2606 (15 omitidos) · tras el rojo no hubo rojo: es el gate de la pasada de fix · 2 min · configuración: la del gate · sobre el commit de cierre
- Tests de skills tras los dos arreglos: `word-budget.test.ts`, `skills.test.ts` y `validation-project-neutral.test.ts` 270 verdes; `moon run kit:own kit:skill-size kit:copies` verde.

### 4.2 Smoke / tests

- Validación en campo: 2026-11-25 · gate 3/3 tareas, cli:test 2591/2606, kit:test-headless 792/792 · GREEN 2/2 en `vf1`…`vf7`, `av1`, `av2` y los once movidos tras una ronda de REFACTOR (`vf2`, `vf3`, `g3`, `v1a`) · controles 8/8 · humo 5/5 · revisión final Spec (opus+high) y Código (sonnet+high) juntadas en el cierre, con arreglos, pasada de fix y re-revisión opus con 4 Important arreglados a mano, 4 sin revisar

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| Gate, guion, ejes y validación en ese orden, sin `sdd-archive` | `ejecución real` (`vf1`) | 2/2 |
| Un fallo del dev-lead vuelve a `sdd-implement` como task con su test y corre solo lo que toca | `ejecución real` (`vf2`, `vf3`, `vf7`) | 2/2 cada uno tras el REFACTOR |
| Validación diferida o sin respuesta: se registra o se espera | `ejecución real` (`vf4`) | 2/2 |
| Un patch presenta la validación sin ejes | `ejecución real` (`vf5`) | 2/2 |
| Un fichero de «Sin filtro» corre el gate sin filtro | `ejecución real` (`vf6`) | 2/2 |
| `sdd-archive` sin la validación registrada devuelve el trabajo | `ejecución real` (`av1`) | 2/2 |
| Un rojo de la rama tras el cierre vuelve a `sdd-implement`; el cierre no lo arregla | `ejecución real` (`av2`) | 2/2 (la reentrada del cierre: `no probado`) |
| Los escenarios movidos conservan su conducta en `sdd-validate` | `ejecución real` (`g1 g2 g3 g4 g7 v1a v1b se1 t1 t2 t3`) | pasan |
| Controles de `sdd-implement` y `sdd-archive` | `ejecución real` | 8/8 |
| Humo de las cinco skills editadas | `ejecución real` | 5/5 |
| Las referencias movidas no dejan enlaces rotos | `suite` (`skills.test.ts`) | verde |
| Topes de palabras y neutralidad de `sdd-validate` | `suite` (`word-budget.test.ts`, `validation-project-neutral.test.ts`) | verde |
| Hotfix y spike validan en el paso 1 de `sdd-archive` | `no probado` | `a4` no se corrió |

### 4.3 Residuales / deuda generada

- Escenarios de cierre con moldes cambiados que no se corrieron (`a1`, `a2`, `a4`, `c*`, `cpt*`, `e*`, `ci*`, `tk*`): antes de la release.
- La reentrada del cierre tras el rojo (rehacer el cierre y repetir el sync) y la vuelta de un patch se leen en texto, sin batería.
- La decisión 17 para el spike (pasa por `sdd-validate`, que su revisión final necesita): decide el dev-lead.
- Minors diferidos de la revisión: holgura de los topes de `sdd-archive` y `sdd-implement`, `BATTERY` redundante y molde `reservas-gate-open` muerto en `subject.mjs`, `upstream.json` fuera de orden, «Verificación visual» desfasada en `sdd-verify`.

## 5. Aprendizajes

- Un molde de batería que ya trae el registro de la fase que se mide la contamina: se descarta la tanda entera (27,7 $) → `tests/validation-in-implement-green.md`.
- Al mover una regla entre skills hay que mover también las reglas que viajan con ella (la decisión sola, el silence watch, la validación manual): se perdieron tres → ADR 0043 y `sdd-validate`.

Retro: error que cazaría un chequeo → ticket del kit: al mover reglas entre skills, las referencias «skill, sección» que dejaron de resolver (tres) y las tres reglas que no viajaron solo las cazó la revisión final, tras el gate verde
