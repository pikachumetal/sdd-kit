---
id: 20260908-095857-task-0000-workflow-ejecucion
task: 0000
title: Walkthrough — Workflow y ejecución
spec: ./spec.md
plan: ./plan.md
status: done
created: 2026-09-08
---

# Walkthrough — Workflow y ejecución

## 1. Cambios realizados

**Campaña RED** (`371a786`): 7 runs sobre la fixture "Cobra" (plan multi-task con restricciones globales enunciadas una sola vez). Respaldó cuatro piezas de guidance y recortó una: el TDD no se escribe porque el baseline ya lo hace (2/2, empujado por el Art. II del proyecto). Cambió además la forma de la herencia: el ejecutor que solo ve su task **no** hereda las "Restricciones globales" (0/2 con una restricción no inferible del código), así que la obligación pasa a quien despacha.

**Guidance** (`0bbb74f`, `96dc2a7`): `sdd-start-task` paso 6 invertido — `subagent-driven-development` como default, ejecución en línea como excepción declarada en el plan, y traspaso obligatorio de las restricciones al subagente; `overrides-superpowers.md` con la fila invertida; `plan-template` con campos `Modelo` (modelo **y** effort) y `Ejecución`, y aviso de que la sección no se hereda sola; `sdd-end-task` con code-review condicionado al camino en línea; constitution con el Art. IV ampliado y el **Art. IX nuevo** — la regla de tres del dev-lead: adoptar superpowers al máximo, aportar lo propio, extender solo ante hueco demostrado.

**Campaña GREEN + A/B** (`1263d2e`): 12 runs. Code-review reparado (1/1), restricciones aplicadas (3/3 JSDoc frente a 0/2), no-regresión de `sdd-start-task` 4/4 y de `sdd-end-task` 1/1. Delegación y modelo/effort **no medibles**: un subagente de workflow no puede despachar subagentes.

**Cierre documental** (`bcb83a7`): T3 en el roadmap separando lo verificado de lo escrito; limitación de método a T9; worktrees devueltos a T4; `tech-stack.md` con la regla "buscar primero si superpowers ya lo cubre y dónde".

**Evidencia**: `tests/workflow-ejecucion-red.md`, `tests/workflow-ejecucion-green.md`, `tests/plan-template-herencia-ab.md` (cierra el residual de T1), y secciones nuevas en `tests/sdd-start-task-ab.md` y `tests/sdd-end-task-ab.md`.

## 2. Tiempo: estimado vs real

- Tipo: docs
- Estimación de implementación (del plan): 4 h (rango 3–6)
- Esfuerzo real: **~1,3 h** (aproximado: carpeta creada a las 09:58 UTC, plan aprobado ~10:05, cierre a las 11:15; ~25 min de reloj en los tres workflows)
- Desviación: −2,7 h (−67 %)
- Causa de la desviación (obligatoria, >30 %): el plan presupuestó los dos costes que dispararon la task anterior —reconstruir fixtures y una ronda de bisección— y **ninguno ocurrió**: la fixture "Cobra" se construyó a mano en minutos (era pequeña y determinista), y la única ronda extra fue corregir dos escenarios mal montados, no bisecar una degradación. La sobreestimación vuelve al patrón histórico del kit (ratio 0,10–0,38) en cuanto se elimina el trabajo de entorno. Lección para `estimation.md`: los costes de entorno se presupuestan **por fixture necesaria**, no como suplemento fijo.

## 3. Desviaciones del plan

- **R1 y R2 fundidos**: eran el mismo run (Cobra ya tenía tests). El presupuesto fue a una repetición, que dio n=2.
- **R3 y R4 rehechos** por defectos de montaje míos: R3 sin la task implementada (el agente se negó a cerrar, con razón); R4 con una restricción imitable del código (no discriminaba). Ambos documentados en el RED como escenarios descartados.
- **El campo `Modelo` ganó el effort a mitad de task**, a propuesta del dev-lead. Respaldado por un hueco demostrado en superpowers (`codex-tools.md:66-68`), no por un escenario propio.
- **El code-review del cierre se escribió y luego se condicionó** al aplicar el Art. IX: duplicaba lo que `subagent-driven-development` ya hace.
- **La política de modelos cambió de "el más barato" a la de superpowers** por la misma regla.
- **GREEN de F1/F2/F4-traspaso pendiente de dogfooding**, por limitación del harness (ver §4.3).

## 4. Verificación

### 4.1 Builds

No aplica (Markdown). Verificado en su lugar: `grep -rn executing-plans skills/` vacío; ninguna afirmación viva de "se evita" sobre `subagent-driven-development`; gates ⛔ (3) y racionalizaciones (9 y 5) intactas en las dos skills editadas; Art. IX al final de la constitution.

### 4.2 Smoke / tests

Todo **verificado por el agente en disco**, no autoinformado:

| # | Caso | Resultado |
| --- | --- | --- |
| 1 | RED F1 — ¿delega el baseline? | 2/2 en línea; obedecen la skill vigente |
| 2 | RED F2 — ¿declara modelo? | 0/2 menciones |
| 3 | RED F3 — ¿pide code-review al cerrar? | 0/1 invocaciones, resto del DoD completo |
| 4 | RED F4 — ejecutor aislado, restricción no inferible (JSDoc) | 0/2 bloques JSDoc |
| 5 | RED positivo — ¿TDD sin nombrarlo? | 2/2 test-primero; `r1b` invocó la skill sola → guidance recortada |
| 6 | GREEN F3 | `t-et` invoca `requesting-code-review`; `c-et` no |
| 7 | GREEN F4 (lo medible) | 3/3 JSDoc en `g1a` y `g1b` |
| 8 | GREEN F1/F2 | no medible: 2/2 sujetos comprobaron por `ToolSearch` que no tienen tool de despacho y lo documentaron en `tasks.md` |
| 9 | A/B `sdd-start-task` (A, B, L, E5) | 4/4 idénticos entre brazos |
| 10 | A/B `sdd-end-task` | 1/1, DoD idéntico + review añadida |
| 11 | Dogfooding del propio cierre | esta task se cerró con la `sdd-end-task` editada; paso 9 (code-review, camino en línea) ejecutado — ver §4.4 |

**Reportado por el usuario**: nada.

### 4.3 Residuales / deuda generada

- **GREEN de F1, F2 y F4-traspaso por dogfooding**: la siguiente task del kit se ejecuta con el default nuevo desde la sesión principal, con el dev-lead como testigo. Registrado en el roadmap (T3 "escrito, no verificado") y en T9.
- **Si el dogfooding muestra que el ejecutor aislado sigue sin recibir las restricciones**, se pasa a la opción C (campos repetidos por task *y* traspaso). Anotado en `plan-template-herencia-ab.md`.
- **El `CLAUDE.md` global del dev-lead sigue prefiriendo ejecución en línea.** Declarado en la spec; su cláusula "salvo que el proyecto indique otra cosa" lo cubre. Si molesta, se alinea aparte.

### 4.4 Code-review (paso 9, camino en línea)

Ejecutado con `superpowers:requesting-code-review` sobre el diff `426aa45..HEAD`. Resultado en el mensaje de cierre.

## 5. Aprendizajes

- **Regla de tres con superpowers** (adoptar · aportar · extender ante hueco) → `constitution.md` Art. IX. Aplicarla cambió dos cosas ya escritas: eso es la prueba de que faltaba.
- **"Implícitamente heredado" no llega al ejecutor aislado** → `plan-template` (aviso) y `sdd-start-task` paso 6; cierra el residual de T1.
- **Buscar primero si superpowers ya lo cubre y dónde** — dos piezas estaban en superpowers pero fuera del punto de uso → `tech-stack.md` §Tests.
- **Un subagente de workflow no puede despachar subagentes** → `tech-stack.md` §Tests y T9.
- **Un escenario RED debe usar una restricción no inferible del código**, o mide imitación en vez de herencia → `tests/workflow-ejecucion-red.md` §Escenarios descartados.
- **Los costes de entorno se presupuestan por fixture, no como suplemento fijo** → pendiente de volcar a `estimation.md` en el cierre de release (tercer aviso de sesgo, en sentido contrario al de T2).
- **Revisión de skills (paso 5)**: mirado. El repo no tiene `.claude/skills/`; sus skills son `skills/`, y esta task editó dos y la plantilla. No procede skill nueva: el patrón (Art. IX) ya vive en la constitution.
