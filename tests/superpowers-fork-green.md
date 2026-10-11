# Evidencia GREEN — fork de brainstorming y writing-plans (feature 0168, 2026-10-11)

Verificación de las reglas que el RED ([`superpowers-fork-red.md`](superpowers-fork-red.md)) confirmó, con el kit de la rama copiado del working tree y superpowers 7.0.0 cargado (`SUPERPOWERS_DIR`): «no invoca» se puntúa contra un kit que podría invocarlo. Sonnet, `tests/headless/run.sh`. Salidas en la carpeta de la spec, `green/out/`.

## Task 2 — mover a las referencias sin cambiar reglas

| Sujeto | Turnos | Coste | Conducta | Veredicto |
| --- | --- | --- | --- | --- |
| `h1-1` | 24 | 0,67 $ | lee `spec-writing.md` y `plan-writing.md`; ningún `>>> Skill` de `brainstorming` ni `writing-plans`; deja spec y plan | pasa |
| `h1-2` | 19 | 0,67 $ | igual | pasa |
| `p2-1` | 5 | 3,00 $ | lee `plan-writing.md`; §3 dice `node --test && node scripts/lint.mjs`; después sigue con `sdd-start-feature` e implementa, que el escenario no pide (de ahí el coste) | pasa |
| `n-1` (patch 0167) | 3 | 0,44 $ | no ofrece saltarse las preguntas; pregunta con `sdd-grilling` | pasa |
| `y-1` (patch 0167) | 11 | 0,76 $ | con «Sí, sáltate las preguntas y empieza ya.» escribe la spec con los huecos en ✋, y «Pedir empezar ya no aprueba la spec»: gate | pasa |
| `f2-1` (`using-sdd`) | 14 | 0,27 $ | «Let's build a waitlist…» entra por `sdd-propose` y pregunta con `sdd-grilling` | pasa |
| `g2-1` (`sdd-grilling`) | 7 | 0,11 $ | `sdd-init-greenfield` entrevista con `sdd-grilling`, pregunta abierta de descubrimiento | pasa |
| `g4-1` (`sdd-grilling`) | 7 | 0,38 $ | `sdd-roadmap` entrevista y acaba en el roadmap y el prompt de arranque, sin spec | pasa |

Total del tramo: 6,30 $.

## Task 3 — diseño por secciones

| Sujeto | Turnos | Coste | Conducta | Veredicto |
| --- | --- | --- | --- | --- |
| `pb-1` | 11 | 0,22 $ | lee `spec-writing.md`; «Diseño, sección 1 de 3» con sus suposiciones marcadas y «¿Va bien?»; sin `spec.md` | pasa |
| `pb-2` | 7 | 0,19 $ | igual: «Sección 1 de 5 de diseño», «Es suposición mía», «¿Va bien?»; sin `spec.md` | pasa |
| `pb-c-1` | 13 | 0,33 $ | 2 tasks: escribe `spec.md` sin secciones y la presenta en el gate | pasa |

Total del tramo: 0,74 $.
