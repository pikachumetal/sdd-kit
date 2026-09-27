---
id: <yyyyMMdd-HHmmss>-patch-<id>-<slug>
task: <id>            # id del gestor de tickets (0000 si no hay) · id de la secuencia del proyecto (ids.mode en sdd-kit.json)
parent: <id>          # solo si este patch nace de partir otro; la relación no va en el id (nunca sufijos 0006a)
title: Patch — <título corto>
type: patch
status: done
created: <YYYY-MM-DD>
branch: <feature|hotfix>/<id>   # el tipo de rama lo fija el git-flow del proyecto, no el carril
commit: <hash>        # hash del commit del fix; se escribe en el commit de cierre
---

# Patch <id> — <título corto>

> Registro lightweight de un fix pequeño (<30 min, determinista, sin interpretación de
> requisitos). NO es una spec: no pasa por spec → plan → tasks → walkthrough. La trazabilidad
> vive aquí + una línea en el changelog (si existe) + la fila del roadmap; el diff exacto, en
> el commit. Si el fix toca una feature con walkthrough propio aún abierto, NO crear este doc:
> añadir un apéndice fechado "Post-release fixes" en ese walkthrough.
> Borra los bloques de ayuda (`>`) al redactar.

## Capacidades

> Se escribe al cerrar, tras listar `.docs/sdd/capabilities/`, con el nombre exacto de cada fichero (sin `.md`). Un patch no crea capacidades: no hay «Nuevas». Con delta, una línea por capacidad, y cada una tiene su subsección en «Delta de capacidad». Sin delta, una sola línea: «Ninguna, porque el fix devuelve `<comando>` a lo que ya dice `<nombre>`» o «Ninguna, porque ninguna capacidad describe `<pieza>`». Lo comprueba `Test-Capabilities.ps1` al cerrar.

- Modificadas: `<nombre>` — <qué requisito cambia>

## 1. Síntoma

Lo observado/reportado, literal. Error o traza recortada a lo relevante.

## 2. Causa raíz

> Resultado de `superpowers:systematic-debugging` (Fase 1). El **por qué** con su evidencia
> en el código, no solo el dónde. La hipótesis de quien reporta no es la causa hasta que la
> confirma la investigación.

## 3. Fix

- **Fichero(s)**: <rutas>
- **Cambio**: qué se cambió, 1-2 frases.

## 4. Verificación

> Distinguir lo verificado por el agente de lo reportado por el usuario. Debajo de la tabla, la
> validación del paso 0 de `sdd-end-patch`: `Validado: <fecha> · «<frase literal>»` o
> `Validación diferida: <fecha> · «<frase literal>» · disparador: <…>`.

| # | Caso | Resultado |
| --- | --- | --- |
| 1 | reproducir el síntoma → ahora OK | ✅ / ❌ + nota |

## 5. Tiempo (ligero) *(si existe `.docs/sdd/estimation.md`)*

- Estimación: <Xh> (si la hubo)
- Real: <Yh>

## 6. Delta de capacidad *(si existe `.docs/sdd/capabilities/` y el fix cambia lo que dice una capacidad)*

> Si el patch solo devuelve el comportamiento a lo que la capacidad ya decía, no hay delta: el bloque
> «Capacidades» lo dice con «Ninguna, porque el fix devuelve…» y esta sección se borra. Si no, misma forma que el delta de `spec-template.md`: el título del requisito es
> la clave de fusión, y un `MODIFIED` copia el bloque entero con el cambio. Lo fusiona `sdd-end-patch`.

### Capacidad: `<nombre>`

**MODIFIED — <título estable>**
- GIVEN <contexto>
- WHEN <acción>
- THEN <resultado actualizado>
