# SDD ledger — plan: .docs/sdd/specs/20261014-130000-feature-0026-note-title-date/plan.md

## Pre-flight scan

| Fila | Qué comparé | Hallazgo |
| --- | --- | --- |
| Task 1 (única; sin pares que compartan fichero) | «Produce: los dos cambios» contra el Scope de la spec y `red/h0.txt` | La frase del paso 2 es «Entra, si el RED lo exhibe» y h0 sale limpio 3 de 3: el plan pide un cambio que la spec deja fuera → Ruling abajo |
| Task 1 | Tests RED (h0, h1) contra Verificación `node --test` | `node --test` no ejecuta los humos (0 tests): no prueba la task; el GREEN es el humo h1 |

Task 1: Ruling: sigo en el checkout del repo, en `feature/0026-note-title-date`, sin worktree aparte — la rama ya es la de la feature, no main, y la base (develop) no se ha movido — si estaba mal, cuesta mover un commit.
Task 1: Ruling: la frase del paso 2 (sin fecha en el nombre) sale del Scope — ítem «si el RED lo exhibe» con h0 limpio a n = 3; la constitución (Art. I, 2.º) prohíbe escribir guía cuyo baseline no exhibe el fallo — si estaba mal, cuesta una task de enmienda con su humo.
Task 1: Ruling: el aviso del paso 1 solo dice «pide el título»; descarto «no escribas nada hasta que lo dé» y «no inventes uno» por ser ANDs que el THEN no tiene — si no basta para que h1 pase, la ronda de REFACTOR tendrá que pasar por el dev-lead como desvío.
Task 1: Ruling: GREEN de h1 no ejecutado — el `claude` de esta sesión es el stub `tests/headless/no-claude` («claude anidado bloqueado en un sujeto») — la task queda sin línea `complete` hasta que corra el humo.
