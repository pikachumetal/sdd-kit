---
id: 20260923-213417-task-0031-dispatch-effort
task: 0031
title: Walkthrough — Effort real al despachar
spec: ./spec.md
plan: ./plan.md
status: done
created: 2026-09-24
---

# Walkthrough — Effort real al despachar

## 1. Cambios realizados

- **Apertura** (`3c66548`): spec aprobada, plan, `tasks.md` y el RED previo a la spec (`red/`). Son cuatro sondas headless detrás de un proxy que registra el `effort` de cada petición a la API.
- **Ticket de campo a mitad de task y merge de `develop`** (`7e9f3fc`, `a3bae0a`): el freno «fichero de la task cambiado en la base» paró el despacho de la Task 1. El dev-lead lo resolvió con su orden: ticket, commit, merge y push.
- **Task 1** (`7263e43`): `agents/effort-low.md`, `effort-medium.md` y `effort-high.md` (`model: inherit`, `effort` en el frontmatter, sin `tools`). Campo `Modelo` de `plan-template.md` con el despacho literal. `review-spec.md` despacha con `sdd-kit:effort-medium` + `sonnet`. En el Art. IV, el effort omitido hereda el de la sesión y el effort viaja en el tipo de agente. `tech-stack.md` y el README dicen que los agentes solo llegan por el canal plugin. Test `tests/AgentDefinitions.Tests.ps1`.
- **Task 2, en línea** (`0db8175`): `tests/dispatch-effort-red.md`, `tests/dispatch-effort-green.md` y el molde, el lanzador y las salidas en `green/`.
- **Cierre**: este walkthrough, tres ADDED fusionados en `capabilities/task-flow.md`, el aprendizaje del proxy en `tech-stack.md`, changelog, roadmap (fila 0031 y fila de deuda), estimation-log y la ampliación del ticket de campo.

## 2. Tiempo y coste: estimado vs real

- Tipo: infra/tooling
- Estimación de implementación (del plan): 1h
- Esfuerzo real: 0,6h. Reloj del hilo, aproximado con las marcas de los commits: del merge de `develop` (`a3bae0a`, 23:43 hora local) al GREEN (`0db8175`, 23:57), más ~0,4h de revisión final, suite y cierre. Spec y plan, con el RED previo, ~0,45h aparte (desde las 23:25).
- Desviación: −0,4h (−40 %)
- Causa de la desviación: la Task 1 era texto dictado por el plan (2 min de implementador). El molde del GREEN se escribió mientras corría el implementador, y el sujeto 1 se lanzó durante la revisión de la Task 1. Otra vez estimé la campaña como tiempo de hilo, el sesgo que ya avisa `estimation.md`.
- Modelo del hilo: Opus 5.5
- Tokens del hilo: no medido
- Tokens de subagentes: 292k en 3 despachos — implementador Task 1 Sonnet 87k / 2 min; revisor Task 1 Sonnet 81k / 1 min; revisor final Sonnet 124k / 2 min
- Coste de sujetos: 4,88 $ en 6 sujetos Sonnet — RED previo a la spec 2,02 $ (4 sondas; una quinta inválida, sin medir); GREEN 2,86 $ (2)
- Review de spec: no · hallazgos 0, aceptados 0

## 3. Desviaciones del plan

- Merge de `develop` en la rama antes de despachar la Task 1 (`a3bae0a`), por el freno de alcance y con la orden del dev-lead. Los ficheros coincidían (`constitution.md` Art. I, `tech-stack.md` §Fixtures), pero no las secciones, y no hubo conflicto.
- El sujeto 1 del GREEN se lanzó durante la revisión de la Task 1, sobre `git archive 7263e43`. El plan los ponía en serie. La revisión salió limpia y no cambió lo que medía.

### Decisiones tomadas sin el dev-lead

- Implementador y revisores despachados como `general-purpose` + `model: sonnet`, con el effort de la sesión — los tipos `sdd-kit:effort-*` nacen en esta task, y la sesión carga los agentes al arrancar — si está mal, algún turno de más.
- El Minor de los tres `agents/effort-*.md` casi iguales se queda — lo manda el plan, y Claude Code no tiene plantillas de agente — si está mal, tocar tres ficheros en vez de uno.
- Revisor final con Sonnet, no con el modelo más capaz que pide superpowers — diff de texto corto y de riesgo bajo; la gama media es el suelo del Art. IV — si está mal, un hallazgo sutil sin ver.
- Paquete de la revisión final sin los `.jsonl` de evidencia (670 KB → 65 KB) — son registros crudos; el revisor los contrastó por su cuenta — si está mal, evidencia sin revisar.
- Sin sujetos de conducta en el RED previo: sondas técnicas en su lugar — el fallo es determinista (a `Agent` le falta el parámetro) y ya había cuatro reportes — si está mal, un RED de conducta sin medir.

## 4. Verificación

### 4.1 Builds

- Sin build (skills en Markdown).
- Suite completa, una vez, en el hilo: `Invoke-Pester -Path tests` → 506 pasan, 0 fallan, 6 omitidos (3,9 min).

### 4.2 Smoke / tests

- Validación diferida: 2026-09-24 · «el uso es el test» · disparador: la primera task del kit que despache un implementador con `sdd-kit:effort-*` desde un plan escrito con la plantilla nueva, en una sesión arrancada con `./Start-KitSession.ps1`, a cargo del dev-lead. El disparador lo concretó el agente.

Verificado por el agente:

| # | Caso | Resultado |
| --- | --- | --- |
| 1 | RED: despacho con solo `model: sonnet` en una sesión `high` | ejecución real: el subagente hereda `effort: high` (P2) |
| 2 | RED: agente de plugin con `effort: medium` | ejecución real: `effort: medium` en cada petición (P3) |
| 3 | GREEN: el hilo despacha con `subagent_type: sdd-kit:effort-medium` + `model: sonnet` | ejecución real, 2/2 |
| 4 | GREEN: las peticiones del subagente llevan `effort: medium` | ejecución real, 10/10 (el hilo sigue en `high`) |
| 5 | `Modelo` sin effort en el harness: «effort: no disponible en este harness, hereda el de la sesión» | suite (`AgentDefinitions.Tests.ps1`); no probado en ejecución real |
| 6 | Revisor de spec con `sdd-kit:effort-medium` + `sonnet` | suite; no probado en ejecución real |
| 7 | Revisión de la Task 1 y revisión final de rama | limpias, sin Critical ni Important |

### 4.3 Residuales / deuda generada

- Hallazgos del ticket de campo de esta sesión (RED sin commitear que tumba los commits del hilo, freno de fichero frente a sección, paquete de revisión inflado por la evidencia): se trían con el resto de tickets.
- Un plan antiguo con «Sonnet, effort medio», sin el par literal, no está medido: un hilo podría no deducir el tipo. Los planes nuevos salen de la plantilla.

## 5. Aprendizajes

- El effort de un subagente solo se ve en la petición a la API: un proxy con `ANTHROPIC_BASE_URL` lo registra, y el debug log y los transcripts no → `tech-stack.md` («Sujetos headless»).
- Si no se declara effort, el subagente hereda el de la sesión, no el defecto del modelo. Haiku 4.5 no admite effort, y el `model` del despacho pisa el de la definición → `constitution.md` Art. IV (en la Task 1) y `plan-template.md`.
- Los tipos de agente solo llegan por el canal plugin → `tech-stack.md` §Distribución (en la Task 1).

## 6. Adendas
