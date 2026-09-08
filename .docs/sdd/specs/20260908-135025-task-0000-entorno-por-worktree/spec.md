---
id: 20260908-135025-task-0000-entorno-por-worktree
task: 0000
title: Entorno por worktree — contrato al kit, scripts al proyecto
mode: full
status: approved
created: 2026-09-08
author: Àngel Delgado
approvers:
  - role: dev-lead
    name: Àngel Delgado
    approved_at: 2026-09-08
---

# Spec — Entorno por worktree: contrato al kit, scripts al proyecto

## 1. Contexto

- **Problema u oportunidad**: T4 lleva desde el 2026-09-07 bloqueada por una decisión de nivel: el kit es nivel 1 (agnóstico de stack) y los scripts de entorno de Alybo son nivel 2/3. Mientras tanto, T3 (2026-09-08) invirtió el default de ejecución a `subagent-driven-development`, cuyo setup **crea o verifica un worktree** vía `using-git-worktrees` — y el override vigente del kit sigue diciendo *"el kit no gestiona worktrees desde el flujo (no invoca esta skill ni crea entornos)"*. Contradicción viva desde T3.

  Estado verificado el 2026-09-08:

  | Qué | superpowers 6.3.0 | Kit hoy |
  | --- | --- | --- |
  | Crear worktree (tool nativo `EnterWorktree` preferido) | `using-git-worktrees` Step 1 | override lo niega |
  | Instalar dependencias en el worktree (`npm`, `pip`, `poetry`, `cargo`, autodetectado) | Step 2 | — |
  | Baseline limpio (tests) | Step 3 | — |
  | Borrar el worktree al cerrar, **decisión del usuario** (3 opciones) | `finishing-a-development-branch` Step 6 | override lo niega; T3 lo pedía |
  | **Entorno más allá de dependencias**: BD, puertos, `.env`, seed, servicios | **no** | **no** |

  Alybo resolvió ese último hueco por su cuenta: `.docs/sdd/environments.md` (3183 palabras), marcador `.aly-env.json` con `state: active|cleaned`, entradas `env:setup` / `env:clean` / `env:preflight`, puertos sorteados en `30000–49151` con sonda, y `worktree:new/remove` que su propio `orca-setup.mjs` reconoce superados: *"Orca ya hace lo que `new-worktree.mjs` hacía… lo único que no sabe hacer es generar la configuración de entorno del repo"*. El hueco está identificado y resuelto en un proyecto; el kit no lo conoce.

- **Stakeholders**: el dev-lead (que ya paga el coste en Alybo); los proyectos nuevos que arranquen con `init-*` y usen worktrees; el kit.

- **Restricciones conocidas**: Art. IX (adoptar superpowers, aportar lo propio, extender solo ante hueco demostrado); Art. VIII (la plantilla del contrato vive en `sdd-templates`); Art. I (ninguna edición sin ciclo de test); decisión de T2 (*la unidad de descomposición es el fichero auxiliar, no la skill*). El propio kit **no usa worktrees ni tiene entorno**: el dogfooding aquí no aplica.

## 2. Objetivo

- **Qué construimos (one-liner)**: el kit fija el contrato agnóstico del entorno por worktree —plantilla, marcador, tres entradas con nombre y predicado observable— y deja los scripts al proyecto; el worktree en sí se adopta de superpowers.

- **Definición de éxito**:
  1. Existe `environments-template.md` en `sdd-templates` con el marcador `.sdd-env.json`, las tres entradas `env:setup` / `env:clean` / `env:preflight` y los dos tipos de entorno (default / efímero), dejando al proyecto cómo se invocan y qué hacen por dentro.
  2. `sdd-init-greenfield` y `sdd-init-brownfield` preguntan en la entrevista si el proyecto usa worktrees y si su entorno necesita más que dependencias; solo si ambas son sí, calcan `environments.md`.
  3. `sdd-start-task` paso 6: si existe `.docs/sdd/environments.md`, ejecuta `env:setup` tras la creación del worktree y lo comunica en el encargo del subagente.
  4. `sdd-end-task` y `sdd-end-patch`, paso de rama: si existe `environments.md`, `env:clean` **antes** de que `finishing-a-development-branch` ofrezca borrar el worktree.
  5. `overrides-superpowers.md`: la fila de `using-git-worktrees` deja de negar la gestión de worktrees y declara el reparto — worktree y su borrado, superpowers; entorno, el kit por predicado. Cierra el ítem que T3 absorbió.
  6. **La skill `sdd-env` se escribe solo si el RED la reclama**: escenario E1 (worktree creado por Orca sin flujo del kit en marcha, usuario pide "prepárame el entorno"). Si el baseline encuentra `environments.md` y ejecuta `env:setup`, no se escribe.
  7. Las conductas ya validadas de las cuatro skills editadas siguen intactas (A/B de no-regresión).
  8. El roadmap resuelve la decisión pendiente "¿el contrato de worktrees va al kit o a nivel 2?".

- **NO objetivos**:
  - Copiar los scripts de Alybo al kit. Son nivel 3 (Node, compose, SQL en `1433`, Playwright); quedan como **referencia citada** en la plantilla.
  - Gestionar worktrees desde el kit: lo hace superpowers (Art. IX regla 1).
  - La decisión "kit de nivel 2: plugin aparte o carpetas". Sigue pendiente y es ortogonal: esta task no la necesita.
  - Un catálogo de tipos de entorno por stack.

## 3. Decisión clave

- **Opción elegida — contrato al kit, scripts al proyecto; plantilla + predicado, sin skill nueva salvo evidencia.** El kit (nivel 1) fija solo lo agnóstico: qué fichero declara el entorno, cómo se llama el marcador y qué campos mínimos lleva, y qué tres entradas existen. El proyecto (nivel 3) decide cómo se invocan y qué hacen. Las skills de flujo lo activan por el mismo mecanismo que `estimation.md` y `changelog.md`: la presencia del fichero.

  La skill `sdd-env` que el roadmap preveía **no se escribe por adelantado**. El caso que la justificaría —un dev abre un worktree por su cuenta (Orca lo hace) y pide el entorno sin ningún flujo del kit en marcha— existe en la práctica real, pero es guidance y el Art. I exige que el baseline falle primero. El RED lleva ese escenario exacto; su resultado decide.

- **Alternativa descartada — todo a nivel 2**: coherente con la taxonomía, pero el nivel 2 no existe y tiene su propia decisión pendiente; T4 quedaría bloqueada detrás de otra decisión y la contradicción del override seguiría viva.

- **Alternativa descartada — skill `sdd-env` desde el principio**: era el 50/50 del dev-lead. Suma la duodécima `description` cargada en cada sesión y un salto de invocación que el A/B de T2 mostró innecesario cuando el enlace está en el punto de uso. Se descarta como *punto de partida*, no como resultado: si E1 falla, se escribe con la evidencia y su `description` se calibra con las frases que el baseline no reconoció.

- **Alternativa descartada — solo arreglar el override**: mínimo y barato, pero deja a los proyectos nuevos sin ninguna guía para el hueco que Alybo tuvo que resolver a mano.

## 4. Especificación funcional

### 4.1 La plantilla `environments-template.md`

| Pieza | Fija el kit | Decide el proyecto |
| --- | --- | --- |
| Marcador en la raíz del worktree | nombre `.sdd-env.json`; campos mínimos `ticket`, `state` (`active` \| `cleaned`), `created` (ISO 8601) | campos adicionales (puertos, rutas de volúmenes, lo que necesite) |
| Entradas | `env:setup` (genera la config del entorno activo y deja el marcador en `active`), `env:clean` (baja recursos y marca `cleaned`, conservando el marcador como registro), `env:preflight` (comprueba que el entorno sigue disponible antes de arrancar) | el runner (`pnpm`, `moon`, `make`, `just`…) y la implementación |
| Tipos de entorno | **default** (persistente, puertos fijos) y **efímero** (por worktree, aislado) | puertos, almacenamiento, servicios |
| Referencia | cita a los scripts de Alybo como ejemplo de nivel 3 en Node + compose | — |

La plantilla lleva bloques de ayuda `>` que se borran al calcar, como las demás.

### 4.2 Entrevista en `init-*`

Dos preguntas nuevas, una detrás de otra, en el bloque de proceso: *¿trabajáis con worktrees?* y, si sí, *¿el entorno de un worktree necesita algo más que instalar dependencias (base de datos, puertos, servicios, datos de prueba)?* Solo con ambas afirmativas se calca `environments.md`. Si la segunda es no, superpowers ya cubre el caso y no se crea nada — se dice explícitamente para que el usuario sepa por qué.

En brownfield, la primera pregunta se responde mirando: si el repo ya tiene scripts de entorno o un `environments.md`, se cosechan igual que el `CLAUDE.md` heredado.

### 4.3 Predicado en las skills de flujo

| Skill | Paso | Si existe `.docs/sdd/environments.md`… |
| --- | --- | --- |
| `sdd-start-task` | 6 (implementación) | tras el worktree que crea superpowers, ejecutar `env:setup`; el encargo de cada subagente indica que el entorno está listo y dónde está el marcador |
| `sdd-end-task` | 10 (rama) | `env:clean` **antes** de invocar `finishing-a-development-branch` — así la opción "borrar worktree" nunca deja un contenedor huérfano, el caso que Alybo documenta |
| `sdd-end-patch` | 6 (rama) | igual |
| `overrides-superpowers.md` | fila `using-git-worktrees` | *"El worktree lo crea, instala y borra superpowers (`using-git-worktrees`, `finishing-a-development-branch`; el borrado lo decide el usuario). El kit añade el **entorno**: si existe `environments.md`, `env:setup` al crear y `env:clean` antes de borrar."* |

### 4.4 Historias

- Como dev-lead que abre un worktree desde Orca, quiero que el agente sepa levantar el entorno sin que yo le diga cómo, para no repetir lo que Alybo tuvo que escribir a mano.
- Como agente que cierra una task, quiero limpiar el entorno antes de que se ofrezca borrar el worktree, para no dejar contenedores huérfanos secuestrando puertos.
- Como proyecto nuevo con `init-*`, quiero que la entrevista me pregunte por el entorno y me deje un contrato, no una carpeta de scripts que no encajan con mi stack.

### 4.5 Edge cases

- **Proyecto con worktrees y solo dependencias**: no hay `environments.md`; superpowers instala y listo. Es el caso mayoritario y no cuesta nada.
- **`env:preflight` falla** (puerto ocupado por un huérfano): el agente lo reporta y no arranca servicios; no ejecuta `env:clean` de otro worktree por su cuenta.
- **Marcador en `cleaned` y el usuario pide seguir trabajando**: `env:setup` lo devuelve a `active`; es idempotente por contrato.
- **Repo sin worktrees (este kit)**: predicado falso, nada cambia. Por eso no hay dogfooding aquí.

## 5. Datos

No aplica.

## 6. UX

No aplica.

## 7. Constraints técnicos

### 7.1 Compatibilidad con la constitution

- [x] Art. I — RED para el predicado y la entrevista; RED específico (E1) que decide la skill; A/B para las cuatro skills editadas.
- [x] Art. II — la guidance solo donde el baseline falle.
- [x] Art. IV — módulo por predicado observable, como `estimation.md` y `changelog.md`; no cambia ninguna convención existente.
- [x] Art. VII — dogfooding no aplicable (el kit no usa worktrees); declarado, no omitido.
- [x] Art. VIII — la plantilla se crea en su única fuente.
- [x] Art. IX — worktree y borrado se adoptan; entorno se aporta; skill solo ante hueco demostrado.

### 7.2 Dependencias

- superpowers 6.3.0: `using-git-worktrees` (Steps 1–3), `finishing-a-development-branch` (Step 6), `subagent-driven-development` (setup).
- T3 cerrada: el paso 6 nuevo de `sdd-start-task` es donde se engancha `env:setup`.
- Alybo `.docs/sdd/environments.md` y `.tools/scripts/env-*.mjs` como referencia de lectura.

### 7.3 Excepciones a la constitution

Ninguna.

## 8. Riesgos

| Riesgo | Probabilidad | Impacto | Mitigación |
| --- | --- | --- | --- |
| E1 no falla y la skill no se escribe, pero en uso real sí hace falta el trigger | Media | Medio | Resultado válido por Art. I; si aparece en Alybo, se abre patch/task con esa evidencia real |
| La entrevista de `init-*` crece y el gate de "sin entrevista no hay documentos" se debilita | Baja | Medio | Dos preguntas condicionadas, la segunda solo si la primera es sí; A/B de `init-*` lo mide |
| El contrato del marcador no encaja con `.aly-env.json` de Alybo | Media | Bajo | Los campos mínimos son subconjunto de los de Alybo; el nombre se documenta como migración opcional, no obligatoria |
| Los scripts stub de la fixture no representan un entorno real | Alta | Bajo | Lo medido es si el agente **invoca** las entradas y cuándo, no qué hacen; el rastro en disco basta |

## 9. Rollout

Directo. Local-only; se distribuye con la v0.6.0.

## 10. Open questions

- [ ] Modelo y coste de la campaña — en `plan.md`, confirmado antes de lanzar subagentes.
- [ ] Si E1 falla: ¿la skill `sdd-env` se escribe dentro de esta task o abre una task propia? — dev-lead, al cerrar el RED.

## 11. Aprobaciones

| Rol | Nombre | Fecha | Estado |
| --- | --- | --- | --- |
| dev-lead | Àngel Delgado | 2026-09-08 | aprobada |

Aprobada en conversación el 2026-09-08, con la decisión de nivel (contrato al kit, scripts al proyecto) y la de forma (plantilla + predicado; la skill solo si el RED la reclama).
