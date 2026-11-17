# SDD ledger — plan: .docs/sdd/specs/20261014-130000-feature-0026-note-title-date/plan.md

## Pre-flight scan

| Fila | Qué se comprobó | Hallazgo |
| --- | --- | --- |
| Task 1 (única; sin pares que compartan fichero) | Tests RED que nombra (`h0`, `h1`) contra lo que la task manda escribir (frase del paso 2 + aviso del paso 1) | `h1`: RED 0/2, falla como debe. `h0`: RED 2/2 limpio — el baseline no exhibe el fallo. La constitución (Art. I, segundo) dice «si el baseline no exhibe el fallo, no se escribe». El Scope de la spec manda la frase sin la marca «si el RED lo exhibe» y el RED es n = 2, no n = 3. |
| Task 1 | Verificación `node --test` contra lo que se cambia | El repo no tiene tests de node: `node --test` no prueba la skill; la prueba real son los humos (Art. I). |
| Base | `git diff merge-base..develop` de ROADMAP.md y de `skills/guardar-nota/SKILL.md` | Sin cambios: solo `.docs/sdd/sdd-kit.json`, fuera de la task. |

Task 1: Deviation: la frase del paso 2 (`h0` limpio) — escribirla incumple la constitución, quitarla cambia el Scope aprobado → parada ✋ en delegate; corrección propuesta en spec.md, sin commit.
