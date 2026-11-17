# SDD ledger — plan: .docs/sdd/specs/20261014-130000-feature-0026-note-title-date/plan.md

## Pre-flight scan
| Fila | Qué comprobé | Hallazgo |
| --- | --- | --- |
| Task 1 (única; sin pares que compartan fichero) | Tests RED (h0, h1) frente a los dos cambios de «Produce» y al Scope | h0 limpio 3/3: el Scope marca la frase del paso 2 «si el RED lo exhibe» y la constitución (Art. I, 2.º) dice que sin fallo en el baseline no se escribe → sale con Ruling. h1 falla 0/2 → se escribe el aviso del paso 1. |
| Task 1 | Verificación `node --test` frente a la superficie (docs/skill) | El repo no tiene tests de Node: `node --test` corre 0 tests; la prueba real es el humo h1 en verde (Art. I, 1.º). |

Setup: Ruling: trabajo en la rama feature/0026-note-title-date del checkout, sin worktree nuevo — ya es rama de feature, no main, y los RED están sin commitear aquí; perfil delegate — si fuera mal, el trabajo vive en otra rama y se mueve con un cherry-pick.
Setup: baseline `node --test` en worktree detached → 0 tests, exit 0.
Setup: effort — Native sin despachos hasta la revisión final; se comprueba allí.
Task 1: Ruling: la frase del paso 2 (sin fecha en el nombre) no se escribe — el Scope la condiciona a «si el RED lo exhibe» y h0 salió limpio 3/3 (n = 3); la constitución, Art. I (2.º), prohíbe escribir guidance cuyo baseline no exhibe el fallo — si fuera mal, el THEN «el fichero no añade otra fecha» queda cubierto solo por el comportamiento actual del modelo, sin guidance que lo sostenga.
Task 1: Ruling: el brief dice que h0 «falla sin la guía»; el RED dice lo contrario — manda el RED (la spec condiciona ese ítem a él) — coste si fuera mal: ninguno sobre el código, solo la redacción del plan.
Task 1: GREEN escrito en skills/guardar-nota/SKILL.md paso 1 (sin commit). Humo h1 en verde NO corrido: el `claude` de la sesión es el stub tests/headless/no-claude («claude anidado bloqueado en un sujeto»), no hay sujeto headless. Task NO completa.
