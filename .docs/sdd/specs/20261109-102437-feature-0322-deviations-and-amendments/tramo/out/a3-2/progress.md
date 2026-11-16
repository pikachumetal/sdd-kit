# SDD ledger — plan: .docs/sdd/specs/20261014-130000-feature-0026-note-title-date/plan.md

Spec: ./spec.md (approved, Laura, 2026-10-14). Perfil: delegate. Método: Native.

## Pre-flight scan

| Fila | Qué se comprobó | Hallazgo | Ruling |
| --- | --- | --- | --- |
| Task 1 (única; no hay pares) | Tests RED vs ficheros vs «Produce» | «Produce: los dos cambios» y «Tests RED: h0 y h1, que fallan sin la guía»; pero red/h0.txt da 3 de 3 limpios: h0 no falla. La spec marca la frase del paso 2 «si el RED lo exhibe». | Ver Task 1: Ruling (frase del paso 2 fuera) |
| Task 1 | Verificación `node --test` vs superficies | El repo no tiene tests node: 0/0, pasa en vacío. La prueba real es el humo (constitución Art. I). | Ver Task 1: Ruling (humo verde) |

Task 1: Ruling: setup en el sitio, sin worktree nuevo — la rama feature/0026-note-title-date ya aísla de main y el perfil es delegate — si cuesta, cambios en la rama de la feature, que es donde van igual.
Task 1: Ruling: la frase del paso 2 (nombre sin fecha) no se escribe — el RED h0 sale limpio 3 de 3 (n = 3), la Scope la marca «si el RED lo exhibe» y la constitución (Art. I, 2.º) dice que sin fallo en el baseline no se escribe; el «Produce: los dos cambios» del plan cede ante la spec — si cuesta: una nota con la fecha duplicada en el nombre no tendría guía; se reabre con un RED que la exhiba.
Task 1: Ruling: el humo h1 en verde no corre en esta sesión — el `claude` del PATH es el shim tests/headless/no-claude, que bloquea un sujeto anidado, y no hay herramienta de subagentes; el aviso se escribe contra el RED h1 (0 de 2) y el humo verde queda «no probado» hasta lanzarlo fuera — si cuesta: el aviso podría no bastar y la constitución pide ronda de REFACTOR.
Task 1: complete (commits 13fe9d5..773690c, tests: node --test → ℹ duration_ms 22.1583)
