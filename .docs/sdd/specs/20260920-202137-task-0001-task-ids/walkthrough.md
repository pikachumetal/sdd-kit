---
id: 20260920-202137-task-0001-task-ids
task: 0001
title: Walkthrough — Ids de task y numeración sin gestor de tickets
spec: ./spec.md
plan: ./plan.md
status: done
created: 2026-09-20
---

# Walkthrough — Ids de task y numeración sin gestor de tickets

## 1. Cambios realizados

**Contrato del modo de ids** (`5466145`)
- `.docs/sdd/sdd-kit.json` gana `ids.mode` (`tracker` | `sequence`); sin el campo, el modo efectivo es `tracker` y nada cambia para un proyecto ya inicializado.
- `.docs/sdd/constitution.md`, Art. IV: la cláusula «con id de ticket (0000 si no hay)» pasa a contemplar los dos modos. Era incompatible con una secuencia propia y nada del cierre la habría actualizado.
- `sdd-init-greenfield` y `sdd-init-brownfield`: la entrevista pregunta cómo numera el proyecto y escribe la respuesta en el marcador; «no sé» deja `tracker`. El literal del marcador en `sdd-init-brownfield/references/generacion.md` también lleva `ids` (`541c8d1`).
- `spec-template.md` y `patch-template.md`: el comentario de `task:` nombra los dos orígenes del id y se añade `parent: <id>` para una task partida.
- `skills/sdd-init-brownfield/references/migrations/v1.2.0.md`: gate que pregunta el modo a un proyecto ya inicializado, con pendiente explícito si el dev-lead no está.

**Script de la secuencia** (`4796426`, `541c8d1`)
- `skills/sdd-templates/scripts/Get-NextSddId.ps1`, de solo lectura: el siguiente id libre a partir de las carpetas de `specs/`, la primera columna de tabla del roadmap y los nombres de rama. `0000` nunca cuenta. Avisa y no devuelve id si el proyecto numera con gestor o si dos artefactos comparten id.
- Dos aislamientos que el uso real exigió: la fuente «ramas» solo aplica si la raíz del proyecto es la raíz de su propio repositorio —y **avisa** cuando la omite—, y toda llamada a git limpia `GIT_DIR`, `GIT_WORK_TREE`, `GIT_INDEX_FILE` y `GIT_COMMON_DIR` del entorno.
- `tests/Get-NextSddId.Tests.ps1` (16 casos) con fixtures versionadas en `tests/fixtures/task-ids/`.

**Skills de carril** (`d37c93d`, `541c8d1`)
- `nombrado.md`: `<id>` depende del modo; secuencia única de tasks y patches; una task partida toma el siguiente id libre con `parent:` **y su fila propia en el roadmap**.
- `sdd-start-task`: de dónde sale el id en los pasos 3 y 4, y en `sequence` sin fila de roadmap la rama se crea antes de la carpeta porque es el acto de reserva. Fila de racionalización nueva tomada del baseline.
- `sdd-start-patch`: la regla del id, inline, y la secuencia compartida con las tasks.
- `sdd-start-release` y `roadmap-fuente.md`: reserva correlativa por fila, y «los ids no se inventan» precisado —el origen legítimo es el gestor o la secuencia del proyecto—.
- `sdd-consult`: puede calcular y proponer un id, nunca reservarlo ni escribirlo.

**Evidencia del Art. I** (`4796426`, `541c8d1`)
- `tests/task-ids-red.md` y `tests/task-ids-green.md`.
- `tests/TaskIds.Tests.ps1`: contrato de presencia en plantillas, migración, Art. IV, marcador y skills de carril.

## 2. Tiempo: estimado vs real

- Tipo: infra/tooling
- Estimación de implementación (del plan): 2,5h (rango 2–4h, condicionada al RED)
- Esfuerzo real: 0,9h de implementación (23:39 → 23:34 de reloj de hilo, con los sujetos y subagentes en paralelo) + 0,7h de spec y plan = **1,6h en total**
- Desviación: −1,6h (−64%) sobre la implementación
- Causa de la desviación: la de los avisos 2 y 3 de `estimation.md`, otra vez. Las dos campañas y los tres implementadores corrieron **en paralelo y en segundo plano**, así que su duración (12–17 min por sujeto) no suma al reloj del hilo; y las ediciones de guidance fueron de una a tres líneas por fichero. Lo que sí costó reloj: redactar la spec con sus 16 hallazgos de review (0,4h) y diagnosticar dos veces el mismo tipo de fallo de entorno (el `git init` del helper y el `GIT_DIR` heredado, ~0,3h).
- Review de spec: 2 revisores (dominio y técnica) · hallazgos 16, aceptados 16
- Coste de subagentes: ~835k tokens en 6 despachos (2 revisores de spec, 3 implementadores con sus reanudaciones, 1 revisor final) más 7,50 $ en 5 sujetos headless (RED 3,26 $, GREEN 4,24 $). Reloj del hilo: **no medido** con contador — el hilo principal no tiene uno expuesto al agente; la cifra de arriba sale de las marcas de los commits.

## 3. Desviaciones del plan

- **Un revisor final en vez de un revisor por task.** El plan preveía revisión por task; se ejecutó una sola revisión sobre el diff completo de la rama. Motivo: las tres tasks de implementación son pequeñas y ninguna toca ficheros de otra, así que un revisor con el diff completo ve también las incoherencias **entre** ellas — y el hallazgo 3 (el literal de `generacion.md` contradiciendo a su propio `SKILL.md`) es exactamente de ese tipo. Ruling del hilo, sin consultar al dev-lead.
- **Los tests RED no se commitearon antes de despachar**, como pide el paso 6 de `sdd-start-task`: el hook de pre-commit de este repo bloquea cualquier commit con la suite en rojo. Viajaron al implementador como ficheros del working tree, con la misma frase de contrato, y se commitearon junto a la implementación que los pone en verde. `TaskIds.Tests.ps1` esperó en el scratchpad con `$env:SDD_KIT_ROOT` mientras las Tasks 3 y 4 estaban en vuelo.
- **Alcance ampliado en un fichero**: `sdd-init-brownfield/references/generacion.md`, que §1.1 del plan no listaba. Lo pidió el hallazgo 3 de la revisión final y sin él el requisito `MODIFIED` de la capacidad `migration` quedaba incumplido.
- **El requisito «sin sufijos» se apoya en evidencia de campo, no en los sujetos**: 0/2 sujetos del RED usaron sufijo. Se mantuvo como una frase dentro del requisito del id propio, sin guidance ni tabla de racionalizaciones propias, y así consta en el RED.

## 4. Verificación

### 4.1 Builds

- `pwsh -NoProfile -Command "Invoke-Pester -Path tests -Output Normal"` → **184 passed, 0 failed, 5 skipped**. Ejecutado además con `GIT_DIR`/`GIT_WORK_TREE` contaminados a mano (lo que hace el hook): **182 passed, 0 failed** en ese momento del desarrollo, con el repositorio intacto.
- El hook de pre-commit del repo ejecutó la suite completa en cada uno de los siete commits de la rama.

### 4.2 Smoke / tests

- **Validado por el dev-lead**: **no**. El 2026-09-20 declinó probarlo con estas palabras: «esta tarea me es muy difícil de probar, en principio creo que es correcto». Todo lo que sigue lo verificó el agente; nada de esta tabla está confirmado por el dev-lead. Se le ofrecieron los comandos exactos antes del cierre.

| # | Caso | Resultado (verificado por el agente) |
| --- | --- | --- |
| 1 | Script sobre este repo, en modo `sequence` | `0018`, exit 0 — el máximo real es el patch `0017` |
| 2 | Proyecto en modo `tracker` | «El proyecto no está en modo 'sequence' (modo actual: 'tracker'); asigna el id con el gestor de tickets, no con este script.», exit 1 |
| 3 | Proyecto sin campo `ids` | mismo aviso y exit 1: el modo efectivo es `tracker` |
| 4 | Dos artefactos con el mismo id | «Dos artefactos distintos comparten el id 0003: 20260901-120000-task-0003-export, 20260902-120000-patch-0003-crash.», exit 1 |
| 5 | Histórico con sufijo `…-task-0006a-…` | `0007`: el id heredado cuenta |
| 6 | Proyecto que no es raíz de su repositorio | devuelve `0006` **y** avisa: «Se omiten las ramas: la raíz del proyecto no es la raíz del repositorio…» |
| 7 | Id reservado solo por una rama | `feature/0009-export` en un repo aislado → `0010`; `hotfix/0011` → `0012` |
| 8 | El script no modifica el proyecto | `git status --porcelain` vacío después de ejecutarlo |
| 9 | Campaña GREEN, sujeto con id reservado | carpeta `…-task-0003-export-markdown`, `task: 0003` (en el RED: `0000`) |
| 10 | Campaña GREEN, task partida | ramas `feature/0004` y `feature/0005`; la mitad nueva toma `0005` con `parent: 0004`, sin sufijo |
| 11 | Campaña GREEN, no-regresión sin campo `ids` | `…-task-0000-markdown-export`: la conducta anterior, intacta |

### 4.3 Residuales / deuda generada

- **El paso 6 de `sdd-start-task` es incumplible en un repo con hook de suite verde.** Ninguna skill del kit prevé el choque entre «commitea los tests RED antes de despachar» y un hook que rechaza commits con la suite en rojo. Va a la tabla de deuda del roadmap y al ticket de campo.
- **Ramas basura por un test roto**: `feature/0009-export` y `hotfix/0011` quedaron colgando de un commit huérfano; las borró el dev-lead. Además contaminaban el cálculo del propio kit mientras existieron, que es justo el fallo que el script evita ahora con su aislamiento.
- **G1 y G3 no crearon la rama** («`git switch -c` requiere aprobación y la sesión no es interactiva»), igual que E1 en el RED. No es de esta task: es el carril con dev-lead ausente, que cubre la **task 0008**. En modo `sequence` con fila de roadmap no afecta al id; sí deja sin reserva el arranque **sin** fila, donde la rama es la marca.
- **El REFACTOR del GREEN no se re-verificó con un sujeto nuevo**: la frase «y su fila propia en el roadmap» es una línea dentro de un requisito ya validado. Su efecto se observa en el siguiente uso real del carril.

## 5. Aprendizajes

- **Un `git init` en un test puede reinicializar el repo que ejecuta la suite.** `$TestDrive` llega `$null` dentro de una función definida en `BeforeAll`, así que `Join-Path $TestDrive <guid>` dio una ruta relativa y `Push-Location` no cambió de directorio: el helper commiteó una fixture sobre la rama de trabajo. Dos veces, porque la segunda fue por otra causa (abajo). Regla: un test que crea repositorios **nunca cambia el cwd** —`git -C` siempre— y usa un temporal propio verificado, no `$TestDrive`. → `tech-stack.md` (§Fixtures y baselines)
- **Dentro de un hook de git, `git -C` no basta.** Git exporta `GIT_DIR` y `GIT_WORK_TREE` a sus hooks, y esas variables ganan a `-C`: cualquier script o test que llame a git desde un hook opera sobre el repositorio del hook. Todo código ejecutable del kit que llame a git limpia esas cuatro variables antes. → `tech-stack.md` (§Cómo se testean las skills) y el propio script como referencia
- **Un baseline puede fallar por un motivo distinto al previsto, y sigue siendo válido.** Se esperaba el sufijo `0006a`; ningún sujeto lo usó. Lo que falló fue peor y más barato de arreglar: la mitad partida no recibe id propio y la relación no queda registrada en ninguna parte. El alcance se recortó a lo que el baseline respalda, con el sufijo como una frase heredada de la evidencia de campo. → `tests/task-ids-red.md` (§Recorte de alcance) y ya recogido en `tech-stack.md`
- **La revisión final sobre el diff completo caza lo que la revisión por task no puede**: la contradicción entre `generacion.md` y el `SKILL.md` de su propia skill solo es visible mirando las dos tasks juntas. Para una rama de tasks pequeñas que no comparten ficheros, un revisor final vale más que tres revisores de task. → `plan-template.md` no se toca; queda como dato para la **task 0005** (despacho a subagentes), que es quien decide la política de revisión
- **El aviso vale más que el silencio cuando una fuente se omite por diseño.** El script no lee las ramas del repositorio padre a propósito, pero callarlo convertía un caso legítimo (proyecto dentro de un monorepo) en un id reemitido. La regla se conserva y se avisa. → aplicado en el script; el principio va a `constitution.md`, «Reglas de producto» → Avisos, si el kit las adopta para sí (hoy no las tiene; queda anotado para la **task 0013**)
