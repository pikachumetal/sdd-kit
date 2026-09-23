---
id: 20260923-143450-task-0040-close-push
task: 0040
title: Plan de implementación — Final del cierre: push autorizado y aviso de terminado
spec: ./spec.md
status: approved
created: 2026-09-23
---

# Plan de implementación — Final del cierre: push autorizado y aviso de terminado

## Decisiones que he tomado yo — valida estas

1. **Las cuatro tasks van en línea**, por excepción al default, con el mismo motivo que la 0009. El producto es texto de skill cuya forma decide el GREEN, y el hilo tiene cargado el RED: ocho streams y el bloqueo del tool PowerShell. Revisa un único revisor de rama al final, sobre el diff completo (paso 9 de `sdd-end-task`, task en línea).
2. **Revisor de rama**: `sonnet`, effort `medium` (el tool `Agent` no admite effort; deuda de la 0031), con la cabecera de `encargo-revision.md`. La gama media es el suelo para revisores (Art. IV).
3. **Anclas Pester en `ControlProfiles.Tests.ps1`**, escritas antes del texto. Comprueban que la tabla declara `merge.push`, que el bloque tiene cuatro preguntas y que las init nombran la 4 para los frenos. También que los dos cierres enlazan la sección «Push» de la receta, que el paso final de cada cierre se llama «Mensaje final» y lleva «lo elegí yo» y «Terminado», y que `mission.md` nombra `merge.push`. La paridad migración–init ya existe: con `merge.push` en la línea «Escribe» de `v1.2.0.md`, `MigrationInitParity.Tests.ps1` falla hasta que `control-profiles.md` la declara. Las anclas no miden conducta, que es del GREEN.
4. **La pregunta 3 del bloque no nombra git-flow por su marca, sino por su forma**: `main` estable y `develop` de integración, igual que la pregunta 15 de greenfield. En brownfield se lee del repo.
5. **GREEN**: once escenarios, dos sujetos cada uno, con PowerShell deshabilitado en el lanzador para evitar el bloqueo del RED. Son A, B y C del RED (C como control de no regresión de F4); E (sin `merge.push` ni instrucción: no hay push y el mensaje lo dice); P (perfil `pair`: presenta el push y espera); D (merge denegado: la línea de terminado va la última y dice «No terminado»); T (dos turnos: acepta el ticket y se repite la línea); F (validación diferida con disparador vago, molde `m-close` de la 0008: el aviso del patch 0037 sigue saliendo desde el paso nuevo); I (init greenfield situada en la pregunta 3 con git-flow); I2 (la misma pregunta con otra convención de ramas, sin recomendación); M (migración con `merge` completo y sin `push`). Techo: 14 $, con ~20 % de reserva para un REFACTOR. El RED costó 0,32 $ por sujeto.
6. **Coste estimado**: ~2,5 h de reloj del hilo y 14 $ de sujetos como techo. Sin tokens de subagente salvo el revisor de rama (~100k).

**Goal**: los cierres de task y de patch hacen push de la rama de integración cuando `merge.push` lo autoriza, las init y la migración lo preguntan, y cada cierre acaba con un mensaje final cuya última línea dice si ha terminado y qué worktree se puede borrar.

**Architecture**: la clave y su pregunta viven en `control-profiles.md`, la fuente que ya enlazan las init y la migración. El push es una sección «Push» de `merge-recipe.md`, que los dos pasos de rama enlazan con una frase que decide. «Mensaje final» es un paso nuevo, el último de cada cierre, con la línea de terminado en forma fija.

**Tech Stack**: Markdown de skills; Pester 5 (`pwsh -NoProfile -Command "Invoke-Pester -Path tests"`); sujetos headless Sonnet con el lanzador de `red/`.

**Spec**: `./spec.md`

## Restricciones globales

### De código

- Texto humano en castellano con ortografía correcta; nombres de fichero y claves en inglés (Art. III): la clave es `merge.push`.
- Art. X, literal: sin comentarios que repitan el código; sin comentarios que citen documentos (constitution, spec, task, requisito, `capabilities/`); nombres descriptivos en inglés, funciones ≤ 20 líneas y ≤ 3 parámetros, early returns, sin duplicación, sin alias de PowerShell. Un umbral superado en una unidad es Minor.
- Enlaces relativos, nunca `@` (lo vigila `Skills.Tests.ps1`); ninguna ruta del repo pasa de 140 caracteres (`PathLength.Tests.ps1`).
- Valores exactos de la spec: `merge.push` es booleano, opcional dentro de `merge`, default `false`, y no entra en «bloque completo» (`into`, `noFf`, `removeWorktree`). El push va solo de `merge.into` a su upstream, sin `--force` ni tags, tras la suite en verde sobre el merge. Si falla, no hay reintento con `--force`, `pull`, `rebase` ni otra herramienta, y el comando se cita literal en un bloque. La línea de terminado es siempre la última del mensaje final.
- Nunca `--no-verify`.

### De proceso

- Política de modelos del Art. IV: modelo y effort explícitos al despachar; gama media como suelo para revisores; `fable` y `opus xhigh` prohibidos.
- Con una campaña de sujetos en marcha, el hilo no commitea (`tech-stack.md`, task 0021). Sujetos en serie: el dev-lead pide confirmar antes de paralelizar.
- Commits con tipo/scope en inglés, cuerpo en castellano y la línea `Co-Authored-By` del harness.
- El pre-commit de este repo corre la suite entera en cada commit: la verificación de cada task es la de su campo, y el pre-commit hace de gate.

---

## Phase -1 — Pre-Implementation Gates

- [x] **Simplicity gate**: una clave, una sección de receta y un paso por cierre; ningún script nuevo.
- [x] **YAGNI gate**: sin push de otras ramas, sin PR, sin borrado del worktree por el agente.
- [x] **Constitution check**: Art. I (RED hecho y GREEN con los mismos escenarios más controles), Art. III, Art. IV (el merge a la estable y el tag siguen siendo de una persona), Art. V (la pregunta nueva en init y migración desde una sola fuente).

---

## 1. Decisiones técnicas

### 1.1 Estructura de ficheros

**Crear**:

- `tests/close-push-red.md` — RED del delta: resume `red/README.md` de la spec y enlaza su evidencia.
- `tests/close-push-green.md` — GREEN con sus escenarios y el veredicto contra cada fallo del RED.
- `.docs/sdd/specs/20260923-143450-task-0040-close-push/tasks.md` — registro vivo.
- `.docs/sdd/specs/20260923-143450-task-0040-close-push/green/` — lanzador y salidas del GREEN (solo lo que cambie respecto a `red/`).

**Modificar**:

- `skills/sdd-start-task/references/control-profiles.md` — perfil `unattended`, tabla de gates, tabla de claves y bloque de preguntas.
- `skills/sdd-init-greenfield/SKILL.md` — filas 19 y 20.
- `skills/sdd-init-brownfield/SKILL.md` — filas 3 y 4.
- `skills/sdd-init-brownfield/references/migrations/v1.2.0.md` — «Aplica», paso 2, paso 5, «Escribe» y verificación.
- `skills/sdd-end-task/references/merge-recipe.md` — sección «Push».
- `skills/sdd-end-task/SKILL.md` — paso 0 (referencia al paso del mensaje), paso 10, paso 11 y paso 12 nuevo.
- `skills/sdd-end-patch/SKILL.md` — overview, paso 6, paso 7 y paso 8 nuevo.
- `.docs/sdd/mission.md` — «Lo que la autonomía no cubre».
- `tests/ControlProfiles.Tests.ps1` — anclas.

**NO se tocan**:

- `skills/sdd-feedback/SKILL.md` — la repetición de la línea la lleva el paso «Mensaje final».
- `skills/sdd-start-task/SKILL.md` — fichero caliente de otras tasks; no lo necesita.
- `.docs/sdd/constitution.md` — el Art. IV ya reserva a una persona solo el merge a la estable y el tag.
- `.docs/sdd/capabilities/*` — las escribe el cierre al fusionar el delta.
- `.docs/sdd/sdd-kit.json` — `merge.push` solo con la frase del dev-lead, en la validación.

### 1.6 Dependencias

Molde de la task 0009 (`../20260923-120510-task-0009-merge-close/red/m`) y `m-close` de la 0008 (escenario F), por referencia.

### 1.7 Riesgos

| Riesgo | Probabilidad | Impacto | Mitigación |
| --- | --- | --- | --- |
| La guía del push abre la puerta a empujar en `pair` o sin la clave | media | alto | escenarios P y E como control |
| Mover el aviso del disparador del paso 11 al 12 lo pierde | baja | medio | escenario F con el molde del patch 0037 |
| El harness bloquea git por el tool PowerShell | alta | medio | `--disallowedTools PowerShell` en el lanzador del GREEN |

### 1.8 Rollout

Directo, con la release 1.2.0.

### 1.9 Excepciones a la constitution

Ninguna.

---

## 2. Tasks

### Task 1 — `merge.push`: clave, gates y pregunta

**Modelo**: el del hilo (Opus 5.5)
**Ejecución**: en línea (decisión 1)
**Tests RED**: en línea; anclas en `tests/ControlProfiles.Tests.ps1` y `merge.push` en «Escribe» de `v1.2.0.md` (paridad)

**Superficies**: docs
**Verificación**: `pwsh -NoProfile -Command "Invoke-Pester -Path tests/ControlProfiles.Tests.ps1, tests/MigrationInitParity.Tests.ps1"`

**Interfaces**:
- Consume: nada.
- Produce: la clave `merge.push` (booleano, default `false`) y la pregunta 3 del bloque «Preguntas de las claves de control». Los frenos pasan a ser la pregunta 4.

**Ficheros**: `control-profiles.md`, las dos init, `v1.2.0.md`, `mission.md`, `tests/ControlProfiles.Tests.ps1`.

- [ ] **Step 1: RED** — en `ControlProfiles.Tests.ps1`: añadir `merge.push` a la lista de claves; comprobar que el bloque tiene al menos cuatro `Recomendad`; que greenfield y brownfield dicen «pregunta 4 del mismo bloque» para los frenos; y que `mission.md` nombra `merge.push`. En `v1.2.0.md`, `merge.push` en la línea «Escribe». Ejecutar la suite: fallan las anclas nuevas y la paridad.
- [ ] **Step 2: `control-profiles.md`**:
  - Perfil `unattended`: «…salvo el merge a `main`, el tag y las acciones hacia fuera (push, PR, publicar), que siempre decide una persona; el push de la rama de integración tras el merge del cierre sigue `merge.push`».
  - Tabla de gates: fila nueva «Push de la rama de integración tras el merge del cierre | presenta el push con el merge y espera | con `merge.push: true`, lo hace; sin él, no | igual que `delegate`»; la fila de persona pasa a «Merge a main, tag, cualquier otro push, PR, publicar».
  - Tabla de claves: `merge.push` | booleano | `false`. La frase de «bloque completo» dice que son tres campos y que `merge.push` es opcional.
  - Bloque de preguntas: pregunta 3 nueva, «Tras fusionar en `<rama de integración>`, ¿hago push de esa rama a su remoto sin preguntar?». Recomendado sí si la convención es `main` estable y `develop` de integración (git-flow): la rama de integración es compartida, y un merge sin push no lo ve nadie más; la rama estable, los tags y cualquier otro push siguen siendo de una persona. Con otra convención, sin recomendación. Escribe «sí»: `merge.push: true`; «no»: `merge.push: false`; «no sé»: nada. Solo se hace si la 2 dejó `merge` declarado. Los frenos pasan a ser la 4. Las notas bajo la tabla nombran la 3.
- [ ] **Step 3: init** — greenfield fila 19: «…política de merge y push, preguntas 2 y 3 del mismo bloque, una por turno»; fila 20: «pregunta 4». Brownfield fila 3: igual con «con esa rama»; fila 4: «pregunta 4».
- [ ] **Step 4: `v1.2.0.md`** — «Aplica» nombra `merge.push` con el bloque `merge` completo. En el paso 2, la pregunta 3 se hace cuando falta `merge.push` y el bloque está completo. El paso 5 escribe `"push"` dentro de `merge` si se obtuvo. «Escribe» lleva `merge.push`. La verificación añade una línea con `merge.push`.
- [ ] **Step 5: `mission.md`** — la frase de la spec (Scope).
- [ ] **Step 6: GREEN estructural** — la suite en verde.
- [ ] **Step 7: Commit** — `feat(skills): clave merge.push y su pregunta en las init y la migración (task 0040)`.

### Task 2 — Push en el paso de rama

**Modelo**: el del hilo (Opus 5.5)
**Ejecución**: en línea (decisión 1)
**Tests RED**: en línea; anclas en `tests/ControlProfiles.Tests.ps1`

**Superficies**: docs
**Verificación**: `pwsh -NoProfile -Command "Invoke-Pester -Path tests/ControlProfiles.Tests.ps1"`

**Interfaces**:
- Consume: `merge.push` (Task 1).
- Produce: sección `## Push` de `merge-recipe.md`, enlazada como `merge-recipe.md#push`.

**Ficheros**: `merge-recipe.md`, `sdd-end-task/SKILL.md` (paso 10), `sdd-end-patch/SKILL.md` (paso 6), `tests/ControlProfiles.Tests.ps1`.

- [ ] **Step 1: RED** — anclas: los dos pasos enlazan `merge-recipe.md#push` y nombran `merge.push`; la receta tiene `## Push`, nombra `@{upstream}` y prohíbe `--force`. Ejecutar la suite: fallan.
- [ ] **Step 2: receta** — sección `## Push`, tras «Suite y retirada»:
  1. Solo con el merge hecho y la suite en verde, `merge.push: true` y perfil `delegate` o `unattended`. En `pair`, se presenta con el merge y se espera. Sin la clave o a `false`, no se hace.
  2. `git rev-parse --abbrev-ref <destino>@{upstream}` da el remoto y la rama. Sin upstream, no hay push, y el mensaje final lo dice.
  3. `git push <remoto> <destino>`, desde cualquier worktree del repo y antes de retirar el temporal. Nunca `--force`, ni tags, ni la rama de la feature.
  4. Si falla (rechazado porque el remoto avanzó, sin credenciales, denegado), no se reintenta con `--force`, `pull`, `rebase` ni otra herramienta. El mensaje final cita el comando literal en un bloque, cita el error y dice que el merge queda en local con el hash del destino.
- [ ] **Step 3: pasos de rama** — `sdd-end-task` paso 10: sustituir «Push y creación de PR se confirman siempre, en los tres perfiles.» por «Con `merge.push: true` y perfil `delegate` o `unattended`, tras el merge haz push de `merge.into` siguiendo la [receta](references/merge-recipe.md#push): solo esa rama, a su upstream, nunca `--force`; si falla, no reintentes. Cualquier otro push y la creación de PR se confirman siempre, en los tres perfiles.». `sdd-end-patch` paso 6: lo mismo, con la ruta `../sdd-end-task/references/merge-recipe.md#push`.
- [ ] **Step 4: GREEN estructural** — la suite en verde.
- [ ] **Step 5: Commit** — `feat(skills): push de la rama de integración en el cierre según merge.push (task 0040)`.

### Task 3 — Paso «Mensaje final»

**Modelo**: el del hilo (Opus 5.5)
**Ejecución**: en línea (decisión 1)
**Tests RED**: en línea; anclas en `tests/ControlProfiles.Tests.ps1` (la del paso 11 pasa al 12)

**Superficies**: docs
**Verificación**: `pwsh -NoProfile -Command "Invoke-Pester -Path tests/ControlProfiles.Tests.ps1"`

**Interfaces**:
- Consume: la sección «Push» (Task 2) para el estado del push.
- Produce: paso 12 de `sdd-end-task` y paso 8 de `sdd-end-patch`, los dos «**Mensaje final**».

**Ficheros**: `sdd-end-task/SKILL.md` (pasos 0, 11 y 12), `sdd-end-patch/SKILL.md` (overview, 7 y 8), `tests/ControlProfiles.Tests.ps1`.

- [ ] **Step 1: RED** — anclas: el paso 12 de `sdd-end-task` y el 8 de `sdd-end-patch` empiezan por «**Mensaje final**» y contienen `Terminado` y `worktree`; el 12 contiene «lo elegí yo»; el paso 0 remite al paso 12; el 11 ya no contiene «lo elegí yo». Ejecutar la suite: fallan.
- [ ] **Step 2: `sdd-end-task`** — el paso 0 dice «(paso 12)». El paso 11 queda: «**Ticket para el kit** — decide si ofreces generar el ticket de mejora del kit con `sdd-feedback`: se ofrece salvo que esta sesión ya lo haya generado. La oferta va en el mensaje final; no es un gate.». Paso 12 nuevo, «**Mensaje final**»: el último mensaje del cierre, en este orden y solo con lo que tenga contenido:
  1. Si en el paso 0 concretaste tú el disparador: «disparador: <…>, a cargo de <…>; lo elegí yo porque tu frase no lo nombraba, corrígelo si no es el tuyo».
  2. Las decisiones tomadas sin el dev-lead que registra el walkthrough.
  3. Cada instrucción que el dev-lead dio antes del cierre (al validar, por ejemplo) y cómo quedó.
  4. Lo pendiente, con la evidencia de un merge o un push denegados o fallidos.
  5. La oferta del ticket (paso 11).
  6. La última línea, siempre. Con la rama fusionada en `merge.into` y el worktree sin cambios sin commitear: `**Terminado.** <rama> fusionada en <destino> (<hash>) · push: <hecho a <remoto>/<destino> | no hecho: <motivo>> · puedes borrar el worktree <ruta>`. Si no: `**No terminado.** Falta <qué>. No borres todavía el worktree <ruta>.` El ejemplo va en otro dominio que el molde (`feature/0212` en `develop`, `D:\work\billing\0212`).
  Si el dev-lead acepta después el ticket, al escribirlo repite la última línea: el ticket es un fichero nuevo del worktree, y queda pendiente hasta que se commitee y se fusione.
- [ ] **Step 3: `sdd-end-patch`** — el overview dice «seis pasos… el séptimo es una oferta y el octavo, el mensaje final». El paso 7 deja la oferta para el mensaje final. Paso 8 «**Mensaje final**», con el mismo orden y la misma línea, y las decisiones sin el dev-lead tomadas de `patch.md`.
- [ ] **Step 4: GREEN estructural** — la suite en verde.
- [ ] **Step 5: Commit** — `feat(skills): paso Mensaje final con la línea de terminado en los dos cierres (task 0040)`.

### Task 4 — GREEN

**Modelo**: el del hilo (Opus 5.5) orquesta; sujetos Sonnet headless
**Ejecución**: en línea (decisión 1)
**Tests RED**: no aplica: es la verificación de conducta de las tasks 1 a 3

**Superficies**: tooling (lanzador de sujetos) · docs
**Verificación**: los veredictos del GREEN leídos en `green/out/` (stream y estado de git de cada sujeto)

**Interfaces**:
- Consume: el texto de las tasks 1 a 3, en una copia limpia del kit.
- Produce: `tests/close-push-red.md`, `tests/close-push-green.md` y `green/`.

**Ficheros**: `green/` (lanzador, salidas), `tests/close-push-*.md`.

- [ ] **Step 1: lanzador** — reutiliza `red/subject.sh` con `--disallowedTools PowerShell`; añade los escenarios E, P (`control.profile: "pair"`), D (hook de la 0009 `deny-merge.js`), T (segundo turno «sí, genera el ticket» con `--resume`), I e I2 (init greenfield situada en la pregunta 3), M (migración con `merge` completo sin `push`) y F (`m-close` de la 0008 con el lanzador del patch 0037).
- [ ] **Step 2: comprobación previa** de cada escenario (lista de `tech-stack.md`) y `DRY=1`.
- [ ] **Step 3: tanda** — dos sujetos por escenario, en serie, con techo de 14 $.
- [ ] **Step 4: veredictos** — por escenario, contra la spec: push hecho o no, bloque del push fallido, orden del mensaje, última línea, ruta del worktree, ruling, instrucción, disparador y pregunta con su recomendación. Cada `state.txt` con coste > 0.
- [ ] **Step 5: REFACTOR** si algún escenario falla, con re-verificación 2/2.
- [ ] **Step 6: evidencia** — `tests/close-push-red.md` y `tests/close-push-green.md`.
- [ ] **Step 7: Commit** — `test(skills): RED y GREEN del final del cierre (task 0040)`.

---

## Estimación y esfuerzo

- Tipo: docs
- Esfuerzo spec + plan: 1,3h
- Estimación de implementación: 2,5h
- Base de la estimación: cuatro tasks en línea de texto de skill más una campaña de 22 sujetos; referencia 0009 (3h estimadas, 1,5h reales, campaña de 14 sujetos) y factor de calibración `docs` 0,51.
- Confianza: media

---

## 3. Validación final

- [ ] Gate de cierre, una vez y en el hilo principal: `pwsh -NoProfile -Command "Invoke-Pester -Path tests"`
- [ ] GREEN: once escenarios, 2/2 cada uno
- [ ] Revisión de rama sin Critical ni Important abiertos
- [ ] Cierre con `sdd-end-task`, validado por el dev-lead

---

## 4. Self-review (cobertura spec → tasks)

- MODIFIED «El perfil de control decide dónde para el agente» → Task 1 (perfil `unattended`, tabla de gates, `mission.md`); escenarios P y E. ✓
- ADDED «El push de la rama de integración sigue `merge.push`» → Task 1 (clave) y Task 2 (receta y pasos); escenarios A y B. ✓
- ADDED «Sin autorización, el push no lo hace el agente solo» → Task 2; escenarios P y E. ✓
- ADDED «Un push que no sale se informa y no se fuerza» → Task 2; A y B (el remoto no acepta credenciales). ✓
- ADDED «El cierre acaba con una línea de terminado» → Task 3; A, B, C, D, E, T y F. ✓
- Reglas «Avisos» y «Regla ante conflicto» → la capacidad las recibe en el cierre; el texto de skill en Tasks 2 y 3. ✓
- MODIFIED `onboarding` «La entrevista fija las claves de control» → Task 1; escenarios I e I2. ✓
- MODIFIED `migration` «La migración a v1.2.0 pregunta las claves de control que faltan» → Task 1; escenario M. ✓
- F4 (instrucción al validar) → control C, sin guidance propia (decisión 11 de la spec). ✓
