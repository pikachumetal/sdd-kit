---
id: 20261028-174403-patch-0245-windows-only-tests
task: 0245
title: Patch — dos tests que solo pasan en Windows dejan la CI de develop en rojo
type: patch
solution: causa raíz
status: done
created: 2026-10-28
branch: patch/0245-windows-only-tests
commit: <hash>
---

# Patch 0245 — dos tests que solo pasan en Windows dejan la CI de develop en rojo

## Capacidades

- Ninguna, porque ninguna capacidad describe los tests de privacidad de las salidas de sujetos ni los de `sdd roadmap publish`.

## 1. Síntoma

Con la CI de la base en `ubuntu-latest`, medido en un contenedor `ubuntu:24.04` con los pasos de `ci.yml` (la CI real aún no llega a `cli:test-min`: moon lo salta tras el rojo de `kit:test-headless`, que arregla la 0238):

- `kit/subject-output-privacy.slow.test.ts` › «ni el usuario de esta máquina suelto (ls -l)»: `el repo es público: pasa las salidas por tests/headless/extract.mjs clean: expected [ …(502) ] to deeply equal []`.
- `roadmap/publish-failures.slow.test.ts` › «rolls back the target when the commit fails» y «rolls back a new file when the commit fails»: `expected +0 to be 1`.

## 2. Causa raíz

1. `machineUserPattern()` de `cli/test/kit/privacy.ts` toma la última carpeta del home (`USERPROFILE ?? HOME`) y la busca como palabra en las salidas de sujetos. En el contenedor es `root`, y en el runner de GitHub, `/home/runner`: `git grep -l -i -w runner` sobre `.docs/sdd/specs/*/*/*` de `origin/develop` da 187 ficheros, con texto corriente («el runner de migraciones», «el test runner nativo»). No es una fuga: el usuario de esa máquina es una palabra del idioma.
2. Los dos tests de `publish-failures` escriben `.git/hooks/pre-commit` con `exit 1` usando `writeFileSync`, sin bit de ejecución. Git en Linux ignora un hook que no es ejecutable, el commit no falla y `sdd roadmap publish` sale con 0. En Windows git no mira ese bit. Hasta el config de la CI de hoy pasaban también en Linux por casualidad: el commit fallaba por falta de identidad de git.

## 3. Fix

- **Fichero(s)**: `cli/test/kit/privacy.ts`, `cli/test/kit/subject-output-privacy.slow.test.ts`, `cli/test/kit/subject-output-privacy.test.ts`, `cli/test/roadmap/publish-failures.slow.test.ts`
- **Cambio**: `machineUserPattern()` no casa con nada cuando el usuario es una palabra corriente de una lista cerrada (`COMMON_USERS`), y el test de las salidas lo dice con un `skip` que nombra al usuario. Los tests de `publish-failures` dan bit de ejecución al hook con `chmodSync(hook, 0o755)`.
- **Decisiones**:
  - Lista cerrada de usuarios corrientes en lugar de cambiar `USERPROFILE` en `ci.yml`, que le diría al test un usuario que no es el real — dev-lead (vía la sesión `develop`, fila 0245)
  - `chmodSync(hook, 0o755)` tras escribir el hook — dev-lead (vía la sesión `develop`, fila 0245)
  - La lista: `runner`, `root`, `user`, `admin`, `ubuntu` (los usuarios por defecto de GitHub Actions, de un contenedor y de las imágenes de nube) — sin el dev-lead (no lo ve el usuario del kit)

## 4. Verificación

| # | Caso | Resultado |
| --- | --- | --- |
| 1 | RED: unitario nuevo de `machineUserPattern` con `HOME=/home/runner` sobre «el test runner nativo», en Windows | ✅ RED `expected true to be false` sin el fix; GREEN con él |
| 2 | RED → GREEN en `ubuntu:24.04` (`ci-linux.sh`, los pasos de `ci.yml` con mergiraf e identidad de git) | ✅ RED sobre `develop` `a23efeee`: `cli:test-min` 6 rojos, los dos `publish-failures` y «ni el usuario de esta máquina suelto» entre ellos. GREEN con el patch: 1855 verdes, 25 skipped (el de privacidad salta: el usuario es `root`), 1 rojo, `histogram`, que no es de este patch (depende de la versión de git del runner, se mira en el run real); los `hookTimeout` de `reserve`/`hotfix` no salen esta vez |
| 3 | GREEN en Windows de los tres ficheros tocados y `tsc --noEmit` | ✅ 30/30 · `tsc` 0 |

## 5. Tiempo (ligero)

- Estimación: 0,75 h + 0,2 h del gate de cierre (12 min, config de la CI de hoy)
- Inicio: 2026-10-28T17:40Z
