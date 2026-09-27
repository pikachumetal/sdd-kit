---
id: 20260927-102959-patch-0081-subject-git-identity
task: 0081
title: Patch — los sujetos headless usan la identidad fixture de git
type: patch
status: done
created: 2026-09-27
branch: patch/0081-subject-git-identity
commit: e767d78
---

# Patch 0081 — los sujetos headless usan la identidad fixture de git

## Capacidades

- Ninguna, porque ninguna capacidad describe `tests/headless/lib.sh` ni `tests/SubjectOutputPrivacy.Tests.ps1`

## 1. Síntoma

Reportado ([ticket del patch 0080](../../field-reports/20260927-095543-patch-0080-defer-trigger.md) §2): en 3 de 10 sujetos del 0080, el disparador salió «a cargo de <nombre y apellido del dev-lead>», sacado del `git config user.name` global. El nombre entró en `state.txt`/`texts.txt` versionados y en `tests/defer-trigger-red.md`, y `SubjectOutputPrivacy.Tests.ps1` pasó igualmente (915/0).

Medido (2026-09-27): la fuga es más ancha que la del ticket. El nombre está en 41 ficheros de evidencia: 39 de 10 carpetas (tasks 0003, 0008, 0013, 0019, 0020, 0053, 0059 y 0077, feature 0036 y patch 0080) y `tests/defer-trigger-red.md` y `tests/deferred-vague-trigger-green.md`. Los sujetos lo sacan de `git config user.name` para el campo `author` de la spec, para el dueño de un disparador o en los commits (`b1-1.tools.txt` del 0036: `git config user.name`). Además, el test solo miraba carpetas llamadas exactamente `red`, `green` o `refactor`: `green1/` del 0080 quedaba fuera.

## 2. Causa raíz

`subject_launch` (`tests/headless/lib.sh`) lanza `claude -p` con el entorno de la máquina. `g()` solo fija `-c user.name=Fixture` en los comandos git del molde, y el sujeto hereda la configuración global de git. La propuesta del ticket (`GIT_AUTHOR_NAME` y compañía) no bastaría: esas variables cambian el autor de un commit, pero no lo que devuelve `git config user.name` (comprobado con git 2.55: con `GIT_AUTHOR_NAME=Fixture`, `git config user.name` sigue devolviendo el global). La config de línea de comandos por entorno (`GIT_CONFIG_COUNT`/`GIT_CONFIG_KEY_n`/`GIT_CONFIG_VALUE_n`) gana a la global y a la local en los dos casos.

`SubjectOutputPrivacy.Tests.ps1` busca rutas de usuario y el nombre del home, no la identidad de git, y filtra las carpetas por nombre exacto.

## 3. Fix

- **Fichero(s)**: `tests/headless/lib.sh`, `tests/SubjectOutputPrivacy.Tests.ps1`, `tests/HeadlessLauncher.Tests.ps1` y los 41 ficheros de evidencia.
- **Cambio**: `subject_launch` exporta `GIT_CONFIG_COUNT=2` con `user.name=Fixture` y `user.email=fixture@example.com`, y el stream en seco muestra la identidad que ve el sujeto. El test de privacidad falla si aparece el `git config user.name` de la máquina, mira también `red*`/`green*`/`refactor*` y `tests/*-red.md`/`*-green.md`, y deja de tomar por fuga una ruta ya tapada (`C:\Users\…`). En la evidencia, el nombre se sustituye literalmente por `<git-user>` en todas las carpetas, por decisión del dev-lead (2026-09-27, «Todos»). El historial publicado de git no se reescribe.

## 4. Verificación

| # | Caso | Resultado |
| --- | --- | --- |
| 1 | RED: sujeto en seco en `HeadlessLauncher.Tests.ps1` ve `git: Fixture <fixture@example.com>` | ❌ antes del fix (`git:  <>`) · ✅ después |
| 2 | RED: `SubjectOutputPrivacy.Tests.ps1` con el `user.name` de la máquina | ❌ 41 ficheros antes del saneo · ✅ 0 después |
| 3 | `git config user.name` con `GIT_AUTHOR_NAME` frente a `GIT_CONFIG_COUNT` (git 2.55) | global frente a `Fixture` |
| 4 | Saneo: solo cambian las líneas con el nombre (`git diff --numstat` con inserciones = borrados en los 41) | ✅ |
| 5 | Suite Pester completa | ✅ 919/0 (en una primera pasada falló una vez el umbral de tiempo del pre-commit, sin repetirse) |

Validación diferida: 2026-09-27 · «Diferir: lo pruebo en la próxima campaña de sujetos» · disparador: la próxima campaña de sujetos con `tests/headless/run.sh`, a cargo del dev-lead

## 5. Tiempo (ligero)

- Real: 0,6 h
