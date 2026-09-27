---
id: 20260924-231636-task-0062-plan-entry
task: 0062
title: Walkthrough — sdd-roadmap, una sola puerta de entrada al roadmap, con el carril proposal
spec: ./spec.md
plan: ./plan.md
status: done
created: 2026-09-25
---

# Walkthrough — `sdd-roadmap`, una sola puerta de entrada al roadmap, con el carril `proposal`

## 1. Cambios realizados

- **RED** (`7dd6237`): 22 sujetos sobre el repo de juguete `salas`, once escenarios (`tests/sdd-roadmap-red.md`). Fallan seis frentes; dos guías se recortan porque salieron limpias 2/2 de una fuente no incidental («tras NNNN» al arrancar y la reproducción con una entrada mínima).
- **`Get-NextSddId.ps1` reconoce el carril `proposal`** (`196d46b`): patrón `-(?:task|patch|proposal)-(\d{4})[a-z]*-`, dos fixtures y dos tests Pester. `Build-EstimationLog.ps1` ya ignoraba las propuestas.
- **Plantilla de la propuesta y carril en las plantillas** (`6fd3a98`): `proposal-template.md` (porqué, reglas con ejemplos con datos, capacidades, reparto sin estado, acta, enmiendas), `proposal:` en `spec-template.md`, `(task|patch|proposal)` en `nombrado.md` y en el índice de `sdd-templates`, «tras NNNN» en `roadmap-template.md`.
- **Skill nueva** (`ff2d592`, renombrada en `cda449d`): `skills/sdd-roadmap/SKILL.md`, cinco entradas y la preparación de una release, sin arrancar nada; línea en `hooks/router.md` y fila en el README.
- **Retirada de `sdd-start-release`** (`41f99a5`): skill borrada; README, `sdd-consult`, `architecture.md`, `mission.md` y `.docs/workflow/` la sustituyen; paso de aviso en `migrations/v1.2.0.md`; los tests que la leían leen `sdd-roadmap`.
- **Rama sin id** (`debb31f`, acotada en `3180924`): `nombrado.md` y el paso 2 de `sdd-start-patch` renombran una `feature/<slug>` sin id y sin commits propios con `git branch -m feature/<id>-<slug>`; nunca la rama de integración ni la estable.
- **GREEN** (`4c0d835`, `b17a930`, `cc2c828`, `cf95a79`): 32 sujetos (`tests/sdd-roadmap-green.md`).
- **Arreglos de la revisión final** (`3180924`): la regla de «task en marcha» vale para toda entrada; el renombrado se acota.
- **Renombrado `sdd-plan` → `sdd-roadmap`** (`cda449d`) y **quinta salida del paso 2 de `sdd-start-task`** hacia `sdd-roadmap` (`e68cd50`).
- **Integraciones de `develop`**: `b8e7312` (antes de la Task 4, freno de alcance) y `be1442b` (antes del cierre, con 10 salidas de sujetos saneadas para `SubjectOutputPrivacy.Tests.ps1`).
- **Cierre**: capacidad nueva `planning`; MODIFIED en `release-flow`, `roadmap` y `task-ids`; ADDED en `routing`. Art. IV de la constitution con el carril `proposal`.

## 2. Tiempo y coste: estimado vs real

- Tipo: docs
- Estimación de implementación (del plan): 3,25 h (punto medio del rango 2,5–4 h)
- Esfuerzo real: 4,2 h — reloj del hilo aproximado con las marcas de los commits y de las carpetas de los sujetos: ~0,3 h la noche del 24 (primera pregunta, previsión y primer lote del RED, hasta la pausa del dev-lead) y ~3,9 h el 25 de 09:00 a 12:55 (segundo lote del RED, spec con review, plan, seis tasks, GREEN, revisión final, renombrado, REFACTOR y cierre). Spec y plan, ~0,9 h; implementación y cierre, ~3,3 h.
- Desviación: +0,05 h sobre el tope del rango (+29 % sobre el punto medio)
- Causa de la desviación: dentro del ±30 %. Lo que no estaba en el plan: el renombrado de la skill a petición del dev-lead, su REFACTOR con dos tandas de sujetos y dos integraciones de `develop`.
- Modelo del hilo: Opus 5.5, effort no registrado
- Tokens del hilo: 80.699.069 — claude-opus-5-5 80.699.069
- Tokens de subagentes: 3.634.753 en 4 despachos — Revisor de spec, lente técnica claude-sonnet-5 1.301.162 / 7 min; Revisor de spec, lente dominio claude-sonnet-5 241.489 / 4 min; Revisión final de la rama 0062 claude-opus-5-5 1.415.319 / 3 min; Revisión del renombrado y REFACTOR claude-opus-5-5 676.783 / 1 min
- Coste de la sesión: 29,33 $ (hilo 25,76 $ + subagentes 3,58 $)
- Coste de sujetos: 14,70 $ en 54 sujetos Sonnet — RED 5,92 $ (22); GREEN 5,99 $ (22); verificación de la revisión final 0,67 $ (2); enrutado tras el renombrado 1,17 $ (4); REFACTOR 0,72 $ (3); control p7 0,23 $ (1)
- Review de spec: 2 revisores · hallazgos 10, aceptados 9

## 3. Desviaciones del plan

- **Develop integrado antes de la Task 4** (`b8e7312`): freno de alcance, porque la 0063 había cambiado `README.md` y `ReleaseFlow.Tests.ps1`. Lo decidió el dev-lead; enmienda de la spec.
- **La skill cambia de nombre**, de `sdd-plan` a `sdd-roadmap` (`cda449d`): lo pidió el dev-lead tras hablarlo con otro dev del equipo; enmienda de la spec con su frase.
- **REFACTOR tras el renombrado** (`e68cd50`): quinta salida en el paso 2 de `sdd-start-task`, que el plan dejaba fuera. El techo de la campaña pasó de 50 a 53 y luego a 54 sujetos, cada vez por decisión del dev-lead.
- **Verificaciones fuera del plan**: p11 (tras la revisión final), el enrutado con el nombre nuevo, el REFACTOR y p7 como control.

### Decisiones tomadas sin el dev-lead

- En el RED de la Task 4, el test «solo la nombra sdd-end-release» admite también `migrations/v1.2.0.md`: contradecía el test que exige que la migración avise de la retirada — coste si está mal: una mención viva más sin cazar, en un fichero histórico.
- `MigrationInitParity` cuenta el paso nuevo «`sdd-start-release` retirada» en la lista de pasos de la v1.2.0 — coste: ninguno, es el contrato que cambia la spec.
- El renombrado toca también `skills/sdd-end-release/SKILL.md`, de la 0063 ya fusionada, que nombraba `sdd-plan` — coste: un conflicto de una palabra si la 0063 reabre.
- Al integrar `develop` para el cierre, 10 salidas de sujetos se sanean con `tools.mjs --clean` de la 0009 y el lanzador pasa a usarlo — coste: ninguno, solo cambia el home por `<home>`.
- La spec gana el bloque «## Capacidades» que exige la 0070, fusionada en `develop` después de aprobarla — coste: ninguno, no cambia el delta.
- `tests/Test-Capabilities.Tests.ps1` (de la 0070) fijaba 13 capacidades en el repo; con `planning` son 14, y el test pasa a contar los ficheros de `capabilities/` en vez de fijar el número — coste: ninguno.
- La evidencia de p11-2 guarda su propuesta como `…-proposal-0014-salas-libres/`, más corta que la del sujeto, por el límite de 140 caracteres de ruta — coste: ninguno.
- **Minors diferidos** de la revisión final de la rama: tests de `PlanEntry` que pasan por casualidad (el literal «otro id o ninguno», «sin preguntar», «sequence», el código de `WorkflowDocs`); «`-Count N`» frente a «N + 1 con propuesta» y qué id toma la propuesta; en `tracker`, qué id llevan las filas de una reunión o de algo grande; con `hasRecipient: true` no dice que pregunte si la release está comprometida; el paso 5 de la v1.2.0 dice «Sin predicado» frente a su cabecera.
- **Minors diferidos** de la revisión del renombrado: la salida del paso 2 de `sdd-start-task` habla de «la definición de una propuesta ya repartida» y la `description` de `sdd-roadmap` de «algo ya planificado»; «sin pedir que se haga nada todavía» frente al «actualiza lo que haga falta» que la motivó; la partición que propone `sdd-start-task` crea filas y conviene decir que no activa la salida; «14.47 $» con punto en la evidencia GREEN.

## 4. Verificación

### 4.1 Builds

- Sin build. Suite completa `pwsh -NoProfile -Command "Invoke-Pester -Path tests"` tras el renombrado y el REFACTOR: **731 de 731 en verde**, 8 omitidos por diseño (verificado por el agente, `.superpowers/sdd/plan/gate-full3.txt`). Tras integrar `develop` para el cierre, el hook del merge pasó la suite rápida: 711 en verde.

### 4.2 Smoke / tests

- Validación diferida: 2026-09-25 · «diferido al uso» · disparador: el primer uso real de `sdd-roadmap` en un proyecto (una reunión con el cliente o preparar una release), a cargo del dev-lead

| # | Caso | Resultado |
| --- | --- | --- |
| 1 | `Get-NextSddId.ps1` con `proposal-0020` y `proposal-0020a` en disco | ✅ propone `0021` (verificado por el agente, Pester) |
| 2 | GREEN de los seis frentes (propuesta, items del gestor, reunión, «prepara la release», rama sin id, enmienda) | ✅ 2/2 cada uno (verificado por el agente, sujetos) |
| 3 | Controles del GREEN (fila concreta, reordenar, «tras NNNN», rama con otro id, reproducción mínima) | ✅ 2/2, sin regresión |
| 4 | Task en marcha ante una reunión de su tema (p11), tras la revisión final | ✅ 2/2 |
| 5 | Enrutado con el nombre `sdd-roadmap` (p1, p4, p6, p10) y tras el REFACTOR (p10 ×2, p2, p7) | ✅ salvo p10-3 antes del REFACTOR, que motivó la quinta salida |
| 6 | `Test-Capabilities.ps1` tras fusionar el delta | ✅ «Capacidades válidas: 14» |

### 4.3 Residuales / deuda generada

- Filas nuevas en la deuda técnica del roadmap (decisión del dev-lead en la validación): los Minor diferidos de `sdd-roadmap`; `feedback-template.md` sin nadie que lo escriba; la mención a `sdd-start-release` en la línea 11 de `sdd-end-release`.
- Pendientes que ya tenían fila: la dependencia de corte entre tasks del ticket de la 0063 §2.

## 5. Aprendizajes

- **El nombre de una skill forma parte de su enrutado**: con «actualiza lo que haga falta», 2 de 2 sujetos se pasaban solos a `sdd-plan` y 0 de 1 a `sdd-roadmap`. Renombrar una skill obliga a volver a medir el enrutado, como una edición de su `description` → `architecture.md` (anatomía de una skill).
- **Una salida de sujeto versionada no copia `.docs/` entero**: con las carpetas de `specs/` de los sujetos debajo, las rutas pasaban de 140 caracteres; el lanzador guarda solo `roadmap.md` y `specs/`, y extrae con el `tools.mjs` de la 0009, que sanea el home → `tech-stack.md` (fixtures y baselines).
- **El carril `proposal` es convención del kit**: el Art. IV nombra ahora `(task|patch|proposal)` → `constitution.md`.

## 6. Adendas
