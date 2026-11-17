# Tasks — 0299

| Task | Estado | Commit |
| --- | --- | --- |
| 1 — Candidatos mecánicos | hecha | `59bf3435` |
| 2 — Confirmar las 11 propias | hecha | `fbd31fa` |
| 3 — Capa del kit de las 11 copias | hecha | `db227bb` |
| 4 — research.md | hecha | `bd8a58e` |

Revisión final: Spec opus+high, con fixes (6 Important, 6 Minor) · Código: no sale (spike) · Arquitectura: no (plan), sobre bd8a58e4
Pasada de fix: juntada en el cierre, 6 Important y 5 Minor arreglados (documento: sin test RED; comprobados con low-summary.mjs y render.mjs)
Re-revisión: bd8a58e4..la pasada de fix (juntada en el cierre), sdd-kit:effort-high + opus, 5 de 6 resueltos; abierto el 2 (Important nuevo en ticket-verdicts.mjs), arreglado en el hilo después

## Rulings

- Task 1: Ruling: umbrales que el plan no fija — compartidas con >= 5 frases de 6 palabras (las de 1-4 son frases hechas: 630 de 778) y tickets solo como cita (tests/…-red.md, field-reports/, «ticket de la», «dev-lead, 20»), no la palabra «ticket», que en sdd-feedback y sdd-roadmap es el dominio — coste si es erróneo: una regla repetida en menos de 10 palabras queda sin candidato
- Task 1: Ruling: base movida (fila 0300 nueva en roadmap de develop; la 0299 no cambia; solo .docs/sdd/roadmap.md, que la task no toca) — sigo — coste si es erróneo: ninguno
- Task 2: Ruling: las Tasks 2 y 3 se leyeron en una pasada, porque los candidatos cruzan propias y copias (un mismo bloque repetido tiene un sitio en cada lado); cada hallazgo va a la skill donde está su primer sitio — coste si es erróneo: ninguno, la tabla por skill cita también los sitios secundarios
- Task 2: Ruling: el sha de las citas es el de git blame (último commit que tocó la línea); el commit que introdujo cada frase, cuando difiere y se rastreó con git log -S, va en la nota del hallazgo — coste si es erróneo: un origen que apunta al commit que movió o tradujo el texto (4597d47e, 0490c649, 33d0d0b7, 2d738fbd), como avisa provenance.md
- Final: Ruling: el subagente 3 leyó unidades largas cortadas a ~650 caracteres y el 2 decidió 53 descartes de plantilla/preámbulo/frontmatter/fuente por la frase compartida — se declara en research §2.5, sin otra relectura — coste si es erróneo: alguna regla repetida más sin contar en esas clases
- Final: Ruling: el hilo reclasificó a fuente S149, S150, S218, S219, S295 y S334 (superpowers 7.0.0 ya repite el texto) y S211 de K2 a K5 — contrastado con el clon de superpowers v7.0.0 — coste si es erróneo: 6 parejas menos en sdd-agent-writing y sdd-tdd
