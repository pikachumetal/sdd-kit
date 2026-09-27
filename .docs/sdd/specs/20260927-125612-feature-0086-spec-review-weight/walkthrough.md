---
id: 20260927-125612-feature-0086-spec-review-weight
feature: 0086
title: Walkthrough — La review de la spec pesa el delta, respeta el paralelismo y busca cada MODIFIED
spec: ./spec.md
status: done
created: 2026-09-27
---

# Walkthrough — La review de la spec pesa el delta, respeta el paralelismo y busca cada MODIFIED

## 1. Cambios realizados

- `skills/sdd-start-feature/references/review-spec.md` §2: con menos de ~50 líneas estimadas en el Scope, dos revisores bajan a uno con los siete puntos, nunca a ninguno; si el nivel sería dos revisores, la spec va aprobada por delegación y las instrucciones del usuario piden confirmar antes de paralelizar, un revisor con los siete puntos sin preguntar. La propuesta y su ejemplo llevan `· tamaño: ~<N> líneas en <M> ficheros` (`9e0fc16`; arreglos de la revisión final en el commit de cierre).
- `skills/sdd-start-feature/SKILL.md` paso 4: la rúbrica se abre antes del repaso de coherencia, con un recuento nuevo si el repaso cambia el Scope; el repaso busca en el código cada fichero que implementa un `MODIFIED` y lo lista en el Scope o dice por qué queda fuera (`9e0fc16`; arreglos de la revisión final en el commit de cierre).
- Evidencia: `tests/spec-review-weight-red.md` y `-green.md`; molde y salidas en `red/`, `green/` y `refactor/` de esta carpeta.
- Cierre: delta fusionado en `capabilities/feature-flow.md`, changelog, fila 0086 del roadmap con cuatro filas de deuda, dos aprendizajes en `tech-stack.md`.

## 2. Tiempo y coste: estimado vs real

- Tipo: docs
- Estimación de implementación (de la spec): 2,5 h (0,5 h de spec + 2 h de implementación y campaña)
- Esfuerzo real: ~1,5 h — reloj del hilo, de la primera pregunta (~14:50) al cierre (~16:20), aproximado con las marcas de los commits
- Desviación: −1 h (−40 %)
- Causa de la desviación: los sujetos corrieron en paralelo y en segundo plano mientras se redactaba la spec y la evidencia; el texto de las skills fueron seis líneas. Se pierden ~10 min en el incidente del ensayo en seco sobre `%TEMP%`.
- Modelo del hilo: Opus 5.5, effort no registrado
- Tokens del hilo: 29.408.319 — claude-opus-5-5 29.408.319 (la sesión arrancó en la rama de la feature: no hay tramo anterior que descontar)
- Tokens de subagentes: 2.443.267 en 2 despachos — Revisor final de la 0086 claude-opus-5-5 1.448.824 / 4 min; Re-revisión del fix de la 0086 claude-sonnet-5 994.443 / 2 min
- Coste de la sesión: 11,74 $ (hilo 10,14 $ + subagentes 1,60 $)
- Coste de sujetos: 9,65 $ en 13 sujetos Sonnet — RED 1,93 $ (4); GREEN 5,43 $ (7); REFACTOR 2,29 $ (2)
- Review de spec: no (modo lite)

## 3. Desviaciones del plan

- _Sin plan (modo lite)._ Una enmienda a la spec aprobada: el THEN del paralelismo restringido se condiciona a que el nivel sea dos revisores y a la opción literal de delegación (hallazgo Important 2 de la revisión final; aprobada por el dev-lead).

### Decisiones tomadas sin el dev-lead

- Tanda de REFACTOR con los dos sujetos que quedaban bajo el techo, tras ver que 2 de 7 sujetos del GREEN decidieron la review sin abrir la rúbrica — la conducta vecina que el RED cumplía había caído — coste si está mal: 2,29 $ y un techo pasado en 0,65 $.
- El techo de coste de la spec (9 $) se pasó en 0,65 $: el lanzador lo mira antes de cada sujeto y la tanda arrancó con 7,36 $ — sin parar a preguntar, porque el tope de sujetos (13) sí se respetó.
- Cerrar sin el sujeto de control de m tras el REFACTOR, sin un control limpio de c y sin control de las dos ediciones posteriores a la revisión final: techo agotado; quedan como deuda en el roadmap.
- Los nombres del dev-lead que tres sujetos p copiaron en su spec se sustituyeron por `<git-user>` en las salidas (lo exige `SubjectOutputPrivacy.Tests.ps1`).
- La tabla de ficheros calientes del roadmap no se toca: sus filas son líneas compartidas con la 0032, que va en paralelo.
- Minor 10 de la revisión final (heredocs de datos del `subject.sh` en funciones de más de 20 líneas) no se aplica: el molde es de campaña, y moverlo a ficheros cambiaría el lanzador ya medido.

## 4. Verificación

### 4.1 Builds

- Suite completa: `Invoke-Pester -Path tests` → 931 pasan, 1 falla (`FastSuiteBudget`: conjunto rápido en 33,8 s frente a 30, con 8 procesos `claude` de las campañas de la 0032 y la 0085 corriendo a la vez; las salidas de esta feature son 253 KB de 11 MB que escanea `SubjectOutputPrivacy`), 10 omitidos · 432 s. `SubjectOutputPrivacy` falló en una segunda pasada por el nombre del dev-lead en las salidas p; corregido, pasa 7/7.
- Pre-commit (conjunto rápido) en los tres commits de la rama: 850 pasan, 0 fallan.
- `Test-Capabilities.ps1 -Path .docs/sdd -Artifact spec.md` → «Capacidades válidas: 14».
- Revisión final: `sdd-kit:effort-high` + opus, «With fixes» (3 Important, 7 Minor; aplicados los 3 Important y los Minor 4, 6 y 7, el resto a deuda o descartado con motivo en §3); re-revisión `sdd-kit:effort-medium` + sonnet del commit de arreglos (luego juntado en el de cierre): «All findings addressed, no new Critical/Important breakage».

### 4.2 Smoke / tests

- Validación diferida: 2026-09-27 · «cuando acabes, validacion diferida al uso, feedback, commit y merge» · disparador: la primera spec con un `MODIFIED` o con 4 señales o más que arranque el dev-lead con el kit fusionado, a cargo del dev-lead

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| La propuesta dice nivel, señales y tamaño | ejecución real | s-2: «un revisor (siete puntos) — … · tamaño: ~4 líneas en 2 ficheros»; s-3 da el tamaño sin la forma `~N líneas` |
| Delta pequeño con contrato público + datos: un revisor, nunca ninguno | ejecución real | 2/3 (s-2, s-3); s-1 decidió «ninguna» sin abrir la rúbrica, antes del REFACTOR |
| Dos revisores, spec delegada y paralelismo restringido: un revisor sin preguntar | ejecución real | 2/3 (p-2, p-3) frente a 0/2 en el RED; p-1 decidió «ninguna» sin abrir la rúbrica, antes del REFACTOR |
| Con «ninguna» no despacha revisor (enmienda) | no probado | sin sujeto: deuda |
| Delta grande sin esa restricción: dos revisores | no probado | c-1 no fue un control limpio (heredó el `CLAUDE.md` y leyó «toma tú las decisiones» como delegación): deuda |
| El Scope nombra cada fichero que implementa el `MODIFIED` | ejecución real | 2/2 (m-1, m-2: `src/phone.js`) frente a 0/2 en el RED |
| Lo que cambia el repaso aparece en «Decisiones que he tomado yo» | ejecución real | m-1 y m-2: decisión 3 nueva sobre `src/phone.js` |

### 4.3 Residuales / deuda generada

- Controles de la 0086 sin medir (m tras el REFACTOR, c limpio, las dos ediciones tras la revisión final) → fila de deuda del roadmap.
- `lib.sh` no comprueba que el molde sea su propio repo → fila de deuda del roadmap.
- Las plantillas no conocen el revisor único con los siete puntos (`spec-template.md:36`, `walkthrough-template.md:34`, `review-spec.md` §3) → fila de deuda del roadmap.
- `Measure-SessionTokens.ps1` no lee `CLAUDE_CONFIG_DIR` → fila de deuda del roadmap.

## 5. Aprendizajes

- Un `subject.sh` sin `git init` escribe en el repo que contenga el scratchpad (`%TEMP%` en esta máquina), sin ningún error → `tech-stack.md` (Sujetos headless) y deuda de `lib.sh`.
- Con `CLAUDE_CONFIG_DIR`, `Measure-SessionTokens.ps1` se lanza con `-ProjectsRoot` → `tech-stack.md` y deuda.
- Una regla nueva en el repaso de coherencia apartó a 4 de 7 sujetos de la rúbrica del paso de al lado: la conducta vecina se midió como control (Art. I) y se recuperó con una orden explícita de abrir la rúbrica primero → ya recogido en la constitution (Art. I, task 0067); sin doc nuevo.

## 6. Adendas
