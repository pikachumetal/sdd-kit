---
id: 20260929-170710-patch-0114-walkthrough-literal-cspell
task: 0114
title: Patch — la cita literal del dev-lead rompe el corrector de docs del proyecto
type: patch
status: done
created: 2026-09-29
branch: feature/0114-walkthrough-literal-cspell
commit: 6e3b2bd1
---

# Patch 0114 — la cita literal del dev-lead rompe el corrector de docs del proyecto

## Capacidades

- Ninguna, porque ninguna capacidad describe cómo convive la frase literal de la validación con el corrector de docs del proyecto (`control-profiles` y `feature-flow` fijan la frase literal, que no cambia).

## 1. Síntoma

Reportado (fila de deuda «Lo que escribe el kit no pasa el lint de docs del proyecto», pieza de la cita literal; tickets de las features [0027](../../field-reports/20260929-103242-feature-0027-borrar-ficheros.md) §5 y [0032](../../field-reports/20260929-153416-feature-0032-subir-signalr.md) §4 de document-manager, cuatro sesiones en dos días): «la frase literal de la validación, con dos erratas, rompió `cspell`». Se resolvió después con `<!-- cspell:ignore … -->`, y costó una vuelta más del lint en cada cierre.

Medido ([RED](../../../../tests/walkthrough-literal-cspell-red.md), escenario w2, gate en el pre-commit): el primer `git commit` del walkthrough lo rechaza el pre-commit con `Unknown word (provado)`, `(vien)` y `(cierrala)`. El sujeto deja la cita literal y la excluye después. Es igual al reportado.

## 2. Causa raíz

`walkthrough-template.md` §4.2 y el paso 1 de `sdd-end-feature` exigen la frase literal (`«<frase literal>»`), pero no dicen que el proyecto puede pasar un corrector sobre los `.md`. El agente escribe la cita con sus erratas, y el corrector la descubre en el commit. Con el gate nombrado en la petición, el sujeto se adelantó (w1-2); sin él, como en campo, no (w2-1).

## 3. Fix

- **Fichero(s)**: `skills/sdd-templates/templates/walkthrough-template.md`, `tests/ClosingVerification.Tests.ps1`, `tests/walkthrough-literal-cspell-red.md` y `tests/walkthrough-literal-cspell-green.md`.
- **Cambio**: una nota bajo la línea de validación de §4.2. La frase del dev-lead no se corrige. Si el proyecto pasa un corrector, se excluyen en el fichero, al escribirlo, todas las palabras de la frase, no solo las que parezcan erratas (en cspell, `<!-- cspell:ignore <palabras> -->`). La cláusula «todas las palabras» sale del GREEN: con «sus palabras», el sujeto eligió dos de tres y el commit volvió a fallar.

## 4. Verificación

| # | Caso | Resultado |
| --- | --- | --- |
| 1 | Sujeto w2 con la plantilla final ([REFACTOR](../../../../tests/walkthrough-literal-cspell-green.md)) | ✅ el pre-commit pasa a la primera; la cita queda literal; `cspell:ignore` en el fichero, sin tocar `cspell.json` |
| 2 | Sujeto w2 con la primera redacción (GREEN) | ❌ excluyó 2 de 3 palabras de antemano, y el commit falló con `cierrala`. Motivó la cláusula «todas las palabras» |
| 3 | `tests/ClosingVerification.Tests.ps1`, test nuevo | ✅ RED: 14 verdes y 1 rojo sin la línea; GREEN: 15 verdes |
| 4 | Suite completa `Invoke-Pester tests/` | ✅ 1081 verdes, 10 skipped, 0 rojos · 7 min 37 s |

Validación diferida: 2026-09-29 · «Diferir: lo pruebo en el próximo cierre de feature de document-manager con cspell, a cargo del dev-lead» · disparador: el próximo cierre de feature de document-manager con cspell, a cargo del dev-lead

Campaña: 5 sujetos Sonnet y 1,14 $. La previsión era 3 sujetos y 2 $. El GREEN y el REFACTOR la superaron, y el dev-lead autorizó cada sujeto por separado.

Fuera de alcance, como pidió la petición: MD013 y las palabras de `Build-EstimationLog.ps1`, que siguen en la fila de deuda. `patch-template.md` §4 también pide la frase literal, pero ningún ticket de patch ha reportado el fallo (Art. II): no se toca.

## 5. Tiempo (ligero)

- Estimación: —
- Real: 1.5h
