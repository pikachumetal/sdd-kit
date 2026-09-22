---
id: 20260922-211157-task-0019-init-files
task: 0019
parent: 0012
title: Lo que crean las init — ficheros y configuración
mode: full
status: draft
created: 2026-09-22
author: Claude (Opus 5.5) con Àngel Delgado
approvers:
  - role: dev-lead
    name: Àngel Delgado
    approved_at: null
---

# Spec — Lo que crean las init: ficheros y configuración

> **Estado**: draft.
> **Siguiente paso**: `plan.md` con `superpowers:writing-plans`.

## Decisiones que he tomado yo — valida estas

REVIEW_BLOCK

1. **El RED del frente del script de estimación reutiliza diez sujetos ya archivados**, sin lanzar ninguno nuevo. `tech-stack.md` admite un stream previo como baseline. Las campañas de init de las tasks 0012, 0013 y 0020 dejaron `estimation-log.md` en disco: 0 de 10 ejecutaron `Build-EstimationLog.ps1`, 6 lo dejaron en 0 bytes y 4 inventaron una cabecera. Uno de esos 4 escribió «Generado por `Build-EstimationLog.ps1`» sin haberlo ejecutado (0020 `red/out/bf-b`). Ninguno escribió `.claude/settings.json` ni tocó `.gitignore`. Evidencia en `red/README.md`.
2. **La init ejecuta `Build-EstimationLog.ps1` desde el kit** en vez de crear el log «vacío». Verificado sobre un proyecto sin specs: exit 0, cabecera `<!-- AUTO-GENERADO …` y tabla sin filas. La red flag «El estimation-log nace con contenido» pasa a decir «con filas», porque la cabecera ya es contenido.
3. **`.claude/settings.json` se crea o se fusiona con `"autoMemoryEnabled": false`, sin tocar las demás claves.** Si la clave ya está a `true`, se pregunta antes de cambiarla: puede ser una decisión explícita del proyecto.
4. **`.gitignore` gana `.playwright-mcp/` y `.superpowers/` si faltan**, y se crea si no existe. Se añaden las líneas que faltan, sin duplicar.
5. **Los pasos nuevos de la migración van a `v1.2.0.md` y no a una `v1.3.0.md`**: la 1.2.0 es la release en curso y no está publicada (`plugin.json` sigue en 1.1.0).
6. **Volcado de la memoria ya guardada, con gate.** El paso lista cada entrada de la carpeta de memoria del proyecto con su destino en los docs, o con «ya está en `<doc>`». Vuelca y borra solo tras el «sí», y nunca borra una entrada que no se volcó. Sin dev-lead no se borra nada y el paso queda pendiente explícito. Motivo: al hacerlo a mano en este repo, 7 de 9 memorias ya estaban en `tech-stack.md`, así que el riesgo real es duplicar, no perder.
7. **«Proyecto de referencia» es un campo opcional de «Convenciones»** en `constitution-template.md`, y cada init lo pregunta una vez:
   - En greenfield va como pregunta 21, al final de la lista, para no renumerar las referencias a 11–20 del propio `SKILL.md`.
   - En brownfield va como pregunta 7.
   - «No» deja «no aplica».
   - **Sin paso de migración**: el campo es opcional y el Art. V va de la migración a la init, no al revés.
8. **`sdd-start-task` no se toca.** El RED previo pasó 2 de 2 sin guidance: con «Proyecto de referencia» en la constitution, los dos sujetos leyeron el proyecto de referencia antes del brainstorming y lo citaron en la spec como motivo del diseño (`red/README.md`, frente 5, 1,87 $). El fallo de campo era que el dato no estaba en los docs. La cita desde el brainstorming va a deuda como posible falso negativo, porque un campo más escueto o una task que no parezca un portado podrían no disparar la lectura. Efecto colateral: la task deja de tocar un fichero caliente que la 0021 tiene abierto.
9. **Test estructural con declaración explícita.** Cada migración declara en una línea fija, `**Escribe**:`, cada fichero del proyecto y cada clave que escribe. El test comprueba dos cosas:
   - Toda migración que nombra `sdd-kit.json` lleva esa línea.
   - Cada clave declarada aparece literal en cada una de las dos init: en su `SKILL.md`, en sus `references/` o en un `.md` que estos enlazan (un salto, que es como las init leen las claves de control de `control-profiles.md`).

   Deducir las claves del texto de la migración resultaba frágil: comodines como `control.silence.*` y claves que se mencionan pero no se escriben. La declaración cubre además `.claude/settings.json` y `.gitignore`, porque el Art. V dice «toda pregunta o dato», no solo `sdd-kit.json`. Para que el test pase, las init nombran literal `ids.mode`, que hoy dicen como «el campo `ids`».
10. **«Ficheros que toca» va en la tabla de la sección de release** de `roadmap-template.md`, con la cabecera `| id | Task | Origen | Ficheros que toca | Estado |`. `sdd-start-release` la escribe al abrir una release. «Próximo» no la lleva: sus filas no son tasks planificadas y el freno ya dice «solape no comprobable» cuando falta.
11. **Sin capacidad nueva**: el delta toca `onboarding`, `migration` y `roadmap`, las tres existentes.

### Decisiones tomadas con el dev-lead

- La task se parte en tres: esta, la 0033 (capacidades al nacer) y la 0034 (proceso de la init), con ids posteriores a los 0031 y 0032 que la 0021 tiene reservados sin publicar. La reserva se publicó en `develop` (`02da87b`). — «cuidado que ya partimos 21 en 3 y usamos 31 y 32, parte en 3»
- Presupuesto de las campañas headless: techo de 25 $ entre el RED previo y el GREEN. — «Techo 25 $ (Recomendado)»

## Intent

Las dos init dejan un proyecto al que le faltan cuatro cosas que el kit da por hechas:
- **Memoria automática**: sigue activa, así que los aprendizajes pueden acabar en una máquina en vez de en los docs.
- **`.gitignore`**: no excluye las carpetas temporales de Playwright ni de superpowers.
- **Log de estimación**: nace de 0 bytes o con una cabecera inventada, porque nada dice dónde vive el script que lo genera.
- **Proyecto de referencia**: no hay sitio para el proyecto cuyos patrones se replican. En campo, ese dato perdido originó la fase más cara de una task.

Además, faltan dos cosas en el propio kit:
- La regla del Art. V (lo que añade una migración también va en las init) no tiene quien la vigile.
- El freno de alcance lee una columna «Ficheros que toca» que la plantilla del roadmap no tiene.

## Scope

- Entra: `.claude/settings.json` con `autoMemoryEnabled: false` en las dos init y en `migrations/v1.2.0.md`, con volcado de la memoria ya guardada · `.gitignore` con `.playwright-mcp/` y `.superpowers/` en las dos init y en la migración · las init ejecutan `Build-EstimationLog.ps1` desde `sdd-templates` · campo «Proyecto de referencia» en `constitution-template.md` y pregunta en las dos entrevistas · línea `**Escribe**:` en cada migración y test estructural que la vigila · columna «Ficheros que toca» en la tabla de release de `roadmap-template.md`, escrita por `sdd-start-release` · README: la memoria desactivada, junto a las dependencias.
- No entra: lo partido a la 0033 (`capabilities/` al nacer, volcado inicial, funcional del usuario) y a la 0034 (`CLAUDE.md` en el gate, estado de init en curso, `VERSION` y canal) · la pregunta de `release.hasRecipient` en la entrevista · un aviso del hook `SessionStart` cuando la memoria sigue activa · migración del campo «Proyecto de referencia».

## Approach

Todo lo que la init deja en el proyecto sale de un solo sitio: el paso de estructura de cada init. La migración a v1.2.0 repite los mismos pasos para los proyectos ya inicializados. Las dos init y la migración nombran literal cada fichero y cada clave, y cada migración los declara en su línea `**Escribe**:`. Así el test puede comprobar que ninguna migración escribe algo que un proyecto nuevo no reciba. El log de estimación deja de describirse y se genera con el script del kit, que ya funciona sin specs. El «Proyecto de referencia» es un campo de la constitution preguntado en la entrevista. La columna del roadmap se añade a la plantilla, que es de donde la calca quien escribe la sección de release.

## Delta de comportamiento

### Capacidad: `onboarding`

**ADDED — La init deja la memoria automática desactivada y los temporales ignorados**
- GIVEN un `sdd-init-greenfield` o un `sdd-init-brownfield`
- WHEN crea la estructura del proyecto
- THEN `.claude/settings.json` tiene `"autoMemoryEnabled": false` y conserva las demás claves que ya tuviera
- AND `.gitignore` contiene las líneas `.playwright-mcp/` y `.superpowers/` una sola vez cada una
- AND si `.claude/settings.json` ya tenía `"autoMemoryEnabled": true`, el agente pregunta antes de cambiarlo

**ADDED — El log de estimación lo genera el script del kit**
- GIVEN un `sdd-init-greenfield` o un `sdd-init-brownfield`
- WHEN crea `estimation-log.md`
- THEN lo genera `Build-EstimationLog.ps1` ejecutado desde `sdd-templates/scripts/` del kit: la primera línea empieza por `<!-- AUTO-GENERADO por Build-EstimationLog.ps1 (sdd-kit)` y la tabla no tiene filas
- AND el proyecto no contiene ninguna copia del script

**ADDED — La constitution nombra el proyecto de referencia**
- GIVEN una init greenfield o brownfield en su entrevista
- WHEN el agente pregunta si el proyecto replica los patrones de otro
- THEN la constitution lleva en «Convenciones» la entrada «Proyecto de referencia» con la ruta o el repositorio que el usuario dé, o «no aplica» si responde que no

### Capacidad: `migration`

**ADDED — La migración a v1.2.0 deja la configuración que deja la init**
- GIVEN un proyecto que migra a v1.2.0 sin `"autoMemoryEnabled": false` en `.claude/settings.json` o sin `.playwright-mcp/` y `.superpowers/` en `.gitignore`
- WHEN se aplica `migrations/v1.2.0.md`
- THEN el proyecto queda con la clave y las dos líneas, igual que tras una init, sin duplicar líneas ni tocar las demás claves
- AND si ya estaban, el paso se salta y lo dice

**ADDED — La memoria ya guardada se vuelca a los docs antes de borrarse**
- GIVEN un proyecto que migra a v1.2.0 y cuya carpeta de memoria de Claude Code tiene entradas
- WHEN se aplica el paso de la memoria
- THEN el agente presenta cada entrada con el documento de anclaje al que iría, o «ya está en `<doc>`», y espera el «sí»
- AND tras el «sí» vuelca las que faltan y borra solo las entradas volcadas o ya presentes
- AND sin dev-lead no borra nada y el informe deja el paso pendiente explícito, con cómo reanudarlo

**ADDED — Lo que escribe una migración lo reciben también las init**
- GIVEN una migración de `skills/sdd-init-brownfield/references/migrations/` que escribe en `sdd-kit.json` u otro fichero del proyecto
- WHEN corre la suite del kit
- THEN la migración declara en su línea `**Escribe**:` cada fichero y cada clave que escribe
- AND la suite falla si una clave declarada no aparece literal en `sdd-init-greenfield` o en `sdd-init-brownfield`, contando su `SKILL.md`, sus `references/` y los documentos que estos enlazan

### Capacidad: `roadmap`

**ADDED — Cada task de una release declara los ficheros que toca**
- GIVEN un `sdd-start-release` que escribe la sección «Release N» del roadmap
- WHEN añade la fila de una task
- THEN la tabla sigue la cabecera de `roadmap-template.md`, `| id | Task | Origen | Ficheros que toca | Estado |`, y la celda «Ficheros que toca» nombra los ficheros o módulos previstos
- AND el freno de alcance de una enmienda (`control-profiles.md`) encuentra esa columna

**Reglas de la capacidad**
- **Dónde viven los datos**: la cabecera de la tabla de release, en el bloque de ayuda de «Próximo» de `roadmap-template.md`.

## Enmiendas

## Aprobaciones

| Rol | Nombre | Fecha | Estado |
| --- | --- | --- | --- |
| dev-lead | Àngel Delgado | | pendiente |
