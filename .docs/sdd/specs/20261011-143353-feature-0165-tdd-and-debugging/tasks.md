---
id: 20261011-143353-feature-0165-tdd-and-debugging
title: Tasks — sdd-tdd y sdd-debugging, forks delgados
spec: ./spec.md
plan: ./plan.md
created: 2026-10-11
---

# Tasks — `sdd-tdd` y `sdd-debugging` (registro vivo)

- **Spec**: `./spec.md`
- **Plan**: `./plan.md`
- **Rama**: `feature/0165-tdd-and-debugging`

## Estado de las tasks

| # | Task | Status | Commit | Notas |
| --- | --- | --- | --- | --- |
| 1 | Escenarios y RED: antipatrones, costura, RED del hilo y escritor de RED | done | de333606 | t2, t3, t4 y t5 limpios: no entran los antipatrones, la costura, la regla del hilo ni el escritor; Task 3 se salta |
| 2 | `sdd-tdd`, el encargo y lo que confirme la Task 1 | done | a37f85e5 | A/B de `t1`: gana A (paso literal), el encargo no carga la skill; fila de racionalización del bucle Native movida a `sdd-tdd` por el tope |
| 3 | Escritor de RED opcional en Native (solo si `t5` lo gana) | skipped | — | t5 no gana: el RED del hilo sale limpio |
| 4 | `sdd-debugging` y el recableado | done | 10476382 | `d1` en dos rondas de REFACTOR: §2 de `patch.md` antes del arreglo, 2/2; `sdd-start-feature` y la salida de `sdd-explore`, rulings |
| 5 | Documentos, filas y topes finales | done | 37a2704f | + regla de poner al día un fork (fila de la base, aprobada) |

Revisión final: sdd-kit:effort-high + opus, con arreglos (0 Critical, 6 Important, 6 Minor), sobre 37a2704f
Pasada de fix: juntada en el cierre, 6 hallazgos RED→GREEN (Pester de forma; t1c 2/2 y f1 por conducta)
Re-revisión: 284eebad..bc8113f6, sdd-kit:effort-high + opus, con arreglos (0 Critical, 3 Important, 7 Minor), arreglados en el commit siguiente

## Verificación por task

- [ ] Task 1 — `bash -n tests/batteries/sdd-implement/subject.sh` y `node tests/headless/battery.mjs field tests/batteries/sdd-implement/battery.md t2 Petición`
- [ ] Task 2 — `Invoke-Pester -Path tests/TddSkills.Tests.ps1,tests/Skills.Tests.ps1,tests/WordBudget.Tests.ps1 -CI`
- [ ] Task 3 — la misma de la Task 2
- [ ] Task 4 — la misma de la Task 2
- [ ] Task 5 — `Invoke-Pester -Path tests/Skills.Tests.ps1,tests/WordBudget.Tests.ps1,tests/TddSkills.Tests.ps1 -CI` y `moon run kit:roadmap`

## Fixes adicionales (trabajo descubierto fuera de scope; el tercero abre el freno de alcance)

| Descubierto | Causa raíz | Decisión | Commit |
| --- | --- | --- | --- |

## Rulings

- Task 1: Ruling: base movida por la 0168 (`e23b5375`..`65fb4656`), que toca ficheros de las Tasks 2-5 — el dev-lead eligió «Fusionar develop ya»; fusionado en `6b651ea0` sin conflictos; recuentos de la frase del README corregidos en plan y spec (6 → 5 → 4) — si fuera mal, el Pester `Skills.Tests.ps1` lo caza
- Task 2: Ruling: el paso del encargo dice «Before touching the code the RED tests cover» y no «Before touching `src/`», el literal de la spec (decisión 4) y del plan — `src/` es la ruta del molde y el encargo viaja a proyectos .NET o Angular sin `src/` en la raíz — si fuera mal, un implementador sin `src/` igual no sabría qué no tocar
- Task 2: Ruling: la fila de racionalización del bucle Native «The plan's code is right, skip watching the test fail» sale de `sdd-implement`: su regla vive en `sdd-tdd` (Verify RED, «never skip it») — así `sdd-implement` cabe en su tope de 9.000 sin subirlo (la spec solo autoriza subirlo si entra `t5`) — si fuera mal, `h1` lo enseña: el hilo saltaría el RED
- Task 2: Ruling: el paso del encargo pasa a «Before touching code, run `<comando de los RED>`; keep its failing output and why that failure was expected» y la «TDD Evidence» remite a él — mismo contenido, más corto, por el tope
- Task 2: Ruling: A/B de t1 — gana A (2/2, como B), el encargo no carga sdd-tdd; contradice la decisión inicial del dev-lead («lo carga el encargo»), como preveía la spec (decisión 4) — se le dice al cerrar
- Task 2: Ruling: el RED de forma (TddSkills.Tests.ps1) cambió solo el literal del paso 1 del encargo, por los dos rulings de redacción de arriba; las demás aserciones, intactas
- Task 4: Ruling: `sdd-start-feature` («Trabajo descubierto fuera de scope») también invocaba `superpowers:systematic-debugging` y la decisión 9 de la spec no lo listaba (se vio en el grep de la propuesta y se pasó por alto) — solo el nombre, como el resto del recableado; lo cubre el Pester «ninguna skill invoca»
- Task 4: Ruling: la decisión 8 de la spec mandaba «investigating a failure → `sdd-propose`» en el paso 5 de sdd-explore, que dice que un patch va por `sdd-roadmap` y que explore no invoca `sdd-propose` sin fila — la description excluye los fallos con `sdd-propose` como entrada y el paso 5 dice «A failure to fix is a patch: the first bullet»; texto de la decisión 8 corregido — si fuera mal, f1 lo enseña
- Task 4: Ruling: `e1` del plan se llama `f1` en la batería de sdd-explore, que ya tenía un `e1`
- Task 4: Ruling: regla nueva con RED (d1 1/2): «In a patch, Phase 4 starts with §2 of patch.md already written» y la frase de la fase 1; dos rondas de REFACTOR — tope de sdd-debugging 900 en SKILL.md, bajo el techo de 1.100 de la spec
- Task 5: Ruling: enmienda del AND de sdd-debugging aprobada por el dev-lead tras commitearla en la Task 4 («Apruebo (Recomendada)»); el tope Kit de WordBudget no se toca: su test está suspendido
- Task 5: Ruling: sale de tech-stack.md el aprendizaje de la feature 0032 («un sujeto … no sabe dónde están los scripts de superpowers»): los scripts son ya verbos de la CLI del kit (0143); así tech-stack.md cabe en su tope con la regla de forks, fundida con el aprendizaje de la task 0026
- Final: Ruling: architecture.md pierde «en forma exec» en la línea de hooks/ y el «(+ NOTICE)» del árbol, por el tope de 1.900 — la forma exec la dice hooks/hooks.json — coste: un lector del árbol no ve que las dos skills llevan NOTICE
- Final: minor (deferred): las filas 141 y «Traer las mejoras…» se marcan saldadas en el cierre (sdd-end-feature), con el enlace al walkthrough
