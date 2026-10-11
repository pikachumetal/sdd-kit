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
| 4 | `sdd-debugging` y el recableado | done | — | `d1` en dos rondas de REFACTOR: §2 de `patch.md` antes del arreglo, 2/2; `sdd-start-feature` y la salida de `sdd-explore`, rulings |
| 5 | Documentos, filas y topes finales | pending | — | |

## Verificación por task

- [ ] Task 1 — `bash -n tests/batteries/sdd-implement/subject.sh` y `node tests/headless/battery.mjs field tests/batteries/sdd-implement/battery.md t2 Petición`
- [ ] Task 2 — `Invoke-Pester -Path tests/TddSkills.Tests.ps1,tests/Skills.Tests.ps1,tests/WordBudget.Tests.ps1 -CI`
- [ ] Task 3 — la misma de la Task 2
- [ ] Task 4 — la misma de la Task 2
- [ ] Task 5 — `Invoke-Pester -Path tests/Skills.Tests.ps1,tests/WordBudget.Tests.ps1,tests/TddSkills.Tests.ps1 -CI` y `moon run kit:roadmap`

## Fixes adicionales (trabajo descubierto fuera de scope; el tercero abre el freno de alcance)

| Descubierto | Causa raíz | Decisión | Commit |
| --- | --- | --- | --- |
