---
id: 20260909-065145-task-0000-estimation-log-script
task: 0000
title: Build-EstimationLog.ps1 genérico distribuido con el kit (T7)
mode: full
status: approved
created: 2026-09-09
author: Àngel Delgado
approvers:
  - role: dev-lead
    name: Àngel Delgado
    approved_at: 2026-09-09
---

# Spec — Build-EstimationLog.ps1 genérico distribuido con el kit (T7)

> **Estado**: approved (2026-09-09).
> **Siguiente paso**: modo full → `plan.md` con `superpowers:writing-plans`.

## Decisiones que he tomado yo — valida estas

1. **Capacidad nueva `funcional/estimacion.md`** — el estimation-log y su calibración son un sustantivo del dominio propio; `flujo-de-task` no tiene ningún requisito sobre él.
2. **El script vive en `skills/sdd-templates/scripts/Build-EstimationLog.ps1`** — `sdd-templates` ya es la skill de activos compartidos que todas las skills de cierre calcan, viaja con el plugin y con `npx skills add`, y el harness inyecta su Base directory al invocarla. No se crea skill nueva (decisión 2026-09-07: la unidad de descomposición es el fichero auxiliar).
3. **Invocación desde el kit con `-Root <raíz del proyecto>`**; el script busca `.docs/sdd/` y, si no existe, `docs/sdd/` (proyectos antiguos). Salida regenerable en `<docs>/estimation-log.md` con cabecera "AUTO-GENERADO". Ningún parámetro que un proyecto tenga que configurar.
4. **Parseo tolerante al formato real de las plantillas**: negrita, `~`, coma decimal, unidad `h` con o sin espacio, y rango (`2 h (rango 1,5–3)` → estimado 2). Lee `walkthrough.md`, `patch.md` y `hotfix.md` (legacy de MDT). Una task sin plan (`Estimación: —`) entra en la tabla con estimado vacío y sin ratio, en vez de descartarse en silencio como hoy.
5. **`Tipo` normalizado al primer token** (`docs (contenido de skills) + infra/tooling` → `docs`) para que la mediana por Tipo agrupe.
6. **El estimation-log del kit pasa a generado**: se sustituye el manual actual por la salida del script. Es el smoke del cierre (dogfooding, Art. VII).
7. **Tests Pester en `tests/Build-EstimationLog.Tests.ps1`** con fixtures en `tests/fixtures/estimation-log/`. Primer código ejecutable del kit: `tech-stack.md` se actualiza al cerrar. La evidencia de skills sigue en `tests/*.md`.
8. **Las ediciones de `sdd-end-task/references/estimacion.md` y `sdd-end-patch/SKILL.md` pasan por RED→GREEN** (Art. I): RED = texto actual + script presente en el kit → ¿el agente lo encuentra o escribe la fila a mano? GREEN = texto nuevo. Dos escenarios (cierre de task, cierre de patch). Estimación condicionada al RED.
9. **Alybo y MDT quedan fuera**: borran su copia local al actualizar el kit; se avisa en las release notes de v0.6.0. `sdd-init-*` no cambia (no copia nada al proyecto).

## Intent

Hoy cada proyecto lleva su `Build-EstimationLog.ps1` y las copias han derivado: Alybo soporta `patch.md`, MDT no; las rutas y el regex de "Esfuerzo real" difieren. El propio kit no lo tiene y mantiene el log a mano, con un formato que el script no leería. Se quiere un único script en el kit, invocado por `sdd-end-task` y `sdd-end-patch`, que lea el formato de las plantillas canónicas tal como se escriben en la práctica y produzca el factor de calibración global y por Tipo.

## Scope

- Entra: el script genérico en el kit; tests Pester con fixtures; factor global y por Tipo; `sdd-end-task` (`references/estimacion.md`) y `sdd-end-patch` invocan el del kit; RED/GREEN de esas dos ediciones; `funcional/estimacion.md`; el log del kit regenerado; `tech-stack.md` y `architecture.md` reflejan el script y los tests; entrada en changelog.
- No entra: migrar Alybo y MDT (borran su copia); CI (T8); cambios en las plantillas de walkthrough/patch; otro cálculo que no sea la mediana.

## Approach

Unificar las dos copias existentes en un script con la lógica de Alybo (la más completa) más las tolerancias de formato que el kit necesita, y sacar la localización del proyecto a un parámetro `-Root`. Las skills de cierre dejan de buscar un script local y ejecutan el del kit desde el Base directory de `sdd-templates`; la fila a mano queda solo como fallback si `pwsh` no está disponible. El comportamiento se fija primero en Pester sobre fixtures que reproducen el formato real de los walkthroughs del kit y de Alybo.

## Delta de comportamiento

### Capacidad: `estimacion`

**ADDED — El estimation-log se genera desde los artefactos de cierre**
- GIVEN un proyecto con `.docs/sdd/estimation.md` y al menos un `walkthrough.md` o `patch.md` con bloque de tiempo
- WHEN se ejecuta `Build-EstimationLog.ps1 -Root <proyecto>`
- THEN `<docs>/estimation-log.md` se regenera entero con una fila por artefacto (fecha, task, tipo, estimado, real, ratio, carpeta), ordenado por carpeta
- AND el fichero lleva cabecera "AUTO-GENERADO — no editar a mano"

**ADDED — El script vive en el kit y las skills de cierre lo invocan**
- GIVEN un proyecto con `.docs/sdd/estimation.md` y el kit instalado
- WHEN `sdd-end-task` o `sdd-end-patch` llegan al paso estimation-log
- THEN ejecutan el script desde el Base directory de `sdd-templates`, sin buscar ni crear copia en el proyecto
- AND solo si `pwsh` no está disponible añaden la fila a mano

**ADDED — El parseo tolera el formato real de las plantillas**
- GIVEN un bloque de tiempo con negrita, `~`, coma decimal, unidad con espacio o rango (`2 h (rango 1,5–3)`)
- WHEN el script lo lee
- THEN obtiene estimado 2 y el real correspondiente, sin descartar la fila
- AND un `walkthrough.md` con `Estimación: —` entra con estimado vacío y ratio vacío
- AND `hotfix.md` se lee como `patch.md` con tipo `hotfix`

**ADDED — El log muestra el factor global y por Tipo**
- GIVEN filas con ratio
- WHEN se genera el log
- THEN aparece el factor global (mediana real/estimado, n) y una tabla Tipo | n | mediana
- AND con menos de 10 filas con ratio el log avisa de que la calibración es orientativa

**ADDED — Un bloque presente sin métricas avisa**
- GIVEN un walkthrough con sección de tiempo cuyo estimado o real no se puede leer
- WHEN se genera el log
- THEN el script emite un warning con la carpeta afectada y no la descarta en silencio

## Aprobaciones

| Rol | Nombre | Fecha | Estado |
| --- | --- | --- | --- |
| dev-lead | Àngel Delgado | 2026-09-09 | aprobada (chat, 9 decisiones sin cambios) |
