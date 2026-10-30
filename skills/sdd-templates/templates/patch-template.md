---
id: <yyyyMMdd-HHmmss>-patch-<id>-<slug>
task: <id>            # id del gestor de tickets (0000 si no hay) · id de la secuencia del proyecto (ids.mode en sdd-kit.json)
parent: <id>          # solo si este patch nace de partir otro; la relación no va en el id (nunca sufijos 0006a)
title: Patch — <título corto>
type: patch
solution: <causa raíz | ticket | dev-lead>   # quién fijó la solución; si la fijarías tú, no es patch
status: done
created: <YYYY-MM-DD>
branch: <feature|hotfix>/<id>   # el tipo de rama lo fija el git-flow del proyecto, no el carril
commit: <hash>        # hash del commit del fix; se escribe en el commit de cierre
---

# Patch <id> — <título corto>

> Registro lightweight de un cambio pequeño con la solución ya fijada: un fallo determinista
> (la causa raíz), un ajuste o una retirada solo de presentación (la petición) o una petición
> cerrada (el ticket o el dev-lead). NO es una spec: no pasa por spec → plan → tasks → walkthrough. La trazabilidad
> vive aquí + una línea en el changelog (si existe) + la fila del roadmap; el diff exacto, en
> el commit. Si el fix toca una feature con walkthrough propio aún abierto, NO crear este doc:
> añadir un apéndice fechado "Post-release fixes" en ese walkthrough.
> Borra los bloques de ayuda (`>`) al redactar.

Validación: <dev-lead | agente, «<frase literal del dev-lead>»> — <porqué>

> `agente` solo si un humano no observaría nada que el agente no haya medido ya, y con la frase literal del dev-lead en la petición o en la pregunta del carril; sin ella, o en duda, `dev-lead`.

## Capacidades

> Se escribe al cerrar, con la salida de `sdd capability index` y el nombre exacto de cada capacidad. Un patch no crea capacidades: no hay «Nuevas». Con delta, una línea por capacidad, y cada una tiene su subsección en «Delta de capacidad». Sin delta, una sola línea: «Ninguna, porque el fix devuelve `<comando>` a lo que ya dice `<nombre>`» o «Ninguna, porque ninguna capacidad describe `<pieza>`». Lo comprueba `sdd capability check` al cerrar.

- Modificadas: `<nombre>` — <qué requisito cambia>

## 1. Síntoma

Lo observado/reportado, literal. Error o traza recortada a lo relevante.

## 2. Causa raíz (o intención, en un ajuste visual; o solución fijada, en una petición cerrada)

> Resultado de `sdd-debugging` (Fase 1). El **por qué** con su evidencia
> en el código, no solo el dónde. La hipótesis de quien reporta no es la causa hasta que la
> confirma la investigación.
> En un ajuste solo de presentación no hay causa: la intención en una frase, sacada de la
> petición («Guardar y Cancelar pasan de la cabecera a una columna derecha en `pedido-detalle`
> y `albaran-detalle`»).
> En una petición cerrada tampoco: la solución fijada, con la frase literal del ticket o del
> dev-lead y su autor, y lo que da por existente, comprobado.

## 3. Fix

- **Fichero(s)**: <rutas>
- **Cambio**: qué se cambió, 1-2 frases.
- **Decisiones** *(omite si no hubo)*: una por línea, con su autor.
  - <decisión> — <ticket | dev-lead | sin el dev-lead>
- **Retirado** *(solo en una retirada)*: <cada elemento y lo que quedó muerto con él> · Lo que el usuario deja de poder hacer: <una línea, o «nada»>

> Una decisión sobre lo que el usuario ve o puede hacer con autor `sin el dev-lead` no cabe en
> un patch: es feature.

## 4. Verificación

> Distinguir lo verificado por el agente de lo reportado por el usuario. Debajo de la tabla, la
> validación de `sdd-archive`: `Validado: <fecha> · «<frase literal>»`,
> `Validación diferida: <fecha> · «<frase literal>» · disparador: <…>` o, con `validation.mode: field`,
> `Validación en campo: <fecha> · <verificación del agente, p. ej. «npm test 12/12 · smoke 3/3 casos»>` o,
> con `Validación: agente`, `Validación por el agente: <fecha> · <evidencia>`.
> Encima, la línea del gate de cierre: `` Gate: `<suite unitaria, si «Suites» la declara>` · `<comando>` → <suite>: corrió <N>/<M> · <tarea>: corrió <N>/<M> (sin filtro: cambia el build, si la rama toca «Sin filtro») · <tarea>: saltada (<porqué de la herramienta>) `` (sin tareas, `→ <N>/<M>`).

| # | Caso | Resultado |
| --- | --- | --- |
| 1 | reproducir el síntoma → ahora OK | ✅ / ❌ + nota |
| 1 | *(ajuste visual)* captura de `<pantalla>` en `<navegador>`, antes y después del cambio | `<rutas de las capturas, fuera de git>` · enseñadas en la validación |
| 2 | *(ajuste visual)* detector de `§Frontend` en `<viewports>` | `<hallazgos: resueltos · justificados>` · o «composición no medida» |

## 5. Tiempo (ligero) *(si existe `.docs/sdd/estimation.md`)*

- Estimación: <Xh, la de la pregunta del carril de `sdd-propose`, escrita antes del fix; si llega en el commit de cierre, `<Xh> (post hoc)`: no calibra>
- Inicio: <hora UTC en que se abrió el patch, p. ej. 2026-10-09T11:20Z>
- Esfuerzo real: <la línea de `sdd session tokens --path <worktree> --branch <rama>`, pegada tal cual: cuenta desde el arranque de la sesión que abrió el trabajo, con la investigación previa, y sin las esperas al dev-lead | fuera de Claude Code, `<Yh>, aproximado con las marcas de los commits`>
- Coste de sujetos: <X> $ en <n> sujetos <modelo> — <campaña> <X> $; … | no aplica

## 6. Delta de capacidad *(si existe `.docs/sdd/capabilities/` y el fix cambia lo que dice una capacidad)*

> Si el patch solo devuelve el comportamiento a lo que la capacidad ya decía, no hay delta: el bloque
> «Capacidades» lo dice con «Ninguna, porque el fix devuelve…» y esta sección se borra. Si no, misma forma que el delta de `spec-template.md`: el título del requisito es
> la clave de fusión, y un `MODIFIED` copia el bloque entero con el cambio. Lo fusiona `sdd-archive`.
> Quitar un `- AND` o `- THEN` del vivo: `- REMOVED AND <texto literal>`.

### Capacidad: `<nombre>`

#### MODIFIED — <título estable>

- GIVEN <contexto>
- WHEN <acción>
- THEN <resultado actualizado>
