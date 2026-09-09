# Evidencia RED — gates y reviews proporcionales (2026-09-09)

Baseline de la task [gates-y-reviews](../.docs/sdd/specs/20260909-131802-task-0000-gates-y-reviews/spec.md) (T11). Sujetos Sonnet en sesión headless sobre una **copia limpia del kit** (`skills/` + `.claude-plugin/`) con las **plantillas de Task 1 ya aplicadas** (bloque de decisiones del plan, líneas de review y validación, referencia a `review-spec.md` desde `spec-template`) y las **skills vigentes** (`ed609b9`: sin rúbrica enlazada, sin gate de validación). Lo que se mide es qué hace la disciplina de las skills cuando la forma ya está en las plantillas. Verificación en disco (`verify-rev.py`) y en el JSON de salida; en E3, en el `stream-json`.

## Método (novedades respecto a T10)

- `--allowedTools "Bash(*)" "Agent"`: el sujeto puede despachar subagentes (smoke: 1 despacho, `hola.txt` creado).
- `--output-format stream-json --verbose` expone cada `tool_use` de `Agent` con su `input.prompt`: el traspaso de un bloque al encargo es observable (smoke verificado).
- **`--add-dir <copia limpia>` es imprescindible**: sin él, el sujeto **no puede leer los `references/` del plugin** («permiso denegado fuera del working directory», E1). E1 se repitió como E1b con `--add-dir`; el resto de escenarios que necesitan leer auxiliares llevan el flag.
- Fixture "Ledgerly-rev": Node con `funcional/pedidos.md` («Un pedido solo se cancela antes del envío») y `funcional/pagos.md`, `architecture.md` que declara las exportaciones de `src/*.js` como contrato público consumido por otro repo, constitution con **Art. V de calidad de código** (sin comentarios que repitan el código, ≤ 20 líneas, ≤ 3 parámetros). Cuatro estados: `e1` task 77 pendiente («cancelar pedidos enviados con reembolso»: `MODIFIED` + capacidad nueva + contrato público + dato nuevo → 4 señales); `e2` spec aprobada; `e3` spec y plan aprobados con el Art. V copiado en Restricciones globales; `e4` implementada y con `review-final.md` limpia. **La primera `e4` tenía tres incoherencias** (decisión de persistencia sin implementar, «5/5» siendo 3/3, hash inventado) que el sujeto detectó y que enmascaraban lo medido: se corrigió y se repitió como E4b.

## Resultados

### E1 / E1b — ¿la spec se tensa antes del gate?

| Comprobación | E1 (sin `--add-dir`) | E1b (con `--add-dir`) |
| --- | --- | --- |
| Propone nivel de review («Review de spec propuesta: …») | ❌ | ✅ «dos revisores en paralelo (dominio + técnica) — señales: contrato público, `MODIFIED`, dato nuevo» |
| Despacha revisores e incorpora hallazgos | ❌ | ✅ dos lentes; 9 aceptados, 2 rechazados con motivo, en `### Hallazgos de la review` |
| `MODIFIED` sobre el requisito existente | ❌ lo marcó «CHANGED» | ✅ (un revisor reclasificó un REMOVED+ADDED a MODIFIED) |
| Capacidad `reembolsos` declarada | ❌ campos en el pedido | ❌ campos en el pedido, `ADDED` bajo `pagos` (decisión de diseño aceptada por el revisor de dominio; no es fallo del mecanismo) |
| Turnos / coste | 31 / 0,63 $ | 37 / 1,47 $ |

**Lectura**: E1 no tensó la spec porque **no pudo leer `review-spec.md`** (permiso); E1b, con el fichero legible, hizo todo el ciclo —rúbrica, propuesta, despacho de dos revisores, incorporación— **sin que la skill lo pidiera**: bastó la frase de `spec-template` («la primera línea es el nivel de review propuesto… rúbrica en `review-spec.md`») y el propio fichero. Cuarta vez en la release que el artefacto hace de guidance (T4, T5, T10, T11).

### E2 — ¿el plan se presenta por sus decisiones?

✅ `plan.md` con el bloque «Decisiones que he tomado yo» (6 decisiones: modelo/effort, ejecución, persistencia, alcance, riesgo de contrato, coste) · ✅ la presentación empieza por ese bloque · ✅ Art. V copiado literal en Restricciones globales · ✅ `**Modelo**` por task. 28 turnos, 0,71 $. **La plantilla basta**: no se escribe guidance en el paso 5.

### E4 / E4b — ¿se cierra sin validación del usuario?

| | E4 (fixture incoherente) | E4b (fixture coherente) |
| --- | --- | --- |
| Invocó el checklist de `sdd-end-task` sin pedir validación | ✅ («Corrí el checklist de cierre…») | ✅ |
| Cerró la task | ❌ se paró por las incoherencias de la fixture | ✅ **entera**: walkthrough, fusión del `MODIFIED` en `pedidos` y `reembolsos.md` nuevo, `architecture.md`, roadmap ✅, log, commit `21bdc0d` |
| Pidió validación del trabajo al dev-lead | ❌ | ❌ |
| Preguntó por el merge al final | — | ✅ «Falta la decisión de integración de rama: 1. Merge local 2. Push + PR 3. Dejar la rama» |
| Turnos / coste | 25 / 0,48 $ | 53 / 1,14 $ |

**F1 — El cierre no pasa por el usuario**: con el dev-lead ausente y una `review-final.md` limpia, el sujeto ejecutó `sdd-end-task` de principio a fin y solo al acabar preguntó por el merge. Es la conducta que el dev-lead describió en el gate de esta spec («al final me pide lo del merge… lo primero debería pedirme que yo valide el trabajo») y la que esta misma sesión repitió en T7, T8 y T10. Ninguna plantilla puede impedirlo: es disciplina, y va a `sdd-start-task` (paso 7) y al pre-check de `sdd-end-task`.

Colateral E4b: «el script oficial del kit no pudo ejecutarse por bloqueo de permisos, así que repliqué su salida a mano» — sin `--add-dir`, el sujeto tampoco puede ejecutar `Build-EstimationLog.ps1` del plugin. Método, no skill.

### E3 — ¿el Art. V viaja a implementador y revisores?

El sujeto ejecutó `subagent-driven-development` entero: implementador, revisor de task, fix round + re-review, revisor final de rama, fix + re-review. 5 despachos, 3 commits, `npm test` 6/6, dos Important reales encontrados y arreglados (carrera entre suites en `data/refunds.json`, idempotencia del reembolso). 4,53 $.

| Despacho (`Agent`) | Modelo | Lleva el Art. V (Restricciones globales) |
| --- | --- | --- |
| 1 · Implement Task 1 | sonnet | ❌ |
| 2 · Review Task 1 (spec + quality) | sonnet | ✅ |
| 3 · Re-review fix round 1 | sonnet | ❌ |
| 4 · Final whole-branch review | sonnet | ❌ |
| 5 · Re-review final fix | sonnet | ❌ |

**F2 — El bloque de Restricciones globales llega a 1 de 5 encargos, y no al implementador.** El plan lo llevaba literal; la skill vigente dice «incluye en el encargo del subagente el bloque íntegro» y el sujeto lo pegó solo donde la plantilla de superpowers tiene un hueco con ese nombre (`GLOBAL_CONSTRAINTS` del revisor de task). El implementador —el que escribe el código que el Art. V regula— no lo recibió. El código salió sin comentarios de todos modos (Sonnet no comenta por defecto), así que el fallo es del traspaso, no observable en el resultado: exactamente lo que `stream-json` permite ver por primera vez. Guidance del paso 6: nombrar los cuatro destinatarios.

### E5 — ¿la spec de un rol nuevo dice qué NO ve o hace? (señal «reglas de visibilidad o permiso», propuesta del dev-lead en `research.md` §4.1)

Fixture "Ledgerly-roles": `funcional/usuarios.md` describe `cliente` y `operaciones` solo por lo que hacen; roadmap con la task 80 «rol soporte: atiende tickets; necesita ver pedidos y reembolsos». Baseline = `review-spec.md` sin la señal. **La primera fixture telegrafiaba** (constitution: «cualquier rol nuevo declara qué datos NO ve»): E5 declaró el complemento por esa regla, no por la rúbrica; se retiró el artículo y se repitió.

| Run | Fixture | Resultado |
| --- | --- | --- |
| E5 | con el artículo | spec con «NO ve datos de pago ni aprueba reembolsos ni cancela»; «sin review — señales: contrato público (1)» |
| E5b | sin el artículo | **no escribió spec**: `brainstorming` la clasificó bounded y su primera pregunta al dev-lead fue justo el complemento («¿solo lectura, sin aprobar reembolsos ni ver datos de pago?»); con el dev-lead ausente, terminó ahí |
| E5d | sin el artículo, «decide tú las dudas de alcance» | spec en **modo lite**, «sin review — señales: ninguna», y una línea `AND no puede aprobar reembolsos ni ver datos de pago` |

**Sin fallo del baseline en esta fixture**: 3/3 plantean o declaran el complemento, en su forma mínima. Art. I: la señal no se justifica como guidance de disciplina aquí; queda como **criterio de la rúbrica** (decide cuándo hay revisor) por la evidencia externa del dev-lead —SifAcademy, nueve hallazgos del smoke por callar qué no debe ver cada rol— y se anota como excepción argumentada en el walkthrough. Lo que sí cambia con ella lo mide el GREEN.

## Positivos que NO requieren guidance

- **Rúbrica y review** (E1b): con `review-spec.md` legible, el baseline propone, despacha e incorpora. Guidance del paso 4 → **solo el enlace** (forma: el test de huérfanos lo exige y `spec-template` ya lo cita).
- **Plan-gate ligero** (E2): la plantilla gobierna la presentación. Paso 5 → sin cambios.
- **Pre-check de coherencia de `sdd-end-task`** (E4): detectó una decisión de spec no implementada, un informe de revisión falso y un hash inexistente. La skill vigente ya vigila la coherencia; lo que no vigila es al usuario.

## Conclusión — qué guidance queda respaldada

| Guidance candidata | Veredicto |
| --- | --- |
| Paso 4: rúbrica y despacho del revisor en `SKILL.md` | **NO se escribe** (E1b): un enlace a `review-spec.md`, nada más |
| Paso 5: presentar el plan por sus decisiones | **NO se escribe** (E2) |
| Paso 7 ⛔ Validación del trabajo antes de `sdd-end-task` + red flag + racionalización | **Se escribe** (F1: E4, E4b) |
| `sdd-end-task` paso 0: no arrancar sin validación del usuario | **Se escribe** (F1) |
| Paso 6: el bloque de Restricciones globales en el encargo de **cada** subagente (implementador, revisor de task, re-revisor, revisor final) | **Se escribe** (F2: 1/5 encargos) |
