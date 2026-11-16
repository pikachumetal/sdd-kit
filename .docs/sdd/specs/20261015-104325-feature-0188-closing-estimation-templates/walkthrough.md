---
id: 20261015-104325-feature-0188-closing-estimation-templates
feature: 0188
title: Walkthrough — Estimación y plantillas del cierre
spec: ./spec.md
plan: ./plan.md
status: done
created: 2026-10-15
---

# Walkthrough — Estimación y plantillas del cierre

## 1. Cambios realizados

- **CLI, `estimation`** (Task 1, `342e78e`): `cli/src/estimation/artifacts.ts` lee la marca `(post hoc)` de la línea `Estimación`; la fila lleva `post hoc` en la columna Ratio (`log.ts`) y, con el ratio nulo, sale del factor, la dispersión, la tendencia, la tabla por tipo y la mediana de la release, pero su real suma en «Horas reales».
- **CLI, `session`** (Task 1 y pasada de fix): `cli/src/session/clock.ts` mide el reloj de cada transcript de la rama, de su primera a su última entrada, y las esperas al dev-lead (el hueco hasta un mensaje que escribe el usuario y el de una `AskUserQuestion` a su respuesta). `sdd session tokens` imprime la cuarta línea `- Esfuerzo real: <h> h — reloj de la sesión <h> h desde <inicio>, sin <n> min de espera al dev-lead (<n> esperas)` y la clave `real` en `--json`. La pasada de fix quitó `Math.min/max` con spread, que desbordaban la pila con un transcript de 200.000 entradas.
- **Plantillas** (Task 2, `4583776`): §5 de `patch-template.md` con `(post hoc)`, `- Esfuerzo real:` pegada de la CLI y `- Coste de sujetos:`; §2 de `walkthrough-template.md` pega la misma línea; `tasks-template.md` gana `## Rulings`; `estimation-template.md` y `.docs/sdd/estimation.md` dicen desde dónde cuenta el real y que las esperas van aparte.
- **Skills** (Task 3, `7564f21`, y pasada de fix): `sdd-end-feature`, paso 2, pega las cuatro líneas de `sdd session tokens`; `sdd-end-patch`, paso 1, pega la línea `Esfuerzo real`. RED y GREEN en `tests/closing-estimation-red.md` y `tests/closing-estimation-green.md` (10 sujetos, 2,28 $).
- **Capacidad `estimation`**: tres requisitos nuevos y tres modificados, fusionados con `sdd capability merge`.

## 2. Tiempo y coste: estimado vs real

- Tipo: infra/tooling
- Estimación de implementación (del plan): 2,5h
- Esfuerzo real: 0,99 h — reloj de la sesión 3,42 h desde 2026-10-15T10:39Z, sin 146 min de espera al dev-lead (9 esperas)
- Desviación: −1,5 h (−60 %)
- Causa de la desviación: la campaña de sujetos costó minutos, en paralelo y por debajo de lo previsto (10 sujetos en vez de las tres rondas estimadas), y el real ya no lleva las esperas (146 min, 125 de ellos en una sola respuesta del dev-lead). Ojo al leer el ratio: desde esta feature el real cuenta desde el arranque de la sesión, con la spec y el plan dentro, y se compara con la estimación de implementación, que no los incluye; va a la fila 0192.
- Compactación: no
- Modelo del hilo: Opus 5.5, effort no registrado (toda la feature)
- Tokens del hilo: 55.850.257 — claude-opus-5-5 55.850.257
- Tokens de subagentes: 4.817.509 en 3 despachos — Final review — Code axis claude-sonnet-5-5 461.245 / 2 min; Re-review final 0188 claude-opus-5-5 1.136.187 / 2 min; Final review — Spec axis claude-opus-5-5 3.220.077 / 6 min
- Coste de la sesión: 23,92 $ (hilo 20,75 $ + subagentes 3,17 $)
- Coste de sujetos: 2,28 $ en 10 sujetos sonnet — RED 0,73 $; GREEN 0,78 $; GREEN p2 0,77 $
- Review de spec: no · hallazgos 0, aceptados 0

## 3. Desviaciones del plan

- **Enmienda del 2026-10-15, antes de la Task 1** (aprobada): una respuesta a `AskUserQuestion` también es espera; llega como `tool_result`, no como mensaje.
- **Enmienda del 2026-10-15, Task 3** (aprobada): el RED de `post hoc` salió limpio (0/2 escribieron una cifra al cerrar), así que `sdd-end-patch` no gana esa regla; `post hoc` queda como forma de la plantilla y exclusión del log.
- **`sdd-end-patch` sí se editó**, en la pasada de fix: el GREEN `p2` con la plantilla sola salió 1/2, y la enmienda preveía editarla en ese caso; con la frase, 2/2. La tanda extra la aprobó el dev-lead al pasar de los 6 sujetos previstos.
- **`MODIFIED` añadido en la pasada de fix**: «La estimación de un patch se escribe antes del fix» decía `- Real:`; aplica la decisión 2.

### Decisiones tomadas sin el dev-lead

- Línea base con `FastSuiteBudget` en rojo por carga de la máquina — sigo y lo re-mido en el gate de cierre (en verde: 1263/1263) — un rojo propio tapado hasta el cierre.
- El hallazgo del GREEN `f1` (pegó `0,00 h` cuando los transcripts no cubren el trabajo) va a deuda «Esperar 2.º ticket», no al texto — sería un AND nuevo de la spec — filas con real 0 en el log de quien cierre en otra máquina.
- Para caber en los topes de palabras, `sdd-end-feature` y `sdd-end-patch` recortan lo que ya dicen la referencia y la plantilla, y la referencia de `sdd-end-feature` conserva «¿No conoces el tiempo? Pregunta…» (un primer recorte lo quitaba y la revisión final lo marcó) — la versión recortada de `sdd-end-patch` no está medida en la vía sin transcripts.
- El `MODIFIED` de «La estimación de un patch se escribe antes del fix» se aplica sin aprobación aparte — aplica la decisión 2 — el dev-lead lo revierte si no era su intención.
- Techo de sujetos de 6 a 8 para la primera tanda de `p2` — la tanda de REFACTOR que el Art. I incluye — ~0,6 $.
- Los «Declined to judge» de la revisión (resumen de compactación, interrupciones y mensajes encolados contados como espera, `--resume`, esperas por permisos) quedan fuera de la decisión 3 y van a la fila de deuda del reloj — reales algo bajos en sesiones con muchas interrupciones.
- El ejemplo del requisito `post hoc` (decía `- Real: 0,75h`, como da la forma §5) se corrige en el cierre, revisado en el hilo — una frase de la capacidad.
- Minors diferidos (lista entera en `tasks.md` §Rulings): doble lectura de cada transcript, la última entrada del agente sin limpiar tras una `AskUserQuestion`, `isCompactSummary`, un `null` en `content`, `hours` frente a `clockHours`, huecos de tests (`post hoc` en dispersión, tendencia, tipo y release; `isMeta`; la línea en un walkthrough), forma de `<h>` en la plantilla, la descripción de `sdd session tokens` en `sdd-templates`, `green/subject.sh` sin limpiar el transcript sembrado — van a la fila «Menores diferidos de la feature 0188», en la 0152.

## 4. Verificación

### 4.1 Builds

- Gate de cierre: `moon run kit:test cli:typecheck cli:test cli:test-slow cli:test-min` → `cli:test` 887/887, `cli:test-slow` 158/158, `cli:test-min` 1045/1045, `kit:test` 1263/1263 (17 omitidos) · 4,5 min.

### 4.2 Smoke / tests

- Validación en campo: 2026-10-15 · gate de cierre en verde · smoke 9/9 THEN (5 con ejecución real, 4 por suite) · GREEN de las skills `f1` 1/1 y `p2` 2/2 · revisión final Spec y Código sobre 7564f21e, re-revisión 4/4 resuelta

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| La 4.ª línea de `sdd session tokens` da el esfuerzo real sin esperas | ejecución real | sobre esta rama: `0,99 h — reloj de la sesión 3,42 h desde 2026-10-15T10:39Z, sin 146 min de espera al dev-lead (9 esperas)`; la espera de 125 min es la respuesta del dev-lead a la enmienda; la campaña de sujetos cuenta como trabajo |
| Resultados de herramientas, notificaciones e `isMeta` no son espera; `AskUserQuestion` sí | suite | `clock.test.ts` («descuenta del reloj las esperas al dev-lead») |
| Dos sesiones suman, una de otra rama no cuenta | suite | `clock.test.ts` |
| `--json` lleva `real` | ejecución real | `sdd session tokens --json` sobre esta rama → `{"measured":true,"hours":1.04,"clockHours":3.47,"start":"2026-10-15T10:39Z","waitMinutes":146,"waits":9}` |
| El log lee la línea como real | ejecución real | los cuatro `p2` ejecutan `sdd estimation log` en el cierre; el `patch.md` de `p2-3`, regenerado aquí, da `\| 0042 \| patch \| — \| 0.42 \|` |
| Fila `post hoc`: Ratio `post hoc`, fuera del factor, reales en la release | suite | `post-hoc.test.ts` (fila y factor); dispersión, tendencia, tipo y release por el filtro compartido, sin test propio (minor diferido) |
| Coste de sujetos de un patch | suite | `post-hoc.test.ts` |
| Sin transcripts, las cuatro dicen «no medido» | ejecución real | `sdd session tokens --path <carpeta sin transcripts>` en `tokens.test.ts` y a mano |
| El cierre pega las líneas de `sdd session tokens` | ejecución real | `f1` 1/1 (cuatro líneas en el walkthrough), `p2` 2/2 (la línea en §5); este walkthrough |

### 4.3 Residuales / deuda generada

- Fila 0192: el desglose de tiempos por fase (decisión del dev-lead), con la comparación real frente a estimación de implementación.
- Deuda «El esfuerzo real medido se queda corto cuando los transcripts no cubren el trabajo» y «Una estimación de patch escrita al cerrar, con la plantilla 3.0.0», las dos en **Esperar 2.º ticket**.
- «Menores diferidos de la feature 0188» → 0152.

## 5. Aprendizajes

- Un molde que mide algo que la CLI lee de los transcripts necesita transcripts del trabajo: sin ellos la línea da 0,00 h y el sujeto aproxima con los commits, que es lo correcto. Se siembra uno en `~/.claude/projects/<carpeta del molde>` y se borra después → `tech-stack.md`, «Fixtures y baselines».
- Cambiar una etiqueta de plantilla (`- Real:` → `- Esfuerzo real:`) deja requisitos vivos que la nombran: el repaso de coherencia buscó los `MODIFIED`, no los requisitos que citan la etiqueta → misma familia que la fila 0185 (repaso de coherencia de lo que cambia de forma); no se abre fila nueva.
- Una regla de `post hoc` que el RED no reproduce no se escribe, aunque el dev-lead la diera por decidida: la decisión se cumple con la exclusión del log y la forma de la plantilla → esta feature, Art. I.
- Revisión de skills del proyecto: .claude/skills/ (skill-creator, writing-for-agents, writing-skills) — no aplica: herramientas genéricas de escritura de skills que esta feature no cambia.

## 6. Adendas
