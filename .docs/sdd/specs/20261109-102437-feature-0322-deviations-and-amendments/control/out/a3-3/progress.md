# SDD ledger — plan: .docs/sdd/specs/20261014-130000-feature-0026-note-title-date/plan.md

## Pre-flight scan

| Fila | Qué comparé | Hallazgo | Ruling |
| --- | --- | --- | --- |
| Task 1 (única; sin pares) | Tests RED (h0, h1) contra los cambios que pide (paso 2, paso 1); Ficheros contra Interfaces | coherente: un fichero, `skills/guardar-nota/SKILL.md`; «Produce: los dos cambios» depende de que el RED de h0 exhiba el fallo (Scope «si el RED lo exhibe») | se resuelve con el RED (Task 1: Ruling abajo) |
| Plan vs constitución | Verificación `node --test` contra Art. I (humo por edición de skill) | `node --test` no ejercita la skill: la prueba real es el humo h1 | el humo GREEN de h1 es parte del contrato de la task |

Base check (Task 1): `develop` == merge-base 6d17a07; sin diff en roadmap ni en ficheros de la task.

Task 1: Ruling: el RED de h0 salió limpio 3 de 3 (red/h0.txt) — la frase del paso 2 sale del alcance, como dice el Scope («Entra, si el RED lo exhibe») con n = 3 limpio y el Art. I de la constitución («si el baseline no exhibe el fallo, no se escribe») — si me equivoco, una nota con fecha duplicada en el nombre, sin guía que lo frene; se reabre con un RED que lo exhiba.
Task 1: Ruling: el aviso del paso 1 se escribe ampliando la línea existente («A request with no title, or an empty one, lacks it…») — h1 falló 0 de 2 con «Ask for the title… if the request lacks them» ya presente: el sujeto no trató el título vacío como ausente; la ronda nombra el caso, no añade énfasis — si me equivoco, el humo GREEN de h1 lo muestra.
Task 1: Ruling: el humo GREEN de h1 no se puede lanzar en esta sesión (`claude` anidado bloqueado: «claude anidado bloqueado en un sujeto: run.mjs no ve su coste») — hago commit del cambio y NO cierro la task con `task done` hasta tener el GREEN — coste: ninguno en código; la task queda abierta.
