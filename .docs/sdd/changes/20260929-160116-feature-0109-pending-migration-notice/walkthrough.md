---
id: 20260929-160116-feature-0109-pending-migration-notice
feature: 0109
title: Walkthrough — Aviso de migraciones pendientes al arrancar
spec: ./spec.md
plan: ./plan.md
status: done
created: 2026-09-29
---

# Walkthrough — Aviso de migraciones pendientes al arrancar

## 1. Cambios realizados

- **Cada release lleva su migración** (`6bdba368`): `skills/sdd-init-brownfield/references/migrations/v2.1.0.md` «sin cambios en el proyecto», que solo avanza el marcador fusionando `version`, `channel` y `updated`; `tests/MigrationInitParity.Tests.ps1` gana `Cada versión del kit tiene su migración`, que falla si la `version` de `plugin.json` no tiene su fichero; Art. V de la constitution y regla 4 del `CLAUDE.md`.
- **Aviso del hook** (`51d33c2b`): `hooks/session-start` gana `latest_migration`, que busca la mayor `v*.md` de la carpeta de migraciones junto al hook por SemVer (protegida con `[ -d ]` y `[ -f ]`), y un segundo aviso que se antepone al contexto y va en `systemMessage`, concatenado con el de versión si salen los dos. `tests/Hook.Tests.ps1`: tres tests nuevos (aviso, sin aviso al día o sin marcador, sin carpeta de migraciones con una copia mínima del kit) y `Invoke-SessionStart` con `-PluginRoot` y lectura UTF-8. `README.md` y `tech-stack.md`.
- **Campaña**: `red/subject.sh` (molde de salas en `2.0.0`), salidas en `red/out/`, `green/out/` y `green/hook-1.txt`; evidencia en `tests/pending-migration-notice-red.md` y `-green.md`.

## 2. Tiempo y coste: estimado vs real

- Tipo: infra/tooling
- Estimación de implementación (del plan): 1,25h (punto medio del rango 1–1,5h del plan)
- Esfuerzo real: 0,6h — reloj del hilo por las marcas de los commits (apertura 18:04, fin del cierre ~18:40), sin contar spec y plan (~0,5h, aproximado)
- Desviación: -0,65h (-52 %)
- Causa de la desviación: los sujetos corrieron en segundo plano mientras el hilo escribía (≈3–7 min cada uno, 0,03–0,23 $), el hook reutilizó `version_lt` y el molde del patch 0100, y la estimación ya estaba condicionada al RED
- Modelo del hilo: Opus 5.5, effort no registrado (spec, plan y ejecución; el dev-lead aprobó sin bajar a gama media)
- Tokens del hilo: 24.045.030 — claude-opus-5-5 24.045.030 (la sesión entera: incluye el arranque antes de renombrar la rama)
- Tokens de subagentes: 945.250 en 1 despacho — Revisor final 0109 claude-opus-5-5 945.250 / 8 min
- Coste de la sesión: 9,25 $ (hilo 7,89 $ + subagentes 1,36 $)
- Coste de sujetos: 0,52 $ en 4 sujetos — migración m1 Sonnet 0,49 $ (RED 0,23 $, GREEN 0,14 $, control tras la revisión 0,12 $); hook Haiku 0,03 $
- Review de spec: no · hallazgos 0, aceptados 0

## 3. Desviaciones del plan

- La Task 1 reusa `red/subject.sh` con `PHASE=green` en vez de un `green/subject.sh` copiado.
- La Task 2 cambia `Invoke-SessionStart` después del RED para leer la salida del hook en UTF-8.
- Pasada de fix de la revisión final (`79f48b7c`): la «Verificación» de `v2.1.0.md` pasa de `git diff --stat HEAD~1` a `git status --short` antes del commit (Minor re-graduado a Important), con su sujeto de control; y la decisión 7 de la spec y el plan corregidos: el marcador del repo es `2.0.0`, no `1.1.0`.

### Decisiones tomadas sin el dev-lead

- El GREEN de la migración reusa `red/subject.sh` con `PHASE=green` — el molde es el mismo y una copia divergiría — coste si está mal: ninguno.
- El Minor 1 de la revisión final (verificación `HEAD~1` de `v2.1.0.md`) sube a Important — en una migración encadenada da un fallo falso que el agente reporta como pendiente — coste si está mal: una línea y un sujeto de 0,12 $.
- Los apartados «Declined to judge» del revisor (prerelease, marcador basura, dos ficheros equivalentes, `json_version` voraz, orden por nombre del README, canales sin hook) se quedan fuera — la spec los excluye o el kit no los produce — coste si está mal: un aviso con texto raro.
- Deferred minors: los cuatro de 4.3, en la deuda del roadmap.
- `Invoke-SessionStart` fija `[Console]::OutputEncoding` a UTF-8 durante la llamada, un cambio del test tras el RED que no toca sus asserts — desde Git Bash pwsh decodificaba la salida del hook con `ibm437` y el assert con «día» fallaba; desde la herramienta PowerShell pasaba — coste si está mal: un test frágil según el shell.

## 4. Verificación

### 4.1 Builds

- Sin build.
- Suite completa: `Invoke-Pester -Path tests` desde la herramienta PowerShell, con los tests `Slow` → 1080 pasan, 0 fallan, 10 omitidos · 377 s.
- `tests/Hook.Tests.ps1` desde Git Bash → 15/15 (el caso que originó el segundo ruling).

### 4.2 Smoke / tests

- Validación diferida: 2026-09-29 · «ya sabes las pruebas van en el uso» · disparador: la próxima sesión del dev-lead en este repo con `Start-KitSession.ps1`, que tiene que enseñar el aviso de migraciones pendientes (marcador del repo en 2.0.0), a cargo del dev-lead

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| Existe `migrations/vX.Y.Z.md`, con «sin cambios en el proyecto» si no cambia nada | ejecución real | `v2.1.0.md` con su `**Escribe**:` y su verificación |
| La suite falla si la `version` de `plugin.json` no tiene su fichero | suite | rojo antes de `v2.1.0.md` («Expected path … v2.1.0.md to exist»), verde después |
| Una migración de 2.0.0 deja `version` en `2.1.0` y ningún otro fichero cambia | ejecución real | RED m1-1: marcador en 2.0.0; GREEN m1-1 y control m1-2: solo `sdd-kit.json` |
| Hay un commit `chore(sdd): migrar al kit v2.1.0` | ejecución real | m1-1 y m1-2 |
| El usuario ve el aviso con las dos versiones y la frase | ejecución real | sesión headless Haiku: `systemMessage` con el texto exacto (`green/hook-1.txt`) |
| El agente recibe el aviso y no migra sin que se lo pidan | ejecución real | misma sesión: aviso al principio del contexto; 1 turno sin tool calls |
| Sin aviso al día, sin `sdd-kit.json` o sin carpeta de migraciones, y `using-sdd` se sigue inyectando | suite | 3 tests de `Hook.Tests.ps1` que ejecutan el hook real |
| El aviso se ve en el terminal de una sesión interactiva | no probado | headless no enseña el `systemMessage`; es el disparador de la validación diferida |

### 4.3 Residuales / deuda generada

- Minors diferidos de la revisión final (`tests/Hook.Tests.ps1`): (1) ningún test fija que `latest_migration` elija la mayor por SemVer y no por nombre (`v0.9.0` frente a `v0.10.0`); (2) sin test de los dos avisos a la vez; (3) el test «no avisa cuando el proyecto pide la versión cargada o una menor» debería decir «no avisa de actualizar el plugin»; (4) `New-KitCopyWithoutMigrations` deja su copia en `%TEMP%`, como `New-ProjectDir`. → fila de deuda en el roadmap.
- El pendiente 3 de «Pendientes rescatados» del roadmap dice que el repo está en `1.1.0`; está en `2.0.0`, y le falta `v2.1.0` (el aviso lo recordará). → corregido en el roadmap.

## 5. Aprendizajes → docs vivos

- **Un test del hook que compara texto con tildes lee la salida del hijo en UTF-8** (Task 2): los tests anteriores de `Hook.Tests.ps1` solo comprobaban ASCII («reinici», «plugin update») y la trampa de `ibm437` de Git Bash no se veía; el primer assert con «día» pasó desde la herramienta PowerShell y falló desde Git Bash. → `tech-stack.md`, junto a la regla de salida UTF-8.
- **Una release sin fichero de migración deja a los proyectos un escalón por detrás, y el agente lo defiende con el procedimiento en la mano** (RED `m1`): «`plugin.json` declara 2.1.0, pero el procedimiento dice que no cuenta». La garantía es un test contra el bump, no un paso de una skill de consumidores. → Art. V (hecho en la Task 1).
- **Revisión de skills**: no aplica, mirado. Este repo no tiene `.claude/skills/`; de las skills del kit, la feature solo cambió `migrations/v2.1.0.md` (con su campaña), y nada de lo medido desmiente otra skill: el paso 2 del `README.md` de migraciones («nunca `plugin.json`») es justo lo que el RED confirmó.

## 6. Adendas

_Ninguna_
