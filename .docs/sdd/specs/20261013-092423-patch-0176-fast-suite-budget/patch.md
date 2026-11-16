---
id: 20261013-092423-patch-0176-fast-suite-budget
task: 0176
title: Patch — el conjunto rápido del pre-commit vuelve por debajo de 30 s
type: patch
solution: causa raíz
status: done
created: 2026-10-13
branch: patch/0176-fast-suite-budget
commit: fd3c51e6
---

# Patch 0176 — el conjunto rápido del pre-commit vuelve por debajo de 30 s

## Capacidades

- Ninguna, porque ninguna capacidad describe `tests/SubjectOutputPrivacy.Tests.ps1` ni `tests/FastSuiteBudget.Tests.ps1`

## 1. Síntoma

Reportado en la fila de deuda «El conjunto rápido del pre-commit pasa de 30 s en `develop`»: `FastSuiteBudget` mide 32,9 s en `develop` y 33,3 s en la rama de la feature 0168, y 31-34 s en la 0166 (32,4 s sobre la base `9e0c308`); el que más pesa es `SubjectOutputPrivacy.Tests.ps1` (9,1 s).

Medido aquí, sobre `develop` (`96cc1505`), con `Invoke-Pester -Path tests/FastSuiteBudget.Tests.ps1`:

```text
Expected the actual value to be less than 30, because el pre-commit corre este conjunto en cada commit. Marca con -Tag 'Slow' los bloques de SubjectOutputPrivacy.Tests.ps1 (9.2 s) que crean repos, lanzan procesos o esperan. […] but got 31.6.
```

## 2. Causa raíz

El conjunto rápido recorre en cada commit toda la evidencia de sujetos del repo, y esa evidencia crece con cada campaña. El `BeforeAll` del bloque «La evidencia de los sujetos no lleva el home de la máquina» enumera las carpetas `red|green|refactor|battery|fix*` de todas las specs y lee cada fichero: hoy son 9.324 ficheros y 27,2 MB.

Medido con `SubjectOutputPrivacy.Tests.ps1` suelto (13,3 s):

| Parte | Tiempo | ¿Lanza procesos? |
| --- | --- | --- |
| `BeforeAll` que enumera y lee la evidencia | 8,3 s | no |
| Regex de rutas de usuario sobre los 27 MB | 3,1 s | no |
| 5 tests de `extract.mjs` (`node`) | 1,1 s | sí |
| 2 tests de `user.name` de git | 0,6 s | sí |

El archivo no crea repos. Si solo se marca como `Slow` lo que lanza procesos, que es lo que pide el mensaje de `FastSuiteBudget` y lo que proponía la fila, el ahorro es de unos 1,7 s: con carga seguiríamos por encima de 30 s. La 0117 ya lo había aliviado leyendo cada fichero una vez, en lugar de pasar `Select-String` por fichero y patrón, pero el coste sigue creciendo con la evidencia.

## 3. Fix

- **Fichero(s)**: `tests/SubjectOutputPrivacy.Tests.ps1`, `tests/FastSuiteBudget.Tests.ps1`, `.docs/sdd/tech-stack.md`
- **Cambio**: los bloques «El lanzador de sujetos oculta el home y el usuario» (lanza `node`) y «La evidencia de los sujetos no lleva el home de la máquina» (lee toda la evidencia y lanza `git`) pasan a `Slow`. El bloque nuevo «La evidencia que lleva el commit no tiene el home de la máquina», que entra en el conjunto rápido, aplica las mismas tres búsquedas a los ficheros de evidencia de `git diff --cached`. Las dos revisiones comparten los patrones, la lectura y el filtro de rutas, y un test `Slow` comprueba que ese filtro reconoce toda la evidencia que recorre la revisión completa. El mensaje de `FastSuiteBudget` y la regla de `tech-stack.md` incluyen ahora «leer toda la evidencia del repo» como motivo para marcar un test con `Slow`.
- **Retira**: la revisión completa de la evidencia sale del conjunto rápido; en el pre-commit queda la del commit.
- **Decisiones**:
  - Pasan a `Slow` los tests que lanzan `node` o `git` y la revisión completa de la evidencia. En el conjunto rápido queda un control con las mismas tres búsquedas (ruta de usuario, usuario suelto y `user.name` de git), solo sobre los ficheros de evidencia que lleva el commit (`git diff --cached`) — dev-lead (2026-10-13, al elegir entre las opciones de la pregunta del carril)
  - No se sube el umbral de 30 s de `FastSuiteBudget` — dev-lead
  - El control del commit lanza dos `git` (`diff --cached` y `config user.name`, ~0,1 s), aunque la regla de `tech-stack.md` manda a `Slow` lo que lanza procesos: es la forma más barata de saber qué lleva el commit — dev-lead (la opción elegida lo decía)
  - `git diff --cached` se lanza sin limpiar el entorno de git, al contrario que el resto de las llamadas a git de los tests: dentro del hook, `GIT_INDEX_FILE` apunta al índice que se va a commitear (`git commit -a` usa uno temporal) — sin el dev-lead
  - El mensaje de `FastSuiteBudget` y la regla de `tech-stack.md` añaden «leer toda la evidencia del repo» y el control de lo que lleva el commit. Inducían a marcar solo lo que lanza procesos, que aquí ahorraba 1,7 s: así lo proponían el ticket del patch 0103 y la fila de deuda. No cambia nada de lo que ve un proyecto consumidor — sin el dev-lead
  - Fuera del hook, sin nada preparado en el índice, el control del commit no revisa nada; la revisión completa sigue en la suite entera, que se corre en la validación final de cada task — sin el dev-lead

## 4. Verificación

| # | Caso | Resultado |
| --- | --- | --- |
| 1 | `FastSuiteBudget` (la mejor de dos pasadas) por debajo de 30 s | ✅ antes: 31,6 s en rojo, con `SubjectOutputPrivacy` a 9,2 s; después: pasa. Conjunto rápido medido aparte: 19,8 y 22,6 s en reposo, y 22,1 s con Vitest en paralelo (antes, 24,9 s en reposo). `SubjectOutputPrivacy` sale de los tres más lentos (0,85 s suelto, sin `Slow`) |
| 2 | El control del commit caza una fuga preparada | ✅ con `red/out/leak.txt` (`C:\Users\alice\…`) en el índice: el conjunto rápido de `SubjectOutputPrivacy` da 1 rojo, que nombra el fichero, y `git commit` se para en el pre-commit («Commit bloqueado: fallan las comprobaciones del kit»). Prueba deshecha, fuera del índice y del disco |
| 3 | RED → GREEN de los tests nuevos | ✅ los 3 fallaban porque `Select-EvidencePath` y `Get-StagedEvidence` no existían; ahora `SubjectOutputPrivacy.Tests.ps1` da 13/13 |
| 4 | Suite completa con los `Slow` (`Invoke-Pester tests`) | ✅ 1.171 de 1.188, 0 en rojo, 17 omitidos · 3,3 min |
| 5 | `WordBudget.Tests.ps1` con la regla nueva de `tech-stack.md` | ✅ 68 de 71, 3 omitidos que ya lo estaban |
| 6 | El pre-commit del commit del fix (`fd3c51e6`), con `cli:typecheck` y `cli:test` en paralelo | ✅ `kit:test-fast` en verde: Pester informa 25,24 s |

Validación en campo: 2026-10-13 · `FastSuiteBudget` en verde (antes 31,6 s en rojo) · `SubjectOutputPrivacy.Tests.ps1` 13/13 · suite completa 1.171/1.188, 0 en rojo · el control del commit para una fuga preparada en el pre-commit real

## 5. Tiempo (ligero)

- Estimación: 1 h
- Inicio: 2026-10-13T09:24Z
- Real: 0,75 h (2026-10-13T09:01Z-09:46Z, con la investigación de antes de abrir la carpeta)
