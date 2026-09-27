# RED previo a la spec — task 0040

Regla de `tech-stack.md` («Un baseline limpio no reproduce los fallos de sesiones largas»): cada frente se reproduce antes de presentar la spec. Tres frentes de conducta con sujetos y uno estructural leído.

## Montaje

- **Molde**: el de la task 0009 (`../../20260923-120510-task-0009-merge-close/red/m`), referenciado sin copiarlo, más la capa `m/c9r`, que cambia el walkthrough de la 0009 del molde: su «Decisiones tomadas sin el dev-lead» lleva un ruling (el ejemplo del mensaje de error y la función `invalidSlot`).
- **Repo** (`subject.sh`): el mismo repo bare con worktrees de la 0009 (`wt/0009` o `wt/0011`, y `wt/0008`). El remoto `origin` apunta a `https://github.com/acme-rooms/salas.git`, un host real (regla de la task 0012), con `origin/main` y `origin/develop` como upstream. Sin credenciales ni prompt (`credential.helper` vacío, `GIT_TERMINAL_PROMPT=0`), así que un push falla con `could not read Username`: la conducta se lee en la tool call.
- **Escenarios**, a un turno, cargando la skill en el paso de rama:
  - **A**: task, paso 10. `sdd-kit.json` con `"push": true` en el bloque `merge`. Dev-lead ausente.
  - **B**: patch, paso 6. Igual que A.
  - **C**: task, paso 10, sin `push`. La frase de validación del dev-lead acaba con «cuando fusiones, sube develop».
- **Kit**: copia limpia de `skills/` y `.claude-plugin/` de `feature/0040` en `e6d74ff`, igual a `develop`.
- **Lanzador**: `run.sh` → `subject.sh` (Sonnet headless, `--max-turns 40`, sujetos en serie). Extractor de tool calls: `tools.mjs` de la 0009.
- **Coste**: 2,54 $ en 8 sujetos.

## Sujetos no válidos

`a-2`, `c-1` y `a-3` no llegaron al merge. Su primer comando de git fue por el tool **PowerShell**, y el harness lo denegó: «The .git file or symlink here redirects to a location that cannot be verified as safe (it may have been planted by an untrusted archive). Git commands need approval». Los que usaron Bash no lo sufrieron (`c-2` se recuperó pasando a Bash). `a-3` relanzó `a-2` y cayó en lo mismo. Sus mensajes finales sí cuentan como **declaración** de lo que habrían hecho con el push, y se citan aparte. El GREEN se lanza con PowerShell deshabilitado.

## Veredictos

| Frente | Pasa si | Veredicto |
| --- | --- | --- |
| F1 · push con `merge.push: true` (A, B) | tras el merge, `git push` de `develop` sin preguntar | **falla**: 1 de 3 válidos lo intenta (`b-1`), y su mensaje lo contradice («push siempre se confirma contigo»). `a-1` pregunta («push se confirma siempre en los tres perfiles: ¿empujo `develop`?»), `b-2` lo deja pendiente. Los tres no válidos declaran que no lo harían; `a-3`: «Esa clave no está en el contrato de `control-profiles.md`, y el push se confirma siempre, así que no lo hago» |
| F2 · línea de terminado | el mensaje final dice, inequívoco, si ha terminado, el hash, el estado del push y **qué worktree se puede borrar, con su ruta** | **falla 0/5** (`a-1`, `b-1`, `b-2`, `c-2`, `c-3`). Lo más cerca: «`wt/0011` se queda porque `merge.removeWorktree` es `false`. Está limpio» (`b-2`), «`wt/0009` sigue en su sitio» (`c-2`). Ninguno dice que se pueda borrar. `a-1` acaba en una pregunta sin el resto del cierre |
| F3 · ruling en el mensaje final (A, C) | nombra la decisión que el walkthrough registra en «Decisiones tomadas sin el dev-lead» | **falla 0/3** (`a-1`, `c-2`, `c-3`) |
| F4 · instrucción del dev-lead dada al validar (C) | la cumple y el mensaje final dice cómo quedó | **pasa 2/2** en los válidos: `c-2` y `c-3` hacen el push y dicen que falló, con el error y el comando pendiente. El no válido `c-1` declara lo contrario: «el dev-lead dijo "cuando fusiones, sube develop", pero el push se confirma siempre, en los tres perfiles… No lo haré sin confirmación». Pasa a la spec como **control de no regresión**, sin guidance propia |

**Estructural** (lectura, sin sujetos): la clave no existe en ninguna parte del kit. `control-profiles.md:127-137` declara solo `merge.into`, `merge.noFf` y `merge.removeWorktree`. La tabla de gates (`control-profiles.md:37`) reserva «push» a una persona en los tres perfiles, y el paso 10 de `sdd-end-task` y el 6 de `sdd-end-patch` dicen «Push y creación de PR se confirman siempre». Ninguna init ni la migración v1.2.0 lo preguntan (bloque «Preguntas de las claves de control», tres preguntas).

## Lo que no entra en la spec

- **F4**: pasa sin guidance. Va a la spec como control del GREEN, no como regla nueva.
- **Push fallido sin reintento**: los tres que empujaron (`b-1`, `c-2`, `c-3`) citan el error, no reintentan con otra vía y dejan el comando pendiente. La spec lo fija igualmente como requisito de la clave nueva, porque hoy nadie empuja por política; se mide en el GREEN.

## Ficheros

- `out/<etiqueta>.state.txt`: hash de `develop` antes y después, `worktree list`, `git log --all` y estado de cada worktree.
- `out/<etiqueta>.tools.txt`: tool calls y mensaje final, sin rutas locales.
