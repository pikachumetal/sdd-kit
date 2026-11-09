# SDD ledger — plan: .docs/sdd/specs/20261014-130000-feature-0026-note-title-date/plan.md

## Pre-flight scan

| Fila | Qué se comprobó | Hallazgo |
| --- | --- | --- |
| Task 1 (única; sin pares que compartan fichero) | Tests RED (`h0`, `h1`) contra el cambio que pide (frase del paso 2, aviso del paso 1) | `h0` sale limpio 2 de 2: el baseline no exhibe el fallo. La constitución (segundo «Art. I») prohíbe escribir esa guidance. El Scope no la marca «si el RED lo exhibe» → desvío de spec, no ruling. |
| Task 1 | «Verificación: `node --test`» contra el repo | No hay tests de node: `node --test` da 0 tests y sale 0; no prueba nada del cambio. La prueba real es el humo (Art. I). |
| Constitución | Artículos | Dos artículos numerados «Art. I» con reglas distintas (humo + REFACTOR / no escribir sin baseline que falle). Se aplican los dos. |

Base: `git diff` con `develop` limpio (roadmap y ficheros); sin remoto.

Task 1: Ruling: escribo solo el aviso del paso 1 (h1, RED 0 de 2) sin commitear — está dentro de la spec aprobada — si es erróneo, se descarta con un `git checkout` del fichero.
Task 1: Ruling: el humo GREEN de h1 no se puede lanzar en esta sesión — el `claude` del PATH es un stub que bloquea sujetos anidados — la task no se cierra sin él (constitución, Art. I).
Task 1: Desvío: quitar de la spec la frase del paso 2 (h0 limpio 2 de 2) — propuesta en spec.md sin commitear, pendiente del dev-lead. Parado.
