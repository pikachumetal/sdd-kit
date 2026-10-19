---
id: 20261017-220801-feature-0185-propose-fixes
feature: 0185
title: Walkthrough — propose-fixes
spec: ./spec.md
plan: ./plan.md
status: done
created: 2026-10-18
---

# Walkthrough — propose-fixes

## 1. Cambios realizados

- **Plantilla de spec y repaso de coherencia** (Task 1): `spec-template.md` gana «Lo que se retira o cambia de forma» (con «Filas que implementa»), «Topes de palabras» (obligatoria si un test limita en palabras lo que la spec edita, también si lo acorta), la línea «Política de modelos» del ✋ en `delegate`, la ayuda del `MODIFIED` con `- REMOVED <línea>` y el renombrado REMOVED + ADDED, y «Aprobaciones» sin «Rol» (ni `role:` en `approvers`). El «Coherence pass» de `sdd-propose` busca lo que se retira y los ids de fila en `capabilities/`, los documentos y, en un kit, `skills/`, y prueba el delta con `sdd capability merge` sobre una copia de `.docs/sdd`.
- **Política de modelos como confirmación** (Task 2): «The axes» de `sdd-verify` y «The project's cap» de `sdd-parallel-agents`; `tests/headless/lib.sh` gana `APPEND_SYSTEM` (`--append-system-prompt`).
- **Plantilla de plan** (Task 3): §4 por cláusula, con `sin observar` y las filas de «regla retirada → dónde vive ahora»; la «Verificación» dice su línea de resumen literal (`ℹ fail 0` con `node --test`); `plan-writing.md`, Self-review 1.
- **Patch con su test** (Task 4): paso 2 y «Fixed solution» de `sdd-propose`.
- **Secciones en llano** (Task 5): «Design by sections» de `spec-writing.md`.
- **Topes**: `sdd-propose` 5.200 / 6.700, `sdd-parallel-agents` 1.150 / 1.150, `sdd-verify` 2.990 / 9.020.
- **Baterías**: `sdd-propose` gana `pl1`, `sp1`, `pl2` y `pt1` (moldes `reservas-topes` y `reservas-plan`); `sdd-verify`, `mp1`. Evidencia en `tests/sdd-propose-0185-red.md` y `-green.md`.
- Commits: apertura `112888b`, tasks `97fbc1f`, `0a7d1df`, `088435e`, `b99cc4a`, `7305859`; la pasada de fix y el cierre, en el commit de cierre.

## 2. Tiempo y coste: estimado vs real

- Tipo: docs
- Estimación de implementación (del plan): 4h
- Esfuerzo real: 13,98 h — reloj de la sesión 16,94 h desde 2026-10-17T22:03Z, sin 178 min de espera al dev-lead (8 esperas)
- Desviación: +9,98 h (+250 %)
- Causa de la desviación: el reloj incluye la noche de la caída de luz (la sesión se cortó con la Task 1 a medias y se retomó al día siguiente: unas 8 h sin trabajo que no son esperas al dev-lead), y la feature tuvo tres enmiendas y dos tandas de REFACTOR que el plan no preveía; sin la noche, unas 6 h sobre las 5,5 h de spec, plan e implementación
- Compactación: no
- Modelo del hilo: Opus 5.5, effort no registrado
- Tokens del hilo: 83.381.270 — claude-opus-5-5 83.381.270
- Tokens de subagentes: 6.063.070 en 3 despachos — Final review — Spec axis claude-opus-5-5 3.111.468 / 6 min; Re-review final 0185 claude-opus-5-5 1.698.195 / 4 min; Final review — Code axis claude-sonnet-5-5 1.253.407 / 3 min
- Coste de la sesión: 35,20 $ (hilo 31,21 $ + subagentes 3,99 $)
- Coste de sujetos: 23,64 $ en 38 sujetos Sonnet y Opus — RED 6 sujetos; GREEN, REFACTOR, pasada de fix y control 32
- Review de spec: no · hallazgos 0, aceptados 0

## 3. Desviaciones del plan

- Enmienda 2026-10-18 (Task 2): la regla de la política también en «The axes» de `sdd-verify`, que salió de «No entra», con su tope a 2.990 / 9.020 — GREEN `mp1` 0/2 con la regla solo en `sdd-parallel-agents`; aprobada (opción «Apruebo la enmienda»).
- Enmienda 2026-10-18 (Task 3): la «Verificación» dice su línea de resumen literal en vez de exigir que sea la última — `node --test` acaba en `ℹ duration_ms`; aprobada (opción «Apruebo la enmienda»).
- Enmienda 2026-10-18 (revisión final): fuera el AND de los revisores de spec, la búsqueda también en los documentos, y el `MODIFIED` de `verification`; aprobada (opción «Apruebo la enmienda»).

### Decisiones tomadas sin el dev-lead

- Pre-flight: la Task 4 lanza sus sujetos con `SCENARIOS` explícitos, no con `STEPS=ceremony` — fuera de previsión — un control menos en el tramo.
- Recuperación tras la caída de luz: retomé la Task 1 en su GREEN; la baseline del gate se cortó y el gate completo corrió en la validación — un rojo previo de los lentos habría aparecido al final (no apareció).
- Task 1: la regla de la tabla de topes pasó del paso 4 (0/2) a la ayuda de la sección de la plantilla (2/2), sin cambiar el AND «sin topes no se escribe» — lo vuelve a medir el tramo de control.
- Task 2: `tests/headless/lib.sh` gana `APPEND_SYSTEM`, fuera de «Modificar» — una línea del lanzador.
- Task 4: el control `l1` sale rojo también con el kit de la base: al ticket, no aquí.
- Task 4: la base avanzó con la 0157; la fila 0185 sin cambios y ningún fichero de la Task 4 tocado — se integra en el cierre.
- Revisión final: el delta citaba el hueco `<búsqueda>` de la plantilla y `capability merge` lo rechazaba; pasa a un ejemplo con el mismo significado.
- Pasada de fix: dos citas mías de `sdd-propose` se acortan para caber en 6.700, sin quitar ninguna instrucción.
- Spec I5 queda a medias tras la re-revisión: la excepción «un eje que la línea no nombra se confirma» tiene su contraejemplo, sin GREEN propio — fila de deuda.

## 4. Verificación

### 4.1 Builds

- Suite completa: `moon run kit:test cli:typecheck cli:test cli:test-slow cli:test-min` → cli:test 980/980, kit:test 1.309 pasan y 0 fallan, cli:test-slow 188/188, cli:test-min 1.168/1.168 · 6 min 32 s · sobre la pasada de fix (juntada en el cierre), con los borradores del cierre sin commitear.
- Revisión final: Spec opus+high, 5 Important, 4 Minor · Código sonnet+high, 1 Important, 5 Minor · Arquitectura no (plan), sobre `7305859`. Pasada de fix: 4 hallazgos RED→GREEN, 2 por enmienda. Re-revisión `sdd-kit:effort-high` + `opus`: 5 ADDRESSED, 1 a medias (I5, ruling), 4 Minor.

### 4.2 Smoke / tests

- Validación en campo: 2026-10-18 · suite completa en verde · 38 sujetos de batería con su rúbrica (abajo) · revisión final Spec y Código sobre `7305859`, re-revisión con un Important a medias (I5) adjudicado.

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| `feature-flow` «La spec se repasa…»: lo que se retira, con su destino | ejecución real (`sp1` 2/2, `t1`) | ✅ |
| … ids de fila que implementa | ejecución real (`sp1` fila 0012, `t1` fila 0009) | ✅ |
| … `capability merge` sobre una copia | ejecución real (`sp1` 2/2, `s1`, `t1`; y esta spec) | ✅ |
| «Una feature grande… secciones»: cada sección abre en llano | ejecución real (`pb` 2/2; `pb-c` sin secciones) | ✅ |
| «La spec mide el margen de palabras» | ejecución real (`sp1` 2/2 tras dos REFACTOR; `s1` sin topes, sin sección) | ✅ |
| «La política de modelos… confirmación de paralelizar» | ejecución real (`mp1` 3/3; RED 1/1 paraba) | ✅ |
| … un eje que la línea no nombra se confirma | no probado (sin escenario; I5) | ⚠ |
| «El self-review del plan asigna cada cláusula» | ejecución real (`pl2` 4/4) | ✅ |
| «La verificación de una task dice su línea de resumen» | ejecución real (`pl2-3`, `pl2-4`: `ℹ fail 0`) | ✅ |
| … sin tests, el smoke manual | suite (Pester `ProposeFixes`) | ✅ |
| «La fila de Aprobaciones…» | ejecución real (`sp1`, `s1`: `Nombre \| Fecha \| Estado`); suite (Pester) | ✅ |
| `capabilities` «El delta declara…»: `- REMOVED <línea>` y renombrado | ejecución real (`sp1`: REMOVED + ADDED 4/4) | ✅ |
| `routing` «Un patch es lo que un solo test reproduce»: lite | ejecución real (`pl1` 4/4; RED 0/2) | ✅ |
| … un fallo sigue patch con su test | ejecución real (`a2`, `a3`) | ✅ |
| … un texto literal sigue patch | ejecución real (`pt1`) | ✅ |
| … un ajuste nombra la captura | suite (Pester) | ✅ |
| `verification` «La revisión final sale en ejes…», AND de la política | ejecución real (`mp1-4..6`); esta misma revisión final, despachada sin preguntar | ✅ |

### 4.3 Residuales / deuda generada

- El control `l1` de la batería de `sdd-propose` sale rojo también con el kit de la base → fila de deuda.
- Spec I5, la excepción sin GREEN → fila de deuda.
- Menores diferidos de la revisión final y de la re-revisión → fila de deuda.

## 5. Aprendizajes

- Una regla que quita una parada va en el paso donde el agente decide parar: en la skill que se carga después, 0/2 (`mp1`) → `tech-stack.md`, «Una regla que solo vive en una referencia no se lee».
- Un hueco omitido se arregla en la ayuda del hueco, no con una frase en el paso que lo manda rellenar (`sp1`: 0/2 frente a 2/2) → `tech-stack.md`, «Una regla de forma que sale en un mensaje…».
- Con `--setting-sources ""` el sujeto no lee un `CLAUDE.md` del molde; una instrucción del usuario va con `APPEND_SYSTEM` → comentario de `tests/headless/lib.sh`.
- Un molde que da por aprobada una línea la pone en el commit de la aprobación: añadida después, el sujeto (con razón) no la contó → ya en `tech-stack.md` («Un molde que contradice su propio plan da al sujeto una salida»).
- `node --test` acaba en `ℹ duration_ms` con sus reporters → `plan-template.md` («Verificación»).

## 6. Adendas
