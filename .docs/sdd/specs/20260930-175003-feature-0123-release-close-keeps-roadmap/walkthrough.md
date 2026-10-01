---
id: 20260930-175003-feature-0123-release-close-keeps-roadmap
feature: 0123
title: Walkthrough — El cierre que mantiene el roadmap en la forma de la plantilla
spec: ./spec.md
plan: ./plan.md
status: done
created: 2026-09-30
---

# Walkthrough — El cierre que mantiene el roadmap en la forma de la plantilla

## 1. Cambios realizados

- **Apertura** (`15632e34`): spec aprobada por delegación, plan de tres tasks en Native y `tasks.md`.
- **`sdd-end-release`** (Task 1, `df960d6f`): el paso 4 ejecuta `Test-Roadmap.ps1` antes de colapsar. Con un fallo de forma no corta desde esa sección: lo dice y propone el paso de `migrations/v2.3.0.md` con su gate. Tras colapsar exige `Roadmap válido` antes del commit y del paso 5. La diferida no mencionada sale de la sección abierta y su id va a `validaciones pendientes:`, y el smoke pregunta por las de las líneas de releases anteriores que dispara. En `notas-y-roadmap.md`: qué sale en el colapso y que la release nueva va arriba. Tres red flags y tres racionalizaciones con frases del RED. Tests en `tests/ReleaseFlow.Tests.ps1`.
- **`sdd-roadmap`** (Task 2, `ad2d6bda`): «Algo concreto» ya no admite una sección que pide el usuario fuera de la plantilla. Nuevo paso 5 del checklist, «Comprueba la forma», con el validador tras escribir; «Publica la reserva» y «Cierra» pasan a 6 y 7. Tests en `tests/RoadmapClosing.Tests.ps1`.
- **`sdd-end-feature` y `sdd-end-patch`** (Task 3, `d15d1ae7`): el paso del roadmap ejecuta el validador, corrige lo propio y avisa de lo heredado sin parar. La fila de `Test-Roadmap.ps1` del índice de `sdd-templates` dice quién lo ejecuta y si bloquea o avisa. Tests en `tests/RoadmapClosing.Tests.ps1`.
- **Campaña**: molde `salas` y cinco escenarios en `red/subject.sh`; evidencia en `tests/release-close-roadmap-red.md` y `-green.md`.
- **Capacidades**: `release-flow` (dos `MODIFIED`, dos `ADDED`), `planning` (un `ADDED`) y `roadmap` (un `ADDED` y la regla «Avisos»).

## 2. Tiempo y coste: estimado vs real

- Tipo: docs
- Estimación de implementación (del plan): 3h
- Esfuerzo real: 2,4h — reloj del hilo aproximado con las marcas de los commits: apertura 19:54, última task 20:16 y cierre ~22:20 (hora local), incluidas las esperas de la campaña, la revisión final y la suite completa. Antes de la apertura, ~0,7h de spec y plan
- Desviación: −0,6h (−20 %)
- Modelo del hilo: Opus 5.5, effort no registrado (toda la feature; el dev-lead aprobó la spec por delegación sin la parada para bajar de modelo)
- Tokens del hilo: 31.067.760 — claude-opus-5-5 31.067.760
- Tokens de subagentes: 1.916.193 en 1 despacho — Revisor final 0123 claude-opus-5-5 1.916.193 / 6 min
- Coste de la sesión: 15,46 $ (hilo 14,33 $ + subagentes 1,13 $)
- Coste de sujetos: 4,32 $ en 21 sujetos Sonnet — `r1`/`r2` 1,55 $ (8 más 1 de control) · `p1` 0,52 $ (4) · `c1`/`c2` 1,96 $ (8)
- Review de spec: no · hallazgos 0, aceptados 0

## 3. Desviaciones del plan

- La campaña costó 4,32 $ y 21 sujetos, frente a los ~12 $ y 24 previstos: los cierres salieron en 8 a 12 turnos, no en los 60 que el plan temía.

### Decisiones tomadas sin el dev-lead

- La línea 3 del Review Focus decía que el molde de `c1` llevaba la fila de la 0030 con un estado heredado. El molde la pone en «Próximo» con `🔄`, porque en «Versión siguiente» el validador no mira estados y el fallo propio no se habría producido. La corrección de un fallo propio del cierre queda sin escenario; la cubren la frase del paso y la lectura — coste si está mal: un cierre que escribe un estado fuera de la plantilla no se ha medido.

### Minors diferidos de la revisión final

Revisión final: `sdd-kit:effort-high` + `opus` sobre `d15d1ae7`, *With fixes*, 0 Critical, 0 Important, 10 Minor. No entran en una pasada de fix: arreglarlos en una skill exige su propia campaña (Art. I). Van a una fila de deuda del roadmap.

- La cláusula «un fallo en una línea que escribió el cierre lo corriges» de `sdd-end-feature` y `sdd-end-patch` no tiene escenario (`no probado`, abajo).
- `tests/ControlProfiles.Tests.ps1:104` lleva un nombre que describe la conducta anterior («conserva la forma con disparador nuevo»).
- `.docs/workflow/usage-guide.md:182` dice que la diferida no validada «sigue 🧪»: se corrige en la relectura del cierre de la 2.3.0.
- La red flag de `Roadmap válido` de `sdd-end-release` no exceptúa `Sin roadmap que validar`.
- El paso 4 de `sdd-end-release` nombra solo `walkthrough.md` para la adenda; falta «(en un patch, en `patch.md` §4)».
- Citas de evidencia: K1 por K2 en los cierres; «me lo pediste» es de `p1-2`, no de 2/2; P3 sin ruta. El recuento de R3 del GREEN ya está corregido a «2/2 donde colapsa».
- El paso 4 de `sdd-end-release` no dice que los fallos previos que no son de forma (saldadas, patches, filas publicadas) los resuelve el colapso.
- Una `🧪` publicada con otro disparador no se nombra en el paso 4 como id de `validaciones pendientes:` (`notas-y-roadmap.md` lo cubre en genérico).
- La red flag «Una feature publicada… sigue como fila» mezcla `✅` y `🧪`.
- `tests/RoadmapClosing.Tests.ps1:86` es un negativo literal; falta afirmar «la plantilla no la admite».

Del «Declined to judge» del revisor: la 0017 no mencionada pasa de la línea de la v1.2.0 a la de la v1.3.0, como fija el MODIFIED aprobado; la migración v2.3.0 deja el id en la release que lo publicó. Se queda así; lo puede cambiar el dev-lead.

## 4. Verificación

### 4.1 Builds

- Suite completa: `pwsh -NoProfile -Command "Invoke-Pester -Path tests"` → 1141 en verde, 0 fallos, 10 omitidos · 463 s
- `Test-Roadmap.ps1 -Path .docs/sdd` sobre el roadmap del repo → `Roadmap válido`
- `Test-Capabilities.ps1 -Path .docs/sdd -Artifact <spec.md>` → `Capacidades válidas: 14`

### 4.2 Smoke / tests

- Validación diferida: 2026-09-30 · «Diferir: lo pruebo en el primer sdd-end-release de un proyecto del equipo con la 2.3.0, a cargo del dev-lead.» · disparador: el primer `sdd-end-release` de un proyecto del equipo con la 2.3.0, a cargo del dev-lead

Verificado por el agente, con los sujetos headless del GREEN (`green/out/`):

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| El corte no arranca desde una sección fuera de la plantilla sin decirlo | ejecución real (`r1-1`, `r1-2`) | lo dice, propone el paso de `migrations/v2.3.0.md` con su gate, deja pendientes el paso 4 y el 5 |
| El corte deja el roadmap válido | ejecución real (`r2-1`, `r2-2`, `r2-3`) | `Roadmap válido`; salen la deuda saldada, el patch y las filas publicadas; la 0024 queda en «Próximo» |
| MODIFIED «Se puede cerrar una release que no se abrió» | no probado | sin escenario propio |
| MODIFIED «El smoke valida las diferidas»: la no mencionada | ejecución real (`r2`) | 0017 y 0022 con adenda y en `validaciones pendientes: 0017, 0022` |
| MODIFIED «El smoke valida las diferidas»: la mencionada | no probado | en `r2` solo se mencionó la 0021, que no era diferida |
| `sdd-roadmap` solo escribe en las secciones de la plantilla | ejecución real (`p1-1`, `p1-2`) | Backlog `B2`, sin sección nueva, `Roadmap válido` |
| Los cierres avisan de lo heredado sin bloquear | ejecución real (`c1-1`, `c1-2`, `c2-1`, `c2-2`) | 4/4 ejecutan el validador, no tocan lo heredado y avisan |
| Los cierres corrigen un fallo propio | no probado | el molde no produce un fallo propio |

### 4.3 Residuales / deuda generada

- Validar una diferida después del corte, fuera de un cierre de release (decisión 8 de la spec): fila de deuda en el roadmap.
- Los 10 Minor de la revisión final: fila de deuda en el roadmap.

## 5. Aprendizajes

- Un molde que mide un corte por fechas tiene que llevar fechas anteriores a hoy: la spec usaba el 2026-10-05 como ejemplo, pero los sujetos cortan con la fecha real, y un patch del 2026-10-02 no habría salido en un corte del 2026-09-30 → `tech-stack.md` (campañas headless).
- Un sujeto del RED puede dar la conducta buscada por iniciativa propia: `c1-2` ejecutó el validador que encontró en la copia del kit. Con 1 de 4 se escribió la guía, porque salía de una fuente incidental (Art. I) → sin destino nuevo: la regla ya está en el Art. I.

## 6. Adendas

- 2026-10-01 · Validación en campo: este repo pasa a `validation.mode: field` con la feature 0118 (decisión del dev-lead del 2026-09-29). La validación diferida de arriba se cierra con la verificación del agente que ya consta en la sección 4; el uso real llega por los tickets de `sdd-feedback`.

