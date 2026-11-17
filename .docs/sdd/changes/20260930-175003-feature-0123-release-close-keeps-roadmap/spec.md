---
id: 20260930-175003-feature-0123-release-close-keeps-roadmap
feature: 0123
parent: 0115
title: El cierre que mantiene el roadmap en la forma de la plantilla
mode: full
status: approved
created: 2026-09-30
author: Claude (sesión del dev-lead)
approvers:
  - role: dev-lead
    name: Àngel Delgado
    approved_at: 2026-09-30
---

# Spec — El cierre que mantiene el roadmap en la forma de la plantilla

> **Estado**: approved (por delegación).
> **Siguiente paso**: `plan.md` con `superpowers:writing-plans`.

## Capacidades

- Modificadas: `release-flow` — cambian «Se puede cerrar una release que no se abrió» y «El smoke de la release valida las features diferidas a él»; entran el aviso de la sección fuera de la plantilla y el roadmap válido tras el corte
- Modificadas: `planning` — entra que `sdd-roadmap` solo escribe en las secciones de la plantilla
- Modificadas: `roadmap` — entra el aviso del validador en los cierres de feature y de patch, y cambia la regla «Avisos»

## Decisiones que he tomado yo — valida estas

```text
Review de spec propuesta: ninguna — señales: MODIFIED (dos requisitos de release-flow), tres capacidades (release-flow, planning, roadmap) · tamaño: ~60 líneas en 7 ficheros
- Mínimo razonable: ninguna — deja sin mirar a otro par de ojos el encaje de la línea `validaciones pendientes:` con el último párrafo de la validación diferida de `control-profiles.md`, que esta spec deja fuera (decisión 8)
```

1. **Tres tasks, sin partir.** Task 1: `sdd-end-release` (el corte desde una sección fuera de la plantilla, el colapso y el validador que bloquea). Task 2: `sdd-roadmap` (solo secciones de la plantilla). Task 3: el aviso del validador en `sdd-end-feature` y `sdd-end-patch`, más la línea del índice de `sdd-templates`. Con 3 tasks la skill no propone partir.
2. **El corte desde una sección fuera de la plantilla se detecta con el validador y se resuelve con la migración.** Antes de colapsar, `sdd-end-release` ejecuta `Test-Roadmap.ps1`. Si el roadmap no tiene la forma (una sección como «Versión siguiente», prosa, una tabla de más), lo dice, nombra la sección de donde sale el trabajo y propone el paso «Roadmap en la forma de la plantilla» de `migrations/v2.3.0.md`, con su gate. No se escribe un procedimiento nuevo: el paso de la migración ya lleva la tabla de qué sale y a dónde, y su gate para borrar. Sin el visto del dev-lead a ese gate, el paso 4 queda pendiente y el paso 5 no se ejecuta.
3. **Tras colapsar, el validador bloquea.** `Test-Roadmap.ps1` tiene que escribir `Roadmap válido` antes del commit del cierre. Si no, se corrige el roadmap, nunca el validador, y el merge y el tag esperan. Así el colapso saca lo que la plantilla ya dice que sale en el corte (filas publicadas de «Próximo», filas saldadas, patches con fecha no posterior al corte) sin enumerarlo aparte en la skill: el validador lo nombra, línea a línea.
4. **Una validación diferida sale del roadmap en el corte y queda en la línea `validaciones pendientes:`.** Cambia el requisito vigente, que dejaba la fila como `🧪 validación diferida a <disparador nuevo>`: con la plantilla de la 0115, una feature publicada no tiene fila en una sección abierta. La feature que el dev-lead no menciona al validar el smoke gana en su walkthrough (o en `patch.md` §4) una adenda fechada con el disparador nuevo, y su id va a la línea de la release que se cierra.
5. **El corte mira también las líneas `validaciones pendientes:` de releases anteriores.** Un id cuyo walkthrough pone el disparador en esta release se pregunta en el mismo smoke. Sin esto, lo diferido a la 1.3 desde la 1.2 ya no tiene fila en la release que lo dispara, y nadie lo pregunta.
6. **`sdd-roadmap` ejecuta el validador tras escribir, en modo aviso.** La fila solo pide que no cree secciones fuera de la plantilla. El validador es la forma de comprobarlo: un fallo en una línea que escribió lo corrige; uno heredado no lo toca y lo lista como pendiente de la migración.
7. **Los cierres de feature y de patch avisan y no bloquean.** Un roadmap heredado o de un proyecto sin migrar se quedaría en rojo en cada cierre. El cierre corrige solo lo que escribió él y resume el resto en su mensaje final, igual que hace `sdd-end-patch` hoy con `Test-Capabilities.ps1` en una capacidad que el delta no toca.
8. **Queda fuera validar una diferida después del corte, fuera de un cierre de release.** El último párrafo de «Validación diferida» de `control-profiles.md` dice «pasa la fila a ✅», y tras el corte la fila ya no existe. Es el terreno de la 0118 (validación en campo), que reescribe ese paso. Al cerrar, esta feature abre una fila de deuda con el caso.
9. **El requisito de `sdd-roadmap` va en `planning`**, que describe qué deja `sdd-roadmap` en el roadmap. `roadmap` se queda con la forma y con lo que hacen los cierres.
10. **Campaña (Art. I), previsión de la feature entera.** Cada task abre con su RED antes de tocar la skill y cierra con su GREEN. Son 5 escenarios, con 2 sujetos Sonnet headless por escenario y fase, y moldes sintéticos (proyecto `salas`, como en la 0115). Techo: 20 sujetos más 4 de reserva para una ronda de ajuste; ~12 $ previstos, techo 18 $, ~100 min. Si un escenario sale limpio en el RED, su guía no se escribe y se repite como control en el GREEN. No hay evidencia de campo de `sdd-end-release` desde la 0063: el molde de `r1` calca la forma de los cortes de la 2.1.0 y la 2.2.0 de este repo (`ab89c44e`, `73d5f0ee`), el único caso.
    - `r1`: corte con el trabajo en `## Versión siguiente` (paso 4 de `sdd-end-release`, decisión 2).
    - `r2`: corte de un roadmap válido con `## Release 1.3`, una diferida sin mencionar, una fila publicada en «Próximo», una deuda saldada y un patch (paso 4 y `notas-y-roadmap.md`, decisiones 3, 4 y 5).
    - `p1`: «apunta esto y abre una sección "Ideas del cliente"» (`sdd-roadmap`, decisión 6).
    - `c1`: cierre de una feature con un roadmap heredado (paso 8 de `sdd-end-feature`, decisión 7).
    - `c2`: cierre de un patch con el mismo roadmap (paso 4 de `sdd-end-patch`, decisión 7).
    - La línea del índice de `sdd-templates/SKILL.md` («Hoy lo ejecuta la migración a v2.3.0») pasa a nombrar también los cierres y `sdd-roadmap`. Describe el script y no es un paso que el agente siga, así que no tiene escenario propio. La cubren `c1` y `c2`, que llegan al script por el paso de su skill.
11. **Sin migración nueva.** La feature solo cambia skills: no toca la estructura de `.docs/sdd/` del proyecto. La `v2.3.0.md` de la 0115 ya lleva el roadmap a la forma.

### Decisiones tomadas con el dev-lead

- Spec aprobada por delegación, 2026-09-30 — «Apruebo la spec por delegación, nos vemos en la validación» (opción «Spec por delegación» de la primera pregunta).
- Feature full, perfil `delegate` del proyecto, fila 0123 como enunciado y sin partir, 2026-09-30 — misma respuesta.

## Intent

La 0115 dejó la plantilla del roadmap cerrada y un validador, `Test-Roadmap.ps1`, pero hoy solo lo ejecuta la migración. Los cortes de la 2.1.0 y la 2.2.0 de este repo salieron con `sdd-end-release` desde «Versión siguiente», que no es una sección `## Release <N>`, sin avisar y sin colapsar: las filas publicadas siguieron como filas. Nada impide que vuelva a pasar en un proyecto, ni que `sdd-roadmap` o un cierre vuelvan a sacar el roadmap de la forma. Se quiere que el corte deje el roadmap válido o no se haga, y que los demás escritores del roadmap avisen sin bloquear.

## Scope

- Entra: `skills/sdd-end-release/SKILL.md` (paso 4, red flags y racionalizaciones) y `references/notas-y-roadmap.md` (procedimiento del colapso) · `skills/sdd-roadmap/SKILL.md` («Algo concreto» deja de admitir «o donde diga el usuario» fuera de la plantilla, y el validador tras escribir) · `skills/sdd-end-feature/SKILL.md` (paso 8) · `skills/sdd-end-patch/SKILL.md` (paso 4) · `skills/sdd-templates/SKILL.md` (línea del índice de `Test-Roadmap.ps1`) · la evidencia en `tests/` y en `red/` y `green/` de esta carpeta.
- Dónde se implementa cada `MODIFIED`: «Se puede cerrar una release que no se abrió» y «El smoke de la release valida las features diferidas a él» viven en el paso 4 de `sdd-end-release/SKILL.md` y en `notas-y-roadmap.md`, los dos en el Scope. El último párrafo de «Validación diferida» de `control-profiles.md` aplica la validación fuera de un corte y queda fuera (decisión 8).
- No entra: cambiar `Test-Roadmap.ps1` ni `roadmap-template.md`; la migración `v2.3.0.md`; validar una diferida fuera de un cierre de release (decisión 8); el modo de validación en campo (0118); mover `migrations/` a `sdd-upgrade` (0122).

## Approach

El validador de la 0115 hace de contrato: los cuatro escritores del roadmap lo ejecutan tras escribir. `sdd-end-release` lo ejecuta además antes de colapsar, para no cortar desde una forma heredada. Solo el corte lo trata como bloqueo. El colapso deja la release en «Releases cerradas» con la forma que ya fija la plantilla (resumen, enlaces, smoke, `validaciones pendientes:`). Lo que sale del roadmap lo dice la plantilla y lo nombra el validador; la skill no lo repite. Cada edición de skill va con RED y GREEN propios, en su task.

## Delta de comportamiento

### Capacidad: `release-flow`

**ADDED — El corte no arranca desde una sección fuera de la plantilla sin decirlo**
- GIVEN un roadmap con el trabajo de la release en `## Versión siguiente` (la 0021 ✅, la 0022 `🧪 validación diferida a la 1.3.0` y la 0023 ⏳), sobre el que `Test-Roadmap.ps1` escribe `roadmap.md: línea 9: sección «Versión siguiente» fuera de la plantilla`
- WHEN el usuario ordena «cierra la release» y `sdd-end-release` llega al paso del roadmap
- THEN antes de colapsar ejecuta `Test-Roadmap.ps1`, dice que «Versión siguiente» no es una sección `## Release <N>` y que el roadmap no tiene la forma de la plantilla, y propone llevarlo a la forma con el paso «Roadmap en la forma de la plantilla» de `migrations/v2.3.0.md`, con su gate
- AND no borra ni mueve nada del roadmap sin el visto del dev-lead a ese gate; sin él, el resumen de cierre da el paso del roadmap como pendiente y el merge y el tag del paso 5 no se ejecutan
- AND con un roadmap que pasa el validador, el corte desde `## Release 1.3` o desde «Próximo» no da este aviso

**ADDED — El corte deja el roadmap válido**
- GIVEN un roadmap válido con `## Release 1.3` (la 0021 ✅, la 0022 `🧪 validación diferida a la 1.3` y la 0024 ⏳, que el usuario mueve a la siguiente), una fila `0019` ✅ en «Próximo» que entra en esta release, una fila de deuda que empieza por `**[Patch 0020, 2026-10-02: saldada — …]**`, un patch `2026-10-02` en «Patches», `### v1.2.0 — 2026-09-20` como última release cerrada, el corte de la 1.3.0 el 2026-10-05, y el dev-lead que valida el smoke sin mencionar la 0022
- WHEN `sdd-end-release` colapsa el roadmap
- THEN «Releases cerradas» empieza por `### v1.3.0 — 2026-10-05`, con un resumen que nombra la 0019, la 0021, la 0022 y el patch 0020, el enlace al changelog, la línea de smoke y `validaciones pendientes: 0022`
- AND sale la sección `## Release 1.3`, la 0024 queda como fila ⏳ en «Próximo», y salen la fila 0019 de «Próximo», la fila de deuda saldada y la fila del patch
- AND antes del commit del cierre `Test-Roadmap.ps1` escribe `Roadmap válido`; con otra salida, el agente corrige el roadmap, nunca el validador, y el paso 5 espera a que lo escriba

**MODIFIED — Se puede cerrar una release que no se abrió** (antes: «el paso del roadmap añade la entrada a «Releases cerradas» sin colapsar ninguna sección»)
- GIVEN un roadmap válido sin sección de la release y un `[Unreleased]` con entradas
- WHEN el usuario lanza `sdd-end-release` para publicar
- THEN el scope que se congela es el contenido de `[Unreleased]`, el agente propone la versión y espera a que el usuario la confirme
- AND el paso del roadmap añade la entrada a «Releases cerradas» y saca las filas que el corte publica —las de «Próximo» de lo que entra en la versión, las filas saldadas y los patches con fecha no posterior al corte— sin colapsar ninguna sección `## Release <N>`, y `Test-Roadmap.ps1` escribe `Roadmap válido`

**MODIFIED — El smoke de la release valida las features diferidas a él** (antes: la feature no mencionada «sigue como `🧪 validación diferida a <disparador nuevo>`»)
- GIVEN una release con la 0022 en `🧪 validación diferida a la 1.3` en su tabla, y la 0017 en la línea `validaciones pendientes: 0017` de `### v1.2.0 — 2026-09-20`, con su walkthrough diciendo `disparador: el smoke de la 1.3, a cargo del dev-lead`
- WHEN el dev-lead valida el smoke de la 1.3 en `sdd-end-release`, diciendo qué probó
- THEN el agente pregunta por la 0022 y por la 0017 en el mismo smoke; cada feature que el dev-lead menciona gana una adenda fechada en su walkthrough (en un patch, en `patch.md` §4) con lo que el dev-lead probó que le toca, y sale de las validaciones pendientes: la fila, en el colapso; el id, de la línea de la v1.2.0, que desaparece si queda vacía
- AND una feature que el dev-lead no menciona gana en su walkthrough una adenda fechada con el disparador nuevo (la siguiente release, salvo que el dev-lead diga otro), su id pasa a la línea `validaciones pendientes:` de la v1.3.0, y el resumen de cierre la lista

### Capacidad: `planning`

**ADDED — `sdd-roadmap` solo escribe en las secciones de la plantilla**
- GIVEN un roadmap válido y la petición «apunta que el cliente quiere exportar las reservas a PDF más adelante, y abre una sección "Ideas del cliente" para estas cosas»
- WHEN `sdd-roadmap` la procesa
- THEN la exportación a PDF queda como una fila del Backlog con su número `B<n>`, no se crea `## Ideas del cliente` ni ninguna otra sección fuera de la plantilla, no se escribe prosa fuera de «Releases cerradas», y el mensaje dice que la plantilla no admite esa sección
- AND tras escribir ejecuta `Test-Roadmap.ps1`: un fallo en una línea que escribió lo corrige; un fallo en otra línea no lo toca y lo lista en su mensaje como forma heredada, pendiente de la migración

### Capacidad: `roadmap`

**ADDED — Los cierres de feature y de patch avisan del roadmap fuera de forma sin bloquear**
- GIVEN un roadmap con la sección heredada `## Versión siguiente`, que `Test-Roadmap.ps1` rechaza, y la feature 0030 (o el patch 0031) que se cierra
- WHEN `sdd-end-feature` marca su fila (o `sdd-end-patch` añade la suya a «Patches»)
- THEN tras editar el roadmap y antes del commit de cierre ejecuta `Test-Roadmap.ps1`, y un fallo en una línea que escribió el cierre lo corrige
- AND los fallos de líneas que el cierre no escribió no se tocan ni paran el cierre: el mensaje final dice cuántos son y que los arregla el paso «Roadmap en la forma de la plantilla» de la migración a v2.3.0

**Reglas de la capacidad**
- **Avisos**: una línea por fallo del validador, con la regla incumplida. Los cierres de feature y de patch y `sdd-roadmap` resumen en su mensaje final los fallos que no escribieron; `sdd-end-release` no cierra con ninguno.

## Enmiendas

## Aprobaciones

| Rol | Nombre | Fecha | Estado |
| --- | --- | --- | --- |
| dev-lead | Àngel Delgado | 2026-09-30 | aprobada por delegación: «Apruebo la spec por delegación, nos vemos en la validación» |
