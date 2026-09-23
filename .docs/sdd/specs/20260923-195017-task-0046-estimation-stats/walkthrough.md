---
id: 20260923-195017-task-0046-estimation-stats
task: 0046
title: Walkthrough — Resumen estadístico del estimation-log
spec: ./spec.md
status: done
created: 2026-09-23
---

# Walkthrough — Resumen estadístico del estimation-log

## 1. Cambios realizados

- **Script** — `skills/sdd-templates/scripts/Build-EstimationLog.ps1`: `Add-CalibrationSection` añade al resumen la media, p25–p75, el p80 con su línea para comprometer fechas, ±25 %, sobreestimadas e infraestimadas, el error absoluto en horas, la tendencia, el histograma por tramos, p25–p75 por tipo y la tabla por release leída de `changelog.md`. Con n < 5 dice «n insuficiente (hacen falta 5)» y la tendencia pide 20. Commits `94eaab5` (implementación) y `a303e62` (fix de la revisión).
- **Tests** — `tests/Build-EstimationLog.Tests.ps1`: 12 tests nuevos en un `Describe 'Resumen estadístico'` que genera sus proyectos en `TestDrive`, más el test «calcula la mediana por Tipo» con la columna nueva. Escritos por el hilo principal antes del despacho (`ac10919`, `c3a05ce`).
- **Log** — `.docs/sdd/estimation-log.md` regenerado (`41b0436`). Las filas no cambian; solo cambia el resumen.

## 2. Tiempo y coste: estimado vs real

- Tipo: infra/tooling
- Estimación de implementación (de la spec): 2 h (rango 1,5–3)
- Esfuerzo real: 0,75 h (aproximado, por las marcas de los commits: aprobación de la spec hacia las 21:55, validación a las 22:33, cierre ~10 min más). La spec, de 21:40 a 21:55, no cuenta.
- Desviación: −1,25 h (−62 %)
- Causa de la desviación: la estimación contó como trabajo secuencial del hilo la escritura del código, que hizo un subagente en 5 minutos. El trabajo del hilo fue diseñar los datos de test y revisar. Diseñar los datos con 21 ratios, para que los percentiles caigan en índices enteros, evitó iterar sobre redondeos.
- Modelo del hilo: Opus 5.5
- Tokens del hilo: no medido
- Tokens de subagentes: ~295k en 3 despachos — implementador Sonnet 115k / 5 min; revisor final Sonnet 111k / 4 min; re-revisor del fix Sonnet 70k / 1 min
- Coste de sujetos: no aplica
- Review de spec: no (modo lite)

## 3. Desviaciones del plan

- _Ninguna_ respecto a la spec (modo lite, sin plan).

### Decisiones tomadas sin el dev-lead

- Tests RED aparcados en la carpeta de la spec y movidos a `tests/` en el commit de implementación — el pre-commit rechaza la suite en rojo (convención de `tech-stack.md`) — coste si está mal: ninguno, el contrato llegó intacto.
- Helper de test `New-Walkthrough` pasado de 6 parámetros a un hashtable antes del despacho — el Art. X limita a 3 — coste: ninguno.
- Fix del hilo principal tras la revisión (`a303e62`): la tendencia va con las demás viñetas y el histograma después, con su línea en blanco; `$over`/`$under` renombradas — la spec no fijaba el orden y la tabla quedaba pegada a la viñeta — coste: el orden del resumen es otro que el del primer smoke.
- No arreglado (Minor 2 de la revisión): el histograma redondea cada tramo aparte y puede sumar 101 % — la spec solo promete 100 para ±25 %/sobre/infra — coste: un lector puede notarlo; el arreglo es el redondeo por mayor resto.
- Effort de los subagentes no declarado — la herramienta `Agent` no lo expone (desviación conocida del Art. IV desde la T7).

## 4. Verificación

### 4.1 Builds

- Sin build. `Invoke-Pester -Path tests` (con los `Slow`): 434 en verde, 0 fallos, 6 skipped.

### 4.2 Smoke / tests

- Validado por el dev-lead: 2026-09-23 · respondió «sis perfecto» a «¿Lo has probado y funciona? Dime qué has mirado». No detalló qué probó.

| # | Caso | Resultado |
| --- | --- | --- |
| 1 | `Build-EstimationLog.Tests.ps1` | 49/49 en verde (verificado por el agente) |
| 2 | Suite completa del kit | 434 en verde, 0 fallos (verificado por el agente) |
| 3 | Log real frente al spike: mediana, media, error absoluto, tendencia, docs/patch, «sin publicar» | Coinciden (0,6 · 0,69 · 0,87/0,5 h · 0,33 → 0,67 · 0,52/1,2 · 35,55 h frente a 35,6) |
| 4 | Log real frente al spike: p25–p75, p80, ±25 % | Difieren poco: 0,43–0,9 frente a 0,41–0,92; 1,03 frente a 1,05; 28/64/8 frente a 26/66/8. Causa probable: otro método de percentil en el spike o una fila más; sin el script del spike no se puede confirmar |
| 5 | Revisión final (Sonnet) y re-revisión del fix | Aprobado; 0 Critical, 0 Important, 3 Minor (2 arreglados) |

### 4.3 Residuales / deuda generada

- El histograma puede sumar 101 % (Minor 2): queda anotado aquí, sin fila de deuda. No bloquea ninguna lectura del log.

## 5. Aprendizajes

- Un test de estadística con percentiles se diseña con n tal que (n − 1)·p sea entero para los percentiles que asierta: el valor esperado sale exacto y no depende del redondeo de un empate `x.xx5` en coma flotante → `tech-stack.md` (lecciones de tasks).
- Un resumen generado puede ir desfasado de sus propias filas si alguien añade una fila sin regenerar: el log decía 52 ratios con 53 filas con ratio. Regenerar siempre con el script ya es la regla (`sdd-end-task`, paso 3); no hay destino nuevo.
- El delta de la spec se fusiona en `capabilities/estimation.md`.
- Para comprometer una fecha se usa el p80 del log, no la mediana, que acierta la mitad de las veces → `estimation.md` (método).
- Revisión de skills: ninguna skill describe el contenido del resumen (búsqueda de «mediana por Tipo» y de la tabla en `skills/`, sin resultados), y el repo no tiene `.claude/skills/` → no aplica.

## 6. Adendas
