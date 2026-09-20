---
id: <yyyyMMdd-HHmmss>-patch-<id>-<slug>
task: <id>            # id del gestor de tickets (0000 si no hay) · id de la secuencia del proyecto (ids.mode en sdd-kit.json)
parent: <id>          # solo si este patch nace de partir otro; la relación no va en el id (nunca sufijos 0006a)
title: Patch — <título corto>
type: patch
status: done
created: <YYYY-MM-DD>
branch: <feature|hotfix>/<id>   # el tipo de rama lo fija el git-flow del proyecto, no el carril
commit: <hash>        # se rellena al commitear
---

# Patch <id> — <título corto>

> Registro lightweight de un fix pequeño (<30 min, determinista, sin interpretación de
> requisitos). NO es una spec: no pasa por spec → plan → tasks → walkthrough. La trazabilidad
> vive aquí + una línea en el changelog (si existe) + la fila del roadmap; el diff exacto, en
> el commit. Si el fix toca una feature con walkthrough propio aún abierto, NO crear este doc:
> añadir un apéndice fechado "Post-release fixes" en ese walkthrough.
> Borra los bloques de ayuda (`>`) al redactar.

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

> Distinguir lo verificado por el agente de lo reportado por el usuario.

| # | Caso | Resultado |
| --- | --- | --- |
| 1 | reproducir el síntoma → ahora OK | ✅ / ❌ + nota |

## 5. Tiempo (ligero) *(si existe `.docs/sdd/estimation.md`)*

- Estimación: <Xh> (si la hubo)
- Real: <Yh>
