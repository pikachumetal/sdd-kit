---
id: 20260907-151234-task-0000-alineacion-superpowers
title: Tasks — Alineación del kit con superpowers 6.3.0
spec: ./spec.md
plan: ./plan.md
created: 2026-09-07
---

# Tasks — Alineación del kit con superpowers 6.3.0 (registro vivo)

- **Spec**: `./spec.md`
- **Plan**: `./plan.md`
- **Rama**: `master` (rama única del kit, `tech-stack.md`)

## Estado de las tasks

Status: `pending` → `in_progress` → `done` (o `blocked` / `skipped`).

| # | Task | Status | Commit | Notas |
| --- | --- | --- | --- | --- |
| 1 | Documentos del kit: versión validada, Art. V y referencias de vigilancia | done | `928aad2` | Sin Art. I |
| 2 | RED: campaña de cinco escenarios con superpowers 6.3.0 real | done | `14bab87` | E1 bounded ✅ limpio · E2 spike en consult ❌ (la skill veta la sonda) · E3 restricciones ⚠️ parcial (1/4 por arrastre) · E4 SDD ✅ limpio · E5 spike vía start-task ❌ (añadido durante el RED; sale como task). Fixture "Bookline", 5 copias, Sonnet |
| 3 | Implementación condicionada al RED | done | `f8e07f7` | Aplicado: cuarta salida del enrutado + override acotado + racionalización (E5); modo sondear + racionalización (E2); bloque Restricciones globales (E3). No aplicado: mapeo completo de vías (E1 limpio), frase SDD (E4 limpio) |
| 4 | GREEN y refactor | done | `082038d` | G2 ✅ sonda desechable fuera del repo, borrada · G3 ✅ bloque con 4/4 restricciones literales · G5 ✅ spike enrutado a `sdd-consult`, sin rama ni spec. Sin REFACTOR: ningún GREEN destapó hueco de la propia skill |

## Verificación por task

- [x] Task 1 — `grep -rn "6\.3\.0"` solo en README (y constitution); relectura de los tres ficheros
- [x] Task 2 — tres ficheros RED con verificación en disco y citas a posteriori (E2, E3, E5 con pregunta a posteriori; E1, E4 con el autoinforme de clasificación)
- [x] Task 3 — frontmatter YAML válido en las skills tocadas (`head -4` en ambas)
- [x] Task 4 — veredicto por fallo del RED en cada GREEN (F1 de E2, F1 de E3, F1 de E5: corregidos)

## Fixes adicionales (trabajo descubierto fuera de scope)

| Descubierto | Causa raíz | Decisión | Commit |
| --- | --- | --- | --- |
