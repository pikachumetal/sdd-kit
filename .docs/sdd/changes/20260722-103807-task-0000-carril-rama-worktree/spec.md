---
id: 20260722-103807-task-0000-carril-rama-worktree
task: 0000
title: Desacople carril↔rama git-flow, consciencia de worktree y rename hotfix→patch
status: approved
created: 2026-07-22
author: Àngel Delgado
approvers:
  - role: dev-lead
    name: Àngel Delgado
    approved_at: 2026-07-22
---

# Spec — Desacople carril↔rama git-flow, consciencia de worktree y rename hotfix→patch

> **Estado**: draft
> **Fase del workflow**: Specify (qué + por qué)
> **Siguiente paso**: tras aprobación → `plan.md` con `superpowers:writing-plans`

## 1. Contexto

- **Problema u oportunidad**: El kit colapsa **dos ejes ortogonales** en la palabra "hotfix":
  - **Eje 1 (proceso SDD)**: ¿spec+plan pesado (`task`) o registro ligero determinista (`hotfix`)?
  - **Eje 2 (git-flow)**: ¿la rama sale como `feature/*` o `hotfix/*`?

  Son independientes: un `task` puede salir como `hotfix/*` de git-flow (bug de producción que exige interpretar requisitos), y un fix ligero puede salir como `feature/*` (ajuste determinista no urgente). El nombre `sdd-*-hotfix` induce el atajo mental "carril hotfix ⇒ rama hotfix", que lía a cualquier developer del equipo — el kit existe precisamente para que el resultado dependa del proceso, no del criterio individual (mission.md).

  Además, el override actual de worktrees en `sdd-start-task` (`using-git-worktrees → No-op: se usa el git-flow del proyecto`) está redactado en negativo y hace leer los worktrees como algo ajeno al kit. Hoy el git-flow del equipo sí incluye worktrees: el dev crea un worktree + entorno efímero (puertos, DB) **por tarea, fuera del flujo SDD**, para lanzar varios agentes en paralelo sin colisión. El worktree ES "el git-flow del proyecto" que la línea manda respetar, pero la redacción sugiere lo contrario.

  **Estado de partida confirmado (código)**:
  - `sdd-start-task/SKILL.md`: paso 3 "Branch — `feature/<ticket>` desde `develop`" (L31); override `using-git-worktrees → No-op` (L62); nombrado con prefijo `task|hotfix` (L41-44).
  - `sdd-start-hotfix/SKILL.md`: NO menciona git-flow ni tipo de rama; habla solo del eje 1 (proceso ligero, `hotfix.md`).
  - `hotfix-template.md`: campo `branch: hotfix/<id>` fijado — asume que un fix ligero siempre sale como rama hotfix (acoplamiento a romper).
  - 34 ficheros mencionan "hotfix"; se distinguen 3 categorías (ver §3).

- **Stakeholders**: lo pide el dev-lead del kit (Àngel), tras descubrir la fricción en el estreno real (roadmap ítem 2). Se benefician todos los developers del equipo que usen los carriles de arranque; lo mantiene el propio kit.

- **Restricciones conocidas**:
  - **Art. I** (ley de hierro): re-test RED→GREEN documentado para toda edición, incluidos renames.
  - **Art. IV**: tocar naming/git-flow es "cambio mayor" → spec dedicada + revisión de skills afectadas.
  - **Art. VIII**: plantillas fuente única en `sdd-templates/templates/`.

## 2. Objetivo

> **RECORTE tras el RED (2026-07-22)**: el baseline (`tests/sdd-start-patch-red.md`, workflow `wf_d6ee43e7-75c`) **NO exhibió** los fallos de conducta que esta spec quería corregir. En los 3 escenarios el agente observó la rama/worktree y decidió el tipo de rama correctamente **leyendo la constitution del proyecto** (Art. IV del kit: el git-flow concreto es del proyecto, no del kit). Por Art. I, la guidance de comportamiento que no tiene baseline que la respalde **no se escribe**. La task se recorta a los dos hallazgos que el RED sí justifica: (1) reescribir el override `No-op` que hizo dudar al agente, (2) el rename por claridad de naming.

- **Qué construimos (one-liner)**: Renombrar el carril ligero `hotfix`→`patch` para eliminar el equívoco con `hotfix/*` de git-flow, y reescribir el override `using-git-worktrees → No-op` de `sdd-start-task`, que contradice aparentemente la constitution de un proyecto que usa worktrees.

- **Definición de éxito** (criterios observables):
  1. Las skills `sdd-start-hotfix`/`sdd-end-hotfix` pasan a `sdd-start-patch`/`sdd-end-patch`; la plantilla a `patch-template.md` (artefacto `patch.md`, prefijo de carpeta `patch-`); todas las referencias **vivas** resueltas, histórico intacto.
  2. El override `using-git-worktrees → No-op` de `sdd-start-task` se reescribe a una redacción neutral que **no niega** los worktrees: el kit no los gestiona, pero **respeta y observa** el git-flow del proyecto (incluidos sus worktrees). Elimina la contradicción que S1b citó textualmente.
  3. Evidencia RED→GREEN en disco: el RED documenta que el baseline acierta la conducta pero exhibe la contradicción del override (S1b) y el equívoco de naming; el GREEN verifica que tras el cambio la contradicción desaparece y las referencias del rename resuelven.

- **NO objetivos** (fuera de alcance):
  - **Guidance nueva de "consciencia de worktree" o "desacople carril↔rama con nota anti-atajo"** — el RED demuestra que el agente ya acierta vía la constitution del proyecto; escribir esas instrucciones sería guidance sin baseline (Art. I). El comportamiento correcto es responsabilidad de la constitution del proyecto consumidor, no del kit.
  - `sdd-start-release` / `sdd-end-release` en **comportamiento** — solo reciben el rename de referencias.
  - El kit **no** prescribe worktrees ni ejecuta ningún script de entorno efímero (Art. IV).
  - **Histórico**: NO se reescriben changelog, specs/walkthroughs cerrados, actas de release, evidencia de tests de la v0.1.0, ni `.docs/flux/` (catalán). Se llamó "hotfix" en su momento y así se queda.
  - Cerrar release (bump de versión + corte de changelog) — decisión posterior del usuario.

## 3. Decisión clave

> **Reencuadre tras el RED (ver §2).** Las decisiones de diseño 3.1 y 3.2 originales (desacople carril↔rama con nota anti-atajo, consciencia de worktree) **se retiran**: el baseline las resuelve solo vía la constitution del proyecto, así que escribirlas violaría el Art. I. Quedan dos decisiones, ambas respaldadas por el RED.

### 3.1 Reescritura del override `using-git-worktrees` (elegida: neutral, no negacionista)

- **Problema (S1b)**: la fila actual `using-git-worktrees → No-op: se usa el git-flow del proyecto` hace que un agente en un proyecto con worktrees tenga que **razonar contra el kit** — el "No-op" se lee como "los worktrees no aplican aquí", cuando el proyecto sí los usa. El agente acertó desambiguando, pero la redacción es una trampa.
- **Opción elegida**: reescribir a una redacción que **no niega** los worktrees. El sentido correcto: el kit **no gestiona** worktrees desde el flujo SDD (no invoca `superpowers:using-git-worktrees`, no crea entornos), pero **respeta y trabaja dentro** del git-flow del proyecto, worktrees incluidos — que el dev gestiona fuera del flujo. Sin prescribir worktrees (Art. IV: eso es del proyecto).
- **Alternativa descartada**: dejar "No-op" y añadir una nota explicativa — mantiene la contradicción en la tabla; mejor arreglar la fila.

### 3.2 Rename hotfix→patch (elegida: renombrar el carril, por claridad de naming)

- **Problema**: el nombre del carril ligero `sdd-*-hotfix` colisiona con "hotfix" de git-flow (`hotfix/*`), induciendo el atajo mental "carril hotfix ⇒ rama hotfix". Es un fallo de **legibilidad/forma** (confunde al developer que lee el catálogo), no de conducta del agente — el RED confirma que el agente decide bien la rama igualmente.
- **Opción elegida**: renombrar `sdd-*-hotfix`→`sdd-*-patch` (y su plantilla/artefacto). `patch` nombra el eje "proceso ligero" sin robar vocabulario de git.
- **Alternativa descartada**: solo una nota aclaratoria sin renombrar — el dev-lead ya vivió el equívoco *teniendo* el kit delante; una nota que hay que leer no protege a otros developers. El nombre es el defecto.
- **Regla de las 3 categorías del rename**:
  - **① Se RENOMBRA** (nombre del carril/skill, eje 1): carpetas de skill `sdd-start-hotfix/`→`sdd-start-patch/`, `sdd-end-hotfix/`→`sdd-end-patch/` (+ `name:` frontmatter y cuerpo); plantilla `hotfix-template.md`→`patch-template.md` (`patch.md`, `type: patch`, `branch: <feature|hotfix>/<id>`); prefijo de carpeta de artefacto `hotfix-`→`patch-`; referencias vivas al carril en `README.md`, `CLAUDE.md`, `constitution.md` (Art. VII), `mission.md`, `architecture.md`, `sdd-start-task`, `sdd-end-task`, `sdd-consult`, `add-to-changelog`, `sdd-templates` (índice), `sdd-start-release`, `sdd-end-release`.
  - **② NO se toca** (histórico — sería falsificar): `changelog.md`, specs/walkthroughs cerrados (`specs/2026...`), actas de release (`releases/v0.x/`), evidencia de tests de la v0.1.0 (`tests/sdd-*-hotfix-*.md`), `.docs/flux/`.
  - **③ Artefactos nuevos**: prefijo `patch-<id>-<slug>/` + fichero `patch.md`. El histórico con prefijo `hotfix-` convive sin problema (es correcto: ese carril se llamaba así en su momento).

## 4. Especificación funcional

- **US1** — Como developer nuevo en el equipo, quiero que el carril ligero no se llame "hotfix", para no asumir erróneamente que implica una rama hotfix de git-flow al leer el catálogo.
- **US2** — Como agente ejecutando `sdd-start-task` en un proyecto que usa worktrees, quiero que el override de la tabla no me haga dudar si los worktrees "aplican" o no, para respetar el git-flow del proyecto sin razonar contra el kit.

**Comportamiento esperado**:
- El rename es transparente para el usuario: donde antes leía `sdd-start-hotfix`/`hotfix.md`, ahora lee `sdd-start-patch`/`patch.md`. El artefacto nuevo lleva prefijo `patch-`.
- La fila `using-git-worktrees` de la tabla de overrides deja de negar los worktrees: enuncia que el kit no los gestiona pero respeta el git-flow del proyecto. Un agente en un proyecto con worktrees ya no encuentra contradicción.

**Edge cases**:
- Un proyecto **sin** worktrees: la fila reescrita sigue siendo válida (el kit no gestiona worktrees; si el proyecto no los usa, no hay nada que respetar más allá del git-flow de ramas).
- Artefacto histórico con prefijo `hotfix-` ya en disco: se preserva; conviven ambos prefijos sin migración.

## 5. Datos

No aplica — cambio de contenido de skills y plantillas Markdown, sin schema ni datos.

## 6. UX

No aplica UI. El "contrato" es el texto de las skills (frontmatter `description` + cuerpo) y la plantilla `patch-template.md`.

## 7. Constraints técnicos

### 7.1 Compatibilidad con la constitution

- [x] **Art. I** — Ley de hierro: RED ejecutado (`tests/sdd-start-patch-red.md`). El baseline **acotó el alcance**: retiró la guidance de comportamiento sin respaldo y dejó rename + override. GREEN verifica que la contradicción del override desaparece y las referencias del rename resuelven. Evidencia en `tests/sdd-start-patch-red.md` y `-green.md`.
- [x] **Art. II** — La forma sigue al fallo: el fallo del override es de **forma** (redacción que contradice) → se corrige reescribiendo la fila, no con tabla de racionalizaciones. El rename es de **legibilidad** → receta (nuevo nombre), no prohibición.
- [x] **Art. III** — Idioma: texto castellano correcto; nombre de skill inglés kebab-case (`sdd-start-patch`).
- [x] **Art. IV** — Convención mayor (naming): por eso esta spec dedicada + revisión de skills afectadas (regla de categorías en §3.2). El RED reconfirmó que el git-flow concreto es del proyecto, no del kit.
- [x] **Art. VII** — Dogfooding: esta task va por el propio flujo SDD, artefactos en esta carpeta.
- [x] **Art. VIII** — Plantilla renombrada sigue siendo fuente única en `sdd-templates/templates/`.
- [ ] **Art. V** — Versionado: aplica al **release posterior** (bump + changelog), fuera de esta task.

### 7.2 Dependencias

- Plugin **superpowers** (brainstorming, writing-plans, executing-plans, systematic-debugging) en el entorno.
- Orquestación del re-test con **workflow multi-agente** (tech-stack.md): rutas absolutas incrustadas en el script (los `args` llegan serializados — ver memoria del proyecto), una copia de fixture por run con git local propio, `cd` explícito en operaciones git de subagentes, verificación en disco además del autoinforme.

### 7.3 Excepciones a la constitution

Ninguna.

## 8. Riesgos

| Riesgo | Probabilidad | Impacto | Mitigación |
| --- | --- | --- | --- |
| Rename incompleto: queda una referencia viva a `sdd-*-hotfix` que rompe un handoff | Media | Alto | Inventario cerrado en §3.2; grep de verificación al cierre distinguiendo ① vivo de ② histórico |
| Se reescribe histórico por error (falsificación) | Media | Alto | Regla explícita ② en §3.2; el grep de cierre excluye `tests/sdd-*-hotfix-*`, `releases/`, `changelog.md`, specs cerradas, `flux/` |
| El override reescrito se lee como "el kit prescribe worktrees" | Baja | Medio | Redacción neutral: "no gestiona pero respeta"; NO objetivo explícito de no prescribir ni ejecutar scripts |
| `patch-template.md` con `branch: <feature\|hotfix>/<id>`: un lector cree que el kit fija el tipo de rama | Baja | Bajo | El valor es un placeholder de ejemplo con las dos opciones; el git-flow lo fija el proyecto |

## 9. Rollout

Directo: los cambios viven en las skills del kit. Llegan a los consumidores con el siguiente `/plugin marketplace update` tras el release. El corte de release (bump + changelog + notes) es una acción posterior del usuario, fuera de esta task.

## 10. Open questions

Ninguna — el espacio de decisión se cerró en la consulta + brainstorming.

## 11. Aprobaciones

| Rol | Nombre | Fecha | Estado |
| --- | --- | --- | --- |
| dev-lead | Àngel Delgado | | pendiente |
