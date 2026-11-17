---
id: 20261015-092206-patch-0183-reliable-repo-tests
task: 0183
title: Patch — tests del repo que no esconden un rojo hasta el cierre
type: patch
solution: causa raíz
status: done
created: 2026-10-15
branch: patch/0183-reliable-repo-tests
commit: bde41cd5
---

# Patch 0183 — tests del repo que no esconden un rojo hasta el cierre

## Capacidades

- Ninguna, porque ninguna capacidad describe `moon.yml`, `cli/moon.yml` ni los Pester del repo

## 1. Síntoma

Seis filas de deuda, con su solución fijada en el roadmap (dev-lead, 2026-10-15: «Las cuatro»):

1. **Caché de moon** — `cli:test` sale `cached` cuando el commit solo cambia skills, aunque `docs-claims.test.ts` las lea: 14 tests en rojo en `develop` desde la 0175, y el marcador de la 0148 pasó cinco pre-commits.
2. **Consola UTF-8** — el test `Slow` de `VerifySkill.Tests.ps1` que compara con `git show` pasó en la sesión y falló en `moon run kit:test` con «§» y «—».
3. **Contenedor que no parsea** — `NativeDefault.Tests.ps1` con un string sin cerrar dio 0 fallos en el pre-commit.
4. **Anclas** — `Get-BrokenRelativeLink` de `WorkflowDocs.Tests.ps1` quita el `#ancla` y solo mira el fichero.
5. **Nombres reales** — `NamingConvention.Tests.ps1` mira nombres de fichero de `skills/`, no su contenido.
6. **Gate de cierre** — `tech-stack.md` no lo declara, y cuatro features seguidas tomaron un ruling.

## 2. Causa raíz

Medido en esta rama, sobre `d95f3de0`:

1. `cli/moon.yml` no declara `inputs`, así que el hash de `test`, `test-slow` y `test-min` solo mira `cli/**`. RED: con `sdd capability frobnicate` añadido a `skills/sdd-explore/SKILL.md`, `moon run cli:test` → `cli:test (cached, 9b7a3e0c)`, el mismo hash que sin la edición.
2. `pwsh` hereda la página de códigos de quien lo lanza, y la salida de un proceso nativo se decodifica con `[Console]::OutputEncoding`. RED, la reproducción de la fila: con la página 850, `((git show "HEAD:CLAUDE.md") -join '').Contains([string][char]0x2014)` → `False`. El test de la 0148 ya fija UTF-8 por su cuenta (`VerifySkill.Tests.ps1:66-68`); ningún otro lo hace.
3. `moon.yml` sale con `FailedCount`, y Pester cuenta un fallo de descubrimiento en `FailedContainersCount`. RED: con `tests/ZzBroken.Tests.ps1` sin cerrar, `moon run kit:test-fast` → «Tests Passed: 1170, Failed: 0 … Container failed: 1» y la tarea en verde.
4. `($_ -split '#')[0]` descarta el ancla antes de comprobar nada. RED: el caso nuevo `[v](brownfield.md#1-fase)` no sale como roto. Con el arreglo salieron tres enlaces rotos de verdad: la guía se renumeró y `#3-qué-te-pregunta-el-agente-y-qué-contestar` es la sección 4, y «Validar de verdad» pasó a `###` (`greenfield.md` dos, `brownfield.md` uno).
5. Ningún test lee el contenido de `skills/` con la lista de nombres. RED: `skills/sdd-verify/references/encargo-revision.md:54` nombraba `LegalRep`.
6. No hay línea `Gate de cierre` en `operations.md` (no existe) ni en `tech-stack.md`, que tampoco tenía §Testing.

## 3. Fix

- **Fichero(s)**: `cli/moon.yml`, `moon.yml`, `tests/Invoke-KitTests.ps1`, `tests/WorkflowDocs.Tests.ps1`, `.docs/workflow/greenfield.md`, `.docs/workflow/brownfield.md`, `tests/NamingConvention.Tests.ps1`, `skills/sdd-verify/references/encargo-revision.md`, `.docs/sdd/tech-stack.md`, `tests/WordBudget.Tests.ps1`, `.docs/sdd/roadmap.md`
- **Cambio**: `cli/moon.yml` declara el `fileGroup` `testInputs` (`/cli/**`, `/skills/**`, `/.docs/sdd/capabilities/**`) como `inputs` de `test`, `test-slow` y `test-min`. `kit:test` y `kit:test-fast` lanzan `tests/Invoke-KitTests.ps1`, que fija `[Console]::OutputEncoding = [Text.Encoding]::UTF8` antes de `Invoke-Pester` y sale con `FailedCount + FailedContainersCount`: en un script y no en `-Command`, porque moon sustituye `$r` de los `args` como variable de entorno (el primer gate salió con «`.FailedCount`: The term '.FailedCount' is not recognized»). `Get-BrokenRelativeLink` compara el ancla con el slug de GitHub de los títulos del destino, fuera de los bloques de código; se corrigen los tres enlaces que caza. `NamingConvention` busca en todo `skills/` los nombres `Alybo`, `SifAcademy`, `SifRest`, `MDT`, `Quartz`, `LegalRep` y `Medysif`; `encargo-revision.md` dice «una feature en campo». `tech-stack.md` gana `## Testing` con el `Gate de cierre`.
- **Decisiones**:
  - Las seis filas en un solo cambio, antes de la 0152 — dev-lead
  - `inputs` con `cli/**`, `/skills/**` y `/.docs/sdd/capabilities/**`; UTF-8 y `FailedContainersCount` en el comando de `moon.yml`, no como regla en `tech-stack.md` — dev-lead (filas del roadmap)
  - Tope de `tech-stack.md` de 18.700 a 18.800, la centena superior del medido — dev-lead (2026-10-15, «Subir a 18.800»)
  - El rojo de `verify.test.ts` («runs the gate with powershell.exe…», expira a 5.000 ms con la suite entera) va a una fila de deuda aparte, fuera de este patch — dev-lead (2026-10-15)
  - `cli/**` se escribe `/cli/**`, relativo al workspace como los otros dos, en un `fileGroup` para no repetir la lista tres veces — sin el dev-lead (no se ve fuera del repo)
  - `## Testing` nuevo en `tech-stack.md`, porque las skills leen «`tech-stack.md` §Testing» y la sección no existía — sin el dev-lead (no se ve fuera del repo)
  - El comando de Pester en `tests/Invoke-KitTests.ps1` y no en línea, por la sustitución de `$` de moon — sin el dev-lead (no se ve fuera del repo)
  - `Quartz`, el nombre actual de MDT, entra en la lista con `\b` — sin el dev-lead (no se ve fuera del repo)
  - Las anclas al propio documento (`#ancla`) siguen fuera, y los títulos repetidos no se numeran (`-1`) como en GitHub, con comentario `shortcut:` — sin el dev-lead

## 4. Verificación

| # | Caso | Resultado |
| --- | --- | --- |
| 1 | Skill que nombra `sdd capability frobnicate` → `cli:test` no sale `cached` | ✅ `cli:test (ca85a2f6)` corre y falla en `docs-claims.test.ts` «capability frobnicate: expected undefined to be defined» (antes, `cached, 9b7a3e0c`) |
| 2 | `git show` con «—» bajo la página 850 y el prefijo del arreglo | ✅ `True` (sin el prefijo, `False`) |
| 3 | `.Tests.ps1` que no parsea → `kit:test-fast` en rojo | ✅ con el script, `exit=1` y «Failed: 0 … Container failed: 1»; en limpio, `exit=0` (antes, verde con «Failed: 0») |
| 4 | Ancla que no es ningún título del destino | ✅ `WorkflowDocs.Tests.ps1` 21/21, con el caso nuevo y los tres enlaces corregidos |
| 5 | Nombre de proyecto real en `skills/` | ✅ `NamingConvention.Tests.ps1` 18/18 (RED: 1 fallo, `encargo-revision.md`) |
| 6 | Gate de cierre declarado, y `tech-stack.md` en su tope | ⚠️ `moon run kit:test cli:typecheck cli:test cli:test-slow cli:test-min`: `cli:typecheck` ✅, `cli:test-slow` 156/156 ✅, `cli:test-min` 1023/1023 ✅; `cli:test` 866/867 y `kit:test` 1257/1258, fuera de este patch: `verify.test.ts` «runs the gate with powershell.exe…» expira (6.952 ms, fila de deuda nueva) y `FastSuiteBudget` midió 31,8 s con `cli:test-slow` y `cli:test-min` en paralelo (solo, en verde). `WordBudget` en verde con el tope en 18.800 |

Validación en campo: 2026-10-15 · RED/GREEN de los seis casos de la tabla · gate de cierre: cli:typecheck, cli:test-slow 156/156 y cli:test-min 1023/1023 en verde, los dos rojos de la fila 6 fuera del patch · pre-commit del fix en verde

## 5. Tiempo (ligero)

- Estimación: 2,5 h
- Inicio: 2026-10-15T09:22Z
- Real: 1,2 h
