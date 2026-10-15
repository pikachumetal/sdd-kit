---
id: 20261015-104325-feature-0188-closing-estimation-templates
feature: 0188
parent: 0149
proposal: 0131
title: Estimación y plantillas del cierre — `post hoc`, el «Real», el coste de sujetos y `## Rulings`
mode: full
profile: delegate
status: approved
created: 2026-10-15
author: Claude (Opus 5.5)
approvers:
  - role: dev-lead
    name: Àngel Delgado
    approved_at: 2026-10-15
---

# Spec — Estimación y plantillas del cierre

🦆 Hoy el log de estimación mezcla datos buenos con malos: un patch que escribe su estimación al cerrar, ya sabiendo cuánto tardó, calibra como si la hubiera escrito antes, y el «Real» de la 0181 dio 1,15 h con 34 min de espera al dev-lead dentro. Con esta feature, una estimación escrita al cerrar queda marcada `post hoc` y no entra en el ratio, y el «Real» deja de escribirse a ojo: `sdd session tokens` lo saca de los transcripts, desde el arranque de la sesión y sin las esperas (en la 0181 habría dado 0,58 h). Además, el patch gana su línea de coste de sujetos y `tasks.md` su sección `## Rulings`, que hoy el agente inventa.

## Capacidades

- Modificadas: `estimation` — la sesión mide el esfuerzo real sin las esperas; una estimación de patch escrita al cerrar queda `post hoc` y no calibra; el patch registra el coste de sus sujetos.

## ✋ Decisiones que he tomado yo — valida estas

Review de spec propuesta: ninguna — señales: contrato público (la salida de `sdd session tokens` y la tabla del log, que leen las skills de cierre), MODIFIED (dos requisitos de `estimation`) · tamaño: ~250 líneas en 12 ficheros
- Mínimo razonable: ninguna — deja sin mirar por otro par de ojos la definición de «espera» (decisión 3), que es la que más puede desviar el número; va en ✋ para que la mires tú.

1. **El «Real» lo mide la CLI, no el agente.** `sdd session tokens` imprime una cuarta línea, `- Esfuerzo real: <h> — reloj de la sesión <h> desde <inicio UTC>, sin <min> min de espera al dev-lead (<n> esperas)`; las plantillas piden pegarla. Sin una fuente, el «Real» se inventa (ticket del patch 0101: «Nunca en blanco» empuja a inventarlo) y una regla en prosa no lo cambia. La alternativa era solo texto en las plantillas («cuenta desde el arranque…») con el agente aproximando.
2. **La etiqueta es `Esfuerzo real`**, la del walkthrough, también en §5 del patch: el log ya la lee en los dos (`REAL_LABEL`), y así la misma línea se pega tal cual en los dos sitios. Los `patch.md` con `- Real:` se siguen leyendo.
3. **Qué es una espera**: el hueco entre la última entrada del agente y el siguiente mensaje que escribe el usuario, y el que va de una llamada a `AskUserQuestion` a su resultado, que es como llega la respuesta en un gate (enmienda del 2026-10-15). Se cuentan todas, sin umbral, porque el tiempo de leer y contestar también es del dev-lead. No son mensajes del usuario los demás resultados de herramientas, las notificaciones del harness (`<task-notification>`, recordatorios del sistema, salidas de comandos locales) ni las entradas `isMeta`: el hueco antes de una notificación de un sujeto en segundo plano es trabajo, no espera.
4. **Qué sesiones cuentan**: cada transcript del hilo de la carpeta del worktree que tenga al menos una respuesta en la rama (`--branch`), entero, también lo anterior a crear la rama: así entra la investigación previa. El reloj es la suma, por transcript, de su primera a su última entrada; el inicio que se imprime es el más antiguo. Sin `--branch`, todos los transcripts de la carpeta.
5. **Sin transcripts**, la línea dice `- Esfuerzo real: no medido (<motivo>)`, como las otras tres; la plantilla dice entonces que se aproxime con las marcas de los commits y se diga, como hoy.
6. **`--json`** gana una clave `real`: `{ measured, hours, clockHours, start, waitMinutes, waits }`, o `{ measured: false, reason }`.
7. **Cómo se marca el `post hoc`**: `- Estimación: 0,5h (post hoc)`. Lo escribe `sdd-end-patch` en su paso 1 cuando la línea `- Estimación:` no está en el `patch.md` del commit del fix (`git show <fix>:<ruta>`), es decir, cuando llega en el de cierre. Descartado que la CLI lo deduzca del historial de git: una llamada a git por patch en cada regeneración del log, y marcaría de golpe todos los patches anteriores a la 0160.
8. **En el log**, una fila `post hoc` enseña su estimado y lleva `post hoc` en la columna Ratio: sale del factor, la dispersión, la tendencia, la tabla por tipo y la mediana de la release, pero sus horas reales siguen sumando en «Horas reales» de la release, porque el real sí es bueno.
9. **`- Coste de sujetos:`** en §5 de `patch-template.md` con la forma del walkthrough (`<X> $ en <n> sujetos <modelo> — <campaña> <X> $; … | no aplica`). El log ya lee esa etiqueta en §5; solo faltaba el hueco (Art. II, elemento omitido).
10. **`## Rulings`** en `tasks-template.md`, tras «Fixes adicionales», con su ayuda: lo pega `sdd-implement` al cerrar con la salida de `sdd ledger rulings <plan>`, y `_Ninguno_` si no hubo.
11. **Método**: `estimation-template.md` (lo que calcan los proyectos) dice en su punto 2 desde dónde cuenta el real y que las esperas van aparte, con la línea de la CLI; el punto 3 (patches) añade el `post hoc`. El `estimation.md` de este repo, que no tiene esa lista, gana un párrafo con lo mismo.
12. **La migración de los proyectos** (su `estimation.md`, calcado de la plantilla vieja) no la escribe esta feature: la migración v3.0.0 es de la 0157. Al cerrar, la fila 0157 recibe un «Incluye también» con el cambio del punto 2 y 3 del método.
13. **`sdd-end-feature`, paso 2**: «pega sus tres líneas» pasa a «sus cuatro líneas»; la frase «lo anterior a crear la rama no cuenta» queda solo para los tokens, y lo dice.
14. **Previsión de coste de las pruebas (Art. I)**: 6 sujetos Sonnet, ~9 $ y ~40 min de reloj, techo 12 $ con la reserva del 20 %. Pasos que cambian y su escenario:
    - `sdd-end-patch` paso 1 (`post hoc` y la línea de la CLI): `p1`, cerrar un patch cuyo commit del fix no trae `- Estimación:`; RED n = 2, GREEN n = 2.
    - `sdd-end-feature` paso 2 (cuatro líneas): `f1`, el paso de tiempo real de un cierre; RED n = 1, GREEN n = 1 (humo: skill de la 2.3.x sin batería de ese paso).
    - `patch-template.md` §5, `walkthrough-template.md` §2 y `estimation-template.md`: las leen los sujetos de `p1` y `f1`; sin escenario propio.
    - `tasks-template.md` `## Rulings`: estructural, sin sujetos. RED leído: `skills/sdd-implement/SKILL.md:314` pide pegar bajo `## Rulings` y la plantilla no la tiene. GREEN: un test de frase.
15. **Una pieza entra, otra sale**: sale la instrucción de `walkthrough-template.md` de aproximar el reloj del hilo cuando hay transcripts (queda solo como salida sin ellos), y la línea `- Real: <Yh>` de §5 del patch, que pasa a ser la pegada. Nada más se adelgaza: el resto son huecos que faltaban.

### Decisiones tomadas con el dev-lead

- Independiente de la 0149 y de la 0187; partida de la 0149 al arrancarla — «Independiente de la 0149 y de la 0187; partida de la 0149 al arrancarla (dev-lead, 2026-10-15)»
- La estimación de un patch que llega en el commit de cierre queda `post hoc` y el log la excluye de la calibración — «La línea `Estimación` de un patch que llega en el commit de cierre queda `post hoc`, y `sdd estimation log` la excluye de la calibración» (2026-10-15)
- El «Real» cuenta desde el arranque de la sesión que abre el trabajo, con la investigación previa, y una espera al dev-lead va aparte, con su duración — «`patch-template.md` §5 y `estimation.md`, paso 2: «Real» cuenta desde el arranque de la sesión que abre el trabajo, con la investigación previa; una espera a una respuesta del dev-lead va aparte, con su duración» (2026-10-15)
- RED antes si toca texto de una skill — «Si toca texto de una skill, RED antes (Art. I)» (2026-10-15)
- El desglose de tiempos por fase (la skill `timing-report` de Rafa: agente, ejecución y espera por fase, gates y tests atribuidos) va en una fila nueva tras la 0149, que reutiliza el lector de transcripts de esta feature; la apunta el cierre de la 0188 — «Fila nueva tras 0149 (Recomendada)» (2026-10-15)
- Perfil `delegate`; al fusionar, `sdd merge --push` — «Perfil delegate. Al fusionar, `sdd merge --push`» (2026-10-15)

## Intent

El log de estimación es la base para comprometer fechas (p80), y hoy lo contaminan dos fuentes: estimaciones de patch escritas con el tiempo real delante (patch 6300) y reales que mezclan investigación previa sin contar (patch 0176: 23 de 45 min antes de abrir la carpeta) con esperas al dev-lead (feature 0181: 34 min dentro de 1,15 h, ratio 0,26). El éxito: un `post hoc` no mueve el factor, y el «Real» de una feature o un patch cerrado en Claude Code sale de los transcripts, igual para todos los agentes, sin esperas. De paso se cierran dos huecos de plantilla que hoy obligan a inventar: el coste de sujetos del patch y `## Rulings` de `tasks.md`. Fracaso aunque funcione: un «Real» medido que cuente como espera el tiempo en que el agente esperaba a sus propios sujetos.

## Scope

- Entra:
  - CLI `estimation`: fila `post hoc` fuera de la calibración (`cli/src/estimation/`).
  - CLI `session`: línea `Esfuerzo real` y clave `real` del JSON (`cli/src/session/`).
  - Plantillas: `patch-template.md` §5, `walkthrough-template.md` §2, `tasks-template.md` (`## Rulings`), `estimation-template.md`.
  - Skills: `sdd-end-patch` paso 1, `sdd-end-feature` paso 2, con RED/GREEN.
  - Tests que fijan hoy las tres líneas: `cli/test/session/tokens.test.ts` (líneas 99 y 163) y `tests/SessionTokensClose.Tests.ps1` (repaso de coherencia: son, con `cli/src/session/format.ts` y `measure.ts`, los sitios que aplican los dos `MODIFIED`).
  - Docs: `.docs/sdd/estimation.md`, `capabilities/estimation.md` (fusión del delta), roadmap (filas de deuda saldadas, 0130, 0188 y el «Incluye también» de la 0157), changelog.
- No entra:
  - Deducir el `post hoc` del historial de git (decisión 7).
  - `sdd-start-patch`: ya escribe `Estimación` e `Inicio` antes del fix (0160); `Inicio` queda como está.
  - La migración v3.0.0 de los proyectos (0157, decisión 12).
  - Recalcular reales de walkthroughs y patches ya cerrados.

## Approach

Lo decidido por el dev-lead, tal cual: `post hoc` y su exclusión, y el «Real» desde el arranque de la sesión con las esperas aparte. El resto es de ✋: la CLI mide (Principio 4), las plantillas piden pegar su línea, y las dos skills de cierre cambian una frase cada una, con su prueba.

## Dónde se prueba

- Fila `post hoc` en el log: Vitest en `cli/test/estimation/`, como `patch-estimate.test.ts`.
- Coste de sujetos de un patch en el log: Vitest en `cli/test/estimation/`, mismo patrón.
- Línea `Esfuerzo real` y esperas: Vitest en `cli/test/session/`, con transcripts de fixture como los de `tokens.test.ts`, y una ejecución real de `sdd session tokens` sobre el worktree de esta feature.
- `post hoc` en el cierre de un patch y la línea pegada: sujetos `p1` (`tests/closing-estimation-red.md` y `-green.md`).
- Cuatro líneas en el cierre de una feature: sujeto `f1`, en los mismos ficheros.
- `## Rulings` y frases de plantilla: test Pester de frases, como `tests/SessionTokensClose.Tests.ps1`.

## Términos y ADR

- Términos resueltos: `post hoc` — una estimación de patch que llega en el commit de cierre, no en el del fix · espera al dev-lead — el hueco entre la última entrada del agente y el siguiente mensaje que escribe el usuario
- ADR candidatas: ninguna (deshacer la medición es quitar una línea de la CLI)

## Delta de comportamiento

### Capacidad: `estimation`

**ADDED — La sesión mide el esfuerzo real sin las esperas al dev-lead**
- GIVEN un worktree con un transcript que empieza a las 12:26 en `develop`, pasa a `feature/0181` a las 12:40 y termina a las 13:35, con dos mensajes del usuario a las 12:58 y a las 13:30 cuya entrada anterior del agente es de las 12:40 y de las 13:28
- WHEN se ejecuta `sdd session tokens --path <worktree> --branch feature/0181`
- THEN la cuarta línea es `- Esfuerzo real: 0,82 h — reloj de la sesión 1,15 h desde 2026-10-14T12:26Z, sin 20 min de espera al dev-lead (2 esperas)`
- AND el hueco entre una llamada a `AskUserQuestion` y su resultado es una espera; cualquier otro resultado de herramienta, una notificación del harness o una entrada `isMeta` no abre ni cierra una espera
- AND con dos transcripts de la rama, el reloj suma los dos, el inicio es el del más antiguo y la línea dice `reloj de 2 sesiones`
- AND un transcript sin ninguna respuesta de la rama pedida no cuenta
- AND `--json` lleva `real: { measured: true, hours: 0.82, clockHours: 1.15, start: "2026-10-14T12:26Z", waitMinutes: 20, waits: 2 }`
- AND `sdd estimation log` lee esa línea como real 0,82 en un walkthrough y en §5 de un `patch.md`

**ADDED — Una estimación de patch escrita al cerrar queda `post hoc` y no calibra**
- GIVEN un proyecto con `estimation.md` y un patch cuyo commit del fix trae un `patch.md` sin `- Estimación:`
- WHEN `sdd-end-patch` escribe la estimación en el cierre
- THEN la línea es `- Estimación: 0,5h (post hoc)`
- AND `sdd estimation log` da su fila con estimado 0.5, real 0.75 y `post hoc` en la columna Ratio
- AND esa fila no entra en el factor global, la dispersión, la tendencia, la tabla por tipo ni la mediana de su release
- AND sus horas reales sí suman en «Horas reales» de su release

**ADDED — El patch registra el coste de sus sujetos**
- GIVEN un `patch.md` con `- Coste de sujetos: 1,20 $ en 2 sujetos sonnet` en §5
- WHEN se ejecuta `sdd estimation log`
- THEN su fila lleva `1.2` en «Sujetos ($)»

**MODIFIED — Sin transcripts, «no medido»** (antes: «las tres líneas»)

- GIVEN un worktree sin carpeta en `<proyectos>/`
- WHEN se ejecuta el script
- THEN las cuatro líneas dicen `no medido (sin transcripts de Claude Code para <ruta>)` y el script sale con código 0
- AND con la carpeta pero sin ninguna respuesta de la rama pedida, las cuatro dicen `no medido (sin respuestas de <rama> en los transcripts)`
- AND con respuestas del hilo y ningún subagente, la línea de subagentes dice `no aplica` y la del coste lleva solo el hilo: `Coste de la sesión: 0,95 $ (hilo 0,95 $)`

**MODIFIED — El cierre rellena los tokens y el coste de la sesión** (antes: tres líneas, sin el esfuerzo real)

- GIVEN una feature o un patch en Claude Code que llega al paso de tiempo real de `sdd-end-feature` o al paso 1 de `sdd-end-patch`, en un proyecto con `.docs/sdd/estimation.md`
- WHEN se rellena la sección 2 del walkthrough o la §5 de `patch.md`
- THEN `Esfuerzo real`, `Tokens del hilo`, `Tokens de subagentes` y `Coste de la sesión` son las líneas que imprimió `sdd session tokens --path <worktree> --branch <rama>`, ejecutado desde el kit
- AND en otro harness, las cuatro dicen «no medido», con el motivo, y el esfuerzo real se aproxima con las marcas de los commits y se dice

**Reglas de la capacidad**
- **Dónde viven los datos**: los bloques de tiempo de `walkthrough.md` (§2) y de `patch.md` (§5) de cada carpeta de artefactos, con la estimación previa del patch y su hora de inicio en §5, escritas antes del fix, y la marca `post hoc` si la estimación llega en el commit de cierre; el esfuerzo real y las esperas, de los transcripts de Claude Code; el log, generado, en la carpeta de `estimation.md`.

## Enmiendas

- 2026-10-15 — una respuesta a `AskUserQuestion` también es una espera (decisión 3 y su AND en «La sesión mide el esfuerzo real…») — la respuesta en un gate llega como `tool_result`, no como mensaje: medido en el transcript de esta sesión (aprobación de la spec, 10:58:53) — aprobada: «Sí, contarlas (Recomendada)» — antes de la Task 1

## Aprobaciones

| Rol | Nombre | Fecha | Estado |
| --- | --- | --- | --- |
| dev-lead | Àngel Delgado | 2026-10-15 | aprobada: «Apruebo (Recomendada)» |
