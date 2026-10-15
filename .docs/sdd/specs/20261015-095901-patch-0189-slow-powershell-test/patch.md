---
id: 20261015-095901-patch-0189-slow-powershell-test
task: 0189
title: Patch — el test que lanza powershell.exe pasa a la suite lenta
type: patch
solution: causa raíz
status: done
created: 2026-10-15
branch: patch/0189-slow-powershell-test
commit: <hash>
---

# Patch 0189 — el test que lanza powershell.exe pasa a la suite lenta

## Capacidades

- Ninguna, porque ninguna capacidad describe en qué suite va un test de la CLI.

## 1. Síntoma

El pre-commit bloqueó dos veces seguidas el commit del reparto de la feature 0149 (solo `roadmap.md` y la propuesta 0131), con `cli:test` en rojo:

```text
FAIL  test/merge/verify.test.ts > merge --verify shell > runs the gate with powershell.exe when pwsh is not on the PATH
Error: Test timed out in 5000ms.
```

Lanzado solo, el fichero pasó una vez (9/9, 3,78 s, el 96 % en ese test) y falló la siguiente (5.069 ms).

## 2. Causa raíz

El test de `cli/test/merge/verify.test.ts:8` ejecuta `runVerification`, que lanza `powershell.exe` (Windows PowerShell 5.1) con el `PATH` reducido a su carpeta. Su arranque en frío tarda entre 3,6 y 5,1 s en esta máquina, solo o con `kit:test-fast` corriendo en paralelo en el pre-commit, y Vitest corta a los 5 s por defecto. El fichero no es `*.slow.test.ts`, así que va en `cli:test` (`cli/moon.yml`: `--exclude '**/*.slow.test.ts'`) con ese tope, contra la convención de `architecture.md`: los tests que lanzan procesos van en `*.slow.test.ts`, que `cli:test-slow` corre con `--test-timeout 120000`. Nació así en la feature 0143 (`0eaa12ec`); el resto de tests del fichero no lanzan nada.

## 3. Fix

- **Fichero(s)**: `cli/test/merge/verify.test.ts`, `cli/test/merge/verify.slow.test.ts`
- **Cambio**: el test de `powershell.exe` se mueve tal cual a `verify.slow.test.ts`; los demás se quedan en la suite rápida.

## 4. Verificación

| # | Caso | Resultado |
| --- | --- | --- |
| 1 | `cli:test` sin el test lento, en el pre-commit del commit del fix | ✅ el pre-commit deja pasar el commit (`cli:typecheck`, `cli:test`, `kit:test-fast`, `kit:roadmap`) |
| 2 | `vitest run test/merge/verify --test-timeout 120000` (el tope de `cli:test-slow`) | ✅ 9/9, el de `powershell.exe` incluido |

## 5. Tiempo (ligero)

- Estimación: 0,3 h
- Inicio: 2026-10-15T09:59Z
- Real: <Yh>
