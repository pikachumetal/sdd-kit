---
id: 20260924-220849-task-0061-local-config
task: 0061
title: Plan de implementación — Configuración personal y skill de configuración
spec: ./spec.md
status: approved
created: 2026-09-25
---

# Plan de implementación — Configuración personal y skill de configuración

## Decisiones que he tomado yo — valida estas

1. **Ejecución: Native**. Son cuatro tasks en serie, cada una sobre lo que deja la anterior. La guía que se escribe depende de lo que diga el RED, así que la escribe quien lo ha leído, y un fallo se ve en la revisión final de rama. Los sujetos de la campaña ya son headless, sin implementadores.
2. **Modelo**: hilo principal para las cuatro tasks. Revisor final: `sdd-kit:effort-high` + `model: opus`, el techo por defecto del Art. IV.
3. **La guía de las tasks 2 y 3 queda condicionada al RED**. Lo que el baseline ya haga bien en c1, c2 o c3 no se escribe como prohibición (Art. II), pero el requisito se repite en el GREEN como control. El contrato (claves, precedencia, aviso, catálogo) se escribe siempre: es forma, no disciplina.
4. **Numeración nueva de las entrevistas**. En greenfield, las preguntas 14 y 18–21 salen y entra una sola, «Claves del kit», que invoca `sdd-config` tras la de ramas: 22 filas pasan a 18. En brownfield, las preguntas 1–5 pasan a ser una: 8 filas pasan a 4. Los tests que fijan «pregunta 22» y «pregunta 8» pasan a 18 y 4.
5. **Tests que citan la tabla movida**: `ControlProfiles.Tests.ps1` (bloque y consumidores), `NativeAdapt.Tests.ps1` y `NativeDefault.Tests.ps1` (fila 5). Apuntan a `skills/sdd-config/SKILL.md` y a las filas nuevas de las init.
6. **Coste estimado**: unas 3,5 h de reloj, más los 14 sujetos de la campaña (unos 10 $) y el revisor final (unos 150k tokens).

**Goal**: el fichero `.docs/sdd/sdd-kit.local.json` con su precedencia y su aviso, y la skill `sdd-config` como única entrevista de claves.

**Architecture**: `control-profiles.md` es el contrato (claves, tipos, defaults, precedencia, lista cerrada de lo local y aviso). `skills/sdd-config/SKILL.md` es la entrevista (leer, enseñar, preguntar, escribir) con el catálogo de preguntas. Las init y la v1.2.0 la invocan. Los tests Pester fijan la forma, y la campaña headless fija la conducta.

**Tech Stack**: Markdown (SKILL.md con frontmatter) y Pester ≥ 5 sobre pwsh 7. Campaña con `claude -p` y Sonnet.

**Spec**: `./spec.md`

**Ejecución**: native, porque las cuatro tasks van en serie, la guía depende del RED que lee el propio hilo y los sujetos ya corren aparte. Si esta sesión se retomó tras una compactación (empieza por «This session is being continued from a previous conversation») y quedan dos o más tasks sin su línea `complete` en el ledger, no las hagas tú: despacha las que quedan con subagent-driven-development sobre el mismo ledger.

## Restricciones globales

### De código

- Ruta del fichero local: `.docs/sdd/sdd-kit.local.json`. Claves admitidas: `control.profile` (`pair` | `delegate` | `unattended`), `execution` (`auto` | `native` | `subagent`) y `validation.startEnvironment` (booleano, default `false`).
- Aviso de clave no admitida, literal: `Aviso: se ignora <clave> de sdd-kit.local.json: solo admite control.profile, execution y validation.startEnvironment; lo demás es del proyecto y va en sdd-kit.json.`
- Aviso de valor no admitido, literal: `Aviso: se ignora <clave> de sdd-kit.local.json: <valor> no es un valor admitido.`
- Nombre de la skill: `sdd-config`.
- No se tocan `skills/sdd-templates/templates/plan-template.md`, `skills/sdd-templates/templates/spec-template.md` ni los pasos 6 y 7 de `skills/sdd-start-task/SKILL.md`.
- Art. X de la constitution: sin comentarios que repitan el código; sin comentarios que citen documentos (constitution, spec, task, requisito, `capabilities/`); Clean Code: nombres descriptivos en inglés, funciones ≤ 20 líneas y ≤ 3 parámetros, early returns, sin duplicación, sin alias de PowerShell; texto humano en castellano con tildes. Todo `*.Tests.ps1` que ejecute git dot-sourcea `tests/Clear-GitEnv.ps1`.
- Art. I: ninguna edición de skill sin su evidencia RED/GREEN en `tests/`.

### De proceso

- Native: el hilo principal implementa, con el ledger de `executing-plans`. Cada task se abre con `task-start` y la comprobación de la base, y los tests de sus THEN van antes del texto, con una copia fuera del repo. Se cierra comparando los RED, con el commit de la task y con `task-done`.
- Revisor final: `sdd-kit:effort-high` + `model: opus`.
- Sujetos de campaña: Sonnet, headless, con `red/run.sh` (`SUBJECT_CAP=20`, `COST_CAP=16`, fichero `stop`).
- Commits: tipo/scope en inglés y cuerpo en castellano, con `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`.

---

## Phase -1 — Pre-Implementation Gates

- [x] **Simplicity gate**: no hay script. El fichero local lo leen las skills a partir del contrato de `control-profiles.md`, como ya hacen con `sdd-kit.json`.
- [x] **YAGNI gate**: el bloque `validation` tiene una sola clave, y el lector del paso 7 se difiere (decisión 7 de la spec).
- [x] **Brownfield gate**: sin el fichero local, todo queda como hoy.
- [x] **Constitution check**: Art. I (campaña), Art. V (la v1.2.0 y las init escriben la misma línea de `.gitignore`), Art. VIII (sin plantillas nuevas) y Art. X.

---

## 1. Decisiones técnicas

### 1.1 Estructura de ficheros

**Crear**:

- `skills/sdd-config/SKILL.md`: la entrevista de claves y su catálogo.
- `.gitignore`, en la raíz de este repo: `.docs/sdd/sdd-kit.local.json`.
- `tests/LocalConfig.Tests.ps1`: la forma del fichero local, la precedencia y la línea de `.gitignore`.
- `tests/SddConfig.Tests.ps1`: la anatomía de `sdd-config` y que sea la fuente única.
- `tests/sdd-config-red.md` y `tests/sdd-config-green.md`.
- `.docs/sdd/specs/20260924-220849-task-0061-local-config/tasks.md`.

**Modificar**:

- `skills/sdd-start-task/references/control-profiles.md`: precedencia, sección «sdd-kit.local.json», clave nueva en la tabla y fuera la sección «Preguntas de las claves de control», que queda como puntero a `sdd-config`.
- `skills/sdd-start-task/SKILL.md`: solo los pasos 2 (perfil vigente y su nivel, avisos) y 5 (el fichero donde está fijado `execution`).
- `skills/sdd-init-greenfield/SKILL.md` y `references/estructura.md`: la entrevista invoca `sdd-config`, y `.gitignore` gana la línea.
- `skills/sdd-init-brownfield/SKILL.md` y `references/generacion.md`: lo mismo.
- `skills/sdd-init-brownfield/references/migrations/v1.2.0.md`: los pasos 1 y 2 invocan `sdd-config`, el paso 3 añade la línea y se actualizan «Escribe» y «Verificación».
- `tests/MigrationInitParity.Tests.ps1`, `tests/ControlProfiles.Tests.ps1`, `tests/NativeAdapt.Tests.ps1` y `tests/NativeDefault.Tests.ps1`.
- `README.md` (catálogo), `.docs/sdd/mission.md` (recuento), `.docs/sdd/architecture.md` (árbol) y `CLAUDE.md` (recuento, si cambia).
- `.docs/sdd/roadmap.md`: la fila de deuda «Leer `validation.startEnvironment` en la validación».

**NO se tocan**:

- `plan-template.md`, `spec-template.md` y los pasos 6 y 7 de `sdd-start-task`: los lleva la 0060.
- `sdd-start-release` y `sdd-end-release`: `release.hasRecipient` se sigue preguntando donde se usa.
- `tests/*.md` de campañas pasadas: son evidencia histórica.

### 1.6 Dependencias

- La 0060, en paralelo, sobre los ficheros vetados. La 0064 renombrará task → feature y no toca el nombre `sdd-config`.

### 1.7 Riesgos

| Riesgo | Probabilidad | Impacto | Mitigación |
| --- | --- | --- | --- |
| La 0060 fusiona en develop y cruza `sdd-start-task/SKILL.md` | Media | Conflicto en el paso 5 | Freno «fichero cambiado en la base» antes de cada task; los cambios de esta task se quedan en los pasos 2 y 5 |
| `sdd-config` no se dispara en c1 sin nombrarla | Media | c1 no se cumple | `description` con la frase de la petición del RED; se mide en el GREEN |
| Otros tests citan la numeración vieja | Alta | Suite en rojo | Suite completa al final de las tasks 2 y 3 |

### 1.9 Excepciones a la constitution

Ninguna.

---

## 2. Tasks

### Task 1 — RED de la campaña

**Modelo**: hilo principal (lanza sujetos Sonnet headless).
**Tests RED**: no aplica; la task es la medición.
**Superficies**: tests (evidencia).
**Verificación**: `red/out/*.state.txt`, `*.texts.txt` y `*.tools.txt` de c1-1, c1-2, c2-1, c2-2, c3-1, c3-2 y c4-1.

**Interfaces**:
- Consume: `red/run.sh` y `red/subject.sh` de la carpeta de la spec, y la copia del kit en la base, en `<scratchpad>/kit-red`.
- Produce: `tests/sdd-config-red.md`, con un veredicto por escenario y por medida (pasa · falla · parcial), las citas literales y de dónde sacó cada sujeto la conducta.

- [ ] **Step 1**: `KIT_DIR=<scratchpad>/kit-red RUNS_DIR=<scratchpad>/runs OUT_NAME=red SCENARIOS="c1 c2 c3 c4" SUBJECT=1 bash red/run.sh` y, a la vez, `SCENARIOS="c1 c2 c3" SUBJECT=2`, en segundo plano.
- [ ] **Step 2**: leer cada salida y apuntar las medidas de la spec (decisión 16). Si una medida sale limpia, mirar en `tools.txt` qué ficheros leyó el sujeto antes de decidir recortar.
- [ ] **Step 3**: escribir `tests/sdd-config-red.md`: previsión y techo, escenarios, tabla de medidas, racionalizaciones textuales, qué guía se escribe y cuál se recorta.
- [ ] **Step 4**: commit `test(sdd-config): RED de la configuración personal y la entrevista de claves`.

### Task 2 — Fichero local y precedencia

**Modelo**: hilo principal.
**Tests RED**: hilo principal · `tests/LocalConfig.Tests.ps1`, antes del texto.
**Superficies**: docs de skill y tests Pester.
**Verificación**: `pwsh -NoProfile -Command "Invoke-Pester -Path tests/LocalConfig.Tests.ps1,tests/ControlProfiles.Tests.ps1,tests/MigrationInitParity.Tests.ps1,tests/Skills.Tests.ps1 -Output Detailed"`

**Interfaces**:
- Consume: `tests/sdd-config-red.md` (qué guía del paso 2 hace falta, según c2).
- Produce: la sección `## sdd-kit.local.json` de `control-profiles.md`, con las tres claves y los dos avisos literales de las Restricciones; la precedencia con cuatro niveles («task», «persona: `control.profile` en `.docs/sdd/sdd-kit.local.json`», «release», «proyecto»); la fila `validation.startEnvironment` en «Claves de sdd-kit.json», con tipo booleano y default `false`; y la línea `.docs/sdd/sdd-kit.local.json` en `.gitignore` en las dos init, en la v1.2.0 y en la raíz del repo.

- [ ] **Step 1: Tests RED** en `tests/LocalConfig.Tests.ps1`, uno por THEN:
  - la precedencia de `control-profiles.md` tiene cuatro niveles, con el fichero local en segundo lugar;
  - la sección `## sdd-kit.local.json` nombra las tres claves admitidas y lleva los dos avisos literales;
  - la tabla de claves tiene `validation.startEnvironment`;
  - la regla de `execution` dice método de la task → local → proyecto y que `auto` en local cuenta;
  - el paso 2 de `sdd-start-task` nombra `sdd-kit.local.json` y el nivel del que sale el perfil;
  - el paso 5 nombra `sdd-kit.local.json`;
  - `.gitignore` del repo, el corpus de cada init y la línea «Escribe» de la v1.2.0 contienen `.docs/sdd/sdd-kit.local.json`.

  Ejecutar y ver que fallan. Copia en `<scratchpad>/red-t2/`.
- [ ] **Step 2: Texto**: editar `control-profiles.md` («Precedencia», sección nueva tras ella, tabla de claves, párrafo de `execution`, regla del atajo autoconcedido para el fichero local), los pasos 2 y 5 de `sdd-start-task`, el paso 3 de greenfield y `estructura.md`, el paso 5 de brownfield y `generacion.md`, y el paso 3, «Escribe» y «Verificación» de la v1.2.0. Crear `.gitignore`. El texto del paso 2 lo condiciona el RED de c2.
- [ ] **Step 3: Verificación**: el comando de arriba en verde, y `git diff --no-index <scratchpad>/red-t2/LocalConfig.Tests.ps1 tests/LocalConfig.Tests.ps1` sin cambios de fondo.
- [ ] **Step 4: Commit** `feat(control-profiles): preferencias personales en sdd-kit.local.json con su precedencia`.

### Task 3 — Skill `sdd-config` como fuente única

**Modelo**: hilo principal.
**Tests RED**: hilo principal · `tests/SddConfig.Tests.ps1`, y las aserciones cambiadas de `MigrationInitParity`, `ControlProfiles`, `NativeAdapt` y `NativeDefault`, antes del texto.
**Superficies**: skill nueva, docs de skill, tests Pester y README.
**Verificación**: `pwsh -NoProfile -Command "Invoke-Pester -Path tests -Output Detailed"` (la suite rápida entera, porque la numeración la citan varios tests)

**Interfaces**:
- Consume: la sección `## sdd-kit.local.json` y la tabla de claves de `control-profiles.md` (task 2); `tests/sdd-config-red.md` (guía de c1 y c3).
- Produce: `skills/sdd-config/SKILL.md` con `name: sdd-config`, una `description` que empieza por «Usar», H1, Overview y estos pasos: (1) leer los dos ficheros y enseñar cada clave con su valor, su fichero o el default que rige, y los avisos; (2) preguntar, una por turno y con la recomendada primero, las del catálogo que faltan o las que el usuario quiere cambiar; (3) escribir cada respuesta en su fichero, con la línea de `.gitignore` antes del fichero local, sin commitear el local; (4) sin usuario, devolver la lista de pendientes. También produce la sección `## Catálogo`, una tabla `| # | Pregunta | Recomendada y motivo | Escribe | Fichero |`: 1 modo de ids; 2 perfil; 3 merge; 4 push; 5 frenos; 6 método; 7 entorno antes del guion de pruebas. Las filas 2 a 6 son el texto actual de `control-profiles.md` sin cambios, y la 1 es el texto de la pregunta 14 de greenfield.

- [ ] **Step 1: Tests RED**:
  - `tests/SddConfig.Tests.ps1`: la skill existe con su anatomía; el catálogo tiene las siete filas; `¿Con qué perfil de control trabajáis` y `¿Cómo se numeran las tasks` solo aparecen bajo `skills/sdd-config/`; las dos init y la v1.2.0 nombran `sdd-config`; el catálogo escribe `validation.startEnvironment` en `sdd-kit.local.json`; la skill dice que la invocada por una init o la migración escribe solo en `sdd-kit.json`.
  - `MigrationInitParity`: las preguntas 22→18 y 8→4.
  - `ControlProfiles` 71–77 y 201–214: el bloque vive en `sdd-config`.
  - `NativeAdapt` 155 y `NativeDefault` 49, 89 y 98: la fila 6 del catálogo, y las init invocan `sdd-config`.

  Ejecutar y ver que fallan. Copia en `<scratchpad>/red-t3/`.
- [ ] **Step 2: Texto**: crear `skills/sdd-config/SKILL.md` (forma, no disciplina; red flags solo si el RED muestra fallo de disciplina). Quitar el bloque de preguntas de `control-profiles.md` y dejar un puntero. Greenfield: fuera las filas 14 y 18–21, dentro «17 | Claves del kit: invoca `sdd-config` con la rama de integración de la 14…» y renumerar; el paso 3 cita la 17. Brownfield: una fila 1 que invoca `sdd-config` con la rama de integración del repo, y renumerar. En la v1.2.0, los pasos 1 y 2 invocan `sdd-config` y conservan el gate y el «pendiente explícito». Actualizar el catálogo del README, el recuento de `mission.md`, el árbol de `architecture.md` y el de `CLAUDE.md`.
- [ ] **Step 3: Verificación**: la suite en verde, y la comparación de los RED apartados sin cambios de fondo.
- [ ] **Step 4: Commit** `feat(sdd-config): skill de configuración como fuente única de la entrevista de claves`.

### Task 4 — GREEN de la campaña y deuda

**Modelo**: hilo principal (sujetos Sonnet).
**Tests RED**: no aplica.
**Superficies**: tests (evidencia) y roadmap.
**Verificación**: `green/out/*` de los mismos siete sujetos; techo común con el RED.

**Interfaces**:
- Consume: el kit de la rama en `<scratchpad>/kit-green` (`git archive HEAD`), y `red/run.sh` con `OUT_NAME=green`.
- Produce: `tests/sdd-config-green.md` y la fila de deuda en el roadmap.

- [ ] **Step 1**: lanzar los siete sujetos, igual que en el RED.
- [ ] **Step 2**: veredicto por medida contra el RED. Si algo falla, un REFACTOR de una tanda dentro del techo; si no cabe, paro y decide el dev-lead.
- [ ] **Step 3**: escribir `tests/sdd-config-green.md` y añadir al roadmap la fila de deuda «Leer `validation.startEnvironment` en la validación (paso 7 de `sdd-start-task`, tras la 0060) y alinear `plan-template.md` con `fijado en sdd-kit.local.json`».
- [ ] **Step 4**: commit `test(sdd-config): GREEN de la configuración personal`.

---

## Estimación y esfuerzo

- Tipo: docs
- Esfuerzo spec + plan: 1 h
- Estimación de implementación: 2,5 h (rango 1,5–3,5; la guía, condicionada al RED)
- Base de la estimación: 4 tasks; dos campañas de ~10 min de redacción cada una; skill nueva de forma; tres init/migración y cinco tests que cambian por la numeración. Referencia: la 0020, claves de control en las init.
- Confianza: media

---

## 3. Validación final

- [ ] Gate de cierre: `pwsh -NoProfile -Command "Invoke-Pester -Path tests"` en verde.
- [ ] Revisión final de rama con `sdd-kit:effort-high` + `opus`.
- [ ] Criterios de la spec contrastados con el GREEN.
- [ ] Cierre con `sdd-end-task`.

---

## 4. Self-review (cobertura spec → tasks)

- `configuration` · Las preferencias personales viven en `sdd-kit.local.json` → Task 2 (contrato, `.gitignore`) y Task 3 (escritura). GREEN c1. ✓
- `configuration` · Una clave no admitida se ignora con aviso → Task 2. GREEN c2. ✓
- `configuration` · `sdd-config` enseña antes de preguntar → Task 3. GREEN c3. ✓
- `configuration` · Una clave por turno, con la recomendada primero → Task 3. GREEN c3 y c4. ✓
- `configuration` · Escribe solo lo respondido, en su fichero → Task 3. GREEN c1 y c3. ✓
- `control-profiles` · REMOVED y ADDED de la herencia del perfil → Task 2. GREEN c2. ✓
- `control-profiles` · Método fijado en local → Task 2 (paso 5 y la regla de `execution`). Pester. ✓
- `onboarding` · La entrevista fija las claves → Task 3. Pester. ✓
- `onboarding` · La init deja los temporales ignorados → Task 2. Pester. ✓
- `migration` · Los cuatro MODIFIED → Task 2 (configuración) y Task 3 (ids, claves, paridad). Pester y GREEN c4. ✓
- Decisión 7, deuda del lector de `validation.startEnvironment` → Task 4. ✓
