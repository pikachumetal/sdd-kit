---
id: 20260908-095857-task-0000-workflow-ejecucion
task: 0000
title: Workflow y ejecución — agente por defecto y política de modelos desde el plan
mode: full
status: approved
created: 2026-09-08
author: Àngel Delgado
approvers:
  - role: dev-lead
    name: Àngel Delgado
    approved_at: 2026-09-08
---

# Spec — Workflow y ejecución: agente por defecto y política de modelos desde el plan

## 1. Contexto

- **Problema u oportunidad**: el kit prescribe hoy lo contrario de la práctica real del equipo. Estado verificado en el repo el 2026-09-08:

  - `sdd-start-task` paso 6 manda `superpowers:executing-plans` **en línea con checkpoints**, y `references/overrides-superpowers.md` marca `subagent-driven-development` como *"Se evita"*.
  - `test-driven-development` y `requesting-code-review` **no se mencionan en ninguna skill del kit** (0 coincidencias en `skills/`).
  - `plan-template.md` no tiene ningún campo por task: ni `Modelo` ni modo de ejecución. Sí tiene el bloque "Restricciones globales" que introdujo T1.

  La política que sí existe vive solo en un proyecto consumidor (Alybo, `.claude/CLAUDE.md`), no en el kit. Eso contradice la misión: *el resultado debe depender del proceso, no del criterio individual de quien ejecuta*.

- **Restricción de contexto que gobierna la decisión**: al dev-lead **le piden No-Code en su trabajo** — la implementación la teclea el agente, no la persona. No es una preferencia de estilo: es un requisito del encargo, y el default del kit tiene que reflejarlo.

- **Tensión declarada**: el `CLAUDE.md` global del dev-lead prefiere ejecución en línea "salvo que el proyecto indique otra cosa". Esta spec hace que el kit indique otra cosa, amparándose en esa misma cláusula. Consecuencia asumida: para otros proyectos sin kit, el `CLAUDE.md` global seguirá prefiriendo la ejecución en línea, y eso está bien — son ámbitos distintos.

- **Evidencia propia en contra, y por qué no bloquea**: la task inmediatamente anterior (`progressive-disclosure`) se ejecutó en línea, y sus checkpoints atraparon dos decisiones que un ejecutor aislado habría resuelto solo (las fixtures inexistentes y el veredicto de `sdd-consult`). Lo que esa experiencia demuestra no es que el agente sea peor: es que **hacen falta puntos de aprobación**, y `subagent-driven-development` los trae de serie con su revisión entre tasks. El checkpoint no desaparece, cambia de sitio: de "corriges mientras se escribe" a "apruebas cada task terminada antes de la siguiente".

- **Stakeholders**: lo pide el dev-lead; lo consumen los proyectos que instalan el kit; lo mantiene el kit.

## 2. Objetivo

- **Qué construimos (one-liner)**: llevar al kit la política de ejecución real —agente por defecto, modelo declarado y aprobado en el plan, TDD por predicado y code-review antes del cierre— y validarla con el régimen de test que corresponda a cada pieza.

- **Definición de éxito**:
  1. `sdd-start-task` prescribe `superpowers:subagent-driven-development` como default, y la ejecución en línea como excepción que el plan declara con motivo.
  2. `plan-template.md` obliga a un campo **`Modelo`** por task y admite un campo **`Ejecución`** que solo aparece cuando la task se desvía del default.
  3. Las "Restricciones globales" del plan recogen la política de modelos: el más barato que resuelva bien la tarea; nunca `fable` ni `opus xhigh` por defecto.
  4. ~~`test-driven-development` entra por predicado observable~~ — **RECORTADO por el RED (2026-09-08)**: el baseline hace test-primero sin que nadie lo nombre, empujado por el artículo de testing de la constitution del proyecto. Guidance sin fallo que la respalde → no se escribe (Art. I). Ver [`tests/workflow-ejecucion-red.md`](../../../../tests/workflow-ejecucion-red.md).
  5. `sdd-end-task` invoca `superpowers:requesting-code-review` antes de cerrar — **CONDICIONADO en la implementación (2026-09-08)** a las tasks ejecutadas en línea: `subagent-driven-development`, el default nuevo, ya revisa cada task y la rama entera, y duplicarlo viola el Art. IX. Ver `walkthrough.md` §3.
  6. Un ejecutor que **solo ve su task** recibe las "Restricciones globales" del plan. **Reformulado tras el RED**: el ejecutor NO las hereda por sí solo (0 de 2 respetaron una restricción no inferible del código), así que la obligación recae en **quien despacha** — `sdd-start-task` exige que viajen en el encargo del subagente.
  7. Las conductas ya validadas de `sdd-start-task` y `sdd-end-task` (gates, enrutado, Definition of Done) siguen intactas tras la edición.

- **NO objetivos**:
  - **El contrato de worktrees.** T3 mencionaba "cierre = merge a `develop` local y worktree borrado por el usuario". La parte de worktrees choca con el override vigente ("el kit no gestiona worktrees desde el flujo") y es exactamente la decisión que **T4 tiene bloqueada** pendiente de resolver si el contrato va al kit o a nivel 2. Meterla aquí adelantaría media T4. El merge sigue siendo decisión del usuario (Art. IV), que ya es cierto y no necesita cambio.
  - Crear un catálogo de modelos por tipo de tarea. La política fija el criterio ("el más barato que resuelva bien") y dos prohibiciones; qué modelo concreto va a qué task lo decide el plan y lo aprueba el usuario.
  - Tocar `sdd-consult`, los carriles patch y release, o las skills de init.

## 3. Decisión clave

- **Opción elegida — agente por defecto, con excepción por task justificada en el plan.** El kit fija `subagent-driven-development` como modo de ejecución por defecto. Una task puede declarar `Ejecución: en línea` cuando el trabajo no se beneficia de la delegación —exploración con el usuario delante, decisiones de producto en vivo, edición de una línea— y esa desviación se aprueba con el plan, igual que el campo `Modelo`. Lo que no declara nada se lee como el default.

  Combina las dos formas que el dev-lead planteó: un default claro que responde al requisito No-Code, y la decisión informada task a task para los casos donde delegar no aporta.

- **Alternativa descartada — default agente puro, sin excepciones**: más simple de enunciar y de cumplir, pero fuerza la delegación en tasks donde el ida y vuelta con el usuario *es* el trabajo. El propio kit tiene tasks así (una entrevista de `sdd-init-greenfield` no se delega).

- **Alternativa descartada — sin default, decisión obligatoria por task**: obliga a pensarlo cada vez, pero sin default escrito la decisión vuelve a depender de quién ejecuta — justo lo que la mission quiere evitar.

- **Alternativa descartada — mantener el default en línea y escribir solo un predicado de cuándo delegar**: era la recomendación inicial, apoyada en que los subagentes no permiten corrección en tiempo real. Se descarta porque el requisito No-Code no es negociable desde el kit, y porque la revisión entre tasks de `subagent-driven-development` cubre la necesidad de control que motivaba el default anterior.

## 4. Especificación funcional

### 4.1 Campos del plan

| Campo | Obligatoriedad | Contenido |
| --- | --- | --- |
| `Modelo` | **Obligatorio en cada task** | El modelo asignado a esa task. Criterio: el más barato que resuelva bien el trabajo. Prohibido por defecto: `fable` y `opus xhigh` — solo con justificación escrita en la propia task. |
| `Ejecución` | Solo si la task se desvía del default | `en línea`, más una línea de motivo. Su ausencia significa el default (agente). |

La política que gobierna ambos campos vive en **"Restricciones globales"**, el bloque que T1 introdujo y que `writing-plans` 6.3.0 define como heredado implícitamente por toda task. Esto es deliberado y es lo que el criterio 6 verifica: un ejecutor que solo ve su task necesita heredar el default sin que su task lo repita.

### 4.2 Predicado de TDD

| Si… | Entonces… |
| --- | --- |
| El proyecto declara tests automáticos ejecutables (`tech-stack.md` o el manifest) | La task se implementa con `superpowers:test-driven-development`; el ciclo test-primero es parte de sus pasos |
| No los hay | Smoke manual documentado, que es lo que `plan-template.md` §2 ya prescribe |

Coherente con los módulos por predicado observable que el kit ya usa (`estimation.md`, `changelog.md`): la capacidad se activa por la presencia de algo verificable, no por configuración.

### 4.3 Code-review

`superpowers:requesting-code-review` se invoca **antes** del cierre, con o sin tests, como paso del checklist de `sdd-end-task`. Es lo único de esta spec que no depende de ningún predicado: un cambio revisado por otro par de ojos no tiene condición de stack.

### 4.4 Historias

- Como dev-lead con requisito No-Code, quiero que el kit delegue la implementación por defecto, para no tener que pedirlo en cada plan.
- Como dev-lead, quiero aprobar el modelo de cada task junto con el plan, para que el coste sea una decisión mía y no del agente que ejecuta.
- Como ejecutor que solo ve su task, quiero conocer el modo de ejecución y las restricciones del proyecto sin que mi task las repita, para no inventarme el default.
- Como revisor, quiero que ninguna task se cierre sin code-review, tenga tests automáticos o no.

### 4.5 Edge cases

- **Task que se desvía sin motivo escrito**: `Ejecución: en línea` sin justificación es un plan incompleto; el gate del plan lo rechaza igual que un placeholder.
- **Proyecto con tests que no se pueden ejecutar** (falta toolchain, como la fixture de brownfield de la task anterior): el predicado mira tests *ejecutables*; si no lo son, cae al smoke documentado y se anota como deuda.
- **El propio kit no tiene tests automáticos**: cae por predicado en smoke documentado. La política no obliga a inventar un framework donde no lo hay.
- **Una task de exploración con el usuario delante** (entrevista de init, brainstorming): es el caso típico de `Ejecución: en línea`.

## 5. Datos

No aplica.

## 6. UX

No aplica.

## 7. Constraints técnicos

### 7.1 Compatibilidad con la constitution

- [x] Art. I — Ley de hierro de skills: cada pieza va con el régimen que le toca — **RED clásico** para la guidance nueva (política de modelos, default de ejecución, TDD, code-review) y **A/B de no-regresión** para la edición de `sdd-start-task` y `sdd-end-task`, que ya tienen conducta validada. El detalle de la campaña va en `plan.md`.
- [x] Art. II — La forma sigue al fallo: la guidance nueva solo se escribe si el baseline la reclama.
- [x] Art. III — Idioma.
- [x] Art. IV — Convenciones: el merge sigue siendo decisión del usuario; no se cambia ninguna otra convención impuesta a los proyectos.
- [x] Art. VII — Dogfooding.
- [x] Art. VIII — `plan-template.md` se edita en su única fuente, `skills/sdd-templates/templates/`.

### 7.2 Dependencias

- superpowers 6.3.0: `subagent-driven-development`, `test-driven-development`, `requesting-code-review` y el `Global Constraints` de `writing-plans`.
- T1 cerrada: el bloque "Restricciones globales" que esta spec convierte en portador de la política.
- T2 cerrada: `sdd-start-task` y `sdd-end-task` ya partidas en `SKILL.md` + `references/`; las ediciones caen sobre esa estructura.

### 7.3 Ampliación de la constitution

- **Artículo**: Art. IV — Convenciones que el kit fija a los proyectos.
- **Ampliación propuesta**: el **modo de ejecución por defecto** (agente, con excepción declarada en el plan) y la **política de modelos** son convención del kit, no preferencia de quien ejecuta. Un proyecto consumidor puede desviarse, pero por escrito en su propia constitution.
- **Política de modelos, redacción final (2026-09-08)**: ~~el más barato que resuelva bien~~ → **la de `subagent-driven-development`**, no una propia (Art. IX regla 1): modelo y effort explícitos siempre, gama media como suelo para revisores e implementadores de prosa, el tier más barato solo para transcripción y arreglos mecánicos; `fable` y `opus xhigh` siguen prohibidos por defecto. Motivo: superpowers mide que el modelo barato da 2-3× turnos y sale más caro. Ver `walkthrough.md` §3.
- **Aprobado por**: dev-lead, en el gate de esta spec.

## 8. Riesgos

| Riesgo | Probabilidad | Impacto | Mitigación |
| --- | --- | --- | --- |
| El baseline ya delega y elige modelo bien, y la guidance sobra | Media | Bajo | Es un resultado válido (Art. I): recorta el alcance, no lo rompe. Ocurrió en T1 con el mapeo de vías |
| Perder la corrección en tiempo real que hoy dan los checkpoints | Media | Alto | El default es `subagent-driven-development`, que trae revisión entre tasks; y la excepción por task existe justo para el trabajo que necesita al usuario delante |
| Un ejecutor aislado no hereda las "Restricciones globales" y se inventa modelo o modo | Media | Alto | Es el criterio 6 y tiene escenario propio; si falla, la conclusión es que los campos deben repetirse por task (la opción que se descartó) |
| La edición degrada conductas ya validadas de `sdd-start-task` / `sdd-end-task` | Baja | Alto | A/B de no-regresión contra la versión vigente, con los escenarios de sus `*-ab.md` y `*-green.md` |
| Contradicción visible con el `CLAUDE.md` global del dev-lead | Alta | Bajo | Declarada en §1; la propia cláusula del `CLAUDE.md` la autoriza ("salvo que el proyecto indique otra cosa") |

## 9. Rollout

Directo. El kit es local-only; los cambios llegan al working tree y se distribuyen al cerrar la release v0.6.0.

## 10. Open questions

- [ ] Modelo y coste de la campaña de test — se propone en `plan.md` y lo confirma el dev-lead antes de lanzar subagentes.
- [ ] Si el RED demuestra que el baseline ya delega y elige modelo con criterio, ¿se escribe igualmente la política por convención (para no depender del modelo de turno) o se recorta el alcance? — dev-lead, al cerrar el RED.

## 11. Aprobaciones

| Rol | Nombre | Fecha | Estado |
| --- | --- | --- | --- |
| dev-lead | Àngel Delgado | 2026-09-08 | aprobada |

Aprobada en conversación el 2026-09-08, incluida la ampliación del Art. IV de la §7.3.
