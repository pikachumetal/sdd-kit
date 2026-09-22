---
id: 20260921-162234-task-0008-control-profiles
task: 0008
title: Walkthrough — Perfiles de control y gates
spec: ./spec.md
plan: ./plan.md
status: done
created: 2026-09-22
---

# Walkthrough — Perfiles de control y gates

## 1. Cambios realizados

- **Tabla de gates por perfil, fuente única** — `skills/sdd-start-task/references/control-profiles.md` (nuevo): perfiles `pair` · `delegate` · `unattended`, precedencia task > release > proyecto, tabla de gates, desvío frente a ruling, validación diferida, `unattended`, estados cerrados del roadmap y claves de control de `sdd-kit.json` con sus defaults. `aca90a2`.
- **Arranque y ejecución** — `skills/sdd-start-task/SKILL.md`: Gate 1 con la rama `feature/<id>` de una fila pendiente, primera pregunta sola (carril, modo, lite, perfil, enunciado), propuesta de partir una task de más de 3 tasks internas, aprobación explícita, plan sin gate en `delegate` y `unattended`, rulings y bloque «Me salí del plan en…», todo commit del hilo en la revisión. `aca90a2`, `a9788cb`, `6231ec3`.
- **Overrides y review** — `overrides-superpowers.md` (rulings de `subagent-driven-development` frente al desvío; `finishing-a-development-branch` frente a la política de merge) y `review-spec.md` (ninguna por defecto, recomendada con 4 señales o más o contrato público + datos, preguntada antes de presentar). `aca90a2`, `176e680`.
- **Cierre, release y migración** — `skills/sdd-end-task/SKILL.md` (paso 0 con diferida, 1, 8 con 🧪, 10 con política de merge), `skills/sdd-end-release/SKILL.md` (las 🧪 del smoke), `migrations/v1.2.0.md` (claves de control). `95736c0`, `6231ec3`.
- **Plantillas** — `spec-template.md` (`profile:`, decisiones con el dev-lead, `## Enmiendas`, fila de cambio de perfil) y `walkthrough-template.md` (sin «inmutable», diferida, decisiones sin el dev-lead, `## 6. Adendas`). `aca90a2`, `95736c0`.
- **Anclaje** — Art. IV de la constitution (merge a la rama de integración por política declarada; rama estable y tag, siempre una persona) y glosario «Walkthrough» de `mission.md`. `95736c0`.
- **Tests** — `tests/ControlProfiles.Tests.ps1` (15 anclas, escritas por el hilo antes de cada despacho) y la evidencia `tests/control-profiles-red.md` y `tests/control-profiles-green.md`.

## 2. Tiempo: estimado vs real

- Tipo: docs
- Estimación de implementación (del plan): 6,0h
- Esfuerzo real: 2,6h (aproximado por las marcas de los commits: 19:47–20:51 del 2026-09-21 y 08:00–09:30 del 2026-09-22, con una parada por el tope semanal de uso entre medias)
- Desviación: −3,4h (−57 %)
- Causa de la desviación: los 54 sujetos corrieron en paralelo y no suman al reloj, como avisa `estimation.md` desde T10; tres implementadores cortos (5–14 min) y una revisión agrupada en lugar de cuatro. El plan volvió a estimar la campaña como espera
- Review de spec: 2 revisores (dominio y técnica) · hallazgos 14, aceptados 14

## 3. Desviaciones del plan

- **Revisión agrupada** de las Tasks 2, 3, 2b y 2c en vez de revisión por task, pedida por el dev-lead al aprobar el plan. Un Important (`review-spec.md` §3 decía «si el usuario activa»), corregido en una ronda.
- **Dos enmiendas a la spec**, aprobadas por el dev-lead: proponer partir una task grande (Task 2b; hipótesis nueva de la fila 0008 en `develop`) y recuperar la aprobación explícita, más la forma de la 🧪 no validada (Task 2c; el GREEN destapó una regresión).
- **Recorte por el RED** de la aprobación explícita (E3 pasó 2/2), reaprobado por el dev-lead y deshecho después por la segunda enmienda.
- **Cuatro escenarios del GREEN rehechos** por ruido de molde o de guion (E2, E4, E8, E9); E4 se repitió también en el brazo RED. Detalle en `tests/control-profiles-green.md`.
- **Escenario E7 añadido** (molde `m-rev`): el plan lo leía en las specs de E2 y E3, que no daban las dos señales.

### Decisiones tomadas sin el dev-lead

- Las 🧪 de la release van al paso 6 de `sdd-end-release`, que es donde vive el smoke; la skill no tiene paso «smoke» — si es mal sitio, quien lea `notas-y-roadmap.md` no lo encuentra.
- El umbral para proponer partir es «más de 3 tasks internas previstas», el mismo número que el tope de agentes en paralelo — un umbral mal elegido propone partir de más o de menos, y el usuario sigue decidiendo.
- El `sdd-kit.json` de este repo no gana `control` ni `merge` en esta task: escribirlo sin la frase del dev-lead es el atajo que la spec prohíbe — hasta que se escriba, el kit se trabaja a sí mismo en `delegate` y el cierre pregunta el merge.
- El implementador de la Task 2b usó un `git stash` temporal para ver su RED; la pila quedó vacía — si hubiera tocado una entrada de otra sesión, se habría perdido trabajo ajeno.

## 4. Verificación

### 4.1 Builds

- `pwsh -NoProfile -Command "Invoke-Pester -Path tests"` → 230 passed, 0 failed, 6 skipped (preexistentes), en el pre-commit de `27ae74f`.

### 4.2 Smoke / tests

- Validación diferida: 2026-09-22 · «Validación diferida al uso» · disparador: «Primera task real en un proyecto» — la primera task con el kit 1.2.0 en un proyecto del equipo, a cargo del dev-lead.

| # | Caso | Resultado |
| --- | --- | --- |
| 1 | RED previo a la spec: oferta de lite (2 sujetos) | la ofrecen 2/2: sin guía de oferta; la pregunta aislada de la visión la cubre (verificado por el agente) |
| 2 | RED de la Task 1 y de la enmienda (21 sujetos, 8,47 $) | E1, E4, E5 y E11 fallan 2/2; E3 pasa 2/2 (verificado por el agente) |
| 3 | GREEN (33 sujetos, 31,32 $), once escenarios | corregidos todos; E8 y E9 con un sujeto válido y otro invalidado por el harness (verificado por el agente, `tests/control-profiles-green.md`) |
| 4 | Suite Pester | 230/0 (verificado por el agente) |
| 5 | Revisión agrupada y revisión acotada de la 2c | limpias tras una ronda de fix (verificado por el agente) |

### 4.3 Residuales / deuda generada

- El carril patch sigue preguntando siempre el merge: el Art. IV nuevo lo permite («las skills que la leen»), pero falta decidir si el patch aplica la política.
- `review-spec.md` no dice qué hacer si nadie responde a la pregunta de review (Minor diferido de la revisión agrupada).
- E3 con una spec presentada no se reprodujo tal cual en el GREEN final: la primera pregunta aislada ya no deja escribir la spec en el primer turno. Lo cubren el test Pester y la regresión 1/2 del primer GREEN.
- El umbral de «más de 3 tasks internas» es orientativo y solo se midió con un tema (E11: 1/2 parte).
- La oferta de lite «que no se ve» en sesiones largas queda como posible falso negativo (RED 2/2 la ofrece).

## 5. Aprendizajes

- Un escenario de mitad de flujo tiene que cargar la skill: «acaba la task» no dispara ninguna, y los dos brazos corren sin kit → `tech-stack.md` §Fixtures y baselines.
- Un sujeto headless puede escribir a las sesiones vivas de la máquina con la mensajería de agentes → `tech-stack.md` §Sujetos headless.
- El orden de los turnos del escenario tiene que encajar con lo que el sujeto hará en el primero, y cambia cuando la guía cambia la primera pregunta → `tech-stack.md` §Fixtures y baselines.
- Un molde que contradice su propio plan (fichero «preexistente» creado en la task) da al sujeto una salida → `tech-stack.md` §Fixtures y baselines.
- Un recorte por el RED puede tener que deshacerse en el GREEN: la guía nueva de otro requisito crea la presión que el baseline no tenía → `tech-stack.md` §Fixtures y baselines.
- La campaña de sujetos volvió a estimarse como espera → ya estaba en `estimation.md` (tercer aviso); sin cambio.

## 6. Adendas

- _Ninguna_
