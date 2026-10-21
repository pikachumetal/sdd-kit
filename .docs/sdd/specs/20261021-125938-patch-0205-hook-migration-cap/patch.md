---
id: 20261021-125938-patch-0205-hook-migration-cap
task: 0205
title: Patch — el hook de arranque no ofrece migraciones más nuevas que el kit cargado
type: patch
solution: causa raíz
status: done
created: 2026-10-21
branch: patch/0205-hook-migration-cap
commit: <hash>
---

# Patch 0205 — el hook de arranque no ofrece migraciones más nuevas que el kit cargado

## Capacidades

- Modificadas: `migration` — «La sesión avisa cuando el proyecto tiene migraciones pendientes»: la mayor migración que cuenta es la que no pasa de la versión del kit cargado

## 1. Síntoma

Dev-lead, 2026-10-21: «las empiezo y me dicen que hay que hacer el sdd-upgrade les digo que sí y me sueltan no sé qué de la 198 con el roadmap». Cada sesión de este repo (kit 2.3.4 en `.claude-plugin/plugin.json` y en `.docs/sdd/sdd-kit.json`) arranca con:

> AVISO sdd-kit: el proyecto tiene aplicado el kit 2.3.4 (.docs/sdd/sdd-kit.json) y el kit cargado trae migraciones hasta la 3.0.0. Para aplicarlas, pide «actualízame al kit».

Reproducido sobre `47a6838f` con `sessionStartOutput('.', '.', process.versions.node)`: sale ese mismo `systemMessage`, y la orden de ofrecer `sdd-upgrade` en `additionalContext`.

## 2. Causa raíz

`latestMigration` (`cli/bin/session-start.js:31`) devuelve la mayor de `skills/sdd-upgrade/references/migrations/` sin mirar la versión del kit cargado, y `migrationWarning` compara con ella. En la rama de una release se escribe `v3.0.0.md` antes de subir `plugin.json` (la 0198 la aplica a mano), así que el hook ofrece una migración que el kit cargado aún no publica.

## 3. Fix

- **Fichero(s)**: `cli/bin/session-start.js`, `cli/test/hook/session-start.test.ts`
- **Cambio**: `latestMigration` recibe la versión de `plugin.json` del kit cargado y descarta las migraciones más nuevas; sin versión en `plugin.json`, cuentan todas, como antes.
- **Literal viejo**: la regla «Avisos» de `migration` decía «la mayor migración del kit cargado»; el delta la sustituye entera con el tope de `plugin.json`.
- **Decisiones**:
  - La última migración que cuenta es la más nueva que no pasa de la versión de `plugin.json` del kit cargado; con proyecto y kit en 2.3.4, sin aviso ni oferta aunque exista `v3.0.0.md` — dev-lead (2026-10-21, prompt de arranque)
  - La 0198 aplica la v3.0.0 pidiéndola («actualízame al kit»), sin la oferta del hook — dev-lead (2026-10-21, prompt de arranque)
  - Se retira del vivo el AND «con el kit cargado menor que el marcador y migraciones pendientes a la vez, salen los dos avisos»: con la regla anterior ya no puede darse, porque toda migración que cuenta es menor o igual que el kit cargado, y este es menor que el marcador. El test `shows both warnings` pasa a comprobar que sale solo el de la versión — dev-lead (consecuencia de la decisión anterior)
  - `sdd upgrade` sigue listando hasta la mayor migración de la carpeta: es lo que necesita la 0198 — dev-lead (2026-10-21, «la 0198 aplica la v3.0.0 pidiéndola»)

## 4. Verificación

| # | Caso | Resultado |
| --- | --- | --- |
| 1 | Proyecto 2.3.4, kit 2.3.4, migraciones `v2.3.4.md` y `v3.0.0.md` → sin aviso ni orden de oferta | ✅ `ignores migrations newer than the loaded kit` |
| 2 | Proyecto 2.3.3, kit 2.3.4, migraciones hasta `v3.0.0.md` → avisa «hasta la 2.3.4» | ✅ `warns up to the loaded kit version` |
| 3 | Kit 2.0.0 por detrás del proyecto 2.1.0, con `v2.2.0.md` → solo el aviso de versión | ✅ `gives only the version warning with the loaded kit behind the project` |
| 4 | Este repo: `sessionStartOutput('.', '.')` tras el fix | ✅ sin `systemMessage` |

Validación en campo: 2026-10-21 · <gate>

## 5. Tiempo (ligero)

- Estimación: 0,5 h
- Inicio: 2026-10-21T12:59Z

## 6. Delta de capacidad

### Capacidad: `migration`

**MODIFIED — La sesión avisa cuando el proyecto tiene migraciones pendientes**
- GIVEN un proyecto con `.docs/sdd/sdd-kit.json` a `2.0.0` y una sesión de Claude Code que carga el plugin `sdd-kit` con `v2.1.0.md` como mayor migración en `skills/sdd-upgrade/references/migrations/` que no pasa de la versión de su `.claude-plugin/plugin.json`
- WHEN arranca la sesión
- THEN el usuario ve «AVISO sdd-kit: el proyecto tiene aplicado el kit 2.0.0 (.docs/sdd/sdd-kit.json) y el kit cargado trae migraciones hasta la 2.1.0. Para aplicarlas, pide «actualízame al kit».»
- AND el agente recibe el mismo aviso al principio de su contexto, seguido de «Antes de atender la primera petición, ofrece aplicarlas con una pregunta de sí o no; si la petición ya pide ponerse al día, invoca la skill `sdd-upgrade` sin preguntar. Con el «sí», invoca `sdd-upgrade` y, tras su informe, atiende la petición; con el «no», atiende la petición y no lo vuelvas a ofrecer en esta sesión. Sin ese «sí», no migres. Con `control.profile: unattended` en `.docs/sdd/sdd-kit.json`, no ofrezcas ni migres: atiende la petición y anótalo en tu mensaje final.»
- AND con `v0.9.0.md` y `v0.10.0.md` como migraciones del kit y el marcador en `0.9.0`, el aviso dice «hasta la 0.10.0»
- AND con el marcador y el kit cargado en `2.3.4` y `v3.0.0.md` en la carpeta de migraciones, no hay aviso de migraciones ni orden de ofrecerlas
- AND con el kit cargado menor que el marcador, sale solo el aviso de la versión
- AND con el marcador en `2.1.0`, sin `sdd-kit.json`, con un `sdd-kit.json` en curso (sin `version`) o sin carpeta de migraciones en el kit cargado, no hay aviso de migraciones, y el hook sigue inyectando `using-sdd`

**Reglas de la capacidad**
- **Avisos**: la sesión avisa, al usuario y al agente, cuando el kit cargado es menor que el marcador del proyecto (actualizar el plugin) y cuando el marcador es menor que la mayor migración del kit cargado que no pasa de la versión de su `plugin.json` (migrar el proyecto); en el segundo caso el agente ofrece migrar antes de atender la primera petición y no migra sin el «sí», salvo con `control.profile: unattended`, que ni ofrece ni migra y lo anota en su mensaje final; un paso con gate que el dev-lead no responde queda como pendiente explícito en el informe, con cómo reanudarlo; no se ejecuta ni se deja preparado; un paso sin marca que borra un fichero, una sección entera o una clave, o que cambia la ruta de un fichero, es un gate.
