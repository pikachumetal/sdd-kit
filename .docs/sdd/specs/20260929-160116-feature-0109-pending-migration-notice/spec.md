---
id: 20260929-160116-feature-0109-pending-migration-notice
feature: 0109
title: Aviso de migraciones pendientes al arrancar
mode: full
status: approved
created: 2026-09-29
author: Àngel Delgado (con Claude)
approvers:
  - role: dev-lead
    name: Àngel Delgado
    approved_at: 2026-09-29
---

# Spec — Aviso de migraciones pendientes al arrancar

## Capacidades

- Modificadas: `migration` — «Cada release con cambio estructural lleva su migración» pasa a «Cada release lleva su migración», y se añade el aviso de migraciones pendientes al arrancar la sesión.

## Decisiones que he tomado yo — valida estas

```text
Review de spec propuesta: ninguna — señales: MODIFIED (un requisito de `migration`), datos o migración (`v2.1.0.md` nueva) · tamaño: ~120 líneas en 9 ficheros
- Técnica: si el hook compara por SemVer y protege con `[ -f ]`/`[ -d ]` la carpeta de migraciones, y si el test de «cada versión tiene su migración» no rompe el corte de una release (señal: datos o migración)
- Mínimo razonable: ninguna — el repaso de coherencia lo hago yo; queda sin mirar por otra mano el texto exacto del aviso
```

1. **El aviso compara con la mayor versión de `migrations/`, no con `plugin.json`** — es la misma fuente que usa el procedimiento de migración (paso 2 del `README.md` de migraciones): si el hook comparase con `plugin.json` y faltase un fichero, avisaría de una migración que `sdd-init-brownfield` no puede aplicar y el aviso no se apagaría nunca. Las versiones se comparan por números con la `version_lt` que el hook ya tiene, no por nombre de fichero.
2. **Sin `sdd-kit.json` no hay aviso de migraciones** — igual que el aviso de versión del patch 0100. Un proyecto con `.docs/sdd/` sin marcador es anterior a v0.2.0 (ninguno del equipo) o está a mitad de una init, que escribe el marcador en su paso 3; avisar ahí sería un falso positivo.
3. **Sin carpeta de migraciones en el kit cargado, no hay aviso y el hook sigue** — regla de `tech-stack.md`: toda lectura opcional del hook se protege, y esta rama lleva su test de «falta la carpeta» en `Hook.Tests.ps1`.
4. **Los dos avisos son independientes** — el de versión (kit cargado menor que el del proyecto) y el nuevo (proyecto por detrás de las migraciones del kit) no se dan a la vez en la práctica, porque la mayor migración nunca pasa de la versión cargada. Si se diesen, salen los dos.
5. **Texto del aviso**: «AVISO sdd-kit: el proyecto tiene aplicado el kit `<marcador>` (.docs/sdd/sdd-kit.json) y el kit cargado trae migraciones hasta la `<mayor>`. Para aplicarlas, pide «ponme el proyecto al día con sdd-init-brownfield».» Va igual al usuario (`systemMessage`) y al principio del contexto del agente, como el de versión. No le pide al agente que migre: migrar tiene gates y es decisión del dev-lead.
6. **`v2.1.0.md` es una migración «sin cambios en el proyecto»**: solo escribe el marcador. Su línea `**Escribe**:` es `sdd-kit.json` → `version`, `channel`, `updated`, las mismas claves que `v1.1.0.md`, así que `MigrationInitParity.Tests.ps1` sigue en verde sin tocar las init. Su «Verificación»: `sdd-kit.json` declara `2.1.0`.
7. **El repo del kit también verá el aviso** — su marcador está en `2.0.0` (el pendiente 3 de «Pendientes rescatados» del roadmap, que dice `1.1.0`, está desfasado). Con el aviso, cada sesión de este repo lo recordará hasta que se migre a `2.1.0`. No migro el repo en esta feature. *(Corregido el 2026-09-29 tras la revisión final: decía `1.1.0`.)*
8. **Campaña (Art. I)**, previsión y techo para toda la campaña:
   - *Migración con `v2.1.0.md`*: RED, 1 sujeto Sonnet sobre un proyecto en `2.0.0` que pide «ponme el proyecto al día» sin `v2.1.0.md` (se espera «ya está al día» y marcador en `2.0.0`); GREEN, 1 sujeto con el fichero (se espera marcador `2.1.0` y el commit `chore(sdd): migrar al kit v2.1.0`, sin tocar nada más). Es el único paso nuevo de `migrations/`.
   - *Aviso del hook*: el RED son los tests Pester nuevos de `Hook.Tests.ps1` en rojo; el GREEN, además de esos tests, 1 sesión headless Haiku (molde del patch 0100) sobre un proyecto en `2.0.0`, que comprueba el aviso en el `hook_response` y que el agente, ante una petición que no es migrar, no arranca la migración por su cuenta.
   - Sin campaña: el test Pester nuevo (código, TDD) y los cambios en la constitution, el `CLAUDE.md`, el README y `tech-stack.md` (docs de este repo, no texto que siga un agente en un proyecto).
   - Previsión: 3 sujetos, ~30 min, ~1,5 $. Techo: 5 sujetos o 4 $; si se supera, paro y decides.
9. **Repaso de coherencia**: la regla «cada release lleva su migración» vive hoy en tres sitios (Art. V, regla 4 del `CLAUDE.md`, requisito de `migration`); los tres entran en el Scope. En `skills/` solo la enuncia el `README.md` de migraciones en su primer párrafo («recoge los cambios estructurales que esa versión pide»), que sigue siendo cierto con una migración vacía: queda fuera. Las dos init («la versión mayor de `migrations/`») y `generacion.md` tampoco cambian: con `v2.1.0.md` un proyecto nuevo nace en `2.1.0` sin tocarlas. El MODIFIED renombra el requisito: el título nuevo sustituye al de «antes» al fusionar.

### Decisiones tomadas con el dev-lead

- Carril feature, modo full, perfil `delegate` del proyecto, sin partir (3 tasks previstas) — «Feature full, delegate (Recomendada)» (2026-09-29).
- La garantía de que cada release escribe su migración es un test Pester y el Art. V, no un paso en `sdd-end-release`: esa skill la usan todos los proyectos consumidores, que no tienen `migrations/` — «Test Pester + Art. V (Recomendada)» (2026-09-29).
- Cada release escribe su `migrations/vX.Y.Z.md`, vacío si no cambia nada del proyecto; el marcador sigue saliendo de `migrations/`, nunca de `plugin.json` — enunciado de la feature (2026-09-29).

## Intent

El marcador de `.docs/sdd/sdd-kit.json` solo avanza cuando existe `migrations/vX.Y.Z.md`, y la 2.1.0 no lo tiene: los proyectos se quedan en `2.0.0` con el plugin en `2.1.0`, y un ticket que lee «kit 2.0.0, plugin 2.1.0» parece una migración olvidada. Además, nadie avisa de migrar: el dev-lead tiene que acordarse tras cada release. Se quiere que cada release lleve su migración, aunque sea vacía, y que la sesión avise al arrancar cuando el proyecto va por detrás.

## Scope

- Entra:
  - `skills/sdd-init-brownfield/references/migrations/v2.1.0.md` nueva, «sin cambios en el proyecto».
  - `hooks/session-start`: aviso de migraciones pendientes.
  - `tests/Hook.Tests.ps1`: el aviso sale, no sale al día o sin marcador, y el hook no se cae sin carpeta de migraciones.
  - Test Pester que falla si la `version` de `.claude-plugin/plugin.json` no tiene su `migrations/v<version>.md` (en `tests/MigrationInitParity.Tests.ps1` o fichero propio; lo decide el plan).
  - `.docs/sdd/constitution.md` Art. V y regla 4 de `CLAUDE.md`: toda release escribe su migración, vacía si no cambia nada del proyecto.
  - `README.md` (sección de actualizar, línea 139): el kit avisa al arrancar si el proyecto va por detrás.
  - `.docs/sdd/tech-stack.md`: bullet del hook con el segundo aviso.
  - Campaña RED/GREEN de la decisión 8 en la carpeta de esta spec y en `tests/`.
- No entra:
  - Cambiar `sdd-end-release` ni ninguna otra skill de consumidores.
  - Migrar el propio repo del kit (marcador en `1.1.0`).
  - Avisar por el canal `npx skills add` o en Codex: allí no hay hook (deuda abierta en el roadmap).
  - Ordenar las migraciones por SemVer en el paso 2 del `README.md` de migraciones (sigue por nombre mientras las versiones sean de un dígito).

## Approach

El hook, que ya lee el marcador del proyecto y compara versiones, busca además los ficheros `v*.md` de `skills/sdd-init-brownfield/references/migrations/` junto a sí mismo, se queda con la mayor por SemVer y, si el marcador es menor, antepone al contexto un segundo aviso y lo manda también como `systemMessage`. Cada release del kit pasa a llevar su fichero de migración, y un test Pester lo exige contra la versión de `plugin.json`, de modo que el bump sin migración no pasa el pre-commit; con eso la mayor migración coincide con la versión publicada y el marcador de los proyectos avanza en cada release.

## Delta de comportamiento

### Capacidad: `migration`

**MODIFIED — Cada release lleva su migración** (antes: «Cada release con cambio estructural lleva su migración»)
- GIVEN una release del kit, cambie o no la estructura de `.docs/sdd/`
- WHEN se cierra la release
- THEN existe `skills/sdd-init-brownfield/references/migrations/vX.Y.Z.md` con pasos verificables por predicado, o, si la release no cambia nada del proyecto, con la frase «sin cambios en el proyecto», su «Verificación» y su línea `**Escribe**:`
- AND la suite del kit falla si la `version` de `.claude-plugin/plugin.json` no tiene su fichero en esa carpeta

**ADDED — Una migración sin cambios solo avanza el marcador**
- GIVEN un proyecto con `.docs/sdd/sdd-kit.json` a `2.0.0` y el kit 2.1.0, cuyo `v2.1.0.md` dice «sin cambios en el proyecto»
- WHEN el usuario pide «ponme el proyecto al día con sdd-init-brownfield»
- THEN `sdd-kit.json` queda con `version` `2.1.0` y la fecha del día, y ningún otro fichero del proyecto cambia
- AND hay un commit `chore(sdd): migrar al kit v2.1.0`

**ADDED — La sesión avisa cuando el proyecto tiene migraciones pendientes**
- GIVEN un proyecto con `.docs/sdd/sdd-kit.json` a `2.0.0` y una sesión de Claude Code que carga el plugin `sdd-kit` con `v2.1.0.md` como mayor migración
- WHEN arranca la sesión
- THEN el usuario ve «AVISO sdd-kit: el proyecto tiene aplicado el kit 2.0.0 (.docs/sdd/sdd-kit.json) y el kit cargado trae migraciones hasta la 2.1.0. Para aplicarlas, pide «ponme el proyecto al día con sdd-init-brownfield».»
- AND el agente recibe el mismo aviso al principio de su contexto, y no arranca la migración si el usuario no la pide
- AND con el marcador en `2.1.0`, sin `sdd-kit.json` o sin carpeta de migraciones en el kit cargado, no hay aviso, y el hook sigue inyectando `using-sdd`

**Reglas de la capacidad**
- **Avisos**: la sesión avisa, al usuario y al agente, cuando el kit cargado es menor que el marcador del proyecto (actualizar el plugin) y cuando el marcador es menor que la mayor migración del kit cargado (migrar el proyecto); un paso con gate que el dev-lead no responde queda como pendiente explícito en el informe, con cómo reanudarlo; no se ejecuta ni se deja preparado.

## Enmiendas

## Aprobaciones

| Rol | Nombre | Fecha | Estado |
| --- | --- | --- | --- |
| dev-lead | Àngel Delgado | 2026-09-29 | aprobada: «Apruebo» |
