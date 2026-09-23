---
id: 20260923-102746-task-0006-task-verification
title: Tasks — Verificación por task
spec: ./spec.md
plan: ./plan.md
created: 2026-09-23
---

# Tasks — Verificación por task (registro vivo)

- **Spec**: `./spec.md`
- **Plan**: `./plan.md`
- **Rama**: `feature/0006`

## Estado de las tasks

Status: `pending` → `in_progress` → `done` (o `blocked` / `skipped`).

| # | Task | Status | Commit | Notas |
| --- | --- | --- | --- | --- |
| 1 | RED del paso 6 | done | 75074db | 3/4 sujetos válidos (e2-2 bloqueado en pre-flight, ver Evidencia); un frente pasa 2/2 (se recorta), tres fallan |
| 2 | Plantilla del plan | done | 00ce715 | RED (5 fallos) → GREEN (5/5) en `tests/TaskVerification.Tests.ps1` |
| 3 | Paso 6, encargo del implementador y override | done | ec584a8 | RED (3 fallos, bloque «Despacho») → GREEN (`TaskVerification.Tests.ps1` + `Skills.Tests.ps1`, 123/123) |
| 4 | GREEN | pending | — | |

## Verificación por task

- [x] Task 1 — veredictos E2 y E3 en `tests/task-verification-red.md`
- [x] Task 2 — `Invoke-Pester ./tests/TaskVerification.Tests.ps1`
- [x] Task 3 — `Invoke-Pester ./tests/TaskVerification.Tests.ps1` y `./tests/Skills.Tests.ps1`
- [ ] Task 4 — veredictos E1–E3 en `tests/task-verification-green.md`

## Evidencia del rojo (tasks en línea)

**Task 1** — veredictos completos en [`tests/task-verification-red.md`](../../../../tests/task-verification-red.md#red-del-paso-6). Resumen: «el encargo no lleva `:test` ni `backend:test`» pasa 2/2 con el kit sin tocar (se recorta de la Task 3); los otros tres frentes (suite completa sin excepción para `backend:test`, verificación lenta nunca lanzada, Task de UI cerrada como hecha solo por la suite) fallan 2/2 y entran en la Task 3. e2-2 se bloqueó en el pre-flight (permiso de `Write` denegado sobre una ruta POSIX en modo headless) antes de despachar nada; no cuenta para el veredicto.

**Task 2** — `Invoke-Pester -Path tests/TaskVerification.Tests.ps1` antes de editar la plantilla:

```text
[-] cada task declara sus superficies
Expected regular expression '\*\*Superficies\*\*:[^\n]*BD · backend · frontend · tooling · docs' to match '---
[-] la suite de BD solo corre si la task toca BD
Expected regular expression 'migraciones, persistencia o dialecto' to match '---
[-] cada task declara su verificación y los dos campos opcionales
Expected regular expression '\*\*Verificación\*\*:' to match '---
[-] De código no pide copiar el gate completo
Expected regular expression 'los comandos que el cambio tiene que dejar en verde' to not match '---
[-] el gate de cierre se ejecuta una vez en la validación final
Expected regular expression '## 3\. Validación final[\s\S]*Gate de cierre[^\n]*una vez' to match '---
Tests Passed: 0, Failed: 5
```

**Task 3** — `Invoke-Pester -Path tests/TaskVerification.Tests.ps1` antes de editar (bloque «Despacho»):

```text
[-] el encargo del implementador lleva la verificación de su task
[-] el override sustituye la suite completa de superpowers
[-] el paso 6 dice quién mira la UI y quién lanza la verificación lenta
Tests Passed: 5, Failed: 3
```

Verde tras editar (`encargo-revision.md`, `overrides-superpowers.md`, `SKILL.md` paso 6): `Invoke-Pester tests/TaskVerification.Tests.ps1,tests/Skills.Tests.ps1` → `Passed: 123, Failed: 0`.

## Rulings

- **Task 2**: `tasks-template.md` no estaba en la lista de ficheros del plan; su línea de «Verificación por task» decía «según la política del proyecto» y ahora remite al campo «Verificación» de la task. Sin cambio de spec: es la misma regla en la plantilla hermana.

## Fixes adicionales (trabajo descubierto fuera de scope; el tercero abre el freno de alcance)

| Descubierto | Causa raíz | Decisión | Commit |
| --- | --- | --- | --- |
