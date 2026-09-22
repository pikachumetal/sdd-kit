---
id: 20260922-153843-task-0010-token-cost
task: 0010
title: Estimación con tokens y modelos reales
mode: full
status: approved
created: 2026-09-22
author: agente
approvers:
  - role: dev-lead
    name: dev-lead
    approved_at: 2026-09-22
---

# Spec — Estimación con tokens y modelos reales

## Decisiones que he tomado yo — valida estas

Review de spec propuesta: ninguna. Señales: contrato público (el formato de la sección 2 del walkthrough y el de `estimation-log.md`) y `MODIFIED`. Son 2 de 8, por debajo del umbral.
- Opción mínima (ninguna): no la revisa nadie más que tú. Queda sin cubrir la tolerancia del parser a formas reales que yo no haya visto. La mitigan los fixtures del corpus.

1. **Cuatro líneas fijas en la sección 2 del walkthrough**, calcadas del «Contexto» de los tickets de campo, que es la forma que ya funciona (RED C1): `Modelo del hilo`, `Tokens del hilo`, `Tokens de subagentes` y `Coste de sujetos`. Cada una tiene su salida honesta: `no medido` para el hilo por defecto y `no aplica` cuando no hubo subagentes o sujetos.
2. **«Esfuerzo real» sigue siendo el reloj del hilo.** Los minutos de cada subagente van en su línea, no se suman. El RED lo mostró 2/2: sin sitio propio, los minutos de los subagentes se convirtieron en esfuerzo real.
3. **El log gana tres columnas**: `Hilo (tokens)`, `Subagentes (tokens)` y `Sujetos ($)`. Distinguen `no medido`, `no aplica` y `—`; el guion significa que el walkthrough es anterior y no tiene el campo. Los modelos se quedan en el walkthrough, no en el log: una columna de texto libre no se agrega y ensancharía la tabla.
4. **El script lee también las etiquetas antiguas** «Coste de subagentes» y «Coste de los sujetos headless». Cinco walkthroughs de la 1.2.0 recuperan su cifra de tokens sin reescribirlos, porque el cuerpo de un walkthrough cerrado no se reescribe. Del dinero, solo se lee el que va en su propia línea. Cuando va mezclado en la línea de tokens (0001, 0002 y 0004), sale `—`.
5. **La calibración de los tickets va a `estimation.md`**: una tabla de referencia por rol (tokens y minutos por despacho) y el coste por sujeto, con un turno y con varios turnos y simulador. También un aviso: la campaña de sujetos es la partida más variable (0012: RED de 29,8 $ frente a 5–7 $ estimados).
6. **Solo cambia la plantilla, no `sdd-end-task`.** El RED es un fallo de forma y la receta va en la plantilla (Art. II). Si el GREEN falla con la plantilla sola, subir la regla a `sdd-end-task` es un desvío y se trae como enmienda.
7. **Sin migración.** Los walkthroughs antiguos se quedan como están y el log los muestra con `—`. El proyecto consumidor no tiene nada que hacer.
8. **Entra un arreglo descubierto: `Get-NextSddId.ps1` con rutas no ASCII.** El pre-commit bloquea todo commit en este worktree porque 7 tests de `Get-NextSddId.Tests.ps1` fallan.
   - Causa raíz, reproducida: el script lee la salida de `git rev-parse --show-toplevel` con la codificación de consola por defecto. «Estimación» llega como «EstimaciÃ³n» y `Resolve-Path` falla.
   - Afecta a cualquier proyecto con tildes en la ruta.
   - Arreglo: leer la salida de git en UTF-8. Va con un test Pester sobre un repo temporal con tilde en el nombre y en un commit propio, separado del resto.
   - La alternativa es abrir un patch aparte con su id. Lo descarto porque ese patch tampoco podría commitearse desde aquí, y `--no-verify` no se usa nunca.

### Decisiones tomadas con el dev-lead

- Aprobación de la spec (2026-09-22) — «sí, apruebo la spec»
- Ejecución hasta el cierre sin paradas de método (2026-09-22) — «avanza hasta el end, que me voy con la bici»; la validación final se mantiene

## Intent

El walkthrough registra horas, pero no lo que la task costó en tokens ni en dinero, ni con qué modelos. Cuando se anota, cada task lo hace en una forma distinta (4 formas en 6 de 11 walkthroughs), y el log no lo recoge nunca. Con la visión 1.2.0 («menos ceremonia»), el coste por task se mide con estos datos, y hoy hay que ir a buscarlos a los tickets de campo. Se quiere que el walkthrough los tenga en huecos fijos, por separado y con «no medido» cuando no hay contador, y que el log los agregue.

## Scope

- Entra: sección 2 de `walkthrough-template.md`; `Build-EstimationLog.ps1` y sus tests Pester; `estimation.md` del kit (calibración y aviso); capacidad `estimation`; arreglo de `Get-NextSddId.ps1` con rutas no ASCII y su test (decisión 8).
- No entra:
  - Estimar el dinero en el plan y calcular un ratio en dólares: tocaría `plan-template.md`, fichero caliente de la 0006, la 0007, la 0021 y la 0022. Va a deuda.
  - El bloque de tiempo de `patch-template.md`: 1 de 5 patches de la release tuvo campaña.
  - `kit-feedback-template.md`, que ya tiene los huecos.
  - Reescribir walkthroughs cerrados.

## Approach

La receta vive en la plantilla, que es donde el ticket de campo ya demostró que funciona. El script lee etiquetas fijas con la misma tolerancia que ya aplica a las horas (negrita, `~`, `≈`, coma decimal) y añade `k`/`M` para los tokens y `$` para el dinero. La calibración de los 14 tickets se resume una vez en `estimation.md`; el log no la recalcula.

## Delta de comportamiento

### Capacidad: `estimation`

**MODIFIED — El estimation-log se genera desde los artefactos de cierre** (antes: "una fila por artefacto (fecha, task, tipo, estimado, real, ratio, carpeta)")

- GIVEN un proyecto con `.docs/sdd/estimation.md` y al menos un `walkthrough.md` o `patch.md` con bloque de tiempo
- WHEN se ejecuta `Build-EstimationLog.ps1 -Root <proyecto>`
- THEN `<docs>/estimation-log.md` se regenera entero con una fila por artefacto (fecha, task, tipo, estimado, real, ratio, tokens del hilo, tokens de subagentes, dinero de sujetos, carpeta), ordenado por carpeta
- AND el fichero lleva cabecera "AUTO-GENERADO — no editar a mano"

**ADDED — El coste del hilo, de los subagentes y de los sujetos se registra por separado**

- GIVEN un walkthrough cuya sección de tiempo tiene `Tokens del hilo: no medido`, `Tokens de subagentes: ~342k en 3 despachos — …` y `Coste de sujetos: 1,85 $ en 4 sujetos — …`
- WHEN se genera el log
- THEN la fila muestra `no medido` en hilo, `342k` en subagentes y `1.85` en sujetos
- AND una línea con `no aplica` se muestra `no aplica`, y un campo ausente (walkthrough anterior) se muestra `—`
- AND los tokens escritos como `1,23 M`, `≈ 355k` o `448k` se leen como 1230k, 355k y 448k
- AND la etiqueta antigua «Coste de subagentes» se lee como «Tokens de subagentes», y «Coste de los sujetos headless» como «Coste de sujetos»

**ADDED — El esfuerzo real es el reloj del hilo**

- GIVEN una task con subagentes cuyo walkthrough se escribe desde la plantilla
- WHEN el agente rellena la sección de tiempo
- THEN «Esfuerzo real» recoge el reloj del hilo, y los tokens y minutos de cada subagente van en «Tokens de subagentes», con su rol y su modelo
- AND «Modelo del hilo» y «Tokens del hilo» están rellenos: el segundo con `no medido` si nadie aportó la cifra

### Capacidad: `task-ids`

**ADDED — El id se calcula igual con una ruta no ASCII**

- GIVEN un proyecto en modo `sequence` cuyo repositorio vive en una ruta con caracteres no ASCII (`…/0010-Estimación-…`)
- WHEN se ejecuta `Get-NextSddId.ps1 -ProjectRoot <proyecto>` desde un proceso con la codificación de consola por defecto
- THEN devuelve el mismo id que con una ruta ASCII y sale con código 0

## Enmiendas

## Aprobaciones

| Rol | Nombre | Fecha | Estado |
| --- | --- | --- | --- |
| dev-lead | dev-lead | 2026-09-22 | aprobada |
