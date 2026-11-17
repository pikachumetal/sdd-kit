---
id: 20261025-160210-patch-0217-pester-git-env-anatomy
task: 0217
title: Patch — los tests Pester que llaman a git limpian las variables de git, y un test de anatomía lo comprueba
type: patch
solution: dev-lead
status: done
created: 2026-10-25
branch: feature/0217-pester-git-env-anatomy
commit: 9ef30369
---

# Patch 0217 — los tests Pester que llaman a git limpian las variables de git, y un test de anatomía lo comprueba

## Capacidades

- Ninguna, porque ninguna capacidad describe la suite Pester del repo: es una herramienta de este repo, no del kit que reciben los proyectos.

## 1. Síntoma

Del [ticket del patch 0169](../../field-reports/20261025-151935-patch-0169-git-hooks-warning.md) §1: los tests nuevos de `tests/KitSessionSource.Tests.ps1` hacían `git init` sin `Clear-GitEnv`. Dentro del pre-commit, git exporta `GIT_DIR`; el `git init` reinicializó el repo común del kit con `core.bare = true`, y el checkout principal dio `fatal: this operation must be run in a work tree`. La regla ya estaba en `tech-stack.md` («Dentro de un hook de git, `git -C` no basta…») y nada la comprobaba; es el tercer caso (task 0001, feature 0095).

## 2. Solución fijada

Fila 0217 del roadmap (dev-lead, 2026-10-25): «un test de anatomía recorre `tests/*.Tests.ps1` y falla nombrando el fichero si llama a `git init` sin hacer dot-source de `tests/Clear-GitEnv.ps1` y llamar a `Clear-GitEnv` en un `BeforeAll`; la lectura de la raíz del kit con `git -C $script:KitRoot` (`tests/Hook.Tests.ps1:33-34`) y la de un clon de referencia (`tests/VerifySkill.Tests.ps1:79`) se contrastan al arrancar: o el test cubre también `git -C` con una excepción para esas lecturas, o solo `git init`».

Lo que da por existente, comprobado: `tests/Clear-GitEnv.ps1` (con `Clear-GitEnv` y `Restore-GitEnv`) y su test `tests/Clear-GitEnv.Tests.ps1`; las dos lecturas citadas, en esas líneas.

Contraste de las dos lecturas:

- `Hook.Tests.ps1:33-34` lee la raíz del kit. Dentro del pre-commit, `GIT_DIR` apunta a ese mismo repo y `GIT_INDEX_FILE` al índice del commit en curso: lee el repo correcto, y no escribe. Inocua: excepción.
- `VerifySkill.Tests.ps1:79` lee un clon de `SDD_UPSTREAM_DIR`, otro repo. Dentro de un hook, `GIT_DIR` gana a `-C` y `git show v1.8.0:…` leería el repo del kit: lee el repo equivocado. Hoy no corre en el pre-commit (va con la etiqueta `Slow`), pero no es inocua: no lleva excepción, lleva `Clear-GitEnv`.

## 3. Fix

- **Fichero(s)**: `tests/Clear-GitEnv.Tests.ps1`, `tests/VerifySkill.Tests.ps1`, `tests/TempDir.Tests.ps1`, `tests/Hook.Tests.ps1`
- **Cambio**: un `Describe` nuevo en `tests/Clear-GitEnv.Tests.ps1` recorre con el AST de PowerShell cada `tests/*.Tests.ps1`: si llama a `git` con `init` o con `-C` a un directorio que no es la raíz del kit, exige un `BeforeAll` con el dot-source de `Clear-GitEnv.ps1` y la llamada a `Clear-GitEnv`, y si no, falla con el nombre del fichero. `VerifySkill.Tests.ps1` y `TempDir.Tests.ps1`, que el test señala, limpian en su `BeforeAll` y reponen en un `AfterAll`.
- **Decisiones**:
  - El test falla nombrando el fichero; con `Clear-GitEnv` en su `BeforeAll`, pasa — dev-lead (criterio de aceptación del ticket)
  - Cubre también `git -C`, con excepción solo para la raíz del kit (`$script:KitRoot`, `$script:RepoRoot`), y `VerifySkill.Tests.ps1` limpia las variables en vez de llevar excepción — sin el dev-lead (resultado del contraste que pidió la fila; no cambia lo que ve ni puede hacer el usuario del kit: es la suite de este repo)
  - El recorrido usa el AST, no una expresión regular: un `git init` dentro de un texto o un comentario no cuenta, y el propio test de anatomía no se señala a sí mismo — sin el dev-lead
  - `TempDir.Tests.ps1` pasa la limpieza de dentro del `It` a su `BeforeAll`, como pide la regla — sin el dev-lead
  - `Hook.Tests.ps1` limpia también las variables, aunque su lectura sea de la raíz: con el señuelo leyó el repo equivocado (§4) — sin el dev-lead
  - Sin texto de skill: no pide RED de sujetos (Art. I) — dev-lead

## 4. Verificación

| # | Caso | Resultado |
| --- | --- | --- |
| 1 | RED: el test de anatomía sobre el árbol actual | 9/1: señala `TempDir.Tests.ps1` y `VerifySkill.Tests.ps1`; los casos de fixture (`git init` y `git -C` sin `Clear-GitEnv` fallan, con `Clear-GitEnv` en el `BeforeAll` pasa, lectura de la raíz y texto no cuentan) en verde |
| 2 | GREEN: `Invoke-Pester tests/Clear-GitEnv.Tests.ps1, tests/VerifySkill.Tests.ps1` | 10/0 · 41/0 |
| 3 | `pwsh -File tests/Invoke-KitTests.ps1` con `GIT_DIR` y `GIT_INDEX_FILE` en un repo señuelo del scratchpad; `git config core.bare` del kit después | 1ª pasada 1373/2: `Hook.Tests.ps1` «es ejecutable en git» leía el señuelo con `git -C $script:KitRoot` (ver abajo) y `FastSuiteBudget`. Tras limpiar en `Hook.Tests.ps1`: 1374/1, solo `FastSuiteBudget` (48,4 s frente a 30 s, CPU al 79 % con otras sesiones: fila de deuda «`FastSuiteBudget` falla con la máquina cargada»; el test nuevo suma 1,2 s). `core.bare` del kit y del señuelo: `false` |
| 4 | Commit del fix con el pre-commit activo (`git config core.hooksPath` → `.githooks`) | `kit:test-fast` 1289/0 · `core.bare` del kit después: `false` |

La excepción de la raíz del kit supone que el `GIT_DIR` heredado es el del propio kit, como en su pre-commit. El señuelo lo desmiente: `Hook.Tests.ps1:33-34` leyó el repo señuelo y falló. Por eso `Hook.Tests.ps1` también limpia las variables en su `BeforeAll`. La excepción se queda para las lecturas de la raíz que no comprueban nada del repo, como `SubjectOutputPrivacy.Tests.ps1`, que pasó con el señuelo.

Gate de cierre (`moon run kit:test cli:typecheck cli:test cli:test-slow cli:test-min`), tres pasadas sobre `bd2f78e2`; el PC se colgó durante dos de ellas, con la CPU al 70-80 % por otras sesiones:

- 1ª: `cli:test` 1164/1164; `kit:test` en rojo en `FastSuiteBudget`. El cuelgue cortó la salida.
- 2ª: `kit:test` 1373/2, con `FastSuiteBudget` (55,6 s) y el `SUBJECT_TIMEOUT` de `HeadlessLauncher` (41,5 s frente a un tope de 40 s). Sin la rama, en `74607f4d`: `FastSuiteBudget` falla también (38,3 s), y `SUBJECT_TIMEOUT` pasa con 24,9 s. Ninguno de los dos ficheros cambia en la rama.
- 3ª, tras el segundo cuelgue y con la orden del dev-lead de repetir el gate: `cli:test` 1164/1164; `kit:test` 1374/1. Los dos rojos de tiempo pasan, y sale «acepta RUNS_DIR bajo .temp/ del repo», determinista y ajeno a la rama: Git Bash montó `/tmp` sobre `.temp/` de este worktree. Va a una fila de deuda nueva, «`lib.sh` rechaza un `RUNS_DIR` bajo `.temp/`…».

Validación en campo: 2026-10-25 · RED 9/1 → GREEN 10/0 en `tests/Clear-GitEnv.Tests.ps1` · suite con `GIT_DIR` señuelo 1374/1 (`FastSuiteBudget` por carga, deuda conocida) y `core.bare` en `false` · pre-commit 1289/0 · no probado: un `tests/*.Tests.ps1` nuevo con `git init` sin `Clear-GitEnv` commiteado de verdad (lo cubre la fixture)

## 5. Tiempo (ligero)

- Estimación: 0,5 h
- Inicio: 2026-10-25T16:02Z
- Esfuerzo real: 0,75 h — reloj de la sesión 0,75 h desde 2026-10-25T16:00Z, sin 0 min de espera al dev-lead (0 esperas)
- Desvío: +50 %, por dos pasadas de la suite completa con el repo señuelo (~10 min cada una, con la máquina cargada por otras sesiones); la segunda la pidió el rojo de `Hook.Tests.ps1`
- Coste de sujetos: no aplica
