---
id: 20260924-230945-task-0068-session-tokens
task: 0068
title: Tokens y coste de la sesión desde los transcripts de Claude Code
mode: full
status: approved
created: 2026-09-25
author: Claude (Opus 5.5)
approvers:
  - role: dev-lead
    name: Àngel Delgado
    approved_at: 2026-09-25
---

# Spec — Tokens y coste de la sesión desde los transcripts de Claude Code

## Decisiones que he tomado yo — valida estas

```text
Review de spec propuesta: ninguna — señales: contrato público (línea «Coste de la sesión» que lee el log, clave `pricing` de sdd-kit.json), MODIFIED (la tabla por release de `estimation`), dependencia externa (formato de los transcripts de Claude Code)
- Técnica: si «ADDED — La sesión se mide desde los transcripts» cubre las líneas repetidas de una respuesta y las líneas `<synthetic>` (señal: dependencia externa)
- Mínimo razonable: ninguna — deja sin cubrir una segunda lectura del formato del transcript, que la mitigan los tests Pester sobre fixtures calcadas de líneas reales
```

1. **Qué cuenta como una respuesta.** Una respuesta del modelo se identifica por `message.id` y puede salir en varias líneas. Medido el 2026-09-25 sobre 60 transcripts del kit: en 181 respuestas, todas las líneas traen el mismo input, y el output crece hasta la última, que trae el valor final. Por eso, de cada `message.id` se toma el **máximo** de cada categoría. Las líneas con modelo `<synthetic>` son mensajes del harness con `usage` a cero y no cuentan. Una línea sin `message.id` cuenta sola.
2. **Qué es «tokens».** Es la suma de las cuatro categorías de `usage`: entrada, escritura en caché, lectura de caché y salida. Los `thinking_tokens` ya van dentro de la salida y no se suman aparte. La lectura de caché domina, así que la cifra comparable entre Native y SDD es el **dinero**, no los tokens. Las cifras que traían los walkthroughs anteriores venían del informe del subagente y no son comparables con estas. Así lo dirá `estimation.md`.
3. **Escritura en caché con dos precios.** `usage.cache_creation` separa la escritura de 5 minutos de la de 1 hora, y la de 1 hora cuesta el doble. Sin ese desglose (un transcript antiguo), toda la escritura cuenta como de 5 minutos, que es el TTL por defecto de la API.
4. **Fast mode.** Una respuesta con `usage.speed: "fast"` cuesta el doble. Por eso cuenta con el modelo `<modelo>:fast`, que necesita su propia fila en la tabla; sin ella, sale «sin precio». Contarla con el precio normal quitaría la mitad del coste sin avisar.
5. **Qué sesiones entran.** Entran todos los `*.jsonl` de la carpeta del worktree en `~/.claude/projects/`. El nombre de la carpeta es la ruta con cada carácter no alfanumérico cambiado por `-` (`D:\code\.worktrees\sdd-kit\0060` → `D--code--worktrees-sdd-kit-0060`). Con `-Branch`, solo cuentan las líneas cuyo `gitBranch` coincide. Así sirve también sin worktree dedicado, porque el checkout principal mezcla tasks. El cierre siempre pasa la rama de la task. Lo que pasó antes de crear la rama (la lectura de contexto y la primera pregunta) queda fuera, y el walkthrough lo dice.
6. **Subagentes.** Cada subagente deja su transcript en `<sesión>/subagents/agent-*.jsonl` y su `agent-*.meta.json` (con `description`, `agentType` y `model`). El script los suma aparte del hilo, con un despacho por fichero: la descripción, el modelo real (el de `message.model`, no el alias del meta), los tokens y los minutos entre la primera y la última línea. Las campañas headless (`claude -p`) corren en la carpeta del scratchpad, no en la del worktree, así que no se cuentan dos veces con «Coste de sujetos».
7. **Clave de precios.** La tabla va en `pricing` de `.docs/sdd/sdd-kit.json`, que es política del proyecto (en git). No va en `sdd-kit.local.json`. Tiene esta forma: `{"source": "<de dónde salen>", "updated": "AAAA-MM-DD", "usdPerMillionTokens": {"<id del modelo>": {"input": n, "cacheWrite5m": n, "cacheWrite1h": n, "cacheRead": n, "output": n}}}`. El id del modelo es el literal de `message.model`, sin alias.
8. **«sin precio» es todo o nada.** Si falta la tabla, o si un modelo con tokens no está en ella, o si le falta una categoría que tiene tokens, el coste de la sesión es «sin precio», con el motivo y los modelos que faltan. Una suma parcial parecería el total.
9. **Salida del script.** El script imprime una tabla por ámbito (hilo y subagentes) × modelo × categoría, y debajo tres líneas listas para pegar en la sección 2 del walkthrough: `Tokens del hilo`, `Tokens de subagentes` y la nueva `Coste de la sesión`. Los números van en formato castellano (`12.345.678`, `15,67 $`). Cada línea abre con la cifra, que es lo que lee el log.
10. **Una columna nueva en el log, no dos.** `Build-EstimationLog.ps1` lee `Coste de la sesión` (hilo + subagentes, en $). Lo añade como columna `Sesión ($)` en la tabla principal y como suma en la tabla por release, junto a `Sujetos ($)`. Las columnas de tokens del hilo y de subagentes ya existen y se quedan como están. «sin precio» se lee como ausencia declarada, igual que «no medido».
11. **Fuera de Claude Code.** Sin la carpeta del worktree, las tres líneas dicen `no medido (sin transcripts de Claude Code para <ruta>)`, y el script sale con código 0: no es un error del cierre. En otro harness, el paso del cierre dice «no medido», y la plantilla lo explica.
12. **Precios de este repo.** Van en `sdd-kit.json` para `claude-opus-5-5`, `claude-sonnet-5` y `claude-haiku-4-5-20251001`. La fuente es la referencia de la skill `claude-api` de Claude Code 2.1.282: la tabla de modelos, con caché del 2026-06-24, y los multiplicadores de `shared/prompt-caching.md` (escritura 1,25× a 5 min y 2× a 1 h; lectura 0,1×, salvo Opus 5.5, que declara 0,20 $). Opus 5.5 figura «launching», así que su fila se revisa en el lanzamiento. El `source` de la clave lo dice.

   | Modelo | input | cacheWrite5m | cacheWrite1h | cacheRead | output |
   | --- | --- | --- | --- | --- | --- |
   | claude-opus-5-5 | 4 | 5 | 8 | 0,20 | 20 |
   | claude-sonnet-5 | 2 | 2,5 | 4 | 0,20 | 10 |
   | claude-haiku-4-5-20251001 | 1 | 1,25 | 2 | 0,10 | 5 |
13. **`sdd-config` no se toca.** La 0061 ya está en `develop` y su catálogo es la fuente única de las claves. Tal como pidió el dev-lead, esta task solo deja anotado que el catálogo debe preguntar `pricing`: al cerrar, lo añado como fila de deuda en el roadmap. Añadir la pregunta ahora sería editar una skill que no está en el Scope.
14. **Ninguna migración.** `pricing` es opcional: sin la clave, la columna dice «sin precio». No cambia la estructura de `.docs/sdd/` ni retira nada (Art. V).
15. **Art. I proporcional: previsión y techo comunes.** El script y el log son código con Pester en RED primero. La edición del paso 2 de `sdd-end-task` y de `walkthrough-template.md` es guidance, y lleva una campaña de un escenario. El escenario es un cierre con la sección 2 del walkthrough por rellenar. RED con las skills vigentes: 2 sujetos; GREEN con las editadas: 2 sujetos, Sonnet. **Previsión**: 4 sujetos, ~30 min, ~3,5 $. **Techo**: `SUBJECT_CAP=4` y 6 $ en el lanzador, con el fichero `stop` como parada a petición. Sin tanda de REFACTOR prevista: si hace falta, supera el techo y decide el dev-lead.

### Decisiones tomadas con el dev-lead

- Aprobación de la spec por delegación; la task sigue entera (sin partir) — «Entera, spec por delegación» (opción elegida en la primera pregunta, 2026-09-25)
- Rellenar la tabla de precios de este repo desde la documentación oficial — «Sí, de la doc oficial (Recomendada)» (2026-09-25)

## Intent

Hoy todos los walkthroughs y tickets dicen «Tokens del hilo: no medido», porque la task 0010 concluyó que el hilo no tiene contador expuesto al agente. No lo tiene en vivo, pero Claude Code guarda cada sesión en `~/.claude/projects/<carpeta-del-worktree>/<sesión>.jsonl`, con `message.usage` y `message.model` en cada respuesta, y un transcript por subagente. Con eso, el cierre puede medir los tokens del hilo y de los subagentes, y su coste en dólares. Esa medición permite comparar de verdad Native con SDD: en Native el trabajo de los subagentes pasa al hilo, y hoy no se ve.

## Scope

- Entra: el script `skills/sdd-templates/scripts/Measure-SessionTokens.ps1` con sus tests Pester y fixtures sintéticas; la clave `pricing` en `sdd-kit.json` y su tabla en este repo; la línea `Coste de la sesión` y el texto de `Tokens del hilo` en `walkthrough-template.md`; el paso 2 de `sdd-end-task`, que ejecuta el script; la columna `Sesión ($)` y su suma por release en `Build-EstimationLog.ps1`; la campaña RED/GREEN del paso del cierre.
- No entra: la pregunta de `pricing` en `sdd-config` (queda como deuda); `kit-feedback-template.md` y `sdd-end-patch` (los tickets y los patches siguen igual; queda como deuda); `control-profiles.md`, las init, `migrations/` y `sdd-end-release`; tocar `capabilities/estimation.md` antes del cierre (lo actualiza la 0067; se fusiona tras integrar `develop`); medir otros harness; reescribir walkthroughs ya cerrados.

## Approach

Un script de solo lectura resuelve la carpeta de transcripts del worktree, agrupa las líneas `assistant` por `message.id` y suma las categorías por ámbito y modelo. Después aplica la tabla de precios de `sdd-kit.json` y escribe un informe con las tres líneas del walkthrough. Los tests Pester construyen en `TestDrive` una carpeta de proyectos falsa, con transcripts sintéticos calcados de la forma real: sin datos de la máquina ni el nombre del usuario. El cierre ejecuta el script desde el Base directory de `sdd-templates`, como ya hace con `Build-EstimationLog.ps1`, y pega las líneas. El log lee la línea nueva con el parser de dinero que ya existe.

## Delta de comportamiento

### Capacidad: `estimation`

**ADDED — La sesión se mide desde los transcripts**
- GIVEN un worktree `D:\w\t1` y, en `<proyectos>/D--w-t1/`, una sesión con dos respuestas de `claude-sonnet-5`: la `msg_A` en tres líneas con salida 8, 8 y 4.000 (entrada 2, escritura en caché 1h 100.000, lectura 1.000.000 en las tres), y la `msg_B` en una línea (entrada 3, lectura 1.500.000, salida 1.000), más una línea `<synthetic>`
- WHEN se ejecuta `Measure-SessionTokens.ps1 -Path D:\w\t1`
- THEN el hilo suma, para `claude-sonnet-5`: entrada 5, escritura 1h 100.000, lectura 2.500.000 y salida 5.000, en total 2.605.005 tokens
- AND la línea `<synthetic>` no aparece en ningún modelo

**ADDED — Los subagentes se miden aparte del hilo**
- GIVEN la sesión anterior con `subagents/agent-x1.jsonl` (una respuesta de `claude-opus-5-5`: entrada 10, lectura 500.000 y salida 10.000, entre las 10:00 y las 10:12) y su `agent-x1.meta.json` con `description` «Revisión final de rama»
- WHEN se ejecuta el script
- THEN la línea empieza por `Tokens de subagentes: 510.010 en 1 despacho — Revisión final de rama claude-opus-5-5 510.010 / 12 min` (con dos o más, «despachos» y los despachos separados por `; `)
- AND los tokens del subagente no se suman a los del hilo

**ADDED — El coste sale de la tabla de precios del proyecto**
- GIVEN la sesión y el subagente anteriores, y un `sdd-kit.json` con `pricing.usdPerMillionTokens` para `claude-sonnet-5` (2 / 2,5 / 4 / 0,2 / 10) y para `claude-opus-5-5` (4 / 5 / 8 / 0,2 / 20)
- WHEN se ejecuta el script
- THEN la línea es `Coste de la sesión: 1,25 $ (hilo 0,95 $ + subagentes 0,30 $)`: el hilo cuesta 0,00001 + 0,4 + 0,5 + 0,05 = 0,95001 $ y el subagente 0,00004 + 0,1 + 0,2 = 0,30004 $, redondeados a céntimos
- AND sin la clave `pricing`, o con un modelo que tiene tokens y no está en la tabla, la línea es `Coste de la sesión: sin precio (<motivo>)` y nombra los modelos que faltan
- AND una respuesta con `usage.speed: "fast"` cuenta con el modelo `claude-sonnet-5:fast`, que necesita su propia fila

**ADDED — Con `-Branch` solo cuenta la rama de la task**
- GIVEN la sesión del primer requisito, con todas sus líneas en la rama `feature/0068`, y una segunda sesión con la respuesta `msg_C` de `claude-sonnet-5` (lectura 900.000) en la rama `develop`
- WHEN se ejecuta el script con `-Branch feature/0068`
- THEN el hilo suma 2.605.005 tokens: `msg_C` queda fuera
- AND sin `-Branch`, el hilo suma 3.505.005

**ADDED — Sin transcripts, «no medido»**
- GIVEN un worktree sin carpeta en `<proyectos>/`
- WHEN se ejecuta el script
- THEN las tres líneas dicen `no medido (sin transcripts de Claude Code para <ruta>)` y el script sale con código 0
- AND con la carpeta pero sin ninguna respuesta de la rama pedida, las tres dicen `no medido (sin respuestas de <rama> en los transcripts)`
- AND con respuestas del hilo y ningún subagente, la línea de subagentes dice `no aplica` y la del coste lleva solo el hilo: `Coste de la sesión: 0,95 $ (hilo 0,95 $)`

**ADDED — El cierre rellena los tokens y el coste de la sesión**
- GIVEN una task en Claude Code que llega al paso de tiempo real de `sdd-end-task`, en un proyecto con `.docs/sdd/estimation.md`
- WHEN se rellena la sección 2 del walkthrough
- THEN `Tokens del hilo`, `Tokens de subagentes` y `Coste de la sesión` son las líneas que imprimió `Measure-SessionTokens.ps1 -Path <worktree> -Branch <rama de la task>`, ejecutado desde el Base directory de `sdd-templates`
- AND en otro harness, las tres dicen «no medido», con el motivo

**MODIFIED — El estimation-log se genera desde los artefactos de cierre**
- GIVEN un proyecto con `.docs/sdd/estimation.md` y al menos un `walkthrough.md` o `patch.md` con bloque de tiempo
- WHEN se ejecuta `Build-EstimationLog.ps1 -Root <proyecto>`
- THEN `<docs>/estimation-log.md` se regenera entero con una fila por artefacto (fecha, task, tipo, estimado, real, ratio, tokens del hilo, tokens de subagentes, sujetos ($), sesión ($), carpeta), ordenado por carpeta
- AND `Sesión ($)` es la cifra de `Coste de la sesión`; «sin precio» y «no medido» aparecen tal cual, y sin la línea la celda es `—`
- AND el fichero lleva cabecera "AUTO-GENERADO — no editar a mano"

**MODIFIED — El log agrupa por release**
- GIVEN un `<docs>/changelog.md` con versiones `## [X.Y.Z] - AAAA-MM-DD` (o con `—`)
- WHEN se genera el log
- THEN aparece una tabla Release | Artefactos | Horas reales | Mediana | Sujetos ($) | Sesión ($), de la release más antigua a la más reciente
- AND `Sesión ($)` suma las cifras de los artefactos de la release que la tienen; sin ninguna, `—`
- AND cada artefacto va a la primera versión con fecha igual o posterior a la de su carpeta; los posteriores a la última versión van a «sin publicar», y los que no tienen fecha, a «sin fecha»
- AND sin `changelog.md`, o sin versiones con fecha, la tabla no aparece

## Enmiendas

## Aprobaciones

| Rol | Nombre | Fecha | Estado |
| --- | --- | --- | --- |
| dev-lead | Àngel Delgado | 2026-09-25 | aprobada por delegación: «Entera, spec por delegación» |
